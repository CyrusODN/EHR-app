import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import LogoSvg from '../component/logo';
import { useThemeColors } from '../hooks/useThemeColors';


const Splash = () => {
    const { colors: tc, isDark } = useThemeColors();

    return (
        <View style={[styles.container, { backgroundColor: tc.screenBackground }]}>
            <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={tc.screenBackground} />
            <LogoSvg />
        </View>
    );
};

export default Splash;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
});
