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
    Image,
    Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import PrimaryButton from '../../component/button';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '../../hooks/useThemeColors';

// Toggle Item Component
const ToggleItem = ({ icon, title, description, value, onToggle, tc, ds }: any) => (
    <View style={ds.toggleItem}>
        <View style={ds.toggleItemContent}>
            <View style={ds.toggleIcon}>
                {icon}
            </View>
            <View style={ds.toggleTextContainer}>
                <Text style={ds.toggleTitle}>{title}</Text>
                {description && <Text style={ds.toggleDescription}>{description}</Text>}
            </View>
        </View>
        <Switch
            value={value}
            onValueChange={onToggle}
            trackColor={{ false: tc.borderSubtle, true: tc.accent }}
            thumbColor={'#FFFFFF'}
        />
    </View>
);

// Sub Toggle Item Component
const SubToggleItem = ({ title, description, value, onToggle, tc, ds }: any) => (
    <View style={ds.subToggleItem}>
        <View style={ds.subToggleTextContainer}>
            <Text style={ds.subToggleTitle}>{title}</Text>
            {description && <Text style={ds.subToggleDescription}>{description}</Text>}
        </View>
        <Switch
            value={value}
            onValueChange={onToggle}
            trackColor={{ false: tc.borderSubtle, true: tc.accent }}
            thumbColor={'#FFFFFF'}
        />
    </View>
);

// Module Card Component
const ModuleCard = ({ children, ds }: any) => {
    return (
        <View style={ds.moduleCard}>
            {children}
        </View>
    );
};

// Info Box Component
const InfoBox = ({ type, title, description, tc, ds }: any) => {
    const isWarning = type === 'warning';

    return (
        <View style={[ds.infoBox, isWarning && ds.warningBox]}>
            <Feather
                name={isWarning ? "lock" : "info"}
                size={20}
                color={isWarning ? "#F59E0B" : tc.accent}
                style={ds.infoIcon}
            />
            <View style={ds.infoContent}>
                {title && <Text style={[ds.infoTitle, isWarning && ds.warningTitle]}>{title}</Text>}
                <Text style={[ds.infoText, isWarning && ds.warningText]}>{description}</Text>
            </View>
        </View>
    );
};

const ClientPortal = () => {
    const { t } = useTranslation();
    const navigation = useNavigation<any>();
    const { colors: tc, isDark } = useThemeColors();
    const ds = createDynamicStyles(tc, isDark);

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
        <View style={ds.container}>
            <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={tc.cardBackground} />
            <ScrollView style={ds.container}>
                {/* Header */}
                <View style={ds.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingRight: 10 }}>
                        <Ionicons name="chevron-back" size={24} color={tc.textPrimary} />
                    </TouchableOpacity>
                    <View style={ds.headerIconContainer}>
                        <Feather name="users" size={22} color={tc.accent} />
                    </View>
                    <Text style={ds.headerTitle}>{t('settings.client_portal.title')}</Text>
                </View>

                {/* Info Section */}
                <InfoBox
                    title={t('settings.client_portal.info_box.title')}
                    description={t('settings.client_portal.info_box.description')}
                    tc={tc} ds={ds}
                />

                {/* Appointment Scheduling Module */}
                <ModuleCard ds={ds}>
                    <ToggleItem
                        icon={<Feather name="calendar" size={24} color={tc.accent} />}
                        title={t('settings.client_portal.modules.appointment_scheduling.title')}
                        description={t('settings.client_portal.modules.appointment_scheduling.description')}
                        value={toggleStates.appointmentScheduling}
                        onToggle={() => handleToggle('appointmentScheduling')}
                        tc={tc} ds={ds}
                    />

                    <SubToggleItem
                        title={t('settings.client_portal.modules.appointment_scheduling.reservation')}
                        description={t('settings.client_portal.modules.appointment_scheduling.reservation_desc')}
                        value={toggleStates.appointmentReservation}
                        onToggle={() => handleToggle('appointmentReservation')}
                        tc={tc} ds={ds}
                    />

                    <SubToggleItem
                        title={t('settings.client_portal.modules.appointment_scheduling.rescheduling')}
                        description={t('settings.client_portal.modules.appointment_scheduling.rescheduling_desc')}
                        value={toggleStates.appointmentRescheduling}
                        onToggle={() => handleToggle('appointmentRescheduling')}
                        tc={tc} ds={ds}
                    />

                    <SubToggleItem
                        title={t('settings.client_portal.modules.appointment_scheduling.cancellation')}
                        description={t('settings.client_portal.modules.appointment_scheduling.cancellation_desc')}
                        value={toggleStates.appointmentCancellation}
                        onToggle={() => handleToggle('appointmentCancellation')}
                        tc={tc} ds={ds}
                    />
                </ModuleCard>

                {/* Medical Documentation Module */}
                <ModuleCard ds={ds}>
                    <ToggleItem
                        icon={<Feather name="file-text" size={24} color={tc.accent} />}
                        title={t('settings.client_portal.modules.medical_documentation.title')}
                        description={t('settings.client_portal.modules.medical_documentation.description')}
                        value={toggleStates.medicalDocumentation}
                        onToggle={() => handleToggle('medicalDocumentation')}
                        tc={tc} ds={ds}
                    />

                    <SubToggleItem
                        title={t('settings.client_portal.modules.medical_documentation.visit_history')}
                        description={t('settings.client_portal.modules.medical_documentation.visit_history_desc')}
                        value={toggleStates.visitHistory}
                        onToggle={() => handleToggle('visitHistory')}
                        tc={tc} ds={ds}
                    />

                    <SubToggleItem
                        title={t('settings.client_portal.modules.medical_documentation.test_results')}
                        description={t('settings.client_portal.modules.medical_documentation.test_results_desc')}
                        value={toggleStates.testResults}
                        onToggle={() => handleToggle('testResults')}
                        tc={tc} ds={ds}
                    />

                    <SubToggleItem
                        title={t('settings.client_portal.modules.medical_documentation.prescriptions')}
                        description={t('settings.client_portal.modules.medical_documentation.prescriptions_desc')}
                        value={toggleStates.prescriptions}
                        onToggle={() => handleToggle('prescriptions')}
                        tc={tc} ds={ds}
                    />
                </ModuleCard>

                {/* Communication Module */}
                <ModuleCard ds={ds}>
                    <ToggleItem
                        icon={<Feather name="message-square" size={24} color={tc.accent} />}
                        title={t('settings.client_portal.modules.communication.title')}
                        description={t('settings.client_portal.modules.communication.description')}
                        value={toggleStates.communication}
                        onToggle={() => handleToggle('communication')}
                        tc={tc} ds={ds}
                    />

                    <SubToggleItem
                        title={t('settings.client_portal.modules.communication.chat')}
                        description={t('settings.client_portal.modules.communication.chat_desc')}
                        value={toggleStates.doctorChat}
                        onToggle={() => handleToggle('doctorChat')}
                        tc={tc} ds={ds}
                    />

                    <SubToggleItem
                        title={t('settings.client_portal.modules.communication.notifications')}
                        description={t('settings.client_portal.modules.communication.notifications_desc')}
                        value={toggleStates.notifications}
                        onToggle={() => handleToggle('notifications')}
                        tc={tc} ds={ds}
                    />
                </ModuleCard>

                {/* Scales and Questionnaires Module */}
                <ModuleCard ds={ds}>
                    <ToggleItem
                        icon={<Feather name="file" size={24} color={tc.accent} />}
                        title={t('settings.client_portal.modules.scales_questionnaires.title')}
                        description={t('settings.client_portal.modules.scales_questionnaires.description')}
                        value={toggleStates.scalesAndQuestionnaires}
                        onToggle={() => handleToggle('scalesAndQuestionnaires')}
                        tc={tc} ds={ds}
                    />

                    <SubToggleItem
                        title={t('settings.client_portal.modules.scales_questionnaires.mood_scales')}
                        description={t('settings.client_portal.modules.scales_questionnaires.mood_scales_desc')}
                        value={toggleStates.moodScales}
                        onToggle={() => handleToggle('moodScales')}
                        tc={tc} ds={ds}
                    />

                    <SubToggleItem
                        title={t('settings.client_portal.modules.scales_questionnaires.quality_of_life')}
                        description={t('settings.client_portal.modules.scales_questionnaires.quality_of_life_desc')}
                        value={toggleStates.qualityOfLife}
                        onToggle={() => handleToggle('qualityOfLife')}
                        tc={tc} ds={ds}
                    />
                </ModuleCard>

                {/* Test Results Module */}
                <ModuleCard ds={ds}>
                    <ToggleItem
                        icon={<Feather name="clipboard" size={24} color={tc.accent} />}
                        title={t('settings.client_portal.modules.test_results.title')}
                        description={t('settings.client_portal.modules.test_results.description')}
                        value={toggleStates.testResultsAccess}
                        onToggle={() => handleToggle('testResultsAccess')}
                        tc={tc} ds={ds}
                    />

                    <SubToggleItem
                        title={t('settings.client_portal.modules.test_results.view')}
                        description={t('settings.client_portal.modules.test_results.view_desc')}
                        value={toggleStates.resultsView}
                        onToggle={() => handleToggle('resultsView')}
                        tc={tc} ds={ds}
                    />

                    <SubToggleItem
                        title={t('settings.client_portal.modules.test_results.history')}
                        description={t('settings.client_portal.modules.test_results.history_desc')}
                        value={toggleStates.resultsHistory}
                        onToggle={() => handleToggle('resultsHistory')}
                        tc={tc} ds={ds}
                    />
                </ModuleCard>

                {/* AI Assistant Module */}
                <ModuleCard ds={ds}>
                    <ToggleItem
                        icon={<Image source={require('../../assets/images/brain-primary.png')} style={{ height: 20, width: 20, tintColor: tc.accent }} />}
                        title={t('settings.client_portal.modules.ai_assistant.title')}
                        description={t('settings.client_portal.modules.ai_assistant.description')}
                        value={toggleStates.aiAssistant}
                        onToggle={() => handleToggle('aiAssistant')}
                        tc={tc} ds={ds}
                    />
                    <View style={ds.aiPoweredTag}>
                        <Ionicons name="flash-outline" size={14} color="white" />
                        <Text style={ds.aiPoweredText}>{t('settings.client_portal.modules.ai_assistant.powered_tag')}</Text>
                    </View>
                    <Text style={ds.aiRequiresText}>{t('settings.client_portal.modules.ai_assistant.requires_plan')}</Text>
                </ModuleCard>
                <View style={{ backgroundColor: tc.cardBackground, marginTop: hp(1), paddingBottom: hp(2) }}>
                    {/* Data Security Section */}
                    <InfoBox
                        type="warning"
                        title={t('settings.client_portal.security.title')}
                        description={t('settings.client_portal.security.description')}
                        tc={tc} ds={ds}
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

const createDynamicStyles = (tc: any, isDark: boolean) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: tc.screenBackground,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: tc.cardBackground,
        borderBottomWidth: 1,
        borderBottomColor: tc.borderSubtle,
    },
    headerIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: isDark ? 'rgba(74, 144, 185, 0.1)' : '#E8F4F8',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: tc.textPrimary,
    },
    infoBox: {
        flexDirection: 'row',
        backgroundColor: isDark ? 'rgba(74, 144, 185, 0.1)' : '#E8F4F8',
        borderRadius: 12,
        padding: 16,
        margin: 16,
        borderWidth: isDark ? 1 : 0,
        borderColor: 'rgba(74, 144, 185, 0.2)',
    },
    warningBox: {
        backgroundColor: isDark ? 'rgba(245, 158, 11, 0.1)' : '#FFF8E1',
        borderColor: 'rgba(245, 158, 11, 0.2)',
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
        color: isDark ? '#60A5FA' : '#1E40AF',
        marginBottom: 4,
    },
    warningTitle: {
        color: isDark ? '#FBBF24' : '#854D0E',
    },
    infoText: {
        fontSize: 14,
        color: tc.textSecondary,
        lineHeight: 20,
    },
    warningText: {
        color: isDark ? '#FBBF24' : '#854D0E',
    },
    moduleCard: {
        backgroundColor: tc.cardBackground,
        marginTop: 12,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: tc.borderSubtle,
    },
    toggleItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
    },
    toggleItemContent: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
    },
    toggleIcon: {
        marginRight: 16,
        backgroundColor: isDark ? 'rgba(74, 144, 185, 0.15)' : 'rgba(90,167,179,0.1)',
        height: 40,
        width: 40,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center"
    },
    toggleTextContainer: {
        flex: 1,
    },
    toggleTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: tc.textPrimary,
    },
    toggleDescription: {
        fontSize: 14,
        color: tc.textSecondary,
        marginTop: 2,
    },
    subToggleItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        marginLeft: 56,
        borderTopWidth: 1,
        borderTopColor: tc.borderSubtle,
    },
    subToggleTextContainer: {
        flex: 1,
    },
    subToggleTitle: {
        fontSize: 15,
        fontWeight: '500',
        color: tc.textPrimary,
    },
    subToggleDescription: {
        fontSize: 13,
        color: tc.textSecondary,
        marginTop: 2,
    },
    aiPoweredTag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#10B981',
        alignSelf: 'flex-start',
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 4,
        marginLeft: 56,
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
        color: tc.textMuted,
        marginLeft: 56,
        marginTop: 6,
        fontStyle: 'italic',
    },
});

export default ClientPortal;