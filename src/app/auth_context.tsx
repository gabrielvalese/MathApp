// app/auth_context.tsx
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
} from "firebase/auth";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { auth, db } from "./FirebaseConfig";
import { getLembrar, limparLembrar, setLembrar } from "./storage";

type AuthContextType = {
  user: User | null;
  nome: string;
  loading: boolean;
  signIn: (email: string, pass: string, lembrar: boolean) => Promise<void>;
  signUp: (name: string, email: string, pass: string) => Promise<void>;
  signOutUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [nome, setNome] = useState("Usuário");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeAuth: (() => void) | undefined;
    let unsubscribeDoc: (() => void) | undefined;

    unsubscribeAuth = onAuthStateChanged(auth, async (u) => {
      const userValido = u && !u.isAnonymous ? u : null;

      // Cancela listener do Firestore anterior, se existir
      if (unsubscribeDoc) {
        unsubscribeDoc();
        unsubscribeDoc = undefined;
      }

      // Caso 1: não há usuário → libera loading direto
      if (!userValido) {
        setUser(null);
        setNome("Usuário");
        setLoading(false);
        return;
      }

      // Caso 2: há usuário, mas o "Lembrar-me" está desmarcado
      const lembrarAtual = await getLembrar();
      if (!lembrarAtual) {
        // Desloga e SÓ libera o loading depois do signOut
        await signOut(auth);
        setUser(null);
        setNome("Usuário");
        setLoading(false);
        return; // ← importante: não configura o onSnapshot
      }

      // Caso 3: há usuário e "Lembrar-me" marcado → busca o nome
      setUser(userValido);

      const docRef = doc(db, "users", userValido.uid);
      unsubscribeDoc = onSnapshot(
        docRef,
        (snap) => {
          if (snap.exists() && snap.data().name) {
            setNome(snap.data().name);
          } else if (!snap.metadata.fromCache) {
            // Se veio do servidor e não tem nome, usa o fallback
            setNome(userValido.displayName ?? "Usuário");
          }
          setLoading(false);
        },
        (error) => {
          console.log("Erro no onSnapshot:", error);
          setNome(userValido.displayName ?? "Usuário");
          setLoading(false);
        }
      );
    });

    return () => {
      unsubscribeAuth?.();
      unsubscribeDoc?.();
    };
  }, []);

  const signIn = async (email: string, pass: string, lembrar: boolean) => {
    await setLembrar(lembrar);
    await signInWithEmailAndPassword(auth, email.trim(), pass);
  };

  const signUp = async (name: string, email: string, pass: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
    if (cred.user) {
      await setDoc(doc(db, "users", cred.user.uid), {
        name,
        email: email.trim(),
        createdAt: new Date(),
      });
      await updateProfile(cred.user, { displayName: name });
      setNome(name);
    }
  };

  const signOutUser = async () => {
    await limparLembrar();
    await signOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{ user, nome, loading, signIn, signUp, signOutUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);