export interface Database {
  public: {
    Tables: {
      topics: {
        Row: Topic;
        Insert: Omit<Topic, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Topic, 'id' | 'created_at' | 'updated_at'>>;
      };
      sub_topics: {
        Row: SubTopic;
        Insert: Omit<SubTopic, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<SubTopic, 'id' | 'created_at' | 'updated_at'>>;
      };
      questions: {
        Row: Question;
        Insert: Omit<Question, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Question, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
  };
}

export interface Topic {
  id: string;
  title: string;
  description: string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface SubTopic {
  id: string;
  topic_id: string;
  title: string;
  description: string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface Question {
  id: string;
  topic_id: string;
  sub_topic_id: string | null;
  title: string;
  description: string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
}
