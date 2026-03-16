import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    Animated,
    Dimensions,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface SelectDataModalProps {
    visible: boolean;
    onClose: () => void;
}

const SelectDataModal = ({ visible, onClose }: SelectDataModalProps) => {
    const [selectedItems, setSelectedItems] = useState<string[]>(['current']);
    const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
    
    useEffect(() => {
        if (visible) {
            Animated.spring(slideAnim, {
                toValue: 0,
                damping: 25,
                stiffness: 150,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(slideAnim, {
                toValue: SCREEN_HEIGHT,
                duration: 250,
                useNativeDriver: true,
            }).start();
        }
    }, [visible]);

    const toggleItem = (id: string) => {
        if (selectedItems.includes(id)) {
            setSelectedItems(selectedItems.filter(item => item !== id));
        } else {
            setSelectedItems([...selectedItems, id]);
        }
    };

    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <TouchableOpacity 
                    style={styles.dismissArea} 
                    activeOpacity={1} 
                    onPress={onClose} 
                />
                <Animated.View 
                    style={[
                        styles.modalContainer, 
                        { transform: [{ translateY: slideAnim }] }
                    ]}
                >
                    <View style={styles.header}>
                        <Text style={styles.title}>Select data for analysis</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                            <Feather name="x" size={24} color="#64748B" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.content}>
                        <Text style={styles.sectionTitle}>Current visit</Text>
                        
                        <TouchableOpacity 
                            style={styles.selectionCard}
                            onPress={() => toggleItem('current')}
                            activeOpacity={0.7}
                        >
                            <View style={[
                                styles.checkbox, 
                                selectedItems.includes('current') && styles.checkboxActive
                            ]}>
                                {selectedItems.includes('current') && (
                                    <Feather name="check" size={14} color="#fff" />
                                )}
                            </View>
                            <View style={styles.cardInfo}>
                                <Text style={styles.cardTitle}>Current visit interview</Text>
                                <Text style={styles.cardSubtitle}>
                                    Analysis of current visit data, including scales and observations
                                </Text>
                            </View>
                        </TouchableOpacity>

                        <Text style={styles.sectionTitle}>Previous visits</Text>
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyStateText}>No previous visits to display</Text>
                        </View>

                        <TouchableOpacity 
                            style={styles.analysisButton}
                            onPress={() => {
                                // Action for performing analysis
                                onClose();
                            }}
                        >
                            <Feather name="bar-chart-2" size={20} color="#fff" />
                            <Text style={styles.analysisButtonText}>Perform Analysis</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'flex-end',
    },
    dismissArea: {
        flex: 1,
    },
    modalContainer: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        minHeight: hp(50),
        paddingBottom: hp(4),
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1E293B',
    },
    closeBtn: {
        padding: 4,
    },
    content: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748B',
        marginBottom: 12,
        marginTop: 10,
    },
    selectionCard: {
        flexDirection: 'row',
        padding: 16,
        borderRadius: 12,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        alignItems: 'center',
        marginBottom: 20,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: '#CBD5E1',
        marginRight: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxActive: {
        borderColor: '#58A7B3',
        backgroundColor: '#58A7B3',
    },
    cardInfo: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1E293B',
        marginBottom: 4,
    },
    cardSubtitle: {
        fontSize: 14,
        color: '#64748B',
        lineHeight: 20,
    },
    emptyState: {
        paddingVertical: 30,
        alignItems: 'center',
    },
    emptyStateText: {
        fontSize: 16,
        color: '#94A3B8',
        fontWeight: '500',
    },
    analysisButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#58A7B3',
        marginTop: 20,
        paddingVertical: 14,
        borderRadius: 12,
        shadowColor: '#58A7B3',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 4,
    },
    analysisButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
        marginLeft: 10,
    },
});

export default SelectDataModal;
