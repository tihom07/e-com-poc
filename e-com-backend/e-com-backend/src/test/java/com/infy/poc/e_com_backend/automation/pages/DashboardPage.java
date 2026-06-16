package com.infy.poc.e_com_backend.automation.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class DashboardPage extends BasePage {
    private final By brand = By.xpath("//*[normalize-space()='STRIDE']");
    private final By homeNav = By.xpath("//button[normalize-space()='Home']");
    private final By shopNav = By.xpath("//button[normalize-space()='Shop']");
    private final By cartNav = By.xpath("//button[normalize-space()='Cart']");
    private final By signOutButton = By.xpath("//button[normalize-space()='Sign out']");

    public DashboardPage(WebDriver driver) {
        super(driver);
    }

    public DashboardPage waitUntilLoaded() {
        visible(brand);
        visible(homeNav);
        visible(shopNav);
        visible(cartNav);
        visible(signOutButton);
        return this;
    }

    public boolean isLoaded() {
        return isVisible(brand)
                && isVisible(homeNav)
                && isVisible(shopNav)
                && isVisible(cartNav)
                && isVisible(signOutButton);
    }

    public LoginPage signOut() {
        click(signOutButton);
        return new LoginPage(driver).waitUntilLoaded();
    }
}
