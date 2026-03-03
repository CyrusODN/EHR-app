import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image, ViewBase } from 'react-native';
import { Card, useTheme } from 'react-native-paper';
import LogoSvg from '../../component/logo';
import Gap from '../../component/gap';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp
} from 'react-native-responsive-screen';


const ModuleLoading = () => {
    const { colors } = useTheme();
    const navigation = useNavigation();
    const [showLoading, setShowLoading] = useState(false);
    const [loadingWidth, setLoadingWidth] = useState(0);

    useEffect(() => {
        let timer: any;

        if (loadingWidth < 100) {
            timer = setTimeout(() => {
                setLoadingWidth(prev => prev + 1);
            }, 5);
        } else {
            (navigation as any).navigate('Dashboard');
        }

        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [loadingWidth, navigation]);

    return (
        <View style={styles.container}>
            {/* Header */}
            <LogoSvg size={'small'} />
            <View style={{ width: "65%", alignItems: "flex-end" }}>
                <Image
                    source={require('../../assets/images/stars.png')}
                    style={{ height: 20, width: 20 }}
                />
            </View>
            <View style={{ width: "80%" }}>
                <View style={{
                    flexDirection: "row",
                    alignItems: "center", marginVertical: hp(1), justifyContent: "center"
                }}>
                    <LinearGradient
                        colors={['#4A90B9', '#5BA6B6', '#68BFB3']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={{
                            height: 40, width: 40,
                            marginEnd: 15, borderRadius: 10,
                            backgroundColor: "rgba(0,0,0,0.1)",
                            alignItems: "center", justifyContent: "center"
                        }}
                    >
                        <Image source={require('../../assets/images/brain.png')} style={{ height: 20, width: 20 }} />
                    </LinearGradient>
                    <Text style={[styles.moduleTitle, { color: '#000000', fontSize: 20 }]}>Psychiatric Module</Text>
                </View>
                <Gap height={hp(2)} />
                {/* Progress Bar Track */}
                <View style={{
                    height: 6,
                    width: '100%',
                    backgroundColor: '#E5E5E5',
                    borderRadius: 4,
                    overflow: 'hidden'
                }}>
                    <LinearGradient
                        colors={['#4A90B9', '#5BA6B6', '#68BFB3']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={{
                            height: '100%',
                            width: `${Math.max(loadingWidth, 2)}%`,
                            borderRadius: 4,
                        }}
                    />
                </View>
                <Gap height={hp(3)} />
                <View style={{ width: "100%", alignItems: "center", justifyContent: "center" }}>
                    <Text style={{ color: "#666", fontSize: 14 }}>Initializing module...</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: "center"
    },
    header: {
        alignItems: 'center',
        marginVertical: 0,
    },
    headerText: {
        fontSize: 30,
        fontWeight: 'bold',
    },
    subHeaderText: {
        fontSize: 16,

    },
    cardWrapper: {
        marginBottom: 20,
    },
    cardDisabled: {
        opacity: 0.5,
    },
    gradientBackground: {
        borderRadius: 10,
        width: "100%",
    },
    card: {
        borderRadius: 10,
        elevation: 3,
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginRight: 15,
    },
    moduleTitle: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    moduleDescription: {

    },
    toolDescription: {
        marginVertical: 10,
    },
    bulletPoints: {
        marginVertical: 10,
    },
    bullet: {
        fontSize: 14,
    },
    comingSoon: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: '#daaf59',
        padding: 5,
        borderRadius: 15,
        flexDirection: "row",
        alignItems: 'center',
        color: 'white',

    },
});

export default ModuleLoading;
