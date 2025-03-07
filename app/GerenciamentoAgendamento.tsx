import * as React from 'react';
import { Provider as PaperProvider, DataTable, TextInput, Modal, Portal, IconButton, Button, Text } from 'react-native-paper';
import { SafeAreaView, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';

const API_URL = 'http://172.16.6.10:3000'; // Use o IP da sua máquina

type Agendamento = {
  id?: number;
  dataAtendimento: string;
  dthoraAgendamento: string;
  horario: string;
  fkUsuarioId: number;
  fkServicoId: number;
};

const GerenciamentoAgendamento = () => {
  const [visible, setVisible] = React.useState({
    addAgendamento: false,
    editAgendamento: false,
    deleteAgendamento: false,
  });

  const [currentAgendamento, setCurrentAgendamento] = React.useState<Agendamento | null>(null);
  const [agendamentos, setAgendamentos] = React.useState<Agendamento[]>([]);
  const [newAgendamento, setNewAgendamento] = React.useState<Agendamento>({
    dataAtendimento: '',
    dthoraAgendamento: '',
    horario: '',
    fkUsuarioId: 0,
    fkServicoId: 0,
  });

  const fetchAgendamentos = async () => {
    try {
      const response = await axios.get(`${API_URL}/agendamentos`);
      console.log('Dados recebidos:', response.data);  // Verificando os dados
      setAgendamentos(response.data.map((item: any) => ({
        id: item.id,
        dataAtendimento: item.dataatendimento,
        dthoraAgendamento: item.dthoraagendamento,
        horario: item.horario,
        fkUsuarioId: item.fk_usuario_id,
        fkServicoId: item.fk_servico_id,
      })));
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', (error as Error).message);
    }
  };

  const addAgendamento = async () => {
    try {
      // Assegure-se de que a estrutura de newAgendamento está correta
      const newAgendamento = {
        dthoraagendamento: "2025-03-06T15:00:00",  // Exemplo do formato ISO
        dataatendimento: "2025-03-06T14:00:00",
        horario: "14:00:00",
        fk_usuario_id: 1,  // Certifique-se de que o nome da chave está correto
        fk_servico_id: 2,
      };
  
      // Requisição POST com axios
      await axios.post(`${API_URL}/agendamento/inserir`, newAgendamento);
  
      // Limpeza do estado
      setNewAgendamento({
        dataAtendimento: '',
        dthoraAgendamento: '',
        horario: '',
        fkUsuarioId: 0,
        fkServicoId: 0,
      });
  
      // Fechar modal e atualizar a lista de agendamentos
      hideModal('addAgendamento');
      fetchAgendamentos();
  
    } catch (error: unknown) {
      // Verificar o tipo do erro
      if (error instanceof Error) {
        console.error('Erro ao adicionar agendamento:', error.message);
      } else if (axios.isAxiosError(error)) {
        // Caso seja um erro do Axios
        console.error('Erro ao adicionar agendamento:', error.response ? error.response.data : error.message);
      } else {
        console.error('Erro desconhecido:', error);
      }
    }
  };
  

  const updateAgendamento = async () => {
    if (currentAgendamento?.id) {
      try {
        // Garantir que currentAgendamento contém dados válidos antes de enviá-los
        const agendamentoAtualizado = {
          dthoraagendamento: currentAgendamento.dthoraAgendamento, // Exemplo de dados
          dataatendimento: currentAgendamento.dataAtendimento,
          horario: currentAgendamento.horario,
          fk_usuario_id: currentAgendamento.fkUsuarioId,
          fk_servico_id: currentAgendamento.fkServicoId,
        };
  
        // Realiza a requisição PUT com os dados atualizados
        await axios.put(`${API_URL}/agendamento/atualizar/${currentAgendamento.id}`, agendamentoAtualizado);
  
        // Limpeza do estado
        setCurrentAgendamento(null);
        
        // Fechar o modal de edição
        hideModal('editAgendamento');
        
        // Atualizar a lista de agendamentos
        fetchAgendamentos();
  
      } catch (error: unknown) {
        // Verificar o tipo de erro
        if (error instanceof Error) {
          console.error('Erro ao atualizar agendamento:', error.message);
        } else if (axios.isAxiosError(error)) {
          // Caso seja um erro do Axios
          console.error('Erro ao atualizar agendamento:', error.response ? error.response.data : error.message);
        } else {
          console.error('Erro desconhecido:', error);
        }
      }
    } else {
      console.error('ID do agendamento não encontrado.');
    }
  };
  

  const deleteAgendamento = async () => {
    if (currentAgendamento?.id) {
      try {
        await axios.delete(`${API_URL}/agendamento/deletar/${currentAgendamento.id}`);
        setCurrentAgendamento(null);
        hideModal('deleteAgendamento');
        fetchAgendamentos();
      } catch (error) {
        console.error('Erro ao deletar agendamento:', (error as Error).message);
      }
    }
  };

  React.useEffect(() => {
    fetchAgendamentos();
  }, []);

  const showModal = (type: 'addAgendamento' | 'editAgendamento' | 'deleteAgendamento') => {
    setVisible({ ...visible, [type]: true });
  };

  const hideModal = (type: 'addAgendamento' | 'editAgendamento' | 'deleteAgendamento') => {
    setVisible({ ...visible, [type]: false });
  };

  return (
    <PaperProvider>
      <SafeAreaView style={styles.container}>
        <IconButton icon="plus" size={24} onPress={() => showModal('addAgendamento')} />
        
        {/* ScrollView com rolagem horizontal */}
        <ScrollView horizontal style={styles.scrollContainer}>
          <DataTable style={styles.dataTable}>
            <DataTable.Header>
              <DataTable.Title>Data Atendimento</DataTable.Title>
              <DataTable.Title>Horário</DataTable.Title>
              <DataTable.Title>Serviço</DataTable.Title>
              <DataTable.Title>Usuário</DataTable.Title>
              <DataTable.Title>Ações</DataTable.Title>
            </DataTable.Header>

            {agendamentos.length > 0 ? (
              agendamentos.map(agendamento => (
                <DataTable.Row key={agendamento.id}>
                  <DataTable.Cell><Text>{agendamento.dataAtendimento}</Text></DataTable.Cell>
                  <DataTable.Cell><Text>{agendamento.horario}</Text></DataTable.Cell>
                  <DataTable.Cell><Text>{agendamento.fkServicoId}</Text></DataTable.Cell>
                  <DataTable.Cell><Text>{agendamento.fkUsuarioId}</Text></DataTable.Cell>
                  <DataTable.Cell>
                    <IconButton
                      icon="pencil"
                      size={20}
                      onPress={() => {
                        setCurrentAgendamento(agendamento);
                        showModal('editAgendamento');
                      }}
                    />
                    <IconButton icon="delete" size={20} onPress={() => {
                      setCurrentAgendamento(agendamento);
                      showModal('deleteAgendamento');
                    }} />
                  </DataTable.Cell>
                </DataTable.Row>
              ))
            ) : (
              <DataTable.Row>
                <DataTable.Cell><Text>Nenhum agendamento encontrado</Text></DataTable.Cell>
              </DataTable.Row>
            )}
          </DataTable>
        </ScrollView>

        {/* Modais */}
        <Portal>
          <Modal visible={visible.addAgendamento} onDismiss={() => hideModal('addAgendamento')} contentContainerStyle={styles.modal}>
            <TextInput
              label="Data Atendimento"
              mode="outlined"
              value={newAgendamento.dataAtendimento}
              onChangeText={text => setNewAgendamento(prev => ({ ...prev, dataAtendimento: text }))}
            />
            <TextInput
              label="Data Agendamento"
              mode="outlined"
              value={newAgendamento.dthoraAgendamento}
              onChangeText={text => setNewAgendamento(prev => ({ ...prev, dthoraAgendamento: text }))}
            />
            <TextInput
              label="Horário"
              mode="outlined"
              value={newAgendamento.horario}
              onChangeText={text => setNewAgendamento(prev => ({ ...prev, horario: text }))}
            />
            <TextInput
              label="ID Usuário"
              mode="outlined"
              value={String(newAgendamento.fkUsuarioId)}
              onChangeText={text => setNewAgendamento(prev => ({ ...prev, fkUsuarioId: Number(text) }))}
            />
            <TextInput
              label="ID Serviço"
              mode="outlined"
              value={String(newAgendamento.fkServicoId)}
              onChangeText={text => setNewAgendamento(prev => ({ ...prev, fkServicoId: Number(text) }))}
            />
            <Button mode="contained" onPress={addAgendamento}>Adicionar</Button>
          </Modal>
        </Portal>

        <Portal>
          <Modal visible={visible.editAgendamento} onDismiss={() => hideModal('editAgendamento')} contentContainerStyle={styles.modal}>
            <TextInput
              label="Data Atendimento"
              mode="outlined"
              value={currentAgendamento?.dataAtendimento || ''}
              onChangeText={text => setCurrentAgendamento(prev => prev ? { ...prev, dataAtendimento: text } : null)}
            />
            <TextInput
              label="Data Agendamento"
              mode="outlined"
              value={currentAgendamento?.dthoraAgendamento || ''}
              onChangeText={text => setCurrentAgendamento(prev => prev ? { ...prev, dthoraAgendamento: text } : null)}
            />
            <TextInput
              label="Horário"
              mode="outlined"
              value={currentAgendamento?.horario || ''}
              onChangeText={text => setCurrentAgendamento(prev => prev ? { ...prev, horario: text } : null)}
            />
            <TextInput
              label="ID Usuário"
              mode="outlined"
              value={String(currentAgendamento?.fkUsuarioId || '')}
              onChangeText={text => setCurrentAgendamento(prev => prev ? { ...prev, fkUsuarioId: Number(text) } : null)}
            />
            <TextInput
              label="ID Serviço"
              mode="outlined"
              value={String(currentAgendamento?.fkServicoId || '')}
              onChangeText={text => setCurrentAgendamento(prev => prev ? { ...prev, fkServicoId: Number(text) } : null)}
            />
            <Button mode="contained" onPress={updateAgendamento}>Salvar</Button>
          </Modal>
        </Portal>

        <Portal>
          <Modal visible={visible.deleteAgendamento} onDismiss={() => hideModal('deleteAgendamento')} contentContainerStyle={styles.modal}>
            <Text>Deseja realmente excluir este agendamento?</Text>
            <Button mode="contained" onPress={deleteAgendamento}>Excluir</Button>
            <Button onPress={() => hideModal('deleteAgendamento')}>Cancelar</Button>
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

export default GerenciamentoAgendamento;
