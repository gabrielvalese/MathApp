import {
  Entypo,
  FontAwesome,
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

const AZUL = "#0B132B";
const AZUL_HOME = "#1E3A8A";
const LARANJA = "#F97316";

type Assunto = { nome: string; icone: React.ReactNode };
const assuntos: Assunto[] = [
  { nome: "Análise Combinatória", icone: <Ionicons name="git-network-outline" size={25} color={AZUL_HOME} /> },
  { nome: "Binômio de Newton", icone: <FontAwesome5 name="project-diagram" size={22} color={AZUL_HOME} /> },
  { nome: "Cônicas", icone: <MaterialCommunityIcons name="vector-ellipse" size={26} color={AZUL_HOME} /> },
  { nome: "Conjuntos", icone: <MaterialCommunityIcons name="set-merge" size={26} color={AZUL_HOME} /> },
  { nome: "Determinantes", icone: <MaterialCommunityIcons name="grid" size={26} color={AZUL_HOME} /> },
  { nome: "Equações Algébricas", icone: <FontAwesome5 name="infinity" size={24} color={AZUL_HOME} /> },
  { nome: "Estatística", icone: <MaterialCommunityIcons name="chart-bar" size={26} color={AZUL_HOME} /> },
  { nome: "Função Afim", icone: <Entypo name="line-graph" size={25} color={AZUL_HOME} /> },
  { nome: "Função Exponencial", icone: <MaterialCommunityIcons name="chart-line-variant" size={26} color={AZUL_HOME} /> },
  { nome: "Função Quadrática", icone: <MaterialCommunityIcons name="chart-bell-curve" size={26} color={AZUL_HOME} /> },
  { nome: "Funções", icone: <FontAwesome5 name="project-diagram" size={23} color={AZUL_HOME} /> },
  { nome: "Geometria Analítica", icone: <FontAwesome5 name="chart-area" size={24} color={AZUL_HOME} /> },
  { nome: "Geometria de Posição", icone: <MaterialCommunityIcons name="axis-z-arrow" size={26} color={AZUL_HOME} /> },
  { nome: "Geometria Espacial", icone: <MaterialCommunityIcons name="cube-outline" size={26} color={AZUL_HOME} /> },
  { nome: "Geometria Plana", icone: <MaterialCommunityIcons name="shape-outline" size={26} color={AZUL_HOME} /> },
  { nome: "Logaritmo", icone: <FontAwesome5 name="superscript" size={23} color={AZUL_HOME} /> },
  { nome: "Matemática Básica", icone: <Entypo name="plus" size={27} color={AZUL_HOME} /> },
  { nome: "Matemática Financeira", icone: <FontAwesome name="money" size={25} color={AZUL_HOME} /> },
  { nome: "Matrizes", icone: <MaterialCommunityIcons name="table-large" size={26} color={AZUL_HOME} /> },
  { nome: "Módulo", icone: <FontAwesome5 name="bars" size={24} color={AZUL_HOME} /> },
  { nome: "Números complexos", icone: <FontAwesome5 name="atom" size={24} color={AZUL_HOME} /> },
  { nome: "Polinômios", icone: <FontAwesome5 name="calculator" size={24} color={AZUL_HOME} /> },
  { nome: "Probabilidade", icone: <FontAwesome5 name="dice" size={24} color={AZUL_HOME} /> },
  { nome: "Progressões - PA e PG", icone: <MaterialCommunityIcons name="format-list-numbered" size={26} color={AZUL_HOME} /> },
  { nome: "Sistemas Lineares", icone: <MaterialCommunityIcons name="format-align-justify" size={26} color={AZUL_HOME} /> },
  { nome: "Trigonometria", icone: <MaterialCommunityIcons name="triangle-outline" size={26} color={AZUL_HOME} /> },
];

function normalizar(texto: string) {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

export default function TelaCategoria() {
  const router = useRouter();
  const [busca, setBusca] = useState("");
  const filtrados = useMemo(
    () => assuntos.filter(a => normalizar(a.nome).includes(normalizar(busca))),
    [busca]
  );

  return (
    <View style={styles.tela}>
      <ScrollView contentContainerStyle={styles.conteudo} showsVerticalScrollIndicator={false}>
        <View style={styles.cabecalho}>
          <Pressable
            accessibilityLabel="Voltar"
            style={styles.voltar}
            onPress={() => (router.canGoBack() ? router.back() : router.replace("/"))}
          >
            <Ionicons name="arrow-back" size={22} color={AZUL} />
          </Pressable>
          <Text style={styles.titulo}>Trilhas de Aprendizado</Text>
          <Text style={styles.subtitulo}>Escolha um assunto para praticar matemática.</Text>
        </View>

        <View style={styles.intro}>
          <View style={styles.introIcone}><Ionicons name="school-outline" size={27} color={AZUL_HOME} /></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.introTitulo}>Aprenda no seu ritmo</Text>
            <Text style={styles.introTexto}>26 conteúdos para estudar e revisar para o vestibular.</Text>
          </View>
        </View>

        <View style={styles.buscaBox}>
          <Ionicons name="search-outline" color="#64748B" size={21} />
          <TextInput
            placeholder="Buscar assunto..."
            placeholderTextColor="#94A3B8"
            value={busca}
            onChangeText={setBusca}
            style={styles.busca}
          />
          {!!busca && <Pressable onPress={() => setBusca("")}><Ionicons name="close-circle" size={20} color="#64748B" /></Pressable>}
        </View>

        <View style={styles.secao}>
          <Text style={styles.secaoTitulo}>Todos os assuntos</Text>
          <Text style={styles.contador}>{filtrados.length} encontrados</Text>
        </View>

        {filtrados.length === 0 ? (
          <View style={styles.card}><Text style={styles.semResultados}>Nenhum assunto encontrado.</Text></View>
        ) : filtrados.map(assunto => (
          <Pressable
            key={assunto.nome}
            style={styles.card}
            onPress={() => router.push({ pathname: "/categoria_questoes", params: { nome: assunto.nome } })}
          >
            <View style={styles.iconeCard}>{assunto.icone}</View>
            <Text style={styles.nomeCard}>{assunto.nome}</Text>
            <Ionicons name="chevron-forward" size={20} color={LARANJA} />
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: "#F1F5F9" },
  conteudo: { paddingHorizontal: 18, paddingTop: 22, paddingBottom: 42 },
  cabecalho: { alignItems: "center", marginBottom: 20, paddingTop: 4 },
  voltar: { position: "absolute", top: 0, left: 0, backgroundColor: "#E2E8F0", padding: 8, borderRadius: 9, zIndex: 1 },
  titulo: { fontSize: 24, fontWeight: "bold", color: AZUL, textAlign: "center", paddingHorizontal: 36, marginTop: 4 },
  subtitulo: { color: "#64748B", fontSize: 13, marginTop: 7, textAlign: "center" },
  intro: { backgroundColor: "#FFFFFF", borderColor: "#E2E8F0", borderWidth: 1.5, borderRadius: 13, flexDirection: "row", alignItems: "center", gap: 12, padding: 16, marginBottom: 17, elevation: 2 },
  introIcone: { backgroundColor: "#FFF7ED", width: 49, height: 49, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  introTitulo: { fontSize: 17, color: AZUL_HOME, fontWeight: "bold", marginBottom: 3 },
  introTexto: { fontSize: 12, color: "#64748B", lineHeight: 17 },
  buscaBox: { height: 48, flexDirection: "row", alignItems: "center", gap: 9, paddingHorizontal: 14, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E2E8F0", borderRadius: 10, marginBottom: 21 },
  busca: { flex: 1, color: AZUL, fontSize: 14 },
  secao: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10, paddingHorizontal: 2 },
  secaoTitulo: { fontSize: 18, fontWeight: "bold", color: AZUL_HOME },
  contador: { color: "#64748B", fontSize: 12 },
  card: { backgroundColor: "#F8FAFC", borderWidth: 1.5, borderColor: "#E2E8F0", borderRadius: 12, paddingVertical: 16, paddingHorizontal: 16, flexDirection: "row", alignItems: "center", gap: 15, minHeight: 76, marginBottom: 12, elevation: 2, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6 },
  iconeCard: { width: 42, alignItems: "center" },
  nomeCard: { flex: 1, color: AZUL, fontWeight: "700", fontSize: 15 },
  semResultados: { flex: 1, textAlign: "center", color: "#64748B" },
});