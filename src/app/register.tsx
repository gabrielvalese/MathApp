import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { sendEmailVerification } from "firebase/auth";
import { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated from "react-native-reanimated";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/auth_context';
import { useTheme } from '../contexts/theme_context';
import { auth } from '../utils/FirebaseConfig';

function InputAnimado({ icone, children, cores }: { icone: keyof typeof Ionicons.glyphMap; children: React.ReactNode; cores: any }) {
  return (
    <Animated.View
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: cores.fundo,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: { default: cores.borda, ':focus-within': cores.laranja },
        paddingHorizontal: 12,
        height: 52,
        transitionDuration: 200,
      }}
    >
      <Ionicons name={icone} size={20} color={cores.azul} style={{ marginRight: 8 }} />
      {children}
    </Animated.View>
  );
}

export default function Register() {
  const { cores } = useTheme();
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

      if (auth.currentUser) {
        try {
          await sendEmailVerification(auth.currentUser);
        } catch (e) {
          console.error(e);
        }
      }

      router.replace({
        pathname: "/verificar_email",
        params: { email: email.trim() },
      });
    } catch (e: any) {
      let msg = "Erro ao cadastrar.";
      if (e.code === "auth/email-already-in-use") msg = "E-mail já em uso.";
      if (e.code === "auth/weak-password") msg = "Senha fraca (mínimo 6 caracteres).";
      if (e.code === "auth/invalid-email") msg = "E-mail inválido.";
      Alert.alert("Erro", msg);
    }
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: cores.fundo }]}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Image source={require('../../assets/images/logo.png')} style={styles.logo} resizeMode="contain" />
            <Text style={[styles.titulo, { color: cores.texto }]}>Criar conta</Text>
            <Text style={[styles.subtitulo, { color: cores.textoSuave }]}>Comece sua jornada na matemática</Text>
          </View>

          <View style={[styles.card, { backgroundColor: cores.card }]}>
            <Text style={[styles.label, { color: cores.texto }]}>Nome</Text>
            <InputAnimado icone="person-outline" cores={cores}>
              <TextInput placeholder="Seu nome" placeholderTextColor={cores.textoSuave} style={[styles.input, { color: cores.texto }]} value={name} onChangeText={setName} />
            </InputAnimado>

            <Text style={[styles.label, { color: cores.texto, marginTop: 16 }]}>E-mail</Text>
            <InputAnimado icone="mail-outline" cores={cores}>
              <TextInput placeholder="seu@email.com" placeholderTextColor={cores.textoSuave} style={[styles.input, { color: cores.texto }]} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
            </InputAnimado>

            <Text style={[styles.label, { color: cores.texto, marginTop: 16 }]}>Senha</Text>
            <InputAnimado icone="lock-closed-outline" cores={cores}>
              <TextInput placeholder="Mínimo 6 caracteres" placeholderTextColor={cores.textoSuave} style={[styles.input, { color: cores.texto }]} value={password} onChangeText={setPassword} secureTextEntry={!mostrarSenha} />
              <TouchableOpacity onPress={() => setMostrarSenha(v => !v)} hitSlop={10} style={{ padding: 4 }}>
                <Ionicons name={mostrarSenha ? "eye-off" : "eye"} size={22} color={cores.azul} />
              </TouchableOpacity>
            </InputAnimado>

            <Text style={[styles.label, { color: cores.texto, marginTop: 16 }]}>Confirmar senha</Text>
            <InputAnimado icone="lock-closed-outline" cores={cores}>
              <TextInput placeholder="Repita a senha" placeholderTextColor={cores.textoSuave} style={[styles.input, { color: cores.texto }]} value={confirm} onChangeText={setConfirm} secureTextEntry={!mostrarConfirm} />
              <TouchableOpacity onPress={() => setMostrarConfirm(v => !v)} hitSlop={10} style={{ padding: 4 }}>
                <Ionicons name={mostrarConfirm ? "eye-off" : "eye"} size={22} color={cores.azul} />
              </TouchableOpacity>
            </InputAnimado>

            <TouchableOpacity activeOpacity={0.85} onPress={handleRegister} style={[styles.btnCadastrar, { backgroundColor: cores.azul }]}>
              <Text style={styles.btnCadastrarTxt}>Cadastrar</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.rodape}>
            <Text style={[styles.txtRodape, { color: cores.textoSuave }]}>Já tem uma conta?</Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={[styles.txtLink, { color: cores.azul }]}> Entrar</Text>
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
  card: {
    borderRadius: 20, padding: 22,
    shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 }, elevation: 4,
  },
  label: { fontSize: 14, fontWeight: "700", marginBottom: 6 },
  input: { flex: 1, fontSize: 16, paddingVertical: 0 },
  btnCadastrar: {
    height: 54, borderRadius: 14, alignItems: "center", justifyContent: "center", marginTop: 24,
    shadowColor: "#1E3A8A", shadowOpacity: 0.3, shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 }, elevation: 3,
  },
  btnCadastrarTxt: { color: "#fff", fontSize: 18, fontWeight: "800", letterSpacing: 0.5 },
  rodape: { flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 22 },
  txtRodape: { fontSize: 15 },
  txtLink: { fontSize: 15, fontWeight: "800" },
});