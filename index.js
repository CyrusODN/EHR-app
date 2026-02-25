/**
 * @format
 */

import { AppRegistry, useColorScheme } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import {
    PaperProvider, configureFonts,
} from 'react-native-paper';
import { LightTheme } from './src/constants/colors/lightTheme';
import { fontConfig } from './src/constants/fonts';
import { GestureHandlerRootView } from 'react-native-gesture-handler';


export default function Main() {
    const theme = {
        ...LightTheme,
        fonts: configureFonts({ config: fontConfig })
    }
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <PaperProvider theme={theme}>
                <App />
            </PaperProvider>
        </GestureHandlerRootView>
    )
}

AppRegistry.registerComponent(appName, () => Main);
