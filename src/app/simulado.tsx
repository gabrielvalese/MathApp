import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { collection, doc, getDocs, query, serverTimestamp, where, writeBatch, } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, } from "react-native";
import { auth, db } from "./FirebaseConfig";
import MeuSimulado from "./componentes/MeuSimulado";


const COLECAO_QUESTOES = "Questao";
const AZUL = "#1E3A8A";
const LARANJA = "#F97316";
const CINZA_BG = "#F5F6FA";
const CINZA_BORDA = "#E5E7EB";
const CAMPO_ASSUNTO_QUESTAO = "Conteudo";

const CORES = {
  azul: "#0B132B",
  azulHome: "#1E3A8A",
  laranja: "#F97316",
  laranjaTexto: "#C2410C",
  laranjaClaro: "#FFF7ED",
  laranjaBorda: "#FFEDD5",
  fundo: "#F1F5F9",
  cartao: "#F8FAFC",
  branco: "#FFFFFF",
  borda: "#E2E8F0",
  secundario: "#64748B",
};

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
  "Matemática Financeira",
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
      // O banco pode usar o NOME do assunto em Questao.conteudo,
      // ou o identificador numérico Questao.id_conteudo -> Conteudo.id_conteudo.
      const conteudos = await getDocs(collection(db, "Conteudo")).catch(erro => {
        console.warn("Não foi possível consultar Conteudo (tentando apenas Questao.conteudo):", erro);
        return null;
      });
      const grupos = await Promise.all(
        selecionados.map(async (assunto) => {
          const consulta = query(
            collection(db, COLECAO_QUESTOES),
            where(CAMPO_ASSUNTO_QUESTAO, "==", assunto)
          );
          let documentos = (await getDocs(consulta)).docs;
          if (documentos.length === 0 && conteudos) {
            const docConteudo = conteudos.docs.find(d => {
              const dados = d.data();
              const nome = dados.nome ?? dados.nome_conteudo ?? dados.titulo ?? dados.conteudo ?? dados.assunto ?? d.id;
              return textoBusca(String(nome)) === textoBusca(assunto);
            });
            if (docConteudo) {
              const dados = docConteudo.data();
              const idConteudo = dados.id_conteudo ?? dados.id ?? docConteudo.id;
              documentos = (await getDocs(query(
                collection(db, COLECAO_QUESTOES), where("id_conteudo", "==", idConteudo)
              ))).docs;
              if (documentos.length === 0 && Number.isFinite(Number(idConteudo))) {
                documentos = (await getDocs(query(
                  collection(db, COLECAO_QUESTOES), where("id_conteudo", "==", Number(idConteudo))
                ))).docs;
              }
            }
          }
          const validos = documentos.filter(d => {
            const q = d.data();
            return typeof q.enunciado === "string" && Array.isArray(q.alternativas) &&
              typeof q.respostaCorreta === "string";
          });
          return {
            assunto,
            ids: embaralhar(validos.map(documento => documento.id)),
            usadas: 0,
          };
        })
      );

      // Caso a mesma questão apareça em dois grupos, mantenha apenas uma cópia.
      const idsUnicos = new Set<string>();
      for (const grupo of grupos) {
        grupo.ids = grupo.ids.filter(id => {
          if (idsUnicos.has(id)) return false;
          idsUnicos.add(id);
          return true;
        });
      }
      const totalDisponivel = grupos.reduce((total, grupo) => total + grupo.ids.length, 0);
      if (totalDisponivel < quantidade) {
        Alert.alert(
          "Questões insuficientes",
          `Você pediu ${quantidade} questões, mas a consulta encontrou ${totalDisponivel}. ` +
            `Confira se Questao.${CAMPO_ASSUNTO_QUESTAO} contém o nome do conteúdo, ` +
            "ou se Questao.id_conteudo está ligado à coleção Conteudo."
        );
        return;
      }

      // Distribui igualmente enquanto houver questões em cada assunto.
      const escolhidas: Array<{ id: string; assunto: string }> = [];
      while (escolhidas.length < quantidade) {
        const disponiveis = grupos.filter((grupo) => grupo.ids.length > 0);
        const menorUso = Math.min(...disponiveis.map((grupo) => grupo.usadas));
        const candidatos = disponiveis.filter((grupo) => grupo.usadas === menorUso);
        const grupo = candidatos[Math.floor(Math.random() * candidatos.length)];
        const id = grupo.ids.pop();
        if (!id) throw new Error("Não foi possível selecionar uma questão.");
        grupo.usadas += 1;
        escolhidas.push({ id, assunto: grupo.assunto });
      }

      const questoes: QuestaoSelecionada[] = embaralhar(escolhidas).map((q, indice) => ({
        ...q,
        ordem: indice + 1,
      }));
      const distribuicao = grupos.map(({ assunto, usadas }) => ({
        assunto,
        quantidade: usadas,
      }));
      const nome = selecionados.length === 1
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
        quantidade_questoes: quantidade,
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
        quantidade_questoes: quantidade,
        tempo_minutos: tempo,
        status: "nao_iniciado",
        acertos: null,
        respondidas: 0,
        ids_respondidos: [],
        indice_atual: 0,
        iniciado_em: null,
        finalizado_em: null,
        criado_em: serverTimestamp(),
      });
      await batch.commit();

      Alert.alert("Simulado criado!", `${quantidade} questões foram selecionadas. Agora você pode respondê-las.`, [
        { text: "Meus simulados", onPress: () => { setPainelAberto(false); setAba("meus"); } },
        { text: "Responder agora", onPress: () => router.push({
          pathname: "/QuestoesBase/[id]",
          params: { id: questoes[0].id, tentativaId: tentativaRef.id },
        }) },
      ]);
    } catch (error) {
      console.error("Erro ao gerar simulado:", error);
      Alert.alert(
        "Não foi possível gerar",
        error instanceof Error ? error.message : "Verifique a conexão e as permissões do Firebase."
      );
    } finally {
      setGerando(false);
    }
  }

  return (
    <View style={styles.tela}>
      <ScrollView
        contentContainerStyle={styles.conteudo}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.cabecalho}>
          <Pressable
            accessibilityLabel="Voltar"
            style={styles.botaoVoltar}
            onPress={() => (router.canGoBack() ? router.back() : router.replace("/"))}
          >
            <Ionicons name="arrow-back" size={22} color={CORES.azul} />
          </Pressable>
          <Text style={styles.titulo}>Simulados</Text>
          <Text style={styles.subtitulo}>Prepare seu simulado de matemática do ENEM</Text>
        </View>

        <View style={styles.abas}>
          <Pressable
            style={[styles.aba, aba === "criar" && styles.abaAtiva]}
            onPress={() => setAba("criar")}
          >
            <Ionicons name="add-circle-outline" size={19} color={aba === "criar" ? CORES.laranjaTexto : CORES.secundario} />
            <Text style={[styles.textoAba, aba === "criar" && styles.textoAbaAtiva]}>Criar simulado</Text>
          </Pressable>
          <Pressable
            style={[styles.aba, aba === "meus" && styles.abaAtiva]}
            onPress={() => setAba("meus")}
          >
            <Ionicons name="folder-open-outline" size={19} color={aba === "meus" ? CORES.laranjaTexto : CORES.secundario} />
            <Text style={[styles.textoAba, aba === "meus" && styles.textoAbaAtiva]}>Meus simulados</Text>
          </Pressable>
        </View>

        {aba === "criar" ? (
          <View style={styles.cartao}>
            <Text style={styles.tituloCartao}>Novo simulado</Text>
            <Text style={styles.descricaoCartao}>Escolha os assuntos, a quantidade de questões e o tempo.</Text>

            <Text style={styles.label}>Assuntos</Text>
            <Pressable style={styles.seletor} onPress={() => setPainelAberto((atual) => !atual)}>
              <View style={styles.linhaSeletor}>
                <Ionicons name="library-outline" size={20} color={CORES.laranjaTexto} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.textoSeletor}>Selecionar assuntos</Text>
                  <Text style={styles.textoPequeno}>
                    {selecionados.length === 0
                      ? "26 conteúdos disponíveis"
                      : `${selecionados.length} de 26 selecionados`}
                  </Text>
                </View>
              </View>
              <Ionicons name={painelAberto ? "chevron-up" : "chevron-down"} size={20} color={CORES.laranjaTexto} />
            </Pressable>

            {painelAberto && (
              <View style={styles.painel}>
                <TextInput
                  style={styles.busca}
                  placeholder="Buscar assunto..."
                  placeholderTextColor="#94A3B8"
                  value={busca}
                  onChangeText={setBusca}
                />
                <View style={styles.acoes}>
                  <Text style={styles.textoPequeno}>{selecionados.length} selecionado(s)</Text>
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
                          color={marcado ? CORES.laranja : CORES.secundario}
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
                  selectionColor={CORES.laranja}
                  style={styles.inputNumerico}
                />
              </View>
              <View style={styles.campo}>
                <Text style={styles.labelCampo}>Tempo (min)</Text>
                <TextInput
                  value={tempoLimite}
                  onChangeText={setTempoLimite}
                  keyboardType="number-pad"
                  selectionColor={CORES.laranja}
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
                  <Text style={styles.textoPequeno}>E mais {previsao.length - 5} assunto(s).</Text>
                )}
                <Text style={styles.legendaPrevia}>
                  A distribuição final depende das questões disponíveis no banco.
                </Text>
              </View>
            )}

            <Pressable
              style={[styles.botaoGerar, gerando && styles.botaoDesabilitado]}
              onPress={gerarSimulado}
              disabled={gerando}
            >
              {gerando ? <ActivityIndicator color={CORES.branco} /> : <Ionicons name="create-outline" size={20} color={CORES.branco} />}
              <Text style={styles.textoGerar}>{gerando ? "Gerando simulado..." : "Gerar simulado"}</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.areaHistorico}>
            <MeuSimulado />
          </View>
        )}
      </ScrollView>
     <View style={styles.barraInferior}>
        <TouchableOpacity
          style={styles.barraItem}
          activeOpacity={0.7}
          onPress={() => router.replace("/home")}
        >
          <Ionicons name="home" size={24} color={AZUL} />
          <Text style={[styles.barraLabel, { color: AZUL, fontWeight: "700" }]}>
            Início
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.barraItem}
          activeOpacity={0.7}
          onPress={() => router.replace("/simulado")}
        >
          <MaterialCommunityIcons name="podium-gold" size={26} color="#9CA3AF" />
          <Text style={styles.barraLabel}>Simulados</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.barraItem}
          activeOpacity={0.7}
          onPress={() => router.replace("/perfil")}
        >
          <Ionicons name="person" size={24} color="#9CA3AF" />
          <Text style={styles.barraLabel}>Perfil</Text>
        </TouchableOpacity>
      </View>   
    </View>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: CORES.fundo },
  conteudo: { width: "100%", alignItems: "center", paddingHorizontal: 18, paddingTop: 18, paddingBottom: 36 },
  cabecalho: { width: "100%", maxWidth: 450, alignItems: "center", paddingTop: 8, marginBottom: 17 },
  botaoVoltar: { position: "absolute", left: 0, top: 0, padding: 8, borderRadius: 9, backgroundColor: CORES.borda, zIndex: 2 },
  titulo: { fontSize: 26, fontWeight: "bold", color: CORES.azul, textAlign: "center" },
  subtitulo: { marginTop: 5, fontSize: 13, color: CORES.secundario, textAlign: "center", paddingHorizontal: 30 },
  abas: { flexDirection: "row", width: "100%", maxWidth: 450, backgroundColor: CORES.branco, borderRadius: 12, padding: 5, marginBottom: 18, borderWidth: 1, borderColor: CORES.borda },
  aba: { flex: 1, minHeight: 47, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 5, borderRadius: 9, paddingHorizontal: 5 },
  abaAtiva: { backgroundColor: CORES.laranjaClaro, borderWidth: 1, borderColor: CORES.laranjaBorda },
  textoAba: { fontSize: 12, fontWeight: "700", color: CORES.secundario, textAlign: "center" },
  textoAbaAtiva: { color: CORES.laranjaTexto },
  cartao: { width: "100%", maxWidth: 450, backgroundColor: CORES.cartao, borderRadius: 13, padding: 18, borderWidth: 1.5, borderColor: CORES.borda, shadowColor: "#000", shadowOpacity: 0.04, shadowOffset: { width: 0, height: 3 }, shadowRadius: 7, elevation: 2 },
  tituloCartao: { fontSize: 20, color: CORES.azulHome, fontWeight: "bold", textAlign: "center" },
  descricaoCartao: { marginTop: 6, fontSize: 13, textAlign: "center", color: CORES.secundario, marginBottom: 24 },
  label: { fontSize: 17, fontWeight: "700", color: CORES.azul, marginBottom: 10 },
  seletor: { padding: 13, backgroundColor: CORES.laranjaClaro, borderWidth: 1, borderColor: CORES.laranjaBorda, borderRadius: 10, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  linhaSeletor: { flex: 1, flexDirection: "row", gap: 10, alignItems: "center" },
  textoSeletor: { fontSize: 14, fontWeight: "700", color: CORES.laranjaTexto },
  textoPequeno: { fontSize: 11, color: CORES.secundario, marginTop: 3 },
  painel: { marginTop: 10, borderRadius: 11, padding: 10, backgroundColor: CORES.branco, borderWidth: 1, borderColor: CORES.borda },
  busca: { backgroundColor: CORES.cartao, borderWidth: 1, borderColor: CORES.borda, borderRadius: 8, padding: 10, fontSize: 14, color: CORES.azul, marginBottom: 11 },
  acoes: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 8, marginBottom: 12 },
  link: { color: CORES.laranjaTexto, fontSize: 12, fontWeight: "700" },
  grade: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  itemAssunto: { width: "48.5%", minHeight: 65, marginBottom: 9, flexDirection: "row", alignItems: "center", gap: 7, padding: 9, backgroundColor: CORES.cartao, borderColor: CORES.borda, borderWidth: 1, borderRadius: 10 },
  itemSelecionado: { backgroundColor: "#FFEDD5", borderColor: CORES.laranja },
  textoAssunto: { flex: 1, fontSize: 12, fontWeight: "600", color: CORES.azul },
  confirmar: { marginTop: 7, alignItems: "center", justifyContent: "center", paddingVertical: 13, borderRadius: 9, backgroundColor: CORES.laranja },
  textoConfirmar: { color: CORES.branco, fontWeight: "bold", fontSize: 14 },
  campos: { flexDirection: "row", marginTop: 24, gap: 12 },
  campo: { flex: 1 },
  labelCampo: { textAlign: "center", marginBottom: 9, fontSize: 13, fontWeight: "700", color: CORES.azul },
  inputNumerico: { height: 52, borderRadius: 9, backgroundColor: CORES.laranjaClaro, borderWidth: 1, borderColor: CORES.laranjaBorda, textAlign: "center", color: CORES.azul, fontSize: 19, fontWeight: "bold" },
  previa: { backgroundColor: CORES.branco, borderColor: CORES.borda, borderWidth: 1, borderRadius: 11, padding: 12, marginTop: 22 },
  cabecalhoPrevia: { flexDirection: "row", justifyContent: "space-between", gap: 8, marginBottom: 10, alignItems: "center" },
  tituloPrevia: { flex: 1, fontSize: 14, color: CORES.azul, fontWeight: "bold" },
  totalPrevia: { fontSize: 11, color: CORES.laranjaTexto, fontWeight: "bold" },
  linhaPrevia: { flexDirection: "row", justifyContent: "space-between", gap: 12, borderBottomWidth: 1, borderBottomColor: CORES.borda, paddingVertical: 8 },
  nomePrevia: { flex: 1, color: CORES.azul, fontSize: 12 },
  qtdPrevia: { color: CORES.laranjaTexto, fontSize: 12, fontWeight: "bold" },
  legendaPrevia: { marginTop: 10, fontSize: 11, color: CORES.secundario },
  botaoGerar: { backgroundColor: CORES.laranja, borderRadius: 9, paddingVertical: 15, marginTop: 22, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 9, shadowColor: CORES.laranja, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 7, elevation: 3 },
  botaoDesabilitado: { opacity: 0.6 },
  textoGerar: { color: CORES.branco, fontSize: 15, fontWeight: "bold" },
  areaHistorico: { width: "100%", maxWidth: 450 },
   barraInferior: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: CINZA_BORDA,
    paddingVertical: 10,
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
  barraLabel: {
    fontSize: 11,
    color: "#9CA3AF",
    marginTop: 3,
    fontWeight: "600",
  },
});