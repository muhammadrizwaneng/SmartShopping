import React, {useEffect, useState, useRef, useCallback} from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Switch,
} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faPlus,
  faTrashAlt,
  faChevronDown,
} from '@fortawesome/free-solid-svg-icons';
import {useIsFocused} from '@react-navigation/native';
import {useForm, useFieldArray, Controller} from 'react-hook-form';
import axios from 'axios';
import RBSheet from 'react-native-raw-bottom-sheet';
import ApiConfig from '../../config/api-config';
import { useSelector } from 'react-redux';
import AppState from '../../models/reducers';

// Define the initial shape of your form data
const defaultProductData = {
  name: '',
  brand: '',
  description: '',
  category_id: null,
  category_name: '',
  base_price: '',
  discount_price: '',
  main_image_url: '',
  gallery_images: [], // <-- FIXED (Should be empty initially)
  tags: [],
  has_variants: false,
  variants: [],
  delivery_options: [],
  features: [{label: '', value: ''}],
  price: '', 
  stock: '',
};

const CreateProductScreen = () => {
  const user = useSelector((state: AppState) => state.user);
   
  const [categoryLists, setCategoryList] = useState([]);
  const isFocused = useIsFocused();
  const categorySheetRef = useRef(null);

  // --- react-hook-form setup ---
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    // Include reset function here
    reset,
    formState: {errors},
  } = useForm({
    defaultValues: defaultProductData,
  });

  const hasVariants = watch('has_variants');
  const selectedTags = watch('tags') || [];
  const selectedDeliveryOptions = watch('delivery_options') || [];

  // Variants Array
  const {
    fields: variantFields,
    append: appendVariant,
    remove: removeVariant,
  } = useFieldArray({control, name: 'variants'});

  // Features Array
  const {
    fields: featureFields,
    append: appendFeature,
    remove: removeFeature,
  } = useFieldArray({
    control,
    name: 'features',
  });

  // Gallery Images Array
  const {
    fields: galleryFields,
    append: appendGallery,
    remove: removeGallery,
  } = useFieldArray({
    control,
    name: 'gallery_images',
  });

  // --- Category Fetch Effect ---
  useEffect(() => {
    if (isFocused) {
      const fetchCategory = async () => {
        try {
          const response = await axios.get(
            ApiConfig.BASE_URL + ApiConfig.FETCH_CATEGORY,
          );
          if (response?.status === 200) {
            setCategoryList(response.data);
          }
        } catch (error) {
          console.error('Failed to fetch categories:', error);
        }
      };
      fetchCategory();
    }
  }, [isFocused]);
  
  // --- Gallery Image Reset Effect (The Key Change) ---
  useEffect(() => {
      // When the screen focuses, explicitly set the gallery_images state to an empty array
      // to clear any potential stale field values from the initial render.
      if (isFocused) {
          setValue('gallery_images', [], { shouldValidate: false });
      }
  }, [isFocused, setValue]);


  // --- Category Selection Logic ---
  const handleSelectCategory = useCallback(
    category => {
      setValue('category_id', category._id, {shouldValidate: true});
      setValue('category_name', category.name, {shouldValidate: true});
      categorySheetRef.current?.close();
    },
    [setValue],
  );

  // --- Image Management Logic ---
  const MAX_GALLERY_IMAGES = 4;
  
  const handleAddGalleryImage = () => {
      if (galleryFields.length < MAX_GALLERY_IMAGES) {
          appendGallery({ value: "" });
      } else {
          Alert.alert("Limit Reached", `You can only add a maximum of ${MAX_GALLERY_IMAGES} gallery images.`);
      }
  };

  const handleRemoveGalleryImage = (index) => {
    if (galleryFields.length > 0) {
      removeGallery(index);
    }
  };

  // --- Form Submission ---
  const onSubmit = async (data) => {
      // --- STEP 1: Sanitize all fields before building dataToSend ---
    const sanitizedData = { ...data };
    
    // Convert empty strings for optional numerical fields to null/undefined
    // to satisfy Pydantic's 'float' requirement.
    ['base_price', 'discount_price'].forEach(field => {
        if (sanitizedData[field] === '') {
            // Setting to null or undefined makes it null in the JSON payload, 
            // which Pydantic's Optional[float] handles correctly.
            sanitizedData[field] = null; 
        }
    });

    const dataToSend = {
      ...sanitizedData, // Use the sanitized data here
      category: sanitizedData.category_id, 
      gallery_images: sanitizedData.gallery_images.filter(
        url => url && url.trim() !== '',
      ),
    };
    
    delete dataToSend.category_name; 

    // --- STEP 2: Handle Variants/Simple Product Logic ---
    if (dataToSend.has_variants) {
        delete dataToSend.price;
        delete dataToSend.stock;
        dataToSend.variants = dataToSend.variants || []; 
    } else {
        delete dataToSend.variants;
    }

    // const dataToSend = {
    //   ...data,
    //   category: data.category_id, 
    //   gallery_images: data.gallery_images.filter(
    //     url => url && url.trim() !== '',
    //   ),
    // };
    // delete dataToSend.category_name; 

    // if (dataToSend.has_variants) {
    //     delete dataToSend.price;
    //     delete dataToSend.stock;
    // } else {
    //     delete dataToSend.variants;
    // }

    console.log(
      'Submitting Product Data:',
      JSON.stringify(dataToSend, null, 2),
    );


    try {
      // NOTE: Replace 'YOUR_PRODUCT_ENDPOINT' with your actual FastAPI endpoint path
      // e.g., /products/create
      const response = await axios.post(
        ApiConfig.BASE_URL + 'products/create', // 👈 Update your URL here
        dataToSend,
        {
          // Add headers if required (e.g., for authentication using JWT)
          // headers: {
          //   'Authorization': `Bearer ${YOUR_AUTH_TOKEN}`,
          //   'Content-Type': 'application/json',
          // },
        }
      );
      console.log("-----response",response)
      if (response.status === 201 || response.status === 200) {
        console.log('Product created successfully:', response.data);
        Alert.alert('Success 🎉', 'Product has been created successfully!');
        // Optionally: Navigate away or reset the form here (e.g., reset(defaultProductData))
      } else {
        // Handle unexpected status codes
        Alert.alert('Error', `Failed to create product. Status: ${response.status}`);
      }

    } catch (error) {
      console.error('API Request Error:', error.response?.data || error.message);
      
      let errorMessage = 'An unexpected error occurred while saving the product.';

      if (error.response?.data?.detail) {
        // Specific FastAPI/Pydantic validation errors
        errorMessage = JSON.stringify(error.response.data.detail);
      } else if (error.message.includes('401')) {
        errorMessage = 'Authorization failed. Please log in again.';
      }
      
      Alert.alert('Submission Failed', errorMessage);
    }
    // --------------------------
  // };

  };

  // --- Category Picker Component ---
  const CategoryPicker = () => {
    const selectedCategoryId = watch('category_name');
    const selectedCategory = categoryLists.find(
      c => c.name === selectedCategoryId,
    );
    return (
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>
          Category <Text style={styles.requiredStar}>*</Text>
        </Text>
        <Controller
          control={control}
          name="category_name"
          rules={{required: 'Category selection is required.'}}
          render={({field: {value}}) => (
            <TouchableOpacity
              style={[
                styles.textInput,
                styles.categoryPicker,
                errors.category_name && styles.inputError,
              ]}
              onPress={() => categorySheetRef.current?.open()}>
              <Text
                style={
                  value ? styles.categoryText : styles.categoryPlaceholder
                }>
                {selectedCategory ? selectedCategory.name : 'Select a Category'}
              </Text>
              <FontAwesomeIcon icon={faChevronDown} size={14} color="#6366F1" />
            </TouchableOpacity>
          )}
        />
        {errors.category_name && (
          <Text style={styles.errorText}>{errors.category_name.message}</Text>
        )}
      </View>
    );
  };

  // RBSheet Content
  const renderCategorySheet = () => (
    <View style={styles.sheetContainer}>
      <Text style={styles.sheetHeader}>Select Product Category</Text>
      <ScrollView>
        {categoryLists.map(category => (
          <TouchableOpacity
            key={category.id}
            style={styles.categoryItem}
            onPress={() => handleSelectCategory(category)}>
            <Text style={styles.categoryItemText}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  // --- Component Render ---
  return (
    <View style={styles.fullContainer}>
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}>
        <View style={styles.formContainer}>
          <Text style={styles.header}>Create New Product</Text>

          {/* Product Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              Product Name <Text style={styles.requiredStar}>*</Text>
            </Text>
            <Controller
              control={control}
              name="name"
              rules={{required: 'Product Name is required.'}}
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  style={[styles.textInput, errors.name && styles.inputError]}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder="e.g., Gaming Laptop"
                  placeholderTextColor="#999"
                />
              )}
            />
            {errors.name && (
              <Text style={styles.errorText}>{errors.name.message}</Text>
            )}
          </View>

          {/* Brand */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Brand</Text>
            <Controller
              control={control}
              name="brand"
              render={({field: {onChange, value}}) => (
                <TextInput
                  style={styles.textInput}
                  value={value}
                  onChangeText={onChange}
                  placeholder="e.g., Acer Predator"
                  placeholderTextColor="#999"
                />
              )}
            />
          </View>

          {/* Category */}
          <CategoryPicker />

          {/* Description */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Description</Text>
            <Controller
              control={control}
              name="description"
              render={({field: {onChange, value}}) => (
                <TextInput
                  style={styles.textInput}
                  value={value}
                  onChangeText={onChange}
                  placeholder="Detailed product features..."
                  placeholderTextColor="#999"
                />
              )}
            />
          </View>

          {/* Tags (with validation) */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tags <Text style={styles.requiredStar}>*</Text></Text>
            <Controller
                control={control}
                name="tags"
                rules={{
                    validate: value => value.length > 0 || "At least one tag must be selected.",
                }}
                render={({ field: { value } }) => (
                    <View style={styles.tagsRow}>
                    {['New', 'Hot', 'Trending', 'Discount'].map(tag => {
                        const isSelected = value.includes(tag);
                        return (
                        <TouchableOpacity
                            key={tag}
                            style={[
                                styles.tagChip,
                                isSelected && styles.tagChipSelected,
                                errors.tags && styles.inputError, 
                            ]}
                            onPress={() => {
                                const newTags = isSelected
                                ? value.filter(t => t !== tag)
                                : [...value, tag];
                                setValue('tags', newTags, {shouldValidate: true});
                            }}>
                            <Text
                            style={[
                                styles.tagText,
                                isSelected && styles.tagTextSelected,
                            ]}>
                            {tag}
                            </Text>
                        </TouchableOpacity>
                        );
                    })}
                    </View>
                )}
            />
            {errors.tags && (
                <Text style={styles.errorText}>{errors.tags.message}</Text>
            )}
          </View>

          {/* Stock Toggle */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Stock/Variants</Text>
            <Controller
              control={control}
              name="has_variants"
              render={({field: {value, onChange}}) => (
                <View style={styles.toggleRow}>
                  <Text style={styles.inputLabel}>Has Variants?</Text>
                  <Switch value={value} onValueChange={onChange} />
                </View>
              )}
            />
          </View>

          {/* Variants Section (with validation) */}
            {hasVariants ? (
            <View style={styles.section}>
              <View style={styles.sectionTitleRow}>
                <Text style={styles.sectionTitle}>Variants <Text style={styles.requiredStar}>*</Text></Text>
                {/* Ensure new variants are appended with default stock */}
                <TouchableOpacity
                  onPress={() => appendVariant({name: '', price: '', stock: ''})} // 👈 ADDED STOCK DEFAULT
                  style={styles.addButton}>
                  <FontAwesomeIcon icon={faPlus} size={14} color="#6366F1" />
                </TouchableOpacity>
              </View>
              {/* Validation Check for at least one variant */}
              <Controller
                control={control}
                name="variants"
                rules={{
                    validate: value => value.length > 0 || "At least one variant is required."
                }}
                render={() => null} 
              />
              {errors.variants?.message && (
                  <Text style={styles.errorText}>{errors.variants.message}</Text>
              )}

              {variantFields.map((item, index) => (
                <View key={item.id} style={styles.featureInputRow}>
                  {/* Variant Name Controller (Takes up 1/3 space) */}
                  <Controller
                    control={control}
                    name={`variants.${index}.name`}
                    rules={{required: 'Name is required.'}}
                    render={({field: {onChange, value}}) => (
                      <TextInput
                        style={[
                            styles.featureInput, 
                            { flex: 1.5, marginRight: 8 }, // 👈 Adjusted flex for 3 inputs
                            errors.variants?.[index]?.name && styles.inputError
                        ]}
                        placeholder="Variant Name"
                        value={value}
                        onChangeText={onChange}
                      />
                    )}
                  />
                  
                  {/* Variant Price Controller (Takes up 1/3 space) */}
                  <Controller
                    control={control}
                    name={`variants.${index}.price`}
                    rules={{
                        required: 'Price is required.',
                        pattern: {
                            value: /^\d+(\.\d{1,2})?$/,
                            message: "Invalid price."
                        }
                    }}
                    render={({field: {onChange, value}}) => (
                      <TextInput
                        style={[
                            styles.featureInput, 
                            { flex: 1, marginRight: 8 }, // 👈 Adjusted flex
                            errors.variants?.[index]?.price && styles.inputError
                        ]}
                        placeholder="Price"
                        keyboardType="numeric"
                        value={value}
                        onChangeText={onChange}
                      />
                    )}
                  />

                  {/* Variant Stock Controller (Takes up 1/3 space) */}
                  <Controller
                    control={control}
                    name={`variants.${index}.stock`} // 👈 NEW STOCK CONTROLLER
                    rules={{
                        required: 'Stock is required.',
                        pattern: {
                            value: /^\d+$/,
                            message: "Must be a whole number."
                        }
                    }}
                    render={({field: {onChange, value}}) => (
                      <TextInput
                        style={[
                            styles.featureInput, 
                            { flex: 1, marginRight: 8 }, // 👈 Adjusted flex
                            errors.variants?.[index]?.stock && styles.inputError
                        ]}
                        placeholder="Stock"
                        keyboardType="numeric"
                        value={value}
                        onChangeText={onChange}
                      />
                    )}
                  />

                  <TouchableOpacity
                    onPress={() => removeVariant(index)}
                    style={styles.removeButton}>
                    <FontAwesomeIcon
                      icon={faTrashAlt}
                      size={14}
                      color="#EF4444"
                    />
                  </TouchableOpacity>
                </View>
              ))}
              {/* Display individual variant item errors */}
              {variantFields.map((item, index) => (
                    <View key={`err-${item.id}`} style={{marginBottom: 8}}>
                        {errors.variants?.[index]?.name && <Text style={styles.errorText}>{errors.variants[index].name.message}</Text>}
                        {errors.variants?.[index]?.price && <Text style={styles.errorText}>{errors.variants[index].price.message}</Text>}
                        {errors.variants?.[index]?.stock && <Text style={styles.errorText}>{errors.variants[index].stock.message}</Text>} {/* 👈 ADDED STOCK ERROR */}
                    </View>
              ))}
            </View>
          ) : (
            // Single Product Mode (Price & Stock validation)
            <View style={styles.section}>
              <View style={{marginBottom:20}}>
                <Text style={styles.inputLabel}>Product Price <Text style={styles.requiredStar}>*</Text></Text>
                <Controller
                  control={control}
                  name="price"
                  rules={{
                      required: 'Price is required.',
                      pattern: {
                          value: /^\d+(\.\d{1,2})?$/,
                          message: "Must be a valid price."
                      }
                  }}
                  render={({field: {onChange, value}}) => (
                    <TextInput
                      style={[styles.featureInput, errors.price && styles.inputError]}
                      placeholder="Enter product price"
                      keyboardType="numeric"
                      value={value}
                      onChangeText={onChange}
                    />
                  )}
                />
              {errors.price && <Text style={styles.errorText}>{errors.price.message}</Text>}
              </View>

              <Text style={styles.inputLabel}>Stock Quantity <Text style={styles.requiredStar}>*</Text></Text>
              <Controller
                control={control}
                name="stock"
                rules={{
                    required: 'Stock is required.',
                    pattern: {
                        value: /^\d+$/,
                        message: "Must be a whole number."
                    }
                }}
                render={({field: {onChange, value}}) => (
                  <TextInput
                    style={[styles.featureInput, errors.stock && styles.inputError]}
                    placeholder="Enter stock quantity"
                    keyboardType="numeric"
                    value={value}
                    onChangeText={onChange}
                  />
                )}
              />
              {errors.stock && <Text style={styles.errorText}>{errors.stock.message}</Text>}
            </View>
          )}

          {/* Delivery Options */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Delivery Options</Text>
            <Controller
                control={control}
                name="delivery_options"
                render={({ field: { value } }) => (
                    ['Free Delivery', 'Cash on Delivery', '7-Day Return'].map(
                        option => {
                            const isSelected = value.includes(option);
                            return (
                            <TouchableOpacity
                                key={option}
                                style={styles.deliveryRow}
                                onPress={() => {
                                    const updatedOptions = isSelected
                                    ? value.filter(o => o !== option)
                                    : [...value, option];
                                    setValue('delivery_options', updatedOptions, {
                                        shouldValidate: true,
                                    });
                                }}>
                                <Text style={styles.deliveryText}>{option}</Text>
                                <Text>{isSelected ? '✅' : '⬜'}</Text>
                            </TouchableOpacity>
                            );
                        },
                    )
                )}
            />
          </View>

          {/* Key Features (with validation) */}
         <View style={styles.section}>
            <View style={styles.sectionTitleRow}>
                <Text style={styles.sectionTitle}>Key Features <Text style={styles.requiredStar}>*</Text></Text>
                <TouchableOpacity onPress={() => appendFeature({ label: "", value: "" })} style={styles.addButton}>
                    <FontAwesomeIcon icon={faPlus} size={14} color="#6366F1" />
                </TouchableOpacity>
            </View>
            
            {/* Validation Check for at least one feature */}
            <Controller
                control={control}
                name="features"
                rules={{
                    validate: value => value.length > 0 || "At least one feature is required."
                }}
                render={() => null} 
            />
            {errors.features?.message && (
                <Text style={styles.errorText}>{errors.features.message}</Text>
            )}

            {featureFields.map((item, index) => (
              <View key={item.id} style={styles.featureInputRow}>
                {/* Controller for Feature Label */}
                <Controller
                  control={control}
                  name={`features.${index}.label`}
                  rules={{required: 'Label is required.'}}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={[styles.featureInput, { marginRight: 8 }, errors.features?.[index]?.label && styles.inputError]}
                      placeholder="Label (e.g., RAM)"
                      placeholderTextColor="#999"
                      value={value}
                      onChangeText={onChange}
                    />
                  )}
                />
                {/* Controller for Feature Value */}
                <Controller
                  control={control}
                  name={`features.${index}.value`}
                  rules={{required: 'Value is required.'}}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={[styles.featureInput, errors.features?.[index]?.value && styles.inputError]}
                      placeholder="Value (e.g., 32GB DDR5)"
                      placeholderTextColor="#999"
                      value={value}
                      onChangeText={onChange}
                    />
                  )}
                />
                {featureFields.length > 1 && (
                  <TouchableOpacity onPress={() => removeFeature(index)} style={styles.removeButton}>
                    <FontAwesomeIcon icon={faTrashAlt} size={14} color="#EF4444" />
                  </TouchableOpacity>
                )}
              </View>
            ))}
            {/* Display individual feature item errors */}
            {featureFields.map((item, index) => (
                <View key={`err-${item.id}`} style={{marginBottom: 8}}>
                    {errors.features?.[index]?.label && <Text style={styles.errorText}>{errors.features[index].label.message}</Text>}
                    {errors.features?.[index]?.value && <Text style={styles.errorText}>{errors.features[index].value.message}</Text>}
                </View>
            ))}
          </View>
          
          {/* Images Section */}
          <View style={styles.section}>
              <View style={styles.sectionTitleRow}>
                  <Text style={styles.sectionTitle}>Images (URLs)</Text>
                  {/* Conditionally render the "+" button based on the limit */}
                  {galleryFields.length < MAX_GALLERY_IMAGES && (
                      <TouchableOpacity 
                          onPress={handleAddGalleryImage} 
                          style={styles.addButton}
                      >
                          <FontAwesomeIcon icon={faPlus} size={14} color="#6366F1" />
                      </TouchableOpacity>
                  )}
              </View>
              
              {/* === Main Image URL Controller === */}
              <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Main Image URL <Text style={styles.requiredStar}>*</Text></Text>
                  <Controller
                      control={control}
                      name="main_image_url"
                      rules={{ required: "Main Image URL is required." }}
                      render={({ field: { onChange, onBlur, value } }) => (
                          <TextInput
                              style={[styles.textInput, errors.main_image_url && styles.inputError]}
                              onBlur={onBlur}
                              onChangeText={onChange}
                              value={value}
                              placeholder="https://main-image.url/photo.jpg"
                              placeholderTextColor="#999"
                          />
                      )}
                  />
                  {errors.main_image_url && <Text style={styles.errorText}>{errors.main_image_url.message}</Text>}
              </View>
  
              <Text style={styles.subTitle}>Gallery Images ({galleryFields.length} / {MAX_GALLERY_IMAGES})</Text>
              {/* Only loop and render if there are fields */}
              {galleryFields.map((item, index) => (
                <View key={item.id} style={[styles.galleryinputGroup]}>
                   {/* Controller for each Gallery Image URL */}
                   <Controller
                      control={control}
                      name={`gallery_images.${index}`}
                      render={({ field: { onChange, value } }) => (
                        <TextInput
                          style={[styles.textInput,{width:'90%',marginRight:10}]}
                          placeholder={`Gallery Image ${index + 1} URL (Optional)`}
                          placeholderTextColor="#999"
                          value={value}
                          onChangeText={onChange}
                        />
                      )}
                    />
                    {/* Allow removing any gallery image field */}
                    <TouchableOpacity 
                      onPress={() => handleRemoveGalleryImage(index)} 
                      style={styles.removeGalleryButton}
                    >
                      <FontAwesomeIcon icon={faTrashAlt} size={14} color="#EF4444" />
                    </TouchableOpacity>
                </View>
              ))}
            </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.createButton}
          onPress={handleSubmit(onSubmit)}>
          <Text style={styles.createButtonText}>Create Product</Text>
        </TouchableOpacity>
      </View>

      {/* RBSheet */}
      <RBSheet
        ref={categorySheetRef}
        height={400}
        openDuration={250}
        customStyles={{container: styles.sheetModal}}>
        {renderCategorySheet()}
      </RBSheet>
    </View>
  );
};

// --- Styles (Unchanged) ---
const styles = StyleSheet.create({
  fullContainer: {flex: 1, backgroundColor: '#F5F5F5'},
  scrollContainer: {flex: 1},
  scrollContent: {paddingBottom: 100},
  formContainer: {padding: 16},
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 20,
  },
  // Input Group Styles
  inputGroup: {
  marginBottom: 15,
  },
  galleryinputGroup: {
     flexDirection: 'row',   // put input + trash in one line
  alignItems: 'center',
  marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    marginBottom: 4,
  },
  requiredStar: {
    color: '#EF4444',
  },
  textInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#111',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
  },
  // Category Picker Styles
  categoryPicker: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 45,
  },
  categoryText: {
    color: '#111',
    fontSize: 16,
  },
  categoryPlaceholder: {
    color: '#999',
    fontSize: 16,
  },
  // Section Styles
  section: {
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
  },
  subTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 10,
    marginBottom: 8,
  },
  // Feature Input Styles
  featureInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  featureInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    color: '#111',
  },
  addButton: {
    backgroundColor: '#E0E7FF',
    padding: 8,
    borderRadius: 8,
  },
  removeButton: {
    marginLeft: 8,
    padding: 8,
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
  },
  removeGalleryButton: {
    padding: 8,
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
  },
  // Footer/Button Styles
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  createButton: {
    backgroundColor: '#6366F1',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  // RBSheet Styles
  sheetModal: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: '#fff',
  },
  sheetContainer: {
    padding: 16,
    flex: 1,
  },
  sheetHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#111',
  },
  categoryItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  categoryItemText: {
    fontSize: 16,
    color: '#333',
  },
  tagsRow: {flexDirection: 'row', flexWrap: 'wrap', marginTop: 8},
  tagChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 8,
    marginBottom: 8,
  },
  tagChipSelected: {backgroundColor: '#6366F1', borderColor: '#6366F1'},
  tagText: {fontSize: 14, color: '#333'},
  tagTextSelected: {color: '#fff'},
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deliveryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  deliveryText: {fontSize: 16, color: '#333'},
});

export default CreateProductScreen;