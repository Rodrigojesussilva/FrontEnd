import React, { useState } from 'react';
import { View, StyleSheet, Image, Alert } from 'react-native';
import { TextInput, Button, Text, Snackbar } from 'react-native-paper';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

const API_URL = 'http://10.0.2.2:3000';

// Tipagem correta para evitar erro do TypeScript
type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  RedefinirSenha: undefined;  // Certifique-se de adicionar a rota Redefinir Senha
};

export default function RedefinirSenhaScreen() {
  const [email, setEmail] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [visibleSnackbar, setVisibleSnackbar] = useState(false);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const handleRedefinirSenha = async () => {
    if (!email || !novaSenha || !confirmarSenha) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos!');
      return;
    }

    if (novaSenha !== confirmarSenha) {
      Alert.alert('Erro', 'As senhas não coincidem!');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.put(`${API_URL}/usuarios/redefinir-senha`, {
        email,
        novaSenha,
        confirmarSenha,
      });

      if (response.status === 200) {
        Alert.alert('Sucesso', 'Senha redefinida com sucesso!', [
          {
            text: 'OK',
            onPress: () => {
              setTimeout(() => {
                navigation.reset({ index: 0, routes: [{ name: 'Home' }] }); // Usar reset
              }, 1000);
            }
          }
        ]);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const { status, data } = error.response;
        let errorMessage = 'Ocorreu um erro inesperado.';

        switch (status) {
          case 400:
            errorMessage = 'Email, nova senha e confirmação de senha são obrigatórios.';
            break;
          case 404:
            errorMessage = 'Usuário não encontrado.';
            break;
          default:
            errorMessage = data.error || errorMessage;
            break;
        }

        Alert.alert('Erro', errorMessage);
      } else {
        Alert.alert('Erro', 'Falha ao conectar ao servidor. Verifique sua conexão.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.imageWrapper}>
          <Image source={require('../../assets/images/Elysium.png')} style={styles.image} />
        </View>
        <Text style={styles.brand}>Elysium Beauty</Text>
      </View>

      <Text style={styles.title}>Redefinir Senha</Text>

      <TextInput
        label="E-mail"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        label="Nova Senha"
        value={novaSenha}
        onChangeText={setNovaSenha}
        secureTextEntry
        style={styles.input}
      />

      <TextInput
        label="Confirmar Senha"
        value={confirmarSenha}
        onChangeText={setConfirmarSenha}
        secureTextEntry
        style={styles.input}
      />

      <Button
        mode="contained"
        onPress={handleRedefinirSenha}
        style={styles.button}
        loading={loading}
        disabled={loading}
      >
        Redefinir Senha
      </Button>

      <Snackbar
        visible={visibleSnackbar}
        onDismiss={() => setVisibleSnackbar(false)}
        duration={Snackbar.DURATION_SHORT}
      >
        Senha redefinida com sucesso!
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#D2B48C',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  imageWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
    marginRight: 15,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  brand: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#5D4037',
    fontFamily: 'serif',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    marginBottom: 15,
  },
  button: {
    width: '100%',
    marginTop: 10,
    backgroundColor: '#A67B5B',
  },
});
