import { render } from '@testing-library/react'
import { describe, test } from 'vitest'

import App from '@/App.tsx'
import { Header } from '@/base/components/Header.tsx'
import ShoppingList from '@/base/components/ShoppingList.tsx'

vitest.mock('@/base/components/Header.tsx')
vitest.mock('@/base/components/ShoppingList.tsx')

describe('App', () => {
  test('Headerコンポーネントを呼び出していること', () => {
    render(<App />)

    expect(Header).toHaveBeenCalled()
  })
  test('ShoppingListコンポーネントを呼び出していること', () => {
    render(<App />)

    expect(ShoppingList).toHaveBeenCalled()
  })
})
