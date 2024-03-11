import { Item } from '@/base/components/ShoppingList.tsx'

export interface ShoppingListRepository {
  getShoppingList(): Item[]
  setShoppingList(items: Item[]): void
}

export class ShoppingListRepositoryImpl implements ShoppingListRepository {
  getShoppingList(): Item[] {
    const shoppingList = localStorage.getItem('shoppingList')
    return shoppingList ? JSON.parse(shoppingList) : []
  }

  setShoppingList(items: Item[]): void {
    localStorage.setItem('shoppingList', JSON.stringify(items))
  }
}
