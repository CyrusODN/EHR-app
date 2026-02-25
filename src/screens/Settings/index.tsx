// components/Settings.js
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import FacilityStatistics from './facilityStats';
import FacilityData from './facilityData';
import OfficeCertificates from './officeCerts';
import Security from './security';
import Subscription from './subsciption';
import ClientPortal from './clientPortal';
import Profile from './profile';
import Employees from './employees';
import EWUS from './ewUs';

interface NavItemProps {
    icon: React.ReactNode;
    title: string;
    index: number;
    selected: number;
    setSelected: (index: number) => void;
}
// Nav item component for consistent styling
const NavItem = ({ icon, title, index, selected, setSelected }: NavItemProps) => (
    <TouchableOpacity
        style={[styles.navItem, selected === index && styles.selectedNavItem]}
        onPress={
            () => {
                setSelected(index)
            }
        }
    >
        {icon}
        <Text style={[styles.navItemText,
        selected === index && styles.selectedNavItemText
        ]}>{title}</Text>
    </TouchableOpacity>
);
const Settings = () => {

    const navigation = useNavigation<any>();
    const [selected, setSelected] = useState(1);

    return (
        <View style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />
            <View style={{
                width: "100%",
                backgroundColor: "white",
                flexDirection: "row",
                justifyContent: "space-around",
                paddingTop: hp(7)
            }}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Settings</Text>
                    <Text style={styles.headerSubtitle}>Manage facility settings and system configuration</Text>
                </View>

                {/* Back Button */}
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={20} color="#4A90B9" />
                </TouchableOpacity>
            </View>
            <View style={{ width: "96%", alignSelf: 'flex-end', marginTop: hp(1) }}>
                {/* Navigation Menu */}
                <ScrollView
                    horizontal
                >
                    <NavItem
                        icon={<Feather name="bar-chart-2" size={20} color="#4A90B9" />}
                        title="Facility Statistics"
                        index={1}
                        selected={selected}
                        setSelected={setSelected}

                    />
                    <NavItem
                        icon={<Feather name="file-text" size={20} color="#4A90B9" />}
                        title="Facility Data"
                        index={2}
                        selected={selected}
                        setSelected={setSelected}

                    />
                    <NavItem
                        icon={<Feather name="map-pin" size={20} color="#4A90B9" />}
                        title="Offices"
                        index={3}
                        selected={selected}
                        setSelected={setSelected}
                    />
                    <NavItem
                        icon={<Feather name="shield" size={20} color="#4A90B9" />}
                        title="Security"
                        index={4}
                        selected={selected}
                        setSelected={setSelected}
                    />
                    <NavItem
                        icon={<Feather name="credit-card" size={20} color="#4A90B9" />}
                        title="Subscription"
                        index={5}
                        selected={selected}
                        setSelected={setSelected}
                    />
                    <NavItem
                        icon={<Feather name="globe" size={20} color="#4A90B9" />}
                        title="Patient Portal"
                        index={6}
                        selected={selected}
                        setSelected={setSelected}
                    />
                    <NavItem
                        icon={<Feather name="user" size={20} color="#4A90B9" />}
                        title="Profile"
                        index={7}
                        selected={selected}
                        setSelected={setSelected}
                    />
                    <NavItem
                        icon={<Feather name="users" size={20} color="#4A90B9" />}
                        title="Employees"
                        index={8}
                        selected={selected}
                        setSelected={setSelected}
                    />
                    <NavItem
                        icon={<Feather name="file" size={20} color="#4A90B9" />}
                        title="eWUŚ"
                        index={9}
                        selected={selected}
                        setSelected={setSelected}
                    />

                </ScrollView>
            </View>
            {/* Settings Content */}
            <ScrollView style={styles.content}>
                {selected == 1 ? <FacilityStatistics />
                    : selected == 2 ? <FacilityData />
                        : selected == 3 ? <OfficeCertificates />
                            : selected == 4 ? <Security />
                                : selected == 5 ? <Subscription />
                                    : selected == 6 ? <ClientPortal />
                                        : selected == 7 ? <Profile />
                                            : selected == 8 ? <Employees />
                                                : selected == 9 ? <EWUS />
                                                    : <></>
                }
            </ScrollView>


        </View>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    header: {
        paddingHorizontal: 10,
        paddingVertical: 10,
        width: "75%",
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333333',
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#666666',
        marginTop: 5,
    },
    backButton: {
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#4A90B9',
        borderRadius: 50,
        marginRight: 10,
        height: 50,
        width: 50,
        alignItems: "center",
        justifyContent: 'center',
    },
    navContainer: {
        backgroundColor: 'white',
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        flexWrap: "wrap",
        flexDirection: "row",
        justifyContent: "space-between"
    },
    navItem: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: "center",
        borderRadius: 8,
        width: wp(25),
        height: hp(7),
        marginEnd: 3,
        backgroundColor: '#f5f5f5'
    },
    selectedNavItem: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#4A90B9',
    },
    navItemText: {
        marginTop: 5,
        fontSize: 10,
        color: '#666666',
        textAlign: 'center',
    },
    selectedNavItemText: {
        color: '#4A90B9',
        fontWeight: '500',
    },
    content: {
        flex: 1,
        padding: 16,
    },
    settingsSection: {
        marginBottom: 16,
        borderRadius: 8,
        overflow: 'hidden',
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        padding: 16,
        backgroundColor: '#F9F9F9',
        color: '#333333',
    },
    buttonContainer: {
        marginVertical: 20,
        alignItems: 'center',
    },
    saveButton: {
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 30,
        alignItems: 'center',
        justifyContent: 'center',
        width: wp(80),
    },
    saveButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
    },
    helpButtonFloat: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#4A90B9',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    helpText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
});

export default Settings;