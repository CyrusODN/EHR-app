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

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    time: string;
}

const ConsultChat = () => {
    const [selectedSpecialty, setSelectedSpecialty] = useState('');
    const [chatStarted, setChatStarted] = useState(false);
    const [messageText, setMessageText] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [isAiThinking, setIsAiThinking] = useState(false);
    const scrollViewRef = useRef<ScrollView>(null);

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
        { label: 'Child Psychiatry', value: 'Child Psychiatry' },
        { label: 'Adult Psychiatry', value: 'Adult Psychiatry' },
        { label: 'Internal Medicine', value: 'Internal Medicine' },
    ];

    const getCurrentTime = () => {
        const now = new Date();
        return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    };

    const handleStartConsultation = () => {
        if (!selectedSpecialty) return;
        setChatStarted(true);
        const time = getCurrentTime();
        setMessages([
            {
                id: '1',
                text: `Hello! I'm your ${selectedSpecialty} AI assistant. I'm here to help based on evidence-based clinical guidelines. How can I assist you with the patient's condition?`,
                sender: 'ai',
                time: time,
            },
        ]);
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
        setMessages(prev => [...prev, userMessage]);
        setMessageText('');
        setIsAiThinking(true);

        // Simulate AI response
        setTimeout(() => {
            const aiTime = getCurrentTime();
            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: 'Thank you for the information. Based on the clinical guidelines, I would recommend further assessment. Could you provide more details about the patient\'s history?',
                sender: 'ai',
                time: aiTime,
            };
            setIsAiThinking(false);
            setMessages(prev => [...prev, aiMessage]);
        }, 2500);
    };

    const handleBackToSelection = () => {
        setChatStarted(false);
        setMessages([]);
        setMessageText('');
        setIsAiThinking(false);
    };

    // ─── Specialization Selection Screen ───
    if (!chatStarted) {
        return (
            <View style={styles.selectionContainer}>
                {/* Chat Icon */}
                <View style={styles.chatIconCircle}>
                    <Ionicons name="chatbubble-outline" size={28} color="#4A90B9" />
                </View>

                <Gap height={hp(2)} />

                <Text style={styles.selectionDesc}>
                    Start a new consultation session to get AI-powered medical guidance
                </Text>

                <Gap height={hp(3)} />

                {/* Specialty Dropdown */}
                <Text style={styles.selectLabel}>Select Specialty</Text>
                <Gap height={hp(1)} />
                <CustomDropdown
                    placeholder="Choose a specialty"
                    options={specialtyOptions}
                    value={selectedSpecialty}
                    onChange={(value) => setSelectedSpecialty(String(value))}
                    icon={undefined}
                />

                <Gap height={hp(2.5)} />

                {/* Start Button */}
                <PrimaryButton
                    label="+ Start New Consultation"
                    filled={true}
                    onPress={handleStartConsultation}
                    style={styles.startBtn}
                    disabled={!selectedSpecialty}
                />
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
                <TouchableOpacity onPress={handleBackToSelection} style={styles.chatBackBtn}>
                    <Ionicons name="chevron-back" size={22} color="#4A90B9" />
                </TouchableOpacity>
                <View style={styles.chatHeaderIconCircle}>
                    <Ionicons name="chatbubble-outline" size={16} color="#4A90B9" />
                </View>
                <View>
                    <Text style={styles.chatHeaderTitle}>Clinical Assistant</Text>
                    <Text style={styles.chatHeaderSubtitle}>{selectedSpecialty}</Text>
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
                    placeholder="Ask about patient's condition..."
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
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
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
    },
    aiTimeText: {
        color: '#9CA3AF',
    },
    inputBar: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
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
