import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useAuth } from './auth_context';

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const { signUp } = useAuth();

  async function handleRegister() {
    if (!name || !email || !password || !confirm) return Alert.alert("Erro", "Preencha todos os campos.");
    if (password !== confirm) return Alert.alert("Erro", "As senhas não coincidem.");
    if (password.length < 6) return Alert.alert("Erro", "A senha deve ter pelo menos 6 caracteres.");

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
    <View style={styles.container}>
      <Image source={require('../assets/images/logo.png')} style={{ width: 100, height: 100, marginBottom: 20 }} />
      <Text style={styles.title}>Cadastro</Text>
      <TextInput placeholder="Nome" value={name} onChangeText={setName} style={styles.input} />
      <TextInput placeholder="E-mail" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" style={styles.input} />
      <TextInput placeholder="Senha" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
      <TextInput placeholder="Confirmar senha" value={confirm} onChangeText={setConfirm} secureTextEntry style={styles.input} />

      <TouchableOpacity style={styles.btn} onPress={handleRegister}>
        <Text style={{ color: "white", fontWeight: "bold", fontSize: 20 }}>Cadastrar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
        <Text style={{ color: "#0057f7e2", fontWeight: "bold" }}>Já tenho conta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 20 },
  title: { fontSize: 32, fontWeight: "bold", marginBottom: 20 },
  input: { width: "80%", height: 50, borderRadius: 5, padding: 10, backgroundColor: "lightgray", fontSize: 18, marginBottom: 12 },
  btn: { width: "60%", height: 55, backgroundColor: "black", borderRadius: 10, alignItems: "center", justifyContent: "center", marginTop: 15 },
});
