import { type } from 'os'
import { createMachine, assign } from 'xstate'

import type { Shop, User } from '../../interfaces'

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
      type: 'SUBMIT'
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
                cond: (context) => {
                  return typeof context.data.shop !== 'undefined'
                },
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
            on: {
              SELECT_MENU: {
                actions: ['assignInputMenuId'],
              },
              NEXT: {
                target: 'complete',
                cond: (context) => {
                  return typeof context.input.menuId !== 'undefined'
                },
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
            on: {
              SELECT_DATE_TIME: {
                actions: ['assignInputDateTime'],
              },
              NEXT: {
                target: 'complete',
                cond: (context) => {
                  return typeof context.input.dateTime !== 'undefined'
                },
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
                target: 'confirmingCurrentUser',
                cond: (context) => {
                  return typeof context.data.user !== 'undefined'
                },
              },
            ],
            on: {
              ENTER_USER_INFO: {
                actions: ['assignInputUserInfo'],
              },
              REQUIRE_SIGN_IN: {
                target: 'signingIn',
              },
              NEXT: {
                target: 'complete',
                cond: (context) => {
                  return (
                    typeof context.input.userInfo !== 'undefined' &&
                    context.input.userInfo.email.length > 0 &&
                    context.input.userInfo.name.length > 0 &&
                    context.input.userInfo.phone.length > 0
                  )
                },
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
                cond: (context) => {
                  return typeof context.data.user !== 'undefined'
                },
              },
            ],
            on: {
              BACK: {
                target: '#bookingMachine.selectingDateTime',
              },
            },
          },
          confirmingCurrentUser: {
            on: {
              NEXT: {
                target: 'complete',
                cond: (context) => {
                  return typeof context.data.user !== 'undefined'
                },
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
      submit: async () => {},
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
          error: event,
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
