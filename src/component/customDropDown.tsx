import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { useTranslation } from 'react-i18next';

interface CustomDropdownProps {
    placeholder: string;
    options: { label: string; value: string | number }[];
    value: string | number | null;
    onChange: (value: string | number) => void;
    icon?: React.ReactNode;
    search?: boolean;
    searchPlaceholder?: string;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
    placeholder,
    options,
    value,
    onChange,
    icon,
    search = false,
    searchPlaceholder
}) => {
    const { t } = useTranslation();

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
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={options}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={placeholder}
                search={search}
                searchPlaceholder={searchPlaceholder || t('common.search')}
                value={value}
                onChange={item => {
                    onChange(item.value);
                }}
                renderLeftIcon={renderLeftIcon}
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
        borderColor: '#e0e0e0',
        borderRadius: 5,
        paddingHorizontal: 12,
        backgroundColor: 'white',
    },
    iconContainer: {
        marginRight: 10,
    },
    placeholderStyle: {
        fontSize: 16,
        color: '#999',
    },
    selectedTextStyle: {
        fontSize: 16,
        color: '#333',
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
        borderColor: '#e0e0e0',
    },
});

export default CustomDropdown;
