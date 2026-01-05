import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Alert,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faArrowLeft,
  faUser,
  faEnvelope,
  faPhone,
  faPencil,
  faCamera,
  faMapMarkerAlt,
  faCalendar,
} from '@fortawesome/free-solid-svg-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import ImageCropPicker from 'react-native-image-crop-picker';
import { colors, typography, spacing } from '../../theme';
import { Button } from '../../components';

interface ProfileDetailScreenProps {
  // Add any props if needed
}

const ProfileDetailScreen: React.FC<ProfileDetailScreenProps> = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const userInfo = useSelector((state: any) => state.auth.userInfo);
  const [profileImage, setProfileImage] = useState<string | null>(userInfo?.profileImage || null);

  const handleImagePick = () => {
    ImageCropPicker.openCamera({
      width: 300,
      height: 300,
      cropping: true,
      cropperCircleOverlay: true,
      compressImageQuality: 0.8,
    })
      .then((image: any) => {
        setProfileImage(image.path);
      })
      .catch((error: any) => {
        console.log('Image picker error:', error);
      });
  };

  const handleSave = () => {
    Alert.alert('Success', 'Profile updated successfully!');
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <FontAwesomeIcon icon={faArrowLeft} size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Profile</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Image Section */}
        <View style={styles.imageSection}>
          <TouchableOpacity onPress={handleImagePick} style={styles.imageContainer}>
            {/* <Image
              source={profileImage ? { uri: profileImage } : require('../../assets/images/default-avatar.png')}
              style={styles.profileImage}
            /> */}
            <View style={styles.cameraOverlay}>
              <FontAwesomeIcon icon={faCamera} size={20} color={colors.white} />
            </View>
          </TouchableOpacity>
          <Text style={styles.changePhotoText}>Change Photo</Text>
        </View>

        {/* Profile Information */}
        <View style={styles.infoSection}>
          <View style={styles.infoItem}>
            <View style={styles.infoIcon}>
              <FontAwesomeIcon icon={faUser} size={20} color={colors.primary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Full Name</Text>
              <Text style={styles.infoValue}>{userInfo?.name || 'John Doe'}</Text>
            </View>
            <TouchableOpacity style={styles.editButton}>
              <FontAwesomeIcon icon={faPencil} size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.infoItem}>
            <View style={styles.infoIcon}>
              <FontAwesomeIcon icon={faEnvelope} size={20} color={colors.primary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{userInfo?.email || 'john.doe@example.com'}</Text>
            </View>
            <TouchableOpacity style={styles.editButton}>
              <FontAwesomeIcon icon={faPencil} size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.infoItem}>
            <View style={styles.infoIcon}>
              <FontAwesomeIcon icon={faPhone} size={20} color={colors.primary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Phone</Text>
              <Text style={styles.infoValue}>{userInfo?.phoneNumber || '+1 234 567 8900'}</Text>
            </View>
            <TouchableOpacity style={styles.editButton}>
              <FontAwesomeIcon icon={faPencil} size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.infoItem}>
            <View style={styles.infoIcon}>
              <FontAwesomeIcon icon={faMapMarkerAlt} size={20} color={colors.primary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Address</Text>
              <Text style={styles.infoValue}>
                {userInfo?.address || '123 Main St, City, State 12345'}
              </Text>
            </View>
            <TouchableOpacity style={styles.editButton}>
              <FontAwesomeIcon icon={faPencil} size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={[styles.infoItem, styles.infoItemLastChild]}>
            <View style={styles.infoIcon}>
              <FontAwesomeIcon icon={faCalendar} size={20} color={colors.primary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Member Since</Text>
              <Text style={styles.infoValue}>
                {userInfo?.createdAt ? new Date(userInfo.createdAt).toLocaleDateString() : 'January 2024'}
              </Text>
            </View>
          </View>
        </View>

        {/* Save Button */}
        <View style={styles.buttonContainer}>
          <Button
            title="Save Changes"
            onPress={handleSave}
            variant="primary"
            size="lg"
            style={styles.saveButton}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    backgroundColor: colors.white,
    ...spacing.shadow.sm,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.lightGray,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  headerTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.xl,
    fontWeight: 'bold' as const,
    color: colors.textPrimary,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  imageSection: {
    alignItems: 'center' as const,
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: spacing.md,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.lightGray,
  },
  cameraOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    borderWidth: 3,
    borderColor: colors.white,
  },
  changePhotoText: {
    fontFamily: typography.fontFamily.sans,
    fontSize: typography.fontSize.sm,
    color: colors.primary,
    fontWeight: '500' as const,
  },
  infoSection: {
    backgroundColor: colors.white,
    borderRadius: spacing.borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    ...spacing.shadow.sm,
  },
  infoItem: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  infoItemLastChild: {
    borderBottomWidth: 0,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.lightGray,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginRight: spacing.md,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontFamily: typography.fontFamily.sans,
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs / 2,
  },
  infoValue: {
    fontFamily: typography.fontFamily.sans,
    fontSize: typography.fontSize.base,
    color: colors.textPrimary,
    fontWeight: '500' as const,
  },
  editButton: {
    padding: spacing.sm,
  },
  buttonContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl * 2,
  },
  saveButton: {
    marginBottom: spacing.md,
  },
});

export default ProfileDetailScreen;
