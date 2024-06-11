import {ChangeItem, Item, NumberIdList, SavedItemResponse, SaveItem} from '@/base/components/ShoppingList.tsx'
import {Http} from '@/base/repository/Http.tsx'

export interface ShoppingListRepository {
  getShoppingList(): Promise<Item[]>
  saveShoppingItem(item: SaveItem): Promise<SavedItemResponse>
  changeShoppingItem(item: ChangeItem): Promise<SavedItemResponse>
  deleteShoppingItem(deleteIds: NumberIdList): Promise<NumberIdList>
}

export class ShoppingListRepositoryImpl implements ShoppingListRepository {
  constructor(private http: Http) {}

  async getShoppingList(): Promise<Item[]> {
    return this.http.get<Item[]>('/api/v1/list')
  }

  async saveShoppingItem(item: SaveItem): Promise<SavedItemResponse> {
    return this.http.post<SavedItemResponse,SaveItem>('/api/v1/item/save',item)
  }

  async changeShoppingItem(item: ChangeItem): Promise<SavedItemResponse> {
    return this.http.patch<SavedItemResponse,ChangeItem>('/api/v1/item/update', item)
  }
  deleteShoppingItem(deleteIds: NumberIdList): Promise<NumberIdList> {
    return this.http.delete<NumberIdList,NumberIdList>('/api/v1/item/delete',deleteIds)
  }

}


// TODO
// apiのパス変更している
// 次はフロントのrepo呼び出しの実装から
