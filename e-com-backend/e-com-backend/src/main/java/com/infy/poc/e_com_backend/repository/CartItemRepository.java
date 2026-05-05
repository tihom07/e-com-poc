package com.infy.poc.e_com_backend.repository;

import com.infy.poc.e_com_backend.model.Cart;
import com.infy.poc.e_com_backend.model.CartItem;
import com.infy.poc.e_com_backend.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    // Find specific item in cart by product
    Optional<CartItem> findByCartAndProduct(Cart cart, Product product);
}
