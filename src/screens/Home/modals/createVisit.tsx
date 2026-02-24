import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    ScrollView,
    Platform,
    Animated,
    Dimensions,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import DateTimePicker from '@react-native-community/datetimepicker';
import CustomTextInput from '../../../component/customTextInput';
import CustomDropdown from '../../../component/customDropDown';
import CustomCheckbox from '../../../component/customCheckBox';
import PrimaryButton from '../../../component/button';
import Gap from '../../../component/gap';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const CreateVisitModal = ({ visible, onClose }: { visible: boolean, onClose: () => void }) => {
    const navigation = useNavigation<any>();
    const insets = useSafeAreaInsets();
    const timeFromCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const timeToCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [isMounted, setIsMounted] = useState(false);
    const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
    const backdropOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            setIsMounted(true);
            Animated.parallel([
                Animated.spring(slideAnim, {
                    toValue: 0,
                    damping: 22,
                    stiffness: 120,
                    mass: 0.8,
                    useNativeDriver: true,
                }),
                Animated.timing(backdropOpacity, {
                    toValue: 1,
                    duration: 250,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: SCREEN_HEIGHT,
                    duration: 250,
                    useNativeDriver: true,
                }),
                Animated.timing(backdropOpacity, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start(() => {
                setIsMounted(false);
            });
        }
    }, [visible]);

    const initialTimeFrom = new Date();
    initialTimeFrom.setMinutes(0, 0, 0);
    const initialTimeTo = new Date();
    initialTimeTo.setHours(initialTimeTo.getHours() + 1, 0, 0, 0);

    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [timeFrom, setTimeFrom] = useState(initialTimeFrom);
    const [timeTo, setTimeTo] = useState(initialTimeTo);
    const [showTimeFromPicker, setShowTimeFromPicker] = useState(false);
    const [showTimeToPicker, setShowTimeToPicker] = useState(false);
    const [office, setOffice] = useState<string | null>(null);
    const [type, setType] = useState<string>('Private');
    const [specialization, setSpecialization] = useState<string | null>(null);
    const [notes, setNotes] = useState('');
    const [isEVisit, setIsEVisit] = useState(false);
    const [isPrescriptionOnly, setIsPrescriptionOnly] = useState(false);
    const [isReferral, setIsReferral] = useState(false);

    const officeOptions = [
        { label: 'Office 1', value: 'office1' },
        { label: 'Office 2', value: 'office2' },
        { label: 'Office 3', value: 'office3' },
    ];

    const typeOptions = [
        { label: 'Private', value: 'Private' },
        { label: 'Public', value: 'Public' },
        { label: 'Insurance', value: 'Insurance' },
    ];

    const specializationOptions = [
        { label: 'General', value: 'general' },
        { label: 'Cardiology', value: 'cardiology' },
        { label: 'Dermatology', value: 'dermatology' },
        { label: 'Neurology', value: 'neurology' },
        { label: 'Orthopedics', value: 'orthopedics' },
    ];


    const handleDateChange = (_event: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setDate(selectedDate);
        }
    };

    const handleTimeFromChange = (_event: any, selectedTime?: Date) => {
        if (selectedTime) {
            setTimeFrom(selectedTime);
            if (selectedTime >= timeTo) {
                const newEnd = new Date(selectedTime);
                newEnd.setMinutes(newEnd.getMinutes() + 30);
                setTimeTo(newEnd);
            }
        }
        // Debounce: close after 500ms of no further changes
        if (timeFromCloseTimer.current) clearTimeout(timeFromCloseTimer.current);
        timeFromCloseTimer.current = setTimeout(() => {
            setShowTimeFromPicker(false);
        }, 500);
    };

    const handleTimeToChange = (_event: any, selectedTime?: Date) => {
        if (selectedTime) {
            setTimeTo(selectedTime);
        }
        // Debounce: close after 500ms of no further changes
        if (timeToCloseTimer.current) clearTimeout(timeToCloseTimer.current);
        timeToCloseTimer.current = setTimeout(() => {
            setShowTimeToPicker(false);
        }, 500);
    };

    const formatDate = (d: Date) => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
    };

    const formatTime = (d: Date) => {
        let hours = d.getHours();
        const minutes = d.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        return { time: `${hours}:${minutes}`, ampm };
    };

    const getDateLabel = (d: Date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const compare = new Date(d);
        compare.setHours(0, 0, 0, 0);
        const diff = Math.round((compare.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        if (diff === 0) return 'Today';
        if (diff === 1) return 'Tomorrow';
        if (diff === -1) return 'Yesterday';
        return null;
    };

    const getDurationText = () => {
        const diffMs = timeTo.getTime() - timeFrom.getTime();
        if (diffMs <= 0) return null;
        const totalMinutes = Math.round(diffMs / 60000);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        if (hours > 0 && minutes > 0) return `${hours}h ${minutes}m`;
        if (hours > 0) return `${hours}h`;
        return `${minutes}m`;
    };

    const setQuickDate = (type: 'today' | 'tomorrow' | 'nextWeek') => {
        const d = new Date();
        if (type === 'tomorrow') d.setDate(d.getDate() + 1);
        if (type === 'nextWeek') d.setDate(d.getDate() + 7);
        setDate(d);
    };

    const handleClose = () => {
        onClose();
    };

    const handleSave = () => {
        console.log({
            date, timeFrom, timeTo, office, type,
            specialization, isEVisit, isPrescriptionOnly,
            isReferral, notes
        });
        handleClose();
    };

    const SectionHeader = ({ icon, title, iconColor = '#4A90B9' }: any) => (
        <View style={styles.sectionHeader}>
            <View style={[styles.sectionIconContainer, { backgroundColor: iconColor + '15' }]}>
                {icon}
            </View>
            <Text style={styles.sectionTitle}>{title}</Text>
        </View>
    );

    if (!isMounted) return null;

    return (
        <View style={[StyleSheet.absoluteFill, { zIndex: 999, elevation: 999 }]}>
            <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
                <TouchableWithoutFeedback onPress={handleClose}>
                    <View style={{ flex: 1 }} />
                </TouchableWithoutFeedback>
            </Animated.View>

            <Animated.View
                style={[
                    styles.modalContainer,
                    {
                        paddingBottom: insets.bottom + 10,
                        height: SCREEN_HEIGHT * 0.92,
                        transform: [{ translateY: slideAnim }],
                    },
                ]}
            >
                {/* Drag Handle */}
                <View style={styles.dragHandleContainer}>
                    <View style={styles.dragHandle} />
                </View>

                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <LinearGradient
                            colors={['#4A90B9', '#68BFB3']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.headerIconGradient}
                        >
                            <FontAwesome6 name="plus" size={14} color="white" />
                        </LinearGradient>
                        <View>
                            <Text style={styles.headerText}>Create New Visit</Text>
                            <Text style={styles.headerSubtext}>Fill in the visit details below</Text>
                        </View>
                    </View>
                    <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                        <Feather name="x" size={20} color="#9CA3AF" />
                    </TouchableOpacity>
                </View>

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    style={{ flex: 1 }}
                >
                    <ScrollView
                        style={styles.scrollView}
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        {/* Date & Time Section */}
                        <SectionHeader
                            icon={<MaterialCommunityIcons name="calendar-clock" size={16} color="#4A90B9" />}
                            title="Date & Time"
                        />
                        <View style={styles.card}>
                            {/* Quick Date Shortcuts */}
                            <View style={styles.quickDateRow}>
                                {(['today', 'tomorrow', 'nextWeek'] as const).map((q) => {
                                    const labels = { today: 'Today', tomorrow: 'Tomorrow', nextWeek: 'Next Week' };
                                    const isActive = getDateLabel(date) === labels[q] || (q === 'nextWeek' && (() => {
                                        const d = new Date();
                                        d.setDate(d.getDate() + 7);
                                        return date.toDateString() === d.toDateString();
                                    })());
                                    return (
                                        <TouchableOpacity
                                            key={q}
                                            style={[styles.quickDateBtn, isActive && styles.quickDateBtnActive]}
                                            onPress={() => setQuickDate(q)}
                                        >
                                            <Text style={[styles.quickDateText, isActive && styles.quickDateTextActive]}>
                                                {labels[q]}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>

                            {/* Date Picker */}
                            <Text style={styles.label}>Date</Text>
                            <TouchableOpacity
                                style={styles.datePickerButton}
                                onPress={() => setShowDatePicker(!showDatePicker)}
                            >
                                <View style={styles.datePickerContent}>
                                    <View style={styles.dateIconContainer}>
                                        <MaterialCommunityIcons name="calendar-month" size={18} color="#4A90B9" />
                                    </View>
                                    <View>
                                        <Text style={styles.dateText}>{formatDate(date)}</Text>
                                        {getDateLabel(date) && (
                                            <Text style={styles.dateLabelText}>{getDateLabel(date)}</Text>
                                        )}
                                    </View>
                                </View>
                                <Feather
                                    name={showDatePicker ? 'chevron-up' : 'chevron-down'}
                                    size={16}
                                    color="#9CA3AF"
                                />
                            </TouchableOpacity>
                            {showDatePicker && (
                                <View style={styles.inlinePicker}>
                                    <DateTimePicker
                                        value={date}
                                        mode="date"
                                        display={Platform.OS === 'ios' ? 'inline' : 'default'}
                                        onChange={handleDateChange}
                                        minimumDate={new Date()}
                                        style={{ alignSelf: 'center' }}
                                    />
                                </View>
                            )}

                            <Gap height={16} />

                            {/* Time Selection */}
                            <Text style={styles.label}>Time</Text>
                            <View style={styles.timeSection}>
                                {/* From Time */}
                                <TouchableOpacity
                                    style={[styles.timeCard, showTimeFromPicker && styles.timeCardActive]}
                                    onPress={() => {
                                        setShowTimeFromPicker(!showTimeFromPicker);
                                        setShowTimeToPicker(false);
                                    }}
                                >
                                    <Text style={styles.timeCardLabel}>FROM</Text>
                                    <View style={styles.timeDisplay}>
                                        <Text style={styles.timeValue}>{formatTime(timeFrom).time}</Text>
                                        <Text style={styles.timeAmPm}>{formatTime(timeFrom).ampm}</Text>
                                    </View>
                                    <Feather name="clock" size={14} color="#9CA3AF" />
                                </TouchableOpacity>

                                {/* Duration Indicator */}
                                <View style={styles.durationContainer}>
                                    <View style={styles.durationLine} />
                                    <View style={styles.durationBadge}>
                                        <Text style={styles.durationText}>
                                            {getDurationText() || '--'}
                                        </Text>
                                    </View>
                                    <View style={styles.durationLine} />
                                </View>

                                {/* To Time */}
                                <TouchableOpacity
                                    style={[styles.timeCard, showTimeToPicker && styles.timeCardActive]}
                                    onPress={() => {
                                        setShowTimeToPicker(!showTimeToPicker);
                                        setShowTimeFromPicker(false);
                                    }}
                                >
                                    <Text style={styles.timeCardLabel}>TO</Text>
                                    <View style={styles.timeDisplay}>
                                        <Text style={styles.timeValue}>{formatTime(timeTo).time}</Text>
                                        <Text style={styles.timeAmPm}>{formatTime(timeTo).ampm}</Text>
                                    </View>
                                    <Feather name="clock" size={14} color="#9CA3AF" />
                                </TouchableOpacity>
                            </View>

                            {/* Time Pickers */}
                            {showTimeFromPicker && (
                                <View style={styles.inlinePicker}>
                                    <DateTimePicker
                                        value={timeFrom}
                                        mode="time"
                                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                        onChange={handleTimeFromChange}
                                        minuteInterval={5}
                                        style={{ alignSelf: 'center' }}
                                    />
                                </View>
                            )}
                            {showTimeToPicker && (
                                <View style={styles.inlinePicker}>
                                    <DateTimePicker
                                        value={timeTo}
                                        mode="time"
                                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                        onChange={handleTimeToChange}
                                        minuteInterval={5}
                                        style={{ alignSelf: 'center' }}
                                    />
                                </View>
                            )}
                        </View>

                        {/* Patient Section */}
                        <SectionHeader
                            icon={<Feather name="user" size={16} color="#4A90B9" />}
                            title="Patient"
                        />
                        <View style={styles.card}>
                            <CustomTextInput
                                multiline
                                placeholder="Search patient (min. 3 characters)..."
                                icon={<Feather name="search" color="#9CA3AF" size={16} />}
                                value={''} onChangeText={() => {}} right={undefined} onRightPress={undefined} keyboardType={undefined} />
                            <Gap height={12} />
                            <PrimaryButton
                                label="New Patient"
                                filled={false}
                                icon={<Feather name="user-plus" size={14} color="#4A90B9" />}
                                onPress={() => {
                                    handleClose();
                                    navigation.navigate('New-Patient');
                                }}
                                style={{ width: "100%" }} image={undefined} iconStyle={undefined} imageStyle={undefined} loading={false} disabled={false}
                            />
                        </View>

                        {/* Visit Details Section */}
                        <SectionHeader
                            icon={<MaterialCommunityIcons name="clipboard-text-outline" size={16} color="#4A90B9" />}
                            title="Visit Details"
                        />
                        <View style={styles.card}>
                            <Text style={styles.label}>Office</Text>
                            <CustomDropdown
                                placeholder="Select office"
                                options={officeOptions}
                                value={office}
                                onChange={(v: any) => setOffice(v)}
                                icon={<MaterialCommunityIcons name="office-building-outline" size={18} color="#4A90B9" />}
                            />
                            <Gap height={14} />
                            <Text style={styles.label}>Type</Text>
                            <CustomDropdown
                                placeholder="Select type"
                                options={typeOptions}
                                value={type}
                                onChange={(v: any) => setType(v)}
                                icon={<MaterialCommunityIcons name="tag-outline" size={18} color="#4A90B9" />}
                            />
                            <Gap height={14} />
                            <Text style={styles.label}>Specialization</Text>
                            <CustomDropdown
                                placeholder="Select specialization"
                                options={specializationOptions}
                                value={specialization}
                                onChange={(v: any) => setSpecialization(v)}
                                icon={<FontAwesome name="stethoscope" size={16} color="#4A90B9" />}
                            />
                        </View>

                        {/* Options Section */}
                        <SectionHeader
                            icon={<Feather name="settings" size={16} color="#4A90B9" />}
                            title="Options"
                        />
                        <View style={styles.card}>
                            <View style={styles.checkboxRow}>
                                <CustomCheckbox
                                    label="E-visit"
                                    checked={isEVisit}
                                    onChange={setIsEVisit}
                                />
                            </View>
                            <View style={styles.checkboxRow}>
                                <CustomCheckbox
                                    label="Prescription only"
                                    checked={isPrescriptionOnly}
                                    onChange={setIsPrescriptionOnly}
                                />
                            </View>
                            <View style={styles.checkboxRow}>
                                <CustomCheckbox
                                    label="Referral"
                                    checked={isReferral}
                                    onChange={setIsReferral}
                                />
                            </View>
                        </View>

                        {/* Notes Section */}
                        <SectionHeader
                            icon={<Feather name="edit-3" size={16} color="#4A90B9" />}
                            title="Notes"
                        />
                        <View style={styles.card}>
                            <CustomTextInput
                                placeholder="Additional notes..."
                                value={notes}
                                onChangeText={setNotes}
                                multiline={true}
                                numberOfLines={4} icon={undefined} right={undefined} onRightPress={undefined} keyboardType={undefined} />
                        </View>

                        <Gap height={1} />
                    </ScrollView>
                </KeyboardAvoidingView>

                {/* Bottom Action Buttons */}
                <View style={styles.bottomActions}>
                    <TouchableOpacity onPress={handleClose} style={styles.cancelBtn}>
                        <Text style={styles.cancelBtnText}>Cancel</Text>
                    </TouchableOpacity>
                    <View style={styles.primaryActions}>
                        <PrimaryButton
                            label="Save"
                            filled={false}
                            icon={<FontAwesome name="save" size={14} color='#4A90B9' />}
                            onPress={handleSave}
                            style={{ flex: 1, marginRight: 8 }} image={undefined} iconStyle={undefined} imageStyle={undefined}
                            loading={false}
                            disabled={false}
                        />
                        <PrimaryButton
                            label="Save & Start"
                            filled={true}
                            icon={<Ionicons name="arrow-forward" size={14} color="white" />}
                            onPress={handleSave}
                            style={{ flex: 1 }} image={undefined} iconStyle={undefined} imageStyle={undefined}
                            loading={false}
                            disabled={false}
                        />
                    </View>
                </View>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
    },
    modalContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#F8FAFB',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
    },
    dragHandleContainer: {
        alignItems: 'center',
        paddingTop: 10,
        paddingBottom: 4,
    },
    dragHandle: {
        width: 36,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#D1D5DB',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#EEF2F5',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerIconGradient: {
        width: 34,
        height: 34,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    headerText: {
        fontSize: 17,
        fontWeight: '700',
        color: '#1F2937',
    },
    headerSubtext: {
        fontSize: 12,
        color: '#9CA3AF',
        marginTop: 1,
    },
    closeButton: {
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 40,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        marginTop: 6,
    },
    sectionIconContainer: {
        width: 28,
        height: 28,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B7280',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 14,
        padding: 16,
        marginBottom: 16,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 8,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    label: {
        fontSize: 13,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 6,
    },
    datePickerButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        padding: 12,
        backgroundColor: '#FAFBFC',
    },
    datePickerContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dateIconContainer: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: '#EBF5FA',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    dateText: {
        fontSize: 14,
        color: '#1F2937',
        fontWeight: '600',
    },
    dateLabelText: {
        fontSize: 11,
        color: '#4A90B9',
        fontWeight: '600',
        marginTop: 1,
    },
    quickDateRow: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 14,
    },
    quickDateBtn: {
        flex: 1,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
    },
    quickDateBtnActive: {
        backgroundColor: '#EBF5FA',
        borderWidth: 1,
        borderColor: '#4A90B9',
    },
    quickDateText: {
        fontSize: 12,
        fontWeight: '500',
        color: '#6B7280',
    },
    quickDateTextActive: {
        color: '#4A90B9',
        fontWeight: '700',
    },
    inlinePicker: {
        marginTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        paddingTop: 8,
    },
    timeSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    timeCard: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 10,
        paddingVertical: 8,
        paddingHorizontal: 10,
        backgroundColor: '#FAFBFC',
        alignItems: 'center',
    },
    timeCardActive: {
        borderColor: '#4A90B9',
        backgroundColor: '#F0F7FA',
    },
    timeCardLabel: {
        fontSize: 9,
        fontWeight: '700',
        color: '#9CA3AF',
        letterSpacing: 1,
        marginBottom: 2,
    },
    timeDisplay: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginBottom: 2,
    },
    timeValue: {
        fontSize: 17,
        fontWeight: '800',
        color: '#1F2937',
    },
    timeAmPm: {
        fontSize: 10,
        fontWeight: '600',
        color: '#6B7280',
        marginLeft: 2,
    },
    durationContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 6,
        width: 52,
    },
    durationLine: {
        width: 1,
        height: 8,
        backgroundColor: '#D1D5DB',
    },
    durationBadge: {
        backgroundColor: '#EBF5FA',
        borderRadius: 10,
        paddingHorizontal: 6,
        paddingVertical: 3,
    },
    durationText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#4A90B9',
    },
    timeColumn: {
        flex: 1,
    },
    checkboxRow: {
        paddingVertical: 2,
    },
    bottomActions: {
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 6,
        borderTopWidth: 1,
        borderTopColor: '#EEF2F5',
        backgroundColor: 'white',
    },
    primaryActions: {
        flexDirection: 'row',
        marginBottom: 6,
    },
    cancelBtn: {
        alignItems: 'center',
        paddingVertical: 10,
        marginBottom: 4,
    },
    cancelBtnText: {
        fontSize: 14,
        color: '#9CA3AF',
        fontWeight: '500',
    },
});

export default CreateVisitModal;