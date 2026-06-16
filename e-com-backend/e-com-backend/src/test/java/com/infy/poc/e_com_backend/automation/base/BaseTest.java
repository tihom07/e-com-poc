package com.infy.poc.e_com_backend.automation.base;

import com.infy.poc.e_com_backend.automation.config.TestConfig;
import com.infy.poc.e_com_backend.automation.driver.WebDriverFactory;
import java.time.Duration;
import org.openqa.selenium.WebDriver;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;

public abstract class BaseTest {
    protected WebDriver driver;

    @BeforeMethod(alwaysRun = true)
    public void setUp() {
        driver = WebDriverFactory.createChromeDriver();
        driver.manage().timeouts().implicitlyWait(Duration.ZERO);
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
        return "qauser" + System.currentTimeMillis() + "@example.com";
    }
}
