import React, {FormEvent, useState} from 'react'


import {useAsync} from 'react-use'

import {CartList} from '@/base/components/CartList.tsx'
import {WishList} from '@/base/components/WishList.tsx'
import {ItemCategory} from '@/base/model/ItemCategory.ts'
import {ShoppingListRepository} from '@/base/repository/ShoppinListRepository.ts'

export type Item = {
    id: number
    name: string
    category: ItemCategory
}
export type SaveItem = {
    name: string
    category: ItemCategory
}
export type ChangeItem = {
    id: number
    name: string
    category: ItemCategory
}
export type SavedItemResponse = {
    id: number
}
export type NumberIdList = {
    ids: number[];
}

type Props = {
    shoppingListRepository: ShoppingListRepository
}

const ShoppingList = ({shoppingListRepository}: Props) => {
    const [items, setItems] = useState<Item[]>([])
    const [inputValue, setInputValue] = useState('')

    useAsync(async () => {
        const result = await shoppingListRepository.getShoppingList()
        setItems(result)
    }, [shoppingListRepository])

    const addItem = (event:FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const createdItem = {
            name: inputValue,
            category: ItemCategory.WISH,
        }
        setInputValue('')
        shoppingListRepository.saveShoppingItem(createdItem)
            .then(() => shoppingListRepository.getShoppingList())
            .then((items) => setItems(items))
            .catch(() => [])
    }

    const filteredWishItems = items.filter(
        (item) => item.category === ItemCategory.WISH)
    const filteredCartItems = items.filter(
        (item) => item.category === ItemCategory.CART,
    )

    const onClickCheckBox = (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
        const itemId = Number(e.currentTarget.value)
        const updatedItems = items.map((item) => {
                if (item.id === itemId) {
                    return {...item, category: ItemCategory.CART}
                }
                return item
            }
        )
        const changedItem = updatedItems.find(item => item.id === itemId)

        if (changedItem) {
            shoppingListRepository.changeShoppingItem(changedItem)
                .then(() => shoppingListRepository.getShoppingList())
                .then((items) => setItems(items))
                .catch(() => [])
        }
    }

    const onClickAllDeleteButton = () => {
        const ids = items.map((item) => item.id)
        shoppingListRepository.deleteShoppingItem({ids})
            .then(() => setItems([]))
            .catch(() => [])
    }
    const onClickAllPutBackButton = async () => {
        const newItems = items.map((item) => ({
            id: item.id,
            name: item.name,
            category: ItemCategory.WISH,
        }))

        await Promise.all(newItems.map(async (item) => await shoppingListRepository.changeShoppingItem(item)))
        setItems(newItems)
    }
    const onDeleteItem = (id: string) => {
        const itemId = Number(id)

        shoppingListRepository.deleteShoppingItem({ids: [itemId]})
            .then(() => shoppingListRepository.getShoppingList())
            .then((items) => setItems(items))
            .catch(() => [])
    }
    const onPutBackItem = (id: string) => {
        const itemId = Number(id)
        const updateItem = items.find(item => item.id === itemId)

        const changedItem = {
            id: updateItem!.id,
            name: updateItem!.name,
            category: ItemCategory.WISH,
        }

        if (changedItem.id) {
            shoppingListRepository.changeShoppingItem(changedItem)
                .then(() => shoppingListRepository.getShoppingList())
                .then((items) => setItems(items))
                .catch(() => [])
        }
    }

    return (
        <div className="max-w-xl mx-auto">
            <div className="flex items-center space-x-4">
                <form onSubmit={addItem}　className="flex items-center space-x-2">
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
                        type='submit'
                    >
                        追加
                    </button>
                </form>
            </div>
            <WishList items={filteredWishItems} onClickCheckBox={onClickCheckBox}/>
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
