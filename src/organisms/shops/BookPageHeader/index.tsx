import type { FC } from 'react'
import { useMemo, useCallback } from 'react'
import { useActor } from '@xstate/react'

import { useBookingServiceContext } from '../../../contexts/BookingServiceContext'

export const BookPageHeader: FC = () => {
  const { bookingService } = useBookingServiceContext()
  const [state, send] = useActor(bookingService)

  const {
    data: { shop },
  } = state.context

  const canBack = useMemo(() => {
    switch (true) {
      case state.matches('selectingDateTime'):
      case state.matches('enteringUserInfo'):
      case state.matches('confirming'):
        return true
      default:
        return false
    }
  }, [state])

  const onBackButtonClick = useCallback(() => {
    send({
      type: 'BACK',
    })
  }, [send])

  if (!shop) {
    return null
  }

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div>{shop.name}</div>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ width: '10%' }}>
          {canBack && <button onClick={onBackButtonClick}>Back</button>}
        </div>

        <div
          style={{
            display: 'flex',
            gap: '16px',
          }}
        >
          <div
            style={{
              color: !state.matches('selectingMenu') ? 'lightgray' : undefined,
            }}
          >
            Menu
          </div>
          <div
            style={{
              color: !state.matches('selectingDateTime')
                ? 'lightgray'
                : undefined,
            }}
          >
            Date time
          </div>
          <div
            style={{
              color: !state.matches('enteringUserInfo')
                ? 'lightgray'
                : undefined,
            }}
          >
            User
          </div>
          <div
            style={{
              color: !state.matches('confirming') ? 'lightgray' : undefined,
            }}
          >
            Confirm
          </div>
        </div>

        <div style={{ width: '10%' }} />
      </div>
    </div>
  )
}
