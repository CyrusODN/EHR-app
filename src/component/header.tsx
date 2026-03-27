import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Appbar } from 'react-native-paper';
import { useThemeColors } from '../hooks/useThemeColors';
import LogoSvg from './logo';

interface HeaderProps {
    onMenuPress: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuPress }) => {
    const { colors: tc, isDark } = useThemeColors();
    const ds = useMemo(() => createDynamicStyles(tc, isDark), [tc, isDark]);

    return (
        <Appbar.Header style={ds.appBar}>
            <View style={ds.logoContainer}>
                <LogoSvg size="small" />
            </View>
            <Appbar.Action icon="menu" onPress={onMenuPress} color={tc.textPrimary} />
        </Appbar.Header>
    );
};

const createDynamicStyles = (tc: any, isDark: boolean) =>
    StyleSheet.create({
        appBar: {
            backgroundColor: tc.headerBg,
            elevation: 0,
            justifyContent: 'space-between',
            height: 60,
            borderBottomWidth: isDark ? 1 : 0,
            borderBottomColor: tc.borderColor,
        },
        logoContainer: {
            paddingLeft: 16,
            width: "70%"
        }
    });

export default Header;
