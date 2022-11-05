import type { FC, ChangeEventHandler } from 'react'
import { useCallback } from 'react'
import { useActor } from '@xstate/react'

import { canTransitFromSelectingToCompleteOnSelectingMenu } from '../../../../state-machines/booking-machine'
import { useBookingServiceContext } from '../../../../contexts/BookingServiceContext'

export const SelectMenuTemplate: FC = () => {
  const { bookingService } = useBookingServiceContext()
  const [state, send] = useActor(bookingService)

  const {
    data: { shop },
    input: { menuId },
  } = state.context

  const onMenuInputChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (event) => {
      send({
        type: 'SELECT_MENU',
        payload: { menuId: event.target.value },
      })
    },
    [send]
  )

  const onNextButtonClick = useCallback(() => {
    send({ type: 'NEXT' })
  }, [send])

  if (!shop) {
    throw new Error('Never')
  }

  return (
    <>
      <h1>Select menu</h1>
      <ul>
        {shop.menus.map((menu) => {
          return (
            <li key={menu.id}>
              <label>
                <input
                  type="radio"
                  value={menu.id}
                  checked={menu.id === menuId}
                  onChange={onMenuInputChange}
                />
                <span style={{ marginLeft: '12px' }}>{menu.name}</span>
              </label>
            </li>
          )
        })}
      </ul>
      <div>
        <button
          onClick={onNextButtonClick}
          disabled={
            !canTransitFromSelectingToCompleteOnSelectingMenu(state.context)
          }
        >
          Next
        </button>
      </div>
    </>
  )
}
