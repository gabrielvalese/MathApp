// app/verificar_email.tsx
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth } from "../utils/FirebaseConfig";

const AZUL = "#1E3A8A";
const LARANJA = "#F97316";
const CINZA_BG = "#F5F6FA";

export default function VerificarEmail() {
  const router = useRouter();
  const params = useLocalSearchParams<{ email: string }>();
  const email = Array.isArray(params.email) ? params.email[0] : params.email ?? "";
  const [carregando, setCarregando] = useState(false);

  async function jaVerifiquei() {
    if (!auth.currentUser) {
      return Alert.alert("Sessão expirada", "Faça login novamente para continuar.");
    }

    setCarregando(true);
    try {
      // Força o Firebase a buscar o estado mais recente do usuário
      await auth.currentUser.reload();

      if (auth.currentUser.emailVerified) {
        Alert.alert("Sucesso!", "Seu e-mail foi verificado. Bem-vindo!", [
          { text: "OK", onPress: () => router.replace("/home") },
        ]);
      } else {
        Alert.alert(
          "Ainda não verificado",
          "Não encontramos a verificação. Confira sua caixa de entrada (e o spam) e clique no link antes de continuar."
        );
      }
    } catch (e) {
      Alert.alert("Erro", "Não foi possível verificar o status. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.card}>
          <View style={styles.iconeCirculo}>
            <Ionicons name="mail-outline" size={36} color={LARANJA} />
          </View>

          <Text style={styles.titulo}>Verifique seu e-mail</Text>
          <Text style={styles.texto}>
            Enviamos um link de verificação para{"\n"}
            <Text style={styles.email}>{email}</Text>
          </Text>
          <Text style={styles.instrucao}>
            Abra o e-mail e clique no link para ativar sua conta. Depois, volte aqui e toque no botão abaixo.
          </Text>

          <Pressable
            style={({ pressed }) => [styles.botao, carregando && styles.botaoDesabilitado, pressed && { opacity: 0.85 }]}
            onPress={jaVerifiquei}
            disabled={carregando}
          >
            <Ionicons name="checkmark-circle-outline" size={22} color="#fff" />
            <Text style={styles.botaoTexto}>{carregando ? "Verificando..." : "Já verifiquei meu e-mail"}</Text>
          </Pressable>

          <Pressable onPress={() => router.replace("/login")} style={styles.linkContainer}>
            <Text style={styles.link}>Voltar para o login</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: CINZA_BG },
  scroll: { padding: 24, flexGrow: 1, justifyContent: "center" },
  card: { backgroundColor: "#fff", borderRadius: 20, padding: 28, alignItems: "center", shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 4 },
  iconeCirculo: { width: 72, height: 72, borderRadius: 36, backgroundColor: "#FFEDD5", alignItems: "center", justifyContent: "center", marginBottom: 20 },
  titulo: { fontSize: 22, fontWeight: "800", color: AZUL, marginBottom: 10 },
  texto: { fontSize: 15, color: "#6B7280", textAlign: "center", lineHeight: 22, marginBottom: 8 },
  email: { fontWeight: "800", color: AZUL },
  instrucao: { fontSize: 13, color: "#9CA3AF", textAlign: "center", lineHeight: 19, marginBottom: 28 },
  botao: { flexDirection: "row", backgroundColor: LARANJA, borderRadius: 14, paddingVertical: 16, width: "100%", alignItems: "center", justifyContent: "center", gap: 8, shadowColor: LARANJA, shadowOpacity: 0.3, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 3 },
  botaoDesabilitado: { opacity: 0.6 },
  botaoTexto: { color: "#fff", fontSize: 16, fontWeight: "800" },
  linkContainer: { marginTop: 20 },
  link: { fontSize: 14, color: AZUL, fontWeight: "700" },
});