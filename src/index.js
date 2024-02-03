import { AppRegistry, KeyboardAvoidingView } from 'react-native';
import App from './App'; // Import your main App component
import React from 'react';
import { Provider } from 'react-redux';
import store from './redux/store';

export default function Kucial  () {

    return (
        <Provider store={store}>
            <App />
        </Provider>
    )
} 
  


//AppRegistry.registerComponent(appName, () => ReduxApp);
