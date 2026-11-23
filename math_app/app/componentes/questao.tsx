import { Pressable, StyleSheet, Text, View } from "react-native";

export default function Exercicio(props: any) {
  return (
    <Pressable style={styles.container}>
      <View style={styles.numero_exercicio}><Text style={{fontSize: 20, fontWeight: 'bold'}}>{props.numero}</Text></View>
      <View style={styles.separador}><Text style={styles.texto_separador}>-</Text></View>
      <View style={styles.exercicio}>
        <Text style={styles.nome_exercicio}>{props.nome}</Text>
      </View>
   </Pressable>
  
  );
}
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    flexDirection: 'row',
    width: '80%',
    minHeight: 45,
    borderRadius: 2,
    borderBottomWidth: 0, 
    
  },
  separador: {
    width: '8%',
    minHeight: 45,
    alignItems: 'center',
    justifyContent: 'center'
  },
  texto_separador:{
    fontSize:  30
  },
  exercicio: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    
    
  },
  numero_exercicio: {
    width: '20%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  
  },
  nome_exercicio: {
    fontSize: 20
  }

});
 