import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '../hooks/useThemeColors';

interface CustomDropdownProps {
    placeholder: string;
    options: { label: string; value: string | number }[];
    value: string | number | null;
    onChange: (value: string | number) => void;
    icon?: React.ReactNode;
    search?: boolean;
    searchPlaceholder?: string;
    style?: any;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
    placeholder,
    options,
    value,
    onChange,
    icon,
    search = false,
    searchPlaceholder,
    style,
}) => {
    const { t } = useTranslation();
    const { colors: tc, isDark } = useThemeColors();

    const renderLeftIcon = () => {
        if (!icon) return null;
        return (
            <View style={styles.iconContainer}>
                {icon}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Dropdown
                style={[
                    styles.dropdown, 
                    { 
                        backgroundColor: tc.inputBackground, 
                        borderColor: tc.borderColor 
                    },
                    style
                ]}
                placeholderStyle={[styles.placeholderStyle, { color: tc.textMuted }]}
                selectedTextStyle={[styles.selectedTextStyle, { color: tc.textPrimary }]}
                inputSearchStyle={[
                    styles.inputSearchStyle, 
                    { 
                        backgroundColor: tc.inputBackground, 
                        color: tc.textPrimary,
                        borderColor: tc.borderColor
                    }
                ]}
                containerStyle={{ 
                    backgroundColor: tc.drawerBg, 
                    borderColor: tc.borderColor,
                    borderRadius: 12,
                    overflow: 'hidden'
                }}
                itemTextStyle={{ color: tc.textPrimary, fontSize: 14 }}
                activeColor={isDark ? 'rgba(70, 183, 198, 0.1)' : '#F0F9FF'}
                data={options}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={placeholder}
                search={search}
                searchPlaceholder={searchPlaceholder || t('common.search')}
                value={value}
                onChange={item => onChange(item.value)}
                renderLeftIcon={renderLeftIcon}
                renderItem={(item) => (
                    <View style={[styles.item, { backgroundColor: tc.drawerBg }]}>
                        <Text style={[styles.itemText, { color: tc.textPrimary }]}>{item.label}</Text>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    dropdown: {
        height: 50,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
    },
    iconContainer: {
        marginRight: 10,
    },
    placeholderStyle: {
        fontSize: 14,
    },
    selectedTextStyle: {
        fontSize: 14,
    },
    inputSearchStyle: {
        height: 45,
        fontSize: 14,
        borderRadius: 8,
    },
    item: {
        padding: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemText: {
        fontSize: 14,
    }
});

export default CustomDropdown;
