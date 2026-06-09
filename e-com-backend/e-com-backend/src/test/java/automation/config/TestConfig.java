package com.infy.poc.e_com_backend.automation.config;

import java.time.Duration;

public final class TestConfig {
    private TestConfig() {
    }

    public static String baseUrl() {
        return System.getProperty("base.url", "http://localhost:5173");
    }

    public static boolean headless() {
        return Boolean.parseBoolean(System.getProperty("headless", "false"));
    }

    public static String chromeDriverPath() {
        return System.getProperty("chrome.driver.path", "");
    }

    public static Duration explicitWait() {
        String seconds = System.getProperty("explicit.wait.seconds", "15");
        return Duration.ofSeconds(Long.parseLong(seconds));
    }
}
