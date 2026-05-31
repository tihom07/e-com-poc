package com.infy.poc.e_com_backend.config;

import com.infy.poc.e_com_backend.model.Product;
import com.infy.poc.e_com_backend.repository.CartItemRepository;
import com.infy.poc.e_com_backend.repository.OrderItemRepository;
import com.infy.poc.e_com_backend.repository.OrderRepository;
import com.infy.poc.e_com_backend.repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Configuration
public class CatalogSeeder {

    @Bean
    @Transactional
    CommandLineRunner seedShoeCatalog(
            ProductRepository productRepository,
            CartItemRepository cartItemRepository,
            OrderItemRepository orderItemRepository,
            OrderRepository orderRepository,
            @Value("${catalog.seed.enabled:true}") boolean seedEnabled
    ) {
        return args -> {
            if (!seedEnabled) {
                return;
            }

            cartItemRepository.deleteAllInBatch();
            orderItemRepository.deleteAllInBatch();
            orderRepository.deleteAllInBatch();
            productRepository.deleteAllInBatch();

            productRepository.saveAll(List.of(
                    product("Formal Oxford Black", "Formal", 3499.0, 18,
                            "Polished black oxford shoes with a clean lace-up profile for office wear, interviews, and formal events."),
                    product("Formal Derby Tan", "Formal", 3199.0, 16,
                            "Tan derby shoes with a cushioned insole and classic stitching for business and evening outfits."),
                    product("Formal Monk Strap Brown", "Formal", 4299.0, 12,
                            "Brown monk strap shoes with metal buckle detailing and a premium formal finish."),
                    product("Formal Loafer Navy", "Formal", 2799.0, 20,
                            "Slip-on navy formal loafers made for meetings, travel, and comfortable daily office use."),
                    product("Formal Brogue Coffee", "Formal", 3899.0, 14,
                            "Coffee brown brogue shoes with wingtip detailing and a durable sole for polished styling."),

                    product("Basketball High Top Pro", "Basketball", 5499.0, 15,
                            "High-top basketball shoes with ankle support, grippy outsole, and responsive court cushioning."),
                    product("Basketball Court Grip Red", "Basketball", 4999.0, 17,
                            "Red court shoes built with strong lateral support for quick cuts and fast direction changes."),
                    product("Basketball Air Bounce Blue", "Basketball", 5799.0, 13,
                            "Blue basketball sneakers with bounce cushioning and breathable mesh for intense games."),
                    product("Basketball Street Dunk", "Basketball", 4599.0, 19,
                            "Court-inspired dunk shoes that work for pickup games and everyday street styling."),
                    product("Basketball Power Pivot", "Basketball", 6299.0, 11,
                            "Performance basketball shoes with pivot-zone traction and reinforced heel lockdown."),

                    product("Casual Everyday White", "Casual", 1999.0, 25,
                            "Minimal white casual sneakers with soft lining and a lightweight sole for daily wear."),
                    product("Casual Canvas Classic", "Casual", 1499.0, 30,
                            "Low-top canvas shoes with flexible comfort for college, errands, and weekend outfits."),
                    product("Casual Retro Runner", "Casual", 2499.0, 22,
                            "Retro-style casual sneakers with layered panels and cushioned support for long days."),
                    product("Casual Slip-On Grey", "Casual", 1799.0, 28,
                            "Grey slip-on casual shoes with an easy fit and padded footbed for relaxed wear."),
                    product("Casual Chunky Street", "Casual", 2999.0, 18,
                            "Chunky street sneakers with bold sole styling and comfortable all-day cushioning."),

                    product("Boots Trekking Brown", "Boots", 4499.0, 16,
                            "Rugged brown trekking boots with ankle support and a grippy outsole for outdoor routes."),
                    product("Boots Chelsea Black", "Boots", 3799.0, 14,
                            "Black chelsea boots with elastic side panels and a sleek profile for smart casual outfits."),
                    product("Boots Combat Olive", "Boots", 4199.0, 12,
                            "Olive combat boots with tough construction, lace-up support, and a durable outsole."),
                    product("Boots Winter Trail", "Boots", 4999.0, 10,
                            "Trail-ready winter boots with warm lining and stable traction for rough surfaces."),
                    product("Boots Desert Sand", "Boots", 3299.0, 21,
                            "Sand desert boots with soft upper material and a lightweight everyday sole."),

                    product("Running Pace Lite", "Running", 2799.0, 26,
                            "Light running shoes with breathable mesh and soft cushioning for daily jogs."),
                    product("Running Marathon Flex", "Running", 3999.0, 18,
                            "Flexible long-distance running shoes with shock absorption and smooth transitions."),
                    product("Running Sprint Neon", "Running", 3499.0, 20,
                            "Fast neon running shoes with a lightweight build and energetic road feel."),
                    product("Running Trail Grip", "Running", 4299.0, 15,
                            "Trail running shoes with stronger traction, reinforced toe guard, and stable support."),
                    product("Running Cloud Foam", "Running", 4599.0, 17,
                            "Soft foam running shoes made for recovery runs, gym sessions, and all-day comfort.")
            ));
        };
    }

    private Product product(String name, String category, Double price, Integer stock, String description) {
        Product product = new Product();
        product.setName(name);
        product.setCategory(category);
        product.setPrice(price);
        product.setStock(stock);
        product.setDescription(description);
        product.setImageUrl(imageUrlFor(category, name));
        return product;
    }

    private String imageUrlFor(String category, String name) {
        String tags = switch (category) {
            case "Formal" -> "formal,shoe";
            case "Basketball" -> "basketball,shoe";
            case "Casual" -> "sneakers,shoe";
            case "Boots" -> "boots,shoe";
            case "Running" -> "running,shoe";
            default -> "shoe";
        };

        int lock = Math.abs(name.hashCode());
        if (lock < 0) {
            lock = 1;
        }
        return "https://loremflickr.com/640/480/" + tags + "?lock=" + lock;
    }
}
