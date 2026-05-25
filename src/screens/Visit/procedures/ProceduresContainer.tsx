import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { CreateProcedure, GetProcedures, UpdateProcedureStatus, AddProcedureResults } from '../../../Services/Visit.Service';
import ProcedureForm from './ProcedureForm';
import ProceduresList from './ProceduresList';
import ProcedureResultsModal from './ProcedureResults';
import type { ScheduledProcedure, ProcedureStatus, ProcedureResult } from '../../../types/procedures';

interface ProceduresContainerProps {
    visitId: string;
    patientId?: string;
    visitData?: any;
    onNext: () => void;
    onBack: () => void;
    onUpdate?: (data: any) => void;
}

type ProcTab = 'form' | 'list';

const ProceduresContainer = ({ visitId, patientId, visitData, onNext, onBack, onUpdate }: ProceduresContainerProps) => {
    const { t } = useTranslation();
    const { colors: tc, isDark } = useThemeColors();
    const ds = useMemo(() => createDynamicStyles(tc, isDark), [tc, isDark]);

    const [activeTab, setActiveTab] = useState<ProcTab>('form');
    const [procedures, setProcedures] = useState<ScheduledProcedure[]>([]);
    const [loading, setLoading] = useState(false);
    const [resultsModalVisible, setResultsModalVisible] = useState(false);
    const [selectedProcedureId, setSelectedProcedureId] = useState('');
    const [selectedProcedureName, setSelectedProcedureName] = useState('');

    useEffect(() => {
        fetchProcedures();
    }, [visitId]);

    const fetchProcedures = async () => {
        if (!visitId) return;
        setLoading(true);
        try {
            const result = await GetProcedures(visitId);
            const data = result?.data || result;
            if (data?.procedures) {
                setProcedures(data.procedures);
            } else if (Array.isArray(data)) {
                setProcedures(data);
            }
        } catch (e) {
            console.error('Error fetching procedures:', e);
        } finally {
            setLoading(false);
        }
    };

    const handleAddProcedure = useCallback(async (procedure: Partial<ScheduledProcedure>) => {
        try {
            const result = await CreateProcedure(visitId, procedure);
            if (result) {
                await fetchProcedures();
                setActiveTab('list');
            }
        } catch (e) {
            // Optimistically add locally if API fails
            setProcedures(prev => [...prev, procedure as ScheduledProcedure]);
            setActiveTab('list');
        }
    }, [visitId]);

    const handleStatusChange = useCallback(async (procedureId: string, status: ProcedureStatus) => {
        try {
            await UpdateProcedureStatus(visitId, procedureId, status);
            setProcedures(prev => prev.map(p =>
                p.id === procedureId ? { ...p, status } : p
            ));
        } catch (e) {
            setProcedures(prev => prev.map(p =>
                p.id === procedureId ? { ...p, status } : p
            ));
        }
    }, [visitId]);

    const handleAddResults = useCallback((procedureId: string) => {
        const proc = procedures.find(p => p.id === procedureId);
        setSelectedProcedureId(procedureId);
        setSelectedProcedureName(proc?.name || '');
        setResultsModalVisible(true);
    }, [procedures]);

    const handleSubmitResults = useCallback(async (procedureId: string, results: ProcedureResult) => {
        try {
            await AddProcedureResults(visitId, procedureId, results);
            setProcedures(prev => prev.map(p =>
                p.id === procedureId ? { ...p, results, status: 'completed' } : p
            ));
        } catch (e) {
            setProcedures(prev => prev.map(p =>
                p.id === procedureId ? { ...p, results, status: 'completed' } : p
            ));
        }
    }, [visitId]);

    const tabs: { id: ProcTab; label: string; icon: string }[] = [
        { id: 'form', label: t('visit.procedures.tabs.add'), icon: 'plus-circle' },
        { id: 'list', label: t('visit.procedures.tabs.list'), icon: 'list' },
    ];

    return (
        <View style={ds.container}>
            <View style={ds.headerRow}>
                <View style={ds.headerLeft}>
                    <MaterialCommunityIcons name="medical-bag" size={22} color={tc.accent} />
                    <Text style={ds.title}>{t('visit.procedures.title')}</Text>
                </View>
                {procedures.length > 0 && (
                    <View style={ds.countBadge}>
                        <Text style={ds.countText}>{procedures.length}</Text>
                    </View>
                )}
            </View>

            <View style={ds.tabBar}>
                {tabs.map(tab => (
                    <TouchableOpacity
                        key={tab.id}
                        style={[ds.tab, activeTab === tab.id && ds.tabActive]}
                        onPress={() => setActiveTab(tab.id)}
                    >
                        <Feather name={tab.icon} size={16} color={activeTab === tab.id ? tc.accent : tc.textMuted} />
                        <Text style={[ds.tabText, activeTab === tab.id && ds.tabTextActive]}>{tab.label}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {loading ? (
                <View style={ds.loadingContainer}>
                    <ActivityIndicator size="large" color={tc.accent} />
                </View>
            ) : (
                <View style={ds.content}>
                    {activeTab === 'form' && (
                        <ProcedureForm onSubmit={handleAddProcedure} visitId={visitId} patientId={patientId} />
                    )}
                    {activeTab === 'list' && (
                        <ProceduresList
                            procedures={procedures}
                            onStatusChange={handleStatusChange}
                            onAddResults={handleAddResults}
                        />
                    )}
                </View>
            )}

            <View style={ds.navigationRow}>
                <TouchableOpacity style={ds.navButton} onPress={onBack}>
                    <Feather name="arrow-left" size={16} color={tc.accent} />
                    <Text style={ds.navButtonText}>{t('common.back')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={ds.navButtonPrimary} onPress={onNext}>
                    <Text style={ds.navButtonPrimaryText}>{t('common.next')}</Text>
                    <Feather name="arrow-right" size={16} color="#fff" />
                </TouchableOpacity>
            </View>

            <ProcedureResultsModal
                visible={resultsModalVisible}
                procedureId={selectedProcedureId}
                procedureName={selectedProcedureName}
                onSubmit={handleSubmitResults}
                onClose={() => setResultsModalVisible(false)}
            />
        </View>
    );
};

export default ProceduresContainer;

const createDynamicStyles = (tc: any, isDark: boolean) => StyleSheet.create({
    container: {
        margin: wp(3), backgroundColor: tc.cardBackground, borderRadius: 12,
        borderWidth: 1, borderColor: tc.borderColor, overflow: 'hidden',
    },
    headerRow: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        padding: 16, borderBottomWidth: 1, borderBottomColor: tc.borderColor,
    },
    headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    title: { fontSize: 17, fontWeight: '700', color: tc.textPrimary },
    countBadge: { backgroundColor: '#58A7B3', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2 },
    countText: { color: '#fff', fontSize: 12, fontWeight: '700' },
    tabBar: {
        flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: tc.borderColor,
        backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : '#F8FAFC',
    },
    tab: {
        flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        gap: 6, paddingVertical: 12,
    },
    tabActive: { borderBottomWidth: 2, borderBottomColor: tc.accent },
    tabText: { fontSize: 13, color: tc.textMuted, fontWeight: '500' },
    tabTextActive: { color: tc.accent, fontWeight: '700' },
    content: { minHeight: hp(30) },
    loadingContainer: { padding: 40, alignItems: 'center', justifyContent: 'center' },
    navigationRow: {
        flexDirection: 'row', justifyContent: 'space-between', padding: 16,
        borderTopWidth: 1, borderTopColor: tc.borderColor,
    },
    navButton: {
        flexDirection: 'row', alignItems: 'center', gap: 6,
        paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8,
        borderWidth: 1, borderColor: tc.accent,
    },
    navButtonText: { fontSize: 14, fontWeight: '600', color: tc.accent },
    navButtonPrimary: {
        flexDirection: 'row', alignItems: 'center', gap: 6,
        paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8, backgroundColor: '#58A7B3',
    },
    navButtonPrimaryText: { fontSize: 14, fontWeight: '600', color: '#fff' },
});
