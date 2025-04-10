import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Alert } from 'react-native';
import { TextInput, Button, Text, Snackbar } from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useRouter } from 'expo-router';

const API_URL = 'http://10.0.2.2:3000';

// Tipagem correta para evitar erro do TypeScript
type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  AlterarSenha: undefined; // Adicionei a rota para alteração de senha
};

export default function AlterarSenhaScreen() {
  const [email, setEmail] = useState('');
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [visibleSnackbar, setVisibleSnackbar] = useState(false);
  const router = useRouter();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const handleChangePassword = async () => {
    if (!email || !senhaAtual || !novaSenha) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos!');
      return;
    }
  
    setLoading(true);
  
    try {
      const response = await axios.put(`${API_URL}/usuarios/alterar-senha`, {
        email,
        senhaAtual,
        novaSenha,
      });
  
      if (response.status === 200) {
        Alert.alert('Sucesso', 'Senha alterada com sucesso!', [
          { text: 'OK', onPress: () => navigation.reset({ index: 0, routes: [{ name: 'Home' }] }) }
        ]);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const { status, data } = error.response;
        let errorMessage = 'Ocorreu um erro inesperado.';
  
        switch (status) {
          case 400:
            errorMessage = 'Email, senha atual e nova senha são obrigatórios.';
            break;
          case 401:
            errorMessage = 'Senha atual incorreta.';
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

      <Text style={styles.title}>Alterar Senha</Text>

      <TextInput
        label="E-mail"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        label="Senha Atual"
        value={senhaAtual}
        onChangeText={setSenhaAtual}
        secureTextEntry
        style={styles.input}
      />

      <TextInput
        label="Nova Senha"
        value={novaSenha}
        onChangeText={setNovaSenha}
        secureTextEntry
        style={styles.input}
      />

      <Button
        mode="contained"
        onPress={handleChangePassword}
        style={styles.button}
        loading={loading}
        disabled={loading}
      >
        Alterar Senha
      </Button>

      <Snackbar
        visible={visibleSnackbar}
        onDismiss={() => setVisibleSnackbar(false)}
        duration={Snackbar.DURATION_SHORT}
      >
        Senha alterada com sucesso!
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
