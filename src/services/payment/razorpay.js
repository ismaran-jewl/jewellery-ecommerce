// src/services/payment/razorpay.js
import crypto from "crypto";

export const createRazorpayOrder = async (amount, currency = "INR", receipt) => {
  const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const RAZORPAY_SECRET_KEY = process.env.RAZORPAY_SECRET_KEY;

  if (!RAZORPAY_KEY_ID || !RAZORPAY_SECRET_KEY) {
    throw new Error("Razorpay credentials are not configured");
  }

  try {
    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_SECRET_KEY}`).toString("base64")}`,
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100), // Convert to paise
        currency,
        receipt,
        notes: {
          type: "ecommerce_order",
        },
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create Razorpay order");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Razorpay order creation error:", error);
    throw error;
  }
};

export const verifyRazorpayPayment = (paymentId, orderId, signature) => {
  const RAZORPAY_SECRET_KEY = process.env.RAZORPAY_SECRET_KEY;

  if (!RAZORPAY_SECRET_KEY) {
    throw new Error("Razorpay secret key is not configured");
  }

  const message = `${orderId}|${paymentId}`;
  const expected_signature = crypto
    .createHmac("sha256", RAZORPAY_SECRET_KEY)
    .update(message)
    .digest("hex");

  return expected_signature === signature;
};

export const getRazorpayPaymentDetails = async (paymentId) => {
  const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const RAZORPAY_SECRET_KEY = process.env.RAZORPAY_SECRET_KEY;

  if (!RAZORPAY_KEY_ID || !RAZORPAY_SECRET_KEY) {
    throw new Error("Razorpay credentials are not configured");
  }

  try {
    const response = await fetch(`https://api.razorpay.com/v1/payments/${paymentId}`, {
      method: "GET",
      headers: {
        Authorization: `Basic ${Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_SECRET_KEY}`).toString("base64")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch payment details");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Razorpay payment details error:", error);
    throw error;
  }
};
