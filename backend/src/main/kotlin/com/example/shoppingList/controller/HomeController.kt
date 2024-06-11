package com.example.demo

import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping

@Controller
class HomeController {

    @RequestMapping("/{path:[^\\.]*}")
    fun redirect(): String {
        return "forward:/index.html"
    }

    @GetMapping("/")
    fun home(): String {
        return "forward:/index.html"
    }
}