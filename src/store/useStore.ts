import { create } from 'zustand';
import type { Topic, SubTopic, Question } from '../types/database';
import { topicsApi, subTopicsApi, questionsApi } from '../services/api';
import toast from 'react-hot-toast';

interface Store {
  topics: Topic[];
  subTopics: SubTopic[];
  questions: Question[];
  loading: boolean;
  darkMode: boolean;

  fetchAllData: () => Promise<void>;

  addTopic: (topic: Omit<Topic, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateTopic: (id: string, updates: Partial<Omit<Topic, 'id' | 'created_at' | 'updated_at'>>) => Promise<void>;
  deleteTopic: (id: string) => Promise<void>;
  reorderTopics: (items: { id: string; order_index: number }[]) => Promise<void>;

  addSubTopic: (subTopic: Omit<SubTopic, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateSubTopic: (id: string, updates: Partial<Omit<SubTopic, 'id' | 'created_at' | 'updated_at'>>) => Promise<void>;
  deleteSubTopic: (id: string) => Promise<void>;
  reorderSubTopics: (items: { id: string; order_index: number }[]) => Promise<void>;

  addQuestion: (question: Omit<Question, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateQuestion: (id: string, updates: Partial<Omit<Question, 'id' | 'created_at' | 'updated_at'>>) => Promise<void>;
  deleteQuestion: (id: string) => Promise<void>;
  reorderQuestions: (items: { id: string; order_index: number }[]) => Promise<void>;

  toggleDarkMode: () => void;
}

export const useStore = create<Store>((set, get) => ({
  topics: [],
  subTopics: [],
  questions: [],
  loading: false,
  darkMode: localStorage.getItem('darkMode') === 'true',

  fetchAllData: async () => {
    try {
      set({ loading: true });
      const [topics, subTopics, questions] = await Promise.all([
        topicsApi.getAll(),
        subTopicsApi.getAll(),
        questionsApi.getAll()
      ]);
      set({ topics, subTopics, questions, loading: false });
    } catch (error) {
      toast.error('Failed to fetch data');
      set({ loading: false });
    }
  },

  addTopic: async (topic) => {
    try {
      const maxOrder = Math.max(...get().topics.map(t => t.order_index), -1);
      const newTopic = await topicsApi.create({ ...topic, order_index: maxOrder + 1 });
      set({ topics: [...get().topics, newTopic] });
      toast.success('Topic added successfully');
    } catch (error) {
      toast.error('Failed to add topic');
      throw error;
    }
  },

  updateTopic: async (id, updates) => {
    try {
      const updatedTopic = await topicsApi.update(id, updates);
      set({
        topics: get().topics.map(t => t.id === id ? updatedTopic : t)
      });
      toast.success('Topic updated successfully');
    } catch (error) {
      toast.error('Failed to update topic');
      throw error;
    }
  },

  deleteTopic: async (id) => {
    try {
      await topicsApi.delete(id);
      set({
        topics: get().topics.filter(t => t.id !== id),
        subTopics: get().subTopics.filter(st => st.topic_id !== id),
        questions: get().questions.filter(q => q.topic_id !== id)
      });
      toast.success('Topic deleted successfully');
    } catch (error) {
      toast.error('Failed to delete topic');
      throw error;
    }
  },

  reorderTopics: async (items) => {
    try {
      await topicsApi.reorder(items);
      const updatedTopics = get().topics.map(topic => {
        const item = items.find(i => i.id === topic.id);
        return item ? { ...topic, order_index: item.order_index } : topic;
      }).sort((a, b) => a.order_index - b.order_index);
      set({ topics: updatedTopics });
    } catch (error) {
      toast.error('Failed to reorder topics');
      throw error;
    }
  },

  addSubTopic: async (subTopic) => {
    try {
      const maxOrder = Math.max(
        ...get().subTopics
          .filter(st => st.topic_id === subTopic.topic_id)
          .map(st => st.order_index),
        -1
      );
      const newSubTopic = await subTopicsApi.create({ ...subTopic, order_index: maxOrder + 1 });
      set({ subTopics: [...get().subTopics, newSubTopic] });
      toast.success('Sub-topic added successfully');
    } catch (error) {
      toast.error('Failed to add sub-topic');
      throw error;
    }
  },

  updateSubTopic: async (id, updates) => {
    try {
      const updatedSubTopic = await subTopicsApi.update(id, updates);
      set({
        subTopics: get().subTopics.map(st => st.id === id ? updatedSubTopic : st)
      });
      toast.success('Sub-topic updated successfully');
    } catch (error) {
      toast.error('Failed to update sub-topic');
      throw error;
    }
  },

  deleteSubTopic: async (id) => {
    try {
      await subTopicsApi.delete(id);
      set({
        subTopics: get().subTopics.filter(st => st.id !== id),
        questions: get().questions.filter(q => q.sub_topic_id !== id)
      });
      toast.success('Sub-topic deleted successfully');
    } catch (error) {
      toast.error('Failed to delete sub-topic');
      throw error;
    }
  },

  reorderSubTopics: async (items) => {
    try {
      await subTopicsApi.reorder(items);
      const updatedSubTopics = get().subTopics.map(subTopic => {
        const item = items.find(i => i.id === subTopic.id);
        return item ? { ...subTopic, order_index: item.order_index } : subTopic;
      }).sort((a, b) => a.order_index - b.order_index);
      set({ subTopics: updatedSubTopics });
    } catch (error) {
      toast.error('Failed to reorder sub-topics');
      throw error;
    }
  },

  addQuestion: async (question) => {
    try {
      const maxOrder = Math.max(
        ...get().questions
          .filter(q => q.sub_topic_id === question.sub_topic_id)
          .map(q => q.order_index),
        -1
      );
      const newQuestion = await questionsApi.create({ ...question, order_index: maxOrder + 1 });
      set({ questions: [...get().questions, newQuestion] });
      toast.success('Question added successfully');
    } catch (error) {
      toast.error('Failed to add question');
      throw error;
    }
  },

  updateQuestion: async (id, updates) => {
    try {
      const updatedQuestion = await questionsApi.update(id, updates);
      set({
        questions: get().questions.map(q => q.id === id ? updatedQuestion : q)
      });
      toast.success('Question updated successfully');
    } catch (error) {
      toast.error('Failed to update question');
      throw error;
    }
  },

  deleteQuestion: async (id) => {
    try {
      await questionsApi.delete(id);
      set({
        questions: get().questions.filter(q => q.id !== id)
      });
      toast.success('Question deleted successfully');
    } catch (error) {
      toast.error('Failed to delete question');
      throw error;
    }
  },

  reorderQuestions: async (items) => {
    try {
      await questionsApi.reorder(items);
      const updatedQuestions = get().questions.map(question => {
        const item = items.find(i => i.id === question.id);
        return item ? { ...question, order_index: item.order_index } : question;
      }).sort((a, b) => a.order_index - b.order_index);
      set({ questions: updatedQuestions });
    } catch (error) {
      toast.error('Failed to reorder questions');
      throw error;
    }
  },

  toggleDarkMode: () => {
    const newDarkMode = !get().darkMode;
    localStorage.setItem('darkMode', String(newDarkMode));
    set({ darkMode: newDarkMode });
  }
}));
