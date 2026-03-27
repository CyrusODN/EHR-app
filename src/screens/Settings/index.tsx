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
import CustomAlert from '../../component/customAlert';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '../../hooks/useThemeColors';

interface NavItemProps {
    icon: React.ReactNode;
    title: string;
    index: number;
    selected: number;
    setSelected: (index: number) => void;
    tc: any;
    ds: any;
}
// Nav item component for consistent styling
const NavItem = ({ icon, title, index, selected, setSelected, tc, ds }: NavItemProps) => {
    const isSelected = selected === index;
    return (
        <TouchableOpacity
            style={[ds.navItem, isSelected && ds.selectedNavItem]}
            onPress={() => setSelected(index)}
        >
            {React.cloneElement(icon as React.ReactElement<any>, { color: isSelected ? tc.accent : tc.textSecondary })}
            <Text style={[ds.navItemText, isSelected && ds.selectedNavItemText]}>
                {title}
            </Text>
        </TouchableOpacity>
    );
};
const Settings = () => {

    const { t } = useTranslation();
    const navigation = useNavigation<any>();
    const { colors: tc, isDark } = useThemeColors();
    const ds = createDynamicStyles(tc, isDark);
    
    const [selected, setSelected] = useState(1);
    const [alertConfig, setAlertConfig] = useState<any>({
        visible: false,
        type: 'success',
        message: '',
    });

    return (
        <View style={ds.safeArea}>
            <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={tc.cardBackground} />
            <View style={ds.headerWrapper}>
                <View style={ds.header}>
                    <Text style={ds.headerTitle}>{t('settings.index.title')}</Text>
                    <Text style={ds.headerSubtitle}>{t('settings.index.subtitle')}</Text>
                </View>

                {/* Back Button */}
                <TouchableOpacity
                    style={ds.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={20} color={tc.accent} />
                </TouchableOpacity>
            </View>
            <View style={ds.navWrapper}>
                {/* Navigation Menu */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                >
                    <NavItem
                        icon={<Feather name="bar-chart-2" size={20} />}
                        title={t('settings.index.tabs.statistics')}
                        index={1}
                        selected={selected}
                        setSelected={setSelected}
                        tc={tc}
                        ds={ds}
                    />
                    <NavItem
                        icon={<Feather name="file-text" size={20} />}
                        title={t('settings.index.tabs.facility_data')}
                        index={2}
                        selected={selected}
                        setSelected={setSelected}
                        tc={tc}
                        ds={ds}
                    />
                    <NavItem
                        icon={<Feather name="map-pin" size={20} />}
                        title={t('settings.index.tabs.offices')}
                        index={3}
                        selected={selected}
                        setSelected={setSelected}
                        tc={tc}
                        ds={ds}
                    />
                    <NavItem
                        icon={<Feather name="shield" size={20} />}
                        title={t('settings.index.tabs.security')}
                        index={4}
                        selected={selected}
                        setSelected={setSelected}
                        tc={tc}
                        ds={ds}
                    />
                    <NavItem
                        icon={<Feather name="credit-card" size={20} />}
                        title={t('settings.index.tabs.subscription')}
                        index={5}
                        selected={selected}
                        setSelected={setSelected}
                        tc={tc}
                        ds={ds}
                    />
                    <NavItem
                        icon={<Feather name="globe" size={20} />}
                        title={t('settings.index.tabs.patient_portal')}
                        index={6}
                        selected={selected}
                        setSelected={setSelected}
                        tc={tc}
                        ds={ds}
                    />
                    <NavItem
                        icon={<Feather name="user" size={20} />}
                        title={t('settings.index.tabs.profile')}
                        index={7}
                        selected={selected}
                        setSelected={setSelected}
                        tc={tc}
                        ds={ds}
                    />
                    <NavItem
                        icon={<Feather name="users" size={20} />}
                        title={t('settings.index.tabs.employees')}
                        index={8}
                        selected={selected}
                        setSelected={setSelected}
                        tc={tc}
                        ds={ds}
                    />
                    <NavItem
                        icon={<Feather name="file" size={20} />}
                        title={t('settings.index.tabs.ewus')}
                        index={9}
                        selected={selected}
                        setSelected={setSelected}
                        tc={tc}
                        ds={ds}
                    />

                </ScrollView>
            </View>
            {/* Settings Content */}
            <ScrollView style={ds.content} contentContainerStyle={{ paddingBottom: 50 }}>
                {selected == 1 ? <FacilityStatistics />
                    : selected == 2 ? <FacilityData onAlert={(config: any) => setAlertConfig(config)} />
                        : selected == 3 ? <OfficeCertificates onAlert={(config: any) => setAlertConfig(config)} />
                            : selected == 4 ? <Security />
                                : selected == 5 ? <Subscription />
                                    : selected == 6 ? <ClientPortal />
                                        : selected == 7 ? <Profile onAlert={(config: any) => setAlertConfig(config)} />
                                            : selected == 8 ? <Employees onAlert={(config: any) => setAlertConfig(config)} />
                                                : selected == 9 ? <EWUS />
                                                    : <></>
                }
            </ScrollView>

            <CustomAlert
                visible={alertConfig.visible}
                type={alertConfig.type}
                message={alertConfig.message}
                onClose={() => setAlertConfig({ ...alertConfig, visible: false })}
            />

        </View>
    );
};

const createDynamicStyles = (tc: any, isDark: boolean) => StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: tc.screenBackground,
    },
    headerWrapper: {
        width: "100%",
        backgroundColor: tc.cardBackground,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: 'center',
        paddingTop: hp(6),
        paddingBottom: 10,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: tc.borderSubtle,
    },
    header: {
        paddingVertical: 5,
        width: "75%",
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: tc.textPrimary,
    },
    headerSubtitle: {
        fontSize: 14,
        color: tc.textSecondary,
        marginTop: 2,
    },
    backButton: {
        borderWidth: 1,
        borderColor: tc.accent,
        borderRadius: 50,
        height: 44,
        width: 44,
        alignItems: "center",
        justifyContent: 'center',
    },
    navWrapper: {
        width: "100%",
        backgroundColor: tc.cardBackground,
        paddingVertical: 12,
        paddingLeft: 10,
        borderBottomWidth: 1,
        borderBottomColor: tc.borderSubtle,
    },
    navItem: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: "center",
        borderRadius: 12,
        width: wp(26),
        height: hp(8),
        marginEnd: 8,
        backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#F3F6F8',
    },
    selectedNavItem: {
        backgroundColor: isDark ? 'rgba(74, 144, 185, 0.15)' : '#EBF5FA',
        borderWidth: 1.5,
        borderColor: tc.accent,
    },
    navItemText: {
        marginTop: 6,
        fontSize: 11,
        fontWeight: '500',
        color: tc.textSecondary,
        textAlign: 'center',
    },
    selectedNavItemText: {
        color: tc.accent,
        fontWeight: '700',
    },
    content: {
        flex: 1,
        backgroundColor: tc.screenBackground,
    },
});

export default Settings;