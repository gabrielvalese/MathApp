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
import { useTheme } from "../contexts/theme_context";
import { auth } from "../utils/FirebaseConfig";

export default function RedefinirSenha1() {
  const { cores } = useTheme();
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
    <SafeAreaView style={[styles.safe, { backgroundColor: cores.fundo }]} edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Image source={require('../../assets/images/logo.png')} style={styles.logo} resizeMode="contain" />
          <Text style={[styles.titulo, { color: cores.texto }]}>Redefinir senha</Text>
          <Text style={[styles.subtitulo, { color: cores.textoSuave }]}>Enviaremos um link para o seu e-mail</Text>
        </View>

        <View style={[styles.card, { backgroundColor: cores.card }]}>
          <Text style={[styles.label, { color: cores.texto }]}>E-mail</Text>
          <View
            style={[
              styles.inputWrap,
              { backgroundColor: cores.fundo, borderColor: cores.borda },
              focado && { borderColor: cores.laranja, backgroundColor: cores.cardSecundario },
            ]}
          >
            <Ionicons name="mail-outline" size={20} color={cores.azul} style={{ marginRight: 8 }} />
            <TextInput
              placeholder="seu@email.com"
              placeholderTextColor={cores.textoSuave}
              style={[styles.input, { color: cores.texto }]}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              onFocus={() => setFocado(true)}
              onBlur={() => setFocado(false)}
            />
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.botao,
              { backgroundColor: cores.laranja },
              (enviando || pressed) && { opacity: 0.8 },
            ]}
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
  safe: { flex: 1 },
  scroll: { padding: 24, flexGrow: 1, justifyContent: "center" },
  header: { alignItems: "center", marginBottom: 28 },
  logo: { width: 100, height: 100, marginBottom: 12 },
  titulo: { fontSize: 28, fontWeight: "800" },
  subtitulo: { fontSize: 14, marginTop: 4, textAlign: "center" },
  card: {
    borderRadius: 20, padding: 22,
    shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 }, elevation: 4,
  },
  label: { fontSize: 14, fontWeight: "700", marginBottom: 6 },
  inputWrap: { flexDirection: "row", alignItems: "center", borderRadius: 12, borderWidth: 1.5, paddingHorizontal: 12, height: 52 },
  input: { flex: 1, fontSize: 16 },
  botao: {
    height: 54, borderRadius: 14, alignItems: "center", justifyContent: "center", marginTop: 24,
    shadowColor: "#F97316", shadowOpacity: 0.3, shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 }, elevation: 3,
  },
  botaoTxt: { color: "#fff", fontSize: 17, fontWeight: "800" },
});