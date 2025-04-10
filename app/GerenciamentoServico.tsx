import * as React from 'react';
import { Provider as PaperProvider, DataTable, TextInput, Modal, Portal, IconButton, Button, Text, Menu, Icon } from 'react-native-paper';
import { SafeAreaView, StyleSheet, View, Image, ScrollView, Alert } from 'react-native';
import axios from 'axios';
import { black, white } from 'react-native-paper/lib/typescript/styles/themes/v2/colors';

const API_URL = 'http://10.0.2.2:3000';

const GerenciamentoServico = () => {
  const [visible, setVisible] = React.useState({
    addService: false,
    editService: false,
    deleteService: false,
  });

  const [currentService, setCurrentService] = React.useState<{ id?: string; tiposervico: string; valor: string } | null>(null);
  const [services, setServices] = React.useState<{ id?: string; tiposervico: string; valor: string }[]>([]);
  const [newService, setNewService] = React.useState<{ tiposervico: string; valor: string }>({ tiposervico: '', valor: '' });
  const [visibleMenu, setVisibleMenu] = React.useState(false);
  const [campo1, setCampo1] = React.useState('');
  const options = ['Tratamentos Faciais', 'Tratamentos Corporais', 'Tratamentos Capilares', 'Podologia', 'Bem-estar e Terapias Alternativas'];
  const [searchQuery, setSearchQuery] = React.useState(''); // Estado para armazenar a pesquisa


  // Filtra os usuários com base na pesquisa
  const filteredServices = services.filter(services => {
    const query = searchQuery.toLowerCase();
    return (

      services.tiposervico.toLowerCase().includes(query) ||
      services.valor.toString().includes(query) // Converte tipoUsuario para string para comparação
    );
  });
  const fetchServices = async () => {
    try {
      const response = await axios.get(`${API_URL}/servicos`);
      setServices(response.data);
    } catch (error) {
      console.error('Erro ao buscar serviços:', (error as Error).message);
    }
  };

  const addService = async () => {
    // Validação de campos obrigatórios
        if (!newService.tiposervico || !newService.valor) {
         Alert.alert(
                 "Campos Obrigatórios",
                 "Por favor, preencha todos os campos obrigatórios: tipo de serviço e valor.",
                 [{ text: "OK" }]
               );
          return; // Interrompe a execução da função se a validação falhar
        }
    try {
      await axios.post(`${API_URL}/servico/inserir`, newService);
      setNewService({ tiposervico: '', valor: '' });
      hideModal('addService');
      fetchServices();
      Alert.alert(
        "Serviço Adicionado",
        "O serviço foi adicionado com sucesso.",
        [{ text: "OK" }]
      );
    } catch (error) {
      console.error('Erro ao adicionar serviço:', (error as Error).message);
    }
  };

  const updateService = async () => {
    if (currentService?.id) {
      // Validação de campos obrigatórios
            if (!currentService.tiposervico || !currentService.valor) {
              Alert.alert(
                "Campos Obrigatorios",
                "Por favor, preencha todos os campos obrigatórios: nome, senha, email e tipo usuario.",
                 [{ text: "OK" }]
              );        
              return; // Interrompe a execução da função se a validação falhar
            }
      try {
        await axios.put(`${API_URL}/servico/atualizar/${currentService.id}`, currentService);
        setCurrentService(null);
        hideModal('editService');
        fetchServices();
        Alert.alert(
          "Serviço Atualizado",
          "O serviço foi atualizado com sucesso.",
          [{ text: "OK" }]
        );
      } catch (error) {
        console.error('Erro ao atualizar serviço:', (error as Error).message);
      }
    }
  };

  const deleteService = async () => {
    if (currentService?.id) {
      try {
        await axios.delete(`${API_URL}/servico/deletar/${currentService.id}`);
        setCurrentService(null);
        hideModal('deleteService');
        fetchServices();
         Alert.alert(
                  "Serviço Excluido",
                  "O serviço foi excluido com sucesso.",
                  [{ text: "OK" }]
                );
      } catch (error) {
        console.error('Erro ao deletar serviço:', (error as Error).message);
      }
    }
  };

  React.useEffect(() => {
    fetchServices();
  }, []);

  const showModal = (type: 'addService' | 'editService' | 'deleteService') => {
    setVisible({ ...visible, [type]: true });
  };

  const hideModal = (type: 'addService' | 'editService' | 'deleteService') => {
    setVisible({ ...visible, [type]: false });
  };

  return (
    <PaperProvider>
      <SafeAreaView style={styles.container}>
        <Image
          source={require('../assets/images/Elysium.png')}
          style={styles.image}
        />
        <Button
          icon="plus"
          mode="contained"
          onPress={() => showModal('addService')}
          textColor="white"
          buttonColor="#A67B5B"
          contentStyle={{ flexDirection: 'row', alignItems: 'center' }}
          labelStyle={{ marginLeft: 12 }}
        >
          Adicionar Serviço
        </Button>

        {/* Campo de pesquisa */}
        <TextInput
          label="Pesquisar"
          mode="outlined"
          value={searchQuery}
          onChangeText={text => setSearchQuery(text)}
          style={styles.searchInput}
        />
        {/* Título da Tabela com fundo e borda */}
        <View style={styles.titleContainer}>
          <Text style={styles.tableTitle}>Lista de Serviços</Text>
        </View>
        <ScrollView horizontal style={styles.scrollContainer}>
          <ScrollView style={styles.verticalScroll}>
            <DataTable style={styles.dataTable}>
              <DataTable.Header>
                <DataTable.Title style={styles.columnHeader}>
                  <Text style={styles.columnHeaderText}>Tipo de Serviço</Text>
                </DataTable.Title>
                <DataTable.Title style={styles.columnHeader}>
                  <Text style={styles.columnHeaderText}>Valor</Text>
                </DataTable.Title>
                <DataTable.Title style={styles.columnHeader}>
                  <Text style={styles.columnHeaderText}>Ações</Text>
                </DataTable.Title>
              </DataTable.Header>

              {filteredServices.length > 0 ? ( // Use filteredServices para aplicar a lógica de pesquisa
                filteredServices.map(service => (
                  <DataTable.Row key={service.id}>
                    <DataTable.Cell style={styles.columnCell}><Text>{service.tiposervico}</Text></DataTable.Cell>
                    <DataTable.Cell style={styles.columnCell}><Text>{service.valor}</Text></DataTable.Cell>
                    <DataTable.Cell style={styles.columnCell}>
                      <IconButton
                        icon="pencil"
                        size={20}
                        onPress={() => {
                          setCurrentService(service);
                          showModal('editService');
                        }}
                        iconColor="blue"
                      />
                      <IconButton
                        icon="delete"
                        size={20}
                        onPress={() => {
                          setCurrentService(service);
                          showModal('deleteService');
                        }}
                        iconColor="red"
                      />
                    </DataTable.Cell>
                  </DataTable.Row>
                ))
              ) : (
                <DataTable.Row>
                  <DataTable.Cell><Text>Nenhum serviço encontrado</Text></DataTable.Cell>
                </DataTable.Row>
              )}
            </DataTable>
          </ScrollView>
        </ScrollView>

        {/* Contador abaixo da tabela */}
        <Text style={styles.counterText}>
          Total de serviços: {Array.isArray(filteredServices) ? filteredServices.length : 0}
        </Text>

        {/* Modais para Serviços */}

        <Portal>
          <Modal visible={visible.addService} onDismiss={() => hideModal('addService')} contentContainerStyle={styles.modal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Adicionar Serviço</Text>
            </View>
            <View style={styles.modalContent}>

              <Menu
                visible={visibleMenu}
                onDismiss={() => setVisibleMenu(false)}
                anchor={
                  <Button
                    mode="contained"
                    onPress={() => setVisibleMenu(true)}
                    style={[styles.menuButton, { width: '100%' }]} // Ajustando a largura para 100%
                    contentStyle={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} // Alinha o conteúdo
                  >
                    <Text style={{ color: 'black' }}>{campo1 || 'Escolha o Tipo de Serviço'}</Text>
                    <IconButton
                      icon="chevron-down" // Aqui usamos "chevron-down" como ícone
                      size={20}
                    />
                  </Button>
                }
              >
                {options.map((option, index) => (
                  <Menu.Item
                    key={index}
                    onPress={() => {
                      setCampo1(option);
                      setNewService(prev => ({ ...prev, tiposervico: option }));
                      setVisibleMenu(false);
                    }}
                    titleStyle={{ color: 'black' }}
                    title={option}
                  />
                ))}
              </Menu>

              <TextInput
                label="Valor"
                mode="outlined"
                value={newService.valor}
                onChangeText={text => setNewService(prev => ({ ...prev, valor: text }))}
                style={[styles.gridItem, styles.inputField, { width: 200 }]} // Ajustando largura para 340px
                theme={{ colors: { primary: '#000' } }}
                textAlign="center"
                placeholder="Insira o valor"
                placeholderTextColor="#888"
              />
            </View>
            <View style={styles.modalFooter}>
              <Button mode="contained" onPress={addService}
                style={styles.agendamentoButton}
              >Adicionar</Button>
            </View>
          </Modal>
        </Portal>

        <Portal>
          <Modal visible={visible.editService} onDismiss={() => hideModal('editService')} contentContainerStyle={styles.modal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Editar Serviço</Text>
            </View>
            <View style={styles.modalContent}>
              {/* Menu para selecionar o Tipo de Serviço */}

              <Menu
                visible={visibleMenu}
                onDismiss={() => setVisibleMenu(false)}
                anchor={
                  <Button
                    mode="contained"
                    onPress={() => setVisibleMenu(true)}
                    style={[styles.menuButton, { width: '100%' }]} // Ajustando a largura para 100%
                    contentStyle={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} // Alinha o conteúdo
                  >
                    <Text style={{ color: 'black' }}>{currentService?.tiposervico || 'Escolha o Tipo de Serviço'}</Text>
                    <IconButton
                      icon="chevron-down" // Usando "chevron-down" como ícone
                      size={20}
                    />
                  </Button>
                }
              >
                {options.map((option, index) => (
                  <Menu.Item
                    key={index}
                    onPress={() => {
                      setCurrentService(prev => prev ? { ...prev, tiposervico: option } : null);
                      setVisibleMenu(false);
                    }}
                    titleStyle={{ color: 'black' }}
                    title={option}
                  />
                ))}
              </Menu>

              <TextInput
                label="Valor"
                mode="outlined"
                value={currentService?.valor || ''}
                onChangeText={text => setCurrentService(prev => prev ? { ...prev, valor: text } : null)}
                style={[styles.gridItem, styles.inputField, { width: 200 }]}
              />
            </View>
            <View style={styles.modalFooter}>
              <Button mode="contained" onPress={updateService}
                style={styles.agendamentoButton}
              >Atualizar</Button>
            </View>
          </Modal>
        </Portal>

        <Portal>
          <Modal visible={visible.deleteService} onDismiss={() => hideModal('deleteService')} contentContainerStyle={styles.modal}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Deletar Serviço</Text>
              </View>
              <Text style={styles.modalText}>
                Você tem certeza que deseja deletar o serviço <Text style={styles.bold}>{currentService?.tiposervico}</Text>?
              </Text>
              <View style={styles.modalFooter}>
                <Button mode="contained" onPress={deleteService} style={styles.deleteButton}>Deletar</Button>
              </View>
            </View>
          </Modal>
        </Portal>

      </SafeAreaView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#D2B48C',
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
    marginBottom: 20,
    borderRadius: 50,
    alignSelf: 'center',
  },
  columnHeader: {
    width: 200,
    borderRightWidth: 1,
    borderRightColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  columnHeaderText: {
    fontWeight: 'bold',
  },
  columnCell: {
    width: 200,
    borderRightWidth: 1,
    borderRightColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 10,
  },
  modalContent: {
    alignItems: 'center',
  },
  modalHeader: {
    width: '100%',
    backgroundColor: '#D2B48C',
    paddingVertical: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  modalText: {
    marginVertical: 15,
    textAlign: 'center',
  },
  gridContainer: {
    width: '100%',
    gap: 10,
    marginTop: 10,
  },
  gridItem: {
    width: '100%',
  },
  modalFooter: {
    marginTop: 20,
    width: '100%',
    backgroundColor: '#D2B48C',
    paddingVertical: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: 'red',
    width: '100%',
  },
  bold: {
    fontWeight: 'bold',
  },
  menuButton: {
    width: 340, // Largura do botão
    marginBottom: 12, // Espaço entre o botão e o campo de valor
    marginTop: 12, // Espaço entre o botão e o campo de valor

    backgroundColor: 'white', // Cor de fundo do botão
    borderWidth: 1, // Espessura da borda
    borderColor: '#ccc', // Cor da borda (pode ser qualquer cor)
    borderRadius: 8,
    color: 'black' // Arredondamento dos cantos (opcional)
  },
  // Se necessário, adicione um fundo branco no menu para manter a consistência de estilo
  menuItem: {
    color: 'black', // Garante que os itens do menu sejam brancos
  },
  inputField: {
    borderRadius: 8, // Adiciona borderRadius semelhante ao "tiposervico"
    textAlign: 'center', // Centraliza o texto
    height: 50, // Ajuste opcional de altura, se necessário
  },
  searchInput: {
    marginVertical: 10, // Espaçamento vertical para o campo de pesquisa
    borderWidth: 1, // Largura da borda
    borderColor: '#ccc', // Cor da borda padrão
    borderRadius: 50, // Bordas arredondadas
    padding: 10, // Espaçamento interno
    backgroundColor: '#fff', // Cor de fundo
    elevation: 2, // Sombra para dar um efeito de elevação
    height: 20, // Defina a altura desejada
  },
  titleContainer: {
    backgroundColor: '#C19A6B', // Cor de fundo do título
    borderWidth: 1, // Largura da borda
    borderColor: '#A67B5B', // Cor da borda
    borderRadius: 5, // Bordas arredondadas
    padding: 10, // Espaçamento interno
    marginBottom: 10, // Espaçamento abaixo do título
  },
  tableTitle: {
    fontSize: 15, // Tamanho da fonte
    fontWeight: 'bold', // Negrito
    color: 'white', // Cor do texto
    textAlign: 'left', // Centraliza o texto
  },
  counterText: {
    marginTop: 10, // Espaçamento acima do contador
    fontSize: 16, // Tamanho da fonte
    fontWeight: 'bold', // Negrito
    textAlign: 'left', // Centraliza o texto
    color: 'white',
  },
  agendamentoButton: {
    backgroundColor: '#A67B5B', // Cor marrom (ou o tom que preferir)
  },
  dataTable: {
    minWidth: 600,
  },
  scrollContainer: {
    flexDirection: 'row',
    maxWidth: '100%',
  },
  verticalScroll: {
    maxHeight: 400,
  },
});

export default GerenciamentoServico;
