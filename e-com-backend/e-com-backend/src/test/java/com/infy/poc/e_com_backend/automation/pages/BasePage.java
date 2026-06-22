package com.infy.poc.e_com_backend.automation.pages;

import com.infy.poc.e_com_backend.automation.config.TestConfig;
import java.time.Duration;
import org.openqa.selenium.Alert;
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
        pauseBetweenActions();
    }

    protected WebElement visible(By locator) {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(locator));
    }

    protected WebElement clickable(By locator) {
        return wait.until(ExpectedConditions.elementToBeClickable(locator));
    }

    protected void waitForUrlContaining(String path) {
        wait.until(ExpectedConditions.urlContains(path));
    }

    protected void waitForText(By locator, String text) {
        wait.until(ExpectedConditions.textToBePresentInElementLocated(locator, text));
    }

    protected void click(By locator) {
        clickable(locator).click();
        pauseBetweenActions();
    }

    protected void type(By locator, String value) {
        WebElement element = visible(locator);
        element.clear();
        element.sendKeys(value);
        pauseBetweenActions();
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

    public void pauseForRecording() {
        pauseBetweenActions();
    }

    protected Alert waitForAlert() {
        return wait.until(ExpectedConditions.alertIsPresent());
    }

    protected String acceptAlert() {
        Alert alert = waitForAlert();
        String text = alert.getText();
        alert.accept();
        pauseBetweenActions();
        return text;
    }

    protected String dismissAlert() {
        Alert alert = waitForAlert();
        String text = alert.getText();
        alert.dismiss();
        pauseBetweenActions();
        return text;
    }

    protected boolean isAlertPresent() {
        try {
            waitForAlert();
            return true;
        } catch (TimeoutException exception) {
            return false;
        }
    }

    protected void pauseBetweenActions() {
        Duration actionDelay = TestConfig.actionDelay();
        if (actionDelay.isZero() || actionDelay.isNegative()) {
            return;
        }

        try {
            Thread.sleep(actionDelay.toMillis());
        } catch (InterruptedException exception) {
            Thread.currentThread().interrupt();
        }
    }
}
