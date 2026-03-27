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

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const FormInput = ({ label, placeholder, required = false, isDropdown = false, multiline = false }: any) => (
    <View style={styles.inputGroup}>
        <View style={styles.labelRow}>
            {required && <Text style={styles.requiredStar}>* </Text>}
            <Text style={styles.inputLabel}>{label}</Text>
        </View>
        <View style={[styles.inputWrapper, multiline && styles.textAreaWrapper]}>
            <TextInput 
                style={[styles.textInput, multiline && styles.textArea]}
                placeholder={placeholder}
                placeholderTextColor="#cbd5e1"
                editable={!isDropdown}
                multiline={multiline}
            />
            {isDropdown && <Feather name="chevron-down" size={16} color="#cbd5e1" />}
        </View>
    </View>
);

const SubmitButton = ({ title, icon, color = ['#68BFB4', '#4DA1C0'], onPress, style, disabled = false, loading = false }: any) => (
    <TouchableOpacity 
        style={[styles.submitButtonContainer, style, disabled && styles.disabledButton, loading && { opacity: 0.7 }]} 
        onPress={disabled || loading ? undefined : onPress}
        disabled={disabled || loading}
    >
        <LinearGradient
            colors={disabled ? ['#B0B0B0', '#D3D3D3'] : color}
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
                        <Text style={[styles.submitButtonText, disabled && styles.disabledButtonText]}>{title}</Text>
                    </>
                )}
            </View>
        </LinearGradient>
    </TouchableOpacity>
);

const Documents = ({ patientData, onAlert }: { patientData: any, onAlert: any }) => {
    const { t } = useTranslation();
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
                <ActivityIndicator size="large" color="#4A90B9" />
                <Text style={{ marginTop: 15, color: '#64748b' }}>{t('patientDocuments.fetchingDocuments')}</Text>
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
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>{t('patientDocuments.uploadTitle')}</Text>
                        <TouchableOpacity onPress={() => setShowUploadModal(false)}>
                            <Feather name="x" size={20} color="#94a3b8" />
                        </TouchableOpacity>
                    </View>
                    
                    <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
                        <View style={styles.inputGroup}>
                            <View style={styles.labelRow}>
                                <Text style={styles.requiredStar}>* </Text>
                                <Text style={styles.inputLabel}>{t('patientDocuments.documentCategory')}</Text>
                            </View>
                            <TouchableOpacity 
                                style={[styles.inputWrapper, showCategoryDropdown && styles.dropdownActive]} 
                                onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
                            >
                                <Text style={[styles.textInput, !selectedCategory && { color: '#cbd5e1' }]}>
                                    {selectedCategory || t('patientDocuments.selectCategory')}
                                </Text>
                                <Feather name="chevron-down" size={16} color="#cbd5e1" />
                            </TouchableOpacity>
                            
                            {showCategoryDropdown && (
                                <View style={styles.dropdownOptionsContainer}>
                                    <TouchableOpacity 
                                        style={styles.dropdownOption} 
                                        onPress={() => {
                                            setSelectedCategory('Laboratory Results');
                                            setShowCategoryDropdown(false);
                                        }}
                                    >
                                        <Text style={styles.dropdownOptionText}>{t('patientDocuments.categoryLabResults')}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        style={styles.dropdownOption}
                                        onPress={() => {
                                            setSelectedCategory('Informed Consent');
                                            setShowCategoryDropdown(false);
                                        }}
                                    >
                                        <Text style={styles.dropdownOptionText}>{t('patientDocuments.categoryInformedConsent')}</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                        
                        <Text style={styles.inputLabel}>{t('patientDocuments.documentFile')}</Text>
                        <TouchableOpacity style={styles.uploadArea} onPress={handlePickDocument}>
                            <View style={styles.uploadIconContainer}>
                                <Feather name="inbox" size={32} color="#58a6b8" />
                            </View>
                            <Text style={styles.uploadMainText}>{t('patientDocuments.uploadAreaText')}</Text>
                            <Text style={styles.uploadSubText}>
                                {t('patientDocuments.uploadAreaSubText')}
                            </Text>
                        </TouchableOpacity>

                        {selectedFile && (
                            <View style={styles.selectedFilePreview}>
                                <Feather name="paperclip" size={16} color="#475569" />
                                <Text style={styles.selectedFileName}>{selectedFile.name}</Text>
                            </View>
                        )}

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>{t('patientDocuments.description')}</Text>
                            <View style={[styles.inputWrapper, styles.textAreaWrapper]}>
                                <TextInput 
                                    style={[styles.textInput, styles.textArea]}
                                    placeholder={t('patientDocuments.descriptionPlaceholder')}
                                    placeholderTextColor="#cbd5e1"
                                    multiline
                                    value={description}
                                    onChangeText={setDescription}
                                />
                            </View>
                        </View>
                        
                        <TouchableOpacity 
                            style={styles.dashedAddButton} 
                            onPress={addToQueue}
                        >
                            <Feather name="plus" size={16} color="#94a3b8" />
                            <Text style={styles.dashedAddText}>{t('patientDocuments.addDocument')}</Text>
                        </TouchableOpacity>

                        {queuedDocs.length > 0 && (
                            <View style={styles.queueContainer}>
                                <View style={styles.queueHeaderRow}>
                                    <View style={styles.queueHeaderLine} />
                                    <Text style={styles.queueHeaderText}>{t('patientDocuments.documentsToUpload')}</Text>
                                    <View style={styles.queueHeaderLine} />
                                </View>
                                {queuedDocs.map((item) => (
                                    <View key={item.id} style={styles.queuedItem}>
                                        <View style={styles.queuedItemInfo}>
                                            <Text style={styles.queuedItemName}>{item.file.name}</Text>
                                            <Text style={styles.queuedItemCategory}>{item.category}</Text>
                                            <Text style={styles.queuedItemDescription}>{item.description}</Text>
                                        </View>
                                        <View style={styles.queuedItemActions}>
                                            <TouchableOpacity style={styles.queuedActionBtn}>
                                                <Feather name="edit-2" size={16} color="#475569" />
                                            </TouchableOpacity>
                                            <TouchableOpacity 
                                                style={styles.queuedActionBtn}
                                                onPress={() => removeFromQueue(item.id)}
                                            >
                                                <Feather name="trash-2" size={16} color="#ef4444" />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        )}
                    </ScrollView>

                    <View style={styles.modalFooter}>
                        <TouchableOpacity 
                            style={styles.cancelOutlineButton} 
                            onPress={() => {
                                setShowUploadModal(false);
                                setQueuedDocs([]);
                            }}
                        >
                            <Text style={styles.cancelOutlineText}>{t('patientDocuments.cancel')}</Text>
                        </TouchableOpacity>
                        <SubmitButton 
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
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {renderUploadModal()}
            
            <View style={styles.card}>
                <TouchableOpacity 
                    style={[styles.header, expanded && styles.expandedHeader]} 
                    onPress={toggleExpand}
                    activeOpacity={0.7}
                >
                    <View style={styles.headerLeft}>
                        <Feather name="file-text" size={18} color="#58a6b8" style={styles.icon} />
                        <Text style={styles.title}>{t('patientDocuments.title')}</Text>
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
                                    placeholder={t('patientDocuments.searchPlaceholder')}
                                    value={searchText}
                                    onChangeText={setSearchText}
                                    placeholderTextColor="#94a3b8"
                                />
                            </View>
                            <SubmitButton 
                                title={t('patientDocuments.newDocument')} 
                                icon="plus" 
                                onPress={() => setShowUploadModal(true)}
                                style={styles.newDocBtn}
                            />
                        </View>

                        {(() => {
                            const filteredDocs = (docData?.documents || docData?.medicalDocuments || [])?.filter((doc: any) => 
                                (doc.name || doc.fileName || doc.title || '').toLowerCase().includes(searchText.toLowerCase()) ||
                                (doc.category || (doc.tags && doc.tags[0]) || '').toLowerCase().includes(searchText.toLowerCase())
                            ) || [];

                            return filteredDocs.length > 0 ? (
                                filteredDocs.map((doc: any, index: number) => (
                                    <View key={index} style={styles.docItem}>
                                        <View style={styles.docItemTop}>
                                            <View style={styles.docIconCircle}>
                                                <Feather name="file-text" size={18} color="#58a6b8" />
                                            </View>
                                            <View style={{ flex: 1, marginLeft: 12 }}>
                                                <Text style={styles.docName}>{doc.title || doc.name || doc.fileName || t('patientDocuments.untitledDocument')}</Text>
                                                <View style={styles.docSubMeta}>
                                                    <View style={styles.metaItem}>
                                                        <Feather name="calendar" size={12} color="#94a3b8" />
                                                        <Text style={styles.docMetaText}>
                                                            {doc.date ? new Date(doc.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : t('patientDocuments.noDate')}
                                                        </Text>
                                                    </View>
                                                    <Text style={styles.docMetaText}>  {t('patientDocuments.author')} {doc.author || t('patientDocuments.system')}</Text>
                                                </View>
                                            </View>
                                            <TouchableOpacity style={styles.viewBtn}>
                                                <Feather name="eye" size={18} color="#58a6b8" />
                                            </TouchableOpacity>
                                        </View>
                                        
                                        <View style={styles.docItemBottom}>
                                            <Text style={styles.docDescription} numberOfLines={2}>
                                                {doc.description || t('patientDocuments.noDescription')}
                                            </Text>
                                            <View style={styles.tagContainer}>
                                                {((doc.tags || [doc.category]) || ['General']).map((tag: string, tid: number) => (
                                                    <View key={tid} style={styles.tagPill}>
                                                        <Text style={styles.tagText}>{tag}</Text>
                                                    </View>
                                                ))}
                                            </View>
                                        </View>
                                    </View>
                                ))
                            ) : (
                                <View style={styles.emptyContainer}>
                                    <Text style={styles.emptyText}>
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
        fontSize: 13,
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
    newDocBtn: {
        flex: 0,
        minWidth: 145,
        height: 44,
    },
    emptyContainer: {
        backgroundColor: '#f8fafc',
        borderRadius: 8,
        padding: 16,
        alignItems: 'flex-start',
    },
    emptyText: {
        fontSize: 13,
        color: '#64748b',
        fontWeight: '500',
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    modalContent: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 24,
        width: '95%',
        maxHeight: '90%',
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
        color: '#1e293b'
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
        color: '#ef4444',
        fontSize: 14
    },
    inputLabel: {
        fontSize: 13,
        color: '#1e293b',
        fontWeight: '600',
        marginBottom: 8
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
    uploadArea: {
        borderWidth: 1,
        borderColor: '#3b82f6',
        borderStyle: 'dashed',
        borderRadius: 12,
        padding: 30,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8fafc',
        marginBottom: 20
    },
    uploadIconContainer: {
        marginBottom: 12
    },
    uploadMainText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1e293b',
        textAlign: 'center',
        marginBottom: 4
    },
    uploadSubText: {
        fontSize: 12,
        color: '#94a3b8',
        textAlign: 'center'
    },
    dashedAddButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderStyle: 'dashed',
        borderRadius: 8,
        paddingVertical: 10,
        marginBottom: 10
    },
    dashedAddText: {
        fontSize: 13,
        color: '#94a3b8',
        marginLeft: 6
    },
    modalFooter: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 12,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9'
    },
    cancelOutlineButton: {
        height: 38,
        paddingHorizontal: 20,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        justifyContent: 'center',
        alignItems: 'center'
    },
    cancelOutlineText: {
        color: '#1e293b',
        fontSize: 14,
        fontWeight: '600'
    },
    submitButtonContainer: {
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
        borderColor: '#3b82f6',
    },
    dropdownOptionsContainer: {
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#e2e8f0',
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
        borderBottomColor: '#f8fafc',
    },
    dropdownOptionText: {
        fontSize: 14,
        color: '#1e293b',
        fontWeight: '500',
    },
    docItem: {
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#f1f5f9',
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
    },
    docIconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f0f9f8',
        justifyContent: 'center',
        alignItems: 'center',
    },
    docName: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1e293b',
    },
    docMeta: {
        fontSize: 12,
        color: '#94a3b8',
        marginTop: 2,
    },
    downloadBtn: {
        padding: 8,
    },
    selectedFilePreview: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f1f5f9',
        padding: 10,
        borderRadius: 8,
        marginBottom: 20,
    },
    selectedFileName: {
        fontSize: 13,
        color: '#475569',
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
        backgroundColor: '#f1f5f9',
    },
    queueHeaderText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#64748b',
        marginHorizontal: 12,
    },
    queuedItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        padding: 12,
        borderRadius: 8,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    queuedItemInfo: {
        flex: 1,
    },
    queuedItemName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1e293b',
    },
    queuedItemCategory: {
        fontSize: 12,
        color: '#64748b',
        marginTop: 2,
    },
    queuedItemDescription: {
        fontSize: 12,
        color: '#94a3b8',
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
        color: '#94a3b8',
        marginLeft: 4,
    },
    viewBtn: {
        width: 36,
        height: 36,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#58a6b8',
        justifyContent: 'center',
        alignItems: 'center',
    },
    docItemBottom: {
        borderTopWidth: 1,
        borderTopColor: '#f8fafc',
        paddingTop: 12,
    },
    docDescription: {
        fontSize: 13,
        color: '#64748b',
        lineHeight: 18,
        marginBottom: 12,
    },
    tagContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    tagPill: {
        backgroundColor: '#f1f5f9',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    tagText: {
        fontSize: 11,
        color: '#64748b',
        fontWeight: '500',
    }
});

export default Documents;
