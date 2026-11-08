import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

export default function Index() {
  return (
    <View style={styles.conteiner}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.area_codigo_redefinirsenha}>
          <Image 
            source={require('../../assets/images/logo.png')} 
            style={{ width: 90, height: 90, marginBottom: 16, resizeMode: 'contain' }}
          />
          <Text style={styles.titulo}>Redefinir senha</Text>
          <Text style={styles.subtitulo}>Digite o código enviado para o seu e-mail</Text>
          
          <View style={styles.area_codigo}>
            <Text style={styles.labelInput}>Código de verificação</Text>
            <View style={styles.containerCodigos}>
              <TextInput style={styles.caixaCodigo} maxLength={1} keyboardType="number-pad" placeholderTextColor="#94A3B8" selectionColor="#F97316" />
              <TextInput style={styles.caixaCodigo} maxLength={1} keyboardType="number-pad" placeholderTextColor="#94A3B8" selectionColor="#F97316" />
              <TextInput style={styles.caixaCodigo} maxLength={1} keyboardType="number-pad" placeholderTextColor="#94A3B8" selectionColor="#F97316" />
              <TextInput style={styles.caixaCodigo} maxLength={1} keyboardType="number-pad" placeholderTextColor="#94A3B8" selectionColor="#F97316" />
              <TextInput style={styles.caixaCodigo} maxLength={1} keyboardType="number-pad" placeholderTextColor="#94A3B8" selectionColor="#F97316" />
            </View>
          </View>

          <Pressable style={styles.botao_verificar}>
            <Text style={styles.textoBotao}>Verificar</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  conteiner: {
    flex: 1,
    backgroundColor: '#F1F5F9', // Fundo claro e moderno do app
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
  area_codigo_redefinirsenha: {
    width: '100%',
    maxWidth: 420, // Garante responsividade sem esticar demais em telas grandes
    alignItems: 'center',
    paddingTop: 30,
    backgroundColor: '#FFFFFF', // Card branco limpo
    borderRadius: 16,
    paddingVertical: 45,
    paddingHorizontal: 24,
    // Borda preta com transparência que você curtiu
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
    color: '#0B132B', // Azul escuro MathVerse
    textAlign: 'center',
  },
  subtitulo: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
    marginBottom: 8,
    textAlign: 'center',
  },
  area_codigo: {
    backgroundColor: '#FFF7ED', // Fundo em tom pastel suave de laranja
    width: '100%',
    marginTop: 24,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderWidth: 1,
    borderColor: '#FFEDD5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelInput: {
    fontSize: 14,
    color: '#C2410C', // Laranja queimado para destacar o título da seção
    fontWeight: '700',
    marginBottom: 4,
  },
  containerCodigos: {
    flexDirection: 'row',       
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 15,
  },
  caixaCodigo: {
    backgroundColor: '#FFFFFF', 
    width: 46,                  
    height: 46,                 
    borderRadius: 8,
    textAlign: 'center',        
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0B132B',           // Texto escuro para legibilidade perfeita no fundo claro
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  botao_verificar: {
    backgroundColor: '#F97316', // Laranja vibrante principal do MathVerse
    width: '100%',              
    height: 48,
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