import { GripVertical, Edit2, Trash2, CheckCircle2 } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Question } from '../types/database';
import { useState } from 'react';

interface QuestionCardProps {
  question: Question;
  onEdit: () => void;
  onDelete: () => void;
}

export default function QuestionCard({ question, onEdit, onDelete }: QuestionCardProps) {
  const [completed, setCompleted] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: question.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-700 border border-green-200 dark:border-gray-600 rounded-lg p-4 hover:shadow-md transition-all"
    >
      <div className="flex items-start gap-3">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing mt-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <GripVertical className="w-4 h-4" />
        </button>

        <button
          onClick={() => setCompleted(!completed)}
          className="mt-1 text-gray-400 hover:text-green-500 transition-colors"
        >
          <CheckCircle2
            className={`w-5 h-5 ${completed ? 'fill-green-500 text-green-500' : ''}`}
          />
        </button>

        <div className="flex-1 min-w-0">
          <h4
            className={`text-sm font-medium text-gray-900 dark:text-white ${
              completed ? 'line-through text-gray-500 dark:text-gray-400' : ''
            }`}
          >
            {question.title}
          </h4>
          {question.description && (
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {question.description}
            </p>
          )}
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onEdit}
            className="p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
