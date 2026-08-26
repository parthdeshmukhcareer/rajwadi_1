export class DomainError extends Error {
  constructor(code, message, statusCode = 400) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.name = 'DomainError';
  }
}

export const Errors = {
  VALIDATION_ERROR: (msg) => new DomainError('VALIDATION_ERROR', msg, 400),
  INVALID_CREDENTIALS: () => new DomainError('INVALID_CREDENTIALS', 'Invalid email or password.', 401),
  EMAIL_ALREADY_EXISTS: () => new DomainError('EMAIL_ALREADY_EXISTS', 'Email already exists.', 409),
  PHONE_ALREADY_EXISTS: () => new DomainError('PHONE_ALREADY_EXISTS', 'Phone already exists.', 409),
  AUTHENTICATION_REQUIRED: () => new DomainError('AUTHENTICATION_REQUIRED', 'Authentication required.', 401),
  FORBIDDEN: () => new DomainError('FORBIDDEN', 'Access denied.', 403),
  USER_INACTIVE: () => new DomainError('USER_INACTIVE', 'User account is inactive.', 403),
  NOT_FOUND: (entity) => new DomainError('NOT_FOUND', `${entity} not found.`, 404),
  ADDRESS_NOT_FOUND: () => new DomainError('ADDRESS_NOT_FOUND', 'Address not found.', 404),
  CATEGORY_NOT_FOUND: () => new DomainError('CATEGORY_NOT_FOUND', 'Category not found.', 404),
  PRODUCT_NOT_FOUND: () => new DomainError('PRODUCT_NOT_FOUND', 'Product not found.', 404),
  VARIANT_NOT_FOUND: () => new DomainError('VARIANT_NOT_FOUND', 'Variant not found.', 404),
  SKU_ALREADY_EXISTS: () => new DomainError('SKU_ALREADY_EXISTS', 'SKU already exists.', 409),
  SLUG_ALREADY_EXISTS: () => new DomainError('SLUG_ALREADY_EXISTS', 'Slug already exists.', 409),
  INVALID_STOCK: (msg) => new DomainError('INVALID_STOCK', msg || 'Invalid stock operation.', 400),
  INVALID_PRICE: (msg) => new DomainError('INVALID_PRICE', msg || 'Invalid price.', 400),
  IMAGE_NOT_FOUND: () => new DomainError('IMAGE_NOT_FOUND', 'Image not found.', 404),
  INVALID_IMAGE: (msg) => new DomainError('INVALID_IMAGE', msg || 'Invalid image format or size.', 400),
  IMAGE_UPLOAD_FAILED: (msg) => new DomainError('IMAGE_UPLOAD_FAILED', msg || 'Image upload failed.', 500),
  CART_NOT_FOUND: () => new DomainError('CART_NOT_FOUND', 'Cart not found.', 404),
  CART_ITEM_NOT_FOUND: () => new DomainError('CART_ITEM_NOT_FOUND', 'Cart item not found.', 404),
  EMPTY_CART: () => new DomainError('EMPTY_CART', 'Cart is empty.', 400),
  PRODUCT_NOT_AVAILABLE: (msg) => new DomainError('PRODUCT_NOT_AVAILABLE', msg || 'Product is not available.', 400),
  VARIANT_NOT_AVAILABLE: (msg) => new DomainError('VARIANT_NOT_AVAILABLE', msg || 'Variant is not available.', 400),
  INVALID_QUANTITY: (msg) => new DomainError('INVALID_QUANTITY', msg || 'Invalid quantity.', 400),
  INSUFFICIENT_STOCK: (msg) => new DomainError('INSUFFICIENT_STOCK', msg || 'Insufficient stock.', 400),
  COUPON_NOT_FOUND: () => new DomainError('COUPON_NOT_FOUND', 'Coupon not found.', 404),
  COUPON_INVALID: (msg) => new DomainError('COUPON_INVALID', msg || 'Invalid coupon.', 400),
  COUPON_EXPIRED: () => new DomainError('COUPON_EXPIRED', 'Coupon has expired.', 400),
  COUPON_NOT_STARTED: () => new DomainError('COUPON_NOT_STARTED', 'Coupon is not yet active.', 400),
  COUPON_USAGE_LIMIT_REACHED: () => new DomainError('COUPON_USAGE_LIMIT_REACHED', 'Coupon usage limit reached.', 400),
  COUPON_MINIMUM_NOT_MET: (msg) => new DomainError('COUPON_MINIMUM_NOT_MET', msg || 'Minimum order amount not met.', 400),
  COUPON_ALREADY_EXISTS: () => new DomainError('COUPON_ALREADY_EXISTS', 'Coupon code already exists.', 409),
  ORDER_NOT_FOUND: () => new DomainError('ORDER_NOT_FOUND', 'Order not found.', 404),
  OUT_OF_STOCK: (msg) => new DomainError('OUT_OF_STOCK', msg || 'Out of stock.', 400),
  INVALID_ORDER_STATE: (msg) => new DomainError('INVALID_ORDER_STATE', msg || 'Invalid order state.', 400),
  ORDER_EXPIRED: () => new DomainError('ORDER_EXPIRED', 'Order is expired.', 400),
  ORDER_ALREADY_CANCELLED: () => new DomainError('ORDER_ALREADY_CANCELLED', 'Order is already cancelled.', 400),
  ADDRESS_NOT_FOUND: () => new DomainError('ADDRESS_NOT_FOUND', 'Address not found.', 404),
  CHECKOUT_CONFLICT: (msg) => new DomainError('CHECKOUT_CONFLICT', msg || 'Checkout conflict.', 409),
  SHIPPING_CALCULATION_ERROR: () => new DomainError('SHIPPING_CALCULATION_ERROR', 'Error calculating shipping.', 500),
  
  PAYMENT_NOT_FOUND: () => new DomainError('PAYMENT_NOT_FOUND', 'Payment not found.', 404),
  PAYMENT_ALREADY_COMPLETED: () => new DomainError('PAYMENT_ALREADY_COMPLETED', 'Payment already completed.', 400),
  PAYMENT_VERIFICATION_FAILED: () => new DomainError('PAYMENT_VERIFICATION_FAILED', 'Payment verification failed.', 400),
  PAYMENT_AMOUNT_MISMATCH: () => new DomainError('PAYMENT_AMOUNT_MISMATCH', 'Payment amount mismatch.', 400),
  PAYMENT_CURRENCY_MISMATCH: () => new DomainError('PAYMENT_CURRENCY_MISMATCH', 'Payment currency mismatch.', 400),
  INVALID_WEBHOOK_SIGNATURE: () => new DomainError('INVALID_WEBHOOK_SIGNATURE', 'Invalid webhook signature.', 400),
  DUPLICATE_WEBHOOK: () => new DomainError('DUPLICATE_WEBHOOK', 'Duplicate webhook.', 200),
  LATE_PAYMENT: () => new DomainError('LATE_PAYMENT', 'Late payment recorded.', 200),
  PAYMENT_REVIEW_REQUIRED: () => new DomainError('PAYMENT_REVIEW_REQUIRED', 'Payment requires manual review.', 400),
  RAZORPAY_ORDER_CREATION_FAILED: () => new DomainError('RAZORPAY_ORDER_CREATION_FAILED', 'Razorpay order creation failed.', 500),

  INVALID_ORDER_TRANSITION: () => new DomainError('INVALID_ORDER_TRANSITION', 'Invalid order status transition.', 400),
  SHIPPING_DATA_REQUIRED: () => new DomainError('SHIPPING_DATA_REQUIRED', 'Shipping carrier and tracking number required.', 400),
  ORDER_CANNOT_BE_CANCELLED: () => new DomainError('ORDER_CANNOT_BE_CANCELLED', 'Order state does not allow cancellation.', 400),
  ORDER_NOT_PAID: () => new DomainError('ORDER_NOT_PAID', 'Order payment is not completed.', 400),
  NO_CAPTURED_PAYMENT_ATTEMPT: () => new DomainError('NO_CAPTURED_PAYMENT_ATTEMPT', 'No captured payment attempt found.', 400),
  REVIEW_FAILED: () => new DomainError('REVIEW_FAILED', 'Failed to submit review.', 400),

  CONFLICT: (msg) => new DomainError('CONFLICT', msg, 409),
  INTERNAL_ERROR: () => new DomainError('INTERNAL_ERROR', 'Internal server error.', 500),
};
