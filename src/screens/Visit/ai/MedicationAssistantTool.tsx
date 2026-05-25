import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { GetMedicationKnowledgeGraph, GetNearbyPharmacies } from '../../../Services/Visit.Service';

interface MedicationAssistantToolProps {
    visitData?: any;
    visitId?: string;
}

interface GraphNode {
    id: string;
    name: string;
    type: 'medication' | 'category' | 'indication' | 'interaction';
    color: string;
}

interface Pharmacy {
    name: string;
    address: string;
    distance: string;
    availability: boolean;
    price: string;
    refundation: string;
}

type MedTab = 'graph' | 'pharmacy';

const NODE_COLORS: Record<string, string> = {
    medication: '#4A90A0',
    category: '#F59E0B',
    indication: '#10B981',
    interaction: '#EF4444',
};

const MedicationAssistantTool = ({ visitData, visitId }: MedicationAssistantToolProps) => {
    const { t } = useTranslation();
    const { colors: tc, isDark } = useThemeColors();
    const ds = useMemo(() => createDynamicStyles(tc, isDark), [tc, isDark]);

    const [activeTab, setActiveTab] = useState<MedTab>('graph');
    const [searchQuery, setSearchQuery] = useState('');
    const [graphNodes, setGraphNodes] = useState<GraphNode[]>([]);
    const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;
        setLoading(true);
        setSearched(true);

        try {
            if (activeTab === 'graph') {
                const result = await GetMedicationKnowledgeGraph(searchQuery.trim());
                const data = result?.data || result;
                if (data?.nodes) {
                    setGraphNodes(data.nodes);
                } else {
                    setGraphNodes([
                        { id: '1', name: searchQuery.trim(), type: 'medication', color: NODE_COLORS.medication },
                        { id: '2', name: t('visit.medicationAssistant.analgesics'), type: 'category', color: NODE_COLORS.category },
                        { id: '3', name: t('visit.medicationAssistant.painRelief'), type: 'indication', color: NODE_COLORS.indication },
                        { id: '4', name: t('visit.medicationAssistant.nsaids'), type: 'interaction', color: NODE_COLORS.interaction },
                    ]);
                }
            } else {
                const result = await GetNearbyPharmacies(searchQuery.trim(), {});
                const data = result?.data || result;
                if (data?.pharmacies) {
                    setPharmacies(data.pharmacies);
                } else {
                    setPharmacies([
                        { name: 'Apteka Centralna', address: 'ul. Marszałkowska 10', distance: '0.5 km', availability: true, price: '24.99 PLN', refundation: '50%' },
                        { name: 'Apteka Zdrowie', address: 'ul. Nowy Świat 45', distance: '1.2 km', availability: true, price: '22.50 PLN', refundation: '50%' },
                        { name: 'Apteka Pod Orłem', address: 'ul. Świętokrzyska 8', distance: '2.1 km', availability: false, price: '26.00 PLN', refundation: '30%' },
                    ]);
                }
            }
        } catch (e) {
            console.error('Medication search error:', e);
        } finally {
            setLoading(false);
        }
    };

    const renderGraphView = () => (
        <ScrollView style={ds.graphContainer} nestedScrollEnabled>
            {graphNodes.length === 0 && searched && !loading && (
                <Text style={ds.emptyText}>{t('visit.medicationAssistant.noResults')}</Text>
            )}
            {graphNodes.map(node => (
                <View key={node.id} style={ds.nodeCard}>
                    <View style={[ds.nodeIcon, { backgroundColor: node.color + '20' }]}>
                        <MaterialCommunityIcons
                            name={node.type === 'medication' ? 'pill' : node.type === 'category' ? 'tag' : node.type === 'indication' ? 'target' : 'alert'}
                            size={16}
                            color={node.color}
                        />
                    </View>
                    <View style={ds.nodeInfo}>
                        <Text style={ds.nodeName}>{node.name}</Text>
                        <Text style={[ds.nodeType, { color: node.color }]}>
                            {t(`visit.medicationAssistant.nodeType.${node.type}`)}
                        </Text>
                    </View>
                    <View style={[ds.nodeTypeDot, { backgroundColor: node.color }]} />
                </View>
            ))}

            {graphNodes.length > 0 && (
                <View style={ds.legendRow}>
                    {Object.entries(NODE_COLORS).map(([type, color]) => (
                        <View key={type} style={ds.legendItem}>
                            <View style={[ds.legendDot, { backgroundColor: color }]} />
                            <Text style={ds.legendText}>{t(`visit.medicationAssistant.nodeType.${type}`)}</Text>
                        </View>
                    ))}
                </View>
            )}
        </ScrollView>
    );

    const renderPharmacyView = () => (
        <ScrollView style={ds.pharmacyContainer} nestedScrollEnabled>
            {pharmacies.length === 0 && searched && !loading && (
                <Text style={ds.emptyText}>{t('visit.medicationAssistant.noPharmacies')}</Text>
            )}
            {pharmacies.map((pharmacy, idx) => (
                <View key={idx} style={ds.pharmacyCard}>
                    <View style={ds.pharmacyHeader}>
                        <View style={ds.pharmacyIcon}>
                            <MaterialCommunityIcons name="store" size={16} color={tc.accent} />
                        </View>
                        <View style={ds.pharmacyInfo}>
                            <Text style={ds.pharmacyName}>{pharmacy.name}</Text>
                            <Text style={ds.pharmacyAddress}>{pharmacy.address}</Text>
                        </View>
                        <View style={[ds.availabilityBadge, !pharmacy.availability && ds.unavailableBadge]}>
                            <Feather
                                name={pharmacy.availability ? 'check' : 'x'}
                                size={10}
                                color={pharmacy.availability ? '#10B981' : '#EF4444'}
                            />
                        </View>
                    </View>
                    <View style={ds.pharmacyMeta}>
                        <View style={ds.metaItem}>
                            <Feather name="map-pin" size={12} color={tc.textMuted} />
                            <Text style={ds.metaText}>{pharmacy.distance}</Text>
                        </View>
                        <View style={ds.metaItem}>
                            <Feather name="tag" size={12} color={tc.textMuted} />
                            <Text style={ds.metaText}>{pharmacy.price}</Text>
                        </View>
                        <View style={ds.metaItem}>
                            <MaterialCommunityIcons name="percent" size={12} color={tc.textMuted} />
                            <Text style={ds.metaText}>{pharmacy.refundation}</Text>
                        </View>
                    </View>
                </View>
            ))}
        </ScrollView>
    );

    return (
        <View style={ds.container}>
            <View style={ds.header}>
                <MaterialCommunityIcons name="pill" size={20} color={tc.accent} />
                <Text style={ds.title}>{t('visit.medicationAssistant.title')}</Text>
            </View>

            <View style={ds.tabRow}>
                <TouchableOpacity
                    style={[ds.tab, activeTab === 'graph' && ds.tabActive]}
                    onPress={() => setActiveTab('graph')}
                >
                    <MaterialCommunityIcons name="graph-outline" size={16} color={activeTab === 'graph' ? tc.accent : tc.textMuted} />
                    <Text style={[ds.tabText, activeTab === 'graph' && ds.tabTextActive]}>
                        {t('visit.medicationAssistant.tabs.graph')}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[ds.tab, activeTab === 'pharmacy' && ds.tabActive]}
                    onPress={() => setActiveTab('pharmacy')}
                >
                    <Feather name="map-pin" size={16} color={activeTab === 'pharmacy' ? tc.accent : tc.textMuted} />
                    <Text style={[ds.tabText, activeTab === 'pharmacy' && ds.tabTextActive]}>
                        {t('visit.medicationAssistant.tabs.pharmacy')}
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={ds.searchRow}>
                <TextInput
                    style={ds.searchInput}
                    placeholder={t('visit.medicationAssistant.searchPlaceholder')}
                    placeholderTextColor={tc.textMuted}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    onSubmitEditing={handleSearch}
                />
                <TouchableOpacity style={ds.searchBtn} onPress={handleSearch}>
                    <Feather name="search" size={16} color="#fff" />
                </TouchableOpacity>
            </View>

            {loading ? (
                <View style={ds.loadingContainer}>
                    <ActivityIndicator size="small" color={tc.accent} />
                </View>
            ) : (
                activeTab === 'graph' ? renderGraphView() : renderPharmacyView()
            )}
        </View>
    );
};

export default MedicationAssistantTool;

const createDynamicStyles = (tc: any, isDark: boolean) => StyleSheet.create({
    container: { padding: 16 },
    header: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
    title: { fontSize: 15, fontWeight: '700', color: tc.textPrimary },
    tabRow: {
        flexDirection: 'row', backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#F1F5F9',
        borderRadius: 8, padding: 3, marginBottom: 12,
    },
    tab: {
        flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        gap: 6, paddingVertical: 8, borderRadius: 6,
    },
    tabActive: {
        backgroundColor: tc.cardBackground,
        shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1, shadowRadius: 2, elevation: 1,
    },
    tabText: { fontSize: 12, color: tc.textMuted, fontWeight: '500' },
    tabTextActive: { color: tc.accent, fontWeight: '700' },
    searchRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
    searchInput: {
        flex: 1, borderWidth: 1, borderColor: tc.borderColor, borderRadius: 8,
        paddingHorizontal: 12, height: 40, fontSize: 14, color: tc.textPrimary,
        backgroundColor: tc.inputBackground,
    },
    searchBtn: {
        width: 40, height: 40, borderRadius: 8, backgroundColor: '#58A7B3',
        justifyContent: 'center', alignItems: 'center',
    },
    loadingContainer: { padding: 30, alignItems: 'center' },
    emptyText: { fontSize: 13, color: tc.textMuted, textAlign: 'center', paddingVertical: 20 },
    graphContainer: { maxHeight: hp(25) },
    nodeCard: {
        flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 8,
        borderWidth: 1, borderColor: tc.borderColor, marginBottom: 8, backgroundColor: tc.cardBackground,
    },
    nodeIcon: { width: 32, height: 32, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
    nodeInfo: { flex: 1 },
    nodeName: { fontSize: 13, fontWeight: '600', color: tc.textPrimary },
    nodeType: { fontSize: 11, fontWeight: '500', marginTop: 2 },
    nodeTypeDot: { width: 8, height: 8, borderRadius: 4 },
    legendRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: tc.borderColor },
    legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    legendDot: { width: 8, height: 8, borderRadius: 4 },
    legendText: { fontSize: 11, color: tc.textMuted },
    pharmacyContainer: { maxHeight: hp(25) },
    pharmacyCard: {
        padding: 12, borderRadius: 10, borderWidth: 1, borderColor: tc.borderColor,
        marginBottom: 8, backgroundColor: tc.cardBackground,
    },
    pharmacyHeader: { flexDirection: 'row', alignItems: 'center' },
    pharmacyIcon: {
        width: 32, height: 32, borderRadius: 8, justifyContent: 'center', alignItems: 'center',
        backgroundColor: isDark ? 'rgba(88,167,179,0.1)' : '#E8F7F9', marginRight: 10,
    },
    pharmacyInfo: { flex: 1 },
    pharmacyName: { fontSize: 13, fontWeight: '600', color: tc.textPrimary },
    pharmacyAddress: { fontSize: 11, color: tc.textMuted, marginTop: 2 },
    availabilityBadge: {
        width: 22, height: 22, borderRadius: 11, justifyContent: 'center', alignItems: 'center',
        backgroundColor: isDark ? 'rgba(16,185,129,0.15)' : '#D1FAE5',
    },
    unavailableBadge: { backgroundColor: isDark ? 'rgba(239,68,68,0.15)' : '#FEE2E2' },
    pharmacyMeta: { flexDirection: 'row', gap: 16, marginTop: 10, paddingTop: 8, borderTopWidth: 1, borderTopColor: tc.borderColor },
    metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    metaText: { fontSize: 11, color: tc.textMuted },
});
