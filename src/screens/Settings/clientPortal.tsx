// components/ClientPortal.js
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    Switch,
    Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import PrimaryButton from '../../component/button';

interface ToggleItemProps {
    icon: React.ReactNode;
    title: string;
    description?: string;
    value: boolean;
    onToggle: () => void;
}

interface SubToggleItemProps {
    title: string;
    description?: string;
    value: boolean;
    onToggle: () => void;
    indented?: boolean;
}

interface ModuleCardProps {
    children: React.ReactNode;
}

interface InfoBoxProps {
    type?: string;
    title?: string;
    description: string;
}

// Toggle Item Component
const ToggleItem = ({ icon, title, description, value, onToggle }: ToggleItemProps) => (
    <View style={styles.toggleItem}>
        <View style={styles.toggleItemContent}>
            <View style={styles.toggleIcon}>
                {icon}
            </View>
            <View style={styles.toggleTextContainer}>
                <Text style={styles.toggleTitle}>{title}</Text>
                {description && <Text style={styles.toggleDescription}>{description}</Text>}
            </View>
        </View>
        <Switch
            value={value}
            onValueChange={onToggle}
            trackColor={{ false: '#D1D1D6', true: '#58a6b8' }}
            thumbColor={'#FFFFFF'}
        />
    </View>
);

// Sub Toggle Item Component
const SubToggleItem = ({ title, description, value, onToggle, indented = false }: SubToggleItemProps) => (
    <View style={[styles.subToggleItem,]}>
        <View style={styles.subToggleTextContainer}>
            <Text style={styles.subToggleTitle}>{title}</Text>
            {description && <Text style={styles.subToggleDescription}>{description}</Text>}
        </View>
        <Switch
            value={value}
            onValueChange={onToggle}
            trackColor={{ false: '#D1D1D6', true: '#58a6b8' }}
            thumbColor={'#FFFFFF'}
        />
    </View>
);

// Module Card Component
const ModuleCard = ({ children }: ModuleCardProps) => {
    return (
        <View style={styles.moduleCard}>
            {children}
        </View>
    );
};

// Info Box Component
const InfoBox = ({ type, title, description }: InfoBoxProps) => {
    const isWarning = type === 'warning';

    return (
        <View style={[styles.infoBox, isWarning && styles.warningBox]}>
            <Feather
                name={isWarning ? "lock" : "info"}
                size={20}
                color={isWarning ? "#F57C00" : "#4A90B9"}
                style={styles.infoIcon}
            />
            <View style={styles.infoContent}>
                {title && <Text style={[styles.infoTitle, isWarning && styles.warningTitle]}>{title}</Text>}
                <Text style={[styles.infoText, isWarning && { color: "#F57C00" }]}>{description}</Text>
            </View>
        </View>
    );
};

const ClientPortal = () => {
    const navigation = useNavigation();

    // State for toggles
    const [toggleStates, setToggleStates] = useState({
        // Scheduling appointments
        appointmentScheduling: true,
        appointmentReservation: true,
        appointmentRescheduling: true,
        appointmentCancellation: true,

        // Medical documentation
        medicalDocumentation: true,
        visitHistory: true,
        testResults: true,
        prescriptions: true,

        // Communication
        communication: true,
        doctorChat: true,
        notifications: true,

        // Scales and questionnaires
        scalesAndQuestionnaires: true,
        moodScales: true,
        qualityOfLife: true,

        // Test results
        testResultsAccess: true,
        resultsView: true,
        resultsHistory: true,

        // AI assistant
        aiAssistant: false
    });

    // Handle toggle change
    const handleToggle = (key: string) => {
        setToggleStates({
            ...toggleStates,
            [key]: !toggleStates[key as keyof typeof toggleStates]
        });
    };


    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            <ScrollView style={styles.container}>
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
                        <Feather name="users" size={24} color="#58a6b8" />
                    </View>
                    <Text style={styles.headerTitle}>Patient Portal</Text>
                </View>

                {/* Info Section */}
                <InfoBox
                    title="Patient Portal - Functions and Capabilities"
                    description="Configure which patient portal functions should be available. You can enable or disable specific modules and their detailed functions."
                />

                {/* Appointment Scheduling Module */}
                <ModuleCard>
                    <ToggleItem
                        icon={<Feather name="calendar" size={24} color="#5BA6B6" />}
                        title="Appointment Scheduling"
                        description="Patients can independently schedule and manage appointments"
                        value={toggleStates.appointmentScheduling}
                        onToggle={() => handleToggle('appointmentScheduling')}
                    />

                    <SubToggleItem
                        title="Appointment Reservation"
                        description="Ability to reserve new appointments"
                        value={toggleStates.appointmentReservation}
                        onToggle={() => handleToggle('appointmentReservation')}
                    />

                    <SubToggleItem
                        title="Appointment Rescheduling"
                        description="Ability to reschedule appointments"
                        value={toggleStates.appointmentRescheduling}
                        onToggle={() => handleToggle('appointmentRescheduling')}
                    />

                    <SubToggleItem
                        title="Appointment Cancellation"
                        description="Ability to cancel appointments"
                        value={toggleStates.appointmentCancellation}
                        onToggle={() => handleToggle('appointmentCancellation')}
                    />
                </ModuleCard>

                {/* Medical Documentation Module */}
                <ModuleCard>
                    <ToggleItem
                        icon={<Feather name="file-text" size={24} color="#5BA6B6" />}
                        title="Medical Documentation"
                        description="Access to medical documentation and test results"
                        value={toggleStates.medicalDocumentation}
                        onToggle={() => handleToggle('medicalDocumentation')}
                    />

                    <SubToggleItem
                        title="Visit History"
                        description="Overview of visit history and recommendations"
                        value={toggleStates.visitHistory}
                        onToggle={() => handleToggle('visitHistory')}
                    />

                    <SubToggleItem
                        title="Test Results"
                        description="Access to test results"
                        value={toggleStates.testResults}
                        onToggle={() => handleToggle('testResults')}
                    />

                    <SubToggleItem
                        title="Prescriptions"
                        description="History and status of prescriptions"
                        value={toggleStates.prescriptions}
                        onToggle={() => handleToggle('prescriptions')}
                    />
                </ModuleCard>

                {/* Communication Module */}
                <ModuleCard>
                    <ToggleItem
                        icon={<Feather name="message-square" size={24} color="#5BA6B6" />}
                        title="Communication"
                        description="Secure communication with medical staff"
                        value={toggleStates.communication}
                        onToggle={() => handleToggle('communication')}
                    />

                    <SubToggleItem
                        title="Chat with Doctor"
                        description="Secure text communication"
                        value={toggleStates.doctorChat}
                        onToggle={() => handleToggle('doctorChat')}
                    />

                    <SubToggleItem
                        title="Notifications"
                        description="Notifications about appointments and recommendations"
                        value={toggleStates.notifications}
                        onToggle={() => handleToggle('notifications')}
                    />
                </ModuleCard>

                {/* Scales and Questionnaires Module */}
                <ModuleCard>
                    <ToggleItem
                        icon={<Feather name="file" size={24} color="#5BA6B6" />}
                        title="Scales and Questionnaires"
                        description="Regular completion of scales and questionnaires"
                        value={toggleStates.scalesAndQuestionnaires}
                        onToggle={() => handleToggle('scalesAndQuestionnaires')}
                    />

                    <SubToggleItem
                        title="Mood Scales"
                        description="PHQ-9, GAD-7, etc."
                        value={toggleStates.moodScales}
                        onToggle={() => handleToggle('moodScales')}
                    />

                    <SubToggleItem
                        title="Quality of Life"
                        description="Quality of life questionnaires"
                        value={toggleStates.qualityOfLife}
                        onToggle={() => handleToggle('qualityOfLife')}
                    />
                </ModuleCard>

                {/* Test Results Module */}
                <ModuleCard>
                    <ToggleItem
                        icon={<Feather name="clipboard" size={24} color="#5BA6B6" />}
                        title="Test Results"
                        description="Access to test results with interpretation"
                        value={toggleStates.testResultsAccess}
                        onToggle={() => handleToggle('testResultsAccess')}
                    />

                    <SubToggleItem
                        title="Results View"
                        description="Access to test results"
                        value={toggleStates.resultsView}
                        onToggle={() => handleToggle('resultsView')}
                    />

                    <SubToggleItem
                        title="Results History"
                        description="History of all tests"
                        value={toggleStates.resultsHistory}
                        onToggle={() => handleToggle('resultsHistory')}
                    />
                </ModuleCard>

                {/* AI Assistant Module */}
                <ModuleCard>
                    <ToggleItem
                        icon={<Image source={require('../../assets/images/brain-primary.png')} style={{ height: 20, width: 20 }} />}
                        title="AI Assistant"
                        description="Intelligent assistant supporting the patient"
                        value={toggleStates.aiAssistant}
                        onToggle={() => handleToggle('aiAssistant')}
                    />
                    <View style={styles.aiPoweredTag}>
                        <Ionicons name="flash-outline" size={14} color="white" />
                        <Text style={styles.aiPoweredText}>AI Powered</Text>
                    </View>
                    <Text style={styles.aiRequiresText}>Requires AI Powered plan</Text>
                </ModuleCard>
                <View style={{ backgroundColor: "white", marginTop: hp(1) }}>
                    {/* Data Security Section */}
                    <InfoBox
                        type="warning"
                        title={"Bezpieczenstwo danych"}
                        description="All data in the patient portal is encrypted and protected in accordance with GDPR requirements. Access to the portal requires strong authentication, and all activity is monitored and logged."
                    />

                    {/* Save Button */}
                    <PrimaryButton label={"Save Settings"}
                        filled={true} onPress={() => { }}
                        style={{ alignSelf: "center" }}
                        icon={undefined}
                        image={undefined}
                        iconStyle={undefined} imageStyle={undefined}
                        loading={false} disabled={false} />
                </View>
            </ScrollView>
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
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
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
    infoBox: {
        flexDirection: 'row',
        backgroundColor: '#E8F4F8',
        borderRadius: 8,
        padding: 16,
        marginVertical: 10,        // margin: 16,
    },
    warnINfo: {
        color: "orange"
    },
    warningBox: {
        backgroundColor: '#FFF8E1',
    },
    infoIcon: {
        marginRight: 12,
        marginTop: 2,
    },
    infoContent: {
        flex: 1,
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'rgb(30 64 175)',
        marginBottom: 8,
    },
    warningTitle: {
        color: 'rgb(133 77 14)',
    },
    infoText: {
        fontSize: 14,
        color: 'blue',
        lineHeight: 20,
    },
    moduleCard: {
        backgroundColor: '#FFFFFF',
        marginTop: 8,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    toggleItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,

    },
    toggleItemContent: {
        flexDirection: 'row',
        flex: 1,
    },
    toggleIcon: {
        marginRight: 16, backgroundColor: "rgba(90,167,179,0.1)", height: 40, width: 40, borderRadius: hp(1), alignItems: "center",
        justifyContent: "center"
    },
    toggleTextContainer: {
        flex: 1,
    },
    toggleTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333333',
    },
    toggleDescription: {
        fontSize: 14,
        color: '#666666',
        marginTop: 4,
    },
    subToggleItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        marginLeft: 55,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    indentedSubToggle: {
        marginLeft: 60,
    },
    subToggleTextContainer: {
        flex: 1,
    },
    subToggleTitle: {
        fontSize: 15,
        fontWeight: '500',
        color: '#333333',
    },
    subToggleDescription: {
        fontSize: 13,
        color: '#666666',
        marginTop: 2,
    },
    aiPoweredTag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#4CAF50',
        alignSelf: 'flex-start',
        borderRadius: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
        marginLeft: 40,
        marginTop: 4,
    },
    aiPoweredText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: 'bold',
        marginLeft: 4,
    },
    aiRequiresText: {
        fontSize: 13,
        color: '#666666',
        marginLeft: 40,
        marginTop: 4,
        fontStyle: 'italic',
    },
    saveButton: {
        backgroundColor: '#4A90B9',
        borderRadius: 8,
        padding: 16,
        margin: 16,
        marginTop: 8,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default ClientPortal;