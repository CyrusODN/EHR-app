import React, { useRef, useEffect, useState, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
    Dimensions,
    Modal,
    TouchableWithoutFeedback,
    ScrollView,
    Platform,
    Image,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Gap from '../../component/gap';
// import Svg, { Defs, LinearGradient, Stop, G, Path } from 'react-native-svg';
import userStore from '../../store/user';
const { width } = Dimensions.get('window');
import LinearGradient from 'react-native-linear-gradient';
import LogoSvg from '../../component/logo';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '../../hooks/useThemeColors';

const SlidingDrawerModal = ({ visible, onClose }: { visible: boolean, onClose: () => void }) => {
    const slideAnim = useRef(new Animated.Value(-width)).current;
    const [modalVisible, setModalVisible] = useState(visible);
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<any>();
    const { purgeAuth, loggedInUser } = userStore() as any;
    const { i18n, t } = useTranslation();
    const { colors: tc, isDark, toggleTheme } = useThemeColors();
    const [openSections, setOpenSections] = useState({
        patients: true,
        services: false,
        reports: false
    });
    
    // Fallback to exactly 'en' or 'pl' if i18n.language has country codes
    const currentLang = i18n.language?.startsWith('pl') ? 'pl' : 'en';
    const [language, setLanguageState] = useState(currentLang);

    const changeLanguage = (lang: string) => {
        setLanguageState(lang);
        i18n.changeLanguage(lang);
    };

    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

    // Profile data from store — API may use `name` or `firstName`/`lastName`
    const userName = useMemo(() => {
        if (!loggedInUser) return t('common.na');
        const fullName =
            loggedInUser.name?.trim() ||
            `${loggedInUser.firstName || ''} ${loggedInUser.lastName || ''}`.trim();
        return fullName || t('common.na');
    }, [loggedInUser, t]);

    const userEmail = loggedInUser?.email || loggedInUser?.username || '';
    const userRole = loggedInUser?.role || loggedInUser?.accountType || '';

    const toggleSection = (section: string) => {
        setOpenSections(prev => ({
            ...prev,
            //@ts-ignore
            [section]: !prev[section]
        }));
    };

    // Handle opening animation
    useEffect(() => {
        if (visible) {
            setModalVisible(true);
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 250,
                useNativeDriver: true,
            }).start();
        } else {
            // Only hide modal after animation completes
            Animated.timing(slideAnim, {
                toValue: -width,
                duration: 200,
                useNativeDriver: true,
            }).start(() => {
                setModalVisible(false);
            });
        }
    }, [visible, slideAnim]);

    const handleClose = () => {
        onClose();
    };

    // Build theme-aware dynamic styles
    const ds = useMemo(() => createDynamicStyles(tc, isDark), [tc, isDark]);

    return (
        <Modal
            transparent
            visible={modalVisible}
            animationType="none"
            onRequestClose={handleClose}
        >
            <TouchableWithoutFeedback onPress={handleClose}>
                <View style={ds.modalOverlay}>
                    <TouchableWithoutFeedback>
                        <Animated.View
                            style={[
                                ds.modalContent,
                                {
                                    transform: [{ translateX: slideAnim }],
                                    marginTop: insets.top + 10,
                                    marginBottom: 0,
                                    height: Dimensions.get('window').height - insets.top - 10,
                                },
                            ]}
                        >
                            <View style={ds.drawerHeader}>
                                <View style={ds.logoWrapper}>
                                    <LogoSvg size='small' />
                                </View>
                                <TouchableOpacity onPress={handleClose} style={ds.closeButtonRelative}>
                                    <View style={ds.closeIconBg}>
                                        <Feather name="x" size={20} color={tc.textSecondary} />
                                    </View>
                                </TouchableOpacity>
                            </View>

                            <ScrollView
                                style={ds.menuContainer}
                                contentContainerStyle={{ paddingBottom: 20 }}
                                showsVerticalScrollIndicator={false}
                            >
                                {/* Patients Dropdown */}
                                <View style={ds.dropdownSection}>
                                    <TouchableOpacity 
                                        style={ds.dropdownHeader} 
                                        onPress={() => toggleSection('patients')}
                                        activeOpacity={0.7}
                                    >
                                        <View style={ds.dropdownHeaderLeft}>
                                            <Feather name="users" size={20} color={tc.textSecondary} />
                                            <Text style={ds.dropdownTitle}>{t('nav.patients.title')}</Text>
                                        </View>
                                        <Feather 
                                            name={openSections.patients ? "chevron-up" : "chevron-down"} 
                                            size={18} 
                                            color={tc.textMuted} 
                                        />
                                    </TouchableOpacity>
                                    
                                    {openSections.patients && (
                                        <View style={ds.dropdownContent}>
                                            <TouchableOpacity
                                                onPress={() => { onClose(); navigation.navigate("Search-Patient"); }}
                                                style={ds.subMenuItem}>
                                                <Feather name="search" size={18} color={tc.textMuted} />
                                                <Text style={ds.subMenuItemText}>{t('nav.patients.search')}</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                onPress={() => { onClose(); navigation.navigate("New-Patient"); }}
                                                style={ds.subMenuItem}>
                                                <Feather name="plus-circle" size={18} color={tc.textMuted} />
                                                <Text style={ds.subMenuItemText}>{t('nav.patients.new')}</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                onPress={() => { onClose(); navigation.navigate("Patient-List"); }}
                                                style={ds.subMenuItem}>
                                                <Feather name="users" size={18} color={tc.textMuted} />
                                                <Text style={ds.subMenuItemText}>{t('nav.patients.list')}</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                onPress={() => { onClose(); navigation.navigate("Schedule-Visits"); }}
                                                style={ds.subMenuItem}>
                                                <Feather name="calendar" size={18} color={tc.textMuted} />
                                                <Text style={ds.subMenuItemText}>{t('nav.patients.appointments')}</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                onPress={() => { onClose(); navigation.navigate("Referrals"); }}
                                                style={ds.subMenuItem}>
                                                <Feather name="clipboard" size={18} color={tc.textMuted} />
                                                <Text style={ds.subMenuItemText}>{t('nav.patients.referrals')}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </View>

                                {/* Services Dropdown */}
                                <View style={ds.dropdownSection}>
                                    <TouchableOpacity 
                                        style={ds.dropdownHeader} 
                                        onPress={() => toggleSection('services')}
                                        activeOpacity={0.7}
                                    >
                                        <View style={ds.dropdownHeaderLeft}>
                                            <FontAwesome5 name="stethoscope" size={18} color={tc.textSecondary} />
                                            <Text style={ds.dropdownTitle}>{t('nav.services.title')}</Text>
                                        </View>
                                        <Feather 
                                            name={openSections.services ? "chevron-up" : "chevron-down"} 
                                            size={18} 
                                            color={tc.textMuted} 
                                        />
                                    </TouchableOpacity>
                                    
                                    {openSections.services && (
                                        <View style={ds.dropdownContent}>
                                            <TouchableOpacity style={ds.subMenuItem}>
                                                <Feather name="file-text" size={18} color={tc.textMuted} />
                                                <Text style={ds.subMenuItemText}>{t('nav.services.documents')}</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                onPress={() => { onClose(); navigation.navigate("AI-Assistant"); }}
                                                style={ds.subMenuItem}>
                                                <MaterialCommunityIcons name="robot-outline" size={18} color={tc.textMuted} />
                                                <Text style={ds.subMenuItemText}>{t('nav.services.aiAssistants')}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </View>

                                {/* Reports Dropdown */}
                                <View style={ds.dropdownSection}>
                                    <TouchableOpacity 
                                        style={ds.dropdownHeader} 
                                        onPress={() => toggleSection('reports')}
                                        activeOpacity={0.7}
                                    >
                                        <View style={ds.dropdownHeaderLeft}>
                                            <Feather name="bar-chart-2" size={20} color={tc.textSecondary} />
                                            <Text style={ds.dropdownTitle}>{t('nav.reports.title')}</Text>
                                        </View>
                                        <Feather 
                                            name={openSections.reports ? "chevron-up" : "chevron-down"} 
                                            size={18} 
                                            color={tc.textMuted} 
                                        />
                                    </TouchableOpacity>
                                    
                                    {openSections.reports && (
                                        <View style={ds.dropdownContent}>
                                            <TouchableOpacity style={ds.subMenuItem}>
                                                <Feather name="bar-chart-2" size={18} color={tc.textMuted} />
                                                <Text style={ds.subMenuItemText}>{t('nav.reports.statistics')}</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                onPress={() => { onClose(); navigation.navigate('AI-Analysis'); }}
                                                style={ds.subMenuItem}>
                                                <FontAwesome5 name="brain" size={16} color={tc.textMuted} />
                                                <Text style={ds.subMenuItemText}>{t('nav.reports.aiAnalysis')}</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={ds.subMenuItem}>
                                                <FontAwesome5 name="database" size={14} color={tc.textMuted} />
                                                <Text style={ds.subMenuItemText}>{t('nav.reports.medicalReports')}</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={ds.subMenuItem}>
                                                <Feather name="file-text" size={18} color={tc.textMuted} />
                                                <Text style={ds.subMenuItemText}>{t('nav.reports.billing')}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </View>

                                <Gap height={hp(1)} />

                                {/* Spotlight Button */}
                                <TouchableOpacity
                                    onPress={() => { onClose(); navigation.navigate('SpotLight'); }}
                                    style={ds.spotlightBtnContainer}
                                >
                                    <View style={ds.spotlightShadowWrapper}>
                                        <LinearGradient
                                            colors={['#4A90B9', '#68BFB4']}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 0 }}
                                            style={ds.spotlightGradient}
                                        >
                                            <Feather name="zap" size={18} color="#fff" />
                                            <Text style={ds.spotlightBtnText}>{t('nav.actions.spotlight')}</Text>
                                        </LinearGradient>
                                    </View>
                                </TouchableOpacity>
                            </ScrollView>

                            {/* Sticky Footer Area */}
                            <View style={ds.stickyFooter}>
                                {/* Language Selector (Always visible above Profile area) */}
                                <View style={ds.languageContainer}>
                                    <TouchableOpacity 
                                        style={[ds.langPill, language === 'pl' && ds.langPillActive]}
                                        onPress={() => changeLanguage('pl')}
                                    >
                                        <Text style={ds.langEmoji}>🇵🇱</Text>
                                        <Text style={[ds.langText, language === 'pl' && ds.langTextActive]}>Polski</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        style={[ds.langPill, language === 'en' && ds.langPillActive]}
                                        onPress={() => changeLanguage('en')}
                                    >
                                        <Text style={ds.langEmoji}>🇬🇧</Text>
                                        <Text style={[ds.langText, language === 'en' && ds.langTextActive]}>English</Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={ds.footerSeparator} />

                                {/* Reordered Footer: Options now appear ABOVE the profile when toggled */}
                                {isProfileMenuOpen && (
                                    <View style={ds.footerOptionsContainer}>
                                        <TouchableOpacity style={ds.footerOptionItem} onPress={toggleTheme}>
                                            <View style={ds.optionIconLabel}>
                                                <Feather name={isDark ? "sun" : "moon"} size={20} color={isDark ? '#FBBF24' : tc.textSecondary} />
                                                <Text style={ds.footerOptionText}>{t('nav.options.darkMode')}</Text>
                                            </View>
                                            <View style={[ds.toggleBase, isDark && ds.toggleBaseActive]}>
                                                <Animated.View style={[ds.toggleCircle, isDark && ds.toggleCircleActive]} />
                                            </View>
                                        </TouchableOpacity>

                                        <TouchableOpacity 
                                            style={ds.footerOptionItem} 
                                            onPress={() => { onClose(); navigation.navigate('Settings'); }}
                                        >
                                            <View style={ds.optionIconLabel}>
                                                <Feather name="settings" size={20} color={tc.textSecondary} />
                                                <Text style={ds.footerOptionText}>{t('nav.options.settings')}</Text>
                                            </View>
                                            <Feather name="chevron-right" size={18} color={tc.textMuted} />
                                        </TouchableOpacity>

                                        <TouchableOpacity style={ds.footerOptionItem} onPress={purgeAuth}>
                                            <View style={ds.optionIconLabel}>
                                                <Feather name="log-out" size={20} color="#EF4444" />
                                                <Text style={[ds.footerOptionText, { color: '#EF4444' }]}>{t('common.logout')}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                )}

                                {/* Profile Section Header (Clickable to toggle options above) */}
                                <TouchableOpacity 
                                    style={ds.profileSection} 
                                    onPress={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                                    activeOpacity={0.8}
                                >
                                    <View style={ds.avatarContainer}>
                                        <View style={ds.avatarCircle}>
                                            {loggedInUser?.profileImage ? (
                                                <Image 
                                                    source={{ uri: loggedInUser.profileImage }} 
                                                    style={ds.avatarImage} 
                                                />
                                            ) : (
                                                <Feather name="user" size={26} color="#4A90B9" />
                                            )}
                                        </View>
                                        <View style={ds.statusDot} />
                                    </View>
                                    <View style={ds.profileInfo}>
                                        <View style={ds.nameHeader}>
                                            <Text style={ds.profileName}>{userName}</Text>
                                            <Feather 
                                                name={isProfileMenuOpen ? "chevron-down" : "chevron-up"} 
                                                size={16} 
                                                color={tc.textMuted} 
                                            />
                                        </View>
                                        {!!userEmail && (
                                            <Text style={ds.profileEmail}>{userEmail}</Text>
                                        )}
                                        {!!userRole && (
                                            <View style={ds.roleTag}>
                                                <Text style={ds.roleTagText}>{userRole}</Text>
                                            </View>
                                        )}
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </Animated.View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

/** Creates theme-aware styles for the drawer */
const createDynamicStyles = (tc: any, isDark: boolean) =>
    StyleSheet.create({
        modalOverlay: {
            flex: 1,
            backgroundColor: isDark ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.5)',
        },
        modalContent: {
            width: '80%',
            backgroundColor: tc.drawerBg,
            borderTopRightRadius: 30,
            borderBottomRightRadius: 0,
            ...Platform.select({
                ios: {
                    shadowColor: tc.shadow,
                    shadowOffset: { width: 5, height: 0 },
                    shadowOpacity: isDark ? 0 : 0.15,
                    shadowRadius: 15,
                },
                android: { elevation: isDark ? 0 : 12 },
            }),
        },
        drawerHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 25,
            paddingTop: 20,
            paddingBottom: 10,
        },
        logoWrapper: {
            width: 150,
            height: 40,
            justifyContent: 'center',
        },
        closeButtonRelative: {
            padding: 5,
        },
        closeIconBg: {
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: isDark ? tc.buttonMutedBg : '#F9FAFB',
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: tc.borderColor,
        },
        menuContainer: {
            flex: 1,
        },
        dropdownSection: {
            paddingHorizontal: 20,
            marginBottom: 4,
        },
        dropdownHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: 12,
            paddingHorizontal: 12,
            borderRadius: 12,
        },
        dropdownHeaderLeft: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        dropdownTitle: {
            fontSize: 17,
            fontWeight: '600',
            color: tc.textPrimary,
            marginLeft: 14,
        },
        dropdownContent: {
            paddingLeft: 46,
            paddingTop: 2,
            paddingBottom: 8,
        },
        subMenuItem: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 10,
        },
        subMenuItemText: {
            fontSize: 15,
            color: tc.textSecondary,
            fontWeight: '400',
            marginLeft: 12,
        },
        spotlightBtnContainer: {
            width: '88%',
            alignSelf: 'center',
            marginTop: 15,
        },
        spotlightGradient: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            height: 50,
            borderRadius: 15,
        },
        spotlightShadowWrapper: {
            borderRadius: 15,
            shadowColor: '#4A90B9',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: isDark ? 0.15 : 0.2,
            shadowRadius: 6,
            elevation: 4,
            backgroundColor: tc.cardBackground,
        },
        spotlightBtnText: {
            color: '#fff',
            fontSize: 16,
            fontWeight: '700',
            marginLeft: 10,
        },
        languageContainer: {
            flexDirection: 'row',
            alignSelf: 'center',
            backgroundColor: isDark ? tc.buttonMutedBg : '#F1F5F9',
            borderRadius: 25,
            padding: 4,
            width: '88%',
            marginBottom: 10,
        },
        footerSeparator: {
            height: 1,
            backgroundColor: tc.borderColor,
            width: '88%',
            alignSelf: 'center',
            marginBottom: 5,
        },
        footerOptionsContainer: {
            paddingHorizontal: 10,
            backgroundColor: tc.drawerBg,
        },
        langPill: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 8,
            borderRadius: 22,
        },
        langPillActive: {
            backgroundColor: tc.cardBackground,
            shadowColor: tc.shadow,
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: isDark ? 0 : 0.1,
            shadowRadius: 2,
            elevation: isDark ? 0 : 1,
            borderWidth: isDark ? 1 : 0,
            borderColor: tc.borderColor,
        },
        langEmoji: {
            fontSize: 16,
            marginRight: 8,
        },
        langText: {
            fontSize: 14,
            color: tc.textMuted,
            fontWeight: '600',
        },
        langTextActive: {
            color: tc.textPrimary,
        },
        stickyFooter: {
            marginTop: 'auto',
            backgroundColor: tc.drawerBg,
            paddingTop: 15,
            borderTopWidth: 1,
            borderTopColor: tc.borderColor,
            paddingBottom: hp(1.5),
        },
        profileSection: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 25,
            paddingVertical: 18,
        },
        avatarContainer: {
            position: 'relative',
        },
        avatarCircle: {
            width: 52,
            height: 52,
            borderRadius: 26,
            backgroundColor: isDark ? tc.accentLight : '#F0F9FF',
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: isDark ? tc.borderColor : '#E0F2FE',
            overflow: 'hidden',
        },
        avatarImage: {
            width: 52,
            height: 52,
            borderRadius: 26,
        },
        statusDot: {
            position: 'absolute',
            bottom: 2,
            right: 2,
            width: 14,
            height: 14,
            borderRadius: 7,
            backgroundColor: '#10B981',
            borderWidth: 2,
            borderColor: tc.cardBackground,
        },
        profileInfo: {
            flex: 1,
            marginLeft: 15,
        },
        nameHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
        },
        profileName: {
            fontSize: 18,
            fontWeight: '700',
            color: tc.textPrimary,
        },
        profileEmail: {
            fontSize: 14,
            color: tc.textSecondary,
            marginTop: 1,
        },
        roleTag: {
            backgroundColor: isDark ? tc.accentLight : '#E0F2FE',
            paddingHorizontal: 12,
            paddingVertical: 4,
            borderRadius: 15,
            alignSelf: 'flex-start',
            marginTop: 8,
        },
        roleTagText: {
            fontSize: 13,
            fontWeight: '600',
            color: isDark ? '#60A5FA' : '#0369A1',
        },
        footerOptions: {
            paddingHorizontal: 10,
            paddingBottom: 5,
        },
        footerOptionItem: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: 14,
            paddingHorizontal: 15,
            borderRadius: 12,
        },
        optionIconLabel: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        footerOptionText: {
            fontSize: 16,
            fontWeight: '500',
            color: tc.textPrimary,
            marginLeft: 15,
        },
        toggleBase: {
            width: 44,
            height: 24,
            borderRadius: 12,
            backgroundColor: isDark ? '#3F3F46' : '#E2E8F0',
            padding: 2,
            justifyContent: 'center',
        },
        toggleBaseActive: {
            backgroundColor: '#4A90B9',
        },
        toggleCircle: {
            width: 20,
            height: 20,
            borderRadius: 10,
            backgroundColor: '#fff',
        },
        toggleCircleActive: {
            transform: [{ translateX: 20 }],
        },
    });

export default SlidingDrawerModal;
