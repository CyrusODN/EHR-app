import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Animated,
} from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import PrimaryButton from '../../../component/button';
import CustomDropdown from '../../../component/customDropDown';
import Gap from '../../../component/gap';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { getConsultSessions, createConsultSession, getConsultSessionDetails, sendConsultMessage, deleteConsultSession } from '../../../Services/ConsultTool.Service';
import {
    extractToolMessage,
    extractToolSessionId,
    extractToolSessions,
    resolveChatbotServiceToken,
} from '../../../utils/aiTools';
interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    time: string;
}

interface ConsultChatProps {
    serviceToken: string | null;
    onShowAlert?: (message: string, type: 'success' | 'warning' | 'error') => void;
}

const ConsultChat = ({ serviceToken: propServiceToken, onShowAlert }: ConsultChatProps) => {
    const { t, i18n } = useTranslation();
    const { colors: tc, isDark } = useThemeColors();
    const ds = createDynamicStyles(tc, isDark);
    const [serviceToken, setServiceToken] = useState<string | null>(propServiceToken || null);
    const [selectedSpecialty, setSelectedSpecialty] = useState('Child Psychiatry');
    const [chatStarted, setChatStarted] = useState(false);
    const [messageText, setMessageText] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [isAiThinking, setIsAiThinking] = useState(false);
    const [isStartingSession, setIsStartingSession] = useState(false);
    const scrollViewRef = useRef<ScrollView>(null);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const drawerAnim = useRef(new Animated.Value(-wp(70)).current;
    const backdropAnim = useRef(new Animated.Value(0)).current;

    const [sessions, setSessions] = useState<any[]>([]);
    const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

    useEffect(() => {
        if (propServiceToken) {
            setServiceToken(propServiceToken);
        }
    }, [propServiceToken]);

    useEffect(() => {
        const initializeToken = async () => {
            if (serviceToken) return;

            try {
                const token = await resolveChatbotServiceToken(null);
                if (token) {
                    setServiceToken(token);
                }
            } catch (error) {
                console.error('[ConsultChat] Error fetching service token:', error);
            }
        };

        initializeToken();
    }, [serviceToken]);

    const fetchSessions = async (token: string) => {
        console.log('[ConsultChat] Fetching sessions with token:', token.substring(0, 15) + '...');
        try {
            const response: any = await getConsultSessions(token);
            const sessionList = extractToolSessions(response);
            if (sessionList.length > 0 || response?.success) {
                setSessions(sessionList);
                console.log('[ConsultChat] Sessions fetched successfully. Count:', sessionList.length);
            } else {
                console.warn('[ConsultChat] Failed to fetch sessions successfully:', response?.message);
            }
        } catch (error) {
            console.error('[ConsultChat] Error in fetchSessions:', error);
        }
    };

    useEffect(() => {
        if (serviceToken) {
            fetchSessions(serviceToken);
        }
    }, [serviceToken]);

    // Animated dots for thinking indicator
    const dot1 = useRef(new Animated.Value(0.3)).current;
    const dot2 = useRef(new Animated.Value(0.3)).current;
    const dot3 = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        if (!isAiThinking) return;

        const animateDot = (dot: Animated.Value, delay: number) => {
            return Animated.loop(
                Animated.sequence([
                    Animated.delay(delay),
                    Animated.timing(dot, {
                        toValue: 1,
                        duration: 400,
                        useNativeDriver: true,
                    }),
                    Animated.timing(dot, {
                        toValue: 0.3,
                        duration: 400,
                        useNativeDriver: true,
                    }),
                ])
            );
        };

        const a1 = animateDot(dot1, 0);
        const a2 = animateDot(dot2, 200);
        const a3 = animateDot(dot3, 400);
        a1.start();
        a2.start();
        a3.start();

        return () => {
            a1.stop();
            a2.stop();
            a3.stop();
            dot1.setValue(0.3);
            dot2.setValue(0.3);
            dot3.setValue(0.3);
        };
    }, [isAiThinking]);

    const specialtyOptions = [
        { label: t('aiAssistant.consultChat.childPsychiatry'), value: 'Child Psychiatry' },
        { label: t('aiAssistant.consultChat.adultPsychiatry'), value: 'Adult Psychiatry' },
        { label: t('aiAssistant.consultChat.internalMedicine'), value: 'Internal Medicine' },
    ];

    const getCurrentTime = () => {
        const now = new Date();
        return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    };

    const handleStartConsultation = async () => {
        if (!selectedSpecialty || isStartingSession) {
            return;
        }

        const specialtyMap: { [key: string]: string } = {
            'Child Psychiatry': 'childPsychiatry',
            'Adult Psychiatry': 'adultPsychiatry',
            'Internal Medicine': 'internalMedicine'
        };
        const specialtyKey = specialtyMap[selectedSpecialty] || 'childPsychiatry';

        setIsStartingSession(true);

        try {
            const token = await resolveChatbotServiceToken(serviceToken);
            if (!token) {
                if (onShowAlert) {
                    onShowAlert(t('aiAssistant.consultChat.failedStartSession'), 'error');
                }
                return;
            }

            if (token !== serviceToken) {
                setServiceToken(token);
            }

            const response: any = await createConsultSession(token, specialtyKey);
            const sessionId = extractToolSessionId(response);

            if (!sessionId) {
                console.error('[ConsultChat] Failed to create backend session:', response?.message);
                if (onShowAlert) {
                    onShowAlert(response?.message || t('aiAssistant.consultChat.failedStartSession'), 'error');
                }
                return;
            }

            setCurrentSessionId(sessionId);
            setChatStarted(true);
            setMessages([
                {
                    id: '1',
                    text: t('aiAssistant.consultChat.welcomeMessage', { specialty: selectedSpecialty }),
                    sender: 'ai',
                    time: getCurrentTime(),
                },
            ]);

            fetchSessions(token);
        } catch (error) {
            console.error('[ConsultChat] Error creating backend session:', error);
            if (onShowAlert) {
                onShowAlert(t('aiAssistant.consultChat.failedStartSession'), 'error');
            }
        } finally {
            setIsStartingSession(false);
        }
    };

    const handleSendMessage = async () => {
        if (!messageText.trim()) return;
        
        const text = messageText.trim();
        const time = getCurrentTime();
        const userMessage: Message = {
            id: Date.now().toString(),
            text: text,
            sender: 'user',
            time: time,
        };
        
        setMessages(prev => [...prev, userMessage]);
        setMessageText('');
        setIsAiThinking(true);

        if (!currentSessionId) {
            setIsAiThinking(false);
            if (onShowAlert) {
                onShowAlert(t('aiAssistant.consultChat.failedStartSession'), 'error');
            }
            return;
        }

        try {
            const token = await resolveChatbotServiceToken(serviceToken);
            if (!token) {
                if (onShowAlert) {
                    onShowAlert(t('aiAssistant.consultChat.failedStartSession'), 'error');
                }
                return;
            }

            if (token !== serviceToken) {
                setServiceToken(token);
            }

            const response: any = await sendConsultMessage(token, {
                message: text,
                sessionId: currentSessionId,
            });

            const aiText = extractToolMessage(response);
            if (aiText) {
                const aiMessage: Message = {
                    id: Date.now().toString(),
                    text: aiText,
                    sender: 'ai',
                    time: getCurrentTime(),
                };
                setMessages(prev => [...prev, aiMessage]);
            } else {
                console.warn('[ConsultChat] Failed to get AI response:', response?.message);
                if (onShowAlert) {
                    onShowAlert(response?.message || t('aiAssistant.consultChat.failedAiResponse'), 'error');
                }
            }
        } catch (error) {
            console.error('[ConsultChat] Error sending message:', error);
            if (onShowAlert) {
                onShowAlert(t('aiAssistant.consultChat.failedAiResponse'), 'error');
            }
        } finally {
            setIsAiThinking(false);
        }
    };

    const toggleHistory = () => {
        const toOpen = !isHistoryOpen;
        const toValue = toOpen ? 0 : -wp(70);
        const backdropToValue = toOpen ? 1 : 0;

        Animated.parallel([
            Animated.timing(drawerAnim, {
                toValue,
                duration: 300,
                useNativeDriver: false,
            }),
            Animated.timing(backdropAnim, {
                toValue: backdropToValue,
                duration: 300,
                useNativeDriver: false,
            }),
        ]).start();
        setIsHistoryOpen(toOpen);
    };

    const handleBackToSelection = () => {
        setChatStarted(false);
        setMessages([]);
        setMessageText('');
        setIsAiThinking(false);
        setCurrentSessionId(null);
    };

    const handleNewSession = () => {
        handleBackToSelection();
        toggleHistory();
    };

    const handleSelectSession = async (sessionId: string) => {
        if (!serviceToken) {
            console.warn("[ConsultChat] Cannot load session: No service token available");
            return;
        }

        console.log(`[ConsultChat] Loading session: ${sessionId}`);
        
        try {
            const response: any = await getConsultSessionDetails(serviceToken, sessionId);
            
            if (response?.success && response.data) {
                // Convert historical messages to component's Message format
                const historicalMessages: Message[] = response.data.messages.map((m: any) => ({
                    id: m._id || Date.now().toString() + Math.random().toString().substring(2, 7),
                    text: m.content,
                    sender: m.role === 'assistant' ? 'ai' : 'user',
                    time: m.timestamp ? new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : getCurrentTime(),
                }));

                setMessages(historicalMessages);
                setCurrentSessionId(sessionId);
                
                // Map API specialty key to UI label
                const specialtyKey = response.data.metadata?.speciality;
                const specialtyMap: { [key: string]: string } = {
                    'childPsychiatry': 'Child Psychiatry',
                    'adultPsychiatry': 'Adult Psychiatry',
                    'internalMedicine': 'Internal Medicine'
                };
                
                if (specialtyKey && specialtyMap[specialtyKey]) {
                    setSelectedSpecialty(specialtyMap[specialtyKey]);
                }

                setChatStarted(true);
                setIsHistoryOpen(false);
                
                // Close the drawer animation
                Animated.parallel([
                    Animated.timing(drawerAnim, {
                        toValue: -wp(70),
                        duration: 300,
                        useNativeDriver: false,
                    }),
                    Animated.timing(backdropAnim, {
                        toValue: 0,
                        duration: 300,
                        useNativeDriver: false,
                    }),
                ]).start();

                console.log("[ConsultChat] Session loaded and history populated");
            } else {
                console.warn("[ConsultChat] Failed to load session details:", response?.message);
            }
        } catch (error) {
            console.error("[ConsultChat] Error in handleSelectSession:", error);
        }
    };

    const handleDeleteSession = async (sessionId: string) => {
        if (!serviceToken) return;

        console.log(`[ConsultChat] Deleting session: ${sessionId}`);
        try {
            const response: any = await deleteConsultSession(serviceToken, sessionId);
            if (response?.success) {
                // Remove from local state
                setSessions(prev => prev.filter(s => s.sessionId !== sessionId));
                
                // If it was the current session, reset chat
                if (currentSessionId === sessionId) {
                    handleBackToSelection();
                }

                if (onShowAlert) {
                    onShowAlert(t('aiAssistant.consultChat.sessionDeletedSuccess'), 'success');
                }
                console.log("[ConsultChat] Session deleted and list updated");
            } else {
                console.warn("[ConsultChat] Failed to delete session:", response?.message);
                if (onShowAlert) {
                    onShowAlert(response?.message || t('aiAssistant.consultChat.failedDeleteSession'), 'error');
                }
            }
        } catch (error) {
            console.error("[ConsultChat] Error in handleDeleteSession:", error);
        }
    };

    // ─── Main Render ───
    return (
        <View style={ds.container}>
            {/* Backdrop Overlay */}
            <Animated.View 
                pointerEvents={isHistoryOpen ? 'auto' : 'none'}
                style={[
                    ds.backdrop, 
                    { 
                        opacity: backdropAnim,
                    }
                ]} 
            >
                <TouchableOpacity 
                    activeOpacity={1} 
                    style={{ flex: 1 }} 
                    onPress={toggleHistory} 
                />
            </Animated.View>

            {/* History Drawer */}
            <Animated.View style={[ds.drawer, { left: drawerAnim }]}>
                <View style={ds.drawerHeader}>
                    <Text style={ds.drawerTitle}>{t('aiAssistant.consultChat.visitHistory')}</Text>
                    <View style={ds.drawerHeaderActions}>
                        <TouchableOpacity onPress={handleNewSession} style={ds.drawerActionBtn}>
                            <Feather name="plus" size={20} color={tc.textPrimary} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={toggleHistory} style={ds.drawerActionBtn}>
                            <Feather name="chevron-left" size={20} color={tc.textPrimary} />
                        </TouchableOpacity>
                    </View>
                </View>
                <ScrollView style={ds.sessionList}>
                    {sessions.map((session, index) => (
                        <TouchableOpacity 
                            key={session._id || session.sessionId || index} 
                            style={[ds.sessionItem, currentSessionId === session.sessionId && ds.activeSessionItem]}
                            onPress={() => handleSelectSession(session.sessionId)}
                        >
                            <View style={ds.sessionIconContainer}>
                                <Ionicons name="chatbubble-outline" size={18} color={tc.accent} />
                            </View>
                            <View style={ds.sessionInfo}>
                                <Text style={ds.sessionIdText}>{t('aiAssistant.consultChat.session')} #{session.sessionId?.substring(0, 8)}</Text>
                                <View style={ds.sessionMetaRow}>
                                    <View style={ds.sessionTag}>
                                        <Text style={ds.sessionTagText}>
                                            {session.metadata?.speciality === 'childPsychiatry' ? t('aiAssistant.consultChat.childPsychShort') : 
                                             session.metadata?.speciality === 'adultPsychiatry' ? t('aiAssistant.consultChat.adultPsychShort') :
                                             session.metadata?.speciality === 'internalMedicine' ? t('aiAssistant.consultChat.internalShort') : t('aiAssistant.consultChat.generalShort')}
                                        </Text>
                                    </View>
                                    <View style={ds.sessionDateRow}>
                                        <Feather name="clock" size={12} color={tc.textMuted} />
                                        <Text style={ds.sessionDateText}>
                                            {session.createdAt ? new Date(session.createdAt).toLocaleDateString(i18n.language === 'pl' ? 'pl-PL' : 'en-GB', { day: 'numeric', month: 'short' }) : '10 Mar'}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                            <TouchableOpacity 
                                onPress={() => handleDeleteSession(session.sessionId)}
                                style={ds.deleteBtn}
                            >
                                <Feather name="trash-2" size={16} color={tc.error || "#EF4444"} />
                            </TouchableOpacity>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </Animated.View>

            {!chatStarted ? (
                <View style={ds.chatWrapper}>
                    {/* Header for Selection Screen */}
                    <View style={ds.chatHeader}>
                        <TouchableOpacity onPress={toggleHistory} style={ds.menuBtn}>
                            <Feather name="menu" size={22} color={tc.accent} />
                        </TouchableOpacity>
                        <View style={ds.chatHeaderTitleContainer}>
                            <Text style={ds.chatHeaderTitle}>{t('aiAssistant.consultChat.clinicalAssistant')}</Text>
                        </View>
                    </View>

                    <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={ds.messagesContainer}>
                        <View style={ds.selectionContainer}>
                            {/* Chat Icon */}
                            <View style={ds.chatIconCircle}>
                                <Ionicons name="chatbubble-outline" size={28} color={tc.accent} />
                            </View>

                            <Gap height={hp(2)} />

                            <Text style={ds.selectionDesc}>
                                {t('aiAssistant.consultChat.selectionDesc')}
                            </Text>

                            <Gap height={hp(3)} />

                            {/* Specialty Dropdown */}
                            <Text style={ds.selectLabel}>{t('aiAssistant.consultChat.selectSpecialty')}</Text>
                            <Gap height={hp(1)} />
                            <CustomDropdown
                                placeholder={t('aiAssistant.consultChat.chooseSpecialty')}
                                options={specialtyOptions}
                                value={selectedSpecialty}
                                onChange={(value) => setSelectedSpecialty(String(value))}
                                icon={undefined}
                            />

                            <Gap height={hp(2.5)} />

                            {/* Start Button */}
                            <PrimaryButton
                                label={t('aiAssistant.consultChat.startNewConsultation')}
                                filled={true}
                                onPress={handleStartConsultation}
                                style={ds.startBtn}
                                disabled={!selectedSpecialty || isStartingSession}
                                loading={isStartingSession}
                            />
                        </View>
                    </ScrollView>
                </View>
            ) : (
                <KeyboardAvoidingView
                    style={ds.chatWrapper}
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? hp(18) : 0}
                >
                    {/* Chat Header */}
                    <View style={ds.chatHeader}>
                        <TouchableOpacity onPress={toggleHistory} style={ds.menuBtn}>
                            <Feather name="menu" size={22} color={tc.textPrimary} />
                        </TouchableOpacity>
                        <View style={ds.chatHeaderTitleContainer}>
                            <Text style={ds.chatHeaderTitle}>{t('aiAssistant.consultChat.clinicalAssistant')}</Text>
                        </View>
                        <TouchableOpacity onPress={handleBackToSelection} style={ds.menuBtn}>
                            <MaterialCommunityIcons name="refresh" size={22} color={tc.textPrimary} />
                        </TouchableOpacity>
                    </View>

                    {/* Messages */}
                    <ScrollView
                        ref={scrollViewRef}
                        style={ds.messagesContainer}
                        contentContainerStyle={ds.messagesContent}
                        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
                    >
                        {messages.map((msg) => (
                            <View
                                key={msg.id}
                                style={[
                                    ds.messageBubbleRow,
                                    msg.sender === 'user' ? ds.userRow : ds.aiRow,
                                ]}
                            >
                                <View
                                    style={[
                                        ds.messageBubble,
                                        msg.sender === 'user' ? ds.userBubble : ds.aiBubble,
                                    ]}
                                >
                                    <Text
                                        style={[
                                            ds.messageText,
                                            msg.sender === 'user' ? ds.userMessageText : ds.aiMessageText,
                                        ]}
                                    >
                                        {msg.text}
                                    </Text>
                                    <Text
                                        style={[
                                            ds.messageTime,
                                            msg.sender === 'user' ? ds.userTimeText : ds.aiTimeText,
                                        ]}
                                    >
                                        {msg.time}
                                    </Text>
                                </View>
                            </View>
                        ))}

                        {/* AI Thinking Indicator */}
                        {isAiThinking && (
                            <View style={[ds.messageBubbleRow, ds.aiRow]}>
                                <View style={[ds.messageBubble, ds.aiBubble, ds.thinkingBubble]}>
                                    <View style={ds.thinkingContent}>
                                        <View style={ds.thinkingDots}>
                                            <Animated.View style={[ds.thinkingDot, { opacity: dot1 }]} />
                                            <Animated.View style={[ds.thinkingDot, { opacity: dot2 }]} />
                                            <Animated.View style={[ds.thinkingDot, { opacity: dot3 }]} />
                                        </View>
                                        <Text style={ds.thinkingText}>{t('aiAssistant.consultChat.aiThinking')}</Text>
                                    </View>
                                </View>
                            </View>
                        )}
                    </ScrollView>

                    {/* Message Input */}
                    <View style={ds.inputBar}>
                        <TextInput
                            style={ds.chatInput}
                            placeholder={t('aiAssistant.consultChat.askPlaceholder')}
                            placeholderTextColor={tc.textMuted}
                            value={messageText}
                            onChangeText={setMessageText}
                            onSubmitEditing={handleSendMessage}
                            returnKeyType="send"
                        />
                        <TouchableOpacity
                            style={[
                                ds.sendBtn,
                                (!messageText.trim() || isAiThinking) && ds.sendBtnDisabled,
                            ]}
                            onPress={handleSendMessage}
                            disabled={!messageText.trim() || isAiThinking}
                        >
                            <Ionicons name="send" size={18} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            )}
        </View>
    );
};

const createDynamicStyles = (tc: any, isDark: boolean) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: tc.screenBackground,
    },
    /* ─── Drawer Styles ─── */
    drawer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        width: wp(70),
        backgroundColor: tc.drawerBg,
        zIndex: 1000,
        borderRightWidth: 1,
        borderRightColor: tc.borderSubtle,
        elevation: 10,
        shadowColor: tc.shadow,
        shadowOffset: { width: 2, height: 0 },
        shadowOpacity: isDark ? 0.4 : 0.15,
        shadowRadius: 10,
    },
    backdrop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        zIndex: 999,
    },
    drawerHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: tc.borderSubtle,
    },
    drawerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: tc.textPrimary,
    },
    drawerHeaderActions: {
        flexDirection: 'row',
        gap: 12,
    },
    drawerActionBtn: {
        padding: 4,
    },
    sessionList: {
        flex: 1,
    },
    sessionItem: {
        flexDirection: 'row',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: tc.borderSubtle,
        alignItems: 'center',
    },
    activeSessionItem: {
        backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#F1F5F9',
    },
    sessionIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: isDark ? 'rgba(74, 144, 185, 0.15)' : '#EBF5FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    sessionInfo: {
        flex: 1,
    },
    sessionIdText: {
        fontSize: 15,
        fontWeight: '600',
        color: tc.textPrimary,
        marginBottom: 4,
    },
    sessionMetaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    sessionTag: {
        backgroundColor: isDark ? tc.layer2 : '#E2E8F0',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    sessionTagText: {
        fontSize: 12,
        color: tc.textSecondary,
        fontWeight: '500',
    },
    sessionDateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    sessionDateText: {
        fontSize: 12,
        color: tc.textMuted,
    },
    deleteBtn: {
        padding: 8,
        marginLeft: 4,
    },
    /* ─── Selection Screen ─── */
    selectionContainer: {
        backgroundColor: tc.cardBackground,
        margin: 15,
        borderRadius: 12,
        padding: 24,
        alignItems: 'center',
        shadowColor: tc.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isDark ? 0.2 : 0.08,
        shadowRadius: 4,
        elevation: 3,
        borderWidth: isDark ? 1 : 0,
        borderColor: tc.borderSubtle,
    },
    chatIconCircle: {
        width: 60,
        height: 60,
        borderRadius: 16,
        backgroundColor: isDark ? 'rgba(74, 144, 185, 0.15)' : '#EBF5FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: hp(4),
    },
    selectionDesc: {
        fontSize: 15,
        color: tc.textSecondary,
        textAlign: 'center',
        lineHeight: 22,
        paddingHorizontal: 20,
    },
    selectLabel: {
        fontSize: 16,
        fontWeight: '700',
        color: tc.textPrimary,
        alignSelf: 'flex-start',
    },
    startBtn: {
        width: '100%',
        height: hp(5.5),
        marginBottom: 0,
        borderRadius: 10,
    },

    /* ─── Chat Screen ─── */
    chatWrapper: {
        flex: 1,
        backgroundColor: tc.screenBackground,
        overflow: 'hidden',
    },
    chatHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 18,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: tc.borderSubtle,
        backgroundColor: tc.cardBackground,
    },
    menuBtn: {
        width: wp(10),
        height: hp(4.5),
        borderRadius: 10,
        backgroundColor: isDark ? 'rgba(74, 144, 185, 0.15)' : '#EBF5FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: wp(2), 
    },
    chatHeaderTitleContainer: {
        flex: 1,
    },
    chatHeaderTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: tc.textPrimary,
    },
    messagesContainer: {
        flex: 1,
        backgroundColor: tc.screenBackground,
    },
    messagesContent: {
        padding: 16,
        paddingBottom: 8,
    },
    messageBubbleRow: {
        marginBottom: 16,
        flexDirection: 'row',
    },
    userRow: {
        justifyContent: 'flex-end',
    },
    aiRow: {
        justifyContent: 'flex-start',
    },
    messageBubble: {
        maxWidth: '80%',
        padding: 14,
        borderRadius: 14,
    },
    userBubble: {
        backgroundColor: tc.accent,
        borderBottomRightRadius: 4,
    },
    aiBubble: {
        backgroundColor: tc.cardBackground,
        borderBottomLeftRadius: 4,
        borderWidth: 1,
        borderColor: tc.borderSubtle,
    },
    messageText: {
        fontSize: 14,
        lineHeight: 20,
    },
    userMessageText: {
        color: '#FFFFFF',
    },
    aiMessageText: {
        color: tc.textPrimary,
    },
    messageTime: {
        fontSize: 11,
        marginTop: 6,
    },
    userTimeText: {
        color: 'rgba(255,255,255,0.7)',
        textAlign: 'right',
        fontSize: 10,
    },
    aiTimeText: {
        color: tc.textMuted,
        fontSize: 10,
    },
    inputBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: Platform.OS === 'ios' ? 30 : 16, 
        borderTopWidth: 1,
        borderTopColor: tc.borderSubtle,
        backgroundColor: tc.cardBackground,
        gap: 10,
    },
    chatInput: {
        flex: 1,
        height: 44,
        borderWidth: 1,
        borderColor: tc.borderSubtle,
        borderRadius: 22,
        paddingHorizontal: 16,
        fontSize: 14,
        color: tc.textPrimary,
        backgroundColor: tc.inputBackground,
    },
    sendBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: tc.accent,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendBtnDisabled: {
        backgroundColor: isDark ? 'rgba(74, 144, 185, 0.3)' : '#B0D4E8',
    },
    thinkingBubble: {
        paddingVertical: 16,
        paddingHorizontal: 18,
    },
    thinkingContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    thinkingDots: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    thinkingDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: tc.accent,
    },
    thinkingText: {
        fontSize: 14,
        color: tc.textMuted,
        fontStyle: 'italic',
    },
});

export default ConsultChat;
