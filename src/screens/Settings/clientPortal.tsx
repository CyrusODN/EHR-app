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
import { useTranslation } from 'react-i18next';

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
    const { t } = useTranslation();
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
                    <Text style={styles.headerTitle}>{t('settings.client_portal.title')}</Text>
                </View>

                {/* Info Section */}
                <InfoBox
                    title={t('settings.client_portal.info_box.title')}
                    description={t('settings.client_portal.info_box.description')}
                />

                {/* Appointment Scheduling Module */}
                <ModuleCard>
                    <ToggleItem
                        icon={<Feather name="calendar" size={24} color="#5BA6B6" />}
                        title={t('settings.client_portal.modules.appointment_scheduling.title')}
                        description={t('settings.client_portal.modules.appointment_scheduling.description')}
                        value={toggleStates.appointmentScheduling}
                        onToggle={() => handleToggle('appointmentScheduling')}
                    />

                    <SubToggleItem
                        title={t('settings.client_portal.modules.appointment_scheduling.reservation')}
                        description={t('settings.client_portal.modules.appointment_scheduling.reservation_desc')}
                        value={toggleStates.appointmentReservation}
                        onToggle={() => handleToggle('appointmentReservation')}
                    />

                    <SubToggleItem
                        title={t('settings.client_portal.modules.appointment_scheduling.rescheduling')}
                        description={t('settings.client_portal.modules.appointment_scheduling.rescheduling_desc')}
                        value={toggleStates.appointmentRescheduling}
                        onToggle={() => handleToggle('appointmentRescheduling')}
                    />

                    <SubToggleItem
                        title={t('settings.client_portal.modules.appointment_scheduling.cancellation')}
                        description={t('settings.client_portal.modules.appointment_scheduling.cancellation_desc')}
                        value={toggleStates.appointmentCancellation}
                        onToggle={() => handleToggle('appointmentCancellation')}
                    />
                </ModuleCard>

                {/* Medical Documentation Module */}
                <ModuleCard>
                    <ToggleItem
                        icon={<Feather name="file-text" size={24} color="#5BA6B6" />}
                        title={t('settings.client_portal.modules.medical_documentation.title')}
                        description={t('settings.client_portal.modules.medical_documentation.description')}
                        value={toggleStates.medicalDocumentation}
                        onToggle={() => handleToggle('medicalDocumentation')}
                    />

                    <SubToggleItem
                        title={t('settings.client_portal.modules.medical_documentation.visit_history')}
                        description={t('settings.client_portal.modules.medical_documentation.visit_history_desc')}
                        value={toggleStates.visitHistory}
                        onToggle={() => handleToggle('visitHistory')}
                    />

                    <SubToggleItem
                        title={t('settings.client_portal.modules.medical_documentation.test_results')}
                        description={t('settings.client_portal.modules.medical_documentation.test_results_desc')}
                        value={toggleStates.testResults}
                        onToggle={() => handleToggle('testResults')}
                    />

                    <SubToggleItem
                        title={t('settings.client_portal.modules.medical_documentation.prescriptions')}
                        description={t('settings.client_portal.modules.medical_documentation.prescriptions_desc')}
                        value={toggleStates.prescriptions}
                        onToggle={() => handleToggle('prescriptions')}
                    />
                </ModuleCard>

                {/* Communication Module */}
                <ModuleCard>
                    <ToggleItem
                        icon={<Feather name="message-square" size={24} color="#5BA6B6" />}
                        title={t('settings.client_portal.modules.communication.title')}
                        description={t('settings.client_portal.modules.communication.description')}
                        value={toggleStates.communication}
                        onToggle={() => handleToggle('communication')}
                    />

                    <SubToggleItem
                        title={t('settings.client_portal.modules.communication.chat')}
                        description={t('settings.client_portal.modules.communication.chat_desc')}
                        value={toggleStates.doctorChat}
                        onToggle={() => handleToggle('doctorChat')}
                    />

                    <SubToggleItem
                        title={t('settings.client_portal.modules.communication.notifications')}
                        description={t('settings.client_portal.modules.communication.notifications_desc')}
                        value={toggleStates.notifications}
                        onToggle={() => handleToggle('notifications')}
                    />
                </ModuleCard>

                {/* Scales and Questionnaires Module */}
                <ModuleCard>
                    <ToggleItem
                        icon={<Feather name="file" size={24} color="#5BA6B6" />}
                        title={t('settings.client_portal.modules.scales_questionnaires.title')}
                        description={t('settings.client_portal.modules.scales_questionnaires.description')}
                        value={toggleStates.scalesAndQuestionnaires}
                        onToggle={() => handleToggle('scalesAndQuestionnaires')}
                    />

                    <SubToggleItem
                        title={t('settings.client_portal.modules.scales_questionnaires.mood_scales')}
                        description={t('settings.client_portal.modules.scales_questionnaires.mood_scales_desc')}
                        value={toggleStates.moodScales}
                        onToggle={() => handleToggle('moodScales')}
                    />

                    <SubToggleItem
                        title={t('settings.client_portal.modules.scales_questionnaires.quality_of_life')}
                        description={t('settings.client_portal.modules.scales_questionnaires.quality_of_life_desc')}
                        value={toggleStates.qualityOfLife}
                        onToggle={() => handleToggle('qualityOfLife')}
                    />
                </ModuleCard>

                {/* Test Results Module */}
                <ModuleCard>
                    <ToggleItem
                        icon={<Feather name="clipboard" size={24} color="#5BA6B6" />}
                        title={t('settings.client_portal.modules.test_results.title')}
                        description={t('settings.client_portal.modules.test_results.description')}
                        value={toggleStates.testResultsAccess}
                        onToggle={() => handleToggle('testResultsAccess')}
                    />

                    <SubToggleItem
                        title={t('settings.client_portal.modules.test_results.view')}
                        description={t('settings.client_portal.modules.test_results.view_desc')}
                        value={toggleStates.resultsView}
                        onToggle={() => handleToggle('resultsView')}
                    />

                    <SubToggleItem
                        title={t('settings.client_portal.modules.test_results.history')}
                        description={t('settings.client_portal.modules.test_results.history_desc')}
                        value={toggleStates.resultsHistory}
                        onToggle={() => handleToggle('resultsHistory')}
                    />
                </ModuleCard>

                {/* AI Assistant Module */}
                <ModuleCard>
                    <ToggleItem
                        icon={<Image source={require('../../assets/images/brain-primary.png')} style={{ height: 20, width: 20 }} />}
                        title={t('settings.client_portal.modules.ai_assistant.title')}
                        description={t('settings.client_portal.modules.ai_assistant.description')}
                        value={toggleStates.aiAssistant}
                        onToggle={() => handleToggle('aiAssistant')}
                    />
                    <View style={styles.aiPoweredTag}>
                        <Ionicons name="flash-outline" size={14} color="white" />
                        <Text style={styles.aiPoweredText}>{t('settings.client_portal.modules.ai_assistant.powered_tag')}</Text>
                    </View>
                    <Text style={styles.aiRequiresText}>{t('settings.client_portal.modules.ai_assistant.requires_plan')}</Text>
                </ModuleCard>
                <View style={{ backgroundColor: "white", marginTop: hp(1) }}>
                    {/* Data Security Section */}
                    <InfoBox
                        type="warning"
                        title={t('settings.client_portal.security.title')}
                        description={t('settings.client_portal.security.description')}
                    />

                    {/* Save Button */}
                    <PrimaryButton label={t('settings.client_portal.buttons.save')}
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