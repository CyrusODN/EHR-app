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
    Dimensions,
} from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import PrimaryButton from '../../../component/button';
import Gap from '../../../component/gap';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { getChatbotServiceToken } from '../../../Services/AiAssitants.Service';
import { getPharmacopediaSessions, createPharmacopediaSession, getPharmacopediaSessionDetails, deletePharmacopediaSession, sendPharmacopediaMessage } from '../../../Services/PharmacopediaTool.Service';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    time: string;
}

interface PharmacopediaChatProps {
    serviceToken?: string | null;
    onShowAlert?: (message: string, type: 'success' | 'warning' | 'error') => void;
}

const PharmacopediaChat = ({ serviceToken: propToken, onShowAlert }: PharmacopediaChatProps) => {
    const { t } = useTranslation();
    const { colors: tc, isDark } = useThemeColors();
    const ds = createDynamicStyles(tc, isDark);
    const [serviceToken, setServiceToken] = useState<string | null>(propToken || null);
    const [chatStarted, setChatStarted] = useState(false);
    const [messageText, setMessageText] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [isAiThinking, setIsAiThinking] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [isCreatingSession, setIsCreatingSession] = useState(false);
    const [sessions, setSessions] = useState<any[]>([]);
    const [activeQueryId, setActiveQueryId] = useState<string | null>(null);

    const scrollViewRef = useRef<ScrollView>(null);
    const drawerAnim = useRef(new Animated.Value(-wp(75))).current;
    const backdropAnim = useRef(new Animated.Value(0)).current;

    // Animated dots for thinking indicator
    const dot1 = useRef(new Animated.Value(0.3)).current;
    const dot2 = useRef(new Animated.Value(0.3)).current;
    const dot3 = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        const init = async () => {
            let currentToken = serviceToken;
            
            if (!currentToken) {
                console.log("[PharmacopediaChat] No service token provided, fetching...");
                try {
                    const tokenRes: any = await getChatbotServiceToken();
                    if (tokenRes?.serviceToken) {
                        currentToken = tokenRes.serviceToken;
                        setServiceToken(currentToken);
                    }
                } catch (error) {
                    console.error("[PharmacopediaChat] Error fetching service token:", error);
                }
            }

            if (currentToken) {
                fetchSessions(currentToken);
            }
        };

        init();
    }, []);

    const fetchSessions = async (token: string) => {
        console.log("[PharmacopediaChat] Fetching pharmacopedia sessions...");
        try {
            const response: any = await getPharmacopediaSessions(token);
            if (response?.success) {
                setSessions(response.data || []);
            } else {
                console.warn("[PharmacopediaChat] Failed to load sessions:", response?.message);
            }
        } catch (error) {
            console.error("[PharmacopediaChat] Error loading sessions:", error);
        }
    };

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

    const toggleHistory = () => {
        const toOpen = !isHistoryOpen;
        const toValue = toOpen ? 0 : -wp(75);
        const backdropToValue = toOpen ? 1 : 0;

        Animated.parallel([
            Animated.spring(drawerAnim, {
                toValue,
                useNativeDriver: false,
                friction: 8,
                tension: 40,
            }),
            Animated.timing(backdropAnim, {
                toValue: backdropToValue,
                duration: 250,
                useNativeDriver: false,
            })
        ]).start();
        setIsHistoryOpen(toOpen);
    };

    const handleNewSession = async () => {
        if (!serviceToken) {
            console.error("[PharmacopediaChat] Cannot create session: No service token");
            return;
        }

        setIsCreatingSession(true);
        console.log("[PharmacopediaChat] Initiating new pharmacopedia session creation...");
        
        try {
            const response: any = await createPharmacopediaSession(serviceToken);
            if (response?.success && response?.data?.sessionId) {
                const newSessionId = response.data.sessionId;
                console.log("[PharmacopediaChat] Session created successfully:", newSessionId);
                
                setActiveQueryId(newSessionId);
                
                // Add welcome message
                const now = new Date();
                const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
                
                const welcomeMsg: Message = {
                    id: Date.now().toString(),
                    text: t('aiAssistant.pharmacopedia.welcomeMessage'),
                    sender: 'ai',
                    time: timeStr
                };

                setMessages([welcomeMsg]);
                setChatStarted(true);
                setMessageText('');
                setIsAiThinking(false);
                
                // Refresh sessions list in background
                fetchSessions(serviceToken);

                if (isHistoryOpen) toggleHistory();
            } else {
                console.error("[PharmacopediaChat] Failed to create session:", response?.message);
                if (onShowAlert) onShowAlert(t('aiAssistant.pharmacopedia.failedCreateQuery'), "error");
            }
        } catch (error) {
            console.error("[PharmacopediaChat] Error creating pharmacopedia session:", error);
        } finally {
            setIsCreatingSession(false);
        }
    };

    const handleSelectSession = async (sessionId: string) => {
        if (!serviceToken) return;
        
        console.log("[PharmacopediaChat] Loading session history:", sessionId);
        setActiveQueryId(sessionId);
        setIsAiThinking(true);
        
        try {
            const response: any = await getPharmacopediaSessionDetails(serviceToken, sessionId);
            if (response?.success && response?.data) {
                // Map API messages to UI format
                const historicalMessages: Message[] = (response.data.messages || []).map((m: any) => ({
                    id: m._id || Math.random().toString(),
                    text: m.content || "",
                    sender: m.role === 'assistant' ? 'ai' : 'user',
                    time: m.timestamp ? new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""
                }));
                
                setMessages(historicalMessages);
                setChatStarted(true);
            } else {
                console.error("[PharmacopediaChat] Failed to load history:", response?.message);
            }
        } catch (error) {
            console.error("[PharmacopediaChat] Error fetching session details:", error);
        } finally {
            setIsAiThinking(false);
            if (isHistoryOpen) {
                setIsHistoryOpen(false);
                Animated.parallel([
                    Animated.spring(drawerAnim, {
                        toValue: -wp(75),
                        useNativeDriver: false,
                        friction: 8,
                        tension: 40,
                    }),
                    Animated.timing(backdropAnim, {
                        toValue: 0,
                        duration: 250,
                        useNativeDriver: false,
                    })
                ]).start();
            }
        }
    };

    const handleDeleteSession = async (sessionId: string) => {
        if (!serviceToken) return;
        
        console.log("[PharmacopediaChat] Deleting session:", sessionId);
        
        try {
            const response: any = await deletePharmacopediaSession(serviceToken, sessionId);
            if (response?.success) {
                // Remove from local state
                setSessions(prev => prev.filter(s => s.sessionId !== sessionId));
                
                // If it's the active session, reset chat
                if (activeQueryId === sessionId) {
                    setChatStarted(false);
                    setMessages([]);
                    setActiveQueryId(null);
                }
                
                if (onShowAlert) onShowAlert(t('aiAssistant.pharmacopedia.queryDeletedSuccess'), "success");
            } else {
                console.warn("[PharmacopediaChat] Deletion failed:", response?.message);
                if (onShowAlert) onShowAlert(t('aiAssistant.pharmacopedia.failedDeleteQuery'), "error");
            }
        } catch (error) {
            console.error("[PharmacopediaChat] Error during deletion:", error);
        }
    };

    const handleSendMessage = async () => {
        if (!messageText.trim() || !serviceToken || !activeQueryId) return;
        
        const now = new Date();
        const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        const messageToSend = messageText.trim();
        
        const userMessage: Message = {
            id: Date.now().toString(),
            text: messageToSend,
            sender: 'user',
            time: timeStr,
        };

        setMessages(prev => [...prev, userMessage]);
        setMessageText('');
        setIsAiThinking(true);

        try {
            const response: any = await sendPharmacopediaMessage(serviceToken, activeQueryId, messageToSend);
            if (response?.success && response?.data) {
                const aiTime = response.data.timestamp ? new Date(response.data.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : timeStr;
                const aiMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    text: response.data.message || "",
                    sender: 'ai',
                    time: aiTime,
                };
                setMessages(prev => [...prev, aiMessage]);
            } else {
                console.error("[PharmacopediaChat] Failed to send message:", response?.message);
                if (onShowAlert) onShowAlert(t('aiAssistant.pharmacopedia.failedAiResponse'), "error");
            }
        } catch (error) {
            console.error("[PharmacopediaChat] Error sending pharmacopedia message:", error);
        } finally {
            setIsAiThinking(false);
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

            {/* Side Drawer */}
            <Animated.View style={[ds.drawer, { left: drawerAnim }]}>
                <View style={ds.drawerHeader}>
                    <Text style={ds.drawerTitle}>{t('aiAssistant.pharmacopedia.drugQueries')}</Text>
                    <View style={ds.drawerActions}>
                        <TouchableOpacity onPress={handleNewSession} style={ds.drawerActionBtn}>
                            <Feather name="plus" size={20} color={tc.accent} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={toggleHistory} style={ds.drawerActionBtn}>
                            <Feather name="chevron-left" size={20} color={tc.textSecondary} />
                        </TouchableOpacity>
                    </View>
                </View>
                <ScrollView style={ds.sessionList}>
                    {sessions.map((session, index) => (
                        <TouchableOpacity
                            key={session._id || session.sessionId || index}
                            style={[
                                ds.sessionItem,
                                activeQueryId === session.sessionId && ds.activeSessionItem,
                            ]}
                            onPress={() => handleSelectSession(session.sessionId)}
                        >
                            <View style={ds.sessionLeft}>
                                <View style={ds.sessionIconCircle}>
                                    <Feather name="link" size={16} color={tc.accent} />
                                </View>
                                <View style={ds.sessionInfo}>
                                    <Text style={ds.sessionTitle}>{t('aiAssistant.pharmacopedia.query')} #{session.sessionId?.substring(0, 8)}</Text>
                                    <Text style={ds.sessionDate}>
                                        {session.createdAt ? new Date(session.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : '11 Mar'}
                                    </Text>
                                </View>
                            </View>
                            <TouchableOpacity 
                                style={ds.deleteBtn}
                                onPress={() => handleDeleteSession(session.sessionId)}
                            >
                                <Feather name="trash-2" size={16} color={tc.error || "#EF4444"} />
                            </TouchableOpacity>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </Animated.View>

            {/* Main Content Area */}
            {!chatStarted ? (
                <View style={ds.mainWrapper}>
                    <View style={ds.header}>
                        <TouchableOpacity onPress={toggleHistory} style={ds.menuBtn}>
                            <Feather name="menu" size={22} color={tc.accent} />
                        </TouchableOpacity>
                        <Text style={ds.headerTitle}>{t('aiAssistant.pharmacopedia.title')}</Text>
                    </View>

                    <ScrollView contentContainerStyle={ds.landingContent}>
                        <View style={ds.landingIconCircle}>
                            <Feather name="link" size={28} color={tc.accent} />
                        </View>
                        <Gap height={hp(2)} />
                        <Text style={ds.landingDesc}>
                            {t('aiAssistant.pharmacopedia.landingDesc')}
                        </Text>
                        <Gap height={hp(4)} />
                        <PrimaryButton
                            label={isCreatingSession ? t('aiAssistant.pharmacopedia.creating') : t('aiAssistant.pharmacopedia.startNewQuery')}
                            filled={true}
                            onPress={handleNewSession}
                            style={ds.startBtn}
                            disabled={isCreatingSession}
                        />
                    </ScrollView>
                </View>
            ) : (
                <KeyboardAvoidingView
                    style={ds.mainWrapper}
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? hp(17.5) : 0}
                >
                    <View style={ds.header}>
                        <TouchableOpacity onPress={toggleHistory} style={ds.menuBtn}>
                            <Feather name="menu" size={22} color={tc.textPrimary} />
                        </TouchableOpacity>
                        <Text style={ds.headerTitle}>{t('aiAssistant.pharmacopedia.title')}</Text>
                    </View>

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
                        {isAiThinking && (
                            <View style={[ds.messageBubbleRow, ds.aiRow]}>
                                <View style={[ds.messageBubble, ds.aiBubble, ds.thinkingBubble]}>
                                    <View style={ds.thinkingContent}>
                                        <View style={ds.thinkingDots}>
                                            <Animated.View style={[ds.thinkingDot, { opacity: dot1 }]} />
                                            <Animated.View style={[ds.thinkingDot, { opacity: dot2 }]} />
                                            <Animated.View style={[ds.thinkingDot, { opacity: dot3 }]} />
                                        </View>
                                        <Text style={ds.thinkingText}>{t('aiAssistant.pharmacopedia.aiThinking')}</Text>
                                    </View>
                                </View>
                            </View>
                        )}
                    </ScrollView>

                    <View style={ds.inputArea}>
                        <View style={ds.inputBar}>
                            <TextInput
                                style={ds.chatInput}
                                placeholder={t('aiAssistant.pharmacopedia.askPlaceholder')}
                                placeholderTextColor={tc.textMuted}
                                value={messageText}
                                onChangeText={setMessageText}
                                onSubmitEditing={handleSendMessage}
                            />
                            <TouchableOpacity 
                                style={[ds.sendBtn, (!messageText.trim() || isAiThinking) && ds.sendBtnDisabled]}
                                onPress={handleSendMessage}
                                disabled={!messageText.trim() || isAiThinking}
                            >
                                <Ionicons name="send" size={18} color="#FFF" />
                            </TouchableOpacity>
                        </View>
                        <View style={ds.inputFooter}>
                            <View style={ds.ragBadge}>
                                <MaterialCommunityIcons name="book-open-outline" size={14} color={tc.textMuted} />
                                <Text style={ds.ragBadgeText}>{t('aiAssistant.pharmacopedia.ragEnhanced')}</Text>
                            </View>
                        </View>
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
        width: wp(75),
        backgroundColor: tc.drawerBg,
        zIndex: 1000,
        borderRightWidth: 1,
        borderRightColor: tc.borderSubtle,
        elevation: 10,
        shadowColor: tc.shadow,
        shadowOffset: { width: 4, height: 0 },
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
        paddingVertical: 18,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: tc.borderSubtle,
    },
    drawerTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: tc.textPrimary,
    },
    drawerActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    drawerActionBtn: {
        padding: 4,
    },
    sessionList: {
        flex: 1,
    },
    sessionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: tc.borderSubtle,
    },
    activeSessionItem: {
        backgroundColor: isDark ? 'rgba(74, 144, 185, 0.1)' : '#F3F9FC',
    },
    sessionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    sessionIconCircle: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: isDark ? 'rgba(74, 144, 185, 0.15)' : '#EBF5FF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    sessionInfo: {
        flex: 1,
    },
    sessionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: tc.textPrimary,
    },
    sessionDate: {
        fontSize: 12,
        color: tc.textMuted,
        marginTop: 2,
    },
    deleteBtn: {
        padding: 5,
    },

    /* ─── Main Content Wrapper ─── */
    mainWrapper: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
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
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: tc.textPrimary,
    },
    landingContent: {
        alignItems: 'center',
        paddingTop: hp(8),
        paddingHorizontal: 24,
    },
    landingIconCircle: {
        width: 60,
        height: 60,
        borderRadius: 15,
        backgroundColor: isDark ? 'rgba(74, 144, 185, 0.15)' : '#EBF5FF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    landingDesc: {
        fontSize: 15,
        color: tc.textSecondary,
        textAlign: 'center',
        lineHeight: 22,
    },
    startBtn: {
        width: '100%',
        height: hp(5.5),
        borderRadius: 10,
    },

    /* ─── Chat Styles ─── */
    messagesContainer: {
        flex: 1,
        backgroundColor: tc.screenBackground,
    },
    messagesContent: {
        padding: 16,
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
        padding: 12,
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
        fontSize: 10,
        marginTop: 4,
        color: tc.textMuted,
    },
    userTimeText: {
        color: 'rgba(255,255,255,0.7)',
        textAlign: 'right',
    },
    aiTimeText: {
        color: tc.textMuted,
    },
    inputArea: {
        borderTopWidth: 1,
        borderTopColor: tc.borderSubtle,
        backgroundColor: tc.cardBackground,
    },
    inputBar: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        gap: 12,
    },
    chatInput: {
        flex: 1,
        height: 44,
        backgroundColor: tc.inputBackground,
        borderWidth: 1,
        borderColor: tc.borderSubtle,
        borderRadius: 22,
        paddingHorizontal: 16,
        fontSize: 13,
        color: tc.textPrimary,
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
        backgroundColor: isDark ? 'rgba(74, 144, 185, 0.4)' : '#B0D3E8',
    },
    inputFooter: {
        paddingHorizontal: 16,
        paddingBottom: 10,
        alignItems: 'flex-end',
    },
    ragBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: isDark ? tc.layer2 : '#F3F4F6',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    ragBadgeText: {
        fontSize: 11,
        color: tc.textMuted,
        fontWeight: '500',
    },
    thinkingBubble: {
        backgroundColor: tc.layer2 || '#F3F4F6',
    },
    thinkingContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    thinkingDots: {
        flexDirection: 'row',
        gap: 4,
    },
    thinkingDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: tc.textMuted,
    },
    thinkingText: {
        fontSize: 13,
        color: tc.textMuted,
        fontStyle: 'italic',
    },
});

export default PharmacopediaChat;
