package com.example.shoppingList.models

data class ShoppingItemRequest(
        val name: String,
        val category: String,
)
data class ShoppingItemResponse(
        val name: String,
        val category: String,
)
data class UpdateShoppingItemRequest(
        val id:Long,
        val name: String,
        val category: String,
)
data class SavedItemResponse(
        val id:Long,
)

data class DeleteItemIds(
        val ids:List<Long> = emptyList()
)
