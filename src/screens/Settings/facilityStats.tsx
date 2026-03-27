import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, StatusBar } from 'react-native';
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
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '../../hooks/useThemeColors';

// Stat Card component for consistent styling
const StatCard = ({ icon, title, value, ds }: any) => (
    <View style={ds.card}>
        <View style={ds.iconContainer}>
            {icon}
        </View>
        <View style={ds.statContent}>
            <Text style={ds.statTitle}>{title}</Text>
            <Text style={ds.statValue}>{value}</Text>
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
    const { t } = useTranslation();
    const navigation = useNavigation();
    const { colors: tc, isDark } = useThemeColors();
    const ds = createDynamicStyles(tc, isDark);

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
            setError(err?.message || t('settings.facility_stats.error_default'));
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
            title: t('settings.facility_stats.stats.departments'),
            value: String(statsData.departments ?? 0),
            icon: <FontAwesome5 name="building" size={24} color={tc.accent} />
        },
        {
            title: t('settings.facility_stats.stats.doctors'),
            value: String(statsData.doctors ?? 0),
            icon: <Feather name="users" size={24} color={tc.accent} />
        },
        {
            title: t('settings.facility_stats.stats.offices'),
            value: String(statsData.offices ?? 0),
            icon: <MaterialIcons name="meeting-room" size={24} color={isDark ? "#34D399" : "#10B981"} />
        },
        {
            title: t('settings.facility_stats.stats.nurses'),
            value: String(statsData.nurses ?? 0),
            icon: <Feather name="users" size={24} color={isDark ? "#A78BFA" : "#8B5CF6"} />
        },
        {
            title: t('settings.facility_stats.stats.patients'),
            value: String(statsData.patients ?? 0),
            icon: <Feather name="users" size={24} color={isDark ? "#60A5FA" : "#3B82F6"} />
        },
        {
            title: t('settings.facility_stats.stats.receptionists'),
            value: String(statsData.receptionists ?? 0),
            icon: <MaterialCommunityIcons name="account-cog-outline" size={24} color={isDark ? "#FBBF24" : "#F59E0B"} />
        },
    ] : [];

    return (
        <View style={ds.container}>
            <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={tc.cardBackground} />
            {/* Header */}
            <View style={ds.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingRight: 10 }}>
                    <Ionicons name="chevron-back" size={24} color={tc.textPrimary} />
                </TouchableOpacity>
                <View style={ds.headerIconContainer}>
                    <Feather name="bar-chart-2" size={24} color={tc.accent} />
                </View>
                <Text style={ds.headerTitle}>{t('settings.facility_stats.title')}</Text>
            </View>

            {/* Loading State */}
            {loading && (
                <View style={ds.loadingContainer}>
                    <ActivityIndicator size="large" color={tc.accent} />
                    <Text style={ds.loadingText}>{t('settings.facility_stats.loading')}</Text>
                </View>
            )}

            {/* Error State */}
            {!loading && error && (
                <View style={ds.errorContainer}>
                    <Ionicons name="alert-circle-outline" size={48} color={tc.error} />
                    <Text style={ds.errorText}>{error}</Text>
                    <TouchableOpacity style={ds.retryButton} onPress={fetchStatistics}>
                        <Text style={ds.retryButtonText}>{t('settings.facility_stats.retry')}</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Stats Cards */}
            {!loading && !error && (
                <View style={{ flex: 1, backgroundColor: tc.screenBackground }} >
                    <ScrollView style={ds.scrollView}>
                        {stats.map((stat, index) => (
                            <StatCard
                                key={index}
                                icon={stat.icon}
                                title={stat.title}
                                value={stat.value}
                                ds={ds}
                            />
                        ))}
                    </ScrollView>
                </View>
            )}
        </View>
    );
};

const createDynamicStyles = (tc: any, isDark: boolean) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: tc.screenBackground,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
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
    scrollView: {
        flex: 1,
        padding: 15,
        backgroundColor: tc.screenBackground,
        width: "100%"
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: tc.cardBackground,
        borderRadius: 12,
        padding: 20,
        marginBottom: 15,
        borderWidth: isDark ? 1 : 0,
        borderColor: tc.borderSubtle,
        shadowColor: tc.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isDark ? 0.3 : 0.05,
        shadowRadius: 5,
        elevation: 3,
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 12,
        backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    statContent: {
        flex: 1,
    },
    statTitle: {
        fontSize: 15,
        color: tc.textSecondary,
        marginBottom: 4,
    },
    statValue: {
        fontSize: 26,
        fontWeight: 'bold',
        color: tc.textPrimary,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: tc.screenBackground,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: tc.textSecondary,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: tc.screenBackground,
        padding: 20,
    },
    errorText: {
        marginTop: 12,
        fontSize: 16,
        color: tc.textSecondary,
        textAlign: 'center',
    },
    retryButton: {
        marginTop: 20,
        paddingHorizontal: 24,
        paddingVertical: 10,
        backgroundColor: tc.accent,
        borderRadius: 8,
    },
    retryButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default FacilityStatistics;