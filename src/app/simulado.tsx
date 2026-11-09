import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  where,
  writeBatch,
} from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../contexts/theme_context";
import { auth, db } from "../utils/FirebaseConfig";
import MeuSimulado from "./componentes/MeuSimulado";

const COLECAO_QUESTOES = "Questao";
const COLECAO_CONTEUDOS = "Conteudo";

const ASSUNTOS = [
  "Análise Combinatória",
  "Binômio de Newton",
  "Cônicas",
  "Conjuntos",
  "Determinantes",
  "Equações Algébricas",
  "Estatística",
  "Função Afim",
  "Função Exponencial",
  "Função Quadrática",
  "Funções",
  "Geometria Analítica",
  "Geometria de Posição",
  "Geometria Espacial",
  "Geometria Plana",
  "Logaritmo",
  "Matemática Básica",
  "Matemática Comercial e Financeira",
  "Matrizes",
  "Módulo",
  "Números complexos",
  "Polinômios",
  "Probabilidade",
  "Progressões - PA e PG",
  "Sistemas Lineares",
  "Trigonometria",
];

type Aba = "criar" | "meus";
type QuestaoSelecionada = { id: string; assunto: string; ordem: number };

function textoBusca(valor: string): string {
  return valor.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function embaralhar<T>(original: T[]): T[] {
  const itens = [...original];
  for (let i = itens.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [itens[i], itens[j]] = [itens[j], itens[i]];
  }
  return itens;
}

export default function Simulado() {
  const router = useRouter();
  const { cores } = useTheme();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ aba?: string }>();
  const [aba, setAba] = useState<Aba>(params.aba === "meus" ? "meus" : "criar");

  useEffect(() => {
    if (params.aba === "meus") setAba("meus");
  }, [params.aba]);

  const [painelAberto, setPainelAberto] = useState(false);
  const [busca, setBusca] = useState("");
  const [selecionados, setSelecionados] = useState<string[]>([]);
  const [numeroQuestoes, setNumeroQuestoes] = useState("20");
  const [tempoLimite, setTempoLimite] = useState("60");
  const [gerando, setGerando] = useState(false);

  const assuntosFiltrados = useMemo(
    () => ASSUNTOS.filter((nome) => textoBusca(nome).includes(textoBusca(busca))),
    [busca]
  );

  const previsao = useMemo(() => {
    const total = Number(numeroQuestoes);
    if (!Number.isInteger(total) || total <= 0 || selecionados.length === 0) return [];
    const porAssunto = Math.floor(total / selecionados.length);
    const sobra = total % selecionados.length;
    return selecionados.map((nome, index) => ({
      nome,
      quantidade: porAssunto + (index < sobra ? 1 : 0),
    }));
  }, [numeroQuestoes, selecionados]);

  function alternarAssunto(nome: string) {
    setSelecionados((atual) =>
      atual.includes(nome) ? atual.filter((item) => item !== nome) : [...atual, nome]
    );
  }

  async function buscarQuestoesDoAssunto(assunto: string) {
    const conteudosSnap = await getDocs(collection(db, COLECAO_CONTEUDOS));
    const docConteudo = conteudosSnap.docs.find((d) => {
      const nome = String(d.data().nome ?? "");
      return textoBusca(nome) === textoBusca(assunto);
    });

    if (!docConteudo) return [];

    const idConteudo = docConteudo.id;

    let docs = (
      await getDocs(
        query(
          collection(db, COLECAO_QUESTOES),
          where("id_conteudo", "==", idConteudo)
        )
      )
    ).docs;

    if (docs.length === 0 && Number.isFinite(Number(idConteudo))) {
      docs = (
        await getDocs(
          query(
            collection(db, COLECAO_QUESTOES),
            where("id_conteudo", "==", Number(idConteudo))
          )
        )
      ).docs;
    }

    return docs;
  }

  async function gerarSimulado() {
    if (gerando) return;
    const usuario = auth.currentUser;
    if (!usuario) {
      Alert.alert("Login necessário", "Entre na sua conta para gerar um simulado.");
      return;
    }
    if (selecionados.length === 0) {
      Alert.alert("Selecione assuntos", "Escolha pelo menos um conteúdo.");
      return;
    }

    const quantidade = Number(numeroQuestoes);
    const tempo = Number(tempoLimite);
    if (!Number.isSafeInteger(quantidade) || quantidade < 1 || quantidade > 100) {
      Alert.alert("Quantidade inválida", "Escolha de 1 a 100 questões.");
      return;
    }
    if (!Number.isSafeInteger(tempo) || tempo <= 0) {
      Alert.alert("Tempo inválido", "Informe o tempo em minutos.");
      return;
    }

    setGerando(true);
    try {
      const grupos = await Promise.all(
        selecionados.map(async (assunto) => {
          const docs = await buscarQuestoesDoAssunto(assunto);

          const validos = docs.filter((d) => {
            const q = d.data();
            return (
              typeof q.enunciado === "string" &&
              q.enunciado.trim().length > 0 &&
              Array.isArray(q.alternativas) &&
              q.alternativas.length > 0 &&
              typeof q.respostaCorreta === "string"
            );
          });

          return {
            assunto,
            ids: embaralhar(validos.map((d) => d.id)),
            usadas: 0,
          };
        })
      );

      const idsUnicos = new Set<string>();
      for (const grupo of grupos) {
        grupo.ids = grupo.ids.filter((id) => {
          if (idsUnicos.has(id)) return false;
          idsUnicos.add(id);
          return true;
        });
      }

      const totalDisponivel = grupos.reduce((t, g) => t + g.ids.length, 0);
      if (totalDisponivel === 0) {
        Alert.alert(
          "Nenhuma questão disponível",
          "Não foram encontradas questões válidas para os assuntos selecionados."
        );
        return;
      }

      const quantidadeFinal = Math.min(quantidade, totalDisponivel);
      const escolhidas: Array<{ id: string; assunto: string }> = [];
      while (escolhidas.length < quantidadeFinal) {
        const disponiveis = grupos.filter((g) => g.ids.length > 0);
        if (disponiveis.length === 0) break;
        const menorUso = Math.min(...disponiveis.map((g) => g.usadas));
        const candidatos = disponiveis.filter((g) => g.usadas === menorUso);
        const grupo = candidatos[Math.floor(Math.random() * candidatos.length)];
        const id = grupo.ids.pop();
        if (!id) break;
        grupo.usadas += 1;
        escolhidas.push({ id, assunto: grupo.assunto });
      }

      const questoes: QuestaoSelecionada[] = embaralhar(escolhidas).map((q, i) => ({
        ...q,
        ordem: i + 1,
      }));

      const distribuicao = grupos.map(({ assunto, usadas }) => ({
        assunto,
        quantidade: usadas,
      }));

      const nome =
        selecionados.length === 1
          ? `Simulado de ${selecionados[0]}`
          : selecionados.length === 2
          ? `Simulado de ${selecionados.join(" e ")}`
          : `Simulado de Matemática - ${selecionados.length} assuntos`;

      const simuladoRef = doc(collection(db, "simulados"));
      const tentativaRef = doc(collection(db, "tentativas_simulado"));
      const batch = writeBatch(db);

      batch.set(simuladoRef, {
        criador_id: usuario.uid,
        nome,
        assuntos_nomes: selecionados,
        quantidade_questoes: quantidadeFinal,
        tempo_minutos: tempo,
        questoes_ids: questoes.map((q) => q.id),
        questoes,
        distribuicao,
        status: "pronto",
        criado_em: serverTimestamp(),
      });

      batch.set(tentativaRef, {
        usuario_id: usuario.uid,
        simulado_id: simuladoRef.id,
        nome_simulado: nome,
        quantidade_questoes: quantidadeFinal,
        tempo_minutos: tempo,
        status: "nao_iniciado",
        acertos: 0,
        respondidas: 0,
        ids_respondidos: [],
        indice_atual: 0,
        iniciado_em: null,
        finalizado_em: null,
        criado_em: serverTimestamp(),
      });

      await batch.commit();

      Alert.alert("Simulado criado!", `${quantidadeFinal} questões selecionadas.`, [
        {
          text: "Meus simulados",
          onPress: () => {
            setPainelAberto(false);
            setAba("meus");
          },
        },
        {
          text: "Responder agora",
          onPress: () =>
            router.push({
              pathname: "/QuestoesBase/[id]",
              params: { id: questoes[0].id, tentativaId: tentativaRef.id },
            }),
        },
      ]);
    } catch (error) {
      Alert.alert(
        "Não foi possível gerar",
        error instanceof Error ? error.message : "Verifique a conexão."
      );
    } finally {
      setGerando(false);
    }
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: cores.fundo }]} edges={["top", "left", "right"]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Pressable
              style={[styles.botaoVoltar, { backgroundColor: cores.card }]}
              onPress={() =>
                router.canGoBack() ? router.back() : router.replace("/home")
              }
            >
              <Ionicons name="arrow-back" size={22} color={cores.azul} />
            </Pressable>
            <Text style={[styles.titulo, { color: cores.texto }]}>Simulados</Text>
          </View>
          <Text style={[styles.subtitulo, { color: cores.textoSuave }]}>
            Prepare seu simulado de matemática
          </Text>
        </View>

        <View style={[styles.abas, { backgroundColor: cores.card }]}>
          <Pressable
            style={[styles.aba, aba === "criar" && { backgroundColor: cores.cardSecundario }]}
            onPress={() => setAba("criar")}
          >
            <Ionicons
              name="add-circle-outline"
              size={19}
              color={aba === "criar" ? cores.laranja : cores.textoSuave}
            />
            <Text style={[styles.textoAba, { color: aba === "criar" ? cores.laranja : cores.textoSuave }]}>
              Criar simulado
            </Text>
          </Pressable>
          <Pressable
            style={[styles.aba, aba === "meus" && { backgroundColor: cores.cardSecundario }]}
            onPress={() => setAba("meus")}
          >
            <Ionicons
              name="folder-open-outline"
              size={19}
              color={aba === "meus" ? cores.laranja : cores.textoSuave}
            />
            <Text style={[styles.textoAba, { color: aba === "meus" ? cores.laranja : cores.textoSuave }]}>
              Meus simulados
            </Text>
          </Pressable>
        </View>

        {aba === "criar" ? (
          <View style={[styles.card, { backgroundColor: cores.card }]}>
            <Text style={[styles.tituloCartao, { color: cores.texto }]}>Novo simulado</Text>
            <Text style={[styles.descricaoCartao, { color: cores.textoSuave }]}>
              Escolha os assuntos, a quantidade e o tempo.
            </Text>

            <Text style={[styles.label, { color: cores.texto }]}>Assuntos</Text>
            <Pressable
              style={[styles.seletor, { backgroundColor: cores.cardSecundario, borderColor: cores.laranja }]}
              onPress={() => setPainelAberto((v) => !v)}
            >
              <View style={styles.linhaSeletor}>
                <View style={[styles.iconeCirculo, { backgroundColor: cores.cardSecundario }]}>
                  <Ionicons name="library-outline" size={20} color={cores.azul} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.textoSeletor, { color: cores.laranja }]}>Selecionar assuntos</Text>
                  <Text style={[styles.textoPequeno, { color: cores.textoSuave }]}>
                    {selecionados.length === 0
                      ? `${ASSUNTOS.length} conteúdos disponíveis`
                      : `${selecionados.length} de ${ASSUNTOS.length} selecionados`}
                  </Text>
                </View>
              </View>
              <Ionicons
                name={painelAberto ? "chevron-up" : "chevron-down"}
                size={20}
                color={cores.azul}
              />
            </Pressable>

            {painelAberto && (
              <View style={[styles.painel, { backgroundColor: cores.card, borderColor: cores.borda }]}>
                <TextInput
                  style={[styles.busca, { backgroundColor: cores.fundo, borderColor: cores.borda, color: cores.texto }]}
                  placeholder="Buscar assunto..."
                  placeholderTextColor={cores.textoSuave}
                  value={busca}
                  onChangeText={setBusca}
                />
                <View style={styles.acoes}>
                  <Text style={[styles.textoPequeno, { color: cores.textoSuave }]}>
                    {selecionados.length} selecionado(s)
                  </Text>
                  <Pressable onPress={() => setSelecionados([...ASSUNTOS])}>
                    <Text style={[styles.link, { color: cores.laranja }]}>Selecionar todos</Text>
                  </Pressable>
                  <Pressable onPress={() => setSelecionados([])}>
                    <Text style={[styles.link, { color: cores.laranja }]}>Limpar</Text>
                  </Pressable>
                </View>
                <View style={styles.grade}>
                  {assuntosFiltrados.map((nome) => {
                    const marcado = selecionados.includes(nome);
                    return (
                      <Pressable
                        key={nome}
                        style={[
                          styles.itemAssunto,
                          { backgroundColor: cores.fundo, borderColor: cores.borda },
                          marcado && { backgroundColor: cores.cardSecundario, borderColor: cores.laranja },
                        ]}
                        onPress={() => alternarAssunto(nome)}
                      >
                        <Ionicons
                          name={marcado ? "checkbox" : "square-outline"}
                          size={19}
                          color={marcado ? cores.laranja : cores.textoSuave}
                        />
                        <Text style={[styles.textoAssunto, { color: cores.texto }]}>{nome}</Text>
                      </Pressable>
                    );
                  })}
                </View>
                <Pressable style={[styles.confirmar, { backgroundColor: cores.laranja }]} onPress={() => setPainelAberto(false)}>
                  <Text style={styles.textoConfirmar}>Confirmar seleção</Text>
                </Pressable>
              </View>
            )}

            <View style={styles.campos}>
              <View style={styles.campo}>
                <Text style={[styles.labelCampo, { color: cores.texto }]}>Número de questões</Text>
                <TextInput
                  value={numeroQuestoes}
                  onChangeText={setNumeroQuestoes}
                  keyboardType="number-pad"
                  selectionColor={cores.laranja}
                  style={[
                    styles.inputNumerico,
                    { backgroundColor: cores.cardSecundario, borderColor: cores.laranja, color: cores.texto },
                  ]}
                />
              </View>
              <View style={styles.campo}>
                <Text style={[styles.labelCampo, { color: cores.texto }]}>Tempo (min)</Text>
                <TextInput
                  value={tempoLimite}
                  onChangeText={setTempoLimite}
                  keyboardType="number-pad"
                  selectionColor={cores.laranja}
                  style={[
                    styles.inputNumerico,
                    { backgroundColor: cores.cardSecundario, borderColor: cores.laranja, color: cores.texto },
                  ]}
                />
              </View>
            </View>

            {previsao.length > 0 && (
              <View style={[styles.previa, { backgroundColor: cores.card, borderColor: cores.borda }]}>
                <View style={styles.cabecalhoPrevia}>
                  <Text style={[styles.tituloPrevia, { color: cores.texto }]}>Distribuição prevista</Text>
                  <Text style={[styles.totalPrevia, { color: cores.laranja }]}>{numeroQuestoes} questões</Text>
                </View>
                {previsao.slice(0, 5).map((item) => (
                  <View key={item.nome} style={[styles.linhaPrevia, { borderBottomColor: cores.borda }]}>
                    <Text style={[styles.nomePrevia, { color: cores.texto }]}>{item.nome}</Text>
                    <Text style={[styles.qtdPrevia, { color: cores.laranja }]}>{item.quantidade}</Text>
                  </View>
                ))}
                {previsao.length > 5 && (
                  <Text style={[styles.textoPequeno, { color: cores.textoSuave }]}>
                    E mais {previsao.length - 5} assunto(s).
                  </Text>
                )}
              </View>
            )}

            <Pressable
              style={[styles.botaoGerar, { backgroundColor: cores.laranja }, gerando && styles.botaoDesabilitado]}
              onPress={gerarSimulado}
              disabled={gerando}
            >
              {gerando ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Ionicons name="create-outline" size={20} color="#fff" />
              )}
              <Text style={styles.textoGerar}>
                {gerando ? "Gerando..." : "Gerar simulado"}
              </Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.areaHistorico}>
            <MeuSimulado />
          </View>
        )}
      </ScrollView>

      <View
        style={[
          styles.barraInferior,
          {
            backgroundColor: cores.card,
            borderTopColor: cores.borda,
            paddingBottom: insets.bottom + 10,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.barraItem}
          onPress={() => router.replace("/home")}
        >
          <Ionicons name="home" size={24} color={cores.textoSuave} />
          <Text style={[styles.barraLabel, { color: cores.textoSuave }]}>Início</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.barraItem}
          onPress={() => router.replace("/simulado")}
        >
          <MaterialCommunityIcons name="podium-gold" size={26} color={cores.laranja} />
          <Text style={[styles.barraLabel, { color: cores.laranja, fontWeight: "700" }]}>
            Simulados
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.barraItem}
          onPress={() => router.replace("/perfil")}
        >
          <Ionicons name="person" size={24} color={cores.textoSuave} />
          <Text style={[styles.barraLabel, { color: cores.textoSuave }]}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: 20, paddingBottom: 24 },
  header: { marginBottom: 18 },
  headerTop: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  botaoVoltar: {
    width: 38, height: 38, borderRadius: 12,
    alignItems: "center", justifyContent: "center", marginRight: 10,
    shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 }, elevation: 2,
  },
  titulo: { fontSize: 26, fontWeight: "800" },
  subtitulo: { fontSize: 13, paddingLeft: 48 },
  abas: {
    flexDirection: "row", borderRadius: 14, padding: 5, marginBottom: 16,
    shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 }, elevation: 3,
  },
  aba: { flex: 1, minHeight: 46, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, borderRadius: 10 },
  textoAba: { fontSize: 12, fontWeight: "700" },
  card: {
    borderRadius: 18, padding: 18, marginBottom: 16,
    shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 }, elevation: 3,
  },
  tituloCartao: { fontSize: 20, fontWeight: "800", textAlign: "center" },
  descricaoCartao: { marginTop: 6, fontSize: 13, textAlign: "center", marginBottom: 22 },
  label: { fontSize: 16, fontWeight: "800", marginBottom: 10 },
  seletor: { padding: 13, borderWidth: 1.5, borderRadius: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  linhaSeletor: { flex: 1, flexDirection: "row", gap: 10, alignItems: "center" },
  iconeCirculo: { width: 38, height: 38, borderRadius: 19, alignItems: "center", justifyContent: "center" },
  textoSeletor: { fontSize: 14, fontWeight: "800" },
  textoPequeno: { fontSize: 11, marginTop: 3 },
  painel: { marginTop: 10, borderRadius: 12, padding: 10, borderWidth: 1 },
  busca: { borderWidth: 1, borderRadius: 10, padding: 10, fontSize: 14, marginBottom: 11 },
  acoes: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 8, marginBottom: 12 },
  link: { fontSize: 12, fontWeight: "800" },
  grade: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  itemAssunto: { width: "48.5%", minHeight: 58, marginBottom: 9, flexDirection: "row", alignItems: "center", gap: 7, padding: 9, borderWidth: 1, borderRadius: 10 },
  textoAssunto: { flex: 1, fontSize: 12, fontWeight: "600" },
  confirmar: { marginTop: 7, alignItems: "center", justifyContent: "center", paddingVertical: 13, borderRadius: 10 },
  textoConfirmar: { color: "#fff", fontWeight: "800", fontSize: 14 },
  campos: { flexDirection: "row", marginTop: 22, gap: 12 },
  campo: { flex: 1 },
  labelCampo: { textAlign: "center", marginBottom: 9, fontSize: 13, fontWeight: "800" },
  inputNumerico: { height: 52, borderRadius: 10, borderWidth: 1.5, textAlign: "center", fontSize: 19, fontWeight: "800" },
  previa: { borderWidth: 1, borderRadius: 12, padding: 12, marginTop: 20 },
  cabecalhoPrevia: { flexDirection: "row", justifyContent: "space-between", gap: 8, marginBottom: 10, alignItems: "center" },
  tituloPrevia: { flex: 1, fontSize: 14, fontWeight: "800" },
  totalPrevia: { fontSize: 11, fontWeight: "800" },
  linhaPrevia: { flexDirection: "row", justifyContent: "space-between", gap: 12, borderBottomWidth: 1, paddingVertical: 8 },
  nomePrevia: { flex: 1, fontSize: 12 },
  qtdPrevia: { fontSize: 12, fontWeight: "800" },
  botaoGerar: { borderRadius: 12, paddingVertical: 15, marginTop: 20, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 9, shadowColor: "#F97316", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 7, elevation: 3 },
  botaoDesabilitado: { opacity: 0.6 },
  textoGerar: { color: "#fff", fontSize: 15, fontWeight: "800" },
  areaHistorico: { width: "100%" },
  barraInferior: { flexDirection: "row", borderTopWidth: 1, paddingTop: 10, paddingHorizontal: 12, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: -2 }, elevation: 8 },
  barraItem: { flex: 1, alignItems: "center", justifyContent: "center", paddingVertical: 4 },
  barraLabel: { fontSize: 11, marginTop: 3, fontWeight: "600" },
});