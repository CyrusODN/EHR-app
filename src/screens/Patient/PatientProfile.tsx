import React, { useState, useMemo } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    ScrollView, 
    StatusBar,
    Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation, useRoute } from '@react-navigation/native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import CustomAlert from '../../component/customAlert';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '../../hooks/useThemeColors';

// Import tab screens
import PersonalData from './profileOptions/PersonalData';
import MedicalData from './profileOptions/MedicalData';
import Laboratory from './profileOptions/Laboratory';
import Documents from './profileOptions/Documents';
import VisitList from './profileOptions/VisitList';
import Insurance from './profileOptions/Insurance';
import PatientLogs from './profileOptions/PatientLogs';

const PatientProfile = () => {
    const { t } = useTranslation();
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { patientData } = route.params || {};
    const { colors: tc, isDark } = useThemeColors();
    
    const [activeTab, setActiveTab] = useState('Personal Data');
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertType, setAlertType] = useState<any>('success');
    const [alertMessage, setAlertMessage] = useState('');

    const tabs = [
        { id: 'Personal Data', label: t('patient_tabs.personal_data') },
        { id: 'Medical Data', label: t('patient_tabs.medical_data') },
        { id: 'Laboratory', label: t('patient_tabs.laboratory') },
        { id: 'Documents', label: t('patient_tabs.documents') },
        { id: 'Visits List', label: t('patient_tabs.visits_list') },
        { id: 'Insurance', label: t('patient_tabs.insurance') },
        { id: 'Patient Logs', label: t('patient_tabs.history') },
    ];

    const handleAlert = (type: string, message: string) => {
        setAlertType(type);
        setAlertMessage(message);
        setAlertVisible(true);
    };

    const ds = useMemo(() => createDynamicStyles(tc, isDark), [tc, isDark]);

    const renderHeader = () => (
        <View style={ds.header}>
            <View style={ds.headerTextContainer}>
                <Text style={ds.headerTitle}>{t('patient_profile.title')}</Text>
                <Text style={ds.headerSubtitle}>{t('patient_profile.subtitle')}</Text>
            </View>
            <TouchableOpacity 
                style={ds.backButton}
                onPress={() => navigation.goBack()}
            >
                <Feather name="chevron-left" size={18} color={tc.accent} />
                <Text style={ds.backText}>{t('patient_profile.back_button')}</Text>
            </TouchableOpacity>
        </View>
    );

    const renderPatientCard = () => (
        <View style={ds.patientCard}>
            <View style={ds.patientInfoRow}>
                <View style={ds.avatarContainer}>
                    <Feather name="user" size={28} color={isDark ? tc.accent : "#68BFB3"} />
                </View>
                <View style={ds.patientBasicInfo}>
                    <Text style={ds.patientName}>{patientData?.name || `${patientData?.firstName} ${patientData?.lastName}` || 'Gnnhnn'}</Text>
                    <Text style={ds.patientMeta}>
                        {t('patient_header.pesel_label')}: {patientData?.pesel || '92010112345'}   •   {t('patient_header.age_label')}: {patientData?.age || '32'} {t('patient_header.age_years')}
                    </Text>
                </View>
            </View>
            
            <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={ds.actionButtonsContainer}
            >
                <TouchableOpacity style={ds.miniActionButton}>
                    <Feather name="shield" size={14} color={tc.accent} />
                    <Text style={ds.miniActionText}>{t('patient_header.ewus_button')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={ds.miniActionButton}>
                    <Feather name="home" size={14} color={tc.accent} />
                    <Text style={ds.miniActionText}>{t('patient_header.cez_button')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={ds.miniActionButton}>
                    <Feather name="file-text" size={14} color={tc.accent} />
                    <Text style={ds.miniActionText}>{t('patient_header.documents_button')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={ds.miniActionButton}>
                    <Feather name="calendar" size={14} color={tc.accent} />
                    <Text style={ds.miniActionText}>{t('patient_header.visits_button')}</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );

    const renderTabs = () => (
        <View style={ds.tabsWrapper}>
            <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={ds.tabsContainer}
            >
                {tabs.map((tab) => (
                    <TouchableOpacity 
                        key={tab.id}
                        style={[
                            ds.tabItem,
                            activeTab === tab.id && ds.activeTabItem
                        ]}
                        onPress={() => setActiveTab(tab.id)}
                    >
                        <Text style={[
                            ds.tabText,
                            activeTab === tab.id && ds.activeTabText
                        ]}>
                            {tab.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );

    const renderActiveContent = () => {
        const props = { patientData, onAlert: handleAlert };
        switch (activeTab) {
            case 'Personal Data': return <PersonalData {...props} />;
            case 'Medical Data': return <MedicalData {...props} />;
            case 'Laboratory': return <Laboratory {...props} />;
            case 'Documents': return <Documents {...props} />;
            case 'Visits List': return <VisitList {...props} />;
            case 'Insurance': return <Insurance {...props} />;
            case 'Patient Logs': return <PatientLogs {...props} />;
            default: return <PersonalData {...props} />;
        }
    };

    return (
        <SafeAreaView style={ds.safeArea}>
            <CustomAlert
                visible={alertVisible}
                type={alertType}
                message={alertMessage}
                onClose={() => setAlertVisible(false)}
            />
            <StatusBar barStyle={tc.statusBarStyle} backgroundColor={tc.headerBg} />
            <View style={ds.container}>
                {renderHeader()}
                <ScrollView 
                    showsVerticalScrollIndicator={false}
                    stickyHeaderIndices={[2]}
                    contentContainerStyle={ds.scrollContent}
                >
                    {renderPatientCard()}
                    <View style={{ height: 10 }} />
                    {renderTabs()}
                    <View style={ds.contentArea}>
                        {renderActiveContent()}
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

const createDynamicStyles = (tc: any, isDark: boolean) => StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: tc.screenBackground,
    },
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingHorizontal: 20,
        paddingTop: 15,
        paddingBottom: 20,
        backgroundColor: tc.headerBg,
        borderBottomWidth: isDark ? 1 : 0,
        borderBottomColor: tc.borderColor,
    },
    headerTextContainer: {
        flex: 1,
        paddingRight: 10,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: tc.textPrimary,
    },
    headerSubtitle: {
        fontSize: 12,
        color: tc.textSecondary,
        marginTop: 2,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: tc.borderColor,
        backgroundColor: isDark ? tc.buttonMutedBg : '#ffffff',
    },
    backText: {
        fontSize: 13,
        fontWeight: '600',
        color: tc.textSecondary,
        marginLeft: 4,
    },
    scrollContent: {
        paddingBottom: 30,
    },
    patientCard: {
        marginHorizontal: 16,
        padding: 16,
        backgroundColor: tc.cardBackground,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: tc.borderColor,
        ...Platform.select({
            ios: { shadowColor: tc.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: isDark ? 0 : 0.05, shadowRadius: 10 },
            android: { elevation: isDark ? 0 : 3 },
        }),
    },
    patientInfoRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarContainer: {
        width: 52,
        height: 52,
        borderRadius: 12,
        backgroundColor: isDark ? tc.accentLight : '#f0f9f8',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
        borderWidth: isDark ? 1 : 0,
        borderColor: tc.borderColor,
    },
    patientBasicInfo: {
        flex: 1,
    },
    patientName: {
        fontSize: 18,
        fontWeight: '700',
        color: tc.textPrimary,
    },
    patientMeta: {
        fontSize: 12,
        color: tc.textSecondary,
        marginTop: 4,
    },
    actionButtonsContainer: {
        paddingTop: 16,
        gap: 8,
    },
    miniActionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: tc.accent,
        backgroundColor: isDark ? tc.buttonMutedBg : '#ffffff',
        marginRight: 8,
    },
    miniActionText: {
        fontSize: 12,
        fontWeight: '600',
        color: tc.accent,
        marginLeft: 6,
    },
    tabsWrapper: {
        backgroundColor: tc.headerBg,
        borderBottomWidth: 1,
        borderBottomColor: tc.borderColor,
        paddingTop: 4,
    },
    tabsContainer: {
        paddingHorizontal: 16,
    },
    tabItem: {
        paddingVertical: 14,
        paddingHorizontal: 16,
        marginRight: 8,
    },
    activeTabItem: {
        borderBottomWidth: 2,
        borderBottomColor: tc.accent,
    },
    tabText: {
        fontSize: 14,
        fontWeight: '500',
        color: tc.textMuted,
    },
    activeTabText: {
        color: tc.accent,
        fontWeight: '700',
    },
    contentArea: {
        flex: 1,
        minHeight: hp(50),
    }
});

export default PatientProfile;
