import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import Gap from '../../../component/gap'
import Feather from 'react-native-vector-icons/Feather';
import { useThemeColors } from '../../../hooks/useThemeColors';

interface StatCardProps {
    title: string;
    icon: React.ReactNode;
    score: string | number;
    subtitle: string;
}

const StatCard = ({ title, icon, score, subtitle }: StatCardProps) => {
    const { colors: tc, isDark } = useThemeColors();
    const ds = createDynamicStyles(tc, isDark);
    
    return (
        <View style={ds.container}>
            <View style={ds.headerContainer}>
                <Text style={ds.titleText}>{title}</Text>
                <View style={{ alignSelf: "flex-start" }}>
                    {icon}
                </View>
            </View>
            <Gap height={hp(1)} />
            <View style={ds.scoreContainer}>
                <Text style={ds.scoreText}>{score}</Text>
            </View>
            <Gap height={hp(1)} />
            <View style={ds.subtitleContainer}>
                <Feather name={'trending-up'} color={isDark ? '#4ade80' : '#22c55e'} size={20} />
                <Text style={[ds.subtitleText, { color: isDark ? '#4ade80' : '#22c55e' }]}>{subtitle}</Text>
            </View>
        </View>
    )
}

export default StatCard

const createDynamicStyles = (tc: any, isDark: boolean) => StyleSheet.create({
    container: {
        backgroundColor: tc.cardBackground,
        width: "48%",
        height: hp(18),
        padding: 10,
        justifyContent: "space-between",
        borderRadius: 10,
        shadowColor: tc.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isDark ? 0.3 : 0.15,
        shadowRadius: 5,
        elevation: 4,
        borderWidth: isDark ? 1 : 0,
        borderColor: tc.borderSubtle,
    },
    headerContainer: {
        flexDirection: "row",
        width: "100%",
        alignItems: "center",
        justifyContent: "space-between",
        height: '30%',
    },
    titleText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: tc.textPrimary,
        width: '75%',
        alignSelf: "flex-start"
    },
    scoreContainer: {
        alignSelf: "flex-start"
    },
    scoreText: {
        fontSize: 30,
        fontWeight: 'bold',
        color: tc.textPrimary,
    },
    subtitleContainer: {
        alignSelf: "flex-start",
        flexDirection: "row",
        alignItems: "center"
    },
    subtitleText: {
        fontSize: 20,
        fontWeight: '300',
    }
})