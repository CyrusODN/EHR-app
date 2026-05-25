import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    FlatList,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { SearchMedicines } from '../../../Services/Visit.Service';
import type { Medication } from '../../../types/visit';

interface MedicationSearchProps {
    onSelect: (medication: Medication | null) => void;
    selectedMedication: Medication | null;
}

const MedicationSearch = ({ onSelect, selectedMedication }: MedicationSearchProps) => {
    const { t } = useTranslation();
    const { colors: tc, isDark } = useThemeColors();
    const ds = createStyles(tc, isDark);

    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Medication[]>([]);
    const [showResults, setShowResults] = useState(false);
    const [loading, setLoading] = useState(false);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (query.length < 2) {
            setResults([]);
            setShowResults(false);
            return;
        }

        if (debounceRef.current) clearTimeout(debounceRef.current);

        debounceRef.current = setTimeout(async () => {
            setLoading(true);
            try {
                const res = await SearchMedicines(query, 20);
                const meds: Medication[] = (res?.data || res || []).map((item: any) => ({
                    id: item._id || item.id || item.ean || String(Date.now()),
                    name: item.name || item.tradeName || '',
                    commonName: item.commonName || item.internationalName || '',
                    form: item.form || item.pharmaceuticalForm || '',
                    dose: item.dose || item.strength || '',
                    package: item.package || item.packaging || '',
                    ean: item.ean || '',
                    commonDosage: item.commonDosage || '1x1',
                    refundationCategories: item.refundationCategories || item.refundation || ['30%', 'B', 'S'],
                }));
                setResults(meds);
                setShowResults(true);
            } catch {
                setResults([]);
            } finally {
                setLoading(false);
            }
        }, 400);

        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [query]);

    const handleSelect = (medication: Medication) => {
        onSelect(medication);
        setQuery(medication.name);
        setShowResults(false);
    };

    const handleClear = () => {
        setQuery('');
        onSelect(null);
        setResults([]);
        setShowResults(false);
    };

    const renderResult = ({ item }: { item: Medication }) => (
        <TouchableOpacity
            style={ds.resultItem}
            onPress={() => handleSelect(item)}
            activeOpacity={0.7}
        >
            <View style={ds.resultContent}>
                <Text style={ds.resultName}>{item.name}</Text>
                <Text style={ds.resultDetails}>
                    {item.commonName}, {item.form}, {item.dose}
                </Text>
                <Text style={ds.resultPackage}>
                    {t('medicationSearch.results.package')} {item.package}
                </Text>
            </View>
            {item.refundationCategories.length > 0 && (
                <View style={ds.badgeRow}>
                    {item.refundationCategories.map((cat) => (
                        <View key={cat} style={ds.badge}>
                            <Text style={ds.badgeText}>{cat}</Text>
                        </View>
                    ))}
                </View>
            )}
        </TouchableOpacity>
    );

    return (
        <View style={ds.container}>
            <View style={ds.inputWrapper}>
                <Feather name="search" size={18} color={tc.textMuted} style={ds.searchIcon} />
                <TextInput
                    style={ds.input}
                    value={query}
                    onChangeText={setQuery}
                    placeholder={t('medicationSearch.input.placeholder')}
                    placeholderTextColor={tc.textMuted}
                />
                {loading && <ActivityIndicator size="small" color="#58A7B3" style={{ marginRight: 8 }} />}
                {query.length > 0 && !loading && (
                    <TouchableOpacity onPress={handleClear} style={ds.clearButton}>
                        <Feather name="x" size={18} color={tc.textMuted} />
                    </TouchableOpacity>
                )}
            </View>

            {showResults && results.length > 0 && (
                <View style={ds.resultsList}>
                    <FlatList
                        data={results}
                        keyExtractor={(item) => item.id}
                        renderItem={renderResult}
                        keyboardShouldPersistTaps="handled"
                        nestedScrollEnabled
                        style={{ maxHeight: 250 }}
                    />
                </View>
            )}

            {query.length >= 2 && !loading && results.length === 0 && showResults && (
                <View style={ds.noResults}>
                    <Text style={ds.noResultsText}>{t('medicationSearch.results.noResults')}</Text>
                </View>
            )}
        </View>
    );
};

const createStyles = (tc: any, isDark: boolean) =>
    StyleSheet.create({
        container: {
            marginBottom: 16,
        },
        inputWrapper: {
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: tc.borderColor,
            borderRadius: 8,
            paddingHorizontal: 12,
            height: 48,
            backgroundColor: tc.cardBackgroundAlt,
        },
        searchIcon: {
            marginRight: 8,
        },
        input: {
            flex: 1,
            fontSize: 14,
            color: tc.textPrimary,
        },
        clearButton: {
            padding: 4,
            marginLeft: 4,
        },
        resultsList: {
            borderWidth: 1,
            borderColor: tc.borderColor,
            borderRadius: 8,
            marginTop: 8,
            backgroundColor: tc.cardBackground,
            overflow: 'hidden',
        },
        resultItem: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            paddingHorizontal: 14,
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderBottomColor: tc.borderColor,
        },
        resultContent: {
            flex: 1,
            marginRight: 8,
        },
        resultName: {
            fontSize: 14,
            fontWeight: '600',
            color: tc.textPrimary,
            marginBottom: 2,
        },
        resultDetails: {
            fontSize: 12,
            color: tc.textSecondary,
            marginBottom: 2,
        },
        resultPackage: {
            fontSize: 12,
            color: tc.textSecondary,
        },
        badgeRow: {
            flexDirection: 'row',
            gap: 4,
            flexWrap: 'wrap',
            marginTop: 2,
        },
        badge: {
            backgroundColor: isDark ? 'rgba(59,130,246,0.2)' : '#DBEAFE',
            borderRadius: 12,
            paddingHorizontal: 8,
            paddingVertical: 2,
        },
        badgeText: {
            fontSize: 11,
            fontWeight: '600',
            color: isDark ? '#93C5FD' : '#1E40AF',
        },
        noResults: {
            paddingVertical: 16,
            alignItems: 'center',
        },
        noResultsText: {
            fontSize: 13,
            color: tc.textSecondary,
        },
    });

export default MedicationSearch;
