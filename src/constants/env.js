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
 
  api_url: 'https://ehr.remedyai.com.pl//api',
  file_url: 'https://ehr.remedyai.com.pl/',
  front_end: 'https://ehr.remedyai.com.pl/',


  // test urls
  // api_url: "http://51.20.250.84/api",
	// file_url: "http://51.20.250.84",
	// front_end: "http://51.20.250.84",
};

const environment = devUrls;

export const environmentUrls = {
  ...environment,
};