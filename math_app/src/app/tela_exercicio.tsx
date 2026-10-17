import { Entypo } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Exercicio from "./componente";
export default function Index() {
  return (
   
   <View style={styles.tela_geral}>
   <View style={styles.titulo}>
    <View style={styles.icone_categoria}><Entypo name="plus" size={32} color="black"/></View>
    <View><Text style={styles.texto_titulo}>Matemática Básica: Iniciante</Text></View>
    
    </View>
   
   <ScrollView contentContainerStyle={styles.container}>
    <Exercicio nome="A Conta do Restaurante" numero="00"/>
    <Exercicio nome="A Conta do Restaurante" numero="00"/>
    <Exercicio nome="A Conta do Restaurante" numero="00"/>
    <Exercicio nome="A Conta do Restaurante" numero="00"/>
    <Exercicio nome="A Conta do Restaurante" numero="00"/>
    <Exercicio nome="A Conta do Restaurante" numero="00"/>
    <Exercicio nome="A Conta do Restaurante" numero="00"/>
    <Exercicio nome="A Conta do Restaurante" numero="00"/>
    <Exercicio nome="A Conta do Restaurante" numero="00"/>
    <Exercicio nome="A Conta do Restaurante" numero="00"/>
    <Exercicio nome="A Conta do Restaurante" numero="00"/>
    <Exercicio nome="A Conta do Restaurante" numero="00"/>
    <Exercicio nome="A Conta do Restaurante" numero="00"/>
    <Exercicio nome="A Conta do Restaurante" numero="00"/>
    <Exercicio nome="A Conta do Restaurante" numero="00"/>
    <Exercicio nome="A Conta do Restaurante" numero="00"/>
    <Exercicio nome="A Conta do Restaurante" numero="00"/>
    <Exercicio nome="A Conta do Restaurante" numero="00"/>
    <Exercicio nome="A Conta do Restaurante" numero="00"/>
    <Exercicio nome="A Conta do Restaurante" numero="00"/>
    <Exercicio nome="A Conta do Restaurante" numero="00"/>
    <Exercicio nome="A Conta do Restaurante" numero="00"/>
    <Exercicio nome="A Conta do Restaurante" numero="00"/>
    <Exercicio nome="A Conta do Restaurante" numero="00"/>
  </ScrollView>
  </View>
  );
}
const styles = StyleSheet.create({
  tela_geral: {
    flex: 1
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  titulo: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#c2c2c2',
    width: '100%',
    height: 100,
    borderRadius: 8,
    flexDirection: 'row',
    marginBottom: 5
  },
  texto_titulo: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  icone_categoria: {
    width: '20%',
    alignItems:'center',
    justifyContent: 'center'
  },
  titulo_categoria: {
    flex: 1,
    alignItems:'center',
    justifyContent: 'center'
  },

});
