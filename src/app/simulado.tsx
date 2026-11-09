// app/simulado.tsx
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
import { auth, db } from "../utils/FirebaseConfig";
import MeuSimulado from "./componentes/MeuSimulado";

const COLECAO_QUESTOES = "Questao";
const COLECAO_CONTEUDOS = "Conteudo";

const AZUL = "#1E3A8A";
const LARANJA = "#F97316";
const CINZA_BG = "#F5F6FA";
const CINZA_BORDA = "#E5E7EB";

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

  /**
   * Busca as questões de um assunto.
   * - Conteudo tem Document ID = id_conteudo usado nas questões.
   * - O campo "nome" em Conteudo é o nome do assunto.
   * - Questao tem o campo "id_conteudo" com esse mesmo valor.
   */
  async function buscarQuestoesDoAssunto(assunto: string) {
    const conteudosSnap = await getDocs(collection(db, COLECAO_CONTEUDOS));
    const docConteudo = conteudosSnap.docs.find((d) => {
      const nome = String(d.data().nome ?? "");
      return textoBusca(nome) === textoBusca(assunto);
    });

    if (!docConteudo) {
      console.log(`[SIMULADO] Conteúdo "${assunto}" não encontrado.`);
      return [];
    }

    const idConteudo = docConteudo.id;
    console.log(`[SIMULADO] Assunto "${assunto}" → id_conteudo = "${idConteudo}"`);

    // Tenta string primeiro
    let docs = (
      await getDocs(
        query(
          collection(db, COLECAO_QUESTOES),
          where("id_conteudo", "==", idConteudo)
        )
      )
    ).docs;

    // Se não encontrou, tenta número
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

    console.log(
      `[SIMULADO] Assunto "${assunto}" → ${docs.length} questões encontradas.`
    );
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

      // Remove IDs duplicados entre grupos
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

      // Seleciona de forma balanceada
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
      console.error("Erro ao gerar simulado:", error);
      Alert.alert(
        "Não foi possível gerar",
        error instanceof Error ? error.message : "Verifique a conexão."
      );
    } finally {
      setGerando(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Pressable
              style={styles.botaoVoltar}
              onPress={() =>
                router.canGoBack() ? router.back() : router.replace("/home")
              }
            >
              <Ionicons name="arrow-back" size={22} color={AZUL} />
            </Pressable>
            <Text style={styles.titulo}>Simulados</Text>
          </View>
          <Text style={styles.subtitulo}>Prepare seu simulado de matemática</Text>
        </View>

        <View style={styles.abas}>
          <Pressable
            style={[styles.aba, aba === "criar" && styles.abaAtiva]}
            onPress={() => setAba("criar")}
          >
            <Ionicons
              name="add-circle-outline"
              size={19}
              color={aba === "criar" ? LARANJA : "#6B7280"}
            />
            <Text style={[styles.textoAba, aba === "criar" && styles.textoAbaAtiva]}>
              Criar simulado
            </Text>
          </Pressable>
          <Pressable
            style={[styles.aba, aba === "meus" && styles.abaAtiva]}
            onPress={() => setAba("meus")}
          >
            <Ionicons
              name="folder-open-outline"
              size={19}
              color={aba === "meus" ? LARANJA : "#6B7280"}
            />
            <Text style={[styles.textoAba, aba === "meus" && styles.textoAbaAtiva]}>
              Meus simulados
            </Text>
          </Pressable>
        </View>

        {aba === "criar" ? (
          <View style={styles.card}>
            <Text style={styles.tituloCartao}>Novo simulado</Text>
            <Text style={styles.descricaoCartao}>
              Escolha os assuntos, a quantidade e o tempo.
            </Text>

            <Text style={styles.label}>Assuntos</Text>
            <Pressable style={styles.seletor} onPress={() => setPainelAberto((v) => !v)}>
              <View style={styles.linhaSeletor}>
                <View style={styles.iconeCirculo}>
                  <Ionicons name="library-outline" size={20} color={AZUL} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.textoSeletor}>Selecionar assuntos</Text>
                  <Text style={styles.textoPequeno}>
                    {selecionados.length === 0
                      ? `${ASSUNTOS.length} conteúdos disponíveis`
                      : `${selecionados.length} de ${ASSUNTOS.length} selecionados`}
                  </Text>
                </View>
              </View>
              <Ionicons
                name={painelAberto ? "chevron-up" : "chevron-down"}
                size={20}
                color={AZUL}
              />
            </Pressable>

            {painelAberto && (
              <View style={styles.painel}>
                <TextInput
                  style={styles.busca}
                  placeholder="Buscar assunto..."
                  placeholderTextColor="#9CA3AF"
                  value={busca}
                  onChangeText={setBusca}
                />
                <View style={styles.acoes}>
                  <Text style={styles.textoPequeno}>
                    {selecionados.length} selecionado(s)
                  </Text>
                  <Pressable onPress={() => setSelecionados([...ASSUNTOS])}>
                    <Text style={styles.link}>Selecionar todos</Text>
                  </Pressable>
                  <Pressable onPress={() => setSelecionados([])}>
                    <Text style={styles.link}>Limpar</Text>
                  </Pressable>
                </View>
                <View style={styles.grade}>
                  {assuntosFiltrados.map((nome) => {
                    const marcado = selecionados.includes(nome);
                    return (
                      <Pressable
                        key={nome}
                        style={[styles.itemAssunto, marcado && styles.itemSelecionado]}
                        onPress={() => alternarAssunto(nome)}
                      >
                        <Ionicons
                          name={marcado ? "checkbox" : "square-outline"}
                          size={19}
                          color={marcado ? LARANJA : "#6B7280"}
                        />
                        <Text style={styles.textoAssunto}>{nome}</Text>
                      </Pressable>
                    );
                  })}
                </View>
                <Pressable style={styles.confirmar} onPress={() => setPainelAberto(false)}>
                  <Text style={styles.textoConfirmar}>Confirmar seleção</Text>
                </Pressable>
              </View>
            )}

            <View style={styles.campos}>
              <View style={styles.campo}>
                <Text style={styles.labelCampo}>Número de questões</Text>
                <TextInput
                  value={numeroQuestoes}
                  onChangeText={setNumeroQuestoes}
                  keyboardType="number-pad"
                  selectionColor={LARANJA}
                  style={styles.inputNumerico}
                />
              </View>
              <View style={styles.campo}>
                <Text style={styles.labelCampo}>Tempo (min)</Text>
                <TextInput
                  value={tempoLimite}
                  onChangeText={setTempoLimite}
                  keyboardType="number-pad"
                  selectionColor={LARANJA}
                  style={styles.inputNumerico}
                />
              </View>
            </View>

            {previsao.length > 0 && (
              <View style={styles.previa}>
                <View style={styles.cabecalhoPrevia}>
                  <Text style={styles.tituloPrevia}>Distribuição prevista</Text>
                  <Text style={styles.totalPrevia}>{numeroQuestoes} questões</Text>
                </View>
                {previsao.slice(0, 5).map((item) => (
                  <View key={item.nome} style={styles.linhaPrevia}>
                    <Text style={styles.nomePrevia}>{item.nome}</Text>
                    <Text style={styles.qtdPrevia}>{item.quantidade}</Text>
                  </View>
                ))}
                {previsao.length > 5 && (
                  <Text style={styles.textoPequeno}>
                    E mais {previsao.length - 5} assunto(s).
                  </Text>
                )}
              </View>
            )}

            <Pressable
              style={[styles.botaoGerar, gerando && styles.botaoDesabilitado]}
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

      <View style={[styles.barraInferior, { paddingBottom: insets.bottom + 10 }]}>
        <TouchableOpacity
          style={styles.barraItem}
          onPress={() => router.replace("/home")}
        >
          <Ionicons name="home" size={24} color="#9CA3AF" />
          <Text style={styles.barraLabel}>Início</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.barraItem}
          onPress={() => router.replace("/simulado")}
        >
          <MaterialCommunityIcons name="podium-gold" size={26} color={LARANJA} />
          <Text style={[styles.barraLabel, { color: LARANJA, fontWeight: "700" }]}>
            Simulados
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.barraItem}
          onPress={() => router.replace("/perfil")}
        >
          <Ionicons name="person" size={24} color="#9CA3AF" />
          <Text style={styles.barraLabel}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: CINZA_BG },
  scroll: { padding: 20, paddingBottom: 24 },

  header: { marginBottom: 18 },
  headerTop: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  botaoVoltar: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  titulo: { fontSize: 26, fontWeight: "800", color: AZUL },
  subtitulo: { fontSize: 13, color: "#6B7280", paddingLeft: 48 },

  abas: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 5,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  aba: {
    flex: 1,
    minHeight: 46,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderRadius: 10,
  },
  abaAtiva: { backgroundColor: "#FFEDD5" },
  textoAba: { fontSize: 12, fontWeight: "700", color: "#6B7280" },
  textoAbaAtiva: { color: "#C2410C" },

  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  tituloCartao: { fontSize: 20, color: AZUL, fontWeight: "800", textAlign: "center" },
  descricaoCartao: {
    marginTop: 6,
    fontSize: 13,
    textAlign: "center",
    color: "#6B7280",
    marginBottom: 22,
  },

  label: { fontSize: 16, fontWeight: "800", color: AZUL, marginBottom: 10 },

  seletor: {
    padding: 13,
    backgroundColor: "#FFF7ED",
    borderWidth: 1.5,
    borderColor: "#FFEDD5",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  linhaSeletor: { flex: 1, flexDirection: "row", gap: 10, alignItems: "center" },
  iconeCirculo: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#FFEDD5",
    alignItems: "center",
    justifyContent: "center",
  },
  textoSeletor: { fontSize: 14, fontWeight: "800", color: "#C2410C" },
  textoPequeno: { fontSize: 11, color: "#6B7280", marginTop: 3 },

  painel: {
    marginTop: 10,
    borderRadius: 12,
    padding: 10,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: CINZA_BORDA,
  },
  busca: {
    backgroundColor: CINZA_BG,
    borderWidth: 1,
    borderColor: CINZA_BORDA,
    borderRadius: 10,
    padding: 10,
    fontSize: 14,
    color: AZUL,
    marginBottom: 11,
  },
  acoes: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  link: { color: LARANJA, fontSize: 12, fontWeight: "800" },
  grade: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  itemAssunto: {
    width: "48.5%",
    minHeight: 58,
    marginBottom: 9,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    padding: 9,
    backgroundColor: CINZA_BG,
    borderColor: CINZA_BORDA,
    borderWidth: 1,
    borderRadius: 10,
  },
  itemSelecionado: { backgroundColor: "#FFEDD5", borderColor: LARANJA },
  textoAssunto: { flex: 1, fontSize: 12, fontWeight: "600", color: AZUL },

  confirmar: {
    marginTop: 7,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 13,
    borderRadius: 10,
    backgroundColor: LARANJA,
  },
  textoConfirmar: { color: "#fff", fontWeight: "800", fontSize: 14 },

  campos: { flexDirection: "row", marginTop: 22, gap: 12 },
  campo: { flex: 1 },
  labelCampo: {
    textAlign: "center",
    marginBottom: 9,
    fontSize: 13,
    fontWeight: "800",
    color: AZUL,
  },
  inputNumerico: {
    height: 52,
    borderRadius: 10,
    backgroundColor: "#FFF7ED",
    borderWidth: 1.5,
    borderColor: "#FFEDD5",
    textAlign: "center",
    color: AZUL,
    fontSize: 19,
    fontWeight: "800",
  },

  previa: {
    backgroundColor: "#fff",
    borderColor: CINZA_BORDA,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginTop: 20,
  },
  cabecalhoPrevia: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 10,
    alignItems: "center",
  },
  tituloPrevia: { flex: 1, fontSize: 14, color: AZUL, fontWeight: "800" },
  totalPrevia: { fontSize: 11, color: LARANJA, fontWeight: "800" },
  linhaPrevia: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: CINZA_BORDA,
    paddingVertical: 8,
  },
  nomePrevia: { flex: 1, color: AZUL, fontSize: 12 },
  qtdPrevia: { color: LARANJA, fontSize: 12, fontWeight: "800" },

  botaoGerar: {
    backgroundColor: LARANJA,
    borderRadius: 12,
    paddingVertical: 15,
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    shadowColor: LARANJA,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 7,
    elevation: 3,
  },
  botaoDesabilitado: { opacity: 0.6 },
  textoGerar: { color: "#fff", fontSize: 15, fontWeight: "800" },

  areaHistorico: { width: "100%" },

  barraInferior: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: CINZA_BORDA,
    paddingTop: 10,
    paddingHorizontal: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: -2 },
    elevation: 8,
  },
  barraItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
  },
  barraLabel: { fontSize: 11, color: "#9CA3AF", marginTop: 3, fontWeight: "600" },
});