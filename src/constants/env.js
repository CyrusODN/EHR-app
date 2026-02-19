import { Platform } from 'react-native';

const devUrls = {
  api_url:
    Platform.OS === 'ios'
      ? 'http://localhost:8000/api'
      // : 'http://10.0.2.2:8000/api',
      : 'http://192.168.100.24:8000/api',
  file_url:
    Platform.OS === 'ios' ? 'http://localhost:8000' : 'http://10.0.2.2:8000',
};

const prodUrls = {
  api_url: 'https://ehr.remedius.ai/api',
  file_url: 'https://ehr.remedius.ai/',
  front_end: 'https://ehr.remedius.ai/',
};

const environment = prodUrls;

export const environmentUrls = {
  ...environment,
};