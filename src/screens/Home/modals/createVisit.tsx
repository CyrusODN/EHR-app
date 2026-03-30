import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
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
    ActivityIndicator,
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
import { GetVisitRequirements } from '../../../Services/DoctorSetting.Service';
import { GetPatients } from '../../../Services/Patient.Service';
import { GetEmployees, GetDirectorSetting } from '../../../Services/settingServices';
import { CreateVisit } from '../../../Services/Visit.Service';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '../../../hooks/useThemeColors';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const CreateVisitModal = ({ visible, onClose, onSaveSuccess }: { visible: boolean, onClose: () => void, onSaveSuccess?: () => void }) => {
    const { t, i18n } = useTranslation();
    const navigation = useNavigation<any>();
    const insets = useSafeAreaInsets();
    const { colors: tc, isDark } = useThemeColors();
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
    const [doctor, setDoctor] = useState<string | null>(null);
    const [patient, setPatient] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Dynamic dropdown options from API
    const [doctorOptions, setDoctorOptions] = useState<{ label: string; value: string }[]>([]);
    const [patientOptions, setPatientOptions] = useState<{ label: string; value: string }[]>([]);
    const [officeOptions, setOfficeOptions] = useState<{ label: string; value: string }[]>([]);
    const [typeOptions, setTypeOptions] = useState<{ label: string; value: string }[]>([
        { label: t('dashboard.createVisit.types.private'), value: 'private' },
        { label: t('dashboard.createVisit.types.public'), value: 'public' },
        { label: t('dashboard.createVisit.types.insurance'), value: 'insurance' },
    ]);
    const [specializationOptions, setSpecializationOptions] = useState<{ label: string; value: string }[]>([
        { label: t('dashboard.createVisit.specializations.psychiatry'), value: 'psychiatry' },
        { label: t('dashboard.createVisit.specializations.neurology'), value: 'neurology' },
        { label: t('dashboard.createVisit.specializations.cardiology'), value: 'cardiology' },
    ]);

    // Fetch all dropdown data
    const fetchData = useCallback(async () => {
        // Fetch visit requirements (specializations, types)
        const fetchRequirements = async () => {
            try {
                const res: any = await GetVisitRequirements();
                const data = res?.data || res;
                if (!data) return;

                const specs = data?.specializations || data?.specialization || data?.medicalSpecializations || data?.medicalSpecialities || [];
                if (Array.isArray(specs)) {
                    const apiSpecs = specs.map((s: any) => ({
                        label: typeof s === 'string' ? s : (s.name || s.label || s.title || s.specializationName || ''),
                        value: typeof s === 'string' ? s : String(s._id || s.id || s.value),
                    })).filter(o => o.label && o.value);

                    setSpecializationOptions(prev => {
                        const combined = [...prev];
                        apiSpecs.forEach(spec => {
                            if (!combined.some(o => o.value === spec.value)) {
                                combined.push(spec);
                            }
                        });
                        return combined;
                    });
                }

                const types = data?.types || data?.visitTypes || [];
                if (Array.isArray(types) && types.length > 0) {
                    setTypeOptions(types.map((t: any) => ({
                        label: typeof t === 'string' ? t : (t.name || t.label || ''),
                        value: typeof t === 'string' ? t : String(t._id || t.id || t.value),
                    })));
                }
            } catch (err) {
                console.log('CreateVisitModal: Error:', err);
            }
        };

        const fetchOffices = async () => {
            try {
                const res: any = await GetDirectorSetting();
                const data = res?.data || res;
                const offices = data?.offices || (Array.isArray(data) ? data : []);
                if (Array.isArray(offices) && offices.length > 0) {
                    setOfficeOptions(offices.map((o: any) => ({
                        label: o.name || o.officeName || o.label || 'Office',
                        value: String(o._id || o.id || o.value),
                    })));
                }
            } catch (err) {
                console.log('CreateVisitModal: Offices error:', err);
            }
        };

        const fetchDoctors = async () => {
            try {
                const res: any = await GetEmployees({ role: 'doctor', page: 1, limit: 100 });
                const data = res?.data || res;
                const employees = data?.users || data?.employees || (Array.isArray(data) ? data : []);
                if (Array.isArray(employees) && employees.length > 0) {
                    setDoctorOptions(employees.map((d: any) => ({
                        label: `Dr. ${d.name || d.firstName || ''} ${d.lastName || ''}`.trim(),
                        value: String(d._id || d.id),
                    })));
                }
            } catch (err) {
                console.log('CreateVisitModal: Doctors error:', err);
            }
        };

        const fetchPatients = async () => {
            try {
                const res: any = await GetPatients({ page: 1, limit: 100 });
                const data = res?.data || res;
                const patientsList = data?.patients || data?.users || (Array.isArray(data) ? data : []);
                if (Array.isArray(patientsList) && patientsList.length > 0) {
                    setPatientOptions(patientsList.map((p: any) => ({
                        label: `${p.firstName || p.name || ''} ${p.lastName || ''}`.trim() || 'Patient',
                        value: String(p._id || p.id),
                    })));
                }
            } catch (err) {
                console.log('CreateVisitModal: Patients error:', err);
            }
        };

        await Promise.allSettled([fetchRequirements(), fetchOffices(), fetchDoctors(), fetchPatients()]);
    }, []);

    useEffect(() => {
        if (visible) fetchData();
    }, [visible, fetchData]);

    const handleDateChange = (_event: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) setDate(selectedDate);
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
        if (timeFromCloseTimer.current) clearTimeout(timeFromCloseTimer.current);
        timeFromCloseTimer.current = setTimeout(() => setShowTimeFromPicker(false), 500);
    };

    const handleTimeToChange = (_event: any, selectedTime?: Date) => {
        if (selectedTime) setTimeTo(selectedTime);
        if (timeToCloseTimer.current) clearTimeout(timeToCloseTimer.current);
        timeToCloseTimer.current = setTimeout(() => setShowTimeToPicker(false), 500);
    };

    const formatDate = (d: Date) => {
        return d.toLocaleDateString(i18n.language, {
            weekday: 'long',
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
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
        if (diff === 0) return t('dashboard.createVisit.today');
        if (diff === 1) return t('dashboard.createVisit.tomorrow');
        if (diff === -1) return t('dashboard.createVisit.yesterday');
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

    const handleClose = () => onClose();

    const handleSave = async () => {
        if (!patient || !doctor || !office || !type || !date || !timeFrom || !timeTo) return;
        setLoading(true);
        try {
            const payload = {
                date: date.toISOString().split('T')[0],
                startTime: timeFrom.toTimeString().split(' ')[0].substring(0, 5),
                endTime: timeTo.toTimeString().split(' ')[0].substring(0, 5),
                officeId: office,
                visitType: type.toLowerCase(),
                specialization: specialization?.toLowerCase() || null,
                notes: notes,
                isOnline: isEVisit,
                isPrescription: isPrescriptionOnly,
                isReferral: isReferral,
                doctorId: doctor,
                patientId: patient
            };
            const res: any = await CreateVisit(payload);
            const data = res?.data || res;
            if (res?.success || data) {
                if (onSaveSuccess) onSaveSuccess();
                handleClose();
            }
        } catch (err) {
            console.error("CreateVisitModal: Save error", err);
        } finally {
            setLoading(false);
        }
    };

    const ds = useMemo(() => createDynamicStyles(tc, isDark), [tc, isDark]);

    const SectionHeader = ({ icon, title, iconColor = tc.accent }: any) => (
        <View style={ds.sectionHeader}>
            <View style={[ds.sectionIconContainer, { backgroundColor: iconColor + '20' }]}>
                {icon}
            </View>
            <Text style={ds.sectionTitle}>{title}</Text>
        </View>
    );

    if (!isMounted) return null;

    return (
        <View style={[StyleSheet.absoluteFill, { zIndex: 999, elevation: 999 }]}>
            <Animated.View style={[ds.backdrop, { opacity: backdropOpacity }]}>
                <TouchableWithoutFeedback onPress={handleClose}>
                    <View style={{ flex: 1 }} />
                </TouchableWithoutFeedback>
            </Animated.View>

            <Animated.View
                style={[
                    ds.modalContainer,
                    {
                        paddingBottom: insets.bottom + 10,
                        height: SCREEN_HEIGHT * 0.92,
                        transform: [{ translateY: slideAnim }],
                    },
                ]}
            >
                <View style={ds.dragHandleContainer}>
                    <View style={ds.dragHandle} />
                </View>

                <View style={ds.header}>
                    <View style={ds.headerLeft}>
                        <LinearGradient
                            colors={['#4A90B9', '#5BA6B6', '#68BFB3']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={ds.headerIconGradient}
                        >
                            <FontAwesome6 name="plus" size={14} color="white" />
                        </LinearGradient>
                        <View>
                            <Text style={ds.headerText}>{t('dashboard.createVisit.title')}</Text>
                            <Text style={ds.headerSubtext}>{t('dashboard.createVisit.subtitle')}</Text>
                        </View>
                    </View>
                    <TouchableOpacity onPress={handleClose} style={ds.closeButton}>
                        <Feather name="x" size={20} color={tc.textMuted} />
                    </TouchableOpacity>
                </View>

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    style={{ flex: 1 }}
                >
                    <ScrollView
                        style={ds.scrollView}
                        contentContainerStyle={ds.scrollContent}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        <SectionHeader
                            icon={<Feather name="user" size={16} color={tc.accent} />}
                            title={t('dashboard.createVisit.patientSection')}
                        />
                        <View style={ds.card}>
                            <CustomDropdown
                                placeholder={t('dashboard.createVisit.searchPatientPlaceholder')}
                                options={patientOptions}
                                value={patient}
                                onChange={(v: any) => setPatient(v)}
                                search={true}
                                icon={<Feather name="search" color={tc.accent} size={18} />}
                                style={ds.dropdown}
                            />
                            <Gap height={12} />
                            <PrimaryButton
                                label={t('dashboard.quickActions.newPatient')}
                                filled={false}
                                icon={<Feather name="user-plus" size={14} color={tc.accent} />}
                                onPress={() => {
                                    handleClose();
                                    navigation.navigate('New-Patient');
                                }}
                                style={{ width: "100%", height: 45, borderColor: tc.accent }} image={undefined} iconStyle={undefined} imageStyle={undefined} loading={false} disabled={false}
                            />
                        </View>

                        <SectionHeader
                            icon={<MaterialCommunityIcons name="calendar-clock" size={16} color={tc.accent} />}
                            title={t('dashboard.createVisit.dateTimeSection')}
                        />
                        <View style={ds.card}>
                            <View style={ds.quickDateRow}>
                                {(['today', 'tomorrow', 'nextWeek'] as const).map((q) => {
                                    const labels = { 
                                        today: t('dashboard.createVisit.today'), 
                                        tomorrow: t('dashboard.createVisit.tomorrow'), 
                                        nextWeek: t('dashboard.createVisit.nextWeek') 
                                    };
                                    const isActive = getDateLabel(date) === labels[q] || (q === 'nextWeek' && (() => {
                                        const d = new Date();
                                        d.setDate(d.getDate() + 7);
                                        return date.toDateString() === d.toDateString();
                                    })());
                                    return (
                                        <TouchableOpacity
                                            key={q}
                                            style={[ds.quickDateBtn, isActive && ds.quickDateBtnActive]}
                                            onPress={() => setQuickDate(q)}
                                        >
                                            <Text style={[ds.quickDateText, isActive && ds.quickDateTextActive]}>
                                                {labels[q]}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>

                            <Text style={ds.label}>{t('dashboard.createVisit.dateLabel')}</Text>
                            <TouchableOpacity
                                style={ds.datePickerButton}
                                onPress={() => setShowDatePicker(!showDatePicker)}
                            >
                                <View style={ds.datePickerContent}>
                                    <View style={ds.dateIconContainer}>
                                        <MaterialCommunityIcons name="calendar-month" size={18} color={tc.accent} />
                                    </View>
                                    <View>
                                        <Text style={ds.dateText}>{formatDate(date)}</Text>
                                        {getDateLabel(date) && (
                                            <Text style={ds.dateLabelText}>{getDateLabel(date)}</Text>
                                        )}
                                    </View>
                                </View>
                                <Feather name={showDatePicker ? 'chevron-up' : 'chevron-down'} size={16} color={tc.textMuted} />
                            </TouchableOpacity>
                            {showDatePicker && (
                                <View style={ds.inlinePicker}>
                                    <DateTimePicker
                                        value={date}
                                        mode="date"
                                        display={Platform.OS === 'ios' ? 'inline' : 'default'}
                                        onChange={handleDateChange}
                                        minimumDate={new Date()}
                                        themeVariant={isDark ? 'dark' : 'light'}
                                        style={{ alignSelf: 'center' }}
                                    />
                                </View>
                            )}
                            <Gap height={16} />
                            <Text style={ds.label}>{t('dashboard.createVisit.timeLabel')}</Text>
                            <View style={ds.timeSection}>
                                <TouchableOpacity
                                    style={[ds.timeCard, showTimeFromPicker && ds.timeCardActive]}
                                    onPress={() => { setShowTimeFromPicker(!showTimeFromPicker); setShowTimeToPicker(false); }}
                                >
                                    <Text style={ds.timeCardLabel}>{t('dashboard.createVisit.from')}</Text>
                                    <View style={ds.timeDisplay}>
                                        <Text style={ds.timeValue}>{formatTime(timeFrom).time}</Text>
                                        <Text style={ds.timeAmPm}>{formatTime(timeFrom).ampm}</Text>
                                    </View>
                                    <Feather name="clock" size={14} color={tc.textMuted} />
                                </TouchableOpacity>
                                <View style={ds.durationContainer}>
                                    <View style={ds.durationLine} />
                                    <View style={ds.durationBadge}>
                                        <Text style={ds.durationText}>{getDurationText() || '--'}</Text>
                                    </View>
                                    <View style={ds.durationLine} />
                                </View>
                                <TouchableOpacity
                                    style={[ds.timeCard, showTimeToPicker && ds.timeCardActive]}
                                    onPress={() => { setShowTimeToPicker(!showTimeToPicker); setShowTimeFromPicker(false); }}
                                >
                                    <Text style={ds.timeCardLabel}>{t('dashboard.createVisit.to')}</Text>
                                    <View style={ds.timeDisplay}>
                                        <Text style={ds.timeValue}>{formatTime(timeTo).time}</Text>
                                        <Text style={ds.timeAmPm}>{formatTime(timeTo).ampm}</Text>
                                    </View>
                                    <Feather name="clock" size={14} color={tc.textMuted} />
                                </TouchableOpacity>
                            </View>
                            {(showTimeFromPicker || showTimeToPicker) && (
                                <View style={ds.inlinePicker}>
                                    <DateTimePicker
                                        value={showTimeFromPicker ? timeFrom : timeTo}
                                        mode="time"
                                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                        onChange={showTimeFromPicker ? handleTimeFromChange : handleTimeToChange}
                                        minuteInterval={5}
                                        themeVariant={isDark ? 'dark' : 'light'}
                                        style={{ alignSelf: 'center' }}
                                    />
                                </View>
                            )}
                        </View>

                        <SectionHeader
                            icon={<MaterialCommunityIcons name="clipboard-text-outline" size={16} color={tc.accent} />}
                            title={t('dashboard.createVisit.visitDetailsSection')}
                        />
                        <View style={ds.card}>
                            <Text style={ds.label}>{t('dashboard.createVisit.doctorLabel')}</Text>
                            <CustomDropdown
                                placeholder={t('dashboard.createVisit.doctorPlaceholder')}
                                options={doctorOptions}
                                value={doctor}
                                onChange={(v: any) => setDoctor(v)}
                                icon={<FontAwesome6 name="user-doctor" size={16} color={tc.accent} />}
                                style={ds.dropdown}
                            />
                            <Gap height={14} />
                            <Text style={ds.label}>{t('dashboard.createVisit.officeLabel')}</Text>
                            <CustomDropdown
                                placeholder={t('dashboard.createVisit.officePlaceholder')}
                                options={officeOptions}
                                value={office}
                                onChange={(v: any) => setOffice(v)}
                                icon={<MaterialCommunityIcons name="office-building-outline" size={18} color={tc.accent} />}
                                style={ds.dropdown}
                            />
                            <Gap height={14} />
                            <Text style={ds.label}>{t('dashboard.createVisit.typeLabel')}</Text>
                            <CustomDropdown
                                placeholder={t('dashboard.createVisit.typePlaceholder')}
                                options={typeOptions}
                                value={type}
                                onChange={(v: any) => setType(v)}
                                icon={<MaterialCommunityIcons name="tag-outline" size={18} color={tc.accent} />}
                                style={ds.dropdown}
                            />
                            <Gap height={14} />
                            <Text style={ds.label}>{t('dashboard.createVisit.specializationLabel')}</Text>
                            <CustomDropdown
                                placeholder={t('dashboard.createVisit.specializationPlaceholder')}
                                options={specializationOptions}
                                value={specialization}
                                onChange={(v: any) => setSpecialization(v)}
                                icon={<FontAwesome name="stethoscope" size={16} color={tc.accent} />}
                                style={ds.dropdown}
                            />
                        </View>

                        <SectionHeader
                            icon={<Feather name="settings" size={16} color={tc.accent} />}
                            title={t('dashboard.createVisit.optionsSection')}
                        />
                        <View style={ds.card}>
                            <CustomCheckbox label={t('dashboard.createVisit.eVisit')} checked={isEVisit} onChange={setIsEVisit} />
                            <CustomCheckbox label={t('dashboard.createVisit.prescriptionOnly')} checked={isPrescriptionOnly} onChange={setIsPrescriptionOnly} />
                            <CustomCheckbox label={t('dashboard.createVisit.referral')} checked={isReferral} onChange={setIsReferral} />
                        </View>

                        <SectionHeader
                            icon={<Feather name="edit-3" size={16} color={tc.accent} />}
                            title={t('dashboard.createVisit.notesSection')}
                        />
                        <View style={ds.card}>
                            <CustomTextInput
                                placeholder={t('dashboard.createVisit.notesPlaceholder')}
                                value={notes}
                                onChangeText={setNotes}
                                multiline={true}
                                numberOfLines={4}
                                style={{ backgroundColor: tc.inputBackground, borderColor: tc.borderColor }}
                            />
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>

                <View style={ds.bottomActions}>
                    <View style={ds.primaryActions}>
                        <PrimaryButton
                            label={t('common.cancel')}
                            filled={false}
                            onPress={handleClose}
                            style={{ flex: 0.8, marginRight: 16, borderColor: tc.borderColor, backgroundColor: tc.buttonMutedBg }}
                            loading={false} disabled={false} image={undefined} imageStyle={undefined}
                        />
                        <PrimaryButton
                            label={t('dashboard.quickActions.scheduleVisit')}
                            filled={true}
                            onPress={handleSave}
                            style={{ flex: 1.5 }}
                            loading={loading} disabled={loading}
                        />
                    </View>
                </View>
            </Animated.View>
        </View>
    );
};

const createDynamicStyles = (tc: any, isDark: boolean) => StyleSheet.create({
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: isDark ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.45)',
    },
    modalContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: tc.drawerBg,
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
        backgroundColor: tc.borderColor,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: tc.borderColor,
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
        color: tc.textPrimary,
    },
    headerSubtext: {
        fontSize: 12,
        color: tc.textMuted,
        marginTop: 1,
    },
    closeButton: {
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: tc.buttonMutedBg,
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
        color: tc.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    card: {
        backgroundColor: tc.cardBackground,
        borderRadius: 14,
        padding: 12,
        marginBottom: 16,
        borderWidth: isDark ? 1 : 0,
        borderColor: tc.borderColor,
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: isDark ? 0 : 0.05, shadowRadius: 8 },
            android: { elevation: isDark ? 0 : 2 },
        }),
    },
    label: {
        fontSize: 13,
        fontWeight: '600',
        color: tc.textPrimary,
        marginBottom: 6,
    },
    dropdown: {
        backgroundColor: tc.cardBackgroundAlt,
        borderRadius: 12,
        height: 50,
        borderColor: tc.borderColor,
    },
    datePickerButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: tc.borderColor,
        borderRadius: 12,
        padding: 12,
        backgroundColor: tc.cardBackgroundAlt,
    },
    datePickerContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dateIconContainer: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: tc.accentLight,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    dateText: {
        fontSize: 14,
        color: tc.textPrimary,
        fontWeight: '600',
    },
    dateLabelText: {
        fontSize: 11,
        color: tc.accent,
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
        backgroundColor: tc.buttonMutedBg,
        alignItems: 'center',
    },
    quickDateBtnActive: {
        backgroundColor: tc.accentLight,
        borderWidth: 1,
        borderColor: tc.accent,
    },
    quickDateText: {
        fontSize: 12,
        fontWeight: '500',
        color: tc.textSecondary,
    },
    quickDateTextActive: {
        color: tc.accent,
        fontWeight: '700',
    },
    inlinePicker: {
        marginTop: 10,
        borderTopWidth: 1,
        borderTopColor: tc.divider,
        paddingTop: 8,
    },
    timeSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    timeCard: {
        flex: 1,
        borderWidth: 1,
        borderColor: tc.borderColor,
        borderRadius: 10,
        paddingVertical: 8,
        paddingHorizontal: 10,
        backgroundColor: tc.cardBackgroundAlt,
        alignItems: 'center',
    },
    timeCardActive: {
        borderColor: tc.accent,
        backgroundColor: tc.todayBg,
    },
    timeCardLabel: {
        fontSize: 9,
        fontWeight: '700',
        color: tc.textMuted,
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
        color: tc.textPrimary,
    },
    timeAmPm: {
        fontSize: 10,
        fontWeight: '600',
        color: tc.textSecondary,
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
        backgroundColor: tc.borderColor,
    },
    durationBadge: {
        backgroundColor: tc.accentLight,
        borderRadius: 10,
        paddingHorizontal: 6,
        paddingVertical: 3,
    },
    durationText: {
        fontSize: 10,
        fontWeight: '700',
        color: tc.accent,
    },
    bottomActions: {
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 6,
        borderTopWidth: 1,
        borderTopColor: tc.borderColor,
        backgroundColor: tc.drawerBg,
    },
    primaryActions: {
        flexDirection: 'row',
        marginBottom: 6,
    },
});

export default CreateVisitModal;