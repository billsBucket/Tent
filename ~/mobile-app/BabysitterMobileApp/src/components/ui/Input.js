import React from 'react';
import { TextInput, StyleSheet, Platform } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

export const Input = ({
  style,
  placeholder,
  placeholderTextColor,
  ...props
}) => {
  const { colors } = useTheme();

  return (
    <TextInput
      style={[
        styles.input,
        {
          backgroundColor: colors.background,
          color: colors.text,
          borderColor: colors.border,
        },
        style,
      ]}
      placeholder={placeholder}
      placeholderTextColor={placeholderTextColor || colors.placeholder}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 16,
  },
});
