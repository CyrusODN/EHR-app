import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Card, useTheme } from 'react-native-paper';
import LogoSvg from '../../component/logo';
import Gap from '../../component/gap';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import userStore from '../../store/user';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp
} from 'react-native-responsive-screen';


const ModuleSelection = () => {

    const { colors } = useTheme();
    const navigation = useNavigation();
    const setSelectedModule = userStore((state: any) => state.setSelectedModule);


    return (
        <View style={styles.container}>
            {/* Header */}
            <LogoSvg size={'small'} />
            <>
                <Text style={[styles.subHeaderText, { color: colors.onSurface }]}>
                    Select a module to start working
                </Text>
                <Gap height={20} />

                {/* Psychiatry Card */}
                <TouchableOpacity onPress={() => {
                    setSelectedModule('Psychiatry');
                    (navigation as any).navigate('Module-Loading')
                }}
                    style={styles.cardWrapper}>
                    <Card style={styles.card}>
                        <LinearGradient
                            colors={['#4A90B9', '#5BA6B6', '#68BFB3']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.gradientBackground}>
                            <Card.Content style={{ padding: 15 }}>
                                <View style={styles.cardContent}>
                                    <View style={{
                                        height: 40, width: 40,
                                        marginEnd: 10, borderRadius: 10,
                                        backgroundColor: "rgba(0,0,0,0.1)",
                                        alignItems: "center", justifyContent: "center"
                                    }} >
                                        <Image source={require('../../assets/images/brain.png')} style={{ height: 20, width: 20 }} />
                                    </View>

                                    <View>
                                        <Text style={[styles.moduleTitle, { color: colors.surface }]}>Psychiatry</Text>
                                        <Text style={[styles.moduleDescription, { color: colors.surface }]}>Psychiatric module</Text>
                                    </View>
                                </View>
                                <Text style={[styles.toolDescription, { color: colors.surface }]}>Comprehensive tool for psychiatric documentation, powered by AI.</Text>
                                <View style={styles.bulletPoints}>
                                    <Text style={[styles.bullet, { color: colors.surface }]}>
                                        • Intelligent psychiatric scales</Text>
                                    <Text style={[styles.bullet, { color: colors.surface }]}>
                                        • Emotion and behavior analysis</Text>
                                    <Text style={[styles.bullet, { color: colors.surface }]}>
                                        • AI diagnostic assistant</Text>
                                </View>
                            </Card.Content>
                        </LinearGradient>
                    </Card>
                </TouchableOpacity>

                {/* POZ Card */}
                <TouchableOpacity disabled style={[styles.cardWrapper]}>
                    <Card style={[styles.card, { backgroundColor: '#e5e7eb' }]}>
                        <Card.Content style={{ padding: 15 }}>
                            <View style={styles.cardContent}>
                                <View style={{
                                    height: 40, width: 40,
                                    marginEnd: 10, borderRadius: 10,
                                    backgroundColor: "rgba(0,0,0,0.1)",
                                    alignItems: "center", justifyContent: "center"
                                }} >
                                    <FontAwesome6
                                        name="stethoscope"
                                        size={20}
                                        color={'#999'}
                                    />
                                </View>
                                <View>
                                    <Text style={[styles.moduleTitle, { color: '#999' }]}>POZ</Text>
                                    <Text style={[styles.moduleDescription, { color: colors.onSurfaceVariant }]}>Primary Healthcare</Text>
                                </View>
                            </View>
                            <Text style={[styles.toolDescription, { color: colors.onSurfaceVariant }]}>
                                Comprehensive system for managing primary care practice, with e-prescription and e-referral integration.</Text>
                            <View style={styles.bulletPoints}>
                                <Text style={[styles.bullet, { color: colors.onSurfaceVariant }]}>
                                    • P1 Integration</Text>
                                <Text style={[styles.bullet, { color: colors.onSurfaceVariant }]}>
                                    • Declaration management</Text>
                                <Text style={[styles.bullet, { color: colors.onSurfaceVariant }]}>
                                    • NFZ settlements</Text>
                            </View>
                            <View style={styles.comingSoon}>
                                <AntDesign
                                    name="exclamationcircleo"
                                    size={15}
                                    color={colors.surface}
                                />
                                <View style={{ width: 5 }} />
                                <Text style={{ fontWeight: "bold", fontSize: 12, color: colors.surface }}>Coming Soon</Text>
                            </View>

                        </Card.Content>
                    </Card>
                </TouchableOpacity>
            </>
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
        marginBottom: 5
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
    },
});

export default ModuleSelection;
