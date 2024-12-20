import React, { useEffect, useState } from 'react';
import { View, TextInput, StyleSheet, ScrollView, Text, Alert } from 'react-native';
import { Button, Card, Checkbox } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Task {
  title: string;
  description: string;
  completed: boolean;
}

const AddTask = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const storedTasks = await AsyncStorage.getItem('tasks');
        if (storedTasks) {
          console.log('Loaded tasks:', storedTasks);
          setTasks(JSON.parse(storedTasks));
        }
      } catch (error) {
        console.error('Error loading tasks:', error);
      }
    };

    loadTasks();
  }, []);

  const handleSaveTask = async () => {
    if (!title.trim() || !description.trim()) {
      Alert.alert('Error', 'Please enter both a title and description');
      return;
    }

    if (isEditing && editIndex !== null) {
      const updatedTasks = [...tasks];
      updatedTasks[editIndex] = { ...updatedTasks[editIndex], title, description };

      try {
        await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
        setTasks(updatedTasks);
        setIsEditing(false);
        setEditIndex(null);
      } catch (error) {
        console.error('Error updating task:', error);
      }
    } else {
      const newTask: Task = {
        title,
        description,
        completed: false,
      };

      try {
        const storedTasks = await AsyncStorage.getItem('tasks');
        let updatedTasks: Task[] = storedTasks ? JSON.parse(storedTasks) : [];
        updatedTasks.push(newTask);

        console.log('Saving tasks:', updatedTasks);

        await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
        setTasks(updatedTasks);
      } catch (error) {
        console.error('Error saving task:', error);
      }
    }

    setTitle('');
    setDescription('');
  };

  const handleToggleTask = async (index: number) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].completed = !updatedTasks[index].completed;

    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
      setTasks(updatedTasks);
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const handleDeleteTask = async (index: number) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);

    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
      setTasks(updatedTasks);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleEditTask = (index: number) => {
    setTitle(tasks[index].title);
    setDescription(tasks[index].description);
    setIsEditing(true);
    setEditIndex(index);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{isEditing ? 'Edit Task' : 'Add a New Task'}</Text>

      <TextInput
        style={styles.input}
        placeholder="Task Title"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Task Description"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <Button
        mode="contained"
        onPress={handleSaveTask}
        style={styles.button}
        labelStyle={styles.buttonText}
      >
        {isEditing ? 'Update Task' : 'Save Task'}
      </Button>

      <Text style={styles.subTitle}>Saved Tasks</Text>
      {tasks.map((task, index) => (
        <Card key={`${task.title}-${index}`} style={styles.card}>
          <Card.Title title={task.title} />
          <Card.Content>
            <Text>{task.description}</Text>
            <View style={styles.checkboxContainer}>
              <Checkbox
                status={task.completed ? 'checked' : 'unchecked'}
                onPress={() => handleToggleTask(index)}
              />
              <Text style={{ color: task.completed ? 'green' : 'red', fontWeight: 'bold' }}>
                {task.completed ? 'Completed' : 'Pending'}
              </Text>
            </View>
            <Button
              mode="contained"
              onPress={() => handleEditTask(index)}
              style={styles.editButton}
              labelStyle={styles.editButtonText}
            >
              Edit
            </Button>
            <Button
              mode="contained"
              onPress={() => handleDeleteTask(index)}
              style={styles.deleteButton}
              labelStyle={styles.deleteButtonText}
            >
              Delete
            </Button>
          </Card.Content>
        </Card>
      ))}
    </ScrollView>
  );
};

export default AddTask;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f8fafc',
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3b82f6',
    marginBottom: 10,
    textAlign: 'center',
  },
  subTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#64748b',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#ffffff',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    marginTop: 10,
    backgroundColor: '#3b82f6',
    borderRadius: 25,
    paddingVertical: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  card: {
    marginVertical: 5,
    backgroundColor: '#ffffff',
    elevation: 2,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  editButton: {
    marginTop: 10,
    backgroundColor: '#f59e0b',
    borderRadius: 25,
    paddingVertical: 5,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  deleteButton: {
    marginTop: 10,
    backgroundColor: '#ef4444',
    borderRadius: 25,
    paddingVertical: 5,
  },
  deleteButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});