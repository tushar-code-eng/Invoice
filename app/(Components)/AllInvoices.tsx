"use client"
import axios from 'axios';
import { useEffect } from 'react';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';

const AllInvoices = ({ invoices, setInvoices }: { invoices:any[],setInvoices: (invoices: any[]) => void }) => {
    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const response = await axios.get('/api/invoices');
                console.log(response.data)
                setInvoices(response.data.invoices);
            } catch (error) {
                console.error('Failed to fetch invoices', error);
            }
        };

        fetchInvoices()
    }, [setInvoices]); 

    return (
        <div className='w-full h-full items-center justify-center mx-auto bg-white rounded-lg shadow-md px-2 sm:px-6 py-6'>
            <h1 className='text-4xl font-bold mb-16 text-orange-500'>Todays Invoices</h1>
            <table className="min-w-full bg-white text-sm sm:text-base">
                <thead>
                    <tr>
                        <th className="py-2">Sr. No</th>
                        <th className="py-2">Customer Name</th>
                        <th className="py-2">Phone Number</th>
                        <th className="py-2 2xl:block hidden">Items</th>
                        <th className="py-2">Download</th>
                    </tr>
                </thead>
                <tbody>
                    {invoices.map((invoice: any, index) => (
                        <tr key={index} className="text-center text-sm sm:text-base">
                            <td className="py-2">{index + 1}</td>
                            <td className="py-2">{invoice.customerName}</td>
                            <td className="py-2">{invoice.customerPhoneNumber}</td>
                            <td className="py-2 2xl:block hidden">
                                {invoice.items.map((item: any, idx: number) => (
                                    <div key={idx}>
                                        {item.description} - {item.quantity} x {item.unitPrice}
                                    </div>
                                ))}
                            </td>
                            <td className="py-2">
                                <button onClick={async () => {
                                    window.open(`/api/invoices/${invoice.id}`, '_blank');
                                }}>
                                    <FileDownloadOutlinedIcon />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AllInvoices
