package com.infy.poc.e_com_backend.automation.data;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Instant;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicLong;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;

public final class ExcelTestDataReader {
    private static final String DEFAULT_DATA_FILE = "testdata/auth-test-data.xlsx";
    private static final AtomicLong UNIQUE_COUNTER = new AtomicLong(Instant.now().toEpochMilli());

    private ExcelTestDataReader() {
    }

    public static Object[][] dataProvider(String sheetName) {
        List<AuthTestData> rows = readRunnableRows(sheetName);
        Object[][] data = new Object[rows.size()][1];
        for (int index = 0; index < rows.size(); index++) {
            data[index][0] = rows.get(index);
        }
        return data;
    }

    public static AuthTestData defaultRegistrationUser() {
        return runnableRowByCaseId("Registration", "REG_VALID_USER");
    }

    public static AuthTestData runnableRowByCaseId(String sheetName, String caseId) {
        return readRunnableRows(sheetName).stream()
                .filter(row -> caseId.equals(row.caseId()))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException(
                        "No runnable row found in sheet '" + sheetName + "' for case id '" + caseId + "'"));
    }

    private static List<AuthTestData> readRunnableRows(String sheetName) {
        try (InputStream inputStream = openWorkbook();
             Workbook workbook = WorkbookFactory.create(inputStream)) {
            Sheet sheet = workbook.getSheet(sheetName);
            if (sheet == null) {
                throw new IllegalArgumentException("Sheet not found in auth test data workbook: " + sheetName);
            }

            List<String> headers = readHeaders(sheet);
            List<AuthTestData> rows = new ArrayList<>();
            DataFormatter formatter = new DataFormatter();

            for (int rowIndex = 1; rowIndex <= sheet.getLastRowNum(); rowIndex++) {
                Row row = sheet.getRow(rowIndex);
                if (row == null) {
                    continue;
                }

                Map<String, String> values = readRow(headers, row, formatter);
                if (!"Y".equalsIgnoreCase(values.getOrDefault("Run", ""))) {
                    continue;
                }

                rows.add(new AuthTestData(
                        sheetName,
                        row.getRowNum() + 1,
                        resolveDynamicTokens(values)
                ));
            }

            return rows;
        } catch (IOException exception) {
            throw new IllegalStateException("Unable to read auth test data workbook", exception);
        }
    }

    private static List<String> readHeaders(Sheet sheet) {
        Row headerRow = sheet.getRow(0);
        if (headerRow == null) {
            throw new IllegalArgumentException("Missing header row in sheet: " + sheet.getSheetName());
        }

        DataFormatter formatter = new DataFormatter();
        List<String> headers = new ArrayList<>();
        for (int cellIndex = 0; cellIndex < headerRow.getLastCellNum(); cellIndex++) {
            headers.add(formatter.formatCellValue(headerRow.getCell(cellIndex)).trim());
        }
        return headers;
    }

    private static Map<String, String> readRow(List<String> headers, Row row, DataFormatter formatter) {
        Map<String, String> values = new LinkedHashMap<>();
        for (int cellIndex = 0; cellIndex < headers.size(); cellIndex++) {
            values.put(headers.get(cellIndex), formatter.formatCellValue(row.getCell(cellIndex)).trim());
        }
        return values;
    }

    private static Map<String, String> resolveDynamicTokens(Map<String, String> values) {
        String uniqueValue = String.valueOf(UNIQUE_COUNTER.incrementAndGet());
        Map<String, String> resolvedValues = new LinkedHashMap<>();
        for (Map.Entry<String, String> entry : values.entrySet()) {
            resolvedValues.put(entry.getKey(), entry.getValue().replace("${unique}", uniqueValue));
        }
        return resolvedValues;
    }

    private static InputStream openWorkbook() throws IOException {
        String overridePath = System.getProperty("test.data.file", "").trim();
        if (!overridePath.isBlank()) {
            return Files.newInputStream(Path.of(overridePath));
        }

        InputStream classpathStream = Thread.currentThread()
                .getContextClassLoader()
                .getResourceAsStream(DEFAULT_DATA_FILE);
        if (classpathStream != null) {
            return classpathStream;
        }

        return Files.newInputStream(Path.of("src", "test", "resources", DEFAULT_DATA_FILE));
    }
}
