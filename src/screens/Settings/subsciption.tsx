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
}

interface BulletPointProps {
    text: string;
}

// Plan Card Component
const PlanCard = ({
    plan,
    isSelected,
    isAIPowered,
    onSelect,
    isCurrentPlan,
    isBestOffer
}: PlanCardProps) => (
    <View style={[
        styles.planCard,
        isSelected && styles.selectedPlanCard,
        isCurrentPlan && styles.currentPlanCard,
        isAIPowered ? { paddingVertical: hp(3) } : { paddingVertical: hp(2) }
    ]}>
        {isBestOffer && (
            <Text style={styles.bestOfferTag}>Best offer for you</Text>
        )}

        {isAIPowered && (
            <LinearGradient
                colors={['#4A90B9', '#5BA6B6', '#68BFB3']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.aiPoweredTag}
            >
                <Ionicons name="flash-outline" size={14} color="white" />
                <Text style={styles.aiPoweredText}>AI Powered</Text>
            </LinearGradient>
        )}

        <Text style={styles.planUserLimit}>
            up to <Text style={styles.planUserLimitBold}>{plan.userLimit}</Text> users
        </Text>

        <Text style={styles.planPrice}>
            {plan.price} <Text style={styles.priceCurrency}>zł</Text>
        </Text>

        <Text style={styles.planPriceSubtext}>gross</Text>
        <Text style={styles.planPriceSubtext}>without NFZ module</Text>

        {plan.aiFeatures && (
            <View style={styles.featuresContainer}>
                {plan.aiFeatures.map((feature: AIFeature, index: number) => (
                    <View key={index} style={styles.featureRow}>
                        <FontAwesome5
                            name={feature.icon}
                            size={14}
                            color="#4A90B9"
                            style={styles.featureIcon}
                        />
                        <Text style={[styles.featureText, { color: "#4A90B9" }]}>{feature.text}</Text>
                    </View>
                ))}
            </View>
        )}

        {plan.additionalInfo && (
            <View style={styles.additionalInfoContainer}>
                {plan.additionalInfo.map((info: string, index: number) => (
                    <Text key={index} style={[styles.additionalInfoText,
                    { color: "grey" }]}>{info}</Text>
                ))}
            </View>
        )}


        <Gap height={isAIPowered ? hp(4) : hp(5)} />
        <PrimaryButton
            label={isCurrentPlan ? 'Current plan' : 'SELECT'}
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
const SubscriptionInfo = () => (
    <View style={styles.infoContainer}>
        <View style={styles.infoIconContainer}>
            <Image source={require("../../assets/images/brain-primary.png")} style={{ height: 20, width: 20 }} />
        </View>
        <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>What is the AI Powered subscription?</Text>
            <Text style={styles.infoText}>
                AI Powered subscription provides access to advanced features supported by artificial intelligence that help in daily work:
            </Text>
            <View style={styles.bulletPointList}>
                <BulletPoint text="Medical documentation assistant with voice transcription" />
                <BulletPoint text="Clinical decision support system" />
                <BulletPoint text="Intelligent ICD-10 coding assistant" />
                <BulletPoint text="Drug interaction analysis with knowledge graph" />
                <BulletPoint text="Interview assistant with emotion analysis" />
                <BulletPoint text="Automatic diagnostic suggestions" />
                <BulletPoint text="Analysis of trends and patterns in patient data" />
            </View>
        </View>
    </View>
);

// Bullet Point Component
const BulletPoint = ({ text }: BulletPointProps) => (
    <View style={styles.bulletPoint}>
        <View style={styles.bullet} />
        <Text style={styles.bulletText}>{text}</Text>
    </View>
);

const Subscription = () => {
    const navigation = useNavigation<any>();

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
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            <ScrollView style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingRight: 10 }}>
                        <Ionicons name="chevron-back" size={24} color="#333" />
                    </TouchableOpacity>
                    <View style={styles.headerIconContainer}>
                        <Feather name="credit-card" size={24} color="#4A90B9" />
                    </View>
                    <Text style={styles.headerTitle}>Purchased Plans</Text>
                </View>

                {/* Subscription Summary */}
                <View style={styles.summaryContainer}>
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>Number of active users</Text>
                        <Text style={styles.summaryValue}>{subscriptionInfo.activeUsers}</Text>
                    </View>

                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>NFZ Settlements</Text>
                        <Text style={styles.summaryValue}>{subscriptionInfo.nfzSettlements}</Text>
                    </View>

                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>Next payment</Text>
                        <Text style={styles.summaryValue}>{subscriptionInfo.nextPayment}</Text>

                        <View style={styles.actionsRow}>
                            <PrimaryButton
                                label={"PAY NOW"} filled={true}
                                onPress={() => {}} style={{ width: "100%" }}
                                icon={undefined} image={undefined}
                                iconStyle={undefined} imageStyle={undefined}
                                loading={false} disabled={false} />

                            <PrimaryButton
                                label={"CANCEL SUBCRIPTION"} filled={false}
                                onPress={() => {}} style={{ width: "100%" }}
                                icon={undefined} image={undefined}
                                iconStyle={undefined} imageStyle={undefined}
                                loading={false} disabled={false} />
                        </View>
                    </View>
                </View>

                {/* Current Subscription Details */}
                <View style={styles.detailsContainer}>
                    <View style={styles.detailsHeader}>
                        <Text style={styles.detailsHeaderText}>Name</Text>
                        <Text style={styles.detailsHeaderText}>Valid from</Text>
                        <Text style={styles.detailsHeaderText}>Valid to</Text>
                        <Text style={styles.detailsHeaderText}>Next payment</Text>
                    </View>

                    <View style={styles.detailsRow}>
                        <Text style={styles.detailsCell}>{subscriptionInfo.currentSubscription.name}</Text>
                        <Text style={styles.detailsCell}>{subscriptionInfo.currentSubscription.validFrom}</Text>
                        <Text style={styles.detailsCell}>{subscriptionInfo.currentSubscription.validTo}</Text>
                        <Text style={styles.detailsCell}>{subscriptionInfo.currentSubscription.nextPayment}</Text>
                    </View>
                </View>

                {/* Plans Section */}
                <View style={styles.plansSection}>
                    <Text style={styles.sectionTitle}>Plans</Text>

                    {/* NFZ Module Toggle */}
                    <View style={styles.moduleToggleContainer}>

                        <PrimaryButton
                            label={"WITHOUT NFZ MODULE"} filled={true}
                            onPress={() => {}} style={{ width: '100%' }}
                            icon={undefined} image={undefined}
                            iconStyle={undefined} imageStyle={undefined}
                            loading={false} disabled={false} />
                        <Gap height={hp(1)} />
                        <View>
                            <PrimaryButton
                                label={" NFZ SETTLEMENT MODULE"} filled={false}
                                onPress={() => setNfzModuleSelected(true)} style={{ width: '100%' }}
                                icon={undefined} image={undefined}
                                iconStyle={undefined} imageStyle={undefined}
                                loading={false} disabled={false}
                            />
                            <View style={styles.comingSoon}>
                                <AntDesign
                                    name="exclamationcircleo"
                                    size={15}
                                    color={'white'}
                                />
                                <View style={{ width: 5 }} />
                                <Text style={{ fontWeight: "bold", fontSize: 12, color: 'white' }}>Coming Soon</Text>
                            </View>
                        </View>


                    </View>

                    {/* Regular Plans */}
                    <View style={styles.plansGrid}>
                        {plans.map(plan => (
                            <PlanCard
                                key={plan.id}
                                plan={plan}
                                isSelected={selectedPlanId === plan.id}
                                onSelect={handleSelectPlan}
                                isCurrentPlan={plan.isCurrentPlan}
                                isBestOffer={plan.isBestOffer}
                            />
                        ))}
                    </View>

                    {/* AI Powered Plans */}
                    <View style={styles.plansGrid}>
                        {aiPlans.map(plan => (
                            <PlanCard
                                key={plan.id}
                                plan={plan}
                                isSelected={selectedPlanId === plan.id}
                                isAIPowered={plan.isAIPowered}
                                onSelect={handleSelectPlan}
                                isCurrentPlan={false}
                                isBestOffer={false}
                            />
                        ))}
                    </View>

                    {/* AI Powered Subscription Info */}
                    <SubscriptionInfo />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    comingSoon: {
        position: 'absolute',
        top: -10,
        right: -10,
        backgroundColor: '#daaf59',
        padding: 5,
        borderRadius: 15,
        flexDirection: "row",
        alignItems: 'center',
        color: 'white',
    },
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
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#FFFFFF',
    },
    headerIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: '#E8F4F8',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333333',
    },
    gradientBackground: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    summaryContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        padding: 16,
        marginTop: 12,
        borderRadius: 8,
        flexWrap: 'wrap',
    },
    summaryItem: {
        width: '100%',
        marginBottom: 10,
        padding: 10,
        backgroundColor: "#f5f5f5", borderRadius: hp(1)
    },
    summaryLabel: {
        fontSize: 14,
        color: '#666666',
        marginBottom: 8,
    },
    summaryValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333333',
    },
    actionsRow: {
        flexDirection: 'column',
        marginTop: 16,
    },
    payNowButton: {
        backgroundColor: '#4A90B9',
        borderRadius: 6,
        padding: 12,
        alignItems: 'center',
        marginBottom: 8,
    },
    payNowButtonText: {
        color: '#FFFFFF',
        fontWeight: '600',
        fontSize: 14,
    },
    cancelButton: {
        borderWidth: 1,
        borderColor: '#4A90B9',
        borderRadius: 6,
        padding: 12,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: '#4A90B9',
        fontWeight: '600',
        fontSize: 14,
    },
    detailsContainer: {
        backgroundColor: '#FFFFFF',
        marginTop: 12,
        borderRadius: 8,
        padding: 16,
    },
    detailsHeader: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#EEEEEE',
        paddingBottom: 8,
    },
    detailsHeaderText: {
        flex: 1,
        fontSize: 14,
        fontWeight: 'bold',
        color: 'black',
    },
    detailsRow: {
        flexDirection: 'row',
        paddingTop: 12,
    },
    detailsCell: {
        flex: 1,
        fontSize: 14,
        color: '#333333',
    },
    plansSection: {
        marginTop: 20,
        padding: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 16,
    },
    moduleToggleContainer: {
        flexDirection: 'column',
        marginBottom: 20,
    },
    moduleToggleButton: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 6,
        backgroundColor: '#F5F5F5',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 4,
    },
    moduleToggleSelected: {
        backgroundColor: '#333333',
    },
    moduleToggleText: {
        fontSize: 12,
        color: '#666666',
        textAlign: 'center',
    },
    moduleToggleTextSelected: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
    comingSoonTag: {
        position: 'absolute',
        top: -10,
        right: 0,
        backgroundColor: '#FFC107',
        borderRadius: 10,
        paddingHorizontal: 8,
        paddingVertical: 2,
    },
    comingSoonText: {
        fontSize: 10,
        color: '#333333',
    },
    plansGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    planCard: {
        width: '48%',
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#EEEEEE',
        // paddingVertical: hp(2)
    },
    selectedPlanCard: {
        borderColor: '#4A90B9',
        borderWidth: 2,
    },
    currentPlanCard: {
        borderColor: '#4A90B9',
        borderWidth: 1,
    },
    bestOfferTag: {
        position: 'absolute',
        top: 5,
        left: 0,
        backgroundColor: '#FF5722',
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: 'bold',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
    },
    aiPoweredTag: {
        position: 'absolute',
        top: 10,
        right: 5,
        borderRadius: 40,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "center",
        overflow: "hidden",
        height: hp(3),
        width: wp(25)
    },
    aiPoweredText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: 'bold',
        marginLeft: 4,
    },
    planUserLimit: {
        fontSize: 14,
        color: '#666666',
        marginTop: 12,
        marginBottom: 8,
    },
    planUserLimitBold: {
        fontWeight: 'bold',
        fontSize: 18,
    },
    planPrice: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#333333',
    },
    priceCurrency: {
        fontSize: 18,
    },
    planPriceSubtext: {
        fontSize: 12,
        color: '#999999',
    },
    featuresContainer: {
        marginTop: 16,

    },
    featureRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        // width: "100%"
    },
    featureIcon: {
        marginRight: 8,
    },
    featureText: {
        fontSize: 12,
        color: '#666666',
        width: "95%"
    },
    additionalInfoContainer: {
        // marginTop: 16,
        // backgroundColor: "red"
    },
    additionalInfoText: {
        fontSize: 12,
        marginBottom: 4,
    },
    selectButton: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#4A90B9',
        borderRadius: 6,
        padding: 12,
        alignItems: 'center',
        marginTop: 16,
    },
    currentPlanButton: {
        backgroundColor: '#E8F4F8',
    },
    selectedButton: {
        backgroundColor: '#4A90B9',
    },
    selectButtonText: {
        color: '#4A90B9',
        fontWeight: '600',
        fontSize: 14,
    },
    currentPlanButtonText: {
        color: '#4A90B9',
    },
    selectedButtonText: {
        color: '#FFFFFF',
    },
    infoContainer: {
        flexDirection: 'row',
        backgroundColor: '#E8F4F8',
        borderRadius: 8,
        padding: 16,
        marginTop: 20,
    },
    infoIconContainer: {
        marginRight: 12,
    },
    infoContent: {
        flex: 1,
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'rgb(30 64 175)',

        marginBottom: 8,
    },
    infoText: {
        fontSize: 14,
        color: 'blue',
        marginBottom: 12,
    },
    bulletPointList: {
        marginLeft: 8,
    },
    bulletPoint: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    bullet: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: 'blue',
        marginRight: 10,
    },
    bulletText: {
        fontSize: 14,
        color: 'blue',
    },
});

export default Subscription;