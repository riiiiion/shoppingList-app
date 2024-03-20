import { useState } from 'react'

import { Header } from '@/base/components/Header.tsx'
import ShoppingList from '@/base/components/ShoppingList.tsx'
import { ShoppingListRepositoryImpl } from '@/base/repository/ShoppinListRepository.ts'

function App() {
  const [shoppingListRepository] = useState(new ShoppingListRepositoryImpl())

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <Header />
      <ShoppingList shoppingListRepository={shoppingListRepository} />
    </div>
  )
}

export default App
