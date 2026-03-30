import React, { useState, useMemo } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    ScrollView,
    TextInput,
    LayoutAnimation,
    Platform,
    UIManager
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { GetPatientPersonalData } from '../../../Services/PersonalData.Service';
import { ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '../../../hooks/useThemeColors';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const ActionOutlineButton = ({ title, icon, onPress, ds, tc }: any) => (
    <TouchableOpacity style={ds.outlineButton} onPress={onPress}>
        <Feather name={icon} size={16} color={tc.accent} />
        <Text style={ds.outlineButtonText}>{title}</Text>
    </TouchableOpacity>
);

const Insurance = ({ patientData }: { patientData: any }) => {
    const { t } = useTranslation();
    const { colors: tc, isDark } = useThemeColors();
    const ds = useMemo(() => createDynamicStyles(tc, isDark), [tc, isDark]);
    const commonProps = { ds, tc };

    const [expanded, setExpanded] = useState(true);
    const [searchText, setSearchText] = useState('');
    const [personalData, setPersonalData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const patientId = patientData?.id || patientData?._id;
                if (patientId) {
                    const res = await GetPatientPersonalData(patientId);
                    setPersonalData(res);
                }
            } catch (error) {
                console.log("Error fetching insurance data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [patientData]);

    const toggleExpand = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded(!expanded);
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return t('patientInsurance.na');
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    return (
        <ScrollView style={ds.container} showsVerticalScrollIndicator={false}>
            <View style={ds.card}>
                <TouchableOpacity 
                    style={[ds.header, expanded && ds.expandedHeader]} 
                    onPress={toggleExpand}
                    activeOpacity={0.7}
                >
                    <View style={ds.headerLeft}>
                        <Feather name="clock" size={18} color={tc.accent} style={ds.icon} />
                        <Text style={ds.title}>{t('patientInsurance.title')}</Text>
                    </View>
                    <Feather name={expanded ? "chevron-up" : "chevron-down"} size={20} color={tc.textMuted} />
                </TouchableOpacity>

                {expanded && (
                    <View style={ds.content}>
                        <View style={ds.actionRow}>
                            <View style={ds.searchBar}>
                                <Feather name="search" size={18} color={tc.textMuted} />
                                <TextInput 
                                    style={ds.searchInput}
                                    placeholder={t('patientInsurance.searchPlaceholder')}
                                    value={searchText}
                                    onChangeText={setSearchText}
                                    placeholderTextColor={tc.textMuted}
                                />
                            </View>
                            <View style={ds.buttonGroup}>
                                <ActionOutlineButton {...commonProps} title={t('patientInsurance.filter')} icon="calendar" />
                                <ActionOutlineButton {...commonProps} title={t('patientInsurance.export')} icon="download" />
                            </View>
                        </View>

                        {loading ? (
                            <View style={{ padding: 20, alignItems: 'center' }}>
                                <ActivityIndicator color={tc.accent} />
                            </View>
                        ) : personalData?.privateInsurers?.length > 0 ? (
                            personalData.privateInsurers
                                .filter((item: any) => item.name?.toLowerCase().includes(searchText.toLowerCase()))
                                .map((item: any, index: number) => (
                                    <View key={index} style={ds.insuranceCard}>
                                        <View style={ds.cardTop}>
                                            <View style={ds.insurerHeader}>
                                                <View style={ds.shieldIcon}>
                                                    <Feather name="shield" size={16} color={tc.accent} />
                                                </View>
                                                <Text style={ds.insurerName}>{item.name}</Text>
                                            </View>
                                            <View style={ds.dateRangeRow}>
                                                <Feather name="calendar" size={14} color={tc.textMuted} />
                                                <Text style={ds.dateRangeText}>
                                                    {formatDate(item.startDate)} - {formatDate(item.validUntil)}
                                                </Text>
                                            </View>
                                        </View>
                                        <View style={ds.cardDetails}>
                                            <View style={ds.detailCol}>
                                                <Text style={ds.detailLabel}>{t('patientInsurance.insurer')}</Text>
                                                <Text style={ds.detailValue}>{item.name}</Text>
                                            </View>
                                            <View style={ds.detailCol}>
                                                <Text style={ds.detailLabel}>{t('patientInsurance.policyNumber')}</Text>
                                                <Text style={ds.detailValue}>{item.policyNumber}</Text>
                                            </View>
                                        </View>
                                    </View>
                                ))
                        ) : (
                            <View style={ds.emptyContainer}>
                                <Text style={ds.emptyText}>{t('patientInsurance.noInsuranceHistory')}</Text>
                            </View>
                        )}
                    </View>
                )}
            </View>
        </ScrollView>
    );
};

const createDynamicStyles = (tc: any, isDark: boolean) => StyleSheet.create({
    container: {
        paddingHorizontal: 16,
    },
    card: {
        backgroundColor: tc.cardBackground,
        borderRadius: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: tc.borderColor,
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    expandedHeader: {
        borderBottomWidth: 1,
        borderBottomColor: tc.borderColor,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginRight: 10,
    },
    title: {
        fontSize: 13,
        fontWeight: '700',
        color: tc.textPrimary,
        letterSpacing: 0.5,
    },
    content: {
        padding: 16,
    },
    actionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        gap: 12,
    },
    searchBar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: tc.inputBackground,
        borderWidth: 1,
        borderColor: tc.borderColor,
        borderRadius: 8,
        paddingHorizontal: 12,
        height: 44,
    },
    searchInput: {
        flex: 1,
        marginLeft: 8,
        fontSize: 14,
        color: tc.textPrimary,
        padding: 0,
    },
    buttonGroup: {
        flexDirection: 'row',
        gap: 8,
    },
    outlineButton: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: tc.accent,
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 12,
        height: 44,
        backgroundColor: isDark ? tc.buttonMutedBg : 'transparent',
    },
    outlineButtonText: {
        fontSize: 13,
        fontWeight: '600',
        color: tc.accent,
        marginLeft: 6
    },
    emptyContainer: {
        backgroundColor: tc.cardBackgroundAlt || (isDark ? 'rgba(255,255,255,0.05)' : '#f8fafc'),
        borderRadius: 8,
        padding: 16,
        alignItems: 'flex-start',
    },
    emptyText: {
        fontSize: 13,
        color: tc.textMuted,
        fontWeight: '500',
    },
    insuranceCard: {
        backgroundColor: tc.cardBackgroundAlt || (isDark ? 'rgba(255,255,255,0.05)' : '#f8fafc'),
        borderRadius: 12,
        borderWidth: 1,
        borderColor: tc.borderColor,
        overflow: 'hidden',
        marginBottom: 12,
    },
    cardTop: {
        padding: 16,
    },
    insurerHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    shieldIcon: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: isDark ? tc.buttonMutedBg : '#ffffff',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
        borderWidth: 1,
        borderColor: tc.borderColor,
    },
    insurerName: {
        fontSize: 15,
        fontWeight: '700',
        color: tc.textPrimary,
    },
    dateRangeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    dateRangeText: {
        fontSize: 12,
        color: tc.textMuted,
        fontWeight: '500',
    },
    cardDetails: {
        flexDirection: 'row',
        backgroundColor: tc.cardBackground,
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: tc.borderColor,
    },
    detailCol: {
        flex: 1,
    },
    detailLabel: {
        fontSize: 12,
        color: tc.textMuted,
        marginBottom: 4,
    },
    detailValue: {
        fontSize: 14,
        fontWeight: '700',
        color: tc.textPrimary,
    },
});

export default Insurance;
