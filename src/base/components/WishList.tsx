import React from 'react'

import { Item } from '@/base/components/ShoppingList.tsx'

type Props = {
  items: Item[]
  onClickCheckBox: (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => void
}

export function WishList({ items, onClickCheckBox }: Props) {
  return (
    <div className="mt-4" data-testid="wishList">
      <h1 className="text-xl font-semibold">カゴに入れるもの</h1>
      {items.map((item) => (
        <div key={item.id} className="flex items-center mt-2">
          <input
            className="h-5 w-5 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500"
            type="checkbox"
            id={item.id}
            onClick={(e) => onClickCheckBox(e)}
            value={item.id}
          />
          <label
            htmlFor={item.id}
            className="ml-3 text-lg font-medium text-gray-700"
          >
            {item.name}
          </label>
        </div>
      ))}
    </div>
  )
}
