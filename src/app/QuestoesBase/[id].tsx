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
import { useTheme } from "../../contexts/theme_context";
import { salvarQuestaoRespondida } from "../../services/progresso";
import { db } from "../../utils/FirebaseConfig";

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
  const { cores, tema } = useTheme();

  const [questao, setQuestao] = useState<Questao | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [selecionada, setSelecionada] = useState<string | null>(null);
  const [confirmada, setConfirmada] = useState(false);
  const [proximaId, setProximaId] = useState<string | null>(null);

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
              const idx = ids.indexOf(id);
              if (idx >= 0 && idx < ids.length - 1) {
                setProximaId(ids[idx + 1]);
              }
            }
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setCarregando(false);
      }
    })();
  }, [id, tentativaId]);

  async function handleConfirmar() {
    if (!selecionada || !questao || confirmada) return;
    setConfirmada(true);
    const acertou = selecionada === questao.respostaCorreta;

    if (user) {
      try {
        await salvarQuestaoRespondida(user.uid, questao.id, acertou);
      } catch (e) {
        console.error(e);
      }
    }

    if (tentativaId) {
      try {
        const tentRef = doc(db, "tentativas_simulado", tentativaId);
        await runTransaction(db, async (tx) => {
          const snap = await tx.get(tentRef);
          if (!snap.exists()) return;

          const data = snap.data();
          const respondidos: string[] = data.ids_respondidos ?? [];

          if (respondidos.includes(questao.id)) return;

          tx.update(tentRef, {
            respondidas: (data.respondidas ?? 0) + 1,
            acertos: (data.acertos ?? 0) + (acertou ? 1 : 0),
            ids_respondidos: arrayUnion(questao.id),
          });
        });
      } catch (e) {
        console.error(e);
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

    try {
      const tentRef = doc(db, "tentativas_simulado", tentativaId);
      await updateDoc(tentRef, {
        status: "concluido",
        finalizado_em: serverTimestamp(),
      });
    } catch (e) {
      console.error(e);
    }

    router.replace("/simulado?aba=meus");
  }

  if (carregando) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: cores.fundo, justifyContent: "center" }]}>
        <ActivityIndicator size="large" color={cores.laranja} />
      </SafeAreaView>
    );
  }

  if (!questao) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: cores.fundo, justifyContent: "center", alignItems: "center" }]}
      >
        <Text style={{ color: cores.texto }}>Questão não encontrada.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: cores.fundo }]} edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.conteudo} showsVerticalScrollIndicator={false}>
        <Text style={[styles.titulo, { color: cores.texto }]}>Questão</Text>

        <View style={[styles.cardEnunciado, { backgroundColor: cores.card }]}>
          <Text style={[styles.enunciado, { color: cores.texto }]}>{questao.enunciado}</Text>
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
                { backgroundColor: cores.card },
                letra === selecionada && !confirmada && {
                  borderColor: cores.laranja,
                  backgroundColor: cores.cardSecundario,
                },
                correta && {
                  borderColor: cores.verde,
                  backgroundColor: tema === "dark" ? "#1F3A2A" : "#DCFCE7",
                },
                errada && {
                  borderColor: cores.perigo,
                  backgroundColor: tema === "dark" ? "#3A1F1F" : "#FEE2E2",
                },
              ]}
              onPress={() => !confirmada && setSelecionada(letra)}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.letra,
                  { backgroundColor: cores.laranja },
                  correta && { backgroundColor: cores.verde },
                  errada && { backgroundColor: cores.perigo },
                ]}
              >
                <Text style={styles.letraTxt}>{letra}</Text>
              </View>
              <Text style={[styles.opcaoTxt, { color: cores.texto }]}>{texto}</Text>
            </TouchableOpacity>
          );
        })}

        {!confirmada ? (
          <TouchableOpacity
            style={[styles.botao, { backgroundColor: cores.azul }, !selecionada && { opacity: 0.5 }]}
            onPress={handleConfirmar}
            disabled={!selecionada}
          >
            <Text style={styles.botaoTxt}>Confirmar resposta</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.botao, { backgroundColor: cores.azul }]} onPress={handleProxima}>
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
  container: { flex: 1 },
  conteudo: { padding: 20, paddingBottom: 32 },
  titulo: { fontSize: 22, fontWeight: "800", marginBottom: 12 },
  cardEnunciado: {
    borderRadius: 16, padding: 18, marginBottom: 18,
    shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 }, elevation: 3,
  },
  enunciado: { fontSize: 17, lineHeight: 25 },
  imagem: { width: "100%", height: 220, marginTop: 12 },
  opcao: {
    flexDirection: "row", alignItems: "center",
    borderRadius: 12, padding: 14, marginBottom: 12,
    borderWidth: 2, borderColor: "transparent",
  },
  letra: {
    width: 34, height: 34, borderRadius: 17,
    alignItems: "center", justifyContent: "center", marginRight: 14,
  },
  letraTxt: { color: "#fff", fontWeight: "800", fontSize: 16 },
  opcaoTxt: { fontSize: 16, flex: 1 },
  botao: {
    borderRadius: 14, paddingVertical: 16,
    alignItems: "center", justifyContent: "center",
    flexDirection: "row", gap: 8, marginTop: 8,
  },
  botaoTxt: { color: "#fff", fontSize: 16, fontWeight: "800" },
});