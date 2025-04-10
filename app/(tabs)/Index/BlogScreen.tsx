import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, ListRenderItem, Linking } from 'react-native';

const images = {
  b1: require('../../../assets/images/b1.png'),
  b2: require('../../../assets/images/b2.png'),
  b3: require('../../../assets/images/b3.png'),
  b4: require('../../../assets/images/b4.png'),
  b5: require('../../../assets/images/b5.png'),
};

interface BlogPost {
  id: string;
  title: string;
  date: string;
  author: string;
  image: any;
  link: string;
}

const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Cuidados com a pele durante o verão',
    date: '20 de março de 2024',
    author: 'Brasil Agora',
    image: images.b1,
    link: 'https://brasilagoraonline.com.br/noticias/2024/01/cuidados-com-a-pele-no-verao-especialista-destaca-a-importancia-da-protecao-dermatologica/',
  },
  {
    id: '2',
    title: 'Benefícios do tratamento facial com produtos naturais',
    date: '24 de maio de 2022',
    author: 'Marie Claire',
    image: images.b2,
    link: 'https://revistamarieclaire.globo.com/Beleza/noticia/2022/05/ativos-organicos-e-naturais-potencializam-acao-de-produtos-na-rotina-de-skincare.html',
  },
  {
    id: '3',
    title: 'Dicas de beleza para uma pele radiante no inverno',
    date: '29 de fevereiro de 2024',
    author: 'iapcosmeticos',
    image: images.b3,
    link: 'https://blog.iapcosmeticos.com.br/pele-no-inverno/#:~:text=7%20dicas%20para%20cuidar%20da%20pele%20no%20inverno,umidificadores%20quando%20o%20tempo%20estiver%20muito%20seco%20',
  },
  {
    id: '4',
    title: 'Os melhores tratamentos para rejuvenescimento facial',
    date: '30 de abril de 2024',
    author: 'Dermaclub',
    image: images.b4,
    link: 'https://www.dermaclub.com.br/blog/rosto/pele-madura.html',
  },
  {
    id: '5',
    title: 'Cuidados com a pele no dia a dia: dicas essenciais',
    date: '04 de janeiro de 2024',
    author: 'Vogue',
    image: images.b5,
    link: 'https://vogue.globo.com/beleza/noticia/2024/01/5-dicas-para-ter-uma-pele-saudavel-em-2024-indicadas-por-uma-dermatologista.ghtml',
  },
];

const BlogScreen: React.FC = () => {
  const renderItem: ListRenderItem<BlogPost> = ({ item }) => (
    <View style={styles.blogItem}>
      <Image source={item.image} style={styles.image} />
      <View style={styles.content}>
        <View style={styles.intro}>
          <Text style={styles.date}>{item.date}</Text>
          <Text style={styles.author}>{item.author}</Text>
        </View>
        <Text style={styles.title}>{item.title}</Text>
        <TouchableOpacity onPress={() => Linking.openURL(item.link)} style={styles.button}>
          <Text style={styles.buttonText}>Leia mais →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      
      <FlatList
        data={blogPosts}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.flatList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D2B48C', // Marrom claro
    alignItems: 'center',
    paddingVertical: 20,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
  },
  highlight: {
    color: '#27ae60',
  },
  flatList: {
    flexGrow: 0,
  },
  blogItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    width: 370,
    height: 500,
  },
  image: {
    width: '100%',
    height: 220,
    borderRadius: 8,
    marginBottom: 10,
  },
  content: {
    paddingHorizontal: 10,
  },
  intro: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  date: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  author: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  button: {
    backgroundColor: '#27ae60',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BlogScreen;
