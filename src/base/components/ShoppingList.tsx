import React, { useEffect, useRef, useState } from 'react'

import { v4 as uuid } from 'uuid'

import { CartList } from '@/base/components/CartList.tsx'
import { WishList } from '@/base/components/WishList.tsx'
import { ItemCategory } from '@/base/model/ItemCategory.ts'
import { ShoppingListRepository } from '@/base/repository/ShoppinListRepository.ts'

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
    setInputValue('')
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
  const onClickAllPutBackButton = () => {
    const newItems = items.map((item) => ({
      id: item.id,
      name: item.name,
      category: ItemCategory.WISH,
    }))
    setItems(newItems)
  }
  const onDeleteItem = (id: string) => {
    const newItems = items.filter((item) => {
      return item.id !== id
    })
    setItems(newItems)
  }
  const onPutBackItem = (id: string) => {
    const newItems = items.map((item) => {
      if (item.id === id) {
        return {
          id: item.id,
          name: item.name,
          category: ItemCategory.WISH,
        }
      }
      return item
    })
    setItems(newItems)
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="flex items-center space-x-4">
        <input
          className="mt-1 flex-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="入力してください"
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value)
          }}
        />
        <button
          className="mt-2 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
          onClick={addItem}
        >
          追加
        </button>
      </div>
      <WishList items={filteredWishItems} onClickCheckBox={onClickCheckBox} />
      <CartList
        items={filteredCartItems}
        onDeleteItem={onDeleteItem}
        onPutBackItem={onPutBackItem}
      />
      <button
        className="mt-4 px-4 py-2 bg-red-600 text-white font-semibold rounded-md shadow hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
        onClick={onClickAllDeleteButton}
      >
        すべて削除
      </button>
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
        onClick={onClickAllPutBackButton}
      >
        すべて戻す
      </button>
    </div>
  )
}

export default ShoppingList
