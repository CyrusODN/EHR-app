import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    TouchableOpacity,
    Switch
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import PrimaryButton from '../../component/button';

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

const Profile = () => {
    const navigation = useNavigation<any>();

    // State for notification toggles
    const [notificationStates, setNotificationStates] = useState({
        emailNotifications: true,
        smsNotifications: false,
        appNotifications: true
    });

    // Handle notification toggle change
    const handleNotificationToggle = (key: string) => {
        setNotificationStates({
            ...notificationStates,
            [key]: !notificationStates[key as keyof typeof notificationStates]
        });
    };

    return (
        <SafeAreaView style={styles.safeArea}>
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
                    <Text style={styles.headerTitle}>Zarządzanie kontem</Text>
                </View>

                {/* User Profile Section */}
                <View style={styles.profileSection}>
                    <View style={styles.profileIcon}>
                        <Text style={styles.profileInitials}>JK</Text>
                    </View>
                    <View style={styles.profileDetails}>
                        <Text style={styles.profileName}>Jan Kowalski</Text>
                        <Text style={styles.profileEmail}>jan.kowalski@example.com</Text>
                    </View>
                </View>
                <PrimaryButton label={"Edytuj profil"}
                    filled={false} onPress={() => { }} style={{ width: '100%', alignSelf: 'center', marginVertical: hp(1) }}
                    icon={undefined} image={undefined} iconStyle={undefined} imageStyle={undefined}
                    loading={false} disabled={false} />


                {/* Security Section */}
                <View style={[styles.sectionContainer]}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="lock-closed-outline" size={20} color="#4A90B9" style={styles.sectionIcon} />
                        <Text style={styles.sectionTitle}>Bezpieczeństwo</Text>
                    </View>

                    <PrimaryButton label={"Zmień hasło"}
                        filled={false} onPress={() => { }} style={{ width: '40%' }}
                        icon={undefined} image={undefined} iconStyle={undefined} imageStyle={undefined}
                        loading={false} disabled={false} />
                </View>

                {/* Notifications Section */}
                <View style={[styles.sectionContainer, { flexDirection: "column" }]}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="notifications-outline" size={20} color="#4A90B9" style={styles.sectionIcon} />
                        <Text style={styles.sectionTitle}>Powiadomienia</Text>
                    </View>
                    <NotificationToggleItem
                        title="Powiadomienia email"
                        value={notificationStates.emailNotifications}
                        onToggle={() => handleNotificationToggle('emailNotifications')}
                    />
                    <NotificationToggleItem
                        title="Powiadomienia SMS"
                        value={notificationStates.smsNotifications}
                        onToggle={() => handleNotificationToggle('smsNotifications')}
                    />
                    <NotificationToggleItem
                        title="Powiadomienia w aplikacji"
                        value={notificationStates.appNotifications}
                        onToggle={() => handleNotificationToggle('appNotifications')}
                    />
                </View>

                <View style={{ backgroundColor: "white" }}>
                    <PrimaryButton
                        label={'Dodaj użytkownika'}
                        filled={true}
                        onPress={() => { }}
                        style={{ alignSelf: "center" }}
                        icon={<Feather name="user-plus" size={24} color="white" />}
                        image={undefined} iconStyle={undefined} imageStyle={undefined}
                        loading={false} disabled={false}
                    />
                </View>

            </View>
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
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
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
});

export default Profile;