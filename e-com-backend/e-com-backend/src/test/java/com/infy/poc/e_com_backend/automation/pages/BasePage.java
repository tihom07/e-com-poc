package com.infy.poc.e_com_backend.automation.pages;

import com.infy.poc.e_com_backend.automation.config.TestConfig;
import org.openqa.selenium.By;
import org.openqa.selenium.TimeoutException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public abstract class BasePage {
    protected final WebDriver driver;
    protected final WebDriverWait wait;

    protected BasePage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, TestConfig.explicitWait());
    }

    protected void openPath(String path) {
        driver.get(TestConfig.baseUrl() + path);
    }

    protected WebElement visible(By locator) {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(locator));
    }

    protected WebElement clickable(By locator) {
        return wait.until(ExpectedConditions.elementToBeClickable(locator));
    }

    protected void click(By locator) {
        clickable(locator).click();
    }

    protected void type(By locator, String value) {
        WebElement element = visible(locator);
        element.clear();
        element.sendKeys(value);
    }

    protected boolean isVisible(By locator) {
        try {
            visible(locator);
            return true;
        } catch (TimeoutException exception) {
            return false;
        }
    }

    protected boolean textIsVisible(String text) {
        return isVisible(By.xpath("//*[contains(normalize-space(),'" + text + "')]"));
    }
}
