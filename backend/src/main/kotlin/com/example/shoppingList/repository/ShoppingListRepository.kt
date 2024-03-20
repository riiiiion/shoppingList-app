package com.example.shoppingList.repository

import com.example.shoppingList.entity.ShoppingListEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface ShoppingListRepository: JpaRepository<ShoppingListEntity, Long>  {
}

