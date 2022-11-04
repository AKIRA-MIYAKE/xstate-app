import type { FC, ChangeEventHandler, FormEventHandler } from 'react'
import { useState, useCallback } from 'react'

import { useSignIn } from '../../../hooks/api/auth/useSignIn'

export const SingInForm: FC = () => {
  const { isMutating, signIn } = useSignIn()

  const [inputEmail, setInputEmail] = useState('')
  const [inputPassword, setInputPassword] = useState('')
  const [error, setError] = useState<Error | undefined>(undefined)

  const onEmailInputChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (event) => {
      setInputEmail(event.target.value)
    },
    []
  )

  const onPasswordInputChange = useCallback<
    ChangeEventHandler<HTMLInputElement>
  >((event) => {
    setInputPassword(event.target.value)
  }, [])

  const onSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
    async (event) => {
      event.preventDefault()

      const result = await signIn({
        email: inputEmail,
        password: inputPassword,
      })

      if ('error' in result) {
        setError(result.error)
        return
      }
    },
    [signIn, inputEmail, inputPassword]
  )

  return (
    <form onSubmit={onSubmit}>
      {error && <p>{error.message}</p>}
      <div style={{ marginBottom: '16px' }}>
        <div>
          <input
            type="email"
            placeholder="Email"
            value={inputEmail}
            onChange={onEmailInputChange}
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            value={inputPassword}
            onChange={onPasswordInputChange}
          />
        </div>
      </div>

      <div>
        <button disabled={isMutating}>Sign in</button>
      </div>
    </form>
  )
}
