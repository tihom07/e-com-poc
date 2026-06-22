package com.infy.poc.e_com_backend.automation.tests;

import com.infy.poc.e_com_backend.automation.base.BaseTest;
import com.infy.poc.e_com_backend.automation.pages.CartPage;
import com.infy.poc.e_com_backend.automation.pages.DashboardPage;
import com.infy.poc.e_com_backend.automation.pages.ProductListPage;
import org.testng.Assert;
import org.testng.annotations.Test;

public class CartOperationsTest extends BaseTest {
    private static final String PRODUCT_NAME = "Formal Oxford Black";
    private static final String SINGLE_PRICE = "Rs. 3,499.00";
    private static final String DOUBLE_PRICE = "Rs. 6,998.00";
    private static final String CLEAR_CART_CONFIRMATION = "Clear all items from cart?";

    @Test(priority = 1, description = "Automate updating product quantity in the cart")
    public void testUpdateCartQuantity() {
        CartPage cartPage = addProductToCartForNewUser();

        cartPage.waitForQuantity(PRODUCT_NAME, 1)
                .increaseQuantity(PRODUCT_NAME, 2)
                .waitForItemTotal(PRODUCT_NAME, DOUBLE_PRICE)
                .waitForSummaryValue("Total Items", "2")
                .waitForSummaryValue("Subtotal", DOUBLE_PRICE)
                .waitForSummaryValue("Total", DOUBLE_PRICE);

        Assert.assertTrue(cartPage.hasItemTotal(PRODUCT_NAME, DOUBLE_PRICE), "Item total should update after quantity increase");
        Assert.assertTrue(cartPage.hasSummaryValue("Total Items", "2"), "Summary item count should update after quantity increase");

        cartPage.decreaseQuantity(PRODUCT_NAME, 1)
                .waitForItemTotal(PRODUCT_NAME, SINGLE_PRICE)
                .waitForSummaryValue("Total Items", "1")
                .waitForSummaryValue("Total", SINGLE_PRICE);

        Assert.assertTrue(cartPage.hasItemTotal(PRODUCT_NAME, SINGLE_PRICE), "Item total should update after quantity decrease");
    }

    @Test(priority = 2, description = "Automate removing an item from the cart")
    public void testRemoveItemFromCart() {
        CartPage cartPage = addProductToCartForNewUser();

        cartPage.removeItem(PRODUCT_NAME)
                .waitForEmpty();

        Assert.assertTrue(cartPage.hasMessage("Item removed from cart"), "Remove confirmation message should be visible");
        Assert.assertTrue(cartPage.isEmpty(), "Cart should be empty after removing the only item");
    }

    @Test(priority = 3, description = "Validate cart summary values")
    public void testCartSummary() {
        CartPage cartPage = addProductToCartForNewUser()
                .increaseQuantity(PRODUCT_NAME, 2)
                .waitForItemTotal(PRODUCT_NAME, DOUBLE_PRICE)
                .waitForSummaryValue("Total Items", "2")
                .waitForSummaryValue("Subtotal", DOUBLE_PRICE)
                .waitForSummaryValue("Shipping", "FREE")
                .waitForSummaryValue("Total", DOUBLE_PRICE);

        Assert.assertTrue(cartPage.hasOrderSummary(), "Order summary controls should be visible");
        Assert.assertTrue(cartPage.hasItemUnitPrice(PRODUCT_NAME, SINGLE_PRICE), "Item unit price should be visible");
        Assert.assertTrue(cartPage.hasItemTotal(PRODUCT_NAME, DOUBLE_PRICE), "Item total should match quantity");
        Assert.assertTrue(cartPage.hasSummaryValue("Total Items", "2"), "Total item count should match cart quantity");
        Assert.assertTrue(cartPage.hasSummaryValue("Subtotal", DOUBLE_PRICE), "Subtotal should match cart total");
        Assert.assertTrue(cartPage.hasSummaryValue("Shipping", "FREE"), "Shipping should be free");
        Assert.assertTrue(cartPage.hasSummaryValue("Total", DOUBLE_PRICE), "Final total should match subtotal");
    }

    @Test(priority = 4, description = "Handle cart edge cases for empty cart, clear-cart popup, and zero quantity")
    public void testCartEdgeCases() {
        CartPage cartPage = registerAndLoginNewUser()
                .goToCart()
                .waitForEmpty();

        Assert.assertTrue(cartPage.isEmpty(), "New user cart should be empty");

        ProductListPage productListPage = cartPage.startShopping()
                .waitForProduct(PRODUCT_NAME);
        cartPage = addProductToCart(productListPage);

        String dismissedAlert = cartPage.dismissClearCartPopup();
        Assert.assertEquals(dismissedAlert, CLEAR_CART_CONFIRMATION, "Clear cart popup text should match");
        Assert.assertTrue(cartPage.isItemVisible(PRODUCT_NAME), "Dismissing clear cart popup should preserve cart item");

        String acceptedAlert = cartPage.acceptClearCartPopup();
        Assert.assertEquals(acceptedAlert, CLEAR_CART_CONFIRMATION, "Clear cart popup text should match");
        Assert.assertTrue(cartPage.isEmpty(), "Accepting clear cart popup should empty the cart");

        productListPage = cartPage.startShopping()
                .waitForProduct(PRODUCT_NAME);
        cartPage = addProductToCart(productListPage);

        cartPage.decreaseQuantity(PRODUCT_NAME, 0);
        Assert.assertTrue(cartPage.hasMessage("Item removed from cart"), "Quantity below one should remove the item");
        Assert.assertTrue(cartPage.isEmpty(), "Cart should be empty after decrementing the only item below one");
    }

    private CartPage addProductToCartForNewUser() {
        ProductListPage productListPage = registerAndLoginNewUser()
                .goToShop()
                .waitForProduct(PRODUCT_NAME);
        return addProductToCart(productListPage);
    }

    private CartPage addProductToCart(ProductListPage productListPage) {
        productListPage.openProduct(PRODUCT_NAME)
                .addToCart();
        return new DashboardPage(driver)
                .goToCart()
                .waitForItem(PRODUCT_NAME);
    }
}
