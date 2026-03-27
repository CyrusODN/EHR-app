import React, { useState } from 'react';
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

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const ActionOutlineButton = ({ title, icon, onPress }: any) => (
    <TouchableOpacity style={styles.outlineButton} onPress={onPress}>
        <Feather name={icon} size={16} color="#58a6b8" />
        <Text style={styles.outlineButtonText}>{title}</Text>
    </TouchableOpacity>
);

const Insurance = ({ patientData }: { patientData: any }) => {
    const { t } = useTranslation();
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
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.card}>
                <TouchableOpacity 
                    style={[styles.header, expanded && styles.expandedHeader]} 
                    onPress={toggleExpand}
                    activeOpacity={0.7}
                >
                    <View style={styles.headerLeft}>
                        <Feather name="clock" size={18} color="#58a6b8" style={styles.icon} />
                        <Text style={styles.title}>{t('patientInsurance.title')}</Text>
                    </View>
                    <Feather name={expanded ? "chevron-up" : "chevron-down"} size={20} color="#94a3b8" />
                </TouchableOpacity>

                {expanded && (
                    <View style={styles.content}>
                        <View style={styles.actionRow}>
                            <View style={styles.searchBar}>
                                <Feather name="search" size={18} color="#94a3b8" />
                                <TextInput 
                                    style={styles.searchInput}
                                    placeholder={t('patientInsurance.searchPlaceholder')}
                                    value={searchText}
                                    onChangeText={setSearchText}
                                    placeholderTextColor="#94a3b8"
                                />
                            </View>
                            <View style={styles.buttonGroup}>
                                <ActionOutlineButton title={t('patientInsurance.filter')} icon="calendar" />
                                <ActionOutlineButton title={t('patientInsurance.export')} icon="download" />
                            </View>
                        </View>

                        {loading ? (
                            <View style={{ padding: 20, alignItems: 'center' }}>
                                <ActivityIndicator color="#58a6b8" />
                            </View>
                        ) : personalData?.privateInsurers?.length > 0 ? (
                            personalData.privateInsurers
                                .filter((item: any) => item.name?.toLowerCase().includes(searchText.toLowerCase()))
                                .map((item: any, index: number) => (
                                    <View key={index} style={styles.insuranceCard}>
                                        <View style={styles.cardTop}>
                                            <View style={styles.insurerHeader}>
                                                <View style={styles.shieldIcon}>
                                                    <Feather name="shield" size={16} color="#58a6b8" />
                                                </View>
                                                <Text style={styles.insurerName}>{item.name}</Text>
                                            </View>
                                            <View style={styles.dateRangeRow}>
                                                <Feather name="calendar" size={14} color="#94a3b8" />
                                                <Text style={styles.dateRangeText}>
                                                    {formatDate(item.startDate)} - {formatDate(item.validUntil)}
                                                </Text>
                                            </View>
                                        </View>
                                        <View style={styles.cardDetails}>
                                            <View style={styles.detailCol}>
                                                <Text style={styles.detailLabel}>{t('patientInsurance.insurer')}</Text>
                                                <Text style={styles.detailValue}>{item.name}</Text>
                                            </View>
                                            <View style={styles.detailCol}>
                                                <Text style={styles.detailLabel}>{t('patientInsurance.policyNumber')}</Text>
                                                <Text style={styles.detailValue}>{item.policyNumber}</Text>
                                            </View>
                                        </View>
                                    </View>
                                ))
                        ) : (
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>{t('patientInsurance.noInsuranceHistory')}</Text>
                            </View>
                        )}
                    </View>
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#f1f5f9',
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
        borderBottomColor: '#f1f5f9',
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
        color: '#1e293b',
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
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 8,
        paddingHorizontal: 12,
        height: 44,
    },
    searchInput: {
        flex: 1,
        marginLeft: 8,
        fontSize: 14,
        color: '#1e293b',
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
        borderColor: '#58a6b8',
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 12,
        height: 44,
    },
    outlineButtonText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#58a6b8',
        marginLeft: 6
    },
    emptyContainer: {
        backgroundColor: '#f8fafc',
        borderRadius: 8,
        padding: 16,
        alignItems: 'flex-start',
    },
    emptyText: {
        fontSize: 13,
        color: '#64748b',
        fontWeight: '500',
    },
    insuranceCard: {
        backgroundColor: '#f8fafc',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#f1f5f9',
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
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    insurerName: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1e293b',
    },
    dateRangeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    dateRangeText: {
        fontSize: 12,
        color: '#94a3b8',
        fontWeight: '500',
    },
    cardDetails: {
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9',
    },
    detailCol: {
        flex: 1,
    },
    detailLabel: {
        fontSize: 12,
        color: '#94a3b8',
        marginBottom: 4,
    },
    detailValue: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1e293b',
    },
});

export default Insurance;
