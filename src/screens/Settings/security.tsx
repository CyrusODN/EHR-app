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

const Security = () => {
    const navigation = useNavigation<any>();
    const { loggedInUser } = userStore() as any;

    // State variables
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
    const [trustDevicesEnabled, setTrustDevicesEnabled] = useState(false);

    // Handle save changes
    const handleSave = async () => {
        try {
            const userId = loggedInUser?.id || loggedInUser?._id;
            
            if (!userId) {
                Alert.alert("Error", "User not identified. Please try logging in again.");
                return;
            }

            const payload = {
                allowTrustedDevices: trustDevicesEnabled,
                twoFA: twoFactorEnabled,
                userId: userId
            };

            const response = await Enable2FA(payload);
            
            console.log('2FA Update result:', response);
            Alert.alert("Success", "Security settings updated successfully.");
            
        } catch (error: any) {
            console.error('Failed to update security settings:', error);
            Alert.alert("Error", error?.message || "Something went wrong while updating settings.");
        }
    };

    return (
        <SafeAreaView style={styles.safeArea} edges={['bottom']}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingRight: 10 }}>
                        <Ionicons name="chevron-back" size={24} color="#333" />
                    </TouchableOpacity>
                    <View style={styles.headerIconContainer}>
                        <Feather name="shield" size={24} color="#4A90B9" />
                    </View>
                    <Text style={styles.headerTitle}>Security Settings</Text>
                </View>

                {/* Security Options Card */}
                <View style={styles.section}>

                    {/* Two-Factor Authentication */}
                    <View style={styles.optionContainer}>
                        <View style={styles.optionTitleRow}>
                            <Feather name="shield" size={18} color="#4A90B9" />
                            <Text style={styles.optionTitle}>Two-Factor Authentication</Text>
                            {twoFactorEnabled && (
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>Enabled</Text>
                                </View>
                            )}
                        </View>

                        <View style={styles.blueInfoBox}>
                            <View style={styles.infoIconWrapper}>
                                <Feather name="info" size={16} color="#2563EB" />
                            </View>
                            <View style={styles.infoContent}>
                                <Text style={styles.infoTitleText}>Two-factor authentication is a double identity check during login.</Text>
                                <Text style={styles.infoDescText}>
                                    For additional account security, during login the user must enter a code that is sent through their chosen communication channel - email, SMS, or mobile app.
                                </Text>
                            </View>
                        </View>

                        <View style={styles.buttonRow}>
                            <PrimaryButton
                                label={twoFactorEnabled ? "Disable" : "Enable"}
                                filled={false}
                                onPress={() => setTwoFactorEnabled(!twoFactorEnabled)}
                                style={styles.actionButton}
                            />
                        </View>
                    </View>

                    <View style={styles.divider} />

                    {/* Trusted Devices */}
                    <View style={styles.optionContainer}>
                        <Text style={styles.optionTitle}>Allow users to save trusted devices</Text>
                        <Text style={styles.optionDesc}>
                            The second verification step on a given device will then only occur every 30 days, not every time
                        </Text>

                        <View style={styles.buttonRow}>
                            <PrimaryButton
                                label={trustDevicesEnabled ? "Disable" : "Enable"}
                                filled={false}
                                onPress={() => setTrustDevicesEnabled(!trustDevicesEnabled)}
                                style={styles.actionButton}
                            />
                        </View>
                    </View>

                    <View style={styles.divider} />

                    {/* Save Button */}
                    <View style={styles.footerAction}>
                        <PrimaryButton
                            label="Save Changes"
                            filled={true}
                            onPress={handleSave}
                            style={styles.saveBtn}
                            icon={<FontAwesome name="save" size={16} color="white" />}
                        />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#FFFFFF',
    },
    headerIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: '#E8F4F8',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333333',
    },
    section: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: 16,
        marginTop: 16,
        borderRadius: 12,
        padding: 20,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    optionContainer: {
        marginBottom: 20,
    },
    optionTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 12,
    },
    optionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111827',
    },
    optionDesc: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 6,
        lineHeight: 20,
    },
    badge: {
        backgroundColor: '#DEF7EC',
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 12,
    },
    badgeText: {
        color: '#03543F',
        fontSize: 12,
        fontWeight: '600',
    },
    buttonRow: {
        alignItems: 'flex-end',
        marginTop: 14,
    },
    actionButton: {
        width: 100,
        height: hp(4.5),
        marginBottom: 0,
        borderRadius: 8,
    },
    blueInfoBox: {
        backgroundColor: '#EFF6FF',
        borderRadius: 10,
        padding: 16,
        flexDirection: 'row',
        gap: 12,
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
        color: '#1E40AF',
        marginBottom: 4,
    },
    infoDescText: {
        fontSize: 13,
        color: '#3B82F6',
        lineHeight: 19,
    },
    divider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginBottom: 20,
    },
    footerAction: {
        alignItems: 'flex-end',
    },
    saveBtn: {
        width: 170,
        height: hp(5.5),
        marginBottom: 0,
        borderRadius: 8,
    },
});

export default Security;