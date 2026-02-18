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
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Octicons from 'react-native-vector-icons/Octicons';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import PrimaryButton from '../../component/button';
import Gap from '../../component/gap';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const PatientDetailsModal = ({ visible, onClose, patientData }) => {
    // Default patient data if not provided
    const patient = patientData || {
        name: "Jan Kowalski",
        pesel: "80010112345",
        id: "P001",
        birthDate: "1980-01-01",
        address: "ul. Przykładowa 1, 00-001 Warszawa",
        insurance: {
            type: "NFZ",
            number: "NFZ123456789",
            validUntil: "2024-12-31"
        },
        portal: {
            active: true,
            notifications: ["Email", "SMS"]
        },
        employer: {
            name: "Firma XYZ Sp. z o.o.",
            address: "ul. Biznesowa 10, 00-001 Warszawa",
            phone: "+48 22 123 45 67"
        },
        authorizedPersons: [
            {
                name: "Anna Kowalska",
                relation: "Żona",
                idCard: "ABC123456",
                validUntil: "2025-12-31"
            }
        ],
        consents: [
            {
                type: "Przetwarzanie danych osobowych",
                granted: true,
                date: "2024-01-15"
            },
            {
                type: "Udostępnianie dokumentacji medycznej",
                granted: true,
                date: "2024-01-15"
            }
        ]
    };

    const renderSectionHeader = (title: string) => (
        <Text style={styles.sectionHeader}>{title}</Text>
    );

    const renderInfoRow = (icon: any, label: string, value: any, isSubItem: boolean = false, rightComponent: any = null) => (
        <View style={[styles.infoRow, isSubItem && styles.subItem]}>
            {icon}
            <View
                style={styles.infoTextContainer}
            >
                <Text style={styles.infoLabel}>{label}</Text>
                {typeof value === 'string' ? (
                    <Text style={styles.infoValue}>{value}</Text>
                ) : value}
            </View>
            {rightComponent}
        </View>
    );

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
                <Text style={styles.consentLabel}>{consent.type}</Text>
            </View>
            <View style={styles.consentStatus}>
                <Feather name="check-circle" size={18} color="#4CAF50" />
                <Text style={styles.consentValue}>Granted</Text>
                <Text style={styles.consentDate}>({consent.date})</Text>
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
                            <View>
                                <Text style={styles.patientName}>{patient.name}</Text>
                                <Text style={styles.patientId}>PESEL: {patient.pesel}   ID: {patient.id}</Text>
                            </View>
                        </View>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Ionicons name="close" size={24} color="black" />
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
                            patient.birthDate
                        )}

                        {/* Address */}
                        {renderSectionHeader("ADDRESS")}
                        {renderInfoRow(
                            <Feather name="map-pin" size={18} color="#777" style={styles.icon} />,
                            "",
                            patient.address
                        )}

                        {/* Insurance */}
                        {renderSectionHeader("INSURANCE")}
                        {renderInfoRow(
                            <Feather name="shield" size={18} color="#777" style={styles.icon} />,
                            "Type:",
                            patient.insurance?.type || "N/A"
                        )}
                        {renderInfoRow(
                            null,
                            "Number:",
                            patient.insurance?.number || "N/A",
                        )}
                        {renderInfoRow(
                            null,
                            "Valid until:",
                            patient.insurance?.validUntil || "N/A",
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
                                {patient.portal?.notifications?.map((type, index) => (
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
                            patient.employer?.name || "N/A"
                        )}
                        {renderInfoRow(
                            null,
                            "",
                            patient.employer?.address || "N/A",
                            true
                        )}
                        {renderInfoRow(
                            <Feather name="phone" size={18} color="#777" style={styles.icon} />,
                            "",
                            patient.employer?.phone || "N/A"
                        )}

                        {/* Authorized Persons */}
                        {renderSectionHeader("AUTHORIZED PERSONS AND LIST OF SHARED MEDICAL RECORDS")}
                        {patient.authorizedPersons?.map((person, index) => (
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
                        ))}

                        {/* Consents */}
                        {renderSectionHeader("CONSENT TO PROCESS PERSONAL DATA")}
                        {patient.consents?.map((consent, index) => (
                            <View key={index} style={styles.consentContainer}>
                                {renderConsent(consent)}
                            </View>
                        ))}
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
        width: '90%',
        maxHeight: '88%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 0,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    patientHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    patientAvatar: {
        width: 50,
        height: 50,
        borderRadius: 15,
        backgroundColor: '#dbeafe',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    patientName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    patientId: {
        fontSize: 14,
        color: '#777',
    },
    closeButton: {
        padding: 5,
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