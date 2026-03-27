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
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '../../../hooks/useThemeColors';

interface PatientDetailsModalProps {
    visible: boolean;
    onClose: () => void;
    patientData?: any;
}

const PatientDetailsModal = ({ visible, onClose, patientData }: PatientDetailsModalProps) => {
    const { t } = useTranslation();
    const { colors: tc, isDark } = useThemeColors();
    const ds = createDynamicStyles(tc, isDark);

    if (!patientData) return null;

    const patient = patientData;
    const personalData = patient.personalData || {};

    const renderSectionHeader = (title: string) => (
        <Text style={ds.sectionHeader}>{title}</Text>
    );

    const renderInfoRow = (icon: any, label: string, value: any, isSubItem: boolean = false, rightComponent: any = null) => {
        const isRenderable = typeof value === 'string' || typeof value === 'number' || React.isValidElement(value);
        
        return (
            <View style={[ds.infoRow, isSubItem && ds.subItem]}>
                {icon}
                <View style={ds.infoTextContainer}>
                    <Text style={ds.infoLabel}>{label}</Text>
                    {isRenderable ? (
                        typeof value === 'object' ? value : <Text style={ds.infoValue}>{value}</Text>
                    ) : (
                        <Text style={ds.infoValue}>{t('patientDetailsModal.empty.na')}</Text>
                    )}
                </View>
                {rightComponent}
            </View>
        );
    };

    const renderNotificationBadge = (type: string) => {
        const isEmail = type === "Email";
        return (
            <View style={[ds.notificationBadge, isEmail ? ds.emailBadge : ds.smsBadge]}>
                <Text style={[ds.notificationText, isEmail ? { color: isDark ? "#A5B4FC" : "#1e40af" } : { color: isDark ? "#86EFAC" : "#166534" }]}>{type}</Text>
            </View>
        );
    };

    const renderConsent = (consent: any) => (
        <View style={ds.consentRow}>
            <View style={ds.consentTextContainer}>
                <Text style={ds.consentLabel}>{consent.title || consent.type}</Text>
            </View>
            <View style={ds.consentStatus}>
                <Feather 
                    name={consent.granted ? "check-circle" : "x-circle"} 
                    size={18} 
                    color={consent.granted ? tc.success : tc.error} 
                />
                <Text style={[ds.consentValue, { color: consent.granted ? tc.success : tc.error }]}>
                    {consent.granted ? t('patientDetailsModal.status.granted') : t('patientDetailsModal.status.notGranted')}
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
            <View style={ds.centeredView}>
                <View style={ds.modalView}>
                    {/* Header */}
                    <View style={ds.header}>
                        <View style={ds.patientHeaderLeft}>
                            <View style={ds.patientAvatar}>
                                <Feather name="user" size={28} color={tc.accent} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={ds.patientName}>{patient.name} {patient.lastName}</Text>
                                <Text style={ds.patientId}>PESEL: {patient.pesel}   ID: {patient.slug || patient._id?.substring(0, 8)}</Text>
                            </View>
                        </View>
                        <TouchableOpacity onPress={onClose} style={ds.closeButton}>
                            <Ionicons name="close" size={20} color={tc.textPrimary} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={ds.scrollView}>
                        {/* Basic Information */}
                        {renderSectionHeader(t('patientDetailsModal.sections.basicInfo'))}
                        {renderInfoRow(
                            <Feather name="user" size={18} color={tc.textMuted} style={ds.icon} />,
                            t('patientDetailsModal.labels.pesel'),
                            patient.pesel
                        )}
                        {renderInfoRow(
                            <Feather name="calendar" size={18} color={tc.textMuted} style={ds.icon} />,
                            t('patientDetailsModal.labels.dob'),
                            patient.dob ? new Date(patient.dob).toLocaleDateString() : t('patientDetailsModal.empty.na')
                        )}

                        {/* Address */}
                        {renderSectionHeader(t('patientDetailsModal.sections.address'))}
                        {renderInfoRow(
                            <Feather name="map-pin" size={18} color={tc.textMuted} style={ds.icon} />,
                            "",
                            `${personalData.street || ''} ${personalData.houseNumber || ''}${personalData.apartmentNumber ? '/' + personalData.apartmentNumber : ''}, ${personalData.postalCode || ''} ${personalData.city || ''}, ${personalData.country || ''}`.trim() || 'N/A'
                        )}

                        {/* Insurance */}
                        {renderSectionHeader(t('patientDetailsModal.sections.insurance'))}
                        {renderInfoRow(
                            <Feather name="shield" size={18} color={tc.textMuted} style={ds.icon} />,
                            t('patientDetailsModal.labels.insuranceType'),
                            patient.insuranceType || t('patientDetailsModal.empty.na')
                        )}
                        {renderInfoRow(
                            null,
                            t('patientDetailsModal.labels.insuranceNumber'),
                            patient.insuranceNumber || t('patientDetailsModal.empty.na'),
                        )}

                        {/* Patient Portal */}
                        {renderSectionHeader(t('patientDetailsModal.sections.portal'))}
                        {renderInfoRow(
                            <Feather name="message-square" size={18} color={tc.textMuted} style={ds.icon} />,
                            t('patientDetailsModal.labels.portalAccount'),
                            <Text style={ds.activeStatus}>{t('patientDetailsModal.status.active')}</Text>
                        )}
                        {renderInfoRow(
                            <Feather name="bell" size={18} color={tc.textMuted} style={ds.icon} />,
                            t('patientDetailsModal.labels.notifications'),
                            <View style={ds.notificationBadgesContainer}>
                                {patient.portal?.notifications?.map((type: string, index: number) => (
                                    <View key={index} style={{ marginRight: 5 }}>
                                        {renderNotificationBadge(type)}
                                    </View>
                                )) || <Text style={ds.infoValue}>{t('patientDetailsModal.empty.none')}</Text>}
                            </View>
                        )}

                        {/* Employer */}
                        {renderSectionHeader(t('patientDetailsModal.sections.employer'))}
                        {renderInfoRow(
                            <Feather name="briefcase" size={18} color={tc.textMuted} style={ds.icon} />,
                            "",
                            personalData.employer?.name || t('patientDetailsModal.empty.na')
                        )}
                        {renderInfoRow(
                            null,
                            "",
                            typeof personalData.employer?.address === 'string' ? personalData.employer.address : t('patientDetailsModal.empty.na'),
                            true
                        )}
                        {renderInfoRow(
                            <Feather name="phone" size={18} color={tc.textMuted} style={ds.icon} />,
                            "",
                            personalData.employer?.phone || t('patientDetailsModal.empty.na')
                        )}

                        {/* Authorized Persons */}
                        {renderSectionHeader(t('patientDetailsModal.sections.authorizedPersons'))}
                        {personalData.authorizedPersons?.length > 0 ? personalData.authorizedPersons.map((person: any, index: number) => (
                            <View key={index}>
                                {renderInfoRow(
                                    <Feather name="users" size={18} color={tc.textMuted} style={ds.icon} />,
                                    person.name,
                                    <View style={ds.relationBadge}>
                                        <Text style={ds.relationText}>{person.relation}</Text>
                                    </View>
                                )}
                                {renderInfoRow(
                                    <Feather name="file-text" size={18} color={tc.textMuted} style={ds.icon} />,
                                    t('patientDetailsModal.labels.idCard'),
                                    `${person.idCard}  (${t('patientDetailsModal.labels.validUntil')} ${person.validUntil})`
                                )}
                            </View>
                        )) : (
                            <Text style={[ds.infoValue, { paddingHorizontal: 47, paddingVertical: 10, color: tc.textMuted }]}>{t('patientDetailsModal.empty.noAuthorizedPersons')}</Text>
                        )}
  
                        {/* Consents */}
                        {renderSectionHeader(t('patientDetailsModal.sections.consents'))}
                        {personalData.consents?.length > 0 ? personalData.consents.map((consent: any, index: number) => (
                            <View key={index} style={ds.consentContainer}>
                                {renderConsent(consent)}
                            </View>
                        )) : (
                            <Text style={[ds.infoValue, { paddingHorizontal: 15, paddingVertical: 10, color: tc.textMuted }]}>{t('patientDetailsModal.empty.noConsents')}</Text>
                        )}
                    </ScrollView>

                    {/* Bottom Buttons */}
                    <View style={ds.buttonContainer}>
                        <PrimaryButton
                            label={t('patientDetailsModal.buttons.close')}
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
                            label={t('patientDetailsModal.buttons.editData')}
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

const createDynamicStyles = (tc: any, isDark: boolean) => StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    modalView: {
        width: '92%',
        maxHeight: '80%',
        backgroundColor: tc.cardBackground,
        borderRadius: 24,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: isDark ? 0.5 : 0.2,
        shadowRadius: 20,
        elevation: 10,
        borderWidth: isDark ? 1 : 0,
        borderColor: tc.borderSubtle,
    },
    header: {
        flexDirection: 'row',
        padding: 20,
        paddingTop: 25,
        backgroundColor: tc.cardBackgroundAlt,
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
        backgroundColor: tc.layer1,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    patientName: {
        fontSize: 20,
        fontWeight: '700',
        color: tc.textPrimary,
        marginBottom: 4,
    },
    patientId: {
        fontSize: 13,
        color: tc.textSecondary,
        lineHeight: 18,
    },
    closeButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: tc.layer2,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    scrollView: {
        flex: 1,
    },
    sectionHeader: {
        fontSize: 15,
        fontWeight: 'bold',
        color: tc.accent,
        paddingHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: tc.layer1,
        marginTop: 5,
    },
    infoRow: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 12,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: tc.borderSubtle,
    },
    subItem: {
        paddingLeft: 52,
    },
    icon: {
        marginRight: 12,
        width: 20,
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
        color: tc.textSecondary,
    },
    infoValue: {
        fontSize: 14,
        color: tc.textPrimary,
        fontWeight: '500',
    },
    activeStatus: {
        color: tc.success,
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
        backgroundColor: isDark ? 'rgba(59, 130, 246, 0.15)' : '#dbeafe',
    },
    smsBadge: {
        backgroundColor: isDark ? 'rgba(34, 197, 94, 0.15)' : '#dcfce7',
    },
    notificationText: {
        fontSize: 12,
        fontWeight: '500',
    },
    relationBadge: {
        backgroundColor: isDark ? 'rgba(59, 130, 246, 0.15)' : '#dbeafe',
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 15,
    },
    relationText: {
        fontSize: 12,
        color: isDark ? '#A5B4FC' : '#1e40af',
        fontWeight: '500',
    },
    consentContainer: {
        paddingHorizontal: 20,
    },
    consentRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: tc.borderSubtle,
    },
    consentTextContainer: {
        flex: 1,
    },
    consentLabel: {
        fontSize: 14,
        color: tc.textPrimary,
    },
    consentStatus: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    consentValue: {
        fontSize: 14,
        fontWeight: '500',
        marginLeft: 5,
    },
    consentDate: {
        fontSize: 12,
        color: tc.textMuted,
        marginLeft: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
        width: "100%",
        backgroundColor: tc.cardBackgroundAlt,
    },
});

export default PatientDetailsModal;