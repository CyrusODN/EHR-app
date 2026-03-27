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

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const FormInput = ({ label, placeholder, required = false, isDropdown = false, hasCalendar = false, multiline = false, value, onChangeText, onPress }: any) => (
    <View style={styles.inputGroup}>
        <View style={styles.labelRow}>
            {required && <Text style={styles.requiredStar}>* </Text>}
            <Text style={styles.inputLabel}>{label}</Text>
        </View>
        <TouchableOpacity 
            activeOpacity={isDropdown || hasCalendar ? 0.7 : 1}
            onPress={(isDropdown || hasCalendar) ? onPress : undefined}
            style={[styles.inputWrapper, multiline && styles.textAreaWrapper]}
        >
            <TextInput 
                style={[styles.textInput, multiline && styles.textArea]}
                placeholder={placeholder}
                placeholderTextColor="#cbd5e1"
                editable={!isDropdown && !hasCalendar}
                multiline={multiline}
                value={value}
                onChangeText={onChangeText}
                pointerEvents={(isDropdown || hasCalendar) ? 'none' : 'auto'}
            />
            {isDropdown && <Feather name="chevron-down" size={16} color="#cbd5e1" />}
            {hasCalendar && <Feather name="calendar" size={16} color="#4A90B9" />}
        </TouchableOpacity>
    </View>
);

const SubmitButton = ({ title, icon, color = ['#68BFB4', '#4DA1C0'], onPress, style, loading = false }: any) => (
    <TouchableOpacity 
        style={[styles.submitButtonContainer, style, loading && { opacity: 0.7 }]} 
        onPress={loading ? undefined : onPress}
    >
        <LinearGradient
            colors={color}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientButton}
        >
            <View style={styles.buttonContent}>
                {loading ? (
                    <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                    <>
                        {icon && <Feather name={icon} size={16} color="#ffffff" style={{ marginRight: 8 }} />}
                        <Text style={styles.submitButtonText}>{title}</Text>
                    </>
                )}
            </View>
        </LinearGradient>
    </TouchableOpacity>
);

const ActionOutlineButton = ({ title, icon, onPress }: any) => (
    <TouchableOpacity style={styles.outlineButton} onPress={onPress}>
        <Feather name={icon} size={16} color="#58a6b8" />
        <Text style={styles.outlineButtonText}>{title}</Text>
    </TouchableOpacity>
);

const Laboratory = ({ patientData, onAlert }: { patientData: any, onAlert?: (type: string, msg: string) => void }) => {
    const { t } = useTranslation();
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
            const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
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
                <ActivityIndicator size="large" color="#4A90B9" />
                <Text style={{ marginTop: 15, color: '#64748b' }}>{t('patientLaboratory.fetchingRecords')}</Text>
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
            <View style={styles.modalOverlay}>
                <View style={[styles.modalContent, { width: '96%' }]}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>{t('patientLaboratory.addLabResults')}</Text>
                        <TouchableOpacity onPress={() => setShowResultsModal(false)}>
                            <Feather name="x" size={20} color="#94a3b8" />
                        </TouchableOpacity>
                    </View>
                    
                    <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
                        <Text style={styles.modalSubheading}>{t('patientLaboratory.basicInformation')}</Text>
                        <View style={styles.row}>
                            <View style={{ flex: 1, marginRight: 8 }}>
                                <FormInput 
                                    label={t('patientLaboratory.testName')} 
                                    required 
                                    placeholder={t('patientLaboratory.testNamePlaceholder')} 
                                    value={newTest.testName}
                                    onChangeText={(val: string) => handleNewTestChange('testName', val)}
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <FormInput 
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
                            <View style={styles.datePickerContainer}>
                                <View style={styles.datePickerHeader}>
                                    <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                                        <Text style={styles.datePickerDone}>{t('patientLaboratory.done')}</Text>
                                    </TouchableOpacity>
                                </View>
                                <DateTimePicker
                                    value={newTest.orderDate || new Date()}
                                    mode="date"
                                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                    onChange={(event, date) => {
                                        if (Platform.OS === 'android') setShowDatePicker(false);
                                        if (date) handleNewTestChange('orderDate', date);
                                    }}
                                />
                            </View>
                        )}

                        <FormInput 
                            label={t('patientLaboratory.labReferenceNumber')} 
                            required 
                            placeholder={t('patientLaboratory.labRefPlaceholder')} 
                            value={newTest.labReferenceNumber}
                            onChangeText={(val: string) => handleNewTestChange('labReferenceNumber', val)}
                        />

                        <View style={styles.parametersHeader}>
                            <Text style={styles.modalSubheading}>{t('patientLaboratory.testParameters')}</Text>
                            <ActionOutlineButton 
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
                                <View key={idx} style={styles.addedParamItem}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.addedParamName}>{p.name}</Text>
                                        <Text style={styles.addedParamDetail}>{p.value} {p.unit} ({p.range})</Text>
                                    </View>
                                    <TouchableOpacity onPress={() => removeParameter(idx)}>
                                        <Feather name="trash-2" size={16} color="#ef4444" />
                                    </TouchableOpacity>
                                </View>
                            ))
                        ) : (
                            <View style={styles.emptyBox}>
                                <Text style={styles.emptyBoxText}>{t('patientLaboratory.noParametersAdded')}</Text>
                            </View>
                        )}
                    </ScrollView>

                    <View style={styles.modalFooter}>
                        <TouchableOpacity 
                            style={styles.cancelOutlineButton} 
                            onPress={() => setShowResultsModal(false)}
                            disabled={isSaving}
                        >
                            <Text style={styles.cancelOutlineText}>{t('patientLaboratory.cancel')}</Text>
                        </TouchableOpacity>
                        <SubmitButton 
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
            <View style={styles.modalOverlay}>
                <View style={[styles.modalContent, { width: '96%' }]}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>{t('patientLaboratory.addParameter')}</Text>
                        <TouchableOpacity onPress={() => setShowParameterModal(false)}>
                            <Feather name="x" size={20} color="#94a3b8" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.row}>
                        <View style={{ flex: 1, marginRight: 8 }}>
                            <FormInput 
                                label={t('patientLaboratory.parameterName')} required placeholder="" 
                                value={tempParameter.name}
                                onChangeText={(val: string) => handleTempParamChange('name', val)}
                            />
                        </View>
                        <View style={{ flex: 1 }}>
                            <FormInput 
                                label={t('patientLaboratory.normalRange')} required placeholder={t('patientLaboratory.normalRangePlaceholder')} 
                                value={tempParameter.range}
                                onChangeText={(val: string) => handleTempParamChange('range', val)}
                            />
                        </View>
                    </View>

                    <View style={styles.row}>
                        <View style={{ flex: 1, marginRight: 8 }}>
                            <FormInput 
                                label={t('patientLaboratory.unit')} required placeholder={t('patientLaboratory.unitPlaceholder')} 
                                value={tempParameter.unit}
                                onChangeText={(val: string) => handleTempParamChange('unit', val)}
                            />
                        </View>
                        <View style={{ flex: 1 }}>
                            <FormInput 
                                label={t('patientLaboratory.value')} required placeholder="" 
                                value={tempParameter.value}
                                onChangeText={(val: string) => handleTempParamChange('value', val)}
                            />
                        </View>
                    </View>

                    <View style={styles.modalFooter}>
                        <TouchableOpacity 
                            style={styles.cancelOutlineButton} 
                            onPress={() => setShowParameterModal(false)}
                        >
                            <Text style={styles.cancelOutlineText}>{t('patientLaboratory.cancel')}</Text>
                        </TouchableOpacity>
                        <SubmitButton title={t('patientLaboratory.addParameter')} icon="plus" onPress={addParameterRecord} style={{ width: 160 }} />
                    </View>

                </View>
            </View>
        </Modal>
    );

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {renderAddResultsModal()}
            
            <View style={styles.card}>
                <TouchableOpacity 
                    style={[styles.header, expanded && styles.expandedHeader]} 
                    onPress={toggleExpand}
                    activeOpacity={0.7}
                >
                    <View style={styles.headerLeft}>
                        <Feather name="test-tube" size={18} color="#58a6b8" style={styles.icon} />
                        <Text style={styles.title}>{t('patientLaboratory.title')}</Text>
                    </View>
                    <Feather name={expanded ? "chevron-up" : "chevron-down"} size={20} color="#94a3b8" />
                </TouchableOpacity>

                {expanded && (
                    <View style={styles.content}>
                        <View style={styles.searchRow}>
                            <View style={styles.searchBar}>
                                <Feather name="search" size={18} color="#94a3b8" />
                                <TextInput 
                                    style={styles.searchInput}
                                    placeholder={t('patientLaboratory.searchPlaceholder')}
                                    value={searchText}
                                    onChangeText={setSearchText}
                                    placeholderTextColor="#94a3b8"
                                />
                            </View>
                            <SubmitButton 
                                title={t('patientLaboratory.addResults')} 
                                icon="plus" 
                                onPress={() => setShowResultsModal(true)}
                                style={styles.addResultsBtn}
                            />
                        </View>

                        {(() => {
                            const filteredResults = labData?.testResults?.filter((result: any) => 
                                (result.testName || '').toLowerCase().includes(searchText.toLowerCase()) ||
                                (result.labReferenceNumber || '').toLowerCase().includes(searchText.toLowerCase())
                            ) || [];

                            return filteredResults.length > 0 ? (
                                filteredResults.map((result: any, index: number) => (
                                    <View key={index} style={styles.resultItem}>
                                        <View style={styles.resultHeader}>
                                            <Text style={styles.resultName}>{result.testName || t('patientLaboratory.laboratoryTest')}</Text>
                                            <View style={styles.resultInfoRow}>
                                                <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 15 }}>
                                                    <Feather name="calendar" size={14} color="#94a3b8" style={{ marginRight: 5 }} />
                                                    <Text style={styles.resultInfoText}>{formatDateDisplay(result.orderDate)}</Text>
                                                </View>
                                                <Text style={styles.resultInfoText}>{t('patientLaboratory.orderNumber')} {result.labReferenceNumber || t('patientInsurance.na')}</Text>
                                            </View>
                                        </View>
                                        
                                        <View style={styles.resultContent}>
                                            {result.parameters?.length > 0 ? (
                                                result.parameters.map((p: any, pIdx: number) => (
                                                    <View key={pIdx} style={[styles.parameterRow, pIdx === result.parameters.length - 1 && { marginBottom: 0 }]}>
                                                        <View style={{ flex: 1 }}>
                                                            <Text style={styles.parameterName}>{p.name}</Text>
                                                            <Text style={styles.parameterRange}>{t('patientLaboratory.normalRangeLabel')} {p.range || p.normalRange || t('patientInsurance.na')}</Text>
                                                        </View>
                                                        <Text style={styles.parameterValue}>{p.value} {p.unit}</Text>
                                                    </View>
                                                ))
                                            ) : (
                                                <Text style={styles.emptyParamsText}>{t('patientLaboratory.noParametersRecorded')}</Text>
                                            )}
                                        </View>
                                    </View>
                                ))
                            ) : (
                                <View style={styles.emptyContainer}>
                                    <Text style={styles.emptyText}>
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

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#f1f5f9',
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
        borderBottomColor: '#f1f5f9',
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
        color: '#1e293b',
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
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 8,
        paddingHorizontal: 12,
        height: 44,
    },
    searchInput: {
        flex: 1,
        marginLeft: 8,
        fontSize: 14,
        color: '#1e293b',
        padding: 0,
    },
    addResultsBtn: {
        flex: 0,
        minWidth: 150,
    },
    emptyContainer: {
        backgroundColor: '#f8fafc',
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 13,
        color: '#94a3b8',
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        zIndex: 1000
    },
    modalContent: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 24,
        maxHeight: '85%',
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
        color: '#1e293b'
    },
    modalSubheading: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1e293b',
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
        color: '#ef4444',
        fontSize: 14
    },
    inputLabel: {
        fontSize: 13,
        color: '#475569',
        fontWeight: '500'
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 8,
        paddingHorizontal: 12,
        height: 44
    },
    textInput: {
        flex: 1,
        fontSize: 14,
        color: '#1e293b',
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
        backgroundColor: '#F8FAFC',
        borderRadius: 8,
        padding: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        marginBottom: 16
    },
    emptyBoxText: {
        color: '#94A3B8',
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
        height: 38,
        paddingHorizontal: 20,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#58a6b8',
        justifyContent: 'center',
        alignItems: 'center'
    },
    cancelOutlineText: {
        color: '#58a6b8',
        fontSize: 14,
        fontWeight: '600'
    },
    submitButtonContainer: {
        height: 38,
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
        borderColor: '#58a6b8',
        borderRadius: 8,
        paddingVertical: 6,
        paddingHorizontal: 12
    },
    outlineButtonText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#58a6b8',
        marginLeft: 6
    },
    resultItem: {
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#f1f5f9',
        borderRadius: 12,
        marginBottom: 16,
        overflow: 'hidden',
    },
    resultHeader: {
        backgroundColor: '#F8FAFC',
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    resultName: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1e293b',
        marginBottom: 4,
    },
    resultInfoRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    resultInfoText: {
        fontSize: 12,
        color: '#94a3b8',
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
        color: '#1e293b',
    },
    parameterRange: {
        fontSize: 12,
        color: '#94a3b8',
        marginTop: 2,
    },
    parameterValue: {
        fontSize: 13,
        fontWeight: '700',
        color: '#1e293b',
    },
    emptyParamsText: {
        fontSize: 12,
        color: '#94a3b8',
        fontStyle: 'italic',
        textAlign: 'center',
    },
    datePickerContainer: {
        backgroundColor: '#f8fafc',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        marginTop: 4,
        marginBottom: 8,
        overflow: 'hidden',
    },
    datePickerHeader: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
        backgroundColor: '#ffffff',
    },
    datePickerDone: {
        fontSize: 14,
        fontWeight: '700',
        color: '#58a6b8',
    },
    addedParamItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#f1f5f9',
        borderRadius: 8,
        padding: 10,
        marginBottom: 8,
    },
    addedParamName: {
        fontSize: 13,
        fontWeight: '700',
        color: '#1e293b',
    },
    addedParamDetail: {
        fontSize: 12,
        color: '#64748b',
        marginTop: 2,
    }
});

export default Laboratory;
