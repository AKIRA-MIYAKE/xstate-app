import type { FC, ChangeEventHandler } from 'react'
import { useCallback } from 'react'
import { useActor } from '@xstate/react'

import { useBookingServiceContext } from '../../../../contexts/BookingServiceContext'

export const SelectDateTimeTemplate: FC = () => {
  const { bookingService } = useBookingServiceContext()
  const [state, send] = useActor(bookingService)

  const {
    input: { dateTime },
  } = state.context

  const onDateTimeInputChange = useCallback<
    ChangeEventHandler<HTMLInputElement>
  >(
    (event) => {
      send({
        type: 'SELECT_DATE_TIME',
        payload: { dateTime: event.target.value },
      })
    },
    [send]
  )

  const onNextButtonClick = useCallback(() => {
    send({ type: 'NEXT' })
  }, [send])

  return (
    <>
      <h1>Select date time</h1>
      <div style={{ marginBottom: '16px' }}>
        <input
          type="datetime-local"
          value={dateTime || ''}
          onChange={onDateTimeInputChange}
        />
      </div>
      <div>
        <button onClick={onNextButtonClick}>Next</button>
      </div>
    </>
  )
}
