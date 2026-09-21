import React from 'react';

import {
  Alert,
  TouchableOpacity,
} from 'react-native';

import {
  NavigationContainer,
} from '@react-navigation/native';

import {
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';

import {
  Ionicons,
} from '@expo/vector-icons';

import {
  AuthProvider,
  useAuth,
} from './src/contexto/AuthContext';

import LoginScreen
  from './src/telas/Login';

import InicioScreen
  from './src/telas/Inicio';

import PresencaScreen
  from './src/telas/Presenca';

import MapaScreen
  from './src/telas/Mapa';

import PerfilScreen
  from './src/telas/Perfil';

import InicioProfessorScreen
  from './src/telas/InicioProfessor';

import TurmasProfessorScreen
  from './src/telas/TurmasProfessor';


const Tab =
  createBottomTabNavigator();


// ======================================================
// BOTÃO SAIR
// ======================================================

function BotaoSair() {
  const { sair } =
    useAuth();

  const confirmarSaida = () => {
    Alert.alert(
      'Sair',
      'Deseja sair da sua conta?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },

        {
          text: 'Sair',
          style: 'destructive',
          onPress: sair,
        },
      ]
    );
  };


  return (
    <TouchableOpacity
      onPress={confirmarSaida}
      style={{
        marginRight: 16,
      }}
      accessibilityLabel="Sair"
    >
      <Ionicons
        name="log-out-outline"
        size={24}
        color="#fff"
      />
    </TouchableOpacity>
  );
}


// ======================================================
// ESTILO PADRÃO DO CABEÇALHO
// ======================================================

const estiloCabecalho = {
  tabBarActiveTintColor:
    '#a2181c',

  tabBarInactiveTintColor:
    'gray',

  headerStyle: {
    backgroundColor:
      '#a2181c',
  },

  headerTintColor:
    '#fff',

  headerTitleAlign:
    'center',

  headerTitleStyle: {
    fontWeight:
      'bold',

    letterSpacing:
      1,
  },

  headerRight:
    () => <BotaoSair />,
};


// ======================================================
// ABAS DO ALUNO
// ======================================================

function AbasAluno() {
  return (
    <Tab.Navigator
      screenOptions={({
        route,
      }) => ({
        tabBarIcon: ({
          color,
          size,
        }) => {
          let iconName;

          if (
            route.name ===
            'Início'
          ) {
            iconName =
              'home';

          } else if (
            route.name ===
            'Presença'
          ) {
            iconName =
              'scan-circle';

          } else if (
            route.name ===
            'Mapa'
          ) {
            iconName =
              'map';

          } else if (
            route.name ===
            'Perfil'
          ) {
            iconName =
              'person';
          }


          return (
            <Ionicons
              name={
                iconName
              }
              size={
                size
              }
              color={
                color
              }
            />
          );
        },

        ...estiloCabecalho,
      })}
    >

      <Tab.Screen
        name="Início"
        component={
          InicioScreen
        }
        options={{
          title:
            'Área do Aluno',
        }}
      />


      <Tab.Screen
        name="Presença"
        component={
          PresencaScreen
        }
        options={{
          title:
            'Registrar presença',
        }}
      />


      <Tab.Screen
        name="Mapa"
        component={
          MapaScreen
        }
        options={{
          title:
            'Mapa do Campus',
        }}
      />


      <Tab.Screen
        name="Perfil"
        component={
          PerfilScreen
        }
        options={{
          title:
            'Meu Perfil',
        }}
      />

    </Tab.Navigator>
  );
}


// ======================================================
// ABAS DO PROFESSOR
// ======================================================

function AbasProfessor() {
  return (
    <Tab.Navigator
      screenOptions={({
        route,
      }) => ({
        tabBarIcon: ({
          color,
          size,
        }) => {
          let iconName;

          if (
            route.name ===
            'InícioProfessor'
          ) {
            iconName =
              'home';

          } else if (
            route.name ===
            'TurmasProfessor'
          ) {
            iconName =
              'school';
          }


          return (
            <Ionicons
              name={
                iconName
              }
              size={
                size
              }
              color={
                color
              }
            />
          );
        },

        ...estiloCabecalho,
      })}
    >

      <Tab.Screen
        name="InícioProfessor"
        component={
          InicioProfessorScreen
        }
        options={{
          title:
            'Área do Professor',

          tabBarLabel:
            'Início',
        }}
      />


      <Tab.Screen
        name="TurmasProfessor"
        component={
          TurmasProfessorScreen
        }
        options={{
          title:
            'Minhas Turmas',

          tabBarLabel:
            'Turmas',
        }}
      />

    </Tab.Navigator>
  );
}


// ======================================================
// ROTAS
// ======================================================

function Rotas() {
  const { usuario } =
    useAuth();


  if (!usuario) {
    return (
      <LoginScreen />
    );
  }


  if (
    usuario.tipo ===
    'professor'
  ) {
    return (
      <AbasProfessor />
    );
  }


  return (
    <AbasAluno />
  );
}


// ======================================================
// APP
// ======================================================

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Rotas />
      </NavigationContainer>
    </AuthProvider>
  );
}