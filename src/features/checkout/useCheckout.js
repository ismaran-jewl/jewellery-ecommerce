// Checkout logic
export const checkoutSlice = {
  state: {
    formData: {},
    shippingMethod: '',
    paymentMethod: '',
  },
  updateFormData: (data) => {
    // Update checkout form data
  },
  selectShipping: (method) => {
    // Select shipping method
  },
  selectPayment: (method) => {
    // Select payment method
  },
};

// useCheckout hook
export const useCheckout = () => {
  const formData = {};
  const shippingMethods = [
    { id: 'standard', name: 'Standard Shipping', cost: 0 },
    { id: 'express', name: 'Express Shipping', cost: 500 },
  ];
  const paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card' },
    { id: 'upi', name: 'UPI' },
  ];

  const updateFormData = (newData) => {
    console.log("Form data updated:", newData);
  };

  const submitCheckout = () => {
    console.log("Checkout submitted");
  };

  return {
    formData,
    shippingMethods,
    paymentMethods,
    updateFormData,
    submitCheckout,
  };
};

export default useCheckout;
