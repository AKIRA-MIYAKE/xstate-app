import type { FC, ChangeEventHandler } from 'react'
import { useState, useCallback, useEffect } from 'react'
import { useActor } from '@xstate/react'

import { canTransitFromEnteringToCompleteOnEnteringUserInfo } from '../../../../state-machines/booking-machine'
import { useBookingServiceContext } from '../../../../contexts/BookingServiceContext'

export const EnterUserInfoTemplate: FC = () => {
  const { bookingService } = useBookingServiceContext()
  const [state, send] = useActor(bookingService)

  const {
    input: { userInfo },
  } = state.context

  const [inputUserInfo, setInputUserInfo] = useState(() => {
    return userInfo || { email: '', name: '', phone: '' }
  })

  const onSignInButtonClick = useCallback(() => {
    send({
      type: 'REQUIRE_SIGN_IN',
    })
  }, [send])

  const onEmailInputChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (event) => {
      setInputUserInfo((current) => {
        return {
          ...current,
          email: event.target.value,
        }
      })
    },
    []
  )

  const onNameInputChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (event) => {
      setInputUserInfo((current) => {
        return {
          ...current,
          name: event.target.value,
        }
      })
    },
    []
  )

  const onPhoneInputChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (event) => {
      setInputUserInfo((current) => {
        return {
          ...current,
          phone: event.target.value,
        }
      })
    },
    []
  )

  const onNextButtonClick = useCallback(() => {
    send({
      type: 'NEXT',
    })
  }, [send])

  useEffect(() => {
    send({
      type: 'ENTER_USER_INFO',
      payload: { userInfo: inputUserInfo },
    })
  }, [send, inputUserInfo])

  return (
    <>
      <h1>Enter user info</h1>
      <div style={{ marginBottom: '16px' }}>
        <button onClick={onSignInButtonClick}>Sing in</button>
      </div>
      <div style={{ marginBottom: '16px' }}>
        <div>
          <input
            type="email"
            placeholder="Email"
            value={inputUserInfo.email}
            onChange={onEmailInputChange}
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Name"
            value={inputUserInfo.name}
            onChange={onNameInputChange}
          />
        </div>
        <div>
          <input
            type="tel"
            placeholder="Phone"
            value={inputUserInfo.phone}
            onChange={onPhoneInputChange}
          />
        </div>
      </div>
      <div>
        <button
          onClick={onNextButtonClick}
          disabled={
            !canTransitFromEnteringToCompleteOnEnteringUserInfo(state.context)
          }
        >
          Next
        </button>
      </div>
    </>
  )
}
