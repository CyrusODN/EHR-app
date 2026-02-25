import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BootSplash from 'react-native-bootsplash';
import { Screens } from '../screens';
import useLanguageStore from '../store/language';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18next from '../localization/i18next';

import userStore from '../store/user';

const Stack = createNativeStackNavigator();

function AppNavigator() {

    const [showSplash, setShowSplash] = useState(true);
    const { setLanguage } = useLanguageStore();
    const { t } = useTranslation();
    const { isAuthenticated, sessionExpiresAt, purgeAuth } = userStore();

    useEffect(() => {
        try {
            AsyncStorage.getItem('language')
                .then(language => {
                    if (language) {
                        i18next.changeLanguage(language);
                        setLanguage(language);
                    } else {
                        setLanguage('en');
                    }
                })
                .catch(() => {
                    setLanguage('en');
                });
        }
        catch (error) {
            console.log(error);
        }
    }, []);

    useEffect(() => {
        const checkSession = async () => {
            if (isAuthenticated && sessionExpiresAt) {
                if (Date.now() > sessionExpiresAt) {
                    console.log("Session expired, logging out...");
                    purgeAuth();
                }
            }
            
            setTimeout(() => {
                setShowSplash(false);
                BootSplash.hide({ fade: true });
            }, 500);
        };
        
        checkSession();
    }, [isAuthenticated, sessionExpiresAt, purgeAuth]);


    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {showSplash ? (
                    <Stack.Screen
                        name="Splash"
                        component={Screens.Splash}
                        options={{ headerShown: false }}
                    />
                ) : !isAuthenticated ? (
                    <>
                        <Stack.Screen
                            name="Sign-In"
                            component={Screens.SignIn}
                        />
                        <Stack.Screen
                            name="Forget-Password"
                            component={Screens.ForgetPassword}
                        />
                        <Stack.Screen
                            name="Sign-Up"
                            component={Screens.SignUp}
                        />
                        <Stack.Screen
                            name="Otp"
                            component={Screens.Otp}
                        />
                        <Stack.Screen
                            name="Reset-Password"
                            component={Screens.ResetPassword}
                        />
                    </>
                ) : (
                    <>
                        <Stack.Screen
                            name="ModuleSelection"
                            component={Screens.ModuleSelection}
                        />
                        <Stack.Screen
                            name="Module-Loading"
                            component={Screens.ModuleLoading}
                        />
                        <Stack.Screen
                            name="Dashboard"
                            component={Screens.Dashboard}
                            options={{ gestureEnabled: false }}
                        />
                        <Stack.Screen
                            name="New-Patient"
                            component={Screens.NewPatientScreen}
                        />
                        <Stack.Screen
                            name="Search-Patient"
                            component={Screens.SearchPatient}
                        />
                        <Stack.Screen
                            name="Patient-List"
                            component={Screens.PatientListScreen}
                        />
                        <Stack.Screen
                            name="Schedule-Visits"
                            component={Screens.ScheduleVisitsScreen}
                        />
                        <Stack.Screen
                            name="SpotLight"
                            component={Screens.SpotlightScreen}
                        />
                        <Stack.Screen
                            name="Settings"
                            component={Screens.Settings}
                        />
                        <Stack.Screen
                            name="Facility-Statistics"
                            component={Screens.FacilityStatistics}
                        />
                        <Stack.Screen
                            name="Facility-Data"
                            component={Screens.FacilityData}
                        />
                        <Stack.Screen
                            name="Office-Certificates"
                            component={Screens.OfficeCertificates}
                        />
                        <Stack.Screen
                            name="Security"
                            component={Screens.Security}
                        />
                        <Stack.Screen
                            name="Subscription"
                            component={Screens.Subscription}
                        />
                        <Stack.Screen
                            name="Client-Portal"
                            component={Screens.ClientPortal}
                        />
                        <Stack.Screen
                            name="Profile"
                            component={Screens.Profile}
                        />
                        <Stack.Screen
                            name="Employees"
                            component={Screens.Employees}
                        />
                        <Stack.Screen
                            name="EWUS"
                            component={Screens.EWUS}
                        />
                        <Stack.Screen
                            name="AI-Analysis"
                            component={Screens.AIAnalysis}
                        />
                        <Stack.Screen
                            name="AI-Assistant"
                            component={Screens.AIAssistantScreen}
                        />
                        <Stack.Screen
                            name="Referrals"
                            component={Screens.ReferralsScreen}
                        />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default AppNavigator;
