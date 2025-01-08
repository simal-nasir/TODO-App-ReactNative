import {create} from 'zustand';

interface Task {
    id: any;
    title: string;
    description: string;
    status: 'Pending' | 'Completed' | 'Archived';
    completed?:boolean
}

interface TaskStore {
    tasks: Task[];
    addTask: (task: Task) => void;
    deleteTask: (id: any) => void;
    updateTaskStatus: (id: any, status: 'Pending' | 'Completed' | 'Archived') => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
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
