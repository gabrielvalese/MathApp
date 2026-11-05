
import { Redirect } from "expo-router";
import { signOut } from "firebase/auth";
import { useEffect, useState } from "react";

import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useAuth } from "./auth_context";
import { auth } from "./FirebaseConfig";
import { getLembrar, limparLembrar } from "./storage";


export default function Index() {
  const { user, loading } = useAuth();
  const [limpando, setLimpando] = useState(false);

  useEffect(() => {
    async function verificarLembrar() {
      if (!user) return;
      const lembrar = await getLembrar();
      if (!lembrar) {
        // Sessão antiga sem "lembrar-me": desloga ao abrir o app
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
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#1E3A8A" />
        <Text style={{ marginTop: 10, color: "#1E3A8A" }}>Carregando...</Text>
      </View>
    );
  }

  return <Redirect href={user ? "/home" : "/login"} />;
}

const styles = StyleSheet.create({
  conteiner: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'space-between',
  },
  scrollContent: {
    paddingBottom: 30,
    paddingTop: 10,
  },
  tela_geral: {
    alignItems: 'center',
    paddingHorizontal: '5%',
    width: '100%',
  },
  msg_saudacao: {
    width: '100%',
    marginBottom: 15,
    alignItems: 'flex-start',
  },
  texto_msg: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E3A8A',
  },
  ranking: {
    width: '100%',
    borderRadius: 12,
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    paddingVertical: 15,
    marginBottom: 15,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  icone_ranking: {
    width: '20%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  caixa_texto_ranking: {
    width: '30%',
    alignItems: 'flex-start',
    paddingLeft: 5,
  },
  texto_ranking: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E3A8A',
  },
  linha_ranking: {
    width: '80%', 
    height: 2, 
    backgroundColor: '#F97316',
    marginTop: 4,
  },
  pontuacao: {
    width: '50%',
    borderLeftWidth: 1.5,
    borderLeftColor: '#CBD5E1',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
  },
  icone_pontuacao: {
    width: '25%',
    alignItems: 'center',
  },
  texto_pontuacao: {
    width: '75%',
    justifyContent: 'center',
  },
  linha_pontuacao: {
    width: '90%', 
    height: 2, 
    backgroundColor: '#F97316',
    marginTop: 4,
  },
  desafio_diario: {
    width: '100%',
    borderRadius: 12,
    backgroundColor: '#F8FAFC', 
    marginTop: 5,
    padding: 20,
    alignItems: 'stretch',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  titulo_desafio_diario: {
    marginBottom: 8,
  },
  texto_desafio_diario: {
    marginBottom: 15,
  },
  botao_resolver: {
    alignItems: 'center',
  },
  botaoLaranja: {
    backgroundColor: '#F97316', 
    borderRadius: 8,             
    width: '100%',
    maxWidth: 250,
    paddingVertical: 12,
    textAlign: 'center',
    fontWeight: 'bold',
    overflow: 'hidden',
  },
  problemas: {
    width: '100%',
    borderRadius: 12,
    flexDirection: 'row',
    backgroundColor: '#F8FAFC', 
    marginTop: 15,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  icone_problemas: {
    width: '30%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  texto_problemas: {
    width: '100%',
    paddingLeft: 20,
  },
  simulados: {
    width: '100%',
    borderRadius: 12,
    flexDirection: 'row',
    backgroundColor: '#F8FAFC', 
    marginTop: 15,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  icone_simulados: {
    width: '25%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  texto_simulados: {
    width: '100%',
    paddingLeft: 10,
  },
  rodape: {
    flexDirection: 'row',
    height: 65,
    width: '100%',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopWidth: 1.5,
    borderTopColor: '#E2E8F0',
  },
  icones_rodape: {}
}); 