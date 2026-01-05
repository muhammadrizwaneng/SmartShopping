import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { colors } from '../theme/color';
// import { typography } from '../theme/typography';
// import { spacing } from '../theme/spacing';
import { useDispatch } from 'react-redux';
import { guestLogin } from '../redux/userSlice';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

interface AuthModalProps {
    isVisible: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isVisible, onClose, onSuccess }) => {
    const dispatch = useDispatch<any>();
    const navigation = useNavigation<any>();

    const handleGuestLogin = async () => {
        try {
            await dispatch(guestLogin()).unwrap();
            onClose();
            if (onSuccess) {onSuccess();}
        } catch (error) {
            console.error('Guest login failed:', error);
        }
    };

    const navigateToLogin = () => {
        onClose();
        navigation.navigate('Auth', { screen: 'Login' });
    };

    const navigateToSignup = () => {
        onClose();
        navigation.navigate('Auth', { screen: 'Signup' });
    };

    return (
        <Modal
            visible={isVisible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <TouchableOpacity
                    style={styles.backdrop}
                    activeOpacity={1}
                    onPress={onClose}
                />
                <Animatable.View
                    animation="zoomIn"
                    duration={400}
                    style={styles.modalContainer}
                >
                    <LinearGradient
                        colors={[colors.white, '#F0F4FF']}
                        style={styles.gradientContainer}
                    >
                        <View style={styles.content}>
                            <Text style={styles.title}>Welcome to SmartShopping</Text>
                            <Text style={styles.subtitle}>
                                Join us to unlock personalized deals, save items to your wishlist, and enjoy a seamless checkout experience.
                            </Text>

                            <TouchableOpacity
                                style={styles.primaryButton}
                                onPress={navigateToLogin}
                            >
                                <LinearGradient
                                    colors={[colors.primary, colors.gradientEnd]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.buttonGradient}
                                >
                                    <Text style={styles.primaryButtonText}>Sign In / Login</Text>
                                </LinearGradient>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.secondaryButton}
                                onPress={navigateToSignup}
                            >
                                <Text style={styles.secondaryButtonText}>Create New Account</Text>
                            </TouchableOpacity>

                            <View style={styles.dividerContainer}>
                                <View style={styles.divider} />
                                <Text style={styles.dividerText}>OR</Text>
                                <View style={styles.divider} />
                            </View>

                            <TouchableOpacity
                                style={styles.guestButton}
                                onPress={handleGuestLogin}
                            >
                                <Text style={styles.guestButtonText}>Continue as Guest</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                                <Text style={styles.closeButtonText}>Maybe later</Text>
                            </TouchableOpacity>
                        </View>
                    </LinearGradient>
                </Animatable.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backdrop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
    },
    modalContainer: {
        width: width * 0.85,
        borderRadius: 24,
        overflow: 'hidden',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
    gradientContainer: {
        padding: 24,
    },
    content: {
        alignItems: 'center',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.textPrimary,
        textAlign: 'center',
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 14,
        color: colors.textSecondary,
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 28,
    },
    primaryButton: {
        width: '100%',
        height: 52,
        borderRadius: 12,
        marginBottom: 12,
        overflow: 'hidden',
    },
    buttonGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    primaryButtonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '600',
    },
    secondaryButton: {
        width: '100%',
        height: 52,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.white,
        marginBottom: 20,
    },
    secondaryButtonText: {
        color: colors.primary,
        fontSize: 16,
        fontWeight: '600',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        width: '100%',
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: colors.border,
    },
    dividerText: {
        paddingHorizontal: 12,
        color: '#94A3B8',
        fontSize: 12,
        fontWeight: '600',
    },
    guestButton: {
        width: '100%',
        height: 52,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#EEF2FF',
        marginBottom: 16,
    },
    guestButtonText: {
        color: colors.primaryDark,
        fontSize: 16,
        fontWeight: '600',
    },
    closeButton: {
        padding: 10,
    },
    closeButtonText: {
        color: '#94A3B8',
        fontSize: 14,
        fontWeight: '500',
        textDecorationLine: 'underline',
    },
});

export default AuthModal;
