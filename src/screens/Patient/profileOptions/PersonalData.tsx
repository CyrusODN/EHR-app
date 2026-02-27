import React, { useState } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    ScrollView,
    TextInput,
    Switch,
    LayoutAnimation,
    Platform,
    UIManager,
    Modal
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const AccordionItem = ({ title, icon, children }: { title: string, icon: string, children: React.ReactNode }) => {
    const [expanded, setExpanded] = useState(false);

    const toggleExpand = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded(!expanded);
    };

    return (
        <View style={styles.accordionContainer}>
            <TouchableOpacity 
                style={[styles.accordionHeader, expanded && styles.expandedHeader]} 
                onPress={toggleExpand}
                activeOpacity={0.7}
            >
                <View style={styles.headerLeft}>
                    <View style={styles.iconContainer}>
                        <Feather name={icon} size={18} color="#58a6b8" />
                    </View>
                    <Text style={styles.accordionTitle}>{title}</Text>
                </View>
                <Feather name={expanded ? "chevron-up" : "chevron-down"} size={20} color="#94a3b8" />
            </TouchableOpacity>
            {expanded && (
                <View style={styles.accordionContent}>
                    {children}
                </View>
            )}
        </View>
    );
};

const FormInput = ({ label, placeholder, required = false, isDropdown = false }: any) => (
    <View style={styles.inputGroup}>
        <View style={styles.labelRow}>
            {required && <Text style={styles.requiredStar}>* </Text>}
            <Text style={styles.inputLabel}>{label}:</Text>
        </View>
        <TouchableOpacity 
            style={styles.inputWrapper} 
            activeOpacity={isDropdown ? 0.7 : 1}
        >
            <TextInput 
                style={styles.textInput}
                placeholder={placeholder}
                placeholderTextColor="#cbd5e1"
                editable={!isDropdown}
            />
            {isDropdown && <Feather name="chevron-down" size={16} color="#cbd5e1" />}
        </TouchableOpacity>
    </View>
);

const SectionHeader = ({ title }: { title: string }) => (
    <Text style={styles.sectionSubHeader}>{title}</Text>
);

const SubmitButton = ({ title, color = ['#68BFB4', '#4DA1C0'] }: any) => (
    <TouchableOpacity style={styles.submitButtonContainer}>
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

const PersonalData = ({ patientData }: { patientData: any }) => {
    const [showInsurerModal, setShowInsurerModal] = useState(false);
    const [showAuthorizedModal, setShowAuthorizedModal] = useState(false);
    const [authorizeAnyone, setAuthorizeAnyone] = useState(false);
    const [signedAuthorization, setSignedAuthorization] = useState(false);

    const renderAddInsurerModal = () => (
        <Modal
            visible={showInsurerModal}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setShowInsurerModal(false)}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Add New Insurer</Text>
                        <TouchableOpacity onPress={() => setShowInsurerModal(false)}>
                            <Feather name="x" size={20} color="#94a3b8" />
                        </TouchableOpacity>
                    </View>
                    
                    <ScrollView style={styles.modalScroll}>
                        <FormInput label="Insurer Name" required placeholder="" />
                        <FormInput label="Policy Number" required placeholder="" />
                        <FormInput label="Start Date" required placeholder="Select date" isDropdown />
                        <FormInput label="Valid Until" required placeholder="Select date" isDropdown />
                    </ScrollView>

                    <View style={styles.modalFooter}>
                        <TouchableOpacity 
                            style={styles.cancelButton}
                            onPress={() => setShowInsurerModal(false)}
                        >
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.addButton}>
                            <Text style={styles.addButtonText}>Add</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );

    const renderAddAuthorizedModal = () => (
        <Modal
            visible={showAuthorizedModal}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setShowAuthorizedModal(false)}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Add Authorized Person</Text>
                        <TouchableOpacity onPress={() => setShowAuthorizedModal(false)}>
                            <Feather name="x" size={20} color="#94a3b8" />
                        </TouchableOpacity>
                    </View>
                    
                    <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
                        <View style={styles.row}>
                            <View style={{ flex: 1, marginRight: 8 }}>
                                <FormInput label="First Name" required placeholder="" />
                            </View>
                            <View style={{ flex: 1 }}>
                                <FormInput label="Last Name" required placeholder="" />
                            </View>
                        </View>
                        
                        <View style={styles.row}>
                            <View style={{ flex: 1, marginRight: 8 }}>
                                <FormInput label="Relationship" required placeholder="" isDropdown />
                            </View>
                            <View style={{ flex: 1 }}>
                                <FormInput label="PESEL" placeholder="" />
                            </View>
                        </View>

                        <View style={styles.row}>
                            <View style={{ flex: 1, marginRight: 8 }}>
                                <FormInput label="Phone Number" required placeholder="" />
                            </View>
                            <View style={{ flex: 1 }}>
                                <FormInput label="Email" placeholder="" />
                            </View>
                        </View>

                        <FormInput label="Address" placeholder="" />

                        <FormInput label="Document Type" required placeholder="" isDropdown />

                        <View style={styles.row}>
                            <View style={{ flex: 1, marginRight: 8 }}>
                                <FormInput label="Document Number" required placeholder="" />
                            </View>
                            <View style={{ flex: 1 }}>
                                <FormInput label="Valid Until" required placeholder="Select date" isDropdown />
                            </View>
                        </View>
                    </ScrollView>

                    <View style={styles.modalFooter}>
                        <TouchableOpacity 
                            style={styles.cancelButton}
                            onPress={() => setShowAuthorizedModal(false)}
                        >
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.addButton}>
                            <Text style={styles.addButtonText}>Add</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {renderAddInsurerModal()}
            {renderAddAuthorizedModal()}
            
            <AccordionItem title="Basic Information" icon="user">
                <FormInput label="First Name" required placeholder="Enter first name" />
                <FormInput label="Last Name" required placeholder="Enter last name" />
                <FormInput label="PESEL" required placeholder="Enter PESEL" />
                <FormInput label="Date of Birth" required placeholder="Select date" isDropdown />
                <FormInput label="Gender" required placeholder="Select gender" isDropdown />
            </AccordionItem>

            <AccordionItem title="Address" icon="map-pin">
                <FormInput label="City" required placeholder="Enter city" />
                <FormInput label="Street" required placeholder="Enter street" />
                <View style={styles.row}>
                    <View style={{ flex: 1, marginRight: 8 }}>
                        <FormInput label="House" required placeholder="No." />
                    </View>
                    <View style={{ flex: 1 }}>
                        <FormInput label="Apartment" placeholder="No." />
                    </View>
                </View>
                <FormInput label="Postal Code" required placeholder="Enter code" />
            </AccordionItem>

            <AccordionItem title="Insurance" icon="shield">
                <SectionHeader title="Insured in NFZ:" />
                <View style={styles.row}>
                    <View style={{ flex: 1, marginRight: 8 }}>
                        <FormInput label="Branch" required placeholder="" isDropdown />
                    </View>
                    <View style={{ flex: 1 }}>
                        <FormInput label="Additional Rights" required placeholder="" isDropdown />
                    </View>
                </View>

                <View style={[styles.row, { alignItems: 'center', marginTop: 15, justifyContent: 'space-between' }]}>
                    <SectionHeader title="Private Insurers" />
                    <View style={styles.miniSearch}>
                        <Feather name="search" size={14} color="#94a3b8" />
                        <TextInput style={styles.miniSearchInput} placeholder="Search (Insurer)" placeholderTextColor="#cbd5e1" />
                    </View>
                </View>

                <Text style={styles.noDataTextMinimal}>No private insurers added</Text>

                <TouchableOpacity 
                    style={styles.outlineButton}
                    onPress={() => setShowInsurerModal(true)}
                >
                    <Feather name="plus" size={16} color="#58a6b8" />
                    <Text style={styles.outlineButtonText}>Add Insurer</Text>
                </TouchableOpacity>

                <Text style={styles.disclaimerText}>
                    Please remember to click the Submit button after adding or deleting an insurer to save the changes
                </Text>

                <View style={{ alignItems: 'flex-end', marginTop: 10 }}>
                    <SubmitButton title="Submit" />
                </View>
            </AccordionItem>

            <AccordionItem title="Employer" icon="briefcase">
                <SectionHeader title="Employer" />
                <FormInput label="Employer Name" required placeholder="" />
                <View style={styles.row}>
                    <View style={{ flex: 1, marginRight: 8 }}>
                        <FormInput label="Employer NIP" required placeholder="" />
                    </View>
                    <View style={{ flex: 1 }}>
                        <FormInput label="Occupation" required placeholder="" />
                    </View>
                </View>
                <FormInput label="Production and Service Group Symbol" placeholder="" />

                <SectionHeader title="Address" />
                <View style={styles.row}>
                    <View style={{ flex: 1, marginRight: 8 }}>
                        <FormInput label="Street" required placeholder="" />
                    </View>
                    <View style={{ flex: 1 }}>
                        <FormInput label="House Number" required placeholder="" />
                    </View>
                </View>
                <View style={styles.row}>
                    <View style={{ flex: 1, marginRight: 8 }}>
                        <FormInput label="Apartment Number" placeholder="" />
                    </View>
                    <View style={{ flex: 1 }}>
                        <FormInput label="Postal Code" required placeholder="" />
                    </View>
                </View>
                <View style={styles.row}>
                    <View style={{ flex: 1, marginRight: 8 }}>
                        <FormInput label="City" required placeholder="" />
                    </View>
                    <View style={{ flex: 1 }}>
                        <FormInput label="Voivodeship" required placeholder="" isDropdown />
                    </View>
                </View>
                <FormInput label="Country" required placeholder="" isDropdown />

                <View style={{ alignItems: 'flex-end', marginTop: 10 }}>
                    <SubmitButton title="Submit" />
                </View>
            </AccordionItem>

            <AccordionItem title="AUTHORIZED PERSONS AND LIST OF SHARED MEDICAL DOCUMENTATION" icon="users">
                <View style={styles.toggleRow}>
                    <Text style={styles.toggleLabel}>Patient does not authorize anyone:</Text>
                    <Switch 
                        value={authorizeAnyone} 
                        onValueChange={setAuthorizeAnyone}
                        trackColor={{ false: '#e2e8f0', true: '#58a6b8' }}
                    />
                </View>
                <View style={styles.toggleRow}>
                    <Text style={styles.toggleLabel}>Patient signed current version of authorization:</Text>
                    <Switch 
                        value={signedAuthorization} 
                        onValueChange={setSignedAuthorization}
                        trackColor={{ false: '#e2e8f0', true: '#58a6b8' }}
                    />
                </View>

                <View style={[styles.row, { marginTop: 15, gap: 10, flexWrap: 'wrap' }]}>
                    <TouchableOpacity style={styles.orangeButton}>
                        <Feather name="file-text" size={16} color="#ffffff" />
                        <Text style={styles.orangeButtonText}>NO AUTHORIZATION - STATEMENT</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.outlineButton}
                        onPress={() => setShowAuthorizedModal(true)}
                    >
                        <Feather name="plus" size={16} color="#58a6b8" />
                        <Text style={styles.outlineButtonText}>ADD AUTHORIZED PERSON</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.emptyResultsBox}>
                    <Text style={styles.noDataTextMinimal}>No authorized persons added</Text>
                </View>

                <View style={{ alignItems: 'flex-end', marginTop: 15 }}>
                    <SubmitButton title="Save" />
                </View>
            </AccordionItem>

            <AccordionItem title="Consent to the processing of personal data" icon="file-text">
                <View style={styles.infoBanner}>
                    <Text style={styles.infoBannerText}>
                        In accordance with Polish law, patient consent requires a physical signed document. Please upload a scanned copy of the signed consent form.
                    </Text>
                </View>

                {[
                    {
                        title: 'Processing of Personal Data',
                        desc: 'I consent to the processing of my personal data for the purpose of providing medical services in accordance with GDPR.'
                    },
                    {
                        title: 'Access to Medical Documentation',
                        desc: 'I consent to providing access to my medical documentation to authorized persons and other medical facilities for the purpose of continuing treatment.'
                    },
                    {
                        title: 'Electronic Communication',
                        desc: 'I consent to receiving medical and organizational information via electronic means (email, SMS).'
                    }
                ].map((item, index) => (
                    <View key={index} style={styles.consentRow}>
                        <View style={{ flex: 1, paddingRight: 10 }}>
                            <Text style={styles.consentTitle}>{item.title}</Text>
                            <Text style={styles.consentDesc}>{item.desc}</Text>
                        </View>
                        <View style={styles.consentActions}>
                            <View style={styles.statusBadge}>
                                <Feather name="x-circle" size={14} color="#ef4444" />
                                <Text style={styles.statusText}>No consent</Text>
                            </View>
                            <TouchableOpacity style={styles.grantButton}>
                                <Text style={styles.grantButtonText}>Grant consent</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}

                <View style={{ alignItems: 'flex-end', marginTop: 20 }}>
                    <SubmitButton title="Save changes" />
                </View>
            </AccordionItem>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
    },
    accordionContainer: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#f1f5f9',
        overflow: 'hidden',
    },
    accordionHeader: {
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
        flex: 1,
    },
    iconContainer: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: '#f0f9f8',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    accordionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#334155',
        flex: 1,
    },
    accordionContent: {
        padding: 16,
        backgroundColor: '#ffffff',
    },
    inputGroup: {
        marginBottom: 15,
    },
    labelRow: {
        flexDirection: 'row',
        marginBottom: 6,
    },
    requiredStar: {
        color: '#ef4444',
        fontSize: 14,
    },
    inputLabel: {
        fontSize: 13,
        color: '#64748b',
        fontWeight: '500',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 8,
        paddingHorizontal: 12,
        height: 44,
        backgroundColor: '#ffffff',
    },
    textInput: {
        flex: 1,
        fontSize: 14,
        color: '#1e293b',
        padding: 0,
    },
    row: {
        flexDirection: 'row',
    },
    sectionSubHeader: {
        fontSize: 14,
        fontWeight: '700',
        color: '#334155',
        marginTop: 10,
        marginBottom: 12,
    },
    miniSearch: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 6,
        paddingHorizontal: 10,
        height: 36,
        width: 140,
    },
    miniSearchInput: {
        fontSize: 12,
        marginLeft: 6,
        color: '#1e293b',
        flex: 1,
        padding: 0,
    },
    noDataTextMinimal: {
        fontSize: 13,
        color: '#94a3b8',
        fontStyle: 'italic',
        paddingVertical: 10,
    },
    outlineButton: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#58a6b8',
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 15,
        alignSelf: 'flex-start',
    },
    outlineButtonText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#58a6b8',
        marginLeft: 8,
    },
    disclaimerText: {
        fontSize: 12,
        color: '#94a3b8',
        fontStyle: 'italic',
        marginTop: 15,
        lineHeight: 18,
    },
    submitButtonContainer: {
        height: 38,
        width: 90,
        borderRadius: 8,
        overflow: 'hidden',
    },
    gradientButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '600',
    },
    toggleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    toggleLabel: {
        fontSize: 13,
        color: '#475569',
        flex: 1,
        paddingRight: 10,
    },
    orangeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f97316',
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    orangeButtonText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#ffffff',
        marginLeft: 8,
    },
    emptyResultsBox: {
        backgroundColor: '#f8fafc',
        borderRadius: 10,
        padding: 20,
        marginTop: 15,
        alignItems: 'flex-start',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        width: '100%',
        maxHeight: '80%',
        padding: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1e293b',
    },
    modalScroll: {
        marginBottom: 20,
    },
    modalFooter: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 12,
    },
    cancelButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    cancelButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748b',
    },
    addButton: {
        paddingVertical: 10,
        paddingHorizontal: 25,
        borderRadius: 8,
        backgroundColor: '#3b82f6',
    },
    addButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#ffffff',
    },
    infoBanner: {
        backgroundColor: '#eff6ff',
        padding: 12,
        borderRadius: 8,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#dbeafe',
    },
    infoBannerText: {
        fontSize: 12,
        color: '#1e40af',
        lineHeight: 18,
    },
    consentRow: {
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#f1f5f9',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    consentTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1e293b',
        marginBottom: 4,
    },
    consentDesc: {
        fontSize: 12,
        color: '#64748b',
        lineHeight: 18,
    },
    consentActions: {
        alignItems: 'flex-end',
        minWidth: 100,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    statusText: {
        fontSize: 12,
        color: '#ef4444',
        marginLeft: 6,
        fontWeight: '500',
    },
    grantButton: {
        backgroundColor: '#f0fdf4',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#dcfce7',
    },
    grantButtonText: {
        fontSize: 12,
        color: '#16a34a',
        fontWeight: '600',
    }
});

export default PersonalData;
