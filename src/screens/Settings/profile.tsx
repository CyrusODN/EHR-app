import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    TouchableOpacity,
    Switch
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import PrimaryButton from '../../component/button';
import { getCurrentUser } from '../../Services/Auth.Service';
import { ActivityIndicator, Image, ScrollView } from 'react-native';
import userStore from '../../store/user';
import DocumentPicker from 'react-native-document-picker';
import { uploadFileOnServer } from '../../Services/Upload.Service';
import { UpdateUserInfo } from '../../Services/User.Service';
import CustomTextInput from '../../component/customTextInput';
import { useThemeColors } from '../../hooks/useThemeColors';

interface NotificationToggleItemProps {
    title: string;
    value: boolean;
    onToggle: () => void;
    tc: any;
    ds: any;
}

// Notification Toggle Item Component
const NotificationToggleItem = ({ title, value, onToggle, tc, ds }: NotificationToggleItemProps) => (
    <View style={ds.notificationItem}>
        <Text style={ds.notificationTitle}>{title}</Text>
        <Switch
            value={value}
            onValueChange={onToggle}
            trackColor={{ false: tc.borderSubtle, true: tc.accent }}
            thumbColor={'#FFFFFF'}
        />
    </View>
);

const Profile = ({ onAlert }: { onAlert?: (config: any) => void }) => {
    const { t } = useTranslation();
    const navigation = useNavigation<any>();
    const { updateUser } = userStore() as any;
    const { colors: tc, isDark } = useThemeColors();
    const ds = createDynamicStyles(tc, isDark);

    const [notificationStates, setNotificationStates] = useState({
        emailNotifications: true,
        smsNotifications: false,
        appNotifications: true
    });

    const [userData, setUserData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [profileImage, setProfileImage] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const fetchUserProfile = async () => {
        setLoading(true);
        try {
            const res: any = await getCurrentUser();
            console.log("Profile User Data:", res);
            const user = res?.user || res;
            setUserData(user);
            updateUser(user);
            setFirstName(user?.firstName || user?.name || '');
            setLastName(user?.lastName || '');
            setEmail(user?.email || user?.username || '');
            setProfileImage(user?.profileImage || '');
            
            if (user?.notificationPreference) {
                setNotificationStates({
                    emailNotifications: user.notificationPreference.email ?? true,
                    smsNotifications: user.notificationPreference.sms ?? false,
                    appNotifications: user.notificationPreference.app ?? true,
                });
            }
        } catch (error) {
            console.error("Error fetching user profile:", error);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchUserProfile();
    }, []);

    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase() || 'U';
    };

    // Handle notification toggle change
    const handleNotificationToggle = (key: string) => {
        setNotificationStates({
            ...notificationStates,
            [key]: !notificationStates[key as keyof typeof notificationStates]
        });
    };

    const handleImagePickAndUpload = async () => {
        try {
            const res = await DocumentPicker.pickSingle({
                type: [DocumentPicker.types.images],
            });

            setIsUploading(true);
            const uploadRes: any = await uploadFileOnServer(res);
            
            if (uploadRes?.data?.url) {
                setProfileImage(uploadRes.data.url);
            }
        } catch (err) {
            if (!DocumentPicker.isCancel(err)) {
                console.error("Image pick/upload error:", err);
            }
        } finally {
            setIsUploading(false);
        }
    };

    const handleSaveUserInfo = async () => {
        setIsSaving(true);
        try {
            const payload = {
                profileImage,
                name: firstName,
                lastName: lastName,
                notificationPreference: {
                    email: notificationStates.emailNotifications,
                    sms: notificationStates.smsNotifications,
                    app: notificationStates.appNotifications,
                },
                email: notificationStates.emailNotifications,
                sms: notificationStates.smsNotifications,
                app: notificationStates.appNotifications,
            };

            const res = await UpdateUserInfo(payload);
            console.log("Update user info response:", res);

            if (onAlert) {
                onAlert({
                    visible: true,
                    message: t('settings.profile.alerts.update_success'),
                    type: 'success'
                });
            }

            setIsEditing(false);
            fetchUserProfile();
        } catch (error: any) {
            console.error("Error updating user info:", error);
            if (onAlert) {
                onAlert({
                    visible: true,
                    message: error.message || t('settings.profile.alerts.update_error'),
                    type: 'error'
                });
            }
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <View style={ds.container}>
            <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={tc.cardBackground} />
            <View style={ds.container}>
                {/* Header */}
                <View style={ds.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingRight: 10 }}>
                        <Ionicons name="chevron-back" size={24} color={tc.textPrimary} />
                    </TouchableOpacity>
                    <View style={{
                        backgroundColor: isDark ? 'rgba(88, 166, 184, 0.15)' : "rgba(88, 166, 184, 0.1)",
                        height: 40, width: 40, alignItems: "center", justifyContent: 'center',
                        borderRadius: 10, marginEnd: wp(2)
                    }}>
                        <Feather name="user" size={24} color={tc.accent} />
                    </View>
                    <Text style={ds.headerTitle}>{t('profile_settings.title')}</Text>
                </View>

                {/* User Profile Section */}
                {loading ? (
                    <View style={[ds.profileSection, { justifyContent: 'center' }]}>
                        <ActivityIndicator size="large" color={tc.accent} />
                    </View>
                ) : isEditing ? (
                    <ScrollView style={{ padding: 16 }}>
                        <View style={ds.editProfileImageContainer}>
                            <View style={ds.profileIconLarge}>
                                {profileImage ? (
                                    <Image source={{ uri: profileImage }} style={ds.profileImageLarge} />
                                ) : (
                                    <Text style={ds.profileInitialsLarge}>
                                        {getInitials(firstName, lastName)}
                                    </Text>
                                )}
                                <TouchableOpacity 
                                    style={ds.cameraIconContainer}
                                    onPress={handleImagePickAndUpload}
                                    disabled={isUploading}
                                >
                                    {isUploading ? (
                                        <ActivityIndicator size="small" color="white" />
                                    ) : (
                                        <Feather name="camera" size={16} color="white" />
                                    )}
                                </TouchableOpacity>
                            </View>
                            <View style={ds.profileDetails}>
                                <Text style={ds.profileNameLarge}>{firstName} {lastName}</Text>
                                <Text style={ds.profileEmail}>{email}</Text>
                            </View>
                        </View>

                        <View style={ds.editFormContainer}>
                            <View style={ds.rowContainer}>
                                <View style={ds.halfField}>
                                    <View style={ds.labelContainer}>
                                        <Text style={ds.requiredStar}>* </Text>
                                        <Text style={ds.fieldLabel}>{t('settings.profile.labels.first_name')}</Text>
                                    </View>
                                    <CustomTextInput
                                        placeholder={t('settings.profile.labels.first_name')}
                                        value={firstName}
                                        onChangeText={setFirstName}
                                    />
                                </View>
                                <View style={ds.halfField}>
                                    <View style={ds.labelContainer}>
                                        <Text style={ds.requiredStar}>* </Text>
                                        <Text style={ds.fieldLabel}>{t('settings.profile.labels.last_name')}</Text>
                                    </View>
                                    <CustomTextInput
                                        placeholder={t('settings.profile.labels.last_name')}
                                        value={lastName}
                                        onChangeText={setLastName}
                                    />
                                </View>
                            </View>

                            <View style={ds.fullField}>
                                <Text style={ds.fieldLabel}>{t('settings.profile.labels.email')}</Text>
                                <CustomTextInput
                                    placeholder={t('settings.profile.labels.email')}
                                    value={email}
                                    onChangeText={setEmail}
                                    editable={false}
                                    style={{ backgroundColor: tc.screenBackground }}
                                />
                            </View>

                            <View style={ds.actionButtonsRow}>
                                <TouchableOpacity 
                                    style={ds.cancelButton} 
                                    onPress={() => setIsEditing(false)}
                                >
                                    <Text style={ds.cancelButtonText}>{t('settings.profile.buttons.cancel')}</Text>
                                </TouchableOpacity>
                                <PrimaryButton
                                    label={t('settings.profile.buttons.save_changes')}
                                    filled={true}
                                    onPress={handleSaveUserInfo}
                                    style={{ width: '50%', height: 45 }}
                                    loading={isSaving}
                                />
                            </View>
                        </View>

                        {/* Security Section (Within Edit mode if needed, but screenshot shows it below) */}
                        <View style={ds.sectionDivider} />
                    </ScrollView>
                ) : (
                    <>
                        <View style={ds.profileSection}>
                            <View style={ds.profileIcon}>
                                {profileImage ? (
                                    <Image source={{ uri: profileImage }} style={ds.profileImage} />
                                ) : (
                                    <Text style={ds.profileInitials}>
                                        {getInitials(userData?.firstName, userData?.lastName)}
                                    </Text>
                                )}
                            </View>
                            <View style={ds.profileDetails}>
                                <Text style={ds.profileName}>
                                    {userData?.firstName} {userData?.lastName}
                                </Text>
                                <Text style={ds.profileEmail}>
                                    {userData?.email || userData?.username}
                                </Text>
                            </View>
                        </View>
                        <PrimaryButton 
                            label={t('profile_settings.edit_profile')}
                            filled={false} 
                            onPress={() => setIsEditing(true)} 
                            style={{ width: '40%', alignSelf: 'flex-start', marginVertical: hp(1), marginLeft: 16 }}
                            icon={undefined} image={undefined} iconStyle={undefined} imageStyle={undefined}
                            loading={false} disabled={false} 
                        />
                    </>
                )}

                {(!isEditing || loading) && (
                    <ScrollView>
                        {/* Security Section */}
                        <View style={[ds.sectionContainer]}>
                            <View style={ds.sectionHeader}>
                                <Ionicons name="lock-closed-outline" size={20} color={tc.accent} style={ds.sectionIcon} />
                                <Text style={ds.sectionTitle}>{t('profile_settings.security')}</Text>
                            </View>

                            <PrimaryButton label={t('profile_settings.change_password')}
                                filled={false} onPress={() => { }} style={{ width: '40%' }}
                                icon={undefined} image={undefined} iconStyle={undefined} imageStyle={undefined}
                                loading={false} disabled={false} />
                        </View>

                        {/* Notifications Section */}
                        <View style={[ds.sectionContainer, { flexDirection: "column" }]}>
                            <View style={ds.sectionHeader}>
                                <Ionicons name="notifications-outline" size={20} color={tc.accent} style={ds.sectionIcon} />
                                <Text style={ds.sectionTitle}>{t('profile_settings.notifications')}</Text>
                            </View>
                            <NotificationToggleItem
                                title={t('profile_settings.email_notifications')}
                                value={notificationStates.emailNotifications}
                                onToggle={() => handleNotificationToggle('emailNotifications')}
                                tc={tc} ds={ds}
                            />
                            <NotificationToggleItem
                                title={t('profile_settings.sms_notifications')}
                                value={notificationStates.smsNotifications}
                                onToggle={() => handleNotificationToggle('smsNotifications')}
                                tc={tc} ds={ds}
                            />
                            <NotificationToggleItem
                                title={t('profile_settings.app_notifications')}
                                value={notificationStates.appNotifications}
                                onToggle={() => handleNotificationToggle('appNotifications')}
                                tc={tc} ds={ds}
                            />
                        </View>

                        <View style={{ backgroundColor: tc.cardBackground, paddingBottom: 20 }}>
                            <PrimaryButton
                                label={t('settings.profile.buttons.save_changes')}
                                filled={true}
                                onPress={handleSaveUserInfo}
                                style={{ alignSelf: "center" }}
                                icon={<Feather name="save" size={24} color="white" />}
                                image={undefined} iconStyle={undefined} imageStyle={undefined}
                                loading={isSaving} 
                                disabled={isSaving}
                            />
                        </View>
                    </ScrollView>
                )}

            </View>
        </View>
    );
};

const createDynamicStyles = (tc: any, isDark: boolean) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: tc.screenBackground,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: tc.cardBackground,
        borderBottomWidth: 1,
        borderBottomColor: tc.borderSubtle,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: tc.textPrimary,
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: tc.cardBackground,
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: tc.borderSubtle,
        marginBottom: 8,
    },
    profileIcon: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: tc.accent,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 20,
        shadowColor: tc.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isDark ? 0.3 : 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    profileInitials: {
        color: '#FFFFFF',
        fontSize: 26,
        fontWeight: 'bold',
    },
    profileDetails: {
        flex: 1,
    },
    profileName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: tc.textPrimary,
    },
    profileEmail: {
        fontSize: 14,
        color: tc.textSecondary,
        marginTop: 4,
    },
    sectionContainer: {
        backgroundColor: tc.cardBackground,
        paddingVertical: 20,
        paddingHorizontal: 4,
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-between",
        borderBottomWidth: 1,
        borderBottomColor: tc.borderSubtle,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    sectionIcon: {
        marginRight: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: tc.textPrimary,
    },
    notificationItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 14,
        marginTop: 8,
    },
    notificationTitle: {
        fontSize: 16,
        color: tc.textPrimary,
    },
    profileImage: {
        width: 64,
        height: 64,
        borderRadius: 32,
    },
    editProfileImageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 32,
        padding: 16,
        backgroundColor: tc.cardBackground,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: tc.borderSubtle,
    },
    profileIconLarge: {
        width: 88,
        height: 88,
        borderRadius: 44,
        backgroundColor: tc.accent,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 20,
        position: 'relative',
    },
    profileImageLarge: {
        width: 88,
        height: 88,
        borderRadius: 44,
    },
    profileInitialsLarge: {
        color: '#FFFFFF',
        fontSize: 34,
        fontWeight: 'bold',
    },
    cameraIconContainer: {
        position: 'absolute',
        bottom: 2,
        right: 2,
        backgroundColor: tc.accent,
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: tc.cardBackground,
    },
    profileNameLarge: {
        fontSize: 20,
        fontWeight: 'bold',
        color: tc.textPrimary,
    },
    editFormContainer: {
        gap: 20,
        padding: 16,
    },
    rowContainer: {
        flexDirection: 'row',
        gap: 16,
    },
    halfField: {
        flex: 1,
    },
    fullField: {
        width: '100%',
    },
    labelContainer: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    requiredStar: {
        color: '#EF4444',
        fontSize: 14,
    },
    fieldLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: tc.textSecondary,
    },
    actionButtonsRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: 16,
        marginTop: 32,
    },
    cancelButton: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: tc.accent,
    },
    cancelButtonText: {
        color: tc.accent,
        fontWeight: '600',
        fontSize: 15,
    },
    sectionDivider: {
        height: 8,
        backgroundColor: tc.screenBackground,
        marginVertical: 24,
    },
});

export default Profile;