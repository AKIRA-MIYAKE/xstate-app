import { useEffect } from 'react'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'

import { useAuthContext } from '../contexts/AuthContext'

import { SingInForm } from '../organisms/auth/SignInForm'

const SignInPage: NextPage = () => {
  const router = useRouter()

  const { isSignedIn } = useAuthContext()

  useEffect(() => {
    if (isSignedIn) {
      router.replace('/')
    }
  }, [isSignedIn]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      style={{
        maxWidth: '480px',
        marginRight: 'auto',
        marginLeft: 'auto',
        padding: '16px',
      }}
    >
      <h1>Sign in</h1>
      <SingInForm />
    </div>
  )
}

export default SignInPage
