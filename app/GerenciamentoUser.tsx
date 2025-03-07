import * as React from 'react';
import { Provider as PaperProvider, DataTable, TextInput, Modal, Portal, IconButton, Button, Text } from 'react-native-paper';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import axios from 'axios';

const API_URL = 'http://172.16.6.10:3000'; // Use o IP da sua máquina

const GerenciamentoUser = () => {
  const [visible, setVisible] = React.useState({
    addUser: false,
    editUser: false,
    deleteUser: false
  });

  const [currentUser, setCurrentUser] = React.useState<{ id?: string; nome: string; senha: string; tipoUsuario: number } | null>(null);
  const [users, setUsers] = React.useState<{ id?: string; nome: string; senha: string; tipoUsuario: number }[]>([]);
  const [newUser, setNewUser] = React.useState<{ nome: string; senha: string; tipoUsuario: number }>({ nome: '', senha: '', tipoUsuario: 0 });

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/usuarios`);
      setUsers(response.data);
    } catch (error) {
      console.error('Erro ao buscar usuários:', (error as Error).message);
    }
  };

  const addUser = async () => {
    try {
      await axios.post(`${API_URL}/usuario/inserir`, newUser);
      setNewUser({ nome: '', senha: '', tipoUsuario: 0 });
      hideModal('addUser');
      fetchUsers();
    } catch (error) {
      console.error('Erro ao adicionar usuário:', (error as Error).message);
    }
  };

  const updateUser = async () => {
    if (currentUser?.id) {
      try {
        await axios.put(`${API_URL}/usuario/atualizar/${currentUser.id}`, currentUser);
        setCurrentUser(null);
        hideModal('editUser');
        fetchUsers();
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
        <IconButton icon="plus" size={24} onPress={() => showModal('addUser')} />
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>Nome</DataTable.Title>
            <DataTable.Title>Senha</DataTable.Title>
            <DataTable.Title>Tipo Usuário</DataTable.Title>
            <DataTable.Title>Ações</DataTable.Title>
          </DataTable.Header>

          {users.length > 0 ? (
            users.map(user => (
              <DataTable.Row key={user.id}>
                <DataTable.Cell><Text>{user.nome}</Text></DataTable.Cell>
                <DataTable.Cell><Text>{user.senha}</Text></DataTable.Cell>
                <DataTable.Cell><Text>{user.tipoUsuario}</Text></DataTable.Cell>
                <DataTable.Cell>
                  <IconButton
                    icon="pencil"
                    size={20}
                    onPress={() => {
                      setCurrentUser(user);
                      showModal('editUser');
                    }}
                  />
                  <IconButton icon="delete" size={20} onPress={() => {
                    setCurrentUser(user);
                    showModal('deleteUser');
                  }} />
                </DataTable.Cell>
              </DataTable.Row>
            ))
          ) : (
            <DataTable.Row>
              <DataTable.Cell><Text>Nenhum usuário encontrado</Text></DataTable.Cell>
            </DataTable.Row>
          )}
        </DataTable>

        {/* Modais */}
        <Portal>
          <Modal visible={visible.addUser} onDismiss={() => hideModal('addUser')} contentContainerStyle={styles.modal}>
            <View style={styles.gridContainer}>
              <TextInput
                label="Nome"
                mode="outlined"
                value={newUser.nome}
                onChangeText={text => setNewUser(prev => ({ ...prev, nome: text }))}
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
              <TextInput
                label="Tipo Usuário"
                mode="outlined"
                keyboardType="numeric"
                value={String(newUser.tipoUsuario)}
                onChangeText={text => setNewUser(prev => ({ ...prev, tipoUsuario: parseInt(text) || 0 }))}
                style={styles.gridItem}
              />
            </View>
            <Button mode="contained" onPress={addUser}>Adicionar</Button>
          </Modal>
        </Portal>

        <Portal>
          <Modal visible={visible.editUser} onDismiss={() => hideModal('editUser')} contentContainerStyle={styles.modal}>
            <View style={styles.gridContainer}>
              <TextInput
                label="Nome"
                mode="outlined"
                value={currentUser?.nome || ''}
                onChangeText={text => setCurrentUser(prev => prev ? { ...prev, nome: text } : null)}
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
              <TextInput
                label="Tipo Usuário"
                mode="outlined"
                keyboardType="numeric"
                value={String(currentUser?.tipoUsuario || '')}
                onChangeText={text => setCurrentUser(prev => prev ? { ...prev, tipoUsuario: parseInt(text) || 0 } : null)}
                style={styles.gridItem}
              />
            </View>
            <Button mode="contained" onPress={updateUser}>Salvar</Button>
          </Modal>
        </Portal>

        <Portal>
          <Modal visible={visible.deleteUser} onDismiss={() => hideModal('deleteUser')} contentContainerStyle={styles.modal}>
            <Text>Deseja realmente excluir o usuário <Text style={styles.bold}>{currentUser?.nome}</Text>?</Text>
            <Button mode="contained" onPress={deleteUser}>Deletar</Button>
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
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 10,
  },
  bold: {
    fontWeight: 'bold',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '48%',
    marginBottom: 10,
  },
});

export default GerenciamentoUser;
