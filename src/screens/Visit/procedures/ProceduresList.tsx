import React, { useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '../../../hooks/useThemeColors';
import type { ScheduledProcedure, ProcedureStatus } from '../../../types/procedures';

interface ProceduresListProps {
    procedures: ScheduledProcedure[];
    onStatusChange: (procedureId: string, status: ProcedureStatus) => void;
    onAddResults: (procedureId: string) => void;
}

const STATUS_CONFIG: Record<ProcedureStatus, { icon: string; color: string; labelKey: string }> = {
    'planned': { icon: 'clock', color: '#3B82F6', labelKey: 'visit.procedures.status.planned' },
    'in-progress': { icon: 'loader', color: '#F59E0B', labelKey: 'visit.procedures.status.inProgress' },
    'completed': { icon: 'check-circle', color: '#10B981', labelKey: 'visit.procedures.status.completed' },
    'cancelled': { icon: 'x-circle', color: '#EF4444', labelKey: 'visit.procedures.status.cancelled' },
};

const STATUS_FLOW: ProcedureStatus[] = ['planned', 'in-progress', 'completed', 'cancelled'];

const ProceduresList = ({ procedures, onStatusChange, onAddResults }: ProceduresListProps) => {
    const { t } = useTranslation();
    const { colors: tc, isDark } = useThemeColors();
    const ds = useMemo(() => createDynamicStyles(tc, isDark), [tc, isDark]);

    if (procedures.length === 0) {
        return (
            <View style={ds.emptyContainer}>
                <MaterialCommunityIcons name="medical-bag" size={40} color={tc.textMuted} />
                <Text style={ds.emptyText}>{t('visit.procedures.list.empty')}</Text>
            </View>
        );
    }

    return (
        <ScrollView style={ds.container} nestedScrollEnabled>
            {procedures.map(procedure => {
                const statusCfg = STATUS_CONFIG[procedure.status];
                return (
                    <View key={procedure.id} style={ds.card}>
                        <View style={ds.cardHeader}>
                            <View style={ds.cardHeaderLeft}>
                                <Text style={ds.procedureName}>{procedure.name}</Text>
                                {procedure.icd9Code && (
                                    <Text style={ds.icd9Code}>{procedure.icd9Code}</Text>
                                )}
                            </View>
                            <View style={[ds.statusBadge, { backgroundColor: statusCfg.color + '15' }]}>
                                <Feather name={statusCfg.icon} size={12} color={statusCfg.color} />
                                <Text style={[ds.statusText, { color: statusCfg.color }]}>
                                    {t(statusCfg.labelKey)}
                                </Text>
                            </View>
                        </View>

                        {procedure.description && (
                            <Text style={ds.description}>{procedure.description}</Text>
                        )}

                        <View style={ds.metaRow}>
                            <View style={ds.metaItem}>
                                <Feather name="calendar" size={12} color={tc.textMuted} />
                                <Text style={ds.metaText}>
                                    {new Date(procedure.scheduledDate).toLocaleDateString()}
                                </Text>
                            </View>
                            <View style={ds.metaItem}>
                                <Feather name="clock" size={12} color={tc.textMuted} />
                                <Text style={ds.metaText}>{procedure.duration} min</Text>
                            </View>
                            {procedure.category && (
                                <View style={ds.metaItem}>
                                    <Feather name="tag" size={12} color={tc.textMuted} />
                                    <Text style={ds.metaText}>{t(`visit.procedures.category.${procedure.category}`)}</Text>
                                </View>
                            )}
                        </View>

                        <View style={ds.actionsRow}>
                            {STATUS_FLOW.filter(s => s !== procedure.status).slice(0, 2).map(status => (
                                <TouchableOpacity
                                    key={status}
                                    style={ds.actionBtn}
                                    onPress={() => onStatusChange(procedure.id, status)}
                                >
                                    <Feather name={STATUS_CONFIG[status].icon} size={12} color={STATUS_CONFIG[status].color} />
                                    <Text style={[ds.actionText, { color: STATUS_CONFIG[status].color }]}>
                                        {t(STATUS_CONFIG[status].labelKey)}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                            {procedure.status === 'completed' && !procedure.results && (
                                <TouchableOpacity
                                    style={ds.resultsBtn}
                                    onPress={() => onAddResults(procedure.id)}
                                >
                                    <Feather name="file-plus" size={12} color="#fff" />
                                    <Text style={ds.resultsBtnText}>{t('visit.procedures.list.addResults')}</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                );
            })}
        </ScrollView>
    );
};

export default ProceduresList;

const createDynamicStyles = (tc: any, isDark: boolean) => StyleSheet.create({
    container: { maxHeight: hp(45), padding: 16 },
    emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 40 },
    emptyText: { fontSize: 14, color: tc.textMuted, marginTop: 12 },
    card: {
        backgroundColor: tc.cardBackground, borderRadius: 12, borderWidth: 1,
        borderColor: tc.borderColor, marginBottom: 12, padding: 14,
    },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    cardHeaderLeft: { flex: 1 },
    procedureName: { fontSize: 15, fontWeight: '700', color: tc.textPrimary },
    icd9Code: { fontSize: 12, color: tc.textMuted, marginTop: 2 },
    statusBadge: {
        flexDirection: 'row', alignItems: 'center', gap: 4,
        paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8,
    },
    statusText: { fontSize: 11, fontWeight: '600' },
    description: { fontSize: 13, color: tc.textSecondary, marginTop: 8, lineHeight: 18 },
    metaRow: { flexDirection: 'row', gap: 16, marginTop: 10 },
    metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    metaText: { fontSize: 12, color: tc.textMuted },
    actionsRow: { flexDirection: 'row', gap: 8, marginTop: 12, flexWrap: 'wrap' },
    actionBtn: {
        flexDirection: 'row', alignItems: 'center', gap: 4,
        paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6,
        borderWidth: 1, borderColor: tc.borderColor,
    },
    actionText: { fontSize: 11, fontWeight: '600' },
    resultsBtn: {
        flexDirection: 'row', alignItems: 'center', gap: 4,
        paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6, backgroundColor: '#58A7B3',
    },
    resultsBtnText: { fontSize: 11, fontWeight: '600', color: '#fff' },
});
