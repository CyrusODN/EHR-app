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
import { GetPatientMedicalRecord } from '../../../Services/PatientRecord.Service';

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

const Documents = ({ patientData }: { patientData: any }) => {
    const [docData, setDocData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState(true);
    const [searchText, setSearchText] = useState('');
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('');

    React.useEffect(() => {
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
        fetchDocData();
    }, [patientData]);

    if (loading) {
        return (
            <View style={{ flex: 1, paddingVertical: 40, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator size="large" color="#4A90B9" />
                <Text style={{ marginTop: 15, color: '#64748b' }}>Fetching documents...</Text>
            </View>
        );
    }

    const toggleExpand = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded(!expanded);
    };

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
                        <Text style={styles.modalTitle}>Upload New Document</Text>
                        <TouchableOpacity onPress={() => setShowUploadModal(false)}>
                            <Feather name="x" size={20} color="#94a3b8" />
                        </TouchableOpacity>
                    </View>
                    
                    <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
                        <View style={styles.inputGroup}>
                            <View style={styles.labelRow}>
                                <Text style={styles.requiredStar}>* </Text>
                                <Text style={styles.inputLabel}>Document Category</Text>
                            </View>
                            <TouchableOpacity 
                                style={[styles.inputWrapper, showCategoryDropdown && styles.dropdownActive]} 
                                onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
                            >
                                <Text style={[styles.textInput, !selectedCategory && { color: '#cbd5e1' }]}>
                                    {selectedCategory || "Select a category"}
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
                                        <Text style={styles.dropdownOptionText}>Laboratory Results</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        style={styles.dropdownOption}
                                        onPress={() => {
                                            setSelectedCategory('Informed Consent');
                                            setShowCategoryDropdown(false);
                                        }}
                                    >
                                        <Text style={styles.dropdownOptionText}>Informed Consent</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                        
                        <Text style={styles.inputLabel}>Document File</Text>
                        <TouchableOpacity style={styles.uploadArea}>
                            <View style={styles.uploadIconContainer}>
                                <Feather name="inbox" size={32} color="#58a6b8" />
                            </View>
                            <Text style={styles.uploadMainText}>Click or drag file to this area to upload</Text>
                            <Text style={styles.uploadSubText}>
                                Support for a single file upload. PDF, DOC, DOCX, JPG, PNG formats.
                            </Text>
                        </TouchableOpacity>

                        <FormInput label="Description" placeholder="Enter document description here..." multiline />
                        
                        <TouchableOpacity style={styles.dashedAddButton}>
                            <Feather name="plus" size={16} color="#94a3b8" />
                            <Text style={styles.dashedAddText}>Add Document</Text>
                        </TouchableOpacity>
                    </ScrollView>

                    <View style={styles.modalFooter}>
                        <TouchableOpacity 
                            style={styles.cancelOutlineButton} 
                            onPress={() => setShowUploadModal(false)}
                        >
                            <Text style={styles.cancelOutlineText}>Cancel</Text>
                        </TouchableOpacity>
                        <SubmitButton title="Upload Documents" disabled={true} style={{ width: 140 }} />
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
                        <Text style={styles.title}>MEDICAL DOCUMENTATION</Text>
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
                                    placeholder="Search in documents..."
                                    value={searchText}
                                    onChangeText={setSearchText}
                                    placeholderTextColor="#94a3b8"
                                />
                            </View>
                            <SubmitButton 
                                title="New document" 
                                icon="plus" 
                                onPress={() => setShowUploadModal(true)}
                                style={styles.newDocBtn}
                            />
                        </View>

                        {(() => {
                            const filteredDocs = docData?.medicalDocuments?.filter((doc: any) => 
                                (doc.name || doc.fileName || '').toLowerCase().includes(searchText.toLowerCase()) ||
                                (doc.category || '').toLowerCase().includes(searchText.toLowerCase())
                            ) || [];

                            return filteredDocs.length > 0 ? (
                                filteredDocs.map((doc: any, index: number) => (
                                    <View key={index} style={styles.docItem}>
                                        <View style={styles.docIconCircle}>
                                            <Feather name="file" size={20} color="#58a6b8" />
                                        </View>
                                        <View style={{ flex: 1, marginLeft: 12 }}>
                                            <Text style={styles.docName}>{doc.name || doc.fileName || 'Untitled Document'}</Text>
                                            <Text style={styles.docMeta}>{doc.category || 'General'} • {doc.date ? new Date(doc.date).toLocaleDateString() : 'No date'}</Text>
                                        </View>
                                        <TouchableOpacity style={styles.downloadBtn}>
                                            <Feather name="download" size={18} color="#94a3b8" />
                                        </TouchableOpacity>
                                    </View>
                                ))
                            ) : (
                                <View style={styles.emptyContainer}>
                                    <Text style={styles.emptyText}>
                                        {searchText ? 'No documents match your search' : 'No documents found'}
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
        flexDirection: 'row',
        alignItems: 'center',
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
    }
});

export default Documents;
