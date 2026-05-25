import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Modal,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '../../../hooks/useThemeColors';
import type { ProcedureResult, ProcedureAttachment } from '../../../types/procedures';

interface ProcedureResultsProps {
    visible: boolean;
    procedureId: string;
    procedureName: string;
    onSubmit: (procedureId: string, results: ProcedureResult) => void;
    onClose: () => void;
}

const ProcedureResultsModal = ({ visible, procedureId, procedureName, onSubmit, onClose }: ProcedureResultsProps) => {
    const { t } = useTranslation();
    const { colors: tc, isDark } = useThemeColors();
    const ds = useMemo(() => createDynamicStyles(tc, isDark), [tc, isDark]);

    const [findings, setFindings] = useState('');
    const [complications, setComplications] = useState('');
    const [recommendations, setRecommendations] = useState('');
    const [attachments, setAttachments] = useState<ProcedureAttachment[]>([]);

    const handleSubmit = () => {
        if (!findings.trim()) return;

        const results: ProcedureResult = {
            completionDate: new Date().toISOString(),
            findings: findings.trim(),
            complications: complications.trim() ? complications.split(',').map(c => c.trim()) : [],
            recommendations: recommendations.trim() ? recommendations.split(',').map(r => r.trim()) : [],
            attachments,
        };

        onSubmit(procedureId, results);
        resetForm();
        onClose();
    };

    const resetForm = () => {
        setFindings('');
        setComplications('');
        setRecommendations('');
        setAttachments([]);
    };

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <View style={ds.overlay}>
                <View style={ds.modalContent}>
                    <View style={ds.modalHeader}>
                        <View>
                            <Text style={ds.modalTitle}>{t('visit.procedures.results.title')}</Text>
                            <Text style={ds.procedureLabel}>{procedureName}</Text>
                        </View>
                        <TouchableOpacity onPress={onClose}>
                            <Feather name="x" size={20} color={tc.textMuted} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={ds.modalBody} showsVerticalScrollIndicator={false}>
                        <Text style={ds.label}>{t('visit.procedures.results.findings')} *</Text>
                        <TextInput
                            style={[ds.input, ds.textArea]}
                            placeholder={t('visit.procedures.results.findingsPlaceholder')}
                            placeholderTextColor={tc.textMuted}
                            value={findings}
                            onChangeText={setFindings}
                            multiline
                            numberOfLines={4}
                        />

                        <Text style={ds.label}>{t('visit.procedures.results.complications')}</Text>
                        <TextInput
                            style={ds.input}
                            placeholder={t('visit.procedures.results.complicationsPlaceholder')}
                            placeholderTextColor={tc.textMuted}
                            value={complications}
                            onChangeText={setComplications}
                        />
                        <Text style={ds.hint}>{t('visit.procedures.results.commaHint')}</Text>

                        <Text style={ds.label}>{t('visit.procedures.results.recommendations')}</Text>
                        <TextInput
                            style={ds.input}
                            placeholder={t('visit.procedures.results.recommendationsPlaceholder')}
                            placeholderTextColor={tc.textMuted}
                            value={recommendations}
                            onChangeText={setRecommendations}
                        />
                        <Text style={ds.hint}>{t('visit.procedures.results.commaHint')}</Text>
                    </ScrollView>

                    <View style={ds.modalFooter}>
                        <TouchableOpacity style={ds.cancelBtn} onPress={onClose}>
                            <Text style={ds.cancelText}>{t('common.cancel')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[ds.submitBtn, !findings.trim() && { opacity: 0.5 }]}
                            onPress={handleSubmit}
                            disabled={!findings.trim()}
                        >
                            <LinearGradient
                                colors={['#4A90B9', '#5BA6B6', '#68BFB3']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={ds.submitGradient}
                            >
                                <Feather name="save" size={14} color="#fff" />
                                <Text style={ds.submitText}>{t('visit.procedures.results.save')}</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default ProcedureResultsModal;

const createDynamicStyles = (tc: any, isDark: boolean) => StyleSheet.create({
    overlay: {
        flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center',
        alignItems: 'center', padding: 20,
    },
    modalContent: {
        backgroundColor: tc.modalBg || tc.cardBackground, borderRadius: 12,
        width: '100%', maxHeight: hp(75), padding: 20,
        borderWidth: isDark ? 1 : 0, borderColor: tc.borderColor,
    },
    modalHeader: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20,
    },
    modalTitle: { fontSize: 18, fontWeight: '700', color: tc.textPrimary },
    procedureLabel: { fontSize: 13, color: tc.textMuted, marginTop: 2 },
    modalBody: { marginBottom: 16 },
    label: { fontSize: 13, fontWeight: '600', color: tc.textSecondary, marginBottom: 6, marginTop: 12 },
    input: {
        borderWidth: 1, borderColor: tc.borderColor, borderRadius: 8, paddingHorizontal: 12,
        paddingVertical: 10, fontSize: 14, color: tc.textPrimary, backgroundColor: tc.inputBackground,
    },
    textArea: { minHeight: 100, textAlignVertical: 'top' },
    hint: { fontSize: 11, color: tc.textMuted, marginTop: 4 },
    modalFooter: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12 },
    cancelBtn: {
        paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8,
        borderWidth: 1, borderColor: tc.borderColor,
    },
    cancelText: { fontSize: 14, fontWeight: '600', color: tc.textSecondary },
    submitBtn: { borderRadius: 8, overflow: 'hidden' },
    submitGradient: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',height: 48,flex:1, gap: 6,
    },
    submitText: { color: '#fff', fontSize: 14, fontWeight: '600' },
});
