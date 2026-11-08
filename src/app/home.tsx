// app/home.tsx
import { Feather, FontAwesome6, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  Image,
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

export default function Home() {
  const { user, nome } = useAuth();
  const insets = useSafeAreaInsets(); 

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Cabeçalho */}
        <View style={styles.header}>
          <View>
            <Text style={styles.saudacao}>Olá,</Text>
            <Text style={styles.nome}>{nome}</Text>
          </View>
          <Image
            source={require('../../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Card Ranking + Pontuação */}
        <View style={styles.cardDuplo}>
          <View style={styles.cardMetade}>
            <View style={[styles.iconeCirculo, { backgroundColor: "#DBEAFE" }]}>
              <FontAwesome6 name="trophy" size={22} color={AZUL} />
            </View>
            <Text style={styles.cardLabel}>Ranking</Text>
            <Text style={styles.cardValor}>#12</Text>
          </View>
          <View style={styles.divisorVertical} />
          <View style={styles.cardMetade}>
            <View style={[styles.iconeCirculo, { backgroundColor: "#FFEDD5" }]}>
              <Feather name="trending-up" size={22} color={LARANJA} />
            </View>
            <Text style={styles.cardLabel}>Pontuação</Text>
            <Text style={styles.cardValor}>267,17</Text>
          </View>
        </View>

        {/* Card Desafio Diário */}
        <View style={styles.cardDesafio}>
          <View style={styles.desafioHeader}>
            <View style={[styles.iconeCirculo, { backgroundColor: "#FFEDD5" }]}>
              <Ionicons name="flame" size={22} color={LARANJA} />
            </View>
            <Text style={styles.desafioTitulo}>Desafio Diário</Text>
          </View>
          <Text style={styles.desafioTexto}>
            (UFPR-2020) Imagine que um macaco digite sequências aleatórias de 3 letras...
          </Text>
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.btnLaranja}
            onPress={() =>
              router.push({ pathname: "/QuestoesBase/[id]", params: { id: "1" } })
            }
          >
            <Text style={styles.btnLaranjaTxt}>Resolver agora</Text>
            <Ionicons name="arrow-forward" size={18} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Grid de Ações */}
        <View style={styles.grid}>
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.cardAcao}
            onPress={() => router.push("/tela_categoria")}
          >
            <View style={[styles.iconeCirculo, { backgroundColor: "#DBEAFE" }]}>
              <FontAwesome6 name="box-open" size={22} color={AZUL} />
            </View>
            <Text style={styles.acaoTitulo}>Problemas</Text>
            <Text style={styles.acaoSub}>Polinômios, Matrizes...</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.cardAcao}
            onPress={() => router.push("/simulado")}
          >
            <View style={[styles.iconeCirculo, { backgroundColor: "#DBEAFE" }]}>
              <FontAwesome6 name="chess-king" size={22} color={AZUL} />
            </View>
            <Text style={styles.acaoTitulo}>Simulados</Text>
            <Text style={styles.acaoSub}>Teste seus conhecimentos</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Barra inferior */}
      <View style={[styles.barraInferior, { paddingBottom: insets.bottom + 10}]}>
        <TouchableOpacity
          style={styles.barraItem}
          activeOpacity={0.7}
          onPress={() => router.replace("/home")}
        >
          <Ionicons name="home" size={24} color={AZUL} />
          <Text style={[styles.barraLabel, { color: AZUL, fontWeight: "700" }]}>
            Início
          </Text>
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
          <Ionicons name="person" size={24} color="#9CA3AF" />
          <Text style={styles.barraLabel}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: CINZA_BG },
  scroll: { padding: 20, paddingBottom: 24 },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  saudacao: { fontSize: 16, color: "#6B7280" },
  nome: { fontSize: 26, fontWeight: "800", color: AZUL, marginTop: 2 },
  logo: { width: 60, height: 60 },

  cardDuplo: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  cardMetade: { flex: 1, alignItems: "center" },
  divisorVertical: { width: 1, backgroundColor: CINZA_BORDA, marginVertical: 6 },
  iconeCirculo: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  cardLabel: { fontSize: 13, color: "#6B7280", fontWeight: "600" },
  cardValor: { fontSize: 20, fontWeight: "800", color: AZUL, marginTop: 2 },

  cardDesafio: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  desafioHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  desafioTitulo: { fontSize: 18, fontWeight: "800", color: AZUL, marginLeft: 10 },
  desafioTexto: { fontSize: 14, color: "#4B5563", lineHeight: 20, marginBottom: 14 },
  btnLaranja: {
    flexDirection: "row",
    backgroundColor: LARANJA,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  btnLaranjaTxt: { color: "#fff", fontSize: 15, fontWeight: "800" },

  grid: { flexDirection: "row", gap: 12, marginBottom: 8 },
  cardAcao: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  acaoTitulo: { fontSize: 16, fontWeight: "800", color: AZUL, marginTop: 6 },
  acaoSub: { fontSize: 12, color: "#6B7280", marginTop: 4, lineHeight: 16 },

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