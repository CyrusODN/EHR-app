import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, ActivityIndicator, FlatList,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { SearchMedicines, GetMedicineDetails } from '../../../Services/Visit.Service';

const DrugInteractionChecker = () => {
    const { t } = useTranslation();
    const { colors: tc, isDark } = useThemeColors();
    const ds = createStyles(tc, isDark);

    const [isExpanded, setIsExpanded] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedMedicine, setSelectedMedicine] = useState<any>(null);
    const [showAllDetails, setShowAllDetails] = useState(false);

    const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        return () => {
            if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
        };
    }, []);

    const performSearch = useCallback(async (query: string) => {
        if (query.length < 3) {
            setSuggestions([]);
            setShowSuggestions(false);
            setIsSearching(false);
            return;
        }

        setIsSearching(true);
        try {
            const response = await SearchMedicines(query, 10);
            const medicines = response?.medicines || [];
            setSuggestions(medicines);
            setShowSuggestions(medicines.length > 0);
            setError(null);
        } catch (err) {
            setError(t('visit.ai.drug.searchFailed') || 'Search failed');
            setSuggestions([]);
            setShowSuggestions(false);
        } finally {
            setIsSearching(false);
        }
    }, [t]);

    const handleInputChange = useCallback((value: string) => {
        setSearchQuery(value);
        setError(null);
        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

        if (value.length >= 3) {
            searchTimeoutRef.current = setTimeout(() => performSearch(value), 300);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    }, [performSearch]);

    const selectMedicine = useCallback(async (medicine: any) => {
        setIsLoading(true);
        setError(null);
        setShowSuggestions(false);
        setSuggestions([]);
        setSearchQuery('');

        try {
            const details = await GetMedicineDetails(medicine.key);
            setSelectedMedicine(details);
            setShowAllDetails(false);
        } catch (err) {
            setError(t('visit.ai.drug.loadFailed') || 'Failed to load medicine details');
        } finally {
            setIsLoading(false);
        }
    }, [t]);

    const clearSelection = () => {
        setSelectedMedicine(null);
        setShowAllDetails(false);
        setSearchQuery('');
        setError(null);
    };

    const primaryFields = [
        { key: 'nazwa', label: t('visit.ai.drug.name') || 'Name', icon: 'pill' },
        { key: 'sklad', label: t('visit.ai.drug.composition') || 'Composition', icon: 'file-text' },
        { key: 'interakcje', label: t('visit.ai.drug.interactions') || 'Interactions', icon: 'alert-triangle' },
    ];

    const additionalFields = [
        { key: 'wskazania', label: t('visit.ai.drug.indications') || 'Indications' },
        { key: 'dawkowanieisposobpodania', label: t('visit.ai.drug.dosage') || 'Dosage' },
        { key: 'przeciwwskazania', label: t('visit.ai.drug.contraindications') || 'Contraindications' },
        { key: 'dzialanianiepozadane', label: t('visit.ai.drug.sideEffects') || 'Side Effects' },
        { key: 'ostrzezeniaisrodkiostroznosci', label: t('visit.ai.drug.warnings') || 'Warnings' },
        { key: 'ciazailaktacja', label: t('visit.ai.drug.pregnancy') || 'Pregnancy & Lactation' },
        { key: 'przedawkowanie', label: t('visit.ai.drug.overdose') || 'Overdose' },
        { key: 'wlasciwoscifarmakologiczne', label: t('visit.ai.drug.pharmacology') || 'Pharmacology' },
    ];

    return (
        <View style={ds.container}>
            <TouchableOpacity style={ds.header} onPress={() => setIsExpanded(!isExpanded)} activeOpacity={0.7}>
                <View style={ds.headerLeft}>
                    <View style={ds.iconBg}>
                        <Ionicons name="shield-checkmark-outline" size={24} color={tc.accent} />
                    </View>
                    <View>
                        <Text style={ds.headerTitle}>{t('visit.ai.medInfo.title')}</Text>
                        {selectedMedicine && (
                            <Text style={ds.headerSubtitle} numberOfLines={1}>
                                {selectedMedicine.nazwa?.substring(0, 40)}
                            </Text>
                        )}
                    </View>
                </View>
                <Feather name={isExpanded ? 'chevron-up' : 'chevron-down'} size={24} color={tc.textPrimary} />
            </TouchableOpacity>

            {isExpanded && (
                <View style={ds.content}>
                    {/* Search */}
                    <View style={ds.searchSection}>
                        <Text style={ds.fieldLabel}>{t('visit.ai.medInfo.search')}</Text>
                        <View style={ds.searchInputContainer}>
                            {isSearching ? (
                                <ActivityIndicator size="small" color={tc.textMuted} />
                            ) : (
                                <Feather name="search" size={18} color={tc.textMuted} />
                            )}
                            <TextInput
                                style={ds.searchInput}
                                placeholder={t('visit.ai.medInfo.placeholder')}
                                placeholderTextColor={tc.textMuted}
                                value={searchQuery}
                                onChangeText={handleInputChange}
                            />
                            {searchQuery.length > 0 && (
                                <TouchableOpacity onPress={() => { setSearchQuery(''); setSuggestions([]); setShowSuggestions(false); }}>
                                    <Feather name="x" size={16} color={tc.textMuted} />
                                </TouchableOpacity>
                            )}
                        </View>

                        {/* Suggestions Dropdown */}
                        {showSuggestions && suggestions.length > 0 && (
                            <View style={ds.suggestionsDropdown}>
                                {suggestions.map((sug, index) => (
                                    <TouchableOpacity
                                        key={`${sug.key}-${index}`}
                                        style={ds.suggestionItem}
                                        onPress={() => selectMedicine(sug)}
                                    >
                                        <MaterialCommunityIcons name="pill" size={16} color={tc.accent} />
                                        <Text style={ds.suggestionText} numberOfLines={2}>{sug.nazwa}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>

                    {/* Error */}
                    {error && (
                        <View style={ds.errorBox}>
                            <Text style={ds.errorText}>{error}</Text>
                        </View>
                    )}

                    {/* Loading */}
                    {isLoading && (
                        <View style={ds.loadingContainer}>
                            <ActivityIndicator size="large" color={tc.accent} />
                            <Text style={ds.loadingText}>{t('visit.ai.drug.loading') || 'Loading details...'}</Text>
                        </View>
                    )}

                    {/* Medicine Details */}
                    {selectedMedicine && !isLoading && (
                        <View style={ds.detailsContainer}>
                            <View style={ds.detailsHeader}>
                                <Text style={ds.detailsTitle}>{t('visit.ai.drug.details') || 'Medicine Details'}</Text>
                                <TouchableOpacity onPress={clearSelection}>
                                    <Feather name="x" size={18} color={tc.textMuted} />
                                </TouchableOpacity>
                            </View>

                            {/* Primary fields */}
                            {primaryFields.map(({ key, label, icon }) => {
                                const value = selectedMedicine[key];
                                if (!value?.trim()) return null;
                                return (
                                    <View key={key} style={ds.fieldCard}>
                                        <View style={ds.fieldCardHeader}>
                                            {icon === 'pill' ? (
                                                <MaterialCommunityIcons name="pill" size={18} color={tc.accent} />
                                            ) : icon === 'alert-triangle' ? (
                                                <Feather name="alert-triangle" size={18} color="#F59E0B" />
                                            ) : (
                                                <Feather name={icon as any} size={18} color={tc.accent} />
                                            )}
                                            <Text style={ds.fieldCardTitle}>{label}</Text>
                                        </View>
                                        <Text style={ds.fieldCardValue}>{value}</Text>
                                    </View>
                                );
                            })}

                            {/* Toggle more */}
                            <TouchableOpacity style={ds.viewMoreBtn} onPress={() => setShowAllDetails(!showAllDetails)}>
                                <Feather name={showAllDetails ? 'chevron-up' : 'chevron-down'} size={18} color={tc.accent} />
                                <Text style={ds.viewMoreText}>
                                    {showAllDetails ? (t('visit.ai.drug.viewLess') || 'View Less') : (t('visit.ai.drug.viewMore') || 'View More')}
                                </Text>
                            </TouchableOpacity>

                            {/* Additional fields */}
                            {showAllDetails && additionalFields.map(({ key, label }) => {
                                const value = selectedMedicine[key];
                                if (!value?.trim()) return null;
                                return (
                                    <View key={key} style={ds.fieldCard}>
                                        <View style={ds.fieldCardHeader}>
                                            <Feather name="info" size={16} color={tc.accent} />
                                            <Text style={ds.fieldCardTitle}>{label}</Text>
                                        </View>
                                        <Text style={ds.fieldCardValue}>{value}</Text>
                                    </View>
                                );
                            })}
                        </View>
                    )}

                    {/* Empty State */}
                    {!selectedMedicine && !isLoading && !error && (
                        <View style={ds.emptyState}>
                            <MaterialCommunityIcons name="pill" size={48} color={isDark ? 'rgba(255,255,255,0.1)' : '#CBD5E1'} />
                            <Text style={ds.emptyStateText}>{t('visit.ai.medInfo.empty')}</Text>
                        </View>
                    )}
                </View>
            )}
        </View>
    );
};

const createStyles = (tc: any, isDark: boolean) => StyleSheet.create({
    container: { marginBottom: 8 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12, backgroundColor: tc.cardBackground, borderRadius: 8, borderWidth: 1, borderColor: tc.borderColor },
    headerLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    iconBg: { width: 40, height: 40, borderRadius: 8, backgroundColor: tc.accentLight, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    headerTitle: { fontSize: 16, fontWeight: '700', color: tc.textPrimary },
    headerSubtitle: { fontSize: 12, color: tc.textMuted, marginTop: 2 },
    content: { marginTop: 12, gap: 12 },
    searchSection: { zIndex: 10 },
    fieldLabel: { fontSize: 13, fontWeight: '600', color: tc.textSecondary, marginBottom: 8 },
    searchInputContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: tc.borderColor, borderRadius: 8, paddingHorizontal: 12, height: 48, backgroundColor: tc.cardBackgroundAlt, gap: 8 },
    searchInput: { flex: 1, fontSize: 14, color: tc.textPrimary },
    suggestionsDropdown: { backgroundColor: tc.cardBackground, borderWidth: 1, borderColor: tc.borderColor, borderRadius: 8, marginTop: 4, maxHeight: 260, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: isDark ? 0.3 : 0.12, shadowRadius: 8, elevation: 6 },
    suggestionItem: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 14, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: tc.borderColor },
    suggestionText: { fontSize: 13, color: tc.textPrimary, flex: 1 },
    errorBox: { backgroundColor: isDark ? 'rgba(239,68,68,0.1)' : '#FEF2F2', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: isDark ? 'rgba(239,68,68,0.2)' : '#FECACA' },
    errorText: { fontSize: 13, color: '#EF4444' },
    loadingContainer: { alignItems: 'center', paddingVertical: 24, gap: 8 },
    loadingText: { fontSize: 13, color: tc.textMuted },
    detailsContainer: { gap: 10 },
    detailsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    detailsTitle: { fontSize: 15, fontWeight: '700', color: tc.textPrimary },
    fieldCard: { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#F9FAFB', borderRadius: 10, padding: 14, borderWidth: 1, borderColor: tc.borderColor },
    fieldCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
    fieldCardTitle: { fontSize: 14, fontWeight: '600', color: tc.textPrimary },
    fieldCardValue: { fontSize: 13, color: tc.textSecondary, lineHeight: 19 },
    viewMoreBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12, backgroundColor: isDark ? 'rgba(88,167,179,0.1)' : '#F0F9FA', borderRadius: 8 },
    viewMoreText: { fontSize: 14, fontWeight: '600', color: tc.accent },
    emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 32 },
    emptyStateText: { marginTop: 12, fontSize: 14, color: tc.textMuted },
});

export default DrugInteractionChecker;
