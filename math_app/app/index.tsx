import { Redirect } from "expo-router";
import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { useAuth } from "../FirebaseConfig/auth_context";

export default function Home() {
  return (
    <View style={styles.conteiner}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.tela_geral}>
          
          <Image 
            source={require('../../assets/images/logo.png')}
            style={{ marginVertical : 20,marginHorizontal: 20, marginBottom: 20 }}
          />
          
          <View style={styles.msg_saudacao}>
            <Text style={styles.texto_msg}>Olá, [Usuário]</Text>
          </View>
          
          <View style={styles.ranking}>
            <View style={styles.icone_ranking}>
              <FontAwesome6 name="trophy" size={40} color="#1E3A8A"/>
            </View>
            <View style={styles.caixa_texto_ranking}>
              <Text style={styles.texto_ranking}>Ranking</Text>
              <View style={styles.linha_ranking}/>
            </View>
            
            <View style={styles.pontuacao}>
              <View style={styles.icone_pontuacao}>
                <Feather name="trending-up" size={30} color="#1E3A8A"/>
              </View>
              <View style={styles.texto_pontuacao}>
                <Text style={{fontSize: 16, fontWeight: 'bold', color: '#1E3A8A'}}>Pontuação</Text>
                <View style={styles.linha_pontuacao}/>
                <View style={{flexDirection: 'row', alignItems: 'baseline'}}>
                  <Text style={{paddingRight: 4, paddingTop: 6, fontSize: 14, fontWeight: 'bold', color: '#1E3A8A'}}>267,17</Text>
                  <Text style={{paddingTop: 6, fontSize: 12, color: '#1E3A8A'}}>Pontos</Text>
                </View>
              </View>
            </View> 
          </View>

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
