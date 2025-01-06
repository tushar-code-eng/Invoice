import prisma from './prisma'

export async function generateInvoiceNumber(): Promise<string> {
  const today = new Date();
  const datePrefix = today.toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD
  
  const lastInvoice = await prisma.invoice.findFirst({
    where: {
      invoiceNumber: {
        startsWith: datePrefix
      }
    },
    orderBy: {
      invoiceNumber: 'desc'
    }
  });

  let sequenceNumber = 1;
  
  if (lastInvoice) {
    const lastSequence = parseInt(lastInvoice.invoiceNumber.split('-')[1]);
    sequenceNumber = lastSequence + 1;
  }

  return `${datePrefix}-${sequenceNumber.toString().padStart(3, '0')}`;
}

export function calculateTotal(items: any[]): number {
  return items.reduce((sum, item) => sum + item.total, 0);
}
