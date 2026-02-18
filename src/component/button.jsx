import { Pressable, StyleSheet, Text, View, Image, TouchableOpacity, ActivityIndicator } from 'react-native'
import React from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import LinearGradient from 'react-native-linear-gradient'

const PrimaryButton = ({
    label,
    filled,
    onPress,
    style,
    loading, 
    disabled,
    icon,
    image,
    iconStyle,
    imageStyle
    
    
}) => {
    const renderLeftElement = () => {
        if (icon) {
            return (
                <View style={[]}>
                    {icon}
                </View>
            )
        } else if (image) {
            return (
                <View style={[]}>
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
            <Text style={[filled ? styles.filledButtonText : styles.outlineButtonText, { marginLeft: 10 }]}>
                {label}
            </Text>
        </View>
    );

    const getButtonStyle = () => {
        if (disabled) {
            return {
                opacity: 0.5,
                backgroundColor: '#E0E0E0'
            };
        }
        return {};
    };

    return (
        <TouchableOpacity
        style={[
            styles.buttonContainer,
            !filled && styles.outlineButton,
            style,
            disabled && styles.disabledButton
        ]}
        onPress={!disabled ? onPress : null}
        disabled={disabled || loading}
    >
        {loading ? (
            <ActivityIndicator color={filled ? '#fff' : '#007AFF'} />
        ) : filled ? (
            <LinearGradient
                colors={disabled ? ['#CCCCCC', '#CCCCCC'] : ['#4A90B9', '#5BA6B6', '#68BFB3']}
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

export default PrimaryButton

const styles = StyleSheet.create({

    disabledButton: {
        borderColor: '#CCCCCC',
        backgroundColor: '#CCCCCC',
    },
   

    
    buttonContainer: {
        borderRadius: 5,
        width: '95%',
        height: 50,
        overflow: 'hidden',
        marginBottom: hp(1)
    },
    gradientBackground: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    outlineButton: {
        borderWidth: 2,
        borderColor: '#4A90B9',
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
    },
    filledButtonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 14,
    },
    outlineButtonText: {
        color: '#4A90B9',
        fontWeight: '600',
        fontSize: 14,
    },
    contentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconContainer: {
        marginRight: 8,
    },
    image: {
        width: 20,
        height: 20,
    }
})