import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

export default function Index() {
  return (
    <View style={styles.conteiner}>
      <ScrollView>
        <View style={styles.area_codigo_redefinirsenha}>
          <Image 
            source={require('../../assets/images/logo.png')} 
            style={{ width: 100, height: 100, marginBottom: 20 }}
          />
        <Text style={{fontSize: 30, fontWeight: 'bold'}}>Redefinir senha</Text>
        <View style={styles.area_codigo}>
          <Text style={{fontSize: 20}}>Código de verificação</Text>
          <View style={styles.containerCodigos}>
  <TextInput style={styles.caixaCodigo} maxLength={1} keyboardType="number-pad" />
  <TextInput style={styles.caixaCodigo} maxLength={1} keyboardType="number-pad" />
  <TextInput style={styles.caixaCodigo} maxLength={1} keyboardType="number-pad" />
  <TextInput style={styles.caixaCodigo} maxLength={1} keyboardType="number-pad" />
  <TextInput style={styles.caixaCodigo} maxLength={1} keyboardType="number-pad" />
</View>
        </View>
      <Pressable style={styles.botao_verificar}>
          <Text style={{fontSize: 15, color: 'white'}}>Verificar</Text>
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
  area_codigo_redefinirsenha: {
    width: '90%',
    alignItems: 'center',
    paddingTop: 30,
    backgroundColor: '#fafffe',
    borderRadius: 10,
    paddingVertical: 80
  },
  area_codigo: {
    backgroundColor: '#D7D7D7',
    width: '80%',
    marginTop: 30,
    borderRadius: 6,
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
 containerCodigos: {
  flexDirection: 'row',      
  justifyContent: 'space-between',
  width: '100%',
  marginTop: 15,
},
caixaCodigo: {
  backgroundColor: '#636262', 
  width: 45,                 
  height: 45,                
  borderRadius: 8,
  textAlign: 'center',       
  fontSize: 20,
  fontWeight: 'bold',
  color: '#ffffff',
},
  botao_verificar: {
    backgroundColor: '#000000', 
    width: '50%',               
    height: 45,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,  
  }


});