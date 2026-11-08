import { useLocalSearchParams } from "expo-router";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { auth, db } from "../FirebaseConfig";

const COR = "#F97316";
const LETRAS = ["A", "B", "C", "D", "E"];

type Questao = {
  id: string;
  id_questao: number | null;
  enunciado: string;
  alternativas: string[];
  respostaCorreta: string;
  imagens?: string[];
  ano?: number;
  origem?: string;
};

function inteiroPositivo(valor: unknown): number | null {
  const numero = typeof valor === "number" || typeof valor === "string"
    ? Number(valor)
    : NaN;
  return Number.isSafeInteger(numero) && numero > 0 ? numero : null;
}

export default function QuestaoMath() {
  // tentativaId é opcional: fica disponível quando a tela for aberta por um simulado.
  const params = useLocalSearchParams<{ id: string; tentativaId?: string }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const tentativaId = Array.isArray(params.tentativaId)
    ? params.tentativaId[0]
    : params.tentativaId;

  const [questao, setQuestao] = useState<Questao | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [selecionada, setSelecionada] = useState<string | null>(null);
  const [confirmada, setConfirmada] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const salvamentoEmCurso = useRef(false);

  useEffect(() => {
    let ativo = true;

    setQuestao(null);
    setSelecionada(null);
    setConfirmada(false);
    setCarregando(true);
    salvamentoEmCurso.current = false;

    async function carregarQuestao() {
      if (!id) {
        if (ativo) setCarregando(false);
        return;
      }
      try {
        const snap = await getDoc(doc(db, "Questao", id));
        if (!snap.exists()) return;
        const dados = snap.data();
        if (
          typeof dados.enunciado !== "string" ||
          !Array.isArray(dados.alternativas) ||
          !dados.alternativas.every((opcao: unknown) => typeof opcao === "string") ||
          typeof dados.respostaCorreta !== "string"
        ) {
          console.warn("Questão com formato inválido:", snap.id);
          return;
        }

        // Usa o ID numérico do documento; se for um documento com ID "3", aceita "3".
        // Se usa IDs automáticos no Firestore, adicione id_questao ao documento.
        const idQuestaoNumerico = inteiroPositivo(dados.id_questao)
          ?? inteiroPositivo(dados.id)
          ?? inteiroPositivo(snap.id);

        if (ativo) {
          setQuestao({
            id: snap.id,
            id_questao: idQuestaoNumerico,
            enunciado: dados.enunciado,
            alternativas: dados.alternativas,
            respostaCorreta: dados.respostaCorreta.trim().toUpperCase(),
            imagens: Array.isArray(dados.imagens) ? dados.imagens : [],
            ano: dados.ano,
            origem: dados.origem,
          });
        }
      } catch (erro) {
        console.error("Erro ao carregar questão:", erro);
        if (ativo) Alert.alert("Erro", "Não foi possível carregar esta questão.");
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    carregarQuestao();
    return () => { ativo = false; };
  }, [id]);

  async function confirmarResposta() {
    if (!questao || !selecionada || confirmada || salvamentoEmCurso.current) return;

    const usuario = auth.currentUser;
    if (!usuario) {
      Alert.alert("Login necessário", "Entre na sua conta antes de responder.");
      return;
    }

    salvamentoEmCurso.current = true;
    setSalvando(true);

    try {
      // Procura ID numérico do estudante apenas se existir no cadastro.
      // Não impede o aluno de responder quando esse campo não está preenchido.
      let idEstudante: number | null = null;
      try {
        const perfilSnap = await getDoc(doc(db, "users", usuario.uid));
        idEstudante = inteiroPositivo(perfilSnap.data()?.id_estudante);
      } catch (erroPerfil) {
        console.warn("Perfil numérico indisponível:", erroPerfil);
      }

      const resposta = selecionada.trim().toUpperCase();
      const acertou = resposta === questao.respostaCorreta;

      // INSERT somente em faz_questao (campos numéricos são opcionais).
      await addDoc(collection(db, "faz_questao"), {
        usuario_uid: usuario.uid,
        questao_documento_id: questao.id,
        resposta,
        acerto: acertou,
        data_realizacao: serverTimestamp(),
        ...(idEstudante !== null ? { id_estudante: idEstudante } : {}),
        ...(questao.id_questao !== null ? { id_questao: questao.id_questao } : {}),
        ...(tentativaId ? { tentativa_id: tentativaId } : {}),
      });

      // Só confirma na interface depois que o Firestore aceitar a gravação.
      setConfirmada(true);
      Alert.alert(
        "Resposta registrada!",
        acertou ? "Você acertou esta questão." : "Sua resposta foi salva. Confira a alternativa correta."
      );
    } catch (erro) {
      console.error("Erro ao registrar questão:", erro);
      const mensagem = erro instanceof Error ? erro.message : "Erro desconhecido";
      Alert.alert("Não foi possível registrar", mensagem);
    } finally {
      salvamentoEmCurso.current = false;
      setSalvando(false);
    }
  }

  if (carregando) {
    return (
      <SafeAreaView style={[styles.container, styles.centralizado]}>
        <ActivityIndicator size="large" color={COR} />
      </SafeAreaView>
    );
  }

  if (!questao) {
    return (
      <SafeAreaView style={[styles.container, styles.centralizado]}>
        <Text>Questão não encontrada.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.conteudo}>
        <Text style={styles.titulo}>Questão {questao.id}</Text>
        <View style={styles.cardEnunciado}>
          <Text style={styles.enunciado}>{questao.enunciado}</Text>
          {questao.imagens?.map((uri) => (
            <Image
              key={uri}
              source={{ uri }}
              style={styles.imagensQuestao}
              resizeMode="contain"
            />
          ))}
        </View>

        {questao.alternativas.map((texto, i) => {
          const letra = LETRAS[i];
          if (!letra) return null;
          const estiloResultado =
            confirmada && letra === questao.respostaCorreta
              ? styles.opcaoCorreta
              : confirmada && letra === selecionada
                ? styles.opcaoErrada
                : letra === selecionada
                  ? styles.opcaoSelecionada
                  : null;

          return (
            <TouchableOpacity
              key={letra}
              style={[styles.opcao, estiloResultado]}
              onPress={() => !confirmada && !salvando && setSelecionada(letra)}
              disabled={confirmada || salvando}
              activeOpacity={0.8}
            >
              <View style={styles.letra}>
                <Text style={styles.letraTexto}>{letra}</Text>
              </View>
              <Text style={styles.opcaoTexto}>{texto}</Text>
            </TouchableOpacity>
          );
        })}

        {confirmada ? (
          <Text style={styles.mensagemResultado}>
            {selecionada === questao.respostaCorreta ? "Resposta correta!" : `Resposta correta: ${questao.respostaCorreta}`}
          </Text>
        ) : (
          <TouchableOpacity
            style={[styles.botaoConfirmar, (!selecionada || salvando) && styles.botaoDesabilitado]}
            disabled={!selecionada || salvando}
            onPress={confirmarResposta}
          >
            {salvando ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.botaoConfirmarTexto}>Confirmar resposta</Text>
            )}
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F6FA" },
  centralizado: { justifyContent: "center", alignItems: "center" },
  conteudo: { padding: 20, paddingBottom: 30 },
  titulo: { fontSize: 22, fontWeight: "700", color: "#1F2937", marginBottom: 12 },
  cardEnunciado: {
    backgroundColor: "#FFFFFF", borderRadius: 14, padding: 18, marginBottom: 18,
    elevation: 2, shadowColor: "#000", shadowOpacity: 0.08,
    shadowRadius: 6, shadowOffset: { width: 0, height: 2 },
  },
  enunciado: { fontSize: 18, color: "#111827", lineHeight: 26 },
  opcao: {
    flexDirection: "row", alignItems: "center", backgroundColor: "#FFFFFF", borderRadius: 12,
    padding: 14, marginBottom: 12, borderWidth: 2, borderColor: "transparent",
  },
  opcaoSelecionada: { borderColor: COR, backgroundColor: "#EEF2FF" },
  opcaoCorreta: { borderColor: "#16A34A", backgroundColor: "#DCFCE7" },
  opcaoErrada: { borderColor: "#DC2626", backgroundColor: "#FEE2E2" },
  letra: {
    width: 34, height: 34, borderRadius: 17, backgroundColor: COR,
    alignItems: "center", justifyContent: "center", marginRight: 14,
  },
  letraTexto: { color: "#FFFFFF", fontWeight: "700", fontSize: 16 },
  opcaoTexto: { fontSize: 17, color: "#1F2937", flex: 1 },
  botaoConfirmar: {
    backgroundColor: "#1E3A8A", borderRadius: 12,
    paddingVertical: 15, alignItems: "center", marginTop: 8,
  },
  botaoDesabilitado: { opacity: 0.5 },
  botaoConfirmarTexto: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
  mensagemResultado: {
    textAlign: "center", fontSize: 16, fontWeight: "700",
    color: "#0B132B", marginTop: 12,
  },
  imagensQuestao: { width: "100%", height: 220, marginTop: 12 },
});