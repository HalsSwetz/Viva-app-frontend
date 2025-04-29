import React from 'react';
import { BaseToast, ErrorToast } from 'react-native-toast-message';

export const toastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: '#2ecc71', // Soft green
        backgroundColor: '#1a1a1a',
        borderRadius: 8,
        borderLeftWidth: 6,
        padding: 12,
      }}
      contentContainerStyle={{ paddingHorizontal: 12 }}
      text1Style={{
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
      }}
      text2Style={{
        color: '#aaa',
        fontSize: 14,
      }}
    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      style={{
        borderLeftColor: '#e74c3c', // Soft red
        backgroundColor: '#1a1a1a',
        borderRadius: 8,
        borderLeftWidth: 6,
        padding: 12,
      }}
      contentContainerStyle={{ paddingHorizontal: 12 }}
      text1Style={{
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
      }}
      text2Style={{
        color: '#aaa',
        fontSize: 14,
      }}
    />
  ),
  info: (props) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: '#3498db',
        backgroundColor: '#1a1a1a',
        borderRadius: 8,
        borderLeftWidth: 6,
        padding: 12,
      }}
      contentContainerStyle={{ paddingHorizontal: 12 }}
      text1Style={{
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
      }}
      text2Style={{
        color: '#aaa',
        fontSize: 14,
      }}
    />
  ),
};