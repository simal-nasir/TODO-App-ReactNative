import {create} from 'zustand';

interface Task {
    id: string;
    title: string;
    description: string;
    status: 'Pending' | 'Completed' | 'Archived';
}

interface TaskStore {
    tasks: Task[];
    addTask: (task: Task) => void;
    deleteTask: (id: string) => void;
    updateTaskStatus: (id: string, status: 'Pending' | 'Completed' | 'Archived') => void;
}

const useTaskStore = create<TaskStore>((set) => ({
    tasks: [],
    addTask: (task) =>
        set((state) => ({ tasks: [...state.tasks, task] })),
    deleteTask: (id) =>
        set((state) => ({
            tasks: state.tasks.filter((task) => task.id !== id),
        })),
    updateTaskStatus: (id, status) =>
        set((state) => ({
            tasks: state.tasks.map((task) =>
                task.id === id ? { ...task, status } : task
            ),
        })),
}));

export default useTaskStore;