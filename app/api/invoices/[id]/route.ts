import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
// import imgLogo from '@/public/imgaaka.jpg'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id: (await params).id },
      include: { items: true },
    });

    if (!invoice) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      );
    }

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 280.63]); // 1/3rd height of A4 size
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);


    /////////////////////////////////////////////////////////////////////////////////////////////////

    const myAddress = "#37 New Vikas Nagar, Baltana, 140604, Punjab";

    const { customerName, customerAddress, customerPhoneNumber, invoiceNumber, items, total } = invoice;

    const heading = 'AAKA';
    const hWidth = font.widthOfTextAtSize(heading, 12);
    const pWidth = page.getWidth();
    const hPosition = (pWidth - hWidth) / 2;

    page.drawText('AAKA', {
      x: hPosition - 30,
      y: page.getHeight() - 50,
      size: 30,
      font,
      color: rgb(0, 0, 0),
    });

    page.drawText(`Customer Name: ${customerName}`, {
      x: 50,
      y: page.getHeight() - 80,
      size: 12,
      font,
      color: rgb(0, 0, 0),
    });

    page.drawText(`Customer Phone: ${customerPhoneNumber}`, {
      x: 50,
      y: page.getHeight() - 100,
      size: 12,
      font,
      color: rgb(0, 0, 0),
    });

    let currentY = page.getHeight() - 120;

    items.forEach((item, index) => {
      page.drawText(`Item ${index + 1}: ${item.description}`, {
        x: 50,
        y: currentY,
        size: 12,
        font,
        color: rgb(0, 0, 0),
      });

      page.drawText(`Quantity: ${item.quantity}`, {
        x: 200,
        y: currentY,
        size: 12,
        font,
        color: rgb(0, 0, 0),
      });

      currentY -= 20;
    });

    page.drawText(`Invoice Number: ${invoiceNumber}`, {
      x: 50,
      y: page.getHeight() - 140,
      size: 12,
      font,
      color: rgb(0, 0, 0),
    });

    // currentY -= 40;

    page.drawText(`Shipping Address: ${myAddress}`, {
      x: 50,
      y: page.getHeight() - 160,
      size: 12,
      font,
      color: rgb(0, 0, 0),
    });

    page.drawText(`Customer Address: ${customerAddress}`, {
      x: 50,
      y: page.getHeight() - 180,
      size: 12,
      font,
      color: rgb(0, 0, 0),
    });

    page.drawText(`Total: ₹${total.toFixed(2)}`, {
      x: 50,
      y: page.getHeight() - 200,
      size: 16,
      color: rgb(0, 0, 0),
      font: await pdfDoc.embedFont(StandardFonts.HelveticaBold),
    });

    const thankYouText = 'Thank you for shopping with us! Have a great day!';
    const textWidth = font.widthOfTextAtSize(thankYouText, 12);
    const pageWidth = page.getWidth();
    const xPosition = (pageWidth - textWidth) / 2;

    page.drawText(thankYouText, {
      x: xPosition,
      y: page.getHeight() - 240,
      size: 12,
      font,
      color: rgb(0, 0, 0),
    });

    /////////////////////////////////////////////////////////////////////////////////////////

    const pdfBytes = await pdfDoc.save();

    return new NextResponse(pdfBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=invoice-${invoice.invoiceNumber}.pdf`,
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}

