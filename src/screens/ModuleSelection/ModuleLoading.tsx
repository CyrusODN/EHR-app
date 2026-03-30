import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, StatusBar } from 'react-native';
import LogoSvg from '../../component/logo';
import Gap from '../../component/gap';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp
} from 'react-native-responsive-screen';

import { useTranslation } from 'react-i18next';
import { useThemeColors } from '../../hooks/useThemeColors';

const ModuleLoading = () => {
    const { t } = useTranslation();
    const { colors: tc, isDark } = useThemeColors();
    const ds = createDynamicStyles(tc, isDark);
    const navigation = useNavigation();
    const [loadingWidth, setLoadingWidth] = useState(0);

    useEffect(() => {
        let timer: any;

        if (loadingWidth < 100) {
            timer = setTimeout(() => {
                setLoadingWidth(prev => prev + 1);
            }, 5);
        } else {
            (navigation as any).navigate('Dashboard');
        }

        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [loadingWidth, navigation]);

    return (
        <View style={ds.container}>
            <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={tc.screenBackground} />
            
            {/* Logo */}
            <LogoSvg size={'large'} />
            
            <View style={ds.starContainer}>
                <Image
                    source={require('../../assets/images/stars.png')}
                    style={[ds.starIcon, { tintColor: isDark ? tc.accent : undefined }]}
                />
            </View>

            <View style={{ width: "80%" }}>
                <View style={ds.moduleHeader}>
                    <View style={ds.brainIconContainer}>
                        <LinearGradient
                            colors={['#4A90B9', '#5BA6B6', '#68BFB3']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={ds.brainIconGradient}
                        >
                            <Image source={require('../../assets/images/brain.png')} style={ds.brainIcon} />
                        </LinearGradient>
                    </View>
                    <Text style={ds.moduleTitle}>{t('moduleSelection.loading.title')}</Text>
                </View>

                <Gap height={hp(3)} />

                {/* Progress Bar Track */}
                <View style={ds.progressBarTrack}>
                    <LinearGradient
                        colors={['#4A90B9', '#5BA6B6', '#68BFB3']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={{
                            height: '100%',
                            width: `${Math.max(loadingWidth, 2)}%`,
                            borderRadius: 4,
                        }}
                    />
                </View>

                <Gap height={hp(3)} />

                <View style={ds.initializingContainer}>
                    <Text style={ds.initializingText}>{t('moduleSelection.loading.initializing')}</Text>
                </View>
            </View>
        </View>
    );
};

const createDynamicStyles = (tc: any, isDark: boolean) => StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: "center",
        backgroundColor: tc.screenBackground,
    },
    starContainer: {
        width: "65%", 
        alignItems: "flex-end",
        marginTop: 10,
        marginBottom: 5,
    },
    starIcon: {
        height: 20, 
        width: 20,
    },
    moduleHeader: {
        flexDirection: "row",
        alignItems: "center", 
        marginVertical: hp(1), 
        justifyContent: "center",
    },
    brainIconContainer: {
        height: 48,
        width: 48,
        marginEnd: 15,
        borderRadius: 14,
        backgroundColor: tc.cardBackground,
        shadowColor: tc.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: isDark ? 0.3 : 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    brainIconGradient: {
        height: '100%',
        width: '100%',
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
    },
    brainIcon: {
        height: 24,
        width: 24,
        tintColor: 'white',
    },
    moduleTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: tc.textPrimary,
    },
    progressBarTrack: {
        height: 6,
        width: '100%',
        backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : '#E5E5E5',
        borderRadius: 4,
        overflow: 'hidden',
    },
    initializingContainer: {
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    initializingText: {
        color: tc.textSecondary,
        fontSize: 14,
        letterSpacing: 0.5,
    },
});

export default ModuleLoading;
