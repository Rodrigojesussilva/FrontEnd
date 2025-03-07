import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const HomeScreen = () => {
  const [typingText, setTypingText] = useState('');

  useEffect(() => {
    const typeStrings = [
      'tratamentos Faciais',
      'tratamentos Corporais',
      'tratamentos Capilares',
      'Podologia',
      'Bem-estar e Terapias Alternativas'
    ];

    let index = 0;
    const typeInterval = setInterval(() => {
      setTypingText(typeStrings[index]);
      index = (index + 1) % typeStrings.length;
    }, 3000);

    return () => clearInterval(typeInterval);
  }, []);

  return (
    <View style={styles.container}>
      {/* Imagem no topo */}
      <View style={styles.imageContainer}>
        <Image source={require('../../../assets/images/Elysium.png')} style={styles.image} />
      </View>
      
      {/* Texto abaixo */}
      <View style={styles.content}>
        <Text style={styles.title}>Bem-vindo à Elysium!</Text>
        <Text style={styles.subtitle}>
          Nós Somos Especialistas em <Text style={styles.typingText}>{typingText}</Text>
        </Text>
        
        {/* Texto "Sobre Nós" substituindo o botão */}
        <Text style={styles.aboutText}>
          Na Clínica Elysium, acreditamos que cada pessoa merece sentir-se bem em sua própria pele.{' '}
          Nossa missão é proporcionar tratamentos estéticos de alta qualidade, combinados com um atendimento personalizado, para ajudar você a alcançar a sua melhor versão.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#D2B48C', // Marrom claro (Bege)
  },
  imageContainer: {
    marginBottom: 20,
  },
  image: {
    width: 200, // Aumentei um pouco o tamanho da imagem para equilíbrio visual
    height: 200,
    resizeMode: 'contain',
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontSize: 32, // Aumentei o tamanho do título
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 10, // Adicionei mais espaço abaixo do título
  },
  subtitle: {
    fontSize: 22, // Aumentei o tamanho do subtítulo
    fontWeight: '600',
    marginTop: 5,
    textAlign: 'center',
  },
  typingText: {
    color: '#27ae60',
    fontWeight: 'bold',
    fontSize: 24, // Aumentei a fonte do texto dinâmico para mais destaque
  },
  aboutText: {
    fontSize: 18, // Aumentei um pouco o tamanho do texto sobre a clínica
    fontWeight: '400',
    color: '#333',
    marginTop: 20,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

export default HomeScreen;
