import React, { useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { XMarkIcon, TrashIcon } from "@heroicons/react/24/solid";

interface Task {
  id: string;
  title: string;
  dueDate: string;
}

interface DeleteTaskModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: string) => Promise<void>;
}

export default function DeleteTaskModal({
  task,
  isOpen,
  onClose,
  onConfirm,
}: DeleteTaskModalProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={wrapperRef}
          className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => e.target === wrapperRef.current && onClose()}
        >
          <motion.div
            className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm"
            initial={{ y: 20, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Confirm Deletion</h2>
              <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <p className="mb-4 text-gray-800">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-red-600">{task.title}</span>?
            </p>

            <p className="mb-6 text-sm text-gray-500">
              Due Date:{" "}
            <span className="font-medium">
              {task.dueDate
                ? new Date(task.dueDate).toLocaleDateString()
                : "-"}
            </span>
            </p>

            <div className="flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-transform hover:scale-[1.02]"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await onConfirm(task.id);
                }}
                className="flex items-center space-x-1 px-4 py-2 bg-white border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-transform hover:scale-[1.02]"
              >
                <TrashIcon className="h-5 w-5" />
                <span>Delete</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
