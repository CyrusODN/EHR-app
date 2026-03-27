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

const SpotlightScreen = () => {
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState('');
    const navigation = useNavigation();
    const [active, setActive] = useState(0);
    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.headerTitle}>{t('spotlight.title')}</Text>
                        <Text style={styles.headerSubtitle}>
                            {t('spotlight.subtitle')}
                        </Text>
                    </View>
                    <View style={styles.headerRightContainer}>
                        <TouchableOpacity
                            onPress={() => {
                                navigation.goBack();
                            }}
                            style={styles.menuButton}>
                            <Ionicons name="arrow-back" size={20} color="#4A90B9" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Content */}
                <View style={styles.contentContainer}>
                    <View style={styles.actionButtonsContainer}>
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
                        <View style={styles.searchContainer}>
                            <Text style={styles.searchLabel}>{t('spotlight.patientSelection')}</Text>
                            <Searchbar
                                placeholder={t('spotlight.searchPatient')}
                                style={styles.searchBar}

                                icon="magnify" value={''} />
                        </View>
                        :
                        <View style={styles.searchContainer}>
                            <Text style={styles.searchLabel}>{t('spotlight.myRequests')}</Text>
                            <View style={{ width: '100%', backgroundColor: "#ccc", height: 1, marginVertical: hp(1) }} />
                            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                <View style={{ width: '65%', }}>
                                    <View style={{ flexDirection: "row", alignItems: "center", }}>
                                        <MaterialCommunityIcons name="clock-outline" color="orange" size={20} />
                                        <Text style={{
                                            marginLeft: wp(1)
                                        }}>{t('spotlight.status.pending')}</Text>
                                    </View>
                                    <Text style={{ color: "grey" }}>{t('spotlight.patientId')}: P123</Text>
                                    <Text style={{ color: "grey" }}>{t('spotlight.submissionDate')}: 19/03/2024, 10:00:00</Text>
                                </View>
                                <PrimaryButton
                                    label={"Podglad"}
                                    filled={false}
                                    onPress={() => { }}
                                    style={{ width: "35%" }}
                                    icon={<MaterialCommunityIcons name="eye-outline" color="#4A90B9" size={20} />}
                                    image={undefined}
                                    iconStyle={undefined} imageStyle={undefined}
                                    loading={false}
                                    disabled={false}
                                />
                            </View>
                            <View style={{ width: '100%', backgroundColor: "#ccc", height: 1, marginVertical: hp(1) }} />
                            <View>
                                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                    <View style={{ width: '50%', }}>
                                        <View style={{ flexDirection: "row", alignItems: "center", }}>
                                            <Feather name="check-circle" color="green" size={20} />
                                            <Text style={{
                                                marginLeft: wp(1)
                                            }}>{t('spotlight.status.accepted')}</Text>
                                        </View>
                                        <Text style={{ color: "grey" }}>{t('spotlight.patientId')}: P123</Text>
                                        <Text style={{ color: "grey" }}>{t('spotlight.submissionDate')}: 19/03/2024, 10:00:00</Text>
                                    </View>
                                    <View style={{ width: "50%" }} >
                                        <PrimaryButton
                                            label={t('spotlight.view')}
                                            filled={false}
                                            onPress={() => { }}
                                            style={{ width: "70%", alignSelf: "flex-end" }}
                                            icon={<MaterialCommunityIcons name="eye-outline" color="#4A90B9" size={20} />}
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
                                <Text style={{
                                    marginLeft: wp(1)
                                }}>{t('spotlight.clinicalCenter')}</Text>
                                <Text style={{ marginLeft: wp(1), color: "grey" }}>{t('spotlight.migraineStudy')}</Text>
                            </View>

                        </View>

                    }
                </View>

                {/* Help Button */}
                <TouchableOpacity style={styles.helpButtonFloat}>
                    <Text style={styles.helpText}>?</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingHorizontal: 20,
        paddingTop: 15,
        paddingBottom: 15,
        backgroundColor: '#FFFFFF',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333333',
        marginTop: 5,
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#666666',
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
        borderColor: '#4A90B9',
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
    actionButton: {
        justifyContent: "center",
        borderRadius: 8,
        alignItems: 'center',
    },
    actionButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    searchContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    searchLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333333',
    },
    helpButtonFloat: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#4A90B9',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    helpText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    searchBar: {
        borderRadius: 8,
        backgroundColor: "#fff",
        elevation: 0,
        width: '100%',
        borderWidth: 1,
        borderColor: "#ccc"
    },
});

export default SpotlightScreen;