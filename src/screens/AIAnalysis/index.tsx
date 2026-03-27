import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    KeyboardAvoidingView,
    StatusBar,
    TouchableOpacity,
    ScrollView,
    Platform,
    Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import MedicalFilterForm from './Layout/filterForm';
import Gap from '../../component/gap';
import StatCard from './Layout/statCard';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import MedicalCharts from './Layout/medicalCharts';
import { useTranslation } from 'react-i18next';


const AIAnalysis = ({ }) => {
    const navigation = useNavigation();
    const { t } = useTranslation();
    const tabs = [
        t('aiAnalysis.tabs.analysis'),
        t('aiAnalysis.tabs.summary'),
        t('aiAnalysis.tabs.recommendations')
    ];
    const [activeTab, setActiveTab] = useState(tabs[0]);

    return (
        <KeyboardAvoidingView
            style={styles.safeArea}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

            {/* Header */}
            <View style={styles.header}>
                <View style={{
                    backgroundColor: "rgba(90,167,179,0.1)",
                    height: 45, width: 45, alignItems: "center", justifyContent: 'center',
                    borderRadius: 10
                }}>
                    <Image source={require('../../assets/images/brain-primary.png')} style={{ height: 25, width: 25 }} />
                </View>
                <View style={{ width: wp(65) }}>
                    <Text style={styles.headerTitle}>{t('aiAnalysis.header.title')}</Text>
                    <Text style={styles.headerSubtitle}>
                        {t('aiAnalysis.header.subtitle')}
                    </Text>
                </View>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <Ionicons name="arrow-back" size={20} color="#4A90B9" />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.container}>
                {/* Section 0 Form */}
                <MedicalFilterForm />

                <Gap height={hp(3)} />
                {/* Section 1 Cards*/}
                <View style={{
                    width: "100%", flexDirection: "row", justifyContent: "space-between"
                }} >
                    <StatCard
                        title={t('aiAnalysis.statCards.visits')}
                        icon={<Feather name="calendar" color='#4A90B9' size={20} />}
                        score={"1,234"}
                        subtitle={t('aiAnalysis.statCards.vsPreviousPeriod', { percentage: '12.5' })} />
                    <StatCard
                        title={t('aiAnalysis.statCards.avgTimeToRemission')}
                        icon={<Feather name="clock" color='#4A90B9' size={20} />}
                        score={"8.5 tyg"}
                        subtitle={t('aiAnalysis.statCards.vsPreviousPeriod', { percentage: '15.3' })} />
                </View>
                <Gap height={hp(2)} />
                <View style={{
                    width: "100%", flexDirection: "row", justifyContent: "space-between"
                }} >
                    <StatCard
                        title={t('aiAnalysis.statCards.treatmentEffectiveness')}
                        icon={<Image source={require("../../assets/images/chartbeat.png")} style={{ height: 20, width: 20 }} />}
                        score={"78.5%"}
                        subtitle={t('aiAnalysis.statCards.vsPreviousPeriod', { percentage: '5.2' })} />
                    <StatCard
                        title={t('aiAnalysis.statCards.adherence')}
                        icon={<Image source={require("../../assets/images/adherenece.png")} style={{ height: 20, width: 20 }} />}
                        score={"92.3%"}
                        subtitle={t('aiAnalysis.statCards.vsPreviousPeriod', { percentage: '3.1' })} />
                </View>
                <Gap height={hp(3)} />

                {/* Section 2 Graphs */}
                <MedicalCharts />


                {/* Section 3  Conclusions AI*/}
                <View style={{
                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                    shadowOpacity: 0.23,
                    shadowRadius: 2.62,
                    // Android shadow
                    elevation: 4,
                    backgroundColor: "white", padding: 10, borderRadius: 10,

                }}>
                    <View style={{ flexDirection: "row", width: "100%", alignItems: "center", justifyContent: "space-between" }} >
                        <Image source={require('../../assets/images/brain-primary.png')} style={{ height: 25, width: 25, alignSelf: "flex-start", marginTop: hp(0.5) }} />
                        <View style={{ width: wp(80) }}>
                            <Text style={styles.headerTitle}>{t('aiAnalysis.conclusions.title')}</Text>
                            <Gap height={hp(0.5)} />
                            <View style={{ flexDirection: "row" }} >
                                <Image source={require('../../assets/images/stars.png')} style={{ width: 20, height: 20, marginRight: 10 }} />
                                <Text style={styles.headerSubtitle}>
                                    {t('aiAnalysis.conclusions.subtitle')}
                                </Text>
                            </View>
                        </View>
                    </View>

                    <Gap height={hp(2)} />
                    <Text style={{ fontSize: 16, fontWeight: "bold" }}>{t('aiAnalysis.conclusions.clinicalPatterns')}</Text>
                    <Gap height={hp(1)} />
                    <View style={{
                        flexDirection: "row",
                        backgroundColor: "rgba(90,167,179,0.1)",
                        padding: 10, width: "100%",
                        justifyContent: "space-between",
                        alignItems: "center", borderRadius: 10
                    }} >
                        <Image source={require('../../assets/images/chartbeat.png')} style={{ height: 20, width: 20, alignSelf: 'flex-start', marginTop: hp(0.5) }} />
                        <Text style={{ width: "90%", color: "#4A90B9" }}>
                            {t('aiAnalysis.conclusions.pattern1')}
                        </Text>
                    </View>
                    <Gap height={hp(1)} />
                    <View style={{
                        flexDirection: "row",
                        backgroundColor: "rgba(90,167,179,0.1)",
                        padding: 10, width: "100%",
                        justifyContent: "space-between",
                        alignItems: "center", borderRadius: 10
                    }} >
                        <Feather name="trending-up" size={20} color={'#22c55e'} style={{ alignSelf: "flex-start", marginTop: hp(0.5) }} />
                        <Text style={{ width: "90%", color: "#166534" }}>
                            {t('aiAnalysis.conclusions.pattern2')}
                        </Text>
                    </View>
                    <Gap height={hp(2)} />
                    <Text style={{ fontSize: 16, fontWeight: "bold" }}>{t('aiAnalysis.conclusions.therapeuticRecommendations')}</Text>
                    <Gap height={hp(1)} />
                    <View style={{
                        flexDirection: "row",
                        backgroundColor: "#faf5ff",
                        padding: 10, width: "100%",
                        justifyContent: "space-between",
                        alignItems: "center", borderRadius: 10
                    }}>
                        <Image
                            source={require('../../assets/images/brain-purple.png')}
                            style={{ height: 20, width: 20, alignSelf: 'flex-start', marginTop: hp(0.5) }} />
                        <Text style={{ width: "90%", color: "#6b21a8" }}>
                            {t('aiAnalysis.conclusions.recommendation1')}
                        </Text>
                    </View>
                    <Gap height={hp(1)} />
                    <View style={{
                        flexDirection: "row",
                        backgroundColor: "#fff7ed",
                        padding: 10, width: "100%",
                        justifyContent: "space-between",
                        alignItems: "center", borderRadius: 10
                    }} >
                        <Feather name="info" size={20} color={'#f97316'} style={{ alignSelf: "flex-start", marginTop: hp(0.5) }} />
                        <Text style={{ width: "90%", color: "#9a3412" }}>
                            {t('aiAnalysis.conclusions.recommendation2')}
                        </Text>
                    </View>
                </View>


                {/*Section 4 last cards*/}
                <Gap height={hp(3)} />
                <View style={{
                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                    shadowOpacity: 0.23,
                    shadowRadius: 2.62,
                    // Android shadow
                    elevation: 4,
                    backgroundColor: "white", padding: 10, borderRadius: 10,
                }}>
                    <View style={{ flexDirection: "row", width: "100%", alignItems: "center", justifyContent: "space-between" }} >
                        <Feather name={"users"} color={"#4A90B9"} size={20} />
                        <View style={{ width: wp(80) }}>
                            <Text style={{ fontSize: 16, fontWeight: "bold" }}>{t('aiAnalysis.demographics.title')}</Text>
                        </View>
                    </View>
                    <Gap height={hp(1)} />
                    <View style={{
                        flexDirection: "row",
                        width: "100%",
                        alignItems: "center", justifyContent: "space-between", marginVertical: 5
                    }}>
                        <Text style={{ fontSize: 16 }} >{t('aiAnalysis.demographics.middleAge')}</Text>
                        <Text style={{ fontSize: 16 }} >{t('aiAnalysis.demographics.middleAgeValue')}</Text>
                    </View>
                    <View style={{
                        flexDirection: "row",
                        width: "100%",
                        alignItems: "center", justifyContent: "space-between", marginVertical: 5
                    }}>
                        <Text style={{ fontSize: 16 }} >{t('aiAnalysis.demographics.genderDistribution')}</Text>
                        <Text style={{ fontSize: 16 }} >{t('aiAnalysis.demographics.genderDistributionValue')}</Text>
                    </View>
                    <View style={{
                        flexDirection: "row",
                        width: "100%",
                        alignItems: "center", justifyContent: "space-between", marginVertical: 5
                    }}>
                        <Text style={{ fontSize: 16 }} >{t('aiAnalysis.demographics.newPatients')}</Text>
                        <Text style={{ fontSize: 16 }} >{t('aiAnalysis.demographics.newPatientsValue')}</Text>
                    </View>
                </View>
                <Gap height={hp(3)} />
                <View style={{
                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                    shadowOpacity: 0.23,
                    shadowRadius: 2.62,
                    // Android shadow
                    elevation: 4,
                    backgroundColor: "white", padding: 10, borderRadius: 10,
                }}>
                    <View style={{ flexDirection: "row", width: "100%", alignItems: "center", justifyContent: "space-between" }} >
                        <Image source={require('../../assets/images/chartbeat.png')} style={{ height: 20, width: 20 }} />
                        <View style={{ width: wp(80) }}>
                            <Text style={{ fontSize: 16, fontWeight: "bold" }}>{t('aiAnalysis.treatmentMetrics.title')}</Text>
                        </View>
                    </View>
                    <Gap height={hp(1)} />
                    <View style={{
                        flexDirection: "row",
                        width: "100%",
                        alignItems: "center", justifyContent: "space-between", marginVertical: 5
                    }}>
                        <Text style={{ fontSize: 16 }} >{t('aiAnalysis.treatmentMetrics.avgTherapyLength')}</Text>
                        <Text style={{ fontSize: 16 }} >{t('aiAnalysis.treatmentMetrics.avgTherapyLengthValue')}</Text>
                    </View>
                    <View style={{
                        flexDirection: "row",
                        width: "100%",
                        alignItems: "center", justifyContent: "space-between", marginVertical: 5
                    }}>
                        <Text style={{ fontSize: 16 }} >{t('aiAnalysis.treatmentMetrics.remissionRate')}</Text>
                        <Text style={{ fontSize: 16 }} >{t('aiAnalysis.treatmentMetrics.remissionRateValue')}</Text>
                    </View>
                    <View style={{
                        flexDirection: "row",
                        width: "100%",
                        alignItems: "center", justifyContent: "space-between", marginVertical: 5
                    }}>
                        <Text style={{ fontSize: 16 }} >{t('aiAnalysis.treatmentMetrics.continuationOfTreatment')}</Text>
                        <Text style={{ fontSize: 16 }} >{t('aiAnalysis.treatmentMetrics.continuationOfTreatmentValue')}</Text>
                    </View>
                </View>
                <Gap height={hp(3)} />
                <View style={{
                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                    shadowOpacity: 0.23,
                    shadowRadius: 2.62,
                    // Android shadow
                    elevation: 4,
                    backgroundColor: "white", padding: 10, borderRadius: 10,
                }}>
                    <View style={{ flexDirection: "row", width: "100%", alignItems: "center", justifyContent: "space-between" }} >
                        <Feather name={"bar-chart-2"} color={"#4A90B9"} size={20} />
                        <View style={{ width: wp(80) }}>
                            <Text style={{ fontSize: 16, fontWeight: "bold" }}>{t('aiAnalysis.qualityIndicators.title')}</Text>
                        </View>
                    </View>
                    <View style={{
                        flexDirection: "row",
                        width: "100%",
                        alignItems: "center", justifyContent: "space-between", marginVertical: 5
                    }}>
                        <Text style={{ fontSize: 16 }} >{t('aiAnalysis.qualityIndicators.patientSatisfaction')}</Text>
                        <Text style={{ fontSize: 16 }} >{t('aiAnalysis.qualityIndicators.patientSatisfactionValue')}</Text>
                    </View>
                    <View style={{
                        flexDirection: "row",
                        width: "100%",
                        alignItems: "center", justifyContent: "space-between", marginVertical: 5
                    }}>
                        <Text style={{ fontSize: 16 }} >{t('aiAnalysis.qualityIndicators.readmissions')}</Text>
                        <Text style={{ fontSize: 16 }} >{t('aiAnalysis.qualityIndicators.readmissionsValue')}</Text>
                    </View>
                    <View style={{
                        flexDirection: "row",
                        width: "100%",
                        alignItems: "center", justifyContent: "space-between", marginVertical: 5
                    }}>
                        <Text style={{ fontSize: 16 }} >{t('aiAnalysis.qualityIndicators.documentationCompleteness')}</Text>
                        <Text style={{ fontSize: 16 }} >{t('aiAnalysis.qualityIndicators.documentationCompletenessValue')}</Text>
                    </View>
                </View>
                <Gap height={hp(10)} />

            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default AIAnalysis;

const styles = StyleSheet.create({

    safeArea: {
        flex: 1,
        backgroundColor: "white",
        paddingTop: Platform.OS == 'ios' ? hp(6) : 0
    },
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        width: '95%', alignSelf: "center"
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginLeft: 2,
        marginTop: hp(2)
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#777',
    },
    backButton: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#4A90B9',
        borderRadius: 50,
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabContainer: {
        flexDirection: 'row',
        marginBottom: 20,

    },
    tab: {
        paddingHorizontal: 20,
        borderRadius: 20,
        backgroundColor: '#f0f0f0', height: hp(5),
        alignItems: "center", justifyContent: "center"
    },
    activeTab: {
        backgroundColor: '#4A90B9', height: hp(5)
    },
    tabText: {
        fontSize: 16,
        color: '#333',
    },
    activeTabText: {
        color: '#FFFFFF',
    },
});