export const paymentService = {
  getPayments: async (page = 1, limit = 24) => {
    // Backend API for listing payments does not exist.
    // Throw an error to display properly in the UI.
    throw new Error('Payment listing API is not currently exposed by the backend.');
  },

  getPaymentDetails: async (id) => {
    // Backend API for payment details does not exist.
    throw new Error('Payment details API is not currently exposed by the backend.');
  }
};
