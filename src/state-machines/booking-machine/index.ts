import { createMachine, assign } from 'xstate'
import dayjs from 'dayjs'

import type { Shop, User } from '../../interfaces'
import { sleep } from '../../libs/sleep'

export interface BookingMachineContext {
  data: {
    shop?: Shop
    user?: User
  }
  input: {
    menuId?: string
    dateTime?: string
    userInfo?: { email: string; name: string; phone: string }
  }
  error?: Error
}

export type BookingMachineEvent =
  | {
      type: 'SET_SHOP'
      payload: { shop: Shop }
    }
  | {
      type: 'SET_USER'
      payload: { user: User }
    }
  | {
      type: 'NEXT'
    }
  | {
      type: 'BACK'
    }
  | {
      type: 'SELECT_MENU'
      payload: { menuId: string }
    }
  | {
      type: 'SELECT_DATE_TIME'
      payload: { dateTime: string }
    }
  | {
      type: 'ENTER_USER_INFO'
      payload: { userInfo: { email: string; name: string; phone: string } }
    }
  | {
      type: 'REQUIRE_SIGN_IN'
    }
  | {
      type: 'REQUIRE_ENTER_USER_INFO'
    }
  | {
      type: 'SUBMIT'
    }

export const submit: (context: BookingMachineContext) => Promise<void> = async (
  context
) => {
  await sleep(1000)

  const dateTime = dayjs(context.input.dateTime)

  if (dateTime.isBefore(dayjs().add(1, 'days'))) {
    throw new Error('This is a date that cannot be reserved.')
  }

  return
}

export const canTransitIdleToCompleteOnIdle: (
  context: BookingMachineContext
) => boolean = (context) => {
  return typeof context.data.shop !== 'undefined'
}

export const canTransitFromSelectingToCompleteOnSelectingMenu: (
  context: BookingMachineContext
) => boolean = (context) => {
  return typeof context.input.menuId !== 'undefined'
}

export const canTransitFromSelectingToCompleteOnSelectingDateTime: (
  context: BookingMachineContext
) => boolean = (context) => {
  return typeof context.input.dateTime !== 'undefined'
}

export const canTransitFromIdleToEnteringOnEnteringUserInfo: (
  context: BookingMachineContext
) => boolean = (context) => {
  return typeof context.data.user === 'undefined'
}

export const canTransitFromIdleToConfirmingCurrentUserOnEnteringUserInfo: (
  context: BookingMachineContext
) => boolean = (context) => {
  return typeof context.data.user !== 'undefined'
}

export const canTransitFromEnteringToCompleteOnEnteringUserInfo: (
  context: BookingMachineContext
) => boolean = (context) => {
  return (
    typeof context.input.userInfo !== 'undefined' &&
    /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(context.input.userInfo.email) &&
    context.input.userInfo.name.length > 0 &&
    context.input.userInfo.phone.length > 0
  )
}

export const canTransitFromSigningInToConfirmingCurrentUserOnEnteringUserInfo: (
  context: BookingMachineContext
) => boolean = (context) => {
  return typeof context.data.user !== 'undefined'
}

export const canTransitFromConfirmingCurrentUserOnEnteringUserInfo: (
  context: BookingMachineContext
) => boolean = (context) => {
  return typeof context.data.user !== 'undefined'
}

export const bookingMachine = createMachine<
  BookingMachineContext,
  BookingMachineEvent
>(
  {
    predictableActionArguments: true,
    id: 'bookingMachine',
    initial: 'idle',
    context: {
      data: {},
      input: {},
    },
    states: {
      idle: {
        initial: 'idle',
        onDone: {
          target: 'selectingMenu',
        },
        states: {
          idle: {
            always: [
              {
                target: 'complete',
                cond: 'canTransitIdleToCompleteOnIdle',
              },
            ],
          },
          complete: {
            type: 'final',
          },
        },
      },
      selectingMenu: {
        initial: 'idle',
        onDone: {
          target: 'selectingDateTime',
        },
        states: {
          idle: {
            always: [
              {
                target: 'selecting',
              },
            ],
          },
          selecting: {
            on: {
              SELECT_MENU: {
                actions: ['assignInputMenuId'],
              },
              NEXT: {
                target: 'complete',
                cond: 'canTransitFromSelectingToCompleteOnSelectingMenu',
              },
            },
          },
          complete: {
            type: 'final',
          },
        },
      },
      selectingDateTime: {
        initial: 'idle',
        onDone: {
          target: 'enteringUserInfo',
        },
        states: {
          idle: {
            always: [
              {
                target: 'selecting',
              },
            ],
          },
          selecting: {
            on: {
              SELECT_DATE_TIME: {
                actions: ['assignInputDateTime'],
              },
              NEXT: {
                target: 'complete',
                cond: 'canTransitFromSelectingToCompleteOnSelectingDateTime',
              },
              BACK: {
                target: '#bookingMachine.selectingMenu',
              },
            },
          },
          complete: {
            type: 'final',
          },
        },
      },
      enteringUserInfo: {
        initial: 'idle',
        onDone: {
          target: 'confirming',
        },
        states: {
          idle: {
            always: [
              {
                target: 'entering',
                cond: 'canTransitFromIdleToEnteringOnEnteringUserInfo',
              },
              {
                target: 'confirmingCurrentUser',
                cond: 'canTransitFromIdleToConfirmingCurrentUserOnEnteringUserInfo',
              },
            ],
          },
          entering: {
            on: {
              ENTER_USER_INFO: {
                actions: ['assignInputUserInfo'],
              },
              REQUIRE_SIGN_IN: {
                target: 'signingIn',
              },
              NEXT: {
                target: 'complete',
                cond: 'canTransitFromEnteringToCompleteOnEnteringUserInfo',
              },
              BACK: {
                target: '#bookingMachine.selectingDateTime',
              },
            },
          },
          signingIn: {
            always: [
              {
                target: 'confirmingCurrentUser',
                cond: 'canTransitFromSigningInToConfirmingCurrentUserOnEnteringUserInfo',
              },
            ],
            on: {
              REQUIRE_ENTER_USER_INFO: {
                target: 'entering',
              },
              BACK: {
                target: '#bookingMachine.selectingDateTime',
              },
            },
          },
          confirmingCurrentUser: {
            on: {
              NEXT: {
                target: 'complete',
                cond: 'canTransitFromConfirmingCurrentUserOnEnteringUserInfo',
              },
              BACK: {
                target: '#bookingMachine.selectingDateTime',
              },
            },
          },
          complete: {
            type: 'final',
          },
        },
      },
      confirming: {
        initial: 'idle',
        onDone: {
          target: 'complete',
        },
        states: {
          idle: {
            on: {
              SUBMIT: {
                target: 'submitting',
                actions: ['clearError'],
              },
              BACK: {
                target: '#bookingMachine.enteringUserInfo',
                actions: ['clearError'],
              },
            },
          },
          submitting: {
            invoke: [
              {
                src: 'submit',
                onDone: {
                  target: 'complete',
                },
                onError: {
                  target: 'idle',
                  actions: ['assignError'],
                },
              },
            ],
          },
          complete: {
            type: 'final',
          },
        },
      },
      complete: {
        type: 'final',
      },
    },
    on: {
      SET_SHOP: {
        actions: ['assignDataShop'],
      },
      SET_USER: {
        actions: ['assignDataUser'],
      },
    },
  },
  {
    services: {
      submit,
    },
    guards: {
      canTransitIdleToCompleteOnIdle,
      canTransitFromSelectingToCompleteOnSelectingMenu,
      canTransitFromSelectingToCompleteOnSelectingDateTime,
      canTransitFromIdleToEnteringOnEnteringUserInfo,
      canTransitFromIdleToConfirmingCurrentUserOnEnteringUserInfo,
      canTransitFromEnteringToCompleteOnEnteringUserInfo,
      canTransitFromSigningInToConfirmingCurrentUserOnEnteringUserInfo,
      canTransitFromConfirmingCurrentUserOnEnteringUserInfo,
    },
    actions: {
      assignDataShop: assign((context, event) => {
        if (event.type !== 'SET_SHOP') {
          return context
        }

        return {
          ...context,
          data: {
            ...context.data,
            shop: event.payload.shop,
          },
        }
      }),
      assignDataUser: assign((context, event) => {
        if (event.type !== 'SET_USER') {
          return context
        }

        return {
          ...context,
          data: {
            ...context.data,
            user: event.payload.user,
          },
        }
      }),
      assignInputMenuId: assign((context, event) => {
        if (event.type !== 'SELECT_MENU') {
          return context
        }

        return {
          ...context,
          input: {
            ...context.input,
            menuId: event.payload.menuId,
          },
        }
      }),
      assignInputDateTime: assign((context, event) => {
        if (event.type !== 'SELECT_DATE_TIME') {
          return context
        }

        return {
          ...context,
          input: {
            ...context.input,
            dateTime: event.payload.dateTime,
          },
        }
      }),
      assignInputUserInfo: assign((context, event) => {
        if (event.type !== 'ENTER_USER_INFO') {
          return context
        }

        return {
          ...context,
          input: {
            ...context.input,
            userInfo: event.payload.userInfo,
          },
        }
      }),
      assignError: assign((context, event: any) => {
        return {
          ...context,
          error: event.data,
        }
      }),
      clearError: assign((context) => {
        return {
          ...context,
          error: undefined,
        }
      }),
    },
  }
)
