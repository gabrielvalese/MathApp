import { FontAwesome6, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Redirect, router } from "expo-router";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../contexts/auth_context";
import { useTheme } from "../contexts/theme_context";
import { fecharPopUpMeta } from "../services/streak";
import { db } from "../utils/FirebaseConfig";

const META_INICIAL = 30;

export default function Home() {
  const { user, nome } = useAuth();
  const { cores } = useTheme();
  const insets = useSafeAreaInsets();

  const [streak, setStreak] = useState(0);
  const [meta, setMeta] = useState(META_INICIAL);
  const [mensagemMeta, setMensagemMeta] = useState<string | null>(null);
  const [mostrarPopUp, setMostrarPopUp] = useState(false);

  const popUpJaMostrado = useRef(false);

  useEffect(() => {
    if (!user) return;

    const docRef = doc(db, "users", user.uid);
    const unsubscribe = onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setStreak(data.streak ?? 0);
        setMeta(data.streakGoal ?? META_INICIAL);
        setMensagemMeta(data.streakGoalMessage ?? null);

        const atingiu = data.metaAtingida === true;

        if (atingiu && !popUpJaMostrado.current) {
          popUpJaMostrado.current = true;
          setMostrarPopUp(true);
        }

        if (!atingiu) {
          popUpJaMostrado.current = false;
        }
      }
    });

    return unsubscribe;
  }, [user]);

  if (!user) {
    return <Redirect href="/login" />;
  }

  const META_SEQUENCIA = meta;

  const frase = streak >= META_SEQUENCIA
    ? "Você é imparável! Continue assim 🚀"
    : streak >= 15
    ? "Quase lá! Mantenha o ritmo! 💪"
    : streak >= 14
    ? "Duas semanas seguidas! Que incrível! 🌟"
    : streak >= 8
    ? "Mais de uma semana? Um gênio!? 😎"
    : streak >= 7
    ? "Uma semana seguida! Não pare agora 🔥"
    : streak >= 3
    ? "Você está pegando o ritmo! 💪"
    : streak >= 1
    ? "Bom começo! Mantenha o hábito ✨"
    : "Comece hoje sua sequência! ✨";

  const progresso = Math.min(streak / META_SEQUENCIA, 1);

  async function fecharPopUp() {
    setMostrarPopUp(false);
    if (user) {
      try {
        await fecharPopUpMeta(user.uid);
      } catch (e) {
        console.error(e);
      }
    }
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: cores.fundo }]} edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.saudacao, { color: cores.textoSuave }]}>Olá,</Text>
            <Text style={[styles.nome, { color: cores.texto }]}>{nome}</Text>
          </View>
          <Image
            source={require("../../assets/images/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <LinearGradient
          colors={["#F97316", "#DC2626"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.cardStreak}
        >
          <View style={styles.brilhoFundo} />

          <View style={styles.streakTopo}>
            <Ionicons name="flame" size={28} color="#fff" />
            <Text style={styles.streakLabel}>Sequência de dias</Text>
          </View>

          <View style={styles.streakCorpo}>
            <Text style={styles.streakNumero}>{streak}</Text>
            <View style={styles.streakInfo}>
              <Text style={styles.streakDias}>
                {streak === 1 ? "dia seguido" : "dias seguidos"}
              </Text>
              <Text style={styles.streakFrase}>{frase}</Text>
            </View>
          </View>

          <View style={styles.progressoWrapper}>
            <View style={styles.progressoFundo}>
              <View
                style={[styles.progressoPreenchido, { width: `${progresso * 100}%` }]}
              />
            </View>
            <Text style={styles.progressoTexto}>
              {streak} / {META_SEQUENCIA} dias para a meta
            </Text>
          </View>
        </LinearGradient>

        <View style={[styles.cardDesafio, { backgroundColor: cores.card }]}>
          <View style={styles.desafioHeader}>
            <View style={[styles.iconeCirculo, { backgroundColor: cores.cardSecundario }]}>
              <Ionicons name="flame" size={22} color={cores.laranja} />
            </View>
            <Text style={[styles.desafioTitulo, { color: cores.texto }]}>Desafio Diário</Text>
          </View>
          <Text style={[styles.desafioTexto, { color: cores.textoSuave }]}>
            Complete o desafio de hoje e mantenha sua sequência!
          </Text>
          <TouchableOpacity
            activeOpacity={0.85}
            style={[styles.btnLaranja, { backgroundColor: cores.laranja }]}
            onPress={() => router.push("/desafio_diario")}
          >
            <Text style={styles.btnLaranjaTxt}>Resolver agora</Text>
            <Ionicons name="arrow-forward" size={18} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.grid}>
          <TouchableOpacity
            activeOpacity={0.85}
            style={[styles.cardAcao, { backgroundColor: cores.card }]}
            onPress={() => router.push("/tela_categoria")}
          >
            <View style={[styles.iconeCirculo, { backgroundColor: cores.cardSecundario }]}>
              <FontAwesome6 name="box-open" size={22} color={cores.azul} />
            </View>
            <Text style={[styles.acaoTitulo, { color: cores.texto }]}>Problemas</Text>
            <Text style={[styles.acaoSub, { color: cores.textoSuave }]}>Polinômios, Matrizes...</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            style={[styles.cardAcao, { backgroundColor: cores.card }]}
            onPress={() => router.push("/simulado")}
          >
            <View style={[styles.iconeCirculo, { backgroundColor: cores.cardSecundario }]}>
              <FontAwesome6 name="chess-king" size={22} color={cores.azul} />
            </View>
            <Text style={[styles.acaoTitulo, { color: cores.texto }]}>Simulados</Text>
            <Text style={[styles.acaoSub, { color: cores.textoSuave }]}>Teste seus conhecimentos</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={[styles.barraInferior, { backgroundColor: cores.card, borderTopColor: cores.borda, paddingBottom: insets.bottom + 10 }]}>
        <TouchableOpacity
          style={styles.barraItem}
          activeOpacity={0.7}
          onPress={() => router.replace("/home")}
        >
          <Ionicons name="home" size={24} color={cores.azul} />
          <Text style={[styles.barraLabel, { color: cores.azul, fontWeight: "700" }]}>Início</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.barraItem}
          activeOpacity={0.7}
          onPress={() => router.replace("/simulado")}
        >
          <MaterialCommunityIcons name="podium-gold" size={26} color={cores.textoSuave} />
          <Text style={[styles.barraLabel, { color: cores.textoSuave }]}>Simulados</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.barraItem}
          activeOpacity={0.7}
          onPress={() => router.replace("/perfil")}
        >
          <Ionicons name="person" size={24} color={cores.textoSuave} />
          <Text style={[styles.barraLabel, { color: cores.textoSuave }]}>Perfil</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={mostrarPopUp}
        transparent
        animationType="fade"
        onRequestClose={fecharPopUp}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: cores.card }]}>
            <View style={[styles.modalIconeWrapper, { backgroundColor: cores.cardSecundario }]}>
              <FontAwesome6 name="trophy" size={48} color={cores.laranja} />
            </View>
            <Text style={[styles.modalTitulo, { color: cores.texto }]}>Meta atingida!</Text>
            <Text style={[styles.modalMensagem, { color: cores.textoSuave }]}>
              {mensagemMeta ?? "Parabéns, você atingiu a meta!"}
            </Text>
            <View style={[styles.modalMetaBox, { backgroundColor: cores.cardSecundario, borderColor: cores.laranja }]}>
              <Text style={[styles.modalMetaLabel, { color: cores.laranja }]}>Nova meta</Text>
              <Text style={[styles.modalMetaValor, { color: cores.laranja }]}>{meta}</Text>
              <Text style={[styles.modalMetaLabel, { color: cores.laranja }]}>dias seguidos</Text>
            </View>
            <TouchableOpacity
              style={[styles.modalBotao, { backgroundColor: cores.azul }]}
              activeOpacity={0.85}
              onPress={fecharPopUp}
            >
              <Text style={styles.modalBotaoTxt}>Continuar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: 20, paddingBottom: 24 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 24 },
  saudacao: { fontSize: 16 },
  nome: { fontSize: 26, fontWeight: "800", marginTop: 2 },
  logo: { width: 60, height: 60 },
  cardStreak: {
    borderRadius: 22, padding: 22, marginBottom: 16, overflow: "hidden",
    shadowColor: "#F97316", shadowOpacity: 0.4, shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 }, elevation: 6,
  },
  brilhoFundo: { position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: 80, backgroundColor: "rgba(255,255,255,0.12)" },
  streakTopo: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 16 },
  streakLabel: { color: "#fff", fontSize: 14, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.5 },
  streakCorpo: { flexDirection: "row", alignItems: "center", marginBottom: 18 },
  streakNumero: { fontSize: 72, fontWeight: "900", color: "#fff", lineHeight: 76, marginRight: 16 },
  streakInfo: { flex: 1 },
  streakDias: { color: "#fff", fontSize: 18, fontWeight: "800" },
  streakFrase: { color: "rgba(255,255,255,0.85)", fontSize: 13, marginTop: 4, lineHeight: 18 },
  progressoWrapper: {},
  progressoFundo: { height: 8, borderRadius: 4, backgroundColor: "rgba(255,255,255,0.25)", overflow: "hidden" },
  progressoPreenchido: { height: "100%", borderRadius: 4, backgroundColor: "#fff" },
  progressoTexto: { color: "rgba(255,255,255,0.9)", fontSize: 11, marginTop: 6, fontWeight: "600" },
  cardDesafio: { borderRadius: 18, padding: 18, marginBottom: 16, shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 10, shadowOffset: { width: 0, height: 3 }, elevation: 3 },
  desafioHeader: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  desafioTitulo: { fontSize: 18, fontWeight: "800", marginLeft: 10 },
  desafioTexto: { fontSize: 14, lineHeight: 20, marginBottom: 14 },
  btnLaranja: { flexDirection: "row", borderRadius: 12, paddingVertical: 14, paddingHorizontal: 18, alignItems: "center", justifyContent: "center", gap: 8 },
  btnLaranjaTxt: { color: "#fff", fontSize: 15, fontWeight: "800" },
  grid: { flexDirection: "row", gap: 12, marginBottom: 8 },
  cardAcao: { flex: 1, borderRadius: 18, padding: 16, shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 10, shadowOffset: { width: 0, height: 3 }, elevation: 3 },
  iconeCirculo: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center", marginBottom: 8 },
  acaoTitulo: { fontSize: 16, fontWeight: "800", marginTop: 6 },
  acaoSub: { fontSize: 12, marginTop: 4, lineHeight: 16 },
  barraInferior: { flexDirection: "row", borderTopWidth: 1, paddingTop: 10, paddingHorizontal: 12, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: -2 }, elevation: 8 },
  barraItem: { flex: 1, alignItems: "center", justifyContent: "center", paddingVertical: 4 },
  barraLabel: { fontSize: 11, marginTop: 3, fontWeight: "600" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "center", alignItems: "center", padding: 24 },
  modalCard: { width: "100%", borderRadius: 24, padding: 28, alignItems: "center", shadowColor: "#000", shadowOpacity: 0.3, shadowRadius: 20, shadowOffset: { width: 0, height: 10 }, elevation: 10 },
  modalIconeWrapper: { width: 96, height: 96, borderRadius: 48, alignItems: "center", justifyContent: "center", marginBottom: 16 },
  modalTitulo: { fontSize: 26, fontWeight: "900", marginBottom: 8 },
  modalMensagem: { fontSize: 15, textAlign: "center", lineHeight: 22, marginBottom: 20 },
  modalMetaBox: { borderRadius: 16, paddingVertical: 16, paddingHorizontal: 28, alignItems: "center", marginBottom: 24, borderWidth: 1.5 },
  modalMetaLabel: { fontSize: 12, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5 },
  modalMetaValor: { fontSize: 48, fontWeight: "900", lineHeight: 56 },
  modalBotao: { width: "100%", borderRadius: 14, paddingVertical: 16, alignItems: "center", shadowColor: "#1E3A8A", shadowOpacity: 0.3, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 4 },
  modalBotaoTxt: { color: "#fff", fontSize: 17, fontWeight: "800", letterSpacing: 0.5 },
});