package com.infy.poc.e_com_backend.automation.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class OrderHistoryPage extends BasePage {
    private final By heading = By.xpath("//h2[contains(normalize-space(),'My Orders')]");
    private final By cancelOrderButton = By.xpath("(//button[normalize-space()='Cancel Order'])[1]");

    public OrderHistoryPage(WebDriver driver) {
        super(driver);
    }

    public OrderHistoryPage waitUntilLoaded() {
        visible(heading);
        return this;
    }

    public OrderHistoryPage waitForOrderWithProduct(String productName) {
        visible(productNameLocator(productName));
        return this;
    }

    public OrderHistoryPage cancelFirstOrder() {
        click(cancelOrderButton);
        acceptAlert();
        visible(By.xpath("//span[normalize-space()='CANCELLED']"));
        return this;
    }

    public boolean hasOrderWithProduct(String productName) {
        return isVisible(productNameLocator(productName));
    }

    public boolean hasStatus(String status) {
        return isVisible(By.xpath("//span[normalize-space()='" + status + "']"));
    }

    private By productNameLocator(String productName) {
        return By.xpath("//p[normalize-space()='" + productName + "']");
    }
}
