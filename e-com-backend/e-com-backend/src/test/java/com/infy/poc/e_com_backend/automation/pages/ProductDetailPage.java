package com.infy.poc.e_com_backend.automation.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class ProductDetailPage extends BasePage {
    private final By allProductsBreadcrumb = By.xpath("//button[normalize-space()='All Products']");
    private final By descriptionTab = By.xpath("//button[normalize-space()='Product Description']");
    private final By specificationsTab = By.xpath("//button[normalize-space()='Specifications']");
    private final By deliveryTab = By.xpath("//button[normalize-space()='Delivery & Returns']");
    private final By addToCartButton = By.xpath("//button[contains(normalize-space(),'Add to Cart')]");

    public ProductDetailPage(WebDriver driver) {
        super(driver);
    }

    public ProductDetailPage waitUntilLoaded(String productName) {
        visible(productNameHeading(productName));
        visible(allProductsBreadcrumb);
        visible(descriptionTab);
        visible(specificationsTab);
        visible(deliveryTab);
        visible(addToCartButton);
        return this;
    }

    public ProductListPage backToProducts() {
        click(allProductsBreadcrumb);
        return new ProductListPage(driver).waitUntilLoaded();
    }

    public ProductDetailPage addToCart() {
        click(addToCartButton);
        visible(By.xpath("//*[contains(normalize-space(),'Added to cart successfully')]"));
        return this;
    }

    public boolean hasProductName(String productName) {
        return isVisible(productNameHeading(productName));
    }

    public boolean hasPrice(String expectedPrice) {
        return isVisible(By.xpath("//*[normalize-space()='" + expectedPrice + "']"));
    }

    public boolean hasAvailability(String availability) {
        return isVisible(By.xpath("//*[normalize-space()='" + availability + "']"));
    }

    public boolean hasProductDescriptionTable() {
        return isVisible(By.xpath("//h3[normalize-space()='Product Details']"));
    }

    public ProductDetailPage openSpecifications() {
        click(specificationsTab);
        visible(By.xpath("//h3[normalize-space()='Product Information']"));
        return this;
    }

    private By productNameHeading(String productName) {
        return By.xpath("//h1[normalize-space()='" + productName + "']");
    }
}
