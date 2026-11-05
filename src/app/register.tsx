// app/register.tsx
import { Ionicons } from '@expo/vector-icons';
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
import Animated from "react-native-reanimated";
import { useAuth } from './auth_context';

const AZUL = "#1E3A8A";
const LARANJA = "#F97316";
const CINZA_BG = "#F5F6FA";
const CINZA_BORDA = "#E5E7EB";

// Wrapper animado: a borda muda suavemente ao focar
function InputAnimado({ icone, children }: { icone: keyof typeof Ionicons.glyphMap; children: React.ReactNode }) {
  return (
    <Animated.View
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: CINZA_BG,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: {
          default: CINZA_BORDA,
          ':focus-within': LARANJA,
        },
        paddingHorizontal: 12,
        height: 52,
        transitionDuration: 200,
      }}
    >
      <Ionicons name={icone} size={20} color={AZUL} style={{ marginRight: 8 }} />
      {children}
    </Animated.View>
  );
}

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirm, setMostrarConfirm] = useState(false);
  const { signUp } = useAuth();

  async function handleRegister() {
    if (!name || !email || !password || !confirm)
      return Alert.alert("Erro", "Preencha todos os campos.");
    if (password !== confirm)
      return Alert.alert("Erro", "As senhas não coincidem.");
    if (password.length < 6)
      return Alert.alert("Erro", "A senha deve ter pelo menos 6 caracteres.");

    try {
      await signUp(name.trim(), email.trim(), password);
      router.replace("/home");
    } catch (e: any) {
      let msg = "Erro ao cadastrar.";
      if (e.code === "auth/email-already-in-use") msg = "E-mail já em uso.";
      if (e.code === "auth/weak-password") msg = "Senha fraca (mínimo 6 caracteres).";
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
            <Text style={styles.titulo}>Criar conta</Text>
            <Text style={styles.subtitulo}>Comece sua jornada na matemática</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Nome</Text>
            <InputAnimado icone="person-outline">
              <TextInput
                placeholder="Seu nome"
                placeholderTextColor="#9CA3AF"
                style={styles.input}
                value={name}
                onChangeText={setName}
              />
            </InputAnimado>

            <Text style={[styles.label, { marginTop: 16 }]}>E-mail</Text>
            <InputAnimado icone="mail-outline">
              <TextInput
                placeholder="seu@email.com"
                placeholderTextColor="#9CA3AF"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </InputAnimado>

            <Text style={[styles.label, { marginTop: 16 }]}>Senha</Text>
            <InputAnimado icone="lock-closed-outline">
              <TextInput
                placeholder="Mínimo 6 caracteres"
                placeholderTextColor="#9CA3AF"
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!mostrarSenha}
              />
              <TouchableOpacity onPress={() => setMostrarSenha(v => !v)} hitSlop={10} style={{ padding: 4 }}>
                <Ionicons name={mostrarSenha ? "eye-off" : "eye"} size={22} color={AZUL} />
              </TouchableOpacity>
            </InputAnimado>

            <Text style={[styles.label, { marginTop: 16 }]}>Confirmar senha</Text>
            <InputAnimado icone="lock-closed-outline">
              <TextInput
                placeholder="Repita a senha"
                placeholderTextColor="#9CA3AF"
                style={styles.input}
                value={confirm}
                onChangeText={setConfirm}
                secureTextEntry={!mostrarConfirm}
              />
              <TouchableOpacity onPress={() => setMostrarConfirm(v => !v)} hitSlop={10} style={{ padding: 4 }}>
                <Ionicons name={mostrarConfirm ? "eye-off" : "eye"} size={22} color={AZUL} />
              </TouchableOpacity>
            </InputAnimado>

            <TouchableOpacity activeOpacity={0.85} onPress={handleRegister} style={styles.btnCadastrar}>
              <Text style={styles.btnCadastrarTxt}>Cadastrar</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.rodape}>
            <Text style={styles.txtRodape}>Já tem uma conta?</Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.txtLink}> Entrar</Text>
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
  input: { flex: 1, fontSize: 16, color: "#111827", paddingVertical: 0 },

  btnCadastrar: {
    backgroundColor: AZUL,
    height: 54,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    shadowColor: AZUL,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  btnCadastrarTxt: { color: "#fff", fontSize: 18, fontWeight: "800", letterSpacing: 0.5 },

  rodape: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  txtRodape: { fontSize: 15, color: "#6B7280" },
  txtLink: { fontSize: 15, color: AZUL, fontWeight: "800" },
});