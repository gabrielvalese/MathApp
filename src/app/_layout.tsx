// app/_layout.tsx
import { Tabs } from "expo-router";
import { AuthProvider } from "./auth_context";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Tabs
        detachInactiveScreens={false}
        screenOptions={{
          headerShown: false,
          // Animação de deslize entre abas (funciona no Expo Router)
          animation: 'fade', // ou 'fade' se preferir
          tabBarStyle: { display: 'none' }, // esconde a barra padrão; usaremos a nossa
        }}
      >
        <Tabs.Screen name="home" />
        <Tabs.Screen name="simulado" />
        <Tabs.Screen name="perfil" />
        {/* Telas que não são abas (login, register, etc.) */}
        <Tabs.Screen name="login" options={{ href: null }} />
        <Tabs.Screen name="register" options={{ href: null }} />
        <Tabs.Screen name="index" options={{ href: null }} />
        <Tabs.Screen name="tela_categoria" options={{ href: null }} />
        <Tabs.Screen name="tela_questao" options={{ href: null }} />
        <Tabs.Screen name="redefinir_senha1" options={{ href: null }} />
        <Tabs.Screen name="redefinir_senha2" options={{ href: null }} />
        <Tabs.Screen name="redefinir_senha3" options={{ href: null }} />
      </Tabs>
    </AuthProvider>
  );
}