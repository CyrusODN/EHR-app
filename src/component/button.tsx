import { StyleSheet, Text, View, Image, TouchableOpacity, ActivityIndicator, ViewStyle, TextStyle } from 'react-native'
import React from 'react'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import LinearGradient from 'react-native-linear-gradient'
import { useThemeColors } from '../hooks/useThemeColors'

interface PrimaryButtonProps {
    label: string;
    filled?: boolean;
    onPress: () => void;
    style?: ViewStyle | ViewStyle[];
    loading?: boolean;
    disabled?: boolean;
    icon?: React.ReactNode;
    image?: any;
    iconStyle?: ViewStyle;
    imageStyle?: any;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
    label,
    filled,
    onPress,
    style,
    loading = false,
    disabled = false,
    icon,
    image,
    iconStyle,
    imageStyle
}) => {
    const { colors: tc, isDark } = useThemeColors();

    const renderLeftElement = () => {
        if (icon) {
            return (
                <View style={iconStyle}>
                    {icon}
                </View>
            )
        } else if (image) {
            return (
                <View style={imageStyle}>
                    {/* ... (existing image logic) */}
                    {typeof image === 'string' ? (
                        <Image
                            source={{ uri: image }}
                            style={styles.image}
                            resizeMode="contain"
                        />
                    ) : (
                        image
                    )}
                </View>
            )
        }
        return null;
    }

    const buttonContent = (
        <View style={styles.contentContainer}>
            {renderLeftElement()}
            <Text style={[
                filled ? styles.filledButtonText : { ...styles.outlineButtonText, color: tc.accent }, 
                { marginLeft: 10 }
            ]}>
                {label}
            </Text>
        </View>
    );

    return (
        <TouchableOpacity
            style={[
                styles.buttonContainer,
                !filled && [styles.outlineButton, { borderColor: tc.accent, backgroundColor: 'transparent' }],
                style,
                disabled && styles.disabledButton
            ]}
            onPress={!disabled ? onPress : undefined}
            disabled={disabled || loading}
            activeOpacity={0.85}
        >
            {loading ? (
                <ActivityIndicator color={filled ? '#fff' : tc.accent} />
            ) : filled ? (
                <LinearGradient
                    colors={disabled ? ['#CCCCCC', '#CCCCCC'] : [tc.accentGradientStart || '#4A90B9', tc.accentGradientEnd || '#68BFB3']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.gradientBackground}
                >
                    {buttonContent}
                </LinearGradient>
            ) : (
                buttonContent
            )}
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    disabledButton: {
        borderColor: '#CCCCCC',
        backgroundColor: '#CCCCCC',
        opacity: 0.6,
    },
    buttonContainer: {
        borderRadius: 8,
        width: '95%',
        height: 50,
        overflow: 'hidden',
        marginBottom: hp(1),
        justifyContent: 'center',
        alignItems: 'center',
    },
    gradientBackground: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    outlineButton: {
        borderWidth: 2,
    },
    filledButtonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 14,
    },
    outlineButtonText: {
        fontWeight: '700',
        fontSize: 14,
    },
    contentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: 20,
        height: 20,
    }
})

export default PrimaryButton
