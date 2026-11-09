// app/login.tsx
import { Ionicons } from "@expo/vector-icons";
import CheckBox from "expo-checkbox";
import { router } from "expo-router";
import { signOut } from "firebase/auth";
import { useState } from "react";
import {
  Alert, Image, KeyboardAvoidingView, Platform, ScrollView,
  StyleSheet, Text, TextInput, TouchableOpacity, View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../contexts/auth_context";
import { useTheme } from "../contexts/theme_context";
import { auth } from "../utils/FirebaseConfig";

export default function Login() {
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [isChecked, setChecked] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn } = useAuth();
  const { cores } = useTheme();

  async function handleLogin() {
    if (!email || !password) return Alert.alert("Erro", "Preencha e-mail e senha.");
    try {
      await signIn(email.trim(), password, isChecked);
      const user = auth.currentUser;
      if (user && !user.emailVerified) {
        await signOut(auth);
        return Alert.alert("E-mail não verificado", "Confirme seu e-mail antes de entrar.");
      }
      router.replace("/home");
    } catch (e: any) {
      let msg = "Erro ao entrar.";
      if (e.code === "auth/user-not-found") msg = "Usuário não encontrado.";
      if (e.code === "auth/wrong-password" || e.code === "auth/invalid-credential") msg = "Senha incorreta.";
      if (e.code === "auth/invalid-email") msg = "E-mail inválido.";
      Alert.alert("Erro", msg);
    }
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: cores.fundo }]}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Image source={require("../../assets/images/logo.png")} style={styles.logo} resizeMode="contain" />
            <Text style={[styles.titulo, { color: cores.texto }]}>Bem-vindo</Text>
            <Text style={[styles.subtitulo, { color: cores.textoSuave }]}>Entre para continuar seus estudos</Text>
          </View>

          <View style={[styles.card, { backgroundColor: cores.card }]}>
            <Text style={[styles.label, { color: cores.texto }]}>E-mail</Text>
            <View style={[styles.inputWrap, { backgroundColor: cores.fundo, borderColor: cores.borda }]}>
              <Ionicons name="mail-outline" size={20} color={cores.azul} style={styles.inputIcone} />
              <TextInput
                placeholder="seu@email.com"
                placeholderTextColor={cores.textoSuave}
                style={[styles.input, { color: cores.texto }]}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <Text style={[styles.label, { color: cores.texto, marginTop: 16 }]}>Senha</Text>
            <View style={[styles.inputWrap, { backgroundColor: cores.fundo, borderColor: cores.borda }]}>
              <Ionicons name="lock-closed-outline" size={20} color={cores.azul} style={styles.inputIcone} />
              <TextInput
                placeholder="Sua senha"
                placeholderTextColor={cores.textoSuave}
                style={[styles.input, { color: cores.texto }]}
                secureTextEntry={!mostrarSenha}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setMostrarSenha(v => !v)} hitSlop={10} style={{ padding: 4 }}>
                <Ionicons name={mostrarSenha ? "eye-off" : "eye"} size={22} color={cores.azul} />
              </TouchableOpacity>
            </View>

            <View style={styles.linhaOpcoes}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <CheckBox value={isChecked} onValueChange={setChecked} color={isChecked ? cores.azul : undefined} style={{ borderRadius: 4 }} />
                <Text style={[styles.txtOpcao, { color: cores.texto }]}>Lembrar-me</Text>
              </View>
              <TouchableOpacity onPress={() => router.push("/redefinir_senha1")}>
                <Text style={[styles.txtLink, { color: cores.laranja }]}>Esqueci a senha</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity activeOpacity={0.85} onPress={handleLogin} style={[styles.btnEntrar, { backgroundColor: cores.azul }]}>
              <Text style={styles.btnEntrarTxt}>Entrar</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.rodapeCadastro}>
            <Text style={[styles.txtRodape, { color: cores.textoSuave }]}>Não tem uma conta?</Text>
            <TouchableOpacity onPress={() => router.push("/register")}>
              <Text style={[styles.txtLinkCadastro, { color: cores.azul }]}> Cadastre-se</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: 24, paddingBottom: 40, flexGrow: 1, justifyContent: "center" },
  header: { alignItems: "center", marginBottom: 28 },
  logo: { width: 110, height: 110, marginBottom: 12 },
  titulo: { fontSize: 30, fontWeight: "800" },
  subtitulo: { fontSize: 15, marginTop: 4 },
  card: { borderRadius: 20, padding: 22 },
  label: { fontSize: 14, fontWeight: "700", marginBottom: 6 },
  inputWrap: { flexDirection: "row", alignItems: "center", borderRadius: 12, borderWidth: 1.5, paddingHorizontal: 12, height: 52 },
  inputIcone: { marginRight: 8 },
  input: { flex: 1, fontSize: 16 },
  linhaOpcoes: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 14 },
  txtOpcao: { fontSize: 14, marginLeft: 8 },
  txtLink: { fontSize: 14, fontWeight: "700" },
  btnEntrar: { height: 54, borderRadius: 14, alignItems: "center", justifyContent: "center", marginTop: 22 },
  btnEntrarTxt: { color: "#fff", fontSize: 18, fontWeight: "800" },
  rodapeCadastro: { flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 22 },
  txtRodape: { fontSize: 15 },
  txtLinkCadastro: { fontSize: 15, fontWeight: "800" },
});