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
    Modal,
} from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import PrimaryButton from '../../../component/button';
import Gap from '../../../component/gap';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    time: string;
}

interface QueryHistory {
    id: string;
    title: string;
    date: string;
    messages: Message[];
}

const PharmacopediaChat = () => {
    const [chatStarted, setChatStarted] = useState(false);
    const [messageText, setMessageText] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [isAiThinking, setIsAiThinking] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [queryHistory, setQueryHistory] = useState<QueryHistory[]>([
        {
            id: 'wdD9XP9w',
            title: 'Query #wdD9XP9w',
            date: '25 Feb',
            messages: [
                { id: '1', text: 'What are the side effects of Sertraline?', sender: 'user', time: '14:30' },
                { id: '2', text: 'Sertraline (Zoloft) common side effects include nausea, dizziness, drowsiness, dry mouth, insomnia, and gastrointestinal issues.', sender: 'ai', time: '14:30' },
            ],
        },
    ]);
    const [activeQueryId, setActiveQueryId] = useState<string | null>(null);

    const scrollViewRef = useRef<ScrollView>(null);
    const slideAnim = useRef(new Animated.Value(-wp(70))).current;

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

    const getCurrentTime = () => {
        const now = new Date();
        return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    };

    const generateQueryId = () => {
        return Math.random().toString(36).substring(2, 10);
    };

    const handleStartNewQuery = () => {
        const queryId = generateQueryId();
        const time = getCurrentTime();
        const welcomeMessage: Message = {
            id: '1',
            text: "Welcome to Pharmacopedia! I can help you with drug information, dosing guidelines, interactions, and side effects based on Stahl's Essential Psychopharmacology. What would you like to know?",
            sender: 'ai',
            time: time,
        };

        const newQuery: QueryHistory = {
            id: queryId,
            title: `Query #${queryId}`,
            date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
            messages: [welcomeMessage],
        };

        setQueryHistory(prev => [newQuery, ...prev]);
        setActiveQueryId(queryId);
        setMessages([welcomeMessage]);
        setChatStarted(true);
    };

    const handleSelectQuery = (query: QueryHistory) => {
        setActiveQueryId(query.id);
        setMessages(query.messages);
        setChatStarted(true);
        toggleHistory();
    };

    const toggleHistory = () => {
        if (showHistory) {
            Animated.timing(slideAnim, {
                toValue: -wp(70),
                duration: 250,
                useNativeDriver: true,
            }).start(() => setShowHistory(false));
        } else {
            setShowHistory(true);
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 250,
                useNativeDriver: true,
            }).start();
        }
    };

    const handleSendMessage = () => {
        if (!messageText.trim()) return;
        const time = getCurrentTime();
        const userMessage: Message = {
            id: Date.now().toString(),
            text: messageText.trim(),
            sender: 'user',
            time: time,
        };

        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        setMessageText('');
        setIsAiThinking(true);

        // Update query history
        setQueryHistory(prev =>
            prev.map(q => q.id === activeQueryId ? { ...q, messages: updatedMessages } : q)
        );

        // Simulate AI response
        setTimeout(() => {
            const aiTime = getCurrentTime();
            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: 'Based on the pharmacological data, I can provide the following information. Please note that this is for reference purposes and clinical judgment should always be applied.',
                sender: 'ai',
                time: aiTime,
            };
            setIsAiThinking(false);
            setMessages(prev => {
                const newMessages = [...prev, aiMessage];
                // Update history
                setQueryHistory(hist =>
                    hist.map(q => q.id === activeQueryId ? { ...q, messages: newMessages } : q)
                );
                return newMessages;
            });
        }, 2500);
    };

    const handleBackToLanding = () => {
        setChatStarted(false);
        setMessages([]);
        setMessageText('');
        setIsAiThinking(false);
        setActiveQueryId(null);
    };

    // ─── Landing Screen ───
    if (!chatStarted) {
        return (
            <View style={styles.landingContainer}>
                {/* History Button */}
                <View style={styles.landingHeader}>
                    <Text style={styles.landingTitle}>Pharmacopedia</Text>
                    <TouchableOpacity onPress={toggleHistory} style={styles.historyBtn}>
                        <Feather name="clock" size={20} color="#4A90B9" />
                    </TouchableOpacity>
                </View>

                <View style={styles.landingContent}>
                    {/* Icon */}
                    <View style={styles.pillIconCircle}>
                        <Feather name="link" size={26} color="#4A90B9" />
                    </View>

                    <Gap height={hp(2)} />

                    <Text style={styles.landingDesc}>
                        Get evidence-based drug information from Stahl's Essential Psychopharmacology Prescriber's Guide with AI-powered search.
                    </Text>

                    <Gap height={hp(3)} />

                    <PrimaryButton
                        label="+ Start New Query"
                        filled={true}
                        onPress={handleStartNewQuery}
                        style={styles.startBtn}
                    />
                </View>

                {/* Side Panel Overlay */}
                {showHistory && (
                    <TouchableOpacity
                        style={styles.overlay}
                        activeOpacity={1}
                        onPress={toggleHistory}
                    >
                        <Animated.View
                            style={[styles.sidePanel, { transform: [{ translateX: slideAnim }] }]}
                        >
                            <TouchableOpacity activeOpacity={1}>
                                <View style={styles.sidePanelHeader}>
                                    <Text style={styles.sidePanelTitle}>Drug Queries</Text>
                                    <View style={styles.sidePanelActions}>
                                        <TouchableOpacity onPress={handleStartNewQuery}>
                                            <Feather name="plus" size={20} color="#4A90B9" />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={toggleHistory} style={{ marginLeft: 16 }}>
                                            <Feather name="chevron-left" size={20} color="#666" />
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                <ScrollView style={styles.sidePanelList}>
                                    {queryHistory.map((query) => (
                                        <TouchableOpacity
                                            key={query.id}
                                            style={[
                                                styles.queryItem,
                                                activeQueryId === query.id && styles.queryItemActive,
                                            ]}
                                            onPress={() => handleSelectQuery(query)}
                                        >
                                            <View style={styles.queryItemRow}>
                                                <Feather name="link" size={14} color="#4A90B9" />
                                                <Text style={styles.queryItemTitle}>{query.title}</Text>
                                            </View>
                                            <View style={styles.queryItemRow}>
                                                <Feather name="clock" size={12} color="#9CA3AF" />
                                                <Text style={styles.queryItemDate}>{query.date}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </TouchableOpacity>
                        </Animated.View>
                    </TouchableOpacity>
                )}
            </View>
        );
    }

    // ─── Chat Screen ───
    return (
        <KeyboardAvoidingView
            style={styles.chatWrapper}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? hp(22) : 0}
        >
            {/* Chat Header */}
            <View style={styles.chatHeader}>
                <TouchableOpacity onPress={handleBackToLanding} style={styles.chatBackBtn}>
                    <Ionicons name="chevron-back" size={22} color="#4A90B9" />
                </TouchableOpacity>
                <View style={styles.chatHeaderIconCircle}>
                    <Feather name="link" size={16} color="#4A90B9" />
                </View>
                <Text style={styles.chatHeaderTitle}>Pharmacopedia</Text>
                <View style={{ flex: 1 }} />
                <TouchableOpacity onPress={toggleHistory} style={styles.chatHistoryBtn}>
                    <Feather name="clock" size={18} color="#4A90B9" />
                </TouchableOpacity>
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
                                <Text style={styles.thinkingText}>AI is thinking...</Text>
                            </View>
                        </View>
                    </View>
                )}
            </ScrollView>

            {/* Message Input */}
            <View style={styles.inputBar}>
                <TextInput
                    style={styles.chatInput}
                    placeholder="Ask about drug information, dosing, interactions, or side effects..."
                    placeholderTextColor="#9CA3AF"
                    value={messageText}
                    onChangeText={setMessageText}
                    onSubmitEditing={handleSendMessage}
                    returnKeyType="send"
                />
                <TouchableOpacity
                    style={[
                        styles.sendBtn,
                        !messageText.trim() && styles.sendBtnDisabled,
                    ]}
                    onPress={handleSendMessage}
                    disabled={!messageText.trim()}
                >
                    <Ionicons name="send" size={18} color="#FFFFFF" />
                </TouchableOpacity>
            </View>
            <View style={styles.inputFooter}>
                <Text style={styles.inputFooterText}>Press Enter to send</Text>
                <View style={styles.ragBadge}>
                    <MaterialCommunityIcons name="book-open-outline" size={14} color="#6B7280" />
                    <Text style={styles.ragBadgeText}>RAG-Enhanced AI</Text>
                </View>
            </View>

            {/* Side Panel Overlay (in chat) */}
            {showHistory && (
                <TouchableOpacity
                    style={styles.overlayChatMode}
                    activeOpacity={1}
                    onPress={toggleHistory}
                >
                    <Animated.View
                        style={[styles.sidePanelChat, { transform: [{ translateX: slideAnim }] }]}
                    >
                        <TouchableOpacity activeOpacity={1}>
                            <View style={styles.sidePanelHeader}>
                                <Text style={styles.sidePanelTitle}>Drug Queries</Text>
                                <View style={styles.sidePanelActions}>
                                    <TouchableOpacity onPress={() => { toggleHistory(); handleStartNewQuery(); }}>
                                        <Feather name="plus" size={20} color="#4A90B9" />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={toggleHistory} style={{ marginLeft: 16 }}>
                                        <Feather name="chevron-left" size={20} color="#666" />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <ScrollView style={styles.sidePanelList}>
                                {queryHistory.map((query) => (
                                    <TouchableOpacity
                                        key={query.id}
                                        style={[
                                            styles.queryItem,
                                            activeQueryId === query.id && styles.queryItemActive,
                                        ]}
                                        onPress={() => handleSelectQuery(query)}
                                    >
                                        <View style={styles.queryItemRow}>
                                            <Feather name="link" size={14} color="#4A90B9" />
                                            <Text style={styles.queryItemTitle}>{query.title}</Text>
                                        </View>
                                        <View style={styles.queryItemRow}>
                                            <Feather name="clock" size={12} color="#9CA3AF" />
                                            <Text style={styles.queryItemDate}>{query.date}</Text>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </TouchableOpacity>
                    </Animated.View>
                </TouchableOpacity>
            )}
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    /* ─── Landing Screen ─── */
    landingContainer: {
        backgroundColor: '#FFFFFF',
        margin: 15,
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 3,
    },
    landingHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    landingTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
    },
    historyBtn: {
        width: 38,
        height: 38,
        borderRadius: 10,
        backgroundColor: '#EBF5FF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    landingContent: {
        alignItems: 'center',
        paddingVertical: hp(6),
        paddingHorizontal: 30,
    },
    pillIconCircle: {
        width: 56,
        height: 56,
        borderRadius: 14,
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
        marginBottom: 0,
        borderRadius: 10,
    },

    /* ─── Side Panel ─── */
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.3)',
        zIndex: 100,
    },
    overlayChatMode: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.3)',
        zIndex: 100,
        borderRadius: 12,
    },
    sidePanel: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        width: wp(70),
        backgroundColor: '#FFFFFF',
        borderRightWidth: 1,
        borderRightColor: '#E5E7EB',
        borderTopLeftRadius: 12,
        borderBottomLeftRadius: 12,
        zIndex: 101,
    },
    sidePanelChat: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        width: wp(70),
        backgroundColor: '#FFFFFF',
        borderRightWidth: 1,
        borderRightColor: '#E5E7EB',
        borderTopLeftRadius: 12,
        borderBottomLeftRadius: 12,
        zIndex: 101,
    },
    sidePanelHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    sidePanelTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111827',
    },
    sidePanelActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    sidePanelList: {
        paddingTop: 8,
    },
    queryItem: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderLeftWidth: 3,
        borderLeftColor: 'transparent',
    },
    queryItemActive: {
        backgroundColor: '#EBF5FF',
        borderLeftColor: '#4A90B9',
    },
    queryItemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 2,
    },
    queryItemTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
    },
    queryItemDate: {
        fontSize: 12,
        color: '#9CA3AF',
    },

    /* ─── Chat Screen ─── */
    chatWrapper: {
        height: hp(68),
        backgroundColor: '#FFFFFF',
        margin: 15,
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 3,
    },
    chatHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        backgroundColor: '#FAFBFC',
    },
    chatBackBtn: {
        marginRight: 10,
    },
    chatHeaderIconCircle: {
        width: 34,
        height: 34,
        borderRadius: 10,
        backgroundColor: '#EBF5FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    chatHeaderTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111827',
    },
    chatHistoryBtn: {
        width: 36,
        height: 36,
        borderRadius: 8,
        backgroundColor: '#EBF5FF',
        justifyContent: 'center',
        alignItems: 'center',
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
    },
    aiTimeText: {
        color: '#9CA3AF',
    },
    inputBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingTop: 10,
        paddingBottom: 4,
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
        fontSize: 13,
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
    inputFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingBottom: 10,
        backgroundColor: '#FFFFFF',
    },
    inputFooterText: {
        fontSize: 11,
        color: '#9CA3AF',
    },
    ragBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    ragBadgeText: {
        fontSize: 11,
        color: '#6B7280',
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

export default PharmacopediaChat;
