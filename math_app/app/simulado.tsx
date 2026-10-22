import { FontAwesome, FontAwesome6, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

export default function Index() {
  return (
    <View style={styles.conteiner}>
    <ScrollView contentContainerStyle={styles.tela_geral}>

    
    <View style={styles.cabecalho}>
      <FontAwesome6 name="chess-king" size={50} color="#000000"/>
      <Text style={{paddingLeft: 20, fontSize: 20}}>Simulado</Text>
      </View>
    
    
    {/*assuntos*/}
    
    <View style={styles.assuntos}>
      <View style={styles.titulo_assuntos}>
        <Text style={{fontSize: 28}}>Assuntos</Text>
      </View>
      {/*
      <View style={styles.filtro_assuntos}>
            <TouchableOpacity style={styles.filtro_selecionado}>
              <Text style={{fontSize: 14, color: '#ffffff'}}>Matrizes</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.filtro}>
              <Text style={{fontSize: 14, color: '#333333'}}>Polinômios</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.filtro}>
              <Text style={{fontSize: 14, color: '#333333'}}>Expressões Numéricas</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filtro}>
              <Text style={{fontSize: 14, color: '#333333'}}>Função 1° grau</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filtro}>
              <Text style={{fontSize: 14, color: '#333333'}}>Função 2° grau</Text>
            </TouchableOpacity>
          </View>*/}
          <View style={styles.area_selecionar_assunto}>
          <Pressable style={styles.botao_assuntos}><Text>Selecionar assuntos</Text></Pressable>
          </View>

          <View style={styles.numero_questoes}>
            <Text style={{fontSize: 20}}>Número de Questões</Text>
            <View style={styles.quadrado_num_questoes}>
              <TextInput 
                style={styles.input_texto} 
                defaultValue="20" 
                keyboardType="number-pad"
                selectionColor="#000000"
              />
              </View>
            </View>
         <View style={styles.tempo_questionario}>
            <Text style={{fontSize: 20}}>Tempo Limite</Text>
              <Text>(minutos)</Text>
              <View style={styles.quadrado_tempo}>
              <TextInput 
                style={styles.input_texto} 
                defaultValue="60" 
                selectionColor="#000000"
              />
            </View>
          <View style={styles.alinhar_botao_iniciar}>
          <Pressable style={styles.botao_iniciar}><Text style={{fontSize: 15, color: '#ffffff'}}>Iniciar Simulado</Text></Pressable>
          </View>
          
          </View>
 
     
    
    </View>
    
    
    </ScrollView>
    
    
    {/*rodapé*/}
    <View style={styles.rodape}>
      <FontAwesome name="graduation-cap" size={35} color="#000000" style={styles.icones_rodape}/>
      <MaterialCommunityIcons name="podium-gold" size={35} color="#000000" style={styles.icones_rodape}/>
      <Ionicons name="person" size={35} color="#000000" style={styles.icones_rodape}/>
      </View> 
    </View>
);
}
const styles = StyleSheet.create({
  tela_geral: {
    alignItems: 'center',
    paddingHorizontal: 40,
    width: '100%',
    paddingVertical: 20,
  },
  conteiner: {
    justifyContent: 'space-between',
    flex: 1
  },
  cabecalho: {
      flexDirection: 'row',
      minWidth: '100%',
      minHeight: 110,
      alignItems:'center',
      paddingLeft: 20,
  },
  assuntos: {
    flex: 1 ,
    minHeight: 560,
    width: '90%',
    borderRadius: 10,
    flexDirection: 'column',
    backgroundColor: '#D9D9D9',
    marginTop: 20,
  },
  titulo_assuntos: {
    justifyContent: 'flex-end',
    paddingVertical: 20,
    width: '100%',
    alignItems: 'center'
    
  },
  /*filtro_assuntos: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 20,
    paddingLeft: 20         
  },
  filtro: {
    backgroundColor: '#ffffff',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#b0b0b0',
  },
  filtro_selecionado: {
    backgroundColor: '#000000',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
  },*/
  area_selecionar_assunto: {
    width:'100%',
    paddingVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25
  },
  botao_assuntos: {
    width: '50%',
    paddingVertical: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ADADAD'
  },
 numero_questoes: {
    width: '100%',
    paddingVertical: 30,
    marginTop: 70,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  quadrado_num_questoes: {
    paddingVertical: 30,
    paddingHorizontal: 20,
    backgroundColor: '#ADADAD',
    marginVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10
  },
  tempo_questionario: {
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 10
  },
  quadrado_tempo: {
    paddingVertical: 30,
    paddingHorizontal: 20,
    backgroundColor: '#ADADAD',
    marginVertical: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    flexDirection: 'row'
  },
  botao_iniciar: {
    paddingVertical: 30,
    paddingHorizontal: 20,
    backgroundColor: '#000000',
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'

  },
  alinhar_botao_iniciar: {
    width: '100%',
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
 rodape: {
    flexDirection: 'row',
    height: 70,
    width: '100%',
    backgroundColor: '#D9D9D9',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  icones_rodape: {},
  input_texto: {
    fontSize: 18,
    textAlign: 'center',
    color: '#000000',
    width: '100%',
    height: '100%',
  },
 
 
  

});