import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, ScrollView, Animated } from 'react-native';
import { Button, Card } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

const Home = () => {
  const navigation = useNavigation<any>();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [pendingTasks, setPendingTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(1)).current;
  useFocusEffect(
    React.useCallback(() => {
      const loadTasks = async () => {
        try {
          const storedTasks = await AsyncStorage.getItem('tasks');
          if (storedTasks) {
            const parsedTasks: Task[] = JSON.parse(storedTasks);
            setTasks(parsedTasks);
            setPendingTasks(parsedTasks.filter((task) => !task.completed));
            setCompletedTasks(parsedTasks.filter((task) => task.completed));
          }
        } catch (error) {
          console.error('Error loading tasks:', error);
        }
      };

      loadTasks();

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();

      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1.2,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }, [fadeAnim, bounceAnim])
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Welcome to the Home</Text>

      <Animated.View style={{ transform: [{ scale: bounceAnim }] }}>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('AddTask')}
          style={styles.addButton}
          labelStyle={styles.addButtonText}
        >
          Add Task
        </Button>
      </Animated.View>

      <Text style={styles.sectionTitle}>Pending Tasks</Text>
      {pendingTasks.map((task, index) => (
        <Animated.View
          key={task.id}
          style={[
            styles.card,
            { opacity: fadeAnim, transform: [{ translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [10, 0] }) }] },
          ]}
        >
          <Card>
            <Card.Title title={task.title} />
            <Card.Content>
              <Text>{task.description}</Text>
            </Card.Content>
          </Card>
        </Animated.View>
      ))}

      <Text style={styles.sectionTitle}>Completed Tasks</Text>
      {completedTasks.map((task, index) => (
        <Animated.View
          key={task.id}
          style={[
            styles.card,
            { opacity: fadeAnim, transform: [{ translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [10, 0] }) }] },
          ]}
        >
          <Card>
            <Card.Title title={task.title} />
            <Card.Content>
              <Text>{task.description}</Text>
            </Card.Content>
          </Card>
        </Animated.View>
      ))}
    </ScrollView>
  );
};

export default Home;

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
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#64748b',
  },
  addButton: {
    backgroundColor: '#3b82f6',
    marginBottom: 20,
  },
  addButtonText: {
    color: '#ffffff',
  },
  card: {
    marginVertical: 5,
    backgroundColor: '#ffffff',
    elevation: 2,
  },
});