import type { FC, ReactNode } from 'react'
import { createContext, useContext } from 'react'
import type { InterpreterFrom } from 'xstate'
import { useInterpret } from '@xstate/react'
import dayjs from 'dayjs'

import { sleep } from '../../libs/sleep'
import { bookingMachine } from '../../state-machines/booking-machine'

// https://xstate.js.org/docs/recipes/react.html

export interface BookingServiceContextValue {
  bookingService: InterpreterFrom<typeof bookingMachine>
}

export const BookingServiceContext = createContext<BookingServiceContextValue>(
  {} as any
)

export const BookingServiceContextProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const bookingService = useInterpret(bookingMachine)

  return (
    <BookingServiceContext.Provider value={{ bookingService }}>
      {children}
    </BookingServiceContext.Provider>
  )
}

export const useBookingServiceContext: () => BookingServiceContextValue =
  () => {
    return useContext(BookingServiceContext)
  }
