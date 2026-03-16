import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';

interface VisitDiagnosisProps {
    onNext: () => void;
    onBack: () => void;
}

const VisitDiagnosis = ({ onNext, onBack }: VisitDiagnosisProps) => {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.card}>
                <Text style={styles.title}>Diagnosis (ICD-10)</Text>

                <View style={styles.searchSection}>
                    <Text style={styles.searchLabel}>Search ICD-10 code or diagnosis name...</Text>
                    <View style={styles.searchInputContainer}>
                        <Feather name="search" size={20} color="#94A3B8" style={styles.searchIcon} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search by code (e.g., F32.1) or description (e.g., depression)..."
                            placeholderTextColor="#94A3B8"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>
                </View>

                <View style={styles.selectedSection}>
                    <Text style={styles.selectedLabel}>Selected diagnoses</Text>
                    
                    <View style={styles.emptyStateContainer}>
                        <View style={styles.emptyIconCircle}>
                            <Feather name="search" size={40} color="#CBD5E1" />
                        </View>
                        <Text style={styles.emptyTitle}>No diagnoses selected</Text>
                        <Text style={styles.emptySubtitle}>Search and select ICD-10 codes above</Text>
                    </View>
                </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <TouchableOpacity style={styles.backButton} onPress={onBack}>
                    <Feather name="arrow-left" size={18} color="#58A7B3" />
                    <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={onNext}>
                    <LinearGradient
                        colors={['#58A7B3', '#8ED1CC']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.nextButton}
                    >
                        <Text style={styles.nextButtonText}>Next</Text>
                        <Feather name="arrow-right" size={18} color="#fff" />
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 12,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 24,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        minHeight: hp(60),
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1E293B',
        marginBottom: 24,
    },
    searchSection: {
        marginBottom: 24,
    },
    searchLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748B',
        marginBottom: 12,
    },
    searchInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 8,
        paddingHorizontal: 12,
        height: 52,
        backgroundColor: '#fff',
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        color: '#1E293B',
    },
    selectedSection: {
        flex: 1,
    },
    selectedLabel: {
        fontSize: 14,
        fontWeight: '700',
        color: '#64748B',
        marginBottom: 16,
    },
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
        color: '#64748B',
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 14,
        color: '#94A3B8',
        textAlign: 'center',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        paddingBottom: hp(5),
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
});

export default VisitDiagnosis;
