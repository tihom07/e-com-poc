package com.infy.poc.e_com_backend.automation.base;

import com.infy.poc.e_com_backend.automation.config.TestConfig;
import com.infy.poc.e_com_backend.automation.driver.WebDriverFactory;
import com.infy.poc.e_com_backend.automation.pages.DashboardPage;
import com.infy.poc.e_com_backend.automation.pages.LoginPage;
import com.infy.poc.e_com_backend.automation.pages.RegisterPage;
import org.openqa.selenium.WebDriver;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;

public abstract class BaseTest {
    protected WebDriver driver;

    @BeforeMethod(alwaysRun = true)
    public void setUp() {
        driver = WebDriverFactory.createChromeDriver();
        driver.manage().timeouts().implicitlyWait(TestConfig.implicitWait());
        if (!TestConfig.headless()) {
            driver.manage().window().maximize();
        }
    }

    @AfterMethod(alwaysRun = true)
    public void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }

    protected String uniqueEmail() {
        return "qaxuser" + System.currentTimeMillis() + "@example.com";
    }

    protected DashboardPage registerAndLoginNewUser() {
        String name = "Automation User";
        String email = uniqueEmail();
        String password = "securePassword123";

        new RegisterPage(driver)
                .open()
                .register(name, email, password)
                .waitForSuccess();

        new LoginPage(driver)
                .open()
                .login(email, password);

        return new DashboardPage(driver).waitUntilLoaded();
    }
}
