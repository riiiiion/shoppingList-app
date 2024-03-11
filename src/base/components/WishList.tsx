import React from 'react'

import { Item } from '@/base/components/ShoppingList.tsx'

type Props = {
  items: Item[]
  onClickCheckBox: (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => void
}

export function WishList({ items, onClickCheckBox }: Props) {
  return (
    <div data-testid="wishList">
      <h1>カゴに入れるもの</h1>
      {items.map((item) => (
        <div key={item.id}>
          <input
            type="checkbox"
            id={item.id}
            onClick={(e) => onClickCheckBox(e)}
            value={item.id}
          />
          <label htmlFor={item.id}>{item.name}</label>
        </div>
      ))}
    </div>
  )
}
