import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Animated,
} from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import PrimaryButton from '../../../component/button';
import Gap from '../../../component/gap';

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
    const slideAnim = useRef(new Animated.Value(-wp(72))).current;

    const togglePanel = () => {
        if (showPanel) {
            Animated.timing(slideAnim, {
                toValue: -wp(72),
                duration: 250,
                useNativeDriver: true,
            }).start(() => setShowPanel(false));
        } else {
            setShowPanel(true);
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 250,
                useNativeDriver: true,
            }).start();
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
        <View style={styles.outerWrapper}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={togglePanel} style={styles.menuBtn}>
                    <Feather name="menu" size={20} color="#4A90B9" />
                </TouchableOpacity>
                <View>
                    <Text style={styles.headerTitle}>Remedius Pathfinder</Text>
                    <Text style={styles.headerSubtitle}>AI-powered research publication assistant</Text>
                </View>
            </View>

            {/* Scrollable Content */}
            <ScrollView
                style={styles.scrollArea}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Hero Section */}
                <View style={styles.heroSection}>
                    <LinearGradient
                        colors={['#4A90B9', '#5BA6B6', '#68BFB3']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.heroIconCircle}
                    >
                        <Feather name="search" size={28} color="#FFFFFF" />
                    </LinearGradient>
                    <Gap height={hp(2)} />
                    <Text style={styles.heroTitle}>Create Your First Research Project</Text>
                    <Gap height={hp(1)} />
                    <Text style={styles.heroDesc}>
                        Upload documents, set a research topic, and generate academic publications with AI assistance
                    </Text>
                </View>

                {/* Form Card */}
                <View style={styles.formCard}>
                    {/* Research Topic */}
                    <Text style={styles.fieldLabel}>Research Topic <Text style={styles.required}>*</Text></Text>
                    <Gap height={hp(0.8)} />
                    <TextInput
                        style={styles.textInput}
                        placeholder="Enter your research topic or focus area..."
                        placeholderTextColor="#9CA3AF"
                        value={researchTopic}
                        onChangeText={setResearchTopic}
                    />

                    <Gap height={hp(2)} />

                    {/* Upload Documents */}
                    <Text style={styles.fieldLabel}>Upload Documents <Text style={styles.required}>*</Text></Text>
                    <Gap height={hp(0.8)} />
                    <View style={styles.uploadArea}>
                        <LinearGradient
                            colors={['#4A90B9', '#5BA6B6', '#68BFB3']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.uploadIconCircle}
                        >
                            <Feather name="upload" size={24} color="#FFFFFF" />
                        </LinearGradient>
                        <Gap height={hp(1.5)} />
                        <Text style={styles.uploadText}>Tap to browse and upload files</Text>
                        <Text style={styles.uploadSubText}>Supports PDF, DOC, DOCX (max 25MB each)</Text>
                        <Gap height={hp(1.5)} />
                        <TouchableOpacity onPress={handleChooseFiles} style={styles.chooseFilesBtn}>
                            <Text style={styles.chooseFilesBtnText}>Choose Files</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Research Configuration */}
                <View style={styles.configSection}>
                    <View style={styles.configHeader}>
                        <Text style={styles.configTitle}>Research Configuration</Text>
                        <TouchableOpacity
                            onPress={() => setShowAdvanced(!showAdvanced)}
                            style={styles.advancedToggleBtn}
                        >
                            <Text style={styles.advancedToggle}>
                                {showAdvanced ? 'Hide Advanced Options' : 'Show Advanced Options'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <Gap height={hp(2)} />

                    {/* Content Type */}
                    <Text style={styles.chipGroupLabel}>Content Type</Text>
                    <Gap height={hp(1)} />
                    <View style={styles.chipGrid}>
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
                                        style={styles.chipGradientWrapper}
                                    >
                                        <Text style={[styles.chipText, styles.chipTextActive]}>{type}</Text>
                                    </LinearGradient>
                                ) : (
                                    <View style={styles.chip}>
                                        <Text style={styles.chipText}>{type}</Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Gap height={hp(2)} />

                    {/* Citation Style */}
                    <Text style={styles.chipGroupLabel}>Citation Style</Text>
                    <Gap height={hp(1)} />
                    <View style={styles.chipGrid}>
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
                                        style={styles.chipGradientWrapper}
                                    >
                                        <Text style={[styles.chipText, styles.chipTextActive]}>{cs}</Text>
                                    </LinearGradient>
                                ) : (
                                    <View style={styles.chip}>
                                        <Text style={styles.chipText}>{cs}</Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Advanced Options */}
                    {showAdvanced && (
                        <View style={styles.advancedSection}>
                            <Gap height={hp(2)} />
                            <Text style={styles.fieldLabel}>Keywords/Focus</Text>
                            <Gap height={hp(0.8)} />
                            <TextInput
                                style={styles.textInput}
                                placeholder="concise, focused"
                                placeholderTextColor="#9CA3AF"
                                value={keywords}
                                onChangeText={setKeywords}
                            />

                            <Gap height={hp(2)} />

                            <Text style={styles.fieldLabel}>Research Prompt</Text>
                            <Gap height={hp(0.8)} />
                            <TextInput
                                style={styles.multilineInput}
                                placeholder="Please make..."
                                placeholderTextColor="#9CA3AF"
                                value={researchPrompt}
                                onChangeText={setResearchPrompt}
                                multiline
                            />
                        </View>
                    )}
                </View>

                {/* Create Button */}
                <View style={styles.createBtnWrapper}>
                    <PrimaryButton
                        label="Create Project"
                        filled={true}
                        onPress={handleCreateProject}
                        style={styles.createBtn}
                    />
                    <Gap height={hp(1)} />
                    <Text style={styles.createFooterText}>
                        Project will be created with your selected configuration
                    </Text>
                </View>

                <Gap height={hp(3)} />
            </ScrollView>

            {/* Side Panel Overlay */}
            {showPanel && (
                <TouchableOpacity
                    style={styles.overlay}
                    activeOpacity={1}
                    onPress={togglePanel}
                >
                    <Animated.View
                        style={[styles.sidePanel, { transform: [{ translateX: slideAnim }] }]}
                    >
                        <TouchableOpacity activeOpacity={1}>
                            {/* Panel Header */}
                            <View style={styles.panelHeader}>
                                <View style={styles.panelHeaderLeft}>
                                    <View style={styles.panelIconCircle}>
                                        <MaterialCommunityIcons name="file-document-outline" size={20} color="#FFFFFF" />
                                    </View>
                                    <Text style={styles.panelHeaderTitle}>Research{'\n'}Projects</Text>
                                </View>
                                <View style={styles.panelHeaderRight}>
                                    <TouchableOpacity
                                        style={styles.newProjectBtn}
                                        onPress={() => { togglePanel(); }}
                                    >
                                        <Feather name="plus" size={14} color="#FFFFFF" />
                                        <Text style={styles.newProjectBtnText}>New{'\n'}Project</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={togglePanel} style={styles.panelCloseBtn}>
                                        <Feather name="chevron-left" size={20} color="#FFFFFF" />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Panel Content */}
                            <ScrollView style={styles.panelContent}>
                                {projects.length > 0 ? (
                                    projects.map((project) => (
                                        <TouchableOpacity key={project.id} style={styles.projectItem}>
                                            <View style={styles.projectItemRow}>
                                                <Feather name="file-text" size={14} color="#4A90B9" />
                                                <Text style={styles.projectItemTitle} numberOfLines={1}>
                                                    {project.topic}
                                                </Text>
                                            </View>
                                            <View style={styles.projectItemRow}>
                                                <Feather name="clock" size={12} color="#9CA3AF" />
                                                <Text style={styles.projectItemDate}>{project.date}</Text>
                                                <Text style={styles.projectItemBadge}>{project.contentType}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    ))
                                ) : (
                                    <View style={styles.emptyState}>
                                        <MaterialCommunityIcons name="file-document-outline" size={48} color="#D1D5DB" />
                                        <Gap height={hp(1.5)} />
                                        <Text style={styles.emptyStateTitle}>No research projects yet</Text>
                                        <Text style={styles.emptyStateDesc}>Create your first research project</Text>
                                    </View>
                                )}
                            </ScrollView>
                        </TouchableOpacity>
                    </Animated.View>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    outerWrapper: {
        backgroundColor: '#FFFFFF',
        margin: 15,
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 3,
        height: hp(68),
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        backgroundColor: '#FAFBFC',
        gap: 12,
    },
    menuBtn: {
        width: 38,
        height: 38,
        borderRadius: 10,
        backgroundColor: '#EBF5FF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#4A90B9',
    },
    headerSubtitle: {
        fontSize: 12,
        color: '#6B7280',
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
        backgroundColor: '#F9FAFB',
    },
    heroIconCircle: {
        width: 56,
        height: 56,
        borderRadius: 16,
        backgroundColor: '#4A90B9',
        justifyContent: 'center',
        alignItems: 'center',
    },
    heroTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#111827',
        textAlign: 'center',
    },
    heroDesc: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 20,
    },

    /* Form Card */
    formCard: {
        marginHorizontal: 16,
        marginTop: 16,
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    fieldLabel: {
        fontSize: 14,
        fontWeight: '700',
        color: '#111827',
    },
    required: {
        color: '#EF4444',
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 14,
        color: '#111827',
        backgroundColor: '#FAFBFC',
    },
    multilineInput: {
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 14,
        color: '#111827',
        backgroundColor: '#FAFBFC',
        minHeight: 100,
        textAlignVertical: 'top',
    },

    /* Upload Area */
    uploadArea: {
        borderWidth: 2,
        borderColor: '#D1D5DB',
        borderStyle: 'dashed',
        borderRadius: 12,
        paddingVertical: hp(3),
        paddingHorizontal: 20,
        alignItems: 'center',
        backgroundColor: '#FAFBFC',
    },
    uploadIconCircle: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#4A90B9',
        justifyContent: 'center',
        alignItems: 'center',
    },
    uploadText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        textAlign: 'center',
    },
    uploadSubText: {
        fontSize: 12,
        color: '#9CA3AF',
        textAlign: 'center',
        marginTop: 4,
    },
    chooseFilesBtn: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: '#4A90B9',
        borderRadius: 8,
    },
    chooseFilesBtnText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4A90B9',
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
        color: '#000',
    },
    advancedToggleBtn: {
        borderWidth: 1,
        borderColor: '#4A90B9',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    advancedToggle: {
        fontSize: 13,
        fontWeight: '600',
        color: '#4A90B9',
    },
    chipGroupLabel: {
        fontSize: 14,
        fontWeight: '700',
        color: '#111827',
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
        borderColor: '#E5E7EB',
        backgroundColor: '#FFFFFF',
    },
    chipActive: {
        backgroundColor: '#4A90B9',
        borderColor: '#4A90B9',
        height: hp(4),
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: wp(2),
    },
    chipGradientWrapper: {
        paddingHorizontal: wp(2),
        // paddingVertical: 10,
        borderRadius: 20,
        height: hp(4),
        justifyContent: 'center',
        alignItems: 'center',
    },
    chipText: {
        fontSize: 13,
        fontWeight: '500',
        color: '#374151',
    },
    chipTextActive: {
        color: '#FFFFFF',
    },
    advancedSection: {
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
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
        color: '#9CA3AF',
        textAlign: 'center',
    },

    /* Side Panel Overlay */
    overlay: {
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
        width: wp(72),
        backgroundColor: '#FFFFFF',
        borderRightWidth: 1,
        borderRightColor: '#E5E7EB',
        borderTopLeftRadius: 12,
        borderBottomLeftRadius: 12,
        zIndex: 101,
    },
    panelHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 14,
        backgroundColor: '#4A90B9',
        borderTopLeftRadius: 12,
    },
    panelHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
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
        gap: 8,
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
        borderBottomColor: '#F3F4F6',
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
        color: '#111827',
        flex: 1,
    },
    projectItemDate: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    projectItemBadge: {
        fontSize: 10,
        color: '#4A90B9',
        backgroundColor: '#EBF5FF',
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
        color: '#6B7280',
    },
    emptyStateDesc: {
        fontSize: 13,
        color: '#9CA3AF',
        marginTop: 4,
    },
});

export default Pathfinder;
