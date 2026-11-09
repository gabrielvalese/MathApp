// src/services/progresso.ts
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../utils/FirebaseConfig";

export async function salvarQuestaoRespondida(
  uid: string,
  questaoId: string,
  acertou: boolean
) {
  const ref = doc(db, "users", uid, "questoes_respondidas", questaoId);
  await setDoc(
    ref,
    {
      respondidaEm: serverTimestamp(),
      acertou,
    },
    { merge: true }
  );
  console.log(`✅ Questão ${questaoId} salva como respondida.`);
}