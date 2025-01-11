# Database Initialization Instructions

This folder contains the database initialization script for the Clinic Management System. The script will create and populate the database with sample data for testing and demonstration purposes.

## Prerequisites
- MongoDB installed and running
- MongoDB Shell (mongosh) installed

## Setup Instructions
1. Open a terminal/command prompt
2. Navigate to this directory
3. Install mongosh if not already installed:
   ```bash
   npm install -g mongosh
   ```
4. Run the initialization script:
   ```bash
   mongosh localhost:27017/clinic-management init.js
   ```

This will:
- Create a new database named 'clinic-management'
- Create all necessary collections
- Populate collections with sample data

## Sample Data Overview

### Users
- Admin and staff user accounts with roles and departments

### Instruments
- Medical instruments with categories, quantities, and supplier information

### Medications
- Common medications with dosage forms, quantities, and expiry dates

### Consumables
- Medical supplies with sizes, quantities, and expiry dates

### Non-consumables
- Medical equipment and furniture with model numbers and supplier details

### Activities
- Sample activity logs for stock management

## Note
The passwords in the sample data are placeholder hashed values. In a production environment, you should:
1. Never commit real passwords to version control
2. Use environment variables for sensitive data
3. Properly hash passwords before storing them
