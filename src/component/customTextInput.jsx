// components/CustomTextInput.js
import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { validateInput } from '../utils/inputValidations';
import { isDataExists } from '../utils/generic';

const CustomTextInput = ({
    placeholder,
    name = undefined,
    value,
    setState = undefined,
    setValidationsState = undefined,
    validationState = undefined,
    isFormSubmitted = undefined,
    multiline = false,
    numberOfLines = 1,
    icon,
    right,
    onRightPress,
    keyboardType,
    secureTextEntry = false,
    onChangeText
}) => {
    const { t } = useTranslation();
    const [validationErrors, setValidationErrors] = useState([]);

    const inputValidation = (text) => {
     
        if (!!!setValidationsState) return;


        const errors = validateInput(text, name);



        setValidationErrors(errors);

        setValidationsState(prev => ({
            ...prev,
            [name]: errors.length > 0
        }));
    };

 

    const handleChangeText = (text) => {
        if (onChangeText) {
            onChangeText(text);
        } else if (setState && name) {
            setState(prev => ({ ...prev, [name]: text }));
            inputValidation(text);
        }
    };

 

    useEffect( () => {
		if ( isFormSubmitted  ) {
			setValidationErrors( [ "This field is required" ] );
			setValidationsState( ( prev ) => ( { ...prev, [ name ]: true } ) );
		}
	}, [ isFormSubmitted ] );

    return (
        <View style={styles.wrapper}>
            <View style={[
                styles.container,
                multiline && styles.multilineContainer,
                validationErrors.length > 0 && styles.errorContainer
            ]}>
                {icon && (
                    <View style={styles.iconContainer}>
                        {icon}
                    </View>
                )}
                <TextInput
                    style={[styles.input, multiline && styles.multilineInput]}
                    placeholder={placeholder}
                    placeholderTextColor="grey"
                    value={value}
                    onChangeText={handleChangeText}
                    multiline={multiline}
                    numberOfLines={numberOfLines}
                    keyboardType={keyboardType || 'default'}
                    secureTextEntry={secureTextEntry}
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
                        <Text key={index} style={styles.errorText}>
                            {error}
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
        borderColor: '#e0e0e0',
        borderRadius: 5,
        backgroundColor: 'white',
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
        paddingHorizontal: 10,
        justifyContent: 'center',
    },
    input: {
        flex: 1,
        padding: 12,
        fontSize: 14,
    },
    multilineInput: {
        textAlignVertical: 'top',
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
        color: '#ff4444',
        fontSize: 12,
        marginTop: 2,
    }
});

export default CustomTextInput;