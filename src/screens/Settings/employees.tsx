import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    TouchableOpacity,
    TextInput,
    Switch,
    ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import CustomCheckbox from '../../component/customCheckBox';
import PrimaryButton from '../../component/button';

interface Employee {
    id: string;
    fullName: string;
    login: string;
    pwz: string;
    isActive: boolean;
}

const Employees = () => {
    const navigation = useNavigation<any>();

    const [activeTab, setActiveTab] = useState('Doctors, Dentists, and Paramedics');
    const [searchLastName, setSearchLastName] = useState('');
    const [searchFirstName, setSearchFirstName] = useState('');
    const [searchPWZ, setSearchPWZ] = useState('');
    const [onlyActive, setOnlyActive] = useState(false);
    const [recordsPerPage, setRecordsPerPage] = useState(10);
    const [showRecordsPicker, setShowRecordsPicker] = useState(false);
    const recordsOptions = [10, 25, 50];

    const [employees] = useState<Employee[]>([
        {
            id: '1',
            fullName: 'Tahery Cyrus',
            login: 'cyrus_tahery6',
            pwz: '3883164',
            isActive: true
        }
    ]);

    const employeeTabs = [
        'Doctors, Dentists, and Paramedics',
        'Nurses and Midwives',
        'Receptionists',
    ];

    return (
        <SafeAreaView style={styles.safeArea} edges={['bottom']}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>

                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingRight: 10 }}>
                        <Ionicons name="chevron-back" size={24} color="#333" />
                    </TouchableOpacity>
                    <View style={styles.headerIconBox}>
                        <Feather name="users" size={22} color="#4A90B9" />
                    </View>
                    <Text style={styles.headerTitle}>Employees</Text>
                </View>

                {/* Main Card */}
                <View style={styles.card}>

                    {/* Category Tabs */}
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.tabScrollView}
                        contentContainerStyle={styles.tabScrollContent}
                    >
                        {employeeTabs.map((tab) => (
                            <TouchableOpacity
                                key={tab}
                                style={[
                                    styles.tabChip,
                                    activeTab === tab && styles.tabChipActive
                                ]}
                                onPress={() => setActiveTab(tab)}
                            >
                                <Text style={[
                                    styles.tabChipText,
                                    activeTab === tab && styles.tabChipTextActive
                                ]}>
                                    {tab}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    {/* Action Buttons Row */}
                    <View style={styles.actionsRow}>
                        <View style={styles.actionsLeft}>
                            <PrimaryButton
                                label="GROUP PERMISSIONS"
                                filled={false}
                                onPress={() => { }}
                                style={styles.outlineBtn}
                            />
                            <PrimaryButton
                                label="RATINGS"
                                filled={false}
                                onPress={() => { }}
                                style={styles.outlineBtnSmall}
                            />
                        </View>
                        <PrimaryButton
                            label="+ Add Doctor/Dentist/Paramedic"
                            filled={true}
                            onPress={() => { }}
                            style={styles.addBtn}
                        />
                    </View>

                    {/* Info Banner */}
                    <View style={styles.infoBanner}>
                        <Feather name="users" size={18} color="#2563EB" />
                        <Text style={styles.infoBannerText}>
                            Total number of users eligible for subscription fees: (3. Maximum number of users from purchased packages 7). 0
                        </Text>
                    </View>

                    {/* Search Filters */}
                    <View style={styles.searchRow}>
                        <View style={styles.searchField}>
                            <Ionicons name="search-outline" size={16} color="#9CA3AF" style={styles.searchFieldIcon} />
                            <TextInput
                                style={styles.searchFieldInput}
                                placeholder="Last Name"
                                placeholderTextColor="#9CA3AF"
                                value={searchLastName}
                                onChangeText={setSearchLastName}
                            />
                        </View>
                        <View style={styles.searchField}>
                            <Ionicons name="search-outline" size={16} color="#9CA3AF" style={styles.searchFieldIcon} />
                            <TextInput
                                style={styles.searchFieldInput}
                                placeholder="First Name"
                                placeholderTextColor="#9CA3AF"
                                value={searchFirstName}
                                onChangeText={setSearchFirstName}
                            />
                        </View>
                        <View style={styles.searchField}>
                            <Ionicons name="search-outline" size={16} color="#9CA3AF" style={styles.searchFieldIcon} />
                            <TextInput
                                style={styles.searchFieldInput}
                                placeholder="PWZ"
                                placeholderTextColor="#9CA3AF"
                                value={searchPWZ}
                                onChangeText={setSearchPWZ}
                            />
                        </View>
                    </View>

                    <View style={styles.filterExtrasRow}>
                        <CustomCheckbox label="Only Active" checked={onlyActive} onChange={setOnlyActive} />
                        <TouchableOpacity style={styles.searchIconBtn}>
                            <Ionicons name="search" size={18} color="#4A90B9" />
                        </TouchableOpacity>
                    </View>

                    {/* Horizontally Scrollable Table */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={true} style={styles.tableScrollView}>
                        <View style={styles.tableInner}>
                            {/* Table Header */}
                            <View style={styles.tableHeader}>
                                <Text style={[styles.tableHeaderCell, { width: 180 }]}>LAST NAME AND FIRST NAME</Text>
                                <Text style={[styles.tableHeaderCell, { width: 140 }]}>LOGIN</Text>
                                <Text style={[styles.tableHeaderCell, { width: 120 }]}>PWZ/PESEL</Text>
                                <Text style={[styles.tableHeaderCell, { width: 120 }]}>STATUS</Text>
                                <Text style={[styles.tableHeaderCell, { width: 100, textAlign: 'right' }]}>ACTIONS</Text>
                            </View>

                            {/* Employee Rows */}
                            {employees.length > 0 ? (
                                employees.map((item) => (
                                    <View key={item.id} style={styles.tableRow}>
                                        <Text style={[styles.tableCell, styles.tableCellName, { width: 180 }]}>{item.fullName}</Text>
                                        <Text style={[styles.tableCell, { width: 140 }]}>{item.login}</Text>
                                        <Text style={[styles.tableCell, { width: 120 }]}>{item.pwz}</Text>
                                        <View style={{ width: 120 }}>
                                            <View style={[styles.statusBadge, item.isActive ? styles.statusActive : styles.statusInactive]}>
                                                <Text style={[styles.statusBadgeText, item.isActive ? styles.statusActiveText : styles.statusInactiveText]}>
                                                    {item.isActive ? 'Active' : 'Inactive'}
                                                </Text>
                                            </View>
                                        </View>
                                        <View style={{ width: 100, flexDirection: 'row', justifyContent: 'flex-end', gap: 8 }}>
                                            <TouchableOpacity style={styles.rowActionBtn}>
                                                <Ionicons name="create-outline" size={20} color="#4A90B9" />
                                            </TouchableOpacity>
                                            <TouchableOpacity style={styles.rowActionBtn}>
                                                <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                ))
                            ) : (
                                <View style={styles.emptyState}>
                                    <Text style={styles.emptyStateText}>No employees found</Text>
                                </View>
                            )}
                        </View>
                    </ScrollView>

                    {/* Pagination */}
                    <View style={styles.paginationRow}>
                        <View>
                            <TouchableOpacity
                                style={styles.recordsDropdown}
                                onPress={() => setShowRecordsPicker(!showRecordsPicker)}
                            >
                                <Text style={styles.recordsDropdownText}>{recordsPerPage}</Text>
                                <Ionicons name={showRecordsPicker ? "chevron-up" : "chevron-down"} size={16} color="#374151" />
                            </TouchableOpacity>
                            {showRecordsPicker && (
                                <View style={styles.recordsPickerOverlay}>
                                    {recordsOptions.map((option) => (
                                        <TouchableOpacity
                                            key={option}
                                            style={[
                                                styles.recordsPickerItem,
                                                recordsPerPage === option && styles.recordsPickerItemActive
                                            ]}
                                            onPress={() => {
                                                setRecordsPerPage(option);
                                                setShowRecordsPicker(false);
                                            }}
                                        >
                                            <Text style={[
                                                styles.recordsPickerItemText,
                                                recordsPerPage === option && styles.recordsPickerItemTextActive
                                            ]}>{option}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                        </View>
                        <Text style={styles.paginationInfo}>records per page</Text>
                        <View style={styles.paginationControls}>
                            <TouchableOpacity style={styles.paginationBtn}>
                                <Text style={styles.paginationBtnText}>Prev</Text>
                            </TouchableOpacity>
                            <View style={styles.pageNumber}>
                                <Text style={styles.pageNumberText}>1</Text>
                            </View>
                            <TouchableOpacity style={styles.paginationBtn}>
                                <Text style={styles.paginationBtnText}>Next</Text>
                            </TouchableOpacity>
                        </View>
                        {/* <Text style={styles.paginationTotal}>total results: {employees.length}</Text> */}
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#FFFFFF',
    },
    headerIconBox: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: '#EBF5FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111827',
    },
    card: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: 1,
        marginTop: 12,
        borderRadius: 14,
        padding: 14,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },

    /* Tabs */
    tabScrollView: {
        marginBottom: 16,
    },
    tabScrollContent: {
        gap: 10,
    },
    tabChip: {
        paddingVertical: 9,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
    },
    tabChipActive: {
        backgroundColor: '#4A90B9',
    },
    tabChipText: {
        fontSize: 15,
        fontWeight: '500',
        color: '#374151',
    },
    tabChipTextActive: {
        color: '#FFFFFF',
    },

    /* Action Buttons */
    actionsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        gap: 10,
    },
    actionsLeft: {
        flexDirection: 'row',
        gap: 10,
    },
    outlineBtn: {
        width: 'auto',
        paddingHorizontal: 14,
        height: hp(4.5),
        marginBottom: 0,
        borderRadius: 8,
    },
    outlineBtnSmall: {
        width: 'auto',
        paddingHorizontal: 14,
        height: hp(4.5),
        marginBottom: 0,
        borderRadius: 8,
    },
    addBtn: {
        width: '100%',
        height: hp(5),
        marginBottom: 0,
        borderRadius: 8,
    },

    /* Info Banner */
    infoBanner: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#EFF6FF',
        padding: 14,
        borderRadius: 10,
        marginBottom: 16,
        gap: 10,
    },
    infoBannerText: {
        flex: 1,
        fontSize: 14,
        color: '#2563EB',
        lineHeight: 21,
    },

    /* Search */
    searchRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 12,
    },
    searchField: {
        flex: 1,
        minWidth: wp(28),
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 10,
        paddingHorizontal: 10,
        height: 42,
    },
    searchFieldIcon: {
        marginRight: 6,
    },
    searchFieldInput: {
        flex: 1,
        fontSize: 15,
        color: '#111827',
        padding: 0,
    },
    filterExtrasRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 12,
        marginBottom: 16,
    },
    searchIconBtn: {
        width: 36,
        height: 36,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        justifyContent: 'center',
        alignItems: 'center',
    },

    /* Table */
    tableScrollView: {
        marginBottom: 8,
    },
    tableInner: {
        minWidth: 660,
    },
    tableHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        backgroundColor: '#FAFBFC',
    },
    tableHeaderCell: {
        fontSize: 12,
        fontWeight: '700',
        color: '#6B7280',
        letterSpacing: 0.5,
    },
    tableRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    tableCell: {
        fontSize: 14,
        color: '#374151',
    },
    tableCellName: {
        fontWeight: '600',
        color: '#111827',
    },
    statusBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 12,
    },
    statusActive: {
        backgroundColor: '#DEF7EC',
    },
    statusInactive: {
        backgroundColor: '#FDE8E8',
    },
    statusBadgeText: {
        fontSize: 13,
        fontWeight: '600',
    },
    statusActiveText: {
        color: '#03543F',
    },
    statusInactiveText: {
        color: '#9B1C1C',
    },
    rowActionBtn: {
        padding: 6,
        borderRadius: 6,
        backgroundColor: '#F9FAFB',
    },
    emptyState: {
        paddingVertical: 40,
        alignItems: 'center',
    },
    emptyStateText: {
        fontSize: 16,
        color: '#9CA3AF',
    },

    /* Pagination */
    paginationRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        marginTop: 4,
    },
    paginationInfo: {
        fontSize: 14,
        color: '#6B7280',
    },
    paginationControls: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    paginationBtn: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
        backgroundColor: '#F3F4F6',
    },
    paginationBtnText: {
        fontSize: 14,
        color: '#374151',
        fontWeight: '500',
    },
    pageNumber: {
        width: 28,
        height: 28,
        borderRadius: 6,
        backgroundColor: '#4A90B9',
        justifyContent: 'center',
        alignItems: 'center',
    },
    pageNumberText: {
        fontSize: 14,
        color: '#FFFFFF',
        fontWeight: '700',
    },
    paginationTotal: {
        fontSize: 14,
        color: '#6B7280',
    },
    recordsDropdown: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        gap: 6,
        backgroundColor: '#FFFFFF',
    },
    recordsDropdownText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
    },
    recordsPickerOverlay: {
        position: 'absolute',
        bottom: 44,
        left: 0,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
        overflow: 'hidden',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        zIndex: 10,
        minWidth: 70,
    },
    recordsPickerItem: {
        paddingVertical: 10,
        paddingHorizontal: 16,
    },
    recordsPickerItemActive: {
        backgroundColor: '#EBF5FF',
    },
    recordsPickerItemText: {
        fontSize: 14,
        color: '#374151',
        textAlign: 'center',
    },
    recordsPickerItemTextActive: {
        color: '#4A90B9',
        fontWeight: '700',
    },
});

export default Employees;