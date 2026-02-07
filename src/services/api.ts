import { supabase } from '../lib/supabase';
import type { Topic, SubTopic, Question } from '../types/database';

export const topicsApi = {
  async getAll() {
    const { data, error } = await supabase
      .from('topics')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) throw error;
    return data as Topic[];
  },

  async create(topic: Omit<Topic, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('topics')
      .insert(topic)
      .select()
      .single();

    if (error) throw error;
    return data as Topic;
  },

  async update(id: string, updates: Partial<Omit<Topic, 'id' | 'created_at' | 'updated_at'>>) {
    const { data, error } = await supabase
      .from('topics')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Topic;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('topics')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async reorder(items: { id: string; order_index: number }[]) {
    const updates = items.map(item =>
      supabase
        .from('topics')
        .update({ order_index: item.order_index })
        .eq('id', item.id)
    );

    await Promise.all(updates);
  }
};

export const subTopicsApi = {
  async getAll() {
    const { data, error } = await supabase
      .from('sub_topics')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) throw error;
    return data as SubTopic[];
  },

  async getByTopicId(topicId: string) {
    const { data, error } = await supabase
      .from('sub_topics')
      .select('*')
      .eq('topic_id', topicId)
      .order('order_index', { ascending: true });

    if (error) throw error;
    return data as SubTopic[];
  },

  async create(subTopic: Omit<SubTopic, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('sub_topics')
      .insert(subTopic)
      .select()
      .single();

    if (error) throw error;
    return data as SubTopic;
  },

  async update(id: string, updates: Partial<Omit<SubTopic, 'id' | 'created_at' | 'updated_at'>>) {
    const { data, error } = await supabase
      .from('sub_topics')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as SubTopic;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('sub_topics')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async reorder(items: { id: string; order_index: number }[]) {
    const updates = items.map(item =>
      supabase
        .from('sub_topics')
        .update({ order_index: item.order_index })
        .eq('id', item.id)
    );

    await Promise.all(updates);
  }
};

export const questionsApi = {
  async getAll() {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) throw error;
    return data as Question[];
  },

  async getBySubTopicId(subTopicId: string) {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('sub_topic_id', subTopicId)
      .order('order_index', { ascending: true });

    if (error) throw error;
    return data as Question[];
  },

  async getByTopicId(topicId: string) {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('topic_id', topicId)
      .order('order_index', { ascending: true });

    if (error) throw error;
    return data as Question[];
  },

  async create(question: Omit<Question, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('questions')
      .insert(question)
      .select()
      .single();

    if (error) throw error;
    return data as Question;
  },

  async update(id: string, updates: Partial<Omit<Question, 'id' | 'created_at' | 'updated_at'>>) {
    const { data, error } = await supabase
      .from('questions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Question;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('questions')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async reorder(items: { id: string; order_index: number }[]) {
    const updates = items.map(item =>
      supabase
        .from('questions')
        .update({ order_index: item.order_index })
        .eq('id', item.id)
    );

    await Promise.all(updates);
  }
};
