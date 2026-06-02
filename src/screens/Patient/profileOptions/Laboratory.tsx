import React, { useState } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    ScrollView,
    TextInput,
    Modal,
    LayoutAnimation,
    Platform,
    UIManager,
    ActivityIndicator
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import { GetPatientMedicalRecord, UpdatePatientMedicalRecord } from '../../../Services/PatientRecord.Service';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { useMemo } from 'react';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const FormInput = ({ label, placeholder, required = false, isDropdown = false, hasCalendar = false, multiline = false, value, onChangeText, onPress, ds, tc }: any) => (
    <View style={ds.inputGroup}>
        <View style={ds.labelRow}>
            {required && <Text style={ds.requiredStar}>* </Text>}
            <Text style={ds.inputLabel}>{label}</Text>
        </View>
        <TouchableOpacity 
            activeOpacity={isDropdown || hasCalendar ? 0.7 : 1}
            onPress={(isDropdown || hasCalendar) ? onPress : undefined}
            style={[ds.inputWrapper, multiline && ds.textAreaWrapper]}
        >
            <TextInput 
                style={[ds.textInput, multiline && ds.textArea]}
                placeholder={placeholder}
                placeholderTextColor={tc.textMuted}
                editable={!isDropdown && !hasCalendar}
                multiline={multiline}
                value={value}
                onChangeText={onChangeText}
                pointerEvents={(isDropdown || hasCalendar) ? 'none' : 'auto'}
            />
            {isDropdown && <Feather name="chevron-down" size={16} color={tc.textMuted} />}
            {hasCalendar && <Feather name="calendar" size={16} color={tc.accent} />}
        </TouchableOpacity>
    </View>
);

const SubmitButton = ({ title, icon, color, onPress, style, loading = false, ds, tc }: any) => (
    <TouchableOpacity 
        style={[ds.submitButtonContainer, style, loading && { opacity: 0.7 }]} 
        onPress={loading ? undefined : onPress}
    >
        <LinearGradient
            colors={['#4A90B9', '#5BA6B6', '#68BFB3']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={ds.gradientButton}
        >
            <View style={ds.buttonContent}>
                {loading ? (
                    <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                    <>
                        {icon && <Feather name={icon} size={16} color="#ffffff" style={{ marginRight: 8 }} />}
                        <Text style={ds.submitButtonText}>{title}</Text>
                    </>
                )}
            </View>
        </LinearGradient>
    </TouchableOpacity>
);

const ActionOutlineButton = ({ title, icon, onPress, ds, tc }: any) => (
    <TouchableOpacity style={ds.outlineButton} onPress={onPress}>
        <Feather name={icon} size={16} color={tc.accent} />
        <Text style={ds.outlineButtonText}>{title}</Text>
    </TouchableOpacity>
);

const Laboratory = ({ patientData, onAlert }: { patientData: any, onAlert?: (type: string, msg: string) => void }) => {
    const { t } = useTranslation();
    const { colors: tc, isDark } = useThemeColors();
    const ds = useMemo(() => createDynamicStyles(tc, isDark), [tc, isDark]);
    const commonProps = { ds, tc };

    const [labData, setLabData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [expanded, setExpanded] = useState(true);
    const [searchText, setSearchText] = useState('');
    const [showResultsModal, setShowResultsModal] = useState(false);
    const [showParameterModal, setShowParameterModal] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const [newTest, setNewTest] = useState<any>({
        testName: '',
        orderDate: new Date(),
        labReferenceNumber: '',
        parameters: []
    });

    const [tempParameter, setTempParameter] = useState({
        name: '',
        range: '',
        unit: '',
        value: ''
    });

    const formatDateDisplay = (dateVal: any) => {
        if (!dateVal) return '';
        try {
            const date = new Date(dateVal);
            if (isNaN(date.getTime())) return dateVal;
            return date.toLocaleDateString(t('common.dateLocale') || 'en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            });
        } catch (e) { return dateVal; }
    };

    const handleNewTestChange = (field: string, value: any) => {
        setNewTest((prev: any) => ({ ...prev, [field]: value }));
    };

    const handleTempParamChange = (field: string, value: any) => {
        setTempParameter(prev => ({ ...prev, [field]: value }));
    };

    const addParameterRecord = () => {
        if (!tempParameter.name || !tempParameter.value) return;
        setNewTest((prev: any) => ({
            ...prev,
            parameters: [...prev.parameters, { ...tempParameter }]
        }));
        setTempParameter({ name: '', range: '', unit: '', value: '' });
        setShowParameterModal(false);
    };

    const removeParameter = (index: number) => {
        setNewTest((prev: any) => ({
            ...prev,
            parameters: prev.parameters.filter((_: any, i: number) => i !== index)
        }));
    };

    const handleSaveResult = async () => {
        const patientId = patientData?.id || patientData?._id;
        if (!patientId) return;

        if (!newTest.testName || !newTest.labReferenceNumber) {
            if (onAlert) onAlert('error', t('patientLaboratory.enterTestNameRef'));
            return;
        }

        const dateStr = newTest.orderDate instanceof Date 
            ? newTest.orderDate.toISOString().split('T')[0] 
            : new Date().toISOString().split('T')[0];

        const payload = {
            patientId,
            testResults: {
                id: Date.now().toString(),
                name: newTest.testName,
                orderDate: dateStr,
                labReference: newTest.labReferenceNumber,
                parameters: (newTest.parameters || []).map((p: any) => ({
                    id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
                    name: p.name,
                    normalRange: p.range,
                    unit: p.unit,
                    value: p.value,
                    isAbnormal: false
                }))
            }
        };

        console.log("Saving lab result payload:", JSON.stringify(payload, null, 2));
        setIsSaving(true);
        try {
            const res = await UpdatePatientMedicalRecord(payload);
            console.log("Lab result update response:", res);
            if (res) {
                // Success - Close modal first
                setShowResultsModal(false);
                
                // Show Alert in parent
                if (onAlert) onAlert('success', t('patientLaboratory.addSuccess'));
                
                // Reset form
                setNewTest({
                    testName: '',
                    orderDate: new Date(),
                    labReferenceNumber: '',
                    parameters: []
                });
                
                // Refresh data from server to get new list
                const refreshedResponse: any = await GetPatientMedicalRecord(patientId);
                if (refreshedResponse) setLabData(refreshedResponse);
            }
        } catch (error) {
            console.error("Save lab result error:", error);
            if (onAlert) onAlert('error', t('patientLaboratory.addFailed'));
        } finally {
            setIsSaving(false);
        }
    };

    React.useEffect(() => {
        const fetchLabData = async () => {
            try {
                const patientId = patientData?.id || patientData?._id;
                if (!patientId) {
                    setLoading(false);
                    return;
                }
                const response: any = await GetPatientMedicalRecord(patientId);
                if (response) {
                    setLabData(response);
                }
            } catch (error) {
                console.log("Fetch lab data error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLabData();
    }, [patientData]);

    if (loading) {
        return (
            <View style={{ flex: 1, paddingVertical: 40, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator size="large" color={tc.accent} />
                <Text style={{ marginTop: 15, color: tc.textSecondary }}>{t('patientLaboratory.fetchingRecords')}</Text>
            </View>
        );
    }

    const toggleExpand = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded(!expanded);
    };

    const renderAddResultsModal = () => (
        <Modal 
            visible={showResultsModal} 
            transparent 
            animationType="fade" 
            onRequestClose={() => setShowResultsModal(false)}
        >
            <View style={ds.modalOverlay}>
                <View style={[ds.modalContent, { width: '96%' }]}>
                    <View style={ds.modalHeader}>
                        <Text style={ds.modalTitle}>{t('patientLaboratory.addLabResults')}</Text>
                        <TouchableOpacity onPress={() => setShowResultsModal(false)}>
                            <Feather name="x" size={20} color={tc.textMuted} />
                        </TouchableOpacity>
                    </View>
                    
                    <ScrollView style={ds.modalScroll} showsVerticalScrollIndicator={false}>
                        <Text style={ds.modalSubheading}>{t('patientLaboratory.basicInformation')}</Text>
                        <View style={ds.row}>
                            <View style={{ flex: 1, marginRight: 8 }}>
                                <FormInput 
                                    {...commonProps}
                                    label={t('patientLaboratory.testName')} 
                                    required 
                                    placeholder={t('patientLaboratory.testNamePlaceholder')} 
                                    value={newTest.testName}
                                    onChangeText={(val: string) => handleNewTestChange('testName', val)}
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <FormInput 
                                    {...commonProps}
                                    label={t('patientLaboratory.orderDate')} 
                                    required 
                                    placeholder={t('patientLaboratory.selectDate')} 
                                    hasCalendar 
                                    isDropdown 
                                    value={formatDateDisplay(newTest.orderDate)}
                                    onPress={() => setShowDatePicker(true)}
                                />
                            </View>
                        </View>
                        
                        {showDatePicker && (
                            <View style={ds.datePickerContainer}>
                                <View style={ds.datePickerHeader}>
                                    <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                                        <Text style={ds.datePickerDone}>{t('patientLaboratory.done')}</Text>
                                    </TouchableOpacity>
                                </View>
                                <DateTimePicker
                                    value={newTest.orderDate || new Date()}
                                    mode="date"
                                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                    textColor={tc.textPrimary}
                                    onChange={(event, date) => {
                                        if (Platform.OS === 'android') setShowDatePicker(false);
                                        if (date) handleNewTestChange('orderDate', date);
                                    }}
                                />
                            </View>
                        )}

                        <FormInput 
                            {...commonProps}
                            label={t('patientLaboratory.labReferenceNumber')} 
                            required 
                            placeholder={t('patientLaboratory.labRefPlaceholder')} 
                            value={newTest.labReferenceNumber}
                            onChangeText={(val: string) => handleNewTestChange('labReferenceNumber', val)}
                        />

                        <View style={ds.parametersHeader}>
                            <Text style={ds.modalSubheading}>{t('patientLaboratory.testParameters')}</Text>
                            <ActionOutlineButton 
                                {...commonProps}
                                title={t('patientLaboratory.addParameter')} 
                                icon="plus" 
                                onPress={() => {
                                    setTempParameter({ name: '', range: '', unit: '', value: '' });
                                    setShowParameterModal(true);
                                }} 
                            />
                        </View>

                        {newTest.parameters?.length > 0 ? (
                            newTest.parameters.map((p: any, idx: number) => (
                                <View key={idx} style={ds.addedParamItem}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={ds.addedParamName}>{p.name}</Text>
                                        <Text style={ds.addedParamDetail}>{p.value} {p.unit} ({p.range})</Text>
                                    </View>
                                    <TouchableOpacity onPress={() => removeParameter(idx)}>
                                        <Feather name="trash-2" size={16} color={tc.accentRed} />
                                    </TouchableOpacity>
                                </View>
                            ))
                        ) : (
                            <View style={ds.emptyBox}>
                                <Text style={ds.emptyBoxText}>{t('patientLaboratory.noParametersAdded')}</Text>
                            </View>
                        )}
                    </ScrollView>

                    <View style={ds.modalFooter}>
                        <TouchableOpacity 
                            style={ds.cancelOutlineButton} 
                            onPress={() => setShowResultsModal(false)}
                            disabled={isSaving}
                        >
                            <Text style={ds.cancelOutlineText}>{t('patientLaboratory.cancel')}</Text>
                        </TouchableOpacity>
                        <SubmitButton 
                            {...commonProps}
                            title={t('patientLaboratory.addResult')} 
                            icon="plus" 
                            style={{ width: 150 }} 
                            onPress={handleSaveResult}
                            loading={isSaving}
                        />
                    </View>
                    
                    {renderAddParameterModal()}
                </View>
            </View>
        </Modal>
    );

    const renderAddParameterModal = () => (
        <Modal 
            visible={showParameterModal} 
            transparent 
            animationType="fade" 
            onRequestClose={() => setShowParameterModal(false)}
        >
            <View style={ds.modalOverlay}>
                <View style={[ds.modalContent, { width: '96%' }]}>
                    <View style={ds.modalHeader}>
                        <Text style={ds.modalTitle}>{t('patientLaboratory.addParameter')}</Text>
                        <TouchableOpacity onPress={() => setShowParameterModal(false)}>
                            <Feather name="x" size={20} color={tc.textMuted} />
                        </TouchableOpacity>
                    </View>

                    <View style={ds.row}>
                        <View style={{ flex: 1, marginRight: 8 }}>
                            <FormInput 
                                {...commonProps}
                                label={t('patientLaboratory.parameterName')} required placeholder="" 
                                value={tempParameter.name}
                                onChangeText={(val: string) => handleTempParamChange('name', val)}
                            />
                        </View>
                        <View style={{ flex: 1 }}>
                            <FormInput 
                                {...commonProps}
                                label={t('patientLaboratory.normalRange')} required placeholder={t('patientLaboratory.normalRangePlaceholder')} 
                                value={tempParameter.range}
                                onChangeText={(val: string) => handleTempParamChange('range', val)}
                            />
                        </View>
                    </View>

                    <View style={ds.row}>
                        <View style={{ flex: 1, marginRight: 8 }}>
                            <FormInput 
                                {...commonProps}
                                label={t('patientLaboratory.unit')} required placeholder={t('patientLaboratory.unitPlaceholder')} 
                                value={tempParameter.unit}
                                onChangeText={(val: string) => handleTempParamChange('unit', val)}
                            />
                        </View>
                        <View style={{ flex: 1 }}>
                            <FormInput 
                                {...commonProps}
                                label={t('patientLaboratory.value')} required placeholder="" 
                                value={tempParameter.value}
                                onChangeText={(val: string) => handleTempParamChange('value', val)}
                            />
                        </View>
                    </View>

                    <View style={ds.modalFooter}>
                        <TouchableOpacity 
                            style={ds.cancelOutlineButton} 
                            onPress={() => setShowParameterModal(false)}
                        >
                            <Text style={ds.cancelOutlineText}>{t('patientLaboratory.cancel')}</Text>
                        </TouchableOpacity>
                        <SubmitButton {...commonProps} title={t('patientLaboratory.addParameter')} icon="plus" onPress={addParameterRecord} style={{ width: 160 }} />
                    </View>

                </View>
            </View>
        </Modal>
    );

    return (
        <ScrollView style={ds.container} showsVerticalScrollIndicator={false}>
            {renderAddResultsModal()}
            
            <View style={ds.card}>
                <TouchableOpacity 
                    style={[ds.header, expanded && ds.expandedHeader]} 
                    onPress={toggleExpand}
                    activeOpacity={0.7}
                >
                    <View style={ds.headerLeft}>
                        <Feather name="test-tube" size={18} color={tc.accent} style={ds.icon} />
                        <Text style={ds.title}>{t('patientLaboratory.title')}</Text>
                    </View>
                    <Feather name={expanded ? "chevron-up" : "chevron-down"} size={20} color={tc.textMuted} />
                </TouchableOpacity>

                {expanded && (
                    <View style={ds.content}>
                        <View style={ds.searchRow}>
                            <View style={ds.searchBar}>
                                <Feather name="search" size={18} color={tc.textMuted} />
                                <TextInput 
                                    style={ds.searchInput}
                                    placeholder={t('patientLaboratory.searchPlaceholder')}
                                    value={searchText}
                                    onChangeText={setSearchText}
                                    placeholderTextColor={tc.textMuted}
                                />
                            </View>
                            <SubmitButton 
                                {...commonProps}
                                title={t('patientLaboratory.addResults')} 
                                icon="plus" 
                                onPress={() => setShowResultsModal(true)}
                                style={ds.addResultsBtn}
                            />
                        </View>

                        {(() => {
                            const filteredResults = labData?.testResults?.filter((result: any) => 
                                (result.testName || '').toLowerCase().includes(searchText.toLowerCase()) ||
                                (result.labReferenceNumber || '').toLowerCase().includes(searchText.toLowerCase())
                            ) || [];

                            return filteredResults.length > 0 ? (
                                filteredResults.map((result: any, index: number) => (
                                    <View key={index} style={ds.resultItem}>
                                        <View style={ds.resultHeader}>
                                            <Text style={ds.resultName}>{result.testName || t('patientLaboratory.laboratoryTest')}</Text>
                                            <View style={ds.resultInfoRow}>
                                                <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 15 }}>
                                                    <Feather name="calendar" size={14} color={tc.textMuted} style={{ marginRight: 5 }} />
                                                    <Text style={ds.resultInfoText}>{formatDateDisplay(result.orderDate)}</Text>
                                                </View>
                                                <Text style={ds.resultInfoText}>{t('patientLaboratory.orderNumber')} {result.labReferenceNumber || t('patientInsurance.na')}</Text>
                                            </View>
                                        </View>
                                        
                                        <View style={ds.resultContent}>
                                            {result.parameters?.length > 0 ? (
                                                result.parameters.map((p: any, pIdx: number) => (
                                                    <View key={pIdx} style={[ds.parameterRow, pIdx === result.parameters.length - 1 && { marginBottom: 0 }]}>
                                                        <View style={{ flex: 1 }}>
                                                            <Text style={ds.parameterName}>{p.name}</Text>
                                                            <Text style={ds.parameterRange}>{t('patientLaboratory.normalRangeLabel')} {p.range || p.normalRange || t('patientInsurance.na')}</Text>
                                                        </View>
                                                        <Text style={ds.parameterValue}>{p.value} {p.unit}</Text>
                                                    </View>
                                                ))
                                            ) : (
                                                <Text style={ds.emptyParamsText}>{t('patientLaboratory.noParametersRecorded')}</Text>
                                            )}
                                        </View>
                                    </View>
                                ))
                            ) : (
                                <View style={ds.emptyContainer}>
                                    <Text style={ds.emptyText}>
                                        {searchText ? t('patientLaboratory.noSearchMatch') : t('patientLaboratory.noLabResults')}
                                    </Text>
                                </View>
                            );
                        })()}
                    </View>
                )}
            </View>
        </ScrollView>
    );
};

export default Laboratory;

const createDynamicStyles = (tc: any, isDark: boolean) => StyleSheet.create({
    container: {
        paddingHorizontal: 16,
    },
    card: {
        backgroundColor: tc.cardBackground,
        borderRadius: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: tc.borderColor,
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    expandedHeader: {
        borderBottomWidth: 1,
        borderBottomColor: tc.borderColor,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginRight: 10,
    },
    title: {
        fontSize: 14,
        fontWeight: '700',
        color: tc.textPrimary,
        letterSpacing: 0.5,
    },
    content: {
        padding: 16,
    },
    searchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        gap: 12,
    },
    searchBar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: tc.inputBackground,
        borderWidth: 1,
        borderColor: tc.borderColor,
        borderRadius: 8,
        paddingHorizontal: 12,
        height: 44,
    },
    searchInput: {
        flex: 1,
        marginLeft: 8,
        fontSize: 14,
        color: tc.textPrimary,
        padding: 0,
    },
    addResultsBtn: {
        flex: 0,
        minWidth: 150,
    },
    emptyContainer: {
        backgroundColor: tc.cardBackgroundAlt || (isDark ? 'rgba(255,255,255,0.05)' : '#f8fafc'),
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 13,
        color: tc.textMuted,
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        zIndex: 1000
    },
    modalContent: {
        backgroundColor: tc.modalBg,
        borderRadius: 12,
        padding: 24,
        maxHeight: '85%',
        borderWidth: isDark ? 1 : 0,
        borderColor: tc.borderColor,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: tc.textPrimary
    },
    modalSubheading: {
        fontSize: 14,
        fontWeight: '600',
        color: tc.textPrimary,
        marginBottom: 12,
    },
    modalScroll: {
        marginBottom: 16,
    },
    inputGroup: {
        marginBottom: 16
    },
    labelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6
    },
    requiredStar: {
        color: tc.accentRed,
        fontSize: 14
    },
    inputLabel: {
        fontSize: 13,
        color: tc.textSecondary,
        fontWeight: '500'
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: tc.borderColor,
        borderRadius: 8,
        paddingHorizontal: 12,
        height: 48,
        backgroundColor: tc.inputBackground,
    },
    textInput: {
        flex: 1,
        fontSize: 14,
        color: tc.textPrimary,
        padding: 0
    },
    textAreaWrapper: {
        height: 100,
        alignItems: 'flex-start',
        paddingTop: 12
    },
    textArea: {
        textAlignVertical: 'top'
    },
    row: {
        flexDirection: 'row'
    },
    parametersHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 12,
    },
    emptyBox: {
        backgroundColor: tc.cardBackgroundAlt || (isDark ? 'rgba(255,255,255,0.05)' : '#F8FAFC'),
        borderRadius: 8,
        padding: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: tc.borderColor,
        marginBottom: 16
    },
    emptyBoxText: {
        color: tc.textMuted,
        fontSize: 13,
        textAlign: 'center'
    },
    modalFooter: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 12,
        marginTop: 8
    },
    cancelOutlineButton: {
        height: 40,
        paddingHorizontal: 20,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: tc.borderColor,
        backgroundColor: isDark ? tc.buttonMutedBg : 'transparent',
        justifyContent: 'center',
        alignItems: 'center'
    },
    cancelOutlineText: {
        color: tc.textSecondary,
        fontSize: 14,
        fontWeight: '600'
    },
    submitButtonContainer: {
        height: 40,
        borderRadius: 8,
        overflow: 'hidden'
    },
    gradientButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        paddingHorizontal: 16,
    },
    submitButtonText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center'
    },
    outlineButton: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: tc.accent,
        backgroundColor: isDark ? tc.buttonMutedBg : 'transparent',
        borderRadius: 8,
        paddingVertical: 6,
        paddingHorizontal: 12
    },
    outlineButtonText: {
        fontSize: 13,
        fontWeight: '600',
        color: tc.accent,
        marginLeft: 6
    },
    resultItem: {
        backgroundColor: tc.cardBackground,
        borderWidth: 1,
        borderColor: tc.borderColor,
        borderRadius: 12,
        marginBottom: 16,
        overflow: 'hidden',
    },
    resultHeader: {
        backgroundColor: tc.cardBackgroundAlt || (isDark ? 'rgba(255,255,255,0.03)' : '#F8FAFC'),
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: tc.borderColor,
    },
    resultName: {
        fontSize: 14,
        fontWeight: '700',
        color: tc.textPrimary,
        marginBottom: 4,
    },
    resultInfoRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    resultInfoText: {
        fontSize: 12,
        color: tc.textMuted,
    },
    resultContent: {
        padding: 12,
    },
    parameterRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    parameterName: {
        fontSize: 13,
        fontWeight: '700',
        color: tc.textPrimary,
    },
    parameterRange: {
        fontSize: 12,
        color: tc.textMuted,
        marginTop: 2,
    },
    parameterValue: {
        fontSize: 13,
        fontWeight: '700',
        color: tc.textPrimary,
    },
    emptyParamsText: {
        fontSize: 12,
        color: tc.textMuted,
        fontStyle: 'italic',
        textAlign: 'center',
    },
    datePickerContainer: {
        backgroundColor: isDark ? tc.modalBg : tc.cardBackground,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: tc.borderColor,
        marginTop: 4,
        marginBottom: 16,
        overflow: 'hidden',
    },
    datePickerHeader: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        padding: 10,
        backgroundColor: tc.cardBackgroundAlt || (isDark ? 'rgba(255,255,255,0.05)' : '#f8fafc'),
        borderBottomWidth: 1,
        borderBottomColor: tc.borderColor,
    },
    datePickerDone: {
        fontSize: 14,
        fontWeight: '700',
        color: tc.accent,
    },
    addedParamItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: tc.cardBackgroundAlt || (isDark ? 'rgba(255,255,255,0.05)' : '#f8fafc'),
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: tc.borderColor,
    },
    addedParamName: {
        fontSize: 13,
        fontWeight: '600',
        color: tc.textPrimary,
    },
    addedParamDetail: {
        fontSize: 12,
        color: tc.textSecondary,
        marginTop: 2,
    },
});
