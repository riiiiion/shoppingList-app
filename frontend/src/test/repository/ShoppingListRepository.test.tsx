import {expect, MockInstance} from 'vitest'

import {ChangeItem, NumberIdList, SaveItem} from '@/base/components/ShoppingList.tsx'
import {ItemCategory} from '@/base/model/ItemCategory.ts'
import {NetworkHttp} from '@/base/repository/Http.tsx'
import {ShoppingListRepositoryImpl} from '@/base/repository/ShoppinListRepository.ts'




vitest.mock('@/base/repository/Http.tsx')
describe('ShoppingListRepository', () => {
    const spyStubNetworkHttp = new NetworkHttp()
    const shoppingListRepository = new ShoppingListRepositoryImpl(spyStubNetworkHttp)
    let spyStubGet: MockInstance<[url: string], Promise<unknown>>
    let spyStubPost: MockInstance<[url: string, body: SaveItem], Promise<unknown>>
    let spyStubPatch: MockInstance<[url: string, body: ChangeItem], Promise<unknown>>
    let spyStubDelete: MockInstance<[url: string, body: NumberIdList], Promise<unknown>>
    beforeEach(() => {
        spyStubGet = vi.spyOn(spyStubNetworkHttp, 'get').mockResolvedValue([{
            id: 1,
            name: 'test-name',
            category: 'test-category'
        }])
        spyStubPost = vi.spyOn(spyStubNetworkHttp, 'post').mockResolvedValue({id: 1}) as MockInstance<[url: string, body: SaveItem], Promise<unknown>>

        spyStubPatch = vi.spyOn(spyStubNetworkHttp, 'patch').mockResolvedValue({id: 1}) as MockInstance<[url: string, body: ChangeItem], Promise<unknown>>
        spyStubDelete = vi.spyOn(spyStubNetworkHttp, 'delete').mockResolvedValue({ids:[ 1, 2, 3]}) as MockInstance<[url: string, body: NumberIdList], Promise<unknown>>
    })
    test('getShoppingList実行時getを正しいパスで呼び出し,getの返り値をreturnしていること', async () => {
        const result = await shoppingListRepository.getShoppingList()
        const expected = [{id: 1, name: 'test-name', category: 'test-category'}]

        expect(spyStubGet).toHaveBeenCalledWith('/api/v1/list')
        expect(result).toEqual(expected)
    })

    test('saveShoppingItem実行時、postを正しいパスとbodyで呼び出し,postの返り値をreturnしていること', async () => {
        const saveValue = {
            name: '玉ねぎ',
            category: ItemCategory.WISH,
        }

        const result = await shoppingListRepository.saveShoppingItem(saveValue)
        expect(spyStubPost).toHaveBeenCalledWith(
            '/api/v1/item/save',
            saveValue,
        )
        expect(result).toEqual({id: 1})
    })

    test('changeShoppingItem実行時、patchを正しいパスとbodyで呼び出し、patchの返り値をreturnしていること', async () => {
        const saveValue = {
            id: 1,
            name: '長ねぎ',
            category: ItemCategory.CART,
        }

        const result = await shoppingListRepository.changeShoppingItem(saveValue)
        expect(spyStubPatch).toHaveBeenCalledWith(
            '/api/v1/item/update',
            saveValue,
        )
        expect(result).toEqual({id: 1})
    })

    test('deleteShoppingItem実行時、deleteを正しいパスとbodyで呼び出し、deleteの返り値をreturnしていること', async () => {
        //ARRANGE
        const deleteIds = {ids:[1,2,3]}
        // ACT
        const result = await shoppingListRepository.deleteShoppingItem(deleteIds)
        // ASSERT
        expect(spyStubDelete).toHaveBeenCalledWith('/api/v1/item/delete',deleteIds)
        expect(result).toEqual(
            {ids:[ 1, 2, 3]})
    })
})
