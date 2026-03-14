// src/services/email/templates.js

export const getOrderConfirmationEmail = (order, user) => {
  const orderItemsHtml = order.orderItems
    .map(
      (item) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.name}</td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">×${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">₹${(item.price).toFixed(2)}</td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">₹${(item.price * item.quantity).toFixed(2)}</td>
    </tr>
  `
    )
    .join("");

  return {
    subject: `Order Confirmation - ${order._id}`,
    html: `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2D5A40; color: white; padding: 20px; text-align: center; border-radius: 4px 4px 0 0; }
          .content { border: 1px solid #ddd; padding: 20px; }
          .section { margin: 20px 0; }
          .section-title { font-size: 18px; font-weight: bold; margin-bottom: 10px; color: #2D5A40; }
          table { width: 100%; border-collapse: collapse; }
          .total-row { font-weight: bold; font-size: 16px; }
          .footer { background: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #666; }
          .cta-button { display: inline-block; background: #2D5A40; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✨ Order Confirmation</h1>
          </div>
          
          <div class="content">
            <p>Hi ${user.name},</p>
            <p>Thank you for your order! We're excited to process your jewellery purchase.</p>
            
            <div class="section">
              <div class="section-title">Order Details</div>
              <p><strong>Order ID:</strong> ${order._id}</p>
              <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
              <p><strong>Order Status:</strong> ${order.status}</p>
            </div>

            <div class="section">
              <div class="section-title">Items Ordered</div>
              <table>
                <thead>
                  <tr style="background: #f5f5f5;">
                    <th style="padding: 10px; text-align: left;">Product</th>
                    <th style="padding: 10px; text-align: center;">Qty</th>
                    <th style="padding: 10px; text-align: right;">Price</th>
                    <th style="padding: 10px; text-align: right;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${orderItemsHtml}
                </tbody>
              </table>
            </div>

            <div class="section">
              <div class="section-title">Order Summary</div>
              <table>
                <tr>
                  <td style="padding: 8px;">Items Total:</td>
                  <td style="text-align: right; padding: 8px;">₹${order.itemsPrice.toFixed(2)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px;">Shipping:</td>
                  <td style="text-align: right; padding: 8px;">₹${order.shippingPrice.toFixed(2)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px;">Tax:</td>
                  <td style="text-align: right; padding: 8px;">₹${order.taxPrice.toFixed(2)}</td>
                </tr>
                <tr class="total-row" style="border-top: 2px solid #ddd;">
                  <td style="padding: 8px;">Total Amount:</td>
                  <td style="text-align: right; padding: 8px;">₹${order.totalPrice.toFixed(2)}</td>
                </tr>
              </table>
            </div>

            <div class="section">
              <div class="section-title">Shipping Address</div>
              <p>
                ${order.shippingAddress.address}<br>
                ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}<br>
                ${order.shippingAddress.country}
              </p>
            </div>

            <div class="section" style="text-align: center;">
              <a href="${process.env.NEXTAUTH_URL}/user/orders/${order._id}" class="cta-button">View Order Details</a>
            </div>

            <p>We'll send you a tracking number once your order ships. If you have any questions, feel free to contact us.</p>
            <p>Thank you for shopping with us!</p>
          </div>

          <div class="footer">
            <p>&copy; 2026 Jewellery E-Commerce. All rights reserved.</p>
            <p>This is an automated email, please do not reply directly.</p>
          </div>
        </div>
      </body>
    </html>
    `,
    text: `
Order Confirmation - ${order._id}

Hi ${user.name},

Thank you for your order! Here are your order details:

Order ID: ${order._id}
Order Date: ${new Date(order.createdAt).toLocaleDateString()}
Status: ${order.status}

Items:
${order.orderItems.map((item) => `${item.name} x${item.quantity} = ₹${(item.price * item.quantity).toFixed(2)}`).join("\n")}

Total: ₹${order.totalPrice.toFixed(2)}

Shipping Address:
${order.shippingAddress.address}
${order.shippingAddress.city}, ${order.shippingAddress.postalCode}
${order.shippingAddress.country}

View your order: ${process.env.NEXTAUTH_URL}/user/orders/${order._id}

Thank you for shopping with us!
    `,
  };
};

export const getOrderShippingEmail = (order, user, trackingNumber = null) => {
  return {
    subject: `Your Order is Shipping - ${order._id}`,
    html: `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2D5A40; color: white; padding: 20px; text-align: center; border-radius: 4px 4px 0 0; }
          .content { border: 1px solid #ddd; padding: 20px; }
          .section { margin: 20px 0; }
          .section-title { font-size: 18px; font-weight: bold; margin-bottom: 10px; color: #2D5A40; }
          .tracking-box { background: #f5f5f5; padding: 15px; border-left: 4px solid #2D5A40; margin: 15px 0; }
          .footer { background: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📦 Your Order is Shipping!</h1>
          </div>
          
          <div class="content">
            <p>Hi ${user.name},</p>
            <p>Great news! Your order has been shipped and is on its way to you.</p>
            
            <div class="section">
              <div class="section-title">Order ID: ${order._id}</div>
              <p>Shipped Date: ${new Date().toLocaleDateString()}</p>
            </div>

            ${trackingNumber ? `
              <div class="tracking-box">
                <p style="margin: 0 0 10px 0; font-weight: bold;">Tracking Number:</p>
                <p style="margin: 0; font-size: 16px; font-weight: bold; color: #2D5A40;">${trackingNumber}</p>
              </div>
            ` : ''}

            <div class="section">
              <div class="section-title">What's Next?</div>
              <p>
                Your package will arrive within 3-5 business days. You can track your order status anytime by visiting:
              </p>
              <p>
                <a href="${process.env.NEXTAUTH_URL}/user/orders/${order._id}" style="color: #2D5A40; text-decoration: none;">
                  View Shipment Status →
                </a>
              </p>
            </div>

            <p>Thank you for your patience, and we hope you love your new jewellery!</p>
          </div>

          <div class="footer">
            <p>&copy; 2026 Jewellery E-Commerce. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
    `,
    text: `
Your Order is Shipping - ${order._id}

Hi ${user.name},

Great news! Your order has been shipped.

${trackingNumber ? `Tracking Number: ${trackingNumber}\n` : ''}

View your order: ${process.env.NEXTAUTH_URL}/user/orders/${order._id}

Thank you for shopping with us!
    `,
  };
};

export const getPasswordResetEmail = (user, resetUrl) => {
  return {
    subject: "Password Reset Request - Jewellery E-Commerce",
    html: `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2D5A40; color: white; padding: 20px; text-align: center; border-radius: 4px 4px 0 0; }
          .content { border: 1px solid #ddd; padding: 20px; }
          .cta-button { display: inline-block; background: #2D5A40; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; font-weight: bold; }
          .footer { background: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #666; }
          .warning { background: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset Request</h1>
          </div>
          
          <div class="content">
            <p>Hi ${user.name},</p>
            <p>We received a request to reset your password. Click the button below to create a new password:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" class="cta-button">Reset Password</a>
            </div>

            <p style="text-align: center; color: #666;">Or copy this link:</p>
            <p style="text-align: center; word-break: break-all; color: #2D5A40;">${resetUrl}</p>

            <div class="warning">
              <p style="margin: 0;"><strong>⚠️ Security Notice:</strong> This link will expire in 24 hours. If you didn't request this password reset, you can safely ignore this email.</p>
            </div>

            <p>For security reasons, never share this link with anyone.</p>
          </div>

          <div class="footer">
            <p>&copy; 2026 Jewellery E-Commerce. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
    `,
    text: `
Password Reset Request

Hi ${user.name},

Click this link to reset your password:
${resetUrl}

This link expires in 24 hours. If you didn't request this, you can ignore this email.
    `,
  };
};

export const getWelcomeEmail = (user) => {
  return {
    subject: "Welcome to Jewellery E-Commerce!",
    html: `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2D5A40; color: white; padding: 20px; text-align: center; border-radius: 4px 4px 0 0; }
          .content { border: 1px solid #ddd; padding: 20px; }
          .feature { margin: 15px 0; }
          .feature-title { font-weight: bold; color: #2D5A40; }
          .cta-button { display: inline-block; background: #2D5A40; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; }
          .footer { background: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✨ Welcome to Jewellery E-Commerce!</h1>
          </div>
          
          <div class="content">
            <p>Hi ${user.name},</p>
            <p>Thank you for creating an account with us! We're thrilled to have you join our community of jewellery lovers.</p>
            
            <div class="feature">
              <p class="feature-title">🎁 Exclusive Benefits:</p>
              <ul>
                <li>Access to exclusive collections</li>
                <li>Early access to new arrivals</li>
                <li>Personalized recommendations</li>
                <li>Secure wishlist and saved items</li>
                <li>Easy order tracking</li>
              </ul>
            </div>

            <div class="feature">
              <p class="feature-title">🛍️ Get Started:</p>
              <p>
                <a href="${process.env.NEXTAUTH_URL}/shop" class="cta-button">Browse Our Collections</a>
              </p>
            </div>

            <p>If you have any questions or need assistance, our customer service team is here to help!</p>
          </div>

          <div class="footer">
            <p>&copy; 2026 Jewellery E-Commerce. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
    `,
    text: `
Welcome to Jewellery E-Commerce!

Hi ${user.name},

Thank you for creating an account! Browse our collections:
${process.env.NEXTAUTH_URL}/shop

Happy shopping!
    `,
  };
};
