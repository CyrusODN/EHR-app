import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    ScrollView,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

interface PsychiatricScalesModalProps {
    visible: boolean;
    onClose: () => void;
    onSelectScale: (scale: string) => void;
}

const scales = [
    { id: 'HAM-D', title: 'HAM-D', subtitle: 'Hamilton Depression Scale' },
    { id: 'MADRS', title: 'MADRS', subtitle: 'Montgomery-Åsberg Depression Scale' },
    { id: 'ASRS', title: 'ASRS', subtitle: 'ADHD Symptoms Scale' },
    { id: 'HAM-A', title: 'HAM-A', subtitle: 'Hamilton Anxiety Scale' },
    { id: 'ISI', title: 'ISI', subtitle: 'Insomnia Severity Scale' },
    { id: 'CARS-2', title: 'CARS-2', subtitle: 'Childhood Autism Rating Scale' },
];

const PsychiatricScalesModal = ({ visible, onClose, onSelectScale }: PsychiatricScalesModalProps) => {
    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Select scale</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                            <Feather name="x" size={24} color="#64748B" />
                        </TouchableOpacity>
                    </View>

                    {/* Scales Grid */}
                    <ScrollView contentContainerStyle={styles.gridContainer}>
                        {scales.map((scale, index) => {
                            const isLeft = index % 2 === 0;
                            return (
                                <TouchableOpacity
                                    key={scale.id}
                                    style={[
                                        styles.scaleCard,
                                        isLeft ? styles.scaleCardLeft : styles.scaleCardRight,
                                    ]}
                                    onPress={() => onSelectScale(scale.id)}
                                    activeOpacity={0.7}
                                >
                                    <Text style={styles.scaleTitle}>{scale.title}</Text>
                                    <Text style={styles.scaleSubtitle}>{scale.subtitle}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: wp(4),
    },
    modalContainer: {
        backgroundColor: '#fff',
        borderRadius: 12,
        width: '100%',
        maxHeight: hp(70),
        paddingBottom: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        paddingBottom: 16,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1E293B',
    },
    closeBtn: {
        padding: 4,
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 16,
    },
    scaleCard: {
        width: '48%',
        borderWidth: 1.5,
        borderColor: '#58A7B3',
        borderRadius: 10,
        paddingVertical: hp(3),
        paddingHorizontal: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 14,
    },
    scaleCardLeft: {
        marginRight: '4%',
    },
    scaleCardRight: {},
    scaleTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#58A7B3',
        marginBottom: 6,
    },
    scaleSubtitle: {
        fontSize: 14,
        color: '#64748B',
        textAlign: 'center',
    },
});

export default PsychiatricScalesModal;
