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
db.inventory.insertMany([
    {
        name: "X-Ray Machine",
        category: "Medical Equipment",
        modelNumber: "XR-200",
        quantity: 5,
        minStockLevel: 2,
        dateAcquired: new Date("2023-06-15"),
        supplierName: "MediTech Supplies",
        supplierContact: "0551234567"
    },
    {
        name: "Ultrasound Device",
        category: "Medical Equipment",
        modelNumber: "US-500",
        quantity: 3,
        minStockLevel: 1,
        dateAcquired: new Date("2022-09-10"),
        supplierName: "HealthPlus",
        supplierContact: "0559876543"
    },
    {
        name: "ECG Machine",
        category: "Cardiology Equipment",
        modelNumber: "ECG-300",
        quantity: 4,
        minStockLevel: 2,
        dateAcquired: new Date("2023-01-20"),
        supplierName: "Global Pharma",
        supplierContact: "0551112223"
    },
    {
        name: "Surgical Lamp",
        category: "Surgical Tools",
        modelNumber: "SL-100",
        quantity: 6,
        minStockLevel: 3,
        dateAcquired: new Date("2021-12-05"),
        supplierName: "MediCare Inc",
        supplierContact: "0557654321"
    },
    {
        name: "Defibrillator",
        category: "Emergency Equipment",
        modelNumber: "DF-700",
        quantity: 2,
        minStockLevel: 1,
        dateAcquired: new Date("2023-07-18"),
        supplierName: "LifeLine Supplies",
        supplierContact: "0556781234"
    },
    {
        name: "Oxygen Concentrator",
        category: "Respiratory Equipment",
        modelNumber: "OX-400",
        quantity: 10,
        minStockLevel: 5,
        dateAcquired: new Date("2024-01-12"),
        supplierName: "Aero Pharma",
        supplierContact: "0555678901"
    },
    {
        name: "Syringe Pump",
        category: "Infusion Equipment",
        modelNumber: "SP-150",
        quantity: 8,
        minStockLevel: 4,
        dateAcquired: new Date("2023-11-25"),
        supplierName: "WellCare Pharma",
        supplierContact: "0554321098"
    },
    {
        name: "Patient Monitor",
        category: "Monitoring Equipment",
        modelNumber: "PM-250",
        quantity: 7,
        minStockLevel: 3,
        dateAcquired: new Date("2023-05-30"),
        supplierName: "MediTech Supplies",
        supplierContact: "0551234567"
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
