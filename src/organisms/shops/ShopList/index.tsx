import type { FC } from 'react'
import Link from 'next/link'

import { useListShop } from '../../../hooks/api/shops/useListShop'

export const ShopList: FC = () => {
  const { data: shops } = useListShop()

  if (!shops) {
    return <div>Loading...</div>
  }

  return (
    <ul>
      {shops.map((shop) => {
        return (
          <li key={shop.id}>
            <Link href={`/shops/${shop.id}`}>{shop.name}</Link>
          </li>
        )
      })}
    </ul>
  )
}
