import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { auth, db } from "./FirebaseConfig";


type AuthContextType = {
  user: User | null;
  nome: string;          // <-- novo
  loading: boolean;
  signIn: (email: string, pass: string) => Promise<void>;
  signUp: (name: string, email: string, pass: string) => Promise<void>;
  signOutUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [nome, setNome] = useState("Usuário");
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const unsub = onAuthStateChanged(auth, async (u) => {
    const userValido = u && !u.isAnonymous ? u : null;
    setUser(userValido);

    if (userValido) {
      try {
        const snap = await getDoc(doc(db, "users", userValido.uid));
        if (snap.exists()) {
          setNome(snap.data().name ?? userValido.displayName ?? "Usuário");
        } else {
          setNome(userValido.displayName ?? "Usuário");
        }
      } catch {
        setNome(userValido.displayName ?? "Usuário");
      }
    } else {
      setNome("Usuário");
    }
    setLoading(false);
  });
  return unsub;
}, []);

  const signIn = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const signUp = async (name: string, email: string, pass: string) => {
  const cred = await createUserWithEmailAndPassword(auth, email, pass);
  if (cred.user) {
    await updateProfile(cred.user, { displayName: name });

    // Envia o e-mail de verificação
    await sendEmailVerification(cred.user);

    // Salva no Firestore com flag "não verificado"
    await setDoc(doc(db, "users", cred.user.uid), {
      name,
      email,
      emailVerified: false,
      createdAt: new Date(),
    });
  }
};

  const signOutUser = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, nome, loading, signIn, signUp, signOutUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
