package com.infy.poc.e_com_backend.automation.data;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

public class AuthTestData {
    private final String sheetName;
    private final int rowNumber;
    private final Map<String, String> values;

    public AuthTestData(String sheetName, int rowNumber, Map<String, String> values) {
        this.sheetName = sheetName;
        this.rowNumber = rowNumber;
        this.values = values;
    }

    public String value(String columnName) {
        return values.getOrDefault(columnName, "");
    }

    public String caseId() {
        return value("CaseId");
    }

    public boolean expectsSuccess() {
        return "SUCCESS".equalsIgnoreCase(value("ExpectedOutcome"));
    }

    public boolean shouldSetupUser() {
        String setupUser = value("SetupUser");
        return "Y".equalsIgnoreCase(setupUser) || "TRUE".equalsIgnoreCase(setupUser);
    }

    public List<String> expectedMessages() {
        String messages = value("ExpectedMessages");
        if (messages.isBlank()) {
            return List.of();
        }

        return Arrays.stream(messages.split("\\|"))
                .map(String::trim)
                .filter(message -> !message.isBlank())
                .toList();
    }

    @Override
    public String toString() {
        return sheetName + " row " + rowNumber + " - " + caseId();
    }
}
