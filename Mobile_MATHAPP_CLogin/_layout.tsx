// app/_layout.tsx
import { Stack } from "expo-router";
import { AuthProvider } from "./auth_context";

export default function RootLayout() {
  const headerColor = "#f30b0b";

  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: headerColor },
          headerTintColor: "white",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="home" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ title: "Criar conta" }} />

        <Stack.Screen name="tela_categoria" options={{ title: "Trilhas de aprendizado" }} />
        <Stack.Screen name="tela_questao" options={{ title: "Questão" }} />
        <Stack.Screen name="simulado" options={{ title: "Simulado" }} />

        <Stack.Screen name="redefinir_senha1" options={{ title: "Redefinir senha" }} />
        <Stack.Screen name="redefinir_senha2" options={{ title: "Código de verificação" }} />
        <Stack.Screen name="redefinir_senha3" options={{ title: "Nova senha" }} />
      </Stack>
    </AuthProvider>
  );
}
