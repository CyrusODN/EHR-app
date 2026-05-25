import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Animated,
    ActivityIndicator,
} from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import PrimaryButton from '../../../component/button';
import Gap from '../../../component/gap';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '../../../hooks/useThemeColors';
// import { getPathfinderSessions } from '../../../Services/PathfinderTool.Service';

interface ResearchProject {
    id: string; 
    topic: string;
    date: string;
    contentType: string;
    citationStyle: string;
}

const contentTypes = [
    'Literature Review',
    'Introduction',
    'Methodology',
    'Discussion',
    'Summary',
    'Full Article (Draft)',
];

const citationStyles = [
    'APA', 'MLA', 'Chicago',
    'Harvard', 'Vancouver', 'BibTeX',
];

const Pathfinder = () => {
    const { t } = useTranslation();
    const { colors: tc, isDark } = useThemeColors();
    const ds = createDynamicStyles(tc, isDark);
    // Form state
    const [researchTopic, setResearchTopic] = useState('');
    const [selectedContentType, setSelectedContentType] = useState('Full Article (Draft)');
    const [selectedCitationStyle, setSelectedCitationStyle] = useState('APA');
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [keywords, setKeywords] = useState('');
    const [researchPrompt, setResearchPrompt] = useState('');
    const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

    // Side panel state
    const [showPanel, setShowPanel] = useState(false);
    const [projects, setProjects] = useState<ResearchProject[]>([]);
    const [loadingSessions, setLoadingSessions] = useState(false);
    const slideAnim = useRef(new Animated.Value(-wp(72))).current;
    const backdropAnim = useRef(new Animated.Value(0)).current;

    // useEffect(() => {
    //     fetchSessions();
    // }, []);

    // const fetchSessions = async () => {
    //     setLoadingSessions(true);
    //     try {
    //         const response = await getPathfinderSessions();
    //         if (response?.success && Array.isArray(response.data)) {
    //             // Map API response to ResearchProject interface
    //             const mappedProjects: ResearchProject[] = response.data.map((proj: any) => ({
    //                 id: proj.id || Math.random().toString(),
    //                 topic: proj.topic || 'Untitled Research',
    //                 date: proj.date ? new Date(proj.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : 'Unknown',
    //                 contentType: proj.contentType || 'N/A',
    //                 citationStyle: proj.citationStyle || 'N/A'
    //             }));
    //             setProjects(mappedProjects);
    //         }
    //     } catch (error) {
    //         console.error("[Pathfinder] Error loading sessions:", error);
    //     } finally {
    //         setLoadingSessions(false);
    //     }
    // };

    const togglePanel = () => {
        if (showPanel) {
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: -wp(72),
                    duration: 250,
                    useNativeDriver: true,
                }),
                Animated.timing(backdropAnim, {
                    toValue: 0,
                    duration: 250,
                    useNativeDriver: true,
                })
            ]).start(() => setShowPanel(false));
        } else {
            setShowPanel(true);
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 250,
                    useNativeDriver: true,
                }),
                Animated.timing(backdropAnim, {
                    toValue: 1,
                    duration: 250,
                    useNativeDriver: true,
                })
            ]).start();
        }
    };

    const handleChooseFiles = () => {
        // Placeholder for file picker integration
    };

    const handleCreateProject = () => {
        if (!researchTopic.trim()) return;

        const newProject: ResearchProject = {
            id: Math.random().toString(36).substring(2, 10),
            topic: researchTopic.trim(),
            date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
            contentType: selectedContentType,
            citationStyle: selectedCitationStyle,
        };

        setProjects(prev => [newProject, ...prev]);
        // Reset form
        setResearchTopic('');
        setKeywords('');
        setResearchPrompt('');
        setUploadedFiles([]);
    };

    return (
        <View style={ds.outerWrapper}>
            {/* Header */}
            <View style={ds.header}>
                <TouchableOpacity onPress={togglePanel} style={ds.menuBtn}>
                    <Feather name="menu" size={20} color={tc.accent} />
                </TouchableOpacity>
                <View>
                    <Text style={ds.headerTitle}>{t('aiAssistant.pathfinder.title')}</Text>
                    <Text style={ds.headerSubtitle}>{t('aiAssistant.pathfinder.subtitle')}</Text>
                </View>
            </View>

            {/* Scrollable Content */}
            <ScrollView
                style={ds.scrollArea}
                contentContainerStyle={ds.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Hero Section */}
                <View style={ds.heroSection}>
                    <LinearGradient
                        colors={['#4A90B9', '#5BA6B6', '#68BFB3']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={ds.heroIconCircle}
                    >
                        <Feather name="search" size={28} color="#FFFFFF" />
                    </LinearGradient>
                    <Gap height={hp(2)} />
                    <Text style={ds.heroTitle}>{t('aiAssistant.pathfinder.heroTitle')}</Text>
                    <Gap height={hp(1)} />
                    <Text style={ds.heroDesc}>
                        {t('aiAssistant.pathfinder.heroDesc')}
                    </Text>
                </View>

                {/* Form Card */}
                <View style={ds.formCard}>
                    {/* Research Topic */}
                    <Text style={ds.fieldLabel}>{t('aiAssistant.pathfinder.researchTopic')} <Text style={ds.required}>*</Text></Text>
                    <Gap height={hp(0.8)} />
                    <TextInput
                        style={ds.textInput}
                        placeholder={t('aiAssistant.pathfinder.researchTopicPlaceholder')}
                        placeholderTextColor={tc.textMuted}
                        value={researchTopic}
                        onChangeText={setResearchTopic}
                    />

                    <Gap height={hp(2)} />

                    {/* Upload Documents */}
                    <Text style={ds.fieldLabel}>{t('aiAssistant.pathfinder.uploadDocuments')} <Text style={ds.required}>*</Text></Text>
                    <Gap height={hp(0.8)} />
                    <View style={ds.uploadArea}>
                        <LinearGradient
                            colors={['#4A90B9', '#5BA6B6', '#68BFB3']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={ds.uploadIconCircle}
                        >
                            <Feather name="upload" size={24} color="#FFFFFF" />
                        </LinearGradient>
                        <Gap height={hp(1.5)} />
                        <Text style={ds.uploadText}>{t('aiAssistant.pathfinder.uploadText')}</Text>
                        <Text style={ds.uploadSubText}>{t('aiAssistant.pathfinder.uploadSubText')}</Text>
                        <Gap height={hp(1.5)} />
                        <TouchableOpacity onPress={handleChooseFiles} style={ds.chooseFilesBtn}>
                            <Text style={ds.chooseFilesBtnText}>{t('aiAssistant.pathfinder.chooseFiles')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Research Configuration */}
                <View style={ds.configSection}>
                    <View style={ds.configHeader}>
                        <Text style={ds.configTitle}>{t('aiAssistant.pathfinder.researchConfig')}</Text>
                        <TouchableOpacity
                            onPress={() => setShowAdvanced(!showAdvanced)}
                            style={ds.advancedToggleBtn}
                        >
                            <Text style={ds.advancedToggle}>
                                {showAdvanced ? t('aiAssistant.pathfinder.hideAdvanced') : t('aiAssistant.pathfinder.showAdvanced')}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <Gap height={hp(2)} />

                    {/* Content Type */}
                    <Text style={ds.chipGroupLabel}>{t('aiAssistant.pathfinder.contentType')}</Text>
                    <Gap height={hp(1)} />
                    <View style={ds.chipGrid}>
                        {contentTypes.map((type) => (
                            <TouchableOpacity
                                key={type}
                                onPress={() => setSelectedContentType(type)}
                            >
                                {selectedContentType === type ? (
                                    <LinearGradient
                                        colors={['#4A90B9', '#5BA6B6', '#68BFB3']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        style={ds.chipGradientWrapper}
                                    >
                                        <Text style={[ds.chipText, ds.chipTextActive]}>{type}</Text>
                                    </LinearGradient>
                                ) : (
                                    <View style={ds.chip}>
                                        <Text style={ds.chipText}>{type}</Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Gap height={hp(2)} />

                    {/* Citation Style */}
                    <Text style={ds.chipGroupLabel}>{t('aiAssistant.pathfinder.citationStyle')}</Text>
                    <Gap height={hp(1)} />
                    <View style={ds.chipGrid}>
                        {citationStyles.map((cs) => (
                            <TouchableOpacity
                                key={cs}
                                onPress={() => setSelectedCitationStyle(cs)}
                            >
                                {selectedCitationStyle === cs ? (
                                    <LinearGradient
                                        colors={['#4A90B9', '#5BA6B6', '#68BFB3']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        style={ds.chipGradientWrapper}
                                    >
                                        <Text style={[ds.chipText, ds.chipTextActive]}>{cs}</Text>
                                    </LinearGradient>
                                ) : (
                                    <View style={ds.chip}>
                                        <Text style={ds.chipText}>{cs}</Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Advanced Options */}
                    {showAdvanced && (
                        <View style={ds.advancedSection}>
                            <Gap height={hp(2)} />
                            <Text style={ds.fieldLabel}>{t('aiAssistant.pathfinder.keywordsFocus')}</Text>
                            <Gap height={hp(0.8)} />
                            <TextInput
                                style={ds.textInput}
                                placeholder="concise, focused"
                                placeholderTextColor={tc.textMuted}
                                value={keywords}
                                onChangeText={setKeywords}
                            />

                            <Gap height={hp(2)} />

                            <Text style={ds.fieldLabel}>{t('aiAssistant.pathfinder.researchPrompt')}</Text>
                            <Gap height={hp(0.8)} />
                            <TextInput
                                style={ds.multilineInput}
                                placeholder="Please make..."
                                placeholderTextColor={tc.textMuted}
                                value={researchPrompt}
                                onChangeText={setResearchPrompt}
                                multiline
                            />
                        </View>
                    )}
                </View>

                {/* Create Button */}
                <View style={ds.createBtnWrapper}>
                    <PrimaryButton
                        label={t('aiAssistant.pathfinder.createProject')}
                        filled={true}
                        onPress={handleCreateProject}
                        style={ds.createBtn}
                    />
                    <Gap height={hp(1)} />
                    <Text style={ds.createFooterText}>
                        {t('aiAssistant.pathfinder.createFooter')}
                    </Text>
                </View>

                <Gap height={hp(3)} />
            </ScrollView>

            {/* Side Panel Overlay & Panel */}
            <Animated.View 
                pointerEvents={showPanel ? 'auto' : 'none'}
                style={[ds.overlay, { opacity: backdropAnim }]}
            >
                <TouchableOpacity
                    style={{ flex: 1 }}
                    activeOpacity={1}
                    onPress={togglePanel}
                />
            </Animated.View>

            <Animated.View
                style={[ds.sidePanel, { transform: [{ translateX: slideAnim }] }]}
            >
                <TouchableOpacity activeOpacity={1} style={{ flex: 1 }}>
                    {/* Panel Header */}
                    <LinearGradient
                        colors={['#4A90B9', '#5BA6B6', '#68BFB3']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={ds.panelHeader}
                    >
                        <View style={ds.panelHeaderLeft}>
                            <View style={ds.panelIconCircle}>
                                <MaterialCommunityIcons name="file-document-outline" size={20} color="#FFFFFF" />
                            </View>
                            <Text style={ds.panelHeaderTitle}>{t('aiAssistant.pathfinder.researchProjects')}</Text>
                        </View>
                        <View style={ds.panelHeaderRight}>
                            <TouchableOpacity
                                style={ds.newProjectBtn}
                                onPress={() => { togglePanel(); }}
                            >
                                <Feather name="plus" size={14} color="#FFFFFF" />
                                <Text style={ds.newProjectBtnText}>{t('aiAssistant.pathfinder.newProject')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={togglePanel} style={ds.panelCloseBtn}>
                                <Feather name="chevron-left" size={20} color="#FFFFFF" />
                            </TouchableOpacity>
                        </View>
                    </LinearGradient>

                    {/* Panel Content */}
                    <ScrollView style={ds.panelContent}>
                        {projects.length > 0 ? (
                            projects.map((project) => (
                                <TouchableOpacity key={project.id} style={ds.projectItem}>
                                    <View style={ds.projectItemRow}>
                                        <Feather name="file-text" size={14} color={tc.accent} />
                                        <Text style={ds.projectItemTitle} numberOfLines={1}>
                                            {project.topic}
                                        </Text>
                                    </View>
                                    <View style={ds.projectItemRow}>
                                        <Feather name="clock" size={12} color={tc.textMuted} />
                                        <Text style={ds.projectItemDate}>{project.date}</Text>
                                        <Text style={ds.projectItemBadge}>{project.contentType}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))
                        ) : (
                            <View style={ds.emptyState}>
                                <MaterialCommunityIcons name="file-document-outline" size={48} color={isDark ? tc.borderNormal : "#D1D5DB"} />
                                <Gap height={hp(1.5)} />
                                <Text style={ds.emptyStateTitle}>{t('aiAssistant.pathfinder.noProjectsYet')}</Text>
                                <Text style={ds.emptyStateDesc}>{t('aiAssistant.pathfinder.createFirstProject')}</Text>
                            </View>
                        )}
                    </ScrollView>
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
};

const createDynamicStyles = (tc: any, isDark: boolean) => StyleSheet.create({
    outerWrapper: {
        flex: 1,
        backgroundColor: tc.cardBackground,
        borderWidth: isDark ? 1 : 0,
        borderColor: tc.borderSubtle,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: tc.borderSubtle,
        backgroundColor: tc.cardBackground,
        gap: 12,
    },
    menuBtn: {
        width: wp(10),
        height: hp(4.5),
        borderRadius: 10,
        backgroundColor: isDark ? 'rgba(74, 144, 185, 0.15)' : '#EBF5FF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: tc.textPrimary,
    },
    headerSubtitle: {
        fontSize: 12,
        color: tc.textSecondary,
        marginTop: 1,
    },
    scrollArea: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 20,
    },

    /* Hero */
    heroSection: {
        alignItems: 'center',
        paddingVertical: hp(3),
        paddingHorizontal: 24,
        backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : '#F9FAFB',
    },
    heroIconCircle: {
        width: 56,
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    heroTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: tc.textPrimary,
        textAlign: 'center',
    },
    heroDesc: {
        fontSize: 14,
        color: tc.textSecondary,
        textAlign: 'center',
        lineHeight: 20,
    },

    /* Form Card */
    formCard: {
        marginHorizontal: 16,
        marginTop: 16,
        padding: 16,
        backgroundColor: tc.cardBackground,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: tc.borderSubtle,
    },
    fieldLabel: {
        fontSize: 14,
        fontWeight: '700',
        color: tc.textPrimary,
    },
    required: {
        color: tc.error || '#EF4444',
    },
    textInput: {
        borderWidth: 1,
        borderColor: tc.borderSubtle,
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 14,
        color: tc.textPrimary,
        backgroundColor: tc.inputBackground,
    },
    multilineInput: {
        borderWidth: 1,
        borderColor: tc.borderSubtle,
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 14,
        color: tc.textPrimary,
        backgroundColor: tc.inputBackground,
        minHeight: 100,
        textAlignVertical: 'top',
    },

    /* Upload Area */
    uploadArea: {
        borderWidth: 2,
        borderColor: tc.borderNormal,
        borderStyle: 'dashed',
        borderRadius: 12,
        paddingVertical: hp(3),
        paddingHorizontal: 20,
        alignItems: 'center',
        backgroundColor: tc.inputBackground,
    },
    uploadIconCircle: {
        width: 48,
        height: 48,
        overflow: 'hidden',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    uploadText: {
        fontSize: 14,
        fontWeight: '600',
        color: tc.textPrimary,
        textAlign: 'center',
    },
    uploadSubText: {
        fontSize: 12,
        color: tc.textMuted,
        textAlign: 'center',
        marginTop: 4,
    },
    chooseFilesBtn: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: tc.accent,
        borderRadius: 8,
    },
    chooseFilesBtnText: {
        fontSize: 14,
        fontWeight: '600',
        color: tc.accent,
    },

    /* Research Configuration */
    configSection: {
        marginHorizontal: 16,
        marginTop: 20,
    },
    configHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    configTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: tc.textPrimary,
    },
    advancedToggleBtn: {
        borderWidth: 1,
        borderColor: tc.accent,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    advancedToggle: {
        fontSize: 13,
        fontWeight: '600',
        color: tc.accent,
    },
    chipGroupLabel: {
        fontSize: 14,
        fontWeight: '700',
        color: tc.textPrimary,
    },
    chipGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    chip: {
        height: hp(4),
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: wp(6),
        borderRadius: 20,
        borderWidth: 1,
        borderColor: tc.borderSubtle,
        backgroundColor: tc.cardBackground,
    },
    chipGradientWrapper: {
        width: wp(35),
        borderRadius: 20,
        height: hp(4),
        justifyContent: 'center',
        alignItems: 'center',
    },
    chipText: {
        fontSize: 13,
        fontWeight: '500',
        color: tc.textSecondary,
    },
    chipTextActive: {
        color: '#FFFFFF',
    },
    advancedSection: {
        borderTopWidth: 1,
        borderTopColor: tc.borderSubtle,
        marginTop: 16,
        paddingTop: 8,
    },

    /* Create Button */
    createBtnWrapper: {
        alignItems: 'center',
        marginTop: 24,
        paddingHorizontal: 16,
    },
    createBtn: {
        width: wp(55),
        height: hp(5.5),
        marginBottom: 0,
        borderRadius: 10,
    },
    createFooterText: {
        fontSize: 12,
        color: tc.textMuted,
        textAlign: 'center',
    },

    /* Side Panel Overlay */
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        zIndex: 100,
        borderRadius: 12,
    },
    sidePanel: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        width: wp(72),
        backgroundColor: tc.drawerBg,
        borderRightWidth: 1,
        borderRightColor: tc.borderSubtle,
        borderTopLeftRadius: 12,
        borderBottomLeftRadius: 12,
        zIndex: 101,
        shadowColor: tc.shadow,
        shadowOffset: { width: 4, height: 0 },
        shadowOpacity: isDark ? 0.4 : 0.15,
        shadowRadius: 10,
        elevation: 10,
    },
    panelHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopLeftRadius: 12,
        height: hp(7)
    },
    panelHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(2),
        marginLeft: wp(2)
    },
    panelIconCircle: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    panelHeaderTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#FFFFFF',
        lineHeight: 18,
    },
    panelHeaderRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginRight: wp(2)  
    },
    newProjectBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        gap: 6,
    },
    newProjectBtnText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#FFFFFF',
        lineHeight: 14,
    },
    panelCloseBtn: {
        padding: 4,
    },
    panelContent: {
        flex: 1,
        paddingTop: 8,
    },
    projectItem: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: tc.borderSubtle,
    },
    projectItemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 3,
    },
    projectItemTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: tc.textPrimary,
        flex: 1,
    },
    projectItemDate: {
        fontSize: 12,
        color: tc.textMuted,
    },
    projectItemBadge: {
        fontSize: 10,
        color: tc.accent,
        backgroundColor: isDark ? 'rgba(74, 144, 185, 0.15)' : '#EBF5FF',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
        fontWeight: '600',
        marginLeft: 8,
        overflow: 'hidden',
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: hp(6),
    },
    emptyStateTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: tc.textSecondary,
    },
    emptyStateDesc: {
        fontSize: 13,
        color: tc.textMuted,
        marginTop: 4,
    },
});

export default Pathfinder;
