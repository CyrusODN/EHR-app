import React, { useEffect, useMemo, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '../hooks/useThemeColors';

interface CustomCalendarModalProps {
    visible: boolean;
    value?: Date | null;
    onSelect: (date: Date) => void;
    onClose: () => void;
    title?: string;
}

const CustomCalendarModal = ({
    visible,
    value,
    onSelect,
    onClose,
    title,
}: CustomCalendarModalProps) => {
    const { t } = useTranslation();
    const { colors: tc, isDark } = useThemeColors();
    const ds = useMemo(() => createStyles(tc, isDark), [tc, isDark]);

    const [currentDate, setCurrentDate] = useState(value || new Date());
    const [selectedDate, setSelectedDate] = useState(value || new Date());

    const cellWidth = (wp(92) - 48) / 7;

    useEffect(() => {
        if (visible) {
            const initial = value || new Date();
            setCurrentDate(initial);
            setSelectedDate(initial);
        }
    }, [visible, value]);

    const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const monthNames = t('common.months', { returnObjects: true }) as string[];
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

    const days: Array<number | null> = [];
    const numDays = daysInMonth(year, month);
    const startDay = firstDayOfMonth(year, month);

    for (let i = 0; i < startDay; i++) days.push(null);
    for (let i = 1; i <= numDays; i++) days.push(i);

    const isSelected = (day: number) =>
        selectedDate &&
        selectedDate.getDate() === day &&
        selectedDate.getMonth() === month &&
        selectedDate.getFullYear() === year;

    const isToday = (day: number) => {
        const today = new Date();
        return today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
    };

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <View style={ds.modalOverlay}>
                <View style={ds.customCalendarContent}>
                    <View style={ds.customCalendarHeader}>
                        <Text style={ds.customCalendarTitle}>
                            {title || t('patientList.selectDate')}
                        </Text>
                        <TouchableOpacity onPress={onClose}>
                            <Feather name="x" size={24} color={isDark ? '#fff' : tc.textPrimary} />
                        </TouchableOpacity>
                    </View>

                    <View style={ds.monthYearNav}>
                        <Text style={ds.monthYearText}>
                            {monthNames[month]} {year}
                        </Text>
                        <View style={ds.navArrows}>
                            <TouchableOpacity onPress={prevMonth} style={ds.navArrow}>
                                <Feather name="chevron-left" size={24} color={tc.accent} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={nextMonth} style={ds.navArrow}>
                                <Feather name="chevron-right" size={24} color={isDark ? '#9CA3AF' : tc.textMuted} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={ds.weekdaysRow}>
                        {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day) => (
                            <Text key={day} style={[ds.weekdayText, { width: cellWidth }]}>
                                {day}
                            </Text>
                        ))}
                    </View>

                    <View style={ds.daysGrid}>
                        {days.map((day, idx) => (
                            <TouchableOpacity
                                key={idx}
                                style={[
                                    ds.dayCell,
                                    { width: cellWidth },
                                    day && isSelected(day) && ds.selectedDayCell,
                                ]}
                                disabled={!day}
                                onPress={() => day && setSelectedDate(new Date(year, month, day))}
                            >
                                {day ? (
                                    <Text
                                        style={[
                                            ds.dayText,
                                            isSelected(day) && ds.selectedDayText,
                                            !isSelected(day) && isToday(day) && { color: tc.accent },
                                        ]}
                                    >
                                        {day}
                                    </Text>
                                ) : null}
                            </TouchableOpacity>
                        ))}
                    </View>

                    <TouchableOpacity
                        style={ds.calendarConfirmBtn}
                        onPress={() => onSelect(selectedDate)}
                    >
                        <Text style={ds.calendarConfirmBtnText}>
                            {t('common.confirm') || 'Confirm'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const createStyles = (tc: any, isDark: boolean) =>
    StyleSheet.create({
        modalOverlay: {
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            justifyContent: 'center',
            alignItems: 'center',
        },
        customCalendarContent: {
            width: wp(92),
            backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF',
            borderRadius: 24,
            padding: 24,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.3,
            shadowRadius: 20,
            elevation: 10,
        },
        customCalendarHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
        },
        customCalendarTitle: {
            fontSize: 18,
            fontWeight: '700',
            color: isDark ? '#FFFFFF' : tc.textPrimary,
        },
        monthYearNav: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 24,
        },
        monthYearText: {
            fontSize: 18,
            fontWeight: '600',
            color: isDark ? '#FFFFFF' : tc.textPrimary,
        },
        navArrows: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        navArrow: {
            marginLeft: 15,
        },
        weekdaysRow: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginBottom: 16,
        },
        weekdayText: {
            fontSize: 12,
            fontWeight: '600',
            color: isDark ? '#6B7280' : tc.textMuted,
            textAlign: 'center',
        },
        daysGrid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'flex-start',
            marginBottom: 24,
        },
        dayCell: {
            height: 40,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 4,
            borderRadius: 20,
        },
        selectedDayCell: {
            backgroundColor: tc.accent || '#3B82F6',
        },
        dayText: {
            fontSize: 16,
            color: isDark ? '#FFFFFF' : tc.textPrimary,
            fontWeight: '500',
        },
        selectedDayText: {
            color: '#FFFFFF',
            fontWeight: '700',
        },
        calendarConfirmBtn: {
            backgroundColor: tc.accent || '#4DA1C0',
            borderRadius: 16,
            height: 54,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 10,
        },
        calendarConfirmBtnText: {
            fontSize: 16,
            fontWeight: '700',
            color: '#FFFFFF',
        },
    });

export default CustomCalendarModal;
