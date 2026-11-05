
import { useEffect, useState } from "react";

import {
  FontAwesome,
  FontAwesome6,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import {
  collection,
  doc,
  getDocs,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";


import MeusSimulado from "./componentes/MeuSimulado";
import { auth, db } from "./FirebaseConfig";



const COLECAO_ASSUNTOS = "Conteudo";

type Aba = "criar" | "meus";

type Assunto = {
  id: string;
  nome: string;
};

export default function Index() {
  const [abaAtiva, setAbaAtiva] =
    useState<Aba>("criar");

  // ASSUNTOS
  const [assuntos, setAssuntos] =
    useState<Assunto[]>([]);

  const [assuntosSelecionados, setAssuntosSelecionados] =
    useState<string[]>([]);

  const [mostrarAssuntos, setMostrarAssuntos] =
    useState(false);

  const [carregandoAssuntos, setCarregandoAssuntos] =
    useState(true);

  const [erroAssuntos, setErroAssuntos] =
    useState("");

  // CONFIGURAÇÕES DO SIMULADO
  const [numeroQuestoes, setNumeroQuestoes] =
    useState("20");

  const [tempoLimite, setTempoLimite] =
    useState("60");

  const [salvando, setSalvando] =
    useState(false);

  // BUSCAR ASSUNTOS NO FIREBASE
  async function carregarAssuntos() {
    setCarregandoAssuntos(true);
    setErroAssuntos("");

    try {
      const snapshot = await getDocs(
        collection(db, COLECAO_ASSUNTOS)
      );

      const lista: Assunto[] = snapshot.docs.map(
        (documento) => {
          const dados = documento.data();

          // Aceita diferentes nomes de campo
          const campoNome = [
            dados.nome,
            dados.titulo,
            dados.assunto,
            dados.conteudo,
          ].find(
            (valor) =>
              typeof valor === "string" &&
              valor.trim().length > 0
          );

          const nome =
            typeof campoNome === "string"
              ? campoNome.trim()
              : documento.id;

          return {
            id: documento.id,
            nome,
          };
        }
      );

      // Organiza alfabeticamente
      lista.sort((a, b) =>
        a.nome.localeCompare(b.nome, "pt-BR")
      );

      setAssuntos(lista);

      // Mantém somente IDs ainda existentes
      setAssuntosSelecionados((anteriores) =>
        anteriores.filter((id) =>
          lista.some((assunto) => assunto.id === id)
        )
      );
    } catch (error) {
      console.error(
        "Erro ao buscar assuntos:",
        error
      );

      setErroAssuntos(
        "Não foi possível carregar os assuntos."
      );
    } finally {
      setCarregandoAssuntos(false);
    }
  }

  // CARREGA AO ABRIR A TELA
  useEffect(() => {
    carregarAssuntos();
  }, []);

  // MARCAR OU DESMARCAR UM ASSUNTO
  function alternarAssunto(id: string) {
    setAssuntosSelecionados((anteriores) => {
      if (anteriores.includes(id)) {
        return anteriores.filter(
          (assuntoId) => assuntoId !== id
        );
      }

      return [...anteriores, id];
    });
  }

  // SELECIONAR TODOS
  function selecionarTodos() {
    setAssuntosSelecionados(
      assuntos.map((assunto) => assunto.id)
    );
  }

  // LIMPAR SELEÇÃO
  function limparSelecao() {
    setAssuntosSelecionados([]);
  }

  // SALVAR SIMULADO NO FIREBASE
  async function salvarSimulado() {
    if (salvando) return;

    const usuario = auth.currentUser;

    if (!usuario) {
      Alert.alert(
        "Atenção",
        "Faça login para criar um simulado."
      );
      return;
    }

    if (assuntosSelecionados.length === 0) {
      Alert.alert(
        "Selecione assuntos",
        "Escolha pelo menos um assunto."
      );
      return;
    }

    const quantidade = Number(numeroQuestoes);
    const tempo = Number(tempoLimite);

    if (
      !Number.isSafeInteger(quantidade) ||
      quantidade <= 0
    ) {
      Alert.alert(
        "Quantidade inválida",
        "Informe um número válido de questões."
      );
      return;
    }

    if (
      !Number.isSafeInteger(tempo) ||
      tempo <= 0
    ) {
      Alert.alert(
        "Tempo inválido",
        "Informe um tempo válido em minutos."
      );
      return;
    }

    setSalvando(true);

    try {
      // Nomes dos assuntos selecionados
      const nomesSelecionados = assuntos
        .filter((assunto) =>
          assuntosSelecionados.includes(assunto.id)
        )
        .map((assunto) => assunto.nome);

      // Nome gerado automaticamente
      const nome =
        nomesSelecionados.length === 1
          ? `Simulado de ${nomesSelecionados[0]}`
          : `Simulado de Matemática - ${nomesSelecionados.length} assuntos`;

      // REFERÊNCIAS DOS DOCUMENTOS
      const simuladoRef = doc(
        collection(db, "simulados")
      );

      const tentativaRef = doc(
        collection(db, "tentativas_simulado")
      );

      // SALVAR OS DOIS DOCUMENTOS JUNTOS
      const lote = writeBatch(db);

      // DOCUMENTO DO SIMULADO
      lote.set(simuladoRef, {
        criador_id: usuario.uid,
        nome: nome,

        assuntos_ids: assuntosSelecionados,
        assuntos_nomes: nomesSelecionados,

        quantidade_questoes: quantidade,
        tempo_minutos: tempo,

        // Questões ainda serão sorteadas
        questoes_ids: [],

        status: "rascunho",
        criado_em: serverTimestamp(),
      });

      // DOCUMENTO DO HISTÓRICO
      lote.set(tentativaRef, {
        usuario_id: usuario.uid,
        simulado_id: simuladoRef.id,

        nome_simulado: nome,

        assuntos_ids: assuntosSelecionados,

        quantidade_questoes: quantidade,
        tempo_minutos: tempo,

        status: "nao_iniciado",

        acertos: null,
        iniciado_em: null,
        finalizado_em: null,

        criado_em: serverTimestamp(),
      });

      await lote.commit();

      console.log(
        "Simulado salvo:",
        simuladoRef.id
      );

      Alert.alert(
        "Sucesso!",
        "Seu simulado foi salvo no Firebase."
      );

      // ABRE MEUS SIMULADOS
      setAbaAtiva("meus");
      setMostrarAssuntos(false);
    } catch (error) {
      console.error(
        "Erro ao salvar:",
        error
      );

      Alert.alert(
        "Erro ao salvar",
        "Verifique a conexão e as permissões do Firebase."
      );
    } finally {
      setSalvando(false);
    }
  }

  return (
    <View style={styles.conteiner}>
      <ScrollView
        contentContainerStyle={styles.tela_geral}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* CABEÇALHO */}
        <View style={styles.cabecalho}>
          <FontAwesome6
            name="chess-king"
            size={40}
            color="#0B132B"
          />

          <Text style={styles.texto_cabecalho}>
            Simulado
          </Text>
        </View>

        {/* ABAS SUPERIORES */}
        <View style={styles.area_abas}>
          <Pressable
            style={[
              styles.botao_aba,
              abaAtiva === "criar" &&
                styles.botao_aba_ativo,
            ]}
            onPress={() => setAbaAtiva("criar")}
          >
            <Ionicons
              name="add-circle-outline"
              size={22}
              color={
                abaAtiva === "criar"
                  ? "#FFFFFF"
                  : "#0B132B"
              }
            />

            <Text
              style={[
                styles.texto_aba,
                abaAtiva === "criar" &&
                  styles.texto_aba_ativo,
              ]}
            >
              Criar simulado
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.botao_aba,
              abaAtiva === "meus" &&
                styles.botao_aba_ativo,
            ]}
            onPress={() => setAbaAtiva("meus")}
          >
            <Ionicons
              name="folder-open-outline"
              size={22}
              color={
                abaAtiva === "meus"
                  ? "#FFFFFF"
                  : "#0B132B"
              }
            />

            <Text
              style={[
                styles.texto_aba,
                abaAtiva === "meus" &&
                  styles.texto_aba_ativo,
              ]}
            >
              Meus simulados
            </Text>
          </Pressable>
        </View>

        {/* ABA DE CRIAÇÃO */}
        {abaAtiva === "criar" && (
          <View style={styles.assuntos}>
            <View style={styles.titulo_assuntos}>
              <Text style={styles.texto_titulo}>
                Assuntos
              </Text>
            </View>

            {/* BOTÃO DE SELEÇÃO */}
            <View style={styles.area_selecionar_assunto}>
              <Pressable
                style={styles.botao_assuntos}
                onPress={() =>
                  setMostrarAssuntos(
                    !mostrarAssuntos
                  )
                }
              >
                <Text style={styles.texto_assuntos}>
                  Selecionar assuntos
                </Text>

                <View style={styles.linha_selecao}>
                  <Text style={styles.contador_assuntos}>
                    {assuntosSelecionados.length}
                    {" selecionado(s)"}
                  </Text>

                  <Ionicons
                    name={
                      mostrarAssuntos
                        ? "chevron-up"
                        : "chevron-down"
                    }
                    size={18}
                    color="#C2410C"
                  />
                </View>
              </Pressable>
            </View>

            {/* PAINEL DE ASSUNTOS */}
            {mostrarAssuntos && (
              <View style={styles.painel_assuntos}>
                {carregandoAssuntos ? (
                  <ActivityIndicator
                    size="large"
                    color="#F97316"
                  />
                ) : erroAssuntos ? (
                  <View style={styles.area_mensagem}>
                    <Text style={styles.mensagem}>
                      {erroAssuntos}
                    </Text>

                    <Pressable
                      onPress={carregarAssuntos}
                      style={styles.botao_recarregar}
                    >
                      <Text style={styles.texto_recarregar}>
                        Tentar novamente
                      </Text>
                    </Pressable>
                  </View>
                ) : assuntos.length === 0 ? (
                  <Text style={styles.mensagem}>
                    Nenhum assunto encontrado na
                    coleção "{COLECAO_ASSUNTOS}".
                  </Text>
                ) : (
                  <>
                    <Text style={styles.total_assuntos}>
                      {assuntos.length}
                      {" assuntos disponíveis"}
                    </Text>

                    <View style={styles.acoes_assuntos}>
                      <Pressable
                        onPress={selecionarTodos}
                      >
                        <Text style={styles.link_acao}>
                          Selecionar todos
                        </Text>
                      </Pressable>

                      <Pressable
                        onPress={limparSelecao}
                      >
                        <Text style={styles.link_acao}>
                          Limpar
                        </Text>
                      </Pressable>
                    </View>

                    {/* QUADRADINHOS */}
                    <View style={styles.grade_assuntos}>
                      {assuntos.map((assunto) => {
                        const selecionado =
                          assuntosSelecionados.includes(
                            assunto.id
                          );

                        return (
                          <Pressable
                            key={assunto.id}
                            onPress={() =>
                              alternarAssunto(assunto.id)
                            }
                            style={[
                              styles.quadrado_assunto,
                              selecionado &&
                                styles.quadrado_selecionado,
                            ]}
                          >
                            <Ionicons
                              name={
                                selecionado
                                  ? "checkbox"
                                  : "square-outline"
                              }
                              size={19}
                              color={
                                selecionado
                                  ? "#F97316"
                                  : "#94A3B8"
                              }
                            />

                            <Text style={styles.nome_assunto}>
                              {assunto.nome}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </View>

                    <Pressable
                      style={styles.botao_confirmar}
                      onPress={() =>
                        setMostrarAssuntos(false)
                      }
                    >
                      <Text style={styles.texto_confirmar}>
                        Confirmar seleção
                      </Text>
                    </Pressable>
                  </>
                )}
              </View>
            )}

            {/* NÚMERO DE QUESTÕES */}
            <View style={styles.numero_questoes}>
              <Text style={styles.texto_label}>
                Número de Questões
              </Text>

              <View style={styles.quadrado_num_questoes}>
                <TextInput
                  style={styles.input_texto}
                  value={numeroQuestoes}
                  onChangeText={setNumeroQuestoes}
                  keyboardType="number-pad"
                  selectionColor="#F97316"
                />
              </View>
            </View>

            {/* TEMPO LIMITE */}
            <View style={styles.tempo_questionario}>
              <Text style={styles.texto_label}>
                Tempo Limite
              </Text>

              <Text style={styles.texto_minutos}>
                (minutos)
              </Text>

              <View style={styles.quadrado_tempo}>
                <TextInput
                  style={styles.input_texto}
                  value={tempoLimite}
                  onChangeText={setTempoLimite}
                  keyboardType="number-pad"
                  selectionColor="#F97316"
                />
              </View>

              {/* SALVAR SIMULADO */}
              <View style={styles.alinhar_botao_iniciar}>
                <Pressable
                  style={[
                    styles.botao_iniciar,
                    salvando && { opacity: 0.6 },
                  ]}
                  onPress={salvarSimulado}
                  disabled={salvando}
                >
                  <Text style={styles.texto_iniciar}>
                    {salvando
                      ? "Salvando..."
                      : "Salvar Simulado"}
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        )}

        {/* ABA MEUS SIMULADOS */}
        {abaAtiva === "meus" && (
          <MeusSimulado />
        )}
      </ScrollView>

      {/* RODAPÉ ORIGINAL */}
      <View style={styles.rodape}>
        <FontAwesome
          name="graduation-cap"
          size={30}
          color="#0B132B"
          style={styles.icones_rodape}
        />

        <MaterialCommunityIcons
          name="podium-gold"
          size={30}
          color="#0B132B"
          style={styles.icones_rodape}
        />

        <Ionicons
          name="person"
          size={30}
          color="#0B132B"
          style={styles.icones_rodape}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  conteiner: {
    flex: 1,
    backgroundColor: "#F1F5F9",
    justifyContent: "space-between",
  },

  tela_geral: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
    width: "100%",
  },

  cabecalho: {
    flexDirection: "row",
    width: "100%",
    minHeight: 80,
    alignItems: "center",
    paddingLeft: 10,
    paddingHorizontal: 15,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: "rgba(0,0,0,0.1)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  texto_cabecalho: {
    paddingLeft: 16,
    fontSize: 24,
    fontWeight: "bold",
    color: "#0B132B",
  },

  area_abas: {
    flexDirection: "row",
    width: "100%",
    maxWidth: 420,
    gap: 10,
    marginTop: 10,
    marginBottom: 10,
  },

  botao_aba: {
    flex: 1,
    minHeight: 75,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    gap: 5,
  },

  botao_aba_ativo: {
    backgroundColor: "#F97316",
    borderColor: "#F97316",
    elevation: 3,
    shadowColor: "#F97316",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },

  texto_aba: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0B132B",
    textAlign: "center",
  },

  texto_aba_ativo: {
    color: "#FFFFFF",
  },

  assuntos: {
    width: "100%",
    maxWidth: 420,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    marginTop: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderWidth: 1.5,
    borderColor: "rgba(0,0,0,0.15)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 5,
  },

  titulo_assuntos: {
    justifyContent: "center",
    paddingVertical: 10,
    width: "100%",
    alignItems: "center",
  },

  texto_titulo: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#0B132B",
  },

  area_selecionar_assunto: {
    width: "100%",
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },

  botao_assuntos: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF7ED",
    borderWidth: 1,
    borderColor: "#FFEDD5",
  },

  texto_assuntos: {
    color: "#C2410C",
    fontWeight: "700",
    fontSize: 15,
  },

  linha_selecao: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 6,
  },

  contador_assuntos: {
    fontSize: 12,
    color: "#C2410C",
  },

  painel_assuntos: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#FFEDD5",
    borderRadius: 12,
    padding: 12,
    marginTop: 5,
  },

  total_assuntos: {
    fontSize: 13,
    color: "#64748B",
    marginBottom: 12,
  },

  acoes_assuntos: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },

  link_acao: {
    color: "#C2410C",
    fontSize: 13,
    fontWeight: "700",
  },

  grade_assuntos: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  quadrado_assunto: {
    width: "48%",
    minHeight: 56,
    marginBottom: 10,
    paddingHorizontal: 9,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },

  quadrado_selecionado: {
    borderColor: "#F97316",
    backgroundColor: "#FFF7ED",
  },

  nome_assunto: {
    flex: 1,
    fontSize: 12,
    color: "#0B132B",
    fontWeight: "600",
  },

  botao_confirmar: {
    backgroundColor: "#F97316",
    paddingVertical: 13,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },

  texto_confirmar: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 14,
  },

  area_mensagem: {
    alignItems: "center",
    paddingVertical: 12,
  },

  mensagem: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    marginBottom: 12,
  },

  botao_recarregar: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: "#FFF7ED",
    borderRadius: 8,
  },

  texto_recarregar: {
    color: "#C2410C",
    fontWeight: "700",
  },

  numero_questoes: {
    width: "100%",
    paddingVertical: 15,
    marginTop: 15,
    justifyContent: "flex-start",
    alignItems: "center",
  },

  texto_label: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0B132B",
  },

  quadrado_num_questoes: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "#FFF7ED",
    marginVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    width: "100%",
    borderWidth: 1,
    borderColor: "#FFEDD5",
  },

  tempo_questionario: {
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 5,
  },

  texto_minutos: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 2,
  },

  quadrado_tempo: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "#FFF7ED",
    marginVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    width: "100%",
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#FFEDD5",
  },

  input_texto: {
    fontSize: 18,
    textAlign: "center",
    color: "#0B132B",
    fontWeight: "bold",
    width: "100%",
    height: 30,
  },

  botao_iniciar: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: "#F97316",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    shadowColor: "#F97316",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },

  texto_iniciar: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "bold",
  },

  alinhar_botao_iniciar: {
    width: "100%",
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  rodape: {
    flexDirection: "row",
    height: 65,
    width: "100%",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "space-around",
    borderTopWidth: 1.5,
    borderTopColor: "rgba(0,0,0,0.1)",
  },

  icones_rodape: {},
});
