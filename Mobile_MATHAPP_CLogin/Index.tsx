import { Redirect } from "expo-router";
import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { useAuth } from "./auth_context";

export default function Index() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#1E3A8A" />
        <Text style={{ marginTop: 10, color: "#1E3A8A" }}>Carregando...</Text>
      </View>
    );
  }

  return <Redirect href={user ? "/home" : "/login"} />;
}
