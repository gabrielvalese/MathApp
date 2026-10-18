import { Stack } from "expo-router";

export default function RootLayout() {
  const headerColor = "#f30b0b";

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: headerColor },
        headerTintColor: "white",
        headerTitleStyle: { fontWeight: "bold" },
      }}
    >
      {/* Tela principal / Home (index) */}
      <Stack.Screen name="index" options={{ headerShown: false }} />

      {/* Demais telas do sistema */}
      <Stack.Screen name="tela_questões" options={{ title: "Tela Questões" }} />
      <Stack.Screen name="tela_categoria" options={{  title: "Trilhas de aprendizado" }} />
      <Stack.Screen name="simulado" options={{ title: "Simulado" }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
    </Stack>
  );
}
// headerTintColor: cor do texto do cabeçalho da tela.
//links dinâmicos