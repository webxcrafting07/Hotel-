import nodemailer from 'nodemailer';
import { ENV } from '../config/env';

const transporter = nodemailer.createTransport({
  host: ENV.SMTP_HOST,
  port: ENV.SMTP_PORT,
  secure: ENV.SMTP_PORT === 465,
  auth: {
    user: ENV.SMTP_USER,
    pass: ENV.SMTP_PASS,
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  attachments?: Array<{ filename: string; path?: string; content?: Buffer; contentType?: string }>;
}

export async function sendEmail(options: EmailOptions): Promise<void> {
  await transporter.sendMail({
    from: `"${ENV.FROM_NAME}" <${ENV.FROM_EMAIL}>`,
    ...options,
  });
}

export function bookingConfirmationTemplate(booking: {
  bookingNumber: string;
  guestName: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  totalAmount: number;
}): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8">
<style>
body { font-family: Georgia, serif; background: #f5f5f5; margin: 0; padding: 20px; }
.container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,.1); }
.header { background: linear-gradient(135deg,#1a1a2e,#16213e); color: white; padding: 40px 30px; text-align: center; }
.header h1 { margin: 0; font-size: 28px; color: #C9A84C; letter-spacing: 2px; }
.body { padding: 30px; }
.booking-box { background: #f8f4ed; border-left: 4px solid #C9A84C; padding: 20px; border-radius: 0 8px 8px 0; margin: 20px 0; }
.detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #e0d5c1; }
.total { background: #C9A84C; color: white; padding: 15px 20px; border-radius: 8px; text-align: center; font-size: 20px; margin: 20px 0; }
.footer { background: #1a1a2e; color: #888; text-align: center; padding: 20px; font-size: 12px; }
</style>
</head>
<body>
<div class="container">
<div class="header"><h1>HOTEL THE ANAND</h1><p>Booking Confirmation</p></div>
<div class="body">
<p>Dear ${booking.guestName},</p>
<p>Your booking has been confirmed! We look forward to welcoming you.</p>
<div class="booking-box">
<div class="detail-row"><span>Booking Number</span><strong>${booking.bookingNumber}</strong></div>
<div class="detail-row"><span>Room</span><strong>${booking.roomName}</strong></div>
<div class="detail-row"><span>Check-in</span><strong>${booking.checkIn}</strong></div>
<div class="detail-row"><span>Check-out</span><strong>${booking.checkOut}</strong></div>
<div class="detail-row"><span>Duration</span><strong>${booking.nights} Night(s)</strong></div>
</div>
<div class="total">Total Amount: ${booking.totalAmount}</div>
</div>
<div class="footer"><p>Hotel The Anand | Gandhi Labour Foundation Road, Puri, Odisha - 752001</p></div>
</div>
</body></html>`;
}

export function invoiceTemplate(booking: any): string {
  const invoice = booking.invoice;
  if (!invoice) return '';
  
  const checkInDate = new Date(booking.checkIn).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  const checkOutDate = new Date(booking.checkOut).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  const issueDate = new Date(invoice.issueDate || new Date()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  
  const isPaid = booking.paymentStatus === 'PAID';

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
  body { margin: 0; padding: 0; background-color: #f3f4f6; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; }
  table { border-collapse: collapse; width: 100%; }
  .wrapper { width: 100%; table-layout: fixed; background-color: #f3f4f6; padding: 40px 0; }
  .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
  .header { background-color: #111827; padding: 40px 30px; text-align: center; }
  .header h1 { margin: 0; color: #D4AF37; font-family: 'Georgia', serif; font-size: 32px; letter-spacing: 2px; font-weight: normal; }
  .header p { margin: 10px 0 0 0; color: #9ca3af; font-size: 14px; letter-spacing: 1px; text-transform: uppercase; }
  .content { padding: 40px 30px; }
  .greeting { margin-bottom: 30px; }
  .greeting h2 { margin: 0 0 10px 0; color: #111827; font-size: 20px; }
  .greeting p { margin: 0; color: #4b5563; font-size: 15px; line-height: 1.6; }
  .info-grid { width: 100%; margin-bottom: 30px; }
  .info-grid td { padding: 15px 0; border-bottom: 1px solid #f3f4f6; vertical-align: top; }
  .info-label { color: #6b7280; font-size: 12px; text-transform: uppercase; font-weight: bold; letter-spacing: 0.5px; margin-bottom: 5px; display: block; }
  .info-value { color: #111827; font-size: 15px; font-weight: 500; }
  .invoice-table { width: 100%; margin-bottom: 30px; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; }
  .invoice-table th { background-color: #f9fafb; color: #4b5563; font-size: 13px; text-transform: uppercase; font-weight: 600; padding: 15px; text-align: left; border-bottom: 1px solid #e5e7eb; }
  .invoice-table td { padding: 15px; color: #111827; font-size: 15px; border-bottom: 1px solid #e5e7eb; }
  .invoice-table .amount { text-align: right; }
  .totals-table { width: 100%; max-width: 300px; float: right; margin-bottom: 40px; }
  .totals-table td { padding: 10px 0; color: #4b5563; font-size: 15px; text-align: right; }
  .totals-table .total-row td { padding: 15px 0; color: #111827; font-size: 20px; font-weight: bold; border-top: 2px solid #e5e7eb; }
  .status-badge { display: inline-block; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; }
  .status-paid { background-color: #d1fae5; color: #065f46; }
  .status-pending { background-color: #fee2e2; color: #991b1b; }
  .clear { clear: both; }
  .footer { background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb; }
  .footer p { margin: 0 0 10px 0; color: #6b7280; font-size: 13px; line-height: 1.5; }
  .footer strong { color: #111827; }
</style>
</head>
<body>
<div class="wrapper">
  <div class="container">
    
    <div class="header">
      <h1>HOTEL THE ANAND</h1>
      <p>Luxury & Comfort</p>
    </div>

    <div class="content">
      <div class="greeting">
        <h2>Dear ${booking.guestName},</h2>
        <p>Thank you for choosing Hotel The Anand for your stay. Please find your official invoice attached below.</p>
      </div>

      <table class="info-grid">
        <tr>
          <td width="50%">
            <span class="info-label">Invoice Number</span>
            <span class="info-value">${invoice.invoiceNumber}</span>
          </td>
          <td width="50%">
            <span class="info-label">Booking Reference</span>
            <span class="info-value">#${booking.bookingNumber}</span>
          </td>
        </tr>
        <tr>
          <td>
            <span class="info-label">Date of Issue</span>
            <span class="info-value">${issueDate}</span>
          </td>
          <td>
            <span class="info-label">Payment Status</span>
            <span class="status-badge ${isPaid ? 'status-paid' : 'status-pending'}">
              ${isPaid ? 'PAID IN FULL' : 'PAYMENT PENDING'}
            </span>
          </td>
        </tr>
      </table>

      <table class="invoice-table" cellspacing="0" cellpadding="0">
        <thead>
          <tr>
            <th>Stay Details</th>
            <th class="amount">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong>${booking.room?.name || 'Room'}</strong><br>
              <span style="color: #6b7280; font-size: 13px;">${checkInDate} — ${checkOutDate} (${booking.nights} Nights)</span>
            </td>
            <td class="amount">INR ${parseFloat(booking.roomPrice.toString()).toFixed(2)}</td>
          </tr>
          ${booking.extraBedPrice > 0 ? `
          <tr>
            <td>
              <strong>Extra Bed</strong><br>
              <span style="color: #6b7280; font-size: 13px;">For ${booking.nights} Nights</span>
            </td>
            <td class="amount">INR ${parseFloat(booking.extraBedPrice.toString()).toFixed(2)}</td>
          </tr>
          ` : ''}
        </tbody>
      </table>

      <table class="totals-table" cellspacing="0" cellpadding="0">
        <tr>
          <td width="50%">Subtotal</td>
          <td width="50%">INR ${parseFloat(invoice.subtotal.toString()).toFixed(2)}</td>
        </tr>
        ${booking.discountAmount > 0 ? `
        <tr>
          <td style="color: #059669;">Discount</td>
          <td style="color: #059669;">- INR ${parseFloat(booking.discountAmount.toString()).toFixed(2)}</td>
        </tr>` : ''}
        <tr>
          <td>CGST (9%)</td>
          <td>INR ${parseFloat(invoice.cgst.toString()).toFixed(2)}</td>
        </tr>
        <tr>
          <td>SGST (9%)</td>
          <td>INR ${parseFloat(invoice.sgst.toString()).toFixed(2)}</td>
        </tr>
        <tr class="total-row">
          <td>Total</td>
          <td>INR ${parseFloat(invoice.total.toString()).toFixed(2)}</td>
        </tr>
      </table>
      <div class="clear"></div>

      <div style="margin-top: 20px; padding: 20px; background-color: #f8fafc; border-radius: 8px; border-left: 4px solid #D4AF37;">
        <p style="margin: 0; color: #475569; font-size: 14px; line-height: 1.6;">
          <strong>Need assistance?</strong><br>
          Contact our front desk directly at +91 9296985454 or reply to this email. We hope to welcome you back soon!
        </p>
      </div>

    </div>

    <div class="footer">
      <p><strong>Hotel The Anand</strong><br>
      Gandhi Labour Foundation Road, Puri, Odisha - 752001<br>
      hoteltheanand5454@gmail.com</p>
      <p style="margin-top: 20px; font-size: 11px; color: #9ca3af;">
        This is a computer-generated invoice and does not require a physical signature.<br>
        &copy; ${new Date().getFullYear()} Hotel The Anand. All rights reserved.
      </p>
    </div>

  </div>
</div>
</body>
</html>`;
}