package com.infy.poc.e_com_backend.automation.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;

public class ProductListPage extends BasePage {
    private final By heading = By.xpath("//h2[normalize-space()='Products']");
    private final By searchInput = By.cssSelector("input[placeholder='Search products by name...']");
    private final By allFilter = By.xpath("//button[normalize-space()='All']");
    private final By resultsText = By.xpath("//p[contains(normalize-space(),'Showing') and contains(normalize-space(),'product')]");
    private final By emptyProductsText = By.xpath("//p[contains(normalize-space(),'No products found.')]");

    public ProductListPage(WebDriver driver) {
        super(driver);
    }

    public ProductListPage waitUntilLoaded() {
        visible(heading);
        visible(searchInput);
        visible(allFilter);
        visible(resultsText);
        return this;
    }

    public ProductListPage waitForProduct(String productName) {
        visible(productNameLocator(productName));
        return this;
    }

    public ProductListPage waitForNoProductsFound() {
        visible(emptyProductsText);
        return this;
    }

    public ProductDetailPage openProduct(String productName) {
        click(productNameLocator(productName));
        return new ProductDetailPage(driver).waitUntilLoaded(productName);
    }

    public String dismissDeleteConfirmation(String productName) {
        click(deleteButton(productName));
        return dismissAlert();
    }

    public String acceptDeleteConfirmation(String productName) {
        click(deleteButton(productName));
        return acceptAlert();
    }

    public ProductListPage search(String query) {
        type(searchInput, query);
        waitForText(resultsText, query);
        return this;
    }

    public ProductListPage selectCategoryFilter(String category) {
        click(categoryFilter(category));
        waitForText(resultsText, "in \"" + category + "\"");
        return this;
    }

    public ProductListPage selectAllFilter() {
        click(allFilter);
        wait.until(ExpectedConditions.not(
                ExpectedConditions.textToBePresentInElementLocated(resultsText, " in \"")
        ));
        return this;
    }

    public ProductListPage waitForProductHidden(String productName) {
        wait.until(ExpectedConditions.invisibilityOfElementLocated(productNameLocator(productName)));
        return this;
    }

    public boolean isLoaded() {
        return isVisible(heading) && isVisible(searchInput) && isVisible(allFilter);
    }

    public boolean isProductVisible(String productName) {
        return isVisible(productNameLocator(productName));
    }

    public String resultsSummary() {
        return visible(resultsText).getText();
    }

    public boolean hasProductPrice(String productName, String expectedPrice) {
        return isVisible(By.xpath("//h3[normalize-space()='" + productName + "']/parent::div"
                + "//span[normalize-space()='" + expectedPrice + "']"));
    }

    public boolean hasProductCategory(String productName, String expectedCategory) {
        return isVisible(By.xpath("//h3[normalize-space()='" + productName + "']/parent::div"
                + "//span[normalize-space()='" + expectedCategory + "']"));
    }

    public boolean hasStockText(String productName, String expectedStockText) {
        return isVisible(By.xpath("//h3[normalize-space()='" + productName + "']/parent::div"
                + "//p[normalize-space()='" + expectedStockText + "']"));
    }

    private By productNameLocator(String productName) {
        return By.xpath("//h3[normalize-space()='" + productName + "']");
    }

    private By categoryFilter(String category) {
        return By.xpath("//button[normalize-space()='" + category + "']");
    }

    private By deleteButton(String productName) {
        return By.xpath("//h3[normalize-space()='" + productName + "']/parent::div"
                + "//button[normalize-space()='Delete']");
    }
}
