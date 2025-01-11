// Connect to the database
db = connect("mongodb://localhost:27017/clinic-management");

// Clear existing data
db.users.drop();
db.instruments.drop();
db.medications.drop();
db.consumables.drop();
db.nonconsumables.drop();
db.activities.drop();
db.inoxes.drop(); // create dummy data inox
// Create users collection with sample data
//go to C:\Users\anisb\OneDrive\Desktop\cims before roles\cims_final_sprint\clinic-management-backend\scripts
// then run the file to createUser.js you can change the credentials scroll down in the file 
// Create instruments collection with sample data
db.instruments.insertMany([
    {
        name: "Stethoscope",
        category: "Diagnostic",
        modelNumber: "ST-100",
        quantity: 10,
        minStock: 5,
        dateAcquired: new Date("2024-01-01"),
        supplierName: "Medical Supplies Co",
        supplierContact: "0555123456"
    },
    {
        name: "Blood Pressure Monitor",
        category: "Diagnostic",
        modelNumber: "BP-200",
        quantity: 8,
        minStock: 3,
        dateAcquired: new Date("2024-01-01"),
        supplierName: "Health Equipment Ltd",
        supplierContact: "0555789012"
    }
]);

// Create medications collection with sample data
db.medications.insertMany([
    {
        name: "Paracetamol",
        category: "Pain Relief",
        dosageForm: "Tablet",
        strength: "500mg",
        quantity: 1000,
        minStock: 200,
        expiryDate: new Date("2025-12-31"),
        supplierName: "Pharma Co",
        supplierContact: "0555345678"
    },
    {
        name: "Amoxicillin",
        category: "Antibiotics",
        dosageForm: "Capsule",
        strength: "250mg",
        quantity: 500,
        minStock: 100,
        expiryDate: new Date("2025-06-30"),
        supplierName: "Pharma Co",
        supplierContact: "0555345678"
    }
]);

// Create consumables collection with sample data
db.consumables.insertMany([
    {
        name: "Surgical Gloves",
        category: "Protection",
        size: "Medium",
        quantity: 1000,
        minStock: 200,
        expiryDate: new Date("2025-12-31"),
        supplierName: "Medical Supplies Co",
        supplierContact: "0555123456"
    },
    {
        name: "Surgical Masks",
        category: "Protection",
        size: "Standard",
        quantity: 2000,
        minStock: 500,
        expiryDate: new Date("2025-12-31"),
        supplierName: "Medical Supplies Co",
        supplierContact: "0555123456"
    }
]);

// Create non-consumables collection with sample data
db.nonconsumables.insertMany([
    {
        name: "Office Chair",
        category: "Furniture",
        brand: "ErgoComfort",
        quantity: 15,
        minStock: 5,
        dateAcquired: new Date("2024-01-01"),
        supplierName: "HomeFurnish Co.",
        supplierContact: "+1-555-1234"
    },
    {
        name: "Ultrasound Machine",
        category: "Equipment",
        brand: "MedTech",
        quantity: 3,
        minStock: 1,
        dateAcquired: new Date("2024-01-01"),
        supplierName: "MedEquip Supplies",
        supplierContact: "+1-555-5678"
    },
    {
        name: "Patient Bed",
        category: "Furniture",
        brand: "HealthCarePro",
        quantity: 10,
        minStock: 2,
        dateAcquired: new Date("2024-01-01"),
        supplierName: "Hospital Solutions",
        supplierContact: "+1-555-8765"
    },
    {
        name: "Medical Trolley",
        category: "Equipment",
        brand: "MediCart",
        quantity: 5,
        minStock: 2,
        dateAcquired: new Date("2024-01-01"),
        supplierName: "ClinicalTools Inc.",
        supplierContact: "+1-555-4321"
    },
    {
        name: "Desk Lamp",
        category: "Furniture",
        brand: "BrightLite",
        quantity: 20,
        minStock: 10,
        dateAcquired: new Date("2024-01-01"),
        supplierName: "LightSource Ltd.",
        supplierContact: "+1-555-6789"
    },
    {
        name: "Defibrillator",
        category: "Equipment",
        brand: "LifeSaver",
        quantity: 2,
        minStock: 1,
        dateAcquired: new Date("2024-01-01"),
        supplierName: "CriticalCare Corp.",
        supplierContact: "+1-555-3456"
    },
    {
        name: "Sterilizer",
        category: "Equipment",
        brand: "CleanMax",
        quantity: 4,
        minStock: 1,
        dateAcquired: new Date("2024-01-01"),
        supplierName: "SanitizePlus",
        supplierContact: "+1-555-9876"
    },
    {
        name: "ECG Machine",
        category: "Equipment",
        brand: "HeartCheck",
        quantity: 3,
        minStock: 1,
        dateAcquired: new Date("2024-01-01"),
        supplierName: "BioMedical Devices",
        supplierContact: "+1-555-2345"
    },
    {
        name: "Storage Cabinet",
        category: "Furniture",
        brand: "StoreEase",
        quantity: 7,
        minStock: 3,
        dateAcquired: new Date("2024-01-01"),
        supplierName: "Office Essentials",
        supplierContact: "+1-555-6543"
    },
    {
        name: "Waiting Room Bench",
        category: "Furniture",
        brand: "ComfySeats",
        quantity: 10,
        minStock: 4,
        dateAcquired: new Date("2024-01-01"),
        supplierName: "RelaxFurniture Ltd.",
        supplierContact: "+1-555-7890"
    }
]);


// Create activities collection with sample data
db.activities.insertMany([
    {
        userID: "ADMIN001",
        action: "Added Medication",
        itemId: "PARA001",
        itemName: "Paracetamol",
        quantity: 1000,
        timestamp: new Date(),
        details: "Initial stock addition"
    },
    {
        userID: "STAFF001",
        action: "Updated Stock",
        itemId: "SURG001",
        itemName: "Surgical Gloves",
        quantity: 100,
        timestamp: new Date(),
        details: "Regular stock update"
    }
]);
// create dummy data inox
db.inoxes.insertMany([
    {
        name: "Examination Table",
        category: "Furniture",
        brand: "ET-100",
        quantity: 5,
        minStock: 2,
        supplierName: "Medical Furniture Co",
        supplierContact: "0555901234"
    },
    {
        name: "Medical Cabinet",
        category: "Storage",
        brand: "MC-200",
        quantity: 10,
        minStock: 3,
        supplierName: "Medical Furniture Co",
        supplierContact: "0555901234"
    },
    {
        name: "Examination Table",
        category: "Furniture",
        brand: "ET-100",
        quantity: 5,
        minStock: 2,
        supplierName: "Medical Furniture Co",
        supplierContact: "0555901234"
    },
    {
        name: "Medical Cabinet",
        category: "Storage",
        brand: "MC-200",
        quantity: 10,
        minStock: 3,
        supplierName: "Medical Furniture Co",
        supplierContact: "0555901234"
    },
    {
        name: "Examination Table",
        category: "Furniture",
        brand: "ET-100",
        quantity: 5,
        minStock: 2,
        supplierName: "Medical Furniture Co",
        supplierContact: "0555901234"
    },
    {
        name: "Medical Cabinet",
        category: "Storage",
        brand: "MC-200",
        quantity: 10,
        minStock: 3,
        supplierName: "Medical Furniture Co",
        supplierContact: "0555901234"
    },
    {
        name: "Examination Table",
        category: "Furniture",
        brand: "ET-100",
        quantity: 5,
        minStock: 2,
        supplierName: "Medical Furniture Co",
        supplierContact: "0555901234"
    },
    {
        name: "Medical Cabinet",
        category: "Storage",
        brand: "MC-200",
        quantity: 10,
        minStock: 3,
        supplierName: "Medical Furniture Co",
        supplierContact: "0555901234"
    }
]);
