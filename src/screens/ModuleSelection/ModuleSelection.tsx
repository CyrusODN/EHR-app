import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, StatusBar } from 'react-native';
import { Card } from 'react-native-paper';
import LogoSvg from '../../component/logo';
import Gap from '../../component/gap';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import userStore from '../../store/user';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp
} from 'react-native-responsive-screen';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '../../hooks/useThemeColors';

const ModuleSelection = () => {
    const { t } = useTranslation();
    const { colors: tc, isDark } = useThemeColors();
    const ds = createDynamicStyles(tc, isDark);
    const navigation = useNavigation();
    const setSelectedModule = userStore((state: any) => state.setSelectedModule);

    return (
        <View style={ds.container}>
            <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={tc.screenBackground} />
            
            {/* Logo */}
            <LogoSvg size={'small'} />
            
            <View style={ds.selectionWrapper}>
                <Text style={ds.subHeaderText}>
                    {t('moduleSelection.selection.subHeader')}
                </Text>
                <Gap height={20} />

                {/* Psychiatry Card */}
                <TouchableOpacity onPress={() => {
                    setSelectedModule('Psychiatry');
                    (navigation as any).navigate('Module-Loading')
                }}
                    style={ds.cardWrapper}>
                    <Card style={ds.card}>
                        <LinearGradient
                            colors={['#4A90B9', '#5BA6B6', '#68BFB3']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={ds.gradientBackground}>
                            <Card.Content style={ds.cardContentPadding}>
                                <View style={ds.cardHeader}>
                                    <View style={ds.iconContainer} >
                                        <Image source={require('../../assets/images/brain.png')} style={ds.brainIcon} />
                                    </View>

                                    <View>
                                        <Text style={ds.moduleTitleAccent}>{t('moduleSelection.selection.psychiatry.title')}</Text>
                                        <Text style={ds.moduleSubtitleAccent}>{t('moduleSelection.selection.psychiatry.subtitle')}</Text>
                                    </View>
                                </View>
                                <Text style={ds.toolDescriptionAccent}>{t('moduleSelection.selection.psychiatry.description')}</Text>
                                <View style={ds.bulletPoints}>
                                    <Text style={ds.bulletAccent}>{t('moduleSelection.selection.psychiatry.bullet1')}</Text>
                                    <Text style={ds.bulletAccent}>{t('moduleSelection.selection.psychiatry.bullet2')}</Text>
                                    <Text style={ds.bulletAccent}>{t('moduleSelection.selection.psychiatry.bullet3')}</Text>
                                </View>
                            </Card.Content>
                        </LinearGradient>
                    </Card>
                </TouchableOpacity>

                {/* POZ Card - Disabled */}
                <TouchableOpacity disabled style={ds.cardWrapper}>
                    <Card style={[ds.card, ds.disabledCard]}>
                        <Card.Content style={ds.cardContentPadding}>
                            <View style={ds.cardHeader}>
                                <View style={ds.disabledIconContainer} >
                                    <FontAwesome6
                                        name="stethoscope"
                                        size={20}
                                        color={tc.textMuted}
                                    />
                                </View>
                                <View>
                                    <Text style={ds.disabledModuleTitle}>{t('moduleSelection.selection.poz.title')}</Text>
                                    <Text style={ds.disabledModuleSubtitle}>{t('moduleSelection.selection.poz.subtitle')}</Text>
                                </View>
                            </View>
                            <Text style={ds.disabledToolDescription}>
                                {t('moduleSelection.selection.poz.description')}
                            </Text>
                            <View style={ds.bulletPoints}>
                                <Text style={ds.disabledBullet}>{t('moduleSelection.selection.poz.bullet1')}</Text>
                                <Text style={ds.disabledBullet}>{t('moduleSelection.selection.poz.bullet2')}</Text>
                                <Text style={ds.disabledBullet}>{t('moduleSelection.selection.poz.bullet3')}</Text>
                            </View>
                            <View style={ds.comingSoon}>
                                <AntDesign
                                    name="exclamationcircleo"
                                    size={14}
                                    color="#FFFFFF"
                                />
                                <Gap width={6} />
                                <Text style={ds.comingSoonText}>{t('moduleSelection.selection.poz.comingSoon')}</Text>
                            </View>
                        </Card.Content>
                    </Card>
                </TouchableOpacity>
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
    selectionWrapper: {
        width: '100%',
        alignItems: 'center',
        marginTop: hp(2),
    },
    subHeaderText: {
        fontSize: 15,
        color: tc.textSecondary,
        fontWeight: '500',
        letterSpacing: 0.3,
    },
    cardWrapper: {
        marginBottom: 20,
        width: '100%',
    },
    card: {
        borderRadius: 16,
        elevation: isDark ? 0 : 5,
        shadowColor: tc.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: isDark ? 0.3 : 0.1,
        shadowRadius: 10,
        backgroundColor: tc.cardBackground,
        overflow: 'hidden',
        borderWidth: isDark ? 1 : 0,
        borderColor: tc.borderSubtle,
    },
    disabledCard: {
        backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#F3F4F6',
        opacity: 0.8,
    },
    gradientBackground: {
        borderRadius: 16,
        width: "100%",
    },
    cardContentPadding: {
        padding: 20,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    iconContainer: {
        height: 44,
        width: 44,
        marginEnd: 12,
        borderRadius: 12,
        backgroundColor: "rgba(255,255,255,0.15)",
        alignItems: "center",
        justifyContent: "center",
    },
    disabledIconContainer: {
        height: 44,
        width: 44,
        marginEnd: 12,
        borderRadius: 12,
        backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : "rgba(0,0,0,0.05)",
        alignItems: "center",
        justifyContent: "center",
    },
    brainIcon: {
        height: 22,
        width: 22,
        tintColor: '#FFFFFF',
    },
    moduleTitleAccent: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    moduleSubtitleAccent: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.85)',
        fontWeight: '500',
    },
    toolDescriptionAccent: {
        fontSize: 14,
        lineHeight: 20,
        color: '#FFFFFF',
        marginBottom: 12,
    },
    bulletPoints: {
        gap: 6,
    },
    bulletAccent: {
        fontSize: 13,
        color: '#FFFFFF',
        opacity: 0.9,
    },
    disabledModuleTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: tc.textMuted,
    },
    disabledModuleSubtitle: {
        fontSize: 14,
        color: tc.textMuted,
    },
    disabledToolDescription: {
        fontSize: 14,
        lineHeight: 20,
        color: tc.textMuted,
        marginBottom: 12,
    },
    disabledBullet: {
        fontSize: 13,
        color: tc.textMuted,
    },
    comingSoon: {
        position: 'absolute',
        top: 15,
        right: 15,
        backgroundColor: '#DAAF59',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        flexDirection: "row",
        alignItems: 'center',
    },
    comingSoonText: {
        fontWeight: "bold",
        fontSize: 11,
        color: '#FFFFFF',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
});

export default ModuleSelection;
