import React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import PresencaScreen from './src/telas/Presenca';
import MapaScreen from './src/telas/Mapa';

function TelaVazia({ titulo }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#edf1f4' }}>
      <Text style={{ fontSize: 20, color: '#a2181c', fontWeight: 'bold' }}>{titulo}</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === 'Início') iconName = 'home';
            else if (route.name === 'Presença') iconName = 'scan-circle';
            else if (route.name === 'Perfil') iconName = 'person';
            else if (route.name === 'Mapa') iconName = 'map';
            
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#a2181c',
          tabBarInactiveTintColor: 'gray',
          headerStyle: { backgroundColor: '#a2181c' },
          headerTintColor: '#fff',
          headerTitleAlign: 'center',
          headerTitleStyle: { fontWeight: 'bold', letterSpacing: 1 },
        })}
      >
        <Tab.Screen name="Início" children={() => <TelaVazia titulo="Área do Aluno (Em breve)" />} />
        <Tab.Screen name="Presença" component={PresencaScreen} options={{ title: 'Bater Ponto' }} />
        <Tab.Screen name="Mapa" component={MapaScreen} options={{ title: 'Mapa do Campus' }} />
        <Tab.Screen name="Perfil" children={() => <TelaVazia titulo="Perfil do Aluno" />} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}