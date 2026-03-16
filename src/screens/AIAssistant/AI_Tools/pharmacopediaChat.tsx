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
        const toValue = isHistoryOpen ? -wp(75) : 0;
        Animated.spring(drawerAnim, {
            toValue,
            useNativeDriver: false,
            friction: 8,
            tension: 40,
        }).start();
        setIsHistoryOpen(!isHistoryOpen);
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
                    text: "Welcome to Pharmacopedia! I can help you with drug information, dosing guidelines, interactions, and side effects. What would you like to know?",
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
                if (onShowAlert) onShowAlert("Failed to create new query. Please try again.", "error");
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
            if (isHistoryOpen) toggleHistory();
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
                
                if (onShowAlert) onShowAlert("Query deleted successfully", "success");
            } else {
                console.warn("[PharmacopediaChat] Deletion failed:", response?.message);
                if (onShowAlert) onShowAlert("Failed to delete query. Please try again.", "error");
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
                if (onShowAlert) onShowAlert("Failed to get AI response. Please try again.", "error");
            }
        } catch (error) {
            console.error("[PharmacopediaChat] Error sending pharmacopedia message:", error);
        } finally {
            setIsAiThinking(false);
        }
    };

    // ─── Main Render ───
    return (
        <View style={styles.container}>
            {/* Side Drawer */}
            <Animated.View style={[styles.drawer, { left: drawerAnim }]}>
                <View style={styles.drawerHeader}>
                    <Text style={styles.drawerTitle}>Drug Queries</Text>
                    <View style={styles.drawerActions}>
                        <TouchableOpacity onPress={handleNewSession} style={styles.drawerActionBtn}>
                            <Feather name="plus" size={20} color="#4A90B9" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={toggleHistory} style={styles.drawerActionBtn}>
                            <Feather name="chevron-left" size={20} color="#666" />
                        </TouchableOpacity>
                    </View>
                </View>
                <ScrollView style={styles.sessionList}>
                    {sessions.map((session, index) => (
                        <TouchableOpacity
                            key={session._id || session.sessionId || index}
                            style={[
                                styles.sessionItem,
                                activeQueryId === session.sessionId && styles.activeSessionItem,
                            ]}
                            onPress={() => handleSelectSession(session.sessionId)}
                        >
                            <View style={styles.sessionLeft}>
                                <View style={styles.sessionIconCircle}>
                                    <Feather name="link" size={16} color="#4A90B9" />
                                </View>
                                <View style={styles.sessionInfo}>
                                    <Text style={styles.sessionTitle}>Query #{session.sessionId?.substring(0, 8)}</Text>
                                    <Text style={styles.sessionDate}>
                                        {session.createdAt ? new Date(session.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : '11 Mar'}
                                    </Text>
                                </View>
                            </View>
                            <TouchableOpacity 
                                style={styles.deleteBtn}
                                onPress={() => handleDeleteSession(session.sessionId)}
                            >
                                <Feather name="trash-2" size={16} color="#EF4444" />
                            </TouchableOpacity>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </Animated.View>

            {/* Main Content Area */}
            {!chatStarted ? (
                <View style={styles.mainWrapper}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={toggleHistory} style={styles.menuBtn}>
                            <Feather name="menu" size={22} color="#111827" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Pharmacopedia</Text>
                    </View>

                    <ScrollView contentContainerStyle={styles.landingContent}>
                        <View style={styles.landingIconCircle}>
                            <Feather name="link" size={28} color="#4A90B9" />
                        </View>
                        <Gap height={hp(2)} />
                        <Text style={styles.landingDesc}>
                            Get evidence-based drug information from Stahl's Essential Psychopharmacology Prescriber's Guide with AI-powered search.
                        </Text>
                        <Gap height={hp(4)} />
                        <PrimaryButton
                            label={isCreatingSession ? "Creating..." : "+ Start New Query"}
                            filled={true}
                            onPress={handleNewSession}
                            style={styles.startBtn}
                            disabled={isCreatingSession}
                        />
                    </ScrollView>
                </View>
            ) : (
                <KeyboardAvoidingView
                    style={styles.mainWrapper}
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? hp(17.5) : 0}
                >
                    <View style={styles.header}>
                        <TouchableOpacity onPress={toggleHistory} style={styles.menuBtn}>
                            <Feather name="menu" size={22} color="#111827" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Pharmacopedia</Text>
                    </View>

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
                        {isAiThinking && (
                            <View style={[styles.messageBubbleRow, styles.aiRow]}>
                                <View style={[styles.messageBubble, styles.aiBubble, styles.thinkingBubble]}>
                                    <View style={styles.thinkingContent}>
                                        <View style={styles.thinkingDots}>
                                            <Animated.View style={[styles.thinkingDot, { opacity: dot1 }]} />
                                            <Animated.View style={[styles.thinkingDot, { opacity: dot2 }]} />
                                            <Animated.View style={[styles.thinkingDot, { opacity: dot3 }]} />
                                        </View>
                                        <Text style={styles.thinkingText}>AI is thinking...</Text>
                                    </View>
                                </View>
                            </View>
                        )}
                    </ScrollView>

                    <View style={styles.inputArea}>
                        <View style={styles.inputBar}>
                            <TextInput
                                style={styles.chatInput}
                                placeholder="Ask about medications..."
                                value={messageText}
                                onChangeText={setMessageText}
                                onSubmitEditing={handleSendMessage}
                            />
                            <TouchableOpacity 
                                style={[styles.sendBtn, (!messageText.trim() || isAiThinking) && styles.sendBtnDisabled]}
                                onPress={handleSendMessage}
                                disabled={!messageText.trim() || isAiThinking}
                            >
                                <Ionicons name="send" size={18} color="#FFF" />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.inputFooter}>
                            <View style={styles.ragBadge}>
                                <MaterialCommunityIcons name="book-open-outline" size={14} color="#6B7280" />
                                <Text style={styles.ragBadgeText}>RAG-Enhanced AI</Text>
                            </View>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    /* ─── Drawer Styles ─── */
    drawer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        width: wp(75),
        backgroundColor: '#FFFFFF',
        zIndex: 1000,
        borderRightWidth: 1,
        borderRightColor: '#E5E7EB',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 4, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    drawerHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 18,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    drawerTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: '#111827',
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
        borderBottomColor: '#F3F4F6',
    },
    activeSessionItem: {
        backgroundColor: '#F3F9FC',
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
        backgroundColor: '#EBF5FF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    sessionInfo: {
        flex: 1,
    },
    sessionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
    },
    sessionDate: {
        fontSize: 12,
        color: '#9CA3AF',
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
        borderBottomColor: '#F3F4F6',
    },
    menuBtn: {
        marginRight: 16,
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
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
        backgroundColor: '#EBF5FF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    landingDesc: {
        fontSize: 15,
        color: '#6B7280',
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
        backgroundColor: '#F9FAFB',
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
        fontSize: 10,
        marginTop: 4,
        color: '#9CA3AF',
    },
    userTimeText: {
        color: 'rgba(255,255,255,0.7)',
        textAlign: 'right',
    },
    aiTimeText: {
        color: '#9CA3AF',
    },
    inputArea: {
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        backgroundColor: '#FFFFFF',
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
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 22,
        paddingHorizontal: 16,
        fontSize: 13,
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
        backgroundColor: '#B0D3E8',
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
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    ragBadgeText: {
        fontSize: 11,
        color: '#6B7280',
        fontWeight: '500',
    },
    thinkingBubble: {
        backgroundColor: '#F3F4F6',
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
        backgroundColor: '#9CA3AF',
    },
    thinkingText: {
        fontSize: 13,
        color: '#9CA3AF',
        fontStyle: 'italic',
    },
});

export default PharmacopediaChat;
