import * as React from 'react';
import { Provider as PaperProvider, DataTable, TextInput, Modal, Portal, IconButton, Button, Text, Menu } from 'react-native-paper';
import { SafeAreaView, StyleSheet, View, Image, ScrollView, Alert } from 'react-native'; // Importando o Image
import axios from 'axios';
import { Picker } from '@react-native-picker/picker'; // Importando o Picker

const API_URL = 'http://10.0.2.2:3000'; // Use o IP da sua máquina

const GerenciamentoUser = () => {
  const [visible, setVisible] = React.useState({
    addUser: false,
    editUser: false,
    deleteUser: false,
  });

  const [currentUser, setCurrentUser] = React.useState<{ id?: string; nome: string; senha: string; tipoUsuario: number; email: string } | null>(null);
  const [users, setUsers] = React.useState<{ id?: string; nome: string; senha: string; tipoUsuario: number; email: string }[]>([]);
  const [newUser, setNewUser] = React.useState<{ nome: string; senha: string; tipoUsuario: number; email: string }>({ nome: '', senha: '', tipoUsuario: 0, email: '' });
  const [visibleMenu, setVisibleMenu] = React.useState(false);
  const [campo1, setCampo1] = React.useState('');
  const [newService, setNewService] = React.useState({ tiposervico: 0 });
  const [searchQuery, setSearchQuery] = React.useState(''); // Estado para armazenar a pesquisa


  // Filtra os usuários com base na pesquisa
  const filteredUsers = users.filter(user => {
    const query = searchQuery.toLowerCase();
    return (
      user.nome.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.senha.toLowerCase().includes(query) ||
      user.tipoUsuario.toString().includes(query) // Converte tipoUsuario para string para comparação
    );
  });

  // Definindo as opções e seus valores correspondentes
  const options = [
    { label: 'Administrador', value: 0 },
    { label: 'Cliente', value: 1 },
  ];

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/usuarios`);
      setUsers(response.data);
    } catch (error) {
      console.error('Erro ao buscar usuários:', (error as Error).message);
    }
  };

  const addUser = async () => {
    console.log('Novo Usuário:', newUser);

    // Validação de campos obrigatórios
    if (!newUser.nome || !newUser.senha || (newUser.tipoUsuario !== 0 && newUser.tipoUsuario !== 1) || !newUser.email) {
     Alert.alert(
             "Campos Obrigatórios",
             "Por favor, preencha todos os campos obrigatórios: nome, senha, email e tipo usuario.",
             [{ text: "OK" }]
           );
      return; // Interrompe a execução da função se a validação falhar
    }

    // Validação de formato de e-mail
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(newUser.email)) {
      Alert.alert(
        "E-mail invalido",
        "Por favor, preencha um e-mail valido.",
        [{ text: "OK" }]
      );
      return; // Interrompe a execução da função se o e-mail for inválido
    }

    // Buscar todos os usuários para verificar se o e-mail já existe
    await fetchUsers(); // Chama a função para buscar os usuários

    // Verificar se o e-mail já está cadastrado
    const emailExists = users.some(user => user.email === newUser.email);
    if (emailExists) {
      Alert.alert(
        "E-mail ja cadastrado",
        "Por favor, preencha um e-mail que não exista no conosco.",
        [{ text: "OK" }]
      );
      return; // Interrompe a execução se o e-mail já existir
    }

    // Se todos os campos estiverem válidos e o e-mail não existir, tenta adicionar o usuário
    try {
      await axios.post(`${API_URL}/usuario/inserir`, newUser);

      // Reseta o estado de newUser após a inserção
      setNewUser({ nome: '', senha: '', tipoUsuario: 0, email: '' });
      hideModal('addUser'); // Fecha o modal
      fetchUsers(); // Atualiza a lista de usuários

      Alert.alert(
        "Usuario Adicionado",
        "O usuario foi cadastrado com sucesso.",
        [{ text: "OK" }]
      );
    } catch (error) {
      console.error('Erro ao adicionar usuário:', (error as Error).message);
    }
  };

  const updateUser = async () => {
    if (currentUser?.id) {
      // Validação de campos obrigatórios
      if (!currentUser.nome || !currentUser.senha || (currentUser.tipoUsuario !== 0 && currentUser.tipoUsuario !== 1) || !currentUser.email) {
        Alert.alert(
          "Campos Obrigatorios",
          "Por favor, preencha todos os campos obrigatórios: nome, senha, email e tipo usuario.",
           [{ text: "OK" }]
        );        
        return; // Interrompe a execução da função se a validação falhar
      }

      // Validação de formato de e-mail
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
      if (!emailRegex.test(currentUser.email)) {
        Alert.alert(
          "E-mail invalido",
          "Por favor, preencha um e-mail valido.",
           [{ text: "OK" }]
        );  
        return; // Interrompe a execução da função se o e-mail for inválido
      }

      // Buscar todos os usuários para verificar se o e-mail já existe (excluindo o próprio usuário)
      await fetchUsers(); // Chama a função para buscar os usuários

      // Verificar se o e-mail já está cadastrado, mas ignorando o próprio usuário
      const emailExists = users.some(user => user.email === currentUser.email && user.id !== currentUser.id);
      if (emailExists) {
        Alert.alert(
          "E-mail ja cadastrado",
          "Por favor, preencha um e-mail que não exista no conosco.",
          [{ text: "OK" }]
        );
        return; // Interrompe a execução se o e-mail já existir
      }

      // Se todos os campos estiverem válidos e o e-mail não existir, tenta atualizar o usuário
      try {
        await axios.put(`${API_URL}/usuarios/atualizar/${currentUser.id}`, currentUser);

        // Reseta o estado de currentUser após a atualização
        setCurrentUser(null);
        hideModal('editUser'); // Fecha o modal
        fetchUsers(); // Atualiza a lista de usuários

        Alert.alert(
          "Usuario Atualizado",
          "O usuario foi atualizado com sucesso.",
          [{ text: "OK" }]
        );
      } catch (error) {
        console.error('Erro ao atualizar usuário:', (error as Error).message);
      }
    }
  };

  const deleteUser = async () => {
    if (currentUser?.id) {
      try {
        await axios.delete(`${API_URL}/usuario/deletar/${currentUser.id}`);
        setCurrentUser(null);
        hideModal('deleteUser');
        fetchUsers();
        Alert.alert(
          "Usuario Excluido",
          "O usuario foi excluido com sucesso.",
          [{ text: "OK" }]
        );
      } catch (error) {
        console.error('Erro ao deletar usuário:', (error as Error).message);
      }
    }
  };

  React.useEffect(() => {
    fetchUsers();
  }, []);

  const showModal = (type: 'addUser' | 'editUser' | 'deleteUser') => {
    setVisible({ ...visible, [type]: true });
  };

  const hideModal = (type: 'addUser' | 'editUser' | 'deleteUser') => {
    setVisible({ ...visible, [type]: false });
  };

  return (
    <PaperProvider>
      <SafeAreaView style={styles.container}>
        {/* Adicionando a imagem acima do botão */}
        <Image
          source={require('../assets/images/Elysium.png')}
          style={styles.image}
        />

        <Button
          icon="plus"
          mode="contained"
          onPress={() => showModal('addUser')}
          textColor="white" // Cor branca para o texto
          buttonColor="#A67B5B" // Cor para o fundo do botão
          contentStyle={{ flexDirection: 'row', alignItems: 'center' }} // Alinha ícone e texto horizontalmente
          labelStyle={{ marginLeft: 12 }} // Aumenta o espaçamento entre o ícone e o texto
        >
          Adicionar Usuário
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
          <Text style={styles.tableTitle}>Lista de Usuários</Text>
        </View>
        <ScrollView horizontal style={styles.scrollContainer}>
          <ScrollView style={styles.verticalScroll}>

            <DataTable>
              <DataTable.Header>
                <DataTable.Title style={styles.columnHeader}>
                  <Text style={styles.columnHeaderText}>Nome</Text>
                </DataTable.Title>
                <DataTable.Title style={styles.columnHeader}>
                  <Text style={styles.columnHeaderText}>Email</Text>
                </DataTable.Title>
                <DataTable.Title style={styles.columnHeader}>
                  <Text style={styles.columnHeaderText}>Senha</Text>
                </DataTable.Title>
                <DataTable.Title style={styles.columnHeader}>
                  <Text style={styles.columnHeaderText}>Tipo Usuário</Text>
                </DataTable.Title>
                <DataTable.Title style={styles.columnHeader}>
                  <Text style={styles.columnHeaderText}>Ações</Text>
                </DataTable.Title>
              </DataTable.Header>

              {filteredUsers.length > 0 ? (
                filteredUsers.map(user => (
                  <DataTable.Row key={user.id}>
                    <DataTable.Cell style={styles.columnCell}><Text>{user.nome}</Text></DataTable.Cell>
                    <DataTable.Cell style={styles.columnCell}><Text>{user.email}</Text></DataTable.Cell>
                    <DataTable.Cell style={styles.columnCell}><Text>{user.senha}</Text></DataTable.Cell>
                    <DataTable.Cell style={styles.columnCell}><Text>{user.tipoUsuario}</Text></DataTable.Cell>
                    <DataTable.Cell style={styles.columnCell}>
                      <IconButton
                        icon="pencil"
                        size={20}
                        onPress={() => {
                          setCurrentUser(user);
                          showModal('editUser');
                        }}
                        iconColor="blue" // Define a cor azul para o ícone de editar
                      />
                      <IconButton
                        icon="delete"
                        size={20}
                        onPress={() => {
                          setCurrentUser(user);
                          showModal('deleteUser');
                        }}
                        iconColor="red" // Define a cor vermelha para o ícone de excluir
                      />
                    </DataTable.Cell>
                  </DataTable.Row>
                ))
              ) : (
                <DataTable.Row>
                  <DataTable.Cell><Text>Nenhum usuário encontrado</Text></DataTable.Cell>
                </DataTable.Row>
              )}
            </DataTable>
          </ScrollView>
        </ScrollView>
        {/* Contador abaixo da tabela */}
        <Text style={styles.counterText}>
          Total de usuários: {Array.isArray(filteredUsers) ? filteredUsers.length : 0}
        </Text>
        {/* Modais */}

        {/* Adicionar */}
        <Portal>
          <Modal visible={visible.addUser} onDismiss={() => hideModal('addUser')} contentContainerStyle={styles.modal}>
            <View style={styles.modalContent}>
              {/* Cabeçalho */}
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Adicionar Usuário</Text>
              </View>

              {/* Corpo */}
              <View style={styles.gridContainer}>
                <TextInput
                  label="Nome"
                  mode="outlined"
                  value={newUser.nome}
                  onChangeText={text => setNewUser(prev => ({ ...prev, nome: text }))}
                  style={styles.gridItem}
                />
                <TextInput
                  label="Email"
                  mode="outlined"
                  value={newUser.email}
                  onChangeText={text => setNewUser(prev => ({ ...prev, email: text }))}
                  style={styles.gridItem}
                />
                <TextInput
                  label="Senha"
                  mode="outlined"
                  secureTextEntry
                  value={newUser.senha}
                  onChangeText={text => setNewUser(prev => ({ ...prev, senha: text }))}
                  style={styles.gridItem}
                />
                <Text>Tipo Usuário</Text>
                <View
                  style={{
                    height: 53,
                    width: '100%',
                    borderWidth: 1,
                    borderColor: '#ccc', // Cor da borda
                    borderRadius: 5, // Bordas arredondadas
                    overflow: 'hidden', // Garante que a borda seja visível
                  }}
                >
                  <Picker
                    selectedValue={newUser.tipoUsuario}
                    onValueChange={(itemValue) => setNewUser(prev => ({ ...prev, tipoUsuario: itemValue }))}
                    style={{
                      height: '100%', // Ocupa toda a altura do contêiner
                      width: '100%',  // Ocupa toda a largura do contêiner
                    }}
                  >
                    <Picker.Item label="Administrador" value={0} />
                    <Picker.Item label="Cliente" value={1} />
                  </Picker>
                </View>
              </View>
              {/* Rodapé */}
              <View style={styles.modalFooter}>
                <Button mode="contained" onPress={addUser}
                  style={styles.agendamentoButton} // Estilo para o botão
                >Adicionar
                </Button>
              </View>
            </View>
          </Modal>
        </Portal>

        {/* Editar */}
        <Portal>
          <Modal visible={visible.editUser} onDismiss={() => hideModal('editUser')} contentContainerStyle={styles.modal}>
            <View style={styles.modalContent}>
              {/* Cabeçalho */}
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Editar Usuário</Text>
              </View>

              {/* Corpo */}
              <View style={styles.gridContainer}>
                <TextInput
                  label="Nome"
                  mode="outlined"
                  value={currentUser?.nome || ''}
                  onChangeText={text => setCurrentUser(prev => prev ? { ...prev, nome: text } : null)}
                  style={styles.gridItem}
                />
                <TextInput
                  label="Email"
                  mode="outlined"
                  value={currentUser?.email || ''}
                  onChangeText={text => setCurrentUser(prev => prev ? { ...prev, email: text } : null)}
                  style={styles.gridItem}
                />
                <TextInput
                  label="Senha"
                  mode="outlined"
                  secureTextEntry
                  value={currentUser?.senha || ''}
                  onChangeText={text => setCurrentUser(prev => prev ? { ...prev, senha: text } : null)}
                  style={styles.gridItem}
                />

                {/* Picker para "Tipo Usuário" com borda personalizada */}
                <View style={{
                  height: 53,
                  borderWidth: 1,
                  borderColor: '#ccc',
                  borderRadius: 5,
                  overflow: 'hidden',
                  marginBottom: 16
                }}>
                  <Picker
                    selectedValue={currentUser?.tipoUsuario}
                    onValueChange={(itemValue) => setCurrentUser(prev => prev ? { ...prev, tipoUsuario: itemValue } : { tipoUsuario: itemValue, nome: '', senha: '', email: '' })}
                    style={{ height: '100%', width: '100%' }}
                  >
                    <Picker.Item label="Administrador" value={0} />
                    <Picker.Item label="Cliente" value={1} />
                  </Picker>
                </View>
              </View>

              {/* Rodapé */}
              <View style={styles.modalFooter}>
                <Button mode="contained"
                  onPress={updateUser}
                  style={styles.agendamentoButton}
                >Salvar</Button>
              </View>
            </View>
          </Modal>
        </Portal>
        
        {/* Deletar */}
        <Portal>
          <Modal visible={visible.deleteUser} onDismiss={() => hideModal('deleteUser')} contentContainerStyle={styles.modal}>
            <View style={styles.modalContent}>
              {/* Cabeçalho */}
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Excluir Usuário</Text>
              </View>

              {/* Corpo */}
              <Text style={styles.modalText}>
                Deseja realmente excluir o usuário <Text style={styles.bold}>{currentUser?.nome}</Text>?
              </Text>

              {/* Rodapé */}
              <View style={styles.modalFooter}>
                <Button mode="contained" onPress={deleteUser} style={styles.deleteButton}>Deletar</Button>
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
    backgroundColor: '#D2B48C', // Cor marrom claro
  },
  image: {
    width: 100, // Define a largura da imagem
    height: 100, // Define a altura da imagem, igual à largura
    resizeMode: 'cover', // Ajusta a imagem para cobrir o container
    marginBottom: 20, // Espaçamento entre a imagem e o botão
    borderRadius: 50, // Aplica bordas arredondadas (50% de 100px)
    alignSelf: 'center', // Centraliza a imagem horizontalmente
  },
  dataTable: {
    minWidth: 600,
  },
  // ... outros estilos
  verticalScroll: {
    maxHeight: 400, // Ajuste o valor conforme necessário para o tamanho da sua tela
  },
  scrollContainer: {
    flexDirection: 'row',
    maxWidth: '100%',
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    maxHeight: '70%',
    alignSelf: 'center',
  },
  modalHeader: {
    backgroundColor: '#D2B48C', // Marrom claro
    alignItems: 'center',
    paddingVertical: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white', // Cor do texto no cabeçalho
  },
  modalContent: {
    marginBottom: 5,
  },
  gridContainer: {
    flexDirection: 'column',
    marginBottom: 15,
  },
  gridItem: {
    marginBottom: 12,
  },
  modalText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 15,
  },
  bold: {
    fontWeight: 'bold',
  },
  modalFooter: {
    backgroundColor: '#D2B48C', // Marrom claro
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    marginTop: 10,
  },
  deleteButton: {
    backgroundColor: '#e74c3c',  // Cor vermelha para o botão de deletar
    width: '100%',
  },
  buttonContainer: {
    width: '100%',
    marginTop: 10,
  },
  columnHeader: {
    width: 200, // Aumente conforme necessário
    borderRightWidth: 1,
    borderRightColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  columnCell: {
    width: 200, // Deve ser o mesmo valor do cabeçalho
    borderRightWidth: 1,
    borderRightColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  columnHeaderText: {
    color: 'white', // Cor do texto do cabeçalho
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc', // Cor da borda
    borderRadius: 4, // Raio da borda
    padding: 8, // Espaçamento interno
  },
  agendamentoButton: {
    backgroundColor: '#A67B5B', // Cor marrom (ou o tom que preferir)
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
  searchInputFocused: {
    borderColor: '#A67B5B', // Cor da borda quando em foco
    backgroundColor: '#f9f9f9', // Cor de fundo quando em foco
  },
  counterText: {
    marginTop: 10, // Espaçamento acima do contador
    fontSize: 16, // Tamanho da fonte
    fontWeight: 'bold', // Negrito
    textAlign: 'left', // Centraliza o texto
    color: 'white',
  },
  titleContainer: {
    backgroundColor: '#C19A6B', // Cor de fundo do título
    borderWidth: 1, // Largura da borda
    borderColor: '#A67B5B', // Cor da borda
    borderRadius: 5, // Bordas arredondadas
    padding: 8, // Espaçamento interno
    marginBottom: 10, // Espaçamento abaixo do título
  },
  tableTitle: {
    fontSize: 15, // Tamanho da fonte
    fontWeight: 'bold', // Negrito
    color: 'white', // Cor do texto
    textAlign: 'center', // Centraliza o texto
  },
});

export default GerenciamentoUser;
