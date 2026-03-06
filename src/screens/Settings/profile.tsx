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

interface NotificationToggleItemProps {
    title: string;
    value: boolean;
    onToggle: () => void;
}

// Notification Toggle Item Component
const NotificationToggleItem = ({ title, value, onToggle }: NotificationToggleItemProps) => (
    <View style={styles.notificationItem}>
        <Text style={styles.notificationTitle}>{title}</Text>
        <Switch
            value={value}
            onValueChange={onToggle}
            trackColor={{ false: '#D1D1D6', true: '#58a6b8' }}
            thumbColor={'#FFFFFF'}
        />
    </View>
);

const Profile = ({ onAlert }: { onAlert?: (config: any) => void }) => {
    const { t } = useTranslation();
    const navigation = useNavigation<any>();
    const { updateUser } = userStore() as any;

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
                    message: "Profile updated successfully!",
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
                    message: error.message || "Failed to update profile",
                    type: 'error'
                });
            }
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingRight: 10 }}>
                        <Ionicons name="chevron-back" size={24} color="#333" />
                    </TouchableOpacity>
                    <View style={{
                        backgroundColor: "rgba(90,167,179,0.1)",
                        height: 40, width: 40, alignItems: "center", justifyContent: 'center',
                        borderRadius: 10, marginEnd: wp(2)
                    }}>
                        <Feather name="user" size={24} color="#58a6b8" />
                    </View>
                    <Text style={styles.headerTitle}>{t('profile_settings.title')}</Text>
                </View>

                {/* User Profile Section */}
                {loading ? (
                    <View style={[styles.profileSection, { justifyContent: 'center' }]}>
                        <ActivityIndicator size="large" color="#4A90B9" />
                    </View>
                ) : isEditing ? (
                    <ScrollView style={{ padding: 16 }}>
                        <View style={styles.editProfileImageContainer}>
                            <View style={styles.profileIconLarge}>
                                {profileImage ? (
                                    <Image source={{ uri: profileImage }} style={styles.profileImageLarge} />
                                ) : (
                                    <Text style={styles.profileInitialsLarge}>
                                        {getInitials(firstName, lastName)}
                                    </Text>
                                )}
                                <TouchableOpacity 
                                    style={styles.cameraIconContainer}
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
                            <View style={styles.profileDetails}>
                                <Text style={styles.profileNameLarge}>{firstName} {lastName}</Text>
                                <Text style={styles.profileEmail}>{email}</Text>
                            </View>
                        </View>

                        <View style={styles.editFormContainer}>
                            <View style={styles.rowContainer}>
                                <View style={styles.halfField}>
                                    <View style={styles.labelContainer}>
                                        <Text style={styles.requiredStar}>* </Text>
                                        <Text style={styles.fieldLabel}>First Name</Text>
                                    </View>
                                    <CustomTextInput
                                        placeholder="First Name"
                                        value={firstName}
                                        onChangeText={setFirstName}
                                    />
                                </View>
                                <View style={styles.halfField}>
                                    <View style={styles.labelContainer}>
                                        <Text style={styles.requiredStar}>* </Text>
                                        <Text style={styles.fieldLabel}>Last Name</Text>
                                    </View>
                                    <CustomTextInput
                                        placeholder="Last Name"
                                        value={lastName}
                                        onChangeText={setLastName}
                                    />
                                </View>
                            </View>

                            <View style={styles.fullField}>
                                <Text style={styles.fieldLabel}>Email</Text>
                                <CustomTextInput
                                    placeholder="Email"
                                    value={email}
                                    onChangeText={setEmail}
                                    editable={false}
                                    style={{ backgroundColor: '#F8FAFC' }}
                                />
                            </View>

                            <View style={styles.actionButtonsRow}>
                                <TouchableOpacity 
                                    style={styles.cancelButton} 
                                    onPress={() => setIsEditing(false)}
                                >
                                    <Text style={styles.cancelButtonText}>Cancel</Text>
                                </TouchableOpacity>
                                <PrimaryButton
                                    label="Save Changes"
                                    filled={true}
                                    onPress={handleSaveUserInfo}
                                    style={{ width: '50%', height: 45 }}
                                    loading={isSaving}
                                />
                            </View>
                        </View>

                        {/* Security Section (Within Edit mode if needed, but screenshot shows it below) */}
                        <View style={styles.sectionDivider} />
                    </ScrollView>
                ) : (
                    <>
                        <View style={styles.profileSection}>
                            <View style={styles.profileIcon}>
                                {profileImage ? (
                                    <Image source={{ uri: profileImage }} style={styles.profileImage} />
                                ) : (
                                    <Text style={styles.profileInitials}>
                                        {getInitials(userData?.firstName, userData?.lastName)}
                                    </Text>
                                )}
                            </View>
                            <View style={styles.profileDetails}>
                                <Text style={styles.profileName}>
                                    {userData?.firstName} {userData?.lastName}
                                </Text>
                                <Text style={styles.profileEmail}>
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
                        <View style={[styles.sectionContainer]}>
                            <View style={styles.sectionHeader}>
                                <Ionicons name="lock-closed-outline" size={20} color="#4A90B9" style={styles.sectionIcon} />
                                <Text style={styles.sectionTitle}>{t('profile_settings.security')}</Text>
                            </View>

                            <PrimaryButton label={t('profile_settings.change_password')}
                                filled={false} onPress={() => { }} style={{ width: '40%' }}
                                icon={undefined} image={undefined} iconStyle={undefined} imageStyle={undefined}
                                loading={false} disabled={false} />
                        </View>

                        {/* Notifications Section */}
                        <View style={[styles.sectionContainer, { flexDirection: "column" }]}>
                            <View style={styles.sectionHeader}>
                                <Ionicons name="notifications-outline" size={20} color="#4A90B9" style={styles.sectionIcon} />
                                <Text style={styles.sectionTitle}>{t('profile_settings.notifications')}</Text>
                            </View>
                            <NotificationToggleItem
                                title={t('profile_settings.email_notifications')}
                                value={notificationStates.emailNotifications}
                                onToggle={() => handleNotificationToggle('emailNotifications')}
                            />
                            <NotificationToggleItem
                                title={t('profile_settings.sms_notifications')}
                                value={notificationStates.smsNotifications}
                                onToggle={() => handleNotificationToggle('smsNotifications')}
                            />
                            <NotificationToggleItem
                                title={t('profile_settings.app_notifications')}
                                value={notificationStates.appNotifications}
                                onToggle={() => handleNotificationToggle('appNotifications')}
                            />
                        </View>

                        <View style={{ backgroundColor: "white", paddingBottom: 20 }}>
                            <PrimaryButton
                                label="Save Changes"
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

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333333',
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    profileIcon: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#4A90B9',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    profileInitials: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: 'bold',
    },
    profileDetails: {
        flex: 1,
    },
    profileName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333333',
    },
    profileEmail: {
        fontSize: 14,
        color: '#666666',
        marginTop: 4,
    },
    editProfileButton: {
        backgroundColor: '#E8F4F8',
        borderRadius: 8,
        padding: 12,
        margin: 16,
        alignItems: 'center',
    },
    editProfileButtonText: {
        color: '#4A90B9',
        fontSize: 16,
        fontWeight: '600',
    },
    sectionContainer: {
        backgroundColor: '#FFFFFF',
        paddingVertical: 16,
        flexDirection: "row", width: "100%", justifyContent: "space-between"
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    sectionIcon: {
        marginRight: 12,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333333',
    },
    securityAction: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    securityActionText: {
        fontSize: 16,
        color: '#4A90B9',
    },
    notificationItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    notificationTitle: {
        fontSize: 16,
        color: '#333333',
    },
    addUserButton: {
        flexDirection: 'row',
        backgroundColor: '#4A90B9',
        borderRadius: 8,
        padding: 16,
        margin: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    addUserIcon: {
        marginRight: 12,
    },
    addUserButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    profileImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    editProfileImageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    profileIconLarge: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#4A90B9',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
        position: 'relative',
    },
    profileImageLarge: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    profileInitialsLarge: {
        color: '#FFFFFF',
        fontSize: 32,
        fontWeight: 'bold',
    },
    cameraIconContainer: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#58a6b8',
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    profileNameLarge: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1E293B',
    },
    editFormContainer: {
        gap: 16,
    },
    rowContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    halfField: {
        flex: 1,
    },
    fullField: {
        width: '100%',
    },
    labelContainer: {
        flexDirection: 'row',
        marginBottom: 6,
    },
    requiredStar: {
        color: '#EF4444',
        fontSize: 14,
    },
    fieldLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: '#64748B',
        marginBottom: 6,
    },
    actionButtonsRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: 12,
        marginTop: 20,
    },
    cancelButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#58a6b8',
    },
    cancelButtonText: {
        color: '#58a6b8',
        fontWeight: '600',
    },
    sectionDivider: {
        height: 1,
        backgroundColor: '#F1F5F9',
        marginVertical: 20,
    },
});

export default Profile;