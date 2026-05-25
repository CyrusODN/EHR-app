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
import type { LabOrder } from '../../../types/laboratory';

interface LabOrdersListProps {
    orders: LabOrder[];
    onViewResults: (orderId: string) => void;
}

const STATUS_CONFIG: Record<string, { icon: string; color: string; iconSet: 'feather' | 'mci' }> = {
    ordered: { icon: 'clock', color: '#3B82F6', iconSet: 'feather' },
    collected: { icon: 'test-tube', color: '#F59E0B', iconSet: 'mci' },
    in_progress: { icon: 'loader', color: '#F59E0B', iconSet: 'feather' },
    completed: { icon: 'check-circle', color: '#10B981', iconSet: 'feather' },
    cancelled: { icon: 'x-circle', color: '#EF4444', iconSet: 'feather' },
};

const PRIORITY_COLORS: Record<string, { bg: string; text: string }> = {
    routine: { bg: '#F3F4F6', text: '#6B7280' },
    urgent: { bg: '#FEF3C7', text: '#D97706' },
    stat: { bg: '#FEE2E2', text: '#DC2626' },
};

const LabOrdersList = ({ orders, onViewResults }: LabOrdersListProps) => {
    const { t } = useTranslation();
    const { colors: tc, isDark } = useThemeColors();
    const ds = useMemo(() => createDynamicStyles(tc, isDark), [tc, isDark]);

    if (orders.length === 0) {
        return (
            <View style={ds.emptyContainer}>
                <MaterialCommunityIcons name="flask-empty-outline" size={40} color={tc.textMuted} />
                <Text style={ds.emptyText}>{t('visit.laboratory.orders.empty')}</Text>
            </View>
        );
    }

    const renderStatusIcon = (status: string) => {
        const config = STATUS_CONFIG[status] || STATUS_CONFIG.ordered;
        if (config.iconSet === 'mci') {
            return <MaterialCommunityIcons name={config.icon} size={16} color={config.color} />;
        }
        return <Feather name={config.icon} size={16} color={config.color} />;
    };

    return (
        <ScrollView style={ds.container} nestedScrollEnabled>
            {orders.map(order => {
                const priorityStyle = PRIORITY_COLORS[order.priority] || PRIORITY_COLORS.routine;
                return (
                    <View key={order.id} style={ds.orderCard}>
                        <View style={ds.orderHeader}>
                            <View style={ds.statusRow}>
                                {renderStatusIcon(order.status)}
                                <Text style={[ds.statusText, { color: STATUS_CONFIG[order.status]?.color }]}>
                                    {t(`visit.laboratory.status.${order.status}`)}
                                </Text>
                                <View style={[ds.priorityBadge, { backgroundColor: isDark ? priorityStyle.text + '20' : priorityStyle.bg }]}>
                                    <Text style={[ds.priorityText, { color: priorityStyle.text }]}>
                                        {t(`visit.laboratory.priority.${order.priority}`)}
                                    </Text>
                                </View>
                            </View>
                            <Text style={ds.dateText}>
                                {new Date(order.orderedAt).toLocaleDateString()}
                            </Text>
                        </View>

                        <View style={ds.testsContainer}>
                            {order.tests.map((test, idx) => (
                                <View key={idx} style={ds.testRow}>
                                    <View style={ds.testDot} />
                                    <Text style={ds.testName}>{test.name}</Text>
                                    <Text style={ds.testCode}>{test.code}</Text>
                                </View>
                            ))}
                        </View>

                        {order.status === 'completed' && (
                            <TouchableOpacity style={ds.viewResultsBtn} onPress={() => onViewResults(order.id)}>
                                <Feather name="file-text" size={14} color="#fff" />
                                <Text style={ds.viewResultsText}>{t('visit.laboratory.orders.viewResults')}</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                );
            })}
        </ScrollView>
    );
};

export default LabOrdersList;

const createDynamicStyles = (tc: any, isDark: boolean) => StyleSheet.create({
    container: { maxHeight: hp(40) },
    emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 40 },
    emptyText: { fontSize: 14, color: tc.textMuted, marginTop: 12 },
    orderCard: {
        backgroundColor: tc.cardBackground, borderRadius: 12, borderWidth: 1,
        borderColor: tc.borderColor, marginBottom: 12, overflow: 'hidden',
    },
    orderHeader: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        padding: 12, borderBottomWidth: 1, borderBottomColor: tc.borderColor,
        backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : '#F8FAFC',
    },
    statusRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    statusText: { fontSize: 13, fontWeight: '600' },
    priorityBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
    priorityText: { fontSize: 11, fontWeight: '600' },
    dateText: { fontSize: 12, color: tc.textMuted },
    testsContainer: { padding: 12 },
    testRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
    testDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#58A7B3', marginRight: 8 },
    testName: { flex: 1, fontSize: 13, color: tc.textPrimary, fontWeight: '500' },
    testCode: { fontSize: 12, color: tc.textMuted },
    viewResultsBtn: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        backgroundColor: '#58A7B3', paddingVertical: 10, gap: 6,
    },
    viewResultsText: { color: '#fff', fontSize: 13, fontWeight: '600' },
});
