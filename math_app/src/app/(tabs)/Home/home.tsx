import { Feather, FontAwesome6 } from "@expo/vector-icons";
import { Link } from "expo-router";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { styles } from "./style";



export default function Index() {
  const theme = useTheme();

  return (
    <SafeAreaProvider>
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.colors.background,
          },
        ]}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.tela_geral}>

            {/* SAUDAÇÃO */}
            <View style={styles.msg_saudacao}>
              <Text
                style={[
                  styles.texto_msg,
                  { color: theme.colors.onBackground },
                ]}
              >
                Olá, [Usuário]
              </Text>

              <Text
                style={[
                  styles.subtitulo,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                Continue seus estudos de onde parou.
              </Text>
            </View>

            {/* RANKING */}
            <View
              style={[
                styles.ranking,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.outlineVariant,
                },
              ]}
            >
              <View
                style={[
                  styles.icone_ranking,
                  {
                    backgroundColor: theme.colors.primaryContainer,
                  },
                ]}
              >
                <FontAwesome6
                  name="trophy"
                  size={32}
                  color={theme.colors.onPrimaryContainer}
                />
              </View>

              <View style={styles.caixa_texto_ranking}>
                <Text
                  style={[
                    styles.texto_ranking,
                    { color: theme.colors.onSurface },
                  ]}
                >
                  Ranking
                </Text>

                <View
                  style={[
                    styles.linha_ranking,
                    { backgroundColor: theme.colors.outlineVariant },
                  ]}
                />

                <Text
                  style={[
                    styles.posicao,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                >
                  Você está em 12º lugar
                </Text>
              </View>

              {/* PONTUAÇÃO */}
              <View style={styles.pontuacao}>
                <View
                  style={[
                    styles.icone_pontuacao,
                    {
                      backgroundColor: theme.colors.secondaryContainer,
                    },
                  ]}
                >
                  <Feather
                    name="trending-up"
                    size={27}
                    color={theme.colors.onSecondaryContainer}
                  />
                </View>

                <View style={styles.texto_pontuacao}>
                  <Text
                    style={[
                      styles.titulo_pontuacao,
                      { color: theme.colors.onSurface },
                    ]}
                  >
                    Pontuação
                  </Text>

                  <View
                    style={[
                      styles.linha_pontuacao,
                      { backgroundColor: theme.colors.outlineVariant },
                    ]}
                  />

                  <View style={styles.valor_pontuacao}>
                    <Text
                      style={[
                        styles.numero_pontos,
                        { color: theme.colors.onSurface },
                      ]}
                    >
                      267,17
                    </Text>

                    <Text
                      style={[
                        styles.pontos,
                        { color: theme.colors.onSurfaceVariant },
                      ]}
                    >
                      Pontos
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* DESAFIO DIÁRIO */}
            <View
              style={[
                styles.desafio_diario,
                {
                  backgroundColor: theme.colors.primary,
                },
              ]}
            >
              <View style={styles.titulo_desafio_diario}>
                <Text
                  style={[
                    styles.titulo_desafio,
                    { color: theme.colors.onPrimary },
                  ]}
                >
                  Desafio Diário
                </Text>

                <Text
                  style={[
                    styles.label_desafio,
                    { color: theme.colors.primaryContainer },
                  ]}
                >
                  +10 pontos
                </Text>
              </View>

              <Text
                style={[
                  styles.texto_desafio_diario,
                  { color: theme.colors.onPrimary },
                ]}
              >
                (UFPR-2020) Imagine que um macaco digite sequências
                aleatórias de 3 letras...
              </Text>

              <Link
                href="/"
                style={[
                  styles.botaoResolver,
                  {
                    backgroundColor: theme.colors.secondary,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.textoBotao,
                    { color: theme.colors.onSecondary },
                  ]}
                >
                  Resolver agora
                </Text>
              </Link>
            </View>

            {/* LABORATÓRIO */}
            <TouchableOpacity
              style={[
                styles.problemas,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.outlineVariant,
                },
              ]}
            >
              <View
                style={[
                  styles.icone_problemas,
                  {
                    backgroundColor: theme.colors.primaryContainer,
                  },
                ]}
              >
                <FontAwesome6
                  name="flask"
                  size={40}
                  color={theme.colors.onPrimaryContainer}
                />
              </View>

              <View style={styles.texto_problemas}>
                <Text
                  style={[
                    styles.titulo_card,
                    { color: theme.colors.onSurface },
                  ]}
                >
                  Laboratório
                </Text>

                <Text
                  style={[
                    styles.descricao_card,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                >
                  Polinômios, Matrizes,
                </Text>

                <Text
                  style={[
                    styles.descricao_card,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                >
                  Expressões Numéricas
                </Text>
              </View>

              <Feather
                name="chevron-right"
                size={26}
                color={theme.colors.onSurfaceVariant}
              />
            </TouchableOpacity>

            {/* SIMULADOS */}
            <TouchableOpacity
              style={[
                styles.simulados,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.outlineVariant,
                },
              ]}
            >
              <View
                style={[
                  styles.icone_simulados,
                  {
                    backgroundColor: theme.colors.secondaryContainer,
                  },
                ]}
              >
                <FontAwesome6
                  name="chess-knight"
                  size={40}
                  color={theme.colors.onSecondaryContainer}
                />
              </View>

              <View style={styles.texto_simulados}>
                <Text
                  style={[
                    styles.titulo_card,
                    { color: theme.colors.onSurface },
                  ]}
                >
                  Simulados
                </Text>

                <Text
                  style={[
                    styles.descricao_card,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                >
                  Teste seus conhecimentos
                </Text>
              </View>

              <Feather
                name="chevron-right"
                size={26}
                color={theme.colors.onSurfaceVariant}
              />
            </TouchableOpacity>

            {/* SALA DE AULA */}
            <TouchableOpacity
              style={[
                styles.sala_aula,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.outlineVariant,
                },
              ]}
            >
              <View
                style={[
                  styles.icone_sala,
                  {
                    backgroundColor: theme.colors.tertiaryContainer,
                  },
                ]}
              >
                <FontAwesome6
                  name="school"
                  size={38}
                  color={theme.colors.onTertiaryContainer}
                />
              </View>

              <View style={styles.texto_sala}>
                <Text
                  style={[
                    styles.titulo_card,
                    { color: theme.colors.onSurface },
                  ]}
                >
                  Sala de Aula
                </Text>

                <Text
                  style={[
                    styles.descricao_card,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                >
                  Acesse suas turmas e atividades
                </Text>
              </View>

              <Feather
                name="chevron-right"
                size={26}
                color={theme.colors.onSurfaceVariant}
              />
            </TouchableOpacity>

          </View>
        </ScrollView>
      </View>
    </SafeAreaProvider>
  );
}

