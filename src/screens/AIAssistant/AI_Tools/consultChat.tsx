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
import { getConsultSessions, createConsultSession, getConsultSessionDetails, sendConsultMessage, deleteConsultSession } from '../../../Services/ConsultTool.Service';
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

const ConsultChat = ({ serviceToken, onShowAlert }: ConsultChatProps) => {
    const { t, i18n } = useTranslation();
    const [selectedSpecialty, setSelectedSpecialty] = useState('Child Psychiatry');
    const [chatStarted, setChatStarted] = useState(false);
    const [messageText, setMessageText] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [isAiThinking, setIsAiThinking] = useState(false);
    const scrollViewRef = useRef<ScrollView>(null);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const drawerAnim = useRef(new Animated.Value(-wp(70))).current;

    const [sessions, setSessions] = useState<any[]>([]);
    const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

    useEffect(() => {
        if (serviceToken) {
            const fetchSessions = async () => {
                console.log("[ConsultChat] Fetching sessions with token:", serviceToken.substring(0, 15) + "...");
                try {
                    const response: any = await getConsultSessions(serviceToken);
                    if (response?.success) {
                        setSessions(response.data);
                        console.log("[ConsultChat] Sessions fetched successfully. Count:", response.data?.length);
                    } else {
                        console.warn("[ConsultChat] Failed to fetch sessions successfully:", response?.message);
                    }
                } catch (error) {
                    console.error("[ConsultChat] Error in fetchSessions:", error);
                }
            };
            fetchSessions();
        } else {
            console.log("[ConsultChat] No service token available yet - skipping session fetch");
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
        if (!selectedSpecialty) {
            console.warn("[ConsultChat] Cannot start consultation: No specialty selected");
            return;
        }

        // Map specialty labels to API keys
        const specialtyMap: { [key: string]: string } = {
            'Child Psychiatry': 'childPsychiatry',
            'Adult Psychiatry': 'adultPsychiatry',
            'Internal Medicine': 'internalMedicine'
        };
        const specialtyKey = specialtyMap[selectedSpecialty] || 'childPsychiatry';

        console.log("[ConsultChat] Starting new consultation process...");
        
        if (serviceToken) {
            try {
                // Call API - logs will be handled within the service
                const response: any = await createConsultSession(serviceToken, specialtyKey);
                if (response?.success && response.data?.sessionId) {
                    setCurrentSessionId(response.data.sessionId);
                }
            } catch (error) {
                console.error("[ConsultChat] Error creating backend session:", error);
            }
        } else {
            console.warn("[ConsultChat] No service token available - starting session in local-only mode");
        }

        setChatStarted(true);
        const time = getCurrentTime();
        setMessages([
            {
                id: '1',
                text: t('aiAssistant.consultChat.welcomeMessage', { specialty: selectedSpecialty }),
                sender: 'ai',
                time: time,
            },
        ]);
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

        if (serviceToken && currentSessionId) {
            try {
                const response: any = await sendConsultMessage(serviceToken, {
                    message: text,
                    sessionId: currentSessionId,
                });

                if (response?.success && response.data) {
                    const aiTime = getCurrentTime();
                    const aiMessage: Message = {
                        id: Date.now().toString(),
                        text: response.data.message,
                        sender: 'ai',
                        time: aiTime,
                    };
                    setMessages(prev => [...prev, aiMessage]);
                } else {
                    console.warn("[ConsultChat] Failed to get AI response:", response?.message);
                }
            } catch (error) {
                console.error("[ConsultChat] Error sending message:", error);
            } finally {
                setIsAiThinking(false);
            }
        } else {
            console.warn("[ConsultChat] No token or sessionId - cannot send message to API");
            // Fallback simulation for local-only mode
            setTimeout(() => {
                const aiTime = getCurrentTime();
                const aiMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    text: t('aiAssistant.consultChat.simulationMode'),
                    sender: 'ai',
                    time: aiTime,
                };
                setIsAiThinking(false);
                setMessages(prev => [...prev, aiMessage]);
            }, 1000);
        }
    };

    const toggleHistory = () => {
        const toValue = isHistoryOpen ? -wp(70) : 0;
        Animated.timing(drawerAnim, {
            toValue,
            duration: 300,
            useNativeDriver: false,
        }).start();
        setIsHistoryOpen(!isHistoryOpen);
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
                Animated.timing(drawerAnim, {
                    toValue: -wp(70),
                    duration: 300,
                    useNativeDriver: false,
                }).start();

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
        <View style={styles.container}>
            {/* History Drawer */}
            <Animated.View style={[styles.drawer, { left: drawerAnim }]}>
                <View style={styles.drawerHeader}>
                    <Text style={styles.drawerTitle}>{t('aiAssistant.consultChat.visitHistory')}</Text>
                    <View style={styles.drawerHeaderActions}>
                        <TouchableOpacity onPress={handleNewSession} style={styles.drawerActionBtn}>
                            <Feather name="plus" size={20} color="#1E293B" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={toggleHistory} style={styles.drawerActionBtn}>
                            <Feather name="chevron-left" size={20} color="#1E293B" />
                        </TouchableOpacity>
                    </View>
                </View>
                <ScrollView style={styles.sessionList}>
                    {sessions.map((session, index) => (
                        <TouchableOpacity 
                            key={session._id || session.sessionId || index} 
                            style={[styles.sessionItem, index === 0 && styles.activeSessionItem]}
                            onPress={() => handleSelectSession(session.sessionId)}
                        >
                            <View style={styles.sessionIconContainer}>
                                <Ionicons name="chatbubble-outline" size={18} color="#4A90B9" />
                            </View>
                            <View style={styles.sessionInfo}>
                                <Text style={styles.sessionIdText}>{t('aiAssistant.consultChat.session')} #{session.sessionId?.substring(0, 8)}</Text>
                                <View style={styles.sessionMetaRow}>
                                    <View style={styles.sessionTag}>
                                        <Text style={styles.sessionTagText}>
                                            {session.metadata?.speciality === 'childPsychiatry' ? t('aiAssistant.consultChat.childPsychShort') : 
                                             session.metadata?.speciality === 'adultPsychiatry' ? t('aiAssistant.consultChat.adultPsychShort') :
                                             session.metadata?.speciality === 'internalMedicine' ? t('aiAssistant.consultChat.internalShort') : t('aiAssistant.consultChat.generalShort')}
                                        </Text>
                                    </View>
                                    <View style={styles.sessionDateRow}>
                                        <Feather name="clock" size={12} color="#94A3B8" />
                                        <Text style={styles.sessionDateText}>
                                            {session.createdAt ? new Date(session.createdAt).toLocaleDateString(i18n.language === 'pl' ? 'pl-PL' : 'en-GB', { day: 'numeric', month: 'short' }) : '10 Mar'}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                            <TouchableOpacity 
                                onPress={() => handleDeleteSession(session.sessionId)}
                                style={styles.deleteBtn}
                            >
                                <Feather name="trash-2" size={16} color="#EF4444" />
                            </TouchableOpacity>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </Animated.View>

            {!chatStarted ? (
                <View style={styles.chatWrapper}>
                    {/* Header for Selection Screen */}
                    <View style={styles.chatHeader}>
                        <TouchableOpacity onPress={toggleHistory} style={styles.menuBtn}>
                            <Feather name="menu" size={22} color="#1E293B" />
                        </TouchableOpacity>
                        <View style={styles.chatHeaderTitleContainer}>
                            <Text style={styles.chatHeaderTitle}>{t('aiAssistant.consultChat.clinicalAssistant')}</Text>
                        </View>
                    </View>

                    <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={styles.messagesContainer}>
                        <View style={styles.selectionContainer}>
                            {/* Chat Icon */}
                            <View style={styles.chatIconCircle}>
                                <Ionicons name="chatbubble-outline" size={28} color="#4A90B9" />
                            </View>

                            <Gap height={hp(2)} />

                            <Text style={styles.selectionDesc}>
                                {t('aiAssistant.consultChat.selectionDesc')}
                            </Text>

                            <Gap height={hp(3)} />

                            {/* Specialty Dropdown */}
                            <Text style={styles.selectLabel}>{t('aiAssistant.consultChat.selectSpecialty')}</Text>
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
                                style={styles.startBtn}
                                disabled={!selectedSpecialty}
                            />
                        </View>
                    </ScrollView>
                </View>
            ) : (
                <KeyboardAvoidingView
                    style={styles.chatWrapper}
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? hp(18) : 0}
                >
                    {/* Chat Header */}
                    <View style={styles.chatHeader}>
                        <TouchableOpacity onPress={toggleHistory} style={styles.menuBtn}>
                            <Feather name="menu" size={22} color="#1E293B" />
                        </TouchableOpacity>
                        <View style={styles.chatHeaderTitleContainer}>
                            <Text style={styles.chatHeaderTitle}>{t('aiAssistant.consultChat.clinicalAssistant')}</Text>
                        </View>
                    </View>

                    {/* Messages */}
                    <ScrollView
                        ref={scrollViewRef}
                        style={styles.messagesContainer}
                        contentContainerStyle={styles.messagesContent}
                        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
                    >
                        {messages.map((msg) => (
                            <View
                                key={msg.id}
                                style={[
                                    styles.messageBubbleRow,
                                    msg.sender === 'user' ? styles.userRow : styles.aiRow,
                                ]}
                            >
                                <View
                                    style={[
                                        styles.messageBubble,
                                        msg.sender === 'user' ? styles.userBubble : styles.aiBubble,
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.messageText,
                                            msg.sender === 'user' ? styles.userMessageText : styles.aiMessageText,
                                        ]}
                                    >
                                        {msg.text}
                                    </Text>
                                    <Text
                                        style={[
                                            styles.messageTime,
                                            msg.sender === 'user' ? styles.userTimeText : styles.aiTimeText,
                                        ]}
                                    >
                                        {msg.time}
                                    </Text>
                                </View>
                            </View>
                        ))}

                        {/* AI Thinking Indicator */}
                        {isAiThinking && (
                            <View style={[styles.messageBubbleRow, styles.aiRow]}>
                                <View style={[styles.messageBubble, styles.aiBubble, styles.thinkingBubble]}>
                                    <View style={styles.thinkingContent}>
                                        <View style={styles.thinkingDots}>
                                            <Animated.View style={[styles.thinkingDot, { opacity: dot1 }]} />
                                            <Animated.View style={[styles.thinkingDot, { opacity: dot2 }]} />
                                            <Animated.View style={[styles.thinkingDot, { opacity: dot3 }]} />
                                        </View>
                                        <Text style={styles.thinkingText}>{t('aiAssistant.consultChat.aiThinking')}</Text>
                                    </View>
                                </View>
                            </View>
                        )}
                    </ScrollView>

                    {/* Message Input */}
                    <View style={styles.inputBar}>
                        <TextInput
                            style={styles.chatInput}
                            placeholder={t('aiAssistant.consultChat.askPlaceholder')}
                            placeholderTextColor="#9CA3AF"
                            value={messageText}
                            onChangeText={setMessageText}
                            onSubmitEditing={handleSendMessage}
                            returnKeyType="send"
                        />
                        <TouchableOpacity
                            style={[
                                styles.sendBtn,
                                (!messageText.trim() || isAiThinking) && styles.sendBtnDisabled,
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    /* ─── Drawer Styles ─── */
    drawer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        width: wp(70),
        backgroundColor: '#FFFFFF',
        zIndex: 1000,
        borderRightWidth: 1,
        borderRightColor: '#E2E8F0',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    drawerHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    drawerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1E293B',
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
        borderBottomColor: '#F8FAFC',
        alignItems: 'center',
    },
    activeSessionItem: {
        backgroundColor: '#F1F5F9',
    },
    sessionIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#EBF5FF',
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
        color: '#1E293B',
        marginBottom: 4,
    },
    sessionMetaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    sessionTag: {
        backgroundColor: '#E2E8F0',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    sessionTagText: {
        fontSize: 12,
        color: '#64748B',
        fontWeight: '500',
    },
    sessionDateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    sessionDateText: {
        fontSize: 12,
        color: '#94A3B8',
    },
    deleteBtn: {
        padding: 8,
        marginLeft: 4,
    },
    floatingToggleBtn: {
        position: 'absolute',
        left: 0,
        top: hp(30),
        backgroundColor: '#FFFFFF',
        width: 40,
        height: 50,
        borderTopRightRadius: 12,
        borderBottomRightRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        zIndex: 900,
    },
    /* ─── Selection Screen ─── */
    selectionContainer: {
        backgroundColor: '#FFFFFF',
        margin: 15,
        borderRadius: 12,
        padding: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 3,
    },
    chatIconCircle: {
        width: 60,
        height: 60,
        borderRadius: 16,
        backgroundColor: '#EBF5FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: hp(4),
    },
    selectionDesc: {
        fontSize: 15,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 22,
        paddingHorizontal: 20,
    },
    selectLabel: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111827',
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
        backgroundColor: '#FFFFFF',
        overflow: 'hidden',
    },
    chatHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 18,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        backgroundColor: '#FAFBFC',
    },
    menuBtn: {
        marginRight: 16,
    },
    chatHeaderTitleContainer: {
        flex: 1,
    },
    chatHeaderTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
    },
    chatHeaderSubtitle: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 1,
    },
    messagesContainer: {
        flex: 1,
        backgroundColor: '#F9FAFB',
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
        backgroundColor: '#4A90B9',
        borderBottomRightRadius: 4,
    },
    aiBubble: {
        backgroundColor: '#FFFFFF',
        borderBottomLeftRadius: 4,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    messageText: {
        fontSize: 14,
        lineHeight: 20,
    },
    userMessageText: {
        color: '#FFFFFF',
    },
    aiMessageText: {
        color: '#374151',
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
        color: '#9CA3AF',
        fontSize: 10,
    },
    inputBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: Platform.OS === 'ios' ? 30 : 16, // Margin below text input
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        backgroundColor: '#FFFFFF',
        gap: 10,
    },
    chatInput: {
        flex: 1,
        height: 44,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 22,
        paddingHorizontal: 16,
        fontSize: 14,
        color: '#111827',
        backgroundColor: '#FAFBFC',
    },
    sendBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#4A90B9',
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendBtnDisabled: {
        backgroundColor: '#B0D4E8',
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
        backgroundColor: '#4A90B9',
    },
    thinkingText: {
        fontSize: 14,
        color: '#6B7280',
        fontStyle: 'italic',
    },
});

export default ConsultChat;
