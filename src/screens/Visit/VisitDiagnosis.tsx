import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
    FlatList,
    Modal,
    Pressable,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '../../hooks/useThemeColors';
import { useICD10Search } from '../../hooks/useICD10Search';
import type { ICD10Diagnosis, VisitDiagnosis as VisitDiagnosisType } from '../../types/visit';
import type { ICD10SearchResult } from '../../hooks/useICD10Search';

interface VisitDiagnosisProps {
    onNext: () => void;
    onBack: () => void;
    visitData?: any;
    onUpdate?: (fields: Record<string, any>) => void;
}

const VisitDiagnosis = ({ onNext, onBack, visitData, onUpdate }: VisitDiagnosisProps) => {
    const { t } = useTranslation();
    const { colors: tc, isDark } = useThemeColors();
    const ds = createDynamicStyles(tc, isDark);
    const { searchQuery, setSearchQuery, clearSearch, searchResults, isSearching } = useICD10Search();

    const [selectedDiagnoses, setSelectedDiagnoses] = useState<ICD10Diagnosis[]>([]);
    const [showResults, setShowResults] = useState(false);
    const [classificationModalIndex, setClassificationModalIndex] = useState<number | null>(null);

    useEffect(() => {
        if (visitData?.diagnosis?.icd10) {
            setSelectedDiagnoses(visitData.diagnosis.icd10);
        }
    }, [visitData]);

    const persistDiagnoses = useCallback(
        (updated: ICD10Diagnosis[]) => {
            setSelectedDiagnoses(updated);
            onUpdate?.({ diagnosis: { icd10: updated } });
        },
        [onUpdate],
    );

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setShowResults(query.length >= 2);
    };

    const handleSelectDiagnosis = (result: ICD10SearchResult) => {
        const code = (result.ICD10Code || result.ICD11CODE || '') as string;
        const name = (result.ICD10Title || result.ICD11Title || code) as string;
        if (!code) return;
        if (selectedDiagnoses.some(d => d.code === code)) return;

        const newDiagnosis: ICD10Diagnosis = {
            code,
            name,
            classification: selectedDiagnoses.length === 0 ? 'Primary' : 'Secondary',
            addedAt: new Date().toISOString(),
        };

        persistDiagnoses([...selectedDiagnoses, newDiagnosis]);
        clearSearch();
        setShowResults(false);
    };

    const handleRemoveDiagnosis = (index: number) => {
        const updated = selectedDiagnoses.filter((_, i) => i !== index);
        if (updated.length > 0 && !updated.some(d => d.classification === 'Primary')) {
            updated[0].classification = 'Primary';
        }
        persistDiagnoses(updated);
    };

    const handleClassificationChange = (index: number, classification: 'Primary' | 'Secondary') => {
        const updated = [...selectedDiagnoses];
        if (classification === 'Primary') {
            updated.forEach((d, i) => {
                if (i !== index) d.classification = 'Secondary';
            });
        }
        updated[index] = { ...updated[index], classification };
        persistDiagnoses(updated);
        setClassificationModalIndex(null);
    };

    const renderSearchResult = ({ item, index }: { item: ICD10SearchResult; index: number }) => (
        <TouchableOpacity
            style={ds.resultItem}
            onPress={() => handleSelectDiagnosis(item)}
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
            <Feather name="plus" size={16} color={tc.textMuted} />
        </TouchableOpacity>
    );

    const formatDate = (iso: string) => {
        try {
            const d = new Date(iso);
            return d.toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            });
        } catch {
            return iso;
        }
    };

    return (
        <ScrollView style={ds.container} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            <View style={ds.card}>
                <Text style={ds.title}>{t('visit.diagnosis.title')}</Text>

                {/* Search Section */}
                <View style={ds.searchSection}>
                    <Text style={ds.searchLabel}>{t('visit.diagnosis.search_title')}</Text>
                    <View style={ds.searchInputContainer}>
                        <Feather name="search" size={20} color={tc.textMuted} style={ds.searchIcon} />
                        <TextInput
                            style={ds.searchInput}
                            placeholder={t('visit.diagnosis.search_placeholder')}
                            placeholderTextColor={tc.textMuted}
                            value={searchQuery}
                            onChangeText={handleSearch}
                            onFocus={() => { if (searchQuery.length >= 2) setShowResults(true); }}
                        />
                        {searchQuery.length > 0 && (
                            <TouchableOpacity
                                onPress={() => { clearSearch(); setShowResults(false); }}
                                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                            >
                                <Feather name="x" size={18} color={tc.textMuted} />
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* Search Results Dropdown */}
                    {showResults && isSearching && (
                        <View style={ds.resultsDropdown}>
                            {searchResults.length > 0 ? (
                                <FlatList
                                    data={searchResults}
                                    keyExtractor={(item, idx) =>
                                        `${item.ICD11CODE || item.ICD10Code || 'u'}-${idx}`
                                    }
                                    renderItem={renderSearchResult}
                                    style={ds.resultsList}
                                    keyboardShouldPersistTaps="handled"
                                    nestedScrollEnabled
                                />
                            ) : (
                                <View style={ds.noResults}>
                                    <Text style={ds.noResultsText}>
                                        {t('visit.diagnosis.noResults') ||
                                            `No ICD-10 codes found for "${searchQuery}"`}
                                    </Text>
                                </View>
                            )}
                        </View>
                    )}
                </View>

                {/* Selected Diagnoses */}
                <View style={ds.selectedSection}>
                    <View style={ds.selectedHeader}>
                        <Text style={ds.selectedLabel}>
                            {t('visit.diagnosis.selected')} ({selectedDiagnoses.length})
                        </Text>
                        {selectedDiagnoses.length > 0 && (
                            <Text style={ds.primaryHint}>
                                {t('visit.diagnosis.primaryHint') || 'Primary diagnosis highlighted'}
                            </Text>
                        )}
                    </View>

                    {selectedDiagnoses.length > 0 ? (
                        <View style={ds.diagnosesList}>
                            {selectedDiagnoses.map((diag, index) => {
                                const isPrimary = diag.classification === 'Primary';
                                return (
                                    <View
                                        key={`${diag.code}-${index}`}
                                        style={[
                                            ds.diagnosisItem,
                                            isPrimary && ds.diagnosisItemPrimary,
                                        ]}
                                    >
                                        <View style={ds.diagnosisMain}>
                                            <View style={ds.diagnosisTopRow}>
                                                <View
                                                    style={[
                                                        ds.diagnosisCodeBadge,
                                                        isPrimary && ds.diagnosisCodeBadgePrimary,
                                                    ]}
                                                >
                                                    <Text
                                                        style={[
                                                            ds.diagnosisCodeText,
                                                            isPrimary && ds.diagnosisCodeTextPrimary,
                                                        ]}
                                                    >
                                                        {diag.code}
                                                    </Text>
                                                </View>

                                                {/* Classification Toggle */}
                                                <TouchableOpacity
                                                    style={[
                                                        ds.classificationBadge,
                                                        isPrimary && ds.classificationBadgePrimary,
                                                    ]}
                                                    onPress={() => setClassificationModalIndex(index)}
                                                    activeOpacity={0.7}
                                                >
                                                    <Text
                                                        style={[
                                                            ds.classificationText,
                                                            isPrimary && ds.classificationTextPrimary,
                                                        ]}
                                                    >
                                                        {diag.classification}
                                                    </Text>
                                                    <Feather
                                                        name="chevron-down"
                                                        size={12}
                                                        color={isPrimary ? '#58A7B3' : tc.textMuted}
                                                    />
                                                </TouchableOpacity>
                                            </View>

                                            <Text style={ds.diagnosisName}>{diag.name}</Text>

                                            {diag.addedAt && (
                                                <Text style={ds.addedAt}>
                                                    {t('visit.diagnosis.addedAt') || 'Added'}:{' '}
                                                    {formatDate(diag.addedAt)}
                                                </Text>
                                            )}
                                        </View>

                                        {/* Remove Button */}
                                        <TouchableOpacity
                                            style={ds.removeButton}
                                            onPress={() => handleRemoveDiagnosis(index)}
                                            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                                        >
                                            <Feather name="x" size={16} color="#EF4444" />
                                        </TouchableOpacity>
                                    </View>
                                );
                            })}
                        </View>
                    ) : (
                        <View style={ds.emptyStateContainer}>
                            <View style={ds.emptyIconCircle}>
                                <Feather name="search" size={40} color={tc.textMuted} />
                            </View>
                            <Text style={ds.emptyTitle}>{t('visit.diagnosis.empty')}</Text>
                            <Text style={ds.emptySubtitle}>{t('visit.diagnosis.empty_desc')}</Text>
                        </View>
                    )}
                </View>
            </View>

            {/* Footer */}
            <View style={ds.footer}>
                <TouchableOpacity style={ds.backButton} onPress={onBack}>
                    <Feather name="arrow-left" size={18} color="#58A7B3" />
                    <Text style={ds.backButtonText}>{t('visit.navigation.previous')}</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={onNext}>
                    <LinearGradient
                        colors={['#58A7B3', '#8ED1CC']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={ds.nextButton}
                    >
                        <Text style={ds.nextButtonText}>{t('visit.navigation.next')}</Text>
                        <Feather name="arrow-right" size={18} color="#fff" />
                    </LinearGradient>
                </TouchableOpacity>
            </View>

            {/* Classification Picker Modal */}
            <Modal
                visible={classificationModalIndex !== null}
                transparent
                animationType="fade"
                onRequestClose={() => setClassificationModalIndex(null)}
            >
                <Pressable style={ds.modalOverlay} onPress={() => setClassificationModalIndex(null)}>
                    <View style={ds.modalContent}>
                        <Text style={ds.modalTitle}>
                            {t('visit.diagnosis.classification') || 'Classification'}
                        </Text>
                        {(['Primary', 'Secondary'] as const).map(option => {
                            const isActive =
                                classificationModalIndex !== null &&
                                selectedDiagnoses[classificationModalIndex]?.classification === option;
                            return (
                                <TouchableOpacity
                                    key={option}
                                    style={[ds.modalOption, isActive && ds.modalOptionActive]}
                                    onPress={() => {
                                        if (classificationModalIndex !== null) {
                                            handleClassificationChange(classificationModalIndex, option);
                                        }
                                    }}
                                >
                                    <Text style={[ds.modalOptionText, isActive && ds.modalOptionTextActive]}>
                                        {option === 'Primary'
                                            ? t('visit.diagnosis.type.primary') || 'Primary'
                                            : t('visit.diagnosis.type.secondary') || 'Secondary'}
                                    </Text>
                                    {isActive && <Feather name="check" size={18} color="#58A7B3" />}
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </Pressable>
            </Modal>
        </ScrollView>
    );
};

const createDynamicStyles = (tc: any, isDark: boolean) =>
    StyleSheet.create({
        container: {
            flex: 1,
            padding: 12,
        },
        card: {
            backgroundColor: tc.cardBackground,
            borderRadius: 12,
            padding: 24,
            borderWidth: 1,
            borderColor: tc.borderColor,
            minHeight: hp(60),
        },
        title: {
            fontSize: 18,
            fontWeight: '700',
            color: tc.textPrimary,
            marginBottom: 24,
        },

        // Search
        searchSection: {
            marginBottom: 24,
            zIndex: 10,
        },
        searchLabel: {
            fontSize: 14,
            fontWeight: '600',
            color: tc.textSecondary,
            marginBottom: 12,
        },
        searchInputContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: tc.borderColor,
            borderRadius: 8,
            paddingHorizontal: 12,
            height: 52,
            backgroundColor: tc.cardBackgroundAlt,
        },
        searchIcon: {
            marginRight: 10,
        },
        searchInput: {
            flex: 1,
            fontSize: 14,
            color: tc.textPrimary,
        },

        // Dropdown
        resultsDropdown: {
            backgroundColor: tc.cardBackground,
            borderWidth: 1,
            borderColor: tc.borderColor,
            borderRadius: 8,
            marginTop: 4,
            maxHeight: 320,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: isDark ? 0.4 : 0.15,
            shadowRadius: 8,
            elevation: 8,
        },
        resultsList: {
            maxHeight: 320,
        },
        resultItem: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 14,
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderBottomColor: tc.borderColor,
        },
        resultContent: {
            flex: 1,
        },
        resultCodes: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 6,
            marginBottom: 4,
        },
        codeTagPrimary: {
            backgroundColor: isDark ? 'rgba(88,167,179,0.2)' : '#E2F2F4',
            paddingHorizontal: 8,
            paddingVertical: 3,
            borderRadius: 4,
        },
        codeTagPrimaryText: {
            fontSize: 11,
            fontWeight: '700',
            fontFamily: 'monospace',
            color: '#58A7B3',
        },
        codeTagSecondary: {
            backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : '#F1F5F9',
            paddingHorizontal: 8,
            paddingVertical: 3,
            borderRadius: 4,
        },
        codeTagSecondaryText: {
            fontSize: 11,
            fontWeight: '500',
            fontFamily: 'monospace',
            color: tc.textMuted,
        },
        resultTitle: {
            fontSize: 13,
            color: tc.textSecondary,
            lineHeight: 18,
        },
        noResults: {
            padding: 16,
            alignItems: 'center',
        },
        noResultsText: {
            fontSize: 13,
            color: tc.textMuted,
        },

        // Selected Diagnoses
        selectedSection: {
            flex: 1,
        },
        selectedHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
        },
        selectedLabel: {
            fontSize: 14,
            fontWeight: '700',
            color: tc.textSecondary,
        },
        primaryHint: {
            fontSize: 11,
            color: tc.textMuted,
        },
        diagnosesList: {
            marginTop: 4,
        },
        diagnosisItem: {
            flexDirection: 'row',
            padding: 14,
            backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#F9FAFB',
            borderRadius: 10,
            marginBottom: 10,
            borderWidth: 1,
            borderColor: tc.borderColor,
        },
        diagnosisItemPrimary: {
            backgroundColor: isDark ? 'rgba(88,167,179,0.1)' : '#F0F9FA',
            borderColor: isDark ? 'rgba(88,167,179,0.3)' : '#B2DFE5',
        },
        diagnosisMain: {
            flex: 1,
        },
        diagnosisTopRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            marginBottom: 8,
        },
        diagnosisCodeBadge: {
            backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : '#E5E7EB',
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 6,
        },
        diagnosisCodeBadgePrimary: {
            backgroundColor: isDark ? 'rgba(88,167,179,0.2)' : '#D1EEF1',
        },
        diagnosisCodeText: {
            fontSize: 13,
            fontWeight: '700',
            fontFamily: 'monospace',
            color: tc.textSecondary,
        },
        diagnosisCodeTextPrimary: {
            color: '#58A7B3',
        },
        classificationBadge: {
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: tc.borderColor,
            borderRadius: 6,
            paddingHorizontal: 10,
            paddingVertical: 4,
            gap: 4,
            backgroundColor: tc.cardBackground,
        },
        classificationBadgePrimary: {
            borderColor: isDark ? 'rgba(88,167,179,0.4)' : '#B2DFE5',
        },
        classificationText: {
            fontSize: 12,
            color: tc.textMuted,
        },
        classificationTextPrimary: {
            color: '#58A7B3',
            fontWeight: '600',
        },
        diagnosisName: {
            fontSize: 14,
            color: tc.textSecondary,
            lineHeight: 20,
        },
        addedAt: {
            fontSize: 11,
            color: tc.textMuted,
            marginTop: 6,
        },
        removeButton: {
            width: 32,
            height: 32,
            borderRadius: 6,
            backgroundColor: isDark ? 'rgba(239,68,68,0.1)' : '#FEF2F2',
            justifyContent: 'center',
            alignItems: 'center',
            marginLeft: 10,
            alignSelf: 'flex-start',
        },

        // Empty state
        emptyStateContainer: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 60,
        },
        emptyIconCircle: {
            marginBottom: 16,
        },
        emptyTitle: {
            fontSize: 16,
            fontWeight: '600',
            color: tc.textSecondary,
            marginBottom: 8,
        },
        emptySubtitle: {
            fontSize: 14,
            color: tc.textMuted,
            textAlign: 'center',
        },

        // Footer
        footer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 20,
            width: wp(80),
            alignItems: 'center',
            gap: wp(2),
        },
        backButton: {
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1.5,
            borderColor: '#58A7B3',
            borderRadius: 8,
            width: wp(43),
            height: 50,
            justifyContent: 'center',
        },
        backButtonText: {
            fontSize: 16,
            color: '#58A7B3',
            fontWeight: '700',
            marginLeft: 8,
        },
        nextButton: {
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: 8,
            width: wp(43),
            height: 50,
            justifyContent: 'center',
        },
        nextButtonText: {
            fontSize: 16,
            color: '#fff',
            fontWeight: '700',
            marginRight: 8,
        },

        // Classification Modal
        modalOverlay: {
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.4)',
            justifyContent: 'center',
            alignItems: 'center',
        },
        modalContent: {
            width: wp(75),
            backgroundColor: tc.cardBackground,
            borderRadius: 14,
            padding: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.25,
            shadowRadius: 12,
            elevation: 10,
        },
        modalTitle: {
            fontSize: 16,
            fontWeight: '700',
            color: tc.textPrimary,
            marginBottom: 16,
        },
        modalOption: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 14,
            paddingHorizontal: 12,
            borderRadius: 8,
            marginBottom: 6,
        },
        modalOptionActive: {
            backgroundColor: isDark ? 'rgba(88,167,179,0.1)' : '#F0F9FA',
        },
        modalOptionText: {
            fontSize: 15,
            color: tc.textSecondary,
        },
        modalOptionTextActive: {
            color: '#58A7B3',
            fontWeight: '600',
        },
    });

export default VisitDiagnosis;
