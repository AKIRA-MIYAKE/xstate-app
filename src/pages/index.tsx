import type { NextPageWithLayout } from './_app'

import { DefaultLayout } from '../layouts/DefaultLayout'
import { ShopList } from '../organisms/shops/ShopList'

const IndexPage: NextPageWithLayout = () => {
  return (
    <>
      <h1>Xstate app</h1>
      <p>Implementation sample of booking flow using Xstate</p>
      <ShopList />
    </>
  )
}

IndexPage.getLayout = (page) => {
  return <DefaultLayout>{page}</DefaultLayout>
}

export default IndexPage
