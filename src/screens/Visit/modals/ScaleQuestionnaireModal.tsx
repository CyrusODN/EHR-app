import React, { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Modal,
    StatusBar,
    Platform,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '../../../hooks/useThemeColors';

interface ScaleQuestionnaireModalProps {
    visible: boolean;
    onClose: () => void;
    scaleId: string;
}

interface Option {
    title: string;
    description?: string;
}

interface Question {
    id: number;
    title: string;
    subtitle?: string;
    options: (string | Option)[];
}

const ScaleQuestionnaireModal = ({ visible, onClose, scaleId }: ScaleQuestionnaireModalProps) => {
    const { t } = useTranslation();
    const { colors: tc, isDark } = useThemeColors();
    const ds = createDynamicStyles(tc, isDark);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<Record<number, number>>({});

    const getLocalizedQuestions = (): Question[] => {
        const scaleKey = scaleId.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        const questions: Question[] = [];

        let count = 0;
        switch (scaleId) {
            case 'HAM-D': count = 17; break;
            case 'MADRS': count = 10; break;
            case 'ASRS': count = 18; break;
            case 'HAM-A': count = 14; break;
            case 'ISI': count = 7; break;
            case 'CARS-2': count = 15; break;
        }

        for (let i = 1; i <= count; i++) {
            const qKey = `q${i}`;
            const path = `visit.scales.questions.${scaleKey}.${qKey}`;
            
            let options: (string | Option)[] = [];
            
            if (scaleId === 'ASRS') {
                options = [
                    t('visit.scales.questions.asrs.options.never'),
                    t('visit.scales.questions.asrs.options.rarely'),
                    t('visit.scales.questions.asrs.options.sometimes'),
                    t('visit.scales.questions.asrs.options.often'),
                    t('visit.scales.questions.asrs.options.very_often'),
                ];
            } else {
                let oCount = scaleId === 'HAM-D' ? ([4, 5, 6, 12, 13, 14, 16, 17].includes(i) ? 3 : 5) 
                          : scaleId === 'MADRS' ? 4 
                          : scaleId === 'CARS-2' ? 4 : 5;

                for (let j = 0; j < oCount; j++) {
                    const opt = t(`${path}.o${j}`, { returnObjects: true });
                    if (typeof opt === 'string') options.push(opt);
                    else if (opt && typeof opt === 'object') {
                        options.push({
                            title: (opt as any).title,
                            description: (opt as any).desc || (opt as any).description
                        });
                    }
                }
            }

            questions.push({
                id: i,
                title: t(`${path}.title`),
                subtitle: scaleId === 'ASRS' ? (i <= 6 ? t('visit.scales.questions.asrs.part_a') : t('visit.scales.questions.asrs.part_b')) : undefined,
                options
            });
        }
        return questions;
    };

    const questions = getLocalizedQuestions();
    const totalQuestions = questions.length;
    const question = questions[currentQuestion];
    const progress = totalQuestions > 0 ? ((currentQuestion + 1) / totalQuestions) : 0;

    const handleSelectOption = (optionIndex: number) => {
        setAnswers(prev => ({ ...prev, [currentQuestion]: optionIndex }));
        // Auto-advance to next question after a brief delay
        if (currentQuestion < totalQuestions - 1) {
            setTimeout(() => {
                setCurrentQuestion(prev => prev + 1);
            }, 300);
        }
    };

    const handleBack = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(prev => prev - 1);
        } else {
            handleCancel();
        }
    };

    const handleCancel = () => {
        setCurrentQuestion(0);
        setAnswers({});
        onClose();
    };

    const insets = useSafeAreaInsets();

    if (!question) return null;

    return (
        <Modal
            visible={visible}
            animationType="slide"
            onRequestClose={handleCancel}
            statusBarTranslucent
        >
            <View style={[ds.safeArea, { paddingTop: insets.top }]}>
                <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={tc.background} />
                <View style={ds.container}>
                    {/* Header */}
                    <View style={ds.modalHeader}>
                        <TouchableOpacity onPress={handleCancel} style={ds.headerCloseButton}>
                            <Ionicons name="chevron-back" size={28} color={tc.textPrimary} />
                        </TouchableOpacity>
                        <Text style={ds.headerTitle}>{scaleId} Assessment</Text>
                        <View style={{ width: 40 }} />
                    </View>

                    {/* Progress Bar */}
                    <View style={ds.progressBarContainer}>
                        <View style={[ds.progressBar, { width: `${progress * 100}%` }]} />
                    </View>

                    <ScrollView 
                        style={ds.scrollContent}
                        contentContainerStyle={ds.scrollContentContainer}
                        showsVerticalScrollIndicator={false}
                    >
                        {/* Question Card */}
                        <View style={ds.questionCard}>
                            {/* Question Header */}
                            <View style={ds.questionHeader}>
                                <View>
                                    <Text style={ds.questionNumber}>
                                        Question {currentQuestion + 1} z {totalQuestions}
                                    </Text>
                                    {question.subtitle && (
                                        <Text style={ds.questionSubtitle}>{question.subtitle}</Text>
                                    )}
                                </View>
                                <TouchableOpacity style={ds.infoButton}>
                                    <Ionicons name="information-circle-outline" size={24} color={tc.accent} />
                                </TouchableOpacity>
                            </View>

                            {/* Question Title */}
                            <Text style={ds.questionTitle}>{question.title}</Text>
                            {/* Options */}
                            <View style={ds.optionsContainer}>
                                {question.options.map((option, index) => {
                                    const isSelected = answers[currentQuestion] === index;
                                    const optionTitle = typeof option === 'string' ? option : option.title;
                                    const optionDesc = typeof option === 'string' ? null : option.description;

                                    return (
                                        <TouchableOpacity
                                            key={index}
                                            style={[
                                                ds.optionCard,
                                                isSelected && ds.optionCardSelected,
                                            ]}
                                            onPress={() => handleSelectOption(index)}
                                            activeOpacity={0.7}
                                        >
                                            <View>
                                                <Text style={[
                                                    ds.optionText,
                                                    isSelected && ds.optionTextSelected,
                                                ]}>
                                                    {optionTitle}
                                                </Text>
                                                {optionDesc && (
                                                    <Text style={ds.optionDescription}>
                                                        {optionDesc}
                                                    </Text>
                                                )}
                                            </View>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </View>
                    </ScrollView>

                    {/* Footer */}
                    <View style={ds.footer}>
                        <TouchableOpacity style={ds.backButton} onPress={handleBack}>
                            <Feather name="arrow-left" size={16} color={tc.accent} />
                            <Text style={ds.backButtonText}>
                                {currentQuestion === 0 ? 'Cancel' : 'Back'}
                            </Text>
                        </TouchableOpacity>

                        {currentQuestion === totalQuestions - 1 && (
                            <TouchableOpacity onPress={handleCancel}>
                                <LinearGradient
                                    colors={[tc.accentGradientStart, tc.accentGradientEnd]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={ds.finishButton}
                                >
                                    <Text style={ds.finishButtonText}>Finish</Text>
                                    <Feather name="arrow-right" size={16} color={tc.textOnPrimary} />
                                </LinearGradient>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const createDynamicStyles = (tc: any, isDark: boolean) =>
    StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: tc.background,
    },
    container: {
        flex: 1,
        backgroundColor: tc.background,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: tc.background,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: tc.textPrimary,
    },
    headerCloseButton: {
        padding: 4,
        marginLeft: -4,
    },
    progressBarContainer: {
        height: 6,
        backgroundColor: tc.borderColor,
        width: '100%',
    },
    progressBar: {
        height: '100%',
        backgroundColor: tc.accent,
        borderTopRightRadius: 3,
        borderBottomRightRadius: 3,
    },
    scrollContent: {
        flex: 1,
    },
    scrollContentContainer: {
        padding: 16,
        paddingBottom: 30,
    },
    questionCard: {
        backgroundColor: tc.cardBackground,
        borderRadius: 12,
        padding: 20,
        borderWidth: 1,
        borderColor: tc.borderColor,
    },
    questionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    questionNumber: {
        fontSize: 16,
        fontWeight: '700',
        color: tc.textPrimary,
    },
    questionSubtitle: {
        fontSize: 13,
        color: tc.textSecondary,
        marginTop: 2,
    },
    infoButton: {
        padding: 2,
    },
    questionTitle: {
        fontSize: 16,
        color: tc.textPrimary,
        lineHeight: 24,
        marginBottom: 20,
    },
    optionsContainer: {
        gap: 12,
    },
    optionCard: {
        borderWidth: 1,
        borderColor: tc.borderColor,
        borderRadius: 10,
        paddingVertical: hp(2),
        paddingHorizontal: 16,
        backgroundColor: isDark ? tc.cardBackgroundAlt : '#fff',
    },
    optionCardSelected: {
        borderColor: tc.accent,
        borderWidth: 2,
        backgroundColor: isDark ? 'rgba(70,183,198,0.15)' : '#F0FAFB',
    },
    optionText: {
        fontSize: 15,
        color: tc.textPrimary,
        lineHeight: 22,
    },
    optionTextSelected: {
        color: tc.textPrimary,
        fontWeight: '700',
    },
    optionDescription: {
        fontSize: 13,
        color: tc.textSecondary,
        lineHeight: 18,
        marginTop: 4,
    },
    footer: {
        paddingHorizontal: 16,
        paddingBottom: hp(5),
        backgroundColor: tc.background,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: tc.accent,
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: wp(10),
    },
    finishButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: wp(10),
    },
    finishButtonText: {
        fontSize: 14,
        color: '#fff',
        fontWeight: '700',
        marginRight: 6,
    },
    backButtonText: {
        fontSize: 14,
        color: tc.accent,
        fontWeight: '700',
        marginLeft: 6,
    },
});

export default ScaleQuestionnaireModal;
