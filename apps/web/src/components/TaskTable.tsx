import React, { useState } from "react";

export interface TaskWithAssignments {
  id: string;
  title: string;
  description: string | null;
  priorityName: string;
  dueDate: string;
  createdAt: string;
  assignments: { user: { id: string; name: string } }[];
}

interface TaskTableProps {
  tasks: TaskWithAssignments[];
  onEdit: (task: TaskWithAssignments) => void;
  onDelete: (task: TaskWithAssignments) => void;
}

export default function TaskTable({
  tasks,
  onEdit,
  onDelete,
}: TaskTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (tasks.length === 0) {
    return <p className="text-center py-8">No tasks yet.</p>;
  }

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {[
              "Task",
              "Assignees",
              "Priority",
              "Created",
              "Due Date",
              "Actions",
            ].map((h) => (
              <th
                key={h}
                className="px-4 py-2 text-left text-sm font-medium text-gray-600"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {tasks.map((t) => {
            const isExpanded = expandedId === t.id;
            return (
              <React.Fragment key={t.id}>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm">{t.title}</td>
                  <td className="px-4 py-2 text-sm">
                    {t.assignments.map((a) => a.user.name).join(", ")}
                  </td>
                  <td className="px-4 py-2 text-sm">{t.priorityName}</td>
                  <td className="px-4 py-2 text-sm">
                    {/* {new Date(t.createdAt).toLocaleDateString()} */}
                    {t.createdAt.slice(0, 10)}
                  </td>
                  <td className="px-4 py-2 text-sm">
                    {new Date(t.dueDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 space-x-2">
                    <button
                      onClick={() => onEdit(t)}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(t)}
                      className="text-red-600 hover:underline text-sm"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() =>
                        setExpandedId(isExpanded ? null : t.id)
                      }
                      className="text-gray-600 hover:underline text-sm"
                    >
                      {isExpanded ? "Hide" : "Details"}
                    </button>
                  </td>
                </tr>
                {isExpanded && (
                  <tr className="bg-gray-50">
                    <td
                      colSpan={6}
                      className="px-4 py-3 text-sm text-gray-700"
                    >
                      {t.description || "No description."}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
