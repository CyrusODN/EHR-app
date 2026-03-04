import React, { useState } from 'react';
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

// Import tab screens
import PersonalData from './profileOptions/PersonalData';
import MedicalData from './profileOptions/MedicalData';
import Laboratory from './profileOptions/Laboratory';
import Documents from './profileOptions/Documents';
import VisitList from './profileOptions/VisitList';
import Insurance from './profileOptions/Insurance';
import PatientLogs from './profileOptions/PatientLogs';

const PatientProfile = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { patientData } = route.params || {};
    
    // In mobile, we might want fewer tabs or a more compact way to show them
    const [activeTab, setActiveTab] = useState('Personal Data');
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertType, setAlertType] = useState<'success' | 'error' | 'warning'>('success');
    const [alertMessage, setAlertMessage] = useState('');

    const tabs = [
        'Personal Data',
        'Medical Data',
        'Laboratory',
        'Documents',
        'Visits List',
        'Insurance',
        'Patient Logs'
    ];

    const renderHeader = () => (
        <View style={styles.header}>
            <View style={styles.headerTextContainer}>
                <Text style={styles.headerTitle}>Patient Profile</Text>
                <Text style={styles.headerSubtitle}>Manage patient data and medical documentation</Text>
            </View>
            <TouchableOpacity 
                style={styles.backButton}
                onPress={() => navigation.goBack()}
            >
                <Feather name="chevron-left" size={18} color="#4A90B9" />
                <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>
        </View>
    );

    const renderPatientCard = () => (
        <View style={styles.patientCard}>
            <View style={styles.patientInfoRow}>
                <View style={styles.avatarContainer}>
                    <Feather name="user" size={28} color="#68BFB3" />
                </View>
                <View style={styles.patientBasicInfo}>
                    <Text style={styles.patientName}>{patientData?.name || `${patientData?.firstName} ${patientData?.lastName}` || 'Gnnhnn'}</Text>
                    <Text style={styles.patientMeta}>
                        PESEL: {patientData?.pesel || 'nhnn'}   •   Age: {patientData?.age || '2 years'}
                    </Text>
                </View>
            </View>
            
            <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.actionButtonsContainer}
            >
                <TouchableOpacity style={styles.miniActionButton}>
                    <Feather name="shield" size={14} color="#58a6b8" />
                    <Text style={styles.miniActionText}>eWUŚ</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.miniActionButton}>
                    <Feather name="home" size={14} color="#58a6b8" />
                    <Text style={styles.miniActionText}>CEZ</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.miniActionButton}>
                    <Feather name="file-text" size={14} color="#58a6b8" />
                    <Text style={styles.miniActionText}>Documents</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.miniActionButton}>
                    <Feather name="calendar" size={14} color="#58a6b8" />
                    <Text style={styles.miniActionText}>Visits</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );

    const renderTabs = () => (
        <View style={styles.tabsWrapper}>
            <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.tabsContainer}
            >
                {tabs.map((tab) => (
                    <TouchableOpacity 
                        key={tab}
                        style={[
                            styles.tabItem,
                            activeTab === tab && styles.activeTabItem
                        ]}
                        onPress={() => setActiveTab(tab)}
                    >
                        <Text style={[
                            styles.tabText,
                            activeTab === tab && styles.activeTabText
                        ]}>
                            {tab}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );

    const handleAlert = (type: 'success' | 'error' | 'warning', message: string) => {
        setAlertType(type);
        setAlertMessage(message);
        setAlertVisible(true);
    };

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
        <SafeAreaView style={styles.safeArea}>
            <CustomAlert
                visible={alertVisible}
                type={alertType}
                message={alertMessage}
                onClose={() => setAlertVisible(false)}
            />
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
            <View style={styles.container}>
                {renderHeader()}
                <ScrollView 
                    showsVerticalScrollIndicator={false}
                    stickyHeaderIndices={[2]}
                    contentContainerStyle={styles.scrollContent}
                >
                    {renderPatientCard()}
                    <View style={{ height: 10 }} />
                    {renderTabs()}
                    <View style={styles.contentArea}>
                        {renderActiveContent()}
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f8fafc',
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
        backgroundColor: '#ffffff',
    },
    headerTextContainer: {
        flex: 1,
        paddingRight: 10,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1e293b',
    },
    headerSubtitle: {
        fontSize: 12,
        color: '#64748b',
        marginTop: 2,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        backgroundColor: '#ffffff',
    },
    backText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#475569',
        marginLeft: 4,
    },
    scrollContent: {
        paddingBottom: 30,
    },
    patientCard: {
        marginHorizontal: 16,
        padding: 16,
        backgroundColor: '#ffffff',
        borderRadius: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    patientInfoRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarContainer: {
        width: 52,
        height: 52,
        borderRadius: 12,
        backgroundColor: '#f0f9f8',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    patientBasicInfo: {
        flex: 1,
    },
    patientName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1e293b',
    },
    patientMeta: {
        fontSize: 12,
        color: '#64748b',
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
        borderColor: '#58a6b8',
        backgroundColor: '#ffffff',
        marginRight: 8,
    },
    miniActionText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#58a6b8',
        marginLeft: 6,
    },
    tabsWrapper: {
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
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
        borderBottomColor: '#58a6b8',
    },
    tabText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#64748b',
    },
    activeTabText: {
        color: '#58a6b8',
        fontWeight: '700',
    },
    contentArea: {
        flex: 1,
        minHeight: hp(50),
    }
});

export default PatientProfile;
