import type { FC, ReactNode } from 'react'
import { BookingServiceContextProvider } from '../../../contexts/BookingServiceContext'

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
        {children}
      </div>
    </BookingServiceContextProvider>
  )
}
