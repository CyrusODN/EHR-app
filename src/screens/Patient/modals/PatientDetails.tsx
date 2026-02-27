import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import PrimaryButton from '../../../component/button';

interface PatientDetailsModalProps {
    visible: boolean;
    onClose: () => void;
    patientData?: any;
}

const PatientDetailsModal = ({ visible, onClose, patientData }: PatientDetailsModalProps) => {
    if (!patientData) return null;

    const patient = patientData;
    const personalData = patient.personalData || {};

    const renderSectionHeader = (title: string) => (
        <Text style={styles.sectionHeader}>{title}</Text>
    );

    const renderInfoRow = (icon: any, label: string, value: any, isSubItem: boolean = false, rightComponent: any = null) => {
        // Safe check to avoid rendering objects like {} which cause React errors
        const isRenderable = typeof value === 'string' || typeof value === 'number' || React.isValidElement(value);
        
        return (
            <View style={[styles.infoRow, isSubItem && styles.subItem]}>
                {icon}
                <View style={styles.infoTextContainer}>
                    <Text style={styles.infoLabel}>{label}</Text>
                    {isRenderable ? (
                        typeof value === 'object' ? value : <Text style={styles.infoValue}>{value}</Text>
                    ) : (
                        <Text style={styles.infoValue}>N/A</Text>
                    )}
                </View>
                {rightComponent}
            </View>
        );
    };

    const renderNotificationBadge = (type: string) => {
        const isEmail = type === "Email";
        return (
            <View style={[styles.notificationBadge, isEmail ? styles.emailBadge : styles.smsBadge]}>
                <Text style={[styles.notificationText, isEmail ? { color: "#1e40af" } : { color: "#166534" }]}>{type}</Text>
            </View>
        );
    };

    const renderConsent = (consent: any) => (
        <View style={styles.consentRow}>
            <View style={styles.consentTextContainer}>
                <Text style={styles.consentLabel}>{consent.title || consent.type}</Text>
            </View>
            <View style={styles.consentStatus}>
                <Feather 
                    name={consent.granted ? "check-circle" : "x-circle"} 
                    size={18} 
                    color={consent.granted ? "#4CAF50" : "#EF4444"} 
                />
                <Text style={[styles.consentValue, { color: consent.granted ? "#4CAF50" : "#EF4444" }]}>
                    {consent.granted ? "Granted" : "Not Granted"}
                </Text>
            </View>
        </View>
    );

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.patientHeaderLeft}>
                            <View style={styles.patientAvatar}>
                                <Feather name="user" size={28} color="#68BFB3" />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.patientName}>{patient.name} {patient.lastName}</Text>
                                <Text style={styles.patientId}>PESEL: {patient.pesel}   ID: {patient.slug || patient._id?.substring(0, 8)}</Text>
                            </View>
                        </View>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Ionicons name="close" size={20} color="#666" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.scrollView}>
                        {/* Basic Information */}
                        {renderSectionHeader("BASIC INFORMATION")}
                        {renderInfoRow(
                            <Feather name="user" size={18} color="#777" style={styles.icon} />,
                            "PESEL:",
                            patient.pesel
                        )}
                        {renderInfoRow(
                            <Feather name="calendar" size={18} color="#777" style={styles.icon} />,
                            "Date of birth:",
                            patient.dob ? new Date(patient.dob).toLocaleDateString() : 'N/A'
                        )}

                        {/* Address */}
                        {renderSectionHeader("ADDRESS")}
                        {renderInfoRow(
                            <Feather name="map-pin" size={18} color="#777" style={styles.icon} />,
                            "",
                            `${personalData.street || ''} ${personalData.houseNumber || ''}${personalData.apartmentNumber ? '/' + personalData.apartmentNumber : ''}, ${personalData.postalCode || ''} ${personalData.city || ''}, ${personalData.country || ''}`.trim() || 'N/A'
                        )}

                        {/* Insurance */}
                        {renderSectionHeader("INSURANCE")}
                        {renderInfoRow(
                            <Feather name="shield" size={18} color="#777" style={styles.icon} />,
                            "Type:",
                            patient.insuranceType || "N/A"
                        )}
                        {renderInfoRow(
                            null,
                            "Number:",
                            patient.insuranceNumber || "N/A",
                        )}

                        {/* Patient Portal */}
                        {renderSectionHeader("PATIENT PORTAL / NOTIFICATIONS")}
                        {renderInfoRow(
                            <Feather name="message-square" size={18} color="#777" style={styles.icon} />,
                            "Portal account:",
                            <Text style={styles.activeStatus}>Active</Text>
                        )}
                        {renderInfoRow(
                            <Feather name="bell" size={18} color="#777" style={styles.icon} />,
                            "Notifications:",
                            <View style={styles.notificationBadgesContainer}>
                                {patient.portal?.notifications?.map((type: string, index: number) => (
                                    <View key={index} style={{ marginRight: 5 }}>
                                        {renderNotificationBadge(type)}
                                    </View>
                                )) || <Text style={styles.infoValue}>None</Text>}
                            </View>
                        )}

                        {/* Employer */}
                        {renderSectionHeader("EMPLOYER")}
                        {renderInfoRow(
                            <Feather name="briefcase" size={18} color="#777" style={styles.icon} />,
                            "",
                            personalData.employer?.name || "N/A"
                        )}
                        {renderInfoRow(
                            null,
                            "",
                            typeof personalData.employer?.address === 'string' ? personalData.employer.address : "N/A",
                            true
                        )}
                        {renderInfoRow(
                            <Feather name="phone" size={18} color="#777" style={styles.icon} />,
                            "",
                            personalData.employer?.phone || "N/A"
                        )}

                        {/* Authorized Persons */}
                        {renderSectionHeader("AUTHORIZED PERSONS AND LIST OF SHARED MEDICAL RECORDS")}
                        {personalData.authorizedPersons?.length > 0 ? personalData.authorizedPersons.map((person: any, index: number) => (
                            <View key={index}>
                                {renderInfoRow(
                                    <Feather name="users" size={18} color="#777" style={styles.icon} />,
                                    person.name,
                                    <View style={styles.relationBadge}>
                                        <Text style={styles.relationText}>{person.relation}</Text>
                                    </View>
                                )}
                                {renderInfoRow(
                                    <Feather name="file-text" size={18} color="#777" style={styles.icon} />,
                                    "ID card:",
                                    `${person.idCard}  (valid until: ${person.validUntil})`
                                )}
                            </View>
                        )) : (
                            <Text style={[styles.infoValue, { paddingHorizontal: 47, paddingVertical: 10, color: '#777' }]}>No authorized persons</Text>
                        )}
  
                        {/* Consents */}
                        {renderSectionHeader("CONSENT TO PROCESS PERSONAL DATA")}
                        {personalData.consents?.length > 0 ? personalData.consents.map((consent: any, index: number) => (
                            <View key={index} style={styles.consentContainer}>
                                {renderConsent(consent)}
                            </View>
                        )) : (
                            <Text style={[styles.infoValue, { paddingHorizontal: 15, paddingVertical: 10, color: '#777' }]}>No consents provided</Text>
                        )}
                    </ScrollView>

                    {/* Bottom Buttons */}
                    <View style={styles.buttonContainer}>
                        <PrimaryButton
                            label="Close"
                            filled={false}
                            onPress={onClose}
                            style={{ width: "48%" }}
                            icon={undefined}
                            image={undefined}
                            iconStyle={undefined}
                            imageStyle={undefined}
                            loading={false}
                            disabled={false}
                        />
 
                        <PrimaryButton
                            label="Edit data"
                            filled={true}
                            onPress={() => { }}
                            style={{ width: "48%" }}
                            icon={undefined}
                            image={undefined}
                            iconStyle={undefined}
                            imageStyle={undefined}
                            loading={false}
                            disabled={false}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        width: '92%',
        maxHeight: '80%',
        backgroundColor: 'white',
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
    },
    header: {
        flexDirection: 'row',
        padding: 20,
        paddingTop: 25,
        position: 'relative',
    },
    patientHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        paddingRight: 40,
    },
    patientAvatar: {
        width: 56,
        height: 56,
        borderRadius: 18,
        backgroundColor: '#F0F9F8',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    patientName: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1A1C1E',
        marginBottom: 4,
    },
    patientId: {
        fontSize: 13,
        color: '#6B7280',
        lineHeight: 18,
    },
    closeButton: {
        position: 'absolute',
        top: 15,
        right: 15,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    scrollView: {
        // maxHeight: '70%',
    },
    sectionHeader: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    infoRow: {
        flexDirection: 'row',
        paddingHorizontal: 15,
        paddingVertical: 10,
        alignItems: 'center',
    },
    subItem: {
        paddingLeft: 47,
    },
    icon: {
        marginRight: 10,
        width: 22,
    },
    infoTextContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    infoLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: '#555',
    },
    infoValue: {
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
    },
    activeStatus: {
        color: '#4CAF50',
        fontWeight: '600',
    },
    notificationBadgesContainer: {
        flexDirection: 'row',
    },
    notificationBadge: {
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emailBadge: {
        backgroundColor: '#dbeafe',
    },
    smsBadge: {
        backgroundColor: '#dcfce7',
    },
    notificationText: {
        fontSize: 12,
        fontWeight: '500',
    },
    relationBadge: {
        backgroundColor: '#dbeafe',
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 15,
    },
    relationText: {
        fontSize: 12,

        color: '#1e40af',
        fontWeight: '500',
    },
    consentContainer: {
        paddingHorizontal: 15,
        paddingVertical: 5,
    },
    consentRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    consentTextContainer: {
        flex: 1,
    },
    consentLabel: {
        fontSize: 14,
        color: '#555',
    },
    consentStatus: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    consentValue: {
        fontSize: 14,
        color: '#4CAF50',
        fontWeight: '500',
        marginLeft: 5,
    },
    consentDate: {
        fontSize: 12,
        color: '#777',
        marginLeft: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
        width: "100%",
        alignSelf: "center"
    },
});

export default PatientDetailsModal;