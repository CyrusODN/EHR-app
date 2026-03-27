import useThemeStore from '../store/themeStore';
import { LightTheme } from '../constants/colors/lightTheme';
import { DarkTheme } from '../constants/colors/darkTheme';

/**
 * Custom hook that returns the current theme colors based on
 * the Zustand theme store (persisted via AsyncStorage).
 *
 * Also exposes `isDark` boolean and the `theme` / `toggleTheme` / `setTheme`
 * helpers so consumers don't need to import useThemeStore separately.
 */
export const useThemeColors = () => {
    const { theme, toggleTheme, setTheme } = useThemeStore();
    const isDark = theme === 'dark';
    const colors = isDark ? DarkTheme.colors : LightTheme.colors;

    // Semantic aliases — these map material-design-style tokens
    // to concrete UI roles used across the app's screens.
    const semanticColors = {
        // Core
        ...colors,

        // Backgrounds
        screenBackground: isDark ? '#0D0D0D' : '#F3F6F8',
        cardBackground: isDark ? 'rgba(250, 250, 250, 0.05)' : '#FFFFFF',
        cardBackgroundAlt: isDark ? 'rgba(250,250,250,0.03)' : '#FAFBFC',
        inputBackground: isDark ? 'rgba(255,255,255,0.05)' : '#FFFFFF',
        modalBackground: isDark ? 'rgba(250,250,250,0.05)' : '#FFFFFF',
        // Solid opaque backgrounds for Drawer/Modals
        drawerBg: isDark ? '#141414' : '#FFFFFF',
        modalBg: isDark ? '#1A1A1A' : '#FFFFFF',

        // Text
        textPrimary: isDark ? '#FAFAFA' : '#1F2937',
        textSecondary: isDark ? '#A6A6A6' : '#6B7280',
        textMuted: isDark ? 'rgba(166,166,166,0.6)' : '#9CA3AF',
        textOnPrimary: '#FFFFFF',

        // Borders
        borderColor: isDark ? 'rgba(255,255,255,0.10)' : '#E8EDF2',
        borderLight: isDark ? 'rgba(255,255,255,0.08)' : '#F3F4F6',
        divider: isDark ? 'rgba(255,255,255,0.08)' : '#F0F2F5',

        // Buttons / interactive
        buttonOutlineBg: isDark ? 'rgba(250,250,250,0.05)' : '#FFFFFF',
        buttonOutlineBorder: isDark ? 'rgba(255,255,255,0.20)' : '#E0EBF0',
        buttonMutedBg: isDark ? 'rgba(250,250,250,0.03)' : '#F3F4F6',

        // Accent colors
        accent: isDark ? '#46B7C6' : '#4A90B9',
        accentLight: isDark ? 'rgba(70,183,198,0.15)' : '#EBF5FA',
        accentGreen: '#68BFB3',
        accentRed: '#FF6B6B',

        // Accent gradient helpers (for LinearGradient usage)
        accentGradientStart: isDark ? '#3D97C5' : '#4A90B9',
        accentGradientEnd: isDark ? '#35ABC7' : '#68BFB3',

        // Specific UI elements
        searchBarBg: isDark ? 'rgba(255,255,255,0.05)' : '#FFFFFF',
        searchBarBorder: isDark ? 'rgba(255,255,255,0.10)' : '#E8EDF2',
        calendarDayText: isDark ? '#FAFAFA' : '#374151',
        calendarOtherMonth: isDark ? 'rgba(166,166,166,0.6)' : '#D1D5DB',
        todayBg: isDark ? 'rgba(70,183,198,0.15)' : '#F0F7FA',

        // Status bar
        statusBarStyle: isDark ? 'light-content' : 'dark-content' as 'light-content' | 'dark-content',
        statusBarBg: isDark ? '#0D0D0D' : '#FFFFFF',

        // Header
        headerBg: isDark ? '#0D0D0D' : '#FFFFFF',

        // Shadow override for dark mode (neon cyan glow)
        shadow: isDark ? '#46B7C6' : '#000000',
        shadowOpacity: isDark ? 0.15 : undefined as number | undefined,

        // Chips / badges
        chipBg: isDark ? 'rgba(70,183,198,0.15)' : '#EBF5FA',
        chipText: isDark ? '#46B7C6' : '#4A90B9',

        // Empty / loading states
        emptyBg: isDark ? 'rgba(250,250,250,0.05)' : '#FFFFFF',
        emptyIcon: isDark ? 'rgba(166,166,166,0.6)' : '#D1D5DB',

        // Status colors
        success: '#10B981',
        error: '#EF4444',
        warning: '#F59E0B',

        // Hover / pressed state layer
        hoverLayer: isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.04)',
    };

    return {
        colors: semanticColors,
        isDark,
        theme,
        toggleTheme,
        setTheme,
    };
};

export type ThemeColors = ReturnType<typeof useThemeColors>['colors'];
