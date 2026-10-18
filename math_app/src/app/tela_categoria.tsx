import { Entypo } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Categoria from "./componente";
export default function Index() {
  return (
   
   <View style={styles.tela_geral}>
   <View style={{alignItems: 'center'}}>
   <View style={styles.titulo}>
    <Text style={styles.texto_titulo}>Trilhas de aprendizado</Text>
    </View>
    </View>
   <ScrollView contentContainerStyle={styles.container}>
    <Categoria nome="Matemática Básica" icone={<Entypo name="plus" size={32} color="black"/>} />
    <Categoria nome="Matemática Básica" icone={<Entypo name="plus" size={32} color="black"/>} />
    <Categoria nome="Matemática Básica" icone={<Entypo name="plus" size={32} color="black"/>} />
    <Categoria nome="Matemática Básica" icone={<Entypo name="plus" size={32} color="black"/>} />
    <Categoria nome="Matemática Básica" icone={<Entypo name="plus" size={32} color="black"/>} />
    <Categoria nome="Matemática Básica" icone={<Entypo name="plus" size={32} color="black"/>} />
    <Categoria nome="Matemática Básica" icone={<Entypo name="plus" size={32} color="black"/>} />
    <Categoria nome="Matemática Básica" icone={<Entypo name="plus" size={32} color="black"/>} />
    <Categoria nome="Matemática Básica" icone={<Entypo name="plus" size={32} color="black"/>} />
    <Categoria nome="Matemática Básica" icone={<Entypo name="plus" size={32} color="black"/>} />
    <Categoria nome="Matemática Básica" icone={<Entypo name="plus" size={32} color="black"/>} />
  </ScrollView>
  </View>
  );
}
const styles = StyleSheet.create({
  tela_geral: {
    flex: 1,
    
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  titulo: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#c2c2c2',
    width: '90%',
    height: 100,
    borderRadius: 8,
    
  },
  texto_titulo: {
    fontSize: 20,
    fontWeight: 'bold'
  }

});
