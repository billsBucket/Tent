import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

export const Progress = ({ value = 0, indeterminate = false }) => {
  const { colors } = useTheme();
  const [width] = React.useState(new Animated.Value(0));

  React.useEffect(() => {
    if (indeterminate) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(width, {
            toValue: 100,
            duration: 1000,
            useNativeDriver: false,
          }),
          Animated.timing(width, {
            toValue: 0,
            duration: 0,
            useNativeDriver: false,
          }),
        ])
      ).start();
    } else {
      Animated.timing(width, {
        toValue: value,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [indeterminate, value, width]);

  return (
    <View style={[styles.container, { backgroundColor: colors.border }]}>
      <Animated.View
        style={[
          styles.bar,
          {
            backgroundColor: colors.primary,
            width: width.interpolate({
              inputRange: [0, 100],
              outputRange: ['0%', '100%'],
            }),
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
  },
});
