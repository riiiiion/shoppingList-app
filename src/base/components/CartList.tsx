import { Item } from '@/base/components/ShoppingList.tsx'

type Props = {
  items: Item[]
}

export function CartList({ items }: Props) {
  return (
    <div data-testid="cartList">
      <h1>カゴに入れたもの</h1>
      {items.map((item) => (
        <div key={item.id}>
          <div>{item.name}</div>
        </div>
      ))}
    </div>
  )
}
