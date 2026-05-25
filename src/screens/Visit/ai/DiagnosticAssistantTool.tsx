import React, { useState, useRef, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { GetDiagnosticSuggestions } from '../../../Services/Visit.Service';

interface DiagnosticAssistantToolProps {
    visitData?: any;
    visitId?: string;
    onDiagnosisSelect?: (diagnosis: { code: string; name: string; classification: string }) => void;
    onUpdate?: (data: any) => void;
}

interface Message {
    id: string;
    type: 'user' | 'assistant';
    content: string;
    suggestions?: { code: string; name: string; type: string }[];
}

const DiagnosticAssistantTool = ({ visitData, visitId, onDiagnosisSelect, onUpdate }: DiagnosticAssistantToolProps) => {
    const { t } = useTranslation();
    const { colors: tc, isDark } = useThemeColors();
    const ds = useMemo(() => createDynamicStyles(tc, isDark), [tc, isDark]);
    const scrollRef = useRef<ScrollView>(null);

    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            type: 'assistant',
            content: t('visit.diagnosticAssistant.welcome'),
        }
    ]);
    const [input, setInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);

    const handleSend = async () => {
        if (!input.trim() || isThinking) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            type: 'user',
            content: input.trim(),
        };

        setMessages(prev => [...prev, userMessage]);
        const query = input.trim();
        setInput('');
        setIsThinking(true);

        try {
            const result = await GetDiagnosticSuggestions(visitId || '', query);
            const data = result?.data || result;

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                type: 'assistant',
                content: data?.analysis || t('visit.diagnosticAssistant.suggestion'),
                suggestions: data?.suggestions || [
                    { code: 'R69', name: t('visit.diagnosticAssistant.unspecified'), type: 'primary' },
                ],
            };
            setMessages(prev => [...prev, assistantMessage]);
        } catch (e) {
            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                type: 'assistant',
                content: t('visit.diagnosticAssistant.errorResponse'),
            };
            setMessages(prev => [...prev, assistantMessage]);
        } finally {
            setIsThinking(false);
            setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
        }
    };

    const handleSelectDiagnosis = (suggestion: { code: string; name: string; type: string }) => {
        if (onDiagnosisSelect) {
            onDiagnosisSelect({
                code: suggestion.code,
                name: suggestion.name,
                classification: suggestion.type === 'primary' ? 'Primary' : 'Secondary',
            });
        }
        if (onUpdate) {
            const currentDiagnoses = visitData?.diagnosis?.icd10 || [];
            onUpdate({
                diagnosis: {
                    icd10: [...currentDiagnoses, {
                        code: suggestion.code,
                        name: suggestion.name,
                        classification: suggestion.type === 'primary' ? 'Primary' : 'Secondary',
                        addedAt: new Date().toISOString(),
                    }]
                }
            });
        }
    };

    return (
        <View style={ds.container}>
            <View style={ds.header}>
                <MaterialCommunityIcons name="brain" size={20} color={tc.accent} />
                <Text style={ds.title}>{t('visit.diagnosticAssistant.title')}</Text>
            </View>

            <ScrollView
                ref={scrollRef}
                style={ds.chatContainer}
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled
            >
                {messages.map(msg => (
                    <View key={msg.id} style={[ds.messageBubble, msg.type === 'user' ? ds.userBubble : ds.assistantBubble]}>
                        {msg.type === 'assistant' && (
                            <View style={ds.botIcon}>
                                <MaterialCommunityIcons name="robot" size={14} color="#fff" />
                            </View>
                        )}
                        <View style={[ds.messageContent, msg.type === 'user' ? ds.userContent : ds.assistantContent]}>
                            <Text style={[ds.messageText, msg.type === 'user' && ds.userText]}>{msg.content}</Text>
                            {msg.suggestions && msg.suggestions.length > 0 && (
                                <View style={ds.suggestionsContainer}>
                                    {msg.suggestions.map((sug, idx) => (
                                        <TouchableOpacity
                                            key={idx}
                                            style={ds.suggestionItem}
                                            onPress={() => handleSelectDiagnosis(sug)}
                                        >
                                            <View style={ds.suggestionLeft}>
                                                <Text style={ds.suggestionCode}>{sug.code}</Text>
                                                <Text style={ds.suggestionName}>{sug.name}</Text>
                                            </View>
                                            <View style={[ds.typeBadge, sug.type === 'primary' ? ds.primaryBadge : ds.secondaryBadge]}>
                                                <Text style={ds.typeText}>{sug.type}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                        </View>
                    </View>
                ))}

                {isThinking && (
                    <View style={[ds.messageBubble, ds.assistantBubble]}>
                        <View style={ds.botIcon}>
                            <MaterialCommunityIcons name="robot" size={14} color="#fff" />
                        </View>
                        <View style={[ds.messageContent, ds.assistantContent]}>
                            <ActivityIndicator size="small" color={tc.accent} />
                        </View>
                    </View>
                )}
            </ScrollView>

            <View style={ds.inputRow}>
                <TextInput
                    style={ds.chatInput}
                    placeholder={t('visit.diagnosticAssistant.inputPlaceholder')}
                    placeholderTextColor={tc.textMuted}
                    value={input}
                    onChangeText={setInput}
                    multiline
                    maxLength={500}
                />
                <TouchableOpacity
                    style={[ds.sendButton, !input.trim() && ds.sendButtonDisabled]}
                    onPress={handleSend}
                    disabled={!input.trim() || isThinking}
                >
                    <Feather name="send" size={18} color="#fff" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default DiagnosticAssistantTool;

const createDynamicStyles = (tc: any, isDark: boolean) => StyleSheet.create({
    container: { padding: 16 },
    header: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
    title: { fontSize: 15, fontWeight: '700', color: tc.textPrimary },
    chatContainer: { maxHeight: hp(30), marginBottom: 12 },
    messageBubble: { flexDirection: 'row', marginBottom: 12, alignItems: 'flex-start' },
    userBubble: { justifyContent: 'flex-end' },
    assistantBubble: { justifyContent: 'flex-start' },
    botIcon: {
        width: 24, height: 24, borderRadius: 12, backgroundColor: '#58A7B3',
        justifyContent: 'center', alignItems: 'center', marginRight: 8, marginTop: 2,
    },
    messageContent: { maxWidth: '80%', borderRadius: 12, padding: 10 },
    userContent: {
        backgroundColor: '#58A7B3', marginLeft: 'auto',
        borderBottomRightRadius: 4,
    },
    assistantContent: {
        backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#F1F5F9',
        borderBottomLeftRadius: 4,
    },
    messageText: { fontSize: 13, color: tc.textPrimary, lineHeight: 18 },
    userText: { color: '#fff' },
    suggestionsContainer: { marginTop: 10 },
    suggestionItem: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        backgroundColor: tc.cardBackground, borderRadius: 8, padding: 10, marginTop: 6,
        borderWidth: 1, borderColor: tc.borderColor,
    },
    suggestionLeft: { flex: 1 },
    suggestionCode: { fontSize: 13, fontWeight: '700', color: tc.accent },
    suggestionName: { fontSize: 12, color: tc.textSecondary, marginTop: 2 },
    typeBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
    primaryBadge: { backgroundColor: isDark ? 'rgba(16,185,129,0.15)' : '#D1FAE5' },
    secondaryBadge: { backgroundColor: isDark ? 'rgba(59,130,246,0.15)' : '#DBEAFE' },
    typeText: { fontSize: 10, fontWeight: '600', color: tc.textSecondary },
    inputRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
    chatInput: {
        flex: 1, borderWidth: 1, borderColor: tc.borderColor, borderRadius: 10,
        paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, color: tc.textPrimary,
        backgroundColor: tc.inputBackground, maxHeight: 80,
    },
    sendButton: {
        width: 40, height: 40, borderRadius: 20, backgroundColor: '#58A7B3',
        justifyContent: 'center', alignItems: 'center',
    },
    sendButtonDisabled: { opacity: 0.5 },
});
