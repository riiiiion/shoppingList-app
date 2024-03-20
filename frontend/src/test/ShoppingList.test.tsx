import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, test } from 'vitest'

import ShoppingList from '@/base/components/ShoppingList.tsx'
import { ItemCategory } from '@/base/model/ItemCategory.ts'
import { ShoppingListRepositoryImpl } from '@/base/repository/ShoppinListRepository.ts'

vi.mocked('@/base/repository/ShoppingListRepository.tsx')
vi.mock('uuid', () => {
  return {
    v4: vi.fn(() => 'dummy-id'),
  }
})
describe('ShoppingList', () => {
  const shoppingListRepository = new ShoppingListRepositoryImpl()
  beforeEach(() => {
    vi.spyOn(shoppingListRepository, 'getShoppingList').mockReturnValue([])
    vi.spyOn(shoppingListRepository, 'setShoppingList')
  })

  test('お買い物品入力用のinputボックスが表示されること', () => {
    // ARRANGE
    render(<ShoppingList shoppingListRepository={shoppingListRepository} />)

    // ASSERT
    expect(screen.getByPlaceholderText('入力してください')).toBeInTheDocument()
  })

  test('お買い物品追加用のボタンが表示されること', () => {
    // ARRANGE
    render(<ShoppingList shoppingListRepository={shoppingListRepository} />)

    // ASSERT
    expect(screen.getByRole('button', { name: '追加' })).toBeInTheDocument()
  })

  test('「カゴに入れるもの」のラベルが表示されていること', () => {
    // ARRANGE
    render(<ShoppingList shoppingListRepository={shoppingListRepository} />)

    // ASSERT
    expect(
      screen.getByRole('heading', { name: 'カゴに入れるもの' }),
    ).toBeInTheDocument()
  })

  test('「カゴに入れたもの」のラベルが表示されていること', () => {
    // ARRANGE
    render(<ShoppingList shoppingListRepository={shoppingListRepository} />)

    // ASSERT
    expect(
      screen.getByRole('heading', { name: 'カゴに入れたもの' }),
    ).toBeInTheDocument()
  })

  test('買い物品入力後、追加ボタンを押すとwishListに買い物品とチェックボックスが追加されLocalStorageにセットされる', async () => {
    // ARRANGE
    const stubUuid = 'dummy-id'

    render(<ShoppingList shoppingListRepository={shoppingListRepository} />)

    const inputBox = screen.getByPlaceholderText('入力してください')
    await userEvent.type(inputBox, '玉ねぎ')
    const addButton = screen.getByRole('button', { name: '追加' })

    // ACT
    await userEvent.click(addButton)

    // ASSERT
    const wishArea = within(screen.getByTestId('wishList'))
    expect(wishArea.getByText('玉ねぎ')).toBeInTheDocument()
    expect(wishArea.getByRole('checkbox')).toBeInTheDocument()
    expect(shoppingListRepository.setShoppingList).toHaveBeenCalledWith([
      {
        id: stubUuid,
        name: '玉ねぎ',
        category: ItemCategory.WISH,
      },
    ])
    expect(inputBox).toHaveValue('')
  })

  test('wishListのチェックボックスを押すとitemがcartListに移動する', async () => {
    // ARRANGE
    render(<ShoppingList shoppingListRepository={shoppingListRepository} />)

    const inputBox = screen.getByPlaceholderText('入力してください')
    await userEvent.type(inputBox, '玉ねぎ')
    const addButton = screen.getByRole('button', { name: '追加' })

    await userEvent.click(addButton)
    const wishArea = within(screen.getByTestId('wishList'))

    // ACT
    await userEvent.click(wishArea.getByRole('checkbox'))

    // ASSERT
    expect(wishArea.queryByText('玉ねぎ')).not.toBeInTheDocument()
    const cartArea = within(screen.getByTestId('cartList'))
    expect(cartArea.getByText('玉ねぎ')).toBeInTheDocument()
  })

  test('cartListの戻すボタンを押すと該当するitemがwishListに戻る', async () => {
    // ARRANGE
    vi.spyOn(shoppingListRepository, 'getShoppingList').mockReturnValue([
      {
        id: 'uuid-1',
        name: '玉ねぎ',
        category: ItemCategory.CART,
      },
      {
        id: 'uuid-2',
        name: '長ねぎ',
        category: ItemCategory.CART,
      },
      {
        id: 'uuid-3',
        name: 'かぼちゃ',
        category: ItemCategory.CART,
      },
    ])
    render(<ShoppingList shoppingListRepository={shoppingListRepository} />)

    const cartArea = within(screen.getByTestId('cartList'))
    const wishArea = within(screen.getByTestId('wishList'))
    const putBackButton = cartArea.getAllByRole('button', { name: '戻す' })[1]

    // ACT
    await userEvent.click(putBackButton)

    // ASSERT
    expect(cartArea.getByText('玉ねぎ')).toBeInTheDocument()
    expect(cartArea.queryByText('長ねぎ')).not.toBeInTheDocument()
    expect(wishArea.getByText('長ねぎ')).toBeInTheDocument()
    expect(cartArea.getByText('かぼちゃ')).toBeInTheDocument()
  })

  test('cartListの削除ボタンを押すと該当するitemが削除される', async () => {
    // ARRANGE
    vi.spyOn(shoppingListRepository, 'getShoppingList').mockReturnValue([
      {
        id: 'uuid-1',
        name: '玉ねぎ',
        category: ItemCategory.CART,
      },
      {
        id: 'uuid-2',
        name: '長ねぎ',
        category: ItemCategory.CART,
      },
      {
        id: 'uuid-3',
        name: 'かぼちゃ',
        category: ItemCategory.CART,
      },
    ])
    render(<ShoppingList shoppingListRepository={shoppingListRepository} />)

    const cartArea = within(screen.getByTestId('cartList'))
    const deleteButton = cartArea.getAllByRole('button', { name: '削除' })[1]

    // ACT
    await userEvent.click(deleteButton)

    // ASSERT
    expect(cartArea.getByText('玉ねぎ')).toBeInTheDocument()
    expect(cartArea.queryByText('長ねぎ')).not.toBeInTheDocument()
    expect(cartArea.getByText('かぼちゃ')).toBeInTheDocument()
  })

  test('「すべて削除」ボタンを押すとitemが全て削除される', async () => {
    // ARRANGE
    render(<ShoppingList shoppingListRepository={shoppingListRepository} />)

    const inputBox = screen.getByPlaceholderText('入力してください')
    const addButton = screen.getByRole('button', { name: '追加' })
    await userEvent.type(inputBox, '玉ねぎ')
    await userEvent.click(addButton)

    await userEvent.type(inputBox, '長ねぎ')
    await userEvent.click(addButton)

    const allDeleteButton = screen.getByRole('button', { name: 'すべて削除' })

    // ACT
    await userEvent.click(allDeleteButton)

    // ASSERT
    expect(screen.queryByText('玉ねぎ')).not.toBeInTheDocument()
    expect(screen.queryByText('長ねぎ')).not.toBeInTheDocument()
  })

  test('「すべて戻す」ボタンを押すとitemが全てwishListに戻る', async () => {
    // ARRANGE
    vi.spyOn(shoppingListRepository, 'getShoppingList').mockReturnValue([
      {
        id: 'uuid-1',
        name: '玉ねぎ',
        category: ItemCategory.CART,
      },
      {
        id: 'uuid-2',
        name: '長ねぎ',
        category: ItemCategory.CART,
      },
      {
        id: 'uuid-3',
        name: 'かぼちゃ',
        category: ItemCategory.CART,
      },
    ])

    render(<ShoppingList shoppingListRepository={shoppingListRepository} />)

    const putBackButton = screen.getByRole('button', { name: 'すべて戻す' })
    // ACT
    await userEvent.click(putBackButton)

    // ASSERT
    const wishArea = within(screen.getByTestId('wishList'))
    expect(wishArea.getByText('玉ねぎ')).toBeInTheDocument()
    expect(wishArea.getByText('長ねぎ')).toBeInTheDocument()
    expect(wishArea.getByText('かぼちゃ')).toBeInTheDocument()
  })

  test('レンダリング時、getShoppingListを実行していること', async () => {
    // ARRANGE
    // ACT

    render(<ShoppingList shoppingListRepository={shoppingListRepository} />)

    // ASSERT
    expect(shoppingListRepository.getShoppingList).toHaveBeenCalled()
  })

  test('getShoppingListで取得したアイテムをそれぞれのエリアに表示していること', async () => {
    // ARRANGE

    vi.spyOn(shoppingListRepository, 'getShoppingList').mockReturnValue([
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
    ])
    // ACT

    render(<ShoppingList shoppingListRepository={shoppingListRepository} />)

    // ASSERT
    const wishArea = within(screen.getByTestId('wishList'))
    expect(wishArea.getByText('玉ねぎ')).toBeInTheDocument()
    expect(wishArea.getByText('長ねぎ')).toBeInTheDocument()
    const cartArea = within(screen.getByTestId('cartList'))
    expect(cartArea.getByText('かぼちゃ')).toBeInTheDocument()
  })
})
