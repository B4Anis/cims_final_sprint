// Connect to the database
db = connect("mongodb://localhost:27017/clinic-management");

// Clear existing data
db.users.drop();
db.instruments.drop();
db.medications.drop();
db.consumables.drop();
db.nonconsumables.drop();
db.activities.drop();
db.inoxes.drop();

// Clear existing family collections
db.family1.drop();
db.family2.drop();
db.family3.drop();
db.family4.drop();
db.family5.drop();

// Create users collection with sample data
//go to \cims before roles\cims_final_sprint\clinic-management-backend\scripts
// then run the file to createUser.js you can change the credentials scroll down in the file 
// Create instruments collection with sample data
db.instruments.insertMany([
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

// Insert medications for Family 1
db.family1.insertMany([
    {
        genericName: "Ibuprofen",
        marketName: "Advil",
        dosage: "200mg",
        dosageForm: "Tablet",
        packSize: "Box of 20",
        expiryDate: new Date("2025-07-20"),
        quantityInStock: 500,
        minStockLevel: 50,
        supplierName: "PharmaCo",
        supplierContact: "contact@pharmaco.com"
    },
    {
        genericName: "Paracetamol",
        marketName: "Doliprane",
        dosage: "500mg",
        dosageForm: "Tablet",
        packSize: "Box of 16",
        expiryDate: new Date("2025-08-15"),
        quantityInStock: 400,
        minStockLevel: 40,
        supplierName: "MediSupply",
        supplierContact: "contact@medisupply.com"
    }
]);

// Insert medications for Family 2
db.family2.insertMany([
    {
        genericName: "Metformin",
        marketName: "Glucophage",
        dosage: "500mg",
        dosageForm: "Tablet",
        packSize: "Box of 30",
        expiryDate: new Date("2025-10-15"),
        quantityInStock: 700,
        minStockLevel: 100,
        supplierName: "DiabetesCare",
        supplierContact: "contact@diabetescare.com"
    }
]);

// Insert medications for Family 3
db.family3.insertMany([
    {
        genericName: "Omeprazole",
        marketName: "Prilosec",
        dosage: "20mg",
        dosageForm: "Capsule",
        packSize: "Box of 14",
        expiryDate: new Date("2025-11-30"),
        quantityInStock: 600,
        minStockLevel: 70,
        supplierName: "GastroMed",
        supplierContact: "contact@gastromed.com"
    }
]);

// Insert medications for Family 4
db.family4.insertMany([
    {
        genericName: "Salbutamol",
        marketName: "Ventolin",
        dosage: "100mcg",
        dosageForm: "Inhaler",
        packSize: "200 doses",
        expiryDate: new Date("2025-09-25"),
        quantityInStock: 200,
        minStockLevel: 30,
        supplierName: "RespiCare",
        supplierContact: "contact@respicare.com"
    }
]);

// Insert medications for Family 5
db.family5.insertMany([
    {
        genericName: "Ciprofloxacin",
        marketName: "Cipro",
        dosage: "500mg",
        dosageForm: "Tablet",
        packSize: "Box of 10",
        expiryDate: new Date("2026-01-01"),
        quantityInStock: 300,
        minStockLevel: 40,
        supplierName: "AntibioticsCo",
        supplierContact: "contact@antibioticsco.com"
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
    },
    {
        name: "Latex Gloves",
        category: "Protection",
        size: "Medium",
        quantity: 1000,
        minStock: 200,
        expiryDate: new Date("2026-06-15"),
        supplierName: "SafeHands Distributors",
        supplierContact: "0659876543"
    },
    {
        name: "Alcohol Wipes",
        category: "Sterilization",
        size: "Small",
        quantity: 300,
        minStock: 50,
        expiryDate: new Date("2025-09-20"),
        supplierName: "CleanMed Inc.",
        supplierContact: "0576543210"
    },
    {
        name: "Cotton Balls",
        category: "Medical Supplies",
        size: "Standard",
        quantity: 200,
        minStock: 30,
        expiryDate: new Date("2027-03-10"),
        supplierName: "MedGoods Ltd.",
        supplierContact: "0563456789"
    },
    {
        name: "IV Bags",
        category: "Medical Supplies",
        size: "Large",
        quantity: 150,
        minStock: 20,
        expiryDate: new Date("2025-08-30"),
        supplierName: "VitalMed Supplies",
        supplierContact: "0654321876"
    },
    {
        name: "Bandages",
        category: "Medical Supplies",
        size: "Standard",
        quantity: 400,
        minStock: 50,
        expiryDate: new Date("2027-05-01"),
        supplierName: "HealthPlus Traders",
        supplierContact: "0556789123"
    },
    {
        name: "Disinfectant Solution",
        category: "Sterilization",
        size: "Large",
        quantity: 100,
        minStock: 10,
        expiryDate: new Date("2026-11-25"),
        supplierName: "CleanCare Solutions",
        supplierContact: "0678901234"
    },
    {
        name: "Glucose Test Strips",
        category: "Diagnostics",
        size: "Small",
        quantity: 250,
        minStock: 50,
        expiryDate: new Date("2025-07-14"),
        supplierName: "Diagnostic Supplies Ltd.",
        supplierContact: "0571234567"
    },
    {
        name: "Lubricating Gel",
        category: "Miscellaneous",
        size: "Medium",
        quantity: 150,
        minStock: 20,
        expiryDate: new Date("2027-01-31"),
        supplierName: "MedSoft Essentials",
        supplierContact: "0559876543"
    },
    {
        name: "Surgical Tape",
        category: "Medical Supplies",
        size: "Small",
        quantity: 300,
        minStock: 50,
        expiryDate: new Date("2026-09-15"),
        supplierName: "MedAid Supplies",
        supplierContact: "0676543210"
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
