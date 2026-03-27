import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, KeyboardTypeOptions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { validateInput } from '../utils/inputValidations';
import { useThemeColors } from '../hooks/useThemeColors';

interface CustomTextInputProps {
    placeholder: string;
    name?: string;
    value: string;
    setState?: React.Dispatch<React.SetStateAction<any>>;
    setValidationsState?: React.Dispatch<React.SetStateAction<any>>;
    validationState?: any;
    isFormSubmitted?: boolean;
    multiline?: boolean;
    numberOfLines?: number;
    icon?: React.ReactNode;
    right?: React.ReactNode;
    onRightPress?: () => void;
    keyboardType?: KeyboardTypeOptions;
    secureTextEntry?: boolean;
    onChangeText?: (text: string) => void;
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    autoCorrect?: boolean;
    editable?: boolean;
    style?: any;
}

const CustomTextInput: React.FC<CustomTextInputProps> = ({
    placeholder,
    name = '',
    value,
    setState,
    setValidationsState,
    validationState,
    isFormSubmitted,
    multiline = false,
    numberOfLines = 1,
    icon,
    right,
    onRightPress,
    keyboardType,
    secureTextEntry = false,
    onChangeText,
    autoCapitalize,
    autoCorrect,
    editable = true,
    style
}) => {
    const { t } = useTranslation();
    const { colors: tc, isDark } = useThemeColors();
    const [validationErrors, setValidationErrors] = useState<string[]>([]);

    const inputValidation = (text: string) => {
        if (!setValidationsState || !name) return;

        const errors = validateInput(text, name);
        setValidationErrors(errors);

        setValidationsState((prev: any) => ({
            ...prev,
            [name]: errors.length > 0
        }));
    };

    const handleChangeText = (text: string) => {
        if (onChangeText) {
            onChangeText(text);
        } else if (setState && name) {
            setState((prev: any) => ({ ...prev, [name]: text }));
            
            if (validationErrors.length > 0) {
                setValidationErrors([]);
                if (setValidationsState) {
                    setValidationsState((prev: any) => ({ ...prev, [name]: false }));
                }
            }
        }
    };

    useEffect(() => {
        if (isFormSubmitted) {
            inputValidation(value);
        }
    }, [isFormSubmitted]);

    return (
        <View style={styles.wrapper}>
            <View style={[
                styles.container,
                { 
                    backgroundColor: tc.inputBackground, 
                    borderColor: tc.borderColor,
                },
                multiline && styles.multilineContainer,
                validationErrors.length > 0 && styles.errorContainer,
                style
            ]}>
                {icon && (
                    <View style={styles.iconContainer}>
                        {icon}
                    </View>
                )}
                <TextInput
                    style={[
                        styles.input, 
                        { color: tc.textPrimary },
                        multiline && styles.multilineInput
                    ]}
                    placeholder={placeholder}
                    placeholderTextColor={tc.textMuted}
                    value={value}
                    onChangeText={handleChangeText}
                    multiline={multiline}
                    numberOfLines={numberOfLines}
                    keyboardType={keyboardType || 'default'}
                    secureTextEntry={secureTextEntry}
                    autoCapitalize={autoCapitalize}
                    autoCorrect={autoCorrect}
                    editable={editable}
                />
                {right && (
                    <TouchableOpacity
                        style={styles.rightIconContainer}
                        onPress={onRightPress}
                    >
                        {right}
                    </TouchableOpacity>
                )}
            </View>
            {validationErrors.length > 0 && (
                <View style={styles.errorWrapper}>
                    {validationErrors.map((error, index) => (
                        <Text key={index} style={[styles.errorText, { color: tc.accentRed || '#ff4444' }]}>
                            {t(error)}
                        </Text>
                    ))}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        width: '100%',
        marginBottom: 5,
    },
    container: {
        borderWidth: 1,
        borderRadius: 8,
        flexDirection: "row",
        alignItems: "center",
        overflow: "hidden",
        minHeight: 50,
    },
    multilineContainer: {
        minHeight: 100,
    },
    errorContainer: {
        borderColor: '#ff4444',
    },
    iconContainer: {
        paddingHorizontal: 12,
        justifyContent: 'center',
    },
    input: {
        flex: 1,
        padding: 12,
        fontSize: 14,
    },
    multilineInput: {
        textAlignVertical: 'top',
        paddingTop: 12,
    },
    rightIconContainer: {
        paddingHorizontal: 10,
        justifyContent: 'center',
    },
    errorWrapper: {
        marginTop: 4,
        paddingHorizontal: 4,
    },
    errorText: {
        fontSize: 12,
        marginTop: 2,
    }
});

export default CustomTextInput;
