import { useState } from 'react';
import { useStore } from '../store/useStore';
import type { SubTopic } from '../types/database';

interface SubTopicFormProps {
  topicId: string;
  subTopic?: SubTopic;
  onClose: () => void;
}

export default function SubTopicForm({ topicId, subTopic, onClose }: SubTopicFormProps) {
  const [title, setTitle] = useState(subTopic?.title || '');
  const [description, setDescription] = useState(subTopic?.description || '');
  const [loading, setLoading] = useState(false);

  const { addSubTopic, updateSubTopic } = useStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (subTopic) {
        await updateSubTopic(subTopic.id, { title, description });
      } else {
        await addSubTopic({ topic_id: topicId, title, description, order_index: 0 });
      }
      onClose();
    } catch (error) {
      console.error('Error saving sub-topic:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Title *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          placeholder="Enter sub-topic title"
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
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
          placeholder="Enter sub-topic description (optional)"
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
          className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : subTopic ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
}
