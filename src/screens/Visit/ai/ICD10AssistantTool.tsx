import React, { useState } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { useICD10Search } from '../../../hooks/useICD10Search';
import type { ICD10SearchResult } from '../../../hooks/useICD10Search';

interface ICD10AssistantToolProps {
    visitData: any;
    onAddDiagnosis?: (diagnosis: { code: string; name: string; classification: string; addedAt: string }) => void;
    onUpdate?: (fields: Record<string, any>) => void;
}

const ICD10AssistantTool = ({ visitData, onAddDiagnosis, onUpdate }: ICD10AssistantToolProps) => {
    const { t } = useTranslation();
    const { colors: tc, isDark } = useThemeColors();
    const ds = createStyles(tc, isDark);
    const { searchQuery, setSearchQuery, clearSearch, searchResults, isSearching } = useICD10Search();
    const [showResults, setShowResults] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    const existingDiagnoses = visitData?.diagnosis?.icd10 || [];

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setShowResults(query.length >= 2);
    };

    const handleSelectDiagnosis = (result: ICD10SearchResult) => {
        const code = (result.ICD10Code || result.ICD11CODE || '') as string;
        const name = (result.ICD10Title || result.ICD11Title || code) as string;
        if (!code) return;
        if (existingDiagnoses.some((d: any) => d.code === code)) return;

        const newDiagnosis = {
            code,
            name,
            classification: existingDiagnoses.length === 0 ? 'Primary' : 'Secondary',
            addedAt: new Date().toISOString(),
        };

        if (onAddDiagnosis) {
            onAddDiagnosis(newDiagnosis);
        } else if (onUpdate) {
            onUpdate({ diagnosis: { icd10: [...existingDiagnoses, newDiagnosis] } });
        }

        clearSearch();
        setShowResults(false);
    };

    return (
        <View style={ds.container}>
            <TouchableOpacity style={ds.header} onPress={() => setIsExpanded(!isExpanded)} activeOpacity={0.7}>
                <View style={ds.headerLeft}>
                    <View style={ds.iconBg}>
                        <Feather name="file-text" size={24} color={tc.accent} />
                    </View>
                    <View>
                        <Text style={ds.headerTitle}>{t('visit.ai.tabs.icd10')}</Text>
                        <Text style={ds.headerSubtitle}>
                            {t('visit.ai.icd10.subtitle') || 'Search and add ICD-10 codes to visit'}
                        </Text>
                    </View>
                </View>
                <Feather name={isExpanded ? 'chevron-up' : 'chevron-down'} size={24} color={tc.textPrimary} />
            </TouchableOpacity>

            {isExpanded && (
                <View style={ds.content}>
                    {/* Search */}
                    <View style={ds.searchSection}>
                        <View style={ds.searchInputContainer}>
                            <Feather name="search" size={18} color={tc.textMuted} />
                            <TextInput
                                style={ds.searchInput}
                                placeholder={t('visit.diagnosis.search_placeholder')}
                                placeholderTextColor={tc.textMuted}
                                value={searchQuery}
                                onChangeText={handleSearch}
                                onFocus={() => { if (searchQuery.length >= 2) setShowResults(true); }}
                            />
                            {searchQuery.length > 0 && (
                                <TouchableOpacity onPress={() => { clearSearch(); setShowResults(false); }}>
                                    <Feather name="x" size={16} color={tc.textMuted} />
                                </TouchableOpacity>
                            )}
                        </View>

                        {/* Results Dropdown */}
                        {showResults && isSearching && (
                            <View style={ds.resultsDropdown}>
                                {searchResults.length > 0 ? (
                                    <FlatList
                                        data={searchResults}
                                        keyExtractor={(item, idx) => `${item.ICD11CODE || item.ICD10Code || 'u'}-${idx}`}
                                        keyboardShouldPersistTaps="handled"
                                        nestedScrollEnabled
                                        style={ds.resultsList}
                                        renderItem={({ item }) => {
                                            const isDuplicate = existingDiagnoses.some((d: any) =>
                                                d.code === (item.ICD10Code || item.ICD11CODE)
                                            );
                                            return (
                                                <TouchableOpacity
                                                    style={[ds.resultItem, isDuplicate && ds.resultItemDisabled]}
                                                    onPress={() => !isDuplicate && handleSelectDiagnosis(item)}
                                                    disabled={isDuplicate}
                                                    activeOpacity={0.7}
                                                >
                                                    <View style={ds.resultContent}>
                                                        <View style={ds.resultCodes}>
                                                            {item.ICD11CODE && (
                                                                <View style={ds.codeTagPrimary}>
                                                                    <Text style={ds.codeTagPrimaryText}>{item.ICD11CODE}</Text>
                                                                </View>
                                                            )}
                                                            {item.ICD10Code && (
                                                                <View style={ds.codeTagSecondary}>
                                                                    <Text style={ds.codeTagSecondaryText}>ICD-10: {item.ICD10Code}</Text>
                                                                </View>
                                                            )}
                                                        </View>
                                                        <Text style={ds.resultTitle} numberOfLines={2}>
                                                            {item.ICD11Title || item.ICD10Title}
                                                        </Text>
                                                    </View>
                                                    {isDuplicate ? (
                                                        <Feather name="check-circle" size={16} color="#10B981" />
                                                    ) : (
                                                        <Feather name="plus" size={16} color={tc.accent} />
                                                    )}
                                                </TouchableOpacity>
                                            );
                                        }}
                                    />
                                ) : (
                                    <View style={ds.noResults}>
                                        <Text style={ds.noResultsText}>
                                            {t('visit.diagnosis.noResults') || `No codes found for "${searchQuery}"`}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        )}
                    </View>

                    {/* Current Diagnoses */}
                    {existingDiagnoses.length > 0 && (
                        <View style={ds.existingSection}>
                            <Text style={ds.existingLabel}>
                                {t('visit.ai.icd10.currentDiagnoses') || 'Current Diagnoses'} ({existingDiagnoses.length})
                            </Text>
                            {existingDiagnoses.map((diag: any, index: number) => (
                                <View key={`${diag.code}-${index}`} style={[ds.diagItem, diag.classification === 'Primary' && ds.diagItemPrimary]}>
                                    <View style={[ds.diagCodeBadge, diag.classification === 'Primary' && ds.diagCodeBadgePrimary]}>
                                        <Text style={[ds.diagCodeText, diag.classification === 'Primary' && ds.diagCodeTextPrimary]}>{diag.code}</Text>
                                    </View>
                                    <View style={ds.diagInfo}>
                                        <Text style={ds.diagName} numberOfLines={1}>{diag.name}</Text>
                                        <Text style={ds.diagClass}>{diag.classification}</Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    )}

                    {/* Empty State */}
                    {existingDiagnoses.length === 0 && !showResults && (
                        <View style={ds.emptyState}>
                            <Feather name="search" size={36} color={tc.textMuted} />
                            <Text style={ds.emptyTitle}>{t('visit.ai.icd10.empty') || 'Search ICD-10 codes'}</Text>
                            <Text style={ds.emptySubtitle}>{t('visit.ai.icd10.emptyDesc') || 'Type a code or description to search'}</Text>
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
    searchInputContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: tc.borderColor, borderRadius: 8, paddingHorizontal: 12, height: 48, backgroundColor: tc.cardBackgroundAlt, gap: 8 },
    searchInput: { flex: 1, fontSize: 14, color: tc.textPrimary },
    resultsDropdown: { backgroundColor: tc.cardBackground, borderWidth: 1, borderColor: tc.borderColor, borderRadius: 8, marginTop: 4, maxHeight: 320, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: isDark ? 0.4 : 0.15, shadowRadius: 8, elevation: 8 },
    resultsList: { maxHeight: 320 },
    resultItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: tc.borderColor },
    resultItemDisabled: { opacity: 0.5 },
    resultContent: { flex: 1 },
    resultCodes: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 4 },
    codeTagPrimary: { backgroundColor: isDark ? 'rgba(88,167,179,0.2)' : '#E2F2F4', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4 },
    codeTagPrimaryText: { fontSize: 11, fontWeight: '700', fontFamily: 'monospace', color: '#58A7B3' },
    codeTagSecondary: { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : '#F1F5F9', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4 },
    codeTagSecondaryText: { fontSize: 11, fontWeight: '500', fontFamily: 'monospace', color: tc.textMuted },
    resultTitle: { fontSize: 13, color: tc.textSecondary, lineHeight: 18 },
    noResults: { padding: 16, alignItems: 'center' },
    noResultsText: { fontSize: 13, color: tc.textMuted },
    existingSection: { marginTop: 4 },
    existingLabel: { fontSize: 13, fontWeight: '700', color: tc.textSecondary, marginBottom: 8 },
    diagItem: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 10, backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#F9FAFB', borderRadius: 8, borderWidth: 1, borderColor: tc.borderColor, marginBottom: 6 },
    diagItemPrimary: { backgroundColor: isDark ? 'rgba(88,167,179,0.1)' : '#F0F9FA', borderColor: isDark ? 'rgba(88,167,179,0.3)' : '#B2DFE5' },
    diagCodeBadge: { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : '#E5E7EB', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4 },
    diagCodeBadgePrimary: { backgroundColor: isDark ? 'rgba(88,167,179,0.2)' : '#D1EEF1' },
    diagCodeText: { fontSize: 12, fontWeight: '700', fontFamily: 'monospace', color: tc.textSecondary },
    diagCodeTextPrimary: { color: '#58A7B3' },
    diagInfo: { flex: 1 },
    diagName: { fontSize: 13, color: tc.textPrimary },
    diagClass: { fontSize: 11, color: tc.textMuted, marginTop: 2 },
    emptyState: { alignItems: 'center', paddingVertical: 24, gap: 8 },
    emptyTitle: { fontSize: 14, fontWeight: '600', color: tc.textSecondary },
    emptySubtitle: { fontSize: 12, color: tc.textMuted },
});

export default ICD10AssistantTool;
