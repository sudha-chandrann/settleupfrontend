import { colortheme } from "./theme";

export const getInitials = (name:string) => {
  if (!name) return 'U';

  const parts = name.trim().split(' ');
  const firstInitial = parts[0]?.charAt(0).toUpperCase() || '';
  const lastInitial = parts[1]?.charAt(0).toUpperCase() || '';

  return (firstInitial +lastInitial) || firstInitial || 'U';
};

export const generateColorFromName = (name: string): string => {
  if (!name) return colortheme.primary.main;
  
  const colors = [
    colortheme.primary.main,
    colortheme.secondary.main,
    colortheme.status.success.main,
    colortheme.status.warning.main,
    '#8B5CF6', 
    '#EF4444', 
    '#10B981', 
    '#F59E0B', 
  ];
  
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
};

