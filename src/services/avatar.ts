// services/avatar.ts (versão de diagnóstico)
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { auth } from "../utils/FirebaseConfig";

const CHAVE_FOTO = (uid: string) => `@mathapp:foto:${uid}`;

export async function escolherAvatarLocal(
  origem: "camera" | "galeria"
): Promise<string | null> {
  const usuario = auth.currentUser;
  if (!usuario) return null;

  console.log(`[AVATAR] Solicitando permissão para: ${origem}`);

  const perm =
    origem === "camera"
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

  console.log(`[AVATAR] Permissão:`, perm.status, perm.granted);

  if (!perm.granted) {
    alert("Permissão necessária. Vá nas configurações do celular e permita o acesso.");
    return null;
  }

  console.log(`[AVATAR] Abrindo picker...`);

  try {
    const resultado =
      origem === "camera"
        ? await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
          })
        : await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
            legacy: true,
          });

    console.log(`[AVATAR] Resultado do picker:`, resultado.canceled, resultado.assets?.length);

    if (resultado.canceled || !resultado.assets?.[0]) return null;

    const uri = resultado.assets[0].uri;
    console.log(`[AVATAR] URI obtida:`, uri);

    // Salva a URI diretamente (sem copiar)
    await AsyncStorage.setItem(CHAVE_FOTO(usuario.uid), uri);
    console.log(`[AVATAR] URI salva no AsyncStorage.`);

    return uri;
  } catch (error) {
    console.error(`[AVATAR] Erro no picker:`, error);
    alert("Erro ao abrir a câmera/galeria. Veja o console para mais detalhes.");
    return null;
  }
}

export async function carregarAvatarLocal(): Promise<string | null> {
  const usuario = auth.currentUser;
  if (!usuario) return null;
  return await AsyncStorage.getItem(CHAVE_FOTO(usuario.uid));
}

export async function removerAvatarLocal(): Promise<void> {
  const usuario = auth.currentUser;
  if (!usuario) return;
  await AsyncStorage.removeItem(CHAVE_FOTO(usuario.uid));
}