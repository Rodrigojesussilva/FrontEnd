import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Pressable } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import LoginScreen from './Login';
import AlterarSenhaScreen from './AlterarSenha';
import RedefinirSenhaScreen from './RedefinirSenha';
import RegistroUserScreen from './RegistroUser';
import CadastroAtendimento from './CadastroAtendimento';
import GerenciamentoAgendamentoUser from '../GerenciamentoAgendamentoUser';
import GerenciamentoAgendamento from '../GerenciamentoAgendamento';
import GerenciamentoServico from '../GerenciamentoServico';
import GerenciamentoUser from '../GerenciamentoUser';

import Relatorio from '../Relatorio';


// Telas
import HomeScreen from './index';
import AboutScreen from './Index/AboutScreen';
import ServiceScreen from './Index/ServiceScreen';
import PortfolioScreen from './Index/PortfolioScreen';
import TestimonialScreen from './Index/TestimonialScreen';
import BlogScreen from './Index/BlogScreen';
import ContactScreen from './Index/ContactScreen';
import { RouteProp } from '@react-navigation/native';

// Criando os navegadores
const DrawerNavigator = createDrawerNavigator();
const TabNavigator = createBottomTabNavigator();
type IconName =
  | 'home'
  | 'information'
  | 'construct'
  | 'briefcase'
  | 'people'
  | 'file-tray'
  | 'call';
// Função para configurar as Tabs
function Tabs() {
  return (
    <TabNavigator.Navigator
      initialRouteName="Home"
      screenOptions={({ route }: { route: RouteProp<any, any> }) => ({
        tabBarIcon: ({ color, size }: { color: string; size: number }) => {
          let iconName: IconName; // Agora tipado corretamente

          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'Sobre nos':
              iconName = 'information';
              break;
            case 'Nossos serviços':
              iconName = 'construct';
              break;
            case 'Portfolio':
              iconName = 'briefcase';
              break;
            case 'Depoimentos':
              iconName = 'people';
              break;
            case 'Noticias sobre nossos serviços':
              iconName = 'file-tray';
              break;
            case 'Contate -me':
              iconName = 'call';
              break;
            default:
              iconName = 'home';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <TabNavigator.Screen name="Home" component={HomeScreen} />
      <TabNavigator.Screen name="Sobre nos" component={AboutScreen} />
      <TabNavigator.Screen name="Nossos serviços" component={ServiceScreen} />
      <TabNavigator.Screen name="Portfolio" component={PortfolioScreen} />
      <TabNavigator.Screen name="Depoimentos" component={TestimonialScreen} />
      <TabNavigator.Screen name="Noticias sobre nossos serviços" component={BlogScreen} />
      <TabNavigator.Screen name="Contate -me" component={ContactScreen} />
    </TabNavigator.Navigator>
  );
}

export default function DrawerLayout() {
  const colorScheme = useColorScheme();
  const [userType, setUserType] = useState<string | null>(null); // Estado do tipo de usuário
  const [loading, setLoading] = useState(true); // Estado para controle de carregamento

  
  // Usando useEffect para buscar o userType assim que o componente for montado
  useEffect(() => { 
    const fetchUserType = async () => {
      try {
        const userTypeStored = await AsyncStorage.getItem('userType');
        if (userTypeStored) {
          console.log('userTypeStored:', userTypeStored);
          setUserType(userTypeStored);
        } else {
          console.log('Nenhum userType encontrado');
        }
      } catch (error) {
        console.error('Erro ao obter userType:', error);
      } finally {
        setLoading(false); // Define o estado de loading como false
      }
    };

    fetchUserType(); // Chama a função para buscar o userType
  }, []); // O efeito só será executado na montagem do componente
    
  

  // Exibe um carregamento até que o tipo de usuário seja obtido
  if (loading) {
    return null; // Ou renderize um componente de carregamento (ex. um spinner)
  }

  // Função para limpar os dados do AsyncStorage
  const handleLogout = async () => {
    await AsyncStorage.removeItem('userId'); // Remove o userId
    await AsyncStorage.removeItem('userName'); // Remove o userName
    await AsyncStorage.removeItem('userType'); // Remove o userType
    setUserType(null); // Limpa o estado local do userType
  };

  return (
    <DrawerNavigator.Navigator
      screenOptions={({ navigation }) => ({
        drawerActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerLeft: () => (
          <Pressable
            onPress={() => {
              // Verifica o userType no AsyncStorage quando o botão do menu é pressionado
              AsyncStorage.getItem('userType')
                .then((userTypeStored) => {
                  //console.log('userTypeStored:', userTypeStored); // Verifique o valor de userType
                  setUserType(userTypeStored); // Atualiza o estado com o valor do userType
                  setLoading(false); // Define o estado de loading como false
                  navigation.toggleDrawer(); // Abre ou fecha o drawer
                })
                .catch((error) => {
                  console.error('Erro ao obter userType:', error);
                  setLoading(false); // Em caso de erro, ainda define o loading como false
                });
            }}
            style={{ marginLeft: 15 }}
          >
            <Ionicons name="menu" size={28} color={Colors[colorScheme ?? 'light'].tint} />
          </Pressable>
        ),
      })}
    >

      {/* Tela de Home que conterá o TabNavigator */}
      <DrawerNavigator.Screen
        name="Home"
        options={{
          title: 'Inicio',
          drawerIcon: ({ color }: { color: string }) => <Ionicons name="home-outline" size={28} color={color} />,
        }}
        component={Tabs} // Aqui você usa o TabNavigator diretamente
      />
      
      {userType !== '0' && userType !== '1' && (
        <>
          <DrawerNavigator.Screen
            name="Login"
            options={{
              title: 'Login',
              drawerIcon: ({ color }: { color: string }) => <Ionicons name="log-in-outline" size={28} color={color} />,
            }}
            component={LoginScreen}
          />

          <DrawerNavigator.Screen
            name="RegistroUser"
            options={{
              title: 'Cadastro de Usuário',
              drawerIcon: ({ color }: { color: string }) => <Ionicons name="person-add-outline" size={28} color={color} />,
            }}
            component={RegistroUserScreen} 
          />

      </>
)}
      {/* Condicional para gerenciar as telas, com base no tipo de usuário */}
      {userType === '0' && (
        <>
          <DrawerNavigator.Screen
            name="GerenciamentoAgendamento"
            options={{
              title: 'Gerenciamento de Agendamento',
              drawerIcon: ({ color }: { color: string }) => <Ionicons name="people" size={28} color={color} />,
            }}
            component={GerenciamentoAgendamento}
          />
          <DrawerNavigator.Screen
            name="GerenciamentoUser"
            options={{
              title: 'Gerenciamento de Usuarios',
              drawerIcon: ({ color }: { color: string }) => <Ionicons name="calendar-outline" size={28} color={color} />,
            }}
            component={GerenciamentoUser}
          />  
          <DrawerNavigator.Screen
            name="GerenciamentoServico"
            options={{
              title: 'Gerenciamento de Serviço',
              drawerIcon: ({ color }: { color: string }) => <Ionicons name="construct-outline" size={28} color={color} />,
            }}
            component={GerenciamentoServico}
          />
          <DrawerNavigator.Screen
            name="Reletorio"
            options={{
              title: 'Relatorio',
              drawerIcon: ({ color }: { color: string }) => <Ionicons name="document" size={28} color={color} />,
            }}
            component={Relatorio}
          />
        <DrawerNavigator.Screen
          name="AlterarSenha"
          options={{
            title: 'Alterar Senha',
            drawerIcon: ({ color }: { color: string }) => <Ionicons name="key-outline" size={28} color={color} />,
          }}
          component={AlterarSenhaScreen} 
       />

      <DrawerNavigator.Screen
        name="RedefinirSenha"
        options={{
          title: 'Redefinir Senha',
          drawerIcon: ({ color }: { color: string }) => <Ionicons name="lock-open-outline" size={28} color={color} />,
        }}
        component={RedefinirSenhaScreen} 
      />
          <DrawerNavigator.Screen
            name="Sair"
            options={{
              title: 'Sair',
              drawerIcon: ({ color }: { color: string }) => <Ionicons name="log-out-outline" size={28} color={color} />,
            }}
            listeners={{
              focus: () => {
                console.log('userType:', userType); // Verifique o estado antes de realizar a ação
                handleLogout(); // Limpa os dados de usuário do AsyncStorage
              },
            }}
            component={() => null} // Componente vazio, já que você não quer mudar de tela
          />
        </>
      )}
      
      {userType === '1' && (
        <>
          
          <DrawerNavigator.Screen
            name="GerenciamentoAgendamento"
            options={{
              title: 'Gerenciamento de Agendamento',
              drawerIcon: ({ color }: { color: string }) => <Ionicons name="calendar-outline" size={28} color={color} />,
            }}
            component={GerenciamentoAgendamentoUser}
          />
          <DrawerNavigator.Screen
            name="CadastroAtendimento"
            options={{
              title: 'Cadastro do Atendimento',
              drawerIcon: ({ color }: { color: string }) => <Ionicons name="person-add-outline" size={28} color={color} />,
            }}
            component={CadastroAtendimento} // Substitua pelo componente correto, caso tenha outro
          />
                <DrawerNavigator.Screen
        name="AlterarSenha"
        options={{
          title: 'Alterar Senha',
          drawerIcon: ({ color }: { color: string }) => <Ionicons name="key-outline" size={28} color={color} />,
        }}
        component={AlterarSenhaScreen} 
      />

      <DrawerNavigator.Screen
        name="RedefinirSenha"
        options={{
          title: 'Redefinir Senha',
          drawerIcon: ({ color }: { color: string }) => <Ionicons name="lock-open-outline" size={28} color={color} />,
        }}
        component={RedefinirSenhaScreen} 
      />
          <DrawerNavigator.Screen
            name="Sair"
            options={{
              title: 'Sair',
              drawerIcon: ({ color }: { color: string }) => <Ionicons name="log-out-outline" size={28} color={color} />,
            }}
            listeners={{
              focus: () => {
                console.log('userType:', userType); // Verifique o estado antes de realizar a ação
                handleLogout(); // Limpa os dados de usuário do AsyncStorage
              },
            }}
            component={() => null} // Componente vazio, já que você não quer mudar de tela
          />
        </>
      )}
    </DrawerNavigator.Navigator>
  );
}
