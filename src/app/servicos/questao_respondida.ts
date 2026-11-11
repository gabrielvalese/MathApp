
import { auth, db } from "../FirebaseConfig";

import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";

type DadosResposta = {
  questaoId: string;
  idQuestao: number | null;
  resposta: string;
  respostaCorreta: string;
  tentativaId?: string;
};

export async function salvarQuestaoRespondida({
  questaoId,
  idQuestao,
  resposta,
  respostaCorreta,
  tentativaId,
}: DadosResposta): Promise<{
  registroId: string;
  acertou: boolean;
}> {
  const usuario = auth.currentUser;

  if (!usuario) {
    throw new Error("Usuário não autenticado.");
  }

  if (!questaoId || !resposta || !respostaCorreta) {
    throw new Error("Dados da resposta incompletos.");
  }

  const respostaFinal = resposta.trim().toUpperCase();

  const acertou =
    respostaFinal === respostaCorreta.trim().toUpperCase();

  // Buscar ID numérico do estudante, caso exista.
  let idEstudante: number | undefined;

  try {
    const perfil = await getDoc(
      doc(db, "users", usuario.uid)
    );

    if (perfil.exists()) {
      const valor = perfil.data().id_estudante;

      if (
        typeof valor === "number" &&
        Number.isSafeInteger(valor) &&
        valor > 0
      ) {
        idEstudante = valor;
      }
    }
  } catch (erro) {
    console.warn(
      "Não foi possível consultar o ID numérico:",
      erro
    );
  }

  const registro: Record<string, unknown> = {
    usuario_uid: usuario.uid,
    questao_documento_id: questaoId,
    resposta: respostaFinal,
    acerto: acertou,
    data_realizacao: serverTimestamp(),
  };

  if (idEstudante !== undefined) {
    registro.id_estudante = idEstudante;
  }

  if (
    idQuestao !== null &&
    Number.isSafeInteger(idQuestao) &&
    idQuestao > 0
  ) {
    registro.id_questao = idQuestao;
  }

  if (tentativaId) {
    registro.tentativa_id = tentativaId;
  }

  // ÚNICO INSERT: coleção faz_questao.
  const referencia = await addDoc(
    collection(db, "faz_questao"),
    registro
  );

  console.log("Resposta registrada:", referencia.id);

  return {
    registroId: referencia.id,
    acertou,
  };
}
