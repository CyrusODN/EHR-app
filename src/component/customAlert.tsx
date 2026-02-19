import React, { useEffect, useCallback } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Feather from 'react-native-vector-icons/Feather';

interface CustomAlertProps {
    visible: boolean;
    type?: 'success' | 'warning' | 'error';
    message: string;
    onClose: () => void;
}

const CustomAlert: React.FC<CustomAlertProps> = ({ visible, type = 'error', message, onClose }) => {
  
  const handleClose = useCallback(() => {
    if (onClose) {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    let timer: any;
    if (visible) {
      timer = setTimeout(handleClose, 3000); // 3 seconds is better than 0.3s for reading
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [visible, handleClose]);

  const getAlertColor = () => {
    switch (type) {
      case 'success':
        return '#4CAF50';
      case 'warning':
        return '#FFC107';
      case 'error':
      default:
        return '#FF4444';
    }
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={[styles.alertContainer, { borderLeftColor: getAlertColor() }]}>
          <View style={styles.contentContainer}>
            <Feather
              name={type === 'success' ? 'check-circle' : type === 'warning' ? 'alert-triangle' : 'x-circle'}
              size={24}
              color={getAlertColor()}
            />
            <Text style={styles.message}>{message}</Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Feather name="x" size={20} color="#666" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingTop: hp(5),
  },
  alertContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    width: wp(90),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderLeftWidth: 4,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  message: {
    marginLeft: 12,
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
});

export default CustomAlert;
