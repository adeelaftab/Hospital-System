import { SETTINGS } from './settings';

export const environment = {
  production: true,
  appSettings: SETTINGS,
  googleMapApiKey: 'AIzaSyBSvo0x8v3C6aFWcSi2zooOC9tqGCOqCj4',
  serverURL: "http://"+ window.location.hostname+":3000",
 // whitelist: ['localhost','localhost:3000','http://localhost:3000','192.168.1.150','192.168.1.150:3000','http://192.168.1.150:3000','39.32.36.98','39.32.36.98:8080','http://39.32.36.98:8080'],
};
