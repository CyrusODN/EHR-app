import React, { useState, useRef } from 'react';
import {
    View, ScrollView,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    Animated
} from 'react-native';
import { Text, Card, Searchbar, IconButton, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp
} from 'react-native-responsive-screen';

// Replace the Card section in your Dashboard component with this implementation
export const DashboardStatsCard = () => {
    const { colors } = useTheme();
    const [isExpanded, setIsExpanded] = useState(false);
    const expandAnimation = useRef(new Animated.Value(0)).current;
    const rotateAnimation = useRef(new Animated.Value(0)).current;

    const totalPatients = '1393 total';

    const toggleExpand = () => {
        const toValue = isExpanded ? 0 : 1;

        Animated.parallel([
            Animated.timing(expandAnimation, {
                toValue,
                duration: 300,
                useNativeDriver: false,
            }),
            Animated.timing(rotateAnimation, {
                toValue,
                duration: 300,
                useNativeDriver: true,
            })
        ]).start();

        setIsExpanded(!isExpanded);
    };

    const cardHeight = expandAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 300]
    });

    const iconRotation = rotateAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg']
    });

    return (
        <Card style={styles.statsCard}>
            <Card.Content style={styles.statsContent}>
                <View style={{
                    backgroundColor: "rgba(90,167,179,0.1)",
                    height: 40, width: 40, alignItems: "center", justifyContent: 'center',
                    borderRadius: 10
                }}>
                    <Feather name="bar-chart-2" size={24} color="#58a6b8" />
                </View>
                <Text style={styles.dashboardText}>Dashboard</Text>
                <Text style={styles.totalText}>{totalPatients}</Text>
                <TouchableOpacity onPress={toggleExpand}>
                    <Animated.View style={{ transform: [{ rotate: iconRotation }] }}>
                        <IconButton
                            icon="chevron-down"
                            size={20}
                            iconColor={colors.onSurfaceVariant}
                        />
                    </Animated.View>
                </TouchableOpacity>
            </Card.Content>

            <Animated.View style={[styles.expandableContent, { height: cardHeight }]}>
                <View style={styles.statsRow}>
                    <View style={styles.statsBox}>
                        <View style={styles.statsIconContainer}>
                            <Icon name="account-multiple" size={20} color="#58a6b8" />
                        </View>
                        <Text style={styles.statsLabel}>Today's Patients</Text>
                        <Text style={styles.statsValue}>24</Text>
                        <IconButton
                            icon="chevron-right"
                            size={16}
                            style={styles.statsArrow}
                            iconColor="#58a6b8"
                        />
                    </View>

                    <View style={styles.statsBox}>
                        <View style={styles.statsIconContainer}>
                            <Icon name="file-document" size={20} color="#58a6b8" />
                        </View>
                        <Text style={styles.statsLabel}>Pending Reports</Text>
                        <Text style={styles.statsValue}>8</Text>
                        <IconButton
                            icon="chevron-right"
                            size={16}
                            style={styles.statsArrow}
                            iconColor="#58a6b8"
                        />
                    </View>
                </View>

                <View style={[styles.statsRow]}>
                    <View style={styles.statsBox}>
                        <View style={styles.statsIconContainer}>
                            <Icon name="calendar" size={20} color="#58a6b8" />
                        </View>
                        <Text style={styles.statsLabel}>Scheduled Visits</Text>
                        <Text style={styles.statsValue}>156</Text>
                        <IconButton
                            icon="chevron-right"
                            size={16}
                            style={styles.statsArrow}
                            iconColor="#58a6b8"
                        />
                    </View>

                    <View style={styles.statsBox}>
                        <View style={styles.statsIconContainer}>
                            <Icon name="check-circle" size={20} color="#58a6b8" />
                        </View>
                        <Text style={styles.statsLabel}>Completed Visits</Text>
                        <Text style={styles.statsValue}>1205</Text>
                        <IconButton
                            icon="chevron-right"
                            size={16}
                            style={styles.statsArrow}
                            iconColor="#58a6b8"
                        />
                    </View>
                </View>
            </Animated.View>
        </Card>
    );
};

// Add these styles to your existing StyleSheet
const styles = StyleSheet.create({
    statsCard: {
        width: '95%',
        borderRadius: 10,
        backgroundColor: 'white'
    },
    statsContent: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
    },
    dashboardText: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
        fontWeight: '600',
    },
    totalText: {
        color: '#777',
        marginRight: 5,
        fontSize: 14,
    },
    expandableContent: {
        overflow: 'hidden',
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    statsBox: {
        width: '48%',
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        padding: 16,
        position: 'relative',
    },
    statsIconContainer: {
        backgroundColor: 'rgba(90,167,179,0.1)',
        height: 36,
        width: 36,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        marginBottom: 10,
    },
    statsLabel: {
        fontSize: 14,
        color: '#777',
        marginBottom: 5,
    },
    statsValue: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    statsArrow: {
        position: 'absolute',
        right: 0,
        bottom: 0,
    }
});