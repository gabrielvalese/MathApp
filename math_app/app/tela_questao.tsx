import { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Index() {

  const [selecionada, setSelecionada] = useState('');

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}  >
    <View style={styles.container}>
      
        <View style={styles.box_quest}>
          <Text style={{fontSize: 20}}>(UFPR) Imagine que um macaco digite sequências aleatórias de 3 letras em um teclado com apenas 5 letras: S, E, R, T, O. Qual é a probabilidade de ele escrever "SER" na primeira tentativa?</Text>
          <TouchableOpacity onPress={() => setSelecionada(selecionada === 'A' ? '' : 'A')}><Text style={{fontSize: 20, textDecorationLine: selecionada === 'A' ? 'line-through' : 'none', textDecorationColor: 'red'}}>A) 1/5</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => setSelecionada(selecionada === 'B' ? '' : 'B')}><Text style={{fontSize: 20, textDecorationLine: selecionada === 'B' ? 'line-through' : 'none', textDecorationColor: 'red'}}>B) 1/15</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => setSelecionada(selecionada === 'C' ? '' : 'C')}><Text style={{fontSize: 20, textDecorationLine: selecionada === 'C' ? 'line-through' : 'none', textDecorationColor: 'red'}}>C) 1/75</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => setSelecionada(selecionada === 'D' ? '' : 'D')}><Text style={{fontSize: 20, textDecorationLine: selecionada === 'D' ? 'line-through' : 'none', textDecorationColor: 'red'}}>D) 1/125</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => setSelecionada(selecionada === 'E' ? '' : 'E')}><Text style={{fontSize: 20, textDecorationLine: selecionada === 'E' ? 'line-through' : 'none', textDecorationColor: 'red'}}>E) 1/225</Text></TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.finalizar} onPress={() => {if (selecionada === '') {alert('Selecione sua resposta');} else (alert(`Resposta ${selecionada} selecionada!`))}}>
          <Text style={{color: "white", fontSize: 18}}>Enviar Resposta</Text>
        </TouchableOpacity>
      
    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  container: {
    flexDirection: "column",
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 20,
    gap: 10,
  },  
  box_quest: {
    width: "95%",
    maxWidth: 500,
    marginTop: "15%",
    marginBottom: "10%",
    borderWidth: 1,
    borderColor: "black",
    gap: 10,
    padding: 20,
    borderRadius: 10,
  },
  finalizar: {
    width: "50%",
    paddingVertical: 10,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
  }
});