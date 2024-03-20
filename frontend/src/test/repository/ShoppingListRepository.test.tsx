import { ItemCategory } from '@/base/model/ItemCategory.ts'
import { ShoppingListRepositoryImpl } from '@/base/repository/ShoppinListRepository.ts'

describe('ShoppingListRepository', () => {
  const spyGetItem = vi.spyOn(Storage.prototype, 'getItem')
  const spySetItem = vi.spyOn(Storage.prototype, 'setItem')
  const shoppingListRepository = new ShoppingListRepositoryImpl()
  beforeEach(() => {
    spyGetItem.mockClear()
    spySetItem.mockClear()
    localStorage.clear()
  })
  test('getShoppingList実行時shoppingListをkeyにgetItemを呼び出していること', () => {
    shoppingListRepository.getShoppingList()
    expect(spyGetItem).toHaveBeenCalledWith('shoppingList')
  })
  test('getShoppingList実行時getItemの返り値をparseして返していること', () => {
    const returnValue = [
      {
        id: 'uuid-1',
        name: '玉ねぎ',
        category: ItemCategory.WISH,
      },
      {
        id: 'uuid-2',
        name: '長ねぎ',
        category: ItemCategory.WISH,
      },
      {
        id: 'uuid-3',
        name: 'かぼちゃ',
        category: ItemCategory.CART,
      },
    ]
    spyGetItem.mockImplementation((key) => {
      if (key === 'shoppingList') {
        return JSON.stringify(returnValue)
      }
      throw new Error('keyが違います')
    })

    const result = shoppingListRepository.getShoppingList()
    expect(result).toEqual(returnValue)
  })
  test('setShoppingList実行時、shoppingListをkeyに,itemsをstringifyした値を引数にsetItemを呼び出していること', () => {
    const setValue = [
      {
        id: 'uuid-1',
        name: '玉ねぎ',
        category: ItemCategory.WISH,
      },
      {
        id: 'uuid-2',
        name: '長ねぎ',
        category: ItemCategory.WISH,
      },
      {
        id: 'uuid-3',
        name: 'かぼちゃ',
        category: ItemCategory.CART,
      },
    ]
    shoppingListRepository.setShoppingList(setValue)
    expect(spySetItem).toHaveBeenCalledWith(
      'shoppingList',
      JSON.stringify(setValue),
    )
  })
})
