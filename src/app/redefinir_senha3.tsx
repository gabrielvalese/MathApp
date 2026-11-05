    import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

export default function Index() {
  return (
    <View style={styles.conteiner}>
      <ScrollView>
      <View style={styles.redefinir_senha}>
         <Image 
          source={require('../../assets/images/logo.png')} 
          style={{ width: 100, height: 100, marginBottom: 20 }}
        />aaa
        <Text style={{fontSize: 30, fontWeight: 'bold'}}>Redefinir senha</Text>
        <View style={styles.area_input}>
          <Text style={{fontSize: 20}}>Nova senha</Text>
          <TextInput 
            style={styles.caixa_input} 
            placeholder="Digite sua senha" 
            placeholderTextColor="#424242"
            selectionColor="#000000"/>
          <View style={styles.confirmar_senha}>
          <Text style={{fontSize: 20}}>Confirmar nova senha</Text>
          <TextInput 
            style={styles.caixa_input} 
            placeholder="Confirme sua senha" 
            placeholderTextColor="#424242"
            selectionColor="#000000"/>
            </View>
        </View>
      <Pressable style={styles.botao_redefinir}>
          <Text style={{fontSize: 15, color: 'white'}}>Alterar senha</Text>
        </Pressable>
      </View>
    </ScrollView>
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
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  caixa_input: {
    backgroundColor: '#ffffff',
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
  },
  confirmar_senha: {
    marginTop: 30
  },


});