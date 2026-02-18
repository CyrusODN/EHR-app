export const pl = {
    common: {
        search: 'Szukaj',
        cancel: 'Anuluj',
        save: 'Zapisz',
        delete: 'Usuń',
        edit: 'Edytuj',
        back: 'Powrót',
        next: 'Dalej',
        finish: 'Zakończ',
        loading: 'Ładowanie...',
        noData: 'Brak danych',
        yes: 'Tak',
        no: 'Nie',
        total: 'łącznie',
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
    },
    loading: {
        psychiatricModule: 'Moduł Psychiatryczny',
        initializingModule: 'Inicjalizacja modułu...'
    },
    auth: {
        login: 'Zaloguj się',
        logout: 'Wyloguj się',
        email: 'Email',
        password: 'Hasło'
    },

    dashboard: {
        title: 'Dashboard',
        overview: 'Przegląd najważniejszych informacji',
        todayPatients: 'Dzisiejsi Pacjenci',
        pendingReports: 'Oczekujące Raporty',
        scheduledVisits: 'Zaplanowane Wizyty',
        completedVisits: 'Zakończone Wizyty',
        calendar: {
            title: 'Wizyty na',
            noVisits: 'Brak zaplanowanych wizyt na ten dzień'
        },
        quickActions: {
            title: 'Szybkie akcje',
            scheduleVisit: 'Zaplanuj wizytę',
            newDocument: 'Nowy dokument',
            messages: 'Wiadomości',
            teleVisit: 'Teleporada',
            reports: 'Raporty',
            patients: 'Pacjenci'
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
    status: {
        scheduled: 'Zaplanowana',
        inProgress: 'W trakcie',
        completed: 'Zakończona'
    },
    visit: {
        new: 'Nowa wizyta',
        start: 'Rozpocznij wizytę',
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
            audit: 'Historia zmian',
            trends: 'Analiza trendów',
            noAllergies: 'Brak znanych alergii',
            noDiseases: 'Brak chorób przewlekłych'
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
            additionalFindings: 'Dodatkowe obserwacje'
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
            }
        },
        documents: {
            title: 'Dokumenty',
            prescriptions: {
                title: 'Recepty',
                new: 'Nowa recepta',
                refills: 'Ilość powtórzeń',
                searchMed: 'Wyszukaj lek...',
                dosage: 'Dawkowanie',
                quantity: 'Ilość',
                instructions: 'Dodatkowe instrukcje'
            },
            sickLeave: {
                title: 'Zwolnienie lekarskie',
                add: 'Dodaj zwolnienie',
                remove: 'Usuń zwolnienie',
                startDate: 'Data rozpoczęcia',
                endDate: 'Data zakończenia',
                reason: 'Powód zwolnienia',
                recommendations: 'Zalecenia'
            },
            referrals: {
                title: 'Skierowania',
                new: 'Nowe skierowanie',
                specialization: 'Specjalizacja',
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
            }
        },
        ai: {
            title: 'Asystenci AI',
            tabs: {
                cds: 'Wsparcie decyzji',
                interview: 'Trener Wywiadu',
                transcription: 'Asystent Dokumentacji',
                interactions: 'Farmakopedia',
                icd10: 'Asystent ICD-10'
            }
        },
        navigation: {
            previous: 'Wstecz',
            next: 'Dalej',
            finish: 'Zakończ'
        }
    },
    ai: {
        assistant: 'Asystent AI',
        documentation: 'Asystent dokumentacji',
        diagnosis: 'Diagnostyka różnicowa',
        drugInteractions: 'Interakcje lekowe',
        transcription: 'Transkrypcja głosowa'
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
            appointments: 'Zaplanowane wizyty'
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
        }
    },
    newPatient: {
        title: 'Nowy Pacjent',
        description: 'Wprowadź dane nowego pacjenta',
        personalData: 'Dane osobowe',
        form: {
            firstName: 'Imię',
            lastName: 'Nazwisko',
            pesel: 'PESEL',
            dateOfBirth: 'Data urodzenia',
            gender: 'Płeć',
            selectGender: 'Wybierz płeć',
            genders: {
                male: 'Mężczyzna',
                female: 'Kobieta',
                other: 'Inna'
            },
            phone: 'Telefon',
            address: {
                title: 'Adres zamieszkania',
                street: 'Ulica',
                houseNumber: 'Nr domu',
                apartmentNumber: 'Nr mieszkania',
                postalCode: 'Kod pocztowy',
                city: 'Miejscowość'
            },
            insurance: {
                title: 'Ubezpieczenie',
                type: 'Rodzaj ubezpieczenia',
                types: {
                    nfz: 'NFZ',
                    private: 'Prywatne',
                    none: 'Brak'
                },
                number: 'Nr ubezpieczenia'
            },
            submit: 'Zapisz pacjenta'
        }
    },
    patientSearch: {
        title: 'Wyszukiwanie Pacjentów',
        description: 'Wyszukaj pacjentów po nazwisku, numerze PESEL lub numerze karty',
        searchPlaceholder: 'Nazwisko, PESEL lub numer karty...',
        enterCriteria: 'Wprowadź kryteria wyszukiwania aby zobaczyć wyniki',
        filters: {
            birthDate: 'Data urodzenia',
            gender: 'Płeć',
            allGenders: 'Wszystkie',
            genders: {
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
            longAbsent: 'Dłużej nieobecni',
            clear: 'Wyczyść filtry',
            apply: 'Zastosuj filtry'
        }
    },
    patientList: {
        title: 'Lista Pacjentów',
        description: 'Zarządzaj kartoteką pacjentów',
        table: {
            patient: 'Pacjent',
            pesel: 'PESEL',
            dateOfBirth: 'Data ur.',
            lastVisit: 'Ostatnia wizyta',
            status: 'Status',
            actions: 'Akcje'
        },
        actions: {
            export: 'Eksportuj',
            print: 'Drukuj',
            filters: 'Filtry'
        },
        status: {
            active: 'Aktywny',
            inactive: 'Nieaktywny',
            archived: 'Zarchiwizowany'
        },
        noData: 'Brak pacjentów do wyświetlenia'
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
                psychotherapy: 'Psychoterapeutyczna'
            },
            hasReferral: 'Posiada skierowanie'
        },
        calendar: {
            day: 'Dzień',
            week: 'Tydzień',
            month: 'Miesiąc'
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
        "login_success": "Logowanie udane!!"

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
        "registration_success": "Rejestracja udana. Sprawdź swoją skrzynkę email, aby zweryfikować konto."

    },


    forgot_password: {
        "reset_password_title": "Zapomniałem hasło",
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
        "history": "Historia zwolnień/SMS"
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
            "actions": {
                "cancel": "Anuluj",
                "submit": "Zmień hasło"
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
                "visitType": "{{type}} - {{mainDiagnosis}}"
            },
            "riskLevels": {
                "low": "NISKI",
                "moderate": "UMIARKOWANY",
                "high": "WYSOKI"
            }
        }
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
            "sign": "Podpisanie dokumentu"
        },
        "changes": {
            "title": "Wprowadzone zmiany:",
            "system": "System:"
        }
    },

    "clinicalTrends": {
        "header": {
            "title": "Analiza trendów klinicznych",
            "subtitle": "AI-powered clinical trends analysis"
        },
        "charts": {
            "hamdScale": "Skala HAM-D",
            "bdiScale": "Skala BDI"
        },
        "insights": {
            "title": "Wnioski kliniczne"
        },
        "metrics": {
            "sleepTime": {
                "title": "Średni czas snu",
                "belowNorm": "od normy"
            },
            "activity": {
                "title": "Aktywność",
                "monthChange": "m/m"
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
        "title": "Spotlight",
        "description": "Bezpieczne udostępnianie zanonimizowanych danych pacjentów do badań klinicznych",
        "tabs": {
            "newSubmission": "Nowe zgłoszenie",
            "mySubmissions": "Moje zgłoszenia"
        }
    },

    "spotlightSubmissions": {
        "title": "Moje zgłoszenia w Spotlight",
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
        "submitButton": "Prześlij do Spotlight",
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
    }
}