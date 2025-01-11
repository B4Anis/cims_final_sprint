// API configuration
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
const API_BASE_URL = 'http://localhost:5000/api';  // Adjust the base URL if needed

// User Management API Functions

// Get all users from the system
export const getAllUsers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users`);
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

// Create a new user
export const createUser = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users`, userData);
    return response.data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

// Get user by ID
export const getUserById = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user ${userId}:`, error);
    throw error;
  }
};

// Update existing user information
export const updateUser = async (email, userData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/users/${email}`, userData);
    return response.data;
  } catch (error) {
    console.error(`Error updating user ${email}:`, error);
    throw error;
  }
};

// Remove user from the system
export const deleteUser = async (userId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting user ${userId}:`, error);
    throw error;
  }
};

// Consumable Management API Functions

// Get list of all consumables
export const getConsumables = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/consumables`);
    return response.data;  // Return the consumables data
  } catch (error) {
    console.error("Error fetching consumables:", error);
    throw error;
  }
};

// Find consumable by its name
export const getConsumableByName = async (name) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/consumables/${name}`);
    return response.data;  // Return the consumable data
  } catch (error) {
    console.error(`Error fetching consumable "${name}":`, error);
    throw error;
  }
};

// Create new consumable entry
export const addConsumable = async (consumable) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/consumables`, consumable);
    return response.data;  // Return the added consumable
  } catch (error) {
    console.error("Error adding consumable:", error);
    throw error;
  }
};

// Update consumable information
export const updateConsumable = async (name, updatedData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/consumables/${name}`, updatedData);
    return response.data;  // Return the updated consumable
  } catch (error) {
    console.error(`Error updating consumable "${name}":`, error);
    throw error;
  }
};

// Remove consumable from inventory
export const deleteConsumable = async (name) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/consumables/${name}`);
    return response.data;  // Confirm deletion
  } catch (error) {
    console.error(`Error deleting consumable "${name}":`, error);
    throw error;
  }
};

// Update consumable stock level
export const updateConsumableStock = async (name, quantity, type) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/consumables/${name}/stock`, {
      quantity,
      type
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating consumable stock for ${name}:`, error);
    throw error;
  }
};

// Non-Consumable Management API Functions

// Get all non-consumable items
export const getNonConsumables = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/non-consumables`);
    return response.data;
  } catch (error) {
    console.error("Error fetching non-consumables:", error);
    throw error;
  }
};

// Find non-consumable by name
export const getNonConsumableByName = async (name) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/non-consumables/${name}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching non-consumable ${name}:`, error);
    throw error;
  }
};

// Add new non-consumable item
export const addNonConsumable = async (nonConsumable) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/non-consumables`, {
      name: nonConsumable.name,
      category: nonConsumable.category,
      brand: nonConsumable.brand,
      quantity: nonConsumable.quantity,
      minStock: nonConsumable.minStock,
      supplierName: nonConsumable.supplierName,
      supplierContact: nonConsumable.supplierContact
    });
    return response.data;
  } catch (error) {
    console.error("Error adding non-consumable:", error);
    throw error;
  }
};

// Update non-consumable information
export const updateNonConsumable = async (name, updatedData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/non-consumables/${name}`, updatedData);
    return response.data;
  } catch (error) {
    console.error(`Error updating non-consumable ${name}:`, error);
    throw error;
  }
};

// Modify non-consumable stock quantity
export const updateNonConsumableStock = async (name, quantity, type) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/non-consumables/${name}/stock`, {
      quantity,
      type
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating non-consumable stock for ${name}:`, error);
    throw error;
  }
};

// Remove non-consumable item
export const deleteNonConsumable = async (name) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/non-consumables/${name}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting non-consumable ${name}:`, error);
    throw error;
  }
};

// Inox Management API Functions

// Get all inox items
export const getInoxs = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/inox`);
    return response.data;  // Return the Inoxs data
  } catch (error) {
    console.error("Error fetching Inoxs:", error);
    throw error;
  }
};

// Find specific inox by name
export const getInoxByName = async (name) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/inox/${name}`);
    return response.data;  // Return the Inox data
  } catch (error) {
    console.error(`Error fetching Inox "${name}":`, error);
    throw error;
  }
};

// Add new inox item
export const addInox = async (Inox) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/inox`, Inox);
    return response.data;  // Return the added Inox
  } catch (error) {
    console.error("Error adding Inox:", error);
    throw error;
  }
};

// Update inox information
export const updateInox = async (name, updatedData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/inox/${name}`, updatedData);
    return response.data;  // Return the updated Inox
  } catch (error) {
    console.error(`Error updating Inox "${name}":`, error);
    throw error;
  }
};

// Remove inox item
export const deleteInox = async (name) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/inox/${name}`);
    return response.data;  // Confirm deletion
  } catch (error) {
    console.error(`Error deleting Inox "${name}":`, error);
    throw error;
  }
};

// Update inox stock quantity
export const updateInoxStock = async (name, quantity, type) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/inox/${name}/stock`, {
      quantity,
      type
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating inox stock for ${name}:`, error);
    throw error;
  }
};

// Instrument Management API Functions

// Get all instruments
export const getInstruments = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/instruments`);
    return response.data;  
  } catch (error) {
    console.error("Error fetching instruments:", error);
    throw error;
  }
};

// Find instrument by name
export const getInstrumentByName = async (name) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/instruments/${name}`);
    return response.data;  
  } catch (error) {
    console.error(`Error fetching instrument "${name}":`, error);
    throw error;
  }
};

// Add new instrument
export const addInstrument = async (instrument) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/instruments`, instrument);
    return response.data;  
  } catch (error) {
    console.error("Error adding instrument:", error);
    throw error;
  }
};

// Update instrument information
export const updateInstrument = async (name, updatedData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/instruments/${name}`, updatedData);
    return response.data;  
  } catch (error) {
    console.error(`Error updating instrument "${name}":`, error);
    throw error;
  }
};

// Remove instrument
export const deleteInstrument = async (name) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/instruments/${name}`);
    return response.data;  
  } catch (error) {
    console.error(`Error deleting instrument "${name}":`, error);
    throw error;
  }
};

// Update instrument stock level
export const updateInstrumentStock = async (name, quantity, type) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/instruments/${name}/stock`, {
      quantity,
      type
    });
    return response.data;
  } catch (error) {
    console.error('Error updating instrument stock:', error);
    throw error;
  }
};

// Medication Management API Functions

// Create new medication entry
export const createMedication = async (medicationData, family) => {
  try {
    console.log('====================================');
    console.log('medicationData', medicationData , family);
    console.log('====================================');
    const response = await axios.post(`${API_BASE_URL}/medications/${family}`, medicationData);
    toast.success('Medication added successfully');
    return response.data;
  } catch (error) {
    console.error("Error creating medication:", error);
    return null;
  }
};

// Get all medications by family
export const getAllMedications = async (family) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/medications/${family}`);
    // Map MongoDB fields to frontend fields
    const medications = response.data.map(med => ({
      id: med._id,
      genericName: med.genericName,
      marketName: med.marketName,
      dosage: med.dosage,
      dosageForm: med.dosageForm,
      packSize: med.packSize,
      expiryDate: med.expiryDate,
      quantity: med.quantityInStock,
      minQuantity: med.minStockLevel,
      family: family
    }));
    return medications;
  } catch (error) {
    console.error("Error fetching medications:", error);
    return [];
  }
};

// Find medication by ID
export const getMedicationById = async (family, id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/medications/${family}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching medication ${id}:`, error);
    throw error;
  }
};

// Update medication information
export const updateMedication = async (family, id, updatedData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/medications/${family}/${id}`, updatedData);
    return response.data;
  } catch (error) {
    console.error(`Error updating medication ${id}:`, error);
    throw error;
  }
};

// Remove medication
export const deleteMedication = async (family, id) => {
  console.log('====================================' , family , id);
  try {
    const response = await axios.delete(`${API_BASE_URL}/medications/${family}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting medication ${id}:`, error);
    throw error;
  }
};

// Update medication stock quantity
export const updateMedicationStock = async (medicationId, quantity, type) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/medications/${medicationId}/stock`, {
      quantity,
      type // 'addition' or 'consumption'
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating medication stock ${medicationId}:`, error);
    throw error;
  }
};