import AsyncStorage from "@react-native-async-storage/async-storage";

const CHAVE_LEMBRAR = "@mathapp:lembrar";

export async function setLembrar(valor: boolean) {
  await AsyncStorage.setItem(CHAVE_LEMBRAR, valor ? "1" : "0");
}

export async function getLembrar(): Promise<boolean> {
  const v = await AsyncStorage.getItem(CHAVE_LEMBRAR);
  return v === "1";
}

export async function limparLembrar() {
  await AsyncStorage.removeItem(CHAVE_LEMBRAR);
}