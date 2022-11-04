import type { FC } from 'react'
import { useCallback } from 'react'
import Link from 'next/link'

import { useAuthContext } from '../../../contexts/AuthContext'
import { useSignOut } from '../../../hooks/api/auth/useSignOut'

export const AppHeader: FC = () => {
  const { isSignedIn, user } = useAuthContext()
  const { signOut } = useSignOut()

  const onSignOutButtonClick = useCallback(() => {
    signOut()
  }, [signOut])

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <Link href="/">Xstate app</Link>
        </div>

        <div>
          {(() => {
            if (!isSignedIn || !user) {
              return <Link href="/signin">Sign in</Link>
            }

            return (
              <>
                <span style={{ marginRight: '12px' }}>{user.name}</span>
                <button onClick={onSignOutButtonClick}>Sign out</button>
              </>
            )
          })()}
        </div>
      </div>
    </div>
  )
}
