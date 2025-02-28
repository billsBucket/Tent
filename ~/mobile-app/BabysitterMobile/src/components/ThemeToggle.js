import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, Animated, StyleSheet, View, Platform } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export const ThemeToggle = () => {
  const { isDark, toggleTheme, colors } = useTheme();
  const translateX = useRef(new Animated.Value(isDark ? 28 : 0)).current;

  useEffect(() => {
    Animated.spring(translateX, {
      toValue: isDark ? 28 : 0,
      useNativeDriver: true,
      bounciness: Platform.OS === 'ios' ? 4 : 8, // Less bouncy on iOS
      speed: Platform.OS === 'ios' ? 12 : 8,
    }).start();
  }, [isDark]);

  return (
    <TouchableOpacity
      onPress={toggleTheme}
      style={[
        styles.container,
        { 
          backgroundColor: isDark ? colors.iosSystemGray : colors.secondary,
          ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
            },
            android: {
              elevation: 2,
            },
          }),
        }
      ]}
      activeOpacity={0.8}
    >
      <Animated.View
        style={[
          styles.handle,
          {
            backgroundColor: isDark ? colors.background : colors.text,
            transform: [{ translateX }],
            ...Platform.select({
              ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.15,
                shadowRadius: 2,
              },
              android: {
                elevation: 4,
              },
            }),
          },
        ]}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 56,
    height: 28,
    borderRadius: 14,
    padding: 2,
    marginRight: Platform.OS === 'ios' ? 16 : 8,
  },
  handle: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
});