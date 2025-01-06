import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { calculateTotal, generateInvoiceNumber } from '@/app/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerName, customerAddress,customerPhoneNumber, items, date} = body;

    const invoiceNumber = await generateInvoiceNumber();

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        date: new Date(date),
        customerName,
        customerAddress,
        customerPhoneNumber,
        total: calculateTotal(items),
        items: {
          create: items.map((item: any) => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            total: item.total,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json({ 
      success: true, 
      invoiceId: invoice.id,
      invoiceNumber: invoice.invoiceNumber 
    });
  } catch (error) {
    console.error('Error creating invoice:', error);
    return NextResponse.json(
      { error: 'Failed to create invoice' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const invoices = await prisma.invoice.findMany({
      where: {
        date: {
          gte: today,
          lt: tomorrow,
        },
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json({ success: true, invoices });
  } catch (error) {
    console.log('Error fetching invoices:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invoices' },
      { status: 500 }
    );
  }
}