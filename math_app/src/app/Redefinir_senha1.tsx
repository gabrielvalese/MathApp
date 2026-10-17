import { Image, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export default function Index() {
  return (
    <View style={styles.conteiner}>
      <View style={styles.redefinir_senha}>
         <Image 
  source={require("../assets/images/ChatGPT Image 12 de ago. de 2026, 15_54_29.png")} 
  style={{ width: 100, height: 100, resizeMode: 'contain', borderRadius: 10 }} 
/>
        <Text style={{fontSize: 30, fontWeight: 'bold'}}>Redefinir senha</Text>
        <View style={styles.area_input}>
          <Text style={{fontSize: 20}}>Informe seu e-mail</Text>
          <TextInput 
            style={styles.caixa_input} 
            placeholder="Digite seu e-mail" 
            placeholderTextColor="#424242"
            selectionColor="#000000"/>
        </View>
      <Pressable style={styles.botao_redefinir}>
          <Text style={{fontSize: 15, color: 'white'}}>Redefinir Senha</Text>
        </Pressable>
      </View>
    </View>
);
}
const styles = StyleSheet.create({
  conteiner: {
    flex: 1,
    backgroundColor: '#494848',
    alignItems: 'center',
    justifyContent: 'center'
  },
  redefinir_senha: {
    width: '90%',
    alignItems: 'center',
    paddingTop: 30,
    backgroundColor: '#fafffe',
    borderRadius: 10,
    paddingVertical: 80
  },
  area_input: {
    backgroundColor: '#D7D7D7',
    width: '80%',
    marginTop: 30,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 10
  },
  caixa_input: {
    backgroundColor: '#FFFFFF',
    marginTop: 6,
    borderRadius: 6,
    height: 38,
    color: '#000000',
    paddingHorizontal: 10,
  },
  botao_redefinir: {
    backgroundColor: '#000000', 
    width: '50%',               
    height: 45,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,  
  }


});
