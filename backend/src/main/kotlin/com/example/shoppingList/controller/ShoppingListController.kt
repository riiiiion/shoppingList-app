package com.example.shoppingList.controller

import com.example.shoppingList.entity.ShoppingListEntity
import com.example.shoppingList.models.ShoppingItemRequest
import com.example.shoppingList.service.DefaultShoppingListService
import com.example.shoppingList.service.ShoppingListService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController


@RestController
@RequestMapping("/api/v1")
class ShoppingListController(
    val shoppingListService: ShoppingListService
) {
        @PostMapping("/save")
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

}
