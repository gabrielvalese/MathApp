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
import { limparLembrar, setLembrar } from "./storage";

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

      // Sem usuário → libera loading e vai para login
      if (!userValido) {
        setUser(null);
        setNome("Usuário");
        setLoading(false);
        return;
      }

      // Usuário logado → busca o nome normalmente
      setUser(userValido);

      const docRef = doc(db, "users", userValido.uid);
      unsubscribeDoc = onSnapshot(
        docRef,
        (snap) => {
          if (snap.exists() && snap.data().name) {
            setNome(snap.data().name);
          } else if (!snap.metadata.fromCache) {
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