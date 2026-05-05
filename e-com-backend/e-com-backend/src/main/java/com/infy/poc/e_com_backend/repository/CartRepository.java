package com.infy.poc.e_com_backend.repository;

import com.infy.poc.e_com_backend.model.Cart;
import com.infy.poc.e_com_backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {

    // Find cart by user
    Optional<Cart> findByUser(User user);
}
