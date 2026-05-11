package com.infy.poc.e_com_backend.service;

import com.infy.poc.e_com_backend.dto.CartItemRequest;
import com.infy.poc.e_com_backend.model.*;
import com.infy.poc.e_com_backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    // Get or create cart for user
    private Cart getOrCreateCart(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return cartRepository.findByUser(user)
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setUser(user);
                    return cartRepository.save(newCart);
                });
    }

    // Get cart
    public Cart getCart(String email) {
        return getOrCreateCart(email);
    }

    // Add item to cart
    public Cart addToCart(String email, CartItemRequest request) {
        Cart cart = getOrCreateCart(email);

        //  Validation 1 — quantity must be at least 1
        if (request.getQuantity() < 1) {
            throw new RuntimeException("Quantity must be at least 1");
        }

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        //  Validation 2 — cannot add out of stock product
        if (product.getStock() <= 0) {
            throw new RuntimeException("Product is out of stock");
        }

        // Check existing item in cart
        CartItem existingItem = cartItemRepository
                .findByCartAndProduct(cart, product)
                .orElse(null);

        int currentQuantity = existingItem != null ? existingItem.getQuantity() : 0;
        int newTotalQuantity = currentQuantity + request.getQuantity();

        //  Validation 3 — quantity cannot exceed stock
        if (newTotalQuantity > product.getStock()) {
            throw new RuntimeException(
                    "Cannot add " + request.getQuantity() + " items. " +
                            "Only " + (product.getStock() - currentQuantity) + " more available in stock"
            );
        }

        if (existingItem != null) {
            existingItem.setQuantity(newTotalQuantity);
            cartItemRepository.save(existingItem);
        } else {
            CartItem newItem = new CartItem();
            newItem.setCart(cart);
            newItem.setProduct(product);
            newItem.setQuantity(request.getQuantity());
            cartItemRepository.save(newItem);
        }

        return cartRepository.findById(cart.getId()).orElse(cart);
    }

    // Update item quantity
    public Cart updateCartItem(String email, Long itemId, Integer quantity) {
        Cart cart = getOrCreateCart(email);

        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        //  Validation — quantity cannot exceed stock
        if (quantity > item.getProduct().getStock()) {
            throw new RuntimeException(
                    "Only " + item.getProduct().getStock() + " items available in stock"
            );
        }

        if (quantity <= 0) {
            cartItemRepository.delete(item);
        } else {
            item.setQuantity(quantity);
            cartItemRepository.save(item);
        }

        return cartRepository.findById(cart.getId()).orElse(cart);
    }

    // Remove item from cart
    public Cart removeFromCart(String email, Long itemId) {
        Cart cart = getOrCreateCart(email);

        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        cartItemRepository.delete(item);
        return cartRepository.findById(cart.getId()).orElse(cart);
    }

    // Clear cart
    public void clearCart(String email) {
        Cart cart = getOrCreateCart(email);
        cart.getItems().clear();
        cartRepository.save(cart);
    }
}