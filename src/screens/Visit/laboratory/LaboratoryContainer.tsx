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
import { CreateLabOrder, GetLabOrders, UpdateLabOrderStatus, AddLabResults } from '../../../Services/Visit.Service';
import LabOrderForm from './LabOrderForm';
import LabOrdersList from './LabOrdersList';
import LabResultsView from './LabResultsView';
import type { LabOrder, LabResults } from '../../../types/laboratory';

interface LaboratoryContainerProps {
    visitId: string;
    visitData?: any;
    onNext: () => void;
    onBack: () => void;
    onUpdate?: (data: any) => void;
}

type LabTab = 'form' | 'orders' | 'results';

const LaboratoryContainer = ({ visitId, visitData, onNext, onBack, onUpdate }: LaboratoryContainerProps) => {
    const { t } = useTranslation();
    const { colors: tc, isDark } = useThemeColors();
    const ds = useMemo(() => createDynamicStyles(tc, isDark), [tc, isDark]);

    const [activeTab, setActiveTab] = useState<LabTab>('form');
    const [orders, setOrders] = useState<LabOrder[]>([]);
    const [selectedResults, setSelectedResults] = useState<LabResults | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, [visitId]);

    const fetchOrders = async () => {
        if (!visitId) return;
        setLoading(true);
        try {
            const result = await GetLabOrders(visitId);
            const data = result?.data || result;
            if (data?.orders) {
                setOrders(data.orders);
            } else if (Array.isArray(data)) {
                setOrders(data);
            }
        } catch (e) {
            console.error('Error fetching lab orders:', e);
        } finally {
            setLoading(false);
        }
    };

    const handleAddOrder = useCallback(async (order: Partial<LabOrder>) => {
        try {
            const result = await CreateLabOrder(visitId, order);
            if (result) {
                await fetchOrders();
                setActiveTab('orders');
            }
        } catch (e) {
            console.error('Error creating lab order:', e);
        }
    }, [visitId]);

    const handleViewResults = useCallback((orderId: string) => {
        const order = orders.find(o => o.id === orderId);
        if (order?.results) {
            setSelectedResults(order.results);
            setActiveTab('results');
        }
    }, [orders]);

    const tabs: { id: LabTab; label: string; icon: string }[] = [
        { id: 'form', label: t('visit.laboratory.tabs.order'), icon: 'plus-circle' },
        { id: 'orders', label: t('visit.laboratory.tabs.list'), icon: 'list' },
        { id: 'results', label: t('visit.laboratory.tabs.results'), icon: 'bar-chart-2' },
    ];

    return (
        <View style={ds.container}>
            <View style={ds.headerRow}>
                <View style={ds.headerLeft}>
                    <MaterialCommunityIcons name="flask" size={22} color={tc.accent} />
                    <Text style={ds.title}>{t('visit.laboratory.title')}</Text>
                </View>
                {orders.length > 0 && (
                    <View style={ds.countBadge}>
                        <Text style={ds.countText}>{orders.length}</Text>
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
                        <LabOrderForm onSubmit={handleAddOrder} visitId={visitId} />
                    )}
                    {activeTab === 'orders' && (
                        <LabOrdersList orders={orders} onViewResults={handleViewResults} />
                    )}
                    {activeTab === 'results' && selectedResults && (
                        <LabResultsView results={selectedResults} onClose={() => { setSelectedResults(null); setActiveTab('orders'); }} />
                    )}
                    {activeTab === 'results' && !selectedResults && (
                        <View style={ds.emptyResults}>
                            <Text style={ds.emptyText}>{t('visit.laboratory.results.selectOrder')}</Text>
                        </View>
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
        </View>
    );
};

export default LaboratoryContainer;

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
    countBadge: {
        backgroundColor: '#58A7B3', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2,
    },
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
    emptyResults: { padding: 40, alignItems: 'center' },
    emptyText: { fontSize: 14, color: tc.textMuted },
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
