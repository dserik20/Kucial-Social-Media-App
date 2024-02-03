import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from '../Login/WelcomeScreen';
import Login from '../Login/Login';
import Signup from '../Login/Signup/Signup';

const Stack = createStackNavigator();

const AuthStackNavigator = () => {
  return (
      <Stack.Navigator headerShown={false}>
                <Stack.Screen name="Welcome" component={WelcomeScreen} 
                    options={{
                        headerShown: false,
                        presentation: 'transparentModal',
                    }}
                />
                <Stack.Screen name="Login" component={Login}
                    options={{
                        headerShown: false,
                        presentation: 'transparentModal',
                    }} 
                />
                <Stack.Screen name="Signup" component={Signup} 
                    options={{
                        headerShown: false,
                        presentation: 'transparentModal',
                    }} 
                />
            </Stack.Navigator>
  );
};

export default AuthStackNavigator;
