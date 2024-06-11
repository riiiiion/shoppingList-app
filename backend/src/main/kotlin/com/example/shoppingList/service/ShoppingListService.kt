package com.example.shoppingList.service
import com.example.shoppingList.entity.ShoppingListEntity
import com.example.shoppingList.models.DeleteItemIds
import com.example.shoppingList.models.SavedItemResponse
import com.example.shoppingList.models.ShoppingItemRequest
import com.example.shoppingList.models.UpdateShoppingItemRequest
import com.example.shoppingList.repository.ShoppingListRepository
import org.springframework.stereotype.Service

interface ShoppingListService {
    fun saveShoppingItem(shoppingItem: ShoppingItemRequest): ShoppingListEntity
    fun getShoppingList(): List<ShoppingListEntity>
    fun updateShoppingItem(shoppingItem:UpdateShoppingItemRequest): SavedItemResponse
    fun deleteShoppingItem(ids:DeleteItemIds): DeleteItemIds
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

    override fun updateShoppingItem(shoppingItem: UpdateShoppingItemRequest): SavedItemResponse {
        val shoppingListEntity = shoppingListRepository.findById(shoppingItem.id).get()
        shoppingListEntity.category = shoppingItem.category
        val result = shoppingListRepository.save(shoppingListEntity)
        return SavedItemResponse(id = result.id)
    }

    override fun deleteShoppingItem(ids: DeleteItemIds): DeleteItemIds {
        shoppingListRepository.deleteAllById(ids.ids)
        val notDeletedIds = ids.ids.filter { id ->
            shoppingListRepository.existsById(id)
        }

        return if (notDeletedIds.isEmpty()) {
            DeleteItemIds(ids = ids.ids)
        } else {
            DeleteItemIds(ids = notDeletedIds)
        }
    }

}
