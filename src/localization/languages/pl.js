export const pl = {
    validation: {
        field_required: 'To pole jest wymagane',
        invalid_email: 'Proszę wprowadzić prawidłowy adres e-mail',
        password_min_length: 'Hasło musi mieć co najmniej 6 znaków',
    },
    common: {
        search: 'Szukaj',
        cancel: 'Anuluj',
        save: 'Zapisz',
        confirm: 'Potwierdź',
        delete: 'Usuń',
        edit: 'Edytuj',
        back: 'Wstecz',
        next: 'Dalej',
        finish: 'Zakończ',
        loading: 'Ładowanie...',
        noData: 'Brak dostępnych danych',
        yes: 'Tak',
        no: 'Nie',
        total: 'łącznie',
        months: [
            'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
            'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'
        ],
        view: 'Podgląd',
        more: 'Więcej',
        time: 'Godzina',
        patient: 'Pacjent',
        status: 'Status',
        type: 'Typ',
        actions: 'Akcje',
        filters: 'Filtry',
        from: 'Od',
        to: 'Do',
        update: 'Aktualizuj',
        "add": "Dodaj",
        "or": "lub",
        dateLocale: 'pl-PL',
        dateTimeLocale: 'pl-PL',
        datePlaceholder: 'dd/mm/rrrr',
        na: 'Brak danych',
        done: 'Gotowe',
        logout: 'Wyloguj się',
        monthsShort: ['Sty', 'Lut', 'Mar', 'Kwi', 'Maj', 'Cze', 'Lip', 'Sie', 'Wrz', 'Paź', 'Lis', 'Gru'],
        error: 'Błąd',
        success: 'Sukces',
    },
    loading: {
        psychiatricModule: 'Moduł Psychiatryczny',
        initializingModule: 'Inicjalizacja modułu...'
    },
    auth: {
        login: 'Zaloguj się',
        logout: 'Wyloguj się',
        email: 'Email',
        password: 'Hasło',
        error_default: 'Coś poszło nie tak. Spróbuj ponownie.'
    },

    dashboard: {
        title: 'Panel',
        overview: 'Przegląd najważniejszych informacji',
        todayPatients: 'Dzisiejsi Pacjenci',
        pendingReports: 'Oczekujące Raporty',
        scheduledVisits: 'Zaplanowane Wizyty',
        completedVisits: 'Zakończone Wizyty',
        total: 'łącznie',
        todaysVisits: "Dzisiejsze Wizyty",
        loadingVisits: 'Ładowanie wizyt...',
        calendar: {
            title: 'Wizyty na',
            noVisits: 'Brak zaplanowanych wizyt na ten dzień',
            visitsCount: 'wizyt(y)',
            noVisitsFound: 'Nie znaleziono wizyt',
            close: 'Zamknij'
        },
        quickActions: {
            title: 'Szybkie akcje',
            scheduleVisit: 'Zaplanuj wizytę',
            newVisit: 'Nowa Wizyta',
            newPatient: 'Nowy Pacjent',
            newDocument: 'Nowy dokument',
            messages: 'Wiadomości',
            teleVisit: 'Teleporada',
            reports: 'Raporty',
            patients: 'Pacjenci'
        },
        actionModal: {
            visitActions: 'Akcje wizyty',
            viewDetails: 'Zobacz szczegóły',
            addNote: 'Dodaj notatkę',
            notePlaceholder: 'Wpisz treść notatki...',
            saveNote: 'Zapisz notatkę'
        },
        createVisit: {
            title: 'Utwórz nową wizytę',
            subtitle: 'Wypełnij poniższe szczegóły wizyty',
            patientSection: 'Pacjent',
            searchPatientPlaceholder: 'Wyszukaj pacjenta (min. 3 znaki)...',
            dateTimeSection: 'Data i godzina',
            today: 'Dzisiaj',
            tomorrow: 'Jutro',
            nextWeek: 'Następny tydzień',
            yesterday: 'Wczoraj',
            dateLabel: 'Data',
            timeLabel: 'Godzina',
            from: 'OD',
            to: 'DO',
            visitDetailsSection: 'Szczegóły wizyty',
            doctorLabel: 'Lekarz',
            doctorPlaceholder: 'Wybierz lekarza',
            officeLabel: 'Gabinet',
            officePlaceholder: 'Wybierz gabinet',
            typeLabel: 'Typ',
            typePlaceholder: 'Wybierz typ',
            specializationLabel: 'Specjalizacja',
            specializationPlaceholder: 'Wybierz specjalizację',
            types: {
                private: 'Prywatna',
                public: 'NFZ',
                insurance: 'Ubezpieczenie'
            },
            specializations: {
                psychiatry: 'Psychiatria',
                neurology: 'Neurologia',
                cardiology: 'Kardiologia'
            },
            optionsSection: 'Opcje',
            eVisit: 'E-wizyta',
            prescriptionOnly: 'Tylko recepta',
            referral: 'Skierowanie',
            notesSection: 'Notatki',
            notesPlaceholder: 'Dodatkowe notatki...'
        }
    },
    patients: {
        search: 'Wyszukaj pacjenta',
        new: 'Nowy pacjent',
        list: 'Lista pacjentów',
        profile: 'Profil pacjenta',
        appointments: 'Wizyty',
        documents: 'Dokumenty',
        history: 'Historia'
    },
    profile_settings: {
        title: "Zarządzanie kontem",
        edit_profile: "Edytuj profil",
        security: "Bezpieczeństwo",
        change_password: "Zmień hasło",
        notifications: "Powiadomienia",
        email_notifications: "Powiadomienia email",
        sms_notifications: "Powiadomienia SMS",
        app_notifications: "Powiadomienia w aplikacji",
        add_user: "Dodaj użytkownika"
    },
    status: {
        scheduled: 'Zaplanowana',
        inProgress: 'W trakcie',
        completed: 'Zakończona'
    },
    visit: {
        new: 'Nowa wizyta',
        start: 'Rozpocznij wizytę',
        activeVisit: 'Aktywna wizyta',
        type: {
            followUp: 'Kontrola',
            first: 'Pierwsza wizyta',
            consultation: 'Konsultacja'
        },
        steps: {
            profile: 'Profil',
            interview: 'Wywiad',
            examination: 'Badanie',
            diagnosis: 'Diagnoza',
            documents: 'Dokumenty',
            summary: 'Podsumowanie'
        },
        profile: {
            title: 'Profil pacjenta',
            basicInfo: 'Dane podstawowe',
            pesel: 'PESEL',
            dateOfBirth: 'Data urodzenia',
            allergies: 'Alergie',
            chronicDiseases: 'Choroby przewlekłe',
            history: 'Historia wizyt',
            history_total: 'Suma wizyt: {{total}}',
            audit: 'Historia zmian',
            trends: 'Analiza trendów',
            noAllergies: 'Brak znanych alergii',
            noDiseases: 'Brak chorób przewlekłych',
            noVisits: 'Nie znaleziono wizyt',
            tabs: {
                basic: 'Dane podstawowe',
                history: 'Historia wizyt'
            }
        },
        history_labels: {
            doctor: 'Lekarz',
            notes: 'Notatki',
            interview: 'Wywiad lekarski',
            mainSymptoms: 'Główne objawy',
            currentMedications: 'Aktualne leki',
            additionalNotes: 'Dodatkowe notatki',
            additionalFindings: 'Dodatkowe ustalenia',
            scales: 'Skale psychiatryczne',
            examination: 'Badanie przedmiotowe',
            bloodPressure: 'Ciśnienie krwi',
            generalCondition: 'Stan ogólny',
            heartRate: 'Tętno',
            temperature: 'Temperatura',
            noData: 'Brak danych',
            defaultNote: 'Nowy pacjent'
        },
        interview: {
            title: 'Wywiad lekarski',
            mainSymptoms: 'Główne dolegliwości',
            symptomsOnset: 'Początek objawów',
            currentMedications: 'Obecnie przyjmowane leki',
            additionalNotes: 'Dodatkowe uwagi',
            previousVisits: 'Poprzednie wizyty',
            showPreviousVisits: 'Pokaż poprzednie wizyty',
            addMedication: 'Dodaj lek',
            scales: {
                title: 'Skale psychiatryczne',
                selectScale: 'Wybierz skalę',
                hamd: 'Skala Depresji Hamiltona',
                madrs: 'Skala Depresji Montgomery-Åsberg',
                asrs: 'Skala Objawów ADHD',
                hama: 'Skala Lęku Hamiltona',
                isi: 'Skala Nasilenia Bezsenności',
                cars2: 'Skala Oceny Autyzmu Dziecięcego'
            }
        },
        examination: {
            title: 'Badanie fizykalne',
            bloodPressure: 'Ciśnienie krwi',
            heartRate: 'Tętno',
            temperature: 'Temperatura',
            weight: 'Waga',
            height: 'Wzrost',
            generalCondition: 'Stan ogólny',
            additionalFindings: 'Dodatkowe obserwacje',
            placeholders: {
                bp: 'np. 120/80 mmHg',
                hr: 'np. 72',
                temp: 'np. 36.6',
                findings: 'Inne obserwacje...'
            }
        },
        diagnosis: {
            title: 'Rozpoznanie (ICD-10)',
            searchPlaceholder: 'Wyszukaj kod lub nazwę rozpoznania ICD-10...',
            type: {
                primary: 'Główne',
                secondary: 'Współistniejące'
            },
            actions: {
                add: 'Dodaj rozpoznanie',
                remove: 'Usuń'
            },
            search_title: 'Wyszukaj kod lub nazwę rozpoznania ICD-10...',
            search_placeholder: 'Szukaj po kodzie (np. F32.1) lub opisie (np. depresja)...',
            selected: 'Wybrane rozpoznania',
            empty: 'Brak wybranych rozpoznań',
            empty_desc: 'Wyszukaj i wybierz kody ICD-10 powyżej',
            noResults: 'Nie znaleziono pasujących kodów'
        },
        documents: {
            title: 'Dokumenty',
            additionalNotes: 'Dodatkowe uwagi',
            prescriptions: {
                title: 'Recepty',
                new: 'Nowa recepta',
                description: 'Wystawiaj e-recepty zgodne z systemem P1. Możesz zapisać receptę jako szkic i podpisać ją później.',
                add_med: 'Dodaj lek',
                ezla: 'e-Recepta'
            },
            sickLeave: {
                title: 'Zwolnienie lekarskie',
                new: 'Wystaw zwolnienie',
                ezla: 'e-ZLA',
                remove: 'Usuń zwolnienie',
                issue_ezla: 'Wystaw e-ZLA',
                patient_info: 'Informacje o pacjencie',
                patient_info_desc: 'Dane pacjenta zostaną automatycznie pobrane z systemu ZUS po wpisaniu numeru PESEL.',
                period: 'Okres zwolnienia',
                from: 'Data od',
                to: 'Data do',
                hospital: 'Pobyt w szpitalu',
                hospital_from: 'Data rozpoczęcia',
                hospital_to: 'Data zakończenia',
                medical_data: 'Dane medyczne',
                icd10_label: 'Statystyczny numer choroby (ICD-10)',
                icd10_search: 'Wyszukaj kod ICD-10',
                statistical_number: 'Numer statystyczny',
                literal_codes: 'Kody literowe',
                recommendations: 'Zalecenia i wskazówki lekarza',
                recommendations_placeholder: 'Np. oszczędny tryb życia, przyjmowanie leków, rehabilitacja...',
                payers: 'Płatnicy',
                add_payer: 'Dodaj płatnika',
                payer_search: 'Wyszukaj płatnika po nazwie lub NIP...',
                no_payers: 'Brak dodanych płatników',
                pue_badge: 'PUE',
                validation: {
                    start_date_required: 'Data początkowa jest wymagana',
                    end_date_required: 'Data końcowa jest wymagana',
                    end_before_start: 'Data końcowa nie może być wcześniejsza niż data początkowa',
                    icd_required: 'Kod ICD-10 jest wymagany',
                    employer_required: 'Wymagany jest co najmniej jeden płatnik',
                    hospital_dates_required: 'Daty pobytu w szpitalu są wymagane',
                    hospital_end_before_start: 'Data zakończenia pobytu nie może być wcześniejsza niż data rozpoczęcia'
                }
            },
            referrals: {
                title: 'Skierowania',
                new: 'Nowe skierowanie',
                specialization: 'Specjalizacja',
                specialization_placeholder: 'np. Kardiologia',
                reason: 'Powód skierowania',
                urgency: {
                    label: 'Pilność',
                    normal: 'Planowe',
                    urgent: 'Pilne',
                    immediate: 'Natychmiastowe'
                },
                additionalNotes: 'Dodatkowe uwagi'
            }
        },
        summary: {
            title: 'Podsumowanie wizyty',
            sections: {
                diagnoses: 'Rozpoznania',
                documents: 'Wystawione dokumenty',
                recommendations: 'Zalecenia psychiatryczne',
                nextVisit: 'Następna wizyta',
                generalRecommendations: 'Zalecenia ogólne'
            },
            actions: {
                addRecommendations: 'Dodaj zalecenia',
                finish: 'Zakończ wizytę'
            },
            emptyDiagnoses: 'Brak dodanych rozpoznań.',
            emptyDocuments: 'Nie wystawiono dokumentów.',
            prescriptionIssued: 'E-Recepta wystawiona',
            referralIssued: 'Skierowanie wystawione',
            aiTitle: 'Asystenci AI',
            noAiFeatures: 'Brak włączonych funkcji AI',
            addedAt: 'Dodano',
            medicationSchedule: 'Harmonogram leków',
            monitoringScales: 'Skale monitorowania',
            noRecommendations: 'Brak zaleceń psychiatrycznych',
            noRecommendationsHelper: 'Kliknij "Dodaj zalecenia" aby utworzyć plan leczenia',
            duration: 'Czas trwania',
            reminders: 'Przypomnienia',
            every: 'Co',
            days: 'dni',
            starting: 'od',
            documentTypes: {
                prescription: 'Recepta',
                referral: 'Skierowanie',
                sickLeave: 'Zwolnienie lekarskie',
            },
            documentLabels: {
                quantity: 'Ilość',
                specialization: 'Specjalizacja',
                reason: 'Powód',
                startDate: 'Data rozpoczęcia',
                endDate: 'Data zakończenia',
            },
            nextVisitLabels: {
                create: 'Umów kolejną wizytę',
                creating: 'Tworzenie...',
                created: 'Następna wizyta utworzona',
                date: 'Data',
                time: 'Godzina',
                patient: 'Pacjent',
                doctor: 'Lekarz',
                followUpNotes: 'Wizyta kontrolna pacjenta',
                successTitle: 'Sukces',
                successMessage: 'Następna wizyta została utworzona!',
                errorTitle: 'Błąd',
                errorMessage: 'Nie udało się utworzyć wizyty. Spróbuj ponownie.',
                cancelConfirmTitle: 'Anuluj wizytę',
                cancelConfirmMessage: 'Czy na pewno chcesz anulować następną wizytę?',
                cancelConfirm: 'Tak, anuluj',
                cancelSuccessTitle: 'Anulowano',
                cancelSuccessMessage: 'Następna wizyta została anulowana.',
                cancelErrorMessage: 'Nie udało się anulować wizyty. Spróbuj ponownie.',
            },
            placeholders: {
                recommendations: 'Wpisz ogólne zalecenia'
            }
        },
        confirmation: {
            title: 'Zakończ wizytę',
            subtitle: 'Czy na pewno chcesz oznaczyć tę wizytę jako zakończoną? Tej akcji nie można cofnąć.',
            diagnoses: 'Diagnozy',
            documents: 'Dokumenty',
            issued: 'Wystawione',
            none: 'Brak',
            warning: 'Po zakończeniu status wizyty zostanie zmieniony na „zakończona" i nastąpi przekierowanie do pulpitu.',
            confirm: 'Zakończ wizytę',
        },
        ai: {
            title: 'Asystenci AI',
            tabs: {
                cds: 'Wsparcie decyzji',
                interview: 'Trener Wywiadu',
                transcription: 'Asystent Dokumentacji',
                interactions: 'Farmakopedia',
                icd10: 'Asystent ICD-10',
                voice: 'Nagrywanie',
                diagnostic: 'Diagnostyka AI',
                medication: 'Leki AI'
            },
            badge: 'Wspierane przez AI',
            cds: {
                analyzing: 'Analizowanie danych klinicznych...',
                analysisError: 'Błąd podczas analizy klinicznej. Spróbuj ponownie.',
                selectData: 'Wybierz dane do analizy',
                analysisResults: 'Wyniki analizy',
                newAnalysis: 'Nowa',
                detailedAnalysis: 'Szczegółowa analiza',
                evidence: 'Dowody',
                riskFactors: 'Czynniki ryzyka',
                recommendations: 'Zalecenia',
                currentVisit: 'Bieżąca wizyta',
                currentInterview: 'Bieżący wywiad',
                currentInterviewDesc: 'Uwzględnij dane z wywiadu bieżącej wizyty',
                previousVisits: 'Poprzednie wizyty',
                noPreviousVisits: 'Nie znaleziono poprzednich wizyt',
                analyze: 'Analizuj'
            },
            interview: {
                title: 'Trener Wywiadu Medycznego',
                subtitle: 'Trener wywiadu medycznego napędzany przez AI',
                noData: 'Brak danych do analizy',
                noDataDesc: 'Proszę przeprowadzić wywiad medyczny, aby przeanalizować jakość komunikacji.',
                suggestedCount: 'Sugerowane pytania: {{count}}',
                analyzing: 'Analizowanie...',
                analyzeAgain: 'Przeanalizuj ponownie',
                analysisError: 'Analiza nie powiodła się. Spróbuj ponownie później.',
                noSuggestions: 'Brak dostępnych sugestii',
                noAnalysis: 'Brak danych analizy',
                followUp: 'Pytanie dodatkowe',
                relevance: 'Trafność',
                tabs: {
                    suggestions: 'Sugestie pytań',
                    analysis: 'Analiza komunikacji',
                    literature: 'Literatura'
                },
                analysis: {
                    clusters: 'Klastry objawów',
                    identified: 'Zidentyfikowane obszary',
                    potential: 'Potencjalne rozpoznania',
                    toConsider: 'Do rozważenia',
                    gaps: 'Luki diagnostyczne',
                    attention: 'Wymagają uwagi',
                    recommendations: 'Zalecenia kliniczne'
                }
            },
            transcription: {
                smart: 'Inteligentna transkrypcja',
                smartDesc: 'Transkrypcja rozmów medycznych wspierana przez AI',
                consult: 'Konsultacje Remedius',
                consultDesc: 'Asystent kliniczny AI do konsultacji medycznych...',
                pharmacopedia: 'Farmakopedia',
                pharmacopediaDesc: 'Kompleksowe informacje o lekach i sprawdzanie interakcji napędzane przez AI',
                transcribed: 'Transkrybowane',
                noTranscription: 'Brak transkrypcji',
                noTranscriptionDesc: 'Nagraj lub prześlij audio, aby transkrybować',
                noteGeneration: 'Generowanie notatki',
                noteType: 'Typ notatki',
                soap: 'SOAP',
                clinical: 'Kliniczny',
                specialization: 'Specjalizacja',
                psychiatry: 'Psychiatria',
                childPsychiatry: 'Psychiatria dziecięca',
                smartSelect: 'Inteligentny wybór',
                surgery: 'Chirurgia',
                visitType: 'Typ wizyty',
                firstVisit: 'Pierwsza wizyta',
                followUp: 'Wizyta kontrolna',
                selectPrevious: 'Wybierz poprzednie wizyty',
                noteLength: 'Długość notatki',
                small: 'Krótka',
                medium: 'Średnia',
                large: 'Długa',
                generating: 'Generowanie...',
                generateNote: 'Generuj notatkę',
                notePreview: 'Wygenerowana notatka',
                toInterview: 'Do wywiadu',
                regenerate: 'Regeneruj',
                selectAllRequired: 'Proszę wybrać wszystkie wymagane opcje',
                noContent: 'Brak treści transkrypcji',
                copiedToInterview: 'Skopiowano do wywiadu pomyślnie'
            },
            medInfo: {
                title: 'Informacje o lekach',
                search: 'Wyszukaj lek',
                placeholder: 'Wpisz nazwę leku (min. 3 znaki)...',
                empty: 'Wyszukaj lek, aby zobaczyć szczegóły'
            },
            drug: {
                searchFailed: 'Nie udało się wyszukać leków',
                loadFailed: 'Nie udało się załadować szczegółów leku',
                loading: 'Ładowanie szczegółów...',
                details: 'Szczegóły leku',
                viewMore: 'Pokaż więcej',
                viewLess: 'Pokaż mniej',
                name: 'Nazwa',
                composition: 'Skład',
                interactions: 'Interakcje',
                indications: 'Wskazania',
                dosage: 'Dawkowanie i sposób podania',
                contraindications: 'Przeciwwskazania',
                sideEffects: 'Działania niepożądane',
                warnings: 'Ostrzeżenia i środki ostrożności',
                pregnancy: 'Ciąża i laktacja',
                overdose: 'Przedawkowanie',
                pharmacology: 'Właściwości farmakologiczne'
            },
            icd10: {
                subtitle: 'Wyszukaj i dodaj kody ICD-10 do wizyty',
                currentDiagnoses: 'Aktualne rozpoznania',
                empty: 'Wyszukaj kody ICD-10',
                emptyDesc: 'Wpisz kod lub opis, aby wyszukać'
            }
        },
        navigation: {
            previous: 'Wstecz',
            next: 'Dalej',
            finish: 'Zakończ'
        },
        recommendations: {
            modal_title: 'Zalecenia dla Portalu Pacjenta',
            medication_schedule: 'Harmonogram leków',
            search_medication: 'Wyszukaj lek...',
            scale_monitoring: 'Monitorowanie skal',
            add_to_monitoring: 'Dodaj do monitorowania',
            ai_assistant: {
                title: 'Asystent AI',
                enable: 'Włącz asystenta AI',
                tools: {
                    mood: {
                        title: 'Inteligentne Śledzenie Nastroju',
                        description: 'Sztuczna inteligencja analizuje wzorce nastroju i sugeruje interwencje'
                    },
                    meds: {
                        title: 'Adaptacyjne Przypomnienia o Lekach',
                        description: 'AI dostosowuje przypomnienia do rytmu dnia pacjenta'
                    },
                    crisis: {
                        title: 'Wsparcie Kryzysowe',
                        description: 'AI wykrywa sygnały ostrzegawcze i sugeruje odpowiednie działania'
                    },
                    coping: {
                        title: 'Spersonalizowane Strategie Radzenia Sobie',
                        description: 'AI proponuje techniki dostosowane do sytuacji pacjenta'
                    }
                }
            },
            share_emergency: 'Udostępnij kontakty alarmowe w portalu',
            save: 'Zapisz zalecenia',
            remove: 'Usuń',
            every: 'Co',
            days: 'dni',
            instructions_placeholder: 'Dawkowanie (np. 1-0-1)',
            enable_reminders: 'Włącz przypomnienia',
            assessments: {
                depression: 'Ocena Depresji',
                anxiety: 'Ocena Lęku',
                mental_health: 'Ocena Zdrowia Psychicznego',
                ptsd_trauma: 'Ocena PTSD i Traumy',
                addiction: 'Ocena Uzależnień',
                sleep: 'Ocena Snu'
            }
        },
        scales: {
            assessment: 'Ocena',
            question_progress: 'Pytanie {{current}} z {{total}}',
            buttons: {
                cancel: 'Anuluj',
                back: 'Wstecz',
                finish: 'Zakończ'
            },
            questions: {
                hamd: {
                    q1: { title: 'Nastrój depresyjny (smutek, beznadziejność, pomocność, poczucie bezwartościowości)', o0: 'Brak', o1: 'Stany wskazane tylko przy przesłuchaniu', o2: 'Stany zgłaszane spontanicznie słownie', o3: 'Komunikuje stany niewerbalnie', o4: 'Pacjent zgłasza praktycznie tylko te stany' },
                    q2: { title: 'Poczucie winy', o0: 'Brak', o1: 'Samozarzuty, czuje że zawiódł ludzi', o2: 'Idee winy lub ruminacje', o3: 'Obecna choroba jako kara. Urojenia winy', o4: 'Słyszy głosy oskarżycielskie' },
                    q3: { title: 'Samobójstwo', o0: 'Brak', o1: 'Czuje że życie nie jest warte przeżycia', o2: 'Życzy sobie śmierci', o3: 'Idee lub gesty samobójcze', o4: 'Próby samobójcze' },
                    q4: { title: 'Bezsenność: Wczesna (trudności z zasypianiem)', o0: 'Brak trudności', o1: 'Sporadyczne trudności', o2: 'Codzienne trudności' },
                    q5: { title: 'Bezsenność: Środkowa (budzenie się w nocy)', o0: 'Brak trudności', o1: 'Niepokój w nocy', o2: 'Budzenie się w nocy' },
                    q6: { title: 'Bezsenność: Późna (wczesne budzenie się)', o0: 'Brak trudności', o1: 'Wczesne budzenie się, ale zasypia ponownie', o2: 'Niemożność ponownego zaśnięcia' },
                    q7: { title: 'Praca i aktywność', o0: 'Brak trudności', o1: 'Myśli o niezdolności, zmęczenie', o2: 'Utrata zainteresowań', o3: 'Spadek wydajności', o4: 'Przerwanie pracy z powodu choroby' },
                    q8: { title: 'Spowolnienie (myślenia i mowy)', o0: 'Normalna mowa i myślenie', o1: 'Lekkie spowolnienie', o2: 'Wyraźne spowolnienie', o3: 'Utrudniony kontakt', o4: 'Całkowity stupor' },
                    q9: { title: 'Pobudzenie (agitacja)', o0: 'Brak', o1: 'Niepokój ruchowy', o2: 'Zabawa rękami, włosami itp.', o3: 'Chodzenie, niemożność usiedzenia', o4: 'Załamywanie rąk, gryzienie paznokci' },
                    q10: { title: 'Lęk psychiczny', o0: 'Brak', o1: 'Napięcie i drażliwość', o2: 'Martwienie się drobiazgami', o3: 'Postawa lękowa widoczna w twarzy', o4: 'Lęki wyrażane bez pytania' },
                    q11: { title: 'Lęk somatyczny', o0: 'Brak', o1: 'Łagodny', o2: 'Umiarkowany', o3: 'Ciężki', o4: 'Paraliżujący' },
                    q12: { title: 'Objawy somatyczne żołądkowo-jelitowe', o0: 'Brak', o1: 'Utrata apetytu', o2: 'Trudności w jedzeniu bez namawiania' },
                    q13: { title: 'Objawy somatyczne ogólne', o0: 'Brak', o1: 'Ciężkość kończyn, bóle pleców/głowy', o2: 'Wyraźne objawy' },
                    q14: { title: 'Objawy płciowe', o0: 'Brak', o1: 'Łagodne', o2: 'Ciężkie' },
                    q15: { title: 'Hipochondria', o0: 'Brak', o1: 'Skupienie na ciele', o2: 'Przesadne dbanie o zdrowie', o3: 'Częste skargi', o4: 'Urojenia hipochondryczne' },
                    q16: { title: 'Utrata masy ciała', o0: 'Brak', o1: 'Prawdopodobna', o2: 'Wyraźna' },
                    q17: { title: 'Krytycyzm (wgląd)', o0: 'Przyznaje, że jest chory', o1: 'Przyznaje choroę, ale szuka przyczyn zewnętrznych', o2: 'Zaprzecza chorobie' }
                },
                madrs: {
                    q1: { title: 'Zgłaszany smutek', o0: { title: 'Brak', desc: 'Sporadyczny smutek adekwatny do sytuacji' }, o1: { title: 'Łagodny', desc: 'Smutny, ale rozchmurza się bez trudności' }, o2: { title: 'Umiarkowany', desc: 'Wszechobecne uczucie smutku lub pesymizmu' }, o3: { title: 'Ciężki', desc: 'Ciągły, niezmienny smutek lub przygnębienie' } },
                    q2: { title: 'Widoczny smutek', o0: { title: 'Brak', desc: 'Brak smutku' }, o1: { title: 'Łagodny', desc: 'Wygląda na zniechęconego, ale rozchmurza się' }, o2: { title: 'Umiarkowany', desc: 'Wygląda na smutnego przez większość czasu' }, o3: { title: 'Ciężki', desc: 'Wygląda na bardzo nieszczęśliwego cały czas' } },
                    q3: { title: 'Napięcie wewnętrzne', o0: { title: 'Brak', desc: 'Spokój. Tylko przejściowe napięcie' }, o1: { title: 'Łagodny', desc: 'Sporadyczne uczucie niepokoju' }, o2: { title: 'Umiarkowany', desc: 'Stałe uczucie napięcia wewnętrznego' }, o3: { title: 'Ciężki', desc: 'Nieustający lęk lub udręka. Panika' } },
                    q4: { title: 'Zredukowany sen', o0: { title: 'Brak', desc: 'Śpi jak zwykle' }, o1: { title: 'Łagodny', desc: 'Lekka trudność z zasypianiem' }, o2: { title: 'Umiarkowany', desc: 'Sen skrócony lub przerywany o co najmniej 2h' }, o3: { title: 'Ciężki', desc: 'Mniej niż 2-3h snu' } },
                    q5: { title: 'Zredukowany apetyt', o0: { title: 'Brak', desc: 'Normalny lub zwiększony apetyt' }, o1: { title: 'Łagodny', desc: 'Lekko zmniejszony apetyt' }, o2: { title: 'Umiarkowany', desc: 'Brak apetytu. Jedzenie bez smaku' }, o3: { title: 'Ciężki', desc: 'Wymaga namawiania do jedzenia' } },
                    q6: { title: 'Trudności z koncentracją', o0: { title: 'Brak', desc: 'Brak trudności w koncentracji' }, o1: { title: 'Łagodny', desc: 'Sporadyczne trudności w zbieraniu myśli' }, o2: { title: 'Umiarkowany', desc: 'Trudności przeszkadzające w czytaniu/rozmowie' }, o3: { title: 'Ciężki', desc: 'Niemożność czytania lub prowadzenia rozmowy' } },
                    q7: { title: 'Lassitudo (znużenie)', o0: { title: 'Brak', desc: 'Brak ociężałości' }, o1: { title: 'Łagodny', desc: 'Trudności z rozpoczęciem aktywności' }, o2: { title: 'Umiarkowany', desc: 'Proste czynności rutynowe tylko z wysiłkiem' }, o3: { title: 'Ciężki', desc: 'Całkowite znużenie. Niemożność zrobienia czegokolwiek' } },
                    q8: { title: 'Niemożność odczuwania', o0: { title: 'Brak', desc: 'Normalne zainteresowanie otoczeniem' }, o1: { title: 'Łagodny', desc: 'Zmniejszona zdolność do cieszenia się' }, o2: { title: 'Umiarkowany', desc: 'Utrata zainteresowań i uczuć' }, o3: { title: 'Ciężki', desc: 'Uczucie paraliżu emocjonalnego' } },
                    q9: { title: 'Pesymistyczne myśli', o0: { title: 'Brak', desc: 'Brak pesymistycznych myśli' }, o1: { title: 'Łagodny', desc: 'Zmienne idee porażki' }, o2: { title: 'Umiarkowany', desc: 'Uporczywe samooskarżenia' }, o3: { title: 'Ciężki', desc: 'Urojenia ruiny, winy lub grzechu' } },
                    q10: { title: 'Myśli samobójcze', o0: { title: 'Brak', desc: 'Cieszy się życiem' }, o1: { title: 'Łagodny', desc: 'Znużony życiem. Przelotne myśli' }, o2: { title: 'Umiarkowany', desc: 'Lepiej byłoby nie żyć. Myśli są częste' }, o3: { title: 'Ciężki', desc: 'Wyraźne plany samobójcze' } }
                },
                asrs: {
                    part_a: 'Część A',
                    part_b: 'Część B',
                    options: {
                        never: 'Nigdy',
                        rarely: 'Rzadko',
                        sometimes: 'Czasami',
                        often: 'Często',
                        very_often: 'Bardzo często'
                    },
                    q1: { title: 'Jak często masz problem z wykończeniem szczegółów projektu?' },
                    q2: { title: 'Jak często masz problem z organizacją zadań wymagających planowania?' },
                    q3: { title: 'Jak często masz problem z zapamiętywaniem spotkań?' },
                    q4: { title: 'Jak często unikasz zadań wymagających dużego wysiłku umysłowego?' },
                    q5: { title: 'Jak często wiercisz się lub poruszasz rękami/nogami?' },
                    q6: { title: 'Jak często czujesz się nadmiernie aktywny, jak nakręcony?' },
                    q7: { title: 'Jak często popełniasz beztroskie błędy?' },
                    q8: { title: 'Jak często masz problem z utrzymaniem uwagi?' },
                    q9: { title: 'Jak często masz problem ze skupieniem się na tym, co mówią inni?' },
                    q10: { title: 'Jak często gubisz rzeczy lub masz problem z ich znalezieniem?' },
                    q11: { title: 'Jak często rozprasza Cię hałas lub aktywność wokół?' },
                    q12: { title: 'Jak często opuszczasz swoje miejsce na spotkaniach?' },
                    q13: { title: 'Jak często czujesz niepokój lub wiercisz się?' },
                    q14: { title: 'Jak często masz trudności z odprężeniem się?' },
                    q15: { title: 'Jak często zdarza Ci się mówić za dużo w sytuacjach towarzyskich?' },
                    q16: { title: 'Jak często kończysz zdania za inne osoby?' },
                    q17: { title: 'Jak często masz trudności z czekaniem na swoją kolej?' },
                    q18: { title: 'Jak często przerywasz innym, gdy są zajęci?' }
                },
                hama: {
                    q1: { title: 'Nastrój lękowy', o0: { title: 'Brak', desc: 'Brak nastroju lękowego' }, o1: { title: 'Łagodny', desc: 'Łagodne obawy' }, o2: { title: 'Umiarkowany', desc: 'Umiarkowany nastrój lękowy' }, o3: { title: 'Ciężki', desc: 'Ciężki nastrój lękowy' }, o4: { title: 'Bardzo ciężki', desc: 'Przytłaczający lęk' } },
                    q2: { title: 'Napięcie', o0: { title: 'Brak', desc: 'Brak napięcia' }, o1: { title: 'Łagodny', desc: 'Łagodne napięcie lub niepokój' }, o2: { title: 'Umiarkowany', desc: 'Umiarkowane napięcie' }, o3: { title: 'Ciężki', desc: 'Ciężkie napięcie' }, o4: { title: 'Bardzo ciężki', desc: 'Ekstremalne napięcie' } },
                    q3: { title: 'Lęki (fobie)', o0: { title: 'Brak', desc: 'Brak lęków' }, o1: { title: 'Łagodny', desc: 'Łagodne lęki' }, o2: { title: 'Umiarkowany', desc: 'Umiarkowane lęki' }, o3: { title: 'Ciężki', desc: 'Ciężkie lęki' }, o4: { title: 'Bardzo ciężki', desc: 'Przytłaczające lęki' } },
                    q4: { title: 'Bezsenność', o0: { title: 'Brak', desc: 'Normalny sen' }, o1: { title: 'Łagodny', desc: 'Lekkie zaburzenia snu' }, o2: { title: 'Umiarkowany', desc: 'Umiarkowana bezsenność' }, o3: { title: 'Ciężki', desc: 'Ciężka bezsenność' }, o4: { title: 'Bardzo ciężki', desc: 'Ekstremalna bezsenność' } },
                    q5: { title: 'Funkcje intelektualne', o0: { title: 'Brak', desc: 'Normalna koncentracja' }, o1: { title: 'Łagodny', desc: 'Lekkie trudności' }, o2: { title: 'Umiarkowany', desc: 'Umiarkowane trudności poznawcze' }, o3: { title: 'Ciężki', desc: 'Ciężkie problemy' }, o4: { title: 'Bardzo ciężki', desc: 'Niemożność koncentracji' } },
                    q6: { title: 'Nastrój depresyjny', o0: { title: 'Brak', desc: 'Brak depresji' }, o1: { title: 'Łagodny', desc: 'Nuda, utrata zainteresowań' }, o2: { title: 'Umiarkowany', desc: 'Wyraźnie obniżony nastrój' }, o3: { title: 'Ciężki', desc: 'Głęboka depresja' }, o4: { title: 'Bardzo ciężki', desc: 'Beznadziejność' } },
                    q7: { title: 'Objawy somatyczne (czuciowe)', o0: { title: 'Brak', desc: 'Brak objawów' }, o1: { title: 'Łagodny', desc: 'Szumy uszne, niewyraźne widzenie' }, o2: { title: 'Umiarkowany', desc: 'Uderzenia gorąca/zimna, słabość' }, o3: { title: 'Ciężki', desc: 'Uczucie mrowienia' }, o4: { title: 'Bardzo ciężki', desc: 'Ekstremalny dyskomfort' } },
                    q8: { title: 'Objawy somatyczne (mięśniowe)', o0: { title: 'Brak', desc: 'Brak objawów' }, o1: { title: 'Łagodny', desc: 'Bóle, drżenia' }, o2: { title: 'Umiarkowany', desc: 'Sztywność mięśni' }, o3: { title: 'Ciężki', desc: 'Zgrzytanie zębami' }, o4: { title: 'Bardzo ciężki', desc: 'Ekstremalne napięcie mięśniowe' } },
                    q9: { title: 'Objawy krążeniowe', o0: { title: 'Brak', desc: 'Brak objawów' }, o1: { title: 'Łagodny', desc: 'Tachykardia, kołatanie serca' }, o2: { title: 'Umiarkowany', desc: 'Ból w klatce piersiowej' }, o3: { title: 'Ciężki', desc: 'Uczucie omdlewania' }, o4: { title: 'Bardzo ciężki', desc: 'Ciężka niewydolność' } },
                    q10: { title: 'Objawy oddechowe', o0: { title: 'Brak', desc: 'Brak objawów' }, o1: { title: 'Łagodny', desc: 'Ucisk w klatce, wzdychanie' }, o2: { title: 'Umiarkowany', desc: 'Duszność' }, o3: { title: 'Ciężki', desc: 'Ekstremalna hiperwentylacja' }, o4: { title: 'Bardzo ciężki', desc: 'Niemożność oddychania' } },
                    q11: { title: 'Objawy żołądkowo-jelitowe', o0: { title: 'Brak', desc: 'Brak objawów' }, o1: { title: 'Łagodny', desc: 'Trudności w połykaniu' }, o2: { title: 'Umiarkowany', desc: 'Bóle brzucha' }, o3: { title: 'Ciężki', desc: 'Nudności, wymioty' }, o4: { title: 'Bardzo ciężki', desc: 'Ciężkie zaburzenia' } },
                    q12: { title: 'Objawy moczowo-płciowe', o0: { title: 'Brak', desc: 'Brak objawów' }, o1: { title: 'Łagodny', desc: 'Częstomocz' }, o2: { title: 'Umiarkowany', desc: 'Nagłe parcia, brak miesiączki' }, o3: { title: 'Ciężki', desc: 'Przedwczesny wytrysk, utrata libido' }, o4: { title: 'Bardzo ciężki', desc: 'Impotencja' } },
                    q13: { title: 'Objawy autonomiczne', o0: { title: 'Brak', desc: 'Brak objawów' }, o1: { title: 'Łagodny', desc: 'Suchość w ustach, wypieki' }, o2: { title: 'Umiarkowany', desc: 'Bladość, potliwość' }, o3: { title: 'Ciężki', desc: 'Zawroty głowy, bóle napięciowe' }, o4: { title: 'Bardzo ciężki', desc: 'Gęsia skórka' } },
                    q14: { title: 'Zachowanie podczas badania', o0: { title: 'Brak', desc: 'Zrelaksowany' }, o1: { title: 'Łagodny', desc: 'Wiercenie się, niepokój' }, o2: { title: 'Umiarkowany', desc: 'Drżenie rąk' }, o3: { title: 'Ciężki', desc: 'Napięta twarz, szybki oddech' }, o4: { title: 'Bardzo ciężki', desc: 'Bladość twarzy' } }
                },
                isi: {
                    q1: { title: 'Trudności z zasypianiem', o0: { title: 'Brak', desc: 'Brak problemów' }, o1: { title: 'Łagodne', desc: 'Lekkie trudności' }, o2: { title: 'Umiarkowane', desc: 'Wyraźne trudności' }, o3: { title: 'Ciężkie', desc: 'Znaczne trudności' }, o4: { title: 'Bardzo ciężkie', desc: 'Ekstremalne trudności' } },
                    q2: { title: 'Trudności z utrzymaniem snu', o0: { title: 'Brak', desc: 'Brak wybudzeń' }, o1: { title: 'Łagodne', desc: 'Sporadyczne wybudzenia' }, o2: { title: 'Umiarkowane', desc: 'Regularne wybudzenia' }, o3: { title: 'Ciężkie', desc: 'Częste wybudzenia' }, o4: { title: 'Bardzo ciężkie', desc: 'Stałe wybudzenia' } },
                    q3: { title: 'Problemy z wczesnym budzeniem się', o0: { title: 'Brak', desc: 'Wybudzanie o planowanej porze' }, o1: { title: 'Łagodne', desc: 'Nieco za wcześnie' }, o2: { title: 'Umiarkowane', desc: 'Wyraźnie za wcześnie' }, o3: { title: 'Ciężkie', desc: 'Znacznie za wcześnie' }, o4: { title: 'Bardzo ciężkie', desc: 'Ekstremalnie za wcześnie' } },
                    q4: { title: 'Satysfakcja ze snu', o0: { title: 'Bardzo zadowolony', desc: 'Sen jest regenerujący' }, o1: { title: 'Zadowolony', desc: 'Sen jest zazwyczaj dobry' }, o2: { title: 'Umiarkowanie', desc: 'Sen jest akceptowalny' }, o3: { title: 'Niezadowolony', desc: 'Sen jest niewystarczający' }, o4: { title: 'Bardzo niezadowolony', desc: 'Sen jest niesatysfakcjonujący' } },
                    q5: { title: 'Wpływ na codzienne funkcjonowanie', o0: { title: 'Wcale', desc: 'Brak wpływu' }, o1: { title: 'Trochę', desc: 'Minimalny wpływ' }, o2: { title: 'Umiarkowanie', desc: 'Zauważalny wpływ' }, o3: { title: 'Bardzo', desc: 'Znaczny wpływ' }, o4: { title: 'Ekstremalnie', desc: 'Ciężkie upośledzenie' } },
                    q6: { title: 'Dostrzegalność problemów przez innych', o0: { title: 'Niezauważalne', desc: 'Niewidoczne dla innych' }, o1: { title: 'Trochę', desc: 'Oznaki zmęczenia' }, o2: { title: 'Średnio', desc: 'Czasem zauważalne' }, o3: { title: 'Bardzo', desc: 'Wyraźnie widoczne' }, o4: { title: 'Ekstremalnie', desc: 'Inni są bardzo świadomi' } },
                    q7: { title: 'Martwienie się snem', o0: { title: 'Wcale', desc: 'Brak obaw' }, o1: { title: 'Trochę', desc: 'Sporadyczne obawy' }, o2: { title: 'Średnio', desc: 'Regularne obawy' }, o3: { title: 'Bardzo', desc: 'Częsty niepokój' }, o4: { title: 'Ekstremalnie', desc: 'Stała udręka' } }
                },
                cars2: {
                    q1: { title: 'Relacje z ludźmi', o0: { title: 'W normie', desc: 'Zachowanie adekwatne do wieku' }, o1: { title: 'Lekko nietypowe', desc: 'Lekkie trudności' }, o2: { title: 'Umiarkowanie nietypowe', desc: 'Zauważalne trudności' }, o3: { title: 'Znacznie nietypowe', desc: 'Ciężkie trudności' } },
                    q2: { title: 'Naśladownictwo', o0: { title: 'W normie', desc: 'Naśladuje adekwatnie' }, o1: { title: 'Lekko nietypowe', desc: 'Naśladuje przez większość czasu' }, o2: { title: 'Umiarkowanie nietypowe', desc: 'Naśladuje rzadko' }, o3: { title: 'Znacznie nietypowe', desc: 'Rzadko lub nigdy' } },
                    q3: { title: 'Reakcje emocjonalne', o0: { title: 'W normie', desc: 'Adekwatne do sytuacji' }, o1: { title: 'Lekko nietypowe', desc: 'Sporadycznie nieadekwatne' }, o2: { title: 'Umiarkowanie nietypowe', desc: 'Często nieadekwatne' }, o3: { title: 'Znacznie nietypowe', desc: 'Ekstremalnie nieadekwatne' } },
                    q4: { title: 'Używanie ciała', o0: { title: 'W normie', desc: 'Typowe dla wieku' }, o1: { title: 'Lekko nietypowe', desc: 'Lekkie dziwactwa' }, o2: { title: 'Umiarkowanie nietypowe', desc: 'Zauważalne nietypowe ruchy' }, o3: { title: 'Znacznie nietypowe', desc: 'Częste dziwne ruchy' } },
                    q5: { title: 'Używanie przedmiotów', o0: { title: 'W normie', desc: 'Adekwatne użycie' }, o1: { title: 'Lekko nietypowe', desc: 'Mniejsze zainteresowanie' }, o2: { title: 'Umiarkowanie nietypowe', desc: 'Małe zainteresowanie funkcją' }, o3: { title: 'Znacznie nietypowe', desc: 'Skupienie na nietypowych aspektach' } },
                    q6: { title: 'Adaptacja do zmian', o0: { title: 'W normie', desc: 'Łatwo się adaptuje' }, o1: { title: 'Lekko nietypowe', desc: 'Trudności z nowymi zadaniami' }, o2: { title: 'Umiarkowanie nietypowe', desc: 'Silny opór przed zmianą' }, o3: { title: 'Znacznie nietypowe', desc: 'Gwałtowne reakcje' } },
                    q7: { title: 'Reakcje wzrokowe', o0: { title: 'W normie', desc: 'Normalny kontakt wzrokowy' }, o1: { title: 'Lekko nietypowe', desc: 'Sporadyczne zapatrzenie' }, o2: { title: 'Umiarkowanie nietypowe', desc: 'Częste dziwne używanie oczu' }, o3: { title: 'Znacznie nietypowe', desc: 'Ekstremalne unikanie wzroku' } },
                    q8: { title: 'Reakcje słuchowe', o0: { title: 'W normie', desc: 'Normalna reakcja' }, o1: { title: 'Lekko nietypowe', desc: 'Czasem ignoruje dźwięki' }, o2: { title: 'Umiarkowanie nietypowe', desc: 'Często ignoruje dźwięki' }, o3: { title: 'Znacznie nietypowe', desc: 'Wyraźna nadreaktywność' } },
                    q9: { title: 'Smak, węch i dotyk', o0: { title: 'W normie', desc: 'Normalne reagowanie' }, o1: { title: 'Lekko nietypowe', desc: 'Może sporadycznie nadreagować' }, o2: { title: 'Umiarkowanie nietypowe', desc: 'Częsta fiksacja na zapachach' }, o3: { title: 'Znacznie nietypowe', desc: 'Silne reakcje' } },
                    q10: { title: 'Strach lub nerwowość', o0: { title: 'W normie', desc: 'Adekwatne do sytuacji' }, o1: { title: 'Lekko nietypowe', desc: 'Nieco większy/mniejszy strach' }, o2: { title: 'Umiarkowanie nietypowe', desc: 'Strach jest częsty, ekstremalny' }, o3: { title: 'Znacznie nietypowe', desc: 'Uporczywy strach' } },
                    q11: { title: 'Komunikacja słowna', o0: { title: 'W normie', desc: 'Normalny rozwój' }, o1: { title: 'Lekko nietypowe', desc: 'Powolny rozwój' }, o2: { title: 'Umiarkowanie nietypowe', desc: 'Nietypowa mowa, powtarzanie' }, o3: { title: 'Znacznie nietypowe', desc: 'Brak sensownej mowy' } },
                    q12: { title: 'Komunikacja niewerbalna', o0: { title: 'W normie', desc: 'Normalne gesty' }, o1: { title: 'Lekko nietypowe', desc: 'Niedojrzałe lub nieporadne' }, o2: { title: 'Umiarkowanie nietypowe', desc: 'Częste trudności' }, o3: { title: 'Znacznie nietypowe', desc: 'Osobliwa lub brak' } },
                    q13: { title: 'Poziom aktywności', o0: { title: 'W normie', desc: 'Adekwatny do wieku' }, o1: { title: 'Lekko nietypowe', desc: 'Lekka nadaktywność' }, o2: { title: 'Umiarkowanie nietypowe', desc: 'Częsty niepokój' }, o3: { title: 'Znacznie nietypowe', desc: 'Ekstremalne poziomy' } },
                    q14: { title: 'Reakcje intelektualne', o0: { title: 'W normie', desc: 'Normalna sprawność' }, o1: { title: 'Lekko nietypowe', desc: 'Nie tak wysoka jak się zdaje' }, o2: { title: 'Umiarkowanie nietypowe', desc: 'Znaczne opóźnienia' }, o3: { title: 'Znacznie nietypowe', desc: 'Ciężkie upośledzenie' } },
                    q15: { title: 'Ogólne wrażenie', o0: { title: 'W normie', desc: 'Brak cech autyzmu' }, o1: { title: 'Lekkie cechy', desc: 'Spełnia kryteria łagodnego autyzmu' }, o2: { title: 'Umiarkowane cechy', desc: 'Wyraźne cechy autyzmu' }, o3: { title: 'Cięższe cechy', desc: 'Ekstremalne cechy' } }
                }
            }
        },
        laboratory: {
            title: 'Laboratorium',
            tabs: { order: 'Nowe zlecenie', list: 'Zlecenia', results: 'Wyniki' },
            orderForm: {
                title: 'Zlecenie badań laboratoryjnych',
                searchTests: 'Szukaj dostępnych badań...',
                selectedCount: '{{count}} badań wybranych',
                priority: 'Priorytet',
                notes: 'Uwagi do zlecenia',
                notesPlaceholder: 'Dodatkowe instrukcje dla laboratorium...',
                submit: 'Złóż zlecenie',
            },
            priority: { routine: 'Planowe', urgent: 'Pilne', stat: 'CITO' },
            status: { ordered: 'Zlecone', collected: 'Pobrane', in_progress: 'W trakcie', completed: 'Zakończone', cancelled: 'Anulowane' },
            orders: { empty: 'Brak zleceń laboratoryjnych', viewResults: 'Zobacz wyniki' },
            results: {
                title: 'Wyniki badań',
                verifiedAt: 'Zweryfikowano',
                criticalWarning: 'Wykryto wartości krytyczne!',
                refRange: 'Zakres ref.',
                interpretation: 'Interpretacja',
                attachments: 'Załączniki',
                selectOrder: 'Wybierz zakończone zlecenie, aby zobaczyć wyniki',
                flag: { normal: 'Norma', high: 'Wysoki', low: 'Niski', critical: 'Krytyczny' },
            },
        },
        procedures: {
            title: 'Procedury',
            tabs: { add: 'Dodaj procedurę', list: 'Lista procedur' },
            form: {
                title: 'Zaplanuj procedurę',
                name: 'Nazwa procedury',
                namePlaceholder: 'Wpisz nazwę procedury...',
                category: 'Kategoria',
                icd9Code: 'Kod ICD-9',
                duration: 'Czas trwania (min)',
                scheduledDate: 'Zaplanowana data',
                description: 'Opis',
                descriptionPlaceholder: 'Opisz procedurę...',
                notes: 'Uwagi',
                notesPlaceholder: 'Dodatkowe uwagi...',
                submit: 'Dodaj procedurę',
            },
            category: { diagnostic: 'Diagnostyczna', therapeutic: 'Terapeutyczna', preventive: 'Profilaktyczna', surgical: 'Chirurgiczna' },
            status: { planned: 'Zaplanowana', inProgress: 'W trakcie', completed: 'Zakończona', cancelled: 'Anulowana' },
            list: { empty: 'Brak zaplanowanych procedur', addResults: 'Dodaj wyniki' },
            results: {
                title: 'Wyniki procedury',
                findings: 'Wyniki badania',
                findingsPlaceholder: 'Opisz wyniki...',
                complications: 'Powikłania',
                complicationsPlaceholder: 'Wymień ewentualne powikłania...',
                recommendations: 'Zalecenia',
                recommendationsPlaceholder: 'Zalecenia po zabiegu...',
                commaHint: 'Oddziel elementy przecinkami',
                save: 'Zapisz wyniki',
            },
        },
        voiceTranscription: {
            title: 'Transkrypcja głosowa',
            description: 'Nagraj audio z konsultacji pacjenta do automatycznej transkrypcji na notatki kliniczne.',
            tapToStart: 'Dotknij, aby rozpocząć nagrywanie',
            tapToStop: 'Dotknij, aby zatrzymać nagrywanie',
            uploading: 'Przesyłanie audio...',
            transcribing: 'Transkrypcja...',
            result: 'Wynik transkrypcji',
            applyToInterview: 'Dodaj do wywiadu',
            permissionDenied: 'Brak dostępu do mikrofonu',
            noVisit: 'Nie znaleziono aktywnej wizyty',
            error: 'Wystąpił błąd podczas transkrypcji',
        },
        diagnosticAssistant: {
            title: 'Asystent diagnostyczny',
            welcome: 'Witaj! Jestem asystentem diagnostycznym. Opisz objawy pacjenta, a pomogę w postawieniu diagnozy.',
            suggestion: 'Na podstawie opisanych objawów, sugeruję następujące rozpoznania:',
            unspecified: 'Choroba, nieokreślona',
            errorResponse: 'Przepraszam, nie mogłem przetworzyć zapytania. Spróbuj ponownie.',
            inputPlaceholder: 'Opisz objawy...',
        },
        medicationAssistant: {
            title: 'Asystent leków',
            tabs: { graph: 'Graf wiedzy', pharmacy: 'Wyszukiwarka aptek' },
            searchPlaceholder: 'Szukaj leku...',
            noResults: 'Brak wyników. Spróbuj innego wyszukiwania.',
            noPharmacies: 'Nie znaleziono aptek w pobliżu.',
            analgesics: 'Analgetyki',
            painRelief: 'Uśmierzanie bólu',
            nsaids: 'Interakcja z NLPZ',
            nodeType: { medication: 'Lek', category: 'Kategoria', indication: 'Wskazanie', interaction: 'Interakcja' },
        },
        scaleSummary: {
            title: 'Podsumowanie wyniku skali',
            aiAnalysis: 'Analiza kliniczna AI',
            recommendationsTitle: 'Zalecenia',
            addToInterview: 'Dodaj do wywiadu',
            details: 'Szczegóły',
            severity: { none: 'Brak objawów', mild: 'Łagodne objawy', moderate: 'Umiarkowane objawy', severe: 'Ciężkie objawy', verySevere: 'Bardzo ciężkie objawy' },
            analysis: {
                defaultPoint1: 'Regularnie monitoruj objawy pacjenta',
                defaultPoint2: 'Rozważ ponowną ocenę za 2-4 tygodnie',
                defaultPoint3: 'Dokumentuj zmiany w obrazie klinicznym',
            },
            recommendations: {
                defaultRec1: 'Kontynuuj obecny plan leczenia z regularnym monitorowaniem',
                defaultRec2: 'Zaplanuj kontrolną wizytę psychiatryczną',
            },
        },
    },
    ai: {
        assistant: 'Asystent AI',
        documentation: 'Asystent dokumentacji',
        diagnosis: 'Diagnostyka różnicowa',
        drugInteractions: 'Interakcje lekowe',
        transcription: 'Transkrypcja głosowa'
    },
    visitsView: {
        title: 'Historia wizyt',
        loading: 'Ładowanie wizyt...',
        fetchError: 'Nie udało się załadować wizyt',
        retry: 'Ponów',
        noVisits: 'Nie znaleziono wizyt',
        notes: 'Notatki',
        interview: 'Wywiad lekarski',
        mainSymptoms: 'Główne objawy',
        medications: 'Aktualne leki',
        examination: 'Badanie fizykalne',
        generalCondition: 'Stan ogólny',
        status: {
            completed: 'Zakończona',
            scheduled: 'Zaplanowana',
            cancelled: 'Anulowana',
            'in-progress': 'W trakcie',
        },
    },
    "visitWizard": {
        title: "Utwórz nową wizytę",
        "form": {
            "date": "Data",
            "startTime": "Czas rozpoczęcia",
            "endTime": "Czas zakończenia",
            "patient": "Pacjent",
            "office": "Gabinet",
            "selectOffice": "Wybierz gabinet",
            "visitType": "Typ wizyty",
            "visitTypes": {
                "private": "Prywatna",
                "nfz": "NFZ"
            },
            "specialization": "Specjalizacja",
            "selectSpecialization": "Wybierz specjalizację",
            "specializations": {
                "psychiatry": "Psychiatria",
                "neurology": "Neurologia",
                "cardiology": "Kardiologia"
            },
            "options": {
                "isOnline": "Wizyta online",
                "isPrescription": "Potrzebna recepta",
                "isReferral": "Potrzebne skierowanie"
            },
            "notes": "Notatki",
            "additionalNotes": "Dodaj dodatkowe uwagi...",
            "submitButton": "Zaplanuj wizytę"
        },
        "validation": {
            "required": "To pole jest wymagane",
            "patientRequired": "Proszę wybrać pacjenta",
            "endTimeAfterStart": "Czas zakończenia musi być późniejszy niż czas rozpoczęcia"
        },
        "success": {
            "title": "Wizyta zaplanowana",
            "message": "Wizyta została pomyślnie zaplanowana"
        },
        "error": {
            "title": "Błąd",
            "message": "Wystąpił błąd podczas planowania wizyty. Spróbuj ponownie."
        },
        actions: {
            cancel: "Anuluj",
            save: "Zapisz",
            submit: "Zaplanuj wizytę"
        }
    },
    nav: {
        patients: {
            title: 'Pacjenci',
            search: 'Wyszukaj pacjenta',
            new: 'Nowy pacjent',
            list: 'Lista pacjentów',
            appointments: 'Zaplanowane wizyty',
            referrals: 'Skierowania'
        },
        services: {
            title: 'Usługi',
            newVisit: 'Nowa wizyta',
            labOrders: 'Zlecenia badań',
            documents: 'Dokumentacja',
            prescriptions: 'e-Recepty',
            aiAssistants: 'Asystenci AI'
        },
        reports: {
            title: 'Raporty',
            statistics: 'Statystyki',
            aiAnalysis: 'Analiza AI',
            medicalReports: 'Raporty medyczne',
            billing: 'Rozliczenia'
        },
        actions: {
            spotlight: 'Wyróżnione'
        },
        options: {
            darkMode: 'Tryb nocny',
            settings: 'Ustawienia',
            logout: 'Wyloguj się'
        }
    },
    moduleSelection: {
        loading: {
            title: "Moduł Psychiatryczny",
            initializing: "Inicjowanie modułu..."
        },
        selection: {
            subHeader: "Wybierz moduł, aby rozpocząć pracę",
            psychiatry: {
                title: "Psychiatria",
                subtitle: "Moduł psychiatryczny",
                description: "Kompleksowe narzędzie do dokumentacji psychiatrycznej, wspierane przez AI.",
                bullet1: "• Inteligentne skale psychiatryczne",
                bullet2: "• Analiza emocji i zachowania",
                bullet3: "• Asystent diagnostyczny AI"
            },
            poz: {
                title: "POZ",
                subtitle: "Podstawowa Opieka Zdrowotna",
                description: "Kompleksowy system do zarządzania praktyką POZ, z integracją e-recept i e-skierowań.",
                bullet1: "• Integracja P1",
                bullet2: "• Zarządzanie deklaracjami",
                bullet3: "• Rozliczenia NFZ",
                comingSoon: "Wkrótce"
            }
        }
    },

    patientAction: {
        viewDetails: "Wyświetl szczegóły",
        patientProfile: "Profil pacjenta",
        addInCalendar: "Dodaj do kalendarza",
        deletePatient: "Usuń pacjenta",
        saveNote: "Zapisz notatkę",
        enterNote: "Wpisz swoją notatkę tutaj...",
        cancel: "Anuluj"
    },

    patientDetailsModal: {
        sections: {
            basicInfo: "INFORMACJE PODSTAWOWE",
            address: "ADRES",
            insurance: "UBEZPIECZENIE",
            portal: "PORTAL PACJENTA / POWIADOMIENIA",
            employer: "PRACODAWCA",
            authorizedPersons: "OSOBY UPOWAŻNIONE I LISTA UDOSTĘPNIONEJ DOKUMENTACJI MEDYCZNEJ",
            consents: "ZGODA NA PRZETWARZANIE DANYCH OSOBOWYCH"
        },
        labels: {
            pesel: "PESEL:",
            dob: "Data urodzenia:",
            insuranceType: "Typ:",
            insuranceNumber: "Numer:",
            portalAccount: "Konto w portalu:",
            notifications: "Powiadomienia:",
            idCard: "Dowód tożsamości:",
            validUntil: "ważny do:"
        },
        status: {
            active: "Aktywne",
            granted: "Wyrażono",
            notGranted: "Nie wyrażono"
        },
        empty: {
            none: "Brak",
            na: "Brak danych",
            noAuthorizedPersons: "Brak osób upoważnionych",
            noConsents: "Brak udzielonych zgód"
        },
        buttons: {
            close: "Zamknij",
            editData: "Edytuj dane"
        }
    },

    patientDocuments: {
        title: "DOKUMENTACJA MEDYCZNA",
        fetchingDocuments: "Pobieranie dokumentów...",
        searchPlaceholder: "Szukaj w dokumentach...",
        newDocument: "Nowy dokument",
        uploadTitle: "Prześlij nowy dokument",
        documentCategory: "Kategoria dokumentu",
        selectCategory: "Wybierz kategorię",
        categoryLabResults: "Wyniki laboratoryjne",
        categoryInformedConsent: "Świadoma zgoda",
        documentFile: "Plik dokumentu",
        uploadAreaText: "Kliknij lub przeciągnij plik, aby przesłać",
        uploadAreaSubText: "Obsługa jednego pliku. Formaty PDF, DOC, DOCX, JPG, PNG.",
        description: "Opis",
        descriptionPlaceholder: "Wprowadź opis dokumentu tutaj...",
        addDocument: "Dodaj dokument",
        documentsToUpload: "Dokumenty do przesłania",
        cancel: "Anuluj",
        uploadDocuments: "Prześlij dokumenty",
        untitledDocument: "Dokument bez tytułu",
        noDate: "Brak daty",
        author: "Autor:",
        system: "System",
        noDescription: "Brak opisu dla tego dokumentu.",
        noSearchMatch: "Żaden dokument nie pasuje do wyszukiwania",
        noDocuments: "Nie znaleziono dokumentów",
        selectFileCategory: "Wybierz plik i kategorię",
        uploadSuccess: "Dokumentacja medyczna pacjenta została zaktualizowana!",
        uploadFailed: "Nie udało się zaktualizować dokumentacji medycznej",
        uploadError: "Wystąpił błąd podczas przesyłania"
    },

    patientInsurance: {
        title: "HISTORIA UBEZPIECZENIA",
        searchPlaceholder: "Szukaj w historii ubezpieczeń...",
        filter: "Filtruj",
        export: "Eksportuj",
        insurer: "Ubezpieczyciel:",
        policyNumber: "Numer polisy:",
        noInsuranceHistory: "Brak historii ubezpieczenia",
        na: "Brak danych"
    },

    medicalData: {
        fetchingHistory: "Pobieranie historii medycznej...",
        medications: "Leki",
        diagnoses: "Rozpoznania",
        allergies: "Alergie",
        chronicConditions: "Choroby przewlekłe",
        familyHistory: "Wywiad rodzinny",
        riskFactors: "Czynniki ryzyka",
        addMedication: "Dodaj lek",
        addDiagnosis: "Dodaj rozpoznanie",
        addAllergy: "Dodaj alergię",
        addChronicCondition: "Dodaj chorobę przewlekłą",
        addFamilyHistory: "Dodaj wywiad rodzinny",
        addRiskFactor: "Dodaj czynnik ryzyka",
        medicationName: "Nazwa leku",
        medicationNamePlaceholder: "Wpisz nazwę leku",
        genericName: "Nazwa powszechna (Generyczna)",
        genericNamePlaceholder: "Wpisz nazwę generyczną",
        form: "Postać",
        dose: "Dawka",
        dosePlaceholder: "np. 500",
        dosageInstructions: "Instrukcja dawkowania",
        dosageInstructionsPlaceholder: "np. 1 tabletka dwa razy dziennie",
        startDate: "Data rozpoczęcia",
        notes: "Uwagi",
        notesPlaceholder: "Dodaj dodatkowe uwagi...",
        regularMedication: "Lek przyjmowany na stałe (według harmonogramu)",
        diagnosisDescription: "Opis",
        diagnosisCode: "Kod",
        diagnosisCodePlaceholder: "np. F32.1",
        diagnosisType: "Typ rozpoznania",
        primaryDiagnosis: "Rozpoznanie zasadnicze",
        secondaryDiagnosis: "Rozpoznanie współistniejące",
        allergyType: "Typ alergii",
        allergenName: "Nazwa alergenu",
        allergenNamePlaceholder: "Wpisz nazwę alergenu...",
        allergicReaction: "Reakcja alergiczna",
        allergicReactionPlaceholder: "Opisz reakcję alergiczną...",
        severity: "Stopień nasilenia",
        selectSeverity: "Wybierz stopień nasilenia",
        conditionName: "Nazwa choroby",
        conditionNamePlaceholder: "Wpisz nazwę choroby...",
        status: "Status",
        selectStatus: "Wybierz status",
        currentTreatment: "Aktualne leczenie",
        currentTreatmentPlaceholder: "Opisz plan leczenia...",
        diseaseName: "Nazwa jednostki chorobowej",
        diseaseNamePlaceholder: "np. Nadciśnienie tętnicze",
        relationship: "Pokrewieństwo",
        selectRelationship: "Wybierz pokrewieństwo",
        ageOfOnset: "Wiek wystąpienia",
        ageOfOnsetLower: "Wiek wystąpienia",
        ageOfOnsetPlaceholder: "np. 45",
        riskFactor: "Czynnik",
        riskFactorPlaceholder: "np. Palenie tytoniu",
        riskCategory: "Kategoria ryzyka",
        selectCategory: "Wybierz kategorię",
        riskLevel: "Poziom",
        done: "Gotowe",
        cancel: "Anuluj",
        add: "Dodaj",
        saveChanges: "Zapisz zmiany",
        saveSuccess: "{{section}} zaktualizowane pomyślnie!",
        saveError: "Nie udało się zaktualizować {{section}}."
    },
    visitList: {
        visitHistory: "HISTORIA WIZYT",
        totalVisits: "Łączna liczba wizyt: {{count}}",
        fetchingVisitHistory: "Pobieranie historii wizyt...",
        doctor: "Lekarz",
        notes: "Notatki",
        noNotes: "Brak notatek",
        medicalInterview: "Wywiad medyczny",
        mainSymptoms: "Główne objawy",
        currentMedications: "Aktualne leki",
        additionalNotes: "Dodatkowe notatki",
        additionalFindings: "Dodatkowe ustalenia",
        psychiatricScales: "Skale psychiatryczne",
        examination: "Badanie",
        bloodPressure: "Ciśnienie krwi",
        generalCondition: "Stan ogólny",
        heartRate: "Tętno",
        temperature: "Temperatura",
        noData: "Brak danych",
        noVisits: "Nie znaleziono wizyt",
        regular: "regularna",
        scheduled: "zaplanowana",
        completed: "zakończona",
        cancelled: "odwołana",
        inprogress: "w toku",
        searchPlaceholder: "Szukaj wizyt...",
        sortNewest: "Od najnowszych",
        sortOldest: "Od najstarszych",
        filterAll: "Wszystkie",
        filterCompleted: "Zakończone",
        filterScheduled: "Zaplanowane",
        filterCancelled: "Odwołane"
    },
    newPatient: {
        newPatient: "Nowy pacjent",
        enterNewPatientData: "Wprowadź dane nowego pacjenta",
        personalData: "Dane osobowe",
        firstName: "Imię",
        lastName: "Nazwisko",
        pesel: "PESEL",
        dob: "Data urodzenia",
        gender: "Płeć",
        phone: "Telefon",
        middleName: "Drugie imię",
        maidenName: "Nazwisko rodowe",
        alternativePhone: "Telefon alternatywny",
        email: "Email",
        birthPlace: "Miejsce urodzenia",
        documentType: "Typ dokumentu",
        bloodType: "Grupa krwi",
        internalCardNo: "Nr karty wewnętrznej",
        foreigner: "Obcokrajowiec",
        address: "Adres",
        street: "Ulica",
        houseNo: "Nr domu",
        apartmentNo: "Nr mieszkania",
        postalCode: "Kod pocztowy",
        city: "Miasto",
        voivodeship: "Województwo",
        country: "Kraj",
        municipalityTeryt: "Gmina TERYT",
        insurance: "Ubezpieczenie",
        insuranceType: "Typ ubezpieczenia",
        insuranceNo: "Nr ubezpieczenia",
        savePatient: "Zapisz pacjenta",
        fillCompulsoryFields: "Proszę wypełnić wszystkie pola obowiązkowe oznaczone *",
        phoneLengthError: "Numer telefonu musi mieć dokładnie 9 cyfr",
        peselLengthError: "PESEL musi mieć dokładnie 11 cyfr",
        altPhoneLengthError: "Alternatywny numer telefonu musi mieć dokładnie 9 cyfr",
        invalidEmail: "Proszę podać poprawny adres e-mail",
        postalCodeFormatError: "Kod pocztowy musi być w formacie 00-000",
        createSuccess: "Pacjent utworzony pomyślnie!",
        createError: "Nie udało się utworzyć pacjenta",
        selectDate: "Wybierz datę",
        selectGender: "Wybierz płeć",
        selectDocumentType: "Wybierz typ dokumentu",
        selectBloodType: "Wybierz grupę krwi",
        select: "Wybierz",
        male: "Mężczyzna",
        female: "Kobieta",
        other: "Inna",
        nfz: "NFZ",
        private: "Prywatne",
        none: "Brak",
        residenceCard: "Karta pobytu",
        idCard: "Dowód osobisty",
        ehic: "EKUZ",
        euEogId: "Dowód osobisty UE/EOG",
        foreignLicense: "Zagraniczne prawo jazdy",
        noneInfant: "Brak (Niemowlę)",
        noneNn: "Brak (NN)",
        noneNw: "Brak (NW - Dziecko poniżej 6 miesięcy)",
        yes: "Tak",
        no: "Nie",
        poland: "Polska",
        germany: "Niemcy",
        unitedKingdom: "Wielka Brytania",
        france: "Francja",
        firstNamePlaceholder: "Wpisz imię",
        lastNamePlaceholder: "Wpisz nazwisko",
        peselPlaceholder: "Wpisz numer PESEL",
        phonePlaceholder: "Wpisz numer telefonu",
        middleNamePlaceholder: "Wpisz drugie imię",
        maidenNamePlaceholder: "Wpisz nazwisko rodowe",
        altPhonePlaceholder: "Wpisz telefon alternatywny",
        emailPlaceholder: "Wpisz adres e-mail",
        birthPlacePlaceholder: "Wpisz miejsce urodzenia",
        internalCardNoPlaceholder: "Wpisz nr karty wewnętrznej",
        streetPlaceholder: "Wpisz nazwę ulicy",
        houseNoPlaceholder: "Wpisz numer domu",
        apartmentNoPlaceholder: "Wpisz numer mieszkania",
        postalCodePlaceholder: "Wpisz kod pocztowy",
        cityPlaceholder: "Wpisz nazwę miejscowości",
        municipalityTerytPlaceholder: "Wpisz gminę TERYT",
        insuranceNoPlaceholder: "Wpisz numer ubezpieczenia",
        selectInsuranceType: "Wybierz typ ubezpieczenia",
        confirm: "Potwierdź"
    },
    patientList: {
        patientList: "Lista pacjentów",
        manageRecords: "Zarządzaj kartotekami pacjentów",
        patient: "PACJENT",
        pesel: "PESEL",
        dob: "DATA URODZENIA",
        referral: "SKIEROWANIE",
        status: "STATUS",
        actions: "AKCJE",
        export: "Eksportuj",
        print: "Drukuj",
        filters: "Filtry",
        dateOfBirth: "Data urodzenia",
        gender: "Płeć",
        selectDate: "Wybierz datę",
        hasPesel: "Ma PESEL",
        hasDeclaration: "Ma deklarację",
        deceased: "Zmarły",
        hasDebt: "Ma zadłużenie",
        active: "Aktywny",
        inactive: "Nieaktywny",
        longAbsent: "Długo nieobecny",
        clearFilters: "Wyczyść filtry",
        applyFilters: "Zastosuj filtry",
        loadingPatients: "Ładowanie pacjentów...",
        itemsRange: "{{start}}-{{end}} z {{total}} elementów",
        itemsPerPage: "{{count}} / stronę",
        deletePatientTitle: "Usuń pacjenta",
        deletePatientConfirm: "Czy na pewno chcesz usunąć pacjenta {{name}}?",
        deleteSuccess: "Pacjent i wszystkie powiązane dane zostały usunięte pomyślnie",
        deleteError: "Nie udało się usunąć pacjenta",
        deleteErrorGeneral: "Wystąpił błąd podczas usuwania pacjenta",
        cancel: "Anuluj",
        delete: "Usuń",
        all: "Wszyscy",
        selectGender: "Wybierz płeć",
        male: "Mężczyzna",
        female: "Kobieta",
        other: "Inna",
        idLabel: "ID:",
        done: "Gotowe",
        exportNoData: "Brak pacjentów do eksportu",
        exportError: "Nie udało się wyeksportować listy pacjentów"
    },

    patientLogs: {
        title: "Dziennik Aktywności Pacjenta",
        searchPlaceholder: "Szukaj w logach...",
        allCategories: "Wszystkie kategorie",
        medical: "Medyczne",
        other: "Inne",
        personal: "Osobiste",
        system: "Systemowe",
        activityType: "TYP AKTYWNOŚCI",
        performedBy: "WYKONANE PRZEZ",
        dateTime: "DATA I GODZINA",
        summary: "PODSUMOWANIE",
        loadingLogs: "Pobieranie logów...",
        noLogsFound: "Nie znaleziono logów",
        showingLogs: "Pokazuje {{count}} z {{total}} logów",
        na: "Brak danych",
        patientActivityLogs: "Dziennik aktywności pacjenta",
        searchLogs: "Szukaj w logach",
        viewedMedicalInformation: "Przeglądano informacje medyczne",
        updatedMedicalData: "Zaktualizowano dane medyczne",
        updated: "Zaktualizowano {{field}}",
        activityTypes: {
            medical_data_updated: "Zaktualizowano dane medyczne",
            medical_record_accessed: "Uzyskano dostęp do dokumentacji",
            profile_viewed: "Wyświetlono profil",
            patient_record_updated: "Zaktualizowano kartotekę pacjenta",
            personal_data_updated: "Zaktualizowano dane osobowe",
            visit_scheduled: "Zaplanowano wizytę"
        }
    },

    personalData: {
        fetchingDetails: "Pobieranie szczegółów profilu...",
        basicInformation: "Informacje podstawowe",
        moreInformation: "Więcej informacji",
        address: "Adres",
        insurance: "Ubezpieczenie",
        employer: "Pracodawca",
        authorizedPersons: "Osoby upoważnione",
        consentProcessing: "Zgody i przetwarzanie",
        firstName: "Imię",
        lastName: "Nazwisko",
        middleName: "Drugie imię",
        maidenName: "Nazwisko rodowe",
        pesel: "PESEL",
        dob: "Data urodzenia",
        gender: "Płeć",
        phone: "Numer telefonu",
        altPhone: "Telefon alternatywny",
        email: "E-mail",
        birthPlace: "Miejsce urodzenia",
        bloodType: "Grupa krwi",
        internalCardNumber: "Wewnętrzny numer karty",
        documentType: "Typ dokumentu",
        foreignerStatus: "Status obcokrajowca",
        city: "Miejscowość",
        street: "Ulica",
        house: "Numer domu",
        apartment: "Numer lokalu",
        postalCode: "Kod pocztowy",
        voivodeship: "Województwo",
        country: "Kraj",
        municipalityTeryt: "Kod TERYT gminy",
        nfzBranch: "Oddział NFZ",
        additionalRights: "Dodatkowe uprawnienia",
        employerName: "Nazwa pracodawcy",
        employerNip: "NIP pracodawcy",
        occupation: "Zawód",
        symbol: "Symbol produkcji",
        relationship: "Pokrewieństwo",
        docType: "Typ dokumentu",
        docNumber: "Numer dokumentu",
        validUntil: "Ważny do",
        addNewInsurer: "Dodaj nowego ubezpieczyciela",
        insurerName: "Nazwa ubezpieczyciela",
        policyNumber: "Numer polisy",
        addAuthorizedPerson: "Dodaj osobę upoważnioną",
        editAuthorizedPerson: "Edytuj osobę upoważnioną",
        noAuthorizationStatement: "Oświadczenie o braku upoważnienia",
        consentConfirmation: "Potwierdzenie zgody",
        saveChanges: "Zapisz zmiany",
        add: "Dodaj",
        save: "Zapisz",
        cancel: "Anuluj",
        edit: "Edytuj",
        remove: "Usuń",
        selectFile: "Wybierz plik",
        grantConsent: "Udziel zgody",
        withdraw: "Wycofaj",
        granted: "Udzielona",
        noConsent: "Brak zgody",
        notAuthorizeAnyone: "Pacjent nie upoważnia nikogo:",
        signedCurrentAuthorization: "Pacjent podpisał aktualną wersję upoważnienia:",
        consentRequirementNotice: "Zgodnie z polskim prawem zgoda pacjenta wymaga fizycznego podpisanego dokumentu. Proszę przesłać skan podpisanego formularza zgody.",
        uploadConsentTitle: "Prześlij dokument zgody",
        uploadConsentDesc: "Proszę przesłać skan podpisanego formularza zgody przed udzieleniem zgody.",
        acceptedFileTypes: "Akceptowane typy plików: PDF, JPG, PNG. Maksymalny rozmiar: 5MB.",
        uploadAndGrant: "Prześlij i udziel zgody",
        uploading: "Przesyłanie...",
        dateNotAvailable: "(Data niedostępna)",
        noInsurers: "Nie dodano prywatnych ubezpieczycieli",
        noAuthPersons: "Nie dodano osób upoważnionych",
        unnamedAuthPerson: "Osoba bez nazwy",
        authPersonRequiredFields: "Imię, nazwisko i pokrewieństwo są wymagane.",
        authPersonPhoneRequired: "Numer telefonu jest wymagany.",
        authPersonDocumentRequired: "Typ dokumentu i numer dokumentu są wymagane.",
        searchInsurer: "Szukaj (Ubezpieczyciel)",
        insurerPolicy: "Polisa: {{policy}}",
        insurerStart: "Data rozpoczęcia: {{date}}",
        insurerValid: "Ważna do: {{date}}",
        disclaimerSave: "Pamiętaj, aby po dodaniu lub usunięciu ubezpieczyciela kliknąć przycisk Prześlij, aby zapisać zmiany",
        submit: "Zapisz",
        startDate: "Data rozpoczęcia",
        selectDate: "Wybierz datę",
        placeholderFirstName: "Wpisz imię",
        placeholderLastName: "Wpisz nazwisko",
        placeholderPesel: "Wpisz PESEL",
        placeholderSelectGender: "Wybierz płeć",
        placeholderMiddleName: "Wpisz drugie imię",
        placeholderMaidenName: "Wpisz nazwisko rodowe",
        placeholderBirthPlace: "Wpisz miejsce urodzenia",
        placeholderBloodType: "A+, O-, itp.",
        placeholderNumber: "Nr",
        placeholderCity: "Wpisz miejscowość",
        placeholderStreet: "Wpisz ulicę",
        placeholderPostalCode: "Wpisz kod",
        placeholderSelectVoivodeship: "Wybierz województwo",
        placeholderSelectCountry: "Wybierz kraj",
        placeholderSelectBranch: "Wybierz oddział",
        placeholderSelectRights: "Wybierz uprawnienia",
        insuredInNfz: "Ubezpieczony w NFZ:",
        fileSelectError: "Nie udało się wybrać pliku.",
        consentUploadError: "Nie udało się przesłać dokumentu zgody. Spróbuj ponownie.",
        consentPersonalDataTitle: "Przetwarzanie danych osobowych",
        consentPersonalDataDescription: "Wyrażam zgodę na przetwarzanie moich danych osobowych w celu świadczenia usług medycznych zgodnie z RODO.",
        consentMedicalDocsTitle: "Dostęp do dokumentacji medycznej",
        consentMedicalDocsDescription: "Wyrażam zgodę na udostępnianie mojej dokumentacji medycznej osobom upoważnionym oraz innym placówkom medycznym w celu kontynuacji leczenia.",
        consentElectronicCommTitle: "Komunikacja elektroniczna",
        consentElectronicCommDescription: "Wyrażam zgodę na otrzymywanie informacji medycznych i organizacyjnych drogą elektroniczną (e-mail, SMS).",
        saveSuccess: "Informacje o {{section}} zostały zaktualizowane!",
        saveError: "Nie udało się zaktualizować informacji o {{section}}.",
        consentUploadSuccess: "Dokument zgody został przesłany i zgoda została udzielona pomyślnie!",
        consentWithdrawSuccess: "Zgoda została pomyślnie wycofana.",
        privateInsurers: "Prywatni ubezpieczyciele",
        active: "Aktywny od",
        addInsurer: "Dodaj ubezpieczyciela",
        na: "Brak"
    },

    medicalData: {
        medicines: "Leki",
        regularMedications: "Stale przyjmowane leki",
        addMedication: "Dodaj lek",
        noRegularMedications: "Brak stale przyjmowanych leków",
        asNeededMedications: "Leki przyjmowane doraźnie",
        noAsNeededMedications: "Brak leków przyjmowanych doraźnie",
        medicationHistory: "Historia leczenia",
        noMedicationHistory: "Brak historii leczenia",
        saving: "Zapisywanie...",
        save: "Zapisz",
        add: "Dodaj",
        diagnosis: "Rozpoznania",
        activeDiagnoses: "Aktywne rozpoznania",
        addDiagnosis: "Dodaj rozpoznanie",
        noActiveDiagnoses: "Brak aktywnych rozpoznań",
        diagnosisHistory: "Historia rozpoznań",
        noDiagnosisHistory: "Brak historycznych rozpoznań",
        allergiesAndIntolerances: "Alergie i nietolerancje",
        addAllergy: "Dodaj alergię",
        noRegisteredAllergies: "Brak zarejestrowanych alergii",
        pastAllergies: "Alergie w przeszłości",
        noAllergyHistory: "Brak historii alergii",
        chronicDiseases: "Choroby przewlekłe",
        chronicConditions: "Schorzenia przewlekłe",
        addCondition: "Dodaj schorzenie",
        noChronicConditions: "Brak zarejestrowanych chorób przewlekłych",
        chronicDiseaseHistory: "Historia chorób przewlekłych",
        noChronicConditionHistory: "Brak historycznych wpisów o chorobach przewlekłych",
        familyInterview: "Wywiad rodzinny",
        familyHistory: "Historia rodzinna",
        addEntry: "Dodaj wpis",
        noFamilyHistoryEntries: "Brak wpisów o historii rodzinnej",
        pastFamilyHistory: "Przeszła historia rodzinna",
        noHistoricalEntries: "Brak historycznych wpisów",
        riskFactors: "Czynniki ryzyka",
        addRiskFactor: "Dodaj czynnik ryzyka",
        noRiskFactorsRecorded: "Brak zarejestrowanych czynników ryzyka",
        riskFactorHistory: "Historia czynników ryzyka",
        noRiskHistory: "Brak historycznych wpisów o czynnikach ryzyka",
        medicationName: "Nazwa leku",
        commonName: "Nazwa powszechna",
        form: "Postać",
        dose: "Dawka",
        dosageInstructions: "Dawkowanie",
        startDate: "Data rozpoczęcia",
        notes: "Uwagi",
        notesPlaceholder: "Dodaj wszelkie istotne uwagi...",
        regularMedication: "To jest lek przyjmowany regularnie",
        cancel: "Anuluj",
        description: "Opis",
        code: "Kod",
        diagnosisType: "Typ rozpoznania",
        primaryDiagnosis: "Rozpoznanie główne",
        secondaryDiagnosis: "Rozpoznanie współistniejące",
        diagnosisNotesPlaceholder: "Opisz rozpoznanie szczegółowo...",
        allergyType: "Typ alergii",
        allergenName: "Nazwa alergenu",
        allergicReaction: "Reakcja alergiczna",
        severity: "Stopień ciężkości",
        conditionName: "Nazwa schorzenia",
        status: "Status",
        currentTreatment: "Aktualne leczenie",
        diseaseName: "Nazwa choroby",
        relationship: "Pokrewieństwo",
        ageOfOnset: "Wiek zachorowania",
        ageOfOnsetLower: "Wiek wystąpienia",
        riskCategory: "Kategoria ryzyka",
        riskFactor: "Czynnik ryzyka",
        riskLevel: "Poziom ryzyka",
        dosage: "Dawkowanie",
        from: "Od",
        diagnosed: "Zdiagnozowano",
        reaction: "Reakcja",
        treatment: "Leczenie",
        category: "Kategoria",
        saveSuccess: "Informacje o {{section}} zostały pomyślnie zaktualizowane!",
        saveError: "Nie udało się zaktualizować informacji o {{section}}.",
        fetchingHistory: "Pobieranie historii medycznej...",
        active: "Aktywny",
        end: "Zakończ",
        done: "Gotowe",
        placeholderMedName: "np. Paracetamol",
        placeholderGenericName: "Wprowadź nazwę generyczną",
        placeholderForm: "Tabletka",
        placeholderDose: "np. 500",
        placeholderInstructions: "np. 1 tabletka dwa razy dziennie",
        placeholderSelectDate: "Wybierz datę",
        placeholderDiagnosisCode: "np. F32.1",
        placeholderSelectType: "Wybierz typ",
        placeholderAllergenName: "Wprowadź nazwę alergenu...",
        placeholderAllergicReaction: "Opisz reakcję alergiczną...",
        placeholderSelectSeverity: "Wybierz stopień ciężkości",
        placeholderConditionName: "Wprowadź nazwę schorzenia...",
        placeholderSelectStatus: "Wybierz status",
        placeholderTreatmentPlan: "Opisz plan leczenia...",
        placeholderDiseaseName: "np. Depresja",
        placeholderSelectRelationship: "Wybierz pokrewieństwo",
        placeholderAgeOfOnset: "np. 45 lat",
        placeholderSelectCategory: "Wybierz kategorię",
        placeholderEnterRiskFactor: "Wprowadź lub wybierz czynnik ryzyka...",

        options: {
            medicationForms: {
                Tablet: "Tabletka",
                Capsule: "Kapsułka",
                Liquid: "Płyn",
                Injection: "Zastrzyk",
                Inhaler: "Inhalator",
                Patch: "Plaster",
                Cream: "Krem",
                Other: "Inne"
            },
            severityLevels: {
                Low: "Niski",
                Mild: "Łagodny",
                Moderate: "Umiarkowany",
                Severe: "Ciężki",
                High: "Wysoki"
            },
            conditionStatuses: {
                Active: "Aktywny",
                Remission: "Remisja",
                Resolved: "Wyleczony"
            },
            relationships: {
                Mother: "Matka",
                Father: "Ojciec",
                Sister: "Siostra",
                Brother: "Brat",
                "Grandmother (maternal)": "Babcia (ze strony matki)",
                "Grandmother (paternal)": "Babcia (ze strony ojca)",
                "Grandfather (maternal)": "Dziadek (ze strony matki)",
                "Grandfather (paternal)": "Dziadek (ze strony ojca)",
                "Aunt (maternal)": "Ciocia (ze strony matki)",
                "Aunt (paternal)": "Ciocia (ze strony ojca)",
                "Uncle (maternal)": "Wujek (ze strony matki)",
                "Uncle (paternal)": "Wujek (ze strony ojca)"
            },
            riskCategories: {
                Lifestyle: "Styl życia",
                Genetic: "Genetyczne",
                "Medical History": "Historia medyczna",
                Environmental: "Środowiskowe"
            },
            allergyTypes: {
                Drug: "Lekowa",
                Food: "Pokarmowa",
                Environment: "Środowiskowa",
                Other: "Inna"
            },
            diagnosisTypes: {
                Primary: "Główne",
                Secondary: "Współistniejące"
            }
        }
    },

    patientLaboratory: {
        title: "WYNIKI BADAŃ",
        fetchingRecords: "Pobieranie wyników badań...",
        searchPlaceholder: "Szukaj wyników badań...",
        addResults: "Dodaj wyniki",
        addLabResults: "Dodaj wyniki badań",
        basicInformation: "Informacje podstawowe",
        testName: "Nazwa badania",
        testNamePlaceholder: "np. Morfologia krwi, Profil lipidowy",
        orderDate: "Data zlecenia",
        selectDate: "Wybierz datę",
        done: "Gotowe",
        labReferenceNumber: "Numer referencyjny laboratorium",
        labRefPlaceholder: "np. LAB/2024/001",
        testParameters: "Parametry badania",
        addParameter: "Dodaj parametr",
        parameterName: "Nazwa parametru",
        normalRange: "Zakres normy",
        normalRangePlaceholder: "np. 4.0-10.0, <200, >40",
        unit: "Jednostka",
        unitPlaceholder: "np. g/dL, 10^3/\u03bcL",
        value: "Wartość",
        cancel: "Anuluj",
        addResult: "Dodaj wynik",
        noParametersAdded: "Brak dodanych parametrów. Kliknij 'Dodaj parametr', aby rozpocząć.",
        laboratoryTest: "Badanie laboratoryjne",
        orderNumber: "Numer zlecenia:",
        normalRangeLabel: "Zakres normy:",
        noParametersRecorded: "Brak zarejestrowanych parametrów dla tego badania.",
        noSearchMatch: "Żadne wyniki badań nie pasują do wyszukiwania",
        noLabResults: "Nie znaleziono wyników badań",
        enterTestNameRef: "Wprowadź nazwę badania i numer referencyjny",
        addSuccess: "Wynik badania laboratoryjnego został dodany pomyślnie",
        addFailed: "Nie udało się zaktualizować wyników laboratoryjnych"
    },

    spotlight: {
        title: 'Wyróżnione',
        subtitle: 'Bezpiecznie udostępniaj zanonimizowane dane pacjentów do badań klinicznych',
        newSubmission: 'Nowe zgłoszenie',
        mySubmission: 'Moje zgłoszenia',
        patientSelection: 'Wybór pacjenta',
        searchPatient: 'Wyszukaj pacjenta',
        myRequests: 'Moje zgłoszenia w Wyróżnionych',
        status: {
            pending: 'Oczekujące',
            accepted: 'Zaakceptowane'
        },
        patientId: 'ID pacjenta',
        submissionDate: 'Data zgłoszenia',
        view: 'Podgląd',
        includeInStudy: 'Włącz do badania',
        clinicalCenter: 'Centrum Badań Klinicznych',
        migraineStudy: 'Badanie skuteczności nowej terapii w leczeniu migreny'
    },
    patientSearch: {
        title: 'Wyszukiwanie Pacjentów',
        subtitle: 'Wyszukaj pacjentów po nazwisku, numerze PESEL lub numerze karty',
        description: 'Wyszukaj pacjentów po nazwisku, numerze PESEL lub numerze karty',
        filtersLabel: 'Filtry',
        placeholders: {
            search: 'Nazwisko, PESEL lub numer karty...',
        },
        enterCriteria: 'Wprowadź kryteria wyszukiwania aby zobaczyć wyniki',
        filters: {
            dob: 'Data urodzenia',
            gender: {
                label: 'Płeć',
                all: 'Wszystkie',
                male: 'Mężczyzna',
                female: 'Kobieta',
                other: 'Inna'
            },
            lastVisit: 'Ostatnia wizyta',
            nextVisit: 'Następna wizyta',
            hasPesel: 'Posiada PESEL',
            hasDeclaration: 'Posiada deklarację',
            isDeceased: 'Zmarły',
            hasDebt: 'Zadłużony',
            isActive: 'Aktywny',
            isLongAbsent: 'Dłużej nieobecni',
            placeholders: {
                gender: 'Wybierz płeć',
                dob: 'dd/mm/rrrr'
            }
        },
        buttons: {
            clearFilters: 'Wyczyść filtry',
            applyFilters: 'Zastosuj filtry'
        }
    },
    appointments: {
        title: 'Zaplanowane Wizyty',
        description: 'Zarządzaj harmonogramem wizyt',
        actions: {
            back: 'Powrót',
            filters: 'Filtry',
            newVisit: 'Nowa wizyta',
            clearFilters: 'Wyczyść filtry',
            applyFilters: 'Zastosuj filtry'
        },
        search: {
            doctor: 'Wyszukaj lekarza...',
            patient: 'Wyszukaj pacjenta...'
        },
        filters: {
            visitDate: 'Data wizyty',
            visitTime: 'Godzina wizyty',
            visitType: {
                label: 'Rodzaj wizyty',
                all: 'Wszystkie',
                nfz: 'NFZ',
                private: 'Prywatna'
            },
            status: {
                label: 'Status',
                all: 'Wszystkie',
                scheduled: 'Zaplanowana',
                confirmed: 'Potwierdzona',
                inProgress: 'W trakcie',
                completed: 'Zakończona',
                cancelled: 'Anulowana'
            },
            appointmentType: {
                label: 'Typ wizyty',
                all: 'Wszystkie',
                psychiatric: 'Psychiatryczna',
                psychotherapy: 'Psychoterapeutyczna',
                consultation: "Konsultacja",
                other: "Inna"
            },
            hasReferral: 'Posiada skierowanie'
        },
        calendar: {
            day: 'Dzień',
            week: 'Tydzień',
            month: 'Miesiąc',
            mon: 'Pon',
            tue: 'Wt',
            wed: 'Śr',
            thu: 'Czw',
            fri: 'Pt',
            sat: 'Sob',
            sun: 'Ndz'
        },
        more: '+ {{count}} więcej',
        visitCreated: 'Wizyta utworzona pomyślnie'
    },
    referrals: {
        title: 'Skierowania',
        newReferral: 'Nowe Skierowanie',
        incoming: 'Skierowania Przychodzące',
        outgoing: 'Skierowania Wychodzące',
        emptyIncoming: 'Brak skierowań przychodzących',
        emptyOutgoing: 'Brak skierowań wychodzących',
        table: {
            patient: 'PACJENT',
            referredBy: 'SKIEROWANY PRZEZ',
            referredTo: 'SKIEROWANY DO',
            reason: 'POWÓD SKIEROWANIA',
            status: 'STATUS',
            date: 'DATA',
            actions: 'AKCJE'
        },
        modal: {
            title: 'Nowe Skierowanie',
            doctor: 'Lekarz',
            nurse: 'Pielęgniarka',
            patient: 'Pacjent',
            referredTo: 'Skierowany do',
            specialization: 'Specjalizacja',
            reason: 'Powód skierowania',
            notes: 'Uwagi',
            placeholders: {
                patient: 'Wybierz pacjenta',
                provider: 'Wybierz pracownika',
                specialization: 'Wpisz specjalizację',
                reason: 'Wpisz powód',
                notes: 'Wpisz dodatkowe uwagi'
            }
        },
        details: {
            title: 'Szczegóły Skierowania',
            patient: 'Pacjent',
            status: 'Status',
            referredTo: 'Skierowany do',
            referredBy: 'Skierowany przez',
            provider: 'specjalista',
            date: 'Data',
            specialization: 'Specjalizacja',
            reason: 'Powód skierowania',
            notes: 'Uwagi',
            noNotes: 'Brak uwag',
            created: 'Utworzono',
            lastUpdated: 'Ostatnia aktualizacja'
        },
        messages: {
            success: 'Skierowanie utworzone pomyślnie',
            error: 'Nie udało się utworzyć skierowania',
            requiredFields: 'Proszę wypełnić wszystkie wymagane pola'
        }
    },

    module: {
        module_select: "Wybierz moduł, aby rozpocząć pracę",
        psyModule: "Moduł psychiatryczny",
        "psychiatry": "Psychiatria",
        "comprehensive_tool": "Kompleksowe narzędzie do dokumentacji psychiatrycznej, wspierane sztuczną inteligencją.",
        "intelligent_psychiatric_scales": "Inteligentne skale psychiatryczne",
        "emotion_and_behavior_analysis": "Analiza emocji i zachowań",
        "ai_diagnose": "Asystent diagnostyczny AI",
        "coming_soon": "Wkrótce",
        "primary_care": "POZ",

        system_description: "Kompleksowy system do zarządzania praktyką lekarza POZ, z integracją e-recepty i e-skierowania.",
        p1_integration: "Integracja z P1",
        declaration_management: "Zarządzanie deklaracjami",
        nfz_settlements: "Rozliczenia z NFZ"


    },

    login: {
        "welcome_back": "Witaj ponownie",
        "email_placeholder": "Email",
        "password_placeholder": "Hasło",
        "email_required": "Proszę wprowadzić email!",
        "email_invalid": "Proszę wprowadzić prawidłowy email!",
        "password_required": "Proszę wprowadzić hasło!",
        "login_button": "Zaloguj się",
        "or": "lub",
        "continue_with_google": "Kontynuuj z Google",
        "forgot_password": "Zapomniałeś hasła?",
        "no_account": "Nie masz konta?",
        "sign_up": "Zarejestruj się",
        "login_success": "Logowanie udane!",
        "signing_in": "Logowanie...",
        "play_services_error": "Usługi Play są niedostępne lub nieaktualne",
        "google_signin_error": "Błąd logowania przez Google",
        "google_signin_success": "Logowanie przez Google udane",
        "google_login_failed": "Nie udało się rozpocząć logowania przez Google"
    },

    "signup": {
        "create_account": "Utwórz konto",
        "name_placeholder": "Imię i nazwisko",
        "email_placeholder": "Email",
        "password_placeholder": "Hasło",
        "name_required": "Proszę wprowadzić imię!",
        "name_min_length": "Imię musi mieć co najmniej 2 znaki",
        "email_required": "Proszę wprowadzić email!",
        "email_invalid": "Proszę wprowadzić prawidłowy email!",
        "password_required": "Proszę wprowadzić hasło!",
        "password_min_length": "Hasło musi mieć co najmniej 6 znaków",
        "signup_button": "Zarejestruj się",
        "or": "lub",
        "continue_with_google": "Kontynuuj z Google",
        "have_account": "Masz już konto?",
        "sign_in": "Zaloguj się",
        "registration_success": "Użytkownik zarejestrowany pomyślnie! Zweryfikuj swój adres e-mail, aby się zalogować",
        "signing_up": "Rejestrowanie...",
        "google_signup_success": "Rejestracja przez Google udana!",
        "google_signup_failed": "Nie udało się rozpocząć rejestracji przez Google",
        "restriction_text": "Rejestracja jest ograniczona tylko do autoryzowanych adresów e-mail."
    },


    forgot_password: {
        "title": "Zapomniałem hasło",
        "reset_instructions": "Wprowadź swój email, a wyślemy Ci instrukcje resetowania hasła",
        "email_placeholder": "Email",
        "email_required": "Proszę wprowadzić email!",
        "email_invalid": "Proszę wprowadzić prawidłowy email!",
        "send_button": "Wyślij",
        "back_to_login": "Powrót do logowania",
        "otp_success": "Kod OTP został wysłany na Twój email"

    },
    "otp": {
        "verify_email_title": "Zweryfikuj swój email",
        "reset_password_title": "Zresetuj swoje hasło",
        "verification_sent": "Wysłaliśmy kod weryfikacyjny na Twój email",
        "code_required": "Proszę wprowadzić kod weryfikacyjny!",
        "enter_all_digits": "Proszę wprowadzić wszystkie 6 cyfr!",
        "verify_button": "Zweryfikuj",
        "didnt_receive_code": "Nie otrzymałeś kodu?",
        "resend_otp": "Wyślij ponownie",
        "resend_countdown": "Wyślij ponownie za {{seconds}}s",
        "back_to_login": "Powrót do logowania",
        "otp_verified": "Kod OTP zweryfikowany",
        "new_otp_sent": "Nowy kod OTP został wysłany pomyślnie"
    },

    "reset_password": {
        "title": "Zresetuj nowe hasło",
      "subtitle": "Wprowadź nowe hasło",
      "new_password_placeholder": "Nowe hasło",
      "confirm_password_placeholder": "Potwierdź hasło",
      "password_required": "Proszę wprowadzić hasło!",
      "password_min_length": "Hasło musi mieć co najmniej 6 znaków",
      "confirm_password_required": "Proszę potwierdzić hasło!",
      "passwords_not_match": "Hasła nie są takie same!",
      "reset_button": "Zresetuj hasło",
      "back_to_login": "Powrót do logowania",
      "reset_success": "Hasło zostało pomyślnie zresetowane."

    },
    "patient_profile": {
        "title": "Profil pacjenta",
        "subtitle": "Zarządzaj danymi pacjenta i dokumentacją medyczną",
        "back_button": "Powrót"
    },

    "patient_header": {
        "pesel_label": "PESEL",
        "age_label": "Wiek",
        "age_years": "lat",
        "ewus_button": "eWUŚ",
        "cez_button": "CEZ",
        "documents_button": "Dokumenty",
        "visits_button": "Wizyty"
    },

    "patient_tabs": {
        "personal_data": "Dane osobowe",
        "medical_data": "Dane medyczne",
        "laboratory": "Laboratorium",
        "documents": "Dokumenty",
        "visits_list": "Lista wizyt",
        "insurance": "Ubezpieczenie",
        "history": "Historia zwolnień/SMS",
        "logs": "Dziennik pacjenta",
        "audit_trail": "Ścieżka audytu"
    },

    "basic_info": {
        "save_error": "Nie udało się zapisać danych",
        "title": "DANE PODSTAWOWE",

        "loading": "Ładowanie...",
        "error_prefix": "Błąd: ",

        "fields": {
            "pesel": "PESEL",
            "first_name": "Imię",
            "last_name": "Nazwisko",
            "date_of_birth": "Data urodzenia",
            "middle_name": "Drugie imię",
            "maiden_name": "Nazwisko panieńskie",
            "birth_place": "Miejsce urodzenia",
            "gender": "Płeć",
            "email": "Email",
            "phone": "Telefon"
        },
        "sections": {
            "basic_data": "Dane podstawowe",
            "optional_data": "Dane opcjonalne",
            "contact_data": "Dane kontaktowe"
        },
        "gender_options": {
            "unknown": "Nieznana",
            "male": "Mężczyzna",
            "female": "Kobieta",
            "other": "Inna"
        },
        "submit_button": "Zatwierdź"
    },


    "address_form": {
        "title": "ADRES",
        "checkboxes": {
            "same_address": "Adres zameldowania taki sam jak adres zamieszkania",
            "unknown_address": "Adres nieznany"
        },
        "sections": {
            "residential_address": "Adres zamieszkania"
        },
        "fields": {
            "street": "Ulica",
            "house_number": "Numer domu",
            "apartment_number": "Numer mieszkania",
            "postal_code": "Kod pocztowy",
            "city": "Miasto",
            "voivodeship": "Województwo",
            "country": "Kraj",
            "teryt_code": "Kod TERYT gminy"
        },
        "voivodeships": {
            "select": "Wybierz województwo",
            "dolnoslaskie": "Dolnośląskie",
            "kujawsko_pomorskie": "Kujawsko-Pomorskie",
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
            "warminsko_mazurskie": "Warmińsko-Mazurskie",
            "wielkopolskie": "Wielkopolskie",
            "zachodniopomorskie": "Zachodniopomorskie"
        },
        "countries": {
            "poland": "Polska",
            "germany": "Niemcy",
            "uk": "Wielka Brytania",
            "france": "Francja"
        },
        "submit": "Zatwierdź"
    },


    "insurance_form": {
        "title": "Ubezpieczenie",
        "nfz": {
            "title": "Ubezpieczony w NFZ:",
            "branch": "Oddział",
            "additional_rights": "Dodatkowe prawa",
            "branches": {
                "warsaw": "07 NFZ Warszawa",
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
                "children": "DN - Dzieci i młodzież do 18 lat",
                "war_invalids": "IB - Inwalidzi wojenni",
                "military_invalids": "IW - Inwalidzi wojskowi",
                "forced_labor": "PO - Pracownicy przymusowi",
                "veterans": "WP - Ranni weterani",
                "blood_donors": "ZK - Honorowi dawcy krwi"
            }
        },
        "private": {
            "title": "Prywatni ubezpieczyciele",
            "search_placeholder": "Szukaj (Ubezpieczyciel)",
            "policy": "Polisa",
            "valid_until": "Ważna do",
            "no_insurers": "Brak dodanych prywatnych ubezpieczycieli",
            "new_insurer": "Nowy ubezpieczyciel",
            "add_insurer": "Dodaj ubezpieczyciela"
        },
        "submit": "Zatwierdź"
    },



    "employer_form": {
        "title": "Pracodawca",
        "sections": {
            "employer": "Pracodawca",
            "address": "Adres"
        },
        "fields": {
            "employer_name": "Nazwa pracodawcy",
            "employer_nip": "NIP pracodawcy",
            "occupation": "Zawód",
            "production_symbol": "Symbol grupy produkcyjnej i usługowej",
            "fill_from_nip": "UZUPEŁNIJ POLA Z NIP",
            "street": "Ulica",
            "house_number": "Numer domu",
            "apartment_number": "Numer mieszkania",
            "postal_code": "Kod pocztowy",
            "city": "Miasto",
            "voivodeship": "Województwo",
            "country": "Kraj"
        },
        "voivodeships": {
            "select": "---------",
            "dolnoslaskie": "Dolnośląskie",
            "kujawsko_pomorskie": "Kujawsko-Pomorskie",
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
            "warminsko_mazurskie": "Warmińsko-Mazurskie",
            "wielkopolskie": "Wielkopolskie",
            "zachodniopomorskie": "Zachodniopomorskie"
        },
        "countries": {
            "poland": "Polska",
            "germany": "Niemcy",
            "uk": "Wielka Brytania",
            "france": "Francja"
        },
        "submit": "Zatwierdź"
    },



    "authorized_persons": {
        "title": "OSOBY UPOWAŻNIONE I LISTA UDOSTĘPNIONEJ DOKUMENTACJI MEDYCZNEJ",
        "toggles": {
            "no_authorized_persons": "Pacjent nie upoważnia nikogo",
            "current_version_signed": "Pacjent podpisał aktualną wersję upoważnienia"
        },
        "buttons": {
            "no_authorization_statement": "BRAK UPOWAŻNIENIA - OŚWIADCZENIE",
            "add_authorized_person": "DODAJ OSOBĘ UPOWAŻNIONĄ"
        },
        "messages": {
            "no_authorized_persons": "Nie dodano osób upoważnionych",
            "no_documentation_records": "Brak zapisanych potwierdzeń..."
        },
        "sections": {
            "documentation_access": "Lista dostępu do dokumentacji medycznej"
        },
        "submit": "Zatwierdź"
    },


    "authorized_person_card": {
        "fields": {
            "first_name": "Imię",
            "last_name": "Nazwisko",
            "relationship": "Stopień pokrewieństwa",
            "pesel": "PESEL",
            "phone": "Telefon",
            "email": "Email",
            "address": "Adres",
            "document_type": "Typ dokumentu",
            "document_number": "Numer dokumentu",
            "valid_until": "Ważny do"
        },
        "document_types": {
            "select": "Wybierz typ",
            "id_card": "Dowód osobisty",
            "passport": "Paszport",
            "drivers_license": "Prawo jazdy"
        },
        "buttons": {
            "remove_person": "Usuń osobę upoważnioną"
        }

    }

    ,

    // consent_form: {
    //   title: "ZGODA NA PRZETWARZANIE DANYCH OSOBOWYCH",
    //   "submit": "Zatwierdź"
    // },


    "insuranceHistory": {
        title: "HISTORIA UBEZPIECZENIA",
        "searchPlaceholder": "Szukaj w historii ubezpieczenia...",
        "filter": "Filtruj",
        "export": "Exportuj",
        "noHistory": "Brak historii ubezpieczenia"
    },

    "insuranceCard": {
        "status": {
            "active": "Aktywne",
            "expired": "Wygasło",
            "unknown": "Nieznany"
        },
        "fields": {
            "insurer": "Ubezpieczyciel:",
            "policyNumber": "Numer polisy:",
            "coverage": "Zakres ubezpieczenia:",
            "notes": "Uwagi:"
        }
    }
    ,

    visit_history: {
        title: "HISTORIA WIZYT"
    },

    "visitsForm": {
        "search": {
            "placeholder": "Szukaj w historii wizyt...",
            "filter": "Filtruj",
            "export": "Exportuj"
        },
        "noVisits": "Brak historii wizyt",
        "sections": {
            "medicalInterview": "Wywiad lekarski",
            "demographics": {
                "title": "Dane demograficzne",
                "education": "Wykształcenie:",
                "occupation": "Zawód:",
                "maritalStatus": "Stan cywilny:",
                "livingArrangement": "Warunki mieszkaniowe:"
            },
            "diagnoses": "Rozpoznania",
            "medications": "Leki",
            "labResults": "Wyniki badań",
            "psychometricTests": "Testy psychometryczne",
            "points": "pkt"
        }
    },
    document_section: {
        title: "DOKUMENTACJA MEDYCZNA"
    },
    "documentsForm": {
        "search": {
            "placeholder": "Szukaj w dokumentach..."
        },
        "buttons": {
            "filter": "Filtruj",
            "export": "Exportuj",
            "newDocument": "Nowy dokument"
        },
        "noDocuments": "Brak dokumentów"
    },

    lab_result: {
        title: "WYNIKI BADAŃ"
    },
    "labResults": {
        "search": {
            "placeholder": "Szukaj w wynikach badań..."
        },
        "buttons": {
            "filter": "Filtruj",
            "export": "Exportuj",
            "addResults": "Dodaj wyniki",
            "download": "Pobierz",
            "preview": "Podgląd"
        },
        "noResults": "Brak wyników badań"
    },

    medical_data: {

        medicine: "Leki",
        diagnosis: "Rozpoznanie",
        allergies: "Alergie i nietolerancje",
        chronic_diseases: "Choroby przewlekłe",
        family_interview: "Wywiad rodzinny",
        risk_factors: "Czynniki ryzyka"


    }
    ,
    "medications": {
        "sections": {
            "regular": "Leki stałe",
            "asNeeded": "Leki doraźne",
            "history": "Historia leków"
        },
        "buttons": {
            "addMedication": "Dodaj lek",
            "cancel": "Anuluj",
            "end": "Zakończ",
            "add": "Dodaj"
        },
        "modal": {
            "title": "Dodaj lek",
            "searchPlaceholder": "Wyszukaj lek...",
            "regularMedication": "Lek stały"
        },
        "medicationCard": {
            "dosage": "Dawkowanie:",
            "from": "Od",
            "notes": "Uwagi:",
            "currently": "obecnie"
        },
        "confirmDelete": "Czy na pewno chcesz usunąć ten lek?"
    },

    "diagnoses": {
        "sections": {
            "active": "Rozpoznania aktualne",
            "history": "Historia rozpoznań"
        },
        "buttons": {
            "addDiagnosis": "Dodaj rozpoznanie",
            "cancel": "Anuluj",
            "add": "Dodaj rozpoznanie"
        },
        "modal": {
            "title": "Dodaj rozpoznanie",
            "searchPlaceholder": "Wyszukaj kod lub nazwę rozpoznania...",
            "category": "Kategoria:",
            "diagnosticCriteria": "Kryteria diagnostyczne:",
            "diagnosisType": {
                "label": "Typ rozpoznania",
                "primary": "Główne",
                "secondary": "Współistniejące"
            },
            "notes": {
                "label": "Uwagi",
                "placeholder": "Dodatkowe uwagi do rozpoznania..."
            }
        },
        "diagnosisCard": {
            "from": "Od",
            "notes": "Uwagi:",
            "status": {
                "active": "Aktywne",
                "remission": "Remisja",
                "resolved": "Wyleczone"
            },
            "type": {
                "primary": "Główne",
                "secondary": "Współistniejące"
            }
        },
        "confirmDelete": "Czy na pewno chcesz usunąć to rozpoznanie?"
    },


    "allergies": {
        "title": "Alergie i nietolerancje",
        "buttons": {
            "addAllergy": "Dodaj alergię",
            "cancel": "Anuluj",
            "add": "Dodaj alergię"
        },
        "modal": {
            "title": "Dodaj alergię",
            "allergyType": {
                "label": "Typ alergii",
                "drug": "Lekowa",
                "food": "Pokarmowa",
                "environmental": "Środowiskowa",
                "other": "Inna"
            },
            "allergenName": {
                "label": "Nazwa alergenu",
                "placeholder": "Wprowadź nazwę alergenu..."
            },
            "reaction": {
                "label": "Reakcja alergiczna",
                "placeholder": "Opisz reakcję alergiczną..."
            },
            "severity": {
                "label": "Nasilenie",
                "mild": "Łagodne",
                "moderate": "Umiarkowane",
                "severe": "Ciężkie"
            },
            "notes": {
                "label": "Uwagi",
                "placeholder": "Dodatkowe uwagi..."
            }
        },
        "allergyCard": {
            "reaction": "Reakcja:",
            "diagnosed": "Rozpoznano:",
            "notes": "Uwagi:",
            "noAllergies": "Brak zarejestrowanych alergii"
        },
        "confirmDelete": "Czy na pewno chcesz usunąć tę alergię?"
    }
    ,

    "chronicConditions": {
        "title": "Choroby przewlekłe",
        "buttons": {
            "addCondition": "Dodaj chorobę",
            "cancel": "Anuluj",
            "add": "Dodaj chorobę"
        },
        "modal": {
            "title": "Dodaj chorobę przewlekłą",
            "conditionName": {
                "label": "Nazwa choroby",
                "placeholder": "Wyszukaj lub wprowadź nazwę choroby..."
            },
            "category": "Kategoria:",
            "typicalTreatment": "Typowe leczenie:",
            "monitoringGuidelines": "Zalecenia monitorowania:",
            "status": {
                "label": "Status",
                "active": "Aktywna",
                "remission": "Remisja",
                "resolved": "Wyleczona"
            },
            "severity": {
                "label": "Nasilenie",
                "mild": "Łagodne",
                "moderate": "Umiarkowane",
                "severe": "Ciężkie"
            },
            "treatment": {
                "label": "Leczenie",
                "placeholder": "Opisz stosowane leczenie..."
            },
            "notes": {
                "label": "Uwagi",
                "placeholder": "Dodatkowe uwagi..."
            }
        },
        "conditionCard": {
            "treatment": "Leczenie:",
            "diagnosed": "Rozpoznano:",
            "notes": "Uwagi:",
            "noConditions": "Brak chorób przewlekłych"
        },
        "confirmDelete": "Czy na pewno chcesz usunąć tę chorobę?"
    },
    "familyHistory": {
        "title": "Wywiad rodzinny",
        "buttons": {
            "addEntry": "Dodaj wpis",
            "cancel": "Anuluj",
            "add": "Dodaj wpis",
            "submit": "Zapisz"
        },
        "modal": {
            "title": "Dodaj wywiad rodzinny",
            "condition": {
                "label": "Choroba/Stan",
                "placeholder": "Wyszukaj lub wprowadź nazwę choroby...",
                "category": "Kategoria:"
            },
            "details": {
                "typicalOnset": "Typowy wiek zachorowania:",
                "inheritancePattern": "Wzorzec dziedziczenia:",
                "familyRisk": "Ryzyko rodzinne:"
            },
            "relationship": {
                "label": "Stopień pokrewieństwa",
                "placeholder": "Wybierz stopień pokrewieństwa"
            },
            "onsetAge": {
                "label": "Wiek zachorowania",
                "placeholder": "np. 45 lat"
            },
            "name": {
                "label": "Nazwa choroby",
                "placeholder": "np.Depresja"
            },
            "notes": {
                "label": "Uwagi",
                "placeholder": "Dodatkowe uwagi..."
            }
        },
        "entryCard": {
            "relationship": "Stopień pokrewieństwa:",
            "onsetAge": "Wiek zachorowania:",
            "notes": "Uwagi:",
            "noEntries": "Brak wpisów w wywiadzie rodzinnym"
        },
        "confirmDelete": "Czy na pewno chcesz usunąć ten wpis?"
    },

    "riskFactors": {
        "title": "Czynniki ryzyka",
        "buttons": {
            "addFactor": "Dodaj czynnik",
            "cancel": "Anuluj",
            "add": "Dodaj czynnik"
        },
        "modal": {
            "title": "Dodaj czynnik ryzyka",
            "category": {
                "label": "Kategoria",
                "placeholder": "Wybierz kategorię"
            },
            "factor": {
                "label": "Czynnik ryzyka",
                "placeholder": "Wyszukaj lub wprowadź czynnik ryzyka..."
            },
            "riskLevel": {
                "label": "Poziom ryzyka",
                "low": "Niskie",
                "moderate": "Umiarkowane",
                "high": "Wysokie"
            },
            "notes": {
                "label": "Uwagi",
                "placeholder": "Dodatkowe uwagi..."
            }
        },
        "factorCard": {
            "category": "Kategoria:",
            "notes": "Uwagi:",
            "noFactors": "Brak zarejestrowanych czynników ryzyka"
        },
        "confirmDelete": "Czy na pewno chcesz usunąć ten czynnik ryzyka?"
    },

    "visitActions": {
        "notes": {
            "add": "Dodaj notatkę",
            "edit": "Edytuj notatkę",
            "delete": "Usuń notatkę",
            "placeholder": "Wprowadź notatkę...",
            "save": "Zapisz",
            "saveChanges": "Zapisz zmiany"
        },
        "visit": {
            "cancel": "Anuluj wizytę",
            "confirmCancel": "Czy na pewno chcesz anulować wizytę?"
        },
        "buttons": {
            "cancel": "Anuluj"
        },
        "modal": {
            "cancel": {
                "title": "Anuluj wizytę",
                "message": "Czy na pewno chcesz anulować wizytę?",
                "ok": "Tak",
                "cancel": "Nie"
            }
        }


    },
    "analytics": {
        "header": {
            "title": "Analiza statystyczna AI",
            "subtitle": "Zaawansowana analiza danych klinicznych wspierana sztuczną inteligencją"
        },
        "filters": {
            "timeRange": {
                "label": "Zakres czasu",
                "options": {
                    "lastWeek": "Ostatni tydzień",
                    "lastMonth": "Ostatni miesiąc",
                    "lastQuarter": "Ostatni kwartał",
                    "lastYear": "Ostatni rok",
                    "custom": "Własny zakres"
                }
            },
            "department": {
                "label": "Oddział",
                "options": {
                    "all": "Wszystkie oddziały",
                    "adult": "Oddział dla dorosłych",
                    "child": "Oddział dziecięcy",
                    "geriatric": "Oddział geriatryczny"
                }
            },
            "doctors": {
                "label": "Lekarze",
                "options": {
                    "all": "Wszyscy lekarze"
                }
            },
            "metrics": {
                "label": "Metryki",
                "visits": "Wizyty",
                "diagnoses": "Rozpoznania"
            }
        },
        "kpi": {
            "visits": {
                "title": "Wizyty",
                "trend": "+12.5% vs poprzedni okres"
            },
            "remissionTime": {
                "title": "Średni czas do remisji",
                "value": "8.5 tyg",
                "trend": "-15.3% vs poprzedni okres"
            },
            "treatmentEfficiency": {
                "title": "Skuteczność leczenia",
                "trend": "+5.2% vs poprzedni okres"
            },
            "adherence": {
                "title": "Adherencja",
                "trend": "+3.1% vs poprzedni okres"
            }
        },
        "charts": {
            "diagnosticTrends": {
                "title": "Trendy diagnostyczne",
                "series": {
                    "depression": "Epizod depresyjny",
                    "anxiety": "Zaburzenia lękowe",
                    "stress": "Reakcja na stres"
                }
            },
            "treatmentOutcomes": {
                "title": "Wyniki leczenia"
            }
        },
        "aiInsights": {
            "title": "Wnioski AI",
            "subtitle": "Powered by advanced machine learning algorithms",
            "sections": {
                "clinicalPatterns": {
                    "title": "Wzorce kliniczne",
                    "insights": {
                        "depression": "Zaobserwowano 23% wzrost rozpoznań F32.1 (Epizod depresyjny umiarkowany) w grupie wiekowej 25-35 lat. Główne czynniki ryzyka: stres zawodowy, izolacja społeczna.",
                        "therapy": "Skuteczność terapii wzrosła o 15% przy wczesnej interwencji (do 2 tygodni od pierwszych objawów) i regularnym monitorowaniu z użyciem skal klinicznych."
                    }
                },
                "treatmentRecommendations": {
                    "title": "Rekomendacje terapeutyczne",
                    "insights": {
                        "combination": "Pacjenci z kombinacją farmakoterapii i psychoterapii wykazują o 35% wyższą skuteczność leczenia w porównaniu do monoterapii.",
                        "risk": "Zidentyfikowano wzrost ryzyka przerwania leczenia w 4-6 tygodniu terapii. Zalecane wdrożenie dodatkowego wsparcia i monitoringu w tym okresie."
                    }
                }
            }
        },
        "metrics": {
            "demographics": {
                "title": "Demografia pacjentów",
                "averageAge": "Średni wiek",
                "genderDistribution": "Rozkład płci",
                "newPatients": "Nowi pacjenci",
                "genderValues": "K: 65% | M: 35%"
            },
            "treatment": {
                "title": "Metryki leczenia",
                "averageDuration": "Średnia długość terapii",
                "remissionRate": "Odsetek remisji",
                "continuationRate": "Kontynuacja leczenia"
            },
            "quality": {
                "title": "Wskaźniki jakości",
                "patientSatisfaction": "Satysfakcja pacjentów",
                "readmissions": "Readmisje (30d)",
                "documentation": "Kompletność dokumentacji"
            }
        }
        ,

        "xmlExport": {
            "title": "Eksport danych do XML",
            "facility": {
                "info": "W celu pełnego eksportu danych placówki prosimy o kontakt z Pomocą Techniczną programu."
            },
            "patients": {
                "title": "Eksport pacjentów do XML",
                "search": {
                    "lastName": "Nazwisko",
                    "firstName": "Imię",
                    "pesel": "PESEL",
                    "phone": "Telefon",
                    "externalCardNo": "Nr karty zewn."
                },
                "table": {
                    "headers": {
                        "fullName": "Nazwisko i imię",
                        "address": "Adres",
                        "groups": "Grupy pacjenta",
                        "pesel": "PESEL",
                        "phone": "Telefon",
                        "actions": "Akcje"
                    }
                },
                "actions": {
                    "export": "Eksportuj do XML"
                }
            }
        },


        "activityLog": {
            "title": "Dziennik aktywności",
            "actions": {
                "logoutAll": "Wyloguj wszystkie sesje"
            },
            "search": {
                "employee": "Pracownik"
            },
            "table": {
                "headers": {
                    "loginDate": "Data zalogowania",
                    "logoutDate": "Data wylogowania",
                    "user": "Użytkownik",
                    "ipAddress": "Adres IP",
                    "deviceCode": "Kod urządzenia"
                }
            },
            "pagination": {
                "recordsPerPage": "rekordów na stronę",
                "page": "Strona",
                "of": "z",
                "totalResults": "łączna liczba wyników"
            }
        }








    },

    aiAssistants: {
        title: "Asystenci AI",
        description: "Zaawansowane narzędzia AI wspierające pracę lekarza",
        tabs: {
            documentation: "Dokumentacja",
            chatbots: "Chatboty",
            diagnosis: "Diagnostyka",
            trials: "Badania kliniczne",
            statistics: "Analiza statystyczna"
        }
    },

    "documentationAssistant": {
        "title": "Asystent Dokumentacji",
        "recording": {
            "start": "Rozpocznij nagrywanie",
            "stop": "Zatrzymaj"
        },
        "transcription": {
            "title": "Transkrypcja",
            "placeholder": "Transkrypcja pojawi się tutaj..."
        },
        "sections": {
            "symptoms": "Objawy",
            "examination": "Badanie",
            "diagnosis": "Rozpoznanie",
            "recommendations": "Zalecenia"
        },
        "buttons": {
            "copy": "Kopiuj",
            "generateNote": "Generuj notatkę"
        }
    },

    "chatbotBuilder": {
        "title": "Konfigurator Chatbotów",
        "buttons": {
            "newChatbot": "Nowy chatbot",
            "saveConfig": "Zapisz konfigurację",
            "edit": "Edytuj",
            "delete": "Usuń"
        },
        "form": {
            "name": {
                "label": "Nazwa chatbota"
            },
            "specialty": {
                "label": "Specjalizacja",
                "placeholder": "Wybierz specjalizację"
            },
            "dataSources": {
                "label": "Źródła danych"
            },
            "customPrompt": {
                "label": "Własny prompt"
            }
        },
        "configuredChatbots": {
            "title": "Skonfigurowane chatboty"
        }
    },
    "differentialDiagnosis": {
        "title": "Asystent Diagnostyki Różnicowej",
        "symptoms": {
            "label": "Objawy",
            "placeholder": "Wprowadź objaw...",
            "addButton": "Dodaj"
        },
        "analyze": {
            "button": "Analizuj"
        },
        "results": {
            "title": "Możliwe rozpoznania",
            "probability": "Prawdopodobieństwo:",
            "sections": {
                "keySymptoms": "Kluczowe objawy:",
                "recommendedTests": "Zalecane badania:"
            }
        }
    },
    "clinicalTrials": {
        "title": "Wyszukiwarka Badań Klinicznych",
        "form": {
            "diagnosis": {
                "label": "Rozpoznanie",
                "placeholder": "np. Migrena"
            },
            "location": {
                "label": "Lokalizacja",
                "placeholder": "np. Warszawa"
            },
            "searchButton": "Szukaj badań"
        },
        "results": {
            "title": "Znalezione badania",
            "status": {
                "recruiting": "Rekrutacja",
                "active": "Aktywne",
                "completed": "Zakończone"
            },
            "criteria": {
                "inclusion": "Kryteria włączenia:",
                "exclusion": "Kryteria wyłączenia:"
            },
            "contact": {
                "title": "Kontakt:"
            },
            "buttons": {
                "details": "Szczegóły",
                "refer": "Zgłoś pacjenta"
            }
        }
    },

    "statisticalAnalysis": {
        "title": "Analiza Statystyczna AI",
        "buttons": {
            "export": "Eksportuj raport",
            "analyze": "Analizuj"
        },
        "config": {
            "timeRange": {
                "label": "Zakres czasu",
                "options": {
                    "lastMonth": "Ostatni miesiąc",
                    "lastQuarter": "Ostatni kwartał",
                    "lastYear": "Ostatni rok",
                    "custom": "Własny zakres"
                }
            },
            "metrics": {
                "label": "Metryki",
                "options": {
                    "visits": "Wizyty",
                    "diagnoses": "Diagnozy",
                    "procedures": "Procedury",
                    "labResults": "Wyniki badań"
                }
            },
            "grouping": {
                "label": "Grupowanie",
                "options": {
                    "day": "Dzień",
                    "week": "Tydzień",
                    "month": "Miesiąc",
                    "quarter": "Kwartał"
                }
            }
        },
        "results": {
            "summary": {
                "patients": {
                    "title": "Pacjenci",
                    "averageAge": "Średni wiek:"
                },
                "gender": {
                    "title": "Rozkład płci",
                    "male": "Mężczyźni",
                    "female": "Kobiety"
                }
            },
            "diagnoses": {
                "title": "Najczęstsze rozpoznania"
            },
            "trends": {
                "title": "Trendy wizyt"
            },
            "distribution": {
                "title": "Rozkład rozpoznań"
            }
        }

    },

    "settingsNav": {
        "title": "Ustawienia",
        "description": "Zarządzaj ustawieniami placówki i konfiguracją systemu",
        "backButton": "Powrót",
        "tabs": {
            "statistics": "Statystyki placówki",
            "facility": "Dane placówki",
            "settings": "Ustawienia",
            "security": "Bezpieczeństwo",
            "subscription": "Abonament",
            "portal": "Portal pacjenta",
            "profile": "Profil",
            "employees": "Pracownicy",
            "ewus": "eWUŚ"
        }
    },
    "facilityStatistics": {
        "title": "Statystyki placówki",
        "stats": {
            "departments": "Oddziały",
            "doctors": "Lekarze",
            "offices": "Gabinety",
            "nurses": "Pielęgniarki",
            "patients": "Pacjenci",
            "receptionists": "Recepcjoniści"
        }
    },
    "facilitySettings": {
        "title": "Dane podmiotu",
        "required": "* Pole wymagane",
        "basicInfo": {
            "name": "Nazwa",
            "regon": "REGON",
            "nip": "NIP",
            "bdo": "Numer BDO",
            "registryNumber": "Numer księgi rej. (I cz. kodu res.)"
        },
        "contact": {
            "facilityType": "Rodzaj podmiotu",
            "types": {
                "individual": "praktyka indywidualna"
            },
            "phone": "Telefon",
            "email": "Adres email",
            "accountNumber": "Numer konta",
            "website": "Adres www"
        },
        "address": {
            "street": "Ulica",
            "buildingNumber": "Nr domu",
            "apartmentNumber": "Nr lokalu",
            "postalCode": "Kod pocztowy",
            "city": "Miejscowość"
        },
        "codes": {
            "teryt": "Kod TERYT",
            "nfz": "Kod NFZ"
        },
        "workingHours": {
            "from": "Godziny pracy od",
            "to": "Godziny pracy do",
            "visitDuration": "Czas wizyty (min)",
            "visitType": "Rodzaj wizyty",
            "types": {
                "private": "Prywatna"
            }
        },
        "reception": {
            "defaultMode": "Domyślny tryb przyjęcia",
            "select": "Wybierz"
        },
        "logo": {
            "title": "Logo placówki",
            "upload": "WYBIERZ PLIK"
        },
        "gdpr": {
            "consent": "Treść zgody na przetwarzanie danych osobowych (zmiana domyślnej)"
        },
        "buttons": {
            "save": "Zapisz zmiany"
        }
    },

    "branch": {
        "title": "Oddziały",
        "add": "Dodaj oddział",
        "form": {
            "branchName": "Nazwa oddziału",
            "branchNamePlaceholder": "Nazwa oddziału",
            "address": "Adres",
            "addressPlaceholder": "Ulica i numer",
            "postalCode": "Kod pocztowy",
            "postalCodePlaceholder": "Kod pocztowy",
            "city": "Miejscowość",
            "cityPlaceholder": "Miejscowość",
            "phone": "Telefon",
            "phonePlaceholder": "Telefon",
            "email": "Email",
            "emailPlaceholder": "Email"
        },
        "validation": {
            "required": "To pole jest wymagane",
            "phoneFormat": "Nieprawidłowy format numeru telefonu",
            "emailFormat": "Nieprawidłowy format adresu email",
            "postalCodeFormat": "Nieprawidłowy format kodu pocztowego (XX-XXX)"
        },
        "confirmDelete": {
            "title": "Potwierdź usunięcie",
            "message": "Czy na pewno chcesz usunąć ten oddział?",
            "ok": "Tak, usuń",
            "cancel": "Anuluj"
        },
        "actions": {
            "cancel": "Anuluj",
            "save": "Zapisz"
        }
    },
    "office": {
        "title": "Gabinety",
        "add": "Dodaj gabinet",
        "form": {
            "name": "Nazwa gabinetu",
            "namePlaceholder": "Nazwa gabinetu",
            "branch": "Oddział",
            "branchPlaceholder": "Wybierz oddział",
            "floor": "Piętro",
            "floorPlaceholder": "Piętro",
            "number": "Numer",
            "numberPlaceholder": "Numer gabinetu",
            "type": "Typ gabinetu",
            "typePlaceholder": "Wybierz typ",
            "types": {
                "medical": "Gabinet lekarski",
                "therapy": "Gabinet terapeutyczny",
                "diagnostic": "Gabinet diagnostyczny"
            },
            "equipment": "Wyposażenie",
            "equipmentPlaceholder": "Lista wyposażenia (po jednym w linii)"
        },
        "validation": {
            "required": "To pole jest wymagane",
            "floorFormat": "Nieprawidłowy format piętra (cyfry i ewentualnie znak minus)",
            "numberFormat": "Nieprawidłowy format numeru gabinetu (litery i cyfry)"
        },
        "details": {
            "floor": "Piętro",
            "number": "Nr",
            "type": "Typ",
            "equipment": "Wyposażenie"
        },
        "actions": {
            "cancel": "Anuluj",
            "save": "Zapisz"
        },
        "confirmDelete": {
            "title": "Potwierdź usunięcie",
            "message": "Czy na pewno chcesz usunąć ten gabinet?",
            "ok": "Tak, usuń",
            "cancel": "Anuluj"
        }
    },
    "certificates": {
        "title": "Certyfikaty P1",
        "form": {
            "p1Id": {
                "label": "Identyfikator P1",
                "placeholder": "Wprowadź identyfikator P1"
            },
            "tls": {
                "label": "Certyfikat TLS",
                "placeholder": "Wybierz plik certyfikatu TLS"
            },
            "wls": {
                "label": "Certyfikat WLS",
                "placeholder": "Wybierz plik certyfikatu WLS"
            }
        },
        "actions": {
            "save": "Zapisz certyfikaty"
        }
    },
    "security": {
        "title": "Ustawienia bezpieczeństwa"
    },

    "twoFactor": {
        "title": "Weryfikacja dwuetapowa",
        "status": {
            "enabled": "Włączona",
            "disabled": "Wyłączona"
        },
        "description": {
            "title": "Weryfikacja dwuetapowa to podwójne sprawdzenie tożsamości podczas logowania.",
            "detail": "W celu dodatkowego zabezpieczenia konta, w trakcie logowania użytkownik musi podać kod, który jest wysyłany na wybrany przez niego kanał komunikacji - email, sms lub w aplikacji mobilnej."
        },
        "trustedDevices": {
            "title": "Pozwalaj użytkownikom na zapisywanie zaufanych urządzeń",
            "description": "Drugi etap weryfikacji na danym urządzeniu będzie następował wtedy wyłącznie co 30 dni, a nie za każdym razem"
        }
    },
    "subscription": {
        "title": "Wykupione plany",
        "overview": {
            "activeUsers": "Liczba aktywnych użytkowników",
            "nfzSettlements": "Rozliczenia z NFZ",
            "nextPayment": "Następna płatność",
            "actions": {
                "payNow": "ZAPŁAĆ TERAZ",
                "cancelSubscription": "ANULUJ SUBSKRYPCJĘ"
            }
        },
        "currentPlan": {
            "table": {
                "name": "Nazwa",
                "validFrom": "Ważny od",
                "validTo": "Ważny do",
                "nextPayment": "Następna płatność",
                "subscriptionInfo": "subskrypcja płatna co 30 dni",
                "userCount": "Subskrypcja - {count} użytk. co 30 dni"
            }
        },
        "plans": {
            "title": "Plany",
            "filters": {
                "withoutNFZ": "BEZ ROZLICZEŃ Z NFZ",
                "withNFZ": "MODUŁ ROZLICZEŃ Z NFZ",
                "comingSoon": "wkrótce"
            },
            "card": {
                "upTo": "do",
                "users": "użytkowników",
                "bestOffer": "Najlepsza oferta dla Ciebie",
                "gross": "brutto",
                "withoutNFZ": "bez modułu NFZ",
                "upgradeInfo": "powiększenie pakietu, płatne z góry co 30 dni",
                "currentPeriodPayment": "dopłata za bieżący okres",
                "nextPayment": "kolejna płatność",
                "contractUntil": "umowa do",
                "buttons": {
                    "currentPlan": "Obecny plan",
                    "select": "WYBIERZ"
                }
            },
            "aiFeatures": {
                "title": "AI Powered",
                "docAssistant": "Asystent dokumentacji",
                "clinicalDecisions": "Wsparcie decyzji klinicznych",
                "drugInteractions": "Analiza interakcji lekowych"
            }
        },
        "aiInfo": {
            "title": "Co to jest abonament AI Powered?",
            "description": "Abonament AI Powered to dostęp do zaawansowanych funkcji wspieranych sztuczną inteligencją, które pomagają w codziennej pracy:",
            "features": [
                "Asystent dokumentacji medycznej z transkrypcją głosową",
                "System wsparcia decyzji klinicznych",
                "Inteligentny asystent kodowania ICD-10",
                "Analiza interakcji lekowych z grafem wiedzy",
                "Asystent wywiadu z analizą emocji",
                "Automatyczne sugestie diagnostyczne",
                "Analiza trendów i wzorców w danych pacjentów"
            ]
        }
    },
    "portal": {
        "title": "Portal pacjenta",
        "info": {
            "title": "Portal pacjenta - funkcje i możliwości",
            "description": "Skonfiguruj, które funkcje portalu pacjenta mają być dostępne. Możesz włączyć lub wyłączyć poszczególne moduły oraz ich szczegółowe funkcje."
        },
        "features": {
            "aiPowered": "AI Powered",
            "requiresAI": "Wymaga planu AI Powered"
        },
        "security": {
            "title": "Bezpieczeństwo danych",
            "description": "Wszystkie dane w portalu pacjenta są szyfrowane i chronione zgodnie z wymogami RODO. Dostęp do portalu wymaga silnego uwierzytelnienia, a każda aktywność jest monitorowana i logowana."
        },
        "actions": {
            "save": "Zapisz ustawienia"
        }
    },

    "userManagement": {
        "title": "Zarządzanie kontem",
        "actions": {
            "addUser": "Dodaj użytkownika"
        },
        "modal": {
            "title": "Dodaj nowego użytkownika"
        }
    },

    "notifications": {
        "title": "Powiadomienia",
        "types": {
            "email": "Powiadomienia email",
            "sms": "Powiadomienia SMS",
            "app": "Powiadomienia w aplikacji"
        }
    },

    security_settings: {
        "title": "Bezpieczeństwo",
        "changePassword": {
            "button": "Zmień hasło",
            "currentPassword": "Obecne hasło",
            "newPassword": "Nowe hasło",
            "confirmPassword": "Potwierdź nowe hasło",
            "success": "Hasło zostało pomyślnie zmienione.",
            "error": "Wystąpił błąd podczas zmiany hasła. Proszę spróbować ponownie.",
            "actions": {
                "cancel": "Anuluj",
                "submit": "Zmień hasło"
            },
            "errors": {
                "required": "To pole jest wymagane",
                "length": "Hasło musi mieć co najmniej 8 znaków",
                "passwordMismatch": "Nowe hasło i potwierdzenie hasła nie są zgodne"
            }
        }
    },

    "profile": {
        "form": {
            "firstName": "Imię",
            "lastName": "Nazwisko",
            "email": "Email"
        },
        "actions": {
            "editProfile": "Edytuj profil",
            "cancel": "Anuluj",
            "saveChanges": "Zapisz zmiany"
        }
    },
    "registration": {
        "form": {
            "firstName": "Imię",
            "lastName": "Nazwisko",
            "email": "Email",
            "username": "Nazwa użytkownika",
            "role": "Rola",
            "roles": {
                "doctor": "Lekarz",
                "nurse": "Pielęgniarka",
                "receptionist": "Recepcjonista",
                "admin": "Administrator"
            },
            "password": "Hasło",
            "confirmPassword": "Potwierdź hasło"
        },
        "actions": {
            "cancel": "Anuluj",
            "register": "Zarejestruj"
        }
    },

    "passwordStrength": {
        "levels": {
            "veryWeak": "Bardzo słabe",
            "weak": "Słabe",
            "medium": "Średnie",
            "strong": "Silne",
            "veryStrong": "Bardzo silne"
        },
        "enterPassword": "Wprowadź hasło"
    },

    "addEmployee": {
        "title": {
            "doctor": "Dodaj lekarza",
            "nurse": "Dodaj pielęgniarkę",
            "receptionist": "Dodaj recepcjonistę",
            "director": "Dodaj dyrektora"
        },
        "form": {
            "firstName": "Imię",
            "lastName": "Nazwisko",
            "email": "E-mail",
            "confirmEmail": "Powtórz e-mail",
            "pwzNumber": "Numer PWZ",
            "peselNumber": "Numer PESEL",
            "required": "*"
        },
        "warning": "Dodając użytkownika do konta swojej placówki, potwierdzasz, że ten użytkownik po zaakceptowaniu zaproszenia i potwierdzeniu przez Ciebie będzie miał dostęp do danych Twojej placówki. Pamiętaj, aby przyznawać takie uprawnienia jedynie osobom upoważnionym.",
        "actions": {
            "cancel": "Anuluj",
            "add": "Dodaj"
        },
        "errors": {
            "emailMismatch": "Adresy email nie są zgodne"
        }
    },

    "employees": {
        "title": "Pracownicy",
        "roles": {
            "doctor": {
                "title": "Lekarze, dentyści i felczerzy",
                "addButtonText": "Dodaj lekarza/dentystę/felczera"
            },
            "nurse": {
                "title": "Pielęgniarki i położne",
                "addButtonText": "Dodaj pielęgniarkę/położną"
            },
            "receptionist": {
                "title": "Recepcjoniści",
                "addButtonText": "Dodaj recepcjonistę"
            },
            "director": {
                "title": "Dyrektorzy",
                "addButtonText": "Dodaj dyrektora"
            }
        },
        "actions": {
            "groupPermissions": "UPRAWNIENIA GRUPY",
            "ratings": "OCENY"
        },
        "info": {
            "userCount": "Łączna liczba użytkowników kwalifikująca się do pobierania opłat abonamentowych: (3. Maksymalna liczba użytkowników wynikająca z wykupionych pakietów 7)."
        },
        "confirm": {
            "deleteEmployee": "Czy na pewno chcesz usunąć tego pracownika?"
        }
    },

    "employeeList": {
        "search": {
            "lastName": "Nazwisko",
            "firstName": "Imię",
            "pwz": "PWZ",
            "pesel": "PESEL"
        },
        "filters": {
            "onlyActive": "Tylko aktywni"
        },
        "table": {
            "headers": {
                "fullName": "Nazwisko i imię",
                "login": "Login",
                "pwzPesel": "PWZ/PESEL",
                "pesel": "PESEL",
                "activationStatus": "Status aktywacji",
                "actions": "Akcje"
            },
            "status": {
                "inactive": "Nieaktywne"
            }
        },
        "actions": {
            "permissions": "UPRAWNIENIA",
            "edit": "EDYTUJ"
        },
        "pagination": {
            "recordsPerPage": "rekordów na stronę",
            "totalResults": "łączna liczba wyników"
        }
    },

    "ewus": {
        "title": "eWUŚ",
        "autoCheck": {
            "label": "Automatyczne sprawdzanie ubezpieczeń:",
            "enable": "Włącz",
            "disable": "Wyłącz"
        },
        "system": {
            "label": "System eWUŚ",
            "enable": "Włącz",
            "disable": "Wyłącz"
        },
        "form": {
            "branch": "Oddział:",
            "branches": {
                "pomorski": "Pomorski (11)",
                "mazowiecki": "Mazowiecki (07)",
                "slaski": "Śląski (12)"
            },
            "contractorType": "Typ kontrahenta:",
            "contractorTypes": {
                "doctor": "Lekarz",
                "clinic": "Przychodnia",
                "hospital": "Szpital"
            },
            "personnelCode": "Kod personelu:",
            "login": "Login:",
            "password": {
                "label": "Hasło:",
                "placeholder": "(nie zmieniono)"
            }
        },
        "actions": {
            "saveAndVerify": "Zapisz i zweryfikuj poprawność danych",
            "changePassword": "Zmień hasło",
            "checkNow": "Sprawdź teraz"
        }
    },

    "userProfile": {
        "settings": "Ustawienia",
        "notifications": "Powiadomienia",
        "logout": "Wyloguj się",
        "online": "Online",

        "fallbackInitial": "U"
    },
    toggle: {
        dark: "Tryb ciemny",
        light: "Tryb światła"
    },

    "clinicalDecisionSupport": {
        "title": "Wsparcie decyzji klinicznych",
        "subtitle": "Analiza AI danych klinicznych",
        "selectData": "Wybierz dane do analizy",
        "analysisResults": "Wyniki analizy AI",
        "newAnalysis": "Nowa analiza",
        "confidence": "pewność",
        "evidence": "Evidence",
        "riskAssessment": {
            "title": "Ocena ryzyka",
            "riskFactors": "Czynniki ryzyka",
            "recommendations": "Zalecenia"
        },

        "dataSelector": {
            "title": "Wybierz dane do analizy",
            "cancel": "Anuluj",
            "analyze": "Analizuj wybrane dane",
            "analyzing": "Analizowanie...",
            "currentVisit": {
                "section": "Obecna wizyta",
                "interview": "Wywiad z obecnej wizyty",
                "description": "Analiza danych z bieżącej wizyty, w tym wyniki skal i obserwacje"
            },
            "previousVisits": {
                "section": "Poprzednie wizyty",
                "emptyText": "Brak poprzednich wizyt do wyświetlenia",
                "visitType": "{{type}} - {{mainDiagnosis}}"
            },
            "riskLevels": {
                "low": "NISKI",
                "moderate": "UMIARKOWANY",
                "high": "WYSOKI"
            }
        }
    },

    "trends": {
        "title": "Analiza trendów klinicznych",
        "subtitle": "Analiza zmian skal psychiatrycznych w czasie",
        "emptyTitle": "Brak dostępnych danych skal psychiatrycznych",
        "emptySubtitle": "Wykonuj oceny podczas wizyt, aby zobaczyć trendy",
        "aiInsights": "Wnioski AI",
        "insufficientData": "Niewystarczająca ilość danych do analizy trendów. Rozważ wykonanie ocen psychiatrycznych podczas przyszłych wizyt.",
        "analyzing": "Znaleziono oceny psychiatryczne w {{count}} wizytach. Analiza trendów...",
        "totalVisits": "Suma wizyt",
        "visitHistory": "Historia wizyt pacjenta",
        "scalesCompleted": "Wykonane skale",
        "combinedScales": "HAM-D i MADRS łącznie"
    },
    "interviewCoach": {
        "title": "Trener Wywiadu Lekarskiego",
        "tabs": {
            "suggestions": "Sugestie pytań",
            "analysis": "Analiza komunikacji",
            "literature": "Literatura"
        }
    },

    "questionSuggestions": {
        "suggestedQuestions": "Sugerowane pytania ",
        "clearHistory": "Wyczyść historię"
    },

    "categoryFilter": {
        "categories": {
            "all": "Wszystkie",
            "timeline": "Przebieg czasowy",
            "factors": "Czynniki",
            "history": "Historia",
            "lifestyle": "Styl życia"
        }
    },
    "questionCard": {
        "followUpQuestions": "Pytania uzupełniające:",
        "button": {
            "used": "Użyte",
            "use": "Użyj"
        }
    },

    "communicationAnalysis": {
        "questionTypes": {
            "title": "Typy pytań",
            "openQuestions": "Pytania otwarte"
        },
        "patientEngagement": {
            "title": "Zaangażowanie pacjenta",
            "activeParticipation": "Aktywny udział"
        },
        "clarity": {
            "title": "Jasność komunikacji",
            "understandability": "Zrozumiałość"
        },
        "improvements": {
            "title": "Sugestie ulepszeń"
        }
    },

    "literatureReferences": {
        "relevance": "Trafność"
    },

    "smartTranscription": {
        "noteTemplates": {
            "firstVisit": {
                "name": "Pierwsza wizyta",
                "description": "Szczegółowy wywiad z pierwszej wizyty",
                "prompt": "Utwórz szczegółową notatkę z pierwszej wizyty, uwzględniając główne dolegliwości, wywiad, badanie przedmiotowe i plan leczenia."
            },
            "followUp": {
                "name": "Wizyta kontrolna",
                "description": "Notatka z wizyty kontrolnej",
                "prompt": "Utwórz zwięzłą notatkę z wizyty kontrolnej, skupiając się na postępach w leczeniu i aktualnych objawach."
            }
        },
        "conversation": {
            "doctor": "Lekarz",
            "patient": "Pacjent"
        },
        "transcription": {
            "title": "Transkrypcja rozmowy",
            "selectTemplate": "Wybierz szablon notatki...",
            "generateNote": "Generuj notatkę"
        },
        "mobileRecording": {
            "title": "Nagrywanie mobilne",
            "scanInstructions": "Zeskanuj kod QR swoim telefonem aby rozpocząć nagrywanie z urządzenia mobilnego",
            "linkValidity": "Link będzie aktywny przez 15 minut"
        },
        "processing": {
            "title": "Przetwarzanie nagrania",
            "subtitle": "Trwa analiza i transkrypcja rozmowy..."
        },
        "notePreview": {
            "title": "Wygenerowana notatka",
            "customPrompt": {
                "placeholder": "Wprowadź własne instrukcje dla AI...",
                "button": "Generuj z własnym promptem"
            },
            "buttons": {
                "regenerate": "Wygeneruj ponownie",
                "addToDoc": "Dodaj do dokumentacji"
            }
        }
    },
    "drugChecker": {
        "title": "Sprawdzanie Interakcji Leków",
        "input": {
            "placeholder": "Wprowadź nowy lek...",
            "button": "Sprawdź Interakcje"
        }
    },

    "icdAssistant": {
        "search": {
            "placeholder": "Wyszukaj kod lub nazwę rozpoznania ICD-10...",
            "expand": "Rozwiń",
            "collapse": "Zwiń"
        },
        "criteria": {
            "mainTitle": "Kryteria główne",
            "requiredCriteria": "Kryterium wymagane",
            "additionalTitle": "Kryteria dodatkowe",
            "physical": "Objaw fizyczny",
            "psychological": "Objaw psychiczny",
            "keySymptom": "Objaw kluczowy (1-4)"
        },
        "buttons": {
            "addDiagnosis": "Dodaj rozpoznanie",
            "addToInterview": "Umieść w wywiadzie"
        },
        "aiSuggestions": {
            "title": "Sugestie AI"
        }
    },

    "icdCodes": {

        "aiSuggestions": {
            "frequency": "Warto dopytać o częstotliwość napadów w ostatnim miesiącu",
            "avoidance": "Czy występują zachowania unikające związane z lękiem?",
            "triggers": "Jakie są główne czynniki wyzwalające napady?",
            "coping": "Czy pacjent ma strategie radzenia sobie z napadami?"
        }

    },

    "visitHistory": {
        "title": "Historia wizyt",
        "totalVisits": "Łącznie wizyt",
        "sections": {
            "medicalInterview": "Wywiad lekarski",
            "diagnoses": "Rozpoznania",
            "medications": "Leki",
            "labResults": "Wyniki badań",
            "psychometricTests": "Testy psychometryczne"
        },
        "points": "pkt",
        "change": "{{value}}"
    },

    "auditTrail": {
        "header": {
            "title": "Historia zmian dokumentu",
            "subtitle": "Pełna ścieżka audytu"
        },
        "actions": {
            "create": "Utworzenie dokumentu",
            "modify": "Modyfikacja dokumentu",
            "view": "Wyświetlenie dokumentu",
            "sign": "Podpisanie dokumentu",
            "print": "Wydruk dokumentu",
            "export": "Eksport dokumentu",
            "delete": "Usunięcie dokumentu",
            "update": "Modyfikacja dokumentu",
            "read": "Wyświetlenie dokumentu",
            "null": "Nieznana operacja",
            "undefined": "Nieznana operacja",
            "unknown": "Nieznana operacja"
        },
        "changes": {
            "title": "Wprowadzone zmiany:",
            "system": "System:"
        },
        "loading": "Ładowanie ścieżki audytu...",
        "noEntries": "Nie znaleziono wpisów audytu"
    },

    "clinicalTrends": {
        "header": {
            "title": "Analiza Trendów Klinicznych",
            "subtitle": "Analiza zmian w czasie wyników skal psychiatrycznych"
        },
        "scaleLabel": "Skala",
        "charts": {
            "hamdScale": "Skala HAM-D (Depresja)",
            "madrsScale": "Skala MADRS (Depresja)",
            "noData": "Brak danych do wyświetlenia"
        },
        "insights": {
            "title": "Spostrzeżenia AI",
            "improvement": "Znacząca poprawa ({{previous}} → {{current}}, {{change}}% spadek). Wykryto odpowiedź kliniczną.",
            "worsening": "Niepokojący wzrost ({{previous}} → {{current}}, {{change}}% wzrost). Rozważ dostosowanie leczenia.",
            "stable": "Stabilne wyniki ({{score}}). Leczenie podtrzymujące wydaje się skuteczne.",
            "multiImprovement": "Poprawa wielodomenowa wykryta w {{scales}}. Leczenie wykazuje szeroką skuteczność.",
            "noDataAvailable": "Brak wystarczających danych do analizy trendów. Zaleca się przeprowadzenie skal psychiatrycznych."
        },
        "metrics": {
            "totalVisits": {
                "title": "Łączna liczba wizyt",
                "description": "Historia wizyt pacjenta"
            },
            "scalesCompleted": {
                "title": "Wykonane skale",
                "description": "Wszystkie skale łącznie"
            }
        }
    },

    "psychiatricScales": {
        "header": "Wybierz skalę",
        "scales": {
            "hamD": {
                "name": "HAM-D",
                "description": "Skala Depresji Hamiltona"
            },
            "madrs": {
                "name": "MADRS",
                "description": "Skala Depresji Montgomery-Åsberg"
            },
            "asrs": {
                "name": "ASRS",
                "description": "Skala Objawów ADHD"
            },
            "hamA": {
                "name": "HAM-A",
                "description": "Skala Lęku Hamiltona"
            },
            "isi": {
                "name": "ISI",
                "description": "Skala Nasilenia Bezsenności"
            },
            "cars2": {
                "name": "CARS-2",
                "description": "Skala Oceny Autyzmu Dziecięcego"
            }
        }
    },

    "hamdScale": {
        "navigation": {
            "question": "Pytanie",
            "back": "Wstecz",
            "cancel": "Anuluj",
            "finish": "Zakończ skalę"
        },
        "interpretation": {
            "none": {
                "title": "Brak objawów depresji",
                "details": "Wynik wskazuje na brak klinicznie istotnych objawów depresji. Zalecana standardowa kontrola stanu psychicznego."
            },
            "mild": {
                "title": "Łagodna depresja",
                "details": "Wynik wskazuje na łagodne nasilenie objawów depresyjnych. Wskazana regularna kontrola i rozważenie interwencji terapeutycznej."
            },
            "moderate": {
                "title": "Umiarkowana depresja",
                "details": "Wynik wskazuje na umiarkowane nasilenie depresji. Zalecana interwencja terapeutyczna i rozważenie farmakoterapii."
            },
            "severe": {
                "title": "Ciężka depresja",
                "details": "Wynik wskazuje na ciężką depresję. Konieczna pilna interwencja terapeutyczna i farmakologiczna. Wskazana regularna ocena ryzyka samobójczego."
            },
            "verySevere": {
                "title": "Bardzo ciężka depresja",
                "details": "Wynik wskazuje na bardzo ciężką depresję. Konieczna natychmiastowa interwencja psychiatryczna. Wysokie ryzyko samobójcze - wymagana szczególna uwaga i monitoring."
            },
            "result": "Skala HAM-D: {{score}} punktów - {{interpretation}}"
        }
    },

    "madrsScale": {
        "interpretation": {
            "none": {
                "title": "Brak depresji",
                "details": "Wynik wskazuje na brak klinicznie istotnych objawów depresyjnych. Zalecana kontynuacja rutynowego monitoringu."
            },
            "mild": {
                "title": "Łagodna depresja",
                "details": "Wynik wskazuje na łagodne objawy depresyjne. Zalecany regularny monitoring i terapia wspierająca."
            },
            "moderate": {
                "title": "Umiarkowana depresja",
                "details": "Wynik wskazuje na umiarkowaną depresję. Zalecana psychoterapia i rozważenie farmakoterapii."
            },
            "severe": {
                "title": "Ciężka depresja",
                "details": "Wynik wskazuje na ciężką depresję. Wymagane intensywne leczenie łączące farmakoterapię i psychoterapię. Niezbędna ocena ryzyka samobójczego."
            },
            "result": "Skala MADRS: {{score}} punktów - {{interpretation}}"
        }
    },

    "asrsScale": {
        "interpretation": {
            "unlikely": {
                "title": "ADHD mało prawdopodobne",
                "details": "Wyniki przesiewowe sugerują, że ADHD jest mało prawdopodobne. W przypadku utrzymujących się podejrzeń klinicznych rozważ kompleksową ocenę neuropsychologiczną."
            },
            "possible": {
                "title": "ADHD możliwe",
                "details": "Wyniki przesiewowe sugerują możliwe ADHD. Zalecana dalsza ocena kliniczna i szczegółowy wywiad objawowy."
            },
            "highlyLikely": {
                "title": "ADHD wysoce prawdopodobne",
                "details": "Wyniki przesiewowe są wysoce zgodne z ADHD. Zdecydowanie zalecana kompleksowa ocena diagnostyczna, w tym wywiad rozwojowy i ocena upośledzenia funkcjonowania."
            },
            "result": "Skala ASRS: {{criticalSymptoms}} objawów krytycznych (Część B: {{totalScore}}) - {{interpretation}}"
        }
    },

    "hamaScale": {
        "interpretation": {
            "mild": {
                "title": "Łagodny lęk",
                "details": "Wynik wskazuje na łagodne nasilenie lęku. Zalecany monitoring objawów oraz psychoedukacja i techniki relaksacyjne."
            },
            "moderate": {
                "title": "Umiarkowany lęk",
                "details": "Wynik wskazuje na łagodne do umiarkowanego nasilenie lęku. Zalecana psychoterapia (CBT) i rozważenie farmakoterapii."
            },
            "severe": {
                "title": "Ciężki lęk",
                "details": "Wynik wskazuje na umiarkowane do ciężkiego nasilenie lęku. Zalecana łączona farmakoterapia i psychoterapia. Wymagany regularny monitoring."
            },
            "verySevere": {
                "title": "Bardzo ciężki lęk",
                "details": "Wynik wskazuje na bardzo ciężkie nasilenie lęku. Wymagana pilna interwencja psychiatryczna. Konieczne intensywne leczenie i ścisły monitoring."
            },
            "result": "Skala HAM-A: {{score}} punktów - {{interpretation}}"
        }
    },

    "isiScale": {
        "interpretation": {
            "noInsomnia": {
                "title": "Brak klinicznie istotnej bezsenności",
                "details": "Wynik wskazuje na brak klinicznie istotnej bezsenności. Zalecana edukacja w zakresie higieny snu w celach profilaktycznych."
            },
            "subthreshold": {
                "title": "Bezsenność podprogowa",
                "details": "Wynik wskazuje na bezsenność podprogową. Zalecana optymalizacja higieny snu i interwencje behawioralne."
            },
            "moderate": {
                "title": "Umiarkowana bezsenność kliniczna",
                "details": "Wynik wskazuje na umiarkowaną bezsenność kliniczną. Zalecana terapia poznawczo-behawioralna bezsenności (CBT-I). Rozważ farmakoterapię w przypadku utrzymywania się objawów."
            },
            "severe": {
                "title": "Ciężka bezsenność kliniczna",
                "details": "Wynik wskazuje na ciężką bezsenność kliniczną. Zalecana pilna interwencja z zastosowaniem CBT-I i farmakoterapii. Ocena chorób współistniejących."
            },
            "result": "Skala ISI: {{score}} punktów - {{interpretation}}"
        }
    },

    "cars2Scale": {
        "interpretation": {
            "noAutism": {
                "title": "Brak objawów spektrum autyzmu",
                "details": "Wynik wskazuje na brak klinicznie istotnych objawów spektrum autyzmu. Zalecany standardowy monitoring rozwojowy."
            },
            "mildToModerate": {
                "title": "Łagodny do umiarkowanego autyzm",
                "details": "Wynik wskazuje na łagodne do umiarkowanego objawy spektrum autyzmu. Zalecana kompleksowa ocena rozwojowa i wczesna interwencja."
            },
            "moderate": {
                "title": "Umiarkowany autyzm",
                "details": "Wynik wskazuje na umiarkowane objawy spektrum autyzmu. Zalecana strukturalna interwencja behawioralna i specjalistyczna terapia."
            },
            "severe": {
                "title": "Ciężki autyzm",
                "details": "Wynik wskazuje na ciężkie objawy spektrum autyzmu. Wymagana intensywna interwencja multidyscyplinarna z indywidualnym planem leczenia."
            },
            "result": "Skala CARS-2: {{score}} punktów - {{interpretation}}"
        }
    },

    "scaleSummary": {
        "header": {
            "title": "Podsumowanie skali",
            "score": "Wynik"
        },
        "sections": {
            "aiAnalysis": "Analiza AI",
            "recommendations": "Zalecenia",
            "riskFactors": "Czynniki ryzyka"
        },
        "points": "pkt",
        "buttons": {
            "close": "Zamknij",
            "addToInterview": "Dodaj do wywiadu"
        }
    }
    ,

    "prescriptionForm": {
        "info": {
            "title": "e-Recepta",
            "description": "Wystawiaj recepty elektroniczne zgodne z systemem P1. Możesz zapisać receptę jako wersję roboczą i podpisać ją później."
        },
        "buttons": {
            "addMedication": "Dodaj lek",
            "cancel": "Anuluj",
            "addToPrescription": "Dodaj do recepty",
            "signPrescriptions": "Podpisz recepty "
        },
        "sections": {
            "draftPrescriptions": "Recepty robocze",
            "signedPrescriptions": "Podpisane recepty"
        }
    },

    "medicationSearch": {
        "input": {
            "placeholder": "Wyszukaj lek..."
        },
        "results": {
            "package": "Opakowanie:",
            "noResults": "Nie znaleziono leków. Możesz dodać lek recepturowy."
        }
    },

    "dosageForm": {
        "labels": {
            "dosage": "Dawkowanie",
            "packageCount": "Ilość opakowań",
            "refills": "Liczba powtórzeń",
            "instructions": "Dodatkowe instrukcje"
        },
        "placeholders": {
            "dosage": "np. 1x1, 2x1 rano i wieczorem",
            "instructions": "np. przyjmować po posiłku"
        },
        "suggestions": {
            "title": "Sugerowane schematy:"
        },
        "refillOptions": {
            "none": "Bez powtórzeń",
            "one": "1 powtórzenie",
            "multiple": " powtórzenia"
        }
    },

    "refundationSelect": {
        "label": "Refundacja",
        "options": {
            "fullPrice": "Pełnopłatny",
            "free": "Bezpłatny",
            "lump": "Ryczałt",
            "freeLimit": "Bezpłatny do limitu",
            "senior": "Senior 75+",
            "payment": "Odpłatność "
        }
    },

    "additionalRights": {
        "label": "Uprawnienia dodatkowe",
        "info": "Zaznacz odpowiednie uprawnienia dodatkowe pacjenta. Wpływają one na poziom refundacji leków.",
        "rights": {
            "IB": {
                "name": "Inwalida wojenny",
                "description": "Inwalidzi wojenni oraz osoby represjonowane"
            },
            "IW": {
                "name": "Inwalida wojskowy",
                "description": "Inwalidzi wojskowi"
            },
            "ZK": {
                "name": "Zasłużony honorowy dawca krwi",
                "description": "Zasłużeni honorowi dawcy krwi"
            },
            "C": {
                "name": "Ciąża",
                "description": "Kobiety w ciąży"
            },
            "DN": {
                "name": "Dzieci i młodzież",
                "description": "Dzieci i młodzież do 18 roku życia"
            },
            "AZ": {
                "name": "Akademicki ZOZ",
                "description": "Studenci i uczniowie oraz adiunkci, asystenci i doktoranci"
            }
        }
    },

    "prescriptionSummary": {
        "title": "Recepta",
        "status": {
            "label": "Status: ",
            "draft": "Robocza",
            "issued": "Wystawiona"
        },
        "buttons": {
            "edit": "Edytuj",
            "cancel": "Anuluj",
            "save": "Zapisz",
            "sign": "Podpisz",
            "print": "Drukuj",
            "reissue": "Wystaw ponownie"
        },
        "medication": {
            "dosage": {
                "label": "Dawkowanie",
                "prefix": "Dawkowanie: "
            },
            "quantity": {
                "label": "Ilość opakowań",
                "display": "Ilość:  op."
            },
            "instructions": {
                "label": "Dodatkowe instrukcje",
                "prefix": "Dodatkowe instrukcje: "
            }
        },
        "additionalRights": {
            "title": "Uprawnienia dodatkowe"
        }
    },

    "signingModal": {
        "title": "Podpisywanie e-recepty",
        "methods": {
            "zus": {
                "title": "Certyfikat ZUS",
                "description": "Podpis przy użyciu certyfikatu ZUS"
            },
            "qualified": {
                "title": "Podpis kwalifikowany",
                "description": "Podpis przy użyciu certyfikatu kwalifikowanego"
            },
            "trusted": {
                "title": "Profil Zaufany",
                "description": "Podpis przy użyciu Profilu Zaufanego"
            }
        },
        "buttons": {
            "startSigning": "Rozpocznij podpisywanie",
            "signPrescription": "Podpisz receptę",
            "verifyAndSign": "Weryfikuj i podpisz",
            "complete": "Zakończ"
        },
        "password": {
            "info": "Wprowadź hasło do certyfikatu .",
            "label": "Hasło do certyfikatu",
            "placeholder": "Wprowadź hasło",
            "remember": "Zapamiętaj hasło do końca sesji"
        },
        "verification": {
            "info": "Wprowadź kod weryfikacyjny, który został wysłany na Twój telefon.",
            "label": "Kod weryfikacyjny",
            "placeholder": "Wprowadź kod"
        },
        "processing": {
            "title": "Podpisywanie recepty...",
            "subtitle": "Proszę nie zamykać okna"
        },
        "complete": {
            "title": "Recepta została podpisana",
            "description": "Recepta została pomyślnie podpisana i wysłana do systemu P1. Możesz teraz wydrukować informację dla pacjenta."
        }
    },

    "sickLeaveForm": {
        "title": "e-ZLA",
        "buttons": {
            "removeSickLeave": "Usuń zwolnienie",
            "issueSickLeave": "Wystaw zwolnienie",
            "addPayer": "Dodaj płatnika",
            "cancel": "Anuluj",
            "issuEZLA": "Wystaw e-ZLA"
        },
        "patientInfo": {
            "title": "Informacje o pacjencie",
            "description": "Dane zostaną automatycznie pobrane z systemu ZUS po wprowadzeniu numeru PESEL."
        },
        "sickLeavePeriod": {
            "title": "Okres niezdolności do pracy",
            "dateFrom": "Data od",
            "dateTo": "Data do"
        },
        "hospitalization": {
            "title": "Pobyt w szpitalu"
        },
        "medicalData": {
            "title": "Dane medyczne",
            "statisticalNumber": {
                "label": "Numer statystyczny choroby (ICD-10)",
                "placeholder": "Wyszukaj kod ICD-10"
            },
            "literalCodes": {
                "label": "Kody literowe"
            },
            "recommendations": {
                "label": "Wskazania i zalecenia lekarskie",
                "placeholder": "Np. leżenie w łóżku, przyjmowanie leków, rehabilitacja..."
            }
        },
        "payers": {
            "title": "Płatnicy składek",
            "search": {
                "placeholder": "Wyszukaj płatnika po nazwie lub NIP..."
            },
            "noPayers": "Brak dodanych płatników"
        }
    },

    "stepNavigation": {
        "previous": "Wstecz",
        "next": "Dalej",
        "finish": "Zakończ"
    },

    "navigation": {
        "back": "Wstecz",
        "next": "Dalej",
        "finish": "Zakończ"
    },

    "recommendationsModal": {
        "title": "Zalecenia do Portalu Pacjenta",
        "buttons": {
            "cancel": "Anuluj",
            "save": "Zapisz zalecenia"
        }
    },

    "psychiatricRecommendations": {
        "title": "Zalecenia do Portalu Pacjenta",
        "emergencyContacts": {
            "label": "Udostępnij kontakty kryzysowe w portalu"
        }
    },

    "scalesConfiguration": {
        "title": "Monitorowanie skal",
        "categories": {
            "depression": "Ocena Depresji",
            "anxiety": "Ocena Lęku",
            "mentalHealth": "Ocena Zdrowia Psychicznego",
            "ptsd": "Ocena PTSD i Traumy",
            "addictions": "Ocena Uzależnień",
            "sleep": "Ocena Snu"
        },
        "buttons": {
            "addToMonitoring": "Dodaj do monitorowania",
            "removeMonitoring": "Usuń monitorowanie"
        },
        "labels": {
            "frequency": "Częstotliwość (dni)",
            "startDate": "Data rozpoczęcia",
            "enableReminders": "Włącz przypomnienia"
        }
    },

    "aiFeatures": {
        "title": "Asystent AI",
        "enableAssistant": "Włącz asystenta AI",
        "features": {
            "moodTracking": {
                "label": "Inteligentne śledzenie nastroju",
                "description": "AI analizuje wzorce nastroju i sugeruje interwencje"
            },
            "medicationReminders": {
                "label": "Adaptacyjne przypomnienia o lekach",
                "description": "AI dostosowuje przypomnienia do rytmu dnia pacjenta"
            },
            "crisisIntervention": {
                "label": "Wsparcie kryzysowe",
                "description": "AI wykrywa sygnały ostrzegawcze i sugeruje odpowiednie działania"
            },
            "copingStrategies": {
                "label": "Spersonalizowane strategie radzenia sobie",
                "description": "AI proponuje techniki dopasowane do sytuacji pacjenta"
            }
        }
    },

    "visitSummary": {
        "title": "Podsumowanie wizyty",
        "buttons": {
            "backToEdit": "Wróć do edycji",
            "confirmAndFinish": "Zatwierdź i zakończ wizytę"
        },
        "sections": {
            "patientData": {
                "title": "Dane pacjenta",
                "labels": {
                    "name": "Imię i nazwisko",
                    "pesel": "PESEL",
                    "dateOfBirth": "Data urodzenia"
                }
            },
            "medicalInterview": {
                "title": "Wywiad lekarski",
                "labels": {
                    "mainSymptoms": "Główne dolegliwości:",
                    "symptomsOnset": "Początek objawów:",
                    "currentMedications": "Obecnie przyjmowane leki:",
                    "additionalNotes": "Dodatkowe uwagi:"
                }
            }
        }
    },

    "patientSearch2": {
        "label": "Pacjent",
        "placeholder": "Wyszukaj pacjenta (min. 3 znaki)...",
        "searching": "Wyszukiwanie...",
        "newPatient": "Nowy pacjent",
        "peselLabel": "PESEL"
    },

    "spotlightPage": {
        "title": "Wyróżnione",
        "description": "Bezpieczne udostępnianie zanonimizowanych danych pacjentów do badań klinicznych",
        "tabs": {
            "newSubmission": "Nowe zgłoszenie",
            "mySubmissions": "Moje zgłoszenia"
        }
    },

    "spotlightSubmissions": {
        "title": "Moje zgłoszenia w Wyróżnionych",
        "status": {
            "pending": {
                "label": "Oczekujące"
            },
            "approved": {
                "label": "Zaakceptowane"
            },
            "rejected": {
                "label": "Odrzucone"
            }
        },
        "labels": {
            "patientId": "ID pacjenta",
            "submissionDate": "Data zgłoszenia"
        },
        "buttons": {
            "preview": "Podgląd",
            "includeInStudy": "Włącz do badania"
        }
    },

    "patientSelector": {
        "title": "Wybór pacjenta",
        "search": {
            "placeholder": "Wyszukaj pacjenta po nazwisku lub PESEL..."
        },
        "patientDetails": {
            "age": "Wiek: {age} lat",
            "mainDiagnosis": "Rozpoznanie główne: {diagnosis}",
            "comorbidities": "Choroby współistniejące: {comorbidities}"
        },
        "buttons": {
            "patientHistory": "Historia choroby"
        }
    },

    "patientHistory": {
        "buttons": {
            "back": "Powrót",
            "previous": "Wstecz"
        },
        "steps": {
            "history": {
                "title": "Historia medyczna pacjenta"
            },
            "config": {
                "title": "Konfiguracja anonimizacji"
            },
            "preview": {
                "title": "Podgląd zanonimizowanych danych"
            }
        },
        "patientId": "ID"
    },

    "medicalHistory": {
        "title": "Historia medyczna",
        "anonymizeButton": "Anonimizuj wybrane wizyty",
        "sections": {
            "visitNotes": "Notatka z wizyty",
            "diagnoses": "Rozpoznania",
            "vitals": "Parametry życiowe",
            "medications": "Leki",
            "labResults": "Wyniki badań"
        },
        "diagnoses": {
            "primary": "Główne",
            "secondary": "Współistniejące"
        },
        "vitals": {
            "bloodPressure": "Ciśnienie",
            "heartRate": "Tętno",
            "temperature": "Temperatura"
        },
        "labResults": {
            "referenceRange": "Norma"
        }
    },
    "anonymizationConfig": {
        "title": "Konfiguracja anonimizacji",
        "sections": {
            "demographics": {
                "title": "Dane demograficzne",
                "items": {
                    "age": "Wiek (w przedziałach)",
                    "gender": "Płeć",
                    "education": "Wykształcenie",
                    "occupation": "Status zawodowy",
                    "maritalStatus": "Stan cywilny"
                }
            },
            "clinical": {
                "title": "Dane kliniczne",
                "items": {
                    "symptoms": "Objawy",
                    "onsetDate": "Data początku (względna)",
                    "duration": "Czas trwania",
                    "severity": "Nasilenie objawów",
                    "course": "Przebieg choroby"
                }
            },
            "diagnoses": {
                "title": "Rozpoznania",
                "items": {
                    "primaryDiagnosis": "Rozpoznanie główne",
                    "comorbidities": "Choroby współistniejące",
                    "familyHistory": "Wywiad rodzinny"
                }
            },
            "treatment": {
                "title": "Leczenie",
                "items": {
                    "medicationClasses": "Grupy leków",
                    "medicationDosage": "Dawkowanie",
                    "medicationDuration": "Czas leczenia",
                    "sideEffects": "Działania niepożądane",
                    "treatmentResponse": "Odpowiedź na leczenie"
                }
            },
            "clinicalAssessments": {
                "title": "Oceny kliniczne",
                "items": {
                    "clinicalScales": "Skale kliniczne",
                    "psychometricTests": "Testy psychometryczne",
                    "functionalStatus": "Status funkcjonalny"
                }
            },
            "labResults": {
                "title": "Wyniki badań",
                "items": {
                    "basicLabs": "Podstawowe badania",
                    "imagingResults": "Badania obrazowe",
                    "specializedTests": "Badania specjalistyczne"
                }
            }
        },
        "anonymizationInfo": {
            "title": "Informacja o anonimizacji",
            "description": "Wybrane dane zostaną przetworzone zgodnie z protokołem anonimizacji:",
            "details": [
                "Wiek zostanie przekształcony w przedziały 5-letnie",
                "Daty zostaną zamienione na okresy względne",
                "Nazwy leków będą zastąpione klasami farmakologicznymi",
                "Wyniki badań zostaną przedstawione jako odchylenia od normy",
                "Dane lokalizacyjne zostaną usunięte"
            ]
        },
        "buttons": {
            "next": "Dalej"
        }
    },

    "anonymizationPreview": {
        "title": "Podgląd zanonimizowanych danych",
        "subtitle": "Sprawdź jak będą wyglądać dane po anonimizacji",
        "submitButton": "Prześlij do Wyróżnionych",
        "sections": {
            "demographics": {
                "title": "Dane demograficzne",
                "labels": {
                    "ageRange": "Przedział wiekowy",
                    "gender": "Płeć",
                    "education": "Wykształcenie",
                    "occupation": "Status zawodowy",
                    "maritalStatus": "Stan cywilny"
                }
            },
            "clinical": {
                "title": "Dane kliniczne",
                "labels": {
                    "symptoms": "Objawy",
                    "onset": "Początek",
                    "duration": "Czas trwania",
                    "severity": "Nasilenie",
                    "course": "Przebieg"
                }
            },
            "diagnoses": {
                "title": "Rozpoznania",
                "labels": {
                    "primaryDiagnosis": "Rozpoznanie główne",
                    "comorbidities": "Choroby współistniejące",
                    "familyHistory": "Wywiad rodzinny"
                }
            },
            "treatment": {
                "title": "Leczenie",
                "labels": {
                    "medicationClass": "Grupa leków",
                    "dosage": "Dawkowanie",
                    "duration": "Czas stosowania",
                    "response": "Odpowiedź",
                    "sideEffects": "Działania niepożądane"
                }
            },
            "assessments": {
                "title": "Oceny kliniczne",
                "labels": {
                    "clinicalScales": "Skale kliniczne",
                    "functionalStatus": "Status funkcjonalny"
                }
            },
            "labResults": {
                "title": "Wyniki badań",
                "labels": {
                    "basicLabs": "Badania podstawowe"
                }
            }
        },
        "anonymizationInfo": {
            "title": "Informacja o anonimizacji",
            "details": [
                "Dane osobowe zostały całkowicie usunięte",
                "Wiek został przekształcony w przedział wiekowy",
                "Daty zostały zamienione na względne okresy czasu",
                "Nazwy leków zastąpiono klasami farmakologicznymi",
                "Zachowano informacje o dawkowaniu leków",
                "Wyniki badań przedstawiono jako odchylenia od normy",
                "Dane lokalizacyjne zostały usunięte"
            ]
        }
    },

    "interactiveGuide": {
        "steps": {
            "patientSearch": {
                "title": "Wyszukiwanie pacjentów",
                "content": "Tutaj możesz szybko znaleźć pacjenta wpisując jego nazwisko lub PESEL."
            },
            "newVisit": {
                "title": "Nowa wizyta",
                "content": "Kliknij tutaj, aby rozpocząć nową wizytę. Kreator przeprowadzi Cię przez cały proces."
            },
            "aiAssistant": {
                "title": "Asystent AI",
                "content": "Asystent AI pomoże Ci w diagnozie, dokumentacji i podejmowaniu decyzji klinicznych."
            }
        },
        "navigation": {
            "finish": "Zakończ",
            "next": "Dalej"
        }
    },

    "patientCard": {
        "patientInfo": {
            "pesel": "PESEL",
            "id": "ID"
        },
        "buttons": {
            "close": "Zamknij",
            "edit": "Edytuj dane"
        }
    },

    "basicInfo": {
        "title": "DANE PODSTAWOWE",
        "fields": {
            "pesel": "PESEL:",
            "dateOfBirth": "Data urodzenia:"
        }
    },

    addressInfo: {
        title: "ADRES",
    },

    "insurance": {
        "title": "UBEZPIECZENIE",
        "fields": {
            "type": "Rodzaj:",
            "number": "Numer:",
            "validUntil": "Ważne do:"
        }
    },
    patient_portal: {
        title: "PORTAL PACJENTA / POWIADOMIENIA",
        active: "Aktywne",
        inactive: "Brak",
        notifications: "Powiadomienia"
    },

    consent: {
        title: "ZGODA NA PRZETWARZANIE DANYCH OSOBOWYCH"
    },

    authorizedPersons: {
        title: "OSOBY UPOWAŻNIONE ORAZ WYKAZ UDOSTĘPNIONEJ DOKUMENTACJI MEDYCZNEJ",
        validUntil: "Ważne do:"
    },
    employer: {
        title: "PRACODAWCA"
    }
    ,

    "todayPatientsModal": {
        "title": "Dzisiejsze wizyty",
        "tableHeaders": {
            "time": "Godzina",
            "patient": "Pacjent",
            "status": "Status",
            "type": "Typ",
            "actions": "Akcje"
        }
    },

    "pendingReports": {
        "title": "Oczekujące Raporty",
        "deadline": "Termin: {{date}}",
        "priority": {
            "low": "Niski",
            "medium": "Średni",
            "high": "Wysoki"
        }
    },

    "scheduledVisits": {
        "title": "Zaplanowane Wizyty"
    },

    completedVisits: {
        "title": "Zakończone Wizyty"
    },
    "loadingOverlay": {
        "title": "Analiza danych klinicznych",
        "processing": "Przetwarzanie wybranych informacji...",
        "steps": [
            "Analiza danych historycznych",
            "Przetwarzanie wyników badań",
            "Generowanie rekomendacji"
        ]
    },

    "formErrors": {
        "required": "To pole jest wymagane",
        "peselFormat": "PESEL musi zawierać dokładnie 11 cyfr",
        "phoneFormat": "Numer telefonu musi zawierać 9 cyfr",
        "postalCodeFormat": "Kod pocztowy powinien być w formacie XX-XXX",
        "emailFormat": "Proszę wprowadzić poprawny adres email",
        "dateInvalid": "Proszę wprowadzić poprawną datę",
        "spaces": "Nie można zaczynać od spacji",
        "invalidAgeFormat": "Nieprawidłowy format wieku"
    },

    "basicInfoFormErrors": {
        "required": "To pole jest wymagane",
        "peselFormat": "PESEL musi zawierać dokładnie 11 cyfr",
        "phoneFormat": "Wprowadź poprawny numer telefonu",
        "emailFormat": "Wprowadź poprawny adres email",
        "dateInvalid": "Wprowadź poprawną datę",
        "minLength": "Minimum {min} znaków",
        "maxLength": "Maksymalnie {max} znaków",
        "numberOnly": "Wprowadź tylko cyfry",
        "invalidFormat": "Nieprawidłowy format",
        "passwordMismatch": "Hasła nie są zgodne",
        "alphabetOnly": "Dozwolone są tylko litery alfabetu"
    },

    "insurance_form2": {
        "nfz": {
            "title": "Narodowy Fundusz Zdrowia (NFZ)",
            "branch": "Oddział NFZ",
            "additional_rights": "Dodatkowe uprawnienia",
            "branches": {
                "dolnoslaskie": "Dolnośląski",
                "kujawsko_pomorskie": "Kujawsko-Pomorski",
                "lubelskie": "Lubelski",
                "lubuskie": "Lubuski",
                "lodzkie": "Łódzki",
                "malopolskie": "Małopolski",
                "mazowieckie": "Mazowiecki",
                "opolskie": "Opolski",
                "podkarpackie": "Podkarpacki",
                "podlaskie": "Podlaski",
                "pomorskie": "Pomorski",
                "slaskie": "Śląski",
                "swietokrzyskie": "Świętokrzyski",
                "warminsko_mazurskie": "Warmińsko-Mazurski",
                "wielkopolskie": "Wielkopolski",
                "zachodniopomorskie": "Zachodniopomorski"
            },
            "rights": {
                "none": "Brak",
                "ib": "IB",
                "in": "IN",
                "iz": "IZ",
                "dn": "DN",
                "cn": "CN"
            }
        },
        "private": {
            "title": "Ubezpieczenie prywatne",
            "search_placeholder": "Szukaj ubezpieczycieli",
            "no_insurers": "Nie dodano prywatnych ubezpieczycieli",
            "add_insurer": "Dodaj ubezpieczyciela",
            "add_new_insurer": "Dodaj nowego ubezpieczyciela",
            "insurer_name": "Nazwa ubezpieczyciela",
            "policy": "Numer polisy",
            "policy_number": "Numer polisy",
            "valid_until": "Ważne do",
            "new_insurer": "Nowy ubezpieczyciel"
        },
        "submit": "Zapisz"
    },
    "formErrors2": {
        "required": "To pole jest wymagane",
        "postalCodeFormat": "Nieprawidłowy format kodu pocztowego. Użyj XX-XXX",
        "phoneFormat": "Nieprawidłowy format numeru telefonu",
        "emailFormat": "Nieprawidłowy format adresu email",
        "policyNumberFormat": "Nieprawidłowy format numeru polisy"
    },

    "employer_form2": {
        "sections": {
            "employer": "Informacje o pracodawcy",
            "address": "Adres pracodawcy"
        },
        "fields": {
            "employer_name": "Nazwa pracodawcy",
            "employer_nip": "NIP",
            "fill_from_nip": "Wypełnij z NIP",
            "occupation": "Zawód",
            "production_symbol": "Symbol produkcji",
            "street": "Ulica",
            "house_number": "Numer domu",
            "apartment_number": "Numer mieszkania",
            "postal_code": "Kod pocztowy",
            "city": "Miasto",
            "voivodeship": "Województwo",
            "country": "Kraj"
        },
        "voivodeships": {
            "dolnoslaskie": "Dolnośląskie",
            "kujawsko_pomorskie": "Kujawsko-Pomorskie",
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
            "warminsko_mazurskie": "Warmińsko-Mazurskie",
            "wielkopolskie": "Wielkopolskie",
            "zachodniopomorskie": "Zachodniopomorskie"
        },
        "countries": {
            "PL": "Polska",
            "DE": "Niemcy",
            "GB": "Wielka Brytania",
            "FR": "Francja",
            "US": "Stany Zjednoczone",
            "CZ": "Czechy",
            "SK": "Słowacja",
            "UA": "Ukraina"
        },
        "submit": "Zapisz"
    },
    "employer_formErrors": {
        "required": "To pole jest wymagane",
        "postalCodeFormat": "Nieprawidłowy format kodu pocztowego. Użyj XX-XXX",
        "nipFormat": "NIP musi zawierać 10 cyfr",
        "phoneFormat": "Nieprawidłowy format numeru telefonu",
        "emailFormat": "Nieprawidłowy format adresu email"
    },

    "authorized_persons_form": {
        "toggles": {
            "no_authorized_persons": "Brak osób upoważnionych",
            "current_version_signed": "Aktualna wersja podpisana"
        },
        "buttons": {
            "no_authorization_statement": "Oświadczenie o braku upoważnienia",
            "add_authorized_person": "Dodaj osobę upoważnioną"
        },
        "sections": {
            "documentation_access": "Historia dostępu do dokumentacji"
        },
        "messages": {
            "no_authorized_persons": "Nie dodano żadnych osób upoważnionych. Użyj przycisku 'Dodaj osobę upoważnioną' aby dodać kogoś.",
            "no_documentation_records": "Brak dostępnych rekordów dostępu do dokumentacji."
        },
        "card": {
            "unnamed_person": "Osoba bez nazwy"
        },
        "fields": {
            "first_name": "Imię",
            "last_name": "Nazwisko",
            "relationship": "Relacja",
            "pesel": "PESEL",
            "phone": "Numer telefonu",
            "email": "Email",
            "address": "Adres",
            "document_type": "Typ dokumentu",
            "document_number": "Numer dokumentu",
            "valid_until": "Ważne do"
        },
        "relationships": {
            "spouse": "Małżonek",
            "parent": "Rodzic",
            "child": "Dziecko",
            "sibling": "Rodzeństwo",
            "other": "Inne"
        },
        "document_types": {
            "id_card": "Dowód osobisty",
            "passport": "Paszport",
            "residence_card": "Karta pobytu",
            "other": "Inny"
        },
        "modal": {
            "add_title": "Dodaj osobę upoważnioną",
            "edit_title": "Edytuj osobę upoważnioną"
        },
        "submit": "Zapisz"
    },
    "authorized_persons_formErrors": {
        "required": "To pole jest wymagane",
        "peselFormat": "PESEL musi zawierać 11 cyfr",
        "phoneFormat": "Nieprawidłowy format numeru telefonu",
        "emailFormat": "Nieprawidłowy format adresu email",
        "dateFormat": "Nieprawidłowy format daty"
    },

    "medications_form": {
        "sections": {
            "regular": "Leki regularnie przyjmowane",
            "asNeeded": "Leki przyjmowane w razie potrzeby (PRN)",
            "history": "Historia leków"
        },
        "buttons": {
            "addMedication": "Dodaj lek",
            "end": "Zakończ",
            "add": "Dodaj",
            "cancel": "Anuluj",
            "delete": "Usuń",
            "submit": "Zapisz"
        },
        "medicationCard": {
            "dosage": "Dawkowanie:",
            "from": "Od",
            "notes": "Uwagi:",
            "currently": "Obecnie"
        },
        "modal": {
            "title": "Dodaj lek",
            "searchPlaceholder": "Szukaj leków...",
            "regularMedication": "Lek regularny (przyjmowany według harmonogramu)",
            "notesPlaceholder": "Dodaj dodatkowe uwagi dotyczące tego leku...",
            "fields": {
                "name": "Nazwa leku",
                "commonName": "Nazwa powszechna (generyczna)",
                "form": "Forma",
                "dose": "Dawka",
                "dosage": "Instrukcje dawkowania",
                "startDate": "Data rozpoczęcia",
                "notes": "Uwagi"
            }
        },
        "forms": {
            "tablet": "Tabletka",
            "capsule": "Kapsułka",
            "liquid": "Płyn",
            "injection": "Zastrzyk",
            "inhaler": "Inhalator",
            "patch": "Plaster",
            "cream": "Krem",
            "other": "Inne"
        },
        "confirmDelete": "Usuń lek",
        "confirmDeleteMessage": "Czy na pewno chcesz usunąć ten lek? Tej operacji nie można cofnąć.",
        "confirmEnd": "Zakończ lek",
        "confirmEndMessage": "Czy na pewno chcesz zakończyć stosowanie tego leku? Zostanie przeniesiony do historii leków.",
        "noMedications": {
            "regular": "Brak regularnie przyjmowanych leków",
            "asNeeded": "Brak leków przyjmowanych w razie potrzeby",
            "history": "Brak historii leków"
        }
    },
    "medications_formErrors": {
        "required": "To pole jest wymagane",
        "invalidDose": "Wprowadź prawidłową dawkę"
    },

    "diagnoses_form": {
        "sections": {
            "active": "Aktywne diagnozy",
            "history": "Historia diagnoz"
        },
        "buttons": {
            "addDiagnosis": "Dodaj diagnozę",
            "add": "Dodaj",
            "cancel": "Anuluj",
            "delete": "Usuń",
            "submit": "Zapisz"
        },
        "fields": {
            "description": "Opis",
            "code": "Kod",
            "type": "Typ",
            "notes": "Uwagi"
        },
        "diagnosisCard": {
            "type": {
                "primary": "Główne",
                "secondary": "Współistniejące"
            },
            "from": "Od ",
            "notes": "Uwagi",
            "status": {
                "active": "Aktywne",
                "remission": "Remisja",
                "resolved": "Wyleczone"
            }
        },
        "modal": {
            "title": "Dodaj diagnozę",
            "searchPlaceholder": "Szukaj po kodzie ICD-10 lub nazwie diagnozy...",
            "noResultsFound": "Nie znaleziono pasujących diagnoz",
            "category": "Kategoria:",
            "diagnosticCriteria": "Kryteria diagnostyczne:",
            "diagnosisType": {
                "label": "Typ diagnozy",
                "primary": "Diagnoza główna",
                "secondary": "Diagnoza współistniejąca"
            },
            "notes": {
                "label": "Uwagi",
                "placeholder": "Dodaj dodatkowe uwagi dotyczące tej diagnozy..."
            }
        },
        "confirmDelete": "Usuń diagnozę",
        "confirmDeleteMessage": "Czy na pewno chcesz usunąć tę diagnozę? Tej operacji nie można cofnąć.",
        "noDiagnoses": {
            "active": "Brak aktywnych diagnoz",
            "history": "Brak historii diagnoz"
        }
    },
    "diagnoses_formErrors": {
        "required": "To pole jest wymagane",
        "notesTooLong": "Uwagi nie mogą przekraczać 500 znaków"
    },
    "allergies_form": {
        "modal": {
            "title": "Dodaj alergię",
            "allergyType": {
                "label": "Rodzaj alergii",
                "drug": "Lek/Medykament",
                "food": "Żywność",
                "environmental": "Środowiskowa",
                "other": "Inna"
            },
            "allergenName": {
                "label": "Nazwa alergenu",
                "placeholder": "Wprowadź nazwę alergenu..."
            },
            "reaction": {
                "label": "Reakcja",
                "placeholder": "Opisz reakcję alergiczną..."
            },
            "severity": {
                "label": "Nasilenie",
                "mild": "Łagodne",
                "moderate": "Umiarkowane",
                "severe": "Ciężkie"
            },
            "notes": {
                "label": "Uwagi",
                "placeholder": "Dodaj dodatkowe uwagi dotyczące tej alergii..."
            }
        },
        "buttons": {
            "add": "Dodaj",
            "cancel": "Anuluj",
            "delete": "Usuń",
            "submit": "Zapisz"
        }
    },
    "allergies_formErrors": {
        "required": "To pole jest wymagane",
        "allergenNameTooShort": "Nazwa alergenu musi zawierać co najmniej 2 znaki",
        "reactionTooShort": "Proszę podać więcej szczegółów dotyczących reakcji"
    },

    "riskFactors_form": {
        "title": "Czynniki ryzyka",
        "confirmDelete": "Czy na pewno chcesz usunąć ten czynnik ryzyka?",
        "buttons": {
            "addFactor": "Dodaj czynnik ryzyka",
            "add": "Dodaj",
            "cancel": "Anuluj"
        },
        "modal": {
            "title": "Dodaj czynnik ryzyka",
            "category": {
                "label": "Kategoria ryzyka",
                "placeholder": "Wybierz kategorię ryzyka..."
            },
            "factor": {
                "label": "Czynnik ryzyka",
                "placeholder": "Wprowadź lub wybierz czynnik ryzyka...",
                "tooltip": "Wybierz konkretny czynnik ryzyka lub wprowadź własny"
            },
            "riskLevel": {
                "label": "Poziom ryzyka",
                "low": "Niski",
                "moderate": "Umiarkowany",
                "high": "Wysoki"
            },
            "notes": {
                "label": "Uwagi",
                "placeholder": "Dodaj dodatkowe uwagi dotyczące tego czynnika ryzyka..."
            }
        },
        "factorCard": {
            "category": "Kategoria:",
            "notes": "Uwagi:",
            "noFactors": "Brak zarejestrowanych czynników ryzyka"
        },
        "categories": {
            "lifestyle": "Styl życia",
            "genetic": "Genetyczne",
            "medical": "Historia medyczna",
            "environmental": "Środowiskowe"
        },
        "factors": {
            "lifestyle": {
                "smoking": "Palenie tytoniu",
                "alcohol": "Spożycie alkoholu",
                "sedentary": "Siedzący tryb życia",
                "diet": "Zła dieta"
            },
            "genetic": {
                "family_heart": "Rodzinna historia chorób serca",
                "family_diabetes": "Rodzinna historia cukrzycy",
                "family_cancer": "Rodzinna historia nowotworów"
            },
            "medical": {
                "hypertension": "Nadciśnienie",
                "diabetes": "Cukrzyca",
                "obesity": "Otyłość",
                "cholesterol": "Wysoki poziom cholesterolu"
            },
            "environmental": {
                "pollution": "Zanieczyszczenie powietrza",
                "occupational": "Zagrożenia zawodowe",
                "radiation": "Narażenie na promieniowanie"
            }
        }
    },
    "risk_formErrors": {
        "required": "To pole jest wymagane",
        "factorTooShort": "Czynnik ryzyka musi zawierać co najmniej 2 znaki"
    },

    "eventDetail": {
        "title": "Szczegóły wydarzenia",
        "patient": "Pacjent",
        "visitDetails": "Szczegóły wizyty",
        "visitType": "Rodzaj wizyty",
        "specialization": "Specjalizacja",
        "status": "Status",
        "appointmentType": "Typ wizyty",
        "location": "Lokalizacja",
        "doctor": "Lekarz",
        "notes": "Notatki",
        "actions": {
            "cancel": "Anuluj",
            "edit": "Edytuj"
        },
        "statuses": {
            "scheduled": "Zaplanowane",
            "confirmed": "Potwierdzone",
            "in-progress": "W trakcie",
            "completed": "Zakończone",
            "cancelled": "Anulowane"
        },
        "types": {
            "nfz": "Publiczna Opieka Zdrowotna (NFZ)",
            "private": "Prywatne"
        }
    },
    "weekDays": {
        "monday": "Pon",
        "tuesday": "Wt",
        "wednesday": "Śr",
        "thursday": "Czw",
        "friday": "Pt",
        "saturday": "Sob",
        "sunday": "Ndz"
    },
    "documentForm": {
        "title": "Dokumentacja medyczna",
        "search": {
            "placeholder": "Szukaj w dokumentach..."
        },
        "buttons": {
            "filter": "Filtruj",
            "export": "Eksportuj",
            "newDocument": "Nowy dokument"
        },
        "noDocuments": "Nie znaleziono dokumentów"
    },
    "documentCard": {
        "buttons": {
            "view": "Podgląd",
            "download": "Pobierz"
        },
        "author": "Autor"
    },
    "documentUploadModal": {
        "title": "Dodaj nowy dokument",
        "form": {
            "category": {
                "label": "Kategoria dokumentu",
                "placeholder": "Wybierz kategorię",
                "options": {
                    "laboratories": "Wyniki laboratoryjne",
                    "informedConsent": "Świadoma zgoda"
                }
            },
            "file": {
                "label": "Plik dokumentu",
                "dragText": "Kliknij lub przeciągnij plik tutaj, aby go przesłać",
                "hint": "Obsługa pojedynczego pliku. Formaty PDF, DOC, DOCX, JPG, PNG."
            },
            "description": {
                "label": "Opis",
                "placeholder": "Wprowadź opis dokumentu tutaj..."
            }
        },
        "buttons": {
            "cancel": "Anuluj",
            "upload": "Prześlij dokumenty",
            "addDocument": "Dodaj dokument",
            "updateDocument": "Aktualizuj dokument"
        },
        "documentsList": {
            "title": "Dokumenty do przesłania"
        }
    },
    "documetn_formErrors": {
        "required": "To pole jest wymagane",
        "fileRequired": "Proszę przesłać plik"
    },

    "consentCard": {
        "granted": "Udzielona",
        "noConsent": "Brak zgody",
        "withdraw": "Wycofaj",
        "grantConsent": "Udziel zgody",
        "viewDocument": "Zobacz dokument",
        "withdrawConfirmTitle": "Wycofaj zgodę",
        "withdrawConfirmText": "Czy na pewno chcesz wycofać tę zgodę? Tej akcji nie można cofnąć."
    },
    "consent_form": {
        "title": "Zgoda na przetwarzanie danych osobowych",
        "submit": "Zapisz zmiany",
        "saveSuccess": "Zgody zostały pomyślnie zapisane",
        "saveError": "Nie udało się zapisać zgód",
        "legalNotice": "Zgodnie z polskim prawem, zgoda pacjenta wymaga podpisanego dokumentu. Proszę przesłać zeskanowaną kopię podpisanego formularza zgody."
    },
    "consentUpload": {
        "title": "Prześlij dokument zgody",
        "instruction": "Proszę przesłać zeskanowaną kopię podpisanego formularza zgody przed udzieleniem zgody.",
        "selectFile": "Wybierz plik",
        "upload": "Prześlij i udziel zgody",
        "fileRequired": "Proszę przesłać dokument",
        "fileSizeError": "Plik musi być mniejszy niż 5MB",
        "fileTypeError": "Dozwolone są tylko pliki PDF, PNG i JPG",
        "fileRequirements": "Akceptowane typy plików: PDF, JPG, PNG. Maksymalny rozmiar: 5MB.",
        "uploadSuccess": "Dokument przesłany i zgoda udzielona pomyślnie",
        "uploadError": "Nie udało się przesłać dokumentu",
        "previewNotAvailable": "Podgląd nie jest dostępny dla tego typu pliku"
    },
    "consentTypes": {
        "personalData": {
            "title": "Przetwarzanie danych osobowych",
            "description": "Wyrażam zgodę na przetwarzanie moich danych osobowych w celu świadczenia usług medycznych zgodnie z RODO."
        },
        "medicalDocs": {
            "title": "Udostępnianie dokumentacji medycznej",
            "description": "Wyrażam zgodę na udostępnianie mojej dokumentacji medycznej osobom upoważnionym oraz innym placówkom medycznym w celu kontynuacji leczenia."
        },
        "electronicComm": {
            "title": "Komunikacja elektroniczna",
            "description": "Wyrażam zgodę na otrzymywanie informacji medycznych i organizacyjnych drogą elektroniczną (email, SMS)."
        }
    },
    "aiAnalysis": {
        "header": {
            "title": "Analiza statystyczna AI",
            "subtitle": "Zaawansowana analiza danych klinicznych wspierana sztuczną inteligencją"
        },
        "tabs": {
            "analysis": "Analiza",
            "summary": "Podsumowanie",
            "recommendations": "Rekomendacje"
        },
        "filterForm": {
            "timeRange": "Zakres czasu",
            "lastMonth": "Ostatni miesiąc",
            "lastWeek": "Ostatni tydzień",
            "lastYear": "Ostatni rok",
            "branch": "Oddział",
            "allBranches": "Wszystkie oddziały",
            "cardiology": "Kardiologia",
            "neurology": "Neurologia",
            "surgery": "Chirurgia",
            "doctors": "Lekarze",
            "allDoctors": "Wszyscy lekarze",
            "metrics": "Metryki",
            "visits": "Wizyty",
            "recognitions": "Rozpoznania"
        },
        "statCards": {
            "visits": "Wizyty",
            "avgTimeToRemission": "Średni czas do remisji",
            "treatmentEffectiveness": "Skuteczność leczenia",
            "adherence": "Adherencja",
            "vsPreviousPeriod": "+{{percentage}}% vs\n poprzedni okres"
        },
        "charts": {
            "diagnosticTrends": "Trendy diagnostyczne",
            "treatmentResults": "Wyniki leczenia",
            "remission": "Remisja",
            "partial": "Częściowa",
            "stabilize": "Stabilizacja",
            "noImprovement": "Brak pop."
        },
        "conclusions": {
            "title": "Wnioski AI",
            "subtitle": "Wspierane zaawansowanymi algorytmami uczenia maszynowego",
            "clinicalPatterns": "Wzorce kliniczne",
            "pattern1": "Zaobserwowano 23% wzrost rozpoznań F32.1 (Epizod depresyjny umiarkowany) w grupie wiekowej 25-35 lat. Główne czynniki ryzyka: stres zawodowy, izolacja społeczna.",
            "pattern2": "Skuteczność terapii wzrosła o 15% przy wczesnej interwencji (do 2 tygodni od pierwszych objawów) i regularnym monitorowaniu z użyciem skal klinicznych.",
            "therapeuticRecommendations": "Rekomendacje terapeutyczne",
            "recommendation1": "Pacjenci z kombinacją farmakoterapii i psychoterapii wykazują o 35% wyższą skuteczność leczenia w porównaniu do monoterapii.",
            "recommendation2": "Zidentyfikowano wzrost ryzyka przerwania leczenia w 4-6 tygodniu terapii. Zalecane wdrożenie dodatkowego wsparcia i monitoringu w tym okresie."
        },
        "demographics": {
            "title": "Demografia pacjentów",
            "middleAge": "Średni wiek",
            "middleAgeValue": "42,5 lat",
            "genderDistribution": "Rozkład płci",
            "genderDistributionValue": "K: 65% | M: 35%",
            "newPatients": "Nowi pacjenci",
            "newPatientsValue": "+124 (30d)"
        },
        "treatmentMetrics": {
            "title": "Metryki leczenia",
            "avgTherapyLength": "Średnia długość terapii",
            "avgTherapyLengthValue": "4,2 miesiąca",
            "remissionRate": "Wskaźnik remisji",
            "remissionRateValue": "72,5%",
            "continuationOfTreatment": "Kontynuacja leczenia",
            "continuationOfTreatmentValue": "85,4%"
        },
        "qualityIndicators": {
            "title": "Wskaźniki jakości",
            "patientSatisfaction": "Satysfakcja pacjentów",
            "patientSatisfactionValue": "4,8/5,0",
            "readmissions": "Readmisje",
            "readmissionsValue": "3,2%",
            "documentationCompleteness": "Kompletność dokumentacji",
            "documentationCompletenessValue": "98,7%"
        }
    },
    "aiAssistant": {
        "header": {
            "title": "Asystenci AI",
            "subtitle": "Zaawansowane narzędzia AI wspierające pracę lekarza"
        },
        "tabs": {
            "remediusConsult": "Remedius Konsultacja",
            "remediusPathfinder": "Remedius Pathfinder",
            "pharmacopedia": "Farmakopedia",
            "diagnosis": "Diagnoza",
            "clinicalTrials": "Badania kliniczne",
            "statisticalAnalysis": "Analiza statystyczna"
        },
        "consultChat": {
            "visitHistory": "Historia wizyt",
            "clinicalAssistant": "Asystent kliniczny",
            "selectionDesc": "Rozpocznij nową sesję konsultacyjną, aby uzyskać wsparcie medyczne oparte na AI",
            "selectSpecialty": "Wybierz specjalizację",
            "chooseSpecialty": "Wybierz specjalizację",
            "startNewConsultation": "+ Rozpocznij nową konsultację",
            "childPsychiatry": "Psychiatria dziecięca",
            "adultPsychiatry": "Psychiatria dorosłych",
            "internalMedicine": "Medycyna wewnętrzna",
            "childPsychShort": "Psych. dziec.",
            "adultPsychShort": "Psych. dorosł.",
            "internalShort": "Internista",
            "generalShort": "Ogólna",
            "session": "Sesja",
            "askPlaceholder": "Zapytaj o stan pacjenta...",
            "aiThinking": "AI myśli...",
            "sessionDeletedSuccess": "Sesja została pomyślnie usunięta",
            "failedDeleteSession": "Nie udało się usunąć sesji",
            "failedStartSession": "Nie udało się rozpocząć sesji konsultacji. Spróbuj ponownie.",
            "failedAiResponse": "Nie udało się uzyskać odpowiedzi AI. Spróbuj ponownie.",
            "welcomeMessage": "Witaj! Jestem Twoim asystentem AI ds. {{specialty}}. Pomagam w oparciu o wytyczne kliniczne oparte na dowodach. Jak mogę pomóc w przypadku pacjenta?",
            "simulationMode": "Symulacja: Jestem w trybie lokalnym, ponieważ nie nawiązono sesji."
        },
        "pharmacopedia": {
            "title": "Farmakopedia",
            "drugQueries": "Zapytania o leki",
            "query": "Zapytanie",
            "landingDesc": "Uzyskaj informacje o lekach oparte na dowodach z przewodnika Stahl's Essential Psychopharmacology z wyszukiwaniem wspieranym przez AI.",
            "startNewQuery": "+ Nowe zapytanie",
            "creating": "Tworzenie...",
            "askPlaceholder": "Zapytaj o leki...",
            "aiThinking": "AI myśli...",
            "ragEnhanced": "AI z RAG",
            "welcomeMessage": "Witaj w Farmakopedii! Mogę pomóc z informacjami o lekach, wytycznymi dawkowania, interakcjami i skutkami ubocznymi. O czym chcesz się dowiedzieć?",
            "failedCreateQuery": "Nie udało się utworzyć nowego zapytania. Spróbuj ponownie.",
            "queryDeletedSuccess": "Zapytanie zostało pomyślnie usunięte",
            "failedDeleteQuery": "Nie udało się usunąć zapytania. Spróbuj ponownie.",
            "failedAiResponse": "Nie udało się uzyskać odpowiedzi AI. Spróbuj ponownie."
        },
        "diagnosis": {
            "title": "Asystent diagnozy różnicowej",
            "symptoms": "Objawy",
            "enterSymptom": "Wprowadź objaw...",
            "add": "+ Dodaj",
            "analyze": "Analizuj"
        },
        "clinicalTrials": {
            "diagnosis": "Diagnoza",
            "diagnosisPlaceholder": "np. Migrena",
            "location": "Lokalizacja",
            "locationPlaceholder": "np. Warszawa",
            "searching": "Wyszukiwanie...",
            "searchTrials": "Szukaj badań",
            "foundTrials": "Znalezione badania ({{count}})",
            "id": "ID",
            "sponsor": "Sponsor",
            "phase": "Faza",
            "inclusionCriteria": "Kryteria włączenia:",
            "exclusionCriteria": "Kryteria wykluczenia:",
            "details": "Szczegóły",
            "noResults": "Nie znaleziono badań klinicznych dla Twojego zapytania.",
            "enterDiagnosis": "Wprowadź diagnozę",
            "fetchFailed": "Nie udało się pobrać badań klinicznych"
        },
        "pathfinder": {
            "title": "Remedius Pathfinder",
            "subtitle": "Asystent publikacji naukowych wspierany AI",
            "heroTitle": "Utwórz swój pierwszy projekt badawczy",
            "heroDesc": "Prześlij dokumenty, ustaw temat badawczy i generuj publikacje akademickie z pomocą AI",
            "researchTopic": "Temat badawczy",
            "researchTopicPlaceholder": "Wprowadź temat badawczy lub obszar zainteresowań...",
            "uploadDocuments": "Prześlij dokumenty",
            "uploadText": "Dotknij, aby przeglądać i przesyłać pliki",
            "uploadSubText": "Obsługuje PDF, DOC, DOCX (maks. 25MB każdy)",
            "chooseFiles": "Wybierz pliki",
            "researchConfig": "Konfiguracja badania",
            "hideAdvanced": "Ukryj opcje zaawansowane",
            "showAdvanced": "Pokaż opcje zaawansowane",
            "contentType": "Typ treści",
            "citationStyle": "Styl cytowania",
            "keywordsFocus": "Słowa kluczowe/Fokus",
            "researchPrompt": "Prompt badawczy",
            "createProject": "Utwórz projekt",
            "createFooter": "Projekt zostanie utworzony z wybraną konfiguracją",
            "researchProjects": "Projekty\nbadawcze",
            "newProject": "Nowy\nprojekt",
            "noProjectsYet": "Brak projektów badawczych",
            "createFirstProject": "Utwórz swój pierwszy projekt badawczy",
            "contentTypes": {
                "literatureReview": "Przegląd literatury",
                "introduction": "Wprowadzenie",
                "methodology": "Metodologia",
                "discussion": "Dyskusja",
                "summary": "Podsumowanie",
                "fullArticle": "Pełny artykuł (szkic)"
            }
        },
        "statisticalAnalysis": {
            "title": "Analiza statystyczna",
            "subtitle": "Kompleksowy wgląd w wyniki Twojej placówki",
            "exportReport": "Eksportuj raport",
            "select": "Wybierz",
            "lastMonth": "Ostatni miesiąc",
            "lastQuarter": "Ostatni kwartał",
            "lastYear": "Ostatni rok",
            "totalVisits": "Łączne wizyty",
            "overallTotal": "Ogółem",
            "totalPatients": "Łączna liczba pacjentów",
            "uniquePatients": "Unikalni pacjenci",
            "referrals": "Skierowania",
            "totalReferrals": "Łączne skierowania",
            "todaysVisits": "Dzisiejsze wizyty",
            "scheduledForToday": "Zaplanowane na dziś",
            "tabs": {
                "overview": "Przegląd",
                "clinical": "Kliniczne",
                "demographics": "Demografia",
                "referrals": "Skierowania"
            },
            "charts": {
                "visitsOverTime": "Wizyty w czasie",
                "visitStatus": "Status wizyt",
                "visitTypes": "Typy wizyt",
                "modalityDistribution": "Rozkład modalności",
                "topDiagnoses": "Najczęstsze rozpoznania",
                "noDiagnosisData": "Brak danych diagnostycznych za ten okres",
                "genderDistribution": "Rozkład płci",
                "ageGroups": "Grupy wiekowe",
                "patientsByCity": "Rozkład pacjentów wg miasta",
                "referralStatus": "Status skierowań",
                "pending": "oczekujące",
                "topSpecializations": "Najczęstsze specjalizacje"
            },
            "export": {
                "timeframe": "Okres",
                "generatedAt": "Wygenerowano",
                "summarySection": "Podsumowanie",
                "label": "Etykieta",
                "value": "Wartość",
                "noData": "Brak danych do eksportu. Poczekaj na załadowanie statystyk.",
                "error": "Nie udało się wyeksportować raportu. Spróbuj ponownie."
            }
        }
    },
    employee_modals: {
        add_employee: {
            title_doctor: "Dodaj Lekarza",
            title_nurse: "Dodaj Pielęgniarkę/Położną",
            title_receptionist: "Dodaj Pracownika Recepcji",
            labels: {
                firstName: "Imię",
                lastName: "Nazwisko",
                email: "Email",
                confirmEmail: "Potwierdź Email",
                pwzNumber: "Numer PWZ",
                peselNumber: "Numer PESEL",
                offices: "Gabinety"
            },
            placeholders: {
                offices: "Wybierz gabinety"
            },
            warning: "Dodając użytkownika do konta placówki, potwierdzasz, że użytkownik ten po zaakceptowaniu zaproszenia i Twoim potwierdzeniu będzie miał dostęp do danych Twojej placówki. Pamiętaj, aby uprawnienia takie nadawać tylko osobom upoważnionym.",
            buttons: {
                cancel: "Anuluj",
                add_doctor: "Dodaj Lekarza",
                add_nurse: "Dodaj Pielęgniarkę",
                add_receptionist: "Dodaj Recepcjonistę"
            },
            alerts: {
                required_fields: "Proszę wypełnić wszystkie wymagane pola.",
                email_mismatch: "Adresy email nie zgadzają się.",
                success: "Zaproszenie dla {{role}} zostało wysłane pomyślnie.",
                error: "Wystąpił błąd podczas dodawania {{role}}."
            }
        },
        edit_employee: {
            title: "Edytuj Pracownika",
            labels: {
                firstName: "Imię",
                lastName: "Nazwisko",
                email: "Email",
                pesel: "PESEL",
                status: "Status",
                assignedOffices: "Przypisane Gabinety"
            },
            placeholders: {
                status: "Wybierz status",
                addOffice: "Dodaj gabinet"
            },
            status: {
                active: "Aktywny",
                inactive: "Nieaktywny"
            },
            buttons: {
                cancel: "Anuluj",
                save: "Zapisz"
            },
            alerts: {
                required_fields: "Proszę wypełnić wszystkie wymagane pola.",
                error: "Wystąpił błąd podczas aktualizacji danych pracownika."
            }
        },
        permissions: {
            title: "Zarządzaj Uprawnieniami Użytkownika",
            labels: {
                add_patient: "Dodawanie pacjentów",
                view_all_patients: "Podgląd wszystkich pacjentów",
                view_own_patients: "Podgląd własnych pacjentów",
                view_all_visits: "Podgląd wszystkich wizyt",
                view_own_visits: "Podgląd własnych wizyt",
                add_visits: "Dodawanie wizyt",
                cancel_visit: "Anulowanie wizyty",
                view_employees: "Podgląd pracowników",
                add_employees: "Dodawanie pracowników",
                delete_employees: "Usuwanie pracowników",
                view_permissions: "Podgląd uprawnień",
                edit_permissions: "Edycja uprawnień",
                update_facility: "Aktualizacja danych placówki",
                refer_patients: "Skierowania pacjentów",
                view_audit_logs: "Podgląd logów audytowych"
            },
            requires: "Wymaga: {{label}}",
            buttons: {
                cancel: "Anuluj",
                save: "Zapisz uprawnienia"
            },
            alerts: {
                error: "Nie udało się zaktualizować uprawnień."
            }
        }
    },
    settings: {
        client_portal: {
            title: "Portal Pacjenta",
            info_box: {
                title: "Portal Pacjenta - Funkcje i Możliwości",
                description: "Skonfiguruj, które funkcje portalu pacjenta powinny być dostępne. Możesz włączać lub wyłączać poszczególne moduły i ich szczegółowe funkcje."
            },
            modules: {
                appointment_scheduling: {
                    title: "Umawianie Wizyt",
                    description: "Pacjenci mogą samodzielnie umawiać się i zarządzać wizytami",
                    reservation: "Rezerwacja Wizyt",
                    reservation_desc: "Możliwość rezerwacji nowych wizyt",
                    rescheduling: "Zmiana Terminu Wizyt",
                    rescheduling_desc: "Możliwość zmiany terminu wizyt",
                    cancellation: "Odwoływanie Wizyt",
                    cancellation_desc: "Możliwość odwołania wizyt"
                },
                medical_documentation: {
                    title: "Dokumentacja Medyczna",
                    description: "Dostęp do dokumentacji medycznej i wyników badań",
                    visit_history: "Historia Wizyt",
                    visit_history_desc: "Przegląd historii wizyt i zaleceń",
                    test_results: "Wyniki Badań",
                    test_results_desc: "Dostęp do wyników badań",
                    prescriptions: "Recepty",
                    prescriptions_desc: "Historia i status recept"
                },
                communication: {
                    title: "Komunikacja",
                    description: "Bezpieczna komunikacja z personelem medycznym",
                    chat: "Czat z Lekarzem",
                    chat_desc: "Bezpieczna komunikacja tekstowa",
                    notifications: "Powiadomienia",
                    notifications_desc: "Powiadomienia o wizytach i zaleceniach"
                },
                scales_questionnaires: {
                    title: "Skale i Kwestionariusze",
                    description: "Regularne wypełnianie skal i kwestionariuszy",
                    mood_scales: "Skale Nastroju",
                    mood_scales_desc: "PHQ-9, GAD-7, itp.",
                    quality_of_life: "Jakość Życia",
                    quality_of_life_desc: "Kwestionariusze jakości życia"
                },
                test_results: {
                    title: "Wyniki Badań",
                    description: "Dostęp do wyników badań wraz z interpretacją",
                    view: "Podgląd Wyników",
                    view_desc: "Dostęp do wyników badań",
                    history: "Historia Wyników",
                    history_desc: "Historia wszystkich badań"
                },
                ai_assistant: {
                    title: "Asystent AI",
                    description: "Inteligentny asystent wspierający pacjenta",
                    powered_tag: "Zasilane przez AI",
                    requires_plan: "Wymaga planu AI Powered"
                }
            },
            security: {
                title: "Bezpieczeństwo Danych",
                description: "Wszystkie dane w portalu pacjenta są szyfrowane i chronione zgodnie z wymogami RODO. Dostęp do portalu wymaga silnego uwierzytelniania, a cała aktywność jest monitorowana i logowana."
            },
            buttons: {
                save: "Zapisz Ustawienia"
            }
        },
        employees: {
            title: "Pracownicy",
            tabs: {
                doctors: "Lekarze, Dentyści i Ratownicy",
                nurses: "Pielęgniarki i Położne",
                receptionists: "Recepcjoniści"
            },
            roles: {
                doctor: "Lekarza",
                nurse: "Pielęgniarkę",
                receptionist: "Recepcjonistę"
            },
            buttons: {
                group_permissions: "UPRAWNIENIA GRUPOWE",
                ratings: "OCENY",
                add_employee: "+ Dodaj {{role}}"
            },
            info_banner: "Całkowita liczba użytkowników kwalifikujących się do opłat abonamentowych: ({{current}}. Maksymalna liczba użytkowników z zakupionych pakietów {{max}}). {{extra}}",
            filters: {
                lastName: "Nazwisko",
                firstName: "Imię",
                pwz: "PWZ",
                onlyActive: "Tylko aktywni"
            },
            table: {
                name: "NAZWISKO I IMIĘ",
                login: "LOGIN",
                pwz_pesel: "PWZ/PESEL",
                status: "STATUS AKTYWACJI",
                actions: "AKCJE",
                loading: "Ładowanie pracowników...",
                empty: "Nie znaleziono pracowników"
            },
            pagination: {
                records_per_page: "rekordów na stronę",
                prev: "Poprzednia",
                next: "Następna",
                total: "Suma wyników: {{total}}"
            },
            delete_modal: {
                title: "Usuń Pracownika",
                message: "Czy na pewno chcesz usunąć {{name}}? Tej operacji nie można cofnąć.",
                cancel: "Anuluj",
                delete: "Usuń"
            },
            alerts: {
                fetch_error: "Nie udało się pobrać listy pracowników.",
                status_success: "Status został zaktualizowany.",
                status_error: "Nie udało się zaktualizować statusu pracownika.",
                director_granted: "Przyznano uprawnienia dyrektora.",
                director_revoked: "Odebrano uprawnienia dyrektora.",
                director_error: "Nie udało się zaktualizować uprawnień dyrektora.",
                delete_success: "Pracownik został usunięty.",
                update_success: "Dane pracownika zostały zaktualizowane.",
                permissions_success: "Uprawnienia zostały zaktualizowane.",
                group_permissions_success: "Uprawnienia grupowe zostały zaktualizowane."
            }
        },
        ewus: {
            title: "eWUŚ",
            auto_verification: "Automatyczna weryfikacja ubezpieczenia:",
            system_status: "System eWUŚ",
            labels: {
                branch: "Oddział:",
                contractor_type: "Typ świadczeniodawcy:",
                login: "Login:",
                password: "Hasło:",
                personnel_code: "Kod personelu:"
            },
            placeholders: {
                personnel_code: "Wprowadź kod personelu",
                login: "Wprowadź login",
                enter_personnel_code: "Wprowadź kod personelu",
                enter_login: "Wprowadź login"
            },
            password_not_changed: "(nie zmieniono)",
            buttons: {
                save_verify: "Zapisz i sprawdź poprawność danych",
                change_password: "Zmień Hasło",
                check_now: "Sprawdź Teraz"
            },
            options: {
                branches: {
                    maritime: "Pomorski (11)",
                    masovian: "Mazowiecki (07)",
                    silesian: "Śląski (12)"
                },
                contractors: {
                    doctor: "Lekarz",
                    clinic: "Przychodnia",
                    hospital: "Szpital"
                }
            }
        },
        facility_data: {
            title: "Dane Placówki",
            sections: {
                basic: "Informacje Podstawowe",
                general: "Informacje Podstawowe",
                contact: "Kontakt i Adres",
                address: "Kontakt i Adres",
                workflow: "Ustawienia Pracy",
                other: "Pozostałe ustawienia",
                logo_consent: "Logo placówki / Dokument"
            },
            labels: {
                name: "Nazwa",
                regon: "REGON",
                nip: "NIP",
                bdo: "Numer BDO",
                registry: "Nr księgi rejestrowej",
                registry_number: "Nr księgi rejestrowej",
                type: "Typ placówki",
                facility_type: "Typ placówki",
                phone: "Telefon",
                email: "Email",
                website: "Strona WWW",
                account_number: "Numer konta",
                street: "Ulica",
                house: "Dom",
                house_no: "Nr domu",
                apt: "Nr lokalu",
                apartment_no: "Nr lokalu",
                postal_code: "Kod pocztowy",
                city: "Miasto",
                teryt: "Kod TERYT",
                teryt_code: "Kod TERYT",
                nfz: "Kod NFZ",
                nfz_branch: "Oddział NFZ",
                hours_from: "Godziny pracy od",
                hours_to: "Godziny pracy do",
                duration: "Czas trwania wizyty (min)",
                visit_duration: "Czas trwania wizyty (min)",
                work_hours: "Godziny pracy",
                visit_type: "Typ wizyty",
                reception_mode: "Domyślny tryb przyjęć",
                logo: "Logo placówki",
                consent: "Tekst zgody na przetwarzanie danych (zmień domyślny)",
                required_note: "* Pole wymagane",
                required_field: "Pole wymagane"
            },
            placeholders: {
                facility_name: "Nazwa placówki",
                enter_name: "Nazwa placówki",
                regon: "REGON",
                nip: "NIP",
                bdo: "BDO",
                registry: "Rejestr",
                select_type: "Wybierz typ",
                phone: "Telefon",
                email: "Email",
                website_url: "Wprowadź adres URL strony",
                enter_website: "Wprowadź adres URL strony",
                account_number: "Numer konta",
                street: "Nazwa ulicy",
                house_no: "Nr",
                no: "Nr",
                apt_no: "Lok.",
                apt: "Lok.",
                postal_code: "XX-XXX",
                city: "Nazwa miasta",
                search_teryt: "Szukaj TERYT...",
                select_nfz: "Wybierz oddział NFZ",
                select_nfz_branch: "Wybierz oddział NFZ",
                duration: "30",
                select_reception: "Wybierz tryb",
                select_reception_mode: "Wybierz tryb",
                select_visit_type: "Wybierz typ wizyty"
            },
            options: {
                facility_types: {
                    individual: "Praktyka indywidualna",
                    group: "Praktyka zespołowa",
                    hospital: "Szpital",
                    clinic: "Przychodnia"
                },
                visit_types: {
                    private: "Prywatna",
                    nfz: "NFZ",
                    mixed: "Mieszana"
                },
                reception_modes: {
                    in_person: "Osobista",
                    online: "Online",
                    telephone: "Telefoniczna"
                }
            },
            buttons: {
                change_file: "ZMIEŃ PLIK",
                choose_file: "WYBIERZ PLIK",
                save: "Zapisz Zmiany",
                done: "Gotowe"
            },
            alerts: {
                save_success: "Ustawienia placówki zostały zaktualizowane!",
                save_error: "Nie udało się zaktualizować ustawień placówki",
                fetch_error: "Nie udało się pobrać danych placówki",
                pick_error: "Nie udało się wybrać pliku"
            }
        },
        facility_stats: {
            title: "Statystyki Placówki",
            loading: "Ładowanie statystyk...",
            retry: "Ponów",
            error_default: "Nie udało się pobrać statystyk",
            stats: {
                departments: "Oddziały",
                doctors: "Lekarze",
                offices: "Gabinety",
                nurses: "Pielęgniarki",
                patients: "Pacjenci",
                receptionists: "Recepcjoniści"
            }
        },
        index: {
            title: "Ustawienia",
            subtitle: "Zarządzaj ustawieniami placówki i konfiguracją systemu",
            tabs: {
                statistics: "Statystyki Placówki",
                facility_data: "Dane Placówki",
                offices: "Gabinety",
                security: "Bezpieczeństwo",
                subscription: "Abonament",
                patient_portal: "Portal Pacjenta",
                profile: "Profil",
                employees: "Pracownicy",
                ewus: "eWUŚ"
            }
        },
        office_certs: {
            title: "Gabinety i Certyfikaty",
            offices: {
                title: "Gabinety",
                buttons: {
                    add_office: "Dodaj gabinet",
                    hide_form: "Ukryj formularz",
                    cancel: "Anuluj",
                    save: "Zapisz",
                    update: "Aktualizuj"
                },
                form: {
                    name: "Nazwa gabinetu",
                    floor: "Piętro",
                    number: "Numer",
                    number_placeholder: "Numer gabinetu",
                    type: "Typ gabinetu",
                    type_placeholder: "Wybierz typ",
                    equipment: "Wyposażenie",
                    equipment_placeholder: "Lista wyposażenia (jedno na linię)"
                },
                types: {
                    medical: "Gabinet lekarski",
                    therapy: "Gabinet terapeutyczny",
                    diagnostic: "Gabinet diagnostyczny"
                },
                details: {
                    floor: "Piętro",
                    number: "Nr",
                    type: "Typ",
                    equipment: "Wyposażenie"
                }
            },
            certificates: {
                title: "Certyfikaty P1",
                p1_id: "Identyfikator P1",
                p1_placeholder: "Wprowadź identyfikator P1",
                tls_label: "Certyfikat TLS",
                tls_placeholder: "Wybierz plik certyfikatu TLS",
                wls_label: "Certyfikat WLS",
                wls_placeholder: "Wybierz plik certyfikatu WLS",
                uploading: "Przesyłanie..."
            },
            buttons: {
                save_changes: "Zapisz Zmiany"
            },
            alerts: {
                save_success: "Ustawienia dyrektora zostały zaktualizowane!",
                save_error: "Nie udało się zaktualizować ustawień",
                upload_error: "Nie udało się przesłać certyfikatu",
                required_fields: "Proszę wypełnić wszystkie wymagane pola gabinetu"
            }
        },
        profile: {
            labels: {
                first_name: "Imię",
                last_name: "Nazwisko",
                email: "Email"
            },
            buttons: {
                cancel: "Anuluj",
                save_changes: "Zapisz Zmiany"
            },
            alerts: {
                update_success: "Profil zaktualizowany pomyślnie!",
                update_error: "Nie udało się zaktualizować profilu"
            }
        },
        security: {
            title: "Ustawienia Bezpieczeństwa",
            two_factor: {
                title: "Uwierzytelnianie dwuskładnikowe",
                enabled: "Włączone",
                info_title: "Uwierzytelnianie dwuskładnikowe to podwójna kontrola tożsamości podczas logowania.",
                info_desc: "Dla dodatkowego bezpieczeństwa konta, podczas logowania użytkownik musi wprowadzić kod przesłany wybranym kanałem komunikacji - e-mail, SMS lub aplikację mobilną."
            },
            trusted_devices: {
                title: "Zezwalaj użytkownikom na zapisywanie zaufanych urządzeń",
                description: "Drugi krok weryfikacji na danym urządzeniu będzie wtedy następował tylko co 30 dni, a nie za każdym razem"
            },
            buttons: {
                enable: "Włącz",
                disable: "Wyłącz",
                save_changes: "Zapisz Zmiany"
            },
            alerts: {
                success_title: "Sukces",
                error_title: "Błąd",
                update_success: "Ustawienia bezpieczeństwa zostały zaktualizowane.",
                update_error: "Coś poszło nie tak podczas aktualizacji ustawień.",
                user_not_found: "Użytkownik nie został zidentyfikowany. Spróbuj zalogować się ponownie."
            }
        },
        subscription: {
            title: "Zakupione Plany",
            plans_title: "Plany",
            summary: {
                active_users: "Liczba aktywnych użytkowników",
                nfz_settlements: "Rozliczenia NFZ",
                next_payment: "Następna płatność"
            },
            buttons: {
                pay_now: "ZAPŁAĆ TERAZ",
                cancel_subscription: "ANULUJ SUBSKRYPCJĘ"
            },
            details: {
                name: "Nazwa",
                valid_from: "Ważne od",
                valid_to: "Ważne do",
                next_payment: "Następna płatność"
            },
            modules: {
                without_nfz: "BEZ MODUŁU NFZ",
                nfz_settlement: "MODUŁ ROZLICZEŃ NFZ",
                coming_soon: "Wkrótce"
            },
            plan_card: {
                best_offer: "Najlepsza oferta dla Ciebie",
                ai_powered: "Zasilane przez AI",
                up_to: "do",
                users: "użytkowników",
                gross: "brutto",
                without_nfz: "bez modułu NFZ",
                current_plan: "Obecny plan",
                select: "WYBIERZ"
            },
            ai_info: {
                title: "Co to jest subskrypcja AI Powered?",
                description: "Subskrypcja AI Powered zapewnia dostęp do zaawansowanych funkcji wspieranych przez sztuczną inteligencję, które pomagają w codziennej pracy:",
                features: {
                    documentation: "Asystent dokumentacji medycznej z transkrypcją głosową",
                    clinical_decision: "System wspomagania decyzji klinicznych",
                    icd10: "Inteligentny asystent kodowania ICD-10",
                    drug_interaction: "Analiza interakcji lekowych z grafem wiedzy",
                    interview: "Asystent wywiadu z analizą emocji",
                    diagnostic: "Automatyczne sugestie diagnostyczne",
                    trends: "Analiza trendów i wzorców w danych pacjentów"
                }
            }
        }
    },

    prescriptionForm: {
        info: {
            title: 'e-Recepta',
            description: 'Wystawiaj recepty elektroniczne zgodne z systemem P1. Możesz zapisać receptę jako wersję roboczą i podpisać ją później.'
        },
        buttons: {
            addMedication: 'Dodaj lek',
            cancel: 'Anuluj',
            addToPrescription: 'Dodaj do recepty',
            signPrescriptions: 'Podpisz recepty'
        },
        sections: {
            draftPrescriptions: 'Recepty robocze',
            signedPrescriptions: 'Podpisane recepty'
        }
    },

    medicationSearch: {
        input: {
            placeholder: 'Wyszukaj lek...'
        },
        results: {
            package: 'Opakowanie:',
            noResults: 'Nie znaleziono leków. Możesz dodać lek recepturowy.'
        }
    },

    dosageForm: {
        labels: {
            dosage: 'Dawkowanie',
            packageCount: 'Ilość opakowań',
            refills: 'Liczba powtórzeń',
            instructions: 'Dodatkowe instrukcje'
        },
        placeholders: {
            dosage: 'np. 1x1, 2x1 rano i wieczorem',
            instructions: 'np. przyjmować po posiłku'
        },
        suggestions: {
            title: 'Sugerowane schematy:'
        },
        refillOptions: {
            none: 'Bez powtórzeń',
            one: '1 powtórzenie',
            multiple: ' powtórzenia'
        }
    },

    refundationSelect: {
        label: 'Refundacja',
        options: {
            fullPrice: 'Pełnopłatny',
            free: 'Bezpłatny',
            lump: 'Ryczałt',
            freeLimit: 'Bezpłatny do limitu',
            senior: 'Senior 75+',
            payment: 'Odpłatność '
        }
    },

    additionalRights: {
        label: 'Uprawnienia dodatkowe',
        info: 'Zaznacz odpowiednie uprawnienia dodatkowe pacjenta. Wpływają one na poziom refundacji leków.',
        rights: {
            IB: { name: 'Inwalida wojenny', description: 'Inwalidzi wojenni oraz osoby represjonowane' },
            IW: { name: 'Inwalida wojskowy', description: 'Inwalidzi wojskowi' },
            ZK: { name: 'Zasłużony honorowy dawca krwi', description: 'Zasłużeni honorowi dawcy krwi' },
            C: { name: 'Ciąża', description: 'Kobiety w ciąży' },
            DN: { name: 'Dzieci i młodzież', description: 'Dzieci i młodzież do 18 roku życia' },
            AZ: { name: 'Akademicki ZOZ', description: 'Studenci i uczniowie oraz adiunkci, asystenci i doktoranci' }
        }
    },

    prescriptionSummary: {
        title: 'Recepta',
        status: {
            label: 'Status:',
            draft: 'Robocza',
            issued: 'Wystawiona'
        },
        buttons: {
            edit: 'Edytuj',
            cancel: 'Anuluj',
            save: 'Zapisz',
            sign: 'Podpisz',
            print: 'Drukuj',
            reissue: 'Wystaw ponownie'
        },
        medication: {
            dosage: { label: 'Dawkowanie', prefix: 'Dawkowanie: ' },
            quantity: { label: 'Ilość opakowań', display: 'Ilość: ' },
            instructions: { label: 'Dodatkowe instrukcje', prefix: 'Dodatkowe instrukcje: ' }
        },
        additionalRights: {
            title: 'Uprawnienia dodatkowe'
        }
    },

    signingModal: {
        title: 'Podpisywanie e-recepty',
        methods: {
            zus: { title: 'Certyfikat ZUS', description: 'Podpis przy użyciu certyfikatu ZUS' },
            qualified: { title: 'Podpis kwalifikowany', description: 'Podpis przy użyciu certyfikatu kwalifikowanego' },
            trusted: { title: 'Profil Zaufany', description: 'Podpis przy użyciu Profilu Zaufanego' }
        },
        buttons: {
            startSigning: 'Rozpocznij podpisywanie',
            signPrescription: 'Podpisz receptę',
            verifyAndSign: 'Weryfikuj i podpisz',
            complete: 'Zakończ'
        },
        password: {
            info: 'Wprowadź hasło do certyfikatu.',
            label: 'Hasło do certyfikatu',
            placeholder: 'Wprowadź hasło',
            remember: 'Zapamiętaj hasło do końca sesji'
        },
        verification: {
            info: 'Wprowadź kod weryfikacyjny, który został wysłany na Twój telefon.',
            label: 'Kod weryfikacyjny',
            placeholder: 'Wprowadź kod'
        },
        processing: {
            title: 'Podpisywanie recepty...',
            subtitle: 'Proszę nie zamykać okna'
        },
        complete: {
            title: 'Recepta została podpisana',
            description: 'Recepta została pomyślnie podpisana i wysłana do systemu P1. Możesz teraz wydrukować informację dla pacjenta.'
        }
    }
}
;