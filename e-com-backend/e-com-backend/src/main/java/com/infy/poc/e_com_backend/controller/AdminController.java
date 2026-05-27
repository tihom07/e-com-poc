package com.infy.poc.e_com_backend.controller;

import com.infy.poc.e_com_backend.model.Order;
import com.infy.poc.e_com_backend.model.User;
import com.infy.poc.e_com_backend.repository.OrderRepository;
import com.infy.poc.e_com_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderRepository orderRepository;

    // GET all users
    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(users);
    }

    // GET orders for a specific user
    @GetMapping("/users/{userId}/orders")
    public ResponseEntity<?> getUserOrders(@PathVariable Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<Order> orders = orderRepository.findByUserOrderByCreatedAtDesc(user);
        return ResponseEntity.ok(orders);
    }

    // GET all orders
    @GetMapping("/orders")
    public ResponseEntity<?> getAllOrders() {
        List<Order> orders = orderRepository.findAllByOrderByCreatedAtDesc();
        return ResponseEntity.ok(orders);
    }

    // DELETE order
    @DeleteMapping("/orders/{orderId}")
    public ResponseEntity<?> deleteOrder(@PathVariable Long orderId) {
        if (!orderRepository.existsById(orderId)) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Order not found");
            return ResponseEntity.status(404).body(error);
        }
        orderRepository.deleteById(orderId);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Order deleted successfully");
        return ResponseEntity.ok(response);
    }
}