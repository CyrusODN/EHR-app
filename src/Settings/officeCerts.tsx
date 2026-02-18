// components/Office&Certificates.js
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    TextInput,
    FlatList
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import PrimaryButton from '../component/button';

// Department Card Component
const DepartmentCard = ({ department, onEdit, onDelete }) => (
    <View style={styles.departmentCard}>
        <View style={styles.departmentInfo}>
            <Text style={styles.departmentTitle}>{department.name}</Text>
            <Text style={styles.departmentDetail}>{department.address}</Text>
            <Text style={styles.departmentDetail}>{department.postalCode} {department.city}</Text>
            <Text style={styles.departmentDetail}>{department.phone}</Text>
            <Text style={styles.departmentDetail}>{department.email}</Text>
        </View>
        <View style={styles.departmentActions}>
            <TouchableOpacity onPress={() => onEdit(department.id)} style={styles.iconButton}>
                <Feather name="edit-2" size={20} color="#4A90B9" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onDelete(department.id)} style={styles.iconButton}>
                <Feather name="trash-2" size={20} color="#FF6B6B" />
            </TouchableOpacity>
        </View>
    </View>
);


// Office Card Component
const OfficeCard = ({ office, onEdit, onDelete }) => (
    <View style={styles.officeCard}>
        <View style={styles.officeInfo}>
            <Text style={styles.officeTitle}>{office.title}</Text>
            <Text style={styles.officeDetail}>Floor: {office.floor}, No: {office.number}</Text>
            <Text style={styles.officeDetail}>Type: {office.type}</Text>
            <Text style={styles.officeDetail}>Equipment: {office.equipment}</Text>
        </View>
        <View style={styles.officeActions}>
            <TouchableOpacity onPress={() => onEdit(office.id)} style={styles.iconButton}>
                <Feather name="edit-2" size={20} color="#4A90B9" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onDelete(office.id)} style={styles.iconButton}>
                <Feather name="trash-2" size={20} color="#FF6B6B" />
            </TouchableOpacity>
        </View>
    </View>
);

// Certificate Upload Section Component
const CertificateUploadSection = ({ title, placeholder, onUpload }) => (
    <View style={styles.certificateSection}>
        <Text style={styles.certificateLabel}>{title}</Text>
        {title === 'P1 Identifier' ? (
            <TextInput
                style={styles.certificateInput}
                placeholder={placeholder}
                placeholderTextColor="#999"
            />
        ) : (
            <TouchableOpacity style={styles.uploadButton} onPress={onUpload}>
                <Feather name="upload" size={20} color="#4A90B9" />
                <Text style={styles.uploadText}>{placeholder}</Text>
            </TouchableOpacity>
        )}
    </View>
);

const OfficeCertificates = () => {
    const navigation = useNavigation();

    const [departments, setDepartments] = useState([
        {
            id: '1',
            name: 'Department Gdańsk',
            address: 'ul. Przykładowa 1',
            postalCode: '80-001',
            city: 'Gdańsk',
            phone: '+48 123 456 789',
            email: 'gdansk@example.com'
        }
    ]);

    // Sample office data
    const [offices, setOffices] = useState([
        {
            id: '1',
            title: 'Office 1',
            floor: '1',
            number: '101',
            type: 'Medical office',
            equipment: 'Couch, Desk, Computer'
        }
    ]);

    // Handle add new office
    const handleAddOffice = () => {
        console.log('Add new office');
        // Navigation to add office screen or show modal
    };

    // Handle edit office
    const handleEditOffice = (id) => {
        console.log('Edit office with id:', id);
        // Navigate to edit screen or show modal
    };

    // Handle delete office
    const handleDeleteOffice = (id) => {
        console.log('Delete office with id:', id);
        // Show confirmation dialog and then delete
        setOffices(offices.filter(office => office.id !== id));
    };

    // Handle upload certificate
    const handleUploadCertificate = (type) => {
        console.log('Upload certificate of type:', type);
        // Show file picker
    };

    //Handle add new department
    const handleAddDepartment = () => {
        console.log('Add new department');
        // Navigation to add department screen or show modal
    };

    // Handle edit department
    const handleEditDepartment = (id) => {
        console.log('Edit department with id:', id);
        // Navigate to edit screen or show modal
    };

    // Handle delete department
    const handleDeleteDepartment = (id) => {
        console.log('Delete department with id:', id);
        // Show confirmation dialog and then delete
        setDepartments(departments.filter(department => department.id !== id));
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingRight: 10 }}>
                    <Ionicons name="chevron-back" size={24} color="#333" />
                </TouchableOpacity>
                <View style={styles.headerIconContainer}>
                    <MaterialCommunityIcons name="office-building" size={24} color="#4A90B9" />
                </View>
                <Text style={styles.headerTitle}>Offices & Certificates</Text>
            </View>

            <ScrollView style={styles.container}>
                {/* Departments Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <View style={styles.sectionTitleContainer}>
                            <View style={styles.iconContainer}>
                                <Ionicons name="location-outline" size={24} color="#4A90B9" />
                            </View>
                            <Text style={styles.sectionTitle}>Departments</Text>
                        </View>

                        <PrimaryButton
                            label="Add department"
                            filled={true}
                            onPress={() => { }}
                            style={{ width: "45%" }}
                            icon={<Ionicons name="add" size={18} color="white" />}
                            image={undefined}
                            iconStyle={undefined}
                            imageStyle={undefined}
                            loading={false}
                            disabled={false}
                        />
                    </View>

                    {/* Departments List */}
                    <View style={styles.departmentList}>
                        {departments.map(department => (
                            <DepartmentCard
                                key={department.id}
                                department={department}
                                onEdit={handleEditDepartment}
                                onDelete={handleDeleteDepartment}
                            />
                        ))}
                    </View>
                </View>
            </ScrollView>

            <ScrollView style={styles.container}>
                {/* Offices Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <View style={styles.sectionTitleContainer}>
                            <View style={styles.iconContainer}>
                                <MaterialIcons name="meeting-room" size={24} color="#4A90B9" />
                            </View>
                            <Text style={styles.sectionTitle}>Offices</Text>
                        </View>

                        <PrimaryButton
                            label={"Add office"}
                            filled={true}
                            onPress={() => { }}
                            style={{ width: "40%" }}
                            icon={<Ionicons name="add" size={18} color="white" />}
                            image={undefined}
                            iconStyle={undefined}
                            imageStyle={undefined}
                            loading={false}
                            disabled={false}
                        />
                    </View>

                    {/* Office List */}
                    <View style={styles.officeList}>
                        {offices.map(office => (
                            <OfficeCard
                                key={office.id}
                                office={office}
                                onEdit={handleEditOffice}
                                onDelete={handleDeleteOffice}
                            />
                        ))}
                    </View>
                </View>

                {/* Certificates Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <View style={styles.sectionTitleContainer}>
                            <View style={styles.iconContainer}>
                                <MaterialCommunityIcons name="certificate" size={24} color="#4A90B9" />
                            </View>
                            <Text style={styles.sectionTitle}>Certificates P1</Text>
                        </View>
                    </View>

                    {/* Certificate Upload Sections */}
                    <View style={styles.certificatesContainer}>
                        <CertificateUploadSection
                            title="P1 Identifier"
                            placeholder="Enter P1 identifier"
                            onUpload={() => { }}
                        />

                        <CertificateUploadSection
                            title="TLS Certificate"
                            placeholder="Choose TLS certificate file"
                            onUpload={() => handleUploadCertificate('TLS')}
                        />

                        <CertificateUploadSection
                            title="WLS Certificate"
                            placeholder="Choose WLS certificate file"
                            onUpload={() => handleUploadCertificate('WLS')}
                        />
                    </View>

                    <View style={styles.buttonContainer}>
                        <PrimaryButton
                            label="Save Changes"
                            filled={true}
                            icon={<FontAwesome name="save" size={16} color="white" />}
                            onPress={() => { }}
                            style={{ width: "100%" }}
                            image={undefined}
                            iconStyle={undefined}
                            imageStyle={undefined}
                            loading={false}
                            disabled={false}
                        />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    buttonContainer: {
        marginHorizontal: 15,
        marginTop: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#FFFFFF',
    },
    headerIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: '#E8F4F8',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333333',
    },
    safeArea: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    section: {
        marginBottom: 20,
        backgroundColor: 'white',
        borderRadius: 8,
        overflow: 'hidden',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    sectionTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: '#E8F4F8',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333333',
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#4A90B9',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 6,
    },
    addButtonText: {
        color: 'white',
        marginLeft: 8,
        fontWeight: '500',
    },
    officeList: {
        padding: 16,
    },
    officeCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#EEEEEE',
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
    },
    officeInfo: {
        flex: 1,
    },
    officeTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 4,
    },
    officeDetail: {
        fontSize: 14,
        color: '#666666',
        marginBottom: 2,
    },
    officeActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    departmentList: {
        padding: 16,
    },
    iconButton: {
        padding: 8,
        marginLeft: 8,
    },
    certificatesContainer: {
        padding: 16,
    },
    certificateSection: {
        marginBottom: 20,
    },
    certificateLabel: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 8,
        color: '#333333',
    },
    certificateInput: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
    },
    uploadButton: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        padding: 16,
        borderStyle: 'dashed',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    uploadText: {
        color: '#4A90B9',
        marginLeft: 10,
        fontSize: 16,
    },
    helpButtonFloat: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#4A90B9',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    helpText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    departmentCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#EEEEEE',
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
    },
    departmentInfo: {
        flex: 1,
    },
    departmentTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 4,
    },
    departmentDetail: {
        fontSize: 14,
        color: '#666666',
        marginBottom: 2,
    },
    departmentActions: {
        flexDirection: 'row',
        alignItems: "flex-start",
    }
});

export default OfficeCertificates;