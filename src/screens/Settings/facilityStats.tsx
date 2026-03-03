import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { GetFacilityStatistics } from '../../Services/settingServices';

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

interface FacilityStatsData {
    doctors: number;
    nurses: number;
    receptionists: number;
    patients: number;
    departments: number;
    offices: number;
}

const FacilityStatistics = () => {
    const navigation = useNavigation();
    const [statsData, setStatsData] = useState<FacilityStatsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStatistics = async () => {
        try {
            setLoading(true);
            setError(null);
            const response: any = await GetFacilityStatistics();
            console.log("Facility stats response:", response);
            // The axios interceptor returns response.data.data, 
            // so response should be { data: { doctors, nurses, ... } }
            if (response?.data) {
                setStatsData(response.data);
            } else if (response?.doctors !== undefined) {
                // In case the interceptor unwraps further
                setStatsData(response);
            }
        } catch (err: any) {
            console.log("Error fetching facility stats:", err);
            setError(err?.message || 'Failed to fetch statistics');
        } finally {
            setLoading(false);
        }
    };

    // Fetch stats every time the screen comes into focus
    useFocusEffect(
        useCallback(() => {
            fetchStatistics();
        }, [])
    );

    // Build stats array from fetched data
    const stats = statsData ? [
        {
            title: 'Departments',
            value: String(statsData.departments ?? 0),
            icon: <FontAwesome5 name="building" size={24} color="#4A90B9" />
        },
        {
            title: 'Doctors',
            value: String(statsData.doctors ?? 0),
            icon: <Feather name="users" size={24} color="#4A99b9" />
        },
        {
            title: 'Offices',
            value: String(statsData.offices ?? 0),
            icon: <MaterialIcons name="meeting-room" size={24} color="green" />
        },
        {
            title: 'Nurses',
            value: String(statsData.nurses ?? 0),
            icon: <Feather name="users" size={24} color="#9370DB" />
        },
        {
            title: 'Patients',
            value: String(statsData.patients ?? 0),
            icon: <Feather name="users" size={24} color="blue" />
        },
        {
            title: 'Receptionists',
            value: String(statsData.receptionists ?? 0),
            icon: <MaterialCommunityIcons name="account-cog-outline" size={24} color="#FFA500" />
        },
    ] : [];

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

            {/* Loading State */}
            {loading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#4A90B9" />
                    <Text style={styles.loadingText}>Loading statistics...</Text>
                </View>
            )}

            {/* Error State */}
            {!loading && error && (
                <View style={styles.errorContainer}>
                    <Ionicons name="alert-circle-outline" size={48} color="#FF6B6B" />
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity style={styles.retryButton} onPress={fetchStatistics}>
                        <Text style={styles.retryButtonText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Stats Cards */}
            {!loading && !error && (
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
            )}
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#666666',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 20,
    },
    errorText: {
        marginTop: 12,
        fontSize: 16,
        color: '#666666',
        textAlign: 'center',
    },
    retryButton: {
        marginTop: 20,
        paddingHorizontal: 24,
        paddingVertical: 10,
        backgroundColor: '#4A90B9',
        borderRadius: 8,
    },
    retryButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default FacilityStatistics;