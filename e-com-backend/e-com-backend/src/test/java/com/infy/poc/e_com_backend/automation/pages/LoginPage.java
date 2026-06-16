package com.infy.poc.e_com_backend.automation.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class LoginPage extends BasePage {
    private final By heading = By.xpath("//h1[normalize-space()='Sign in to Stride']");
    private final By emailInput = By.cssSelector("input[name='email']");
    private final By passwordInput = By.cssSelector("input[name='password']");
    private final By signInButton = By.xpath("//button[contains(normalize-space(),'Sign in') or contains(normalize-space(),'Signing in')]");
    private final By createAccountLink = By.xpath("//span[contains(normalize-space(),'Create account')]");

    public LoginPage(WebDriver driver) {
        super(driver);
    }

    public LoginPage open() {
        openPath("/login");
        return waitUntilLoaded();
    }

    public LoginPage waitUntilLoaded() {
        visible(heading);
        visible(emailInput);
        visible(passwordInput);
        return this;
    }

    public RegisterPage clickCreateAccount() {
        click(createAccountLink);
        return new RegisterPage(driver).waitUntilLoaded();
    }

    public LoginPage enterEmail(String email) {
        type(emailInput, email);
        return this;
    }

    public LoginPage enterPassword(String password) {
        type(passwordInput, password);
        return this;
    }

    public LoginPage submit() {
        click(signInButton);
        return this;
    }

    public LoginPage login(String email, String password) {
        return enterEmail(email)
                .enterPassword(password)
                .submit();
    }

    public boolean hasErrorMessage(String message) {
        return textIsVisible(message);
    }

    public boolean isLoaded() {
        return isVisible(heading) && isVisible(emailInput) && isVisible(passwordInput);
    }
}
