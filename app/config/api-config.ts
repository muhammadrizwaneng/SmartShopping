// Purpose Of FIle :
// this file contain all api routes ,url GET_SEARCH_PRODUCT

// https://api.seebiz.cloud
const ApiConfig = {
  // for live config here http://127.0.0.1:8000


  // BASE_URL: 'http://192.168.20.156:8000',
  BASE_URL: 'http://10.0.2.2:8000/',


  LOGIN: 'user/login',
  SIGNUP: 'user/signup',
  FETCH_CATEGORY:'category/categories',
  FETCH_CATEGORIES_WITH_PRODUCT_COUNTS:'category/categories-with-product-count',
  FETCH_PRODUCTS:'products/product',
  APPLY_DISCOUNT:'products/apply-discount',
  FETCH_LIST_PRODUCTS:'products/getAllProducts',
  FETCH_DISCOUNTED_PRODUCTS:'products/get-discounted-products',
};

export default ApiConfig;