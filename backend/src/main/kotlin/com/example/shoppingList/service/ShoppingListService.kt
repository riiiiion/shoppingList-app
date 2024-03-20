package com.example.shoppingList.service
import com.example.shoppingList.entity.ShoppingListEntity
import com.example.shoppingList.models.ShoppingItemRequest
import com.example.shoppingList.repository.ShoppingListRepository
import org.springframework.stereotype.Service

interface ShoppingListService {
    fun saveShoppingItem(shoppingItem: ShoppingItemRequest): ShoppingListEntity
    fun getShoppingList(): List<ShoppingListEntity>
}

@Service
class DefaultShoppingListService(
    val  shoppingListRepository: ShoppingListRepository
):ShoppingListService {
    override fun saveShoppingItem(shoppingItem: ShoppingItemRequest):ShoppingListEntity {
        val shoppingListEntity = ShoppingListEntity(name = shoppingItem.name, category = shoppingItem.category)
        return shoppingListRepository.save(shoppingListEntity)
    }

    override fun getShoppingList(): List<ShoppingListEntity> {
        return shoppingListRepository.findAll()
    }

}
