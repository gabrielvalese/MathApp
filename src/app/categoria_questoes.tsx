import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { auth, db } from "./FirebaseConfig";

const AZUL = "#0B132B";
const AZUL_HOME = "#1E3A8A";
const LARANJA = "#F97316";
const CINZA = "#64748B";
const VERDE = "#16A34A";

type ItemQuestao = {
  id: string; // ID real do documento na coleção Questao
  numero: string; // Número mostrado para o estudante
  enunciado: string;
  ano?: number;
  origem?: string;
};

function normalizar(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

export default function CategoriaQuestoes() {
  const router = useRouter();
  const params = useLocalSearchParams<{ nome?: string }>();
  const nome = Array.isArray(params.nome) ? params.nome[0] : params.nome ?? "";

  const [questoes, setQuestoes] = useState<ItemQuestao[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [respondidas, setRespondidas] = useState<Set<string>>(new Set());
  const [consultandoHistorico, setConsultandoHistorico] = useState(true);
  const [erroHistorico, setErroHistorico] = useState(false);

  // Atualiza os ícones sempre que o estudante volta de uma questão.
  // A consulta usa os mesmos campos que a tela [id].tsx grava em Executa_Questao.
  useFocusEffect(
    useCallback(() => {
      let ativo = true;
      setConsultandoHistorico(true);
      setErroHistorico(false);

      const cancelarAuth = onAuthStateChanged(auth, async (usuario) => {
        if (!usuario) {
          if (ativo) {
            setRespondidas(new Set());
            setConsultandoHistorico(false);
          }
          return;
        }

        try {
          const snap = await getDocs(
            query(
              collection(db, "Executa_Questao"),
              where("usuario_uid", "==", usuario.uid)
            )
          );

          const ids = new Set<string>();
          snap.forEach((registro) => {
            const dados = registro.data();
            if (dados.questao_documento_id != null) {
              ids.add(`doc:${String(dados.questao_documento_id)}`);
            }
            if (dados.id_questao != null) {
              ids.add(`num:${String(dados.id_questao)}`);
            }
          });

          if (ativo) {
            setRespondidas(ids);
            setErroHistorico(false);
          }
        } catch (e) {
          console.error("Erro ao consultar questões respondidas:", e);
          if (ativo) {
            setRespondidas(new Set());
            setErroHistorico(true);
          }
        } finally {
          if (ativo) setConsultandoHistorico(false);
        }
      });

      return () => {
        ativo = false;
        cancelarAuth();
      };
    }, [])
  );

  useEffect(() => {
    let ativo = true;

    async function carregarQuestoes() {
      setCarregando(true);
      setErro("");
      setQuestoes([]);

      try {
        if (!nome) throw new Error("Assunto não informado.");

        // Possibilidade 1: Questao.conteudo contém o nome do assunto.
        let encontrados = (
          await getDocs(
            query(collection(db, "Questao"), where("conteudo", "==", nome))
          )
        ).docs;

        // Possibilidade 2: Questao.id_conteudo aponta para Conteudo.id_conteudo.
        if (encontrados.length === 0) {
          const conteudos = await getDocs(collection(db, "Conteudo"));
          const conteudo = conteudos.docs.find((documento) => {
            const dados = documento.data();
            const titulo =
              dados.nome ??
              dados.nome_conteudo ??
              dados.titulo ??
              dados.conteudo ??
              dados.assunto ??
              documento.id;
            return normalizar(String(titulo)) === normalizar(nome);
          });

          if (conteudo) {
            const dados = conteudo.data();
            const idConteudo = dados.id_conteudo ?? dados.id ?? conteudo.id;

            encontrados = (
              await getDocs(
                query(
                  collection(db, "Questao"),
                  where("id_conteudo", "==", idConteudo)
                )
              )
            ).docs;

            // Suporta id_conteudo como string ou número.
            if (encontrados.length === 0 && Number.isFinite(Number(idConteudo))) {
              encontrados = (
                await getDocs(
                  query(
                    collection(db, "Questao"),
                    where("id_conteudo", "==", Number(idConteudo))
                  )
                )
              ).docs;
            }
          }
        }

        const lista: ItemQuestao[] = encontrados.map((documento) => {
          const dados = documento.data();
          return {
            id: documento.id,
            numero: String(dados.id_questao ?? dados.id ?? documento.id),
            enunciado:
              typeof dados.enunciado === "string" && dados.enunciado.trim()
                ? dados.enunciado.trim()
                : "Enunciado não disponível.",
            ano: typeof dados.ano === "number" ? dados.ano : undefined,
            origem: typeof dados.origem === "string" ? dados.origem : undefined,
          };
        });

        if (ativo) setQuestoes(lista);
      } catch (e) {
        console.error("Erro ao buscar questões da categoria:", e);
        if (ativo) {
          setErro(e instanceof Error ? e.message : "Falha ao carregar questões.");
        }
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    carregarQuestoes();
    return () => {
      ativo = false;
    };
  }, [nome]);

  const totalConcluidas = useMemo(
    () =>
      questoes.filter(
        (q) =>
          respondidas.has(`doc:${q.id}`) ||
          respondidas.has(`num:${q.numero}`)
      ).length,
    [questoes, respondidas]
  );

  return (
    <View style={styles.tela}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.conteudo}
      >
        <View style={styles.cabecalho}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Voltar para categorias"
            style={styles.botaoVoltar}
            onPress={() =>
              router.canGoBack() ? router.back() : router.replace("/tela_categoria")
            }
          >
            <Ionicons name="arrow-back" size={21} color={AZUL} />
          </Pressable>
          <Text style={styles.titulo} numberOfLines={2}>{nome || "Questões"}</Text>
          <Text style={styles.subtitulo}>Escolha uma questão para praticar</Text>
        </View>

        <View style={styles.resumo}>
          <View style={styles.resumoIcone}>
            <Ionicons name="book-outline" size={24} color={AZUL_HOME} />
          </View>
          <View style={styles.resumoConteudo}>
            <Text style={styles.resumoTitulo}>Seu progresso</Text>
            <Text style={styles.resumoDetalhe}>
              {carregando
                ? "Carregando questões..."
                : `${questoes.length} questões disponíveis`}
            </Text>
          </View>
          {!carregando && !consultandoHistorico && !erroHistorico && (
            <Text style={styles.contador}>{totalConcluidas}/{questoes.length}</Text>
          )}
        </View>

        {erroHistorico && (
          <Text style={styles.avisoHistorico}>
            Não foi possível verificar quais questões foram respondidas.
            Confira as permissões do Firestore.
          </Text>
        )}

        {carregando ? (
          <ActivityIndicator color={LARANJA} size="large" style={styles.carregador} />
        ) : erro ? (
          <Text style={styles.aviso}>{erro}</Text>
        ) : questoes.length === 0 ? (
          <Text style={styles.aviso}>
            Nenhuma questão encontrada. Confira a relação entre Questao e Conteudo
            no Firestore.
          </Text>
        ) : (
          <>
            <Text style={styles.secaoTitulo}>Questões do assunto</Text>
            {questoes.map((questao) => {
              const concluida =
                respondidas.has(`doc:${questao.id}`) ||
                respondidas.has(`num:${questao.numero}`);

              const status = consultandoHistorico
                ? "Verificando..."
                : erroHistorico
                  ? "Indisponível"
                  : concluida
                    ? "Concluída"
                    : "Não respondida";

              return (
                <Pressable
                  key={questao.id}
                  accessibilityRole="button"
                  accessibilityLabel={`Questão ${questao.numero}, ${status}`}
                  style={styles.cardQuestao}
                  onPress={() =>
                    router.push({
                      pathname: "/QuestoesBase/[id]",
                      params: { id: questao.id },
                    })
                  }
                >
                  <View style={styles.cabecalhoQuestao}>
                    <Text style={styles.numeroQuestao}>QUESTÃO {questao.numero}</Text>
                    <View style={styles.status}>
                      <Ionicons
                        name={
                          consultandoHistorico || erroHistorico
                            ? "help-circle-outline"
                            : concluida
                              ? "checkmark-circle"
                              : "ellipse-outline"
                        }
                        color={!consultandoHistorico && !erroHistorico && concluida ? VERDE : "#94A3B8"}
                        size={19}
                      />
                      <Text
                        style={[
                          styles.statusTexto,
                          !consultandoHistorico && !erroHistorico && concluida && styles.statusConcluido,
                        ]}
                      >
                        {status}
                      </Text>
                    </View>
                  </View>

                  {/* Texto verdadeiro de Questao.enunciado, limitado a duas linhas. */}
                  <Text style={styles.enunciado} numberOfLines={2} ellipsizeMode="tail">
                    {questao.enunciado}
                  </Text>

                  <View style={styles.rodapeCard}>
                    <View style={styles.metadados}>
                      {questao.ano != null && (
                        <Text style={styles.metaTexto}>{questao.ano}</Text>
                      )}
                      {questao.origem ? (
                        <Text style={styles.metaTexto} numberOfLines={1}>{questao.origem}</Text>
                      ) : null}
                    </View>
                    <View style={styles.acao}>
                      <Text style={styles.acaoTexto}>
                        {concluida && !erroHistorico && !consultandoHistorico
                          ? "Ver questão"
                          : "Resolver questão"}
                      </Text>
                      <Ionicons name="chevron-forward" size={17} color="#C2410C" />
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: "#F1F5F9" },
  conteudo: { paddingHorizontal: 18, paddingTop: 18, paddingBottom: 42 },
  cabecalho: { alignItems: "center", marginBottom: 18, paddingTop: 4 },
  botaoVoltar: {
    position: "absolute", left: 0, top: 0, zIndex: 2,
    backgroundColor: "#E2E8F0", borderRadius: 9, padding: 9,
  },
  titulo: {
    color: AZUL, fontSize: 23, fontWeight: "bold", textAlign: "center",
    paddingHorizontal: 44, marginTop: 4,
  },
  subtitulo: { color: CINZA, fontSize: 13, marginTop: 7, textAlign: "center" },
  resumo: {
    flexDirection: "row", alignItems: "center", gap: 12,
    backgroundColor: "#FFFFFF", borderColor: "#E2E8F0", borderWidth: 1,
    padding: 15, borderRadius: 14, marginBottom: 22, elevation: 2,
  },
  resumoIcone: {
    height: 46, width: 46, borderRadius: 12, backgroundColor: "#FFF7ED",
    alignItems: "center", justifyContent: "center",
  },
  resumoConteudo: { flex: 1, gap: 3 },
  resumoTitulo: { color: AZUL_HOME, fontWeight: "700", fontSize: 16 },
  resumoDetalhe: { color: CINZA, fontSize: 12 },
  contador: { color: "#C2410C", fontSize: 18, fontWeight: "bold" },
  secaoTitulo: { color: AZUL_HOME, fontSize: 18, fontWeight: "700", marginBottom: 12 },
  cardQuestao: {
    backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E2E8F0",
    borderRadius: 14, padding: 16, marginBottom: 12, elevation: 2,
    shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  cabecalhoQuestao: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 12 },
  numeroQuestao: { flexShrink: 1, color: LARANJA, fontSize: 12, fontWeight: "800" },
  status: { flexDirection: "row", alignItems: "center", gap: 4, flexShrink: 0 },
  statusTexto: { fontSize: 11, color: CINZA, fontWeight: "600" },
  statusConcluido: { color: "#166534" },
  enunciado: { color: AZUL, fontSize: 14, lineHeight: 21, marginBottom: 14 },
  rodapeCard: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10 },
  metadados: { flexDirection: "row", gap: 8, flex: 1, alignItems: "center" },
  metaTexto: { color: CINZA, fontSize: 11, flexShrink: 1 },
  acao: { flexDirection: "row", alignItems: "center", gap: 1 },
  acaoTexto: { color: "#C2410C", fontWeight: "700", fontSize: 12 },
  avisoHistorico: { fontSize: 12, color: "#B45309", marginBottom: 14, textAlign: "center" },
  aviso: { backgroundColor: "#FFFFFF", borderRadius: 12, padding: 22, color: CINZA, textAlign: "center", lineHeight: 20 },
  carregador: { marginTop: 36 },
});