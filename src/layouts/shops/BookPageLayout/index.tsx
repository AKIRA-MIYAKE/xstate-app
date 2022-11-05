import type { FC, ReactNode } from 'react'

import { BookingServiceContextProvider } from '../../../contexts/BookingServiceContext'
import { BookPageHeader } from '../../../organisms/shops/BookPageHeader'

export const BookPageLayout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <BookingServiceContextProvider>
      <div
        style={{
          maxWidth: '480px',
          marginRight: 'auto',
          marginLeft: 'auto',
          padding: '16px',
        }}
      >
        <BookPageHeader />
        {children}
      </div>
    </BookingServiceContextProvider>
  )
}
