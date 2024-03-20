package com.example.shoppingList.models

data class ShoppingItemRequest(
        val name: String,
        val category: String,
)
data class ShoppingItemResponse(
        val name: String,
        val category: String,
)
