import { Feather, FontAwesome6 } from "@expo/vector-icons";
import { Link } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function Index() {
  return (
    <SafeAreaProvider>
      <View style={styles.conteiner}>
       <ScrollView contentContainerStyle={styles.scrollContent}>
  {/* estiliza o container. Com o "styles" apenas, só muda o comportamento do scrollview */}
          <View style={styles.tela_geral}>
            <View><Text>Logo</Text></View>
            <View style={styles.msg_saudacao}><Text style={styles.texto_msg}>Olá, [Usuário]</Text></View>

            <View style={styles.ranking}>
              <View style={styles.icone_ranking}>
                <FontAwesome6 name="trophy" size={45} color="black"/>
              </View>
              <View style={styles.caixa_texto_ranking}>
                <Text style={styles.texto_ranking}>Ranking</Text>
                <View style={styles.linha_ranking}/>
              </View>

              <View style={styles.pontuacao}>
                <View style={styles.icone_pontuacao}>
                  <Feather name="trending-up" size={35} color="black"/>
                </View>
                <View style={styles.texto_pontuacao}>
                  <Text style={{fontSize: 20, marginLeft: 10}}>Pontução</Text>
                  <View style={styles.linha_pontuacao}/>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={{paddingRight: 5, paddingTop: 10, fontSize: 15}}>267,17</Text>
                    <Text style={{paddingTop: 10, fontSize: 15}}>Pontos</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.desafio_diario}>
              <View style={styles.titulo_desafio_diario}>
                <Text style={{fontSize: 25}}>Desafio Diário</Text>
              </View>
              <View style={styles.texto_desafio_diario}>
                <Text style={{fontSize: 16}}>(UFPR-2020) Imagine que um macaco digite sequências aleatórias de 3 letras...</Text>
              </View>
              <View style={styles.botao_resolver}>
                <Link href="/" style={styles.botaoPreto}>
                  <Text style={{fontSize: 18, color: '#ffffff'}}>Resolver agora</Text>
                </Link>

              </View>
            </View>

            <View style={styles.problemas}>
              <View style={styles.icone_problemas}>
                <FontAwesome6 name="box-open" size={60} color="#36415c"/>
              </View>
              <TouchableOpacity style={styles.texto_problemas}>
                <Text style={{fontSize: 30, paddingBottom: 5}}>Problemas</Text>
                <Text>Polinômios, Matrizes,</Text>
                <Text>Expressões Numéricas</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.simulados}>
              <View style={styles.icone_simulados}>
                <FontAwesome6 name="chess-king" size={60} color="#000000"/>
              </View>
              <View style={styles.texto_simulados}>
                  <Text style={{fontSize: 30, paddingBottom: 5}}>Simulados</Text>
                </View>
                <TouchableOpacity>
                  <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#000' }}>Login (test)</Text>
                </TouchableOpacity>
              </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaProvider>
  );
};
const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 30,
  },
  tela_geral: {
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 0,
  },
  conteiner: {
    justifyContent: 'space-between',
    flex: 1,
    backgroundColor: '#fff'
  },
  logo: {
    
  },
  msg_saudacao: {
    width: '85%',
    height: 50,
    alignItems: 'flex-start',
    
  },
  texto_msg: {
    fontSize: 35
  },
  ranking: {
    height: 100,
    width: '90%',
    borderRadius: 10,
    flexDirection: 'row',
    backgroundColor: '#D9D9D9'
  },
  icone_ranking: {
    width: '25%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  caixa_texto_ranking: {
    width: '25%',
    height: '50%',
    alignItems: 'center',
    justifyContent: 'center'  

  },
  texto_ranking: {
    fontSize: 15,
    marginTop: 30,
    marginRight: 25
  },
  linha_ranking: {
    width: '70%', 
    height: 2, 
    backgroundColor: '#000000',
    marginTop: 5,
    marginRight: 25
  },
  pontuacao: {
    width: '50%',
    borderLeftWidth: 2,
    borderLeftColor: '#A8A5A5',
    flexDirection: 'row'
    
  },
  icone_pontuacao: {
    width: '30%',
    alignItems: 'center',
    marginTop: 20,
    
  },
  texto_pontuacao: {
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    
  },
   linha_pontuacao: {
    width: '90%', 
    height: 2, 
    backgroundColor: '#000000',
    marginTop: 5,
    marginLeft: 10
  },
  desafio_diario: {
    height: 260,
    width: '90%',
    borderRadius: 10,
    flexDirection: 'column',
    backgroundColor: '#D9D9D9',
    marginTop: 20,
    alignItems: 'center'
    
  },
  titulo_desafio_diario: {
    justifyContent: 'center',
    height: '20%',
    width: '100%',
    marginTop: 30,
    paddingLeft: 25
  },
  texto_desafio_diario: {
    width: '80%',
    height: '30%',
  },
  botao_resolver: {
    justifyContent: 'center',
    width: '100%',
    paddingLeft: 25,
  },
  botaoPreto: {
    backgroundColor: '#000000', 
    borderRadius: 6,             
    width: 200,
    height: 50,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 25
  },
  problemas: {
    height: 130,
    width: '100%',
    borderRadius: 10,
    flexDirection: 'row',
    backgroundColor: '#D9D9D9',
    marginTop: 40,
    alignItems: 'center'
  },
  icone_problemas: {
    width: '30%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  texto_problemas: {
    width: '70%',
    height: '100%',
    justifyContent: 'flex-start',
    paddingLeft: 20,
    paddingTop: 10
  },
  simulados: {
    height: 130,
    width: '100%',
    borderRadius: 10,
    flexDirection: 'row',
    backgroundColor: '#D9D9D9',
    marginTop: 20,
    alignItems: 'center'
  },
  icone_simulados: {
    width: '40%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  texto_simulados: {
    width: '60%',
    height: '100%',
    justifyContent: 'center',
    paddingBottom: 10
  },
  rodape: {
    flexDirection: 'row',
    height: 100,
    width: '100%',
    backgroundColor: '#D9D9D9',
    alignItems: 'flex-end',
    justifyContent: 'space-evenly',

  },
  icones_rodape: {
    marginBottom: 20
  }
 
 
  

});