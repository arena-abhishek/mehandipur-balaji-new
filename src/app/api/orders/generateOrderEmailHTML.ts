export const generateOrderEmailHTML = ({
    customerName,
    transactionId,
    paymentStatus,
    totalAmount,
    items,
}: {
    customerName: string;
    transactionId: string;
    paymentStatus: string;
    totalAmount: number;
    items: {
        name: string;
        quantity: number;
        price: number;
    }[];
}) => {
    const statusColor =
        paymentStatus === "success"
            ? "#28a745"
            : paymentStatus === "failed"
                ? "#dc3545"
                : "#ffc107";

    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px;">
      <h2 style="color: #333;">Order ${paymentStatus === "success" ? "Confirmation" : "Status Update"}</h2>
      <p>Dear ${customerName},</p>
      <p>Here are the details for your order:</p>
  
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <thead>
          <tr style="background-color: #f8f8f8;">
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Item</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Qty</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${items
            .map(
                (item) => `
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">${item.name}</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${item.quantity}</td>
            <td style="border: 1px solid #ddd; padding: 8px;">₹${item.price.toFixed(2)}</td>
          </tr>
          `
            )
            .join("")}
          <tr>
            <td colspan="2" style="border: 1px solid #ddd; padding: 8px; text-align: right;"><strong>Total:</strong></td>
            <td style="border: 1px solid #ddd; padding: 8px;"><strong>₹${totalAmount.toFixed(2)}</strong></td>
          </tr>
        </tbody>
      </table>
  
      <p style="margin-top: 20px;"><strong>Transaction ID:</strong> ${transactionId}</p>
      <p><strong>Payment Status:</strong> <span style="color: ${statusColor}; text-transform: capitalize;">${paymentStatus}</span></p>
  
      <p style="margin-top: 30px;">Thank you for shopping with us.</p>
      <p>Best regards,<br />Your Company Team</p>
    </div>
    `;
};
