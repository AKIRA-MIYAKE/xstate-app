import type { FC } from 'react'
import { useCallback } from 'react'
import { useActor } from '@xstate/react'

import { useBookingServiceContext } from '../../../../contexts/BookingServiceContext'

export const ConfirmTemplate: FC = () => {
  const { bookingService } = useBookingServiceContext()
  const [state, send] = useActor(bookingService)

  const {
    data: { shop, user },
    input: { menuId, dateTime, userInfo },
    error,
  } = state.context

  const onSubmitButtonClick = useCallback(() => {
    send({
      type: 'SUBMIT',
    })
  }, [send])

  if (!shop || !menuId || !dateTime || (!user && !userInfo)) {
    throw new Error('Never')
  }

  const menu = shop.menus.find((menu) => menu.id === menuId)

  if (!menu) {
    throw new Error('Never')
  }

  return (
    <>
      <h1>Confirm</h1>
      {error && error.message}
      <div>
        <div>
          <h2>Menu</h2>
          <p>{menu.name}</p>
        </div>
        <div>
          <h2>Date time</h2>
          <p>{dateTime}</p>
        </div>
        <div>
          <h2>User info</h2>
          <div>
            {(() => {
              const email = userInfo?.email || user?.email
              const name = userInfo?.name || user?.name
              const phone = userInfo?.phone || user?.phone

              return (
                <dl>
                  <dt>Email</dt>
                  <dd>{email}</dd>
                  <dt>Name</dt>
                  <dd>{name}</dd>
                  <dt>Phone</dt>
                  <dd>{phone}</dd>
                </dl>
              )
            })()}
          </div>
        </div>
      </div>
      <div>
        <button onClick={onSubmitButtonClick}>Submit</button>
      </div>
    </>
  )
}
