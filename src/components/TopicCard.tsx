import { useState } from 'react';
import { GripVertical, Edit2, Trash2, Plus, ChevronDown, ChevronRight } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
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
import type { Topic, SubTopic, Question } from '../types/database';
import { useStore } from '../store/useStore';
import SubTopicCard from './SubTopicCard';
import Modal from './Modal';
import SubTopicForm from './SubTopicForm';

interface TopicCardProps {
  topic: Topic;
  subTopics: SubTopic[];
  questions: Question[];
  onEdit: () => void;
  onDelete: () => void;
}

export default function TopicCard({ topic, subTopics, questions, onEdit, onDelete }: TopicCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showSubTopicModal, setShowSubTopicModal] = useState(false);
  const [editingSubTopic, setEditingSubTopic] = useState<SubTopic | null>(null);

  const { reorderSubTopics, deleteSubTopic } = useStore();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: topic.id });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = subTopics.findIndex((st) => st.id === active.id);
      const newIndex = subTopics.findIndex((st) => st.id === over.id);

      const reorderedSubTopics = arrayMove(subTopics, oldIndex, newIndex);
      const updates = reorderedSubTopics.map((st, index) => ({
        id: st.id,
        order_index: index
      }));

      await reorderSubTopics(updates);
    }
  };

  const handleEditSubTopic = (subTopic: SubTopic) => {
    setEditingSubTopic(subTopic);
    setShowSubTopicModal(true);
  };

  const handleCloseSubTopicModal = () => {
    setShowSubTopicModal(false);
    setEditingSubTopic(null);
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all"
      >
        <div className="flex items-center gap-3 p-5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing hover:text-blue-100"
          >
            <GripVertical className="w-5 h-5" />
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="hover:text-blue-100 transition-colors"
          >
            {isExpanded ? (
              <ChevronDown className="w-6 h-6" />
            ) : (
              <ChevronRight className="w-6 h-6" />
            )}
          </button>

          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold">
              {topic.title}
            </h2>
            {topic.description && (
              <p className="text-sm text-blue-100 mt-1">
                {topic.description}
              </p>
            )}
            <p className="text-xs text-blue-200 mt-1">
              {subTopics.length} {subTopics.length === 1 ? 'sub-topic' : 'sub-topics'} • {questions.length} {questions.length === 1 ? 'question' : 'questions'}
            </p>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowSubTopicModal(true)}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
            <button
              onClick={onEdit}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
            >
              <Edit2 className="w-5 h-5" />
            </button>
            <button
              onClick={onDelete}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {isExpanded && subTopics.length > 0 && (
          <div className="p-5 space-y-3 bg-gray-50 dark:bg-gray-900/50">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={subTopics.map((st) => st.id)}
                strategy={verticalListSortingStrategy}
              >
                {subTopics.map((subTopic) => (
                  <SubTopicCard
                    key={subTopic.id}
                    subTopic={subTopic}
                    questions={questions.filter((q) => q.sub_topic_id === subTopic.id)}
                    onEdit={() => handleEditSubTopic(subTopic)}
                    onDelete={() => deleteSubTopic(subTopic.id)}
                  />
                ))}
              </SortableContext>
            </DndContext>
          </div>
        )}
      </div>

      <Modal
        isOpen={showSubTopicModal}
        onClose={handleCloseSubTopicModal}
        title={editingSubTopic ? 'Edit Sub-Topic' : 'Add New Sub-Topic'}
      >
        <SubTopicForm
          topicId={topic.id}
          subTopic={editingSubTopic || undefined}
          onClose={handleCloseSubTopicModal}
        />
      </Modal>
    </>
  );
}
