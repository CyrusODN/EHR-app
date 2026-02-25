import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage, persist } from 'zustand/middleware';





const userStore = create(
    persist(
      (set) => ({
        loggedInUser: null,
        patientBasicInformation: null,
        token: null,
        isAuthenticated: false,
        sessionExpiresAt: null,
  
        // Auth actions
        setToken: (payload) => 
          set(() => ({ token: payload, isAuthenticated: !!payload })),
        
        setAuth: (payload) => {
          const expirationTime = Date.now() + 24 * 60 * 60 * 1000;
          set(() => ({ 
            loggedInUser: payload, 
            token: payload.token,
            isAuthenticated: true,
            sessionExpiresAt: expirationTime
          }));
        },
  
        setPatientBasicInformation: (payload) => 
          set(() => ({ patientBasicInformation: payload })),
  
        purgeAuth: () => 
          set(() => ({ 
            loggedInUser: null, 
            token: null, 
            isAuthenticated: false,
            patientBasicInformation: null,
            sessionExpiresAt: null
          })),
      }),
      {
        name: "remedy-storage",
        storage: createJSONStorage(() => AsyncStorage),
        partialize: (state) => ({
          token: state.token,
          loggedInUser: state.loggedInUser,
          patientBasicInformation: state.patientBasicInformation,
          isAuthenticated: state.isAuthenticated,
          sessionExpiresAt: state.sessionExpiresAt,
        }),
      }
    )
  );
export default userStore;