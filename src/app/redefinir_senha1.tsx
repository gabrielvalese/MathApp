// app/redefinir_senha1.tsx
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { sendPasswordResetEmail } from "firebase/auth";
import { useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth } from "../utils/FirebaseConfig";

const AZUL = "#1E3A8A";
const LARANJA = "#F97316";
const CINZA_BG = "#F5F6FA";
const CINZA_BORDA = "#E5E7EB";

export default function RedefinirSenha1() {
  const [email, setEmail] = useState("");
  const [focado, setFocado] = useState(false);
  const [enviando, setEnviando] = useState(false);

  async function handleRedefinir() {
    if (!email.trim()) {
      return Alert.alert("Erro", "Informe seu e-mail.");
    }
    setEnviando(true);
    try {
      await sendPasswordResetEmail(auth, email.trim());
      Alert.alert(
        "E-mail enviado",
        "Verifique sua caixa de entrada (e o spam) para redefinir sua senha.",
        [{ text: "OK", onPress: () => router.back() }]
      );
    } catch (e: any) {
      let msg = "Não foi possível enviar o e-mail.";
      if (e.code === "auth/user-not-found") msg = "Usuário não encontrado.";
      if (e.code === "auth/invalid-email") msg = "E-mail inválido.";
      Alert.alert("Erro", msg);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Image source={require('../../assets/images/logo.png')} style={styles.logo} resizeMode="contain" />
          <Text style={styles.titulo}>Redefinir senha</Text>
          <Text style={styles.subtitulo}>Enviaremos um link para o seu e-mail</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>E-mail</Text>
          <View style={[styles.inputWrap, focado && styles.inputWrapFocado]}>
            <Ionicons name="mail-outline" size={20} color={AZUL} style={{ marginRight: 8 }} />
            <TextInput
              placeholder="seu@email.com"
              placeholderTextColor="#9CA3AF"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              onFocus={() => setFocado(true)}
              onBlur={() => setFocado(false)}
            />
          </View>

          <Pressable
            style={({ pressed }) => [styles.botao, (enviando || pressed) && { opacity: 0.8 }]}
            onPress={handleRedefinir}
            disabled={enviando}
          >
            <Text style={styles.botaoTxt}>{enviando ? "Enviando..." : "Enviar link"}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: CINZA_BG },
  scroll: { padding: 24, flexGrow: 1, justifyContent: "center" },
  header: { alignItems: "center", marginBottom: 28 },
  logo: { width: 100, height: 100, marginBottom: 12 },
  titulo: { fontSize: 28, fontWeight: "800", color: AZUL },
  subtitulo: { fontSize: 14, color: "#6B7280", marginTop: 4, textAlign: "center" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 22,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  label: { fontSize: 14, fontWeight: "700", color: AZUL, marginBottom: 6 },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: CINZA_BG,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: CINZA_BORDA,
    paddingHorizontal: 12,
    height: 52,
  },
  inputWrapFocado: { borderColor: LARANJA, backgroundColor: "#FFF7ED" },
  input: { flex: 1, fontSize: 16, color: "#111827" },
  botao: {
    backgroundColor: LARANJA,
    height: 54,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    shadowColor: LARANJA,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  botaoTxt: { color: "#fff", fontSize: 17, fontWeight: "800" },
});