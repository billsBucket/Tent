import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

export const Badge = ({ children, variant = 'primary' }) => {
  const { colors } = useTheme();

  const getBadgeColor = () => {
    switch (variant) {
      case 'error':
        return colors.destructive;
      case 'success':
        return '#4CAF50';
      default:
        return colors.primary;
    }
  };

  return (
    <View style={[styles.badge, { backgroundColor: getBadgeColor() }]}>
      <Text style={styles.text}>{children}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  text: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
