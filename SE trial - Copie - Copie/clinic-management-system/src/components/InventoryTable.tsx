import React from 'react';

interface InventoryItem {
    id: string;
    name: string;
    quantity: number;
    description: string;
}

interface InventoryTableProps {
    data: InventoryItem[];
}

const InventoryTable: React.FC<InventoryTableProps> = ({ data }) => {
    return (
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Quantity</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                {data.map(item => (
                    <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.name}</td>
                        <td>{item.quantity}</td>
                        <td>{item.description}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default InventoryTable;
