// app/desafio_diario.tsx
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    where,
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
import { useAuth } from "../contexts/auth_context";
import { registrarDesafio } from "../services/streak";
import { db } from "../utils/FirebaseConfig";

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

function hojeYMD(): string {
  const d = new Date();
  const ano = d.getFullYear();
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const dia = String(d.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
}

export default function DesafioDiario() {
  const { user } = useAuth();
  const [questao, setQuestao] = useState<Questao | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [semDesafio, setSemDesafio] = useState(false);
  const [jaFeito, setJaFeito] = useState(false);
  const [streakAtual, setStreakAtual] = useState(0);
  const [selecionada, setSelecionada] = useState<string | null>(null);
  const [confirmada, setConfirmada] = useState(false);
  const [acertou, setAcertou] = useState(false);

  useEffect(() => {
    async function carregar() {
      if (!user) {
        setCarregando(false);
        return;
      }

      try {
        // 1. Verifica se o usuário já fez o desafio hoje
        const userSnap = await getDoc(doc(db, "users", user.uid));
        if (userSnap.exists()) {
          const userData = userSnap.data();
          setStreakAtual(userData.streak ?? 0);

          if (userData.lastChallengeDate === hojeYMD()) {
            setJaFeito(true);
            setCarregando(false);
            return;
          }
        }

        // 2. Busca o desafio de hoje
        const hoje = hojeYMD();
        const q = query(
          collection(db, "DesafiosDiarios"),
          where("data", "==", hoje)
        );
        const snap = await getDocs(q);

        if (snap.empty) {
          setSemDesafio(true);
          return;
        }

        const desafio = snap.docs[0].data();
        const questaoId = desafio.questaoId as string;
        if (!questaoId) {
          setSemDesafio(true);
          return;
        }

        // 3. Busca a questão
        const qSnap = await getDoc(doc(db, "Questao", questaoId));
        if (!qSnap.exists()) {
          setSemDesafio(true);
          return;
        }

        const d = qSnap.data();
        setQuestao({
          id: qSnap.id,
          enunciado: d.enunciado,
          alternativas: d.alternativas,
          respostaCorreta: d.respostaCorreta,
          imagens: d.imagens,
        });
      } catch (e) {
        console.error("Erro ao carregar desafio:", e);
        setSemDesafio(true);
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, [user]);

  async function handleConfirmar() {
    if (!selecionada || !questao || confirmada) return;
    setConfirmada(true);
    setAcertou(selecionada === questao.respostaCorreta);

    if (user) {
      try {
        await registrarDesafio(user.uid);
        console.log("🔥 Streak atualizado!");
      } catch (e) {
        console.error("Erro ao registrar streak:", e);
      }
    }
  }

  function handleVoltar() {
    router.replace("/home");
  }

  // ⏳ Carregando
  if (carregando) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color={LARANJA} />
      </SafeAreaView>
    );
  }

  // ✅ Já fez o desafio hoje
  if (jaFeito) {
    return (
      <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
        <View style={styles.vazio}>
          <View style={styles.checkCirculo}>
            <Ionicons name="checkmark" size={52} color="#fff" />
          </View>
          <Text style={styles.vazioTitulo}>Desafio já concluído!</Text>
          <Text style={styles.vazioTexto}>
            Você já completou o desafio de hoje. Volte amanhã para manter a sequência!
          </Text>
          <View style={styles.streakBox}>
            <Ionicons name="flame" size={24} color={LARANJA} />
            <Text style={styles.streakNumero}>{streakAtual}</Text>
            <Text style={styles.streakLabel}>
              {streakAtual === 1 ? "dia seguido" : "dias seguidos"}
            </Text>
          </View>
          <TouchableOpacity style={styles.botao} onPress={handleVoltar}>
            <Text style={styles.botaoTxt}>Voltar para Home</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ❌ Sem desafio hoje
  if (semDesafio || !questao) {
    return (
      <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
        <View style={styles.vazio}>
          <Ionicons name="calendar-outline" size={48} color="#9CA3AF" />
          <Text style={styles.vazioTitulo}>Nenhum desafio hoje</Text>
          <Text style={styles.vazioTexto}>
            Volte mais tarde ou resolva questões livres enquanto isso.
          </Text>
          <TouchableOpacity style={styles.botao} onPress={handleVoltar}>
            <Text style={styles.botaoTxt}>Voltar para Home</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // 🎯 Desafio em andamento
  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.conteudo} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerIcone}>
            <Ionicons name="flame" size={24} color={LARANJA} />
          </View>
          <Text style={styles.headerTitulo}>Desafio Diário</Text>
        </View>

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
              <View style={[styles.letra, correta && { backgroundColor: VERDE }, errada && { backgroundColor: "#DC2626" }]}>
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
          <>
            <View style={[styles.feedback, acertou ? styles.feedbackAcerto : styles.feedbackErro]}>
              <Ionicons
                name={acertou ? "checkmark-circle" : "close-circle"}
                size={28}
                color={acertou ? VERDE : "#DC2626"}
              />
              <Text style={[styles.feedbackTxt, { color: acertou ? "#166534" : "#991B1B" }]}>
                {acertou ? "Você acertou! 🎉 Streak atualizado." : "Não foi dessa vez. Streak atualizado mesmo assim."}
              </Text>
            </View>
            <TouchableOpacity style={styles.botao} onPress={handleVoltar}>
              <Text style={styles.botaoTxt}>Voltar para Home</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F6FA" },
  conteudo: { padding: 20, paddingBottom: 32 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 18,
  },
  headerIcone: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFEDD5",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitulo: { fontSize: 22, fontWeight: "800", color: AZUL },

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
    marginTop: 8,
  },
  botaoTxt: { color: "#fff", fontSize: 16, fontWeight: "800" },

  feedback: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 14,
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 8,
  },
  feedbackAcerto: { backgroundColor: "#DCFCE7" },
  feedbackErro: { backgroundColor: "#FEE2E2" },
  feedbackTxt: { flex: 1, fontSize: 14, fontWeight: "600", lineHeight: 20 },

  vazio: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    gap: 14,
  },
  vazioTitulo: { fontSize: 22, fontWeight: "800", color: AZUL, textAlign: "center" },
  vazioTexto: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 8,
  },

  // ✅ Tela de "já feito"
  checkCirculo: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: VERDE,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    shadowColor: VERDE,
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  streakBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FFEDD5",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 4,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: "#FDBA74",
  },
  streakNumero: {
    fontSize: 32,
    fontWeight: "900",
    color: LARANJA,
    lineHeight: 36,
  },
  streakLabel: { fontSize: 14, fontWeight: "700", color: "#C2410C" },
});