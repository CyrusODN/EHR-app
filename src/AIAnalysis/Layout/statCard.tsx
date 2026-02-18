import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import Gap from '../../component/gap'
import Feather from 'react-native-vector-icons/Feather';

const StatCard = ({ title, icon, score, subtitle }) => {
    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.titleText}>{title}</Text>
                <View style={{ alignSelf: "flex-start" }}>
                    {icon}
                </View>
            </View>
            <Gap height={hp(1)} />
            <View style={styles.scoreContainer}>
                <Text style={styles.scoreText}>{score}</Text>
            </View>
            <Gap height={hp(1)} />
            <View style={styles.subtitleContainer}>
                <Feather name={'trending-up'} color={'#22c55e'} size={20} />
                <Text style={styles.subtitleText}>{subtitle}</Text>
            </View>
        </View>
    )
}

export default StatCard

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        width: "48%",
        height: hp(18),
        padding: 10,
        justifyContent: "space-between",
        borderRadius: 10,
        // iOS shadow
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        // Android shadow
        elevation: 4,
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
        width: '75%',
        alignSelf: "flex-start"
    },
    scoreContainer: {
        alignSelf: "flex-start"
    },
    scoreText: {
        fontSize: 30,
        fontWeight: 'bold'
    },
    subtitleContainer: {
        alignSelf: "flex-start",
        flexDirection: "row",
        alignItems: "center"
    },
    subtitleText: {
        fontSize: 20,
        fontWeight: '300',
        color: "#22c55e"
    }
})