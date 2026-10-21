import { Feather, FontAwesome, FontAwesome6, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

export default function Index() {
  return (
    <View style={styles.conteiner}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.tela_geral}>
          
          <Image 
            source={require('../../assets/images/logo.png')}
            style={{ width: 100, height: 100, marginBottom: 20 }}
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

          <View style={styles.desafio_diario}>
            <View style={styles.titulo_desafio_diario}>
              <Text style={{fontSize: 22, fontWeight: 'bold', color: '#1E3A8A'}}>Desafio Diário</Text>
            </View>
            <View style={styles.texto_desafio_diario}>
              <Text style={{fontSize: 15, color: '#1E3A8A'}}>(UFPR-2020) Imagine que um macaco digite sequências aleatórias de 3 letras...</Text>
            </View>
            <View style={styles.botao_resolver}>
              <Link href="/tela_questao" style={styles.botaoLaranja}>
                <Text style={{fontSize: 16, color: '#ffffff', textAlign: 'center'}}>Resolver agora</Text>
              </Link>
            </View>
          </View>

          <View style={styles.problemas}>
            <View style={styles.icone_problemas}>
              <FontAwesome6 name="box-open" size={50} color="#1E3A8A"/>
            </View>
            <Link href="/tela_categoria" style={{flex: 1}}>
              <View style={styles.texto_problemas}>
                <Text style={{fontSize: 22, fontWeight: 'bold', paddingBottom: 4, color: '#1E3A8A'}}>Problemas</Text>
                <Text style={{fontSize: 14, color: '#1E3A8A'}}>Polinômios, Matrizes,</Text>
                <Text style={{fontSize: 14, color: '#1E3A8A'}}>Expressões Numéricas</Text>
              </View>
            </Link>
          </View>

          <View style={styles.simulados}>
            <View style={styles.icone_simulados}>
              <FontAwesome6 name="chess-king" size={50} color="#1E3A8A"/>
            </View>
            <Link href="/simulado" style={{flex: 1}}>
              <View style={styles.texto_simulados}>
                <Text style={{fontSize: 24, fontWeight: 'bold', color: '#1E3A8A'}}>Simulados</Text>
              </View>
            </Link>
          </View>

        </View>
      </ScrollView>

      <View style={styles.rodape}>
        <Link href="/redefinir_senha2">
          <FontAwesome name="graduation-cap" size={35} color="#1E3A8A" style={styles.icones_rodape}/>
        </Link>
        <Link href="/redefinir_senha1">
          <MaterialCommunityIcons name="podium-gold" size={35} color="#1E3A8A" style={styles.icones_rodape}/>
        </Link>
        <Link href="/login">
          <Ionicons name="person" size={35} color="#1E3A8A" style={styles.icones_rodape}/>
        </Link>
      </View>    
    </View>
  );
}

const styles = StyleSheet.create({
  conteiner: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'space-between',
  },
  scrollContent: {
    paddingBottom: 30,
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
    borderRadius: 10,
    flexDirection: 'row',
    backgroundColor: '#D9D9D9',
    paddingVertical: 15,
    marginBottom: 15,
    alignItems: 'center',
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
    borderLeftColor: '#A8A5A5',
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
    borderRadius: 10,
    backgroundColor: '#D9D9D9',
    marginTop: 10,
    padding: 20,
    alignItems: 'stretch',
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
    borderRadius: 6,            
    width: '100%',
    maxWidth: 250,
    paddingVertical: 12,
    textAlign: 'center',
  },
  problemas: {
    width: '100%',
    borderRadius: 10,
    flexDirection: 'row',
    backgroundColor: '#D9D9D9',
    marginTop: 15,
    padding: 20,
    alignItems: 'center',
  },
  icone_problemas: {
    width: '30%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  texto_problemas: {
    width: '100%',
    paddingLeft: 40,
  },
  simulados: {
    width: '100%',
    borderRadius: 10,
    flexDirection: 'row',
    backgroundColor: '#D9D9D9',
    marginTop: 15,
    padding: 20,
    alignItems: 'center',
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
    height: 70,
    width: '100%',
    backgroundColor: '#D9D9D9',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  icones_rodape: {}
});
