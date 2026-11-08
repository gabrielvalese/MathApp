import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

export default function Index() {
  return (
    <View style={styles.conteiner}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.redefinir_senha}>
          
          <Image 
            source={require('../../assets/images/logo.png')} 
            style={{ width: 90, height: 90, marginBottom: 16, resizeMode: 'contain' }}
          />

          <Text style={styles.titulo}>Redefinir senha</Text>
          <Text style={styles.subtitulo}>Enviaremos instruções para o seu e-mail</Text>
          
          <View style={styles.area_input}>
            <Text style={styles.labelInput}>Informe seu e-mail</Text>
            <TextInput 
              style={styles.caixa_input} 
              placeholder="Digite seu e-mail" 
              placeholderTextColor="#94A3B8"
              selectionColor="#F97316"
            />
          </View>

          <Pressable style={styles.botao_redefinir}>
            <Text style={styles.textoBotao}>Redefinir Senha</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  conteiner: {
    flex: 1, 
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    width: '100%',
  },
  redefinir_senha: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    paddingTop: 30,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 45,
    paddingHorizontal: 24,
    borderWidth: 1.5,
    borderColor: 'rgba(0, 0, 0, 0.15)', 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 5,
  },
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#0B132B', 
    textAlign: 'center',
  },
  subtitulo: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
    marginBottom: 8,
    textAlign: 'center',
  },
  area_input: {
    backgroundColor: '#FFF7ED',
    width: '100%',
    marginTop: 24,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#FFEDD5',
  },
  labelInput: {
    fontSize: 14,
    color: '#C2410C',
    fontWeight: '700',
    marginBottom: 6,
  },
  caixa_input: {
    backgroundColor: '#FFFFFF',
    marginTop: 4,
    borderRadius: 8,
    height: 44,
    color: '#0B132B',
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    fontSize: 15,
  },
  botao_redefinir: {
    backgroundColor: '#F97316',
    width: '100%',              
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 28,
    shadowColor: '#F97316',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  textoBotao: {
    fontSize: 16, 
    color: '#FFFFFF',
    fontWeight: 'bold',
    letterSpacing: 0.5,
  }
});