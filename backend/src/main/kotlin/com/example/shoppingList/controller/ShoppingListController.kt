package com.example.shoppingList.controller

import com.example.shoppingList.entity.ShoppingListEntity
import com.example.shoppingList.models.DeleteItemIds
import com.example.shoppingList.models.SavedItemResponse
import com.example.shoppingList.models.ShoppingItemRequest
import com.example.shoppingList.models.UpdateShoppingItemRequest
import com.example.shoppingList.service.ShoppingListService
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PatchMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController


@RestController
@RequestMapping("/api/v1")
class ShoppingListController(
    val shoppingListService: ShoppingListService
) {
        @PostMapping("/item/save")
    fun postShoppingItem(
            @RequestBody body: ShoppingItemRequest
    ): ShoppingListEntity {
     return shoppingListService.saveShoppingItem(body)
    }
        @GetMapping("/list")
    fun getShoppingList(
    ): List<ShoppingListEntity> {
     return shoppingListService.getShoppingList()
    }
        @PatchMapping("/item/update")
    fun patchShoppingItem(
            @RequestBody body: UpdateShoppingItemRequest
    ): SavedItemResponse {
     return shoppingListService.updateShoppingItem(body)
    }
        @DeleteMapping("/item/delete")
    fun deleteShoppingItem(
            @RequestBody body: DeleteItemIds
    ):DeleteItemIds  {
     return shoppingListService.deleteShoppingItem(body)
    }

}
