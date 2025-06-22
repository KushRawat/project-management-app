import React from 'react';
import { PencilIcon } from '@heroicons/react/outline';

export type Task = {
  id: string;
  title: string;
  dueDate: string;
  priority: string;
  assignedTo: { id: string; name: string };
};

type Props = {
  tasks: Task[];
  onEdit: (task: Task) => void;
};

const TaskList: React.FC<Props> = ({ tasks, onEdit }) => (
  <div className="bg-white shadow rounded-lg p-4 overflow-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead>
        <tr>
          {['Task', 'Deadline', 'Priority', 'Assigned', ''].map((h) => (
            <th
              key={h}
              className="px-4 py-2 text-left text-sm font-medium text-gray-500"
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {tasks.map((t) => (
          <tr key={t.id} className="hover:bg-gray-50 transition-colors duration-200">
            <td className="px-4 py-2 text-sm text-gray-700">{t.title}</td>
            <td className="px-4 py-2 text-sm text-gray-700">
              {new Date(t.dueDate).toLocaleDateString()}
            </td>
            <td className="px-4 py-2">
              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                {t.priority}
              </span>
            </td>
            <td className="px-4 py-2 text-sm text-gray-700">{t.assignedTo.name}</td>
            <td className="px-4 py-2">
              <button onClick={() => onEdit(t)}>
                <PencilIcon className="h-5 w-5 text-gray-500 hover:text-blue-600 transition-colors duration-200" />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default TaskList;
