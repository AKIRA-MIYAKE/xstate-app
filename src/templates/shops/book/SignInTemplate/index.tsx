import type { FC } from 'react'

import { SingInForm } from '../../../../organisms/auth/SignInForm'

export const SignInTemplate: FC = () => {
  return (
    <>
      <h1>Sign in</h1>
      <SingInForm />
    </>
  )
}
