import { gql } from "@apollo/client";

// Note: These queries assume backend support for analytics.
// If the backend doesn't have analytics functionality yet, these will need
// to be implemented on the backend first.

export const GET_SALES_ANALYTICS = gql`
  query GetSalesAnalytics($startDate: String, $endDate: String, $groupBy: String) {
    salesAnalytics(startDate: $startDate, endDate: $endDate, groupBy: $groupBy) {
      period
      totalSales
      orderCount
      averageOrderValue
    }
  }
`;

export const GET_REVENUE_ANALYTICS = gql`
  query GetRevenueAnalytics($startDate: String, $endDate: String, $groupBy: String) {
    revenueAnalytics(startDate: $startDate, endDate: $endDate, groupBy: $groupBy) {
      period
      totalRevenue
      orderCount
      averageOrderValue
    }
  }
`;

export const GET_DASHBOARD_STATS = gql`
  query GetDashboardStats {
    dashboardStats {
      totalRevenue
      totalSales
      totalOrders
      totalProducts
      revenueGrowth
      salesGrowth
      orderGrowth
    }
  }
`;

export const GET_TOP_PRODUCTS = gql`
  query GetTopProducts($limit: Int) {
    topProducts(limit: $limit) {
      product {
        id
        name
        designImageURL
        basePrice
      }
      totalSold
      totalRevenue
    }
  }
`;

export const GET_INVENTORY_ALERTS = gql`
  query GetInventoryAlerts($threshold: Int) {
    inventoryAlerts(threshold: $threshold) {
      variant {
        id
        sku
        size
        color
        product {
          id
          name
        }
      }
      stockQuantity
      reservedQuantity
      availableQuantity
    }
  }
`;
