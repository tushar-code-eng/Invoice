"use client"

import AllInvoices from './(Components)/AllInvoices';
import InvoiceForm from './(Components)/InvoiceForm';
import { useState } from 'react';


export default function Home() {

  const [invoices, setInvoices] = useState<any[]>([]);
  
  return (
    <div className='lg:flex block gap-10 lg:h-screen w-full bg-gray-100 sm:py-10 sm:px-10'>
      <InvoiceForm setInvoices={setInvoices} />
      <AllInvoices invoices={invoices} setInvoices={setInvoices} />
    </div>
  )
}