import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    TouchableWithoutFeedback,
    Dimensions,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '../../../hooks/useThemeColors';

const { width } = Dimensions.get('window');

interface ActionModalProps {
    visible: boolean;
    onClose: () => void;
    onView: () => void;
    onStart: () => void;
    onDelete: () => void;
    onPatientProfile: () => void;
    onAddNote?: (note: string) => void;
}


const ActionModal = ({ visible, onClose, onView, onStart, onDelete, onPatientProfile, onAddNote }: ActionModalProps) => {
    const { t } = useTranslation();
    const { colors: tc, isDark } = useThemeColors();
    const ds = createDynamicStyles(tc, isDark);
    
    const [showNoteInput, setShowNoteInput] = useState(false);
    const [note, setNote] = useState('');

    const handleAddNote = () => {
        if (showNoteInput) {
            // If note input is already shown, submit the note
            if (note.trim()) {
                onAddNote && onAddNote(note);
                setNote('');
                setShowNoteInput(false);
            }
        } else {
            // Show note input
            setShowNoteInput(true);
        }
    };

    const handleCancel = () => {
        setShowNoteInput(false);
        setNote('');
        onClose();
    };

    return (
        <Modal
            animationType='fade'
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={ds.overlay}>
                    <TouchableWithoutFeedback onPress={() => { }}>
                        <View style={ds.modalContainer}>
                            <View style={ds.header}>

                                <TouchableOpacity
                                    onPress={onClose}
                                    style={ds.viewButton}>
                                    <Feather name="x" size={18} color={tc.textPrimary} />
                                </TouchableOpacity>
                            </View>

                            <View style={ds.content}>
                                <>
                                    <TouchableOpacity
                                        style={ds.actionButton}
                                        onPress={onView}
                                    >
                                        <View style={ds.buttonContent}>
                                            <View style={ds.viewButton}>
                                                <Feather name="eye" size={18} color={tc.accent} />
                                            </View>
                                            <View style={{ width: 5 }} />
                                            <Text style={ds.actionButtonText}>{t('patientAction.viewDetails')}</Text>
                                        </View>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={ds.actionButton}
                                        onPress={onPatientProfile}
                                    >
                                        <View style={ds.buttonContent}>
                                            <View style={ds.viewButton}>
                                                <Feather name="user" size={18} color={tc.accent} />
                                            </View>
                                            <View style={{ width: 8 }} />
                                            <Text style={ds.actionButtonText}>{t('patientAction.patientProfile')}</Text>
                                        </View>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[ds.actionButton]}
                                        onPress={onStart}
                                    >

                                        <View style={ds.buttonContent}>
                                            <View style={ds.viewButton}>
                                                <Feather name="calendar" size={18} color={tc.accent} />
                                            </View>
                                            <View style={{ width: 5 }} />
                                            <Text style={ds.actionButtonText}>
                                                {t('patientAction.addInCalendar')}
                                            </Text>
                                        </View>

                                    </TouchableOpacity>


                                    <TouchableOpacity
                                        style={[ds.actionButton, ds.deleteButton]}
                                        onPress={onDelete}
                                    >
                                        <View style={ds.buttonContent}>
                                            <View style={ds.viewButton}>
                                                <Feather name="trash-2" size={18} color={tc.error} />
                                            </View>
                                            <View style={{ width: 8 }} />
                                            <Text style={[ds.actionButtonText, ds.deleteButtonText]}>{t('patientAction.deletePatient')}</Text>
                                        </View>
                                    </TouchableOpacity>
                                </>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback >
        </Modal >
    );
};

const createDynamicStyles = (tc: any, isDark: boolean) => StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: tc.cardBackground,
        borderRadius: 20,
        width: '65%',
        paddingVertical: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: isDark ? 0.5 : 0.25,
        shadowRadius: 10,
        elevation: 10,
        borderWidth: isDark ? 1 : 0,
        borderColor: tc.borderSubtle,
    },
    header: {
        flexDirection: "row",
        justifyContent: "flex-end",
        paddingTop: 15,
        alignItems: 'center',
        width: "85%",
        alignSelf: "center"
    },
    headerText: {
        fontSize: 18,
        fontWeight: '600',
        color: tc.textPrimary,
    },
    content: {
        padding: 15,
        width: "100%"
    },
    actionButton: {
        height: 50,
        width: '100%',
        alignItems: "center",
        justifyContent: "space-around",
        marginBottom: 10,
        borderRadius: 12,
        backgroundColor: tc.layer1,
        borderColor: tc.borderSubtle,
        borderWidth: 1,
        overflow: "hidden"
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "center",
        width: "100%",
    },
    actionButtonText: {
        fontSize: 15,
        color: tc.textPrimary,
        fontWeight: '500',
    },
    deleteButton: {
        backgroundColor: isDark ? 'rgba(239, 68, 68, 0.1)' : '#FFF5F5',
        borderColor: isDark ? 'rgba(239, 68, 68, 0.2)' : '#FFE4E4',
    },
    deleteButtonText: {
        color: tc.error,
        fontWeight: '600',
    },
    viewButton: {
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: "flex-end"
    },
    startButton: {
        borderRadius: 10,
        overflow: 'hidden',
    },
    gradientBackground: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
    },
    startButtonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 16,
        textAlign: 'center',
    },
    iconContainer: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        backgroundColor: tc.layer2,
    },
    cancelButton: {
        backgroundColor: tc.cardBackground,
        borderWidth: 1,
        borderColor: tc.borderColor,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cancelButtonText: {
        fontSize: 16,
        color: tc.textSecondary,
        fontWeight: '500',
    },
    noteInputContainer: {
        marginBottom: 15,
    },
    noteInput: {
        borderWidth: 1,
        borderColor: tc.borderColor,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        minHeight: 120,
        textAlignVertical: 'top',
        backgroundColor: tc.inputBackground,
        color: tc.textPrimary,
        marginBottom: 15,
    },
    submitNoteButton: {
        backgroundColor: tc.accent,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    submitNoteText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 16,
    },
});

export default ActionModal;