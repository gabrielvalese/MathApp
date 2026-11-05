
import { useEffect, useState } from "react";

import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View, } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { onAuthStateChanged } from "firebase/auth";

import { collection, onSnapshot, query, where, } from "firebase/firestore";

import { auth, db } from "../FirebaseConfig";

type Tentativa = {
  id: string;
  simulado_id: string;
  nome_simulado: string;
  quantidade_questoes: number;
  status: string;
  acertos: number | null;
  iniciadoEmMs: number;
};

export default function MeusSimulados() {
  const [uid, setUid] = useState<string | null>(null);
  const [authPronto, setAuthPronto] = useState(false);

  const [simulados, setSimulados] =
    useState<Tentativa[]>([]);

  const [carregando, setCarregando] =
    useState(true);

  const [erro, setErro] = useState("");

  // 1. Identifica o usuário autenticado
  useEffect(() => {
    const cancelar = onAuthStateChanged(
      auth,
      (usuario) => {
        setUid(usuario?.uid ?? null);
        setAuthPronto(true);
      }
    );

    return cancelar;
  }, []);

  useEffect(() => {
    if (!authPronto) return;

    if (!uid) {
      setSimulados([]);
      setCarregando(false);
      return;
    }

    setCarregando(true);
    setErro("");

    const consulta = query(
      collection(db, "tentativas_simulado"),
      where("usuario_id", "==", uid)
    );

    const cancelar = onSnapshot(
      consulta,
      (snapshot) => {
        const lista: Tentativa[] =
          snapshot.docs.map((documento) => {
            const dados = documento.data();

            return {
              id: documento.id,
              simulado_id: dados.simulado_id ?? "",
              nome_simulado:
                dados.nome_simulado ?? "Simulado",
              quantidade_questoes:
                dados.quantidade_questoes ?? 0,
              status:
                dados.status ?? "em_andamento",
              acertos:
                typeof dados.acertos === "number"
                  ? dados.acertos
                  : null,
              iniciadoEmMs:
                dados.iniciado_em?.toMillis?.() ?? 0,
            };
          });

        // Mais recentes primeiro
        lista.sort(
          (a, b) => b.iniciadoEmMs - a.iniciadoEmMs
        );

        setSimulados(lista);
        setCarregando(false);
      },
      (error) => {
        console.error(error);
        setErro("Não foi possível carregar os simulados.");
        setCarregando(false);
      }
    );

    return cancelar;
  }, [uid, authPronto]);

  if (!authPronto || carregando) {
    return (
      <ActivityIndicator
        color="#F97316"
        size="large"
        style={{ marginTop: 30 }}
      />
    );
  }

  if (!uid) {
    return (
      <Text style={styles.aviso}>
        Faça login para ver seus simulados.
      </Text>
    );
  }

  if (erro) {
    return <Text style={styles.aviso}>{erro}</Text>;
  }

  return (
    <View style={styles.area_meus_simulados}>
      <Text style={styles.titulo}>
        Meus simulados
      </Text>

      <Text style={styles.descricao}>
        Continue seus estudos ou consulte resultados.
      </Text>

      {simulados.length === 0 ? (
        <Text style={styles.aviso}>
          Você ainda não iniciou nenhum simulado.
        </Text>
      ) : (
        simulados.map((simulado) => {
          const concluido =
            simulado.status === "concluido";

          return (
            <Pressable
              key={simulado.id}
              style={styles.card}
              onPress={() => {
                Alert.alert(
                  simulado.nome_simulado,
                  `Tentativa: ${simulado.id}`
                );
              }}
            >
              <View style={styles.linha}>
                <Text style={styles.nome}>
                  {simulado.nome_simulado}
                </Text>

                <Ionicons
                  name="chevron-forward"
                  size={22}
                  color="#F97316"
                />
              </View>

              <Text style={styles.detalhes}>
                {simulado.quantidade_questoes} questões
              </Text>

              <View style={styles.linha_status}>
                <Ionicons
                  name={
                    concluido
                      ? "checkmark-circle-outline"
                      : "time-outline"
                  }
                  size={18}
                  color="#0B132B"
                />

                <Text style={styles.status}>
                  {concluido
                    ? `Concluído • ${simulado.acertos ?? 0} acertos`
                    : "Em andamento"}
                </Text>
              </View>
            </Pressable>
          );
        })
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  area_meus_simulados: {
    width: "100%",
    maxWidth: 420,
    marginTop: 10,
    padding: 20,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "rgba(0, 0, 0, 0.15)",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0B132B",
    marginBottom: 5,
  },
  descricao: {
    fontSize: 14,
    color: "#64748B",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#F8FAFC",
    borderColor: "#E2E8F0",
    borderWidth: 1,
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
  },
  linha: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  nome: {
    flex: 1,
    fontSize: 16,
    fontWeight: "bold",
    color: "#0B132B",
  },
  detalhes: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 8,
  },
  linha_status: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 10,
  },
  status: {
    fontSize: 13,
    fontWeight: "600",
    color: "#0B132B",
  },
  aviso: {
    color: "#64748B",
    textAlign: "center",
    marginVertical: 24,
  },
});
