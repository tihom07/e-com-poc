package com.infy.poc.e_com_backend.service;

import com.infy.poc.e_com_backend.model.*;
import com.infy.poc.e_com_backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    //  Checkout with full transaction support
    @Transactional(rollbackFor = Exception.class)
    public Order checkout(String email) {

        // Step 1 — Get user
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Step 2 — Get cart
        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        // Step 3 — Validate cart is not empty
        if (cart.getItems() == null || cart.getItems().isEmpty()) {
            throw new RuntimeException("Cannot checkout with empty cart");
        }

        // Step 4 — Create order
        Order order = new Order();
        order.setUser(user);
        order.setStatus("PENDING");
        order.setCreatedAt(LocalDateTime.now());
        order.setTotalPrice(0.0);

        // Step 5 — Save order first to get ID
        Order savedOrder = orderRepository.save(order);

        double totalPrice = 0.0;

        // Step 6 — Process each cart item
        for (CartItem cartItem : cart.getItems()) {

            //  Fix — use cartProduct first then final product
            Product cartProduct = cartItem.getProduct();

            //  Validate product still exists
            final Product product = productRepository
                    .findById(cartProduct.getId())
                    .orElseThrow(() -> new RuntimeException(
                            "Product not found: " + cartProduct.getName()));

            //  Validate not out of stock
            if (product.getStock() <= 0) {
                throw new RuntimeException(
                        product.getName() + " is out of stock. " +
                                "Please remove it from cart and try again."
                );
            }

            //  Validate enough stock
            if (product.getStock() < cartItem.getQuantity()) {
                throw new RuntimeException(
                        "Not enough stock for " + product.getName() +
                                ". Only " + product.getStock() + " available " +
                                "but " + cartItem.getQuantity() + " requested."
                );
            }

            //  Create order item — save price at time of order
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(savedOrder);
            orderItem.setProduct(product);
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPrice(product.getPrice());

            // Save order item
            orderItemRepository.save(orderItem);

            // Add to order items list
            savedOrder.getItems().add(orderItem);

            //  Reduce stock
            product.setStock(product.getStock() - cartItem.getQuantity());
            productRepository.save(product);

            // Calculate total
            totalPrice += product.getPrice() * cartItem.getQuantity();
        }

        // Step 7 — Update total price and status
        savedOrder.setTotalPrice(totalPrice);
        savedOrder.setStatus("CONFIRMED");
        orderRepository.save(savedOrder);

        // Step 8 — Clear cart after successful checkout
        cart.getItems().clear();
        cartRepository.save(cart);

        return savedOrder;
    }

    //  Get all orders for user — newest first
    @Transactional(readOnly = true)
    public List<Order> getOrders(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return orderRepository.findByUserOrderByCreatedAtDesc(user);
    }

    //  Get single order by ID
    @Transactional(readOnly = true)
    public Order getOrderById(Long orderId, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // Make sure order belongs to this user
        if (!order.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access to order");
        }

        return order;
    }

    //  Cancel order with stock restore
    @Transactional(rollbackFor = Exception.class)
    public Order cancelOrder(Long orderId, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // Make sure order belongs to this user
        if (!order.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access to order");
        }

        // Can only cancel PENDING or CONFIRMED orders
        if (order.getStatus().equals("CANCELLED")) {
            throw new RuntimeException("Order is already cancelled");
        }

        if (order.getStatus().equals("DELIVERED")) {
            throw new RuntimeException("Cannot cancel a delivered order");
        }

        //  Restore stock on cancel
        for (OrderItem item : order.getItems()) {
            Product product = item.getProduct();
            product.setStock(product.getStock() + item.getQuantity());
            productRepository.save(product);
        }

        order.setStatus("CANCELLED");
        return orderRepository.save(order);
    }
}