import type { FC } from 'react'
import { useCallback } from 'react'
import { useActor } from '@xstate/react'
import Link from 'next/link'

import { useBookingServiceContext } from '../../../../contexts/BookingServiceContext'

export const CompleteTemplate: FC = () => {
  const { bookingService } = useBookingServiceContext()
  const [state] = useActor(bookingService)

  const {
    data: { shop },
  } = state.context

  if (!shop) {
    throw new Error('Never')
  }

  return (
    <>
      <h1>Complete</h1>
      <div>
        <Link href={`/shops/${shop.id}`}>Back to shop page</Link>
      </div>
    </>
  )
}
