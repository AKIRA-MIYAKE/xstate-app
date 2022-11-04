import type { SWRResponse, Key } from 'swr'
import useSWR from 'swr'

import type { Shop } from '../../../../interfaces'
import { sleep } from '../../../../libs/sleep'
import { useAuthContext } from '../../../../contexts/AuthContext'

import shops from '../data.json'

export type UseListShopValue = SWRResponse<Shop[], Error>

export const getLisShopKey: (params: { token?: string }) => Key = ({
  token,
}) => {
  return {
    path: '/api/shops',
    token,
  }
}

export const useListShop: () => UseListShopValue = () => {
  const { token } = useAuthContext()

  const key = getLisShopKey({ token })

  const fetcher: () => Promise<Shop[]> = async () => {
    await sleep(1000)
    return shops
  }

  return useSWR(key, fetcher)
}
