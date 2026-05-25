import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '../../../hooks/useThemeColors';
import type { Prescription } from '../../../types/visit';

interface PrescriptionSummaryProps {
    prescription: Prescription;
    onRemove: () => void;
    onUpdate: (prescription: Prescription) => void;
    onSign?: () => void;
}

const PrescriptionSummary = ({ prescription, onRemove, onUpdate, onSign }: PrescriptionSummaryProps) => {
    const { t } = useTranslation();
    const { colors: tc, isDark } = useThemeColors();
    const ds = createStyles(tc, isDark);

    const [isEditing, setIsEditing] = useState(false);
    const [editedPrescription, setEditedPrescription] = useState(prescription);

    const handleSave = () => {
        onUpdate(editedPrescription);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditedPrescription(prescription);
        setIsEditing(false);
    };

    const isDraft = prescription.status === 'draft';

    return (
        <View style={ds.card}>
            {/* Header */}
            <View style={ds.header}>
                <View style={ds.headerLeft}>
                    <MaterialCommunityIcons name="file-document-outline" size={20} color="#58A7B3" />
                    <View style={ds.headerInfo}>
                        <Text style={ds.headerTitle}>
                            {t('prescriptionSummary.title')} {prescription.type}
                        </Text>
                        <Text style={ds.headerStatus}>
                            {t('prescriptionSummary.status.label')}{' '}
                            {t(`prescriptionSummary.status.${isDraft ? 'draft' : 'issued'}`)}
                        </Text>
                    </View>
                </View>

                <View style={ds.headerActions}>
                    {isDraft ? (
                        isEditing ? (
                            <>
                                <TouchableOpacity style={ds.outlineBtn} onPress={handleCancel}>
                                    <Feather name="x" size={14} color="#58A7B3" />
                                    <Text style={ds.outlineBtnText}>{t('prescriptionSummary.buttons.cancel')}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={handleSave}>
                                    <LinearGradient
                                        colors={['#58A7B3', '#8ED1CC']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        style={ds.gradientBtn}
                                    >
                                        <Feather name="save" size={14} color="#fff" />
                                        <Text style={ds.gradientBtnText}>{t('prescriptionSummary.buttons.save')}</Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </>
                        ) : (
                            <>
                                <TouchableOpacity style={ds.outlineBtn} onPress={() => setIsEditing(true)}>
                                    <Feather name="edit-2" size={14} color="#58A7B3" />
                                    <Text style={ds.outlineBtnText}>{t('prescriptionSummary.buttons.edit')}</Text>
                                </TouchableOpacity>
                                {onSign && (
                                    <TouchableOpacity onPress={onSign}>
                                        <LinearGradient
                                            colors={['#58A7B3', '#8ED1CC']}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 0 }}
                                            style={ds.gradientBtn}
                                        >
                                            <Feather name="lock" size={14} color="#fff" />
                                            <Text style={ds.gradientBtnText}>{t('prescriptionSummary.buttons.sign')}</Text>
                                        </LinearGradient>
                                    </TouchableOpacity>
                                )}
                            </>
                        )
                    ) : (
                        <>
                            <TouchableOpacity style={ds.outlineBtn}>
                                <Feather name="printer" size={14} color="#58A7B3" />
                                <Text style={ds.outlineBtnText}>{t('prescriptionSummary.buttons.print')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={ds.outlineBtn}>
                                <Feather name="plus-circle" size={14} color="#58A7B3" />
                                <Text style={ds.outlineBtnText}>{t('prescriptionSummary.buttons.reissue')}</Text>
                            </TouchableOpacity>
                        </>
                    )}
                    <TouchableOpacity style={ds.deleteBtn} onPress={onRemove}>
                        <Feather name="trash-2" size={16} color="#EF4444" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Medications */}
            <View style={ds.body}>
                {editedPrescription.medications.map((medication, index) => (
                    <View key={index} style={ds.medCard}>
                        {isEditing ? (
                            <View style={ds.editFields}>
                                <View style={ds.editField}>
                                    <Text style={ds.editLabel}>{t('prescriptionSummary.medication.dosage.label')}</Text>
                                    <TextInput
                                        style={ds.editInput}
                                        value={medication.dosage}
                                        onChangeText={(text) => {
                                            const meds = [...editedPrescription.medications];
                                            meds[index] = { ...medication, dosage: text };
                                            setEditedPrescription({ ...editedPrescription, medications: meds });
                                        }}
                                        placeholderTextColor={tc.textMuted}
                                    />
                                </View>
                                <View style={ds.editField}>
                                    <Text style={ds.editLabel}>{t('prescriptionSummary.medication.quantity.label')}</Text>
                                    <TextInput
                                        style={ds.editInput}
                                        value={String(medication.quantity)}
                                        keyboardType="numeric"
                                        onChangeText={(text) => {
                                            const meds = [...editedPrescription.medications];
                                            meds[index] = { ...medication, quantity: parseInt(text) || 1 };
                                            setEditedPrescription({ ...editedPrescription, medications: meds });
                                        }}
                                        placeholderTextColor={tc.textMuted}
                                    />
                                </View>
                                <View style={ds.editField}>
                                    <Text style={ds.editLabel}>{t('prescriptionSummary.medication.instructions.label')}</Text>
                                    <TextInput
                                        style={[ds.editInput, ds.editTextArea]}
                                        value={medication.instructions}
                                        multiline
                                        numberOfLines={2}
                                        textAlignVertical="top"
                                        onChangeText={(text) => {
                                            const meds = [...editedPrescription.medications];
                                            meds[index] = { ...medication, instructions: text };
                                            setEditedPrescription({ ...editedPrescription, medications: meds });
                                        }}
                                        placeholderTextColor={tc.textMuted}
                                    />
                                </View>
                            </View>
                        ) : (
                            <View style={ds.medDisplay}>
                                <View style={ds.medInfo}>
                                    <Text style={ds.medName}>{medication.name}</Text>
                                    <Text style={ds.medDetails}>
                                        {medication.commonName}, {medication.form}, {medication.dose}
                                    </Text>
                                    <Text style={ds.medDetails}>
                                        {t('prescriptionSummary.medication.dosage.prefix')}{medication.dosage}
                                    </Text>
                                    {medication.instructions ? (
                                        <Text style={ds.medDetails}>
                                            {t('prescriptionSummary.medication.instructions.prefix')}{medication.instructions}
                                        </Text>
                                    ) : null}
                                </View>
                                <View style={ds.medMeta}>
                                    {medication.refundation ? (
                                        <View style={ds.refundBadge}>
                                            <Text style={ds.refundBadgeText}>{medication.refundation}</Text>
                                        </View>
                                    ) : null}
                                    <Text style={ds.medQty}>
                                        {t('prescriptionSummary.medication.quantity.display')}{medication.quantity} op.
                                    </Text>
                                </View>
                            </View>
                        )}
                    </View>
                ))}

                {prescription.additionalRights && prescription.additionalRights.length > 0 && (
                    <View style={ds.rightsBox}>
                        <Feather name="alert-circle" size={14} color="#3B82F6" style={{ marginRight: 8, marginTop: 2 }} />
                        <View style={{ flex: 1 }}>
                            <Text style={ds.rightsTitle}>{t('prescriptionSummary.additionalRights.title')}</Text>
                            <View style={ds.rightsBadges}>
                                {prescription.additionalRights.map((right, i) => (
                                    <View key={i} style={ds.rightBadge}>
                                        <Text style={ds.rightBadgeText}>{right}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    </View>
                )}
            </View>
        </View>
    );
};

const createStyles = (tc: any, isDark: boolean) =>
    StyleSheet.create({
        card: {
            borderWidth: 1,
            borderColor: tc.borderColor,
            borderRadius: 8,
            overflow: 'hidden',
            marginBottom: 12,
        },
        header: {
            padding: 14,
            backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#F9FAFB',
            borderBottomWidth: 1,
            borderBottomColor: tc.borderColor,
        },
        headerLeft: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10,
        },
        headerInfo: {
            marginLeft: 10,
        },
        headerTitle: {
            fontSize: 14,
            fontWeight: '600',
            color: tc.textPrimary,
        },
        headerStatus: {
            fontSize: 12,
            color: tc.textSecondary,
            marginTop: 2,
        },
        headerActions: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            flexWrap: 'wrap',
        },
        outlineBtn: {
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1.5,
            borderColor: '#58A7B3',
            borderRadius: 6,
            paddingHorizontal: 10,
            paddingVertical: 6,
            gap: 4,
        },
        outlineBtnText: {
            fontSize: 12,
            fontWeight: '600',
            color: '#58A7B3',
        },
        gradientBtn: {
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: 6,
            paddingHorizontal: 12,
            paddingVertical: 7,
            gap: 4,
        },
        gradientBtnText: {
            fontSize: 12,
            fontWeight: '600',
            color: '#fff',
        },
        deleteBtn: {
            padding: 6,
        },
        body: {
            padding: 14,
        },
        medCard: {
            backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#F9FAFB',
            borderRadius: 8,
            padding: 12,
            marginBottom: 10,
        },
        medDisplay: {
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        medInfo: {
            flex: 1,
            marginRight: 10,
        },
        medName: {
            fontSize: 14,
            fontWeight: '600',
            color: tc.textPrimary,
            marginBottom: 4,
        },
        medDetails: {
            fontSize: 12,
            color: tc.textSecondary,
            marginBottom: 2,
            lineHeight: 17,
        },
        medMeta: {
            alignItems: 'flex-end',
            gap: 6,
        },
        medQty: {
            fontSize: 12,
            color: tc.textSecondary,
        },
        refundBadge: {
            backgroundColor: isDark ? 'rgba(59,130,246,0.2)' : '#DBEAFE',
            borderRadius: 12,
            paddingHorizontal: 8,
            paddingVertical: 3,
        },
        refundBadgeText: {
            fontSize: 11,
            fontWeight: '600',
            color: isDark ? '#93C5FD' : '#1E40AF',
        },
        editFields: {
            gap: 12,
        },
        editField: {},
        editLabel: {
            fontSize: 12,
            fontWeight: '600',
            color: tc.textSecondary,
            marginBottom: 6,
        },
        editInput: {
            borderWidth: 1,
            borderColor: tc.borderColor,
            borderRadius: 8,
            paddingHorizontal: 12,
            paddingVertical: 8,
            fontSize: 14,
            color: tc.textPrimary,
            backgroundColor: tc.cardBackground,
        },
        editTextArea: {
            minHeight: 56,
        },
        rightsBox: {
            backgroundColor: isDark ? 'rgba(59,130,246,0.1)' : '#EFF6FF',
            borderRadius: 8,
            padding: 12,
            flexDirection: 'row',
            alignItems: 'flex-start',
        },
        rightsTitle: {
            fontSize: 12,
            fontWeight: '600',
            color: isDark ? '#60A5FA' : '#1E40AF',
            marginBottom: 6,
        },
        rightsBadges: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 6,
        },
        rightBadge: {
            backgroundColor: isDark ? 'rgba(59,130,246,0.2)' : '#DBEAFE',
            borderRadius: 12,
            paddingHorizontal: 8,
            paddingVertical: 3,
        },
        rightBadgeText: {
            fontSize: 11,
            fontWeight: '600',
            color: isDark ? '#93C5FD' : '#1E40AF',
        },
    });

export default PrescriptionSummary;
