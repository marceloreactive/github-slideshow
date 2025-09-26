import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';

// URL da nossa API local.
const API_URL = 'http://127.0.0.1:5001';

const App = () => {
  const [lists, setLists] = useState([]);
  const [selectedList, setSelectedList] = useState(null);
  const [newListName, setNewListName] = useState('');
  const [newItemName, setNewItemName] = useState('');

  // Busca as listas da API quando o componente é montado.
  useEffect(() => {
    fetchLists();
  }, []);

  const fetchLists = async () => {
    try {
      const response = await fetch(`${API_URL}/lists`);
      const data = await response.json();
      setLists(data);
    } catch (error) {
      Alert.alert('Erro de Rede', 'Não foi possível buscar as listas.');
      console.error(error);
    }
  };

  const handleCreateList = async () => {
    if (!newListName.trim()) return;
    try {
      const response = await fetch(`${API_URL}/lists`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({name: newListName}),
      });
      if (response.ok) {
        setNewListName('');
        fetchLists();
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível criar a lista.');
    }
  };

  const handleAddItem = async () => {
    if (!newItemName.trim() || !selectedList) return;
    const updatedItems = [...selectedList.items, {name: newItemName}];
    try {
      const response = await fetch(`${API_URL}/lists/${selectedList.id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({items: updatedItems}),
      });
      if (response.ok) {
        setNewItemName('');
        const updatedList = await response.json();
        setSelectedList(updatedList); // Atualiza a lista selecionada com os novos itens
        fetchLists(); // Atualiza a lista geral
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível adicionar o item.');
    }
  };

  const renderList = ({item}) => (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => setSelectedList(item)}>
      <Text style={styles.listName}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderItem = ({item}) => (
    <View style={styles.itemItem}>
      <Text>{item.name}</Text>
    </View>
  );

  if (selectedList) {
    return (
      <SafeAreaView style={styles.container}>
        <Button title="< Voltar para Listas" onPress={() => setSelectedList(null)} />
        <Text style={styles.title}>{selectedList.name}</Text>
        <FlatList
          data={selectedList.items}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          ListHeaderComponent={
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Nome do item"
                value={newItemName}
                onChangeText={setNewItemName}
              />
              <Button title="Adicionar Item" onPress={handleAddItem} />
            </View>
          }
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Minhas Listas de Compras</Text>
      <FlatList
        data={lists}
        renderItem={renderList}
        keyExtractor={item => item.id}
        ListHeaderComponent={
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Nome da nova lista"
              value={newListName}
              onChangeText={setNewListName}
            />
            <Button title="Criar Lista" onPress={handleCreateList} />
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 10, backgroundColor: '#f5f5f5'},
  title: {fontSize: 24, fontWeight: 'bold', marginVertical: 15, textAlign: 'center'},
  inputContainer: {flexDirection: 'row', marginBottom: 20, paddingHorizontal: 10},
  input: {flex: 1, borderColor: '#ccc', borderWidth: 1, padding: 10, marginRight: 10, borderRadius: 5},
  listItem: {padding: 15, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee', borderRadius: 5, marginVertical: 5},
  listName: {fontSize: 18},
  itemItem: {padding: 10, backgroundColor: '#fff', marginVertical: 2},
});

export default App;