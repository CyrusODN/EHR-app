// components/CreateVisitModal.js
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    ScrollView,
    Platform
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


const CreateVisitModal = ({ visible, onClose }: { visible: boolean, onClose: () => void }) => {
    const navigation = useNavigation();
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [timeFrom, setTimeFrom] = useState('');
    const [timeTo, setTimeTo] = useState('');
    const [office, setOffice] = useState(null);
    const [type, setType] = useState('Private');
    const [specialization, setSpecialization] = useState(null);
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

    const handleDateChange = (selectedDate: Date) => {
        const currentDate = selectedDate || date;
        setShowDatePicker(Platform.OS === 'ios');
        setDate(currentDate);
    };

    const formatDate = (date: Date) => {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const handleSave = () => {
        // Handle save logic
        console.log({
            date,
            timeFrom,
            timeTo,
            office,
            type,
            specialization,
            isEVisit,
            isPrescriptionOnly,
            isReferral,
            notes
        });
        onClose();
    };

    const handleSaveAndStart = () => {
        // Handle save and start logic
        handleSave();
        // Additional logic for starting the visit
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <View style={styles.header}>
                        <Text style={styles.headerText}>Create new visit</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Ionicons name="close" size={24} color="black" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.scrollView}>
                        <View style={styles.formSection}>
                            <Text style={styles.label}>Date</Text>
                            <TouchableOpacity
                                style={styles.datePickerButton}
                                onPress={() => setShowDatePicker(true)}
                            >
                                <Text>{formatDate(date)}</Text>
                                <MaterialCommunityIcons name="calendar-blank" size={18} color={"grey"} />

                            </TouchableOpacity>
                            {showDatePicker && (
                                <DateTimePicker
                                    value={date}
                                    mode="date"
                                    display="default"
                                    onChange={handleDateChange}
                                />
                            )}
                        </View>

                        <View style={styles.timeSection}>
                            <View style={styles.timeColumn}>
                                <Text style={styles.label}>From</Text>
                                <CustomTextInput
                                    placeholder="--:-- --"
                                    value={timeFrom}
                                    onChangeText={setTimeFrom}
                                    icon={<Feather name="time" color="#ccc" size={18} />}
                                    right={<Feather name="clock" size={15} color={"black"} />}
                                    onRightPress={() => { }} keyboardType={undefined} />
                            </View>
                            <View style={styles.timeColumn}>
                                <Text style={styles.label}>To</Text>
                                <CustomTextInput
                                    placeholder="--:-- --"
                                    value={timeTo}
                                    onChangeText={setTimeTo}
                                    icon={<Feather name="time-outline" color="#ccc" size={18} />}
                                    right={<Feather name="clock" size={15} color={"black"} />}
                                    onRightPress={() => { }} keyboardType={undefined} />
                            </View>
                        </View>

                        <View style={styles.formSection}>
                            <Text style={styles.label}>Pacjent</Text>
                            <CustomTextInput
                                multiline
                                placeholder="Wyszukaj pacjenta (min. 3 znaki)..."
                                icon={<Feather name="user" color="#ccc" size={18} />}
                                value={undefined} onChangeText={undefined} right={undefined} onRightPress={undefined} keyboardType={undefined} />
                            <Gap height={10} />
                            <PrimaryButton
                                label="Nowry pacjent"
                                filled={false}
                                icon={<Feather name="user-plus" size={15} color="#4A90B9" />}
                                onPress={() => {
                                    onClose()
                                    navigation.navigate('New-Patient');
                                }}
                                style={{ width: "100%" }} image={undefined} iconStyle={undefined} imageStyle={undefined} loading={false} disabled={false}
                            />
                        </View>

                        <View style={styles.formSection}>
                            <Text style={styles.label}>Office</Text>
                            <CustomDropdown
                                placeholder="Select office"
                                options={officeOptions}
                                value={office}
                                onChange={setOffice}
                                icon={<MaterialCommunityIcons name="office-building-outline" size={18} color={"grey"} />}
                            />
                        </View>

                        <View style={styles.formSection}>
                            <Text style={styles.label}>Type</Text>
                            <CustomDropdown
                                placeholder="Select type"
                                options={typeOptions}
                                value={type}
                                onChange={setType}
                                icon={undefined}
                            />
                        </View>

                        <View style={styles.formSection}>
                            <Text style={styles.label}>Specialization</Text>
                            <CustomDropdown
                                placeholder="Select specialization"
                                options={specializationOptions}
                                value={specialization}
                                onChange={setSpecialization}
                                icon={<FontAwesome name="stethoscope" size={18} color={"grey"} />}
                            />
                        </View>

                        <View style={styles.checkboxesSection}>
                            <CustomCheckbox
                                label="E-visit"
                                checked={isEVisit}
                                onChange={setIsEVisit}
                            />
                            <CustomCheckbox
                                label="Prescription only"
                                checked={isPrescriptionOnly}
                                onChange={setIsPrescriptionOnly}
                            />
                            <CustomCheckbox
                                label="Referral"
                                checked={isReferral}
                                onChange={setIsReferral}
                            />
                        </View>

                        <View style={styles.formSection}>
                            <Text style={styles.label}>Notes</Text>
                            <CustomTextInput
                                placeholder="Additional notes..."
                                value={notes}
                                onChangeText={setNotes}
                                multiline={true}
                                numberOfLines={5} icon={undefined} right={undefined} onRightPress={undefined} keyboardType={undefined} />
                        </View>
                    </ScrollView>

                    <View style={styles.buttonContainer}>
                        <PrimaryButton
                            label="Save"
                            filled={false}
                            icon={<FontAwesome name="save" size={15} color='#4A90B9' />}
                            onPress={() => { }}
                            style={{ width: "49%" }} image={undefined} iconStyle={undefined} imageStyle={undefined}
                            loading={false}
                            disabled={false}
                        />
                        <PrimaryButton
                            label="Save and Start"
                            filled={true}
                            icon={<Ionicons name="arrow-forward" size={15} color="white" />}
                            onPress={() => { }}
                            style={{ width: "49%" }} image={undefined} iconStyle={undefined} imageStyle={undefined}
                            loading={false}
                            disabled={false}
                        />

                    </View>
                    <Gap height={0} />
                    <PrimaryButton
                        label="Cancel"
                        filled={false}
                        icon={undefined}
                        onPress={onClose}
                        style={{ alignSelf: "center", width: "92%" }} image={undefined} iconStyle={undefined} imageStyle={undefined} loading={false} disabled={false}
                    />

                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        width: '90%',
        maxHeight: '95%',
        marginTop: hp(2),
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 0,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    closeButton: {
        padding: 5,
    },
    scrollView: {
        maxHeight: '70%',
    },
    formSection: {
        marginHorizontal: 15,
        marginTop: 15,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        color: '#333',
    },
    datePickerButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 5,
        padding: 12,
        backgroundColor: 'white',
    },
    timeSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 15,
        marginTop: 15,
    },
    timeColumn: {
        width: '48%',
    },
    newPatientButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        borderWidth: 1,
        borderColor: '#4db6ac',
        borderRadius: 5,
        marginTop: 10,
    },
    newPatientText: {
        marginLeft: 10,
        color: '#4db6ac',
        fontSize: 16,
    },
    checkboxesSection: {
        marginHorizontal: 15,
        marginTop: 15,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 15,
        marginTop: 20,
        width: "92%",
        alignSelf: "center"
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        borderRadius: 5,
    },
    saveButton: {
        borderWidth: 1,
        borderColor: '#4db6ac',
        backgroundColor: 'white',
        width: '48%',
    },
    saveButtonText: {
        marginLeft: 10,
        color: '#4db6ac',
        fontSize: 16,
    },
    saveStartButton: {
        backgroundColor: '#4db6ac',
        width: '48%',
    },
    saveStartButtonText: {
        marginLeft: 10,
        color: 'white',
        fontSize: 16,
    },
    cancelButton: {
        alignItems: 'center',
        marginHorizontal: 15,
        marginTop: 10,
        marginBottom: 15,
        padding: 15,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 5,
    },
    cancelButtonText: {
        color: '#777',
        fontSize: 16,
    },
});

export default CreateVisitModal;