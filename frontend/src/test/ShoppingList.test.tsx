import {render, screen, within} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {beforeEach, describe, expect, test} from 'vitest'

import ShoppingList from '@/base/components/ShoppingList.tsx'
import {ItemCategory} from '@/base/model/ItemCategory.ts'
import {ShoppingListRepositoryImpl} from '@/base/repository/ShoppinListRepository.ts'
import {NetworkHttp} from '@/base/repository/Http.tsx'
import {act} from 'react-dom/test-utils'

vi.mock('@/base/repository/ShoppingListRepository.tsx')
vi.mock('@/base/repository/Http.tsx')

describe('ShoppingList', () => {
    const http = new NetworkHttp()
    const shoppingListRepository = new ShoppingListRepositoryImpl(http)
    beforeEach(() => {
        vi.spyOn(shoppingListRepository, 'getShoppingList').mockResolvedValue([])
        vi.spyOn(shoppingListRepository, 'saveShoppingItem')
        vi.spyOn(shoppingListRepository, 'changeShoppingItem')
        vi.spyOn(shoppingListRepository, 'deleteShoppingItem')
    })

    test('お買い物品入力用のinputボックスが表示されること', async () => {
        // ARRANGE
        await act(async () => {
            render(<ShoppingList shoppingListRepository={shoppingListRepository}/>)
        })
        // ASSERT
        expect(screen.getByPlaceholderText('入力してください')).toBeInTheDocument()
    })

    test('お買い物品追加用のボタンが表示されること', async () => {
        // ARRANGE
        await act(async () => {
            render(<ShoppingList shoppingListRepository={shoppingListRepository}/>)
        })
        // ASSERT
        expect(screen.getByRole('button', {name: '追加'})).toBeInTheDocument()
    })

    test('「カゴに入れるもの」のラベルが表示されていること', async () => {
        // ARRANGE
        await act(async () => {
            render(<ShoppingList shoppingListRepository={shoppingListRepository}/>)
        })
        // ASSERT
        expect(
            screen.getByRole('heading', {name: 'カゴに入れるもの'}),
        ).toBeInTheDocument()
    })

    test('「カゴに入れたもの」のラベルが表示されていること', async () => {
        // ARRANGE
        await act(async () => {
            render(<ShoppingList shoppingListRepository={shoppingListRepository}/>)
        })
        // ASSERT
        expect(
            screen.getByRole('heading', {name: 'カゴに入れたもの'}),
        ).toBeInTheDocument()
    })

    test('レンダリング時、getShoppingListを実行していること', async () => {
        // ARRANGE
        // ACT

        await act(async () => {
            render(<ShoppingList shoppingListRepository={shoppingListRepository}/>)
        })
        // ASSERT
        expect(shoppingListRepository.getShoppingList).toHaveBeenCalled()
    })

    test('レンダリング後getShoppingListで取得したアイテムをそれぞれのエリアに表示していること', async () => {
        // ARRANGE

        vi.spyOn(shoppingListRepository, 'getShoppingList').mockResolvedValue([
            {
                id: 1,
                name: '玉ねぎ',
                category: ItemCategory.WISH,
            },
            {
                id: 2,
                name: '長ねぎ',
                category: ItemCategory.WISH,
            },
            {
                id: 3,
                name: 'かぼちゃ',
                category: ItemCategory.CART,
            },
        ])
        // ACT

        await act(async () => {
            render(<ShoppingList shoppingListRepository={shoppingListRepository}/>)
        })
        // ASSERT
        const wishArea = within(screen.getByTestId('wishList'))
        expect(wishArea.getByText('玉ねぎ')).toBeInTheDocument()
        expect(wishArea.getByText('長ねぎ')).toBeInTheDocument()
        const cartArea = within(screen.getByTestId('cartList'))
        expect(cartArea.getByText('かぼちゃ')).toBeInTheDocument()
    })

    test('買い物品入力後、追加ボタンを押すとsaveShoppingListが実行され成功した場合、getShoppingListが実行されitemがwishリストに表示されている', async () => {
        // ARRANGE
        vi.spyOn(shoppingListRepository, 'saveShoppingItem').mockResolvedValue({id: 1})

        await act(async () => {
            render(<ShoppingList shoppingListRepository={shoppingListRepository}/>)
        })
        const inputBox = screen.getByPlaceholderText('入力してください')
        await userEvent.type(inputBox, '玉ねぎ')
        const addButton = screen.getByRole('button', {name: '追加'})

        // ACT
        await userEvent.click(addButton)

        // ASSERT
        expect(shoppingListRepository.saveShoppingItem).toHaveBeenCalledWith(
            {
                name: '玉ねぎ',
                category: ItemCategory.WISH,
            }
        )

        expect(shoppingListRepository.getShoppingList).toHaveBeenCalledTimes(2)
        const wishArea = within(screen.getByTestId('wishList'))
        expect(wishArea.queryByText('玉ねぎ')).not.toBeInTheDocument()
    })

    test('買い物品入力後、追加ボタンを押すとsaveShoppingList実行され失敗した場合、getShoppingListは実行されない', async () => {
        // ARRANGE
        vi.spyOn(shoppingListRepository, 'saveShoppingItem').mockRejectedValue(new Error('error'))

        await act(async () => {
            render(<ShoppingList shoppingListRepository={shoppingListRepository}/>)
        })
        const inputBox = screen.getByPlaceholderText('入力してください')
        await userEvent.type(inputBox, '玉ねぎ')
        const addButton = screen.getByRole('button', {name: '追加'})

        // ACT
        try {
            await userEvent.click(addButton)
        } catch (error) { /* empty */
        }

        // ASSERT
        expect(shoppingListRepository.saveShoppingItem).toHaveBeenNthCalledWith(1,
            {
                name: '玉ねぎ',
                category: ItemCategory.WISH,
            }
        )
        expect(shoppingListRepository.getShoppingList).toHaveBeenCalledTimes(1)

    })


    test('買い物品入力後、enterを押してもsaveShoppingListが実行され成功した場合、getShoppingListが実行されitemがwishリストに表示されている', async () => {
        // ARRANGE
        vi.spyOn(shoppingListRepository, 'saveShoppingItem').mockResolvedValue({id: 1})

        await act(async () => {
            render(<ShoppingList shoppingListRepository={shoppingListRepository}/>)
        })
        const inputBox = screen.getByPlaceholderText('入力してください')

        // ACT
        await userEvent.type(inputBox, '玉ねぎ{enter}')

        // ASSERT
        expect(shoppingListRepository.saveShoppingItem).toHaveBeenCalledWith(
            {
                name: '玉ねぎ',
                category: ItemCategory.WISH,
            }
        )

        expect(shoppingListRepository.getShoppingList).toHaveBeenCalledTimes(2)
        const wishArea = within(screen.getByTestId('wishList'))
        expect(wishArea.queryByText('玉ねぎ')).not.toBeInTheDocument()
    })

    test('wishListのチェックボックスを押すとchangeShoppingItemが実行され成功した場合、getShoppingListが実行されitemがcartリストに表示されている', async () => {
        // ARRANGE
        vi.spyOn(shoppingListRepository, 'saveShoppingItem').mockResolvedValue({id: 1})
        vi.spyOn(shoppingListRepository, 'getShoppingList').mockResolvedValueOnce([
            {
                id: 1,
                name: '玉ねぎ',
                category: ItemCategory.WISH,
            }
        ]).mockResolvedValueOnce([
            {
                id: 1,
                name: '玉ねぎ',
                category: ItemCategory.CART,
            }
        ])
        vi.spyOn(shoppingListRepository, 'changeShoppingItem').mockResolvedValue({id: 1})

        await act(async () => {
            render(<ShoppingList shoppingListRepository={shoppingListRepository}/>)
        })


        const wishArea = within(screen.getByTestId('wishList'))

        // ACT
        await userEvent.click(wishArea.getByRole('checkbox'))

        // ASSERT
        expect(wishArea.queryByText('玉ねぎ')).not.toBeInTheDocument()
        const cartArea = within(screen.getByTestId('cartList'))
        expect(cartArea.getByText('玉ねぎ')).toBeInTheDocument()

        expect(shoppingListRepository.changeShoppingItem).toHaveBeenCalledWith({
            id: 1,
            name: '玉ねぎ',
            category: ItemCategory.CART,
        })
        expect(shoppingListRepository.getShoppingList).toHaveBeenCalledTimes(2)
    })

    test('wishListのチェックボックスを押すとchangeShoppingItemが実行され失敗した場合、getShoppingListが実行されずwishリストに表示されている', async () => {
        // ARRANGE

        vi.spyOn(shoppingListRepository, 'getShoppingList').mockResolvedValueOnce([
            {
                id: 1,
                name: '玉ねぎ',
                category: ItemCategory.WISH,
            }
        ])

        vi.spyOn(shoppingListRepository, 'changeShoppingItem').mockRejectedValue('error')

        await act(async () => {
            render(<ShoppingList shoppingListRepository={shoppingListRepository}/>)
        })

        const wishArea = within(screen.getByTestId('wishList'))

        // ACT
        try {
        await userEvent.click(wishArea.getByRole('checkbox'))
        }catch (e) {
            /* empty */
        }

        // ASSERT
        expect(wishArea.getByText('玉ねぎ')).toBeInTheDocument()
        expect(shoppingListRepository.changeShoppingItem).toHaveBeenCalledWith({
            id: 1,
            name: '玉ねぎ',
            category: ItemCategory.CART,
        })
        expect(shoppingListRepository.getShoppingList).toHaveBeenCalledTimes(1)
    })

    test('cartListの戻すボタンを押すと該当するidでchangeShoppingItemが実行され成功した場合、getShoppingListが実行されwishリストに表示されている', async () => {
        // ARRANGE
        vi.spyOn(shoppingListRepository, 'getShoppingList').mockResolvedValueOnce([
            {
                id: 1,
                name: '玉ねぎ',
                category: ItemCategory.CART,
            },
            {
                id: 2,
                name: '長ねぎ',
                category: ItemCategory.CART,
            },
            {
                id: 3,
                name: 'かぼちゃ',
                category: ItemCategory.CART,
            },
        ]).mockResolvedValueOnce([
            {
                id: 1,
                name: '玉ねぎ',
                category: ItemCategory.CART,
            },
            {
                id: 2,
                name: '長ねぎ',
                category: ItemCategory.WISH,
            },
            {
                id: 3,
                name: 'かぼちゃ',
                category: ItemCategory.CART,
            },
        ])
        vi.spyOn(shoppingListRepository, 'changeShoppingItem').mockResolvedValue({id: 2})
        await act(async () => {
            render(<ShoppingList shoppingListRepository={shoppingListRepository}/>)
        })
        const cartArea = within(screen.getByTestId('cartList'))
        const wishArea = within(screen.getByTestId('wishList'))
        const putBackButton = cartArea.getAllByRole('button', {name: '戻す'})[1]

        // ACT
        await userEvent.click(putBackButton)

        // ASSERT
        expect(cartArea.getByText('玉ねぎ')).toBeInTheDocument()
        expect(cartArea.queryByText('長ねぎ')).not.toBeInTheDocument()
        expect(wishArea.getByText('長ねぎ')).toBeInTheDocument()
        expect(cartArea.getByText('かぼちゃ')).toBeInTheDocument()

        expect(shoppingListRepository.changeShoppingItem).toHaveBeenCalledWith({
            id: 2,
            name: '長ねぎ',
            category: ItemCategory.WISH
        })
        expect(shoppingListRepository.getShoppingList).toHaveBeenCalledTimes(2)
    })

    test('cartListの戻すボタンを押すと該当するidでchangeShoppingItemが実行され失敗した場合、getShoppingListが実行されずcartリストに表示されている', async () => {
        // ARRANGE
        vi.spyOn(shoppingListRepository, 'getShoppingList').mockResolvedValueOnce([
            {
                id: 1,
                name: '玉ねぎ',
                category: ItemCategory.CART,
            },
            {
                id: 2,
                name: '長ねぎ',
                category: ItemCategory.CART,
            },
            {
                id: 3,
                name: 'かぼちゃ',
                category: ItemCategory.CART,
            },
        ])
        vi.spyOn(shoppingListRepository, 'changeShoppingItem').mockRejectedValue('error')
        await act(async () => {
            render(<ShoppingList shoppingListRepository={shoppingListRepository}/>)
        })
        const cartArea = within(screen.getByTestId('cartList'))
        const putBackButton = cartArea.getAllByRole('button', {name: '戻す'})[1]

        // ACT
        try {
        await userEvent.click(putBackButton)
        }catch (e){ /* empty */ }

        // ASSERT
        expect(cartArea.getByText('玉ねぎ')).toBeInTheDocument()
        expect(cartArea.queryByText('長ねぎ')).toBeInTheDocument()
        expect(cartArea.getByText('かぼちゃ')).toBeInTheDocument()

        expect(shoppingListRepository.changeShoppingItem).toHaveBeenCalledWith({
            id: 2,
            name: '長ねぎ',
            category: ItemCategory.WISH
        })
        expect(shoppingListRepository.getShoppingList).toHaveBeenCalledTimes(1)
    })

    test('cartListの削除ボタンを押すと該当するidでdeleteShoppingItemが実行され成功した場合、getShoppingListが実行されどこにも表示されていないこと', async () => {
        // ARRANGE
        vi.spyOn(shoppingListRepository, 'getShoppingList')
            .mockResolvedValueOnce([
            {
                id: 1,
                name: '玉ねぎ',
                category: ItemCategory.CART,
            },
            {
                id: 2,
                name: '長ねぎ',
                category: ItemCategory.CART,
            },
            {
                id: 3,
                name: 'かぼちゃ',
                category: ItemCategory.CART,
            },
        ])
            .mockResolvedValueOnce([
            {
                id: 1,
                name: '玉ねぎ',
                category: ItemCategory.CART,
            },
            {
                id: 3,
                name: 'かぼちゃ',
                category: ItemCategory.CART,
            },
        ])
        vi.spyOn(shoppingListRepository, 'deleteShoppingItem').mockResolvedValue(
            {
                ids: [2],
            })
        await act(async () => {
            render(<ShoppingList shoppingListRepository={shoppingListRepository}/>)
        })
        const cartArea = within(screen.getByTestId('cartList'))
        const deleteButton = cartArea.getAllByRole('button', {name: '削除'})[1]

        // ACT
        await userEvent.click(deleteButton)

        // ASSERT
        expect(cartArea.getByText('玉ねぎ')).toBeInTheDocument()
        expect(screen.queryByText('長ねぎ')).not.toBeInTheDocument()
        expect(cartArea.getByText('かぼちゃ')).toBeInTheDocument()

        expect(shoppingListRepository.deleteShoppingItem).toHaveBeenCalledWith({ids:[2]})
        expect(shoppingListRepository.getShoppingList).toHaveBeenCalledTimes(2)
    })

    test('cartListの削除ボタンを押すと該当するidでdeleteShoppingItemが実行され失敗した場合、getShoppingListが実行されずcartリストに表示されている', async () => {
        // ARRANGE
        vi.spyOn(shoppingListRepository, 'getShoppingList')
            .mockResolvedValueOnce([
                {
                    id: 1,
                    name: '玉ねぎ',
                    category: ItemCategory.CART,
                },
                {
                    id: 2,
                    name: '長ねぎ',
                    category: ItemCategory.CART,
                },
                {
                    id: 3,
                    name: 'かぼちゃ',
                    category: ItemCategory.CART,
                },
            ])
        vi.spyOn(shoppingListRepository, 'deleteShoppingItem').mockRejectedValue('error')
        await act(async () => {
            render(<ShoppingList shoppingListRepository={shoppingListRepository}/>)
        })
        const cartArea = within(screen.getByTestId('cartList'))
        const deleteButton = cartArea.getAllByRole('button', {name: '削除'})[1]

        // ACT
        try {
        await userEvent.click(deleteButton)
        }catch (e){ /* empty */ }

        // ASSERT
        expect(cartArea.getByText('玉ねぎ')).toBeInTheDocument()
        expect(cartArea.queryByText('長ねぎ')).toBeInTheDocument()
        expect(cartArea.getByText('かぼちゃ')).toBeInTheDocument()

        expect(shoppingListRepository.deleteShoppingItem).toHaveBeenCalledWith({ids:[2]})
        expect(shoppingListRepository.getShoppingList).toHaveBeenCalledTimes(1)
    })

    test('「すべて削除」ボタンを押すとdeleteShoppingItemが実行され、成功すると全てのアイテムが表示されていないこと', async () => {
        // ARRANGE
        vi.spyOn(shoppingListRepository, 'getShoppingList')
            .mockResolvedValueOnce([
                {
                    id: 1,
                    name: '玉ねぎ',
                    category: ItemCategory.CART,
                },
                {
                    id: 2,
                    name: '長ねぎ',
                    category: ItemCategory.CART,
                },
                {
                    id: 3,
                    name: 'かぼちゃ',
                    category: ItemCategory.CART,
                },
            ])
        vi.spyOn(shoppingListRepository, 'deleteShoppingItem').mockResolvedValue(
            {
                ids: [1,2,3],
            })
        await act(async () => {
            render(<ShoppingList shoppingListRepository={shoppingListRepository}/>)
        })

        const allDeleteButton = screen.getByRole('button', {name: 'すべて削除'})

        // ACT
        await userEvent.click(allDeleteButton)

        // ASSERT
        expect(screen.queryByText('玉ねぎ')).not.toBeInTheDocument()
        expect(screen.queryByText('長ねぎ')).not.toBeInTheDocument()
        expect(screen.queryByText('かぼちゃ')).not.toBeInTheDocument()

        expect(shoppingListRepository.deleteShoppingItem).toHaveBeenCalledWith({ids:[1,2,3]})
    })

    test('「すべて削除」ボタンを押すとdeleteShoppingItemが実行され、失敗すると全てのアイテムは表示されたままであること', async () => {
        // ARRANGE
        vi.spyOn(shoppingListRepository, 'getShoppingList')
            .mockResolvedValueOnce([
                {
                    id: 1,
                    name: '玉ねぎ',
                    category: ItemCategory.CART,
                },
                {
                    id: 2,
                    name: '長ねぎ',
                    category: ItemCategory.CART,
                },
                {
                    id: 3,
                    name: 'かぼちゃ',
                    category: ItemCategory.CART,
                },
            ])
        vi.spyOn(shoppingListRepository, 'deleteShoppingItem').mockRejectedValue(
            'error'
            )
        await act(async () => {
            render(<ShoppingList shoppingListRepository={shoppingListRepository}/>)
        })

        const allDeleteButton = screen.getByRole('button', {name: 'すべて削除'})

        // ACT
        try {
        await userEvent.click(allDeleteButton)
        }catch (e){ /* empty */ }

        // ASSERT
        expect(screen.getByText('玉ねぎ')).toBeInTheDocument()
        expect(screen.getByText('長ねぎ')).toBeInTheDocument()
        expect(screen.getByText('かぼちゃ')).toBeInTheDocument()

        expect(shoppingListRepository.deleteShoppingItem).toHaveBeenCalledWith({ids:[1,2,3]})
    })

    test('「すべて戻す」ボタンを押すとitemが全てwishListに戻り各item分changeShoppingItemが実行される', async () => {
        // ARRANGE
        vi.spyOn(shoppingListRepository, 'getShoppingList').mockResolvedValue([
            {
                id: 1,
                name: '玉ねぎ',
                category: ItemCategory.CART,
            },
            {
                id: 2,
                name: '長ねぎ',
                category: ItemCategory.CART,
            },
            {
                id: 3,
                name: 'かぼちゃ',
                category: ItemCategory.CART,
            },
        ])
        vi.spyOn(shoppingListRepository, 'changeShoppingItem')
            .mockResolvedValueOnce({id: 1})
            .mockResolvedValueOnce({id: 2})
            .mockResolvedValueOnce({id: 3})

        await act(async () => {
            render(<ShoppingList shoppingListRepository={shoppingListRepository}/>)
        })
        const putBackButton = screen.getByRole('button', {name: 'すべて戻す'})
        // ACT
        await userEvent.click(putBackButton)

        // ASSERT
        const wishArea = within(screen.getByTestId('wishList'))
        expect(wishArea.getByText('玉ねぎ')).toBeInTheDocument()
        expect(wishArea.getByText('長ねぎ')).toBeInTheDocument()
        expect(wishArea.getByText('かぼちゃ')).toBeInTheDocument()

        expect(shoppingListRepository.changeShoppingItem).toHaveBeenCalledTimes(3)
        expect(shoppingListRepository.changeShoppingItem).toHaveBeenNthCalledWith(1, {
            id: 1,
            name: '玉ねぎ',
            category: ItemCategory.WISH
        })
        expect(shoppingListRepository.changeShoppingItem).toHaveBeenNthCalledWith(2, {
            id: 2,
            name: '長ねぎ',
            category: ItemCategory.WISH
        })
        expect(shoppingListRepository.changeShoppingItem).toHaveBeenNthCalledWith(3, {
            id: 3,
            name: 'かぼちゃ',
            category: ItemCategory.WISH
        })

    })



})
