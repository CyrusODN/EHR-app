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
    KeyboardAvoidingView,
    Keyboard,
} from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
import Feather from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '../../../hooks/useThemeColors';

const ActionModal = ({ visible, onClose, onView, onStart, onAddNote }: {
    visible: boolean;
    onClose: () => void;
    onView: () => void;
    onStart: () => void;
    onAddNote: (note?: string) => void;
}) => {
    const { t } = useTranslation();
    const { colors: tc, isDark } = useThemeColors();
    const ds = createDynamicStyles(tc, isDark);
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
        Keyboard.dismiss();
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
            color: tc.accent,
            bg: tc.accentLight,
            onPress: onView,
        },
        {
            icon: 'file-text',
            label: t('dashboard.actionModal.addNote'),
            color: isDark ? '#A78BFA' : '#8B5CF6',
            bg: isDark ? 'rgba(139, 92, 246, 0.15)' : '#EDE9FE',
            onPress: handleAddNote,
        },
    ];

    if (!isMounted) return null;

    return (
        <View style={[StyleSheet.absoluteFill, { zIndex: 999, elevation: 999 }]}>
            <Animated.View style={[ds.backdrop, { opacity: backdropOpacity }]}>
                <TouchableWithoutFeedback onPress={handleClose}>
                    <View style={{ flex: 1 }} />
                </TouchableWithoutFeedback>
            </Animated.View>

            <KeyboardAvoidingView
                style={ds.keyboardAvoidingContainer}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                pointerEvents="box-none"
            >
                <Animated.View
                    style={[
                        ds.modalContainer,
                        {
                            paddingBottom: insets.bottom + 10,
                            transform: [{ translateY: slideAnim }],
                        },
                    ]}
                >
                    {/* Drag Handle */}
                    <View style={ds.dragHandleContainer}>
                        <View style={ds.dragHandle} />
                    </View>

                    {/* Header */}
                    <View style={ds.header}>
                        <Text style={ds.headerText}>{t('dashboard.actionModal.visitActions')}</Text>
                        <TouchableOpacity
                            onPress={handleClose}
                            style={ds.closeBtn}
                        >
                            <Feather name="x" size={18} color={tc.textMuted} />
                        </TouchableOpacity>
                    </View>

                    <View style={ds.content}>
                        {!showNoteInput ? (
                            <>
                                {/* Start Visit - Gradient CTA */}
                                <TouchableOpacity
                                    style={ds.startVisitBtn}
                                    onPress={onStart}
                                    activeOpacity={0.85}
                                >
                                    <LinearGradient
                                        colors={['#4A90B9', '#5BA6B6', '#68BFB3']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        style={ds.startVisitGradient}
                                    >
                                        <Feather name="play" size={18} color="white" />
                                        <Text style={ds.startVisitText}>{t('visit.start')}</Text>
                                    </LinearGradient>
                                </TouchableOpacity>

                                {/* Action Buttons */}
                                {actions.map((action, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={ds.actionButton}
                                        onPress={action.onPress}
                                        activeOpacity={0.7}
                                    >
                                        <View style={[ds.actionIconBg, { backgroundColor: action.bg }]}>
                                            <Feather name={action.icon} size={16} color={action.color} />
                                        </View>
                                        <Text style={ds.actionText}>{action.label}</Text>
                                        <Feather name="chevron-right" size={16} color={tc.borderStrong} />
                                    </TouchableOpacity>
                                ))}
                            </>
                        ) : (
                            <View style={ds.noteInputContainer}>
                                <TextInput
                                    style={ds.noteInput}
                                    placeholder={t('dashboard.actionModal.notePlaceholder')}
                                    placeholderTextColor={tc.textMuted}
                                    multiline
                                    value={note}
                                    onChangeText={setNote}
                                    autoFocus
                                    blurOnSubmit={false}
                                    returnKeyType="default"
                                />
                                <TouchableOpacity style={ds.submitNoteBtn} onPress={handleAddNote}>
                                    <Text style={ds.submitNoteText}>{t('dashboard.actionModal.saveNote')}</Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        {/* Cancel/Back */}
                        <TouchableOpacity
                            style={ds.cancelButton}
                            onPress={() => {
                                if (showNoteInput) {
                                    setShowNoteInput(false);
                                    setNote('');
                                    Keyboard.dismiss();
                                    return;
                                }
                                handleClose();
                            }}
                            activeOpacity={0.7}
                        >
                            <Text style={ds.cancelText}>{showNoteInput ? t('common.back') : t('common.cancel')}</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </KeyboardAvoidingView>
        </View>
    );
};

const createDynamicStyles = (tc: any, isDark: boolean) => StyleSheet.create({
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    keyboardAvoidingContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end',
    },
    modalContainer: {
        width: '100%',
        maxHeight: SCREEN_HEIGHT * 0.88,
        backgroundColor: tc.modalBg,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        borderWidth: isDark ? 1 : 0,
        borderColor: tc.borderSubtle,
    },
    dragHandleContainer: {
        alignItems: 'center',
        paddingTop: 12,
        paddingBottom: 6,
    },
    dragHandle: {
        width: 40,
        height: 5,
        borderRadius: 2.5,
        backgroundColor: tc.borderStrong,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: tc.borderSubtle,
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: tc.textPrimary,
    },
    closeBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        padding: 20,
        paddingBottom: 28,
    },
    startVisitBtn: {
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 16,
        ...Platform.select({
            ios: {
                shadowColor: tc.accent,
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: isDark ? 0.3 : 0.15,
                shadowRadius: 12,
            },
            android: { elevation: 6 },
        }),
    },
    startVisitGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 56,
        width: '100%',
        gap: 12,
    },
    startVisitText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 17,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 14,
        backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#FAFBFC',
        borderWidth: 1.5,
        borderColor: tc.borderSubtle,
        marginBottom: 10,
    },
    actionIconBg: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    actionText: {
        flex: 1,
        fontSize: 16,
        fontWeight: '600',
        color: tc.textPrimary,
    },
    noteInputContainer: {
        marginTop: 6,
        marginBottom: 10,
    },
    noteInput: {
        borderWidth: 1.5,
        borderColor: tc.borderSubtle,
        borderRadius: 16,
        padding: 16,
        fontSize: 15,
        minHeight: 110,
        textAlignVertical: 'top',
        backgroundColor: isDark ? 'rgba(0,0,0,0.2)' : '#FAFBFC',
        color: tc.textPrimary,
        marginBottom: 12,
    },
    submitNoteBtn: {
        backgroundColor: tc.accent,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    submitNoteText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 15,
    },
    cancelButton: {
        alignItems: 'center',
        marginTop: 6,
    },
    cancelText: {
        color: tc.textMuted,
        fontSize: 15,
        fontWeight: '600',
    },
});

export default ActionModal;