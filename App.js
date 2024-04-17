import React, { useEffect } from 'react';
import DBTest from './screens/DBTest';
import CreateExpense from './screens/CreateExpense2';
import UpdateExpense from './screens/UpdateExpense';

import CameraScreen from './screens/CameraScreen';
import PhotoTestHelper from './screens/PhotoTestHelper';


import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Expenses from './screens/Expenses';
import Incomes from './screens/Incomes';

const Stack = createNativeStackNavigator();


export default function App() {

  return (
    <NavigationContainer>
      <Stack.Navigator>

        <Stack.Screen name="Expenses" component={Expenses} options={{ headerShown: false }} />
        <Stack.Screen name="Incomes" component={Incomes} options={{ headerShown: false }} />
        <Stack.Screen name="CameraScreen" component={CameraScreen} options={{ headerShown: false }} />
        <Stack.Screen name="DBTest" component={DBTest} options={{ headerShown: false }} />
        <Stack.Screen name="PhotoTestHelper" component={PhotoTestHelper} options={{ headerShown: false }} />

        <Stack.Screen name="CreateExpense" component={CreateExpense} options={{ headerShown: false }} />
        <Stack.Screen name="UpdateExpense" component={UpdateExpense} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>

  );
}
