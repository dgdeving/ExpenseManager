import React, { useEffect } from 'react';
import DBTest from './screens/DBTest';
import CreateExpense from './screens/CreateExpense';
import UpdateExpense from './screens/UpdateExpense';

import CreatePicture from './screens/CreatePicture';
import PhotoTestHelper from './screens/PhotoTestHelper';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Expenses from './screens/Expenses';
import Incomes from './screens/Incomes';

const Stack = createNativeStackNavigator();

const globalScreenOptions = {
  headerShown: false,
  contentStyle: { backgroundColor: '#f3f2f3' }
};

export default function App() {

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={globalScreenOptions}>
        <Stack.Screen name="Expenses" component={Expenses} />
        <Stack.Screen name="Incomes" component={Incomes} />
        <Stack.Screen name="CreatePicture" component={CreatePicture} />
        <Stack.Screen name="DBTest" component={DBTest} />
        <Stack.Screen name="PhotoTestHelper" component={PhotoTestHelper} />
        <Stack.Screen name="CreateExpense" component={CreateExpense} />
        <Stack.Screen name="UpdateExpense" component={UpdateExpense} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

