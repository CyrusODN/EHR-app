import React from 'react';
import { View, StyleSheet } from 'react-native';
import LogoSvg from '../component/logo';


const Splash = () => {
    return (
        <View style={styles.container}>
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
        backgroundColor: 'white',
        width: '100%',
    },
});
