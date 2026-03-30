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
import DocumentPicker from 'react-native-document-picker';
import { GetPatientMedicalRecord, UpdatePatientMedicalRecord } from '../../../Services/PatientRecord.Service';
import { uploadFileOnServer } from '../../../Services/Upload.Service';
import userStore from '../../../store/user';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { useMemo } from 'react';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const FormInput = ({ label, placeholder, required = false, isDropdown = false, multiline = false, ds, tc }: any) => (
    <View style={ds.inputGroup}>
        <View style={ds.labelRow}>
            {required && <Text style={ds.requiredStar}>* </Text>}
            <Text style={ds.inputLabel}>{label}</Text>
        </View>
        <View style={[ds.inputWrapper, multiline && ds.textAreaWrapper]}>
            <TextInput 
                style={[ds.textInput, multiline && ds.textArea]}
                placeholder={placeholder}
                placeholderTextColor={tc.textMuted}
                editable={!isDropdown}
                multiline={multiline}
            />
            {isDropdown && <Feather name="chevron-down" size={16} color={tc.textMuted} />}
        </View>
    </View>
);

const SubmitButton = ({ title, icon, color, onPress, style, disabled = false, loading = false, ds, tc }: any) => (
    <TouchableOpacity 
        style={[ds.submitButtonContainer, style, disabled && ds.disabledButton, loading && { opacity: 0.7 }]} 
        onPress={disabled || loading ? undefined : onPress}
        disabled={disabled || loading}
    >
        <LinearGradient
            colors={disabled ? [tc.buttonDisabledBg || '#B0B0B0', tc.buttonDisabledBgAlt || '#D3D3D3'] : ['#4A90B9', '#5BA6B6', '#68BFB3']}
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
                        <Text style={[ds.submitButtonText, disabled && ds.disabledButtonText]}>{title}</Text>
                    </>
                )}
            </View>
        </LinearGradient>
    </TouchableOpacity>
);

const Documents = ({ patientData, onAlert }: { patientData: any, onAlert: any }) => {
    const { t } = useTranslation();
    const { colors: tc, isDark } = useThemeColors();
    const ds = useMemo(() => createDynamicStyles(tc, isDark), [tc, isDark]);
    const commonProps = { ds, tc };
    const [docData, setDocData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState(true);
    const [searchText, setSearchText] = useState('');
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    
    // Upload state
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedFile, setSelectedFile] = useState<any>(null);
    const [description, setDescription] = useState('');
    const [queuedDocs, setQueuedDocs] = useState<any[]>([]);
    const [isUploading, setIsUploading] = useState(false);

    const fetchDocData = async () => {
        try {
            const patientId = patientData?.id || patientData?._id;
            if (!patientId) {
                setLoading(false);
                return;
            }
            const response: any = await GetPatientMedicalRecord(patientId);
            if (response) {
                setDocData(response);
            }
        } catch (error) {
            console.log("Fetch doc data error:", error);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchDocData();
    }, [patientData]);

    const toggleExpand = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded(!expanded);
    };

    const handlePickDocument = async () => {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles],
            });
            setSelectedFile(res[0]);
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                // User cancelled the picker
            } else {
                throw err;
            }
        }
    };

    const addToQueue = () => {
        if (!selectedFile || !selectedCategory) {
            onAlert('warning', t('patientDocuments.selectFileCategory'));
            return;
        }
        
        const newDoc = {
            file: selectedFile,
            category: selectedCategory,
            description: description,
            id: Date.now().toString()
        };
        
        setQueuedDocs([...queuedDocs, newDoc]);
        setSelectedFile(null);
        setDescription('');
    };

    const removeFromQueue = (id: string) => {
        setQueuedDocs(queuedDocs.filter(doc => doc.id !== id));
    };

    const handleUploadAll = async () => {
        if (queuedDocs.length === 0) return;
        
        const loggedInUser: any = userStore.getState().loggedInUser;
        const authorName = loggedInUser?.name || `${loggedInUser?.firstName || ''} ${loggedInUser?.lastName || ''}`.trim() || "System";

        setIsUploading(true);
        try {
            const uploadedDocs = [];
            console.log("Documents.tsx: Starting upload process for", queuedDocs.length, "documents");
            
            for (const doc of queuedDocs) {
                console.log("Documents.tsx: Uploading file:", doc.file.name);
                const uploadRes: any = await uploadFileOnServer(doc.file);
                console.log("Documents.tsx: Upload service raw response:", JSON.stringify(uploadRes, null, 2));
                
                // Handle different response formats (object or array)
                const fileData = Array.isArray(uploadRes) ? uploadRes[0] : uploadRes;
                
                if (fileData && fileData.url) {
                    console.log("Documents.tsx: File uploaded successfully, URL:", fileData.url);
                    uploadedDocs.push({
                        url: fileData.url,
                        title: doc.file.name,
                        tags: [doc.category.toLowerCase()],
                        description: doc.description,
                        author: authorName,
                        date: new Date().toISOString(),
                        patientId: patientData?.id || patientData?._id
                    });
                } else {
                    console.warn("Documents.tsx: Upload succeeded but no URL found in response for", doc.file.name);
                }
            }

            if (uploadedDocs.length === 0) {
                throw new Error("No documents were successfully uploaded to the server.");
            }

            const existingDocs = docData?.documents || docData?.medicalDocuments || [];
            const payload = {
                patientId: patientData?.id || patientData?._id,
                documents: [...existingDocs, ...uploadedDocs]
            };

            console.log("Documents.tsx: Updating patient record with payload:", JSON.stringify(payload, null, 2));
            const updateRes: any = await UpdatePatientMedicalRecord(payload);
            console.log("Documents.tsx: Medical record update response:", JSON.stringify(updateRes, null, 2));
            
            // The interceptor might return response.data.data which could be a string on success
            const isSuccess = updateRes && (
                updateRes.success === true || 
                updateRes.data || 
                (typeof updateRes === 'string' && updateRes.includes('successfully'))
            );

            if (isSuccess) {
                console.log("Documents.tsx: Success confirmed! Closing modal and refreshing.");
                setShowUploadModal(false);
                onAlert('success', t('patientDocuments.uploadSuccess'));
                setQueuedDocs([]);
                fetchDocData(); // Refresh data
            } else {
                console.warn("Documents.tsx: Server returned success:false or missing status");
                onAlert('error', updateRes?.message || t('patientDocuments.uploadFailed'));
            }
        } catch (error: any) {
            console.error("Documents.tsx: Critical error in handleUploadAll:", error);
            onAlert('error', error?.message || t('patientDocuments.uploadError'));
        } finally {
            console.log("Documents.tsx: Process finished, setting loading to false");
            setIsUploading(false);
        }
    };

    if (loading) {
        return (
            <View style={{ flex: 1, paddingVertical: 40, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator size="large" color={tc.accent} />
                <Text style={{ marginTop: 15, color: tc.textSecondary }}>{t('patientDocuments.fetchingDocuments')}</Text>
            </View>
        );
    }

    const renderUploadModal = () => (
        <Modal 
            visible={showUploadModal} 
            transparent 
            animationType="fade" 
            onRequestClose={() => setShowUploadModal(false)}
        >
            <View style={ds.modalOverlay}>
                <View style={ds.modalContent}>
                    <View style={ds.modalHeader}>
                        <Text style={ds.modalTitle}>{t('patientDocuments.uploadTitle')}</Text>
                        <TouchableOpacity onPress={() => setShowUploadModal(false)}>
                            <Feather name="x" size={20} color={tc.textMuted} />
                        </TouchableOpacity>
                    </View>
                    
                    <ScrollView style={ds.modalScroll} showsVerticalScrollIndicator={false}>
                        <View style={ds.inputGroup}>
                            <View style={ds.labelRow}>
                                <Text style={ds.requiredStar}>* </Text>
                                <Text style={ds.inputLabel}>{t('patientDocuments.documentCategory')}</Text>
                            </View>
                            <TouchableOpacity 
                                style={[ds.inputWrapper, showCategoryDropdown && ds.dropdownActive]} 
                                onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
                            >
                                <Text style={[ds.textInput, !selectedCategory && { color: tc.textMuted }]}>
                                    {selectedCategory || t('patientDocuments.selectCategory')}
                                </Text>
                                <Feather name="chevron-down" size={16} color={tc.textMuted} />
                            </TouchableOpacity>
                            
                            {showCategoryDropdown && (
                                <View style={ds.dropdownOptionsContainer}>
                                    <TouchableOpacity 
                                        style={ds.dropdownOption} 
                                        onPress={() => {
                                            setSelectedCategory('Laboratory Results');
                                            setShowCategoryDropdown(false);
                                        }}
                                    >
                                        <Text style={ds.dropdownOptionText}>{t('patientDocuments.categoryLabResults')}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        style={ds.dropdownOption}
                                        onPress={() => {
                                            setSelectedCategory('Informed Consent');
                                            setShowCategoryDropdown(false);
                                        }}
                                    >
                                        <Text style={ds.dropdownOptionText}>{t('patientDocuments.categoryInformedConsent')}</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                        
                        <Text style={ds.inputLabel}>{t('patientDocuments.documentFile')}</Text>
                        <TouchableOpacity style={ds.uploadArea} onPress={handlePickDocument}>
                            <View style={ds.uploadIconContainer}>
                                <Feather name="inbox" size={32} color={tc.accent} />
                            </View>
                            <Text style={ds.uploadMainText}>{t('patientDocuments.uploadAreaText')}</Text>
                            <Text style={ds.uploadSubText}>
                                {t('patientDocuments.uploadAreaSubText')}
                            </Text>
                        </TouchableOpacity>

                        {selectedFile && (
                            <View style={ds.selectedFilePreview}>
                                <Feather name="paperclip" size={16} color={tc.textSecondary} />
                                <Text style={ds.selectedFileName}>{selectedFile.name}</Text>
                            </View>
                        )}

                        <View style={ds.inputGroup}>
                            <Text style={ds.inputLabel}>{t('patientDocuments.description')}</Text>
                            <View style={[ds.inputWrapper, ds.textAreaWrapper]}>
                                <TextInput 
                                    style={[ds.textInput, ds.textArea]}
                                    placeholder={t('patientDocuments.descriptionPlaceholder')}
                                    placeholderTextColor={tc.textMuted}
                                    multiline
                                    value={description}
                                    onChangeText={setDescription}
                                />
                            </View>
                        </View>
                        
                        <TouchableOpacity 
                            style={ds.dashedAddButton} 
                            onPress={addToQueue}
                        >
                            <Feather name="plus" size={16} color={tc.textMuted} />
                            <Text style={ds.dashedAddText}>{t('patientDocuments.addDocument')}</Text>
                        </TouchableOpacity>

                        {queuedDocs.length > 0 && (
                            <View style={ds.queueContainer}>
                                <View style={ds.queueHeaderRow}>
                                    <View style={ds.queueHeaderLine} />
                                    <Text style={ds.queueHeaderText}>{t('patientDocuments.documentsToUpload')}</Text>
                                    <View style={ds.queueHeaderLine} />
                                </View>
                                {queuedDocs.map((item) => (
                                    <View key={item.id} style={ds.queuedItem}>
                                        <View style={ds.queuedItemInfo}>
                                            <Text style={ds.queuedItemName}>{item.file.name}</Text>
                                            <Text style={ds.queuedItemCategory}>{item.category}</Text>
                                            <Text style={ds.queuedItemDescription}>{item.description}</Text>
                                        </View>
                                        <View style={ds.queuedItemActions}>
                                            <TouchableOpacity style={ds.queuedActionBtn}>
                                                <Feather name="edit-2" size={16} color={tc.textSecondary} />
                                            </TouchableOpacity>
                                            <TouchableOpacity 
                                                style={ds.queuedActionBtn}
                                                onPress={() => removeFromQueue(item.id)}
                                            >
                                                <Feather name="trash-2" size={16} color={tc.accentRed || '#ef4444'} />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        )}
                    </ScrollView>

                    <View style={ds.modalFooter}>
                        <TouchableOpacity 
                            style={ds.cancelOutlineButton} 
                            onPress={() => {
                                setShowUploadModal(false);
                                setQueuedDocs([]);
                            }}
                        >
                            <Text style={ds.cancelOutlineText}>{t('patientDocuments.cancel')}</Text>
                        </TouchableOpacity>
                        <SubmitButton 
                            {...commonProps}
                            title={t('patientDocuments.uploadDocuments')} 
                            disabled={queuedDocs.length === 0} 
                            onPress={handleUploadAll}
                            loading={isUploading}
                            style={{ width: 140 }} 
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );

    return (
        <ScrollView style={ds.container} showsVerticalScrollIndicator={false}>
            {renderUploadModal()}
            
            <View style={ds.card}>
                <TouchableOpacity 
                    style={[ds.header, expanded && ds.expandedHeader]} 
                    onPress={toggleExpand}
                    activeOpacity={0.7}
                >
                    <View style={ds.headerLeft}>
                        <Feather name="file-text" size={18} color={tc.accent} style={ds.icon} />
                        <Text style={ds.title}>{t('patientDocuments.title')}</Text>
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
                                    placeholder={t('patientDocuments.searchPlaceholder')}
                                    placeholderTextColor={tc.textMuted}
                                    value={searchText}
                                    onChangeText={setSearchText}
                                />
                            </View>
                            <SubmitButton 
                                {...commonProps}
                                title={t('patientDocuments.newDocument')} 
                                icon="plus" 
                                onPress={() => setShowUploadModal(true)}
                                style={ds.newDocBtn}
                            />
                        </View>

                        {(() => {
                            const filteredDocs = (docData?.documents || docData?.medicalDocuments || [])?.filter((doc: any) => 
                                (doc.name || doc.fileName || doc.title || '').toLowerCase().includes(searchText.toLowerCase()) ||
                                (doc.category || (doc.tags && doc.tags[0]) || '').toLowerCase().includes(searchText.toLowerCase())
                            ) || [];

                            return filteredDocs.length > 0 ? (
                                filteredDocs.map((doc: any, index: number) => (
                                    <View key={index} style={ds.docItem}>
                                        <View style={ds.docItemTop}>
                                            <View style={ds.docIconCircle}>
                                                <Feather name="file-text" size={18} color={tc.accent} />
                                            </View>
                                            <View style={{ flex: 1, marginLeft: 12 }}>
                                                <Text style={ds.docName}>{doc.title || doc.name || doc.fileName || t('patientDocuments.untitledDocument')}</Text>
                                                <View style={ds.docSubMeta}>
                                                    <View style={ds.metaItem}>
                                                        <Feather name="calendar" size={12} color={tc.textMuted} />
                                                        <Text style={ds.docMetaText}>
                                                            {doc.date ? new Date(doc.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : t('patientDocuments.noDate')}
                                                        </Text>
                                                    </View>
                                                    <Text style={ds.docMetaText}>  {t('patientDocuments.author')} {doc.author || t('patientDocuments.system')}</Text>
                                                </View>
                                            </View>
                                            <TouchableOpacity style={ds.viewBtn}>
                                                <Feather name="eye" size={18} color={tc.accent} />
                                            </TouchableOpacity>
                                        </View>
                                        
                                        <View style={ds.docItemBottom}>
                                            <Text style={ds.docDescription} numberOfLines={2}>
                                                {doc.description || t('patientDocuments.noDescription')}
                                            </Text>
                                            <View style={ds.tagContainer}>
                                                {((doc.tags || [doc.category]) || ['General']).map((tag: string, tid: number) => (
                                                    <View key={tid} style={ds.tagPill}>
                                                        <Text style={ds.tagText}>{tag}</Text>
                                                    </View>
                                                ))}
                                            </View>
                                        </View>
                                    </View>
                                ))
                            ) : (
                                <View style={ds.emptyContainer}>
                                    <Text style={ds.emptyText}>
                                        {searchText ? t('patientDocuments.noSearchMatch') : t('patientDocuments.noDocuments')}
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

export default Documents;

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
        fontSize: 13,
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
    newDocBtn: {
        flex: 0,
        minWidth: 145,
        height: 44,
    },
    emptyContainer: {
        backgroundColor: tc.cardBackgroundAlt || (isDark ? 'rgba(255,255,255,0.05)' : '#f8fafc'),
        borderRadius: 8,
        padding: 16,
        alignItems: 'flex-start',
    },
    emptyText: {
        fontSize: 13,
        color: tc.textMuted,
        fontWeight: '500',
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    modalContent: {
        backgroundColor: tc.modalBg,
        borderRadius: 12,
        padding: 24,
        width: '95%',
        maxHeight: '90%',
        borderWidth: isDark ? 1 : 0,
        borderColor: tc.borderColor,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: tc.textPrimary
    },
    modalScroll: {
        marginBottom: 16,
    },
    inputGroup: {
        marginBottom: 20
    },
    labelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8
    },
    requiredStar: {
        color: tc.accentRed || '#ef4444',
        fontSize: 14
    },
    inputLabel: {
        fontSize: 13,
        color: tc.textPrimary,
        fontWeight: '600',
        marginBottom: 8
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: tc.borderColor,
        borderRadius: 8,
        paddingHorizontal: 12,
        height: 44,
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
    uploadArea: {
        borderWidth: 1,
        borderColor: tc.accent,
        borderStyle: 'dashed',
        borderRadius: 12,
        padding: 30,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: tc.cardBackgroundAlt || (isDark ? 'rgba(255,255,255,0.05)' : '#f8fafc'),
        marginBottom: 20
    },
    uploadIconContainer: {
        marginBottom: 12
    },
    uploadMainText: {
        fontSize: 14,
        fontWeight: '600',
        color: tc.textPrimary,
        textAlign: 'center',
        marginBottom: 4
    },
    uploadSubText: {
        fontSize: 12,
        color: tc.textMuted,
        textAlign: 'center'
    },
    dashedAddButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: tc.borderColor,
        borderStyle: 'dashed',
        borderRadius: 8,
        paddingVertical: 10,
        marginBottom: 10
    },
    dashedAddText: {
        fontSize: 13,
        color: tc.textMuted,
        marginLeft: 6
    },
    modalFooter: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 12,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: tc.borderColor,
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
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        width: '100%',
    },
    gradientButton: {
        flex: 1,
    },
    submitButtonText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '600'
    },
    disabledButton: {
        opacity: 0.5
    },
    disabledButtonText: {
        color: '#94a3b8'
    },
    dropdownActive: {
        borderColor: tc.accent,
    },
    dropdownOptionsContainer: {
        backgroundColor: tc.cardBackground,
        borderWidth: 1,
        borderColor: tc.borderColor,
        borderRadius: 8,
        marginTop: 4,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    dropdownOption: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: tc.borderColor,
    },
    dropdownOptionText: {
        fontSize: 14,
        color: tc.textPrimary,
        fontWeight: '500',
    },
    docItem: {
        backgroundColor: tc.cardBackground,
        borderWidth: 1,
        borderColor: tc.borderColor,
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
    },
    docIconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#f0f9f8',
        justifyContent: 'center',
        alignItems: 'center',
    },
    docName: {
        fontSize: 14,
        fontWeight: '700',
        color: tc.textPrimary,
    },
    docMeta: {
        fontSize: 12,
        color: tc.textMuted,
        marginTop: 2,
    },
    downloadBtn: {
        padding: 8,
    },
    selectedFilePreview: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: tc.cardBackgroundAlt || (isDark ? 'rgba(100,116,139,0.1)' : '#f1f5f9'),
        padding: 10,
        borderRadius: 8,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: tc.borderColor,
    },
    selectedFileName: {
        fontSize: 13,
        color: tc.textPrimary,
        marginLeft: 8,
        fontWeight: '500',
    },
    queueContainer: {
        marginTop: 20,
        marginBottom: 20,
    },
    queueHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    queueHeaderLine: {
        flex: 1,
        height: 1,
        backgroundColor: tc.borderColor,
    },
    queueHeaderText: {
        fontSize: 13,
        fontWeight: '600',
        color: tc.textSecondary,
        marginHorizontal: 12,
    },
    queuedItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: tc.cardBackground,
        padding: 12,
        borderRadius: 8,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: tc.borderColor,
    },
    queuedItemInfo: {
        flex: 1,
    },
    queuedItemName: {
        fontSize: 14,
        fontWeight: '600',
        color: tc.textPrimary,
    },
    queuedItemCategory: {
        fontSize: 12,
        color: tc.textSecondary,
        marginTop: 2,
    },
    queuedItemDescription: {
        fontSize: 12,
        color: tc.textMuted,
        marginTop: 4,
    },
    queuedItemActions: {
        flexDirection: 'row',
        gap: 8,
    },
    queuedActionBtn: {
        padding: 6,
    },
    docItemTop: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    docSubMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        marginTop: 4,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    docMetaText: {
        fontSize: 12,
        color: tc.textMuted,
        marginLeft: 4,
    },
    viewBtn: {
        width: 36,
        height: 36,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: tc.accent,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: isDark ? tc.buttonMutedBg : 'transparent',
    },
    docItemBottom: {
        borderTopWidth: 1,
        borderTopColor: tc.borderColor,
        paddingTop: 12,
    },
    docDescription: {
        fontSize: 13,
        color: tc.textSecondary,
        lineHeight: 18,
        marginBottom: 12,
    },
    tagContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    tagPill: {
        backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#f1f5f9',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: isDark ? 1 : 0,
        borderColor: tc.borderColor,
    },
    tagText: {
        fontSize: 11,
        color: tc.textSecondary,
        fontWeight: '500',
    }
});
