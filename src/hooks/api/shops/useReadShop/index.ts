import type { SWRResponse, Key } from 'swr'
import useSWR from 'swr'

import type { Shop } from '../../../../interfaces'
import { sleep } from '../../../../libs/sleep'
import { useAuthContext } from '../../../../contexts/AuthContext'

import shops from '../data.json'

export interface UseReadShopParams {
  parameter: { shopId: string }
}

export type UseReadShopValue = SWRResponse<Shop, Error>

export const getReadShopKey: (params: {
  token?: string
  parameter: UseReadShopParams['parameter']
}) => Key = ({ token, parameter }) => {
  return {
    path: '/api/shops/{shopId}',
    token,
    parameter,
  }
}

export const useReadShop: (params: UseReadShopParams) => UseReadShopValue = ({
  parameter,
}) => {
  const { token } = useAuthContext()

  const key = getReadShopKey({ token, parameter })

  const fetcher: () => Promise<Shop> = async () => {
    await sleep(1000)

    const shop = shops.find((shop) => shop.id === parameter.shopId)

    if (!shop) {
      throw new Error('NotFound')
    }

    return shop
  }

  return useSWR(key, fetcher)
}
