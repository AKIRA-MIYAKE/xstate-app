import type { ReactElement, ReactNode } from 'react'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'

import { AuthContextProvider } from '../contexts/AuthContext'
import { ErrorBoundary } from '../components/ErrorBoundary'

import 'sanitize.css'

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page)

  return (
    <AuthContextProvider>
      <ErrorBoundary>{getLayout(<Component {...pageProps} />)}</ErrorBoundary>
    </AuthContextProvider>
  )
}
