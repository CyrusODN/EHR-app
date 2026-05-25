import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '../../../hooks/useThemeColors';
import MedicationSearch from './MedicationSearch';
import DosageForm from './DosageForm';
import RefundationSelect from './RefundationSelect';
import AdditionalRights from './AdditionalRights';
import PrescriptionSummary from './PrescriptionSummary';
import SigningModal from './SigningModal';
import type { Medication, Prescription } from '../../../types/visit';

interface PrescriptionSectionProps {
    prescriptions: Prescription[];
    onUpdate: (prescriptions: Prescription[]) => void;
}

const PrescriptionSection = ({ prescriptions, onUpdate }: PrescriptionSectionProps) => {
    const { t } = useTranslation();
    const { colors: tc, isDark } = useThemeColors();
    const ds = createStyles(tc, isDark);

    const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);
    const [showMedicationForm, setShowMedicationForm] = useState(false);
    const [showSigningModal, setShowSigningModal] = useState(false);
    const [prescriptionForSigning, setPrescriptionForSigning] = useState<Prescription | null>(null);

    // Medication form state
    const [dosage, setDosage] = useState('');
    const [packageCount, setPackageCount] = useState(1);
    const [refills, setRefills] = useState(0);
    const [instructionsText, setInstructionsText] = useState('');
    const [selectedRefundation, setSelectedRefundation] = useState('');
    const [selectedRights, setSelectedRights] = useState<string[]>([]);

    const draftPrescriptions = prescriptions.filter(p => p.status === 'draft');
    const signedPrescriptions = prescriptions.filter(p => p.status === 'signed');

    const resetForm = () => {
        setSelectedMedication(null);
        setDosage('');
        setPackageCount(1);
        setRefills(0);
        setInstructionsText('');
        setSelectedRefundation('');
        setSelectedRights([]);
        setShowMedicationForm(false);
    };

    const handleAddPrescription = useCallback(() => {
        if (!selectedMedication) return;

        const newPrescription: Prescription = {
            id: Date.now().toString(),
            medications: [{
                name: selectedMedication.name,
                commonName: selectedMedication.commonName,
                form: selectedMedication.form,
                dose: selectedMedication.dose,
                package: selectedMedication.package,
                ean: selectedMedication.ean,
                dosage: dosage || selectedMedication.commonDosage,
                quantity: packageCount,
                refundation: selectedRefundation || (selectedMedication.refundationCategories[0] || ''),
                instructions: instructionsText,
            }],
            status: 'draft',
            type: 'Rp',
            additionalRights: selectedRights,
            refillCount: refills,
        };

        onUpdate([...prescriptions, newPrescription]);
        resetForm();
    }, [selectedMedication, dosage, packageCount, refills, instructionsText, selectedRefundation, selectedRights, prescriptions, onUpdate]);

    const handleRemovePrescription = useCallback((id: string) => {
        onUpdate(prescriptions.filter(p => p.id !== id));
    }, [prescriptions, onUpdate]);

    const handleUpdatePrescription = useCallback((updated: Prescription) => {
        onUpdate(prescriptions.map(p => p.id === updated.id ? updated : p));
    }, [prescriptions, onUpdate]);

    const handleSignPrescription = useCallback((prescription: Prescription) => {
        setPrescriptionForSigning(prescription);
        setShowSigningModal(true);
    }, []);

    const handleSigningComplete = useCallback((signedPrescription: Prescription) => {
        onUpdate(prescriptions.map(p =>
            p.id === signedPrescription.id ? { ...signedPrescription, status: 'signed' as const } : p
        ));
        setShowSigningModal(false);
        setPrescriptionForSigning(null);
    }, [prescriptions, onUpdate]);

    return (
        <View>
            {/* Info box */}
            <View style={ds.infoBox}>
                <Feather name="info" size={18} color="#3B82F6" style={ds.infoIcon} />
                <View style={{ flex: 1 }}>
                    <Text style={ds.infoTitle}>{t('prescriptionForm.info.title')}</Text>
                    <Text style={ds.infoText}>{t('prescriptionForm.info.description')}</Text>
                </View>
            </View>

            {/* Add Medication Button */}
            {!showMedicationForm && (
                <TouchableOpacity
                    onPress={() => setShowMedicationForm(true)}
                    activeOpacity={0.8}
                    style={ds.addBtnContainer}
                >
                    <LinearGradient
                        colors={['#58A7B3', '#8ED1CC']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={ds.addBtn}
                    >
                        <Feather name="plus" size={18} color="#fff" />
                        <Text style={ds.addBtnText}>{t('prescriptionForm.buttons.addMedication')}</Text>
                    </LinearGradient>
                </TouchableOpacity>
            )}

            {/* Medication Form */}
            {showMedicationForm && (
                <View style={ds.formCard}>
                    <MedicationSearch
                        onSelect={setSelectedMedication}
                        selectedMedication={selectedMedication}
                    />

                    {selectedMedication && (
                        <>
                            <DosageForm
                                medication={selectedMedication}
                                onDosageChange={setDosage}
                                onPackageCountChange={setPackageCount}
                                onRefillsChange={setRefills}
                                onInstructionsChange={setInstructionsText}
                                packageCount={packageCount}
                                refills={refills}
                                instructions={instructionsText}
                            />

                            <RefundationSelect
                                categories={selectedMedication.refundationCategories}
                                selectedCategory={selectedRefundation}
                                onChange={setSelectedRefundation}
                            />

                            <AdditionalRights
                                selectedRights={selectedRights}
                                onChange={setSelectedRights}
                            />

                            {/* Action Buttons */}
                            <View style={ds.formActions}>
                                <TouchableOpacity style={ds.cancelBtn} onPress={resetForm}>
                                    <Text style={ds.cancelBtnText}>{t('prescriptionForm.buttons.cancel')}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={handleAddPrescription} activeOpacity={0.8}>
                                    <LinearGradient
                                        colors={['#58A7B3', '#8ED1CC']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        style={ds.submitBtn}
                                    >
                                        <Feather name="plus" size={16} color="#fff" />
                                        <Text style={ds.submitBtnText}>{t('prescriptionForm.buttons.addToPrescription')}</Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>
                        </>
                    )}
                </View>
            )}

            {/* Draft Prescriptions */}
            {draftPrescriptions.length > 0 && (
                <View style={ds.section}>
                    <View style={ds.sectionHeader}>
                        <Text style={ds.sectionTitle}>{t('prescriptionForm.sections.draftPrescriptions')}</Text>
                        <TouchableOpacity
                            onPress={() => handleSignPrescription(draftPrescriptions[0])}
                            activeOpacity={0.8}
                        >
                            <LinearGradient
                                colors={['#58A7B3', '#8ED1CC']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={ds.signAllBtn}
                            >
                                <Feather name="lock" size={14} color="#fff" />
                                <Text style={ds.signAllBtnText}>
                                    {t('prescriptionForm.buttons.signPrescriptions')} ({draftPrescriptions.length})
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>

                    {draftPrescriptions.map((prescription) => (
                        <PrescriptionSummary
                            key={prescription.id}
                            prescription={prescription}
                            onRemove={() => handleRemovePrescription(prescription.id)}
                            onUpdate={handleUpdatePrescription}
                            onSign={() => handleSignPrescription(prescription)}
                        />
                    ))}
                </View>
            )}

            {/* Signed Prescriptions */}
            {signedPrescriptions.length > 0 && (
                <View style={ds.section}>
                    <Text style={ds.sectionTitle}>{t('prescriptionForm.sections.signedPrescriptions')}</Text>
                    {signedPrescriptions.map((prescription) => (
                        <PrescriptionSummary
                            key={prescription.id}
                            prescription={prescription}
                            onRemove={() => handleRemovePrescription(prescription.id)}
                            onUpdate={handleUpdatePrescription}
                        />
                    ))}
                </View>
            )}

            {/* Signing Modal */}
            <SigningModal
                visible={showSigningModal}
                prescription={prescriptionForSigning}
                onClose={() => {
                    setShowSigningModal(false);
                    setPrescriptionForSigning(null);
                }}
                onComplete={handleSigningComplete}
            />
        </View>
    );
};

const createStyles = (tc: any, isDark: boolean) =>
    StyleSheet.create({
        infoBox: {
            backgroundColor: isDark ? 'rgba(59,130,246,0.1)' : '#EFF6FF',
            borderRadius: 8,
            padding: 16,
            flexDirection: 'row',
            marginBottom: 16,
            marginTop: 16,
        },
        infoIcon: {
            marginRight: 12,
            marginTop: 2,
        },
        infoTitle: {
            fontSize: 14,
            fontWeight: '700',
            color: isDark ? '#60A5FA' : '#2563EB',
            marginBottom: 4,
        },
        infoText: {
            fontSize: 13,
            color: isDark ? '#93C5FD' : '#3B82F6',
            lineHeight: 18,
        },
        addBtnContainer: {
            marginBottom: 16,
        },
        addBtn: {
            flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
            borderRadius: 8,overflow: 'hidden',
            height: 48,flex:1,
        },
        addBtnText: {
            color: '#fff',
            fontSize: 14,
            fontWeight: '600',
            marginLeft: 6,
        },
        formCard: {
            borderWidth: 1,
            borderColor: tc.borderColor,
            borderRadius: 8,
            padding: 16,
            marginBottom: 16,
            backgroundColor: tc.cardBackground,
        },
        formActions: {
            flexDirection: 'row',
            justifyContent: 'flex-end',
            gap: 10,
            marginTop: 8,
        },
        cancelBtn: {
            borderWidth: 1.5,
            borderColor: '#58A7B3',
            borderRadius: 8,
            paddingHorizontal: 18,
            paddingVertical: 10,
            justifyContent: 'center',
        },
        cancelBtnText: {
            color: '#58A7B3',
            fontSize: 14,
            fontWeight: '600',
        },
        submitBtn: {
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: 8,
            overflow: 'hidden',
            height: 48, flex: 1,
            gap: 6,
        },
        submitBtnText: {
            color: '#fff',
            fontSize: 14,
            fontWeight: '600',
        },
        section: {
            marginBottom: 16,
        },
        sectionHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 12,
        },
        sectionTitle: {
            fontSize: 15,
            fontWeight: '700',
            color: tc.textPrimary,
            marginBottom: 12,
        },
        signAllBtn: {
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: 6,
            overflow: 'hidden',
            height: 48, flex: 1,
            gap: 6,
        },
        signAllBtnText: {
            color: '#fff',
            fontSize: 12,
            fontWeight: '600',
        },
    });

export default PrescriptionSection;
