import { getAuth, signInWithPopup } from "@firebase/auth";
import { createContext, ReactNode, useEffect, useState } from "react";
import { auth, authProvider } from "../services/firebase";

export const AuthContext = createContext<AuthContextData>({} as AuthContextData)

type AuthProviderPropsType = {
  children: ReactNode
}

type User = {
  id: string,
  name: string,
  profileImageUrl: string
}

type AuthContextData = {
  isSigned: boolean,
  user: User | undefined,
  signInWithGoogle(): Promise<void>
}

export function AuthContextProvider(props: AuthProviderPropsType) {
  const [user, setUser] = useState<User>();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        const { displayName, photoURL, uid } = user;

        if (!displayName || !photoURL) {
          throw new Error('Missing user information');
        }

        setUser({
          id: uid,
          name: displayName,
          profileImageUrl: photoURL
        })
      }
    });

    return () => {
      unsubscribe();
    }

  }, [])

  async function signInWithGoogle() {
    const result = await signInWithPopup(auth, authProvider);

    if (result.user && result.user.displayName && result.user.photoURL) {
      setUser({
        id: result.user.uid,
        name: result.user.displayName,
        profileImageUrl: result.user.photoURL
      })
    }
  }


  return (
    <AuthContext.Provider value={{ isSigned: !!user, user, signInWithGoogle }}>
      {props.children}
    </AuthContext.Provider >
  )
}