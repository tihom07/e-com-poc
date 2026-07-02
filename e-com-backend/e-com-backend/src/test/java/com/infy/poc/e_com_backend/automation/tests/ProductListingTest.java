package com.infy.poc.e_com_backend.automation.tests;

import com.infy.poc.e_com_backend.automation.base.BaseTest;
import com.infy.poc.e_com_backend.automation.pages.DashboardPage;
import com.infy.poc.e_com_backend.automation.pages.ProductDetailPage;
import com.infy.poc.e_com_backend.automation.pages.ProductListPage;
import org.testng.Assert;
import org.testng.annotations.Test;

public class ProductListingTest extends BaseTest {
    private static final String PRODUCT_NAME = "Formal Oxford Black";
    private static final String PRODUCT_CATEGORY = "Formal";
    private static final String PRODUCT_PRICE = "Rs. 3,499.00";
    private static final String PRODUCT_STOCK = "18 in stock";
    private static final String INVALID_PRODUCT_NAME = "Product That Does Not Exist";
    private static final String BASKETBALL_PRODUCT_NAME = "Basketball High Top Pro";
    private static final String BASKETBALL_CATEGORY = "Basketball";

    @Test(priority = 1, description = "Day 38: automate product listing page and validate product visibility")
    public void testProductListingPageAndProductVisibility() {
        DashboardPage dashboardPage = registerAndLoginNewUser();

        Assert.assertTrue(dashboardPage.isLoaded(), "Dashboard navigation should be visible");
        Assert.assertTrue(dashboardPage.goToHome().isHomeHeroVisible(), "Home hero should be visible");

        ProductListPage productListPage = dashboardPage.goToShop()
                .waitForProduct(PRODUCT_NAME);

        Assert.assertTrue(productListPage.isLoaded(), "Product listing controls should be visible");
        Assert.assertTrue(productListPage.isProductVisible(PRODUCT_NAME), "Expected product should be visible");
        Assert.assertTrue(productListPage.hasProductCategory(PRODUCT_NAME, PRODUCT_CATEGORY), "Product category should match");
        Assert.assertTrue(productListPage.hasProductPrice(PRODUCT_NAME, PRODUCT_PRICE), "Product price should match");
        Assert.assertTrue(productListPage.hasStockText(PRODUCT_NAME, PRODUCT_STOCK), "Product stock text should match");
        productListPage.pauseForRecording();
    }

    @Test(priority = 2, description = "Validate product details show expected name, price, and availability")
    public void testProductDetailsNameAndPrice() {
        ProductDetailPage productDetailPage = registerAndLoginNewUser()
                .goToShop()
                .waitForProduct(PRODUCT_NAME)
                .openProduct(PRODUCT_NAME);

        Assert.assertTrue(productDetailPage.hasProductName(PRODUCT_NAME), "Product detail name should match");
        Assert.assertTrue(productDetailPage.hasPrice(PRODUCT_PRICE), "Product detail price should match");
        Assert.assertTrue(productDetailPage.hasAvailability("In Stock"), "Availability should be visible");
        Assert.assertTrue(productDetailPage.hasProductDescriptionTable(), "Product details table should be visible");

        productDetailPage.openSpecifications();
        Assert.assertTrue(productDetailPage.hasPrice(PRODUCT_PRICE), "Specifications should include the product price");
    }

    @Test(priority = 3, description = "Verify product navigation from listing to detail page and back")
    public void testProductNavigation() {
        ProductListPage productListPage = registerAndLoginNewUser()
                .goToShop()
                .waitForProduct(PRODUCT_NAME);

        ProductDetailPage productDetailPage = productListPage.openProduct(PRODUCT_NAME);
        Assert.assertTrue(productDetailPage.hasProductName(PRODUCT_NAME), "Product detail page should open");

        productListPage = productDetailPage.backToProducts()
                .waitForProduct(PRODUCT_NAME);
        Assert.assertTrue(productListPage.isProductVisible(PRODUCT_NAME), "Product list should be visible after returning");
    }

    @Test(priority = 4, description = "Validate search for invalid and valid product names")
    public void testSearchInvalidAndValidProduct() {
        ProductListPage productListPage = registerAndLoginNewUser()
                .goToShop()
                .waitForProduct(PRODUCT_NAME);

        productListPage.search(INVALID_PRODUCT_NAME)
                .waitForNoProductsFound();
        String invalidResultsSummary = productListPage.resultsSummary();
        Assert.assertTrue(invalidResultsSummary.contains("Showing 0 products"),
                "Invalid product search should show zero products");
        Assert.assertTrue(invalidResultsSummary.contains(INVALID_PRODUCT_NAME),
                "Invalid product search summary should include the searched product name");

        productListPage.search(PRODUCT_NAME)
                .waitForProduct(PRODUCT_NAME);
        String validResultsSummary = productListPage.resultsSummary();
        Assert.assertTrue(validResultsSummary.contains("Showing 1 product"),
                "Valid product search should show one matching product");
        Assert.assertTrue(validResultsSummary.contains(PRODUCT_NAME),
                "Valid product search summary should include the searched product name");
        Assert.assertTrue(productListPage.isProductVisible(PRODUCT_NAME),
                "Valid product search should show the matching product");
        Assert.assertTrue(productListPage.hasProductPrice(PRODUCT_NAME, PRODUCT_PRICE),
                "Valid product search should show the matching product price");
    }

    @Test(priority = 5, description = "Validate product listing category filters and All reset")
    public void testProductCategoryFilters() {
        ProductListPage productListPage = registerAndLoginNewUser()
                .goToShop()
                .waitForProduct(PRODUCT_NAME)
                .waitForProduct(BASKETBALL_PRODUCT_NAME);

        productListPage.selectCategoryFilter(PRODUCT_CATEGORY)
                .waitForProduct(PRODUCT_NAME)
                .waitForProductHidden(BASKETBALL_PRODUCT_NAME);
        Assert.assertTrue(productListPage.resultsSummary().contains("in \"" + PRODUCT_CATEGORY + "\""),
                "Formal filter should update the results summary");
        Assert.assertTrue(productListPage.hasProductCategory(PRODUCT_NAME, PRODUCT_CATEGORY),
                "Formal filter should show matching Formal products");

        productListPage.selectCategoryFilter(BASKETBALL_CATEGORY)
                .waitForProduct(BASKETBALL_PRODUCT_NAME)
                .waitForProductHidden(PRODUCT_NAME);
        Assert.assertTrue(productListPage.resultsSummary().contains("in \"" + BASKETBALL_CATEGORY + "\""),
                "Basketball filter should update the results summary");
        Assert.assertTrue(productListPage.hasProductCategory(BASKETBALL_PRODUCT_NAME, BASKETBALL_CATEGORY),
                "Basketball filter should show matching Basketball products");

        productListPage.selectAllFilter()
                .waitForProduct(PRODUCT_NAME)
                .waitForProduct(BASKETBALL_PRODUCT_NAME);
        Assert.assertFalse(productListPage.resultsSummary().contains(" in \""),
                "All filter should clear the category from the results summary");
        Assert.assertTrue(productListPage.isProductVisible(PRODUCT_NAME),
                "All filter should show Formal products again");
        Assert.assertTrue(productListPage.isProductVisible(BASKETBALL_PRODUCT_NAME),
                "All filter should show Basketball products again");
    }
}
