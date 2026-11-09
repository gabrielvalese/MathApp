import {
  Entypo,
  FontAwesome,
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../contexts/theme_context";

const AZUL = "#1E3A8A";

type Assunto = { nome: string; icone: React.ReactNode };

const assuntos: Assunto[] = [
  { nome: "Análise Combinatória", icone: <Ionicons name="git-network-outline" size={24} color={AZUL} /> },
  { nome: "Binômio de Newton", icone: <FontAwesome5 name="project-diagram" size={22} color={AZUL} /> },
  { nome: "Cônicas", icone: <MaterialCommunityIcons name="vector-ellipse" size={24} color={AZUL} /> },
  { nome: "Conjuntos", icone: <MaterialCommunityIcons name="set-merge" size={24} color={AZUL} /> },
  { nome: "Determinantes", icone: <MaterialCommunityIcons name="grid" size={24} color={AZUL} /> },
  { nome: "Equações Algébricas", icone: <FontAwesome5 name="infinity" size={22} color={AZUL} /> },
  { nome: "Estatística", icone: <MaterialCommunityIcons name="chart-bar" size={24} color={AZUL} /> },
  { nome: "Função Afim", icone: <Entypo name="line-graph" size={24} color={AZUL} /> },
  { nome: "Função Exponencial", icone: <MaterialCommunityIcons name="chart-line-variant" size={24} color={AZUL} /> },
  { nome: "Função Quadrática", icone: <MaterialCommunityIcons name="chart-bell-curve" size={24} color={AZUL} /> },
  { nome: "Funções", icone: <FontAwesome5 name="project-diagram" size={22} color={AZUL} /> },
  { nome: "Geometria Analítica", icone: <FontAwesome5 name="chart-area" size={22} color={AZUL} /> },
  { nome: "Geometria de Posição", icone: <MaterialCommunityIcons name="axis-z-arrow" size={24} color={AZUL} /> },
  { nome: "Geometria Espacial", icone: <MaterialCommunityIcons name="cube-outline" size={24} color={AZUL} /> },
  { nome: "Geometria Plana", icone: <MaterialCommunityIcons name="shape-outline" size={24} color={AZUL} /> },
  { nome: "Logaritmo", icone: <FontAwesome5 name="superscript" size={22} color={AZUL} /> },
  { nome: "Matemática Básica", icone: <Entypo name="plus" size={26} color={AZUL} /> },
  { nome: "Matemática Financeira", icone: <FontAwesome name="money" size={22} color={AZUL} /> },
  { nome: "Matrizes", icone: <MaterialCommunityIcons name="table-large" size={24} color={AZUL} /> },
  { nome: "Módulo", icone: <FontAwesome5 name="bars" size={22} color={AZUL} /> },
  { nome: "Números complexos", icone: <FontAwesome5 name="atom" size={22} color={AZUL} /> },
  { nome: "Polinômios", icone: <FontAwesome5 name="calculator" size={22} color={AZUL} /> },
  { nome: "Probabilidade", icone: <FontAwesome5 name="dice" size={22} color={AZUL} /> },
  { nome: "Progressões - PA e PG", icone: <MaterialCommunityIcons name="format-list-numbered" size={24} color={AZUL} /> },
  { nome: "Sistemas Lineares", icone: <MaterialCommunityIcons name="format-align-justify" size={24} color={AZUL} /> },
  { nome: "Trigonometria", icone: <MaterialCommunityIcons name="triangle-outline" size={24} color={AZUL} /> },
];

function normalizar(texto: string) {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

export default function TelaCategoria() {
  const router = useRouter();
  const { cores } = useTheme();
  const [busca, setBusca] = useState("");

  const filtrados = useMemo(
    () => assuntos.filter((a) => normalizar(a.nome).includes(normalizar(busca))),
    [busca]
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: cores.fundo }]} edges={["top", "left", "right"]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <View style={styles.headerLinha}>
            <Pressable
              accessibilityLabel="Voltar"
              accessibilityRole="button"
              style={({ pressed }) => [
                styles.botaoVoltar,
                { backgroundColor: cores.card, borderColor: cores.borda },
                pressed && { opacity: 0.8 },
              ]}
              onPress={() => (router.canGoBack() ? router.back() : router.replace("/home"))}
            >
              <Ionicons name="arrow-back" size={22} color={cores.azul} />
            </Pressable>

            <Text style={[styles.titulo, { color: cores.texto }]}>Trilhas de Aprendizado</Text>

            <View style={{ width: 40 }} />
          </View>
          <Text style={[styles.subtitulo, { color: cores.textoSuave }]}>
            Escolha um assunto para praticar matemática.
          </Text>
        </View>

        <View style={[styles.intro, { backgroundColor: cores.card }]}>
          <View style={[styles.introIcone, { backgroundColor: cores.cardSecundario }]}>
            <Ionicons name="school-outline" size={26} color={cores.azul} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.introTitulo, { color: cores.texto }]}>Aprenda no seu ritmo</Text>
            <Text style={[styles.introTexto, { color: cores.textoSuave }]}>
              {assuntos.length} conteúdos para estudar e revisar para o vestibular.
            </Text>
          </View>
        </View>

        <View style={[styles.buscaBox, { backgroundColor: cores.card, borderColor: cores.borda }]}>
          <Ionicons name="search-outline" size={20} color={cores.textoSuave} />
          <TextInput
            placeholder="Buscar assunto..."
            placeholderTextColor={cores.textoSuave}
            value={busca}
            onChangeText={setBusca}
            style={[styles.busca, { color: cores.texto }]}
          />
          {!!busca && (
            <Pressable onPress={() => setBusca("")} hitSlop={8}>
              <Ionicons name="close-circle" size={20} color={cores.textoSuave} />
            </Pressable>
          )}
        </View>

        <View style={styles.secao}>
          <Text style={[styles.secaoTitulo, { color: cores.texto }]}>Todos os assuntos</Text>
          <Text style={[styles.contador, { color: cores.textoSuave }]}>{filtrados.length} encontrados</Text>
        </View>

        {filtrados.length === 0 ? (
          <View style={[styles.cardVazio, { backgroundColor: cores.card }]}>
            <Ionicons name="search-outline" size={28} color={cores.textoSuave} />
            <Text style={[styles.semResultados, { color: cores.textoSuave }]}>Nenhum assunto encontrado.</Text>
          </View>
        ) : (
          filtrados.map((assunto) => (
            <Pressable
              key={assunto.nome}
              style={({ pressed }) => [
                styles.card,
                { backgroundColor: cores.card },
                pressed && { opacity: 0.85 },
              ]}
              onPress={() =>
                router.push({
                  pathname: "/categoria_questoes",
                  params: { nome: assunto.nome },
                })
              }
            >
              <View style={[styles.iconeCard, { backgroundColor: cores.cardSecundario }]}>
                {assunto.icone}
              </View>
              <Text style={[styles.nomeCard, { color: cores.texto }]}>{assunto.nome}</Text>
              <Ionicons name="chevron-forward" size={20} color={cores.laranja} />
            </Pressable>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: 20, paddingBottom: 32 },
  header: { marginBottom: 20, paddingTop: 4 },
  headerLinha: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  botaoVoltar: {
    width: 40, height: 40, borderRadius: 12,
    alignItems: "center", justifyContent: "center",
    borderWidth: 1, shadowColor: "#000", shadowOpacity: 0.08,
    shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 3,
  },
  titulo: { flex: 1, fontSize: 20, fontWeight: "800", textAlign: "center" },
  subtitulo: { fontSize: 13, marginTop: 8, textAlign: "center", paddingHorizontal: 20 },
  intro: {
    borderRadius: 16, flexDirection: "row", alignItems: "center",
    gap: 12, padding: 16, marginBottom: 16,
    shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 }, elevation: 3,
  },
  introIcone: { width: 48, height: 48, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  introTitulo: { fontSize: 16, fontWeight: "800", marginBottom: 3 },
  introTexto: { fontSize: 12, lineHeight: 17 },
  buscaBox: {
    height: 48, flexDirection: "row", alignItems: "center",
    gap: 9, paddingHorizontal: 14, borderRadius: 12,
    marginBottom: 20, borderWidth: 1.5,
  },
  busca: { flex: 1, fontSize: 14 },
  secao: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12, paddingHorizontal: 2 },
  secaoTitulo: { fontSize: 16, fontWeight: "800" },
  contador: { fontSize: 12, fontWeight: "600" },
  card: {
    borderRadius: 14, paddingVertical: 14, paddingHorizontal: 16,
    flexDirection: "row", alignItems: "center", gap: 14,
    minHeight: 70, marginBottom: 10,
    shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 }, elevation: 3,
  },
  iconeCard: { width: 42, height: 42, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  nomeCard: { flex: 1, fontWeight: "700", fontSize: 15 },
  cardVazio: {
    borderRadius: 14, padding: 28, alignItems: "center", gap: 10,
    shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 }, elevation: 3,
  },
  semResultados: { textAlign: "center", fontSize: 14 },
});