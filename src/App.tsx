import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import { useStore } from './store/useStore';
import Header from './components/Header';
import TopicCard from './components/TopicCard';
import LoadingSpinner from './components/LoadingSpinner';
import Modal from './components/Modal';
import TopicForm from './components/TopicForm';
import type { Topic } from './types/database';

function App() {
  const {
    topics,
    subTopics,
    questions,
    loading,
    darkMode,
    fetchAllData,
    reorderTopics,
    deleteTopic
  } = useStore();

  const [showTopicModal, setShowTopicModal] = useState(false);
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = topics.findIndex((t) => t.id === active.id);
      const newIndex = topics.findIndex((t) => t.id === over.id);

      const reorderedTopics = arrayMove(topics, oldIndex, newIndex);
      const updates = reorderedTopics.map((t, index) => ({
        id: t.id,
        order_index: index
      }));

      await reorderTopics(updates);
    }
  };

  const handleEditTopic = (topic: Topic) => {
    setEditingTopic(topic);
    setShowTopicModal(true);
  };

  const handleCloseTopicModal = () => {
    setShowTopicModal(false);
    setEditingTopic(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'dark:bg-gray-800 dark:text-white',
          duration: 3000
        }}
      />

      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Question Management Sheet
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Organize and manage your questions with drag-and-drop functionality
            </p>
          </div>

          <button
            onClick={() => setShowTopicModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-md transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Add Topic</span>
          </button>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : topics.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-200 dark:bg-gray-800 rounded-full mb-4">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No topics yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Get started by creating your first topic
            </p>
            <button
              onClick={() => setShowTopicModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Add Your First Topic</span>
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={topics.map((t) => t.id)}
                strategy={verticalListSortingStrategy}
              >
                {topics.map((topic) => (
                  <TopicCard
                    key={topic.id}
                    topic={topic}
                    subTopics={subTopics.filter((st) => st.topic_id === topic.id)}
                    questions={questions.filter((q) => q.topic_id === topic.id)}
                    onEdit={() => handleEditTopic(topic)}
                    onDelete={() => deleteTopic(topic.id)}
                  />
                ))}
              </SortableContext>
            </DndContext>
          </div>
        )}
      </main>

      <Modal
        isOpen={showTopicModal}
        onClose={handleCloseTopicModal}
        title={editingTopic ? 'Edit Topic' : 'Add New Topic'}
      >
        <TopicForm
          topic={editingTopic || undefined}
          onClose={handleCloseTopicModal}
        />
      </Modal>
    </div>
  );
}

export default App;
