import type { FC } from 'react'
import { useCallback } from 'react'
import { useActor } from '@xstate/react'

import { useBookingServiceContext } from '../../../../contexts/BookingServiceContext'
import { SingInForm } from '../../../../organisms/auth/SignInForm'

export const SignInTemplate: FC = () => {
  const { bookingService } = useBookingServiceContext()
  const [, send] = useActor(bookingService)

  const onContinueWithoutSignInButtonClick = useCallback(() => {
    send({
      type: 'REQUIRE_ENTER_USER_INFO',
    })
  }, [send])

  return (
    <>
      <h1>Sign in</h1>
      <div style={{ marginBottom: '16px' }}>
        <button onClick={onContinueWithoutSignInButtonClick}>
          Continue without sing in
        </button>
      </div>
      <SingInForm />
    </>
  )
}
