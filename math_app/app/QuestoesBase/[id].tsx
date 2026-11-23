import { useLocalSearchParams } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { db } from '../../FirebaseConfig/FirebaseConfig';

const COR = '#F97316';
const LETRAS = ['A', 'B', 'C', 'D', 'E'];

export type Questao = {
  id: string;
  enunciado: string;
  alternativas: string[];
  respostaCorreta: string;
  imagens?: string[];
  ano?: number;
  origem?: string;
};

export default function QuestaoMath() {
  const params = useLocalSearchParams<{ id: string }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [questao, setQuestao] = useState<Questao | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [selecionada, setSelecionada] = useState<string | null>(null);
  const [confirmada, setConfirmada] = useState(false);

  useEffect(() => {
    if (!id) return;
    setQuestao(null);
    setSelecionada(null);
    setConfirmada(false);
    setCarregando(true);

    (async () => {
      try {
        const snap = await getDoc(doc(db, 'Questao', id));
        if (snap.exists()) {
          const d = snap.data();
          if (!Array.isArray(d.alternativas) || !d.enunciado || !d.respostaCorreta) {
            console.warn('Questão com formato inválido:', snap.id, d);
            return;
          }
          setQuestao({ id: snap.id, ...(d as Omit<Questao, 'id'>) });
        }
      } catch (e) {
        console.error('Erro ao carregar questão:', e);
      } finally {
        setCarregando(false);
      }
    })();
  }, [id]);

  if (carregando) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={COR} />
      </SafeAreaView>
    );
  }

  if (!questao) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
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
            <Image key={uri} source={{ uri }} style={styles.imagensQuestao} resizeMode="contain" />
          ))}
        </View>

        {questao.alternativas.map((texto, i) => {
          const letra = LETRAS[i];
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
              onPress={() => !confirmada && setSelecionada(letra)}
              activeOpacity={0.8}
            >
              <View style={styles.letra}>
                <Text style={styles.letraTexto}>{letra}</Text>
              </View>
              <Text style={styles.opcaoTexto}>{texto}</Text>
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity
          style={[styles.botaoConfirmar, (!selecionada || confirmada) && styles.botaoDesabilitado]}
          disabled={!selecionada || confirmada}
          onPress={() => setConfirmada(true)}
        >
          <Text style={styles.botaoConfirmarTexto}>Confirmar resposta</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6FA' },
  conteudo: { padding: 20, paddingBottom: 30 },
  titulo: { fontSize: 22, fontWeight: '700', color: '#1F2937', marginBottom: 12 },
  cardEnunciado: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 18,
    marginBottom: 18,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  enunciado: { fontSize: 18, color: '#111827', lineHeight: 26 },
  opcao: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  opcaoSelecionada: { borderColor: COR, backgroundColor: '#EEF2FF' },
  opcaoCorreta: { borderColor: '#16A34A', backgroundColor: '#DCFCE7' },
  opcaoErrada: { borderColor: '#DC2626', backgroundColor: '#FEE2E2' },
  letra: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COR,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  letraTexto: { color: '#fff', fontWeight: '700', fontSize: 16 },
  opcaoTexto: { fontSize: 17, color: '#1F2937', flex: 1 },
  botaoConfirmar: {
    backgroundColor: '#1E3A8A',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 8,
  },
  botaoDesabilitado: { opacity: 0.5 },
  botaoConfirmarTexto: { color: '#fff', fontSize: 16, fontWeight: '700' },

  abas: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  aba: { flex: 1, alignItems: 'center', paddingVertical: 12 },
  abaIcone: { fontSize: 22 },
  abaTexto: { fontSize: 13, color: '#374151', marginTop: 2, fontWeight: '600' },
  divisor: { width: 1, backgroundColor: '#E5E7EB', marginVertical: 8 },

  cameraContainer: { flex: 1, backgroundColor: '#000' },
  cameraControles: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  cameraCancelar: { color: '#fff', fontSize: 16, width: 70 },
  disparador: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 4,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disparadorInterno: { width: 58, height: 58, borderRadius: 29, backgroundColor: '#fff' },

  cabecalhoModal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 4,
  },
  fechar: { color: COR, fontSize: 16, fontWeight: '600' },
  vazio: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  vazioTexto: { color: '#6B7280', fontSize: 16 },
  miniatura: { width: '50%', padding: 8 },
  miniaturaImg: { width: '100%', aspectRatio: 3 / 4, borderRadius: 10, backgroundColor: '#ddd' },

  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.92)', justifyContent: 'center' },
  fotoGrande: { width: '100%', height: '75%' },
  overlayBotoes: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  overlayBotao: { color: '#fff', fontSize: 18, fontWeight: '600' },
  imagensQuestao: {
    width: '100%',
    height: 220,
    marginTop: 12,
  }
});