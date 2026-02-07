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
import type { SubTopic, Question } from '../types/database';
import { useStore } from '../store/useStore';
import QuestionCard from './QuestionCard';
import Modal from './Modal';
import QuestionForm from './QuestionForm';

interface SubTopicCardProps {
  subTopic: SubTopic;
  questions: Question[];
  onEdit: () => void;
  onDelete: () => void;
}

export default function SubTopicCard({ subTopic, questions, onEdit, onDelete }: SubTopicCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  const { reorderQuestions, deleteQuestion } = useStore();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: subTopic.id });

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
      const oldIndex = questions.findIndex((q) => q.id === active.id);
      const newIndex = questions.findIndex((q) => q.id === over.id);

      const reorderedQuestions = arrayMove(questions, oldIndex, newIndex);
      const updates = reorderedQuestions.map((q, index) => ({
        id: q.id,
        order_index: index
      }));

      await reorderQuestions(updates);
    }
  };

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question);
    setShowQuestionModal(true);
  };

  const handleCloseQuestionModal = () => {
    setShowQuestionModal(false);
    setEditingQuestion(null);
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className="group bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-gray-800 dark:to-gray-800 border border-cyan-200 dark:border-gray-600 rounded-lg overflow-hidden"
      >
        <div className="flex items-center gap-3 p-4 bg-white/50 dark:bg-gray-700/30">
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <GripVertical className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            {isExpanded ? (
              <ChevronDown className="w-5 h-5" />
            ) : (
              <ChevronRight className="w-5 h-5" />
            )}
          </button>

          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
              {subTopic.title}
            </h3>
            {subTopic.description && (
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                {subTopic.description}
              </p>
            )}
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              {questions.length} {questions.length === 1 ? 'question' : 'questions'}
            </p>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowQuestionModal(true)}
              className="p-2 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              onClick={onEdit}
              className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={onDelete}
              className="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {isExpanded && questions.length > 0 && (
          <div className="p-4 space-y-2">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={questions.map((q) => q.id)}
                strategy={verticalListSortingStrategy}
              >
                {questions.map((question) => (
                  <QuestionCard
                    key={question.id}
                    question={question}
                    onEdit={() => handleEditQuestion(question)}
                    onDelete={() => deleteQuestion(question.id)}
                  />
                ))}
              </SortableContext>
            </DndContext>
          </div>
        )}
      </div>

      <Modal
        isOpen={showQuestionModal}
        onClose={handleCloseQuestionModal}
        title={editingQuestion ? 'Edit Question' : 'Add New Question'}
      >
        <QuestionForm
          topicId={subTopic.topic_id}
          subTopicId={subTopic.id}
          question={editingQuestion || undefined}
          onClose={handleCloseQuestionModal}
        />
      </Modal>
    </>
  );
}
