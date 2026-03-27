import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Platform,
    TextInput,
    Animated,
    Dimensions,
} from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
import Feather from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

const ActionModal = ({ visible, onClose, onView, onStart, onAddNote }: {
    visible: boolean;
    onClose: () => void;
    onView: () => void;
    onStart: () => void;
    onAddNote: (note?: string) => void;
}) => {
    const { t } = useTranslation();
    const insets = useSafeAreaInsets();
    const [showNoteInput, setShowNoteInput] = useState(false);
    const [note, setNote] = useState('');
    const [isMounted, setIsMounted] = useState(false);
    const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
    const backdropOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            setIsMounted(true);
            Animated.parallel([
                Animated.spring(slideAnim, {
                    toValue: 0,
                    damping: 22,
                    stiffness: 120,
                    mass: 0.8,
                    useNativeDriver: true,
                }),
                Animated.timing(backdropOpacity, {
                    toValue: 1,
                    duration: 250,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: SCREEN_HEIGHT,
                    duration: 250,
                    useNativeDriver: true,
                }),
                Animated.timing(backdropOpacity, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start(() => {
                setIsMounted(false);
                setShowNoteInput(false);
                setNote('');
            });
        }
    }, [visible]);

    const handleClose = () => {
        onClose();
    };

    const handleAddNote = () => {
        if (showNoteInput) {
            if (note.trim()) {
                onAddNote && onAddNote(note);
                setNote('');
                setShowNoteInput(false);
            }
        } else {
            setShowNoteInput(true);
        }
    };

    const actions = [
        {
            icon: 'eye',
            label: t('dashboard.actionModal.viewDetails'),
            color: '#4A90B9',
            bg: '#EBF5FA',
            onPress: onView,
        },
        {
            icon: 'file-text',
            label: t('dashboard.actionModal.addNote'),
            color: '#8B5CF6',
            bg: '#EDE9FE',
            onPress: handleAddNote,
        },
    ];

    if (!isMounted) return null;

    return (
        <View style={[StyleSheet.absoluteFill, { zIndex: 999, elevation: 999 }]}>
            <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
                <TouchableWithoutFeedback onPress={handleClose}>
                    <View style={{ flex: 1 }} />
                </TouchableWithoutFeedback>
            </Animated.View>

            <Animated.View
                style={[
                    styles.modalContainer,
                    {
                        paddingBottom: insets.bottom + 10,
                        transform: [{ translateY: slideAnim }],
                    },
                ]}
            >
                {/* Drag Handle */}
                <View style={styles.dragHandleContainer}>
                    <View style={styles.dragHandle} />
                </View>

                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerText}>{t('dashboard.actionModal.visitActions')}</Text>
                    <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
                        <Feather name="x" size={18} color="#9CA3AF" />
                    </TouchableOpacity>
                </View>

                <View style={styles.content}>
                    {/* Start Visit - Gradient CTA */}
                    <TouchableOpacity
                        style={styles.startVisitBtn}
                        onPress={onStart}
                        activeOpacity={0.85}
                    >
                        <LinearGradient
                            colors={['#4A90B9', '#5BA6B6', '#68BFB3']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.startVisitGradient}
                        >
                            <Feather name="play" size={18} color="white" />
                            <Text style={styles.startVisitText}>{t('visit.start')}</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    {/* Action Buttons */}
                    {actions.map((action, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.actionButton}
                            onPress={action.onPress}
                            activeOpacity={0.7}
                        >
                            <View style={[styles.actionIconBg, { backgroundColor: action.bg }]}>
                                <Feather name={action.icon} size={16} color={action.color} />
                            </View>
                            <Text style={styles.actionText}>{action.label}</Text>
                            <Feather name="chevron-right" size={16} color="#D1D5DB" />
                        </TouchableOpacity>
                    ))}

                    {/* Note Input */}
                    {showNoteInput && (
                        <View style={styles.noteInputContainer}>
                            <TextInput
                                style={styles.noteInput}
                                placeholder={t('dashboard.actionModal.notePlaceholder')}
                                placeholderTextColor="#9CA3AF"
                                multiline
                                value={note}
                                onChangeText={setNote}
                                autoFocus
                            />
                            <TouchableOpacity style={styles.submitNoteBtn} onPress={handleAddNote}>
                                <Text style={styles.submitNoteText}>{t('dashboard.actionModal.saveNote')}</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Cancel */}
                    <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={handleClose}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.cancelText}>{t('common.cancel')}</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    modalContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
    },
    dragHandleContainer: {
        alignItems: 'center',
        paddingTop: 10,
        paddingBottom: 4,
    },
    dragHandle: {
        width: 36,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#D1D5DB',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    headerText: {
        fontSize: 17,
        fontWeight: '700',
        color: '#1F2937',
    },
    closeBtn: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        padding: 20,
    },
    startVisitBtn: {
        borderRadius: 14,
        overflow: 'hidden',
        marginBottom: 14,
        ...Platform.select({
            ios: {
                shadowColor: '#4A90B9',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.25,
                shadowRadius: 8,
            },
            android: { elevation: 4 },
        }),
    },
    startVisitGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 54, // Use static height instead of padding
        width: '100%',
        gap: 10,
    },
    startVisitText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 13,
        paddingHorizontal: 14,
        borderRadius: 12,
        backgroundColor: '#FAFBFC',
        borderWidth: 1,
        borderColor: '#F0F2F5',
        marginBottom: 8,
    },
    actionIconBg: {
        width: 36,
        height: 36,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    actionText: {
        flex: 1,
        fontSize: 15,
        fontWeight: '500',
        color: '#374151',
    },
    noteInputContainer: {
        marginTop: 4,
        marginBottom: 8,
    },
    noteInput: {
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        padding: 14,
        fontSize: 14,
        minHeight: 100,
        textAlignVertical: 'top',
        backgroundColor: '#FAFBFC',
        color: '#1F2937',
        marginBottom: 10,
    },
    submitNoteBtn: {
        backgroundColor: '#4A90B9',
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
    },
    submitNoteText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 14,
    },
    cancelButton: {
        alignItems: 'center',
        paddingVertical: 14,
        marginTop: 4,
    },
    cancelText: {
        color: '#9CA3AF',
        fontSize: 14,
        fontWeight: '500',
    },
});

export default ActionModal;