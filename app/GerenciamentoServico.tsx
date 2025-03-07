import * as React from 'react';
import { Provider as PaperProvider, DataTable, TextInput, Modal, Portal, IconButton, Button, Text } from 'react-native-paper';
import { SafeAreaView, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';

const API_URL = 'http://172.16.6.10:3000'; // Use o IP da sua máquina

type Servico = {
  id?: number;
  tiposervico: string;
  valor: string;
};

const GerenciamentoServico = () => {
  const [visible, setVisible] = React.useState({
    addServico: false,
    editServico: false,
    deleteServico: false,
  });

  const [currentServico, setCurrentServico] = React.useState<Servico | null>(null);
  const [servicos, setServicos] = React.useState<Servico[]>([]);
  const [newServico, setNewServico] = React.useState<Servico>({
    tiposervico: '',
    valor: '',
  });

  const fetchServicos = async () => {
    try {
      const response = await axios.get(`${API_URL}/servicos`);
      console.log('Dados recebidos:', response.data);  // Verificando os dados

      // Mapear a resposta da API corretamente
      setServicos(response.data.map((item: any) => ({
        id: item.id,
        tiposervico: item.tiposervico,
        valor: item.valor,
      })));
    } catch (error) {
      console.error('Erro ao buscar serviços:', (error as Error).message);
    }
  };

  const addServico = async () => {
    try {
      const newServicoData = {
        tiposervico: newServico.tiposervico,
        valor: newServico.valor,
      };

      await axios.post(`${API_URL}/servico/inserir`, newServicoData);

      setNewServico({
        tiposervico: '',
        valor: '',
      });

      hideModal('addServico');
      fetchServicos();

    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Erro ao adicionar serviço:', error.message);
      } else if (axios.isAxiosError(error)) {
        console.error('Erro ao adicionar serviço:', error.response ? error.response.data : error.message);
      } else {
        console.error('Erro desconhecido:', error);
      }
    }
  };

  const updateServico = async () => {
    if (currentServico?.id) {
      try {
        const updatedServico = {
          tiposervico: currentServico.tiposervico,
          valor: currentServico.valor,
        };

        await axios.put(`${API_URL}/servico/atualizar/${currentServico.id}`, updatedServico);

        setCurrentServico(null);
        hideModal('editServico');
        fetchServicos();

      } catch (error) {
        console.error('Erro ao atualizar serviço:', (error as Error).message);
      }
    }
  };

  const deleteServico = async () => {
    if (currentServico?.id) {
      try {
        await axios.delete(`${API_URL}/servico/deletar/${currentServico.id}`);
        setCurrentServico(null);
        hideModal('deleteServico');
        fetchServicos();
      } catch (error) {
        console.error('Erro ao deletar serviço:', (error as Error).message);
      }
    }
  };

  React.useEffect(() => {
    fetchServicos();
  }, []);

  const showModal = (type: 'addServico' | 'editServico' | 'deleteServico') => {
    setVisible({ ...visible, [type]: true });
  };

  const hideModal = (type: 'addServico' | 'editServico' | 'deleteServico') => {
    setVisible({ ...visible, [type]: false });
  };

  return (
    <PaperProvider>
      <SafeAreaView style={styles.container}>
        <IconButton icon="plus" size={24} onPress={() => showModal('addServico')} />

        <ScrollView horizontal style={styles.scrollContainer}>
          <DataTable style={styles.dataTable}>
            <DataTable.Header>
              <DataTable.Title>Tipo Serviço</DataTable.Title>
              <DataTable.Title>Valor</DataTable.Title>
              <DataTable.Title>Ações</DataTable.Title>
            </DataTable.Header>

            {servicos.length > 0 ? (
              servicos.map(servico => (
                <DataTable.Row key={servico.id}>
                  <DataTable.Cell><Text>{servico.tiposervico}</Text></DataTable.Cell>
                  <DataTable.Cell><Text>{servico.valor}</Text></DataTable.Cell>
                  <DataTable.Cell>
                    <IconButton
                      icon="pencil"
                      size={20}
                      onPress={() => {
                        setCurrentServico(servico);
                        showModal('editServico');
                      }}
                    />
                    <IconButton
                      icon="delete"
                      size={20}
                      onPress={() => {
                        setCurrentServico(servico);
                        showModal('deleteServico');
                      }}
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

        {/* Modais */}
        <Portal>
          <Modal visible={visible.addServico} onDismiss={() => hideModal('addServico')} contentContainerStyle={styles.modal}>
            <TextInput
              label="Tipo Serviço"
              mode="outlined"
              value={newServico.tiposervico}
              onChangeText={text => setNewServico(prev => ({ ...prev, tiposervico: text }))}
            />
            <TextInput
              label="Valor"
              mode="outlined"
              value={newServico.valor}
              onChangeText={text => setNewServico(prev => ({ ...prev, valor: text }))}
            />
            <Button mode="contained" onPress={addServico}>Adicionar</Button>
          </Modal>
        </Portal>

        <Portal>
          <Modal visible={visible.editServico} onDismiss={() => hideModal('editServico')} contentContainerStyle={styles.modal}>
            <TextInput
              label="Tipo Serviço"
              mode="outlined"
              value={currentServico?.tiposervico || ''}
              onChangeText={text => setCurrentServico(prev => prev ? { ...prev, tiposervico: text } : null)}
            />
            <TextInput
              label="Valor"
              mode="outlined"
              value={currentServico?.valor || ''}
              onChangeText={text => setCurrentServico(prev => prev ? { ...prev, valor: text } : null)}
            />
            <Button mode="contained" onPress={updateServico}>Salvar</Button>
          </Modal>
        </Portal>

        <Portal>
          <Modal visible={visible.deleteServico} onDismiss={() => hideModal('deleteServico')} contentContainerStyle={styles.modal}>
            <Text>Deseja realmente excluir este serviço?</Text>
            <Button mode="contained" onPress={deleteServico}>Excluir</Button>
            <Button onPress={() => hideModal('deleteServico')}>Cancelar</Button>
          </Modal>
        </Portal>
      </SafeAreaView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  dataTable: {
    minWidth: 600,
  },
  scrollContainer: {
    marginBottom: 20,
  },
  modal: {
    padding: 20,
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 10,
  },
});

export default GerenciamentoServico;
