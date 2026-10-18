import { Pressable, StyleSheet, Text, View } from "react-native";

export default function Categoria(props: any) {
  return (
    <Pressable style={styles.container}>
      <View style={styles.icone_categoria1}>{props.icone}</View>
      <View style={styles.categoria1}>
        <Text style={styles.nome_categoria1}>{props.nome}</Text>
      </View>
   </Pressable>
  
  );
}
const styles = StyleSheet.create({
  container: {        
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    flexDirection: 'row',
    width: '80%',
    minHeight: 100,
    borderRadius: 2,
    margin: 15
    
  },
  categoria1: {
    width: '80%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    
  },
  icone_categoria1: {
    width: '20%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  nome_categoria1: {
    fontSize: 20
  }

});
 