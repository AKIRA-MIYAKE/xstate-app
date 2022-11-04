import type { FC, ReactNode } from 'react'

import { AppHeader } from '../../organisms/commons/AppHeader'

export const DefaultLayout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div
      style={{
        maxWidth: '480px',
        marginRight: 'auto',
        marginLeft: 'auto',
        padding: '16px',
      }}
    >
      <AppHeader />
      {children}
    </div>
  )
}
