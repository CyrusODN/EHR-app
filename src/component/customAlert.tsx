import React, {useEffect, useRef, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Platform,
  Dimensions,
} from 'react-native';
import {
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';

interface CustomAlertProps {
  visible: boolean;
  type?: 'success' | 'warning' | 'error';
  message: string;
  onClose: () => void;
  duration?: number;
}

const TOAST_DURATION = 3500;
const {width: SCREEN_WIDTH} = Dimensions.get('window');

const getConfig = (type: string) => {
  switch (type) {
    case 'success':
      return {
        icon: 'check-circle',
        color: '#10B981',
        bgColor: '#ECFDF5',
        borderColor: '#10B981',
        title: 'Success',
      };
    case 'warning':
      return {
        icon: 'alert-triangle',
        color: '#F59E0B',
        bgColor: '#FFFBEB',
        borderColor: '#F59E0B',
        title: 'Warning',
      };
    case 'error':
    default:
      return {
        icon: 'alert-circle',
        color: '#EF4444',
        bgColor: '#FEF2F2',
        borderColor: '#EF4444',
        title: 'Error',
      };
  }
};

const CustomAlert: React.FC<CustomAlertProps> = ({
  visible,
  type = 'error',
  message,
  onClose,
  duration = TOAST_DURATION,
}) => {
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(-150)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const progress = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<any>(null);
  const isShowing = useRef(false);

  const config = getConfig(type);

  const hideToast = useCallback(() => {
    if (!isShowing.current) return;
    isShowing.current = false;

    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -150,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (onClose) onClose();
    });
  }, [onClose, translateY, opacity]);

  const showToast = useCallback(() => {
    isShowing.current = true;
    progress.setValue(0);

    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        damping: 18,
        stiffness: 120,
        mass: 0.8,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // Progress bar animation
    Animated.timing(progress, {
      toValue: 1,
      duration: duration,
      useNativeDriver: false,
    }).start();

    // Auto dismiss
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(hideToast, duration);
  }, [translateY, opacity, progress, duration, hideToast]);

  useEffect(() => {
    if (visible) {
      showToast();
    } else if (isShowing.current) {
      hideToast();
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [visible, showToast, hideToast]);

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['100%', '0%'],
  });

  return (
    <Animated.View
      pointerEvents={visible ? 'auto' : 'none'}
      style={[
        styles.container,
        {
          top: insets.top + 8,
          transform: [{translateY}],
          opacity,
        },
      ]}>
      <View style={[styles.toast, {backgroundColor: config.bgColor}]}>
        {/* Colored accent bar on left */}
        <View style={[styles.accentBar, {backgroundColor: config.color}]} />

        {/* Icon */}
        <View style={[styles.iconContainer, {backgroundColor: config.color + '18'}]}>
          <Feather name={config.icon} size={20} color={config.color} />
        </View>

        {/* Content */}
        <View style={styles.contentContainer}>
          <Text style={[styles.title, {color: config.color}]}>
            {config.title}
          </Text>
          <Text style={styles.message} numberOfLines={3}>
            {message}
          </Text>
        </View>

        {/* Close button */}
        <TouchableOpacity
          onPress={hideToast}
          style={styles.closeButton}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
          <Feather name="x" size={16} color="#9CA3AF" />
        </TouchableOpacity>

        {/* Progress bar */}
        <Animated.View
          style={[
            styles.progressBar,
            {
              backgroundColor: config.color,
              width: progressWidth,
            },
          ]}
        />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 9999,
    elevation: 9999,
    alignItems: 'center',
    paddingHorizontal: wp(4),
  },
  toast: {
    width: '100%',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
    paddingLeft: 18,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 6},
        shadowOpacity: 0.12,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  accentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    borderTopLeftRadius: 14,
    borderBottomLeftRadius: 14,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  message: {
    fontSize: 13.5,
    color: '#374151',
    lineHeight: 18,
    fontWeight: '400',
  },
  closeButton: {
    padding: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.04)',
  },
  progressBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: 3,
    borderBottomLeftRadius: 14,
  },
});

export default CustomAlert;
