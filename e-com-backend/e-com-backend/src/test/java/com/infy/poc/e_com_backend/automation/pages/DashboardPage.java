package com.infy.poc.e_com_backend.automation.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class DashboardPage extends BasePage {
    private final By brand = By.xpath("//*[normalize-space()='STRIDE']");
    private final By homeNav = By.xpath("//button[normalize-space()='Home']");
    private final By shopNav = By.xpath("//button[normalize-space()='Shop']");
    private final By ordersNav = By.xpath("//button[normalize-space()='Orders']");
    private final By cartNav = By.xpath("//button[normalize-space()='Cart']");
    private final By signOutButton = By.xpath("//button[normalize-space()='Sign out']");
    private final By homeHero = By.xpath("//h1[contains(normalize-space(),'Footwear for')]");

    public DashboardPage(WebDriver driver) {
        super(driver);
    }

    public DashboardPage waitUntilLoaded() {
        visible(brand);
        visible(homeNav);
        visible(shopNav);
        visible(ordersNav);
        visible(cartNav);
        visible(signOutButton);
        return this;
    }

    public boolean isLoaded() {
        return isVisible(brand)
                && isVisible(homeNav)
                && isVisible(shopNav)
                && isVisible(ordersNav)
                && isVisible(cartNav)
                && isVisible(signOutButton);
    }

    public DashboardPage goToHome() {
        click(homeNav);
        visible(homeHero);
        return this;
    }

    public ProductListPage goToShop() {
        click(shopNav);
        return new ProductListPage(driver).waitUntilLoaded();
    }

    public CartPage goToCart() {
        click(cartNav);
        return new CartPage(driver).waitUntilLoaded();
    }

    public OrderHistoryPage goToOrders() {
        click(ordersNav);
        return new OrderHistoryPage(driver).waitUntilLoaded();
    }

    public boolean isHomeHeroVisible() {
        return isVisible(homeHero);
    }

    public LoginPage signOut() {
        click(signOutButton);
        return new LoginPage(driver).waitUntilLoaded();
    }
}
