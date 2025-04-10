import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // Biblioteca de ícones

// Definindo o tipo do componente ServiceItem para aceitar apenas os ícones disponíveis na biblioteca FontAwesome do Expo
interface ServiceItemProps {
  icon: React.ComponentProps<typeof FontAwesome>['name']; // Usando os ícones disponíveis na biblioteca FontAwesome
  title: string;
  description: string;
}

const ServicesScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.heading}>
        
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Agendar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.serviceContainer}>
        <ServiceItem
          icon="search"
          title="Tratamentos Faciais Avançados"
          description="Nossos tratamentos faciais incluem limpeza de pele profunda, peelings químicos, microagulhamento, laser facial, radiofrequência e hidratação facial intensiva."
        />
        <ServiceItem
          icon="heart"
          title="Tratamentos Corporais"
          description="Oferecemos massagens terapêuticas, lipocavitação, criolipólise, radiofrequência corporal, endermologia e envoltórios corporais para desintoxicação e hidratação."
        />
        <ServiceItem
          icon="cut"
          title="Tratamentos Capilares"
          description="Nossos tratamentos capilares incluem mesoterapia, terapia com LED, PRP capilar, detox capilar, hidratação e nutrição profunda dos fios."
        />
        <ServiceItem
          icon="stethoscope"
          title="Podologia"
          description="Oferecemos tratamento de calos e calosidades, cuidados com unhas encravadas, tratamento de micoses, reflexologia podal, hidratação e esfoliação dos pés e tratamento para pés diabéticos."
        />
        <ServiceItem
          icon="leaf"
          title="Bem-Estar e Terapias Alternativas"
          description="Nossos serviços incluem aromaterapia, acupuntura estética, terapia com pedras quentes, reflexologia, reiki e meditação guiada."
        />
        <ServiceItem
          icon="cut"
          title="Tratamentos Corporais de Estética e Remodelação"
          description="Oferecemos depilação a laser, tratamentos para estrias e cicatrizes, tratamentos para flacidez, bronzeamento artificial, clareamento de áreas específicas do corpo e terapias de esfoliação corporal e hidratação profunda."
        />
      </View>
    </ScrollView>
  );
};

// Componente para representar cada item de serviço
const ServiceItem = ({ icon, title, description }: ServiceItemProps) => {
  return (
    <View style={styles.serviceItem}>
      <FontAwesome name={icon} size={40} color="#8B4513" style={styles.icon} />
      <Text style={styles.serviceTitle}>{title}</Text>
      <Text style={styles.serviceDescription}>{description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D2B48C', // Cor de fundo marrom claro
    padding: 20,
  },
  heading: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#8B4513', // Cor marrom para o título
  },
  highlight: {
    color: '#8B4513', // Cor marrom para destacar a palavra 'serviços'
  },
  button: {
    backgroundColor: '#8B4513', // Cor do botão marrom
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  serviceContainer: {
    marginTop: 20,
  },
  serviceItem: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 2, height: 2 },
    elevation: 3,
    alignItems: 'center',
  },
  icon: {
    marginBottom: 10,
  },
  serviceTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B4513', // Cor marrom para os títulos dos serviços
    marginBottom: 10,
  },
  serviceDescription: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
});

export default ServicesScreen;
