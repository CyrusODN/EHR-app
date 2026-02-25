import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    Platform,
    KeyboardAvoidingView
} from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

// AI Tools Components
import ConsultChat from './AI_Tools/consultChat';
import Pathfinder from './AI_Tools/pathfinder';
import PharmacopediaChat from './AI_Tools/pharmacopediaChat';
import Diagnosis from './AI_Tools/diagnosis';
import ClinicalTrials from './AI_Tools/clinicalTrials';
import StatisticalAnalysis from './AI_Tools/statisticalAnalysis';

const { width } = Dimensions.get('window');

export const AIAssistantScreen = () => {
    const navigation = useNavigation<any>();
    const [activeTab, setActiveTab] = useState('Remedius Consult');

    const renderContent = () => {
        switch (activeTab) {
            case 'Remedius Consult':
                return <ConsultChat />;
            case 'Remedius Pathfinder':
                return <Pathfinder />;
            case 'Pharmacopedia':
                return <PharmacopediaChat />;
            case 'Diagnosis':
                return <Diagnosis />;
            case 'Clinical Trials':
                return <ClinicalTrials />;
            case 'Statistical Analysis':
                return <StatisticalAnalysis />;
            default:
                return null;
        }
    };

    const tabs = [
        'Remedius Consult',
        'Remedius Pathfinder',
        'Pharmacopedia',
        'Diagnosis',
        'Clinical Trials',
        'Statistical Analysis'
    ];

    return (
        <KeyboardAvoidingView
            style={styles.safeArea}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.headerTitle}>AI Assistants</Text>
                        <Text style={styles.headerSubtitle}>
                            Advanced AI tools supporting doctor's work
                        </Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={styles.backButton}
                    >
                        <Ionicons name="arrow-back" size={20} color="#4A90B9" />
                    </TouchableOpacity>
                </View>

                {/* Tabs */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.tabContainer}
                >
                    {tabs.map((tab, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.tab,
                                activeTab === tab && styles.activeTab,
                                {
                                    marginEnd: 5
                                }
                            ]}
                            onPress={() => setActiveTab(tab)}
                        >
                            <Text style={[
                                styles.tabText,
                                activeTab === tab && styles.activeTabText
                            ]}>
                                {tab}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Content */}
                <ScrollView
                    style={styles.scrollContent}
                    contentContainerStyle={styles.scrollContentContainer}
                >
                    {renderContent()}
                </ScrollView>

                {/* Help Button
                <TouchableOpacity style={styles.helpButton}>
                    <Text style={styles.helpButtonText}>?</Text>
                </TouchableOpacity> */}
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        paddingTop: Platform.OS == 'ios' ? hp(5) : hp(0),
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
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#FFFFFF',
        marginBottom: hp(1)
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333333',
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#666666',
        marginTop: 5,
        maxWidth: wp(70),
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
        marginBottom: hp(1),
        marginStart: '4%'
    },
    tab: {
        height: hp(5),
        paddingHorizontal: 10,
        justifyContent: "center",
        borderWidth: 0
    },
    activeTab: {
        backgroundColor: "#fff",
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 1,
            height: 1
        },
        shadowOpacity: 0.25,
        shadowRadius: 2,
        borderRadius: 5
    },
    tabText: {
        color: '#666666',
        fontWeight: '500',
    },
    activeTabText: {
        color: '#4A90B9',
        fontWeight: 'bold',
    },
    scrollContent: {
        height: hp(75)
    },
    scrollContentContainer: {
    },
    helpButton: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#4A90B9',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    helpButtonText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    }
});