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
    flexDirection: 'row',
    width: '90%',
    maxWidth: 400,
    minHeight: 90,
    borderRadius: 12,
    marginVertical: 10,
    backgroundColor: '#FFEDD5',
    borderWidth: 1.5,
    borderColor: '#FDBA74',
    shadowColor: '#F97316',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 3,
  },
  categoria1: {
    width: '75%',
    height: '100%',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingLeft: 14,
  },
  icone_categoria1: {
    width: '25%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFEDD5',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  nome_categoria1: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0B132B',
  }
});