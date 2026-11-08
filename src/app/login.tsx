// app/login.tsx
import { Ionicons } from '@expo/vector-icons';
import CheckBox from 'expo-checkbox';
import { router } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useAuth } from '../contexts/auth_context';

const AZUL = "#1E3A8A";
const LARANJA = "#F97316";
const CINZA_BG = "#F5F6FA";
const CINZA_BORDA = "#E5E7EB";

export default function Login() {
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [isChecked, setChecked] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailFocado, setEmailFocado] = useState(false);
  const [senhaFocada, setSenhaFocada] = useState(false);
  const { signIn } = useAuth();

  async function handleLogin() {
    if (!email || !password) {
      return Alert.alert("Erro", "Preencha e-mail e senha.");
    }
    try {
      await signIn(email.trim(), password, isChecked);
      router.replace("/home");
    } catch (e: any) {
      let msg = "Erro ao entrar.";
      if (e.code === "auth/user-not-found") msg = "Usuário não encontrado.";
      if (e.code === "auth/wrong-password" || e.code === "auth/invalid-credential")
        msg = "Senha incorreta.";
      if (e.code === "auth/invalid-email") msg = "E-mail inválido.";
      Alert.alert("Erro", msg);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Image
              source={require('../../assets/images/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.titulo}>Bem-vindo</Text>
            <Text style={styles.subtitulo}>Entre para continuar seus estudos</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>E-mail</Text>
            <View style={[styles.inputWrap, emailFocado && styles.inputWrapFocado]}>
              <Ionicons name="mail-outline" size={20} color={AZUL} style={styles.inputIcone} />
              <TextInput
                placeholder="seu@email.com"
                placeholderTextColor="#9CA3AF"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                onFocus={() => setEmailFocado(true)}
                onBlur={() => setEmailFocado(false)}
              />
            </View>

            <Text style={[styles.label, { marginTop: 16 }]}>Senha</Text>
            <View style={[styles.inputWrap, senhaFocada && styles.inputWrapFocado]}>
              <Ionicons name="lock-closed-outline" size={20} color={AZUL} style={styles.inputIcone} />
              <TextInput
                placeholder="Sua senha"
                placeholderTextColor="#9CA3AF"
                style={styles.input}
                secureTextEntry={!mostrarSenha}
                value={password}
                onChangeText={setPassword}
                onFocus={() => setSenhaFocada(true)}
                onBlur={() => setSenhaFocada(false)}
              />
              <TouchableOpacity
                onPress={() => setMostrarSenha((v) => !v)}
                hitSlop={10}
                style={{ padding: 4 }}
              >
                <Ionicons
                  name={mostrarSenha ? "eye-off" : "eye"}
                  size={22}
                  color={AZUL}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.linhaOpcoes}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <CheckBox
                  value={isChecked}
                  onValueChange={setChecked}
                  color={isChecked ? AZUL : undefined}
                  style={{ borderRadius: 4 }}
                />
                <Text style={styles.txtOpcao}>Lembrar-me</Text>
              </View>
              <TouchableOpacity onPress={() => router.push("/redefinir_senha1")}>
                <Text style={styles.txtLink}>Esqueci a senha</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleLogin}
              style={styles.btnEntrar}
            >
              <Text style={styles.btnEntrarTxt}>Entrar</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.rodapeCadastro}>
            <Text style={styles.txtRodape}>Não tem uma conta?</Text>
            <TouchableOpacity onPress={() => router.push("/register")}>
              <Text style={styles.txtLinkCadastro}> Cadastre-se</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: CINZA_BG },
  scroll: { padding: 24, paddingBottom: 40, flexGrow: 1, justifyContent: "center" },

  header: { alignItems: "center", marginBottom: 28 },
  logo: { width: 110, height: 110, marginBottom: 12 },
  titulo: { fontSize: 30, fontWeight: "800", color: AZUL },
  subtitulo: { fontSize: 15, color: "#6B7280", marginTop: 4 },

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
  inputIcone: { marginRight: 8 },
  input: { flex: 1, fontSize: 16, color: "#111827", paddingVertical: 0 },

  linhaOpcoes: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 14,
  },
  txtOpcao: { fontSize: 14, color: "#374151", marginLeft: 8 },
  txtLink: { fontSize: 14, color: LARANJA, fontWeight: "700" },

  btnEntrar: {
    backgroundColor: AZUL,
    height: 54,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 22,
    shadowColor: AZUL,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  btnEntrarTxt: { color: "#fff", fontSize: 18, fontWeight: "800", letterSpacing: 0.5 },

  rodapeCadastro: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  txtRodape: { fontSize: 15, color: "#6B7280" },
  txtLinkCadastro: { fontSize: 15, color: AZUL, fontWeight: "800" },

  divisor: { flexDirection: "row", alignItems: "center", marginVertical: 24 },
  linha: { flex: 1, height: 1, backgroundColor: CINZA_BORDA },
  txtDivisor: { marginHorizontal: 12, color: "#9CA3AF", fontSize: 13 },

  containerSocial: { flexDirection: "row", justifyContent: "center", gap: 16 },
  btnSocial: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: CINZA_BORDA,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
});