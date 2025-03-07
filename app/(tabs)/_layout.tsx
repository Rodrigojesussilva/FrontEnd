import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Pressable } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import ExploreScreen from './explore';
import LoginScreen from './Login';
import RegistroUserScreen from './RegistroUser';
import GerenciamentoUser from '../GerenciamentoUser';
import GerenciamentoAgendamento from '../GerenciamentoAgendamento';
import GerenciamentoServico from '../GerenciamentoServico';
// Telas
import HomeScreen from './Index/HomeScreen';
import AboutScreen from './Index/AboutScreen';
import ServiceScreen from './Index/ServiceScreen';
import PortfolioScreen from './Index/PortfolioScreen';
import TestimonialScreen from './Index/TestimonialScreen';
import BlogScreen from './Index/BlogScreen';
import ContactScreen from './Index/ContactScreen';
import GerenciamentoService from '../GerenciamentoServico';

// Criando os navegadores
const DrawerNavigator = createDrawerNavigator();
const TabNavigator = createBottomTabNavigator();

// Função para configurar as Tabs
function Tabs() {
  return (
    <TabNavigator.Navigator
    initialRouteName="Home"  // Definindo a tela inicial como "Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: string;

          switch (route.name) {
            case 'Home':
              iconName = 'home'; // Ícone válido
              break;
            case 'About':
              iconName = 'information'; // Ícone válido
              break;
            case 'Service':
              iconName = 'construct'; // Ícone alternativo para Service
              break;
            case 'Portfolio':
              iconName = 'briefcase'; // Ícone alternativo para Portfolio
              break;
            case 'Testimonial':
              iconName = 'people'; // Ícone válido
              break;
            case 'Blog':
              iconName = 'file-tray'; // Ícone válido
              break;
            case 'Contact':
              iconName = 'call'; // Ícone válido
              break;
            default:
              iconName = 'home'; // Fallback
          }
          

          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
      })}
    >
      <TabNavigator.Screen name="Home" component={HomeScreen} />
      <TabNavigator.Screen name="About" component={AboutScreen} />
      <TabNavigator.Screen name="Service" component={ServiceScreen} />
      <TabNavigator.Screen name="Portfolio" component={PortfolioScreen} />
      <TabNavigator.Screen name="Testimonial" component={TestimonialScreen} />
      <TabNavigator.Screen name="Blog" component={BlogScreen} />
      <TabNavigator.Screen name="Contact" component={ContactScreen} />
    </TabNavigator.Navigator>
  );
}

export default function DrawerLayout() {
  const colorScheme = useColorScheme();

  return (
    <DrawerNavigator.Navigator
      screenOptions={({ navigation }) => ({
        drawerActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerLeft: () => (
          <Pressable onPress={() => navigation.toggleDrawer()} style={{ marginLeft: 15 }}>
            <Ionicons name="menu" size={28} color={Colors[colorScheme ?? 'light'].tint} />
          </Pressable>
        ),
      })}
    >
      {/* Tela de Home que conterá o TabNavigator */}
      <DrawerNavigator.Screen
        name="Home"
        options={{
          title: 'Home',
          drawerIcon: ({ color }: { color: string }) => <Ionicons name="home-outline" size={28} color={color} />,
        }}
        component={Tabs} // Aqui você usa o TabNavigator diretamente
      />
      
      {/* Outras telas */}
      <DrawerNavigator.Screen
        name="Explore"
        options={{
          title: 'Explore',
          drawerIcon: ({ color }: { color: string }) => <Ionicons name="compass-outline" size={28} color={color} />,
        }}
        component={ExploreScreen}
      />
      <DrawerNavigator.Screen
        name="Login"
        options={{
          title: 'Login',
          drawerIcon: ({ color }: { color: string }) => <Ionicons name="log-in-outline" size={28} color={color} />,
        }}
        component={LoginScreen}
      />
      <DrawerNavigator.Screen
        name="GerenciamentoUser"
        options={{
          title: 'Gerenciamento de Usuarios',
          drawerIcon: ({ color }: { color: string }) => <Ionicons name="people" size={28} color={color} />,
        }}
        component={GerenciamentoUser}
      />
      <DrawerNavigator.Screen
        name="GerenciamentoAgendamento"
        options={{
          title: 'Gerenciamento de Agendamento',
          drawerIcon: ({ color }: { color: string }) => <Ionicons name="calendar-outline" size={28} color={color} />, // Ícone relacionado a agendamento
        }}
        component={GerenciamentoAgendamento}
      />
      <DrawerNavigator.Screen
        name="GerenciamentoServico"
        options={{
          title: 'Gerenciamento de Serviço',
          drawerIcon: ({ color }: { color: string }) => <Ionicons name="construct-outline" size={28} color={color} />, // Ícone relacionado a serviço
        }}
        component={GerenciamentoServico}
      />

      <DrawerNavigator.Screen
        name="RegistroUser"
        options={{
          title: 'Registro de Usuario',
          drawerIcon: ({ color }: { color: string }) => <Ionicons name="person-add-outline" size={28} color={color} />,
        }}
        component={RegistroUserScreen}
      />
    </DrawerNavigator.Navigator>
  );
}
