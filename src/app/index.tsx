import { Redirect } from "expo-router";
import { signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { useAuth } from "../contexts/auth_context";
import { useTheme } from "../contexts/theme_context";
import { auth } from "../utils/FirebaseConfig";
import { getLembrar, limparLembrar } from "../utils/storage";

export default function Index() {
  const { user, loading } = useAuth();
  const { cores } = useTheme();
  const [limpando, setLimpando] = useState(false);

  useEffect(() => {
    async function verificarLembrar() {
      if (!user) return;
      const lembrar = await getLembrar();
      if (!lembrar) {
        setLimpando(true);
        await signOut(auth);
        await limparLembrar();
        setLimpando(false);
      }
    }
    verificarLembrar();
  }, [user]);

  if (loading || limpando) {
    return (
      <View style={{ flex: 1, backgroundColor: cores.fundo, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={cores.laranja} />
        <Text style={{ marginTop: 10, color: cores.texto }}>Carregando...</Text>
      </View>
    );
  }

  return <Redirect href={user ? "/home" : "/login"} />;
}