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
        confirm: 'Confirm',
        delete: 'Delete',
        edit: 'Edit',
        back: 'Back',
        next: 'Next',
        finish: 'Finish',
        loading: 'Loading...',
        noData: 'No data available',
        yes: 'Yes',
        no: 'No',
        total: 'total',
        months: [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ],
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
        "or": "or",
        dateLocale: 'en-GB',
        dateTimeLocale: 'en-GB',
        datePlaceholder: 'dd/mm/yyyy',
        na: 'N/A',
        done: 'Done',
        logout: 'Logout',
        monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        error: 'Error',
        success: 'Success',
    },
    loading: {
        psychiatricModule: 'Psychiatric Module',
        initializingModule: 'Initializing module...'
    },
    auth: {
        login: 'Login',
        logout: 'Logout',
        email: 'Email',
        password: 'Password',
        error_default: 'Something went wrong. Please try again.'
    },

    dashboard: {
        title: 'Dashboard',
        overview: 'Overview of key information',
        todayPatients: "Today's Patients",
        pendingReports: 'Pending Reports',
        scheduledVisits: 'Scheduled Visits',
        completedVisits: 'Completed Visits',
        total: 'total',
        todaysVisits: "Today's Visits",
        loadingVisits: 'Loading visits...',
        calendar: {
            title: 'Visits for',
            noVisits: 'There are no visits scheduled for this date',
            visitsCount: 'visits',
            noVisitsFound: 'No visits found',
            close: 'Close'
        },
        quickActions: {
            title: 'Quick Actions',
            scheduleVisit: 'Schedule Visit',
            newVisit: 'New Visit',
            newPatient: 'New Patient',
            newDocument: 'New Document',
            messages: 'Messages',
            teleVisit: 'Tele-visit',
            reports: 'Reports',
            patients: 'Patients'
        },
        actionModal: {
            visitActions: 'Visit Actions',
            viewDetails: 'View Details',
            addNote: 'Add a Note',
            notePlaceholder: 'Write your note here...',
            saveNote: 'Save Note'
        },
        createVisit: {
            title: 'Create New Visit',
            subtitle: 'Fill in the visit details below',
            patientSection: 'Patient',
            searchPatientPlaceholder: 'Search patient (min. 3 characters)...',
            dateTimeSection: 'Date & Time',
            today: 'Today',
            tomorrow: 'Tomorrow',
            nextWeek: 'Next Week',
            yesterday: 'Yesterday',
            dateLabel: 'Date',
            timeLabel: 'Time',
            from: 'FROM',
            to: 'TO',
            visitDetailsSection: 'Visit Details',
            doctorLabel: 'Doctor',
            doctorPlaceholder: 'Select doctor',
            officeLabel: 'Office',
            officePlaceholder: 'Select office',
            typeLabel: 'Type',
            typePlaceholder: 'Select type',
            specializationLabel: 'Specialization',
            specializationPlaceholder: 'Select specialization',
            types: {
                private: 'Private',
                public: 'Public',
                insurance: 'Insurance'
            },
            specializations: {
                psychiatry: 'Psychiatry',
                neurology: 'Neurology',
                cardiology: 'Cardiology'
            },
            optionsSection: 'Options',
            eVisit: 'E-visit',
            prescriptionOnly: 'Prescription only',
            referral: 'Referral',
            notesSection: 'Notes',
            notesPlaceholder: 'Additional notes...'
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
    profile_settings: {
        title: "Account Management",
        edit_profile: "Edit Profile",
        security: "Security",
        change_password: "Change Password",
        notifications: "Notifications",
        email_notifications: "Email Notifications",
        sms_notifications: "SMS Notifications",
        app_notifications: "In-app Notifications",
        add_user: "Add User"
    },
    status: {
        scheduled: 'Scheduled',
        inProgress: 'In Progress',
        completed: 'Completed'
    },
    visit: {
        new: 'New visit',
        start: 'Start Visit',
        activeVisit: 'Active Visit',
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
            history_total: 'Total visits: {{total}}',
            audit: 'Change History',
            trends: 'Trend Analysis',
            noAllergies: 'No known allergies',
            noDiseases: 'No chronic diseases',
            noVisits: 'No visits found',
            tabs: {
                basic: 'Basic Information',
                history: 'Visit History'
            }
        },
        history_labels: {
            doctor: 'Doctor',
            notes: 'Notes',
            interview: 'Medical Interview',
            mainSymptoms: 'Main Symptoms',
            scales: 'Psychiatric Scales',
            examination: 'Examination',
            bloodPressure: 'Blood Pressure',
            generalCondition: 'General Condition',
            heartRate: 'Heart Rate',
            temperature: 'Temperature',
            noData: 'No data available',
            defaultNote: 'New Patient'
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
            additionalFindings: 'Additional Findings',
            placeholders: {
                bp: 'e.g. 120/80 mmHg',
                hr: 'e.g. 72',
                temp: 'e.g. 36.6',
                findings: 'Other observations...'
            }
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
            },
            search_title: 'Search ICD-10 code or diagnosis name...',
            search_placeholder: 'Search by code (e.g., F32.1) or description (e.g., depression)...',
            selected: 'Selected diagnoses',
            empty: 'No diagnoses selected',
            empty_desc: 'Search and select ICD-10 codes above',
            noResults: 'No matching codes found'
        },
        documents: {
            title: 'Documents',
            additionalNotes: 'Additional Notes',
            prescriptions: {
                title: 'Prescriptions',
                new: 'New Prescription',
                description: 'Issue electronic prescriptions compatible with the P1 system. You can save the prescription as a draft and sign it later.',
                add_med: 'Add medication',
                ezla: 'e-Prescription'
            },
            sickLeave: {
                title: 'Sick Leave',
                new: 'Issue sick leave',
                ezla: 'e-ZLA',
                remove: 'Remove sick leave',
                issue_ezla: 'Issue e-ZLA',
                patient_info: 'Patient Information',
                patient_info_desc: 'Patient data will be automatically retrieved from the ZUS system after entering the PESEL number.',
                period: 'Sick Leave Period',
                from: 'Date from',
                to: 'Date to',
                hospital: 'Hospital stay',
                hospital_from: 'Start date',
                hospital_to: 'End date',
                medical_data: 'Medical Data',
                icd10_label: 'Statistical disease number (ICD-10)',
                icd10_search: 'Search ICD-10 code',
                statistical_number: 'Statistical number',
                literal_codes: 'Literal Codes',
                recommendations: "Doctor's recommendations and instructions",
                recommendations_placeholder: 'E.g. bed rest, medication, rehabilitation...',
                payers: 'Payers',
                add_payer: 'Add payer',
                payer_search: 'Search payer by name or NIP...',
                no_payers: 'No payers added',
                pue_badge: 'PUE',
                validation: {
                    start_date_required: 'Start date is required',
                    end_date_required: 'End date is required',
                    end_before_start: 'End date cannot be before start date',
                    icd_required: 'ICD-10 code is required',
                    employer_required: 'At least one payer is required',
                    hospital_dates_required: 'Hospital stay dates are required',
                    hospital_end_before_start: 'Hospital end date cannot be before start date'
                }
            },
            referrals: {
                title: 'Referrals',
                new: 'New Referral',
                specialization: 'Specialization',
                specialization_placeholder: 'e.g. Cardiology',
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
            },
            emptyDiagnoses: 'No diagnoses added yet.',
            emptyDocuments: 'No documents issued.',
            prescriptionIssued: 'e-Prescription issued',
            referralIssued: 'Referral issued',
            aiTitle: 'AI Assistance',
            noAiFeatures: 'No AI features enabled',
            nextVisitLabels: {
                create: 'Create next visit'
            },
            placeholders: {
                recommendations: 'Enter general Recommendations'
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
            },
            badge: 'AI Powered',
            cds: {
                analyzing: 'Analyzing clinical data...',
                analysisError: 'Error during clinical analysis. Please try again.',
                selectData: 'Select Data for Analysis',
                analysisResults: 'Analysis Results',
                newAnalysis: 'New',
                detailedAnalysis: 'Detailed Analysis',
                evidence: 'Evidence',
                riskFactors: 'Risk Factors',
                recommendations: 'Recommendations',
                currentVisit: 'Current Visit',
                currentInterview: 'Current Interview',
                currentInterviewDesc: 'Include current visit interview data',
                previousVisits: 'Previous Visits',
                noPreviousVisits: 'No previous visits found',
                analyze: 'Analyze'
            },
            interview: {
                title: 'Medical Interview Coach',
                subtitle: 'AI-powered medical interview Coach',
                noData: 'No data available for analysis',
                noDataDesc: 'Please conduct a medical interview to analyze communication quality.',
                suggestedCount: 'Suggested questions: {{count}}',
                analyzing: 'Analyzing...',
                analyzeAgain: 'Re-analyze',
                analysisError: 'Analysis failed. Please try again later.',
                noSuggestions: 'No suggestions available',
                noAnalysis: 'No analysis data available',
                followUp: 'Follow-up',
                relevance: 'Relevance',
                tabs: {
                    suggestions: 'Question suggestions',
                    analysis: 'Communication analysis',
                    literature: 'Literature'
                },
                analysis: {
                    clusters: 'Symptom Clusters',
                    identified: 'Identified Areas',
                    potential: 'Potential Diagnoses',
                    toConsider: 'To Consider',
                    gaps: 'Diagnostic Gaps',
                    attention: 'Require Attention',
                    recommendations: 'Clinical Recommendations'
                }
            },
            transcription: {
                smart: 'Smart Transcription',
                smartDesc: 'AI-powered transcription of medical conversations',
                consult: 'Remedius Consult',
                consultDesc: 'AI-powered clinical assistant for medical consultations...',
                pharmacopedia: 'Pharmacopedia',
                pharmacopediaDesc: 'Comprehensive AI-driven drug information and interaction checker',
                transcribed: 'Transcribed',
                noTranscription: 'No transcription yet',
                noTranscriptionDesc: 'Record or upload audio to transcribe',
                noteGeneration: 'Note Generation',
                noteType: 'Note Type',
                soap: 'SOAP',
                clinical: 'Clinical',
                specialization: 'Specialization',
                psychiatry: 'Psychiatry',
                childPsychiatry: 'Child Psychiatry',
                smartSelect: 'Smart Select',
                surgery: 'Surgery',
                visitType: 'Visit Type',
                firstVisit: 'First Visit',
                followUp: 'Follow-up',
                selectPrevious: 'Select previous visits',
                noteLength: 'Note Length',
                small: 'Small',
                medium: 'Medium',
                large: 'Large',
                generating: 'Generating...',
                generateNote: 'Generate Note',
                notePreview: 'Generated Note',
                toInterview: 'To Interview',
                regenerate: 'Regenerate',
                selectAllRequired: 'Please select all required options',
                noContent: 'No transcription content available',
                copiedToInterview: 'Copied to interview successfully'
            },
            medInfo: {
                title: 'Medicine Information',
                search: 'Search Medicine',
                placeholder: 'Enter medicine name (min. 3 characters)...',
                empty: 'Search for a medicine to view details'
            },
            drug: {
                searchFailed: 'Failed to search medicines',
                loadFailed: 'Failed to load medicine details',
                loading: 'Loading details...',
                details: 'Medicine Details',
                viewMore: 'View More',
                viewLess: 'View Less',
                name: 'Name',
                composition: 'Composition',
                interactions: 'Interactions',
                indications: 'Indications',
                dosage: 'Dosage & Administration',
                contraindications: 'Contraindications',
                sideEffects: 'Side Effects',
                warnings: 'Warnings & Precautions',
                pregnancy: 'Pregnancy & Lactation',
                overdose: 'Overdose',
                pharmacology: 'Pharmacological Properties'
            },
            icd10: {
                subtitle: 'Search and add ICD-10 codes to visit',
                currentDiagnoses: 'Current Diagnoses',
                empty: 'Search ICD-10 codes',
                emptyDesc: 'Type a code or description to search'
            }
        },
        navigation: {
            previous: 'Back',
            next: 'Next',
            finish: 'Finish'
        },
        recommendations: {
            modal_title: 'Recommendations for Patient Portal',
            medication_schedule: 'Medication Schedule',
            search_medication: 'Search medication...',
            scale_monitoring: 'Scale Monitoring',
            add_to_monitoring: 'Add to monitoring',
            ai_assistant: {
                title: 'AI Assistant',
                enable: 'Enable AI assistant',
                tools: {
                    mood: {
                        title: 'Intelligent Mood Tracking',
                        description: 'AI analyzes mood patterns and suggests interventions'
                    },
                    meds: {
                        title: 'Adaptive Medication Reminders',
                        description: "AI adjusts reminders to the patient's daily rhythm"
                    },
                    crisis: {
                        title: 'Crisis Support',
                        description: 'AI detects warning signals and suggests appropriate actions'
                    },
                    coping: {
                        title: 'Personalized Coping Strategies',
                        description: "AI proposes techniques tailored to the patient's situation"
                    }
                }
            },
            share_emergency: 'Share emergency contacts in the portal',
            save: 'Save Recommendations',
            assessments: {
                depression: 'Depression Assessment',
                anxiety: 'Anxiety Assessment',
                mental_health: 'Mental Health Assessment',
                ptsd_trauma: 'PTSD and Trauma Assessment',
                addiction: 'Addiction Assessment',
                sleep: 'Sleep Assessment'
            }
        },
        scales: {
            question_progress: 'Question {{current}} of {{total}}',
            buttons: {
                cancel: 'Cancel',
                back: 'Back',
                finish: 'Finish'
            },
            questions: {
                hamd: {
                    q1: { title: 'Depressed mood (sadness, hopeless, helpless, worthless)', o0: 'Absent', o1: 'These feeling states indicated only on questioning', o2: 'These feeling states spontaneously reported verbally', o3: 'Communicates feeling states non-verbally', o4: 'Patient reports virtually only these feeling states' },
                    q2: { title: 'Feelings of guilt', o0: 'Absent', o1: 'Self reproach, feels he/she has let people down', o2: 'Ideas of guilt or rumination over past errors', o3: 'Present illness is a punishment. Delusions of guilt', o4: 'Hears accusatory or denunciatory voices' },
                    q3: { title: 'Suicide', o0: 'Absent', o1: 'Feels life is not worth living', o2: 'Wishes he/she were dead', o3: 'Ideas or gestures of suicide', o4: 'Attempts at suicide' },
                    q4: { title: 'Insomnia: Early in the night', o0: 'No difficulty falling asleep', o1: 'Complains of occasional difficulty falling asleep', o2: 'Complains of nightly difficulty falling asleep' },
                    q5: { title: 'Insomnia: Middle of the night', o0: 'No difficulty', o1: 'Restless and disturbed during the night', o2: 'Waking during the night' },
                    q6: { title: 'Insomnia: Early hours of the morning', o0: 'No difficulty', o1: 'Waking in early hours but goes back to sleep', o2: 'Unable to fall asleep again' },
                    q7: { title: 'Work and activities', o0: 'No difficulty', o1: 'Thoughts and feelings of incapacity or weakness', o2: 'Loss of interest in activity, hobbies or work', o3: 'Decrease in actual time spent in activities', o4: 'Stopped working because of present illness' },
                    q8: { title: 'Retardation (slowness of thought and speech)', o0: 'Normal speech and thought', o1: 'Slight retardation at interview', o2: 'Obvious retardation at interview', o3: 'Interview difficult', o4: 'Complete stupor' },
                    q9: { title: 'Agitation', o0: 'None', o1: 'Fidgetiness', o2: 'Playing with hands, hair, etc.', o3: 'Moving about, can\'t sit still', o4: 'Hand wringing, nail biting, etc.' },
                    q10: { title: 'Anxiety psychic', o0: 'No difficulty', o1: 'Subjective tension and irritability', o2: 'Worrying about minor matters', o3: 'Apprehensive attitude apparent in face or speech', o4: 'Fears expressed without questioning' },
                    q11: { title: 'Anxiety somatic', o0: 'Absent', o1: 'Mild', o2: 'Moderate', o3: 'Severe', o4: 'Incapacitating' },
                    q12: { title: 'Somatic symptoms gastro-intestinal', o0: 'None', o1: 'Loss of appetite', o2: 'Difficulty eating without urging' },
                    q13: { title: 'Somatic symptoms - General', o0: 'None', o1: 'Heaviness in limbs, back or head', o2: 'Any clear-cut symptom' },
                    q14: { title: 'Genital symptoms', o0: 'Absent', o1: 'Mild', o2: 'Severe' },
                    q15: { title: 'Hypochondriasis', o0: 'Not present', o1: 'Self-absorption (bodily)', o2: 'Preoccupation with health', o3: 'Frequent complaints, requests for help', o4: 'Hypochondriacal delusions' },
                    q16: { title: 'Loss of weight', o0: 'No weight loss', o1: 'Probable weight loss', o2: 'Definite weight loss' },
                    q17: { title: 'Insight', o0: 'Acknowledges being depressed and ill', o1: 'Attributes cause to bad food, climate, etc.', o2: 'Denies being ill at all' }
                },
                madrs: {
                    q1: { title: 'Reported sadness', o0: { title: 'Absent', desc: 'Occasionally sad in keeping with circumstances' }, o1: { title: 'Mild', desc: 'Sad or downcast but brightens up without difficulty' }, o2: { title: 'Moderate', desc: 'Pervasive feeling of sadness or pessimism' }, o3: { title: 'Severe', desc: 'Continuous or unchanging sadness, misery' } },
                    q2: { title: 'Apparent sadness', o0: { title: 'Absent', desc: 'No sadness' }, o1: { title: 'Mild', desc: 'Appears disheartened but brightens up' }, o2: { title: 'Moderate', desc: 'Appears sad and unhappy most of the time' }, o3: { title: 'Severe', desc: 'Appears very unhappy all the time' } },
                    q3: { title: 'Inner tension', o0: { title: 'Absent', desc: 'Calm. Only transient inner tension' }, o1: { title: 'Mild', desc: 'Occasional feelings of edginess' }, o2: { title: 'Moderate', desc: 'Constant feeling of inner tension' }, o3: { title: 'Severe', desc: 'Unrelenting dread or anguish' } },
                    q4: { title: 'Reduced sleep', o0: { title: 'Absent', desc: 'Sleeps as usual' }, o1: { title: 'Mild', desc: 'Slight difficulty falling asleep' }, o2: { title: 'Moderate', desc: 'Sleep reduced or broken by at least two hours' }, o3: { title: 'Severe', desc: 'Less than two or three hours of sleep' } },
                    q5: { title: 'Reduced appetite', o0: { title: 'Absent', desc: 'Normal or increased appetite' }, o1: { title: 'Mild', desc: 'Slightly reduced appetite' }, o2: { title: 'Moderate', desc: 'No appetite. Food without taste' }, o3: { title: 'Severe', desc: 'Needs persuasion to eat at all' } },
                    q6: { title: 'Concentration difficulties', o0: { title: 'Absent', desc: 'No difficulties in concentrating' }, o1: { title: 'Mild', desc: 'Occasional difficulties in collecting thoughts' }, o2: { title: 'Moderate', desc: 'Difficulties with reading or conversation' }, o3: { title: 'Severe', desc: 'Inability to read or sustain conversation' } },
                    q7: { title: 'Lassitude', o0: { title: 'Absent', desc: 'No sluggishness' }, o1: { title: 'Mild', desc: 'Difficulties in starting activities' }, o2: { title: 'Moderate', desc: 'Simple routine activities only with effort' }, o3: { title: 'Severe', desc: 'Complete lassitude. Unable to do anything' } },
                    q8: { title: 'Inability to feel', o0: { title: 'Absent', desc: 'Normal interest in surroundings' }, o1: { title: 'Mild', desc: 'Reduced ability to enjoy usual interests' }, o2: { title: 'Moderate', desc: 'Loss of interest and feelings' }, o3: { title: 'Severe', desc: 'Experience of being emotionally paralysed' } },
                    q9: { title: 'Pessimistic thoughts', o0: { title: 'Absent', desc: 'No pessimistic thoughts' }, o1: { title: 'Mild', desc: 'Fluctuating ideas of failure' }, o2: { title: 'Moderate', desc: 'Persistent self-accusations' }, o3: { title: 'Severe', desc: 'Delusions of ruin, guilt or sin' } },
                    q10: { title: 'Suicidal thoughts', o0: { title: 'Absent', desc: 'Enjoys life' }, o1: { title: 'Mild', desc: 'Weary of life. Fleeting suicidal thoughts' }, o2: { title: 'Moderate', desc: 'Probably better off dead. Suicidal thoughts common' }, o3: { title: 'Severe', desc: 'Explicit plans for suicide' } }
                },
                asrs: {
                    part_a: 'Part A',
                    part_b: 'Part B',
                    options: {
                        never: 'Never',
                        rarely: 'Rarely',
                        sometimes: 'Sometimes',
                        often: 'Often',
                        very_often: 'Very Often'
                    },
                    q1: { title: 'How often do you have trouble finishing the final details of a project?' },
                    q2: { title: 'How often do you have trouble organizing tasks that require planning?' },
                    q3: { title: 'How often do you have problems remembering appointments or commitments?' },
                    q4: { title: 'How often do you avoid or delay starting a task that requires a lot of thinking?' },
                    q5: { title: 'How often do you fidget or move your hands or feet?' },
                    q6: { title: 'How often do you feel overly active and compelled to do things?' },
                    q7: { title: 'How often do you make careless mistakes?' },
                    q8: { title: 'How often do you have difficulty keeping your attention?' },
                    q9: { title: 'How often do you have difficulty concentrating on what people say?' },
                    q10: { title: 'How often do you misplace or have difficulty finding things?' },
                    q11: { title: 'How often are you distracted by activity or noise?' },
                    q12: { title: 'How often do you leave your seat in meetings?' },
                    q13: { title: 'How often do you feel restless or fidgety?' },
                    q14: { title: 'How often do you have difficulty unwinding and relaxing?' },
                    q15: { title: 'How often do you find yourself talking too much?' },
                    q16: { title: 'How often do you find yourself finishing the sentences of others?' },
                    q17: { title: 'How often do you have difficulty waiting your turn?' },
                    q18: { title: 'How often do you interrupt others when they are busy?' }
                },
                hama: {
                    q1: { title: 'Anxious mood', o0: { title: 'Not present', desc: 'No anxious mood' }, o1: { title: 'Mild', desc: 'Mild worries or anticipation' }, o2: { title: 'Moderate', desc: 'Moderate anxious mood' }, o3: { title: 'Severe', desc: 'Severe anxious mood' }, o4: { title: 'Very severe', desc: 'Overwhelming anxious mood' } },
                    q2: { title: 'Tension', o0: { title: 'Not present', desc: 'No tension' }, o1: { title: 'Mild', desc: 'Mild tension or restlessness' }, o2: { title: 'Moderate', desc: 'Moderate tension' }, o3: { title: 'Severe', desc: 'Severe tension' }, o4: { title: 'Very severe', desc: 'Extreme tension' } },
                    q3: { title: 'Fears', o0: { title: 'Not present', desc: 'No fears' }, o1: { title: 'Mild', desc: 'Mild fears' }, o2: { title: 'Moderate', desc: 'Moderate fears' }, o3: { title: 'Severe', desc: 'Severe fears' }, o4: { title: 'Very severe', desc: 'Overwhelming fears' } },
                    q4: { title: 'Insomnia', o0: { title: 'Not present', desc: 'Normal sleep' }, o1: { title: 'Mild', desc: 'Mild sleep disturbances' }, o2: { title: 'Moderate', desc: 'Moderate insomnia' }, o3: { title: 'Severe', desc: 'Severe insomnia' }, o4: { title: 'Very severe', desc: 'Extreme insomnia' } },
                    q5: { title: 'Intellectual', o0: { title: 'Not present', desc: 'Normal concentration' }, o1: { title: 'Mild', desc: 'Mild difficulty concentrating' }, o2: { title: 'Moderate', desc: 'Moderate cognitive difficulties' }, o3: { title: 'Severe', desc: 'Severe concentration problems' }, o4: { title: 'Very severe', desc: 'Unable to concentrate' } },
                    q6: { title: 'Depressed mood', o0: { title: 'Not present', desc: 'No depression' }, o1: { title: 'Mild', desc: 'Boredom, loss of interest' }, o2: { title: 'Moderate', desc: 'Clearly depressed, weepy' }, o3: { title: 'Severe', desc: 'Deeply depressed, pessimistic' }, o4: { title: 'Very severe', desc: 'Hopelessness' } },
                    q7: { title: 'Somatic symptoms (sensory)', o0: { title: 'Not present', desc: 'No sensory symptoms' }, o1: { title: 'Mild', desc: 'Tinnitus, blurred vision' }, o2: { title: 'Moderate', desc: 'Hot and cold flushes, weakness' }, o3: { title: 'Severe', desc: 'Prickling sensation' }, o4: { title: 'Very severe', desc: 'Extreme discomfort' } },
                    q8: { title: 'Somatic symptoms (muscular)', o0: { title: 'Not present', desc: 'No muscular symptoms' }, o1: { title: 'Mild', desc: 'Pains and aches, twitching' }, o2: { title: 'Moderate', desc: 'Muscle stiffness, clonic jerks' }, o3: { title: 'Severe', desc: 'Grinding teeth, unsteady voice' }, o4: { title: 'Very severe', desc: 'Extreme muscular tension' } },
                    q9: { title: 'Cardiovascular symptoms', o0: { title: 'Not present', desc: 'No cardiovascular symptoms' }, o1: { title: 'Mild', desc: 'Tachycardia, palpitations' }, o2: { title: 'Moderate', desc: 'Chest pain, throbbing of vessels' }, o3: { title: 'Severe', desc: 'Fainting feelings' }, o4: { title: 'Very severe', desc: 'Extreme cardiac distress' } },
                    q10: { title: 'Respiratory symptoms', o0: { title: 'Not present', desc: 'No respiratory symptoms' }, o1: { title: 'Mild', desc: 'Chest pressure, sighing' }, o2: { title: 'Moderate', desc: 'Dyspnea, choking feelings' }, o3: { title: 'Severe', desc: 'Extreme hyperventilation' }, o4: { title: 'Very severe', desc: 'Inability to breathe' } },
                    q11: { title: 'Gastrointestinal symptoms', o0: { title: 'Not present', desc: 'No gastrointestinal symptoms' }, o1: { title: 'Mild', desc: 'Difficulty swallowing, wind' }, o2: { title: 'Moderate', desc: 'Abdominal pain' }, o3: { title: 'Severe', desc: 'Nausea, vomiting' }, o4: { title: 'Very severe', desc: 'Extreme digestive distress' } },
                    q12: { title: 'Genitourinary symptoms', o0: { title: 'Not present', desc: 'No genitourinary symptoms' }, o1: { title: 'Mild', desc: 'Frequency of micturition' }, o2: { title: 'Moderate', desc: 'Urgency, amenorrhea' }, o3: { title: 'Severe', desc: 'Ejaculatio praecox, loss of libido' }, o4: { title: 'Very severe', desc: 'Impotence, menstrual issues' } },
                    q13: { title: 'Autonomic symptoms', o0: { title: 'Not present', desc: 'No autonomic symptoms' }, o1: { title: 'Mild', desc: 'Dry mouth, flushing' }, o2: { title: 'Moderate', desc: 'Pallor, tendency to sweat' }, o3: { title: 'Severe', desc: 'Giddiness, tension headache' }, o4: { title: 'Very severe', desc: 'Gooseflesh' } },
                    q14: { title: 'Behavior at interview', o0: { title: 'Not present', desc: 'Relaxed behavior' }, o1: { title: 'Mild', desc: 'Fidgeting, restless, pacing' }, o2: { title: 'Moderate', desc: 'Tremor of hands, furrowed brow' }, o3: { title: 'Severe', desc: 'Strained face, rapid breathing' }, o4: { title: 'Very severe', desc: 'Facial pallor, swallowing' } }
                },
                isi: {
                    q1: { title: 'Difficulty falling asleep', o0: { title: 'None', desc: 'No problems falling asleep' }, o1: { title: 'Mild', desc: 'Slight difficulties' }, o2: { title: 'Moderate', desc: 'Noticeable difficulties' }, o3: { title: 'Severe', desc: 'Significant difficulties' }, o4: { title: 'Very Severe', desc: 'Extreme difficulties' } },
                    q2: { title: 'Difficulty maintaining sleep', o0: { title: 'None', desc: 'No night awakenings' }, o1: { title: 'Mild', desc: 'Occasional awakenings' }, o2: { title: 'Moderate', desc: 'Regular awakenings' }, o3: { title: 'Severe', desc: 'Frequent awakenings' }, o4: { title: 'Very Severe', desc: 'Constant awakenings' } },
                    q3: { title: 'Problems with early morning awakening', o0: { title: 'None', desc: 'Waking up at planned time' }, o1: { title: 'Mild', desc: 'Waking up slightly early' }, o2: { title: 'Moderate', desc: 'Noticeably early waking' }, o3: { title: 'Severe', desc: 'Significantly early waking' }, o4: { title: 'Very Severe', desc: 'Extremely early waking' } },
                    q4: { title: 'How satisfied are you with your sleep?', o0: { title: 'Very satisfied', desc: 'Sleep is satisfying' }, o1: { title: 'Satisfied', desc: 'Sleep is generally good' }, o2: { title: 'Moderately satisfied', desc: 'Sleep is acceptable' }, o3: { title: 'Dissatisfied', desc: 'Sleep is insufficient' }, o4: { title: 'Very dissatisfied', desc: 'Sleep is unsatisfying' } },
                    q5: { title: 'Interference with daily functioning', o0: { title: 'Not at all', desc: 'No impact' }, o1: { title: 'Slightly', desc: 'Minimal impact' }, o2: { title: 'Moderately', desc: 'Noticeable impact' }, o3: { title: 'Very much', desc: 'Significant impact' }, o4: { title: 'Extremely', desc: 'Severe impairment' } },
                    q6: { title: 'Noticeable quality of life impairment', o0: { title: 'Not at all', desc: 'Not visible to others' }, o1: { title: 'A little', desc: 'Signs of fatigue' }, o2: { title: 'Somewhat', desc: 'Sometimes noticeable' }, o3: { title: 'Much', desc: 'Clearly visible' }, o4: { title: 'Very much', desc: 'Others are very aware' } },
                    q7: { title: 'Worried/distressed about sleep', o0: { title: 'Not at all', desc: 'No concern' }, o1: { title: 'A little', desc: 'Occasional concern' }, o2: { title: 'Somewhat', desc: 'Regular concern' }, o3: { title: 'Much', desc: 'Frequently worried' }, o4: { title: 'Very much', desc: 'Constant distress' } }
                },
                cars2: {
                    q1: { title: 'Relationships with people', o0: { title: 'Within normal limits', desc: 'Age-appropriate behavior' }, o1: { title: 'Mildly atypical', desc: 'Slight difficulties' }, o2: { title: 'Moderately atypical', desc: 'Noticeable difficulties' }, o3: { title: 'Significantly atypical', desc: 'Severe difficulties' } },
                    q2: { title: 'Imitation', o0: { title: 'Within normal limits', desc: 'Imitates appropriately' }, o1: { title: 'Mildly atypical', desc: 'Imitates most of the time' }, o2: { title: 'Moderately atypical', desc: 'Imitates only occasionally' }, o3: { title: 'Significantly atypical', desc: 'Rarely or never imitates' } },
                    q3: { title: 'Emotional responses', o0: { title: 'Within normal limits', desc: 'Appropriate to situation' }, o1: { title: 'Mildly atypical', desc: 'Occasionally inappropriate' }, o2: { title: 'Moderately atypical', desc: 'Frequently inappropriate' }, o3: { title: 'Significantly atypical', desc: 'Extremely inappropriate' } },
                    q4: { title: 'Use of body', o0: { title: 'Within normal limits', desc: 'Movements typical for age' }, o1: { title: 'Mildly atypical', desc: 'Slight oddities' }, o2: { title: 'Moderately atypical', desc: 'Noticeable unusual movements' }, o3: { title: 'Significantly atypical', desc: 'Frequent odd movements' } },
                    q5: { title: 'Use of objects', o0: { title: 'Within normal limits', desc: 'Appropriate use' }, o1: { title: 'Mildly atypical', desc: 'Less interest or unusual use' }, o2: { title: 'Moderately atypical', desc: 'Little interest in function' }, o3: { title: 'Significantly atypical', desc: 'Focus on unusual aspects' } },
                    q6: { title: 'Adaptation to change', o0: { title: 'Within normal limits', desc: 'Adapts easily' }, o1: { title: 'Mildly atypical', desc: 'Difficulties with new tasks' }, o2: { title: 'Moderately atypical', desc: 'Strongly resists change' }, o3: { title: 'Significantly atypical', desc: 'Severe reactions' } },
                    q7: { title: 'Visual response', o0: { title: 'Within normal limits', desc: 'Normal eye contact' }, o1: { title: 'Mildly atypical', desc: 'Occasional staring' }, o2: { title: 'Moderately atypical', desc: 'Frequent odd use of eyes' }, o3: { title: 'Significantly atypical', desc: 'Extreme visual avoidance' } },
                    q8: { title: 'Listening response', o0: { title: 'Within normal limits', desc: 'Normal response' }, o1: { title: 'Mildly atypical', desc: 'Sometimes disregards sounds' }, o2: { title: 'Moderately atypical', desc: 'Often disregards sounds' }, o3: { title: 'Significantly atypical', desc: 'Marked overreaction' } },
                    q9: { title: 'Taste, smell, and touch response', o0: { title: 'Within normal limits', desc: 'Normal use' }, o1: { title: 'Mildly atypical', desc: 'May occasionally overreact' }, o2: { title: 'Moderately atypical', desc: 'Frequently preoccupied' }, o3: { title: 'Significantly atypical', desc: 'Severe reactions' } },
                    q10: { title: 'Fear or nervousness', o0: { title: 'Within normal limits', desc: 'Normal for situation' }, o1: { title: 'Mildly atypical', desc: 'More or less fear than expected' }, o2: { title: 'Moderately atypical', desc: 'Fear is frequent, extreme' }, o3: { title: 'Significantly atypical', desc: 'Persistent fear' } },
                    q11: { title: 'Verbal communication', o0: { title: 'Within normal limits', desc: 'Normal development' }, o1: { title: 'Mildly atypical', desc: 'Slow development' }, o2: { title: 'Moderately atypical', desc: 'Unusual speech, repetition' }, o3: { title: 'Significantly atypical', desc: 'No meaningful speech' } },
                    q12: { title: 'Nonverbal communication', o0: { title: 'Within normal limits', desc: 'Normal use of gestures' }, o1: { title: 'Mildly atypical', desc: 'Immature or awkward' }, o2: { title: 'Moderately atypical', desc: 'Frequent difficulty' }, o3: { title: 'Significantly atypical', desc: 'Peculiar or absent' } },
                    q13: { title: 'Activity level', o0: { title: 'Within normal limits', desc: 'Appropriate for age' }, o1: { title: 'Mildly atypical', desc: 'Slightly hyper or lethargic' }, o2: { title: 'Moderately atypical', desc: 'Frequently restless' }, o3: { title: 'Significantly atypical', desc: 'Extreme activity levels' } },
                    q14: { title: 'Intellectual response', o0: { title: 'Within normal limits', desc: 'Normal performance' }, o1: { title: 'Mildly atypical', desc: 'Not as high as it seems' }, o2: { title: 'Moderately atypical', desc: 'Significant delays' }, o3: { title: 'Significantly atypical', desc: 'Severe impairment' } },
                    q15: { title: 'General impressions', o0: { title: 'Within normal limits', desc: 'No signs of autism' }, o1: { title: 'Mild symptoms', desc: 'Fulfills criteria for mild autism' }, o2: { title: 'Moderate symptoms', desc: 'Clear signs of autism' }, o3: { title: 'Severe symptoms', desc: 'Extreme symptoms' } }
                }
            }
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
            appointments: 'Scheduled visits',
            referrals: 'Referrals'
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
        },
        actions: {
            spotlight: 'Spotlight'
        },
        options: {
            darkMode: 'Dark Mode',
            settings: 'Settings',
            logout: 'Logout'
        }
    },

    moduleSelection: {
        loading: {
            title: "Psychiatric Module",
            initializing: "Initializing module..."
        },
        selection: {
            subHeader: "Select a module to start working",
            psychiatry: {
                title: "Psychiatry",
                subtitle: "Psychiatric module",
                description: "Comprehensive tool for psychiatric documentation, powered by AI.",
                bullet1: "• Intelligent psychiatric scales",
                bullet2: "• Emotion and behavior analysis",
                bullet3: "• AI diagnostic assistant"
            },
            poz: {
                title: "POZ",
                subtitle: "Primary Healthcare",
                description: "Comprehensive system for managing primary care practice, with e-prescription and e-referral integration.",
                bullet1: "• P1 Integration",
                bullet2: "• Declaration management",
                bullet3: "• NFZ settlements",
                comingSoon: "Coming Soon"
            }
        }
    },

    patientAction: {
        viewDetails: "View Details",
        patientProfile: "Patient Profile",
        addInCalendar: "Add in Calendar",
        deletePatient: "Delete Patient",
        saveNote: "Save Note",
        enterNote: "Enter your note here...",
        cancel: "Cancel"
    },

    patientDetailsModal: {
        sections: {
            basicInfo: "BASIC INFORMATION",
            address: "ADDRESS",
            insurance: "INSURANCE",
            portal: "PATIENT PORTAL / NOTIFICATIONS",
            employer: "EMPLOYER",
            authorizedPersons: "AUTHORIZED PERSONS AND LIST OF SHARED MEDICAL RECORDS",
            consents: "CONSENT TO PROCESS PERSONAL DATA"
        },
        labels: {
            pesel: "PESEL:",
            dob: "Date of birth:",
            insuranceType: "Type:",
            insuranceNumber: "Number:",
            portalAccount: "Portal account:",
            notifications: "Notifications:",
            idCard: "ID card:",
            validUntil: "valid until:"
        },
        status: {
            active: "Active",
            granted: "Granted",
            notGranted: "Not Granted"
        },
        empty: {
            none: "None",
            na: "N/A",
            noAuthorizedPersons: "No authorized persons",
            noConsents: "No consents provided"
        },
        buttons: {
            close: "Close",
            editData: "Edit data"
        }
    },

    patientDocuments: {
        title: "MEDICAL DOCUMENTATION",
        fetchingDocuments: "Fetching documents...",
        searchPlaceholder: "Search in documents...",
        newDocument: "New document",
        uploadTitle: "Upload New Document",
        documentCategory: "Document Category",
        selectCategory: "Select a category",
        categoryLabResults: "Laboratory Results",
        categoryInformedConsent: "Informed Consent",
        documentFile: "Document File",
        uploadAreaText: "Click or drag file to this area to upload",
        uploadAreaSubText: "Support for a single file upload. PDF, DOC, DOCX, JPG, PNG formats.",
        description: "Description",
        descriptionPlaceholder: "Enter document description here...",
        addDocument: "Add Document",
        documentsToUpload: "Documents to Upload",
        cancel: "Cancel",
        uploadDocuments: "Upload Documents",
        untitledDocument: "Untitled Document",
        noDate: "No date",
        author: "Author:",
        system: "System",
        noDescription: "No description provided for this document.",
        noSearchMatch: "No documents match your search",
        noDocuments: "No documents found",
        selectFileCategory: "Please select a file and a category",
        uploadSuccess: "Patient medical record updated successfully!",
        uploadFailed: "Failed to update medical record",
        uploadError: "An error occurred during upload"
    },

    patientInsurance: {
        title: "INSURANCE HISTORY",
        searchPlaceholder: "Search in insurance history...",
        filter: "Filter",
        export: "Export",
        insurer: "Insurer:",
        policyNumber: "Policy Number:",
        noInsuranceHistory: "No insurance history",
        na: "N/A"
    },

    patientLaboratory: {
        title: "TEST RESULTS",
        fetchingRecords: "Fetching lab records...",
        searchPlaceholder: "Search lab results...",
        addResults: "Add Results",
        addLabResults: "Add Lab Results",
        basicInformation: "Basic Information",
        testName: "Test Name",
        testNamePlaceholder: "e.g. Blood Morphology, Lipid Profile",
        orderDate: "Order Date",
        selectDate: "Select date",
        done: "Done",
        labReferenceNumber: "Lab Reference Number",
        labRefPlaceholder: "e.g. LAB/2024/001",
        testParameters: "Test Parameters",
        addParameter: "Add Parameter",
        parameterName: "Parameter Name",
        normalRange: "Normal Range",
        normalRangePlaceholder: "e.g. 4.0-10.0, <200, >40",
        unit: "Unit",
        unitPlaceholder: "e.g. g/dL, 10^3/\u03bcL",
        value: "Value",
        cancel: "Cancel",
        addResult: "Add Result",
        noParametersAdded: "No parameters added. Click 'Add Parameter' to start.",
        laboratoryTest: "Laboratory Test",
        orderNumber: "Order number:",
        normalRangeLabel: "Normal range:",
        noParametersRecorded: "No parameters recorded for this test.",
        noSearchMatch: "No lab results match your search",
        noLabResults: "No lab results found",
        enterTestNameRef: "Please enter test name and reference number",
        addSuccess: "Laboratory result added successfully",
        addFailed: "Failed to update laboratory records"
    },

    medicalData: {
        fetchingHistory: "Fetching medical history...",
        medications: "Medications",
        diagnoses: "Diagnoses",
        allergies: "Allergies",
        chronicConditions: "Chronic Conditions",
        familyHistory: "Family History",
        riskFactors: "Risk Factors",
        addMedication: "Add Medication",
        addDiagnosis: "Add Diagnosis",
        addAllergy: "Add Allergy",
        addChronicCondition: "Add Chronic Condition",
        addFamilyHistory: "Add Family History",
        addRiskFactor: "Add Risk Factor",
        medicationName: "Medication Name",
        medicationNamePlaceholder: "Enter medication name",
        genericName: "Common Name (Generic)",
        genericNamePlaceholder: "Enter generic name",
        form: "Form",
        dose: "Dose",
        dosePlaceholder: "e.g. 500",
        dosageInstructions: "Dosage Instructions",
        dosageInstructionsPlaceholder: "e.g. 1 tablet twice daily",
        startDate: "Start Date",
        notes: "Notes",
        notesPlaceholder: "Add any additional notes...",
        regularMedication: "Regular medication (taken on schedule)",
        diagnosisDescription: "Description",
        diagnosisCode: "Code",
        diagnosisCodePlaceholder: "e.g. F32.1",
        diagnosisType: "Diagnosis Type",
        primaryDiagnosis: "Primary diagnosis",
        secondaryDiagnosis: "Secondary diagnosis",
        allergyType: "Allergy Type",
        allergenName: "Allergen Name",
        allergenNamePlaceholder: "Enter allergen name...",
        allergicReaction: "Allergic Reaction",
        allergicReactionPlaceholder: "Describe allergic reaction...",
        severity: "Severity",
        selectSeverity: "Select severity",
        conditionName: "Condition Name",
        conditionNamePlaceholder: "Enter condition name...",
        status: "Status",
        selectStatus: "Select status",
        currentTreatment: "Current Treatment",
        currentTreatmentPlaceholder: "Describe treatment plan...",
        diseaseName: "Disease Name",
        diseaseNamePlaceholder: "e.g. Hypertension",
        relationship: "Relationship",
        selectRelationship: "Select relationship",
        ageOfOnset: "Age of Onset",
        ageOfOnsetLower: "Age of onset",
        ageOfOnsetPlaceholder: "e.g. 45",
        riskFactor: "Factor",
        riskFactorPlaceholder: "e.g. Smoking",
        riskCategory: "Risk Category",
        selectCategory: "Select category",
        riskLevel: "Level",
        done: "Done",
        cancel: "Cancel",
        add: "Add",
        saveChanges: "Save Changes",
        updateSuccess: "{{section}} updated successfully",
        updateFailed: "Failed to update {{section}}"
    },

    patientLogs: {
        title: "Patient Activity Logs",
        searchPlaceholder: "Search logs...",
        allCategories: "All Categories",
        medical: "Medical",
        other: "Other",
        personal: "Personal",
        system: "System",
        activityType: "ACTIVITY TYPE",
        performedBy: "PERFORMED BY",
        dateTime: "DATE & TIME",
        summary: "SUMMARY",
        loadingLogs: "Loading logs...",
        noLogsFound: "No logs found",
        showingLogs: "Showing {{count}} of {{total}} logs",
        na: "N/A",
        patientActivityLogs: "Patient Activity Logs",
        searchLogs: "Search logs",
        viewedMedicalInformation: "Viewed Medical Information",
        updatedMedicalData: "Updated medical data",
        updated: "Updated {{field}}",
        activityTypes: {
            medical_data_updated: "Medical Data Updated",
            medical_record_accessed: "Medical Record Accessed",
            profile_viewed: "Profile Viewed",
            patient_record_updated: "Patient Record Updated",
            personal_data_updated: "Personal Data Updated",
            visit_scheduled: "Visit Scheduled"
        }
    },

    personalData: {
        fetchingDetails: "Fetching profile details...",
        basicInformation: "Basic Information",
        moreInformation: "More Information",
        address: "Address",
        insurance: "Insurance",
        employer: "Employer",
        authorizedPersons: "Authorized Persons",
        consentProcessing: "Consents & Processing",
        firstName: "First Name",
        lastName: "Last Name",
        middleName: "Middle Name",
        maidenName: "Maiden Name",
        pesel: "PESEL",
        dob: "Date of Birth",
        gender: "Gender",
        phone: "Phone Number",
        altPhone: "Alternative Phone",
        email: "E-mail",
        birthPlace: "Place of Birth",
        bloodType: "Blood Type",
        internalCardNumber: "Internal Card Number",
        documentType: "Document Type",
        foreignerStatus: "Foreigner Status",
        city: "City",
        street: "Street",
        house: "House Number",
        apartment: "Apartment Number",
        postalCode: "Postal Code",
        voivodeship: "Voivodeship",
        country: "Country",
        municipalityTeryt: "Municipality TERYT Code",
        nfzBranch: "NFZ Branch",
        additionalRights: "Additional Rights",
        employerName: "Employer Name",
        employerNip: "Employer NIP",
        occupation: "Occupation",
        symbol: "Production Symbol",
        relationship: "Relationship",
        docType: "Document Type",
        docNumber: "Document Number",
        validUntil: "Valid Until",
        addNewInsurer: "Add New Insurer",
        insurerName: "Insurer Name",
        policyNumber: "Policy Number",
        addAuthorizedPerson: "Add Authorized Person",
        editAuthorizedPerson: "Edit Authorized Person",
        noAuthorizationStatement: "Statement of No Authorization",
        consentConfirmation: "Consent Confirmation",
        saveChanges: "Save Changes",
        add: "Add",
        save: "Save",
        cancel: "Cancel",
        edit: "Edit",
        remove: "Remove",
        selectFile: "Select File",
        grantConsent: "Grant Consent",
        withdraw: "Withdraw",
        granted: "Granted",
        noConsent: "No Consent",
        notAuthorizeAnyone: "Patient does not authorize anyone:",
        signedCurrentAuthorization: "Patient signed current version of authorization:",
        consentRequirementNotice: "In accordance with Polish law, patient consent requires a physical signed document. Please upload a scanned copy of the signed consent form.",
        uploadConsentTitle: "Upload Consent Document",
        uploadConsentDesc: "Please upload a scanned copy of the signed consent form before granting consent.",
        acceptedFileTypes: "Accepted file types: PDF, JPG, PNG. Maximum size: 5MB.",
        uploadAndGrant: "Upload and grant consent",
        uploading: "Uploading...",
        dateNotAvailable: "(Date not available)",
        noInsurers: "No private insurers added",
        noAuthPersons: "No authorized persons added",
        searchInsurer: "Search (Insurer)",
        insurerPolicy: "Policy: {{policy}}",
        insurerStart: "Start Date: {{date}}",
        insurerValid: "Valid until: {{date}}",
        disclaimerSave: "Please remember to click the Submit button after adding or deleting an insurer to save the changes",
        submit: "Save",
        startDate: "Start Date",
        selectDate: "Select Date",
        saveSuccess: "Information for {{section}} updated!",
        saveError: "Failed to update information for {{section}}.",
        consentUploadSuccess: "Consent document uploaded and consent granted successfully!",
        consentWithdrawSuccess: "Consent has been withdrawn successfully.",
        privateInsurers: "Private Insurers",
        active: "Active from",
        addInsurer: "Add Insurer",
        na: "N/A"
    },

    medicalData: {
        medicines: "Medicines",
        regularMedications: "Regular Medications",
        addMedication: "Add Medication",
        noRegularMedications: "No regular medications added",
        asNeededMedications: "As Needed Medications",
        noAsNeededMedications: "No as-needed medications added",
        medicationHistory: "Medication History",
        noMedicationHistory: "No medication history found",
        saving: "Saving...",
        save: "Save",
        add: "Add",
        diagnosis: "Diagnosis",
        activeDiagnoses: "Active Diagnoses",
        addDiagnosis: "Add Diagnosis",
        noActiveDiagnoses: "No active diagnoses recorded",
        diagnosisHistory: "Diagnosis History",
        noDiagnosisHistory: "No historical diagnoses found",
        allergiesAndIntolerances: "Allergies & Intolerances",
        addAllergy: "Add Allergy",
        noRegisteredAllergies: "No registered allergies",
        pastAllergies: "Past Allergies",
        noAllergyHistory: "No allergy history recorded",
        chronicDiseases: "Chronic Diseases",
        chronicConditions: "Chronic Conditions",
        addCondition: "Add Condition",
        noChronicConditions: "No record of chronic diseases",
        chronicDiseaseHistory: "Chronic Disease History",
        noChronicConditionHistory: "No historical records of chronic conditions",
        familyInterview: "Family Interview",
        familyHistory: "Family History",
        addEntry: "Add Entry",
        noFamilyHistoryEntries: "No family history entries recorded",
        pastFamilyHistory: "Past Family History",
        noHistoricalEntries: "No historical family history entries",
        riskFactors: "Risk Factors",
        addRiskFactor: "Add Risk Factor",
        noRiskFactorsRecorded: "No risk factors recorded",
        riskFactorHistory: "Risk Factor History",
        noRiskHistory: "No historical records of risk factors",
        medicationName: "Medication Name",
        commonName: "Common Name",
        form: "Form",
        dose: "Dose",
        dosageInstructions: "Dosage Instructions",
        startDate: "Start Date",
        notes: "Notes",
        notesPlaceholder: "Add any relevant notes here...",
        regularMedication: "This is a regular medication",
        cancel: "Cancel",
        description: "Description",
        code: "Code",
        diagnosisType: "Diagnosis Type",
        primaryDiagnosis: "Primary Diagnosis",
        secondaryDiagnosis: "Secondary Diagnosis",
        diagnosisNotesPlaceholder: "Describe the diagnosis in detail...",
        allergyType: "Allergy Type",
        allergenName: "Allergen Name",
        allergicReaction: "Allergic Reaction",
        severity: "Severity",
        conditionName: "Condition Name",
        status: "Status",
        currentTreatment: "Current Treatment",
        diseaseName: "Disease Name",
        relationship: "Relationship",
        ageOfOnset: "Age of Onset",
        ageOfOnsetLower: "Age of onset",
        riskCategory: "Risk Category",
        riskFactor: "Risk Factor",
        riskLevel: "Risk Level",
        dosage: "Dosage",
        from: "From",
        diagnosed: "Diagnosed",
        reaction: "Reaction",
        treatment: "Treatment",
        category: "Category",
        saveSuccess: "{{section}} information updated successfully!",
        saveError: "Failed to update {{section}} information.",
        fetchingHistory: "Fetching medical history...",
        active: "Active",
        end: "End",
        done: "Done",
        placeholderMedName: "e.g. Paracetamol",
        placeholderGenericName: "Enter generic name",
        placeholderForm: "Tablet",
        placeholderDose: "e.g. 500",
        placeholderInstructions: "e.g. 1 tablet twice daily",
        placeholderSelectDate: "Select date",
        placeholderDiagnosisCode: "e.g. F32.1",
        placeholderSelectType: "Select type",
        placeholderAllergenName: "Enter allergen name...",
        placeholderAllergicReaction: "Describe allergic reaction...",
        placeholderSelectSeverity: "Select severity",
        placeholderConditionName: "Enter condition name...",
        placeholderSelectStatus: "Select status",
        placeholderTreatmentPlan: "Describe treatment plan...",
        placeholderDiseaseName: "e.g. Depression",
        placeholderSelectRelationship: "Select relationship",
        placeholderAgeOfOnset: "e.g. 45 years",
        placeholderSelectCategory: "Select category",
        placeholderEnterRiskFactor: "Enter or select risk factor...",

        options: {
            medicationForms: {
                Tablet: "Tablet",
                Capsule: "Capsule",
                Liquid: "Liquid",
                Injection: "Injection",
                Inhaler: "Inhaler",
                Patch: "Patch",
                Cream: "Cream",
                Other: "Other"
            },
            severityLevels: {
                Low: "Low",
                Mild: "Mild",
                Moderate: "Moderate",
                Severe: "Severe",
                High: "High"
            },
            conditionStatuses: {
                Active: "Active",
                Remission: "Remission",
                Resolved: "Resolved"
            },
            relationships: {
                Mother: "Mother",
                Father: "Father",
                Sister: "Sister",
                Brother: "Brother",
                "Grandmother (maternal)": "Grandmother (maternal)",
                "Grandmother (paternal)": "Grandmother (paternal)",
                "Grandfather (maternal)": "Grandfather (maternal)",
                "Grandfather (paternal)": "Grandfather (paternal)",
                "Aunt (maternal)": "Aunt (maternal)",
                "Aunt (paternal)": "Aunt (paternal)",
                "Uncle (maternal)": "Uncle (maternal)",
                "Uncle (paternal)": "Uncle (paternal)"
            },
            riskCategories: {
                Lifestyle: "Lifestyle",
                Genetic: "Genetic",
                "Medical History": "Medical History",
                Environmental: "Environmental"
            },
            allergyTypes: {
                Drug: "Drug",
                Food: "Food",
                Environment: "Environment",
                Other: "Other"
            },
            diagnosisTypes: {
                Primary: "Primary",
                Secondary: "Secondary"
            }
        }
    },

    createVisit: {},
    spotlight: {
        title: 'Spotlight',
        subtitle: 'Securely share anonymized patient data for clinical research',
        newSubmission: 'New Submission',
        mySubmission: 'My Submission',
        patientSelection: 'Patient Selection',
        searchPatient: 'Search patient',
        myRequests: 'My submissions in Spotlight',
        status: {
            pending: 'Pending',
            accepted: 'Accepted'
        },
        patientId: 'Patient ID',
        submissionDate: 'Submission Date',
        view: 'Preview',
        includeInStudy: 'Include in study',
        clinicalCenter: 'Clinical Research Center',
        migraineStudy: 'A study on the effectiveness of a new therapy in the treatment of migraine'
    },
    visitList: {
        visitHistory: "VISIT HISTORY",
        totalVisits: "Total visits: {{count}}",
        fetchingVisitHistory: "Fetching visit history...",
        doctor: "Doctor",
        notes: "Notes",
        noNotes: "No notes",
        medicalInterview: "Medical interview",
        mainSymptoms: "Main symptoms",
        psychiatricScales: "Psychiatric scales",
        examination: "Examination",
        bloodPressure: "Blood pressure",
        generalCondition: "General condition",
        heartRate: "Heart rate",
        temperature: "Temperature",
        noData: "No data",
        noVisits: "No visits found",
        regular: "regular",
        scheduled: "scheduled",
        completed: "completed",
        cancelled: "cancelled",
        inprogress: "in progress"
    },
    newPatient: {
        newPatient: 'New Patient',
        enterNewPatientData: 'Enter new patient data',
        personalData: 'Personal Data',
        firstName: 'First Name',
        firstNamePlaceholder: 'Enter first name',
        lastName: 'Last Name',
        lastNamePlaceholder: 'Enter last name',
        pesel: 'PESEL',
        peselPlaceholder: 'Enter PESEL number',
        dob: 'Date of Birth',
        selectDate: 'Select date',
        confirm: 'Confirm',
        gender: 'Gender',
        selectGender: 'Select gender',
        phone: 'Phone',
        phonePlaceholder: 'Enter phone number',
        middleName: 'Middle Name',
        middleNamePlaceholder: 'Enter middle name',
        maidenName: 'Maiden Name',
        maidenNamePlaceholder: 'Enter maiden name',
        alternativePhone: 'Alternative Phone',
        altPhonePlaceholder: 'Enter alternative phone',
        email: 'Email',
        emailPlaceholder: 'Enter email address',
        birthPlace: 'Place of Birth',
        birthPlacePlaceholder: 'Enter place of birth',
        documentType: 'Document Type',
        selectDocumentType: 'Select document type',
        bloodType: 'Blood Type',
        selectBloodType: 'Select blood type',
        internalCardNo: 'Internal Card No.',
        internalCardNoPlaceholder: 'Enter internal card number',
        foreigner: 'Foreigner',
        select: 'Select',
        address: 'Address',
        street: 'Street',
        streetPlaceholder: 'Enter street',
        houseNo: 'House No.',
        houseNoPlaceholder: 'Enter house number',
        apartmentNo: 'Apartment No.',
        apartmentNoPlaceholder: 'Enter apartment number',
        postalCode: 'Postal Code',
        postalCodePlaceholder: 'Enter postal code (e.g. 00-000)',
        city: 'City',
        cityPlaceholder: 'Enter city',
        voivodeship: 'Voivodeship',
        country: 'Country',
        municipalityTeryt: 'Municipality (TERYT)',
        municipalityTerytPlaceholder: 'Enter TERYT code',
        insurance: 'Insurance',
        insuranceType: 'Insurance Type',
        selectInsuranceType: 'Select insurance type',
        insuranceNo: 'Insurance No.',
        insuranceNoPlaceholder: 'Enter insurance number',
        savePatient: 'Save Patient',
        male: 'Male',
        female: 'Female',
        other: 'Other',
        nfz: 'NFZ',
        private: 'Private',
        none: 'None',
        residenceCard: 'Residence Card',
        idCard: 'ID Card',
        ehic: 'EHIC (EKUZ)',
        euEogId: 'EU/EOG Identity Card',
        foreignLicense: 'Foreign Driving License',
        noneInfant: 'None (Infant)',
        noneNn: 'None (NN)',
        noneNw: 'None (NW)',
        yes: 'Yes',
        no: 'No',
        poland: 'Poland',
        germany: 'Germany',
        unitedKingdom: 'United Kingdom',
        france: 'France',
        fillCompulsoryFields: 'Please fill all compulsory fields marked with *',
        phoneLengthError: 'Phone number must be exactly 9 digits',
        peselLengthError: 'PESEL must be exactly 11 digits',
        altPhoneLengthError: 'Alternative phone must be exactly 9 digits',
        invalidEmail: 'Please enter a valid email address',
        postalCodeFormatError: 'Postal code must be in 00-000 format',
        createSuccess: 'Patient created successfully',
        createError: 'Failed to create patient'
    },
    patientSearch: {
        title: 'Search Patients',
        subtitle: 'Search patients by name, PESEL number or card number',
        description: 'Search patients by name, PESEL number or card number',
        filtersLabel: 'Filters',
        placeholders: {
            search: 'Name, PESEL or card number...',
        },
        enterCriteria: 'Enter search criteria to see results',
        filters: {
            dob: 'Date of Birth',
            gender: {
                label: 'Gender',
                all: 'All',
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
            isLongAbsent: 'Long Absent',
            placeholders: {
                gender: 'Select gender',
                dob: 'dd/mm/yyyy'
            }
        },
        buttons: {
            clearFilters: 'Clear filters',
            applyFilters: 'Apply filters'
        }
    },
    patientList: {
        patientList: "Patient List",
        manageRecords: "Manage patient records",
        patient: "PATIENT",
        pesel: "PESEL",
        dob: "DATE OF BIRTH",
        referral: "REFERRAL",
        status: "STATUS",
        actions: "ACTIONS",
        export: "Export",
        print: "Print",
        filters: "Filters",
        dateOfBirth: "Date of Birth",
        gender: "Gender",
        selectDate: "Select date",
        hasPesel: "Has PESEL",
        hasDeclaration: "Has Declaration",
        active: "Active",
        inactive: "Inactive",
        deceased: "Deceased",
        longAbsent: "Long Absent",
        hasDebt: "Has Debt",
        clearFilters: "Clear filters",
        applyFilters: "Apply filters",
        loadingPatients: "Loading patients...",
        itemsRange: "{{start}}-{{end}} of {{total}} items",
        itemsPerPage: "{{count}} / page",
        deletePatientTitle: "Delete Patient",
        deletePatientConfirm: "Are you sure you want to delete patient {{name}}?",
        deleteSuccess: "Patient and all related data have been deleted successfully",
        deleteError: "Failed to delete patient",
        deleteErrorGeneral: "An error occurred while deleting patient",
        cancel: "Cancel",
        delete: "Delete",
        all: "All",
        selectGender: "Select gender",
        male: "Male",
        female: "Female",
        other: "Other",
        idLabel: "ID:",
        done: "Done"
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
            month: 'Month',
            mon: 'Mon',
            tue: 'Tue',
            wed: 'Wed',
            thu: 'Thu',
            fri: 'Fri',
            sat: 'Sat',
            sun: 'Sun'
        },
        more: '+ {{count}} more',
        visitCreated: 'Visit created successfully'
    },
    referrals: {
        title: 'Referrals',
        newReferral: 'New Referral',
        incoming: 'Incoming Referrals',
        outgoing: 'Outgoing Referrals',
        emptyIncoming: 'No incoming referrals',
        emptyOutgoing: 'No outgoing referrals',
        table: {
            patient: 'PATIENT',
            referredBy: 'REFERRED BY',
            referredTo: 'REFERRED TO',
            reason: 'REASON FOR REFERRAL',
            status: 'STATUS',
            date: 'DATE',
            actions: 'ACTIONS'
        },
        modal: {
            title: 'New Referral',
            doctor: 'Doctor',
            nurse: 'Nurse',
            patient: 'Patient',
            referredTo: 'Referred To',
            specialization: 'Specialization',
            reason: 'Reason for Referral',
            notes: 'Notes',
            placeholders: {
                patient: 'Select patient',
                provider: 'Select provider',
                specialization: 'Enter specialization',
                reason: 'Enter reason',
                notes: 'Enter additional notes'
            }
        },
        details: {
            title: 'Referral Details',
            patient: 'Patient',
            status: 'Status',
            referredTo: 'Referred To',
            referredBy: 'Referred By',
            date: 'Date',
            specialization: 'Specialization',
            reason: 'Reason for Referral',
            notes: 'Notes',
            created: 'Created',
            lastUpdated: 'Last Updated'
        },
        messages: {
            success: 'Referral created successfully',
            error: 'Failed to create referral',
            requiredFields: 'Please fill in all required fields'
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
        "login_success": "Login successful!",
        "signing_in": "Signing in...",
        "play_services_error": "Play services not available or outdated",
        "google_signin_error": "Error Signing In with Google",
        "google_signin_success": "Google Sign-In success",
        "google_login_failed": "Failed to initiate Google login"
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
        "registration_success": "User signed up successfully! Please verify your email address to login",
        "signing_up": "Signing up...",
        "google_signup_success": "Google Sign-Up successful!",
        "google_signup_failed": "Failed to initiate Google sign-up",
        "restriction_text": "Registration is restricted to authorized email addresses only."
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
                "emptyText": "No previous visits to display",
                "visitType": "{{type}} - {{diagnosis}}"
            }
        },
        "riskLevels": {
            "low": "LOW",
            "moderate": "MODERATE",
            "high": "HIGH"
        }
    },

    "trends": {
        "title": "Clinical Trends Analysis",
        "subtitle": "Analysis of psychiatric scale changes over time",
        "emptyTitle": "No psychiatric scale data available",
        "emptySubtitle": "Complete assessments during visits to see trends",
        "aiInsights": "AI Insights",
        "insufficientData": "Insufficient scale data for trend analysis. Consider completing psychiatric assessments in future visits.",
        "analyzing": "Psychiatric assessments found across {{count}} visits. Analyzing trends...",
        "totalVisits": "Total Visits",
        "visitHistory": "Patient visit history",
        "scalesCompleted": "Scales Completed",
        "combinedScales": "HAM-D and MADRS combined"
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

    "newPatient": {
        "newPatient": "New Patient",
        "enterNewPatientData": "Enter new patient data",
        "personalData": "Personal Data",
        "firstName": "First Name",
        "lastName": "Last Name",
        "pesel": "PESEL",
        "dob": "Date of Birth",
        "gender": "Gender",
        "phone": "Phone",
        "middleName": "Middle Name",
        "maidenName": "Maiden Name",
        "alternativePhone": "Alternative Phone",
        "email": "Email",
        "birthPlace": "Place of Birth",
        "documentType": "Document Type",
        "bloodType": "Blood Type",
        "internalCardNo": "Internal Card No.",
        "foreigner": "Foreigner",
        "address": "Address",
        "street": "Street",
        "houseNo": "House No.",
        "apartmentNo": "Apartment No.",
        "postalCode": "Postal Code",
        "city": "City",
        "voivodeship": "Voivodeship",
        "country": "Country",
        "municipalityTeryt": "Municipality (TERYT)",
        "insurance": "Insurance",
        "insuranceType": "Insurance Type",
        "insuranceNo": "Insurance No.",
        "savePatient": "Save Patient",
        "fillCompulsoryFields": "Please fill in all compulsory fields marked with *",
        "phoneLengthError": "Phone number must be exactly 9 digits",
        "peselLengthError": "PESEL must be exactly 11 digits",
        "altPhoneLengthError": "Alternative phone number must be exactly 9 digits",
        "invalidEmail": "Please enter a valid email address",
        "postalCodeFormatError": "Postal code must be in 00-000 format",
        "createSuccess": "Patient created successfully!",
        "createError": "Failed to create patient",
        "selectDate": "Select date",
        "selectGender": "Select gender",
        "selectDocumentType": "Select document type",
        "selectBloodType": "Select blood type",
        "select": "Select",
        "selectInsuranceType": "Select insurance type",
        "confirm": "Confirm",
        "male": "Male",
        "female": "Female",
        "other": "Other",
        "nfz": "NFZ",
        "private": "Private",
        "none": "None",
        "residenceCard": "Residence Card",
        "idCard": "ID Card",
        "ehic": "EHIC (EKUZ)",
        "euEogId": "EU/EOG Identity Card",
        "foreignLicense": "Foreign Driving License",
        "noneInfant": "None (Infant)",
        "noneNn": "None (NN)",
        "noneNw": "None (NW)",
        "yes": "Yes",
        "no": "No",
        "poland": "Poland",
        "germany": "Germany",
        "unitedKingdom": "United Kingdom",
        "france": "France",
        "firstNamePlaceholder": "Enter first name",
        "lastNamePlaceholder": "Enter last name",
        "peselPlaceholder": "Enter PESEL number",
        "phonePlaceholder": "Enter phone number",
        "middleNamePlaceholder": "Enter middle name",
        "maidenNamePlaceholder": "Enter maiden name",
        "altPhonePlaceholder": "Enter alternative phone",
        "emailPlaceholder": "Enter email address",
        "birthPlacePlaceholder": "Enter place of birth",
        "internalCardNoPlaceholder": "Enter internal card no.",
        "streetPlaceholder": "Enter street name",
        "houseNoPlaceholder": "Enter house number",
        "apartmentNoPlaceholder": "Enter apartment number",
        "postalCodePlaceholder": "Enter postal code",
        "cityPlaceholder": "Enter city name",
        "municipalityTerytPlaceholder": "Enter municipality TERYT",
        "insuranceNoPlaceholder": "Enter insurance number"
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
    },
    "aiAnalysis": {
        "header": {
            "title": "Statistical analysis AI",
            "subtitle": "Advanced clinical data analysis supported by artificial intelligence"
        },
        "tabs": {
            "analysis": "Analysis",
            "summary": "Summary",
            "recommendations": "Recommendations"
        },
        "filterForm": {
            "timeRange": "Time Range",
            "lastMonth": "Last month",
            "lastWeek": "Last Week",
            "lastYear": "Last Year",
            "branch": "Branch",
            "allBranches": "All branches",
            "cardiology": "Cardiology",
            "neurology": "Neurology",
            "surgery": "Surgery",
            "doctors": "Doctors",
            "allDoctors": "All doctors",
            "metrics": "Metrics",
            "visits": "Visits",
            "recognitions": "Recognitions"
        },
        "statCards": {
            "visits": "Visits",
            "avgTimeToRemission": "Average time to remission",
            "treatmentEffectiveness": "Treatment effectiveness",
            "adherence": "Adherence",
            "vsPreviousPeriod": "+{{percentage}}% vs\n previous period"
        },
        "charts": {
            "diagnosticTrends": "Diagnostic trends",
            "treatmentResults": "Treatment Results",
            "remission": "Remission",
            "partial": "Partial",
            "stabilize": "Stabilize",
            "noImprovement": "No imp."
        },
        "conclusions": {
            "title": "Conclusions AI",
            "subtitle": "Powered by advanced machine learning algorithms",
            "clinicalPatterns": "Clinical patterns",
            "pattern1": "A 23% increase in F32.1 diagnoses (Moderate depressive episode) was observed in the 25-35 age group. Main risk factors: occupational stress, social isolation.",
            "pattern2": "Therapy effectiveness increased by 15% with early intervention (up to 2 weeks from first symptoms) and regular monitoring using clinical scales.",
            "therapeuticRecommendations": "Therapeutic recommendations",
            "recommendation1": "Patients with a combination of pharmacotherapy and psychotherapy show 35% higher treatment effectiveness compared to monotherapy.",
            "recommendation2": "An increased risk of treatment discontinuation was identified at weeks 4-6 of therapy. Implementation of additional support and monitoring during this period is recommended."
        },
        "demographics": {
            "title": "Patients demographics",
            "middleAge": "Middle age",
            "middleAgeValue": "42.5 years",
            "genderDistribution": "Gender distribution",
            "genderDistributionValue": "F: 65% | M: 35%",
            "newPatients": "New Patients",
            "newPatientsValue": "+124 (30d)"
        },
        "treatmentMetrics": {
            "title": "Treatment metrics",
            "avgTherapyLength": "Average length of therapy",
            "avgTherapyLengthValue": "4.2 months",
            "remissionRate": "Remission rate",
            "remissionRateValue": "72.5%",
            "continuationOfTreatment": "Continuation of treatment",
            "continuationOfTreatmentValue": "85.4%"
        },
        "qualityIndicators": {
            "title": "Quality indicators",
            "patientSatisfaction": "Patient satisfaction",
            "patientSatisfactionValue": "4.8/5.0",
            "readmissions": "Readmissions",
            "readmissionsValue": "3.2%",
            "documentationCompleteness": "Completeness of documentation",
            "documentationCompletenessValue": "98.7%"
        }
    },
    "aiAssistant": {
        "header": {
            "title": "AI Assistants",
            "subtitle": "Advanced AI tools supporting doctor's work"
        },
        "tabs": {
            "remediusConsult": "Remedius Consult",
            "remediusPathfinder": "Remedius Pathfinder",
            "pharmacopedia": "Pharmacopedia",
            "diagnosis": "Diagnosis",
            "clinicalTrials": "Clinical Trials",
            "statisticalAnalysis": "Statistical Analysis"
        },
        "consultChat": {
            "visitHistory": "Visit History",
            "clinicalAssistant": "Clinical Assistant",
            "selectionDesc": "Start a new consultation session to get AI-powered medical guidance",
            "selectSpecialty": "Select Specialty",
            "chooseSpecialty": "Choose a specialty",
            "startNewConsultation": "+ Start New Consultation",
            "childPsychiatry": "Child Psychiatry",
            "adultPsychiatry": "Adult Psychiatry",
            "internalMedicine": "Internal Medicine",
            "childPsychShort": "Child Psych",
            "adultPsychShort": "Adult Psych",
            "internalShort": "Internal",
            "generalShort": "General",
            "session": "Session",
            "askPlaceholder": "Ask about patient's condition...",
            "aiThinking": "AI is thinking...",
            "sessionDeletedSuccess": "Session deleted successfully",
            "failedDeleteSession": "Failed to delete session",
            "welcomeMessage": "Hello! I'm your {{specialty}} AI assistant. I'm here to help based on evidence-based clinical guidelines. How can I assist you with the patient's condition?",
            "simulationMode": "Simulation: I am in local mode because no session was established."
        },
        "pharmacopedia": {
            "title": "Pharmacopedia",
            "drugQueries": "Drug Queries",
            "query": "Query",
            "landingDesc": "Get evidence-based drug information from Stahl's Essential Psychopharmacology Prescriber's Guide with AI-powered search.",
            "startNewQuery": "+ Start New Query",
            "creating": "Creating...",
            "askPlaceholder": "Ask about medications...",
            "aiThinking": "AI is thinking...",
            "ragEnhanced": "RAG-Enhanced AI",
            "welcomeMessage": "Welcome to Pharmacopedia! I can help you with drug information, dosing guidelines, interactions, and side effects. What would you like to know?",
            "failedCreateQuery": "Failed to create new query. Please try again.",
            "queryDeletedSuccess": "Query deleted successfully",
            "failedDeleteQuery": "Failed to delete query. Please try again.",
            "failedAiResponse": "Failed to get AI response. Please try again."
        },
        "diagnosis": {
            "title": "Differential Diagnosis Assistant",
            "symptoms": "Symptoms",
            "enterSymptom": "Enter symptom...",
            "add": "+ Add",
            "analyze": "Analyze"
        },
        "clinicalTrials": {
            "diagnosis": "Diagnosis",
            "diagnosisPlaceholder": "e.g. Migraine",
            "location": "Location",
            "locationPlaceholder": "e.g. Warsaw",
            "searching": "Searching...",
            "searchTrials": "Search trials",
            "foundTrials": "Found trials ({{count}})",
            "id": "ID",
            "sponsor": "Sponsor",
            "phase": "Phase",
            "inclusionCriteria": "Inclusion criteria:",
            "exclusionCriteria": "Exclusion criteria:",
            "details": "Details",
            "noResults": "No clinical trials found for your search.",
            "enterDiagnosis": "Please enter a diagnosis",
            "fetchFailed": "Failed to fetch clinical trials"
        },
        "pathfinder": {
            "title": "Remedius Pathfinder",
            "subtitle": "AI-powered research publication assistant",
            "heroTitle": "Create Your First Research Project",
            "heroDesc": "Upload documents, set a research topic, and generate academic publications with AI assistance",
            "researchTopic": "Research Topic",
            "researchTopicPlaceholder": "Enter your research topic or focus area...",
            "uploadDocuments": "Upload Documents",
            "uploadText": "Tap to browse and upload files",
            "uploadSubText": "Supports PDF, DOC, DOCX (max 25MB each)",
            "chooseFiles": "Choose Files",
            "researchConfig": "Research Configuration",
            "hideAdvanced": "Hide Advanced Options",
            "showAdvanced": "Show Advanced Options",
            "contentType": "Content Type",
            "citationStyle": "Citation Style",
            "keywordsFocus": "Keywords/Focus",
            "researchPrompt": "Research Prompt",
            "createProject": "Create Project",
            "createFooter": "Project will be created with your selected configuration",
            "researchProjects": "Research\nProjects",
            "newProject": "New\nProject",
            "noProjectsYet": "No research projects yet",
            "createFirstProject": "Create your first research project",
            "contentTypes": {
                "literatureReview": "Literature Review",
                "introduction": "Introduction",
                "methodology": "Methodology",
                "discussion": "Discussion",
                "summary": "Summary",
                "fullArticle": "Full Article (Draft)"
            }
        },
        "statisticalAnalysis": {
            "title": "Statistical Analysis",
            "subtitle": "Comprehensive insights into your facility's performance",
            "exportReport": "Export Report",
            "select": "Select",
            "lastMonth": "Last Month",
            "lastQuarter": "Last Quarter",
            "lastYear": "Last Year",
            "totalVisits": "Total Visits",
            "overallTotal": "Overall total",
            "totalPatients": "Total Patients",
            "uniquePatients": "Unique patients",
            "referrals": "Referrals",
            "totalReferrals": "Total referrals",
            "todaysVisits": "Today's Visits",
            "scheduledForToday": "Scheduled for today",
            "tabs": {
                "overview": "Overview",
                "clinical": "Clinical",
                "demographics": "Demographics",
                "referrals": "Referrals"
            },
            "charts": {
                "visitsOverTime": "Visits Over Time",
                "visitStatus": "Visit Status",
                "visitTypes": "Visit Types",
                "modalityDistribution": "Modality Distribution",
                "topDiagnoses": "Top Diagnoses",
                "noDiagnosisData": "No diagnosis data for this period",
                "genderDistribution": "Gender Distribution",
                "ageGroups": "Age Groups",
                "patientsByCity": "Patient Distribution by City",
                "referralStatus": "Referral Status",
                "pending": "pending",
                "topSpecializations": "Top Specializations"
            }
        }
    },
    employee_modals: {
        add_employee: {
            title_doctor: "Add Doctor",
            title_nurse: "Add Nurse",
            title_receptionist: "Add Receptionist",
            labels: {
                firstName: "First Name",
                lastName: "Last Name",
                email: "Email",
                confirmEmail: "Confirm Email",
                pwzNumber: "PWZ Number",
                peselNumber: "PESEL Number",
                offices: "Offices"
            },
            placeholders: {
                offices: "Select Offices"
            },
            warning: "By adding a user to your facility's account, you confirm that this user, after accepting the invitation and your confirmation, will have access to your facility's data. Remember to grant such permissions only to authorized persons.",
            buttons: {
                cancel: "Cancel",
                add_doctor: "Add Doctor",
                add_nurse: "Add Nurse",
                add_receptionist: "Add Receptionist"
            },
            alerts: {
                required_fields: "Please fill in all required fields.",
                email_mismatch: "Emails do not match.",
                success: "{{role}} invitation has been sent successfully.",
                error: "An error occurred while adding the {{role}}."
            }
        },
        edit_employee: {
            title: "Edit Employee",
            labels: {
                firstName: "First Name",
                lastName: "Last Name",
                email: "Email",
                pesel: "PESEL",
                status: "Status",
                assignedOffices: "Assigned Offices"
            },
            placeholders: {
                status: "Select Status",
                addOffice: "Add Office"
            },
            status: {
                active: "Active",
                inactive: "Inactive"
            },
            buttons: {
                cancel: "Cancel",
                save: "Save"
            },
            alerts: {
                required_fields: "Please fill in all required fields.",
                error: "An error occurred while updating the employee."
            }
        },
        permissions: {
            title: "Manage User Permissions",
            labels: {
                add_patient: "Add Patients",
                view_all_patients: "View All Patients",
                view_own_patients: "View Own Patients",
                view_all_visits: "View All Visits",
                view_own_visits: "View Own Visits",
                add_visits: "Add Visits",
                cancel_visit: "Cancel Visit",
                view_employees: "View Employees",
                add_employees: "Add Employees",
                delete_employees: "Delete Employees",
                view_permissions: "View Permissions",
                edit_permissions: "Edit Permissions",
                update_facility: "Update Facility",
                refer_patients: "Refer Patients",
                view_audit_logs: "View Audit Logs"
            },
            requires: "Requires: {{label}}",
            buttons: {
                cancel: "Cancel",
                save: "Save Permissions"
            },
            alerts: {
                error: "Failed to update permissions."
            }
        }
    },
    settings: {
        client_portal: {
            title: "Patient Portal",
            info_box: {
                title: "Patient Portal - Functions and Capabilities",
                description: "Configure which patient portal functions should be available. You can enable or disable specific modules and their detailed functions."
            },
            modules: {
                appointment_scheduling: {
                    title: "Appointment Scheduling",
                    description: "Patients can independently schedule and manage appointments",
                    reservation: "Appointment Reservation",
                    reservation_desc: "Ability to reserve new appointments",
                    rescheduling: "Appointment Rescheduling",
                    rescheduling_desc: "Ability to reschedule appointments",
                    cancellation: "Appointment Cancellation",
                    cancellation_desc: "Ability to cancel appointments"
                },
                medical_documentation: {
                    title: "Medical Documentation",
                    description: "Access to medical documentation and test results",
                    visit_history: "Visit History",
                    visit_history_desc: "Overview of visit history and recommendations",
                    test_results: "Test Results",
                    test_results_desc: "Access to test results",
                    prescriptions: "Prescriptions",
                    prescriptions_desc: "History and status of prescriptions"
                },
                communication: {
                    title: "Communication",
                    description: "Secure communication with medical staff",
                    chat: "Chat with Doctor",
                    chat_desc: "Secure text communication",
                    notifications: "Notifications",
                    notifications_desc: "Notifications about appointments and recommendations"
                },
                scales_questionnaires: {
                    title: "Scales and Questionnaires",
                    description: "Regular completion of scales and questionnaires",
                    mood_scales: "Mood Scales",
                    mood_scales_desc: "PHQ-9, GAD-7, etc.",
                    quality_of_life: "Quality of Life",
                    quality_of_life_desc: "Quality of life questionnaires"
                },
                test_results: {
                    title: "Test Results",
                    description: "Access to test results with interpretation",
                    view: "Results View",
                    view_desc: "Access to test results",
                    history: "Results History",
                    history_desc: "History of all tests"
                },
                ai_assistant: {
                    title: "AI Assistant",
                    description: "Intelligent assistant supporting the patient",
                    powered_tag: "AI Powered",
                    requires_plan: "Requires AI Powered plan"
                }
            },
            security: {
                title: "Data Security",
                description: "All data in the patient portal is encrypted and protected in accordance with GDPR requirements. Access to the portal requires strong authentication, and all activity is monitored and logged."
            },
            buttons: {
                save: "Save Settings"
            }
        },
        employees: {
            title: "Employees",
            tabs: {
                doctors: "Doctors, Dentists, and Paramedics",
                nurses: "Nurses and Midwives",
                receptionists: "Receptionists"
            },
            roles: {
                doctor: "Doctor",
                nurse: "Nurse",
                receptionist: "Receptionist"
            },
            buttons: {
                group_permissions: "GROUP PERMISSIONS",
                ratings: "RATINGS",
                add_employee: "+ Add {{role}}"
            },
            info_banner: "Total number of users eligible for subscription fees: ({{current}}. Maximum number of users from purchased packages {{max}}). {{extra}}",
            filters: {
                lastName: "Last Name",
                firstName: "First Name",
                pwz: "PWZ",
                onlyActive: "Only Active"
            },
            table: {
                name: "LAST NAME AND FIRST NAME",
                login: "LOGIN",
                pwz_pesel: "PWZ/PESEL",
                status: "ACTIVATION STATUS",
                actions: "ACTIONS",
                loading: "Loading employees...",
                empty: "No employees found"
            },
            pagination: {
                records_per_page: "records per page",
                prev: "Prev",
                next: "Next",
                total: "Total results: {{total}}"
            },
            delete_modal: {
                title: "Delete Employee",
                message: "Are you sure you want to delete {{name}}? This action cannot be undone.",
                cancel: "Cancel",
                delete: "Delete"
            },
            alerts: {
                fetch_error: "Failed to fetch employees.",
                status_success: "Status updated successfully.",
                status_error: "Failed to update employee status.",
                director_granted: "Director privilege granted.",
                director_revoked: "Director privilege revoked.",
                director_error: "Failed to update director privileges.",
                delete_success: "Employee deleted successfully.",
                update_success: "Employee updated successfully.",
                permissions_success: "Permissions updated successfully.",
                group_permissions_success: "Group permissions updated successfully."
            }
        },
        ewus: {
            title: "eWUŚ",
            auto_verification: "Automatic Insurance Verification:",
            system_status: "System eWUŚ",
            labels: {
                branch: "Branch:",
                contractor_type: "Contractor Type:",
                login: "Login:",
                password: "Password:",
                personnel_code: "Personnel Code:"
            },
            placeholders: {
                personnel_code: "Enter Personnel Code",
                login: "Enter Login",
                enter_personnel_code: "Enter personnel code",
                enter_login: "Enter login"
            },
            password_not_changed: "(not changed)",
            buttons: {
                save_verify: "Save and verify data accuracy",
                change_password: "Change Password",
                check_now: "Check Now"
            },
            options: {
                branches: {
                    maritime: "Maritime (11)",
                    masovian: "Masovian (07)",
                    silesian: "Silesian (12)"
                },
                contractors: {
                    doctor: "Doctor",
                    clinic: "Clinic",
                    hospital: "Hospital"
                }
            }
        },
        facility_data: {
            title: "Facility Data",
            sections: {
                basic: "Basic Information",
                general: "Basic Information",
                contact: "Contact & Address",
                address: "Contact & Address",
                workflow: "Workflow Settings",
                other: "Other Settings",
                logo_consent: "Facility logo / Document"
            },
            labels: {
                name: "Name",
                regon: "REGON",
                nip: "NIP",
                bdo: "BDO Number",
                registry: "Registry No.",
                registry_number: "Registry No.",
                type: "Facility Type",
                facility_type: "Facility Type",
                phone: "Phone",
                email: "Email",
                website: "Website",
                account_number: "Account Number",
                street: "Street",
                house: "House",
                house_no: "House No.",
                apt: "Apt No.",
                apartment_no: "Apt No.",
                postal_code: "Postal Code",
                city: "City",
                teryt: "TERYT Code",
                teryt_code: "TERYT Code",
                nfz: "NFZ Code",
                nfz_branch: "NFZ Branch",
                hours_from: "Working hours from",
                hours_to: "Working hours to",
                duration: "Visit Duration (min)",
                visit_duration: "Visit Duration (min)",
                work_hours: "Working Hours",
                visit_type: "Visit Type",
                reception_mode: "Default Reception Mode",
                logo: "Facility Logo",
                consent: "Personal data processing consent text (change default)",
                required_note: "* Required field",
                required_field: "Required field"
            },
            placeholders: {
                facility_name: "Facility Name",
                enter_name: "Facility Name",
                regon: "REGON",
                nip: "NIP",
                bdo: "BDO",
                registry: "Registry",
                select_type: "Select type",
                phone: "Phone",
                email: "Email",
                website_url: "Enter website URL",
                enter_website: "Enter website URL",
                account_number: "Account number",
                street: "Street name",
                house_no: "No.",
                no: "No.",
                apt_no: "Apt.",
                apt: "Apt.",
                postal_code: "XX-XXX",
                city: "City name",
                search_teryt: "Search TERYT...",
                select_nfz: "Select NFZ branch",
                select_nfz_branch: "Select NFZ branch",
                duration: "30",
                select_reception: "Select mode",
                select_reception_mode: "Select mode",
                select_visit_type: "Select visit type"
            },
            options: {
                facility_types: {
                    individual: "Individual practice",
                    group: "Group practice",
                    hospital: "Hospital",
                    clinic: "Clinic"
                },
                visit_types: {
                    private: "Private",
                    nfz: "NFZ",
                    mixed: "Mixed"
                },
                reception_modes: {
                    in_person: "In Person",
                    online: "Online",
                    telephone: "Telephone"
                }
            },
            buttons: {
                change_file: "CHANGE FILE",
                choose_file: "CHOOSE FILE",
                save: "Save Changes",
                done: "Done"
            },
            alerts: {
                save_success: "Facility Settings updated successfully!",
                save_error: "Failed to update facility settings",
                fetch_error: "Failed to load facility data",
                pick_error: "Failed to pick file"
            }
        },
        facility_stats: {
            title: "Facility Statistics",
            loading: "Loading statistics...",
            retry: "Retry",
            error_default: "Failed to fetch statistics",
            stats: {
                departments: "Departments",
                doctors: "Doctors",
                offices: "Offices",
                nurses: "Nurses",
                patients: "Patients",
                receptionists: "Receptionists"
            }
        },
        index: {
            title: "Settings",
            subtitle: "Manage facility settings and system configuration",
            tabs: {
                statistics: "Facility Statistics",
                facility_data: "Facility Data",
                offices: "Offices",
                security: "Security",
                subscription: "Subscription",
                patient_portal: "Patient Portal",
                profile: "Profile",
                employees: "Employees",
                ewus: "eWUŚ"
            }
        },
        office_certs: {
            title: "Offices & Certificates",
            offices: {
                title: "Offices",
                buttons: {
                    add_office: "Add office",
                    hide_form: "Hide Form",
                    cancel: "Cancel",
                    save: "Save"
                },
                form: {
                    name: "Office Name",
                    floor: "Floor",
                    number: "Number",
                    number_placeholder: "Office Number",
                    type: "Office Type",
                    type_placeholder: "Select Type",
                    equipment: "Equipment",
                    equipment_placeholder: "Equipment list (one per line)"
                },
                types: {
                    medical: "Medical office",
                    therapy: "Therapy office",
                    diagnostic: "Diagnostic office"
                },
                details: {
                    floor: "Floor",
                    number: "No",
                    type: "Type",
                    equipment: "Equipment"
                }
            },
            certificates: {
                title: "Certificates P1",
                p1_id: "P1 Identifier",
                p1_placeholder: "Enter P1 identifier",
                tls_label: "TLS Certificate",
                tls_placeholder: "Choose TLS certificate file",
                wls_label: "WLS Certificate",
                wls_placeholder: "Choose WLS certificate file",
                uploading: "Uploading..."
            },
            buttons: {
                save_changes: "Save Changes"
            },
            alerts: {
                save_success: "Director Settings updated successfully!",
                save_error: "Failed to update settings",
                upload_error: "Failed to upload certificate"
            }
        },
        profile: {
            labels: {
                first_name: "First Name",
                last_name: "Last Name",
                email: "Email"
            },
            buttons: {
                cancel: "Cancel",
                save_changes: "Save Changes"
            },
            alerts: {
                update_success: "Profile updated successfully!",
                update_error: "Failed to update profile"
            }
        },
        security: {
            title: "Security Settings",
            two_factor: {
                title: "Two-Factor Authentication",
                enabled: "Enabled",
                info_title: "Two-factor authentication is a double identity check during login.",
                info_desc: "For additional account security, during login the user must enter a code that is sent through their chosen communication channel - email, SMS, or mobile app."
            },
            trusted_devices: {
                title: "Allow users to save trusted devices",
                description: "The second verification step on a given device will then only occur every 30 days, not every time"
            },
            buttons: {
                enable: "Enable",
                disable: "Disable",
                save_changes: "Save Changes"
            },
            alerts: {
                success_title: "Success",
                error_title: "Error",
                update_success: "Security settings updated successfully.",
                update_error: "Something went wrong while updating settings.",
                user_not_found: "User not identified. Please try logging in again."
            }
        },
        subscription: {
            title: "Purchased Plans",
            plans_title: "Plans",
            summary: {
                active_users: "Number of active users",
                nfz_settlements: "NFZ Settlements",
                next_payment: "Next payment"
            },
            buttons: {
                pay_now: "PAY NOW",
                cancel_subscription: "CANCEL SUBSCRIPTION"
            },
            details: {
                name: "Name",
                valid_from: "Valid from",
                valid_to: "Valid to",
                next_payment: "Next payment"
            },
            modules: {
                without_nfz: "WITHOUT NFZ MODULE",
                nfz_settlement: "NFZ SETTLEMENT MODULE",
                coming_soon: "Coming Soon"
            },
            plan_card: {
                best_offer: "Best offer for you",
                ai_powered: "AI Powered",
                up_to: "up to",
                users: "users",
                gross: "gross",
                without_nfz: "without NFZ module",
                current_plan: "Current plan",
                select: "SELECT"
            },
            ai_info: {
                title: "What is the AI Powered subscription?",
                description: "AI Powered subscription provides access to advanced features supported by artificial intelligence that help in daily work:",
                features: {
                    documentation: "Medical documentation assistant with voice transcription",
                    clinical_decision: "Clinical decision support system",
                    icd10: "Intelligent ICD-10 coding assistant",
                    drug_interaction: "Drug interaction analysis with knowledge graph",
                    interview: "Interview assistant with emotion analysis",
                    diagnostic: "Automatic diagnostic suggestions",
                    trends: "Analysis of trends and patterns in patient data"
                }
            }
        }
    },

    prescriptionForm: {
        info: {
            title: 'e-Prescription',
            description: 'Issue electronic prescriptions compatible with the P1 system. You can save the prescription as a draft and sign it later.'
        },
        buttons: {
            addMedication: 'Add medication',
            cancel: 'Cancel',
            addToPrescription: 'Add to prescription',
            signPrescriptions: 'Sign prescriptions'
        },
        sections: {
            draftPrescriptions: 'Draft prescriptions',
            signedPrescriptions: 'Signed prescriptions'
        }
    },

    medicationSearch: {
        input: {
            placeholder: 'Search medication...'
        },
        results: {
            package: 'Package:',
            noResults: 'No medications found. You can add a compounded medication.'
        }
    },

    dosageForm: {
        labels: {
            dosage: 'Dosage',
            packageCount: 'Number of packages',
            refills: 'Number of refills',
            instructions: 'Additional instructions'
        },
        placeholders: {
            dosage: 'e.g. 1x1, 2x1 morning and evening',
            instructions: 'e.g. take after meal'
        },
        suggestions: {
            title: 'Suggested patterns:'
        },
        refillOptions: {
            none: 'No refills',
            one: '1 refill',
            multiple: ' refills'
        }
    },

    refundationSelect: {
        label: 'Refundation',
        options: {
            fullPrice: 'Full price',
            free: 'Free',
            lump: 'Lump sum',
            freeLimit: 'Free up to limit',
            senior: 'Senior 75+',
            payment: 'Payment '
        }
    },

    additionalRights: {
        label: 'Additional Rights',
        info: 'Select appropriate additional patient rights. These affect the level of medication reimbursement.',
        rights: {
            IB: { name: 'War Invalid', description: 'War invalids and repressed persons' },
            IW: { name: 'Military Invalid', description: 'Military invalids' },
            ZK: { name: 'Honorary Blood Donor', description: 'Distinguished honorary blood donors' },
            C: { name: 'Pregnancy', description: 'Pregnant women' },
            DN: { name: 'Children and Youth', description: 'Children and youth under 18 years old' },
            AZ: { name: 'Academic Healthcare', description: 'Students and academics including adjuncts, assistants and PhD candidates' }
        }
    },

    prescriptionSummary: {
        title: 'Prescription',
        status: {
            label: 'Status:',
            draft: 'Draft',
            issued: 'Issued'
        },
        buttons: {
            edit: 'Edit',
            cancel: 'Cancel',
            save: 'Save',
            sign: 'Sign',
            print: 'Print',
            reissue: 'Reissue'
        },
        medication: {
            dosage: { label: 'Dosage', prefix: 'Dosage: ' },
            quantity: { label: 'Package quantity', display: 'Qty: ' },
            instructions: { label: 'Additional instructions', prefix: 'Instructions: ' }
        },
        additionalRights: {
            title: 'Additional rights'
        }
    },

    signingModal: {
        title: 'Signing e-prescription',
        methods: {
            zus: { title: 'ZUS Certificate', description: 'Sign using ZUS certificate' },
            qualified: { title: 'Qualified Signature', description: 'Sign using qualified certificate' },
            trusted: { title: 'Trusted Profile', description: 'Sign using Trusted Profile' }
        },
        buttons: {
            startSigning: 'Start signing',
            signPrescription: 'Sign prescription',
            verifyAndSign: 'Verify and sign',
            complete: 'Complete'
        },
        password: {
            info: 'Enter password for certificate.',
            label: 'Certificate password',
            placeholder: 'Enter password',
            remember: 'Remember password until end of session'
        },
        verification: {
            info: 'Enter verification code sent to your phone.',
            label: 'Verification code',
            placeholder: 'Enter code'
        },
        processing: {
            title: 'Signing prescription...',
            subtitle: 'Please do not close the window'
        },
        complete: {
            title: 'Prescription has been signed',
            description: 'Prescription has been successfully signed and sent to the P1 system. You can now print patient information.'
        }
    }
}