import jsPDF from "jspdf";

export const generateInvoicePDF = (order, authUser) => {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  let yPosition = 20;

  // ===== HEADER =====
  pdf.setFillColor(0, 0, 0);
  pdf.rect(0, 0, pageWidth, 40, "F");

  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(24);
  pdf.setFont(undefined, "bold");
  pdf.text("INVOICE", 20, 25);

  // ===== COMPANY & ORDER INFO =====
  yPosition = 55;
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(10);
  pdf.setFont(undefined, "bold");
  pdf.text("ShopyOnline", 20, yPosition);

  pdf.setFont(undefined, "normal");
  yPosition += 8;
  pdf.text("123 Fashion Street", 20, yPosition);
  yPosition += 5;
  pdf.text("New York, NY 10001", 20, yPosition);
  yPosition += 5;
  pdf.text("Email: support@shopyonline.com", 20, yPosition);

  // Order Details on Right
  pdf.setFont(undefined, "bold");
  pdf.text("Order Details:", 130, 55);

  pdf.setFont(undefined, "normal");
  pdf.setFontSize(9);
  yPosition = 62;
  pdf.text(`Order ID: ${order.id}`, 130, yPosition);
  yPosition += 5;
  pdf.text(
    `Date: ${new Date(order.date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })}`,
    130,
    yPosition
  );
  yPosition += 5;
  pdf.text(
    `Status: ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}`,
    130,
    yPosition
  );

  // ===== BILLING INFORMATION =====
  yPosition = 95;
  pdf.setFontSize(10);
  pdf.setFont(undefined, "bold");
  pdf.text("Bill To:", 20, yPosition);

  pdf.setFont(undefined, "normal");
  pdf.setFontSize(9);
  yPosition += 7;
  pdf.text(authUser.name || "Customer", 20, yPosition);
  yPosition += 5;
  pdf.text(authUser.email || "", 20, yPosition);
  if (authUser.phone) {
    yPosition += 5;
    pdf.text(authUser.phone, 20, yPosition);
  }
  if (authUser.address) {
    yPosition += 5;
    pdf.text(authUser.address, 20, yPosition);
  }

  // ===== ITEMS TABLE =====
  yPosition = 135;
  pdf.setFillColor(0, 0, 0);
  pdf.rect(20, yPosition - 7, pageWidth - 40, 8, "F");

  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(9);
  pdf.setFont(undefined, "bold");
  pdf.text("Item", 25, yPosition);
  pdf.text("Qty", 130, yPosition);
  pdf.text("Unit Price", 150, yPosition);
  pdf.text("Total", 190, yPosition);

  yPosition += 12;
  pdf.setTextColor(0, 0, 0);
  pdf.setFont(undefined, "normal");

  let subtotal = 0;
  order.items.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;

    // Item name (truncate if too long)
    const itemName =
      item.name.length > 35 ? item.name.substring(0, 35) + "..." : item.name;
    pdf.text(itemName, 25, yPosition);
    pdf.text(item.quantity.toString(), 135, yPosition);
    pdf.text(`$${item.price.toFixed(2)}`, 150, yPosition);
    pdf.text(`$${itemTotal.toFixed(2)}`, 190, yPosition);

    yPosition += 8;

    // Add new page if content is getting too long
    if (yPosition > pageHeight - 60) {
      pdf.addPage();
      yPosition = 20;
    }
  });

  // ===== TOTALS SECTION =====
  yPosition += 5;
  pdf.setDrawColor(200, 200, 200);
  pdf.line(130, yPosition, 200, yPosition);

  yPosition += 8;
  pdf.setFont(undefined, "normal");
  pdf.setFontSize(9);

  const tax = order.total - subtotal;

  pdf.text("Subtotal:", 150, yPosition);
  pdf.text(`$${subtotal.toFixed(2)}`, 190, yPosition);

  yPosition += 6;
  pdf.text("Tax (10%):", 150, yPosition);
  pdf.text(`$${tax.toFixed(2)}`, 190, yPosition);

  yPosition += 6;
  pdf.text("Shipping:", 150, yPosition);
  pdf.text("FREE", 190, yPosition);

  yPosition += 8;
  pdf.setFillColor(0, 0, 0);
  pdf.rect(130, yPosition - 6, 70, 10, "F");

  pdf.setTextColor(255, 255, 255);
  pdf.setFont(undefined, "bold");
  pdf.setFontSize(12);
  pdf.text("TOTAL:", 150, yPosition + 1);
  pdf.text(`$${order.total.toFixed(2)}`, 190, yPosition + 1, {
    align: "right",
  });

  // ===== TRACKING INFORMATION =====
  if (order.trackingNumber) {
    yPosition += 20;
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(9);
    pdf.setFont(undefined, "bold");
    pdf.text("Tracking Information:", 20, yPosition);

    pdf.setFont(undefined, "normal");
    yPosition += 6;
    pdf.text(`Tracking Number: ${order.trackingNumber}`, 20, yPosition);

    if (order.deliveryDate) {
      yPosition += 5;
      const expectedDate = new Date(order.deliveryDate).toLocaleDateString(
        "en-US",
        {
          year: "numeric",
          month: "short",
          day: "numeric",
        }
      );
      pdf.text(`Expected Delivery: ${expectedDate}`, 20, yPosition);
    }
  }

  // ===== FOOTER =====
  const footerY = pageHeight - 15;
  pdf.setFontSize(8);
  pdf.setTextColor(100, 100, 100);
  pdf.text(
    "Thank you for your purchase! If you have any questions, please contact us at support@shopyonline.com",
    pageWidth / 2,
    footerY,
    { align: "center" }
  );

  pdf.text(
    `Generated on ${new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })}`,
    pageWidth / 2,
    footerY + 5,
    { align: "center" }
  );

  // ===== DOWNLOAD =====
  pdf.save(`Invoice-${order.id}.pdf`);
};