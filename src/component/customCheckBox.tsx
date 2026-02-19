import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface CustomCheckboxProps {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({ label, checked, onChange }) => {
    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => onChange(!checked)}
        >
            <View style={[
                styles.checkbox,
                checked && styles.checkedBox
            ]}>
                {checked && (
                    <Ionicons name="checkmark" size={16} color="white" />
                )}
            </View>
            <Text style={styles.label}>{label}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 3,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkedBox: {
        backgroundColor: '#4A90B9',
        borderColor: '#4A90B9',
    },
    label: {
        marginLeft: 10,
        fontSize: 16,
        color: '#333',
    },
});

export default CustomCheckbox;
