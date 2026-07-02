package com.infy.poc.e_com_backend.automation.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class CheckoutPage extends BasePage {
    private final By heading = By.xpath("//h2[normalize-space()='Checkout']");
    private final By fullNameInput = By.name("fullName");
    private final By phoneInput = By.name("phone");
    private final By addressLineInput = By.name("addressLine");
    private final By cityInput = By.name("city");
    private final By stateInput = By.name("state");
    private final By pincodeInput = By.name("pincode");
    private final By continueToPaymentButton = By.xpath("//button[contains(normalize-space(),'Continue to Payment')]");
    private final By paymentMethodHeading = By.xpath("//h3[contains(normalize-space(),'Payment Method')]");
    private final By cashOnDeliveryOption = By.xpath("//*[normalize-space()='Cash on Delivery']");
    private final By reviewOrderButton = By.xpath("//button[contains(normalize-space(),'Review Order')]");
    private final By reviewOrderHeading = By.xpath("//h3[contains(normalize-space(),'Review Your Order')]");
    private final By placeOrderButton = By.xpath("//button[contains(normalize-space(),'Place Order')]");

    public CheckoutPage(WebDriver driver) {
        super(driver);
    }

    public CheckoutPage waitUntilLoaded() {
        visible(heading);
        visible(fullNameInput);
        visible(continueToPaymentButton);
        return this;
    }

    public CheckoutPage enterDeliveryAddress(
            String fullName,
            String phone,
            String addressLine,
            String city,
            String state,
            String pincode
    ) {
        type(fullNameInput, fullName);
        type(phoneInput, phone);
        type(addressLineInput, addressLine);
        type(cityInput, city);
        type(stateInput, state);
        type(pincodeInput, pincode);
        return this;
    }

    public CheckoutPage submitDeliveryAddress() {
        click(continueToPaymentButton);
        return this;
    }

    public CheckoutPage continueToPayment() {
        submitDeliveryAddress();
        visible(paymentMethodHeading);
        return this;
    }

    public CheckoutPage selectCashOnDelivery() {
        click(cashOnDeliveryOption);
        return this;
    }

    public CheckoutPage continueToReview() {
        click(reviewOrderButton);
        visible(reviewOrderHeading);
        return this;
    }

    public OrderSuccessPage placeOrder() {
        click(placeOrderButton);
        return new OrderSuccessPage(driver).waitUntilLoaded();
    }

    public boolean hasErrorMessage(String message) {
        return textIsVisible(message);
    }

    public boolean isDeliveryAddressStepVisible() {
        return isVisible(fullNameInput)
                && isVisible(phoneInput)
                && isVisible(pincodeInput)
                && isVisible(continueToPaymentButton);
    }

    public boolean hasReviewProduct(String productName) {
        return isVisible(By.xpath("//span[normalize-space()='" + productName + "']"));
    }
}
