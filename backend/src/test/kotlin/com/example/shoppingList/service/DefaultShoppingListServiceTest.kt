package com.example.shoppingList.service

import com.example.shoppingList.entity.ShoppingListEntity
import com.example.shoppingList.models.DeleteItemIds
import com.example.shoppingList.models.ShoppingItemRequest
import com.example.shoppingList.models.UpdateShoppingItemRequest
import com.example.shoppingList.repository.ShoppingListRepository
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest


@DataJpaTest
class DefaultShoppingListServiceTest {
    @Autowired
    private lateinit var shoppingListRepository: ShoppingListRepository

    @Test
    fun `saveShoppingItemが実行されるとDBにshoppingItemが保存される`() {
        // ARRANGE
        val shoppingListService = DefaultShoppingListService(shoppingListRepository)
        val shoppingItem = ShoppingItemRequest(name = "test-name", category = "test-category")

        // ACT
        val result = shoppingListService.saveShoppingItem(shoppingItem)

        // ASSERT
        val shoppingItemFromDB = shoppingListRepository.findById(result.id).get()
        assertEquals(shoppingItemFromDB.name, shoppingItem.name)
        assertEquals(shoppingItemFromDB.category, shoppingItem.category)
    }

    @Test
    fun `getShoppingListが実行されるとDBからshoppingListが返される`() {
        // ARRANGE
        val shoppingListService = DefaultShoppingListService(shoppingListRepository)
        val savedShoppingList = shoppingListRepository.saveAll(
            listOf(
                ShoppingListEntity(name = "test-name1", category = "test-category1"),
                ShoppingListEntity(name = "test-name2", category = "test-category2")
            )
        )


        // ACT
        val result = shoppingListService.getShoppingList()

        // ASSERT
        assertEquals(savedShoppingList, result)
    }

    @Test
    fun `updateShoppingItemが実行されるとDBから更新したshoppingItemのidが返される`() {
        // ARRANGE
        val shoppingListService = DefaultShoppingListService(shoppingListRepository)
        val savedShoppingList = shoppingListRepository.saveAll(
            listOf(
                ShoppingListEntity(name = "test-name1", category = "Wish"),
                ShoppingListEntity(name = "test-name2", category = "Wish")
            )
        )


        // ACT
        val updateShoppingItem = UpdateShoppingItemRequest(id = savedShoppingList[0].id, name = "test-name1", category = "Cart")
        val result = shoppingListService.updateShoppingItem(updateShoppingItem)

        // ASSERT
        val shoppingItemFromDB = shoppingListRepository.findById(result.id).get()
        assertEquals(updateShoppingItem.id, result.id)
        assertEquals("Cart", shoppingItemFromDB.category)
    }

    @Test
    fun `deleteShoppingItemが実行されるとDBから削除したshoppingItemのidがListで返される`() {
        // ARRANGE
        val shoppingListService = DefaultShoppingListService(shoppingListRepository)
        val savedShoppingList = shoppingListRepository.saveAll(
            listOf(
                ShoppingListEntity(name = "test-name1", category = "Wish"),
                ShoppingListEntity(name = "test-name2", category = "Wish")
            )
        )


        // ACT
        val deleteItemIds = DeleteItemIds(ids=listOf(savedShoppingList[0].id,savedShoppingList[1].id))
        val result = shoppingListService.deleteShoppingItem(deleteItemIds)

        // ASSERT
        val shoppingItemFromDB = shoppingListRepository.findAll()
        assertEquals(0, shoppingItemFromDB.size)
        assertEquals(deleteItemIds, result)
    }
}
