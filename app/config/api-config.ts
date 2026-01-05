// Purpose Of FIle :
// this file contain all api routes ,url GET_SEARCH_PRODUCT

// https://api.seebiz.cloud
const ApiConfig = {
  // for live config here http://127.0.0.1:8000


  // BASE_URL: 'http://192.168.20.156:8000',
  BASE_URL: 'https://fastapi-e-commerce-platform.onrender.com/',

  LOGIN: 'user/login',
  SIGNUP: 'user/signup',
  FETCH_CATEGORY: 'category/categories',
  FETCH_CATEGORIES_WITH_PRODUCT_COUNTS: 'category/categories-with-product-count',
  FETCH_PRODUCTS: 'products/product',
  APPLY_DISCOUNT: 'products/apply-discount',
  FETCH_LIST_PRODUCTS: 'products/getAllProducts',
  FETCH_DISCOUNTED_PRODUCTS: 'products/get-discounted-products',
  ADMIN_LOGIN: 'admin/login',
  ADMIN_SIGNUP: 'admin/adminSignup',
  FORGOT_PASSWORD: 'user/forgotPassword',
  VERIFY_PASSWORD_CODE: 'user/verifyPasswordCode',
  PASSWORD_RESET: 'user/passreset',
  CREATE_PRODUCT: 'products/create',
  UPDATE_PRODUCT: 'products/updateProduct',
  DELETE_PRODUCT: 'products/deleteProducct',
  RECENTLY_VIEWED_ADD: 'products/recently-viewed/add',
  RECENTLY_VIEWED_GET: 'products/recently-viewed',
  RECENTLY_VIEWED_CLEAR: 'products/recently-viewed',
  CREATE_ORDER: 'order/create_order',
  GET_ORDER: 'order/get_order',
  ORDER_STATUS_PROCESSING: 'order/orderStatus',
  SEED_CATEGORIES: 'category/seed-categories',
  WISHLIST_ADD: 'wishlist_cart/wishlist/add',
  WISHLIST_REMOVE: 'wishlist_cart/wishlist/remove',
  WISHLIST_GET: 'wishlist_cart/wishlist',
  CART_ADD: 'wishlist_cart/cart/add',
  CART_REMOVE: 'wishlist_cart/cart/remove',
  CART_GET: 'wishlist_cart/cart',
  CART_CLEAR: 'wishlist_cart/cart',
  VOUCHER_SUGGEST: 'voucher/voucher/suggest',
  VOUCHER_VALIDATE: 'voucher/voucher/validate',
  VOUCHER_APPLY: 'voucher/voucher/apply',
  PAYMENT_INTENT: 'payment/create-payment-intent',
  CREATE_REVIEW: 'reviews/',
  GET_REVIEWS: 'reviews/',
  REVIEW_STATS: 'reviews/stats',
  ANALYTICS_DASHBOARD: 'analytics/dashboard',
  SALES_PREDICTION: 'analytics/prediction',
  AI_SHOPPING_ASSIST: 'ai_shopping/assist',
};

export default ApiConfig;
