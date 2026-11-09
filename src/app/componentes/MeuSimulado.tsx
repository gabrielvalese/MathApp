// app/componentes/MeuSimulado.tsx
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { auth, db } from "../../utils/FirebaseConfig";

type Tentativa = {
  id: string;
  nome: string;
  quantidade: number;
  tempo: number;
  status: string;
  acertos: number | null;
  respondidas: number;
  criadoEm: number;
  iniciadoEm: number | null;
};

export default function MeuSimulado() {
  const router = useRouter();
  const [uid, setUid] = useState<string | null>(null);
  const [tentativas, setTentativas] = useState<Tentativa[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => onAuthStateChanged(auth, (u) => setUid(u?.uid ?? null)), []);

  useEffect(() => {
    if (!uid) {
      setCarregando(false);
      return;
    }
    setCarregando(true);
    const q = query(
      collection(db, "tentativas_simulado"),
      where("usuario_id", "==", uid)
    );
    return onSnapshot(q, (snap) => {
      const lista: Tentativa[] = snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          nome: data.nome_simulado ?? "Simulado",
          quantidade: data.quantidade_questoes ?? 0,
          tempo: data.tempo_minutos ?? 0,
          status: data.status ?? "nao_iniciado",
          acertos: data.acertos ?? null,
          respondidas: data.respondidas ?? 0,
          criadoEm: data.criado_em?.toMillis?.() ?? 0,
          iniciadoEm: data.iniciado_em?.toMillis?.() ?? null,
        };
      });
      lista.sort((a, b) => b.criadoEm - a.criadoEm);
      setTentativas(lista);
      setCarregando(false);
    });
  }, [uid]);

  async function excluir(id: string) {
    Alert.alert(
      "Excluir simulado",
      "Tem certeza que deseja excluir este simulado? Esta ação não pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, "tentativas_simulado", id));
            } catch (e) {
              console.error("Erro ao excluir:", e);
              Alert.alert("Erro", "Não foi possível excluir o simulado.");
            }
          },
        },
      ]
    );
  }

  async function abrirTentativa(t: Tentativa) {
    try {
      // Ao abrir, marca como "em_andamento" se ainda não iniciou
      if (t.status === "nao_iniciado") {
        const { updateDoc, serverTimestamp } = await import("firebase/firestore");
        await updateDoc(doc(db, "tentativas_simulado", t.id), {
          status: "em_andamento",
          iniciado_em: serverTimestamp(),
        });
      }

      // Busca a tentativa para descobrir qual questão abrir
      const { getDoc } = await import("firebase/firestore");
      const tentSnap = await getDoc(doc(db, "tentativas_simulado", t.id));
      if (!tentSnap.exists()) return;

      const tentativa = tentSnap.data();
      const simSnap = await getDoc(
        doc(db, "simulados", tentativa.simulado_id)
      );
      if (!simSnap.exists()) return;

      const ids: string[] =
        (simSnap.data().questoes_ids as string[] | undefined) ?? [];
      if (ids.length === 0) return;

      const respondidos: string[] = Array.isArray(tentativa.ids_respondidos)
        ? tentativa.ids_respondidos
        : [];

      // Encontra a próxima não respondida
      const encerrado = ["concluido", "tempo_esgotado"].includes(tentativa.status);
      let indice = 0;
      if (!encerrado) {
        const pendente = ids.findIndex((qId) => !respondidos.includes(qId));
        indice = pendente === -1 ? 0 : pendente;
      }

      router.push({
        pathname: "/QuestoesBase/[id]",
        params: { id: ids[indice], tentativaId: t.id },
      });
    } catch (e) {
      console.error("Erro ao abrir tentativa:", e);
      Alert.alert("Erro", "Não foi possível abrir o simulado.");
    }
  }

  function statusInfo(t: Tentativa): { label: string; cor: string } {
    if (t.status === "concluido") return { label: "Concluído", cor: "#16A34A" };
    if (t.status === "tempo_esgotado") return { label: "Tempo esgotado", cor: "#DC2626" };
    if (t.status === "em_andamento") return { label: "Em andamento", cor: "#F97316" };
    return { label: "Não iniciado", cor: "#9CA3AF" };
  }

  function tempoRestante(t: Tentativa): string | null {
    if (!t.iniciadoEm || t.tempo <= 0) return null;
    if (["concluido", "tempo_esgotado"].includes(t.status)) return null;
    const fim = t.iniciadoEm + t.tempo * 60 * 1000;
    const restante = fim - Date.now();
    if (restante <= 0) return "Tempo esgotado";
    const min = Math.floor(restante / 60000);
    const seg = Math.floor((restante % 60000) / 1000);
    return `${min}:${String(seg).padStart(2, "0")}`;
  }

  if (carregando) {
    return (
      <ActivityIndicator
        color="#F97316"
        style={{ marginTop: 35 }}
        size="large"
      />
    );
  }
  if (!uid) return <Text style={styles.aviso}>Entre na sua conta.</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Meus simulados</Text>
      <Text style={styles.descricao}>
        Continue de onde parou ou confira seus resultados.
      </Text>

      {tentativas.length === 0 ? (
        <View style={styles.vazio}>
          <Ionicons name="documents-outline" size={32} color="#64748B" />
          <Text style={styles.aviso}>Nenhum simulado criado.</Text>
        </View>
      ) : (
        tentativas.map((t) => {
          const st = statusInfo(t);
          const restante = tempoRestante(t);
          const encerrado = ["concluido", "tempo_esgotado"].includes(t.status);

          return (
            <Pressable
              key={t.id}
              style={({ pressed }) => [styles.card, pressed && { opacity: 0.85 }]}
              onPress={() => abrirTentativa(t)}
            >
              <View style={styles.cabecalho}>
                <Ionicons name="reader-outline" size={22} color="#1E3A8A" />
                <Text style={styles.nome} numberOfLines={2}>
                  {t.nome}
                </Text>
                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation();
                    excluir(t.id);
                  }}
                  hitSlop={10}
                >
                  <Ionicons name="trash-outline" size={20} color="#DC2626" />
                </TouchableOpacity>
              </View>

              <Text style={styles.detalhes}>
                {t.quantidade} questões · {t.tempo} min
              </Text>

              <View style={styles.rodape}>
                <View style={styles.situacao}>
                  <View style={[styles.dot, { backgroundColor: st.cor }]} />
                  <Text style={[styles.situacaoTxt, { color: st.cor }]}>
                    {st.label}
                  </Text>
                </View>

                {restante && (
                  <Text style={styles.tempo}>⏱ {restante}</Text>
                )}

                <Text style={styles.progresso}>
                  {encerrado
                    ? `${t.acertos ?? 0} acertos`
                    : `${t.respondidas}/${t.quantidade}`}
                </Text>
              </View>
            </Pressable>
          );
        })
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  titulo: { fontSize: 20, fontWeight: "bold", color: "#1E3A8A", marginBottom: 4 },
  descricao: { color: "#64748B", fontSize: 13, marginBottom: 18 },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    elevation: 1,
  },
  cabecalho: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  nome: { flex: 1, fontWeight: "700", color: "#1E3A8A", fontSize: 15 },
  detalhes: { color: "#64748B", fontSize: 12, marginTop: 8 },
  rodape: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    gap: 8,
  },
  situacao: { flexDirection: "row", alignItems: "center", gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  situacaoTxt: { fontSize: 12, fontWeight: "600" },
  tempo: { fontSize: 12, color: "#F97316", fontWeight: "700" },
  progresso: { fontSize: 12, color: "#C2410C", fontWeight: "700" },
  aviso: { textAlign: "center", color: "#64748B", marginTop: 12 },
  vazio: { padding: 25, alignItems: "center" },
});