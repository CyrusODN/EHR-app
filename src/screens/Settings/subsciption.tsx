// components/Subscription.js
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Feather from 'react-native-vector-icons/Feather';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import PrimaryButton from '../../component/button';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Gap from '../../component/gap';
import LinearGradient from 'react-native-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '../../hooks/useThemeColors';

interface AIFeature {
    icon: string;
    text: string;
}

interface Plan {
    id: string;
    userLimit: string;
    price: string;
    isBestOffer?: boolean;
    isCurrentPlan?: boolean;
    isAIPowered?: boolean;
    aiFeatures?: AIFeature[];
    additionalInfo?: string[];
}

interface PlanCardProps {
    plan: Plan;
    isSelected: boolean;
    isAIPowered?: boolean;
    onSelect: (planId: string) => void;
    isCurrentPlan?: boolean;
    isBestOffer?: boolean;
    tc: any;
    ds: any;
}

interface BulletPointProps {
    text: string;
    tc: any;
    ds: any;
}

// Plan Card Component
const PlanCard = ({
    plan,
    isSelected,
    isAIPowered,
    onSelect,
    isCurrentPlan,
    isBestOffer,
    t,
    tc,
    ds
}: PlanCardProps & { t: any }) => (
    <View style={[
        ds.planCard,
        isSelected && ds.selectedPlanCard,
        isCurrentPlan && ds.currentPlanCard,
        isAIPowered ? { paddingVertical: hp(3) } : { paddingVertical: hp(2) }
    ]}>
        {isBestOffer && (
            <Text style={ds.bestOfferTag}>{t('settings.subscription.plan_card.best_offer')}</Text>
        )}

        {isAIPowered && (
            <LinearGradient
                colors={['#4A90B9', '#5BA6B6', '#68BFB3']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={ds.aiPoweredTag}
            >
                <Ionicons name="flash-outline" size={14} color="white" />
                <Text style={ds.aiPoweredText}>{t('settings.subscription.plan_card.ai_powered')}</Text>
            </LinearGradient>
        )}

        <Text style={ds.planUserLimit}>
            {t('settings.subscription.plan_card.up_to')} <Text style={ds.planUserLimitBold}>{plan.userLimit}</Text> {t('settings.subscription.plan_card.users')}
        </Text>

        <Text style={ds.planPrice}>
            {plan.price} <Text style={ds.priceCurrency}>zł</Text>
        </Text>

        <Text style={ds.planPriceSubtext}>{t('settings.subscription.plan_card.gross')}</Text>
        <Text style={ds.planPriceSubtext}>{t('settings.subscription.plan_card.without_nfz')}</Text>

        {plan.aiFeatures && (
            <View style={ds.featuresContainer}>
                {plan.aiFeatures.map((feature: AIFeature, index: number) => (
                    <View key={index} style={ds.featureRow}>
                        <FontAwesome5
                            name={feature.icon}
                            size={14}
                            color={tc.accent}
                            style={ds.featureIcon}
                        />
                        <Text style={[ds.featureText, { color: tc.accent }]}>{feature.text}</Text>
                    </View>
                ))}
            </View>
        )}

        {plan.additionalInfo && (
            <View style={ds.additionalInfoContainer}>
                {plan.additionalInfo.map((info: string, index: number) => (
                    <Text key={index} style={[ds.additionalInfoText,
                    { color: tc.textSecondary }]}>{info}</Text>
                ))}
            </View>
        )}


        <Gap height={isAIPowered ? hp(4) : hp(5)} />
        <PrimaryButton
            label={isCurrentPlan ? t('settings.subscription.plan_card.current_plan') : t('settings.subscription.plan_card.select')}
            filled={isAIPowered ? true : false}
            onPress={() => {}}
            style={{ width: "100%", marginTop: hp(1), position: 'absolute', bottom: 0, alignSelf: "center" }}
            icon={undefined}
            image={undefined}
            iconStyle={undefined}
            imageStyle={undefined}
            loading={false}
            disabled={plan.isCurrentPlan}
        />
    </View>
);

// Subscription Info Component
const SubscriptionInfo = ({ t, tc, ds }: { t: any; tc: any; ds: any }) => (
    <View style={ds.infoContainer}>
        <View style={ds.infoIconContainer}>
            <Image 
                source={require("../../assets/images/brain-primary.png")} 
                style={{ height: 24, width: 24, tintColor: tc.accent }} 
            />
        </View>
        <View style={ds.infoContent}>
            <Text style={ds.infoTitle}>{t('settings.subscription.ai_info.title')}</Text>
            <Text style={ds.infoText}>
                {t('settings.subscription.ai_info.description')}
            </Text>
            <View style={ds.bulletPointList}>
                <BulletPoint text={t('settings.subscription.ai_info.features.documentation')} tc={tc} ds={ds} />
                <BulletPoint text={t('settings.subscription.ai_info.features.clinical_decision')} tc={tc} ds={ds} />
                <BulletPoint text={t('settings.subscription.ai_info.features.icd10')} tc={tc} ds={ds} />
                <BulletPoint text={t('settings.subscription.ai_info.features.drug_interaction')} tc={tc} ds={ds} />
                <BulletPoint text={t('settings.subscription.ai_info.features.interview')} tc={tc} ds={ds} />
                <BulletPoint text={t('settings.subscription.ai_info.features.diagnostic')} tc={tc} ds={ds} />
                <BulletPoint text={t('settings.subscription.ai_info.features.trends')} tc={tc} ds={ds} />
            </View>
        </View>
    </View>
);

// Bullet Point Component
const BulletPoint = ({ text, tc, ds }: BulletPointProps) => (
    <View style={ds.bulletPoint}>
        <View style={[ds.bullet, { backgroundColor: tc.accent }]} />
        <Text style={[ds.bulletText, { color: tc.textSecondary }]}>{text}</Text>
    </View>
);

const Subscription = () => {
    const { t } = useTranslation();
    const navigation = useNavigation<any>();
    const { colors: tc, isDark } = useThemeColors();
    const ds = createDynamicStyles(tc, isDark);

    // State variables
    const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
    const [nfzModuleSelected, setNfzModuleSelected] = useState(false);

    // Subscription info
    const subscriptionInfo = {
        activeUsers: "3 / 7",
        nfzSettlements: "inactive",
        nextPayment: "19.02.2025 169 zł",
        currentSubscription: {
            name: "Subscription - 7 users for 30 days",
            validFrom: "21.11.2024",
            validTo: "(subscription valid for 30 days)",
            nextPayment: "19.02.2025"
        }
    };

    // Regular plans
    const plans = [
        {
            id: 'plan1',
            userLimit: '7',
            price: '169',
            isBestOffer: true,
            isCurrentPlan: true,
            additionalInfo: []
        },
        {
            id: 'plan2',
            userLimit: '15',
            price: '449',
            additionalInfo: [
                'package upgrade, payable from',
                'top for 30 days',
                'surcharge for current period',
                '302.54 zł',
                'next payment 25.03.2025',
                'contract until 18.01.2026'
            ]
        },
        {
            id: 'plan3',
            userLimit: '50',
            price: '998.99',
            additionalInfo: [
                'package upgrade, payable from',
                'top for 30 days',
                'surcharge for current period',
                '852.53 zł',
                'next payment 25.03.2025',
                'contract until 18.01.2026'
            ]
        },
        {
            id: 'plan4',
            userLimit: '∞',
            price: '1349',
            additionalInfo: [
                'package upgrade, payable from',
                'top for 30 days',
                'surcharge for current period',
                '1202.54 zł',
                'next payment 25.03.2025',
                'contract until 18.01.2026'
            ]
        }
    ];

    // AI Powered plans
    const aiPlans = [
        {
            id: 'ai_plan1',
            userLimit: '7',
            price: '338',
            isAIPowered: true,
            aiFeatures: [
                { icon: 'file-medical', text: 'Documentation assistant' },
                { icon: 'stethoscope', text: 'Clinical decision support' },
                { icon: 'pills', text: 'Drug interaction analysis' }
            ]
        },
        {
            id: 'ai_plan2',
            userLimit: '15',
            price: '898',
            isAIPowered: true,
            aiFeatures: [
                { icon: 'file-medical', text: 'Documentation assistant' },
                { icon: 'stethoscope', text: 'Clinical decision support' },
                { icon: 'pills', text: 'Drug interaction analysis' }
            ]
        },
        {
            id: 'ai_plan3',
            userLimit: '50',
            price: '1997.98',
            isAIPowered: true,
            aiFeatures: [
                { icon: 'file-medical', text: 'Documentation assistant' },
                { icon: 'stethoscope', text: 'Clinical decision support' },
                { icon: 'pills', text: 'Drug interaction analysis' }
            ]
        },
        {
            id: 'ai_plan4',
            userLimit: '∞',
            price: '2698',
            isAIPowered: true,
            aiFeatures: [
                { icon: 'file-medical', text: 'Documentation assistant' },
                { icon: 'stethoscope', text: 'Clinical decision support' },
                { icon: 'pills', text: 'Drug interaction analysis' }
            ]
        }
    ];

    // Handle plan selection
    const handleSelectPlan = (planId: string) => {
        setSelectedPlanId(planId);
    };


    return (
        <View style={ds.container}>
            <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={tc.cardBackground} />
            <ScrollView style={ds.container}>
                {/* Header */}
                <View style={ds.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingRight: 10 }}>
                        <Ionicons name="chevron-back" size={24} color={tc.textPrimary} />
                    </TouchableOpacity>
                    <View style={ds.headerIconContainer}>
                        <Feather name="credit-card" size={24} color={tc.accent} />
                    </View>
                    <Text style={ds.headerTitle}>{t('settings.subscription.title')}</Text>
                </View>

                {/* Subscription Summary */}
                <View style={ds.summaryContainer}>
                    <View style={ds.summaryItem}>
                        <Text style={ds.summaryLabel}>{t('settings.subscription.summary.active_users')}</Text>
                        <Text style={ds.summaryValue}>{subscriptionInfo.activeUsers}</Text>
                    </View>

                    <View style={ds.summaryItem}>
                        <Text style={ds.summaryLabel}>{t('settings.subscription.summary.nfz_settlements')}</Text>
                        <Text style={ds.summaryValue}>{subscriptionInfo.nfzSettlements}</Text>
                    </View>

                    <View style={ds.summaryItem}>
                        <Text style={ds.summaryLabel}>{t('settings.subscription.summary.next_payment')}</Text>
                        <Text style={ds.summaryValue}>{subscriptionInfo.nextPayment}</Text>

                        <View style={ds.actionsRow}>
                            <PrimaryButton
                                label={t('settings.subscription.buttons.pay_now')} filled={true}
                                onPress={() => {}} style={{ width: "100%" }}
                                icon={undefined} image={undefined}
                                iconStyle={undefined} imageStyle={undefined}
                                loading={false} disabled={false} />

                            <PrimaryButton
                                label={t('settings.subscription.buttons.cancel_subscription')} filled={false}
                                onPress={() => {}} style={{ width: "100%" }}
                                icon={undefined} image={undefined}
                                iconStyle={undefined} imageStyle={undefined}
                                loading={false} disabled={false} />
                        </View>
                    </View>
                </View>

                {/* Current Subscription Details */}
                <View style={ds.detailsContainer}>
                    <View style={ds.detailsHeader}>
                        <Text style={ds.detailsHeaderText}>{t('settings.subscription.details.name')}</Text>
                        <Text style={ds.detailsHeaderText}>{t('settings.subscription.details.valid_from')}</Text>
                        <Text style={ds.detailsHeaderText}>{t('settings.subscription.details.valid_to')}</Text>
                        <Text style={ds.detailsHeaderText}>{t('settings.subscription.details.next_payment')}</Text>
                    </View>

                    <View style={ds.detailsRow}>
                        <Text style={ds.detailsCell}>{subscriptionInfo.currentSubscription.name}</Text>
                        <Text style={ds.detailsCell}>{subscriptionInfo.currentSubscription.validFrom}</Text>
                        <Text style={ds.detailsCell}>{subscriptionInfo.currentSubscription.validTo}</Text>
                        <Text style={ds.detailsCell}>{subscriptionInfo.currentSubscription.nextPayment}</Text>
                    </View>
                </View>

                {/* Plans Section */}
                <View style={ds.plansSection}>
                    <Text style={ds.sectionTitle}>{t('settings.subscription.plans_title')}</Text>

                    {/* NFZ Module Toggle */}
                    <View style={ds.moduleToggleContainer}>

                        <PrimaryButton
                            label={t('settings.subscription.modules.without_nfz')} filled={true}
                            onPress={() => {}} style={{ width: '100%' }}
                            icon={undefined} image={undefined}
                            iconStyle={undefined} imageStyle={undefined}
                            loading={false} disabled={false} />
                        <Gap height={hp(1)} />
                        <View>
                            <PrimaryButton
                                label={t('settings.subscription.modules.nfz_settlement')} filled={false}
                                onPress={() => setNfzModuleSelected(true)} style={{ width: '100%' }}
                                icon={undefined} image={undefined}
                                iconStyle={undefined} imageStyle={undefined}
                                loading={false} disabled={false}
                            />
                            <View style={ds.comingSoon}>
                                <AntDesign
                                    name="exclamationcircleo"
                                    size={15}
                                    color={'white'}
                                />
                                <View style={{ width: 5 }} />
                                <Text style={{ fontWeight: "bold", fontSize: 12, color: 'white' }}>{t('settings.subscription.modules.coming_soon')}</Text>
                            </View>
                        </View>


                    </View>

                    {/* Regular Plans */}
                    <View style={ds.plansGrid}>
                        {plans.map(plan => (
                            <PlanCard
                                key={plan.id}
                                plan={plan}
                                isSelected={selectedPlanId === plan.id}
                                onSelect={handleSelectPlan}
                                isCurrentPlan={plan.isCurrentPlan}
                                isBestOffer={plan.isBestOffer}
                                t={t}
                                tc={tc}
                                ds={ds}
                            />
                        ))}
                    </View>

                    {/* AI Powered Plans */}
                    <View style={ds.plansGrid}>
                        {aiPlans.map(plan => (
                            <PlanCard
                                key={plan.id}
                                plan={plan}
                                isSelected={selectedPlanId === plan.id}
                                isAIPowered={plan.isAIPowered}
                                onSelect={handleSelectPlan}
                                isCurrentPlan={false}
                                isBestOffer={false}
                                t={t}
                                tc={tc}
                                ds={ds}
                            />
                        ))}
                    </View>

                    {/* AI Powered Subscription Info */}
                    <SubscriptionInfo t={t} tc={tc} ds={ds} />
                </View>
            </ScrollView>
        </View>
    );
};

const createDynamicStyles = (tc: any, isDark: boolean) => StyleSheet.create({
    comingSoon: {
        position: 'absolute',
        top: -10,
        right: -10,
        backgroundColor: '#daaf59',
        padding: 5,
        borderRadius: 15,
        flexDirection: "row",
        alignItems: 'center',
    },
    container: {
        flex: 1,
        backgroundColor: tc.screenBackground,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: tc.cardBackground,
        borderBottomWidth: 1,
        borderBottomColor: tc.borderSubtle,
    },
    headerIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: isDark ? 'rgba(74, 144, 185, 0.1)' : '#E8F4F8',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: tc.textPrimary,
    },
    summaryContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: tc.cardBackground,
        padding: 16,
        marginTop: 12,
        borderRadius: 16,
        flexWrap: 'wrap',
        marginHorizontal: 16,
        shadowColor: tc.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isDark ? 0.3 : 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    summaryItem: {
        width: '100%',
        marginBottom: 10,
        padding: 16,
        backgroundColor: isDark ? 'rgba(255, 255, 255, 0.03)' : "#f5f5f5",
        borderRadius: 12,
    },
    summaryLabel: {
        fontSize: 13,
        color: tc.textSecondary,
        marginBottom: 4,
        fontWeight: '500',
    },
    summaryValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: tc.textPrimary,
    },
    actionsRow: {
        flexDirection: 'column',
        marginTop: 16,
        gap: 10,
    },
    detailsContainer: {
        backgroundColor: tc.cardBackground,
        marginTop: 12,
        borderRadius: 16,
        padding: 16,
        marginHorizontal: 16,
    },
    detailsHeader: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: tc.borderSubtle,
        paddingBottom: 10,
    },
    detailsHeaderText: {
        flex: 1,
        fontSize: 13,
        fontWeight: 'bold',
        color: tc.textSecondary,
    },
    detailsRow: {
        flexDirection: 'row',
        paddingVertical: 12,
    },
    detailsCell: {
        flex: 1,
        fontSize: 13,
        color: tc.textPrimary,
    },
    plansSection: {
        marginTop: 20,
        padding: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: tc.textPrimary,
        marginBottom: 20,
    },
    moduleToggleContainer: {
        flexDirection: 'column',
        marginBottom: 24,
    },
    plansGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    planCard: {
        width: '48%',
        backgroundColor: tc.cardBackground,
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: tc.borderColor,
        shadowColor: tc.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isDark ? 0.2 : 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    selectedPlanCard: {
        borderColor: tc.accent,
        borderWidth: 2,
    },
    currentPlanCard: {
        borderColor: tc.accent,
        borderWidth: 1.5,
    },
    bestOfferTag: {
        position: 'absolute',
        top: 5,
        left: 0,
        backgroundColor: '#FF5722',
        color: '#FFFFFF',
        fontSize: 11,
        fontWeight: 'bold',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
    },
    aiPoweredTag: {
        position: 'absolute',
        top: 10,
        right: 10,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "center",
        height: hp(3),
        width: wp(25),
    },
    aiPoweredText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: 'bold',
        marginLeft: 4,
    },
    planUserLimit: {
        fontSize: 13,
        color: tc.textSecondary,
        marginTop: 16,
        marginBottom: 4,
    },
    planUserLimitBold: {
        fontWeight: 'bold',
        fontSize: 18,
        color: tc.textPrimary,
    },
    planPrice: {
        fontSize: 28,
        fontWeight: 'bold',
        color: tc.textPrimary,
        marginVertical: 4,
    },
    priceCurrency: {
        fontSize: 16,
    },
    planPriceSubtext: {
        fontSize: 11,
        color: tc.textMuted,
    },
    featuresContainer: {
        marginTop: 16,
    },
    featureRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    featureIcon: {
        marginRight: 8,
    },
    featureText: {
        fontSize: 11,
        color: tc.textSecondary,
        lineHeight: 16,
    },
    additionalInfoContainer: {
        marginTop: 8,
    },
    additionalInfoText: {
        fontSize: 11,
        lineHeight: 16,
        marginBottom: 2,
    },
    infoContainer: {
        flexDirection: 'row',
        backgroundColor: isDark ? 'rgba(59, 130, 246, 0.1)' : '#E8F4F8',
        borderRadius: 16,
        padding: 20,
        marginTop: 24,
        borderWidth: isDark ? 1 : 0,
        borderColor: 'rgba(59, 130, 246, 0.2)',
    },
    infoIconContainer: {
        marginRight: 16,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(74, 144, 185, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoContent: {
        flex: 1,
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: isDark ? '#60A5FA' : 'rgb(30 64 175)',
        marginBottom: 8,
    },
    infoText: {
        fontSize: 14,
        color: isDark ? 'rgba(96, 165, 250, 0.8)' : '#2563EB',
        marginBottom: 16,
        lineHeight: 20,
    },
    bulletPointList: {
        marginLeft: 0,
    },
    bulletPoint: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    bullet: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginRight: 12,
    },
    bulletText: {
        fontSize: 13,
    },
});

export default Subscription;