'use client';

import axios from 'axios';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export default function InvoiceForm({ setInvoices }: { setInvoices: (invoices: any[]) => void }) {
    const [items, setItems] = useState<any[]>([]);
    const { register, handleSubmit, reset } = useForm();

    const fetchInvoices = async () => {
        try {
            const response = await axios.get('/api/invoices');
            setInvoices(response.data.invoices);
        } catch (error) {
            console.log('Failed to fetch invoices', error);
        }
    };

    const onSubmit = async (data: any) => {
        const invoice = {
            ...data,
            items,
            date: new Date().toISOString(),
        };

        try {
            const response = await fetch('/api/invoices', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(invoice),
            });

            if (response.ok) {
                await response.json();
                reset();
                setItems([]);
                alert('Invoice created successfully!');
                fetchInvoices()
            }
        } catch (err) {
            console.log(err)
            alert('Failed to create invoice');
        }
    };

    return (
        <div className="w-full h-full  items-center justify-center mx-auto bg-white rounded-lg shadow-md px-2 sm:px-6 py-6">
            <div>
                <h1 className="text-4xl font-bold mb-16 text-orange-500">AAKA Shipment Invoice Generator</h1>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-4 ">
                        <div>
                            <label className="block font-medium text-gray-700">
                                Customer Name
                            </label>
                            <input
                                {...register('customerName', { required: true })}
                                className="text-black border p-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Customer Address
                            </label>
                            <textarea
                                placeholder='Address'
                                {...register('customerAddress', { required: true })}
                                className="mt-1 w-full p-2 text-black border rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Phone Number
                            </label>
                            <input
                                placeholder='+91'
                                {...register('customerPhoneNumber', { required: true })}
                                className="mt-1 w-full p-2 text-black border rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>

                        {/* Items Section */}
                        <div>
                            <h2 className="text-lg text-black font-medium mb-2">Items</h2>
                            {items.map((item, index) => (
                                <div key={index} className="flex items-center space-x-4 mb-2">
                                    <input
                                        value={item.description}
                                        onChange={(e) => {
                                            const newItems = [...items];
                                            newItems[index].description = e.target.value;
                                            setItems(newItems);
                                        }}
                                        className="border p-2 flex-1 rounded-md border-gray-300 shadow-sm"
                                        placeholder="Description"
                                    />
                                    <input
                                        type="number"
                                        // value={item.quantity}
                                        onChange={(e) => {
                                            const newItems = [...items];
                                            newItems[index].quantity = parseInt(e.target.value);
                                            newItems[index].total = newItems[index].quantity * newItems[index].unitPrice;
                                            setItems(newItems);
                                        }}
                                        className=" border p-2 w-24 rounded-md border-gray-300 shadow-sm"
                                        placeholder="Qty"
                                    />
                                    <input
                                        type="number"
                                        // value={item.unitPrice}
                                        onChange={(e) => {
                                            const newItems = [...items];
                                            newItems[index].unitPrice = parseFloat(e.target.value);
                                            newItems[index].total = newItems[index].quantity * newItems[index].unitPrice;
                                            setItems(newItems);
                                        }}
                                        className="border p-2 w-32 rounded-md border-gray-300 shadow-sm"
                                        placeholder="Price"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setItems(items.filter((_, i) => i !== index))}
                                        className="bg-red-500 p-2 rounded-md text-white font-medium"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => setItems([...items, {
                                    description: '',
                                    quantity: 0,
                                    unitPrice: 0,
                                    total: 0
                                }])}
                                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                Add Item
                            </button>
                        </div>

                        <div className="mt-6 flex justify-between">
                            <button
                                type="submit"
                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                            >
                                Generate Invoice
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}