export const orderConfirmationTemplate = ({
  customerName,
  orderNumber,
  orderDate,
  items,
  totalAmount,
  shippingAddress,
  trackOrderUrl
}) => {
  const itemsHtml = items.map((item, index) => {
    const isLast = index === items.length - 1;
    const borderStyle = isLast ? '' : 'border-bottom: 1px solid #F0E8DD;';
    return `
    <tr>
      <td style="padding: 20px 10px; ${borderStyle} vertical-align: middle;">
        <p style="margin: 0 0 6px; font-weight: 600; color: #2C181D; font-size: 16px;">${item.name}</p>
        <p style="margin: 0; font-size: 13px; color: #8A7A7D; font-weight: 500;">
          <span style="background-color: #F8F5F0; padding: 3px 8px; border-radius: 4px; margin-right: 10px;">Qty: ${item.quantity}</span>
          ${item.size ? `<span style="background-color: #F8F5F0; padding: 3px 8px; border-radius: 4px;">Size: ${item.size}</span>` : ''}
        </p>
      </td>
      <td style="padding: 20px 10px; ${borderStyle} text-align: right; vertical-align: middle; color: #432227; font-weight: 700; font-size: 16px;">
        ₹${item.price}
      </td>
    </tr>
    `;
  }).join('');

  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Your Rajwadi Order is Confirmed</title>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>
  body, table, td, p, a, li, blockquote {
    -webkit-text-size-adjust: 100%;
    -ms-text-size-adjust: 100%;
  }
</style>
</head>
<body style="margin: 0; padding: 0; font-family: 'Plus Jakarta Sans', Helvetica, Arial, sans-serif; background-color: #F8F5F0; color: #2C181D; -webkit-font-smoothing: antialiased;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F8F5F0; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" max-width="650" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(67, 34, 39, 0.08); max-width: 650px; width: 100%; border: 1px solid #F0E8DD;">
          
          <!-- Header -->
          <tr>
            <td align="center" style="background: linear-gradient(135deg, #432227 0%, #2A1115 100%); padding: 50px 30px;">
              <h1 style="color: #D4C098; font-size: 32px; letter-spacing: 6px; margin: 0; font-family: 'Playfair Display', Georgia, serif; text-transform: uppercase; font-weight: 600;">RAJWADI</h1>
              <p style="color: rgba(212, 192, 152, 0.8); font-size: 11px; letter-spacing: 3px; margin: 12px 0 0; text-transform: uppercase; font-weight: 500;">Premium Ethnic Wear</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 50px 45px 30px;">
              <h2 style="color: #432227; font-size: 28px; margin: 0 0 20px; font-family: 'Playfair Display', Georgia, serif; font-weight: 600;">Order Confirmed!</h2>
              <p style="font-size: 16px; line-height: 1.8; color: #554347; margin: 0 0 35px; font-weight: 400;">
                Dear <span style="font-weight: 600; color: #432227;">${customerName}</span>,<br><br>
                Thank you for choosing Rajwadi. We have successfully received your payment and your beautiful ethnic wear is being prepared. We will notify you the moment it ships.
              </p>

              <!-- Order Summary Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(to right, #FAF7F2, #FFFDFB); border: 1px solid #EBE3D5; border-radius: 12px; margin-bottom: 40px; border-left: 4px solid #D4C098;">
                <tr>
                  <td style="padding: 24px 30px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td width="50%" valign="top">
                          <p style="margin: 0 0 6px; font-size: 12px; color: #8A7A7D; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Order Number</p>
                          <p style="margin: 0; font-size: 16px; color: #432227; font-weight: 700;">${orderNumber}</p>
                        </td>
                        <td width="50%" valign="top" style="text-align: right;">
                          <p style="margin: 0 0 6px; font-size: 12px; color: #8A7A7D; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Order Date</p>
                          <p style="margin: 0; font-size: 16px; color: #432227; font-weight: 600;">${orderDate}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Items Table -->
              <h3 style="color: #432227; font-size: 20px; font-family: 'Playfair Display', Georgia, serif; margin: 0 0 20px; font-weight: 600;">Order Details</h3>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 40px; border-collapse: separate; border-spacing: 0;">
                ${itemsHtml}
                <tr>
                  <td style="padding: 25px 15px 10px; border-top: 2px solid #F0E8DD; text-align: right; color: #8A7A7D; font-size: 15px; font-weight: 500;">Total Amount</td>
                  <td style="padding: 25px 15px 10px; border-top: 2px solid #F0E8DD; text-align: right; color: #432227; font-size: 24px; font-weight: 700;">₹${totalAmount}</td>
                </tr>
              </table>

              <!-- Shipping Address -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 45px;">
                <tr>
                  <td style="background-color: #FCFAF7; border: 1px solid #F0E8DD; border-radius: 12px; padding: 30px;">
                    <h3 style="color: #432227; font-size: 18px; font-family: 'Playfair Display', Georgia, serif; margin: 0 0 15px; font-weight: 600;">Shipping To</h3>
                    <p style="font-size: 15px; line-height: 1.7; color: #554347; margin: 0;">
                      <strong style="color: #2C181D;">${shippingAddress.fullName}</strong><br>
                      ${shippingAddress.addressLine1}${shippingAddress.addressLine2 ? ', ' + shippingAddress.addressLine2 : ''}<br>
                      ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.postalCode}<br>
                      ${shippingAddress.phone}
                    </p>
                  </td>
                </tr>
              </table>

              <!-- CTA -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="${trackOrderUrl}" style="background: linear-gradient(135deg, #432227 0%, #2A1115 100%); color: #D4C098; display: inline-block; padding: 16px 40px; text-decoration: none; border-radius: 50px; font-weight: 600; text-transform: uppercase; letter-spacing: 1.5px; font-size: 14px; box-shadow: 0 8px 20px rgba(67, 34, 39, 0.2);">Track Your Order</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="background-color: #F8F5F0; padding: 40px 30px; border-top: 1px solid #EBE3D5;">
              <p style="margin: 0 0 15px; font-size: 13px; color: #8A7A7D; line-height: 1.6;">
                If you have any questions, please reply to this email or contact our support team. We're here to help!
              </p>
              <div style="margin: 20px 0;">
                <span style="display: inline-block; width: 30px; height: 1px; background-color: #D4C098; vertical-align: middle;"></span>
                <span style="display: inline-block; margin: 0 10px; color: #D4C098; font-size: 20px; font-family: 'Playfair Display', serif;">&sim;</span>
                <span style="display: inline-block; width: 30px; height: 1px; background-color: #D4C098; vertical-align: middle;"></span>
              </div>
              <p style="margin: 0; font-size: 12px; color: #AFA2A5; letter-spacing: 0.5px;">
                &copy; ${new Date().getFullYear()} Rajwadi. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};
