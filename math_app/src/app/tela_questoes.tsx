import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { useState } from "react";
import Octicons from '@expo/vector-icons/Octicons';

export default function Index() {

  const [selecionada, setSelecionada] = useState('');

  return (
    
    <View style={styles.container}>
      <View style={styles.topo}>
        <Octicons name="stopwatch" size={50} color="black" />
        <Text style={{fontSize: 30, marginLeft: 20}}>57:50</Text>
      </View>
      <View style={styles.questions}>
        <View style={{width: "20%", height: "100%", backgroundColor: "lightgray", alignItems: "center", justifyContent: "center"}}>
          <Text style={{fontSize: 30, fontWeight: "bold"}}>1</Text>
        </View>
        <View style={{width: "20%", height: "100%", backgroundColor: "lightgray", alignItems: "center", justifyContent: "center"}}>
          <Text style={{fontSize: 30, fontWeight: "bold"}}>2</Text>
        </View>
        <View style={{width: "20%", height: "100%", backgroundColor: "lightgray", alignItems: "center", justifyContent: "center"}}>
          <Text style={{fontSize: 30, fontWeight: "bold"}}>3</Text>
        </View>
        <View style={{width: "20%", height: "100%", backgroundColor: "lightgray", alignItems: "center", justifyContent: "center"}}>
          <Text style={{fontSize: 30, fontWeight: "bold"}}>4</Text>
        </View>
      </View>
      <View style={styles.box_quest}>
        <Text style={{fontSize: 20}}>(UFPR) Imagine que um macaco digite sequências aleatórias de 3 letras em um teclado com apenas 5 letras: S, E, R, T, O. Qual é a probabilidade de ele escrever "SER" na primeira tentativa?</Text>
        <TouchableOpacity onPress={() => setSelecionada(selecionada === 'A' ? '' : 'A')}><Text style={{fontSize: 20, textDecorationLine: selecionada === 'A' ? 'line-through' : 'none', textDecorationColor: 'red'}}>A) 1/5</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => setSelecionada(selecionada === 'B' ? '' : 'B')}><Text style={{fontSize: 20, textDecorationLine: selecionada === 'B' ? 'line-through' : 'none', textDecorationColor: 'red'}}>B) 1/15</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => setSelecionada(selecionada === 'C' ? '' : 'C')}><Text style={{fontSize: 20, textDecorationLine: selecionada === 'C' ? 'line-through' : 'none', textDecorationColor: 'red'}}>C) 1/75</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => setSelecionada(selecionada === 'D' ? '' : 'D')}><Text style={{fontSize: 20, textDecorationLine: selecionada === 'D' ? 'line-through' : 'none', textDecorationColor: 'red'}}>D) 1/125</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => setSelecionada(selecionada === 'E' ? '' : 'E')}><Text style={{fontSize: 20, textDecorationLine: selecionada === 'E' ? 'line-through' : 'none', textDecorationColor: 'red'}}>E) 1/225</Text></TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.finalizar} onPress={() => {if (selecionada === '') {alert('Selecione sua resposta');} else (alert(`Resposta ${selecionada} selecionada!`))}}>
        <Text style={{color: "white", fontSize: 18}}>Finalizar Simulado</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    padding: '10%',
    gap: '2%',
  },
  topo: {
    width: "100%",
    height: '10%',
    flexDirection: "row",
    alignItems: "center",
  },
  questions: {
    flexDirection: "row",
    width: "100%",
    height: '8%',
    gap: '7%',
  },  
  box_quest: {
    width: "95%",
    height: "60%",
    marginTop: "15%",
    marginBottom: "10%",
    borderWidth: 1,
    borderColor: "black",
    gap: "5%",
    padding: "5%",
  },
  finalizar: {
    width: "50%",
    height: 50,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
  }
});
