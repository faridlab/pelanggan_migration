# Pelanggan Mobile Kasir - Database Migrations

This project contains the database schema and migration files for the **Pelanggan Mobile Kasir** application. The schema is designed to support a modular and configurable Point of Sale (POS) platform.

## Key Features & Schema Overview

The database schema is structured to support the following key features:

### 1. Core POS Functionality

The system's core is a customizable UI that adapts to different business workflows. The schema supports modules for:

*   **Restaurant/Cafe:** Visual table layout, pending orders, and split bills.
*   **Retail/Grocery Store:** Barcode scanning and quick product search.
*   **Weighted Goods (Meat/Vegetable Shop):** Inputting product weight and automatic price calculation.
*   **Laundry Service:** Order creation by service type, customer management, status tracking, and notifications.
*   **Booking/Appointment (Massage/Reflexology):** Calendar scheduling, management of services, staff, and rooms.
*   **Rental Business:** Asset catalog, booking calendar, and automated fee calculation.
*   **Pre-Order Management:** Future orders, down payments, and tracking.

### 2. Product & Inventory Management
*   **Multi-Unit Support:** Products can be managed in various units (e.g., piece, kg, gram, liter).
*   **Real-Time Stock Tracking:** Inventory levels are automatically updated with each transaction.
*   **Product Management:** Adding, editing, and categorizing products.

### 3. Customer & Payment Management
*   **Customer Relationship Management (CRM):** Storing customer data and their purchase history.
*   **Payment Integration:** Support for various payment methods like cash, cards, and e-wallets.

### 4. Reporting & Analytics
*   **Sales Performance:** Data for daily, weekly, or monthly sales dashboards.
*   **Filtered Reports:** Data for reports on best-selling products and peak sales hours.