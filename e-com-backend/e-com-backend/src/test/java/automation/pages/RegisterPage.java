package com.infy.poc.e_com_backend.automation.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class RegisterPage extends BasePage {
    private final By heading = By.xpath("//h1[normalize-space()='Join Stride']");
    private final By nameInput = By.cssSelector("input[name='name']");
    private final By emailInput = By.cssSelector("input[name='email']");
    private final By passwordInput = By.cssSelector("input[name='password']");
    private final By createAccountButton = By.xpath("//button[normalize-space()='Create account' or contains(normalize-space(),'Creating')]");
    private final By signInLink = By.xpath("//span[contains(normalize-space(),'Sign in')]");

    public RegisterPage(WebDriver driver) {
        super(driver);
    }

    public RegisterPage open() {
        openPath("/registration");
        return waitUntilLoaded();
    }

    public RegisterPage waitUntilLoaded() {
        visible(heading);
        visible(nameInput);
        visible(emailInput);
        visible(passwordInput);
        return this;
    }

    public RegisterPage enterName(String name) {
        type(nameInput, name);
        return this;
    }

    public RegisterPage enterEmail(String email) {
        type(emailInput, email);
        return this;
    }

    public RegisterPage enterPassword(String password) {
        type(passwordInput, password);
        return this;
    }

    public RegisterPage submit() {
        click(createAccountButton);
        return this;
    }

    public RegisterPage register(String name, String email, String password) {
        return enterName(name)
                .enterEmail(email)
                .enterPassword(password)
                .submit();
    }

    public LoginPage clickSignIn() {
        click(signInLink);
        return new LoginPage(driver).waitUntilLoaded();
    }

    public boolean hasErrorMessage(String message) {
        return textIsVisible(message);
    }

    public boolean hasSuccessMessage() {
        return textIsVisible("Account created");
    }

    public boolean isLoaded() {
        return isVisible(heading) && isVisible(nameInput) && isVisible(emailInput) && isVisible(passwordInput);
    }
}
