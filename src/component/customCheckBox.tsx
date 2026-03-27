import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useThemeColors } from '../hooks/useThemeColors';

interface CustomCheckboxProps {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({ label, checked, onChange }) => {
    const { colors: tc } = useThemeColors();
    
    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => onChange(!checked)}
            activeOpacity={0.7}
        >
            <View style={[
                styles.checkbox,
                { borderColor: tc.borderColor, backgroundColor: tc.buttonMutedBg },
                checked && { backgroundColor: tc.accent, borderColor: tc.accent }
            ]}>
                {checked && (
                    <Ionicons name="checkmark" size={14} color="white" />
                )}
            </View>
            <Text style={[styles.label, { color: tc.textPrimary }]}>{label}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 6,
    },
    checkbox: {
        width: 18,
        height: 18,
        borderWidth: 1,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    label: {
        marginLeft: 10,
        fontSize: 14,
        fontWeight: '500',
    },
});

export default CustomCheckbox;
