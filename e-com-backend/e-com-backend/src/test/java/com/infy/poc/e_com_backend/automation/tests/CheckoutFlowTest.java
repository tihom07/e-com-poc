package com.infy.poc.e_com_backend.automation.tests;

import com.infy.poc.e_com_backend.automation.base.BaseTest;
import com.infy.poc.e_com_backend.automation.pages.CartPage;
import com.infy.poc.e_com_backend.automation.pages.CheckoutPage;
import com.infy.poc.e_com_backend.automation.pages.DashboardPage;
import com.infy.poc.e_com_backend.automation.pages.OrderHistoryPage;
import com.infy.poc.e_com_backend.automation.pages.OrderSuccessPage;
import com.infy.poc.e_com_backend.automation.pages.ProductListPage;
import org.testng.Assert;
import org.testng.annotations.Test;

public class CheckoutFlowTest extends BaseTest {
    private static final String PRODUCT_NAME = "Casual Canvas Classic";
    private static final String FULL_NAME = "Automation User";
    private static final String VALID_PHONE = "9876543210";
    private static final String INVALID_PHONE = "987654321012";
    private static final String ADDRESS_LINE = "221B Test Street";
    private static final String CITY = "Bengaluru";
    private static final String STATE = "Karnataka";
    private static final String VALID_PINCODE = "560001";
    private static final String INVALID_PINCODE = "5600017";

    @Test(priority = 1, description = "Validate checkout delivery form rejects invalid pincode and phone number")
    public void testCheckoutFormValidationForInvalidPhoneAndPincode() {
        CheckoutPage checkoutPage = addProductToCartForNewUser()
                .proceedToCheckout()
                .enterDeliveryAddress(
                        FULL_NAME,
                        INVALID_PHONE,
                        ADDRESS_LINE,
                        CITY,
                        STATE,
                        INVALID_PINCODE
                )
                .submitDeliveryAddress();

        Assert.assertTrue(checkoutPage.hasErrorMessage("Enter valid 10 digit phone number"),
                "Phone number greater than 11 digits should be invalid");
        Assert.assertTrue(checkoutPage.hasErrorMessage("Enter valid 6 digit pincode"),
                "Pincode greater than 6 digits should be invalid");
        Assert.assertTrue(checkoutPage.isDeliveryAddressStepVisible(),
                "Invalid delivery details should keep checkout on the address step");
    }

    @Test(priority = 2, description = "Automate checkout initiation and verify placed order appears in Orders")
    public void testCheckoutInitiationAndOrderVisibleInOrders() {
        CheckoutPage checkoutPage = addProductToCartForNewUser()
                .proceedToCheckout()
                .enterDeliveryAddress(
                        FULL_NAME,
                        VALID_PHONE,
                        ADDRESS_LINE,
                        CITY,
                        STATE,
                        VALID_PINCODE
                )
                .continueToPayment()
                .selectCashOnDelivery()
                .continueToReview();

        Assert.assertTrue(checkoutPage.hasReviewProduct(PRODUCT_NAME),
                "Review step should show the checkout product");

        OrderSuccessPage orderSuccessPage = checkoutPage.placeOrder();
        Assert.assertTrue(orderSuccessPage.hasOrderConfirmation(), "Order confirmation should be visible");

        OrderHistoryPage orderHistoryPage = orderSuccessPage.goToOrders()
                .waitForOrderWithProduct(PRODUCT_NAME);
        Assert.assertTrue(orderHistoryPage.hasOrderWithProduct(PRODUCT_NAME),
                "Placed product should appear in order history");
        Assert.assertTrue(orderHistoryPage.hasStatus("CONFIRMED"),
                "Newly placed order should be confirmed in order history");

        orderHistoryPage.cancelFirstOrder();
        Assert.assertTrue(orderHistoryPage.hasStatus("CANCELLED"),
                "Cleanup should cancel the order and restore stock");
    }

    private CartPage addProductToCartForNewUser() {
        ProductListPage productListPage = registerAndLoginNewUser()
                .goToShop()
                .search(PRODUCT_NAME)
                .waitForProduct(PRODUCT_NAME);

        productListPage.openProduct(PRODUCT_NAME)
                .addToCart();

        return new DashboardPage(driver)
                .goToCart()
                .waitForItem(PRODUCT_NAME);
    }
}
