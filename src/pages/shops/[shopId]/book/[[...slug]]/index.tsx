import { useEffect } from 'react'
import type { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { useActor } from '@xstate/react'

import type { NextPageWithLayout } from '../../../../_app'
import { useAuthContext } from '../../../../../contexts/AuthContext'
import { useBookingServiceContext } from '../../../../../contexts/BookingServiceContext'
import { useReadShop } from '../../../../../hooks/api/shops/useReadShop'
import { BookPageLayout } from '../../../../../layouts/shops/BookPageLayout'
import { LoadingTemplate } from '../../../../../templates/LoadingTemplate'
import { SelectMenuTemplate } from '../../../../../templates/shops/book/SelectMenuTemplate'
import { SelectDateTimeTemplate } from '../../../../../templates/shops/book/SelectDateTimeTemplate'
import { EnterUserInfoTemplate } from '../../../../../templates/shops/book/EnterUserInfoTemplate'
import { SignInTemplate } from '../../../../../templates/shops/book/SignInTemplate'
import { ConfirmCurrentUserTemplate } from '../../../../../templates/shops/book/ConfirmCurrentUserTemplate'
import { ConfirmTemplate } from '../../../../../templates/shops/book/ConfirmTemplate'
import { CompleteTemplate } from '../../../../../templates/shops/book/CompleteTemplate'

interface PageProps {
  shopId: string
  menuId: string | null
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (
  context
) => {
  const shopId = context.params && context.params['shopId']

  if (typeof shopId !== 'string') {
    return {
      notFound: true,
    }
  }

  const menuId = context.query && context.query['menuId']

  if (typeof menuId !== 'undefined' && typeof menuId !== 'string') {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      shopId,
      menuId: menuId || null,
    },
  }
}

const BookPage: NextPageWithLayout<PageProps> = ({ shopId, menuId }) => {
  const router = useRouter()

  const { user } = useAuthContext()
  const { bookingService } = useBookingServiceContext()

  const [state, send] = useActor(bookingService)

  const { data: shop, error } = useReadShop({ parameter: { shopId } })

  useEffect(() => {
    if (!user) return

    send({
      type: 'SET_USER',
      payload: { user },
    })
  }, [send, user])

  useEffect(() => {
    if (!shop) return

    send({
      type: 'SET_SHOP',
      payload: { shop },
    })
  }, [send, shop])

  useEffect(() => {
    if (!state.matches('selectingMenu')) return
    if (!menuId) return

    send({
      type: 'SELECT_MENU',
      payload: { menuId },
    })
    send({
      type: 'NEXT',
    })

    router.replace(`/shops/${shopId}/book`, undefined, { shallow: true })
  }, [shopId, menuId, state, send]) // eslint-disable-line react-hooks/exhaustive-deps

  if (error) {
    throw error
  }

  if (!shop) {
    return <LoadingTemplate />
  }

  switch (true) {
    case state.matches('selectingMenu'):
      return <SelectMenuTemplate />
    case state.matches('selectingDateTime'):
      return <SelectDateTimeTemplate />
    case state.matches('enteringUserInfo'):
      if (typeof state.value === 'string') {
        return null
      }

      switch (state.value['enteringUserInfo']) {
        case 'entering':
          return <EnterUserInfoTemplate />
        case 'signingIn':
          return <SignInTemplate />
        case 'confirmingCurrentUser':
          return <ConfirmCurrentUserTemplate />
        default:
          return null
      }
    case state.matches('confirming'):
      return <ConfirmTemplate />
    case state.matches('complete'):
      return <CompleteTemplate />
    default:
      return null
  }
}

BookPage.getLayout = (page) => {
  return <BookPageLayout>{page}</BookPageLayout>
}

export default BookPage
