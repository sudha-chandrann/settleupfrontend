import { Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const baseWidth = 375;
const baseHeight = 812;

const scaleWidth = screenWidth / baseWidth;
const scaleHeight = screenHeight / baseHeight;
const scale = Math.min(scaleWidth, scaleHeight);

export const responsiveFontSize = (fontSize: number): number => {
  return Math.round(fontSize * scale);
};

export const responsiveSpacing = (size: number): number => {
  return Math.round(size * scale);
};

export const responsiveWidth = (value: number): number => {
  return Math.round(value * scaleWidth);
};

export const responsiveHeight = (value: number): number => {
  return Math.round(value * scaleHeight);
};

export const fontSize = {
  xs: responsiveFontSize(10),
  sm: responsiveFontSize(12),
  md: responsiveFontSize(16),
  lg: responsiveFontSize(20),
  xl: responsiveFontSize(24),
};

export const spacing = {
  xs: responsiveSpacing(4),
  sm: responsiveSpacing(8),
  md: responsiveSpacing(12),
  lg: responsiveSpacing(16),
  xl: responsiveSpacing(24),
};

export const size = {
  fullWidth: screenWidth,
  fullHeight: screenHeight,
  halfWidth: responsiveWidth(187.5),   
  halfHeight: responsiveHeight(406),    
};
