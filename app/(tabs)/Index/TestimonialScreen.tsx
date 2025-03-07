import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Modal, TextInput, Button, TouchableOpacity } from 'react-native';

// Definição da interface para os depoimentos
interface Testimonial {
  image: any;
  comment: string;
  name: string;
  role: string;
}

// Dados dos depoimentos
const testimonials: Testimonial[] = [
  {
    image: require('../../../assets/images/Perfil1.png'),
    comment:
      'Estou muito feliz com os resultados do tratamento de rejuvenescimento facial na Elysium Beauty. A equipe é extremamente profissional e atenciosa. Recomendo!',
    name: 'Carla Silva',
    role: 'Cliente Satisfeita',
  },
  {
    image: require('../../../assets/images/Perfil2.png'),
    comment:
      'Os tratamentos na Elysium Beauty realmente fazem a diferença. Estou muito feliz com os resultados!',
    name: 'Marcos Oliveira',
    role: 'Cliente Fiel',
  },
  {
    image: require('../../../assets/images/Perfil3.png'),
    comment:
      'Excelente atendimento e resultados incríveis nos tratamentos estéticos. Recomendo a Elysium Beauty para todos!',
    name: 'Patrícia Santos',
    role: 'Cliente Satisfeita',
  },
  {
    image: require('../../../assets/images/Perfil4.png'),
    comment:
      'Profissionais competentes e ambiente acolhedor. Sempre saio da clínica renovado!',
    name: 'Lucas Mendes',
    role: 'Cliente Satisfeito',
  },
  {
    image: require('../../../assets/images/Perfil5.png'),
    comment:
      'Eu amo os tratamentos de skincare na Elysium Beauty. Minha pele nunca esteve tão radiante!',
    name: 'Ana Clara',
    role: 'Cliente Satisfeita',
  },
];

const TestimonialScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [newName, setNewName] = useState('');
  const [newComment, setNewComment] = useState('');
  const [testimonialsData, setTestimonialsData] = useState(testimonials);

  // Função para adicionar um novo comentário
  const addTestimonial = () => {
    if (newName && newComment) {
      const newTestimonial: Testimonial = {
        image: require('../../../assets/images/Perfil1.png'), // Pode ser uma imagem padrão ou do usuário
        comment: newComment,
        name: newName,
        role: 'Novo Cliente', // Pode permitir o usuário escolher o papel ou definir um valor padrão
      };
      setTestimonialsData([...testimonialsData, newTestimonial]);
      setModalVisible(false);
      setNewName('');
      setNewComment('');
    } else {
      alert("Por favor, preencha todos os campos.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.heading}>
        <Text style={styles.headingText}>Depoimentos</Text>
      </View>

      <ScrollView contentContainerStyle={styles.testimonialList}>
        {testimonialsData.map((item, index) => (
          <View key={index} style={styles.testimonialItem}>
            <Image source={item.image} style={styles.image} />
            <Text style={styles.quoteIcon}>“</Text>
            <Text style={styles.comment}>{item.comment}</Text>
            <View style={styles.intro}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.role}>{item.role}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Botão para abrir o modal de adicionar comentário */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>Adicionar Comentário</Text>
      </TouchableOpacity>

      {/* Modal para adicionar um comentário */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Adicionar Comentário</Text>

            {/* Campo de nome */}
            <TextInput
              style={styles.input}
              placeholder="Seu nome"
              value={newName}
              onChangeText={setNewName}
            />

            {/* Campo de comentário */}
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Seu comentário"
              value={newComment}
              onChangeText={setNewComment}
              multiline
            />

            {/* Botões do modal */}
            <Button title="Adicionar" onPress={addTestimonial} />
            <Button title="Cancelar" onPress={() => setModalVisible(false)} color="red" />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D1B28D', // Cor marrom claro no fundo
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  heading: {
    alignItems: 'center',
    marginBottom: 20,
  },
  headingText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  testimonialList: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  testimonialItem: {
    backgroundColor: '#f7f7f7',
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    width: '100%',
    maxWidth: 350,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  quoteIcon: {
    fontSize: 40,
    color: '#888',
    position: 'absolute',
    top: 10,
    left: 10,
  },
  comment: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#555',
    marginBottom: 15,
  },
  intro: {
    marginTop: 10,
    alignItems: 'center',
  },
  name: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  role: {
    fontSize: 14,
    color: '#777',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 15,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
  },
  textArea: {
    height: 100,
  },
});

export default TestimonialScreen;
