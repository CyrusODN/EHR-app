// components/Security.js
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import PrimaryButton from '../../component/button';
import userStore from '../../store/user';
import { Enable2FA } from '../../Services/User.Service';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '../../hooks/useThemeColors';

const Security = () => {
    const { t } = useTranslation();
    const navigation = useNavigation<any>();
    const { loggedInUser } = userStore() as any;
    const { colors: tc, isDark } = useThemeColors();
    const ds = createDynamicStyles(tc, isDark);

    // State variables
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
    const [trustDevicesEnabled, setTrustDevicesEnabled] = useState(false);

    // Handle save changes
    const handleSave = async () => {
        try {
            const userId = loggedInUser?.id || loggedInUser?._id;
            
            if (!userId) {
                Alert.alert(t('settings.security.alerts.error_title'), t('settings.security.alerts.user_not_found'));
                return;
            }

            const payload = {
                allowTrustedDevices: trustDevicesEnabled,
                twoFA: twoFactorEnabled,
                userId: userId
            };

            const response = await Enable2FA(payload);
            
            console.log('2FA Update result:', response);
            Alert.alert(t('settings.security.alerts.success_title'), t('settings.security.alerts.update_success'));
            
        } catch (error: any) {
            console.error('Failed to update security settings:', error);
            Alert.alert(t('settings.security.alerts.error_title'), error?.message || t('settings.security.alerts.update_error'));
        }
    };

    return (
        <SafeAreaView style={ds.safeArea} edges={['bottom']}>
            <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={tc.cardBackground} />
            <ScrollView style={ds.container} contentContainerStyle={{ paddingBottom: 30 }}>
                {/* Header */}
                <View style={ds.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingRight: 10 }}>
                        <Ionicons name="chevron-back" size={24} color={tc.textPrimary} />
                    </TouchableOpacity>
                    <View style={ds.headerIconContainer}>
                        <Feather name="shield" size={24} color={tc.accent} />
                    </View>
                    <Text style={ds.headerTitle}>{t('settings.security.title')}</Text>
                </View>

                {/* Security Options Card */}
                <View style={ds.section}>

                    {/* Two-Factor Authentication */}
                    <View style={ds.optionContainer}>
                        <View style={ds.optionTitleRow}>
                            <Feather name="shield" size={18} color={tc.accent} />
                            <Text style={ds.optionTitle}>{t('settings.security.two_factor.title')}</Text>
                            {twoFactorEnabled && (
                                <View style={ds.badge}>
                                    <Text style={ds.badgeText}>{t('settings.security.two_factor.enabled')}</Text>
                                </View>
                            )}
                        </View>

                        <View style={ds.blueInfoBox}>
                            <View style={ds.infoIconWrapper}>
                                <Feather name="info" size={16} color={isDark ? tc.accent : "#2563EB"} />
                            </View>
                            <View style={ds.infoContent}>
                                <Text style={ds.infoTitleText}>{t('settings.security.two_factor.info_title')}</Text>
                                <Text style={ds.infoDescText}>
                                    {t('settings.security.two_factor.info_desc')}
                                </Text>
                            </View>
                        </View>

                        <View style={ds.buttonRow}>
                            <PrimaryButton
                                label={twoFactorEnabled ? t('settings.security.buttons.disable') : t('settings.security.buttons.enable')}
                                filled={false}
                                onPress={() => setTwoFactorEnabled(!twoFactorEnabled)}
                                style={ds.actionButton}
                            />
                        </View>
                    </View>

                    <View style={ds.divider} />

                    {/* Trusted Devices */}
                    <View style={ds.optionContainer}>
                        <Text style={ds.optionTitle}>{t('settings.security.trusted_devices.title')}</Text>
                        <Text style={ds.optionDesc}>
                            {t('settings.security.trusted_devices.description')}
                        </Text>

                        <View style={ds.buttonRow}>
                            <PrimaryButton
                                label={trustDevicesEnabled ? t('settings.security.buttons.disable') : t('settings.security.buttons.enable')}
                                filled={false}
                                onPress={() => setTrustDevicesEnabled(!trustDevicesEnabled)}
                                style={ds.actionButton}
                            />
                        </View>
                    </View>

                    <View style={ds.divider} />

                    {/* Save Button */}
                    <View style={ds.footerAction}>
                        <PrimaryButton
                            label={t('settings.security.buttons.save_changes')}
                            filled={true}
                            onPress={handleSave}
                            style={ds.saveBtn}
                            icon={<FontAwesome name="save" size={16} color="white" />}
                        />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const createDynamicStyles = (tc: any, isDark: boolean) => StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: tc.cardBackground,
    },
    container: {
        flex: 1,
        backgroundColor: tc.screenBackground,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: tc.cardBackground,
        borderBottomWidth: 1,
        borderBottomColor: tc.borderSubtle,
    },
    headerIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: isDark ? 'rgba(74, 144, 185, 0.1)' : '#E8F4F8',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: tc.textPrimary,
    },
    section: {
        backgroundColor: tc.cardBackground,
        marginHorizontal: 16,
        marginTop: 16,
        borderRadius: 16,
        padding: 24,
        shadowColor: tc.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: isDark ? 0.3 : 0.05,
        shadowRadius: 10,
        elevation: 4,
        borderWidth: isDark ? 1 : 0,
        borderColor: tc.borderSubtle,
    },
    optionContainer: {
        marginBottom: 20,
    },
    optionTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 16,
    },
    optionTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: tc.textPrimary,
    },
    optionDesc: {
        fontSize: 14,
        color: tc.textSecondary,
        marginTop: 8,
        lineHeight: 22,
    },
    badge: {
        backgroundColor: isDark ? 'rgba(16, 185, 129, 0.2)' : '#DEF7EC',
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 12,
    },
    badgeText: {
        color: isDark ? '#34D399' : '#03543F',
        fontSize: 12,
        fontWeight: '600',
    },
    buttonRow: {
        alignItems: 'flex-end',
        marginTop: 16,
    },
    actionButton: {
        width: 110,
        height: hp(4.8),
        marginBottom: 0,
        borderRadius: 10,
    },
    blueInfoBox: {
        backgroundColor: isDark ? 'rgba(59, 130, 246, 0.1)' : '#EFF6FF',
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        gap: 12,
        borderWidth: isDark ? 1 : 0,
        borderColor: 'rgba(59, 130, 246, 0.2)',
    },
    infoIconWrapper: {
        marginTop: 2,
    },
    infoContent: {
        flex: 1,
    },
    infoTitleText: {
        fontSize: 14,
        fontWeight: '700',
        color: isDark ? '#60A5FA' : '#1E40AF',
        marginBottom: 4,
    },
    infoDescText: {
        fontSize: 13,
        color: isDark ? 'rgba(96, 165, 250, 0.8)' : '#3B82F6',
        lineHeight: 20,
    },
    divider: {
        height: 1,
        backgroundColor: tc.borderSubtle,
        marginVertical: 24,
    },
    footerAction: {
        alignItems: 'flex-end',
    },
    saveBtn: {
        width: 170,
        height: hp(5.5),
        marginBottom: 0,
        borderRadius: 10,
    },
});

export default Security;