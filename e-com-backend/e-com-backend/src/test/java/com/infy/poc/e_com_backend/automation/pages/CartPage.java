package com.infy.poc.e_com_backend.automation.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class CartPage extends BasePage {
    private final By heading = By.xpath("//h2[contains(normalize-space(),'My Cart')]");
    private final By emptyCartMessage = By.xpath("//p[normalize-space()='Your cart is empty']");
    private final By clearCartButton = By.xpath("//button[normalize-space()='Clear Cart']");
    private final By startShoppingButton = By.xpath("//button[normalize-space()='Start Shopping']");
    private final By continueShoppingButton = By.xpath("//button[normalize-space()='Continue Shopping']");
    private final By checkoutButton = By.xpath("//button[normalize-space()='Proceed to Checkout']");
    private final By orderSummary = By.xpath("//h3[normalize-space()='Order Summary']");

    public CartPage(WebDriver driver) {
        super(driver);
    }

    public CartPage waitUntilLoaded() {
        visible(heading);
        return this;
    }

    public CartPage waitForItem(String productName) {
        visible(itemName(productName));
        visible(orderSummary);
        return this;
    }

    public CartPage waitForEmpty() {
        visible(emptyCartMessage);
        visible(startShoppingButton);
        return this;
    }

    public ProductListPage startShopping() {
        click(startShoppingButton);
        return new ProductListPage(driver).waitUntilLoaded();
    }

    public ProductListPage continueShopping() {
        click(continueShoppingButton);
        return new ProductListPage(driver).waitUntilLoaded();
    }

    public CheckoutPage proceedToCheckout() {
        click(checkoutButton);
        return new CheckoutPage(driver).waitUntilLoaded();
    }

    public CartPage increaseQuantity(String productName, int expectedQuantity) {
        click(By.xpath(itemRoot(productName) + "//button[normalize-space()='+']"));
        return waitForQuantity(productName, expectedQuantity);
    }

    public CartPage decreaseQuantity(String productName, int expectedQuantity) {
        click(By.xpath("(" + itemRoot(productName) + "//button)[1]"));
        if (expectedQuantity <= 0) {
            return waitForEmpty();
        }
        return waitForQuantity(productName, expectedQuantity);
    }

    public CartPage waitForQuantity(String productName, int expectedQuantity) {
        visible(By.xpath(itemRoot(productName) + "//span[normalize-space()='" + expectedQuantity + "']"));
        return this;
    }

    public CartPage waitForItemTotal(String productName, String expectedTotal) {
        visible(By.xpath(itemRoot(productName) + "//p[normalize-space()='" + expectedTotal + "']"));
        return this;
    }

    public CartPage waitForSummaryValue(String label, String value) {
        visible(summaryValue(label, value));
        return this;
    }

    public CartPage removeItem(String productName) {
        click(By.xpath(itemRoot(productName) + "//button[normalize-space()='Remove']"));
        return this;
    }

    public String dismissClearCartPopup() {
        click(clearCartButton);
        return dismissAlert();
    }

    public String acceptClearCartPopup() {
        click(clearCartButton);
        String alertText = acceptAlert();
        waitForEmpty();
        return alertText;
    }

    public boolean isItemVisible(String productName) {
        return isVisible(itemName(productName));
    }

    public boolean isEmpty() {
        return isVisible(emptyCartMessage);
    }

    public boolean hasMessage(String message) {
        return textIsVisible(message);
    }

    public boolean hasItemUnitPrice(String productName, String expectedPrice) {
        return isVisible(By.xpath(itemRoot(productName) + "//p[normalize-space()='" + expectedPrice + " each']"));
    }

    public boolean hasItemTotal(String productName, String expectedTotal) {
        return isVisible(By.xpath(itemRoot(productName) + "//p[normalize-space()='" + expectedTotal + "']"));
    }

    public boolean hasSummaryValue(String label, String value) {
        return isVisible(summaryValue(label, value));
    }

    public boolean hasOrderSummary() {
        return isVisible(orderSummary)
                && isVisible(checkoutButton)
                && isVisible(continueShoppingButton);
    }

    public boolean hasClearCartButton() {
        return isVisible(clearCartButton);
    }

    private By itemName(String productName) {
        return By.xpath("//h3[normalize-space()='" + productName + "']");
    }

    private By summaryValue(String label, String value) {
        return By.xpath("//span[normalize-space()='" + label + "']"
                + "/following-sibling::span[normalize-space()='" + value + "']");
    }

    private String itemRoot(String productName) {
        return "//h3[normalize-space()='" + productName + "']"
                + "/ancestor::div[.//button[normalize-space()='Remove']][1]";
    }
}
