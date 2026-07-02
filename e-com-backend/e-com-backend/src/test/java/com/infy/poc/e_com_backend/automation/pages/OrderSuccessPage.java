package com.infy.poc.e_com_backend.automation.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class OrderSuccessPage extends BasePage {
    private final By orderConfirmedText = By.xpath("//p[normalize-space()='Order confirmed']");
    private final By orderNumberText = By.xpath("//p[contains(normalize-space(),'Order #')]");
    private final By myOrdersButton = By.xpath("//button[normalize-space()='My Orders']");

    public OrderSuccessPage(WebDriver driver) {
        super(driver);
    }

    public OrderSuccessPage waitUntilLoaded() {
        visible(orderConfirmedText);
        visible(orderNumberText);
        visible(myOrdersButton);
        return this;
    }

    public boolean hasOrderConfirmation() {
        return isVisible(orderConfirmedText) && isVisible(orderNumberText);
    }

    public OrderHistoryPage goToOrders() {
        click(myOrdersButton);
        return new OrderHistoryPage(driver).waitUntilLoaded();
    }
}
