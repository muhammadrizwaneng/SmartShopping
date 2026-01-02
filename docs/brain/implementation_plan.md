# Product Optimization and Image Picker Implementation

This plan covers moving product state to Redux for caching and replacing URL inputs with an image picker in the product creation screen.

## Proposed Changes

### Redux State Management

#### [MODIFY] [productSlice.ts](file:///Users/muhammadrizwansar/code/SmartShopping/app/redux/productSlice.ts)
- Add `addProduct`, `updateProduct`, and `removeProduct` reducers to update the local store without re-fetching all products.
- Ensure `fetchProducts` logic is used efficiently across screens.

### Product Creation Enhancements

#### [MODIFY] [CreateProductScreen.tsx](file:///Users/muhammadrizwansar/code/SmartShopping/app/screens/main/CreateProductScreen.tsx)
- Import `ImagePicker` from `react-native-image-crop-picker`.
- Replace `main_image_url` and `gallery_images` text inputs with an interactive image picker component.
- Implement logic to automatically populate gallery images when a main image is selected (as per user request).
- Dispatch `addProduct` to Redux store upon successful creation.

### Application Integration

#### [MODIFY] [HomeScreen.tsx](file:///Users/muhammadrizwansar/code/SmartShopping/app/screens/main/HomeScreen.tsx)
- Use `useSelector` to consume products from the Redux store.
- Only trigger `fetchProducts` if the store is empty or stale.

## Verification Plan

### Automated Tests
- None.

### Manual Verification
1. Open the application and ensure products load from Redux on Home Screen.
2. Navigate to "Create Product" screen.
3. Select an image from the gallery for "Main Image".
4. Verify that other image slots optionally show the same selected image or are updated.
5. Submit a new product and verify it appears on the Home Screen immediately without a full page refresh/re-fetch (if applicable).
