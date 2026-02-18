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


export default function Main() {
    const theme = {
        ...LightTheme,
        fonts: configureFonts({ config: fontConfig })
    }
    return (
        <PaperProvider theme={theme}>
            <App />
        </PaperProvider>
    )
}

AppRegistry.registerComponent(appName, () => Main);
