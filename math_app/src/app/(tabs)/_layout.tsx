import {
  Ionicons,
  MaterialCommunityIcons
} from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarActiveTintColor: "#d9d9d9",
        tabBarInactiveTintColor: "#aeaeae",

        tabBarStyle: {
          height: 80,
          paddingBottom: 10,
          paddingTop: 8,
          backgroundColor: "#1b1a1a"
        },

        tabBarLabelStyle: {
          fontSize: 12,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
        }}
      />

      <Tabs.Screen
        name="ranking"
        options={{
          title: "Ranking",

          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="podium-gold"
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="perfil"
        options={{
          title: "Perfil",

          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="person"
              size={size}
              color={color}
            />
          ),
        }}
      />

      
    </Tabs>
  );
}