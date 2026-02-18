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
    Image
} from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/Feather';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Gap from '../component/gap';
// import Svg, { Defs, LinearGradient, Stop, G, Path } from 'react-native-svg';
const { width } = Dimensions.get('window');
import LinearGradient from 'react-native-linear-gradient';
import LogoSvg from '../component/logo';

const SlidingDrawerModal = ({ visible, onClose }: { visible: boolean, onClose: () => void }) => {
    const slideAnim = useRef(new Animated.Value(-width)).current;
    const [modalVisible, setModalVisible] = useState(visible);
    const navigation = useNavigation();

    // Handle opening animation
    useEffect(() => {
        if (visible) {
            setModalVisible(true);
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        } else {
            // Only hide modal after animation completes
            Animated.timing(slideAnim, {
                toValue: -width,
                duration: 300,
                useNativeDriver: true,
            }).start(() => {
                setModalVisible(false);
            });
        }
    }, [visible, slideAnim]);

    const handleClose = () => {
        // Start closing animation first
        Animated.timing(slideAnim, {
            toValue: -width,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            // Then notify parent after animation finishes
            onClose();
        });
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
                                { transform: [{ translateX: slideAnim }] },
                            ]}
                        >
                            <Gap height={hp(2)} />
                            <LogoSvg size='small' />

                            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                                <Icon name="x" size={24} color="#000" />
                            </TouchableOpacity>


                            <ScrollView style={styles.menuContainer}>
                                {/* Patients Section */}
                                <View style={styles.section}>
                                    <Text style={styles.sectionTitle}>Patients</Text>

                                    <TouchableOpacity
                                        onPress={() => {
                                            onClose();
                                            navigation.navigate("Search-Patient");
                                        }}
                                        style={styles.menuItem}>
                                        <Icon name="search" size={20} color="#555" />
                                        <Text style={styles.menuItemText}>Search patient</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        onPress={() => {
                                            onClose();
                                            navigation.navigate("New-Patient");
                                        }}
                                        style={styles.menuItem}>
                                        <Ionicons name="add-circle-outline" size={20} color="#555" />
                                        <Text style={styles.menuItemText}>New patient</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        onPress={() => {
                                            onClose();
                                            navigation.navigate("Patient-List")
                                        }}
                                        style={styles.menuItem}>
                                        <Icon name="users" size={20} color="#555" />
                                        <Text style={styles.menuItemText}>Patient list</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        onPress={() => {
                                            onClose();
                                            navigation.navigate("Schedule-Visits")
                                        }}
                                        style={styles.menuItem}>
                                        <Icon name="calendar" size={20} color="#555" />
                                        <Text style={styles.menuItemText}>Scheduled visits</Text>
                                    </TouchableOpacity>
                                </View>

                                {/* Services Section */}
                                <View style={styles.section}>
                                    <Text style={styles.sectionTitle}>Services</Text>

                                    <TouchableOpacity style={styles.menuItem}>
                                        <Icon name="file-text" size={20} color="#555" />
                                        <Text style={styles.menuItemText}>Documentation</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        onPress={() => {
                                            onClose();
                                            navigation.navigate("AI-Assistant")
                                            console.log("AI Assistant pressed");
                                        }}
                                        style={styles.menuItem}>
                                        <FontAwesome5 name="robot" size={20} color="#666" />
                                        <Text style={styles.menuItemText}>AI Assistants</Text>
                                    </TouchableOpacity>
                                </View>

                                {/* Reports Section */}
                                <View style={[styles.section, { marginBottom: 0 }]}>
                                    <Text style={styles.sectionTitle}>Reports</Text>

                                    <TouchableOpacity style={styles.menuItem}>
                                        <Feather name="bar-chart-2" size={20} color="#555" />
                                        <Text style={styles.menuItemText}>Statistics</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        onPress={() => {
                                            onClose();
                                            navigation.navigate('AI-Analysis')
                                            console.log("AI Analysis pressed");
                                        }}
                                        style={styles.menuItem}>
                                        {/* <FontAwesome6 name="brain" size={20} color="#666" /> */}
                                        <Image source={require('../assets/images/brain-dark.png')} style={{ height: 20, width: 20 }} />
                                        <Text style={styles.menuItemText}>AI Analysis</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={styles.menuItem}>
                                        <Icon name="clipboard" size={20} color="#555" />
                                        <Text style={styles.menuItemText}>Medical reports</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={styles.menuItem}>
                                        <Icon name="credit-card" size={20} color="#555" />
                                        <Text style={styles.menuItemText}>Billing</Text>
                                    </TouchableOpacity>
                                </View>

                                <Gap height={hp(1)} />

                                {/* Spotlight */}
                                <TouchableOpacity
                                    onPress={() => {
                                        onClose();
                                        navigation.navigate('SpotLight')
                                    }}
                                >
                                    <View
                                        style={{
                                            width: "90%",
                                        }}
                                    >
                                        <LinearGradient
                                            colors={['#4A90B9', '#5BA6B6', '#68BFB3']}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 0 }}
                                            style={{
                                                paddingLeft: '2.5%',
                                                marginLeft: '2.5%',
                                                height: 35,
                                                width: '100%',
                                                flexDirection: "row",
                                                alignItems: "center",
                                                borderRadius: 5,
                                            }}>
                                            <Image source={require('../assets/images/stars-white.png')} style={{ height: 20, width: 20 }} />
                                            <Text style={styles.spotlightText}>Spotlight</Text>
                                        </LinearGradient>
                                    </View>
                                </TouchableOpacity>

                                <Gap height={hp(3)} />
                                <View style={styles.bottomContainer}>
                                    <TouchableOpacity
                                        style={styles.themeToggle}
                                        onPress={() => { }}
                                    >
                                        <Icon name="moon" size={20} color="#555" />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.themeToggle}
                                        onPress={() => {
                                            onClose();
                                            navigation.navigate('Settings')
                                            console.log("Settings pressed");
                                        }}
                                    >
                                        <Icon name="settings" size={20} color="#555" />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.themeToggle}
                                        onPress={() => { }}
                                    >
                                        <Icon name="log-out" size={20} color="#555" />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.themeToggle}
                                        onPress={() => { }}
                                    >
                                        <AntDesign name="questioncircleo" size={20} color="#555" />
                                    </TouchableOpacity>
                                </View>
                            </ScrollView>
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
        width: '85%',
        height: '100%',
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        paddingTop: Platform.OS == 'ios' ? hp(5) : hp(2),
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    logo: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    closeButton: {
        padding: 5,
        position: "absolute",
        right: wp(2), top: hp(7.5)
    },
    menuContainer: {
        flex: 1, paddingLeft: 10
    },
    section: {
        marginBottom: 20,
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 16,
        color: '#777',
        marginVertical: 10,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },
    menuItemText: {
        marginLeft: 15,
        fontSize: 16,
    },
    spotlightText: {
        color: '#fff',
        marginLeft: 15,
        fontSize: 16,
        fontWeight: '500',
    },
    bottomContainer: {
        width: '100%',
        borderTopWidth: 0.5,
        borderTopColor: 'grey',
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginLeft: -10
    },
    themeToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderRadius: 10,
    },
});

export default SlidingDrawerModal;
