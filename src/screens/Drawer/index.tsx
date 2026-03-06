import React, { useRef, useEffect, useState } from 'react';
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

const SlidingDrawerModal = ({ visible, onClose }: { visible: boolean, onClose: () => void }) => {
    const slideAnim = useRef(new Animated.Value(-width)).current;
    const [modalVisible, setModalVisible] = useState(visible);
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<any>();
    const { purgeAuth, loggedInUser } = userStore() as any;
    const [openSections, setOpenSections] = useState({
        patients: true,
        services: false,
        reports: false
    });
    const [language, setLanguage] = useState('en');
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

    // Profile data from store with fallbacks
    const userName = loggedInUser?.firstName ? `${loggedInUser.firstName} ${loggedInUser.lastName || ''}` : "Hamad Alvi";
    const userEmail = loggedInUser?.email || "hamadhrs23@gmail.com";
    const userRole = loggedInUser?.role || "Director";

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

    return (
        <Modal
            transparent
            visible={modalVisible}
            animationType="none"
            onRequestClose={handleClose}
        >
            <TouchableWithoutFeedback onPress={handleClose}>
                <View style={styles.modalOverlay}>
                    <TouchableWithoutFeedback>
                        <Animated.View
                            style={[
                                styles.modalContent,
                                {
                                    transform: [{ translateX: slideAnim }],
                                    marginTop: insets.top + 10,
                                    marginBottom: 0,
                                    height: Dimensions.get('window').height - insets.top - 10,
                                },
                            ]}
                        >
                            <View style={styles.drawerHeader}>
                                <View style={styles.logoWrapper}>
                                    <LogoSvg size='small' />
                                </View>
                                <TouchableOpacity onPress={handleClose} style={styles.closeButtonRelative}>
                                    <View style={styles.closeIconBg}>
                                        <Feather name="x" size={20} color="#666" />
                                    </View>
                                </TouchableOpacity>
                            </View>

                            <ScrollView
                                style={styles.menuContainer}
                                contentContainerStyle={{ paddingBottom: 20 }}
                                showsVerticalScrollIndicator={false}
                            >
                                {/* Patients Dropdown */}
                                <View style={styles.dropdownSection}>
                                    <TouchableOpacity 
                                        style={styles.dropdownHeader} 
                                        onPress={() => toggleSection('patients')}
                                        activeOpacity={0.7}
                                    >
                                        <View style={styles.dropdownHeaderLeft}>
                                            <Feather name="users" size={20} color="#4B5563" />
                                            <Text style={styles.dropdownTitle}>Patients</Text>
                                        </View>
                                        <Feather 
                                            name={openSections.patients ? "chevron-up" : "chevron-down"} 
                                            size={18} 
                                            color="#9CA3AF" 
                                        />
                                    </TouchableOpacity>
                                    
                                    {openSections.patients && (
                                        <View style={styles.dropdownContent}>
                                            <TouchableOpacity
                                                onPress={() => { onClose(); navigation.navigate("Search-Patient"); }}
                                                style={styles.subMenuItem}>
                                                <Feather name="search" size={18} color="#64748B" />
                                                <Text style={styles.subMenuItemText}>Search patient</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                onPress={() => { onClose(); navigation.navigate("New-Patient"); }}
                                                style={styles.subMenuItem}>
                                                <Feather name="plus-circle" size={18} color="#64748B" />
                                                <Text style={styles.subMenuItemText}>New patient</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                onPress={() => { onClose(); navigation.navigate("Patient-List"); }}
                                                style={styles.subMenuItem}>
                                                <Feather name="users" size={18} color="#64748B" />
                                                <Text style={styles.subMenuItemText}>Patient list</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                onPress={() => { onClose(); navigation.navigate("Schedule-Visits"); }}
                                                style={styles.subMenuItem}>
                                                <Feather name="calendar" size={18} color="#64748B" />
                                                <Text style={styles.subMenuItemText}>Scheduled visits</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                onPress={() => { onClose(); navigation.navigate("Referrals"); }}
                                                style={styles.subMenuItem}>
                                                <Feather name="clipboard" size={18} color="#64748B" />
                                                <Text style={styles.subMenuItemText}>Referrals</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </View>

                                {/* Services Dropdown */}
                                <View style={styles.dropdownSection}>
                                    <TouchableOpacity 
                                        style={styles.dropdownHeader} 
                                        onPress={() => toggleSection('services')}
                                        activeOpacity={0.7}
                                    >
                                        <View style={styles.dropdownHeaderLeft}>
                                            <FontAwesome5 name="stethoscope" size={18} color="#4B5563" />
                                            <Text style={styles.dropdownTitle}>Services</Text>
                                        </View>
                                        <Feather 
                                            name={openSections.services ? "chevron-up" : "chevron-down"} 
                                            size={18} 
                                            color="#9CA3AF" 
                                        />
                                    </TouchableOpacity>
                                    
                                    {openSections.services && (
                                        <View style={styles.dropdownContent}>
                                            <TouchableOpacity style={styles.subMenuItem}>
                                                <Feather name="file-text" size={18} color="#64748B" />
                                                <Text style={styles.subMenuItemText}>Documentation</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                onPress={() => { onClose(); navigation.navigate("AI-Assistant"); }}
                                                style={styles.subMenuItem}>
                                                <MaterialCommunityIcons name="robot-outline" size={18} color="#64748B" />
                                                <Text style={styles.subMenuItemText}>AI Assistants</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </View>

                                {/* Reports Dropdown */}
                                <View style={styles.dropdownSection}>
                                    <TouchableOpacity 
                                        style={styles.dropdownHeader} 
                                        onPress={() => toggleSection('reports')}
                                        activeOpacity={0.7}
                                    >
                                        <View style={styles.dropdownHeaderLeft}>
                                            <Feather name="bar-chart-2" size={20} color="#4B5563" />
                                            <Text style={styles.dropdownTitle}>Reports</Text>
                                        </View>
                                        <Feather 
                                            name={openSections.reports ? "chevron-up" : "chevron-down"} 
                                            size={18} 
                                            color="#9CA3AF" 
                                        />
                                    </TouchableOpacity>
                                    
                                    {openSections.reports && (
                                        <View style={styles.dropdownContent}>
                                            <TouchableOpacity style={styles.subMenuItem}>
                                                <Feather name="bar-chart-2" size={18} color="#64748B" />
                                                <Text style={styles.subMenuItemText}>Statistics</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                onPress={() => { onClose(); navigation.navigate('AI-Analysis'); }}
                                                style={styles.subMenuItem}>
                                                <FontAwesome5 name="brain" size={16} color="#64748B" />
                                                <Text style={styles.subMenuItemText}>AI Analysis</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={styles.subMenuItem}>
                                                <FontAwesome5 name="database" size={14} color="#64748B" />
                                                <Text style={styles.subMenuItemText}>Medical reports</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={styles.subMenuItem}>
                                                <Feather name="file-text" size={18} color="#64748B" />
                                                <Text style={styles.subMenuItemText}>Billing</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </View>

                                <Gap height={hp(1)} />

                                {/* Spotlight Button */}
                                <TouchableOpacity
                                    onPress={() => { onClose(); navigation.navigate('SpotLight'); }}
                                    style={styles.spotlightBtnContainer}
                                >
                                    <View style={styles.spotlightShadowWrapper}>
                                        <LinearGradient
                                            colors={['#4A90B9', '#68BFB4']}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 0 }}
                                            style={styles.spotlightGradient}
                                        >
                                            <Feather name="zap" size={18} color="#fff" />
                                            <Text style={styles.spotlightBtnText}>Spotlight</Text>
                                        </LinearGradient>
                                    </View>
                                </TouchableOpacity>
                            </ScrollView>

                            {/* Sticky Footer Area */}
                            <View style={styles.stickyFooter}>
                                {/* Language Selector (Always visible above Profile area) */}
                                <View style={styles.languageContainer}>
                                    <TouchableOpacity 
                                        style={[styles.langPill, language === 'pl' && styles.langPillActive]}
                                        onPress={() => setLanguage('pl')}
                                    >
                                        <Text style={styles.langEmoji}>🇵🇱</Text>
                                        <Text style={[styles.langText, language === 'pl' && styles.langTextActive]}>Polski</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        style={[styles.langPill, language === 'en' && styles.langPillActive]}
                                        onPress={() => setLanguage('en')}
                                    >
                                        <Text style={styles.langEmoji}>🇬🇧</Text>
                                        <Text style={[styles.langText, language === 'en' && styles.langTextActive]}>English</Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.footerSeparator} />

                                {/* Reordered Footer: Options now appear ABOVE the profile when toggled */}
                                {isProfileMenuOpen && (
                                    <View style={styles.footerOptionsContainer}>
                                        <TouchableOpacity style={styles.footerOptionItem} onPress={() => setIsDarkMode(!isDarkMode)}>
                                            <View style={styles.optionIconLabel}>
                                                <Feather name={isDarkMode ? "sun" : "moon"} size={20} color="#4B5563" />
                                                <Text style={styles.footerOptionText}>Dark Mode</Text>
                                            </View>
                                            <View style={[styles.toggleBase, isDarkMode && styles.toggleBaseActive]}>
                                                <View style={[styles.toggleCircle, isDarkMode && styles.toggleCircleActive]} />
                                            </View>
                                        </TouchableOpacity>

                                        <TouchableOpacity 
                                            style={styles.footerOptionItem} 
                                            onPress={() => { onClose(); navigation.navigate('Settings'); }}
                                        >
                                            <View style={styles.optionIconLabel}>
                                                <Feather name="settings" size={20} color="#4B5563" />
                                                <Text style={styles.footerOptionText}>Settings</Text>
                                            </View>
                                            <Feather name="chevron-right" size={18} color="#9CA3AF" />
                                        </TouchableOpacity>

                                        <TouchableOpacity style={styles.footerOptionItem} onPress={purgeAuth}>
                                            <View style={styles.optionIconLabel}>
                                                <Feather name="log-out" size={20} color="#EF4444" />
                                                <Text style={[styles.footerOptionText, { color: '#EF4444' }]}>Logout</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                )}

                                {/* Profile Section Header (Clickable to toggle options above) */}
                                <TouchableOpacity 
                                    style={styles.profileSection} 
                                    onPress={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                                    activeOpacity={0.8}
                                >
                                    <View style={styles.avatarContainer}>
                                        <View style={styles.avatarCircle}>
                                            {loggedInUser?.profileImage ? (
                                                <Image 
                                                    source={{ uri: loggedInUser.profileImage }} 
                                                    style={styles.avatarImage} 
                                                />
                                            ) : (
                                                <Feather name="user" size={26} color="#4A90B9" />
                                            )}
                                        </View>
                                        <View style={styles.statusDot} />
                                    </View>
                                    <View style={styles.profileInfo}>
                                        <View style={styles.nameHeader}>
                                            <Text style={styles.profileName}>{userName}</Text>
                                            <Feather 
                                                name={isProfileMenuOpen ? "chevron-down" : "chevron-up"} 
                                                size={16} 
                                                color="#9CA3AF" 
                                            />
                                        </View>
                                        <Text style={styles.profileEmail}>{userEmail}</Text>
                                        <View style={styles.roleTag}>
                                            <Text style={styles.roleTagText}>{userRole}</Text>
                                        </View>
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

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#fff',
        borderTopRightRadius: 30,
        borderBottomRightRadius: 0,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 5, height: 0 },
                shadowOpacity: 0.15,
                shadowRadius: 15,
            },
            android: { elevation: 12 },
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
        backgroundColor: '#F9FAFB',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#F1F5F9',
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
        color: '#334155',
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
        color: '#64748B',
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
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 4,
        backgroundColor: 'white', // Helps with shadow calculation
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
        backgroundColor: '#F1F5F9',
        borderRadius: 25,
        padding: 4,
        width: '88%',
        marginBottom: 10,
    },
    footerSeparator: {
        height: 1,
        backgroundColor: '#F1F5F9',
        width: '88%',
        alignSelf: 'center',
        marginBottom: 5,
    },
    footerOptionsContainer: {
        paddingHorizontal: 10,
        backgroundColor: '#fff',
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
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    langEmoji: {
        fontSize: 16,
        marginRight: 8,
    },
    langText: {
        fontSize: 14,
        color: '#94A3B8',
        fontWeight: '600',
    },
    langTextActive: {
        color: '#334155',
    },
    stickyFooter: {
        marginTop: 'auto',
        backgroundColor: '#fff',
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
        paddingBottom: hp(1.5), // Added padding for bottom area
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
        backgroundColor: '#F0F9FF',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E0F2FE',
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
        borderColor: '#fff',
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
        color: '#0F172A',
    },
    profileEmail: {
        fontSize: 14,
        color: '#64748B',
        marginTop: 1,
    },
    roleTag: {
        backgroundColor: '#E0F2FE',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 15,
        alignSelf: 'flex-start',
        marginTop: 8,
    },
    roleTagText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#0369A1',
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
        color: '#334155',
        marginLeft: 15,
    },
    toggleBase: {
        width: 44,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#E2E8F0',
        padding: 2,
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
