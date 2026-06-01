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
import { useThemeColors } from '../../hooks/useThemeColors';


const AIAnalysis = ({ }) => {
    const navigation = useNavigation();
    const { t } = useTranslation();
    const { colors: tc, isDark } = useThemeColors();
    const ds = createDynamicStyles(tc, isDark);
    
    return (
        <View style={ds.safeArea}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
            <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={tc.screenBackground} />

            {/* Header */}
            <View style={ds.header}>
                <View style={{
                    backgroundColor: isDark ? "rgba(90,167,179,0.2)" : "rgba(90,167,179,0.1)",
                    height: 45, width: 45, alignItems: "center", justifyContent: 'center',
                    borderRadius: 10
                }}>
                    <Image source={require('../../assets/images/brain-primary.png')} style={{ height: 25, width: 25 }} />
                </View>
                <View style={{ width: wp(65) }}>
                    <Text style={ds.headerTitle}>{t('aiAnalysis.header.title')}</Text>
                    <Text style={ds.headerSubtitle}>
                        {t('aiAnalysis.header.subtitle')}
                    </Text>
                </View>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={ds.backButton}
                >
                    <Ionicons name="arrow-back" size={20} color={tc.accent} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{ padding: 16 }} style={ds.container} showsVerticalScrollIndicator={false}>
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
                <View style={ds.card}>
                    <View style={{ flexDirection: "row", width: "100%", alignItems: "center", justifyContent: "space-between" }} >
                        <Image source={require('../../assets/images/brain-primary.png')} style={{ height: 25, width: 25, alignSelf: "flex-start", marginTop: hp(0.5) }} />
                        <View style={{ width: wp(80) }}>
                            <Text style={ds.cardHeaderTitle}>{t('aiAnalysis.conclusions.title')}</Text>
                            <Gap height={hp(0.5)} />
                            <View style={{ flexDirection: "row" }} >
                                <Image source={require('../../assets/images/stars.png')} style={{ width: 20, height: 20, marginRight: 10 }} />
                                <Text style={ds.cardHeaderSubtitle}>
                                    {t('aiAnalysis.conclusions.subtitle')}
                                </Text>
                            </View>
                        </View>
                    </View>

                    <Gap height={hp(2)} />
                    <Text style={ds.sectionTitle}>{t('aiAnalysis.conclusions.clinicalPatterns')}</Text>
                    <Gap height={hp(1)} />
                    <View style={[ds.infoBox, { backgroundColor: isDark ? "rgba(74, 144, 185, 0.15)" : "rgba(90,167,179,0.1)" }]} >
                        <Image source={require('../../assets/images/chartbeat.png')} style={{ height: 20, width: 20, alignSelf: 'flex-start', marginTop: hp(0.5) }} />
                        <Text style={[ds.infoBoxText, { color: tc.accent }]}>
                            {t('aiAnalysis.conclusions.pattern1')}
                        </Text>
                    </View>
                    <Gap height={hp(1)} />
                    <View style={[ds.infoBox, { backgroundColor: isDark ? "rgba(34, 197, 94, 0.15)" : "rgba(34, 197, 94, 0.1)" }]} >
                        <Feather name="trending-up" size={20} color={'#22c55e'} style={{ alignSelf: "flex-start", marginTop: hp(0.5) }} />
                        <Text style={[ds.infoBoxText, { color: isDark ? '#4ade80' : "#166534" }]}>
                            {t('aiAnalysis.conclusions.pattern2')}
                        </Text>
                    </View>
                    <Gap height={hp(2)} />
                    <Text style={ds.sectionTitle}>{t('aiAnalysis.conclusions.therapeuticRecommendations')}</Text>
                    <Gap height={hp(1)} />
                    <View style={[ds.infoBox, { backgroundColor: isDark ? "rgba(168, 85, 247, 0.15)" : "#faf5ff" }]}>
                        <Image
                            source={require('../../assets/images/brain-purple.png')}
                            style={{ height: 20, width: 20, alignSelf: 'flex-start', marginTop: hp(0.5) }} />
                        <Text style={[ds.infoBoxText, { color: isDark ? '#c084fc' : "#6b21a8" }]}>
                            {t('aiAnalysis.conclusions.recommendation1')}
                        </Text>
                    </View>
                    <Gap height={hp(1)} />
                    <View style={[ds.infoBox, { backgroundColor: isDark ? "rgba(249, 115, 22, 0.15)" : "#fff7ed" }]}>
                        <Feather name="info" size={20} color={'#f97316'} style={{ alignSelf: "flex-start", marginTop: hp(0.5) }} />
                        <Text style={[ds.infoBoxText, { color: isDark ? '#fb923c' : "#9a3412" }]}>
                            {t('aiAnalysis.conclusions.recommendation2')}
                        </Text>
                    </View>
                </View>


                {/*Section 4 last cards*/}
                <Gap height={hp(3)} />
                <View style={ds.card}>
                    <View style={{ flexDirection: "row", width: "100%", alignItems: "center", justifyContent: "space-between" }} >
                        <Feather name={"users"} color={tc.accent} size={20} />
                        <View style={{ width: wp(80) }}>
                            <Text style={ds.sectionTitle}>{t('aiAnalysis.demographics.title')}</Text>
                        </View>
                    </View>
                    <Gap height={hp(1)} />
                    <View style={ds.metricRow}>
                        <Text style={ds.metricLabel}>{t('aiAnalysis.demographics.middleAge')}</Text>
                        <Text style={ds.metricValue}>{t('aiAnalysis.demographics.middleAgeValue')}</Text>
                    </View>
                    <View style={ds.metricRow}>
                        <Text style={ds.metricLabel}>{t('aiAnalysis.demographics.genderDistribution')}</Text>
                        <Text style={ds.metricValue}>{t('aiAnalysis.demographics.genderDistributionValue')}</Text>
                    </View>
                    <View style={ds.metricRow}>
                        <Text style={ds.metricLabel}>{t('aiAnalysis.demographics.newPatients')}</Text>
                        <Text style={ds.metricValue}>{t('aiAnalysis.demographics.newPatientsValue')}</Text>
                    </View>
                </View>
                <Gap height={hp(3)} />
                <View style={ds.card}>
                    <View style={{ flexDirection: "row", width: "100%", alignItems: "center", justifyContent: "space-between" }} >
                        <Image source={require('../../assets/images/chartbeat.png')} style={{ height: 20, width: 20 }} />
                        <View style={{ width: wp(80) }}>
                            <Text style={ds.sectionTitle}>{t('aiAnalysis.treatmentMetrics.title')}</Text>
                        </View>
                    </View>
                    <Gap height={hp(1)} />
                    <View style={ds.metricRow}>
                        <Text style={ds.metricLabel}>{t('aiAnalysis.treatmentMetrics.avgTherapyLength')}</Text>
                        <Text style={ds.metricValue}>{t('aiAnalysis.treatmentMetrics.avgTherapyLengthValue')}</Text>
                    </View>
                    <View style={ds.metricRow}>
                        <Text style={ds.metricLabel}>{t('aiAnalysis.treatmentMetrics.remissionRate')}</Text>
                        <Text style={ds.metricValue}>{t('aiAnalysis.treatmentMetrics.remissionRateValue')}</Text>
                    </View>
                    <View style={ds.metricRow}>
                        <Text style={ds.metricLabel}>{t('aiAnalysis.treatmentMetrics.continuationOfTreatment')}</Text>
                        <Text style={ds.metricValue}>{t('aiAnalysis.treatmentMetrics.continuationOfTreatmentValue')}</Text>
                    </View>
                </View>
                <Gap height={hp(3)} />
                <View style={ds.card}>
                    <View style={{ flexDirection: "row", width: "100%", alignItems: "center", justifyContent: "space-between" }} >
                        <Feather name={"bar-chart-2"} color={tc.accent} size={20} />
                        <View style={{ width: wp(80) }}>
                            <Text style={ds.sectionTitle}>{t('aiAnalysis.qualityIndicators.title')}</Text>
                        </View>
                    </View>
                    <View style={ds.metricRow}>
                        <Text style={ds.metricLabel}>{t('aiAnalysis.qualityIndicators.patientSatisfaction')}</Text>
                        <Text style={ds.metricValue}>{t('aiAnalysis.qualityIndicators.patientSatisfactionValue')}</Text>
                    </View>
                    <View style={ds.metricRow}>
                        <Text style={ds.metricLabel}>{t('aiAnalysis.qualityIndicators.readmissions')}</Text>
                        <Text style={ds.metricValue}>{t('aiAnalysis.qualityIndicators.readmissionsValue')}</Text>
                    </View>
                    <View style={ds.metricRow}>
                        <Text style={ds.metricLabel}>{t('aiAnalysis.qualityIndicators.documentationCompleteness')}</Text>
                        <Text style={ds.metricValue}>{t('aiAnalysis.qualityIndicators.documentationCompletenessValue')}</Text>
                    </View>
                </View>
                <Gap height={hp(10)} />

            </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
};

export default AIAnalysis;

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
        alignItems: 'center',
        paddingBottom: 20,
        paddingHorizontal: 20,
        width: '100%',
        backgroundColor: tc.cardBackground,
        paddingTop: Platform.OS == 'ios' ? hp(6) : hp(2),
        borderBottomWidth: 1,
        borderBottomColor: tc.borderSubtle,
        marginBottom: 10
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: tc.textPrimary,
        marginLeft: 2,
        marginTop: hp(2)
    },
    headerSubtitle: {
        fontSize: 14,
        color: tc.textSecondary,
    },
    backButton: {
        padding: 10,
        borderWidth: 1,
        borderColor: tc.accent,
        borderRadius: 50,
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        backgroundColor: tc.cardBackground,
        padding: 15,
        borderRadius: 12,
        shadowColor: tc.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isDark ? 0.3 : 0.1,
        shadowRadius: 5,
        elevation: 4,
        borderWidth: isDark ? 1 : 0,
        borderColor: tc.borderSubtle,
    },
    cardHeaderTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: tc.textPrimary,
    },
    cardHeaderSubtitle: {
        fontSize: 14,
        color: tc.textSecondary,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: tc.textPrimary,
    },
    infoBox: {
        flexDirection: "row",
        padding: 12,
        width: "100%",
        justifyContent: "space-between",
        alignItems: "center",
        borderRadius: 10
    },
    infoBoxText: {
        width: "90%",
        fontSize: 14,
        fontWeight: '500',
    },
    metricRow: {
        flexDirection: "row",
        width: "100%",
        alignItems: "center",
        justifyContent: "space-between",
        marginVertical: 6
    },
    metricLabel: {
        fontSize: 16,
        color: tc.textSecondary,
    },
    metricValue: {
        fontSize: 16,
        fontWeight: '600',
        color: tc.textPrimary,
    }
});