import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { collection, doc, getDoc, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { auth, db } from "../FirebaseConfig";

type Tentativa = {
  id: string;
  nome: string;
  quantidade: number;
  tempo: number;
  status: string;
  acertos: number | null;
  respondidas: number;
  criadoEm: number;
};

export default function MeuSimulado() {
  const router = useRouter();
  const [uid, setUid] = useState<string | null>(null);
  const [authPronto, setAuthPronto] = useState(false);
  const [tentativas, setTentativas] = useState<Tentativa[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [abrindo, setAbrindo] = useState<string | null>(null);

  useEffect(() => onAuthStateChanged(auth, usuario => {
    setUid(usuario?.uid ?? null);
    setAuthPronto(true);
  }), []);

  useEffect(() => {
    if (!authPronto) return;
    if (!uid) {
      setTentativas([]);
      setCarregando(false);
      return;
    }
    setCarregando(true);
    setErro("");
    const consulta = query(
      collection(db, "tentativas_simulado"),
      where("usuario_id", "==", uid)
    );
    return onSnapshot(consulta, resultado => {
      const lista: Tentativa[] = resultado.docs.map(docSnap => {
        const dados = docSnap.data();
        return {
          id: docSnap.id,
          nome: typeof dados.nome_simulado === "string" ? dados.nome_simulado : "Simulado de matemática",
          quantidade: Number(dados.quantidade_questoes) || 0,
          tempo: Number(dados.tempo_minutos) || 0,
          status: typeof dados.status === "string" ? dados.status : "nao_iniciado",
          acertos: typeof dados.acertos === "number" ? dados.acertos : null,
          respondidas: Number(dados.respondidas) || 0,
          criadoEm: dados.criado_em?.toMillis?.() ?? dados.iniciado_em?.toMillis?.() ?? 0,
        };
      });
      lista.sort((a, b) => b.criadoEm - a.criadoEm);
      setTentativas(lista);
      setCarregando(false);
    }, erroFirebase => {
      console.error("Erro no histórico dos simulados:", erroFirebase);
      setErro("Não foi possível buscar seus simulados. Confira as regras do Firestore.");
      setCarregando(false);
    });
  }, [uid, authPronto]);

  async function abrirTentativa(tentativaId: string) {
    if (abrindo) return;
    setAbrindo(tentativaId);
    try {
      const usuario = auth.currentUser;
      if (!usuario) throw new Error("Entre na sua conta antes de abrir o simulado.");
      const tentativaSnap = await getDoc(doc(db, "tentativas_simulado", tentativaId));
      if (!tentativaSnap.exists()) throw new Error("Tentativa não encontrada.");
      const tentativa = tentativaSnap.data();
      if (tentativa.usuario_id !== usuario.uid) throw new Error("Esse simulado pertence a outra conta.");
      if (typeof tentativa.simulado_id !== "string") throw new Error("Tentativa sem simulado associado.");
      const simuladoSnap = await getDoc(doc(db, "simulados", tentativa.simulado_id));
      if (!simuladoSnap.exists()) throw new Error("Simulado não encontrado.");
      const ids = (simuladoSnap.data().questoes_ids as unknown[] | undefined)?.filter(
        (id): id is string => typeof id === "string" && id.length > 0
      ) ?? [];
      if (ids.length === 0) throw new Error("Esse simulado ainda não possui questões sorteadas.");
      const encerrado = ["concluido", "tempo_esgotado"].includes(tentativa.status);
      const respondidos: string[] = Array.isArray(tentativa.ids_respondidos)
        ? tentativa.ids_respondidos.filter((id: unknown): id is string => typeof id === "string")
        : [];
      const pendente = ids.findIndex(id => !respondidos.includes(id));
      const indice = encerrado ? 0 : (pendente === -1 ? 0 : pendente);
      router.push({
        pathname: "/QuestoesBase/[id]",
        params: { id: ids[indice], tentativaId },
      });
    } catch (e) {
      Alert.alert("Não foi possível abrir", e instanceof Error ? e.message : "Tente novamente.");
    } finally {
      setAbrindo(null);
    }
  }

  if (!authPronto || carregando) return <ActivityIndicator color="#F97316" style={{ marginTop: 35 }} size="large" />;
  if (!uid) return <Text style={styles.aviso}>Entre na sua conta para ver seus simulados.</Text>;
  if (erro) return <Text style={styles.aviso}>{erro}</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Meus simulados</Text>
      <Text style={styles.descricao}>Continue de onde parou ou confira seus resultados.</Text>
      {tentativas.length === 0 ? (
        <View style={styles.vazio}>
          <Ionicons name="documents-outline" size={32} color="#64748B" />
          <Text style={styles.aviso}>Você ainda não criou nenhum simulado.</Text>
        </View>
      ) : tentativas.map(tentativa => {
        const encerrado = ["concluido", "tempo_esgotado"].includes(tentativa.status);
        return (
          <Pressable
            key={tentativa.id}
            style={styles.card}
            onPress={() => abrirTentativa(tentativa.id)}
            disabled={abrindo === tentativa.id}
          >
            <View style={styles.cabecalho}>
              <Ionicons name="reader-outline" color="#1E3A8A" size={23} />
              <Text style={styles.nome} numberOfLines={2}>{tentativa.nome}</Text>
              <Ionicons name="chevron-forward" color="#F97316" size={21} />
            </View>
            <Text style={styles.detalhes}>{tentativa.quantidade} questões · {tentativa.tempo} minutos</Text>
            <View style={styles.rodape}>
              <View style={styles.situacao}>
                <Ionicons name={encerrado ? "checkmark-circle-outline" : "time-outline"} color={encerrado ? "#166534" : "#C2410C"} size={16} />
                <Text style={styles.situacaoTexto}>
                  {tentativa.status === "concluido" ? "Concluído" : tentativa.status === "tempo_esgotado" ? "Tempo esgotado" : tentativa.status === "em_andamento" ? "Em andamento" : "Não iniciado"}
                </Text>
              </View>
              <Text style={styles.resultado}>
                {encerrado ? `${tentativa.acertos ?? 0} acertos` : `${tentativa.respondidas}/${tentativa.quantidade} respondidas`}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: "100%", backgroundColor: "#F8FAFC", borderColor: "#E2E8F0", borderWidth: 1.5, borderRadius: 13, padding: 16 },
  titulo: { color: "#1E3A8A", fontSize: 20, fontWeight: "bold", marginBottom: 4 },
  descricao: { color: "#64748B", fontSize: 13, marginBottom: 18 },
  card: { backgroundColor: "#FFFFFF", borderColor: "#E2E8F0", borderWidth: 1, borderRadius: 12, padding: 14, marginBottom: 12, elevation: 1 },
  cabecalho: { flexDirection: "row", alignItems: "center", gap: 10 },
  nome: { flex: 1, color: "#0B132B", fontWeight: "700", fontSize: 15 },
  detalhes: { color: "#64748B", marginTop: 10, fontSize: 12 },
  rodape: { marginTop: 12, flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 8 },
  situacao: { flexDirection: "row", alignItems: "center", gap: 5 },
  situacaoTexto: { color: "#64748B", fontSize: 12 },
  resultado: { color: "#C2410C", fontSize: 12, fontWeight: "700" },
  aviso: { fontSize: 14, color: "#64748B", textAlign: "center", marginTop: 12 },
  vazio: { padding: 25, alignItems: "center" },
});