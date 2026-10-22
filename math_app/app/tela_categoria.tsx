import { Entypo } from "@expo/vector-icons";
import { ScrollView, StyleSheet, View } from "react-native";
import Categoria from "../app/componentes/categoria";
export default function Index() {
  return (
   
   <View style={styles.tela_geral}>
   <View style={{alignItems: 'center'}}>
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
  }
});