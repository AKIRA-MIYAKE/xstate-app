import { useState, useCallback } from 'react'

import type { User } from '../../../../interfaces'
import { sleep } from '../../../../libs/sleep'
import { useAuthContext } from '../../../../contexts/AuthContext'

import users from '../data.json'

export interface UseSignInValue {
  isMutating: boolean
  signIn: (params: {
    email: string
    password: string
  }) => Promise<{ data: User } | { error: Error }>
}

export const useSignIn: () => UseSignInValue = () => {
  const { onSignedIn } = useAuthContext()

  const [isMutating, setIsMutating] = useState(false)

  const signIn = useCallback<UseSignInValue['signIn']>(
    async ({ email, password }) => {
      setIsMutating(true)

      await sleep(1000)

      const user = users.find((user) => user.email === email)

      if (!user || password !== 'password') {
        setIsMutating(false)
        return { error: new Error('Your sign in attempt has failed') }
      }

      onSignedIn({ user, token: 'Access token' })

      setIsMutating(false)

      return { data: user }
    },
    [onSignedIn]
  )

  return { isMutating, signIn }
}
