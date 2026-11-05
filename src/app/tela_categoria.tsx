import { Entypo, FontAwesome, FontAwesome5, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Categoria from "../app/componentes/categoria"; // Ajuste o caminho se necessário

export default function TelaCategoria() {
  const router = useRouter();
  const corIcone = "#0B132B"; // Azul escuro oficial para os ícones

  return (
    <View style={styles.tela_geral}>
      {/* Cabeçalho minimalista com a seta discreta de voltar */}
      <View style={styles.cabecalhoTopo}>
        <Pressable onPress={() => router.push("/")} style={styles.botaoVoltar}>
          <Ionicons name="arrow-back" size={22} color="#0B132B" />
        </Pressable>
      </View>

      {/* Título da Página */}
      <View style={styles.areaTitulo}>
        <Text style={styles.tituloPagina}>Trilhas de Aprendizado</Text>
        <Text style={styles.subtituloPagina}>26 Assuntos disponíveis para o vestibular</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Categoria nome="Análise Combinatória" icone={<Ionicons name="git-network-outline" size={28} color={corIcone}/>} />
        <Categoria nome="Binômio de Newton" icone={<FontAwesome5 name="project-diagram" size={24} color={corIcone}/>} />
        <Categoria nome="Cônicas" icone={<MaterialCommunityIcons name="vector-ellipse" size={28} color={corIcone}/>} />
        <Categoria nome="Conjuntos" icone={<MaterialCommunityIcons name="set-merge" size={28} color={corIcone}/>} />
        <Categoria nome="Determinantes" icone={<MaterialCommunityIcons name="grid" size={28} color={corIcone}/>} />
        <Categoria nome="Equações Algébricas" icone={<FontAwesome5 name="infinity" size={24} color={corIcone}/>} />
        <Categoria nome="Estatística" icone={<MaterialCommunityIcons name="chart-bar" size={28} color={corIcone}/>} />
        <Categoria nome="Função Afim" icone={<Entypo name="line-graph" size={26} color={corIcone}/>} />
        <Categoria nome="Função Exponencial" icone={<MaterialCommunityIcons name="chart-line-variant" size={28} color={corIcone}/>} />
        <Categoria nome="Função Quadrática" icone={<MaterialCommunityIcons name="chart-bell-curve" size={28} color={corIcone}/>} />
        <Categoria nome="Funções" icone={<FontAwesome5 name="project-diagram" size={24} color={corIcone}/>} />
        <Categoria nome="Geometria Analítica" icone={<FontAwesome5 name="chart-area" size={24} color={corIcone}/>} />
        <Categoria nome="Geometria de Posição" icone={<MaterialCommunityIcons name="axis-z-arrow" size={28} color={corIcone}/>} />
        <Categoria nome="Geometria Espacial" icone={<MaterialCommunityIcons name="cube-outline" size={28} color={corIcone}/>} />
        <Categoria nome="Geometria Plana" icone={<MaterialCommunityIcons name="shape-outline" size={28} color={corIcone}/>} />
        <Categoria nome="Logaritmo" icone={<FontAwesome5 name="superscript" size={24} color={corIcone}/>} />
        <Categoria nome="Matemática Básica" icone={<Entypo name="plus" size={28} color={corIcone}/>} />
        <Categoria nome="Matemática Financeira" icone={<FontAwesome name="money" size={26} color={corIcone}/>} />
        <Categoria nome="Matrizes" icone={<MaterialCommunityIcons name="table-large" size={28} color={corIcone}/>} />
        <Categoria nome="Módulo" icone={<FontAwesome5 name="bars" size={24} color={corIcone}/>} />
        <Categoria nome="Números complexos" icone={<FontAwesome5 name="atom" size={24} color={corIcone}/>} />
        <Categoria nome="Polinômios" icone={<FontAwesome5 name="calculator" size={24} color={corIcone}/>} />
        <Categoria nome="Probabilidade" icone={<FontAwesome5 name="dice" size={26} color={corIcone}/>} />
        <Categoria nome="Progressões - PA e PG" icone={<MaterialCommunityIcons name="format-list-numbered" size={28} color={corIcone}/>} />
        <Categoria nome="Sistemas Lineares" icone={<MaterialCommunityIcons name="format-align-justify" size={28} color={corIcone}/>} />
        <Categoria nome="Trigonometria" icone={<MaterialCommunityIcons name="triangle-outline" size={28} color={corIcone}/>} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  tela_geral: {
    flex: 1,
    backgroundColor: '#F1F5F9', // Fundo claro e moderno do app
    paddingTop: 10,
  },
  cabecalhoTopo: {
    width: '100%',
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  botaoVoltar: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#E2E8F0', // Fundo sutil para a área de toque da seta
  },
  areaTitulo: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  tituloPagina: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#0B132B',
  },
  subtituloPagina: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 40,
  }
});