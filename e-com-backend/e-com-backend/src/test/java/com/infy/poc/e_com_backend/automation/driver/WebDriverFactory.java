package com.infy.poc.e_com_backend.automation.driver;

import com.infy.poc.e_com_backend.automation.config.TestConfig;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;

public final class WebDriverFactory {
    private WebDriverFactory() {
    }

    public static WebDriver createChromeDriver() {
        String chromeDriverPath = TestConfig.chromeDriverPath();
        if (chromeDriverPath != null && !chromeDriverPath.isBlank()) {
            System.setProperty("webdriver.chrome.driver", chromeDriverPath);
        }

        ChromeOptions options = new ChromeOptions();
        options.addArguments("--disable-notifications");
        options.addArguments("--remote-allow-origins=*");

        if (TestConfig.headless()) {
            options.addArguments("--headless=new");
            options.addArguments("--window-size=1440,900");
        }

        return new ChromeDriver(options);
    }
}
