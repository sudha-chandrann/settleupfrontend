import React from 'react';
import { View, StyleSheet, TouchableOpacity, Animated, Text } from 'react-native';
import { X, WarningCircleIcon, InfoIcon, WarningIcon, CheckCircleIcon } from 'phosphor-react-native';
import { ErrorType } from '@/utils/type';
import { colortheme } from '@/utils/theme';
import { responsiveFontSize, responsiveSpacing } from '@/utils/style';


interface ToastMessageProps {
  message: string;
  type?: ErrorType;
  visible: boolean;
  onClose: () => void;
  title?: string;
  autoHide?: boolean;
  autoHideDuration?: number;
}

const ToastMessage: React.FC<ToastMessageProps> = ({
  message,
  type = 'error',
  visible,
  onClose,
  title,
  autoHide = false,
  autoHideDuration = 5000,
}) => {
  const [fadeAnim] = React.useState(new Animated.Value(0));
  const [slideAnim] = React.useState(new Animated.Value(-100));

  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      if (autoHide) {
        const timer = setTimeout(() => {
          hideToastMessage();
        }, autoHideDuration);

        return () => clearTimeout(timer);
      }
    } else {
      hideToastMessage();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, autoHide, autoHideDuration]);

  const hideToastMessage = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  const getIconAndColors = () => {
    switch (type) {
      case 'error':
        return {
          icon: <WarningCircleIcon size={responsiveFontSize(20)} color={colortheme.status.error.main} weight="bold" />,
          backgroundColor: colortheme.status.error.background,
          borderColor: colortheme.status.error.text,
        };
      case 'warning':
        return {
          icon: <WarningIcon size={responsiveFontSize(20)} color={colortheme.status.warning.main} weight="bold" />,
          backgroundColor: colortheme.status.warning.background,
          borderColor: colortheme.status.warning.text,
        };
      case 'success':
        return {
          icon: <CheckCircleIcon size={responsiveFontSize(20)} color={colortheme.status.success.main} weight="bold" />,
          backgroundColor: colortheme.status.success.background,
          borderColor: colortheme.status.success.text,
        };
      case 'info':
        return {
          icon: <InfoIcon size={responsiveFontSize(20)} color={'white'} weight="bold" />,
          backgroundColor: colortheme.primary.light,
          borderColor: colortheme.primary.dark,
        };
      default:
        return {
          icon: <InfoIcon size={responsiveFontSize(20)} color={'white'} weight="bold" />,
          backgroundColor: colortheme.primary.light,
          borderColor: colortheme.primary.light,
        };
    }
  };

  const { icon, backgroundColor, borderColor } = getIconAndColors();

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
          backgroundColor,
          borderColor,
        },
      ]}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          {icon}
        </View>
        
        <View style={styles.textContainer}>
          {title && (
            <Text 
              style={styles.title}
            >
              {title}
            </Text>
          )}
          <Text 
            style={styles.message}
          >
            {message}
          </Text>
        </View>

        <TouchableOpacity 
          style={styles.closeButton} 
          onPress={hideToastMessage}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <X size={18} color={'white'} weight="bold" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

export default ToastMessage;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: responsiveSpacing(10),
    left: responsiveSpacing(20),
    right: responsiveSpacing(20),
    zIndex: 1000,
    borderRadius: 12,
    borderWidth: 1,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: responsiveSpacing(15),
  },
  iconContainer: {
    marginRight:responsiveSpacing(12),
    marginTop: 2,
  },
  textContainer: {
    flex: 1,
    gap: responsiveSpacing(5),
  },
  title: {
    // lineHeight: 18,
    fontSize:responsiveFontSize(12),
    color:colortheme.text.primary
  },
  message: {
    lineHeight: 16,
    opacity: 0.95,
    fontSize:responsiveFontSize(10),
    color:colortheme.text.primary

  },
  closeButton: {
    marginLeft: responsiveSpacing(10),
    marginTop: 1,
    padding: 2,
  },
});