import { useState, useCallback } from 'react'

import { sleep } from '../../../../libs/sleep'
import { useAuthContext } from '../../../../contexts/AuthContext'

export interface UseSignOutValue {
  isMutating: boolean
  signOut: () => Promise<{} | { error: Error }>
}

export const useSignOut: () => UseSignOutValue = () => {
  const { onSignedOut } = useAuthContext()

  const [isMutating, setIsMutating] = useState(false)

  const signOut = useCallback<UseSignOutValue['signOut']>(async () => {
    setIsMutating(true)

    await sleep(1000)

    onSignedOut()

    setIsMutating(false)

    return {}
  }, [onSignedOut])

  return { isMutating, signOut }
}
