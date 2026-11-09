// app/_layout.tsx
import { Stack } from "expo-router";
import { AuthProvider } from "../contexts/auth_context";
import { ThemeProvider } from "../contexts/theme_context";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="login" />
          <Stack.Screen name="register" />
          <Stack.Screen name="home" />
          <Stack.Screen name="perfil" />
          <Stack.Screen name="simulado" />
          <Stack.Screen name="tela_categoria" />
          <Stack.Screen name="QuestoesBase/[id]" />
          <Stack.Screen name="desafio_diario" />         
          <Stack.Screen name="redefinir_senha1" />
          <Stack.Screen name="verificar_email" />
        </Stack>
      </AuthProvider>
    </ThemeProvider>
  );
}