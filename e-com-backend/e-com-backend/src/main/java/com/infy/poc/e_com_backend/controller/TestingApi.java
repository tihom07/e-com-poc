package com.infy.poc.e_com_backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestingApi {

    @GetMapping("/test")
    public String test(){
        return "My name is Mohit";
    }

}

