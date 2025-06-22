import React, { useRef, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { XMarkIcon, ChevronDownIcon } from "@heroicons/react/24/solid";
import { Combobox } from "@headlessui/react";

export type Assignee = { id: string; name: string };
export type Priority = string;

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignees: Assignee[];
  priorities: Priority[];
  onSubmit: (data: {
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    priority: number;
    assigneeIds: string[];
  }) => Promise<void>;
}

export default function AddTaskModal({
  isOpen,
  onClose,
  assignees,
  priorities,
  onSubmit,
}: AddTaskModalProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const [title, setTitle] = useState("");
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [priorityIdx, setPriorityIdx] = useState(0);
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (
      !title ||
      !description ||
      !startDate ||
      !endDate ||
      !selectedAssignees.length
    ) {
      setError("All fields required and at least one assignee.");
      return;
    }
    setError(null);
    try {
      await onSubmit({
        title,
        description,
        startDate,
        endDate,
        priority: priorityIdx + 1,
        assigneeIds: selectedAssignees,
      });
      // reset
      setTitle("");
      setSelectedAssignees([]);
      setStartDate("");
      setEndDate("");
      setPriorityIdx(0);
      setDescription("");
    } catch (e: any) {
      setError(e.message || "Failed to add task");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={wrapperRef}
          className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) =>
            e.target === wrapperRef.current && onClose()
          }
        >
          <motion.div
            className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md"
            initial={{ y: 20, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Add Task</h2>
              <button
                onClick={onClose}
                className="text-gray-600 hover:text-gray-800"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {error && (
              <div className="mb-4 px-4 py-2 bg-red-100 text-red-700 rounded">
                {error}
              </div>
            )}

            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#367cf6] transition"
                />
              </div>

              {/* Assignees multi-select */}
              <Combobox
                multiple
                value={selectedAssignees}
                onChange={setSelectedAssignees}
              >
                <div className="relative">
                  <Combobox.Button className="w-full h-10 flex items-center justify-between px-3 border border-gray-300 bg-white rounded-lg">
                    <span className="text-sm text-gray-700">
                      {selectedAssignees.length
                        ? selectedAssignees
                            .map(
                              (id) =>
                                assignees.find((a) => a.id === id)!
                                  .name
                            )
                            .join(", ")
                        : "Select assignees…"}
                    </span>
                    <ChevronDownIcon className="w-5 h-5 text-gray-400" />
                  </Combobox.Button>
                  <Combobox.Options className="absolute mt-1 w-full bg-white border border-gray-300 rounded-lg max-h-60 overflow-auto z-10">
                    {assignees.map((a) => (
                      <Combobox.Option
                        key={a.id}
                        value={a.id}
                        className={({ active, selected }) =>
                          `cursor-pointer px-3 py-2 text-sm ${
                            active ? "bg-blue-50" : ""
                          } ${
                            selected
                              ? "font-semibold text-[#367cf6]"
                              : "text-gray-700"
                          }`
                        }
                      >
                        {a.name}
                      </Combobox.Option>
                    ))}
                  </Combobox.Options>
                </div>
              </Combobox>

              {/* Dates & Priority */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#367cf6] transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#367cf6] transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Priority
                  </label>
                  <select
                    value={priorityIdx}
                    onChange={(e) =>
                      setPriorityIdx(Number(e.target.value))
                    }
                    className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#367cf6] transition"
                  >
                    {priorities.map((p, i) => (
                      <option key={p} value={i}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#367cf6] transition"
                  rows={3}
                />
              </div>
            </div>

            {/* actions */}
            <div className="mt-6 flex justify-end space-x-3 border-t pt-4">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-transform hover:scale-[1.02]"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-white border border-[#367cf6] text-[#367cf6] rounded-lg hover:bg-[#e6f0ff] transition-transform hover:scale-[1.02]"
              >
                Add Task
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
