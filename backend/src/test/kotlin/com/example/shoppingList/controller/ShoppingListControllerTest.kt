package com.example.shoppingList.controller

import com.example.shoppingList.entity.ShoppingListEntity
import com.example.shoppingList.models.ShoppingItemRequest
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
import org.springframework.test.web.servlet.result.MockMvcResultMatchers
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status


@SpringBootTest
@AutoConfigureMockMvc
class ShoppingListControllerTest{

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
                    post("/api/v1/save")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(
                            """
                            {
                        "name": "test-name",
                        "category":"test-category"
                            }
                        """.trimIndent()
                        )
            )

            val item  = ShoppingItemRequest(name = "test-name",category="test-category")
            // ASSERT
            verify { spyShoppingListService.saveShoppingItem(item) }
            mockMvc.andExpect(status().isOk)
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("test-name"))
                .andExpect(jsonPath("$.category").value("test-category"))
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

}

