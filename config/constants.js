module.exports = {
  // User roles
  ROLES: {
    ADMIN: 'admin',
    STAFF: 'staff',
    USER: 'user'
  },

  // Order status
  ORDER_STATUS: {
    PENDING: 'Pending',
    PROCESSING: 'Processing',
    READY: 'Ready',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled'
  },

  // Payment status
  PAYMENT_STATUS: {
    PENDING: 'Pending',
    COMPLETED: 'Completed',
    FAILED: 'Failed'
  },

  // Payment methods
  PAYMENT_METHODS: {
    CASH: 'Cash',
    CARD: 'Card',
    MOBILE: 'Mobile'
  },

  // Product categories
  PRODUCT_CATEGORIES: {
    COFFEE: 'Coffee',
    TEA: 'Tea',
    PASTRIES: 'Pastries',
    SANDWICHES: 'Sandwiches',
    DESSERTS: 'Desserts'
  },

  // File upload
  UPLOAD: {
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_MIME_TYPES: ['image/jpeg', 'image/png', 'image/gif'],
    DEFAULT_PRODUCT_IMAGE: 'default-product.jpg',
    DEFAULT_CATEGORY_IMAGE: 'default-category.jpg',
    DEFAULT_USER_AVATAR: 'default-avatar.jpg'
  },

  // Pagination
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100
  },

  // Session
  SESSION: {
    NAME: 'beanbrews.sid',
    MAX_AGE: 24 * 60 * 60 * 1000, // 24 hours
    HTTP_ONLY: true,
    SECURE: process.env.NODE_ENV === 'production',
    SAME_SITE: 'strict'
  },

  // Rate limiting
  RATE_LIMIT: {
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    MAX_REQUESTS: 100
  },

  // Security
  SECURITY: {
    BCRYPT_ROUNDS: 10,
    PASSWORD_MIN_LENGTH: 6,
    PASSWORD_MAX_LENGTH: 128,
    USERNAME_MIN_LENGTH: 3,
    USERNAME_MAX_LENGTH: 30
  },

  // Error messages
  ERROR_MESSAGES: {
    AUTH: {
      INVALID_CREDENTIALS: 'Invalid credentials',
      NOT_AUTHENTICATED: 'Please log in to access this resource',
      NOT_AUTHORIZED: 'You are not authorized to access this resource',
      ACCOUNT_INACTIVE: 'Your account is currently inactive'
    },
    VALIDATION: {
      REQUIRED_FIELD: 'This field is required',
      INVALID_EMAIL: 'Please enter a valid email address',
      INVALID_PASSWORD: 'Password must be between 6 and 128 characters',
      INVALID_USERNAME: 'Username must be between 3 and 30 characters',
      INVALID_PHONE: 'Please enter a valid phone number'
    },
    PRODUCT: {
      NOT_FOUND: 'Product not found',
      UNAVAILABLE: 'Product is currently unavailable'
    },
    ORDER: {
      NOT_FOUND: 'Order not found',
      INVALID_STATUS: 'Invalid order status',
      INVALID_PAYMENT: 'Invalid payment status'
    },
    CATEGORY: {
      NOT_FOUND: 'Category not found',
      HAS_PRODUCTS: 'Cannot delete category with associated products'
    }
  },

  // Success messages
  SUCCESS_MESSAGES: {
    AUTH: {
      REGISTERED: 'User registered successfully',
      LOGGED_IN: 'Logged in successfully',
      LOGGED_OUT: 'Logged out successfully',
      PASSWORD_CHANGED: 'Password changed successfully',
      PROFILE_UPDATED: 'Profile updated successfully'
    },
    PRODUCT: {
      CREATED: 'Product created successfully',
      UPDATED: 'Product updated successfully',
      DELETED: 'Product deleted successfully'
    },
    ORDER: {
      CREATED: 'Order created successfully',
      UPDATED: 'Order updated successfully',
      STATUS_UPDATED: 'Order status updated successfully',
      PAYMENT_UPDATED: 'Payment status updated successfully'
    },
    CATEGORY: {
      CREATED: 'Category created successfully',
      UPDATED: 'Category updated successfully',
      DELETED: 'Category deleted successfully',
      ORDER_UPDATED: 'Category order updated successfully'
    }
  }
};
