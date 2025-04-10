import * as React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Provider as PaperProvider, Button, Text } from 'react-native-paper';
import { SafeAreaView, StyleSheet, Image, View, Alert } from 'react-native';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useEffect, useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

const API_URL = 'http://10.0.2.2:3000';
const horarios = [
  '08:00:00',
  '09:00:00',
  '10:00:00',
  '11:00:00',
  '12:00:00',
];
type RootStackParamList = {
  Home: undefined;
  GerenciamentoAgendamentoUser: undefined;
};

type Agendamento = {
  id?: number;
  dataAtendimento: string;
  dthoraAgendamento: string;
  horario: string;
  usuario_id: number;
  servico_id: number;
  usuarioNome?: string;
  tipoServico?: string;
  usuarioEmail?: string;
  valor?: number;
  fk_usuario_id: number;
  fk_servico_id: number;
};

type AgendamentoInsercao = {
  dataAtendimento: string;
  dthoraAgendamento: string;
  horario: string;
  fk_usuario_id: number;
  fk_servico_id: number;
};

type Servico = {
  id: number;
  tiposervico: string;
  valor: number;
};

type Usuario = {
  id: number;
  nome: string;
  email: string;
  tipoUsuario: number;
};

const GerenciamentoAgendamento = () => {

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [currentAgendamento, setCurrentAgendamento] = React.useState<Agendamento | null>(null);
  const [agendamentos, setAgendamentos] = React.useState<Agendamento[]>([]);
  const [newAgendamento, setNewAgendamento] = React.useState<AgendamentoInsercao>({
    dataAtendimento: '',
    dthoraAgendamento: '',
    horario: '',
    fk_usuario_id: 0,
    fk_servico_id: 0,
  });

  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [selectedServico, setSelectedServico] = useState('');
  const [selectedUsuario, setSelectedUsuario] = useState('');
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [selectedHorario, setSelectedHorario] = useState('');
  const [selectedDataAtendimento, setSelectedDataAtendimento] = useState('');


  useEffect(() => {
    const now = new Date();
    const options = { timeZone: 'America/Sao_Paulo' };
    const localDate = now.toLocaleString('sv-SE', options);
    const utcDate = new Date(localDate + 'Z');
    setNewAgendamento(prev => ({ ...prev, dthoraAgendamento: utcDate.toISOString() }));
  }, []);

  const fetchAgendamentos = async () => {
    try {
      // Recupera o e-mail armazenado no AsyncStorage
      const userEmailStored = await AsyncStorage.getItem('userEmail');

      // Verifica se o e-mail foi recuperado corretamente
      if (!userEmailStored) {
        console.error('E-mail não encontrado no AsyncStorage.');
        return;
      }

      // Faz a requisição para o novo endpoint com o e-mail na query string
      const response = await axios.get(`${API_URL}/agendamentosUser`, {
        params: {
          email: userEmailStored  // Passando o e-mail como parâmetro na URL
        }
      });

      // Mapeia os dados da resposta
      const agendamentosData = response.data.map((item: any) => ({
        id: item.agendamento_id,
        dataAtendimento: item.dataatendimento,
        dthoraAgendamento: item.dthoraagendamento,
        horario: item.horario,
        usuarioNome: item.usuario_nome,
        usuario_id: item.usuario_id,
        servico_id: item.servico_id,
        tipoServico: item.tiposervico,
        usuarioEmail: item.usuario_email,
        valor: item.valor,
      }));

      // Atualiza o estado com os dados dos agendamentos
      setAgendamentos(agendamentosData);

    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Erro ao buscar agendamentos:', error.message);
      } else {
        console.error('Erro desconhecido ao buscar agendamentos:', error);
      }
    }
  };

  const fetchServicos = async () => {
    try {
      const response = await axios.get(`${API_URL}/servicos`);
      const servicosData: Servico[] = response.data.map((item: any) => ({
        id: item.id,
        tiposervico: item.tiposervico,
        valor: item.valor,
      }));
      setServicos(servicosData);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Erro ao buscar serviços:', error.message);
      } else {
        console.error('Erro desconhecido ao buscar serviços:', error);
      }
    }
  };

  const fetchUsuarios = async () => {
    try {
      const response = await axios.get(`${API_URL}/usuarios`);
      const usuariosData: Usuario[] = response.data.map((item: any) => ({
        id: item.id,
        nome: item.nome,
        email: item.email,
        tipoUsuario: item.tipoUsuario,
      }));
      setUsuarios(usuariosData);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Erro ao buscar usuários:', error.message);
      } else {
        console.error('Erro desconhecido ao buscar usuários:', error);
      }
    }
  };

  const addAgendamento = async () => {
    console.log('Novo Agendamento:', newAgendamento);

    if (!newAgendamento.dataAtendimento || !newAgendamento.horario || newAgendamento.fk_servico_id <= 0) {
      Alert.alert(
        "Campos Obrigatórios",
        "Por favor, preencha todos os campos obrigatórios: data de atendimento, horário, usuário e serviço.",
        [{ text: "OK" }]
      );
      return; // Interrompe a execução da função se a validação falhar
    }

    await fetchAgendamentos();

    const [day1, month1, year1] = newAgendamento.dataAtendimento.split('/');
    const formattedDataAtendimento1 = `${year1}-${month1}-${day1}`;

    const horarioIndisponivel = agendamentos.some(agendamento => {
      if (!agendamento.dataAtendimento) {
        console.warn('dataAtendimento está indefinido para um dos agendamentos:', agendamento);
        return false; // Ignora este agendamento
      }
      return agendamento.dataAtendimento === formattedDataAtendimento1 &&
        agendamento.horario === newAgendamento.horario;
    });

    if (horarioIndisponivel) {
      const horariosIndisponiveis = agendamentos
        .filter(agendamento => agendamento.dataAtendimento === formattedDataAtendimento1)
        .map(agendamento => agendamento.horario);

      const horariosDisponiveis = horarios.filter(horario => !horariosIndisponiveis.includes(horario));

      if (horariosDisponiveis.length > 0) {
        Alert.alert(
          "Horário Indisponível",
          `Este horário e data de atendimento já estão ocupados. Horários disponíveis para a data ${newAgendamento.dataAtendimento}: ${horariosDisponiveis.join(', ')}`,
          [{ text: "OK" }]
        );
      } else {
        Alert.alert(
          "Horário Indisponível",
          `Este horário e data de atendimento já estão ocupados. Não há horários disponíveis para a data ${newAgendamento.dataAtendimento}.`,
          [{ text: "OK" }]
        );
      }
      return;
    }

    const [day, month, year] = newAgendamento.dataAtendimento.split('/');
    const formattedDataAtendimento = `${year}-${month}-${day}`;

    const userId = await AsyncStorage.getItem('userId');

    // Verifique se o userId não é null e converta para número
    if (userId === null) {
      console.error('userId não encontrado no AsyncStorage');
      return;  // Ou trate o erro de forma adequada
    }

    // Converta o userId para número
    const userIdNumber = Number(userId);

    if (isNaN(userIdNumber)) {
      console.error('userId não é um número válido');
      return;  // Ou trate o erro de forma adequada
    }

    // Agora, crie o objeto novoAgendamento com o userId convertido
    const novoAgendamento: AgendamentoInsercao = {
      dataAtendimento: formattedDataAtendimento,
      dthoraAgendamento: new Date().toISOString(),
      horario: newAgendamento.horario,
      fk_usuario_id: userIdNumber,  // Agora passa o userId convertido para número
      fk_servico_id: newAgendamento.fk_servico_id,
    };

    try {
      await axios.post(`${API_URL}/agendamento/inserir`, novoAgendamento);
      setNewAgendamento({
        dataAtendimento: '',
        dthoraAgendamento: '',
        horario: '',
        fk_usuario_id: 0,
        fk_servico_id: 0,
      });
      setSelectedServico(''); // Resetando o estado selectedServico
      setSelectedUsuario(''); // Resetando o estado selectedUsuario      
      fetchAgendamentos();

      Alert.alert(
        "Agendamento Adicionado",
        "O agendamento foi adicionado com sucesso!",
        [{ text: "OK" }]
      );
    } catch (error) {
      console.error('Erro ao adicionar agendamento:', error);
    }
  };

  const onChangeDate = (event: any, date?: Date, isEditMode: boolean = false) => {
    if (date) {
      const formattedDate = date.toLocaleDateString('pt-BR'); // Formato DD/MM/YYYY
      if (isEditMode) {
        setSelectedDataAtendimento(formattedDate); // Atualiza o estado da data selecionada para o modal de edição
        setCurrentAgendamento(prev => prev ? { ...prev, dataAtendimento: formattedDate } : null); // Atualiza o campo dataAtendimento no modo de edição
      } else {
        setNewAgendamento(prev => ({ ...prev, dataAtendimento: formattedDate })); // Atualiza o campo dataAtendimento no modo de inserção
      }
    }
    setShowDatePicker(false); // Fecha o DateTimePicker
  };

  useEffect(() => {
    const fetchData = async () => {
      // Certifique-se de que o userType está disponível antes de chamar fetchAgendamentos
      const storedUserType = await AsyncStorage.getItem('userType');
      const userTypeNumber = storedUserType ? Number(storedUserType) : null; // Converte para number ou null

      fetchAgendamentos(); // Passa o userType como argumento
      fetchServicos();
      fetchUsuarios(); // Chama a função para buscar usuários
    };

    fetchData();
  }, []);

  return (
    <PaperProvider>
      <SafeAreaView style={styles.container}>

        <Image source={require('../../assets/images/Elysium.png')} style={styles.image} />

        <View style={styles.container}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Adicionar Agendamento</Text>
          </View>
          <View style={styles.modalContent}>
            <Button
              mode="outlined"
              onPress={() => setShowDatePicker(true)}
              style={styles.agendamentoInput}
              labelStyle={{ color: 'black' }} // Define a cor do texto
            >
              <Text>{newAgendamento.dataAtendimento || 'Selecionar Data de Atendimento'}</Text>
            </Button>
            {showDatePicker && (
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display="default"
                onChange={(event, date) => onChangeDate(event, date, false)}
              />
            )}

            <View style={{
              height: 53,
              borderWidth: 1,
              borderColor: '#dc8051',
              borderRadius: 5,
              overflow: 'hidden',
              marginBottom: 16,
            }}>
              <Picker
                selectedValue={newAgendamento.horario}
                onValueChange={(itemValue) => setNewAgendamento(prev => ({ ...prev, horario: itemValue }))}
                style={{
                  height: '100%',
                  width: '100%',
                }}
              >
                <Picker.Item label="Selecione um horário" value="" />
                {horarios.map((horario, index) => (
                  <Picker.Item key={index} label={horario} value={horario} />
                ))}
              </Picker>
            </View>

            <View style={{
              height: 53,
              borderWidth: 1,
              borderColor: '#dc8051',
              borderRadius: 5,
              overflow: 'hidden',
              marginBottom: 16,
            }}>
              <Picker
                selectedValue={selectedServico}
                onValueChange={(itemValue) => {
                  setSelectedServico(itemValue);
                  setNewAgendamento(prev => ({ ...prev, fk_servico_id: Number(itemValue) }));
                }}
                style={{
                  height: '100%',
                  width: '100%',
                }}
              >
                <Picker.Item label="Selecione um Serviço" value="" />
                {servicos.map((servico) => (
                  <Picker.Item key={servico.id} label={servico.tiposervico} value={servico.id} />
                ))}
              </Picker>
            </View>
          </View>
          <View style={styles.modalFooter}>
            <Button
              mode="contained"
              onPress={addAgendamento}
              textColor="white"
              buttonColor="#A67B5B"
              contentStyle={{ flexDirection: 'row', alignItems: 'center' }}
              labelStyle={{ marginLeft: 12 }}
            >
              <Text>Adicionar Agendamento</Text>
            </Button>

          </View>
          <Text
            style={styles.link}
            onPress={() => {
              // Navega para a tela de Home
              navigation.navigate('Home');
              // Define o título no header após navegar             
            }}
          >
            Página Inicial
          </Text>

          <Text
            style={styles.link}
            onPress={() => {
              // Navega para a tela de Gerenciamento de Agendamentos
              navigation.navigate('GerenciamentoAgendamentoUser');
              // Define o título no header após navegar
              navigation.setOptions({ title: 'Gerenciamento de Agendamentos' });
            }}
          >
            Gerenciamento de Agendamentos
          </Text>

        </View>


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
  modalHeader: {
    backgroundColor: '#D2B48C',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  modalContent: {
    marginBottom: 20,
  },
  agendamentoInput: {
    marginBottom: 10, // Diminui o espaço entre os campos
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
    marginBottom: 20,
    borderRadius: 50,
    alignSelf: 'center',
  },
  modalFooter: {
    backgroundColor: '#D2B48C',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    marginTop: 10,
  },
  link: {
    marginTop: 15,
    textAlign: 'center',
    color: '#A67B5B', // Marrom claro no link
    fontWeight: 'bold',
  },
});

export default GerenciamentoAgendamento;