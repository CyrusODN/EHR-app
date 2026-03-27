import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    TouchableOpacity,
    Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomTextInput from '../../component/customTextInput';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import PrimaryButton from '../../component/button';
import { Searchbar } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '../../hooks/useThemeColors';

const SpotlightScreen = () => {
    const { t } = useTranslation();
    const { colors: tc, isDark } = useThemeColors();
    const ds = createDynamicStyles(tc, isDark);
    const [searchQuery, setSearchQuery] = useState('');
    const navigation = useNavigation();
    const [active, setActive] = useState(0);
    return (
        <View style={{ flex: 1, backgroundColor: tc.screenBackground }}>
            <SafeAreaView style={ds.safeArea}>
                <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={tc.screenBackground} />
            <View style={ds.container}>
                {/* Header */}
                <View style={ds.header}>
                    <View>
                        <Text style={ds.headerTitle}>{t('spotlight.title')}</Text>
                        <Text style={ds.headerSubtitle}>
                            {t('spotlight.subtitle')}
                        </Text>
                    </View>
                    <View style={ds.headerRightContainer}>
                        <TouchableOpacity
                            onPress={() => {
                                navigation.goBack();
                            }}
                            style={ds.menuButton}>
                            <Ionicons name="arrow-back" size={20} color={tc.accent} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Content */}
                <View style={ds.contentContainer}>
                    <View style={ds.actionButtonsContainer}>
                        <PrimaryButton
                            label={t('spotlight.newSubmission')}
                            filled={active == 0 ? true : false}
                            onPress={() => {
                                setActive(0);
                            }}
                            style={{ width: "48%" }}
                            icon={undefined}
                            image={undefined}
                            iconStyle={undefined} imageStyle={undefined}
                            loading={false}
                            disabled={false}
                        />
                        <PrimaryButton
                            label={t('spotlight.mySubmission')}
                            filled={active == 1 ? true : false}
                            onPress={() => {
                                setActive(1);
                            }}
                            style={{ width: "48%" }}
                            icon={undefined}
                            image={undefined}
                            iconStyle={undefined} imageStyle={undefined}
                            loading={false}
                            disabled={false}
                        />

                    </View>

                    {active == 0 ?
                        <View style={ds.searchContainer}>
                            <Text style={ds.searchLabel}>{t('spotlight.patientSelection')}</Text>
                            <Searchbar
                                placeholder={t('spotlight.searchPatient')}
                                style={ds.searchBar}
                                iconColor={tc.textSecondary}
                                placeholderTextColor={tc.textMuted}
                                inputStyle={{ color: tc.textPrimary }}
                                icon="magnify" value={''} />
                        </View>
                        :
                        <View style={ds.searchContainer}>
                            <Text style={ds.searchLabel}>{t('spotlight.myRequests')}</Text>
                            <View style={[ds.divider, { marginVertical: hp(1) }]} />
                            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                <View style={{ width: '65%', }}>
                                    <View style={{ flexDirection: "row", alignItems: "center", }}>
                                        <MaterialCommunityIcons name="clock-outline" color="#f97316" size={20} />
                                        <Text style={[ds.statusText, { color: '#f97316' }]}>{t('spotlight.status.pending')}</Text>
                                    </View>
                                    <Text style={ds.infoText}>{t('spotlight.patientId')}: P123</Text>
                                    <Text style={ds.infoText}>{t('spotlight.submissionDate')}: 19/03/2024, 10:00:00</Text>
                                </View>
                                <PrimaryButton
                                    label={"Podglad"}
                                    filled={false}
                                    onPress={() => { }}
                                    style={{ width: "35%" }}
                                    icon={<MaterialCommunityIcons name="eye-outline" color={tc.accent} size={20} />}
                                    image={undefined}
                                    iconStyle={undefined} imageStyle={undefined}
                                    loading={false}
                                    disabled={false}
                                />
                            </View>
                            <View style={[ds.divider, { marginVertical: hp(1) }]} />
                            <View>
                                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                    <View style={{ width: '50%', }}>
                                        <View style={{ flexDirection: "row", alignItems: "center", }}>
                                            <Feather name="check-circle" color="#10b981" size={20} />
                                            <Text style={[ds.statusText, { color: '#10b981' }]}>{t('spotlight.status.accepted')}</Text>
                                        </View>
                                        <Text style={ds.infoText}>{t('spotlight.patientId')}: P123</Text>
                                        <Text style={ds.infoText}>{t('spotlight.submissionDate')}: 19/03/2024, 10:00:00</Text>
                                    </View>
                                    <View style={{ width: "50%" }} >
                                        <PrimaryButton
                                            label={t('spotlight.view')}
                                            filled={false}
                                            onPress={() => { }}
                                            style={{ width: "70%", alignSelf: "flex-end" }}
                                            icon={<MaterialCommunityIcons name="eye-outline" color={tc.accent} size={20} />}
                                            image={undefined}
                                            iconStyle={undefined}
                                            imageStyle={undefined}
                                            loading={false}
                                            disabled={false}
                                        />
                                        <PrimaryButton
                                            label={t('spotlight.includeInStudy')}
                                            filled={true}
                                            onPress={() => { }}
                                            style={{ width: "100%" }}
                                            icon={<Feather name="user-plus" color="white" size={18} />}
                                            image={undefined}
                                            iconStyle={undefined}
                                            imageStyle={undefined}
                                            loading={false}
                                            disabled={false}
                                        />
                                    </View>

                                </View>
                                <Text style={ds.clinicalCenterText}>{t('spotlight.clinicalCenter')}</Text>
                                <Text style={[ds.infoText, { marginLeft: wp(1) }]}>{t('spotlight.migraineStudy')}</Text>
                            </View>

                        </View>

                    }
                </View>

                {/* Help Button */}
                <TouchableOpacity style={ds.helpButtonFloat}>
                    <Text style={ds.helpText}>?</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
        </View>
    );
};

const createDynamicStyles = (tc: any, isDark: boolean) => StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: tc.screenBackground,
    },
    container: {
        flex: 1,
        backgroundColor: tc.screenBackground,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingHorizontal: 20,
        paddingTop: 15,
        paddingBottom: 15,
        backgroundColor: tc.cardBackground,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: tc.textPrimary,
        marginTop: 5,
    },
    headerSubtitle: {
        fontSize: 16,
        color: tc.textSecondary,
        marginTop: 5,
        maxWidth: wp(70),
    },
    headerRightContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuButton: {
        padding: 8,
        borderWidth: 1,
        borderColor: tc.accent,
        borderRadius: 50,
        height: 50,
        width: 50,
        alignItems: "center",
        justifyContent: 'center',
    },
    contentContainer: {
        flex: 1,
        padding: 15,
    },
    actionButtonsContainer: {
        flexDirection: 'row',
        marginBottom: 20,
        alignItems: "center",
        justifyContent: "space-between"
    },
    searchContainer: {
        backgroundColor: tc.cardBackground,
        borderRadius: 10,
        padding: 15,
        shadowColor: tc.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isDark ? 0.3 : 0.1,
        shadowRadius: 5,
        elevation: 3,
        borderWidth: isDark ? 1 : 0,
        borderColor: tc.borderSubtle,
    },
    searchLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: tc.textPrimary,
    },
    statusText: {
        marginLeft: wp(1),
        fontWeight: '500',
    },
    infoText: {
        color: tc.textSecondary,
        fontSize: 14,
        marginVertical: 2,
    },
    clinicalCenterText: {
        marginLeft: wp(1),
        marginTop: 10,
        fontWeight: 'bold',
        color: tc.textPrimary,
    },
    divider: {
        width: '100%',
        backgroundColor: tc.borderSubtle,
        height: 1,
    },
    helpButtonFloat: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: tc.accent,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: tc.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    helpText: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
    },
    searchBar: {
        borderRadius: 8,
        backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#FFFFFF',
        elevation: 0,
        width: '100%',
        borderWidth: 1,
        borderColor: tc.borderSubtle,
    },
});

export default SpotlightScreen;