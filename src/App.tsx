import { useState } from 'react'

import { Header } from '@/base/components/Header.tsx'
import ShoppingList from '@/base/components/ShoppingList.tsx'
import { ShoppingListRepositoryImpl } from '@/base/repository/ShoppinListRepository.ts'

function App() {
  const [shoppingListRepository] = useState(new ShoppingListRepositoryImpl())

  return (
    <>
      <Header />
      <ShoppingList shoppingListRepository={shoppingListRepository} />
    </>
  )
}

export default App
