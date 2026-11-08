// app/perfil.tsx
import { Feather, FontAwesome6, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../contexts/auth_context";

const AZUL = "#1E3A8A";
const LARANJA = "#F97316";
const CINZA_BG = "#F5F6FA";
const CINZA_BORDA = "#E5E7EB";

export default function Perfil() {
  const { user, nome, signOutUser } = useAuth();
  const insets  = useSafeAreaInsets();

  const inicial = (nome ?? "Usuário").trim().charAt(0).toUpperCase() || "?";

  function handleLogout() {
    Alert.alert(
      "Sair da conta",
      "Tem certeza que deseja sair?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sair",
          style: "destructive",
          onPress: async () => {
            await signOutUser();
            router.replace("/login");
          },
        },
      ]
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar + Nome + Email */}
        <View style={styles.headerPerfil}>
          <View style={styles.avatar}>
            <Text style={styles.avatarTxt}>{inicial}</Text>
          </View>
          <Text style={styles.nome}>{nome}</Text>
          <Text style={styles.email}>{user?.email ?? "sem email"}</Text>
        </View>

        {/* Cards de estatística */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <FontAwesome6 name="trophy" size={20} color={AZUL} />
            <Text style={styles.statValor}>#12</Text>
            <Text style={styles.statLabel}>Ranking</Text>
          </View>
          <View style={styles.statCard}>
            <Feather name="trending-up" size={20} color={LARANJA} />
            <Text style={styles.statValor}>267,17</Text>
            <Text style={styles.statLabel}>Pontos</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="flame" size={20} color={LARANJA} />
            <Text style={styles.statValor}>7</Text>
            <Text style={styles.statLabel}>Sequência</Text>
          </View>
        </View>

        {/* Seção Conta */}
        <Text style={styles.secaoTitulo}>Conta</Text>
        <View style={styles.cardOpcoes}>
          <TouchableOpacity
            style={styles.opcaoItem}
            activeOpacity={0.7}
            onPress={() => router.push("/redefinir_senha1")}
          >
            <View style={[styles.opcaoIcone, { backgroundColor: "#DBEAFE" }]}>
              <Ionicons name="lock-closed-outline" size={20} color={AZUL} />
            </View>
            <Text style={styles.opcaoTxt}>Alterar senha</Text>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <TouchableOpacity
          style={styles.btnLogout}
          activeOpacity={0.8}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={20} color="#DC2626" />
          <Text style={styles.btnLogoutTxt}>Sair da conta</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Barra inferior */}
        <View style={[styles.barraInferior, { paddingBottom: insets.bottom + 10}]}>
        <TouchableOpacity
          style={styles.barraItem}
          activeOpacity={0.7}
          onPress={() => router.replace("/home")}
        >
          <Ionicons name="home" size={24} color="#9CA3AF" />
          <Text style={styles.barraLabel}>Início</Text>
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
          <Ionicons name="person" size={24} color={AZUL} />
          <Text style={[styles.barraLabel, { color: AZUL, fontWeight: "700" }]}>
            Perfil
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: CINZA_BG },
  scroll: { padding: 20, paddingBottom: 24 },

  headerPerfil: { alignItems: "center", marginBottom: 28, marginTop: 12 },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: AZUL,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    shadowColor: AZUL,
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  avatarTxt: { fontSize: 40, fontWeight: "800", color: "#fff" },
  nome: { fontSize: 24, fontWeight: "800", color: AZUL },
  email: { fontSize: 14, color: "#6B7280", marginTop: 4 },

  statsRow: { flexDirection: "row", gap: 12, marginBottom: 24 },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  statValor: { fontSize: 18, fontWeight: "800", color: AZUL, marginTop: 6 },
  statLabel: { fontSize: 11, color: "#6B7280", marginTop: 2, fontWeight: "600" },

  secaoTitulo: {
    fontSize: 13,
    fontWeight: "800",
    color: "#6B7280",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
    marginLeft: 4,
  },
  cardOpcoes: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
    overflow: "hidden",
  },
  opcaoItem: { flexDirection: "row", alignItems: "center", padding: 14, gap: 12 },
  opcaoIcone: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  opcaoTxt: { flex: 1, fontSize: 15, fontWeight: "600", color: AZUL },

  btnLogout: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#FEF2F2",
    borderRadius: 14,
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: "#FECACA",
  },
  btnLogoutTxt: { color: "#DC2626", fontWeight: "800", fontSize: 15 },

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