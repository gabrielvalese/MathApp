// app/perfil.tsx
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { router } from "expo-router";
import { collection, doc, getDocs, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../contexts/auth_context";
import { useTheme } from "../contexts/theme_context";
import {
  carregarAvatarLocal,
  escolherAvatarLocal,
  removerAvatarLocal,
} from "../services/avatar";
import { db } from "../utils/FirebaseConfig";

const VERSAO_APP = Constants.expoConfig?.version ?? "1.0.0";
const META_INICIAL = 30;

export default function Perfil() {
  const { user, nome, signOutUser } = useAuth();
  const { tema, toggleTema, cores } = useTheme();
  const insets = useSafeAreaInsets();

  const [fotoUri, setFotoUri] = useState<string | null>(null);
  const [streak, setStreak] = useState(0);
  const [meta, setMeta] = useState(META_INICIAL);
  const [respondidas, setRespondidas] = useState(0);
  const [menuFotoAberto, setMenuFotoAberto] = useState(false);
  const [enviandoFoto, setEnviandoFoto] = useState(false);

  // Carrega a foto local ao abrir a tela
  useEffect(() => {
    (async () => {
      const uri = await carregarAvatarLocal();
      setFotoUri(uri);
    })();
  }, [user]);

  // Busca streak e meta no Firestore
  useEffect(() => {
    if (!user) return;
    return onSnapshot(doc(db, "users", user.uid), (snap) => {
      if (snap.exists()) {
        const d = snap.data();
        setStreak(d.streak ?? 0);
        setMeta(d.streakGoal ?? META_INICIAL);
      }
    });
  }, [user]);

  // Conta questões respondidas
  useEffect(() => {
    if (!user) return;
    (async () => {
      const snap = await getDocs(
        collection(db, "users", user.uid, "questoes_respondidas")
      );
      setRespondidas(snap.size);
    })();
  }, [user]);

  const inicial = (nome ?? "Usuário").trim().charAt(0).toUpperCase() || "?";

  async function trocarFoto(origem: "camera" | "galeria") {
    setMenuFotoAberto(false);
    setEnviandoFoto(true);
    try {
      const uri = await escolherAvatarLocal(origem);
      if (uri) setFotoUri(uri);
    } catch (e) {
      console.error("Erro ao trocar foto:", e);
      Alert.alert("Erro", "Não foi possível atualizar a foto.");
    } finally {
      setEnviandoFoto(false);
    }
  }

  async function removerFoto() {
    setMenuFotoAberto(false);
    await removerAvatarLocal();
    setFotoUri(null);
  }

  function handleLogout() {
    Alert.alert("Sair da conta", "Tem certeza?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        style: "destructive",
        onPress: async () => {
          await signOutUser();
          router.replace("/login");
        },
      },
    ]);
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: cores.fundo }]} edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Avatar + Nome + Email */}
        <View style={styles.headerPerfil}>
          <TouchableOpacity
            style={[styles.avatarWrapper, { backgroundColor: cores.laranja }]}
            onPress={() => setMenuFotoAberto(true)}
            disabled={enviandoFoto}
            activeOpacity={0.85}
          >
            {fotoUri ? (
              <Image
                key={fotoUri} // Força o recarregamento quando a URI muda
                source={{ uri: fotoUri }}
                style={styles.avatarImg}
              />
            ) : (
              <Text style={styles.avatarTxt}>{inicial}</Text>
            )}

            <View style={[styles.avatarBadge, { backgroundColor: cores.card }]}>
              <Feather name={enviandoFoto ? "loader" : "camera"} size={14} color={cores.laranja} />
            </View>
          </TouchableOpacity>

          <Text style={[styles.nome, { color: cores.texto }]}>{nome}</Text>
          <Text style={[styles.email, { color: cores.textoSuave }]}>{user?.email ?? "sem email"}</Text>
        </View>

        {/* Cards compactos */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: cores.card }]}>
            <Feather name="check-circle" size={20} color={cores.verde} />
            <Text style={[styles.statValor, { color: cores.texto }]}>{respondidas}</Text>
            <Text style={[styles.statLabel, { color: cores.textoSuave }]}>Questões resolvidas</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: cores.card }]}>
            <Ionicons name="flame" size={20} color={cores.laranja} />
            <Text style={[styles.statValor, { color: cores.texto }]}>{streak}</Text>
            <Text style={[styles.statLabel, { color: cores.textoSuave }]}>de {meta} dias</Text>
          </View>
        </View>

        {/* Conta */}
        <Text style={[styles.secaoTitulo, { color: cores.textoSuave }]}>Conta</Text>
        <View style={[styles.cardOpcoes, { backgroundColor: cores.card }]}>
          <TouchableOpacity style={styles.opcaoItem} onPress={() => router.push("/redefinir_senha1")}>
            <View style={[styles.opcaoIcone, { backgroundColor: cores.cardSecundario }]}>
              <Ionicons name="lock-closed-outline" size={20} color={cores.azul} />
            </View>
            <Text style={[styles.opcaoTxt, { color: cores.texto }]}>Alterar senha</Text>
            <Ionicons name="chevron-forward" size={20} color={cores.textoSuave} />
          </TouchableOpacity>
        </View>

        {/* Aparência */}
        <Text style={[styles.secaoTitulo, { color: cores.textoSuave }]}>Aparência</Text>
        <View style={[styles.cardOpcoes, { backgroundColor: cores.card }]}>
          <View style={styles.opcaoItem}>
            <View style={[styles.opcaoIcone, { backgroundColor: cores.cardSecundario }]}>
              <Ionicons name={tema === "dark" ? "moon" : "sunny"} size={20} color={cores.laranja} />
            </View>
            <Text style={[styles.opcaoTxt, { color: cores.texto }]}>Modo escuro</Text>
            <Switch
              value={tema === "dark"}
              onValueChange={toggleTema}
              trackColor={{ false: cores.borda, true: cores.laranja }}
              thumbColor="#fff"
            />
          </View>
        </View>

        {/* Sobre */}
        <Text style={[styles.secaoTitulo, { color: cores.textoSuave }]}>Sobre</Text>
        <View style={[styles.cardOpcoes, { backgroundColor: cores.card }]}>
          <View style={styles.opcaoItem}>
            <View style={[styles.opcaoIcone, { backgroundColor: cores.cardSecundario }]}>
              <Ionicons name="information-circle-outline" size={20} color={cores.azul} />
            </View>
            <Text style={[styles.opcaoTxt, { color: cores.texto }]}>Versão do app</Text>
            <Text style={[styles.versao, { color: cores.textoSuave }]}>{VERSAO_APP}</Text>
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity
          style={[styles.btnLogout, { borderColor: cores.perigo + "66" }]}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={20} color={cores.perigo} />
          <Text style={[styles.btnLogoutTxt, { color: cores.perigo }]}>Sair da conta</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Barra inferior */}
      <View
        style={[
          styles.barraInferior,
          {
            backgroundColor: cores.card,
            borderTopColor: cores.borda,
            paddingBottom: insets.bottom + 10,
          },
        ]}
      >
        <TouchableOpacity style={styles.barraItem} onPress={() => router.replace("/home")}>
          <Ionicons name="home" size={24} color={cores.textoSuave} />
          <Text style={[styles.barraLabel, { color: cores.textoSuave }]}>Início</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.barraItem} onPress={() => router.replace("/simulado")}>
          <MaterialCommunityIcons name="podium-gold" size={26} color={cores.textoSuave} />
          <Text style={[styles.barraLabel, { color: cores.textoSuave }]}>Simulados</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.barraItem} onPress={() => router.replace("/perfil")}>
          <Ionicons name="person" size={24} color={cores.laranja} />
          <Text style={[styles.barraLabel, { color: cores.laranja, fontWeight: "700" }]}>Perfil</Text>
        </TouchableOpacity>
      </View>

      {/* Modal para escolher câmera, galeria ou remover */}
      <Modal
        visible={menuFotoAberto}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuFotoAberto(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setMenuFotoAberto(false)}>
          <View style={[styles.modalCard, { backgroundColor: cores.card }]}>
            <Text style={[styles.modalTitulo, { color: cores.texto }]}>Alterar foto</Text>
            <TouchableOpacity style={[styles.modalOpcao, { borderColor: cores.borda }]} onPress={() => trocarFoto("camera")}>
              <Feather name="camera" size={22} color={cores.laranja} />
              <Text style={[styles.modalOpcaoTxt, { color: cores.texto }]}>Tirar foto</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.modalOpcao, { borderColor: cores.borda }]} onPress={() => trocarFoto("galeria")}>
              <Feather name="image" size={22} color={cores.azul} />
              <Text style={[styles.modalOpcaoTxt, { color: cores.texto }]}>Escolher da galeria</Text>
            </TouchableOpacity>
            {fotoUri && (
              <TouchableOpacity style={[styles.modalOpcao, { borderColor: cores.borda }]} onPress={removerFoto}>
                <Feather name="trash-2" size={22} color={cores.perigo} />
                <Text style={[styles.modalOpcaoTxt, { color: cores.perigo }]}>Remover foto</Text>
              </TouchableOpacity>
            )}
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: 20, paddingBottom: 24 },

  headerPerfil: { alignItems: "center", marginBottom: 24, marginTop: 12 },
  avatarWrapper: {
    width: 100, height: 100, borderRadius: 50,
    alignItems: "center", justifyContent: "center", marginBottom: 12, position: "relative",
  },
  avatarImg: { width: 100, height: 100, borderRadius: 50 },
  avatarTxt: { fontSize: 42, fontWeight: "800", color: "#fff" },
  avatarBadge: {
    position: "absolute", bottom: 0, right: 0,
    width: 30, height: 30, borderRadius: 15,
    alignItems: "center", justifyContent: "center",
    borderWidth: 2, borderColor: "#fff",
  },
  nome: { fontSize: 24, fontWeight: "800" },
  email: { fontSize: 14, marginTop: 4 },

  statsRow: { flexDirection: "row", gap: 12, marginBottom: 24 },
  statCard: { flex: 1, borderRadius: 16, padding: 14, alignItems: "center" },
  statValor: { fontSize: 22, fontWeight: "800", marginTop: 6 },
  statLabel: { fontSize: 11, marginTop: 2, fontWeight: "600", textAlign: "center" },

  secaoTitulo: {
    fontSize: 13, fontWeight: "800", textTransform: "uppercase",
    letterSpacing: 0.5, marginBottom: 8, marginLeft: 4,
  },
  cardOpcoes: { borderRadius: 16, marginBottom: 20, overflow: "hidden" },
  opcaoItem: { flexDirection: "row", alignItems: "center", padding: 14, gap: 12 },
  opcaoIcone: { width: 38, height: 38, borderRadius: 19, alignItems: "center", justifyContent: "center" },
  opcaoTxt: { flex: 1, fontSize: 15, fontWeight: "600" },
  versao: { fontSize: 14, fontWeight: "700" },

  btnLogout: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 8, borderRadius: 14, paddingVertical: 14, borderWidth: 1.5,
  },
  btnLogoutTxt: { fontWeight: "800", fontSize: 15 },

  barraInferior: { flexDirection: "row", borderTopWidth: 1, paddingTop: 10, paddingHorizontal: 12 },
  barraItem: { flex: 1, alignItems: "center", justifyContent: "center", paddingVertical: 4 },
  barraLabel: { fontSize: 11, marginTop: 3, fontWeight: "600" },

  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center", padding: 24 },
  modalCard: { width: "100%", borderRadius: 20, padding: 20 },
  modalTitulo: { fontSize: 18, fontWeight: "800", marginBottom: 16, textAlign: "center" },
  modalOpcao: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 14, borderBottomWidth: 1 },
  modalOpcaoTxt: { fontSize: 16, fontWeight: "600" },
});