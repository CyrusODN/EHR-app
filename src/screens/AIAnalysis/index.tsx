import { useNavigation } from '@react-navigation/native';
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

import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MedicalFilterForm from './Layout/filterForm';
import Gap from '../../component/gap';
import StatCard from './Layout/statCard';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Feather from 'react-native-vector-icons/Feather';
import MedicalCharts from './Layout/medicalCharts';


const AIAnalysis = ({ }) => {
    const navigation = useNavigation();
    const tabs = ['Analysis', 'Summary', 'Recommendations'];
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
                    <Text style={styles.headerTitle}>Statistical analysis AI</Text>
                    <Text style={styles.headerSubtitle}>
                        Advanced clinical data analysis supported by artificial intelligence
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
                        title={"Visits"}
                        icon={<Feather name="calendar" color='#4A90B9' size={20} />}
                        score={"1,234"}
                        subtitle={"+12.5% vs\n previous period"} />
                    <StatCard
                        title={"Average time to remission"}
                        icon={<Feather name="clock" color='#4A90B9' size={20} />}
                        score={"8.5 tyg"}
                        subtitle={"+15.3% vs\n previous period"} />
                </View>
                <Gap height={hp(2)} />
                <View style={{
                    width: "100%", flexDirection: "row", justifyContent: "space-between"
                }} >
                    <StatCard
                        title={"Treatment effectiveness"}
                        icon={<Image source={require("../../assets/images/chartbeat.png")} style={{ height: 20, width: 20 }} />}
                        score={"78.5%"}
                        subtitle={"+5.2% vs\n previous period"} />
                    <StatCard
                        title={"Adherence"}
                        icon={<Image source={require("../../assets/images/adherenece.png")} style={{ height: 20, width: 20 }} />}
                        score={"92.3%"}
                        subtitle={"+3.1% vs\n previous period"} />
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
                            <Text style={styles.headerTitle}>Conclusions AI</Text>
                            <Gap height={hp(0.5)} />
                            <View style={{ flexDirection: "row" }} >
                                <Image source={require('../../assets/images/stars.png')} style={{ width: 20, height: 20, marginRight: 10 }} />
                                <Text style={styles.headerSubtitle}>
                                    Powered by advanced machine learning algorithms
                                </Text>
                            </View>
                        </View>
                    </View>

                    <Gap height={hp(2)} />
                    <Text style={{ fontSize: 16, fontWeight: "bold" }}>Clinical patterns</Text>
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
                            Zaobserwowano 23% wzrost rozpoznań F32.1 (Epizod depresyjny umiarkowany) w grupie wiekowej 25-35 lat. Główne czynniki ryzyka: stres zawodowy, izolacja społeczna.
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
                            Skuteczność terapii wzrosła o 15% przy wczesnej interwencji (do 2 tygodni od pierwszych objawów) i regularnym monitorowaniu z użyciem skal klinicznych.
                        </Text>
                    </View>
                    <Gap height={hp(2)} />
                    <Text style={{ fontSize: 16, fontWeight: "bold" }}>Therapeutic recommendations</Text>
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
                            Pacjenci z kombinacją farmakoterapii i psychoterapii wykazują o 35% wyższą skuteczność leczenia w porównaniu do monoterapii.
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
                            Zidentyfikowano wzrost ryzyka przerwania leczenia w 4-6 tygodniu terapii. Zalecane wdrożenie dodatkowego wsparcia i monitoringu w tym okresie.
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
                            <Text style={{ fontSize: 16, fontWeight: "bold" }}>Patients demographics</Text>
                        </View>
                    </View>
                    <Gap height={hp(1)} />
                    <View style={{
                        flexDirection: "row",
                        width: "100%",
                        alignItems: "center", justifyContent: "space-between", marginVertical: 5
                    }}>
                        <Text style={{ fontSize: 16 }} >Middle age</Text>
                        <Text style={{ fontSize: 16 }} >42.5 lat</Text>
                    </View>
                    <View style={{
                        flexDirection: "row",
                        width: "100%",
                        alignItems: "center", justifyContent: "space-between", marginVertical: 5
                    }}>
                        <Text style={{ fontSize: 16 }} >Gender distribution</Text>
                        <Text style={{ fontSize: 16 }} >K: 65% | M: 35%</Text>
                    </View>
                    <View style={{
                        flexDirection: "row",
                        width: "100%",
                        alignItems: "center", justifyContent: "space-between", marginVertical: 5
                    }}>
                        <Text style={{ fontSize: 16 }} >New Patients</Text>
                        <Text style={{ fontSize: 16 }} >+124 (30d)</Text>
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
                            <Text style={{ fontSize: 16, fontWeight: "bold" }}>Treatment metrics</Text>
                        </View>
                    </View>
                    <Gap height={hp(1)} />
                    <View style={{
                        flexDirection: "row",
                        width: "100%",
                        alignItems: "center", justifyContent: "space-between", marginVertical: 5
                    }}>
                        <Text style={{ fontSize: 16 }} >Average length of theraphy</Text>
                        <Text style={{ fontSize: 16 }} >4.2 months</Text>
                    </View>
                    <View style={{
                        flexDirection: "row",
                        width: "100%",
                        alignItems: "center", justifyContent: "space-between", marginVertical: 5
                    }}>
                        <Text style={{ fontSize: 16 }} >Remission rate</Text>
                        <Text style={{ fontSize: 16 }} >72.5%</Text>
                    </View>
                    <View style={{
                        flexDirection: "row",
                        width: "100%",
                        alignItems: "center", justifyContent: "space-between", marginVertical: 5
                    }}>
                        <Text style={{ fontSize: 16 }} >Continuation of treatment</Text>
                        <Text style={{ fontSize: 16 }} >85.4%</Text>
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
                            <Text style={{ fontSize: 16, fontWeight: "bold" }}>Quality indicators</Text>
                        </View>
                    </View>
                    <View style={{
                        flexDirection: "row",
                        width: "100%",
                        alignItems: "center", justifyContent: "space-between", marginVertical: 5
                    }}>
                        <Text style={{ fontSize: 16 }} >Patient satisfaction</Text>
                        <Text style={{ fontSize: 16 }} >4.8/5.0</Text>
                    </View>
                    <View style={{
                        flexDirection: "row",
                        width: "100%",
                        alignItems: "center", justifyContent: "space-between", marginVertical: 5
                    }}>
                        <Text style={{ fontSize: 16 }} >Readmisje</Text>
                        <Text style={{ fontSize: 16 }} >3.2%</Text>
                    </View>
                    <View style={{
                        flexDirection: "row",
                        width: "100%",
                        alignItems: "center", justifyContent: "space-between", marginVertical: 5
                    }}>
                        <Text style={{ fontSize: 16 }} >Completeness of documentation</Text>
                        <Text style={{ fontSize: 16 }} >98.7%</Text>
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
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginLeft: 2
    },
    headerSubtitle: {
        fontSize: 16,
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