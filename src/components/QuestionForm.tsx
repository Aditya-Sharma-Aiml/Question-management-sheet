import { useState } from 'react';
import { useStore } from '../store/useStore';
import type { Question } from '../types/database';

interface QuestionFormProps {
  topicId: string;
  subTopicId: string | null;
  question?: Question;
  onClose: () => void;
}

export default function QuestionForm({ topicId, subTopicId, question, onClose }: QuestionFormProps) {
  const [title, setTitle] = useState(question?.title || '');
  const [description, setDescription] = useState(question?.description || '');
  const [loading, setLoading] = useState(false);

  const { addQuestion, updateQuestion } = useStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (question) {
        await updateQuestion(question.id, { title, description });
      } else {
        await addQuestion({
          topic_id: topicId,
          sub_topic_id: subTopicId,
          title,
          description,
          order_index: 0
        });
      }
      onClose();
    } catch (error) {
      console.error('Error saving question:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Question *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          placeholder="Enter question"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
          placeholder="Enter question description (optional)"
        />
      </div>

      <div className="flex justify-end space-x-3 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : question ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
}
