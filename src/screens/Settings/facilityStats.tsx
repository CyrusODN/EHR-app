import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';

// Stat Card component for consistent styling
const StatCard = ({ icon, title, value }: any) => (
    <View style={styles.card}>
        <View style={styles.iconContainer}>
            {icon}
        </View>
        <View style={styles.statContent}>
            <Text style={styles.statTitle}>{title}</Text>
            <Text style={styles.statValue}>{value}</Text>
        </View>
    </View>
);

const FacilityStatistics = () => {
    const navigation = useNavigation();
    // Stats data
    const stats = [
        {
            title: 'Departments',
            value: '3',
            icon: <FontAwesome5 name="building" size={24} color="#4A90B9" />
        },
        {
            title: 'Doctors',
            value: '2',
            icon: <Feather name="users" size={24} color="#4A99b9" />
        },
        {
            title: 'Offices',
            value: '3',
            icon: <MaterialIcons name="meeting-room" size={24} color="green" />
        },
        {
            title: 'Nurses',
            value: '0',
            icon: <Feather name="users" size={24} color="#9370DB" />
        },
        {
            title: 'Patients',
            value: '1615',
            icon: <Feather name="users" size={24} color="blue" />
        },
        {
            title: 'Receptionists',
            value: '1',
            icon: <MaterialCommunityIcons name="account-cog-outline" size={24} color="#FFA500" />
        },
    ];

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingRight: 10 }}>
                    <Ionicons name="chevron-back" size={24} color="#333" />
                </TouchableOpacity>
                <View style={styles.headerIconContainer}>
                    <Feather name="bar-chart-2" size={24} color="#4A90B9" />
                </View>
                <Text style={styles.headerTitle}>Facility Statistics</Text>
            </View>

            {/* Stats Cards */}
            <ScrollView style={styles.scrollView}>
                {stats.map((stat, index) => (
                    <StatCard
                        key={index}
                        icon={stat.icon}
                        title={stat.title}
                        value={stat.value}
                    />
                ))}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
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
    scrollView: {
        flex: 1,
        padding: 15,
        backgroundColor: "white",
        width: "100%"
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        marginBottom: 15,
        borderColor: "#ccc",
        borderWidth: 1
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.1,
        // shadowRadius: 4,
        // elevation: 2,
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 10,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    statContent: {
        flex: 1,
    },
    statTitle: {
        fontSize: 16,
        color: '#666666',
        marginBottom: 5,
    },
    statValue: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333333',
    },
});

export default FacilityStatistics;