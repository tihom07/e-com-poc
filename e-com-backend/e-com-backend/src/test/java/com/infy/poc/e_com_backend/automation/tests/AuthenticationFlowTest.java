package com.infy.poc.e_com_backend.automation.tests;

import com.infy.poc.e_com_backend.automation.base.BaseTest;
import com.infy.poc.e_com_backend.automation.data.AuthTestData;
import com.infy.poc.e_com_backend.automation.data.ExcelTestDataReader;
import com.infy.poc.e_com_backend.automation.pages.DashboardPage;
import com.infy.poc.e_com_backend.automation.pages.LoginPage;
import com.infy.poc.e_com_backend.automation.pages.RegisterPage;
import org.testng.Assert;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

public class AuthenticationFlowTest extends BaseTest {

    @DataProvider(name = "registrationData")
    public Object[][] registrationData() {
        return ExcelTestDataReader.dataProvider("Registration");
    }

    @DataProvider(name = "loginData")
    public Object[][] loginData() {
        return ExcelTestDataReader.dataProvider("Login");
    }

    @Test(
            priority = 1,
            dataProvider = "registrationData",
            description = "Validate registration module using Excel test data"
    )
    public void testRegistrationWithExcelData(AuthTestData testData) {
        RegisterPage registerPage = new RegisterPage(driver)
                .open()
                .register(
                        testData.value("Name"),
                        testData.value("Email"),
                        testData.value("Password")
                );

        for (String expectedMessage : testData.expectedMessages()) {
            Assert.assertTrue(registerPage.hasMessage(expectedMessage),
                    testData.caseId() + " should show message: " + expectedMessage);
        }
    }

    @Test(
            priority = 2,
            dataProvider = "loginData",
            description = "Validate login module using Excel test data"
    )
    public void testLoginWithExcelData(AuthTestData testData) {
        if (testData.shouldSetupUser()) {
            registerUserForLogin(testData);
        }

        LoginPage loginPage = new LoginPage(driver)
                .open()
                .login(
                        testData.value("LoginEmail"),
                        testData.value("LoginPassword")
                );

        if (testData.expectsSuccess()) {
            DashboardPage dashboardPage = new DashboardPage(driver).waitUntilLoaded();
            Assert.assertTrue(dashboardPage.isLoaded(),
                    testData.caseId() + " should load the user dashboard");

            loginPage = dashboardPage.signOut();
            Assert.assertTrue(loginPage.isLoaded(),
                    testData.caseId() + " should return to login after sign out");
            return;
        }

        for (String expectedMessage : testData.expectedMessages()) {
            Assert.assertTrue(loginPage.hasMessage(expectedMessage),
                    testData.caseId() + " should show message: " + expectedMessage);
        }
    }

    private void registerUserForLogin(AuthTestData testData) {
        new RegisterPage(driver)
                .open()
                .register(
                        testData.value("Name"),
                        testData.value("Email"),
                        testData.value("RegistrationPassword")
                )
                .waitForSuccess();
    }
}
