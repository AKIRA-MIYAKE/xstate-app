import type { ReactNode } from 'react'
import { Component } from 'react'
import ErrorPage from 'next/error'

export interface ErrorBoundaryProps {
  children: ReactNode
}

export interface ErrorBoundaryState {
  error?: Error
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error }
  }

  constructor(props: { children: ReactNode }) {
    super(props)

    this.state = { error: undefined }
  }

  render(): ReactNode {
    if (typeof this.state.error !== 'undefined') {
      switch (this.state.error.message) {
        case 'NotFound':
          return <ErrorPage statusCode={404} />
        default:
          return <ErrorPage statusCode={500} />
      }
    }

    return this.props.children
  }
}
