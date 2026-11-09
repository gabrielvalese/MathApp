import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";
import { Appearance } from "react-native";

export type Tema = "light" | "dark";

type ThemeContextType = {
  tema: Tema;
  toggleTema: () => void;
  cores: typeof CORES_LIGHT;
};

const CORES_LIGHT = {
  fundo: "#F5F6FA",
  card: "#FFFFFF",
  cardSecundario: "#FFF7ED",
  texto: "#1E3A8A",
  textoSuave: "#6B7280",
  borda: "#E5E7EB",
  laranja: "#F97316",
  azul: "#1E3A8A",
  verde: "#16A34A",
  perigo: "#DC2626",
};

const CORES_DARK = {
  fundo: "#1E2028",
  card: "#2A2D38",
  cardSecundario: "#3A3228",
  texto: "#E5E7EB",
  textoSuave: "#9CA3AF",
  borda: "#3F4250",
  laranja: "#FB923C",
  azul: "#93C5FD",
  verde: "#4ADE80",
  perigo: "#F87171",
};

const ThemeContext = createContext<ThemeContextType>({} as ThemeContextType);

const CHAVE_TEMA = "@mathapp:tema";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [tema, setTema] = useState<Tema>("light");

  useEffect(() => {
    (async () => {
      const salvo = await AsyncStorage.getItem(CHAVE_TEMA);
      if (salvo === "dark" || salvo === "light") {
        setTema(salvo);
      } else {
        const sistema = Appearance.getColorScheme();
        setTema(sistema === "dark" ? "dark" : "light");
      }
    })();
  }, []);

  function toggleTema() {
    const novo = tema === "light" ? "dark" : "light";
    setTema(novo);
    AsyncStorage.setItem(CHAVE_TEMA, novo);
  }

  const cores = tema === "dark" ? CORES_DARK : CORES_LIGHT;

  return (
    <ThemeContext.Provider value={{ tema, toggleTema, cores }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);