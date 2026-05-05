package com.infy.poc.e_com_backend.repository;

import com.infy.poc.e_com_backend.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    // Find products by category
    List<Product> findByCategory(String category);

    // Find products by name containing a keyword
    List<Product> findByNameContainingIgnoreCase(String name);

    // Find products under a certain price
    List<Product> findByPriceLessThanEqual(Double price);
}
