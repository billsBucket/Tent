import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, Animated, StyleSheet, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();
  const translateX = useRef(new Animated.Value(isDark ? 28 : 0)).current;

  useEffect(() => {
    Animated.spring(translateX, {
      toValue: isDark ? 28 : 0,
      useNativeDriver: true,
      bounciness: 8,
    }).start();
  }, [isDark]);

  return (
    <TouchableOpacity
      onPress={toggleTheme}
      style={[
        styles.container,
        { backgroundColor: isDark ? '#404040' : '#e4e4e7' }
      ]}
      activeOpacity={0.8}
    >
      <Animated.View
        style={[
          styles.handle,
          {
            backgroundColor: isDark ? '#ffffff' : '#000000',
            transform: [{ translateX }],
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
  },
  handle: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
});
