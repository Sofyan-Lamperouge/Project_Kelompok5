import React from 'react';
import { Ionicons } from '@expo/vector-icons';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

interface TabBarIconProps {
  active: IoniconName;
  inactive: IoniconName;
  focused: boolean;
  color: string;
  size: number;
}

/** Ikon tab: versi solid saat aktif, outline saat tidak aktif. */
export function TabBarIcon({ active, inactive, focused, color, size }: TabBarIconProps) {
  return <Ionicons name={focused ? active : inactive} size={size} color={color} />;
}
