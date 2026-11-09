// app/QuestoesBase/[id].tsx
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import {
  arrayUnion,
  doc,
  getDoc,
  runTransaction,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../contexts/auth_context";
import { salvarQuestaoRespondida } from "../../services/progresso";
import { db } from "../../utils/FirebaseConfig";

const AZUL = "#1E3A8A";
const LARANJA = "#F97316";
const VERDE = "#16A34A";
const LETRAS = ["A", "B", "C", "D", "E"];

type Questao = {
  id: string;
  enunciado: string;
  alternativas: string[];
  respostaCorreta: string;
  imagens?: string[];
};

export default function QuestaoMath() {
  const params = useLocalSearchParams<{ id: string; tentativaId?: string }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const tentativaId = Array.isArray(params.tentativaId)
    ? params.tentativaId[0]
    : params.tentativaId;

  const { user } = useAuth();

  const [questao, setQuestao] = useState<Questao | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [selecionada, setSelecionada] = useState<string | null>(null);
  const [confirmada, setConfirmada] = useState(false);
  const [proximaId, setProximaId] = useState<string | null>(null);
  const [totalQuestoes, setTotalQuestoes] = useState(0);

  useEffect(() => {
    if (!id) return;
    setCarregando(true);
    setSelecionada(null);
    setConfirmada(false);
    setProximaId(null);

    (async () => {
      try {
        const snap = await getDoc(doc(db, "Questao", id));
        if (snap.exists()) {
          const d = snap.data();
          setQuestao({ id: snap.id, ...(d as Omit<Questao, "id">) });
        }

        if (tentativaId) {
          const tentSnap = await getDoc(
            doc(db, "tentativas_simulado", tentativaId)
          );
          if (tentSnap.exists()) {
            const simuladoId = tentSnap.data().simulado_id;
            const simSnap = await getDoc(doc(db, "simulados", simuladoId));
            if (simSnap.exists()) {
              const ids: string[] = simSnap.data().questoes_ids ?? [];
              setTotalQuestoes(ids.length);
              const idx = ids.indexOf(id);
              if (idx >= 0 && idx < ids.length - 1) {
                setProximaId(ids[idx + 1]);
              }
            }
          }
        }
      } catch (e) {
        console.error("Erro ao carregar questão:", e);
      } finally {
        setCarregando(false);
      }
    })();
  }, [id, tentativaId]);

  async function handleConfirmar() {
    if (!selecionada || !questao || confirmada) return;
    setConfirmada(true);
    const acertou = selecionada === questao.respostaCorreta;

    // 1. Salva progresso geral
    if (user) {
      try {
        await salvarQuestaoRespondida(user.uid, questao.id, acertou);
      } catch (e) {
        console.error("Erro ao salvar progresso:", e);
      }
    }

    // 2. Atualiza tentativa (sem duplicar)
    if (tentativaId) {
      try {
        const tentRef = doc(db, "tentativas_simulado", tentativaId);
        await runTransaction(db, async (tx) => {
          const snap = await tx.get(tentRef);
          if (!snap.exists()) return;

          const data = snap.data();
          const respondidos: string[] = data.ids_respondidos ?? [];

          if (respondidos.includes(questao.id)) {
            console.log("Questão já contabilizada neste simulado.");
            return;
          }

          tx.update(tentRef, {
            respondidas: (data.respondidas ?? 0) + 1,
            acertos: (data.acertos ?? 0) + (acertou ? 1 : 0),
            ids_respondidos: arrayUnion(questao.id),
          });
        });
      } catch (e) {
        console.error("Erro ao atualizar tentativa:", e);
      }
    }
  }

  async function handleProxima() {
    if (!tentativaId) {
      router.back();
      return;
    }

    if (proximaId) {
      router.replace({
        pathname: "/QuestoesBase/[id]",
        params: { id: proximaId, tentativaId },
      });
      return;
    }

    // Última questão: marca o simulado como concluído
    try {
      const tentRef = doc(db, "tentativas_simulado", tentativaId);
      await updateDoc(tentRef, {
        status: "concluido",
        finalizado_em: serverTimestamp(),
      });
      console.log("✅ Simulado concluído.");
    } catch (e) {
      console.error("Erro ao concluir simulado:", e);
    }

    router.replace("/simulado?aba=meus");
  }

  if (carregando) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color={LARANJA} />
      </SafeAreaView>
    );
  }

  if (!questao) {
    return (
      <SafeAreaView
        style={[styles.container, { justifyContent: "center", alignItems: "center" }]}
      >
        <Text>Questão não encontrada.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.conteudo} showsVerticalScrollIndicator={false}>
        <Text style={styles.titulo}>
          {tentativaId && totalQuestoes > 0 ? `Questão` : "Questão"}
        </Text>

        <View style={styles.cardEnunciado}>
          <Text style={styles.enunciado}>{questao.enunciado}</Text>
          {questao.imagens?.map((uri) => (
            <Image key={uri} source={{ uri }} style={styles.imagem} resizeMode="contain" />
          ))}
        </View>

        {questao.alternativas.map((texto, i) => {
          const letra = LETRAS[i];
          const correta = confirmada && letra === questao.respostaCorreta;
          const errada = confirmada && letra === selecionada && letra !== questao.respostaCorreta;

          return (
            <TouchableOpacity
              key={letra}
              style={[
                styles.opcao,
                letra === selecionada && !confirmada && styles.selecionada,
                correta && styles.correta,
                errada && styles.errada,
              ]}
              onPress={() => !confirmada && setSelecionada(letra)}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.letra,
                  correta && { backgroundColor: VERDE },
                  errada && { backgroundColor: "#DC2626" },
                ]}
              >
                <Text style={styles.letraTxt}>{letra}</Text>
              </View>
              <Text style={styles.opcaoTxt}>{texto}</Text>
            </TouchableOpacity>
          );
        })}

        {!confirmada ? (
          <TouchableOpacity
            style={[styles.botao, !selecionada && { opacity: 0.5 }]}
            onPress={handleConfirmar}
            disabled={!selecionada}
          >
            <Text style={styles.botaoTxt}>Confirmar resposta</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.botao} onPress={handleProxima}>
            <Text style={styles.botaoTxt}>
              {tentativaId
                ? proximaId
                  ? "Próxima questão"
                  : "Finalizar simulado"
                : "Voltar"}
            </Text>
            <Ionicons name="arrow-forward" size={18} color="#fff" />
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F6FA" },
  conteudo: { padding: 20, paddingBottom: 32 },
  titulo: { fontSize: 22, fontWeight: "800", color: AZUL, marginBottom: 12 },
  cardEnunciado: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  enunciado: { fontSize: 17, color: "#111827", lineHeight: 25 },
  imagem: { width: "100%", height: 220, marginTop: 12 },
  opcao: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "transparent",
  },
  selecionada: { borderColor: LARANJA, backgroundColor: "#FFF7ED" },
  correta: { borderColor: VERDE, backgroundColor: "#DCFCE7" },
  errada: { borderColor: "#DC2626", backgroundColor: "#FEE2E2" },
  letra: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: LARANJA,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  letraTxt: { color: "#fff", fontWeight: "800", fontSize: 16 },
  opcaoTxt: { fontSize: 16, color: "#1F2937", flex: 1 },
  botao: {
    backgroundColor: AZUL,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
  botaoTxt: { color: "#fff", fontSize: 16, fontWeight: "800" },
});