import type { FC, ReactNode } from 'react'
import {
  createContext,
  useState,
  useMemo,
  useCallback,
  useContext,
} from 'react'

import type { User } from '../../interfaces'

export interface AuthContextValue {
  isSignedIn: boolean
  user?: User
  token?: string
  onSignedIn: (params: { user: User; token: string }) => void
  onSignedOut: () => void
}

export const AuthContext = createContext<AuthContextValue>({
  isSignedIn: false,
  user: undefined,
  token: undefined,
  onSignedIn: () => {},
  onSignedOut: () => {},
})

export const AuthContextProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | undefined>(undefined)
  const [token, setToken] = useState<string | undefined>(undefined)

  const isSignedIn = useMemo(() => {
    return !!user && !!token
  }, [user, token])

  const onSignedIn = useCallback<AuthContextValue['onSignedIn']>(
    ({ user, token }) => {
      setUser(user)
      setToken(token)
    },
    []
  )

  const onSignedOut = useCallback<AuthContextValue['onSignedOut']>(() => {
    setUser(undefined)
    setToken(undefined)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        isSignedIn,
        user,
        token,
        onSignedIn,
        onSignedOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext: () => AuthContextValue = () => {
  return useContext(AuthContext)
}
