// src/lib/validators.js

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_MIN_LENGTH = 8;
const PHONE_REGEX = /^[0-9]{10}$/;
const POSTAL_CODE_REGEX = /^[0-9]{6}$/;

export const validateEmail = (email) => {
  if (!email) return { valid: false, error: "Email is required" };
  if (!EMAIL_REGEX.test(email)) return { valid: false, error: "Invalid email format" };
  return { valid: true };
};

export const validatePassword = (password) => {
  if (!password) return { valid: false, error: "Password is required" };
  if (password.length < PASSWORD_MIN_LENGTH) {
    return { valid: false, error: `Password must be at least ${PASSWORD_MIN_LENGTH} characters` };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: "Password must contain at least one uppercase letter" };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, error: "Password must contain at least one lowercase letter" };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, error: "Password must contain at least one number" };
  }
  return { valid: true };
};

export const validateName = (name) => {
  if (!name || name.trim().length === 0) {
    return { valid: false, error: "Name is required" };
  }
  if (name.length < 2) return { valid: false, error: "Name must be at least 2 characters" };
  if (name.length > 100) return { valid: false, error: "Name must be less than 100 characters" };
  return { valid: true };
};

export const validatePhoneNumber = (phone) => {
  if (!phone) return { valid: false, error: "Phone number is required" };
  if (!PHONE_REGEX.test(phone.replace(/\D/g, ""))) {
    return { valid: false, error: "Phone number must be 10 digits" };
  }
  return { valid: true };
};

export const validateAddress = (address) => {
  if (!address || address.trim().length === 0) {
    return { valid: false, error: "Address is required" };
  }
  if (address.length < 5) return { valid: false, error: "Address must be at least 5 characters" };
  if (address.length > 500) return { valid: false, error: "Address is too long" };
  return { valid: true };
};

export const validateCity = (city) => {
  if (!city || city.trim().length === 0) {
    return { valid: false, error: "City is required" };
  }
  if (city.length < 2) return { valid: false, error: "City must be at least 2 characters" };
  if (city.length > 50) return { valid: false, error: "City name is too long" };
  return { valid: true };
};

export const validatePostalCode = (postalCode) => {
  if (!postalCode) return { valid: false, error: "Postal code is required" };
  if (!POSTAL_CODE_REGEX.test(postalCode.replace(/\D/g, ""))) {
    return { valid: false, error: "Postal code must be 6 digits" };
  }
  return { valid: true };
};

export const validateCountry = (country) => {
  if (!country || country.trim().length === 0) {
    return { valid: false, error: "Country is required" };
  }
  return { valid: true };
};

export const validatePrice = (price) => {
  if (price === null || price === undefined) return { valid: false, error: "Price is required" };
  if (isNaN(price)) return { valid: false, error: "Price must be a number" };
  if (price < 0) return { valid: false, error: "Price cannot be negative" };
  return { valid: true };
};

export const validateQuantity = (quantity) => {
  if (quantity === null || quantity === undefined) {
    return { valid: false, error: "Quantity is required" };
  }
  if (!Number.isInteger(quantity)) return { valid: false, error: "Quantity must be an integer" };
  if (quantity < 1) return { valid: false, error: "Quantity must be at least 1" };
  return { valid: true };
};

export const validateCheckoutData = (data) => {
  const errors = {};

  const emailValidation = validateEmail(data.email);
  if (!emailValidation.valid) errors.email = emailValidation.error;

  const nameValidation = validateName(data.name);
  if (!nameValidation.valid) errors.name = nameValidation.error;

  const phoneValidation = validatePhoneNumber(data.phone);
  if (!phoneValidation.valid) errors.phone = phoneValidation.error;

  const addressValidation = validateAddress(data.address);
  if (!addressValidation.valid) errors.address = addressValidation.error;

  const cityValidation = validateCity(data.city);
  if (!cityValidation.valid) errors.city = cityValidation.error;

  const postalCodeValidation = validatePostalCode(data.postalCode);
  if (!postalCodeValidation.valid) errors.postalCode = postalCodeValidation.error;

  const countryValidation = validateCountry(data.country);
  if (!countryValidation.valid) errors.country = countryValidation.error;

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

export const sanitizeString = (str) => {
  if (typeof str !== "string") return str;
  return str
    .trim()
    .replace(/[<>\"']/g, (char) => {
      const escapeMap = { "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#x27;" };
      return escapeMap[char];
    });
};

export const sanitizeCheckoutData = (data) => {
  return {
    email: sanitizeString(data.email),
    name: sanitizeString(data.name),
    phone: data.phone?.replace(/\D/g, ""),
    address: sanitizeString(data.address),
    city: sanitizeString(data.city),
    postalCode: data.postalCode?.replace(/\D/g, ""),
    country: sanitizeString(data.country),
  };
};
