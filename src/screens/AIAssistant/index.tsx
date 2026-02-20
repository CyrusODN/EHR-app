import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Dimensions,
    Platform,
    KeyboardAvoidingView
} from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import PrimaryButton from '../../component/button';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomTextInput from '../../component/customTextInput';
import Gap from '../../component/gap';
import CustomCheckbox from '../../component/customCheckBox';
import Feather from 'react-native-vector-icons/Feather';
import CustomDropdown from '../../component/customDropDown';

const { width } = Dimensions.get('window');

export const AIAssistantScreen = () => {
    const navigation = useNavigation<any>();
    const [activeTab, setActiveTab] = useState('Documentation');

    // Chatbot Configurator State
    const [chatbotName, setChatbotName] = useState('');
    const [chatbotSpecialization, setChatbotSpecialization] = useState('');
    const [selectedDataSources, setSelectedDataSources] = useState<string[]>([]);
    const [customPrompt, setCustomPrompt] = useState('');

    // Diagnostic Assistant State
    const [symptoms, setSymptoms] = useState('');
    const [symptomsList, setSymptomsList] = useState<string[]>([]);

    // Clinical Research Search State
    const [diagnosis, setDiagnosis] = useState('');
    const [location, setLocation] = useState('');

    // Statistical Analysis State
    const [timeRange, setTimeRange] = useState('Last Year');
    const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
    const [grouping, setGrouping] = useState('Month');

    const dataSources = [
        'Clinical Guidelines',
        'Scientific Publications',
        'Treatment Protocols',
        'Drug Database',
        'Patient Histories'
    ];

    const metrics = [
        'Visits',
        'Diagnoses',
        'Procedures',
        'Test Results'
    ];

    const timeRangeOptions = [
        { label: 'Last Year', value: 'Last Year' },
        { label: 'Last Month', value: 'Last Month' },
        { label: 'Last Week', value: 'Last Week' },
        { label: 'Last Quarter', value: 'Last Quarter' }
    ];
    const groupingOptions = [
        { label: 'Month', value: 'Month' },
        { label: 'Week', value: 'Week' },
        { label: 'Day', value: 'Day' },
        { label: 'Year', value: 'Year' }
    ];

    const handleDataSourceToggle = (source: string) => {
        if (selectedDataSources.includes(source)) {
            setSelectedDataSources(selectedDataSources.filter(item => item !== source));
        } else {
            setSelectedDataSources([...selectedDataSources, source]);
        }
    };

    const handleMetricToggle = (metric: string) => {
        if (selectedMetrics.includes(metric)) {
            setSelectedMetrics(selectedMetrics.filter(item => item !== metric));
        } else {
            setSelectedMetrics([...selectedMetrics, metric]);
        }
    };

    const handleAddSymptom = () => {
        if (symptoms.trim()) {
            setSymptomsList([...symptomsList, symptoms.trim()]);
            setSymptoms('');
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'Documentation':
                return (
                    <View style={styles.contentContainer}>
                        <Text style={styles.sectionTitle}>Documentation Assistant</Text>
                        <PrimaryButton
                            label={'Start Recording'}
                            filled={false}
                            onPress={() => { }}
                            style={{ width: "100%" }}
                            icon={<MaterialCommunityIcons name="microphone-outline" color="#4A90B9" size={20} />}
                            image={undefined}
                            iconStyle={undefined}
                            imageStyle={undefined}
                        />
                        <Gap height={hp(2)} />
                        <Text>
                            Transcription
                        </Text>
                        <Gap height={hp(1)} />
                        <View style={{ height: hp(20), backgroundColor: "#f5f5f5", borderRadius: 10, padding: 10 }}>
                            <TextInput
                                placeholder='Transcription will appear here...'
                                placeholderTextColor={"black"}
                                multiline={true}
                            />
                        </View>
                        <Gap height={hp(1)} />
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignSelf: "flex-end" }}>
                            <PrimaryButton
                                label={'Copy'}
                                filled={false}
                                onPress={() => { }}
                                style={{
                                    width: "30%", marginEnd: wp(2)
                                }}
                                icon={<MaterialCommunityIcons name="checkbox-multiple-blank-outline" color="#4A90B9" size={20} />}
                                image={undefined}
                                iconStyle={undefined}
                                imageStyle={undefined}
                            />
                            <PrimaryButton
                                label={'Generate Note'}
                                filled={true}
                                onPress={() => { }}
                                style={{ width: "45%" }}
                                icon={<MaterialCommunityIcons name="file-document-outline" color="white" size={20} />}
                                image={undefined}
                                iconStyle={undefined}
                                imageStyle={undefined}
                            />
                        </View>
                    </View>
                );
            case 'Chatbots':
                return (
                    <View style={styles.contentContainer}>
                        <View style={{ flexDirection: "row", width: "100%", justifyContent: "space-between", alignItems: "center" }} >
                            <Text style={styles.sectionTitle}>Chatbot Configurator</Text>
                            <PrimaryButton
                                label={'+ New Chatbot'}
                                filled={true}
                                onPress={() => { }}
                                style={{ width: "40%" }}
                                icon={undefined}
                                image={undefined}
                                iconStyle={undefined}
                                imageStyle={undefined}
                            />
                        </View>
                        <Text>
                            Chatbot Name
                        </Text>
                        <Gap height={hp(1)} />
                        <TextInput
                            style={styles.input}
                            placeholder="Chatbot Name"
                            value={chatbotName}
                            onChangeText={setChatbotName}
                        />
                        <Gap height={hp(1)} />
                        <View style={styles.dropdownContainer}>
                            <Text>Specialization</Text>
                            <Gap height={hp(1)} />

                            <CustomDropdown
                                placeholder="Choose Specialization"
                                options={[
                                    { label: 'Cardiology', value: 'Cardiology' },
                                    { label: 'Neurology', value: 'Neurology' },
                                    { label: 'Dermatology', value: 'Dermatology' },
                                    { label: 'Pediatrics', value: 'Pediatrics' },
                                    { label: 'General Practice', value: 'General Practice' }
                                ]}
                                value={chatbotSpecialization}
                                onChange={(value) => setChatbotSpecialization(String(value))}
                                icon={undefined}
                            />
                        </View>
                        <Gap height={hp(1)} />

                        <View style={styles.checkboxContainer}>
                            <Text style={styles.checkboxTitle}>Data Sources</Text>

                            {dataSources.map((source, index) => (
                                <CustomCheckbox
                                    key={index}
                                    label={source}
                                    checked={selectedDataSources.includes(source)}
                                    onChange={() => handleDataSourceToggle(source)}
                                />
                            ))}
                        </View>
                        <Gap height={hp(1)} />

                        <Text style={{ color: "black" }}>
                            Custom Prompt
                        </Text>
                        <Gap height={hp(1)} />

                        <TextInput
                            style={styles.multilineInput}
                            placeholder="Custom Prompt"
                            multiline
                            value={customPrompt}
                            onChangeText={setCustomPrompt}
                        />
                        <PrimaryButton
                            label={'Save Configuration'}
                            filled={true}
                            onPress={() => { }}
                            style={{ width: "100%" }}
                            icon={<Feather name="save" color="white" size={20} />}
                            image={undefined}
                            iconStyle={undefined}
                            imageStyle={undefined}
                        />
                        <Gap height={hp(2)} />
                        <Text style={{ color: "black", fontWeight: "bold" }}>
                            Configured Chatbots
                        </Text>
                    </View>
                );
            case 'Diagnostics':
                return (
                    <View style={styles.contentContainer}>
                        <Text style={styles.sectionTitle}>Differential Diagnosis Assistant</Text>
                        <Text style={{ color: "black" }} >
                            Symptoms
                        </Text>
                        <Gap height={hp(1)} />
                        <View style={styles.symptomsContainer}>

                            <View style={{ flex: 1, marginEnd: 10 }}>
                                <CustomTextInput
                                    placeholder={"Enter symptom..."}
                                    value={symptoms}
                                    onChangeText={setSymptoms}
                                    icon={undefined}
                                    right={undefined}
                                    onRightPress={undefined}
                                    keyboardType={undefined}
                                />
                            </View>

                            <PrimaryButton
                                label={"+ Add"}
                                filled={false}
                                onPress={handleAddSymptom}
                                style={{ width: '25%', marginBottom: 0 }}
                                icon={undefined}
                                image={undefined}
                                iconStyle={undefined}
                                imageStyle={undefined}
                            />
                        </View>
                        <PrimaryButton
                            label={"Analyze"}
                            filled={true}
                            onPress={() => { }}
                            style={{ width: '100%', marginBottom: 0 }}
                            icon={<Feather name="search" color={"white"} size={18} />}
                            image={undefined}
                            iconStyle={undefined}
                            imageStyle={undefined}
                        />
                    </View>
                );
            case 'Clinical Research':
                return (
                    <View style={styles.contentContainer}>
                        <Text style={styles.sectionTitle}>Clinical Research Search</Text>
                        <Text style={{ color: "black" }} >
                            Diagnosis
                        </Text>

                        <Gap height={hp(1)} />

                        <CustomTextInput
                            placeholder={'e.g. Migraine'}
                            value={diagnosis}
                            onChangeText={setDiagnosis}
                            icon={undefined}
                            right={undefined}
                            onRightPress={undefined}
                            keyboardType={undefined}
                        />

                        <Gap height={hp(2)} />

                        <Text style={{ color: "black" }} >
                            Location
                        </Text>

                        <Gap height={hp(1)} />

                        <CustomTextInput
                            placeholder={'e.g. Warsaw'}
                            value={location}
                            onChangeText={setLocation}
                            icon={undefined}
                            right={undefined}
                            onRightPress={undefined}
                            keyboardType={undefined}
                        />

                        <Gap height={hp(2)} />

                        <PrimaryButton
                            label={"Search Studies"}
                            filled={true}
                            onPress={() => { }}
                            style={{ width: '100%' }}
                            icon={<Feather name="search" color={"white"} size={18} />}
                            image={undefined}
                            iconStyle={undefined}
                            imageStyle={undefined}
                        />

                    </View>
                );
            case 'Statistical Analysis':
                return (
                    <View style={styles.contentContainer}>
                        <View style={{ flexDirection: "row", width: "100%", justifyContent: "space-between", alignItems: "center" }}>
                            <Text style={styles.sectionTitle}>AI Statistical Analysis</Text>
                            <PrimaryButton
                                label={"Export Report"}
                                filled={true}
                                onPress={() => { }}
                                style={{ width: "45%" }}
                                icon={<Feather name="download" color="white" size={18} />}
                                image={undefined}
                                iconStyle={undefined}
                                imageStyle={undefined}
                            />
                        </View>

                        <View style={styles.dropdownContainer}>
                            <Text>Time Range</Text>
                            <Gap height={hp(1)} />
                            <CustomDropdown
                                placeholder={timeRange}
                                options={timeRangeOptions}
                                value={timeRange}
                                onChange={(value) => setTimeRange(String(value))}
                                icon={undefined}
                            />
                        </View>
                        <View style={styles.checkboxContainer}>
                            <Text style={styles.checkboxTitle}>Metrics</Text>
                            {
                                metrics.map((metric, index) => (
                                    <CustomCheckbox
                                        key={index}
                                        label={metric}
                                        checked={selectedMetrics.includes(metric)}
                                        onChange={() => handleMetricToggle(metric)}
                                    />
                                ))
                            }
                        </View>
                        <View style={styles.dropdownContainer}>
                            <Text>Grouping</Text>
                            <Gap height={hp(1)} />
                            <CustomDropdown
                                placeholder={grouping}
                                options={groupingOptions}
                                value={grouping}
                                onChange={(value) => setGrouping(String(value))}
                                icon={undefined}
                            />
                        </View>
                        <PrimaryButton
                            label={"Analyze"}
                            filled={true}
                            onPress={() => navigation.navigate('AI-Analysis')}
                            style={{ width: "100%" }}
                            icon={<Feather name="bar-chart-2" color="white" size={18} />}
                            image={undefined}
                            iconStyle={undefined}
                            imageStyle={undefined}
                        />
                    </View>
                );
            default:
                return null;
        }
    };

    const tabs = [
        'Documentation',
        'Chatbots',
        'Diagnostics',
        'Clinical Research',
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

                {/* Help Button */}
                <TouchableOpacity style={styles.helpButton}>
                    <Text style={styles.helpButtonText}>?</Text>
                </TouchableOpacity>
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
        // paddingBottom: 20,
    },
    contentContainer: {
        padding: 15,
        backgroundColor: '#FFFFFF',
        margin: 15,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#333333',
        width: "50%"
    },
    input: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        padding: 12,
    },
    multilineInput: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        padding: 12,
        marginBottom: 15,
        minHeight: 100,
    },
    dropdownContainer: {
        marginBottom: 15,
    },
    dropdown: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        padding: 12,
    },
    checkboxContainer: {
        marginBottom: 15,
    },
    checkboxTitle: {
        fontWeight: 'bold',
        marginBottom: 10,
    },
    checkboxItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    symptomsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        justifyContent: "space-between",
        height: 50
    },
    recordButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#E6F2F9',
        padding: 12,
        borderRadius: 8,
    },
    recordButtonText: {
        color: '#4A90B9',
        fontWeight: 'bold',
        marginLeft: 10,
    },
    newChatbotButton: {
        backgroundColor: '#4A90B9',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 15,
    },
    newChatbotButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    saveButton: {
        backgroundColor: '#4A90B9',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    saveButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    addButton: {
        backgroundColor: '#4A90B9',
        padding: 12,
        borderRadius: 8,
        marginLeft: 10,
    },
    addButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    analyzeButton: {
        backgroundColor: '#4A90B9',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    analyzeButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    searchButton: {
        backgroundColor: '#4A90B9',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    searchButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    exportButton: {
        backgroundColor: '#4A90B9',
        padding: 12,
        borderRadius: 8,
        alignItems: "center"
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