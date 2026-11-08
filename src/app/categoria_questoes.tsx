// app/categoria_questoes.tsx
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
import { SafeAreaView } from "react-native-safe-area-context";
import { auth, db } from "../utils/FirebaseConfig";

const AZUL = "#1E3A8A";
const LARANJA = "#F97316";
const CINZA_BG = "#F5F6FA";
const CINZA_BORDA = "#E5E7EB";
const VERDE = "#16A34A";

type ItemQuestao = {
  id: string;
  numero: string;
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

        let encontrados = (
          await getDocs(
            query(collection(db, "Questao"), where("conteudo", "==", nome))
          )
        ).docs;

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
          respondidas.has(`doc:${q.id}`) || respondidas.has(`num:${q.numero}`)
      ).length,
    [questoes, respondidas]
  );

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* Cabeçalho */}
        <View style={styles.header}>
          <View style={styles.headerLinha}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Voltar para categorias"
              style={({ pressed }) => [
                styles.botaoVoltar,
                pressed && { backgroundColor: CINZA_BG },
              ]}
              onPress={() =>
                router.canGoBack() ? router.back() : router.replace("/tela_categoria")
              }
            >
              <Ionicons name="arrow-back" size={22} color={AZUL} />
            </Pressable>
            <Text style={styles.titulo} numberOfLines={2}>
              {nome || "Questões"}
            </Text>
            <View style={{ width: 40 }} />
          </View>
          <Text style={styles.subtitulo}>Escolha uma questão para praticar</Text>
        </View>

        {/* Card resumo */}
        <View style={styles.resumo}>
          <View style={styles.resumoIcone}>
            <Ionicons name="book-outline" size={24} color={AZUL} />
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
            <View style={styles.contadorBox}>
              <Text style={styles.contador}>
                {totalConcluidas}/{questoes.length}
              </Text>
            </View>
          )}
        </View>

        {erroHistorico && (
          <Text style={styles.avisoHistorico}>
            Não foi possível verificar quais questões foram respondidas.
          </Text>
        )}

        {carregando ? (
          <ActivityIndicator
            color={LARANJA}
            size="large"
            style={styles.carregador}
          />
        ) : erro ? (
          <View style={styles.cardVazio}>
            <Ionicons name="alert-circle-outline" size={28} color="#DC2626" />
            <Text style={styles.avisoTexto}>{erro}</Text>
          </View>
        ) : questoes.length === 0 ? (
          <View style={styles.cardVazio}>
            <Ionicons name="search-outline" size={28} color="#9CA3AF" />
            <Text style={styles.avisoTexto}>
              Nenhuma questão encontrada para este assunto.
            </Text>
          </View>
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
                  style={({ pressed }) => [
                    styles.cardQuestao,
                    pressed && { opacity: 0.85 },
                  ]}
                  onPress={() =>
                    router.push({
                      pathname: "/QuestoesBase/[id]",
                      params: { id: questao.id },
                    })
                  }
                >
                  <View style={styles.cabecalhoQuestao}>
                    <View style={styles.numeroBox}>
                      <Text style={styles.numeroQuestao}>
                        Questão {questao.numero}
                      </Text>
                    </View>
                    <View style={styles.status}>
                      <Ionicons
                        name={
                          consultandoHistorico || erroHistorico
                            ? "help-circle-outline"
                            : concluida
                            ? "checkmark-circle"
                            : "ellipse-outline"
                        }
                        color={
                          !consultandoHistorico && !erroHistorico && concluida
                            ? VERDE
                            : "#94A3B8"
                        }
                        size={16}
                      />
                      <Text
                        style={[
                          styles.statusTexto,
                          !consultandoHistorico &&
                            !erroHistorico &&
                            concluida &&
                            styles.statusConcluido,
                        ]}
                      >
                        {status}
                      </Text>
                    </View>
                  </View>

                  <Text
                    style={styles.enunciado}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                  >
                    {questao.enunciado}
                  </Text>

                  <View style={styles.rodapeCard}>
                    <View style={styles.metadados}>
                      {questao.ano != null && (
                        <Text style={styles.metaTexto}>{questao.ano}</Text>
                      )}
                      {questao.origem ? (
                        <Text style={styles.metaTexto} numberOfLines={1}>
                          {questao.origem}
                        </Text>
                      ) : null}
                    </View>
                    <View style={styles.acao}>
                      <Text style={styles.acaoTexto}>
                        {concluida && !erroHistorico && !consultandoHistorico
                          ? "Ver questão"
                          : "Resolver"}
                      </Text>
                      <Ionicons
                        name="chevron-forward"
                        size={16}
                        color={LARANJA}
                      />
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: CINZA_BG },
  scroll: { padding: 20, paddingBottom: 32 },

  header: { marginBottom: 18, paddingTop: 4 },
  headerLinha: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  botaoVoltar: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: CINZA_BORDA,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  titulo: {
    flex: 1,
    color: AZUL,
    fontSize: 20,
    fontWeight: "800",
    textAlign: "center",
    paddingHorizontal: 8,
  },
  subtitulo: {
    color: "#6B7280",
    fontSize: 13,
    marginTop: 8,
    textAlign: "center",
  },

  resumo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  resumoIcone: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#FFEDD5",
    alignItems: "center",
    justifyContent: "center",
  },
  resumoConteudo: { flex: 1, gap: 3 },
  resumoTitulo: { color: AZUL, fontWeight: "800", fontSize: 15 },
  resumoDetalhe: { color: "#6B7280", fontSize: 12 },
  contadorBox: {
    backgroundColor: "#FFEDD5",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  contador: { color: LARANJA, fontSize: 15, fontWeight: "800" },

  secaoTitulo: {
    color: AZUL,
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 12,
    paddingHorizontal: 2,
  },

  cardQuestao: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  cabecalhoQuestao: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 12,
  },
  numeroBox: {
    backgroundColor: "#FFEDD5",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  numeroQuestao: { color: "#C2410C", fontSize: 11, fontWeight: "800" },
  status: { flexDirection: "row", alignItems: "center", gap: 4 },
  statusTexto: { fontSize: 11, color: "#6B7280", fontWeight: "600" },
  statusConcluido: { color: "#166534" },

  enunciado: {
    color: AZUL,
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 14,
  },

  rodapeCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  metadados: { flexDirection: "row", gap: 8, flex: 1, alignItems: "center" },
  metaTexto: { color: "#6B7280", fontSize: 11, flexShrink: 1 },
  acao: { flexDirection: "row", alignItems: "center", gap: 2 },
  acaoTexto: { color: LARANJA, fontWeight: "800", fontSize: 12 },

  avisoHistorico: {
    fontSize: 12,
    color: "#B45309",
    marginBottom: 14,
    textAlign: "center",
  },

  cardVazio: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 28,
    alignItems: "center",
    gap: 10,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  avisoTexto: {
    color: "#6B7280",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },

  carregador: { marginTop: 36 },
});