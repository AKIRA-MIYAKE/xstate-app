import type { FC } from 'react'
import { useCallback } from 'react'
import { useActor } from '@xstate/react'

import { useBookingServiceContext } from '../../../../contexts/BookingServiceContext'

export const ConfirmCurrentUserTemplate: FC = () => {
  const { bookingService } = useBookingServiceContext()
  const [state, send] = useActor(bookingService)

  const {
    data: { user },
  } = state.context

  const onNextButtonClick = useCallback(() => {
    send({
      type: 'NEXT',
    })
  }, [send])

  if (!user) {
    throw new Error('Never')
  }

  return (
    <>
      <h1>Confirm current user</h1>
      <div style={{ marginBottom: '16px' }}>
        <dl>
          <dt>Email</dt>
          <dd>{user.email}</dd>
          <dt>Name</dt>
          <dd>{user.name}</dd>
          <dt>Phone</dt>
          <dd>{user.phone}</dd>
        </dl>
      </div>
      <div>
        <button onClick={onNextButtonClick}>Next</button>
      </div>
    </>
  )
}
