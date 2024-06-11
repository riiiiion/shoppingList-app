package com.example.shoppingList.controller

import com.example.shoppingList.entity.ShoppingListEntity
import com.example.shoppingList.models.DeleteItemIds
import com.example.shoppingList.models.SavedItemResponse
import com.example.shoppingList.models.ShoppingItemRequest
import com.example.shoppingList.models.UpdateShoppingItemRequest
import com.example.shoppingList.service.ShoppingListService
import com.ninjasquad.springmockk.SpykBean
import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import org.junit.jupiter.api.Nested
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.MockMvc
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch
import org.springframework.test.web.servlet.result.MockMvcResultMatchers
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status


@SpringBootTest
@AutoConfigureMockMvc
class ShoppingListControllerTest {

    @Autowired
    private lateinit var mockMvc: MockMvc

    @SpykBean
    private lateinit var spyShoppingListService: ShoppingListService


    @Nested
    inner class PostShoppingItem {
        @Test
        fun `shoppingListService-saveShoppingItemをitemを引数に呼び出していること`() {
            // ARRANGE
            every {
                spyShoppingListService.saveShoppingItem(any())
            } returns ShoppingListEntity(id = 1, name = "test-name", category = "test-category")

            // ACT
            val mockMvc = mockMvc.perform(
                post("/api/v1/item/save")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(
                        """
                            {
                        "name": "test-name",
                        "category":"Wish"
                            }
                        """.trimIndent()
                    )
            )

            val item = ShoppingItemRequest(name = "test-name", category = "Wish")
            // ASSERT
            verify { spyShoppingListService.saveShoppingItem(item) }
            mockMvc.andExpect(status().isOk)
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("test-name"))
                .andExpect(jsonPath("$.category").value("Wish"))
        }
    }

    @Nested
    inner class GetShoppingList {
        @Test
        fun `shoppingListService-getShoppingListを呼び出していること`() {
            // ARRANGE
            every {
                spyShoppingListService.getShoppingList()
            } returns listOf(ShoppingListEntity(id = 1, name = "test-name", category = "test-category"))

            // ACT
            val mockMvc = mockMvc.perform(
                get("/api/v1/list")
                    .contentType(MediaType.APPLICATION_JSON)
            )

            // ASSERT
            verify { spyShoppingListService.getShoppingList() }
            mockMvc.andExpect(status().isOk)
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].name").value("test-name"))
                .andExpect(jsonPath("$[0].category").value("test-category"))
        }
    }

    @Nested
    inner class PatchShoppingItem {
        @Test
        fun `shoppingListService-patchShoppingItemを呼び出していること`() {
            // ARRANGE
            every {
                spyShoppingListService.updateShoppingItem(any())
            } returns SavedItemResponse(id = 1)

            // ACT
            val mockMvc = mockMvc.perform(
                patch("/api/v1/item/update")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(
                        """
                            {
                        "id": 1,
                        "name": "test-name",
                        "category":"Wish"
                            }
                        """.trimIndent()
                    )

            )

            // ASSERT
            val updateItem = UpdateShoppingItemRequest(id = 1, name = "test-name", category = "Wish")
            verify { spyShoppingListService.updateShoppingItem(updateItem) }
            mockMvc.andExpect(status().isOk)
                .andExpect(jsonPath("$.id").value(1))
        }
    }

    @Nested
    inner class DeleteShoppingItem {
        @Test
        fun `shoppingListService-deleteShoppingItemを呼び出していること`() {
            // ARRANGE
            every {
                spyShoppingListService.deleteShoppingItem(any())
            } returns DeleteItemIds(ids = listOf(1,2))

            // ACT
            val mockMvc = mockMvc.perform(
                delete("/api/v1/item/delete")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(
                        """
                            {
                        "ids":[1,2]
                            }
                        """.trimIndent()
                    )

            )

            // ASSERT
            val deleteIds = DeleteItemIds(ids = listOf(1, 2))
            verify { spyShoppingListService.deleteShoppingItem(deleteIds) }
            mockMvc.andExpect(status().isOk)
                .andExpect(jsonPath("$.ids[0]").value(1))
                .andExpect(jsonPath("$.ids[1]").value(2))
        }
    }

}

