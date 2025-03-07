import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Modal } from 'react-native';

const AboutScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.imageContainer}>
        <Image 
          source={require('../../../assets/images/Elysium.png')} 
          style={styles.image} 
        />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Elysium Beautiful</Text>

        <View style={styles.infoContainer}>
          <Text style={styles.info}>Fundação: <Text style={styles.highlight}>2010</Text></Text>
          <Text style={styles.info}>Especialidade: <Text style={styles.highlight}>Estética e Bem-Estar</Text></Text>
          <Text style={styles.info}>Idiomas: <Text style={styles.highlight}>Português, Inglês</Text></Text>
          <Text style={styles.info}>Localização: <Text style={styles.highlight}>São Paulo, Brasil</Text></Text>
          <Text style={styles.info}>Disponibilidade: <Text style={styles.highlight}>De Segunda a Sábado</Text></Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
          <Text style={styles.buttonText}>Conheça Mais</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>14+</Text>
          <Text style={styles.statText}>Anos de Experiência</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>1000+</Text>
          <Text style={styles.statText}>Clientes Satisfeitos</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>2000+</Text>
          <Text style={styles.statText}>Procedimentos Realizados</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>50+</Text>
          <Text style={styles.statText}>Prêmios e Reconhecimentos</Text>
        </View>
      </View>

      {/* Modal de Saiba Mais */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Sobre a Elysium</Text>
            <Text style={styles.modalDescription}>
              Na Elysium, nos dedicamos a proporcionar tratamentos estéticos faciais e corporais de alta qualidade, focados no
              bem-estar e na beleza de nossos clientes. Com anos de experiência e uma equipe altamente qualificada, estamos aqui para
              oferecer um serviço excepcional e personalizado.
            </Text>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#D2B48C', // Marrom claro
    alignItems: 'center',
    minHeight: '100%', // Garantir que a tela ocupe toda a altura
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    borderRadius: 100, // Borda arredondada
  },
  content: {
    alignItems: 'center',
    flex: 1, // Permite o conteúdo ocupar o espaço restante
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 10,
  },
  infoContainer: {
    marginBottom: 20,
  },
  info: {
    fontSize: 16,
    color: '#444',
    marginBottom: 5,
  },
  highlight: {
    fontWeight: 'bold',
    color: '#8B4513',
  },
  button: {
    backgroundColor: '#8B4513', // Marrom escuro
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%', // Para garantir que os elementos se ajustem bem
  },
  statBox: {
    backgroundColor: '#fff',
    padding: 15,
    margin: 5,
    borderRadius: 10,
    alignItems: 'center',
    width: '45%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 2, height: 2 },
    elevation: 2,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#8B4513',
  },
  statText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#333',
  },
  // Estilos do Modal
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fundo semitransparente
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    maxHeight: '80%', // Limita a altura do modal
    overflow: 'scroll', // Caso o conteúdo ultrapasse o limite, permite rolar
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#8B4513', // Marrom escuro
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default AboutScreen;
