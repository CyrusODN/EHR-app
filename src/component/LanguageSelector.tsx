import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import Svg, { Circle, Path, G, Rect, ClipPath, Defs } from 'react-native-svg';
import useLanguageStore from '../store/language';

const PolishFlag = () => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <Circle cx="12" cy="12" r="12" fill="white" />
        <Path d="M0 12C0 15.1826 1.26428 18.2348 3.51472 20.4853C5.76516 22.7357 8.8174 24 12 24C15.1826 24 18.2348 22.7357 20.4853 20.4853C22.7357 18.2348 24 15.1826 24 12H0Z" fill="#DC143C" />
    </Svg>
);

const UKFlag = () => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <Defs>
            <ClipPath id="clip">
                <Circle cx="12" cy="12" r="12" />
            </ClipPath>
        </Defs>
        <G clipPath="url(#clip)">
            <Rect width="24" height="24" fill="#012169" />
            <Path d="M0 0L24 24M24 0L0 24" stroke="white" strokeWidth="4" />
            <Path d="M0 0L24 24M24 0L0 24" stroke="#C8102E" strokeWidth="2" />
            <Path d="M12 0V24M0 12H24" stroke="white" strokeWidth="6" />
            <Path d="M12 0V24M0 12H24" stroke="#C8102E" strokeWidth="4" />
        </G>
    </Svg>
);

const LanguageSelector = () => {
    const { i18n } = useTranslation();
    const { setLanguage } = useLanguageStore();
    const currentLanguage = i18n.language;

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
        setLanguage(lng);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[styles.button, currentLanguage === 'pl' && styles.activeButton]}
                onPress={() => changeLanguage('pl')}
                activeOpacity={0.8}
            >
                <PolishFlag />
                <Text style={[styles.text, currentLanguage === 'pl' && styles.activeText]}>Polski</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.button, currentLanguage === 'en' && styles.activeButton]}
                onPress={() => changeLanguage('en')}
                activeOpacity={0.8}
            >
                <UKFlag />
                <Text style={[styles.text, currentLanguage === 'en' && styles.activeText]}>English</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: '#F5F7F9',
        borderRadius: 30,
        padding: 4,
        alignSelf: 'center',
        marginVertical: 20,
        borderWidth: 1,
        borderColor: '#E8EDF2',
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 25,
    },
    activeButton: {
        backgroundColor: '#FFFFFF',
        // Shadow for iOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        // Elevation for Android
        elevation: 3,
    },
    text: {
        fontSize: 15,
        fontWeight: '600',
        color: '#64748B',
        marginLeft: 8,
    },
    activeText: {
        color: '#0F172A',
    }
});

export default LanguageSelector;
