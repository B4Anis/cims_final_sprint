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
//go to \cims before roles\cims_final_sprint\clinic-management-backend\scripts
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
        genericName: "Ibuprofen",
        marketName: "Advil",
        dosage: 200,
        dosageForm: "Tablet",
        packSize: 20,
        expiryDate: new Date("2025-07-20"),
        quantity: 500,
        minQuantity: 50
    },
    {
        genericName: "Metformin",
        marketName: "Glucophage",
        dosage: 500,
        dosageForm: "Tablet",
        packSize: 30,
        expiryDate: new Date("2025-10-15"),
        quantity: 700,
        minQuantity: 100
    },
    {
        genericName: "Ciprofloxacin",
        marketName: "Cipro",
        dosage: 500,
        dosageForm: "Tablet",
        packSize: 10,
        expiryDate: new Date("2026-01-01"),
        quantity: 300,
        minQuantity: 40
    },
    {
        genericName: "Omeprazole",
        marketName: "Prilosec",
        dosage: 20,
        dosageForm: "Capsule",
        packSize: 14,
        expiryDate: new Date("2025-11-30"),
        quantity: 600,
        minQuantity: 70
    },
    {
        genericName: "Salbutamol",
        marketName: "Ventolin",
        dosage: 100,
        dosageForm: "Inhaler",
        packSize: 1,
        expiryDate: new Date("2025-09-25"),
        quantity: 200,
        minQuantity: 30
    },
    {
        genericName: "Lisinopril",
        marketName: "Prinivil",
        dosage: 10,
        dosageForm: "Tablet",
        packSize: 30,
        expiryDate: new Date("2026-05-15"),
        quantity: 400,
        minQuantity: 60
    },
    {
        genericName: "Atorvastatin",
        marketName: "Lipitor",
        dosage: 20,
        dosageForm: "Tablet",
        packSize: 15,
        expiryDate: new Date("2025-12-01"),
        quantity: 500,
        minQuantity: 50
    },
    {
        genericName: "Sertraline",
        marketName: "Zoloft",
        dosage: 50,
        dosageForm: "Tablet",
        packSize: 28,
        expiryDate: new Date("2025-08-20"),
        quantity: 350,
        minQuantity: 40
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
        supplierContact: "0555901234"
    },
    {
        name: "Ultrasound Machine",
        category: "Equipment",
        brand: "MedTech",
        quantity: 3,
        minStock: 1,
        dateAcquired: new Date("2024-01-01"),
        supplierName: "MedEquip Supplies",
        supplierContact: "0555901233"
    },
    {
        name: "Patient Bed",
        category: "Furniture",
        brand: "HealthCarePro",
        quantity: 10,
        minStock: 2,
        dateAcquired: new Date("2024-01-01"),
        supplierName: "Hospital Solutions",
        supplierContact: "0555901232"
    },
    {
        name: "Medical Trolley",
        category: "Equipment",
        brand: "MediCart",
        quantity: 5,
        minStock: 2,
        dateAcquired: new Date("2024-01-01"),
        supplierName: "ClinicalTools Inc.",
        supplierContact: "0555901231"
    },
    {
        name: "Desk Lamp",
        category: "Furniture",
        brand: "BrightLite",
        quantity: 20,
        minStock: 10,
        dateAcquired: new Date("2024-01-01"),
        supplierName: "LightSource Ltd.",
        supplierContact: "0555901230"
    },
    {
        name: "Defibrillator",
        category: "Equipment",
        brand: "LifeSaver",
        quantity: 2,
        minStock: 1,
        dateAcquired: new Date("2024-01-01"),
        supplierName: "CriticalCare Corp.",
        supplierContact: "0655901234"
    },
    {
        name: "Sterilizer",
        category: "Equipment",
        brand: "CleanMax",
        quantity: 4,
        minStock: 1,
        dateAcquired: new Date("2024-01-01"),
        supplierName: "SanitizePlus",
        supplierContact: "0755901234"
    },
    {
        name: "ECG Machine",
        category: "Equipment",
        brand: "HeartCheck",
        quantity: 3,
        minStock: 1,
        dateAcquired: new Date("2024-01-01"),
        supplierName: "BioMedical Devices",
        supplierContact: "0755951234"
    },
    {
        name: "Storage Cabinet",
        category: "Furniture",
        brand: "StoreEase",
        quantity: 7,
        minStock: 3,
        dateAcquired: new Date("2024-01-01"),
        supplierName: "Office Essentials",
        supplierContact: "0555901774"
    },
    {
        name: "Waiting Room Bench",
        category: "Furniture",
        brand: "ComfySeats",
        quantity: 10,
        minStock: 4,
        dateAcquired: new Date("2024-01-01"),
        supplierName: "RelaxFurniture Ltd.",
        supplierContact: "0612901234"
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
        name: "Examination Table1",
        category: "Furniture",
        brand: "ET-100",
        quantity: 5,
        minStock: 2,
        supplierName: "Medical Furniture Co",
        supplierContact: "0555901234"
    },
    {
        name: "Medical Cabinet1",
        category: "Storage",
        brand: "MC-200",
        quantity: 10,
        minStock: 3,
        supplierName: "Medical Furniture Co",
        supplierContact: "0555901234"
    },
    {
        name: "Examination Table2",
        category: "Furniture",
        brand: "ET-100",
        quantity: 5,
        minStock: 2,
        supplierName: "Medical Furniture Co",
        supplierContact: "0555901234"
    },
    {
        name: "Medical Cabinet2",
        category: "Storage",
        brand: "MC-200",
        quantity: 10,
        minStock: 3,
        supplierName: "Medical Furniture Co",
        supplierContact: "0555901234"
    },
    {
        name: "Examination Table3",
        category: "Furniture",
        brand: "ET-100",
        quantity: 5,
        minStock: 2,
        supplierName: "Medical Furniture Co",
        supplierContact: "0555901234"
    },
    {
        name: "Medical Cabinet3",
        category: "Storage",
        brand: "MC-200",
        quantity: 10,
        minStock: 3,
        supplierName: "Medical Furniture Co",
        supplierContact: "0555901234"
    },
    {
        name: "Examination Table4",
        category: "Furniture",
        brand: "ET-100",
        quantity: 5,
        minStock: 2,
        supplierName: "Medical Furniture Co",
        supplierContact: "0555901234"
    },
    {
        name: "Medical Cabinet4",
        category: "Storage",
        brand: "MC-200",
        quantity: 10,
        minStock: 3,
        supplierName: "Medical Furniture Co",
        supplierContact: "0555901234"
    }
]);
