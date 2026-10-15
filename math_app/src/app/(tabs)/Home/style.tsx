import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 30,
  },

  tela_geral: {
    paddingHorizontal: 20,
    paddingTop: 35,
  },

  /* SAUDAÇÃO */

  msg_saudacao: {
    marginBottom: 22,
  },

  texto_msg: {
    fontSize: 30,
    fontWeight: "700",
  },

  subtitulo: {
    fontSize: 15,
    marginTop: 5,
  },

  /* RANKING */

  ranking: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 18,
    marginBottom: 18,
  },

  icone_ranking: {
    width: 58,
    height: 58,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  caixa_texto_ranking: {
    marginBottom: 18,
  },

  texto_ranking: {
    fontSize: 24,
    fontWeight: "700",
  },

  linha_ranking: {
    height: 1,
    width: "100%",
    marginVertical: 7,
  },

  posicao: {
    fontSize: 14,
  },

  pontuacao: {
    flexDirection: "row",
    alignItems: "center",
  },

  icone_pontuacao: {
    width: 50,
    height: 50,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  texto_pontuacao: {
    flex: 1,
    marginLeft: 12,
  },

  titulo_pontuacao: {
    fontSize: 18,
    fontWeight: "600",
  },

  linha_pontuacao: {
    height: 1,
    width: "100%",
    marginVertical: 5,
  },

  valor_pontuacao: {
    flexDirection: "row",
    alignItems: "baseline",
  },

  numero_pontos: {
    fontSize: 17,
    fontWeight: "700",
    marginRight: 5,
  },

  pontos: {
    fontSize: 14,
  },

  /* DESAFIO */

  desafio_diario: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 18,
  },

  titulo_desafio_diario: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  titulo_desafio: {
    fontSize: 24,
    fontWeight: "700",
  },

  label_desafio: {
    fontSize: 13,
    fontWeight: "600",
  },

  texto_desafio_diario: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 18,
  },

  botaoResolver: {
    alignSelf: "flex-start",
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 12,
  },

  textoBotao: {
    fontSize: 16,
    fontWeight: "700",
  },

  /* CARDS */

  problemas: {
    minHeight: 115,
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
  },

  simulados: {
    minHeight: 115,
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
  },

  sala_aula: {
    minHeight: 115,
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },

  icone_problemas: {
    width: 68,
    height: 68,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },

  icone_simulados: {
    width: 68,
    height: 68,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },

  icone_sala: {
    width: 68,
    height: 68,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },

  texto_problemas: {
    flex: 1,
  },

  texto_simulados: {
    flex: 1,
  },

  texto_sala: {
    flex: 1,
  },

  titulo_card: {
    fontSize: 23,
    fontWeight: "700",
    marginBottom: 5,
  },

  descricao_card: {
    fontSize: 14,
    lineHeight: 19,
  },
});