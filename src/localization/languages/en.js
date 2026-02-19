export const en = {
    validation: {
        field_required: 'This field is required',
        invalid_email: 'Please enter a valid email address',
        password_min_length: 'Password must be at least 6 characters long',
    },
    common: {
        search: 'Search',
        cancel: 'Cancel',
        save: 'Save',
        delete: 'Delete',
        edit: 'Edit',
        back: 'Back',
        next: 'Next',
        finish: 'Finish',
        loading: 'Loading...',
        noData: 'No data',
        yes: 'Yes',
        no: 'No',
        total: 'total',
        view: 'View',
        more: 'More',
        time: 'Time',
        patient: 'Patient',
        status: 'Status',
        type: 'Type',
        actions: 'Actions',
        filters: 'Filters',
        from: 'From',
        to: 'To',
        "add": "Add",
        "update": "Update",

    },
    loading: {
        psychiatricModule: 'Psychiatric Module',
        initializingModule: 'Initializing module...'
    },
    auth: {
        login: 'Login',
        logout: 'Logout',
        email: 'Email',
        password: 'Password'
    },

    dashboard: {
        title: 'Dashboard',
        overview: 'Overview of key information',
        todayPatients: "Today's Patients",
        pendingReports: 'Pending Reports',
        scheduledVisits: 'Scheduled Visits',
        completedVisits: 'Completed Visits',
        calendar: {
            title: 'Visits for',
            noVisits: 'No scheduled visits for this day'
        },
        quickActions: {
            title: 'Quick Actions',
            scheduleVisit: 'Schedule Visit',
            newDocument: 'New Document',
            messages: 'Messages',
            teleVisit: 'Tele-visit',
            reports: 'Reports',
            patients: 'Patients'
        }
    },
    patients: {
        search: 'Search patient',
        new: 'New patient',
        list: 'Patient list',
        profile: 'Patient profile',
        appointments: 'Appointments',
        documents: 'Documents',
        history: 'History'
    },
    status: {
        scheduled: 'Scheduled',
        inProgress: 'In Progress',
        completed: 'Completed'
    },
    visit: {
        new: 'New visit',
        start: 'Start Visit',
        type: {
            followUp: 'Follow-up',
            first: 'First Visit',
            consultation: 'Consultation'
        },
        steps: {
            profile: 'Profile',
            interview: 'Interview',
            examination: 'Examination',
            diagnosis: 'Diagnosis',
            documents: 'Documents',
            summary: 'Summary'
        },
        profile: {
            title: 'Patient Profile',
            basicInfo: 'Basic Information',
            pesel: 'PESEL',
            dateOfBirth: 'Date of Birth',
            allergies: 'Allergies',
            chronicDiseases: 'Chronic Diseases',
            history: 'Visit History',
            audit: 'Change History',
            trends: 'Trend Analysis',
            noAllergies: 'No known allergies',
            noDiseases: 'No chronic diseases'
        },
        interview: {
            title: 'Medical Interview',
            mainSymptoms: 'Main Symptoms',
            symptomsOnset: 'Symptoms Onset',
            currentMedications: 'Current Medications',
            additionalNotes: 'Additional Notes',
            previousVisits: 'Previous Visits',
            showPreviousVisits: 'Show Previous Visits',
            addMedication: 'Add Medication',
            scales: {
                title: 'Psychiatric Scales',
                selectScale: 'Select Scale',
                hamd: 'Hamilton Depression Scale',
                madrs: 'Montgomery-Åsberg Depression Scale',
                asrs: 'ADHD Symptoms Scale',
                hama: 'Hamilton Anxiety Scale',
                isi: 'Insomnia Severity Index',
                cars2: 'Childhood Autism Rating Scale'
            }
        },
        examination: {
            title: 'Physical Examination',
            bloodPressure: 'Blood Pressure',
            heartRate: 'Heart Rate',
            temperature: 'Temperature',
            weight: 'Weight',
            height: 'Height',
            generalCondition: 'General Condition',
            additionalFindings: 'Additional Findings'
        },
        diagnosis: {
            title: 'Diagnosis (ICD-10)',
            searchPlaceholder: 'Search ICD-10 code or diagnosis name...',
            type: {
                primary: 'Primary',
                secondary: 'Secondary'
            },
            actions: {
                add: 'Add diagnosis',
                remove: 'Remove'
            }
        },
        documents: {
            title: 'Documents',
            prescriptions: {
                title: 'Prescriptions',
                new: 'New Prescription',
                refills: 'Number of Refills',
                searchMed: 'Search medication...',
                dosage: 'Dosage',
                quantity: 'Quantity',
                instructions: 'Additional Instructions'
            },
            sickLeave: {
                title: 'Sick Leave',
                add: 'Add Sick Leave',
                remove: 'Remove Sick Leave',
                startDate: 'Start Date',
                endDate: 'End Date',
                reason: 'Reason',
                recommendations: 'Recommendations'
            },
            referrals: {
                title: 'Referrals',
                new: 'New Referral',
                specialization: 'Specialization',
                reason: 'Reason for Referral',
                urgency: {
                    label: 'Urgency',
                    normal: 'Normal',
                    urgent: 'Urgent',
                    immediate: 'Immediate'
                },
                additionalNotes: 'Additional Notes'
            }
        },
        summary: {
            title: 'Visit Summary',
            sections: {
                diagnoses: 'Diagnoses',
                documents: 'Issued Documents',
                recommendations: 'Psychiatric Recommendations',
                nextVisit: 'Next Visit',
                generalRecommendations: 'General Recommendations'
            },
            actions: {
                addRecommendations: 'Add Recommendations',
                finish: 'Finish Visit'
            }
        },
        ai: {
            title: 'AI Assistants',
            tabs: {
                cds: 'Decision Support',
                interview: 'Interview Coach',
                transcription: 'Documentation Assistant',
                interactions: 'Drug Knowledge',
                icd10: 'ICD-10 Assistant'
            }
        },
        navigation: {
            previous: 'Back',
            next: 'Next',
            finish: 'Finish'
        }
    },
    ai: {
        assistant: 'AI Assistant',
        documentation: 'Documentation Assistant',
        diagnosis: 'Differential Diagnosis',
        drugInteractions: 'Drug Interactions',
        transcription: 'Voice Transcription'
    },
    "visitWizard": {
        title: "Create a new visit",
        "form": {
            "date": "Date",
            "startTime": "Start Time",
            "endTime": "End Time",
            "patient": "Patient",
            "office": "Office",
            "selectOffice": "Select an office",
            "visitType": "Visit Type",
            "visitTypes": {
                "private": "Private",
                "nfz": "NFZ (National Health Fund)"
            },
            "specialization": "Specialization",
            "selectSpecialization": "Select a specialization",
            "specializations": {
                "psychiatry": "Psychiatry",
                "neurology": "Neurology",
                "cardiology": "Cardiology"
            },
            "options": {
                "isOnline": "Online visit",
                "isPrescription": "Prescription needed",
                "isReferral": "Referral needed"
            },
            "notes": "Notes",
            "additionalNotes": "Add additional notes...",
            "submitButton": "Schedule Visit"
        },
        "validation": {
            "required": "This field is required",
            "patientRequired": "Please select a patient",
            "endTimeAfterStart": "End time must be after start time"
        },
        "success": {
            "title": "Visit Scheduled",
            "message": "The visit has been successfully scheduled"
        },
        "error": {
            "title": "Error",
            "message": "There was an error scheduling the visit. Please try again."
        },
        actions: {
            cancel: "Cancel",
            save: "Save",
            submit: "Schedule Visit"
        }
    },
    nav: {
        patients: {
            title: 'Patients',
            search: 'Search patient',
            new: 'New patient',
            list: 'Patient list',
            appointments: 'Scheduled visits'
        },
        services: {
            title: 'Services',
            newVisit: 'New visit',
            labOrders: 'Lab orders',
            documents: 'Documentation',
            prescriptions: 'e-Prescriptions',
            aiAssistants: 'AI Assistants'
        },
        reports: {
            title: 'Reports',
            statistics: 'Statistics',
            aiAnalysis: 'AI Analysis',
            medicalReports: 'Medical reports',
            billing: 'Billing'
        }
    },
    newPatient: {
        title: 'New Patient',
        description: 'Enter new patient data',
        personalData: 'Personal Data',
        form: {
            firstName: 'First Name',
            lastName: 'Last Name',
            pesel: 'PESEL',
            dateOfBirth: 'Date of Birth',
            gender: 'Gender',
            selectGender: 'Select gender',
            genders: {
                male: 'Male',
                female: 'Female',
                other: 'Other'
            },
            phone: 'Phone',
            address: {
                title: 'Address',
                street: 'Street',
                houseNumber: 'House No.',
                apartmentNumber: 'Apartment No.',
                postalCode: 'Postal Code',
                city: 'City'
            },
            insurance: {
                title: 'Insurance',
                type: 'Insurance Type',
                types: {
                    nfz: 'NFZ',
                    private: 'Private',
                    none: 'None'
                },
                number: 'Insurance No.'
            },
            submit: 'Save patient'
        }
    },
    patientSearch: {
        title: 'Search Patients',
        description: 'Search patients by name, PESEL number or card number',
        searchPlaceholder: 'Name, PESEL or card number...',
        enterCriteria: 'Enter search criteria to see results',
        filters: {
            birthDate: 'Date of Birth',
            gender: 'Gender',
            allGenders: 'All',
            genders: {
                male: 'Male',
                female: 'Female',
                other: 'Other'
            },
            lastVisit: 'Last Visit',
            nextVisit: 'Next Visit',
            hasPesel: 'Has PESEL',
            hasDeclaration: 'Has Declaration',
            isDeceased: 'Deceased',
            hasDebt: 'Has Debt',
            isActive: 'Active',
            longAbsent: 'Long Absent',
            clear: 'Clear filters',
            apply: 'Apply filters'
        }
    },
    patientList: {
        title: 'Patient List',
        description: 'Manage patient records',
        table: {
            patient: 'Patient',
            pesel: 'PESEL',
            dateOfBirth: 'Date of birth',
            lastVisit: 'Last visit',
            status: 'Status',
            actions: 'Actions'
        },
        actions: {
            export: 'Export',
            print: 'Print',
            filters: 'Filters'
        },
        status: {
            active: 'Active',
            inactive: 'Inactive',
            archived: 'Archived'
        },
        noData: 'No patients to display'
    },
    appointments: {
        title: 'Scheduled Visits',
        description: 'Manage visit schedule',
        actions: {
            back: 'Back',
            filters: 'Filters',
            newVisit: 'New Visit',
            clearFilters: 'Clear filters',
            applyFilters: 'Apply filters'
        },
        search: {
            doctor: 'Search doctor...',
            patient: 'Search patient...'
        },
        filters: {
            visitDate: 'Visit date',
            visitTime: 'Visit time',
            visitType: {
                label: 'Visit type',
                all: 'All',
                nfz: 'NFZ',
                private: 'Private'
            },
            status: {
                label: 'Status',
                all: 'All',
                scheduled: 'Scheduled',
                confirmed: 'Confirmed',
                inProgress: 'In Progress',
                completed: 'Completed',
                cancelled: 'Cancelled'
            },
            appointmentType: {
                label: 'Appointment type',
                all: 'All',
                psychiatric: 'Psychiatric',
                psychotherapy: 'Psychotherapy',
                consultation: "consultation",
                other: "other"
            },
            hasReferral: 'Has referral'
        },
        calendar: {
            day: 'Day',
            week: 'Week',
            month: 'Month'
        }
    },
    module: {
        module_select: "Select a module to start working",
        psyModule: "Psychiatric module",
        psychiatry: "Psychiatry",
        comprehensive_tool: "Comprehensive tool for psychiatric documentation, powered by artificial intelligence.",
        intelligent_psychiatric_scales: "Intelligent psychiatric scales",
        emotion_and_behavior_analysis: "Emotion and behavior analysis",
        ai_diagnose: "AI diagnostic assistant",
        coming_soon: "Coming soon",
        primary_care: "Primary Healthcare",
        system_description: "Comprehensive system for managing primary care practice, with e-prescription and e-referral integration.",
        p1_integration: "P1 Integration",
        declaration_management: "Declaration management",
        nfz_settlements: "NFZ settlements"



    },

    login: {
        "welcome_back": "Welcome back",
        "email_placeholder": "Email",
        "password_placeholder": "Password",
        "email_required": "Please input your email!",
        "email_invalid": "Please enter a valid email!",
        "password_required": "Please input your password!",
        "login_button": "Log in",
        "or": "or",
        "continue_with_google": "Continue with Google",
        "forgot_password": "Forgot password?",
        "no_account": "Don't have an account?",
        "sign_up": "Sign up",
        "login_success": "Login successful!!"
    },

    signup: {
        "create_account": "Create your account",
        "name_placeholder": "Full Name",
        "email_placeholder": "Email",
        "password_placeholder": "Password",
        "name_required": "Please input your name!",
        "name_min_length": "Name must be at least 2 characters long",
        "email_required": "Please input your email!",
        "email_invalid": "Please enter a valid email!",
        "password_required": "Please input your password!",
        "password_min_length": "Password must be at least 6 characters long",
        "signup_button": "Sign up",
        "or": "or",
        "continue_with_google": "Continue with Google",
        "have_account": "Already have an account?",
        "sign_in": "Sign In",
        "registration_success": "Registration successful. Please check your email for verification."

    },
    forgot_password: {
        "title": "Forgot Password",
        "reset_instructions": "Enter your email and we'll send you otp code to reset your password",
        "email_placeholder": "Email",
        "email_required": "Please input your email!",
        "email_invalid": "Please enter a valid email!",
        "send_button": "Send",
        "back_to_login": "Back to Login",
        "otp_success": "OTP sent to your email"

    },

    "otp": {
        "verify_email_title": "Verify Your Email",
        "reset_password_title": "Reset your password",
        "verification_sent": "We've sent a verification code to your email",
        "code_required": "Please input the verification code!",
        "enter_all_digits": "Please enter all 6 digits!",
        "verify_button": "Verify",
        "didnt_receive_code": "Didn't receive the code?",
        "resend_otp": "Resend OTP",
        "resend_countdown": "Resend in {{seconds}}s",
        "back_to_login": "Back to Login",
        "otp_verified": "OTP Verified",
        "new_otp_sent": "New OTP sent successfully"

    },

    "reset_password": {
        "title": "Reset New Password",
      "subtitle": "Please enter your new password",
      "new_password_placeholder": "New Password",
      "confirm_password_placeholder": "Confirm Password",
      "password_required": "Please input your password!",
      "password_min_length": "Password must be at least 6 characters long",
      "confirm_password_required": "Please confirm your password!",
      "passwords_not_match": "The two passwords do not match!",
      "reset_button": "Reset Password",
      "back_to_login": "Back to Login",
      "reset_success": "Reset password successful."

    },
    "patient_profile": {
        "title": "Patient Profile",
        "subtitle": "Manage patient data and medical documentation",
        "back_button": "Back"
    },
    "patient_header": {
        "pesel_label": "PESEL",
        "age_label": "Age",
        "age_years": "years",
        "ewus_button": "eWUŚ",
        "cez_button": "CEZ",
        "documents_button": "Documents",
        "visits_button": "Visits"
    },
    "patient_tabs": {
        "personal_data": "Personal Data",
        "medical_data": "Medical Data",
        "laboratory": "Laboratory",
        "documents": "Documents",
        "visits_list": "Visits List",
        "insurance": "Insurance",
        "history": "Leave/SMS History"
    },
    "basic_info": {
        "save_error": "Failed to save data",
        "title": "Basic Information",
        "loading": "Loading...",
        "error_prefix": "Error: ",
        "fields": {
            "pesel": "PESEL",
            "first_name": "First Name",
            "last_name": "Last Name",
            "date_of_birth": "Date of Birth",
            "middle_name": "Middle Name",
            "maiden_name": "Maiden Name",
            "birth_place": "Place of Birth",
            "gender": "Gender",
            "email": "Email",
            "phone": "Phone"
        },
        "sections": {
            "basic_data": "Basic Data",
            "optional_data": "Optional Data",
            "contact_data": "Contact Data"
        },

        "gender_options": {
            "unknown": "Unknown",
            "male": "Male",
            "female": "Female",
            "other": "Other"
        },
        "submit_button": "Submit"

    },

    "address_form": {

        title: "Address",
        "checkboxes": {
            "same_address": "Registered address same as residential address",
            "unknown_address": "Address unknown"
        },
        "sections": {
            "residential_address": "Residential Address"
        },
        "fields": {
            "street": "Street",
            "house_number": "House Number",
            "apartment_number": "Apartment Number",
            "postal_code": "Postal Code",
            "city": "City",
            "voivodeship": "Voivodeship",
            "country": "Country",
            "teryt_code": "TERYT Municipality Code"
        },
        "voivodeships": {
            "select": "Select voivodeship",
            "dolnoslaskie": "Dolnośląskie",
            "kujawsko_pomorskie": "Kujawsko-pomorskie",
            "lubelskie": "Lubelskie",
            "lubuskie": "Lubuskie",
            "lodzkie": "Łódzkie",
            "malopolskie": "Małopolskie",
            "mazowieckie": "Mazowieckie",
            "opolskie": "Opolskie",
            "podkarpackie": "Podkarpackie",
            "podlaskie": "Podlaskie",
            "pomorskie": "Pomorskie",
            "slaskie": "Śląskie",
            "swietokrzyskie": "Świętokrzyskie",
            "warminsko_mazurskie": "Warmińsko-mazurskie",
            "wielkopolskie": "Wielkopolskie",
            "zachodniopomorskie": "Zachodniopomorskie"
        },
        "countries": {
            "poland": "Poland",
            "germany": "Germany",
            "uk": "United Kingdom",
            "france": "France"
        },
        "submit": "Submit"
    },

    "insurance_form": {
        title: "Insurance",
        "nfz": {
            "title": "Insured in NFZ:",
            "branch": "Branch",
            "additional_rights": "Additional Rights",
            "branches": {
                "warsaw": "07 NFZ Warsaw",
                "dolnoslaskie": "01 NFZ Dolnośląskie",
                "kujawsko_pomorskie": "02 NFZ Kujawsko-Pomorskie",
                "lubelskie": "03 NFZ Lubelskie",
                "lubuskie": "04 NFZ Lubuskie",
                "lodzkie": "05 NFZ Łódzkie",
                "malopolskie": "06 NFZ Małopolskie",
                "opolskie": "08 NFZ Opolskie",
                "podkarpackie": "09 NFZ Podkarpackie",
                "podlaskie": "10 NFZ Podlaskie",
                "pomorskie": "11 NFZ Pomorskie",
                "slaskie": "12 NFZ Śląskie",
                "swietokrzyskie": "13 NFZ Świętokrzyskie",
                "warminsko_mazurskie": "14 NFZ Warmińsko-Mazurskie",
                "wielkopolskie": "15 NFZ Wielkopolskie",
                "zachodniopomorskie": "16 NFZ Zachodniopomorskie"
            },
            "rights": {
                "none": "X",
                "children": "DN - Children and youth under 18",
                "war_invalids": "IB - War invalids",
                "military_invalids": "IW - Military invalids",
                "forced_labor": "PO - Forced labor workers",
                "veterans": "WP - Injured veterans",
                "blood_donors": "ZK - Honorary blood donors"
            }
        },
        "private": {
            "title": "Private Insurers",
            "search_placeholder": "Search (Insurer)",
            "policy": "Policy",
            "valid_until": "Valid until",
            "no_insurers": "No private insurers added",
            "new_insurer": "New insurer",
            "add_insurer": "Add Insurer"
        },
        "submit": "Submit"

    },

    "employer_form": {
        title: "Employer",
        "sections": {
            "employer": "Employer",
            "address": "Address"
        },
        "fields": {
            "employer_name": "Employer Name",
            "employer_nip": "Employer NIP",
            "occupation": "Occupation",
            "production_symbol": "Production and Service Group Symbol",
            "fill_from_nip": "FILL FIELDS FROM NIP",
            "street": "Street",
            "house_number": "House Number",
            "apartment_number": "Apartment Number",
            "postal_code": "Postal Code",
            "city": "City",
            "voivodeship": "Voivodeship",
            "country": "Country"
        },
        "voivodeships": {
            "select": "---------",
            "dolnoslaskie": "Dolnośląskie",
            "kujawsko_pomorskie": "Kujawsko-pomorskie",
            "lubelskie": "Lubelskie",
            "lubuskie": "Lubuskie",
            "lodzkie": "Łódzkie",
            "malopolskie": "Małopolskie",
            "mazowieckie": "Mazowieckie",
            "opolskie": "Opolskie",
            "podkarpackie": "Podkarpackie",
            "podlaskie": "Podlaskie",
            "pomorskie": "Pomorskie",
            "slaskie": "Śląskie",
            "swietokrzyskie": "Świętokrzyskie",
            "warminsko_mazurskie": "Warmińsko-mazurskie",
            "wielkopolskie": "Wielkopolskie",
            "zachodniopomorskie": "Zachodniopomorskie"
        },
        "countries": {
            "poland": "Poland",
            "germany": "Germany",
            "uk": "United Kingdom",
            "france": "France"
        },
        "submit": "Submit"
    },


    "authorized_persons": {
        title: "AUTHORIZED PERSONS AND LIST OF SHARED MEDICAL DOCUMENTATION",
        "toggles": {
            "no_authorized_persons": "Patient does not authorize anyone",
            "current_version_signed": "Patient signed current version of authorization"
        },
        "buttons": {
            "no_authorization_statement": "NO AUTHORIZATION - STATEMENT",
            "add_authorized_person": "ADD AUTHORIZED PERSON"
        },
        "messages": {
            "no_authorized_persons": "No authorized persons added",
            "no_documentation_records": "No saved confirmations..."
        },
        "sections": {
            "documentation_access": "Medical documentation access list"
        },
        "submit": "Submit"

    },

    "authorized_person_card": {
        "fields": {
            "first_name": "First Name",
            "last_name": "Last Name",
            "relationship": "Relationship Degree",
            "pesel": "PESEL",
            "phone": "Phone",
            "email": "Email",
            "address": "Address",
            "document_type": "Document Type",
            "document_number": "Document Number",
            "valid_until": "Valid Until"
        },
        "document_types": {
            "select": "Select type",
            "id_card": "ID Card",
            "passport": "Passport",
            "drivers_license": "Driver's License"
        },
        "buttons": {
            "remove_person": "Remove authorized person"
        }

    },
    // consent_form: {
    //   title: "Consent to the processing of personal data",
    //   "submit": "Submit",

    // },
    // "consentCard": {
    //   "granted": "Granted",
    //   "noConsent": "No consent",
    //   "withdraw": "Withdraw",
    //   "grantConsent": "Grant consent"
    // },
    "insuranceHistory": {
        title: "INSURANCE HISTORY",
        "searchPlaceholder": "Search in insurance history...",
        "filter": "Filter",
        "export": "Export",
        "noHistory": "No insurance history"
    },
    "insuranceCard": {
        "status": {
            "active": "Active",
            "expired": "Expired",
            "unknown": "Unknown"
        },
        "fields": {
            "insurer": "Insurer:",
            "policyNumber": "Policy Number:",
            "coverage": "Insurance Coverage:",
            "notes": "Notes:"
        }

    },


    visit_history: {
        title: "VISIT HISTORY"
    },
    "visitsForm": {
        "search": {
            "placeholder": "Search in visit history...",
            "filter": "Filter",
            "export": "Export"
        },
        "noVisits": "No visit history",
        "sections": {
            "medicalInterview": "Medical Interview",
            "demographics": {
                "title": "Demographics",
                "education": "Education:",
                "occupation": "Occupation:",
                "maritalStatus": "Marital Status:",
                "livingArrangement": "Living Arrangement:"
            },
            "diagnoses": "Diagnoses",
            "medications": "Medications",
            "labResults": "Lab Results",
            "psychometricTests": "Psychometric Tests",
            "points": "pts"
        }
    },
    document_section: {
        title: "MEDICAL DOCUMENTATION"
    },

    documentsForm: {
        title: "hamza",
        "search": {
            "placeholder": "Search in documents..."
        },
        "buttons": {
            "filter": "Filter",
            "export": "Export",
            "newDocument": "New document"
        },
        "noDocuments": "No documents"
    },
    lab_result: {
        title: "TEST RESULTS"
    },
    "labResults": {
        "search": {
            "placeholder": "Search in lab results..."
        },
        "buttons": {
            "filter": "Filter",
            "export": "Export",
            "addResults": "Add results",
            "download": "Download",
            "preview": "Preview"
        },
        "noResults": "No lab results"
    },

    medical_data: {
        medicine: "Medicines",
        diagnosis: "Diagnosis",
        allergies: "Allergies and intolerances",
        chronic_diseases: "Chronic diseases",
        family_interview: "Family interview",
        risk_factors: "Risk factors"


    },

    "medications": {
        "sections": {
            "regular": "Regular Medications",
            "asNeeded": "As Needed Medications",
            "history": "Medication History"
        },
        "buttons": {
            "addMedication": "Add Medication",
            "cancel": "Cancel",
            "end": "End",
            "add": "Add"
        },
        "modal": {
            "title": "Add Medication",
            "searchPlaceholder": "Search medication...",
            "regularMedication": "Regular medication"
        },
        "medicationCard": {
            "dosage": "Dosage:",
            "from": "From",
            "notes": "Notes:",
            "currently": "currently"
        },
        "confirmDelete": "Are you sure you want to remove this medication?"
    },


    "diagnoses": {
        "sections": {
            "active": "Current Diagnoses",
            "history": "Diagnosis History"
        },
        "buttons": {
            "addDiagnosis": "Add Diagnosis",
            "cancel": "Cancel",
            "add": "Add Diagnosis"
        },
        "modal": {
            "title": "Add Diagnosis",
            "searchPlaceholder": "Search diagnosis code or name...",
            "category": "Category:",
            "diagnosticCriteria": "Diagnostic Criteria:",
            "diagnosisType": {
                "label": "Diagnosis Type",
                "primary": "Primary",
                "secondary": "Co-existing"
            },
            "notes": {
                "label": "Notes",
                "placeholder": "Additional notes for diagnosis..."
            }
        },
        "diagnosisCard": {
            "from": "From",
            "notes": "Notes:",
            "status": {
                "active": "Active",
                "remission": "Remission",
                "resolved": "Resolved"
            },
            "type": {
                "primary": "Primary",
                "secondary": "Co-existing"
            }
        },
        "confirmDelete": "Are you sure you want to remove this diagnosis?"
    },



    "allergies": {
        "title": "Allergies and Intolerances",
        "buttons": {
            "addAllergy": "Add Allergy",
            "cancel": "Cancel",
            "add": "Add Allergy"
        },
        "modal": {
            "title": "Add Allergy",
            "allergyType": {
                "label": "Allergy Type",
                "drug": "Drug",
                "food": "Food",
                "environmental": "Environmental",
                "other": "Other"
            },
            "allergenName": {
                "label": "Allergen Name",
                "placeholder": "Enter allergen name..."
            },
            "reaction": {
                "label": "Allergic Reaction",
                "placeholder": "Describe allergic reaction..."
            },
            "severity": {
                "label": "Severity",
                "mild": "Mild",
                "moderate": "Moderate",
                "severe": "Severe"
            },
            "notes": {
                "label": "Notes",
                "placeholder": "Additional notes..."
            }
        },
        "allergyCard": {
            "reaction": "Reaction:",
            "diagnosed": "Diagnosed:",
            "notes": "Notes:",
            "noAllergies": "No registered allergies"
        },
        "confirmDelete": "Are you sure you want to remove this allergy?"
    }
    ,


    "chronicConditions": {
        "title": "Chronic Conditions",
        "buttons": {
            "addCondition": "Add Condition",
            "cancel": "Cancel",
            "add": "Add Condition"
        },
        "modal": {
            "title": "Add Chronic Condition",
            "conditionName": {
                "label": "Condition Name",
                "placeholder": "Search or enter condition name..."
            },
            "category": "Category:",
            "typicalTreatment": "Typical treatment:",
            "monitoringGuidelines": "Monitoring guidelines:",
            "status": {
                "label": "Status",
                "active": "Active",
                "remission": "Remission",
                "resolved": "Resolved"
            },
            "severity": {
                "label": "Severity",
                "mild": "Mild",
                "moderate": "Moderate",
                "severe": "Severe"
            },
            "treatment": {
                "label": "Treatment",
                "placeholder": "Describe current treatment..."
            },
            "notes": {
                "label": "Notes",
                "placeholder": "Additional notes..."
            }
        },
        "conditionCard": {
            "treatment": "Treatment:",
            "diagnosed": "Diagnosed:",
            "notes": "Notes:",
            "noConditions": "No chronic conditions"
        },
        "confirmDelete": "Are you sure you want to remove this disease?"
    }
    ,

    "familyHistory": {
        "title": "Family History",
        "buttons": {
            "addEntry": "Add Entry",
            "cancel": "Cancel",
            "add": "Add Entry",
            "submit": "Save"
        },
        "modal": {
            "title": "Add Family History",
            "condition": {
                "label": "Condition/Disease",
                "placeholder": "Search or enter condition name...",
                "category": "Category:"
            },
            "details": {
                "typicalOnset": "Typical age of onset:",
                "inheritancePattern": "Inheritance pattern:",
                "familyRisk": "Family risk:"
            },
            "relationship": {
                "label": "Relationship",
                "placeholder": "Select relationship"
            },
            "onsetAge": {
                "label": "Age of onset",
                "placeholder": "e.g. 45 years"
            },
            "name": {
                "label": "Disease Name",
                "placeholder": "e.g. Depression"
            },
            "notes": {
                "label": "Notes",
                "placeholder": "Additional notes..."
            }
        },
        "entryCard": {
            "relationship": "Relationship:",
            "onsetAge": "Age of onset:",
            "notes": "Notes:",
            "noEntries": "No family history entries"
        },
        "confirmDelete": "Are you sure you want to remove this entry?"
    },

    "riskFactors": {
        "title": "Risk Factors",
        "buttons": {
            "addFactor": "Add Factor",
            "cancel": "Cancel",
            "add": "Add Factor"
        },
        "modal": {
            "title": "Add Risk Factor",
            "category": {
                "label": "Category",
                "placeholder": "Select category"
            },
            "factor": {
                "label": "Risk Factor",
                "placeholder": "Search or enter risk factor..."
            },
            "riskLevel": {
                "label": "Risk Level",
                "low": "Low",
                "moderate": "Moderate",
                "high": "High"
            },
            "notes": {
                "label": "Notes",
                "placeholder": "Additional notes..."
            }
        },
        "factorCard": {
            "category": "Category:",
            "notes": "Notes:",
            "noFactors": "No registered risk factors"
        },
        "confirmDelete": "Are you sure you want to remove this risk factor?"
    },

    "visitActions": {
        "notes": {
            "add": "Add note",
            "edit": "Edit note",
            "delete": "Delete note",
            "placeholder": "Enter note...",
            "save": "Save",
            "saveChanges": "Save changes"
        },
        "visit": {
            "cancel": "Cancel visit",
            "confirmCancel": "Are you sure you want to cancel this visit?"
        },
        "buttons": {
            "cancel": "Cancel"
        },
        "modal": {
            "cancel": {
                "title": "Cancel visit",
                "message": "Are you sure you want to cancel this visit?",
                "ok": "Yes",
                "cancel": "No"
            }
        }
    },



    "analytics": {
        "header": {
            "title": "AI Statistical Analysis",
            "subtitle": "Advanced clinical data analysis powered by artificial intelligence"
        },
        "filters": {
            "timeRange": {
                "label": "Time Range",
                "options": {
                    "lastWeek": "Last Week",
                    "lastMonth": "Last Month",
                    "lastQuarter": "Last Quarter",
                    "lastYear": "Last Year",
                    "custom": "Custom Range"
                }
            },
            "department": {
                "label": "Department",
                "options": {
                    "all": "All Departments",
                    "adult": "Adult Department",
                    "child": "Children's Department",
                    "geriatric": "Geriatric Department"
                }
            },
            "doctors": {
                "label": "Doctors",
                "options": {
                    "all": "All Doctors"
                }
            },
            "metrics": {
                "label": "Metrics",
                "visits": "Visits",
                "diagnoses": "Diagnoses"
            }
        },
        "kpi": {
            "visits": {
                "title": "Visits",
                "trend": "+12.5% vs previous period"
            },
            "remissionTime": {
                "title": "Average Time to Remission",
                "value": "8.5 wks",
                "trend": "-15.3% vs previous period"
            },
            "treatmentEfficiency": {
                "title": "Treatment Efficiency",
                "trend": "+5.2% vs previous period"
            },
            "adherence": {
                "title": "Adherence",
                "trend": "+3.1% vs previous period"
            }
        },
        "charts": {
            "diagnosticTrends": {
                "title": "Diagnostic Trends",
                "series": {
                    "depression": "Depressive Episode",
                    "anxiety": "Anxiety Disorders",
                    "stress": "Stress Reaction"
                }
            },
            "treatmentOutcomes": {
                "title": "Treatment Outcomes"
            }
        },
        "aiInsights": {
            "title": "AI Insights",
            "subtitle": "Powered by advanced machine learning algorithms",
            "sections": {
                "clinicalPatterns": {
                    "title": "Clinical Patterns",
                    "insights": {
                        "depression": "Observed 23% increase in F32.1 diagnoses (Moderate depressive episode) in the 25-35 age group. Main risk factors: work stress, social isolation.",
                        "therapy": "Therapy effectiveness increased by 15% with early intervention (within 2 weeks of first symptoms) and regular monitoring using clinical scales."
                    }
                },
                "treatmentRecommendations": {
                    "title": "Treatment Recommendations",
                    "insights": {
                        "combination": "Patients with combined pharmacotherapy and psychotherapy show 35% higher treatment effectiveness compared to monotherapy.",
                        "risk": "Identified increased risk of treatment discontinuation in weeks 4-6 of therapy. Additional support and monitoring recommended during this period."
                    }
                }
            }
        },
        "metrics": {
            "demographics": {
                "title": "Patient Demographics",
                "averageAge": "Average Age",
                "genderDistribution": "Gender Distribution",
                "newPatients": "New Patients",
                "genderValues": "F: 65% | M: 35%"
            },
            "treatment": {
                "title": "Treatment Metrics",
                "averageDuration": "Average Treatment Duration",
                "remissionRate": "Remission Rate",
                "continuationRate": "Treatment Continuation"
            },
            "quality": {
                "title": "Quality Indicators",
                "patientSatisfaction": "Patient Satisfaction",
                "readmissions": "Readmissions (30d)",
                "documentation": "Documentation Completeness"
            }

        }



    },

    aiAssistants: {
        title: "AI assistants",
        description: "Advanced AI tools supporting doctor's work",
        tabs: {
            documentation: "Documentation",
            chatbots: "Chatbots",
            diagnosis: "Diagnosis",
            trials: "Clinical Trials",
            statistics: "Statistical Analysis"
        }
    },

    "documentationAssistant": {
        "title": "Documentation Assistant",
        "recording": {
            "start": "Start Recording",
            "stop": "Stop"
        },
        "transcription": {
            "title": "Transcription",
            "placeholder": "Transcription will appear here..."
        },
        "sections": {
            "symptoms": "Symptoms",
            "examination": "Examination",
            "diagnosis": "Diagnosis",
            "recommendations": "Recommendations"
        },
        "buttons": {
            "copy": "Copy",
            "generateNote": "Generate Note"
        }
    },
    "chatbotBuilder": {
        "title": "Chatbot Configurator",
        "buttons": {
            "newChatbot": "New Chatbot",
            "saveConfig": "Save Configuration",
            "edit": "Edit",
            "delete": "Delete"
        },
        "form": {
            "name": {
                "label": "Chatbot Name"
            },
            "specialty": {
                "label": "Specialty",
                "placeholder": "Choose specialty"
            },
            "dataSources": {
                "label": "Data Sources"
            },
            "customPrompt": {
                "label": "Custom Prompt"
            }
        },
        "configuredChatbots": {
            "title": "Configured Chatbots"
        }
    },
    "differentialDiagnosis": {
        "title": "Differential Diagnosis Assistant",
        "symptoms": {
            "label": "Symptoms",
            "placeholder": "Enter symptom...",
            "addButton": "Add"
        },
        "analyze": {
            "button": "Analyze"
        },
        "results": {
            "title": "Possible diagnoses",
            "probability": "Probability:",
            "sections": {
                "keySymptoms": "Key symptoms:",
                "recommendedTests": "Recommended tests:"
            }
        }
    },


    "clinicalTrials": {
        "title": "Clinical Trials Finder",
        "form": {
            "diagnosis": {
                "label": "Diagnosis",
                "placeholder": "e.g. Migraine"
            },
            "location": {
                "label": "Location",
                "placeholder": "e.g. Warsaw"
            },
            "searchButton": "Search trials"
        },
        "results": {
            "title": "Found trials",
            "status": {
                "recruiting": "Recruiting",
                "active": "Active",
                "completed": "Completed"
            },
            "criteria": {
                "inclusion": "Inclusion criteria:",
                "exclusion": "Exclusion criteria:"
            },
            "contact": {
                "title": "Contact:"
            },
            "buttons": {
                "details": "Details",
                "refer": "Refer patient"
            }
        }

    },

    "statisticalAnalysis": {
        "title": "AI Statistical Analysis",
        "buttons": {
            "export": "Export report",
            "analyze": "Analyze"
        },
        "config": {
            "timeRange": {
                "label": "Time Range",
                "options": {
                    "lastMonth": "Last month",
                    "lastQuarter": "Last quarter",
                    "lastYear": "Last year",
                    "custom": "Custom range"
                }
            },
            "metrics": {
                "label": "Metrics",
                "options": {
                    "visits": "Visits",
                    "diagnoses": "Diagnoses",
                    "procedures": "Procedures",
                    "labResults": "Lab Results"
                }
            },
            "grouping": {
                "label": "Grouping",
                "options": {
                    "day": "Day",
                    "week": "Week",
                    "month": "Month",
                    "quarter": "Quarter"
                }
            }
        },
        "results": {
            "summary": {
                "patients": {
                    "title": "Patients",
                    "averageAge": "Average age:"
                },
                "gender": {
                    "title": "Gender Distribution",
                    "male": "Male",
                    "female": "Female"
                }
            },
            "diagnoses": {
                "title": "Most Common Diagnoses"
            },
            "trends": {
                "title": "Visit Trends"
            },
            "distribution": {
                "title": "Diagnosis Distribution"
            }
        }
    },
    "settingsNav": {

        "title": "Settings",
        "description": "Manage facility settings and system configuration",
        "backButton": "Back",

        "tabs": {
            "statistics": "Facility Statistics",
            "facility": "Facility Data",
            "settings": "Settings",
            "security": "Security",
            "subscription": "Subscription",
            "portal": "Patient Portal",
            "profile": "Profile",
            "employees": "Employees",
            "ewus": "eWUŚ"
        }
    },
    "facilityStatistics": {
        "title": "Facility Statistics",
        "stats": {
            "departments": "Departments",
            "doctors": "Doctors",
            "offices": "Offices",
            "nurses": "Nurses",
            "patients": "Patients",
            "receptionists": "Receptionists"
        }
    },
    "facilitySettings": {
        "title": "Facility Data",
        "required": "* Required field",
        "basicInfo": {
            "name": "Name",
            "regon": "REGON",
            "nip": "NIP",
            "bdo": "BDO Number",
            "registryNumber": "Registry number (I part of res. code)"
        },
        "contact": {
            "facilityType": "Facility Type",
            "types": {
                "individual": "individual practice"
            },
            "phone": "Phone",
            "email": "Email",
            "accountNumber": "Account Number",
            "website": "Website"
        },
        "address": {
            "street": "Street",
            "buildingNumber": "Building No.",
            "apartmentNumber": "Apartment No.",
            "postalCode": "Postal Code",
            "city": "City"
        },
        "codes": {
            "teryt": "TERYT Code",
            "nfz": "NFZ Code"
        },
        "workingHours": {
            "from": "Working hours from",
            "to": "Working hours to",
            "visitDuration": "Visit duration (min)",
            "visitType": "Visit Type",
            "types": {
                "private": "Private"
            }
        },
        "reception": {
            "defaultMode": "Default reception mode",
            "select": "Select"
        },
        "logo": {
            "title": "Facility logo",
            "upload": "CHOOSE FILE"
        },
        "gdpr": {
            "consent": "Personal data processing consent text (change default)"
        },
        "buttons": {
            "save": "Save changes"
        }
    },
    "branch": {
        "title": "Branches",
        "add": "Add Branch",
        "form": {
            "branchName": "Branch Name",
            "branchNamePlaceholder": "Branch Name",
            "address": "Address",
            "addressPlaceholder": "Street and Number",
            "postalCode": "Postal Code",
            "postalCodePlaceholder": "Postal Code",
            "city": "City",
            "cityPlaceholder": "City",
            "phone": "Phone",
            "phonePlaceholder": "Phone",
            "email": "Email",
            "emailPlaceholder": "Email"
        },
        "validation": {
            "required": "This field is required",
            "phoneFormat": "Invalid phone number format",
            "emailFormat": "Invalid email format",
            "postalCodeFormat": "Invalid postal code format (XX-XXX)"
        },
        "confirmDelete": {
            "title": "Confirm Deletion",
            "message": "Are you sure you want to delete this branch?",
            "ok": "Yes, delete",
            "cancel": "Cancel"
        },
        "actions": {
            "cancel": "Cancel",
            "save": "Save"
        }
    },
    "office": {
        "title": "Offices",
        "add": "Add Office",
        "form": {
            "name": "Office Name",
            "namePlaceholder": "Office Name",
            "branch": "Branch",
            "branchPlaceholder": "Select Branch",
            "floor": "Floor",
            "floorPlaceholder": "Floor",
            "number": "Number",
            "numberPlaceholder": "Office Number",
            "type": "Office Type",
            "typePlaceholder": "Select Type",
            "types": {
                "medical": "Medical Office",
                "therapy": "Therapy Office",
                "diagnostic": "Diagnostic Office"
            },
            "equipment": "Equipment",
            "equipmentPlaceholder": "Equipment list (one per line)"
        },
        "details": {
            "floor": "Floor",
            "number": "No",
            "type": "Type",
            "equipment": "Equipment"
        },
        "actions": {
            "cancel": "Cancel",
            "save": "Save"
        },
        "validation": {
            "required": "This field is required",
            "floorFormat": "Invalid floor format (numbers and optional minus sign only)",
            "numberFormat": "Invalid office number format (letters and numbers only)"
        },
        "confirmDelete": {
            "title": "Confirm Deletion",
            "message": "Are you sure you want to delete this office?",
            "ok": "Yes, delete",
            "cancel": "Cancel"
        }
    },
    "certificates": {
        "title": "P1 Certificates",
        "form": {
            "p1Id": {
                "label": "P1 Identifier",
                "placeholder": "Enter P1 identifier"
            },
            "tls": {
                "label": "TLS Certificate",
                "placeholder": "Choose TLS certificate file"
            },
            "wls": {
                "label": "WLS Certificate",
                "placeholder": "Choose WLS certificate file"
            }
        },
        "actions": {
            "save": "Save Certificates"
        }
    },


    "security": {


        "title": "Security Settings"
    },
    "twoFactor": {
        "title": "Two-Factor Authentication",
        "status": {
            "enabled": "Enabled",
            "disabled": "Disabled"
        },
        "description": {
            "title": "Two-factor authentication is a double identity check during login.",
            "detail": "For additional account security, during login the user must enter a code that is sent through their chosen communication channel - email, SMS, or mobile app."
        },
        "trustedDevices": {
            "title": "Allow users to save trusted devices",
            "description": "The second verification step on a given device will then only occur every 30 days, not every time"
        }
    },
    "xmlExport": {
        "title": "Export Data to XML",
        "facility": {
            "info": "For full facility data export, please contact Technical Support."
        },
        "patients": {
            "title": "Export Patients to XML",
            "search": {
                "lastName": "Last Name",
                "firstName": "First Name",
                "pesel": "PESEL",
                "phone": "Phone",
                "externalCardNo": "External Card No."
            },
            "table": {
                "headers": {
                    "fullName": "Full Name",
                    "address": "Address",
                    "groups": "Patient Groups",
                    "pesel": "PESEL",
                    "phone": "Phone",
                    "actions": "Actions"
                }
            },
            "actions": {
                "export": "Export to XML"
            }
        }
    },
    "activityLog": {
        "title": "Activity Log",
        "actions": {
            "logoutAll": "Logout All Sessions"
        },
        "search": {
            "employee": "Employee"
        },
        "table": {
            "headers": {
                "loginDate": "Login Date",
                "logoutDate": "Logout Date",
                "user": "User",
                "ipAddress": "IP Address",
                "deviceCode": "Device Code"
            }
        },
        "pagination": {
            "recordsPerPage": "records per page",
            "page": "Page",
            "of": "of",
            "totalResults": "total results"
        }
    },
    "subscription": {
        "title": "Purchased Plans",
        "overview": {
            "activeUsers": "Number of Active Users",
            "nfzSettlements": "NFZ Settlements",
            "nextPayment": "Next Payment",
            "actions": {
                "payNow": "PAY NOW",
                "cancelSubscription": "CANCEL SUBSCRIPTION"
            }
        },
        "currentPlan": {
            "table": {
                "name": "Name",
                "validFrom": "Valid From",
                "validTo": "Valid To",
                "nextPayment": "Next Payment",
                "subscriptionInfo": "subscription paid every 30 days",
                "userCount": "Subscription - {count} users every 30 days"
            }
        },
        "plans": {
            "title": "Plans",
            "filters": {
                "withoutNFZ": "WITHOUT NFZ SETTLEMENTS",
                "withNFZ": "NFZ SETTLEMENTS MODULE",
                "comingSoon": "coming soon"
            },
            "card": {
                "upTo": "up to",
                "users": "users",
                "bestOffer": "Best offer for you",
                "gross": "gross",
                "withoutNFZ": "without NFZ module",
                "upgradeInfo": "package upgrade, paid in advance every 30 days",
                "currentPeriodPayment": "current period payment",
                "nextPayment": "next payment",
                "contractUntil": "contract until",
                "buttons": {
                    "currentPlan": "Current plan",
                    "select": "SELECT"
                }
            },
            "aiFeatures": {
                "title": "AI Powered",
                "docAssistant": "Documentation Assistant",
                "clinicalDecisions": "Clinical Decision Support",
                "drugInteractions": "Drug Interaction Analysis"
            }
        },
        "aiInfo": {
            "title": "What is AI Powered subscription?",
            "description": "AI Powered subscription provides access to advanced AI-powered features that help in daily work:",
            "features": [
                "Medical documentation assistant with voice transcription",
                "Clinical decision support system",
                "Intelligent ICD-10 coding assistant",
                "Drug interaction analysis with knowledge graph",
                "Interview assistant with emotion analysis",
                "Automatic diagnostic suggestions",
                "Patient data trend and pattern analysis"
            ]
        }
    },
    "portal": {
        "title": "Patient Portal",
        "info": {
            "title": "Patient Portal - Features and Capabilities",
            "description": "Configure which patient portal features should be available. You can enable or disable individual modules and their detailed functions."
        },
        "features": {
            "aiPowered": "AI Powered",
            "requiresAI": "Requires AI Powered plan"
        },
        "security": {
            "title": "Data Security",
            "description": "All data in the patient portal is encrypted and protected in accordance with GDPR requirements. Portal access requires strong authentication, and all activity is monitored and logged."
        },
        "actions": {
            "save": "Save Settings"
        }
    },
    "userManagement": {
        "title": "Account Management",
        "actions": {
            "addUser": "Add User"
        },
        "modal": {
            "title": "Add New User"
        }
    },

    "notifications": {
        "title": "Notifications",
        "types": {
            "email": "Email notifications",
            "sms": "SMS notifications",
            "app": "In-app notifications"
        }
    },

    "security_settings": {
        "title": "Security",
        "changePassword": {
            "button": "Change Password",
            "currentPassword": "Current Password",
            "newPassword": "New Password",
            "confirmPassword": "Confirm New Password",
            "actions": {
                "cancel": "Cancel",
                "submit": "Change Password"
            }
        }
    },
    "profile": {
        "form": {
            "firstName": "First Name",
            "lastName": "Last Name",
            "email": "Email"
        },
        "actions": {
            "editProfile": "Edit Profile",
            "cancel": "Cancel",
            "saveChanges": "Save Changes"
        }
    },



    "registration": {
        "form": {
            "firstName": "First Name",
            "lastName": "Last Name",
            "email": "Email",
            "username": "Username",
            "role": "Role",
            "roles": {
                "doctor": "Doctor",
                "nurse": "Nurse",
                "receptionist": "Receptionist",
                "admin": "Administrator"
            },
            "password": "Password",
            "confirmPassword": "Confirm Password"
        },
        "actions": {
            "cancel": "Cancel",
            "register": "Register"
        }
    },

    "passwordStrength": {
        "levels": {
            "veryWeak": "Very Weak",
            "weak": "Weak",
            "medium": "Medium",
            "strong": "Strong",
            "veryStrong": "Very Strong"
        },
        "enterPassword": "Enter password"
    },

    "addEmployee": {
        "title": {
            "doctor": "Add Doctor",
            "nurse": "Add Nurse",
            "receptionist": "Add Receptionist",
            "director": "Add Director"
        },
        "form": {
            "firstName": "First Name",
            "lastName": "Last Name",
            "email": "Email",
            "confirmEmail": "Confirm Email",
            "pwzNumber": "PWZ Number",
            "peselNumber": "PESEL Number",
            "required": "*"
        },
        "warning": "By adding a user to your facility's account, you confirm that this user, after accepting the invitation and your confirmation, will have access to your facility's data. Remember to grant such permissions only to authorized persons.",
        "actions": {
            "cancel": "Cancel",
            "add": "Add"
        },
        "errors": {
            "emailMismatch": "Email addresses do not match"
        }
    },

    "employees": {
        "title": "Employees",
        "roles": {
            "doctor": {
                "title": "Doctors, Dentists, and Paramedics",
                "addButtonText": "Add Doctor/Dentist/Paramedic"
            },
            "nurse": {
                "title": "Nurses and Midwives",
                "addButtonText": "Add Nurse/Midwife"
            },
            "receptionist": {
                "title": "Receptionists",
                "addButtonText": "Add Receptionist"
            },
            "director": {
                "title": "Directors",
                "addButtonText": "Add Director"
            }
        },
        "actions": {
            "groupPermissions": "GROUP PERMISSIONS",
            "ratings": "RATINGS"
        },
        "info": {
            "userCount": "Total number of users eligible for subscription fees: (3. Maximum number of users from purchased packages 7)."
        },
        "confirm": {
            "deleteEmployee": "Are you sure you want to delete this employee?"
        }
    },
    "employeeList": {
        "search": {
            "lastName": "Last Name",
            "firstName": "First Name",
            "pwz": "PWZ",
            "pesel": "PESEL"
        },
        "filters": {
            "onlyActive": "Only Active"
        },
        "table": {
            "headers": {
                "fullName": "Last Name and First Name",
                "login": "Login",
                "pwzPesel": "PWZ/PESEL",
                "pesel": "PESEL",
                "activationStatus": "Activation Status",
                "actions": "Actions"
            },
            "status": {
                "inactive": "Inactive"
            }
        },
        "actions": {
            "permissions": "PERMISSIONS",
            "edit": "EDIT"
        },
        "pagination": {
            "recordsPerPage": "records per page",
            "totalResults": "total results"
        }
    },

    "ewus": {
        "title": "eWUŚ",
        "autoCheck": {
            "label": "Automatic insurance verification:",
            "enable": "Enable",
            "disable": "Disable"
        },
        "system": {
            "label": "eWUŚ System",
            "enable": "Enable",
            "disable": "Disable"
        },
        "form": {
            "branch": "Branch:",
            "branches": {
                "pomorski": "Pomeranian (11)",
                "mazowiecki": "Masovian (07)",
                "slaski": "Silesian (12)"
            },
            "contractorType": "Contractor type:",
            "contractorTypes": {
                "doctor": "Doctor",
                "clinic": "Clinic",
                "hospital": "Hospital"
            },
            "personnelCode": "Personnel code:",
            "login": "Login:",
            "password": {
                "label": "Password:",
                "placeholder": "(not changed)"
            }
        },
        "actions": {
            "saveAndVerify": "Save and verify data accuracy",
            "changePassword": "Change password",
            "checkNow": "Check now"
        }
    },

    "userProfile": {
        "settings": "Settings",
        "notifications": "Notifications",
        "logout": "Log out",
        "online": "Online",

        "fallbackInitial": "U"
    },
    toggle: {
        dark: "Dark Mode",
        light: "Light Mode"
    },

    "clinicalDecisionSupport": {
        "title": "Clinical Decision Support",
        "subtitle": "AI analysis of clinical data",
        "selectData": "Select data for analysis",
        "analysisResults": "AI Analysis Results",
        "newAnalysis": "New Analysis",
        "confidence": "confidence",
        "evidence": "Evidence",
        "riskAssessment": {
            "title": "Risk Assessment",
            "riskFactors": "Risk Factors",
            "recommendations": "Recommendations"
        },
        "dataSelector": {
            "title": "Select data for analysis",
            "cancel": "Cancel",
            "analyze": "Analyze selected data",
            "analyzing": "Analyzing...",
            "currentVisit": {
                "section": "Current visit",
                "interview": "Current visit interview",
                "description": "Analysis of current visit data, including scales and observations"
            },
            "previousVisits": {
                "section": "Previous visits",
                "visitType": "{{type}} - {{diagnosis}}"
            }
        },
        "riskLevels": {
            "low": "LOW",
            "moderate": "MODERATE",
            "high": "HIGH"
        }
    },

    "interviewCoach": {
        "title": "Medical Interview Coach",
        "tabs": {
            "suggestions": "Question suggestions",
            "analysis": "Communication analysis",
            "literature": "Literature"
        }
    },


    "questionSuggestions": {
        "count": "Suggested questions ",
        "clearHistory": "Clear history",




    },

    "categoryFilter": {
        "categories": {
            "all": "All",
            "timeline": "Timeline",
            "factors": "Factors",
            "history": "History",
            "lifestyle": "Lifestyle"
        }
    },

    "questionCard": {
        "followUpQuestions": "Follow-up questions:",
        "button": {
            "used": "Used",
            "use": "Use"
        }
    },


    "communicationAnalysis": {
        "questionTypes": {
            "title": "Question Types",
            "openQuestions": "Open Questions"
        },
        "patientEngagement": {
            "title": "Patient Engagement",
            "activeParticipation": "Active Participation"
        },
        "clarity": {
            "title": "Communication Clarity",
            "understandability": "Understandability"
        },
        "improvements": {
            "title": "Improvement Suggestions"
        }
    },

    "literatureReferences": {
        "relevance": "Accuracy"
    },

    "smartTranscription": {
        "noteTemplates": {
            "firstVisit": {
                "name": "First Visit",
                "description": "Detailed first visit interview",
                "prompt": "Create a detailed note from the first visit, including main complaints, interview, physical examination and treatment plan."
            },
            "followUp": {
                "name": "Follow-up Visit",
                "description": "Follow-up visit note",
                "prompt": "Create a concise follow-up visit note, focusing on treatment progress and current symptoms."
            }
        },
        "conversation": {
            "doctor": "Doctor",
            "patient": "Patient"
        },
        "transcription": {
            "title": "Conversation Transcription",
            "selectTemplate": "Select note template...",
            "generateNote": "Generate Note"
        },
        "mobileRecording": {
            "title": "Mobile Recording",
            "scanInstructions": "Scan the QR code with your phone to start recording from your mobile device",
            "linkValidity": "Link will be active for 15 minutes"
        },
        "processing": {
            "title": "Processing Recording",
            "subtitle": "Analyzing and transcribing conversation..."
        },
        "notePreview": {
            "title": "Generated Note",
            "customPrompt": {
                "placeholder": "Enter custom instructions for AI...",
                "button": "Generate with custom prompt"
            },
            "buttons": {
                "regenerate": "Regenerate",
                "addToDoc": "Add to documentation"
            }
        }
    },

    "drugChecker": {
        "title": "Drug Interaction Checker",
        "input": {
            "placeholder": "Enter new medication...",
            "button": "Check Interactions"
        }
    },

    "icdAssistant": {
        "search": {
            "placeholder": "Search for ICD-10 code or diagnosis name...",
            "expand": "Expand",
            "collapse": "Collapse"
        },
        "criteria": {
            "mainTitle": "Main Criteria",
            "requiredCriteria": "Required criterion",
            "additionalTitle": "Additional Criteria",
            "physical": "Physical symptom",
            "psychological": "Psychological symptom",
            "keySymptom": "Key symptom (1-4)"
        },
        "buttons": {
            "addDiagnosis": "Add diagnosis",
            "addToInterview": "Add to interview"
        },
        "aiSuggestions": {
            "title": "AI Suggestions"
        }
    },

    "icdCodes": {

        "aiSuggestions": {
            "frequency": "Worth asking about the frequency of attacks in the last month",
            "avoidance": "Are there any avoidance behaviors related to anxiety?",
            "triggers": "What are the main triggers for the attacks?",
            "coping": "Does the patient have strategies for coping with attacks?"
        }

    },

    "visitHistory": {
        "title": "Visit History",
        "totalVisits": "Total visits",
        "sections": {
            "medicalInterview": "Medical Interview",
            "diagnoses": "Diagnoses",
            "medications": "Medications",
            "labResults": "Lab Results",
            "psychometricTests": "Psychometric Tests"
        },
        "points": "pts",
        "change": "{{value}}"
    },
    "auditTrail": {
        "header": {
            "title": "Document Change History",
            "subtitle": "Full audit trail"
        },
        "actions": {
            "create": "Document Creation",
            "modify": "Document Modification",
            "view": "Document View",
            "sign": "Document Signing"
        },
        "changes": {
            "title": "Changes made:",
            "system": "System:"
        }
    },
    "clinicalTrends": {
        "header": {
            "title": "Clinical Trends Analysis",
            "subtitle": "AI-powered clinical trends analysis"
        },
        "charts": {
            "hamdScale": "HAM-D Scale",
            "bdiScale": "BDI Scale"
        },
        "insights": {
            "title": "Clinical Insights"
        },
        "metrics": {
            "sleepTime": {
                "title": "Average Sleep Time",
                "belowNorm": "below norm"
            },
            "activity": {
                "title": "Activity",
                "monthChange": "m/m"
            }
        }
    },

    "psychiatricScales": {
        "header": "Select scale",
        "scales": {
            "hamD": {
                "name": "HAM-D",
                "description": "Hamilton Depression Scale"
            },
            "madrs": {
                "name": "MADRS",
                "description": "Montgomery-Åsberg Depression Scale"
            },
            "asrs": {
                "name": "ASRS",
                "description": "ADHD Symptoms Scale"
            },
            "hamA": {
                "name": "HAM-A",
                "description": "Hamilton Anxiety Scale"
            },
            "isi": {
                "name": "ISI",
                "description": "Insomnia Severity Scale"
            },
            "cars2": {
                "name": "CARS-2",
                "description": "Childhood Autism Rating Scale"
            }
        }
    },

    "hamdScale": {
        "navigation": {
            "question": "Question",
            "back": "Back",
            "cancel": "Cancel",
            "finish": "Complete scale"
        },
        "interpretation": {
            "none": {
                "title": "No depression symptoms",
                "details": "Result indicates no clinically significant depression symptoms. Standard mental health monitoring recommended."
            },
            "mild": {
                "title": "Mild depression",
                "details": "Result indicates mild depressive symptoms. Regular monitoring and consideration of therapeutic intervention recommended."
            },
            "moderate": {
                "title": "Moderate depression",
                "details": "Result indicates moderate depression. Therapeutic intervention and consideration of pharmacotherapy recommended."
            },
            "severe": {
                "title": "Severe depression",
                "details": "Result indicates severe depression. Urgent therapeutic and pharmacological intervention required. Regular suicide risk assessment recommended."
            },
            "verySevere": {
                "title": "Very severe depression",
                "details": "Result indicates very severe depression. Immediate psychiatric intervention required. High suicide risk - special attention and monitoring required."
            },
            "result": "HAM-D Scale: {{score}} points - {{interpretation}}"
        }
    },

    "scaleSummary": {
        "header": {
            "title": " Scale Summary",
            "score": "Score"
        },
        "sections": {
            "aiAnalysis": "AI Analysis",
            "recommendations": "Recommendations",
            "riskFactors": "Risk Factors"
        },
        "points": "pts",
        "buttons": {
            "close": "Close",
            "addToInterview": "Add to interview"
        }
    },

    "prescriptionForm": {
        "info": {
            "title": "e-Prescription",
            "description": "Issue electronic prescriptions compatible with the P1 system. You can save the prescription as a draft and sign it later."
        },
        "buttons": {
            "addMedication": "Add medication",
            "cancel": "Cancel",
            "addToPrescription": "Add to prescription",
            "signPrescriptions": "Sign prescriptions "
        },
        "sections": {
            "draftPrescriptions": "Draft prescriptions",
            "signedPrescriptions": "Signed prescriptions"
        }
    },

    "medicationSearch": {
        "input": {
            "placeholder": "Search medication..."
        },
        "results": {
            "package": "Package:",
            "noResults": "No medications found. You can add a compounded medication."
        }
    },

    "dosageForm": {
        "labels": {
            "dosage": "Dosage",
            "packageCount": "Number of packages",
            "refills": "Number of refills",
            "instructions": "Additional instructions"
        },
        "placeholders": {
            "dosage": "e.g. 1x1, 2x1 morning and evening",
            "instructions": "e.g. take after meal"
        },
        "suggestions": {
            "title": "Suggested patterns:"
        },
        "refillOptions": {
            "none": "No refills",
            "one": "1 refill",
            "multiple": " refills"
        }
    },

    "refundationSelect": {
        "label": "Refundation",
        "options": {
            "fullPrice": "Full price",
            "free": "Free",
            "lump": "Lump sum",
            "freeLimit": "Free up to limit",
            "senior": "Senior 75+",
            "payment": "Payment "
        }
    },

    "additionalRights": {
        "label": "Additional Rights",
        "info": "Select appropriate additional patient rights. These affect the level of medication reimbursement.",
        "rights": {
            "IB": {
                "name": "War Invalid",
                "description": "War invalids and repressed persons"
            },
            "IW": {
                "name": "Military Invalid",
                "description": "Military invalids"
            },
            "ZK": {
                "name": "Honorary Blood Donor",
                "description": "Distinguished honorary blood donors"
            },
            "C": {
                "name": "Pregnancy",
                "description": "Pregnant women"
            },
            "DN": {
                "name": "Children and Youth",
                "description": "Children and youth under 18 years old"
            },
            "AZ": {
                "name": "Academic Healthcare",
                "description": "Students and academics including adjuncts, assistants and PhD candidates"
            }
        }
    }
    ,
    "prescriptionSummary": {
        "title": "Prescription ",
        "status": {
            "label": "Status: ",
            "draft": "Draft",
            "issued": "Issued"
        },
        "buttons": {
            "edit": "Edit",
            "cancel": "Cancel",
            "save": "Save",
            "sign": "Sign",
            "print": "Print",
            "reissue": "Reissue"
        },
        "medication": {
            "dosage": {
                "label": "Dosage",
                "prefix": "Dosage: "
            },
            "quantity": {
                "label": "Package quantity",
                "display": "Quantity:  pkg."
            },
            "instructions": {
                "label": "Additional instructions",
                "prefix": "Additional instructions: "
            }
        },
        "additionalRights": {
            "title": "Additional rights"
        }
    },

    "signingModal": {
        "title": "Signing e-prescription",
        "methods": {
            "zus": {
                "title": "ZUS Certificate",
                "description": "Sign using ZUS certificate"
            },
            "qualified": {
                "title": "Qualified Signature",
                "description": "Sign using qualified certificate"
            },
            "trusted": {
                "title": "Trusted Profile",
                "description": "Sign using Trusted Profile"
            }
        },
        "buttons": {
            "startSigning": "Start signing",
            "signPrescription": "Sign prescription",
            "verifyAndSign": "Verify and sign",
            "complete": "Complete"
        },
        "password": {
            "info": "Enter password for  certificate.",
            "label": "Certificate password",
            "placeholder": "Enter password",
            "remember": "Remember password until end of session"
        },
        "verification": {
            "info": "Enter verification code sent to your phone.",
            "label": "Verification code",
            "placeholder": "Enter code"
        },
        "processing": {
            "title": "Signing prescription...",
            "subtitle": "Please do not close the window"
        },
        "complete": {
            "title": "Prescription has been signed",
            "description": "Prescription has been successfully signed and sent to the P1 system. You can now print patient information."
        }
    },

    "sickLeaveForm": {
        "title": "e-ZLA",
        "buttons": {
            "removeSickLeave": "Remove sick leave",
            "issueSickLeave": "Issue sick leave",
            "addPayer": "Add payer",
            "cancel": "Cancel",
            "issuEZLA": "Issue e-ZLA"
        },
        "patientInfo": {
            "title": "Patient Information",
            "description": "Patient data will be automatically retrieved from the ZUS system after entering the PESEL number."
        },
        "sickLeavePeriod": {
            "title": "Sick Leave Period",
            "dateFrom": "Date from",
            "dateTo": "Date to"
        },
        "hospitalization": {
            "title": "Hospital stay"
        },
        "medicalData": {
            "title": "Medical Data",
            "statisticalNumber": {
                "label": "Statistical disease number (ICD-10)",
                "placeholder": "Search ICD-10 code"
            },
            "literalCodes": {
                "label": "Literal Codes"
            },
            "recommendations": {
                "label": "Doctor's recommendations and instructions",
                "placeholder": "E.g. bed rest, medication, rehabilitation..."
            }
        },
        "payers": {
            "title": "Payers",
            "search": {
                "placeholder": "Search payer by name or NIP..."
            },
            "noPayers": "No payers added"
        }
    },

    "stepNavigation": {
        "previous": "Back",
        "next": "Next",
        "finish": "Finish"
    },

    "navigation": {
        "back": "Back",
        "next": "Next",
        "finish": "Finish"
    },

    "recommendationsModal": {
        "title": "Recommendations for Patient Portal",
        "buttons": {
            "cancel": "Cancel",
            "save": "Save Recommendations"
        }
    },

    "psychiatricRecommendations": {
        "title": "Recommendations for Patient Portal",
        "emergencyContacts": {
            "label": "Share emergency contacts in the portal"
        }
    },

    "medicationSchedule": {
        "title": "Medication Schedule",
        "search": {
            "placeholder": "Search medication..."
        },
        "instructions": {
            "placeholder": "Medication instructions"
        }
    },

    "scalesConfiguration": {
        "title": "Scale Monitoring",
        "categories": {
            "depression": "Depression Assessment",
            "anxiety": "Anxiety Assessment",
            "mentalHealth": "Mental Health Assessment",
            "ptsd": "PTSD and Trauma Assessment",
            "addictions": "Addiction Assessment",
            "sleep": "Sleep Assessment"
        },
        "buttons": {
            "addToMonitoring": "Add to monitoring",
            "removeMonitoring": "Remove monitoring"
        },
        "labels": {
            "frequency": "Frequency (days)",
            "startDate": "Start Date",
            "enableReminders": "Enable reminders"
        }
    },

    "aiFeatures": {
        "title": "AI Assistant",
        "enableAssistant": "Enable AI assistant",
        "features": {
            "moodTracking": {
                "label": "Intelligent Mood Tracking",
                "description": "AI analyzes mood patterns and suggests interventions"
            },
            "medicationReminders": {
                "label": "Adaptive Medication Reminders",
                "description": "AI adjusts reminders to the patient's daily rhythm"
            },
            "crisisIntervention": {
                "label": "Crisis Support",
                "description": "AI detects warning signals and suggests appropriate actions"
            },
            "copingStrategies": {
                "label": "Personalized Coping Strategies",
                "description": "AI proposes techniques tailored to the patient's situation"
            }
        }
    },

    "visitSummary": {
        "title": "Visit Summary",
        "buttons": {
            "backToEdit": "Back to edit",
            "confirmAndFinish": "Confirm and finish visit"
        },
        "sections": {
            "patientData": {
                "title": "Patient Data",
                "labels": {
                    "name": "Full Name",
                    "pesel": "Identification Number",
                    "dateOfBirth": "Date of Birth"
                }
            },
            "medicalInterview": {
                "title": "Medical Interview",
                "labels": {
                    "mainSymptoms": "Main Symptoms:",
                    "symptomsOnset": "Symptoms Onset:",
                    "currentMedications": "Current Medications:",
                    "additionalNotes": "Additional Notes:"
                }
            }
        }
    },

    "patientSearch2": {
        "label": "Patient",
        "placeholder": "Search patient (min. 3 characters)...",
        "searching": "Searching...",
        "newPatient": "New Patient",
        "peselLabel": "ID Number"
    },

    "spotlightPage": {
        "title": "Spotlight",
        "description": "Safely sharing anonymized patient data for clinical research",
        "tabs": {
            "newSubmission": "New Submission",
            "mySubmissions": "My Submissions"
        }
    },

    "spotlightSubmissions": {
        "title": "My Spotlight Submissions",
        "status": {
            "pending": {
                "label": "Pending"
            },
            "approved": {
                "label": "Approved"
            },
            "rejected": {
                "label": "Rejected"
            }
        },
        "labels": {
            "patientId": "Patient ID",
            "submissionDate": "Submission Date"
        },
        "buttons": {
            "preview": "Preview",
            "includeInStudy": "Include in Study"
        }
    },

    "patientSelector": {
        "title": "Patient Selection",
        "search": {
            "placeholder": "Search patient by name or ID..."
        },
        "patientDetails": {
            "age": "Age: {age} years",
            "mainDiagnosis": "Primary Diagnosis: {diagnosis}",
            "comorbidities": "Comorbidities: {comorbidities}"
        },
        "buttons": {
            "patientHistory": "Medical History"
        }
    },

    "patientHistory": {
        "buttons": {
            "back": "Back",
            "previous": "Previous"
        },
        "steps": {
            "history": {
                "title": "Patient Medical History"
            },
            "config": {
                "title": "Anonymization Configuration"
            },
            "preview": {
                "title": "Anonymized Data Preview"
            }
        },
        "patientId": "ID"
    },

    "medicalHistory": {
        "title": "Medical History",
        "anonymizeButton": "Anonymize Selected Visits",
        "sections": {
            "visitNotes": "Visit Notes",
            "diagnoses": "Diagnoses",
            "vitals": "Vital Signs",
            "medications": "Medications",
            "labResults": "Lab Results"
        },
        "diagnoses": {
            "primary": "Primary",
            "secondary": "Secondary"
        },
        "vitals": {
            "bloodPressure": "Blood Pressure",
            "heartRate": "Heart Rate",
            "temperature": "Temperature"
        },
        "labResults": {
            "referenceRange": "Reference Range"
        }
    },

    "anonymizationConfig": {
        "title": "Anonymization Configuration",
        "sections": {
            "demographics": {
                "title": "Demographic Data",
                "items": {
                    "age": "Age (in ranges)",
                    "gender": "Gender",
                    "education": "Education",
                    "occupation": "Occupation Status",
                    "maritalStatus": "Marital Status"
                }
            },
            "clinical": {
                "title": "Clinical Data",
                "items": {
                    "symptoms": "Symptoms",
                    "onsetDate": "Onset Date (relative)",
                    "duration": "Duration",
                    "severity": "Symptom Severity",
                    "course": "Disease Course"
                }
            },
            "diagnoses": {
                "title": "Diagnoses",
                "items": {
                    "primaryDiagnosis": "Primary Diagnosis",
                    "comorbidities": "Comorbidities",
                    "familyHistory": "Family History"
                }
            },
            "treatment": {
                "title": "Treatment",
                "items": {
                    "medicationClasses": "Medication Classes",
                    "medicationDosage": "Dosage",
                    "medicationDuration": "Treatment Duration",
                    "sideEffects": "Side Effects",
                    "treatmentResponse": "Treatment Response"
                }
            },
            "clinicalAssessments": {
                "title": "Clinical Assessments",
                "items": {
                    "clinicalScales": "Clinical Scales",
                    "psychometricTests": "Psychometric Tests",
                    "functionalStatus": "Functional Status"
                }
            },
            "labResults": {
                "title": "Lab Results",
                "items": {
                    "basicLabs": "Basic Labs",
                    "imagingResults": "Imaging Results",
                    "specializedTests": "Specialized Tests"
                }
            }
        },
        "anonymizationInfo": {
            "title": "Anonymization Information",
            "description": "Selected data will be processed according to the anonymization protocol:",
            "details": [
                "Age will be converted to 5-year ranges",
                "Dates will be converted to relative periods",
                "Medication names will be replaced with pharmacological classes",
                "Lab results will be presented as deviations from the norm",
                "Location data will be removed"
            ]
        },
        "buttons": {
            "next": "Next"
        }
    },

    "anonymizationPreview": {
        "title": "Anonymized Data Preview",
        "subtitle": "Check how the data will look after anonymization",
        "submitButton": "Submit to Spotlight",
        "sections": {
            "demographics": {
                "title": "Demographic Data",
                "labels": {
                    "ageRange": "Age Range",
                    "gender": "Gender",
                    "education": "Education",
                    "occupation": "Occupation",
                    "maritalStatus": "Marital Status"
                }
            },
            "clinical": {
                "title": "Clinical Data",
                "labels": {
                    "symptoms": "Symptoms",
                    "onset": "Onset",
                    "duration": "Duration",
                    "severity": "Severity",
                    "course": "Course"
                }
            },
            "diagnoses": {
                "title": "Diagnoses",
                "labels": {
                    "primaryDiagnosis": "Primary Diagnosis",
                    "comorbidities": "Comorbidities",
                    "familyHistory": "Family History"
                }
            },
            "treatment": {
                "title": "Treatment",
                "labels": {
                    "medicationClass": "Medication Class",
                    "dosage": "Dosage",
                    "duration": "Duration",
                    "response": "Response",
                    "sideEffects": "Side Effects"
                }
            },
            "assessments": {
                "title": "Clinical Assessments",
                "labels": {
                    "clinicalScales": "Clinical Scales",
                    "functionalStatus": "Functional Status"
                }
            },
            "labResults": {
                "title": "Lab Results",
                "labels": {
                    "basicLabs": "Basic Labs"
                }
            }
        },
        "anonymizationInfo": {
            "title": "Anonymization Information",
            "details": [
                "Personal data has been completely removed",
                "Age has been converted to age ranges",
                "Dates have been converted to relative time periods",
                "Medication names have been replaced with pharmacological classes",
                "Medication dosage information has been preserved",
                "Lab results have been presented as deviations from the norm",
                "Location data has been removed"
            ]
        }
    },

    "interactiveGuide": {
        "steps": {
            "patientSearch": {
                "title": "Patient Search",
                "content": "Here you can quickly find a patient by entering their name or ID number."
            },
            "newVisit": {
                "title": "New Visit",
                "content": "Click here to start a new visit. The wizard will guide you through the entire process."
            },
            "aiAssistant": {
                "title": "AI Assistant",
                "content": "The AI Assistant will help you with diagnosis, documentation, and clinical decision making."
            }
        },
        "navigation": {
            "finish": "Finish",
            "next": "Next"
        }
    },

    "patientCard": {
        "patientInfo": {
            "pesel": "PESEL",
            "id": "ID "
        },
        "buttons": {
            "close": "Close",
            "edit": "Edit data"
        }
    },

    "basicInfo": {
        "title": "BASIC INFORMATION",
        "fields": {
            "pesel": "PESEL:",
            "dateOfBirth": "Date of birth:"
        }
    },
    addressInfo: {
        title: "ADDRESS",
    },

    "insurance": {
        "title": "INSURANCE",
        "fields": {
            "type": "Type:",
            "number": "Number:",
            "validUntil": "Valid until:"
        }
    },
    patient_portal: {
        title: "PATIENT PORTAL / NOTIFICATIONS",
        active: "Active",
        inactive: "Inactive",
        notifications: "Notifications"
    },

    consent: {
        title: "CONSENT TO PROCESS PERSONAL DATA"
    },

    authorizedPersons: {
        title: "AUTHORIZED PERSONS AND DOCUMENTATION PROVIDED",
        validUntil: "Valid until:"
    },
    employer: {
        title: "EMPLOYER"
    },

    "todayPatientsModal": {
        "title": "Today's appointments",
        "tableHeaders": {
            "time": "Time",
            "patient": "Patient",
            "status": "Status",
            "type": "Type",
            "actions": "Actions"
        }
    },
    "pendingReports": {
        "title": "Pending Reports",
        "deadline": "Deadline: {{date}}",
        "priority": {
            "low": "Low",
            "medium": "Medium",
            "high": "High"
        }
    }
    ,
    "scheduledVisits": {
        "title": "Scheduled Appointments"
    },
    completedVisits: {
        "title": "Completed Visits"
    }
    ,

    "loadingOverlay": {
        "title": "Clinical Data Analysis",
        "processing": "Processing selected information...",
        "steps": [
            "Analyzing historical data",
            "Processing test results",
            "Generating recommendations"
        ]
    },

    formErrors: {
        "required": "This field is required",
        "peselFormat": "PESEL must contain exactly 11 digits",
        "phoneFormat": "Phone number must contain 9 digits",
        "postalCodeFormat": "Postal code should be in the format XX-XXX",
        "emailFormat": "Please enter a valid email address",
        "dateInvalid": "Please enter a valid date",
        "spaces": "Cannot start with spaces",
        "invalidAgeFormat": "Invalid age format"
    },

    "basicInfoFormErrors": {
        "required": "This field is required",
        "peselFormat": "PESEL must contain exactly 11 digits",
        "phoneFormat": "Please enter a valid phone number",
        "emailFormat": "Please enter a valid email address",
        "dateInvalid": "Please enter a valid date",
        "minLength": "Must be at least {min} characters",
        "maxLength": "Cannot exceed {max} characters",
        "numberOnly": "Please enter numbers only",
        "invalidFormat": "Invalid format",
        "passwordMismatch": "Passwords do not match",
        "alphabetOnly": "Only alphabetical characters are allowed"
    }
    ,

    "insurance_form2": {
        "nfz": {
            "title": "National Health Fund (NFZ)",
            "branch": "NFZ Branch",
            "additional_rights": "Additional Rights",
            "branches": {
                "dolnoslaskie": "Lower Silesian",
                "kujawsko_pomorskie": "Kuyavian-Pomeranian",
                "lubelskie": "Lublin",
                "lubuskie": "Lubusz",
                "lodzkie": "Łódź",
                "malopolskie": "Lesser Poland",
                "mazowieckie": "Masovian",
                "opolskie": "Opole",
                "podkarpackie": "Subcarpathian",
                "podlaskie": "Podlaskie",
                "pomorskie": "Pomeranian",
                "slaskie": "Silesian",
                "swietokrzyskie": "Holy Cross",
                "warminsko_mazurskie": "Warmian-Masurian",
                "wielkopolskie": "Greater Poland",
                "zachodniopomorskie": "West Pomeranian"
            },
            "rights": {
                "none": "None",
                "ib": "IB",
                "in": "IN",
                "iz": "IZ",
                "dn": "DN",
                "cn": "CN"
            }
        },
        "private": {
            "title": "Private Insurance",
            "search_placeholder": "Search insurers",
            "no_insurers": "No private insurers added",
            "add_insurer": "Add Insurer",
            "add_new_insurer": "Add New Insurer",
            "insurer_name": "Insurer Name",
            "policy": "Policy Number",
            "policy_number": "Policy Number",
            "valid_until": "Valid Until",
            "new_insurer": "New Insurer"
        },
        "submit": "Save"
    },
    "formErrors2": {
        "required": "This field is required",
        "postalCodeFormat": "Invalid postal code format. Use XX-XXX",
        "phoneFormat": "Invalid phone number format",
        "emailFormat": "Invalid email format",
        "policyNumberFormat": "Invalid policy number format"
    },

    "employer_form2": {
        "sections": {
            "employer": "Employer Information",
            "address": "Employer Address"
        },
        "fields": {
            "employer_name": "Employer Name",
            "employer_nip": "NIP (Tax ID)",
            "fill_from_nip": "Fill from NIP",
            "occupation": "Occupation",
            "production_symbol": "Production Symbol",
            "street": "Street",
            "house_number": "House Number",
            "apartment_number": "Apartment Number",
            "postal_code": "Postal Code",
            "city": "City",
            "voivodeship": "Voivodeship/Province",
            "country": "Country"
        },
        "voivodeships": {
            "dolnoslaskie": "Lower Silesian",
            "kujawsko_pomorskie": "Kuyavian-Pomeranian",
            "lubelskie": "Lublin",
            "lubuskie": "Lubusz",
            "lodzkie": "Łódź",
            "malopolskie": "Lesser Poland",
            "mazowieckie": "Masovian",
            "opolskie": "Opole",
            "podkarpackie": "Subcarpathian",
            "podlaskie": "Podlaskie",
            "pomorskie": "Pomeranian",
            "slaskie": "Silesian",
            "swietokrzyskie": "Holy Cross",
            "warminsko_mazurskie": "Warmian-Masurian",
            "wielkopolskie": "Greater Poland",
            "zachodniopomorskie": "West Pomeranian"
        },
        "countries": {
            "PL": "Poland",
            "DE": "Germany",
            "GB": "United Kingdom",
            "FR": "France",
            "US": "United States",
            "CZ": "Czech Republic",
            "SK": "Slovakia",
            "UA": "Ukraine"
        },
        "submit": "Save"
    },
    "employer_formErrors": {
        "required": "This field is required",
        "postalCodeFormat": "Invalid postal code format. Use XX-XXX",
        "nipFormat": "NIP must be 10 digits",
        "phoneFormat": "Invalid phone number format",
        "emailFormat": "Invalid email format"
    },

    "authorized_persons_form": {
        "toggles": {
            "no_authorized_persons": "No authorized persons",
            "current_version_signed": "Current version signed"
        },
        "buttons": {
            "no_authorization_statement": "No Authorization Statement",
            "add_authorized_person": "Add Authorized Person"
        },
        "sections": {
            "documentation_access": "Documentation Access History"
        },
        "messages": {
            "no_authorized_persons": "No authorized persons added. Use the 'Add Authorized Person' button to add someone.",
            "no_documentation_records": "No documentation access records available."
        },
        "card": {
            "unnamed_person": "Unnamed Person"
        },
        "fields": {
            "first_name": "First Name",
            "last_name": "Last Name",
            "relationship": "Relationship",
            "pesel": "PESEL",
            "phone": "Phone Number",
            "email": "Email",
            "address": "Address",
            "document_type": "Document Type",
            "document_number": "Document Number",
            "valid_until": "Valid Until"
        },
        "relationships": {
            "spouse": "Spouse",
            "parent": "Parent",
            "child": "Child",
            "sibling": "Sibling",
            "other": "Other"
        },
        "document_types": {
            "id_card": "ID Card",
            "passport": "Passport",
            "residence_card": "Residence Card",
            "other": "Other"
        },
        "modal": {
            "add_title": "Add Authorized Person",
            "edit_title": "Edit Authorized Person"
        },
        "submit": "Save"
    },
    // "authorized_persons_formErrors": {
    //   "required": "To pole jest wymagane",
    //   "peselFormat": "PESEL musi zawierać 11 cyfr",
    //   "phoneFormat": "Nieprawidłowy format numeru telefonu",
    //   "emailFormat": "Nieprawidłowy format adresu email",
    //   "dateFormat": "Nieprawidłowy format daty"
    // },

    "authorized_persons_formErrors": {
        "required": "This field is required",
        "peselFormat": "PESEL must be 11 digits",
        "phoneFormat": "Invalid phone number format",
        "emailFormat": "Invalid email format",
        "dateFormat": "Invalid date format"
    },

    "medications_form": {
        "sections": {
            "regular": "Regular Medications",
            "asNeeded": "As Needed (PRN) Medications",
            "history": "Medication History"
        },
        "buttons": {
            "addMedication": "Add Medication",
            "end": "End",
            "add": "Add",
            "cancel": "Cancel",
            "delete": "Delete",
            submit: "Save"
        },
        "medicationCard": {
            "dosage": "Dosage:",
            "from": "From",
            "notes": "Notes:",
            "currently": "Currently"
        },
        "modal": {
            "title": "Add Medication",
            "searchPlaceholder": "Search medications...",
            "regularMedication": "Regular medication (taken on schedule)",
            "notesPlaceholder": "Add any additional notes about this medication...",
            "fields": {
                "name": "Medication Name",
                "commonName": "Common Name (Generic)",
                "form": "Form",
                "dose": "Dose",
                "dosage": "Dosage Instructions",
                "startDate": "Start Date",
                "notes": "Notes"
            }
        },
        "forms": {
            "tablet": "Tablet",
            "capsule": "Capsule",
            "liquid": "Liquid",
            "injection": "Injection",
            "inhaler": "Inhaler",
            "patch": "Patch",
            "cream": "Cream",
            "other": "Other"
        },
        "confirmDelete": "Delete Medication",
        "confirmDeleteMessage": "Are you sure you want to delete this medication? This action cannot be undone.",
        "confirmEnd": "End Medication",
        "confirmEndMessage": "Are you sure you want to end this medication? It will be moved to medication history.",
        "noMedications": {
            "regular": "No regular medications",
            "asNeeded": "No as-needed medications",
            "history": "No medication history"
        }
    },
    "medications_formErrors": {
        "required": "This field is required",
        "invalidDose": "Please enter a valid dose"
    }
    ,
    "diagnoses_form": {
        "sections": {
            "active": "Active Diagnoses",
            "history": "Diagnosis History"
        },
        "buttons": {
            "addDiagnosis": "Add Diagnosis",
            "add": "Add",
            "cancel": "Cancel",
            "delete": "Delete",
            "submit": "Save"
        },
        "diagnosisCard": {
            "type": {
                "primary": "Primary",
                "secondary": "Secondary"
            },
            "from": "From ",
            "notes": "Notes",
            "status": {
                "active": "Active",
                "remission": "Remission",
                "resolved": "Resolved"
            }
        },
        "modal": {
            "title": "Add Diagnosis",
            "searchPlaceholder": "Search by ICD-10 code or diagnosis name...",
            "noResultsFound": "No matching diagnoses found",
            "category": "Category:",
            "diagnosticCriteria": "Diagnostic Criteria:",
            "fields": {
                "description": "Description",
                "code": "Code",
                "type": "Type",
                "notes": "Notes"
            },
            "diagnosisType": {
                "label": "Diagnosis Type",
                "primary": "Primary diagnosis",
                "secondary": "Secondary diagnosis"
            },
            "notes": {
                "label": "Notes",
                "placeholder": "Add any additional notes about this diagnosis..."
            }
        },
        "confirmDelete": "Delete Diagnosis",
        "confirmDeleteMessage": "Are you sure you want to delete this diagnosis? This action cannot be undone.",
        "noDiagnoses": {
            "active": "No active diagnoses",
            "history": "No diagnosis history"
        },

    },
    "diagnoses_formErrors": {
        "required": "This field is required",
        "notesTooLong": "Notes cannot exceed 500 characters"
    },
    "allergies_form": {
        "modal": {
            "title": "Add Allergy",
            "allergyType": {
                "label": "Allergy Type",
                "drug": "Drug/Medication",
                "food": "Food",
                "environmental": "Environmental",
                "other": "Other"
            },
            "allergenName": {
                "label": "Allergen Name",
                "placeholder": "Enter the name of the allergen..."
            },
            "reaction": {
                "label": "Reaction",
                "placeholder": "Describe the allergic reaction..."
            },
            "severity": {
                "label": "Severity",
                "mild": "Mild",
                "moderate": "Moderate",
                "severe": "Severe"
            },
            "notes": {
                "label": "Notes",
                "placeholder": "Add any additional notes about this allergy..."
            }
        },
        "buttons": {
            "add": "Add",
            "cancel": "Cancel",
            "delete": "Delete",
            "submit": "Save"
        }
    },
    "allergies_formErrors": {
        "required": "This field is required",
        "allergenNameTooShort": "Allergen name must be at least 2 characters",
        "reactionTooShort": "Please provide more details about the reaction"
    },

    "chronicConditions_form": {
        "title": "Chronic Conditions",
        "confirmDelete": "Are you sure you want to delete this condition?",
        "buttons": {
            "addCondition": "Add Condition",
            "add": "Add",
            "cancel": "Cancel"
        },
        "modal": {
            "title": "Add Chronic Condition",
            "name": {
                "label": "Condition Name",
                "placeholder": "Enter the name of the condition..."
            },
            "status": {
                "label": "Status",
                "active": "Active",
                "remission": "In Remission",
                "resolved": "Resolved"
            },
            "severity": {
                "label": "Severity",
                "mild": "Mild",
                "moderate": "Moderate",
                "severe": "Severe"
            },
            "treatment": {
                "label": "Current Treatment",
                "placeholder": "Describe the current treatment plan..."
            },
            "notes": {
                "label": "Notes",
                "placeholder": "Add any additional notes about this condition..."
            }
        },
        "conditionCard": {
            "treatment": "Treatment:",
            "diagnosed": "Diagnosed:",
            "notes": "Notes:",
            "noConditions": "No chronic conditions recorded"
        }
    },
    "chronicConditions__formErrors": {
        "required": "This field is required",
        "conditionNameTooShort": "Condition name must be at least 2 characters",
        "treatmentTooShort": "Please provide more details about the treatment"
    },

    "riskFactors_form": {
        "title": "Risk Factors",
        "confirmDelete": "Are you sure you want to delete this risk factor?",
        "buttons": {
            "addFactor": "Add Risk Factor",
            "add": "Add",
            "cancel": "Cancel"
        },
        "modal": {
            "title": "Add Risk Factor",
            "category": {
                "label": "Risk Category",
                "placeholder": "Select risk category..."
            },
            "factor": {
                "label": "Risk Factor",
                "placeholder": "Enter or select risk factor...",
                "tooltip": "Select a specific risk factor or enter a custom one"
            },
            "riskLevel": {
                "label": "Risk Level",
                "low": "Low",
                "moderate": "Moderate",
                "high": "High"
            },
            "notes": {
                "label": "Notes",
                "placeholder": "Add any additional notes about this risk factor..."
            }
        },
        "factorCard": {
            "category": "Category:",
            "notes": "Notes:",
            "noFactors": "No risk factors recorded"
        },
        "categories": {
            "lifestyle": "Lifestyle",
            "genetic": "Genetic",
            "medical": "Medical History",
            "environmental": "Environmental"
        },
        "factors": {
            "lifestyle": {
                "smoking": "Smoking",
                "alcohol": "Alcohol Use",
                "sedentary": "Sedentary Lifestyle",
                "diet": "Poor Diet"
            },
            "genetic": {
                "family_heart": "Family History of Heart Disease",
                "family_diabetes": "Family History of Diabetes",
                "family_cancer": "Family History of Cancer"
            },
            "medical": {
                "hypertension": "Hypertension",
                "diabetes": "Diabetes",
                "obesity": "Obesity",
                "cholesterol": "High Cholesterol"
            },
            "environmental": {
                "pollution": "Air Pollution",
                "occupational": "Occupational Hazards",
                "radiation": "Radiation Exposure"
            }
        }
    },
    "risk_formErrors": {
        "required": "This field is required",
        "factorTooShort": "Risk factor must be at least 2 characters"
    },
    "labResults_form": {
        "search": {
            "placeholder": "Search lab results..."
        },
        "buttons": {
            "filter": "Filter",
            "export": "Export",
            "addResults": "Add Results"
        },
        "noResults": "No lab results found",
        "modal": {
            "add": "Add Parameter",
            "title": "Add Lab Results",
            "basicInfo": "Basic Information",
            "testName": "Test Name",
            "testNamePlaceholder": "e.g. Blood Morphology, Lipid Profile",
            "orderDate": "Order Date",
            "labReference": "Lab Reference Number",
            "labReferencePlaceholder": "e.g. LAB/2024/001",
            "testParameters": "Test Parameters",
            "parameter": "Parameter",
            "parameterName": "Parameter Name",
            "normalRange": "Normal Range",
            "unit": "Unit",
            "value": "Value",
            "addParameter": "Add Parameter",
            "removeParameter": "Remove",
            "noParameters": "No parameters added. Click 'Add Parameter' to start.",
            "cancel": "Cancel",
            "addResult": "Add Result"
        },
        "card": {
            "labReference": "Ref",
            "view": "View",
            "download": "Download",
            "expand": "Expand",
            "collapse": "Collapse",
            "table": {
                "parameter": "Parameter",
                "result": "Result",
                "unit": "Unit",
                "normalRange": "Normal Range"
            }
        }
    },
    "labResults_formErrors": {
        "required": "This field is required",
        "invalidFormat": "Invalid format"
    },

    "eventDetail": {
        "title": "Event Details",
        "patient": "Patient",
        "visitDetails": "Visit Details",
        "visitType": "Visit Type",
        "specialization": "Specialization",
        "status": "Status",
        "appointmentType": "Appointment Type",
        "location": "Location",
        "doctor": "Doctor",
        "notes": "Notes",
        "actions": {
            "cancel": "Cancel",
            "edit": "Edit"
        },
        "statuses": {
            "scheduled": "Scheduled",
            "confirmed": "Confirmed",
            "in-progress": "In Progress",
            "completed": "Completed",
            "cancelled": "Cancelled"
        },
        "types": {
            "nfz": "Public Healthcare (NFZ)",
            "private": "Private"
        }
    },

    "weekDays": {
        "monday": "Mon",
        "tuesday": "Tue",
        "wednesday": "Wed",
        "thursday": "Thu",
        "friday": "Fri",
        "saturday": "Sat",
        "sunday": "Sun"
    },

    "documentForm": {
        "title": "Medical Documentation",
        "search": {
            "placeholder": "Search in documents..."
        },
        "buttons": {
            "filter": "Filter",
            "export": "Export",
            "newDocument": "New document"
        },
        "noDocuments": "No documents found"
    },
    "documentCard": {
        "buttons": {
            "view": "View",
            "download": "Download"
        },
        "author": "Author"
    },
    "documentUploadModal": {
        "title": "Upload New Document",
        "form": {
            "category": {
                "label": "Document Category",
                "placeholder": "Select a category",
                "options": {
                    "laboratories": "Laboratory Results",
                    "informedConsent": "Informed Consent"
                }
            },
            "file": {
                "label": "Document File",
                "dragText": "Click or drag file to this area to upload",
                "hint": "Support for a single file upload. PDF, DOC, DOCX, JPG, PNG formats."
            },
            "description": {
                "label": "Description",
                "placeholder": "Enter document description here..."
            }
        },
        "buttons": {
            "cancel": "Cancel",
            "upload": "Upload Documents",
            "addDocument": "Add Document",
            "updateDocument": "Update Document"
        },
        "documentsList": {
            "title": "Documents to Upload"
        }
    },
    "document_formErrors": {
        "required": "This field is required",
        "fileRequired": "Please upload a file"
    },

    "consentCard": {
        "granted": "Granted",
        "noConsent": "No consent",
        "withdraw": "Withdraw",
        "grantConsent": "Grant consent",
        "viewDocument": "View document",
        "withdrawConfirmTitle": "Withdraw Consent",
        "withdrawConfirmText": "Are you sure you want to withdraw this consent? This action cannot be undone."
    },
    "consent_form": {
        "title": "Consent to the processing of personal data",
        "submit": "Save changes",
        "saveSuccess": "Consents saved successfully",
        "saveError": "Failed to save consents",
        "legalNotice": "In accordance with Polish law, patient consent requires a physical signed document. Please upload a scanned copy of the signed consent form."
    },
    "consentUpload": {
        "title": "Upload Consent Document",
        "instruction": "Please upload a scanned copy of the signed consent form before granting consent.",
        "selectFile": "Select file",
        "upload": "Upload and grant consent",
        "fileRequired": "Please upload a document",
        "fileSizeError": "File must be smaller than 5MB",
        "fileTypeError": "Only PDF, PNG, and JPG files are allowed",
        "fileRequirements": "Accepted file types: PDF, JPG, PNG. Maximum size: 5MB.",
        "uploadSuccess": "Document uploaded and consent granted successfully",
        "uploadError": "Failed to upload document",
        "previewNotAvailable": "Preview is not available for this file type"
    },
    "consentTypes": {
        "personalData": {
            "title": "Processing of Personal Data",
            "description": "I consent to the processing of my personal data for the purpose of providing medical services in accordance with GDPR."
        },
        "medicalDocs": {
            "title": "Access to Medical Documentation",
            "description": "I consent to providing access to my medical documentation to authorized persons and other medical facilities for the purpose of continuing treatment."
        },
        "electronicComm": {
            "title": "Electronic Communication",
            "description": "I consent to receiving medical and organizational information via electronic means (email, SMS)."
        }
    }
}