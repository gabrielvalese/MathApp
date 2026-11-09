// src/services/streak.ts
import { doc, runTransaction, updateDoc } from "firebase/firestore";
import { db } from "../utils/FirebaseConfig";

const MENSAGENS_META = [
  "Parabéns, você atingiu a meta! Seu próximo desafio é o dobro! 🎉",
  "Você é uma máquina! Dobramos a meta, agora é continuar! 🚀",
  "Meta batida! O próximo nível vai ser o dobro, bora? 🔥",
  "Sensacional! Sua nova meta dobrou. Mostre do que é capaz! 💪",
  "Incrível! Você superou a meta. Agora o desafio ficou o dobro! ⭐",
];

export const META_INICIAL = 30;

function hojeYMD(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function ontemYMD(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export async function registrarDesafio(uid: string) {
  const ref = doc(db, "users", uid);

  await runTransaction(db, async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists()) return;

    const data = snap.data();
    const hoje = hojeYMD();
    const ontem = ontemYMD();

    if (data.lastChallengeDate === hoje) {
      console.log("Desafio já contabilizado hoje.");
      return;
    }

    let novoStreak: number;
    if (data.lastChallengeDate === ontem) {
      novoStreak = (data.streak ?? 0) + 1;
    } else {
      novoStreak = 1;
    }

    let novaMeta = data.streakGoal ?? META_INICIAL;
    let novaMensagem = data.streakGoalMessage ?? null;
    let metaAtingida = data.metaAtingida ?? false;

    if (novoStreak >= novaMeta) {
      novaMeta = novaMeta * 2;
      novaMensagem =
        MENSAGENS_META[Math.floor(Math.random() * MENSAGENS_META.length)];
      metaAtingida = true;
      console.log("🎯 Meta batida! Nova meta:", novaMeta);
    }

    tx.update(ref, {
      streak: novoStreak,
      lastChallengeDate: hoje,
      streakGoal: novaMeta,
      streakGoalMessage: novaMensagem,
      metaAtingida,
    });

    console.log(`Streak atualizado: ${novoStreak} / meta ${novaMeta}`);
  });
}

export async function fecharPopUpMeta(uid: string) {
  await updateDoc(doc(db, "users", uid), { metaAtingida: false });
}