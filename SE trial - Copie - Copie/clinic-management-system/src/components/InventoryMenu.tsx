import React from 'react';
import { FaMedkit, FaStethoscope, FaFlask, FaBoxes } from 'react-icons/fa';
import './InventoryMenu.css';

interface InventoryMenuProps {
    onCategoryChange: (category: string) => void;
}

const InventoryMenu: React.FC<InventoryMenuProps> = ({ onCategoryChange }) => {
    return (
        <div className="menu">
            <button onClick={() => onCategoryChange('medications')}>
                <FaMedkit /> Medications
            </button>
            <button onClick={() => onCategoryChange('instruments')}>
                <FaStethoscope /> Instruments
            </button>
            <button onClick={() => onCategoryChange('inox')}>
                <FaFlask /> Inox
            </button>
            <button onClick={() => onCategoryChange('consumable')}>
                <FaBoxes /> Consumable
            </button>
            <button onClick={() => onCategoryChange('non-consumable')}>
                <FaBoxes /> Non Consumable
            </button>
        </div>
    );
};

export default InventoryMenu;
