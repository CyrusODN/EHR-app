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
    UIManager
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const FormInput = ({ label, placeholder, required = false, isDropdown = false, hasCalendar = false, multiline = false }: any) => (
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
            {hasCalendar && <Feather name="calendar" size={16} color="#cbd5e1" style={{ position: 'absolute', right: 12 }} />}
        </View>
    </View>
);

const SubmitButton = ({ title, color = ['#68BFB4', '#4DA1C0'], onPress, style }: any) => (
    <TouchableOpacity style={[styles.submitButtonContainer, style]} onPress={onPress}>
        <LinearGradient
            colors={color}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientButton}
        >
            <Text style={styles.submitButtonText}>{title}</Text>
        </LinearGradient>
    </TouchableOpacity>
);

const ActionOutlineButton = ({ title, icon, onPress }: any) => (
    <TouchableOpacity style={styles.outlineButton} onPress={onPress}>
        <Feather name={icon} size={16} color="#58a6b8" />
        <Text style={styles.outlineButtonText}>{title}</Text>
    </TouchableOpacity>
);

const Laboratory = ({ patientData }: { patientData: any }) => {
    const [expanded, setExpanded] = useState(true);
    const [searchText, setSearchText] = useState('');
    const [showResultsModal, setShowResultsModal] = useState(false);
    const [showParameterModal, setShowParameterModal] = useState(false);

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
                <View style={[styles.modalContent, { width: '90%' }]}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Add Lab Results</Text>
                        <TouchableOpacity onPress={() => setShowResultsModal(false)}>
                            <Feather name="x" size={20} color="#94a3b8" />
                        </TouchableOpacity>
                    </View>
                    
                    <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
                        <Text style={styles.modalSubheading}>Basic Information</Text>
                        <View style={styles.row}>
                            <View style={{ flex: 1, marginRight: 8 }}>
                                <FormInput label="Test Name" required placeholder="e.g. Blood Morphology, Lipid Profile" />
                            </View>
                            <View style={{ flex: 1 }}>
                                <FormInput label="Order Date" required placeholder="Select date" hasCalendar isDropdown />
                            </View>
                        </View>
                        <FormInput label="Lab Reference Number" required placeholder="e.g. LAB/2024/001" />

                        <View style={styles.parametersHeader}>
                            <Text style={styles.modalSubheading}>Test Parameters</Text>
                            <ActionOutlineButton 
                                title="Add Parameter" 
                                icon="plus" 
                                onPress={() => setShowParameterModal(true)} 
                            />
                        </View>

                        <View style={styles.emptyBox}>
                            <Text style={styles.emptyBoxText}>No parameters added. Click 'Add Parameter' to start.</Text>
                        </View>
                    </ScrollView>

                    <View style={styles.modalFooter}>
                        <TouchableOpacity 
                            style={styles.cancelOutlineButton} 
                            onPress={() => setShowResultsModal(false)}
                        >
                            <Text style={styles.cancelOutlineText}>Cancel</Text>
                        </TouchableOpacity>
                        <SubmitButton title="Add Result" style={{ width: 110 }} />
                    </View>
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
                <View style={[styles.modalContent, { width: '85%' }]}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Add Parameter</Text>
                        <TouchableOpacity onPress={() => setShowParameterModal(false)}>
                            <Feather name="x" size={20} color="#94a3b8" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.row}>
                        <View style={{ flex: 1, marginRight: 8 }}>
                            <FormInput label="Parameter Name" required placeholder="" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <FormInput label="Normal Range" required placeholder="e.g. 4.0-10.0, <200, >40" />
                        </View>
                    </View>

                    <View style={styles.row}>
                        <View style={{ flex: 1, marginRight: 8 }}>
                            <FormInput label="Unit" required placeholder="e.g. g/dL, 10^3/μL" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <FormInput label="Value" required placeholder="" />
                        </View>
                    </View>

                    <View style={styles.modalFooter}>
                        <TouchableOpacity 
                            style={styles.cancelOutlineButton} 
                            onPress={() => setShowParameterModal(false)}
                        >
                            <Text style={styles.cancelOutlineText}>Cancel</Text>
                        </TouchableOpacity>
                        <SubmitButton title="Add Parameter" style={{ width: 140 }} />
                    </View>
                </View>
            </View>
        </Modal>
    );

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {renderAddResultsModal()}
            {renderAddParameterModal()}
            
            <View style={styles.card}>
                <TouchableOpacity 
                    style={[styles.header, expanded && styles.expandedHeader]} 
                    onPress={toggleExpand}
                    activeOpacity={0.7}
                >
                    <View style={styles.headerLeft}>
                        <Feather name="test-tube" size={18} color="#58a6b8" style={styles.icon} />
                        <Text style={styles.title}>TEST RESULTS</Text>
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
                                    placeholder="Search lab results..."
                                    value={searchText}
                                    onChangeText={setSearchText}
                                    placeholderTextColor="#94a3b8"
                                />
                            </View>
                            <SubmitButton 
                                title="Add Results" 
                                icon="plus" 
                                onPress={() => setShowResultsModal(true)}
                                style={styles.addResultsBtn}
                            />
                        </View>

                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No lab results found</Text>
                        </View>
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
        minWidth: 120,
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
        padding: 20
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
        paddingHorizontal: 12
    },
    submitButtonText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '600'
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
    }
});

export default Laboratory;
