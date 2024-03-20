import { Item } from './ShoppingList.tsx'

type Props = {
  items: Item[]
  onDeleteItem: (id: string) => void
  onPutBackItem: (id: string) => void
}

export function CartList({ items, onDeleteItem, onPutBackItem }: Props) {
  return (
    <div className="mt-4" data-testid="cartList">
      <h1 className="text-xl font-semibold">カゴに入れたもの</h1>
      <div className="divide-y divide-gray-300">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between py-2">
            <div className="text-lg font-medium text-gray-700">{item.name}</div>
            <div>
              <button
                className="px-2 py-1 bg-green-200 text-green-600 font-semibold rounded hover:bg-green-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 text-xs"
                onClick={() => onPutBackItem(item.id)}
              >
                戻す
              </button>
              <button
                className="px-2 py-1 bg-red-200 text-red-600 font-semibold rounded hover:bg-red-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 text-xs"
                onClick={() => onDeleteItem(item.id)}
              >
                削除
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
