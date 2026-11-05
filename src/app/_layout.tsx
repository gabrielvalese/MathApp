// app/_layout.tsx
import { Stack } from "expo-router";
import { AuthProvider } from "./auth_context";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="home" />
        <Stack.Screen name="perfil" />
        <Stack.Screen name="simulado" />
        <Stack.Screen name="tela_categoria" />
        <Stack.Screen name="tela_questao" />
        <Stack.Screen name="QuestoesBase/[id]" />
        <Stack.Screen name="redefinir_senha1" />
        <Stack.Screen name="redefinir_senha2" />
        <Stack.Screen name="redefinir_senha3" />
      </Stack>
    </AuthProvider>
  );
}