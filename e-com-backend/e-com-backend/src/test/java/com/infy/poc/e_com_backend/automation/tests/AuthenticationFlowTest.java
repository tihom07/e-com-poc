package com.infy.poc.e_com_backend.automation.tests;

import com.infy.poc.e_com_backend.automation.base.BaseTest;
import com.infy.poc.e_com_backend.automation.pages.DashboardPage;
import com.infy.poc.e_com_backend.automation.pages.LoginPage;
import com.infy.poc.e_com_backend.automation.pages.RegisterPage;
import org.testng.Assert;
import org.testng.annotations.Test;

public class AuthenticationFlowTest extends BaseTest {

    @Test(priority = 1, description = "Validate registration input field error messages")
    public void testRegistrationFieldValidation() {
        RegisterPage registerPage = new RegisterPage(driver).open();
        
        // 1. Submit empty form
        registerPage.submit();
        Assert.assertTrue(registerPage.hasErrorMessage("Name is required"), "Name required validation failed");
        Assert.assertTrue(registerPage.hasErrorMessage("Email is required"), "Email required validation failed");
        Assert.assertTrue(registerPage.hasErrorMessage("Password is required"), "Password required validation failed");

        // 2. Submit invalid email format
        registerPage.enterName("QA User");
        registerPage.enterEmail("invalid@email");
        registerPage.enterPassword("validPassword123");
        registerPage.submit();
        Assert.assertTrue(registerPage.hasErrorMessage("Enter a valid email"), "Invalid email validation failed");

        // 3. Submit short password
        registerPage.enterEmail("qauser@example.com");
        registerPage.enterPassword("123");
        registerPage.submit();
        Assert.assertTrue(registerPage.hasErrorMessage("Minimum 6 characters"), "Short password validation failed");
    }

    @Test(priority = 2, description = "Validate login input field error messages")
    public void testLoginFieldValidation() {
        LoginPage loginPage = new LoginPage(driver).open();

        // 1. Submit empty form
        loginPage.submit();
        Assert.assertTrue(loginPage.hasErrorMessage("Email is required"), "Email required validation failed");
        Assert.assertTrue(loginPage.hasErrorMessage("Password is required"), "Password required validation failed");

        // 2. Submit invalid email format
        loginPage.enterEmail("invalid@email");
        loginPage.enterPassword("password123");
        loginPage.submit();
        Assert.assertTrue(loginPage.hasErrorMessage("Enter a valid email"), "Invalid email format validation failed");
    }

    @Test(priority = 3, description = "Verify registration success, invalid login attempt, valid login attempt, and logout")
    public void testCompleteAuthenticationFlow() {
        // Step 1: Register a new user
        RegisterPage registerPage = new RegisterPage(driver).open();
        String name = "Automation User";
        String email = uniqueEmail();
        String password = "securePassword123";

        registerPage.register(name, email, password);
        Assert.assertTrue(registerPage.hasSuccessMessage(), "Success message 'Account created' should be visible");

        // Step 2: Navigate to Login (React app has a setTimeout, so direct navigation is cleaner and faster)
        LoginPage loginPage = new LoginPage(driver).open();

        // Step 3: Attempt login with invalid password
        loginPage.login(email, "wrongPassword");
        Assert.assertTrue(loginPage.hasErrorMessage("Invalid email or password"), "Invalid credentials error message validation failed");

        // Step 4: Login with valid credentials
        loginPage.login(email, password);

        // Step 5: Verify dashboard loaded
        DashboardPage dashboardPage = new DashboardPage(driver).waitUntilLoaded();
        Assert.assertTrue(dashboardPage.isLoaded(), "Dashboard should be fully loaded");

        // Step 6: Sign out and verify return to login
        loginPage = dashboardPage.signOut();
        Assert.assertTrue(loginPage.isLoaded(), "Should be redirected back to the login page after sign out");
    }
}
