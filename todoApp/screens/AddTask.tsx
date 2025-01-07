import React, { useState } from 'react';
import { View, TextInput, StyleSheet, ScrollView, Text, Alert } from 'react-native';
import { Button, Card, Checkbox } from 'react-native-paper';
import useTaskStore from '../useTaskStore';

interface Task {
  title: string;
  description: string;
  completed: boolean;
}

const AddTask = () => {
  const { tasks, addTask, deleteTask, updateTaskStatus } = useTaskStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const handleSaveTask = () => {
    if (!title.trim() || !description.trim()) {
      Alert.alert('Error', 'Please enter both a title and description');
      return;
    }

    if (isEditing && editIndex !== null) {
      updateTaskStatus(editIndex, { title, description, completed: false });
      setIsEditing(false);
      setEditIndex(null);
    } else {
      addTask({ title, description, completed: false });
    }

    setTitle('');
    setDescription('');
  };

  const handleToggleTask = (index: number) => {
    const updatedTask = { ...tasks[index], completed: !tasks[index].completed };
    updateTaskStatus(index, updatedTask); // Toggle task completion via Zustand
  };

  const handleDeleteTask = (index: number) => {
    deleteTask(index); // Delete task via Zustand
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