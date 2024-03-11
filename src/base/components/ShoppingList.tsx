import React, { useEffect, useRef, useState } from 'react'

import { v4 as uuid } from 'uuid'

import { CartList } from '@/base/components/CartList.tsx'
import { WishList } from '@/base/components/WishList.tsx'
import { ShoppingListRepository } from '@/base/repository/ShoppinListRepository.ts'

export enum ItemCategory {
  WISH,
  CART,
}
export type Item = {
  id: string
  name: string
  category: ItemCategory
}

type Props = {
  shoppingListRepository: ShoppingListRepository
}

const ShoppingList = ({ shoppingListRepository }: Props) => {
  const [items, setItems] = useState<Item[]>([])
  const [inputValue, setInputValue] = useState('')
  const isFirstRender = useRef(true)

  useEffect(() => {
    const result = shoppingListRepository.getShoppingList()
    setItems(result)
  }, [shoppingListRepository])

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    shoppingListRepository.setShoppingList(items)
  }, [items, shoppingListRepository])

  const addItem = () => {
    const createdItem = {
      id: uuid(),
      name: inputValue,
      category: ItemCategory.WISH,
    }
    setItems((prev) => [...prev, createdItem])
  }

  const filteredWishItems = items.filter(
    (item) => item.category === ItemCategory.WISH,
  )
  const filteredCartItems = items.filter(
    (item) => item.category === ItemCategory.CART,
  )

  const onClickCheckBox = (
    e: React.MouseEvent<HTMLInputElement, MouseEvent>,
  ) => {
    const target = e.target as HTMLInputElement
    const newItems = items.map((item) => {
      if (item.id === target.value) {
        return {
          ...item,
          category: ItemCategory.CART,
        }
      }
      return item
    })
    setItems(newItems)
  }
  const onClickAllDeleteButton = () => {
    setItems([])
  }

  return (
    <div>
      <input
        placeholder="入力してください"
        type="text"
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value)
        }}
      />
      <button onClick={addItem}>追加</button>
      <WishList items={filteredWishItems} onClickCheckBox={onClickCheckBox} />
      <CartList items={filteredCartItems} />
      <button onClick={onClickAllDeleteButton}>すべて削除</button>
    </div>
  )
}

export default ShoppingList
