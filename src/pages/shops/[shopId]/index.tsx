import type { GetServerSideProps } from 'next'
import Link from 'next/link'

import type { NextPageWithLayout } from '../../_app'
import { useReadShop } from '../../../hooks/api/shops/useReadShop'
import { DefaultLayout } from '../../../layouts/DefaultLayout'
import { LoadingTemplate } from '../../../templates/LoadingTemplate'

interface PageProps {
  shopId: string
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

  return {
    props: {
      shopId,
    },
  }
}

const DetailPage: NextPageWithLayout<PageProps> = ({ shopId }) => {
  const { data: shop, error } = useReadShop({ parameter: { shopId } })

  if (error) {
    throw error
  }

  if (!shop) {
    return <LoadingTemplate />
  }

  return (
    <>
      <h1>{shop.name}</h1>
      <Link href={`/shops/${shop.id}/book`}>Book now</Link>
      <h2>Menus</h2>
      <ul>
        {shop.menus.map((menu) => {
          return (
            <li key={menu.id}>
              <span style={{ marginRight: '12px' }}>{menu.name}</span>
              <Link href={`/shops/${shop.id}/book?menuId=${menu.id}`}>
                Book
              </Link>
            </li>
          )
        })}
      </ul>
    </>
  )
}

DetailPage.getLayout = (page) => {
  return <DefaultLayout>{page}</DefaultLayout>
}

export default DetailPage
