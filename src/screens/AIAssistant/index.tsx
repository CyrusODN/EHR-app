import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    Platform,
    KeyboardAvoidingView
} from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomAlert from '../../component/customAlert';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '../../hooks/useThemeColors';

// AI Tools Components
import ConsultChat from './AI_Tools/consultChat';
import Pathfinder from './AI_Tools/pathfinder';
import PharmacopediaChat from './AI_Tools/pharmacopediaChat';
import Diagnosis from './AI_Tools/diagnosis';
import ClinicalTrials from './AI_Tools/clinicalTrials';
import StatisticalAnalysis from './AI_Tools/statisticalAnalysis';
import { getChatbotServiceToken } from '../../Services/AiAssitants.Service';

const { width } = Dimensions.get('window');

export const AIAssistantScreen = () => {
    const navigation = useNavigation<any>();
    const { t } = useTranslation();
    const { colors: tc, isDark } = useThemeColors();
    const ds = createDynamicStyles(tc, isDark);
    const [activeTab, setActiveTab] = useState('Remedius Consult');
    const [serviceToken, setServiceToken] = useState<string | null>(null);
    const [alertConfig, setAlertConfig] = useState<{ visible: boolean; message: string; type: 'success' | 'warning' | 'error' }>({
        visible: false,
        message: '',
        type: 'success'
    });

    const triggerAlert = (message: string, type: 'success' | 'warning' | 'error' = 'success') => {
        setAlertConfig({ visible: true, message, type });
    };

    useEffect(() => {
        const fetchToken = async () => {
            console.log("[AIAssistantScreen] Fetching service token...");
            try {
                const response: any = await getChatbotServiceToken();
                if (response?.serviceToken) {
                    setServiceToken(response.serviceToken);
                    console.log("[AIAssistantScreen] Service Token fetched successfully:", response.serviceToken.substring(0, 20) + "...");
                } else {
                    console.warn("[AIAssistantScreen] Service Token response missing 'serviceToken' field");
                }
            } catch (error) {
                console.error("[AIAssistantScreen] Error fetching service token:", error);
            }
        };

        fetchToken();
    }, []);

    const renderContent = () => {
        switch (activeTab) {
            case 'Remedius Consult':
                return <ConsultChat serviceToken={serviceToken} onShowAlert={triggerAlert} />;
            case 'Remedius Pathfinder':
                return <Pathfinder />;
            case 'Pharmacopedia':
                return <PharmacopediaChat serviceToken={serviceToken} onShowAlert={triggerAlert} />;
            case 'Diagnosis':
                return <Diagnosis />;
            case 'Clinical Trials':
                return <ClinicalTrials serviceToken={serviceToken} onShowAlert={triggerAlert} />;
            case 'Statistical Analysis':
                return <StatisticalAnalysis />;
            default:
                return null;
        }
    };

    const tabs = [
        'Remedius Consult',
        'Remedius Pathfinder',
        'Pharmacopedia',
        'Diagnosis',
        'Clinical Trials',
        'Statistical Analysis'
    ];

    const getTabLabel = (tab: string) => {
        switch (tab) {
            case 'Remedius Consult': return t('aiAssistant.tabs.remediusConsult');
            case 'Remedius Pathfinder': return t('aiAssistant.tabs.remediusPathfinder');
            case 'Pharmacopedia': return t('aiAssistant.tabs.pharmacopedia');
            case 'Diagnosis': return t('aiAssistant.tabs.diagnosis');
            case 'Clinical Trials': return t('aiAssistant.tabs.clinicalTrials');
            case 'Statistical Analysis': return t('aiAssistant.tabs.statisticalAnalysis');
            default: return tab;
        }
    };

    return (
        <View style={ds.mainWrapper}>
            <KeyboardAvoidingView
                style={ds.safeArea}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={tc.cardBackground} />
                <View style={ds.container}>
                    {/* Header */}
                    <View style={ds.header}>
                        <View>
                            <Text style={ds.headerTitle}>{t('aiAssistant.header.title')}</Text>
                            <Text style={ds.headerSubtitle}>
                                {t('aiAssistant.header.subtitle')}
                            </Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            style={ds.backButton}
                        >
                            <Ionicons name="arrow-back" size={20} color={tc.accent} />
                        </TouchableOpacity>
                    </View>

                    {/* Tabs */}
                    <View style={ds.tabWrapper}>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={ds.tabContainer}
                        >
                            {tabs.map((tab, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        ds.tab,
                                        activeTab === tab && ds.activeTab,
                                        {
                                            marginEnd: 8
                                        }
                                    ]}
                                    onPress={() => setActiveTab(tab)}
                                >
                                    <Text style={[
                                        ds.tabText,
                                        activeTab === tab && ds.activeTabText
                                    ]}>
                                        {getTabLabel(tab)}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    {/* Content */}
                    <View style={ds.contentArea}>
                        {renderContent()}
                    </View>
                </View>
            </KeyboardAvoidingView>

            <CustomAlert
                visible={alertConfig.visible}
                message={alertConfig.message}
                type={alertConfig.type}
                onClose={() => setAlertConfig(prev => ({ ...prev, visible: false }))}
            />
        </View>
    );
};

const createDynamicStyles = (tc: any, isDark: boolean) => StyleSheet.create({
    mainWrapper: {
        flex: 1,
        backgroundColor: tc.screenBackground,
    },
    safeArea: {
        paddingTop: Platform.OS === 'ios' ? hp(5) : 0,
        flex: 1,
        backgroundColor: tc.cardBackground,
    },
    container: {
        flex: 1,
        backgroundColor: tc.screenBackground,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: tc.cardBackground,
        borderBottomWidth: 1,
        borderBottomColor: tc.borderSubtle,
        marginBottom: 2,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: tc.textPrimary,
    },
    headerSubtitle: {
        fontSize: 14,
        color: tc.textSecondary,
        marginTop: 4,
        maxWidth: wp(70),
    },
    backButton: {
        padding: 10,
        borderWidth: 1,
        borderColor: tc.accent,
        borderRadius: 25,
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabWrapper: {
        backgroundColor: tc.cardBackground,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: tc.borderSubtle,
    },
    tabContainer: {
        paddingHorizontal: 16,
    },
    tab: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        justifyContent: "center",
        alignItems: 'center',
    },
    activeTab: {
        backgroundColor: isDark ? 'rgba(74, 185, 179, 0.15)' : '#F0F9FF',
        shadowColor: tc.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isDark ? 0.3 : 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    tabText: {
        color: tc.textSecondary,
        fontWeight: '500',
        fontSize: 14,
    },
    activeTabText: {
        color: tc.accent,
        fontWeight: '700',
    },
    contentArea: {
        flex: 1,
    },
});