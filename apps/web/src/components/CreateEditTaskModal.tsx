import React, { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import type { RouterOutputs } from "../utils/api";

type Task = RouterOutputs["task"]["getAll"][0];

export type TaskFormInput = {
  title: string;
  assigneeIds: string[];
  priority: number;
  dueDate?: string;
  description?: string;
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TaskFormInput) => void;
  users: { id: string; name: string }[];
  initialData?: Task | null;
}

export default function CreateEditTaskModal({
  isOpen,
  onClose,
  onSubmit,
  users,
  initialData = null,
}: Props) {
  const [title, setTitle] = useState("");
  const [assigneeIds, setAssigneeIds] = useState<string[]>([]);
  const [priority, setPriority] = useState(3);
  const [dueDate, setDueDate] = useState("");
  const [description, setDescription] = useState("");

  // populate when editing
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setAssigneeIds(
        initialData.assignments.map((a) => a.user.id)
      );
      setPriority(initialData.priority);
      setDueDate(
        initialData.dueDate
          ? new Date(initialData.dueDate)
              .toISOString()
              .slice(0, 16)
          : ""
      );
      setDescription(initialData.description ?? "");
    } else {
      setTitle("");
      setAssigneeIds([]);
      setPriority(3);
      setDueDate("");
      setDescription("");
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      assigneeIds,
      priority,
      dueDate: dueDate || undefined,
      description: description || undefined,
    });
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={onClose}
      >
        {/* backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-50"
          leave="ease-in duration-150"
          leaveFrom="opacity-50"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            {/* panel */}
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md bg-white rounded-lg shadow p-6">
                <Dialog.Title className="text-lg font-medium mb-4">
                  {initialData ? "Edit Task" : "Add Task"}
                </Dialog.Title>
                <form
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium">
                      Title
                    </label>
                    <input
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="mt-1 w-full border rounded px-3 py-2 focus:ring focus:ring-blue-200 transition"
                    />
                  </div>

                  {/* Assignees */}
                  <div>
                    <label className="block text-sm font-medium">
                      Assignees
                    </label>
                    <select
                      multiple
                      required
                      value={assigneeIds}
                      onChange={(e) =>
                        setAssigneeIds(
                          Array.from(
                            e.target.selectedOptions,
                            (opt) => opt.value
                          )
                        )
                      }
                      className="mt-1 w-full border rounded px-3 py-2 focus:ring focus:ring-blue-200 transition"
                    >
                      {users.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Priority */}
                  <div>
                    <label className="block text-sm font-medium">
                      Priority
                    </label>
                    <select
                      value={priority}
                      onChange={(e) =>
                        setPriority(Number(e.target.value))
                      }
                      className="mt-1 w-full border rounded px-3 py-2 focus:ring focus:ring-blue-200 transition"
                    >
                      {[1, 2, 3, 4, 5].map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Due Date */}
                  <div>
                    <label className="block text-sm font-medium">
                      Due Date
                    </label>
                    <input
                      type="datetime-local"
                      value={dueDate}
                      onChange={(e) =>
                        setDueDate(e.target.value)
                      }
                      className="mt-1 w-full border rounded px-3 py-2 focus:ring focus:ring-blue-200 transition"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium">
                      Description
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) =>
                        setDescription(e.target.value)
                      }
                      className="mt-1 w-full border rounded px-3 py-2 focus:ring focus:ring-blue-200 transition"
                    />
                  </div>

                  {/* Buttons */}
                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
