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
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback onPress={() => { }}>
                        <View style={styles.modalContainer}>
                            <View style={styles.header}>

                                <TouchableOpacity
                                    onPress={onClose}
                                    style={styles.viewButton}>
                                    <Feather name="x" size={18} color="black" />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.content}>
                                {/* {showNoteInput ? (
                                    <View style={styles.noteInputContainer}>
                                        <TextInput
                                            style={styles.noteInput}
                                            placeholder="Enter your note here..."
                                            multiline={true}
                                            value={note}
                                            onChangeText={setNote}
                                            autoFocus={true}
                                        />
                                        <TouchableOpacity
                                            style={styles.submitNoteButton}
                                            onPress={handleAddNote}
                                        >
                                            <Text style={styles.submitNoteText}>Save Note</Text>
                                        </TouchableOpacity>
                                    </View>
                                ) : ( */}
                                <>
                                    <TouchableOpacity
                                        style={styles.actionButton}
                                        onPress={onView}
                                    >
                                        <View style={styles.buttonContent}>
                                            <View style={styles.viewButton}>
                                                <Feather name="eye" size={18} color="#58a6b8" />
                                            </View>
                                            <View style={{ width: 5 }} />
                                            <Text style={styles.actionButtonText}>View Details</Text>
                                        </View>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.actionButton}
                                        onPress={onPatientProfile}
                                    >
                                        <View style={styles.buttonContent}>
                                            <View style={styles.viewButton}>
                                                <Feather name="user" size={18} color="#58a6b8" />
                                            </View>
                                            <View style={{ width: 8 }} />
                                            <Text style={styles.actionButtonText}>Patient Profile</Text>
                                        </View>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[styles.actionButton]}
                                        onPress={onStart}
                                    >

                                        <View style={styles.buttonContent}>
                                            <View style={styles.viewButton}>
                                                <Feather name="calendar" size={18} color="#58a6b8" />
                                            </View>
                                            <View style={{ width: 5 }} />
                                            <Text style={styles.actionButtonText}>
                                                Add in Calendar
                                            </Text>
                                        </View>

                                    </TouchableOpacity>


                                    <TouchableOpacity
                                        style={[styles.actionButton, styles.deleteButton]}
                                        onPress={onDelete}
                                    >
                                        <View style={styles.buttonContent}>
                                            <View style={styles.viewButton}>
                                                <Feather name="trash-2" size={18} color="#FF3B30" />
                                            </View>
                                            <View style={{ width: 8 }} />
                                            <Text style={[styles.actionButtonText, styles.deleteButtonText]}>Delete Patient</Text>
                                        </View>
                                    </TouchableOpacity>

                                    {/* <TouchableOpacity
                                            style={[styles.actionButton]}
                                            onPress={handleCancel}
                                        >
                                            <View style={styles.buttonContent}>
                                                <View style={styles.viewButton}>
                                                    <Feather name="x" size={18} color="red" />
                                                </View>
                                                <View style={{ width: 5 }} />
                                                <Text style={styles.cancelButtonText}>Cancel</Text>
                                            </View>
                                        </TouchableOpacity> */}
                                </>
                                {/* )} */}
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback >
        </Modal >
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: 'white',
        borderRadius: 20,
        width: '65%',
        paddingVertical: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 10,
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
        color: '#333',
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
        marginBottom: 5,
        borderRadius: 10,
        backgroundColor: '#f8f8f8',
        borderColor: "#4A90B9",
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
        fontSize: 16,
        color: '#1A1C1E',
        fontWeight: '500',
    },
    deleteButton: {
        backgroundColor: '#FFF5F5',
        borderColor: '#FFE4E4',
    },
    deleteButtonText: {
        color: '#FF3B30',
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
        backgroundColor: '#f0f8fa',
    },
    cancelButton: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cancelButtonText: {
        fontSize: 16,
        color: '#666',
        fontWeight: '500',
    },
    noteInputContainer: {
        marginBottom: 15,
    },
    noteInput: {
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        minHeight: 120,
        textAlignVertical: 'top',
        backgroundColor: '#f9f9f9',
        marginBottom: 15,
    },
    submitNoteButton: {
        backgroundColor: '#58a6b8',
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