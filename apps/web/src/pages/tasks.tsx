import React, { useState, useEffect, Fragment } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  PlusIcon,
  ChevronDownIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowPathIcon,
  FunnelIcon,
} from "@heroicons/react/24/solid";
import { Combobox } from "@headlessui/react";

import AddTaskModal from "@/components/AddTaskModal";
import EditTaskModal from "@/components/EditTaskModal";
import DeleteTaskModal from "@/components/DeleteTaskModal";
import { api } from "@/utils/api";
import type { Assignee } from "@/components/AddTaskModal";

const PRIORITY_OPTIONS = [
  "Not started",
  "In progress",
  "Designing",
  "Testing",
  "Blocked",
  "Complete",
  "On hold",
] as const;

const PRIORITY_COLORS: Record<typeof PRIORITY_OPTIONS[number], string> = {
  "Not started": "bg-gray-100 text-gray-800",
  "In progress": "bg-blue-100 text-blue-800",
  Designing: "bg-teal-100 text-teal-800",
  Testing: "bg-yellow-100 text-yellow-800",
  Blocked: "bg-red-100 text-red-800",
  Complete: "bg-green-100 text-green-800",
  "On hold": "bg-orange-100 text-orange-800",
};

type TaskWithAssignments = {
  id: string;
  title: string;
  description: string | null;
  priorityName: string;
  dueDate: string | null;
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
  updatedAt: string;
  assignments: { user: { id: string; name: string } }[];
};

type SortKey = "title" | "assignees" | "priority" | "dueDate";

export default function TasksPage() {
  // — Filters
  const [filters, setFilters] = useState({
    search: "",
    assigneeIds: [] as string[],
    priority: "",
    start: "",
    end: "",
  });
  const onFilter = <K extends keyof typeof filters>(k: K, v: typeof filters[K]) =>
    setFilters((f) => ({ ...f, [k]: v }));
  const resetFilters = () =>
    setFilters({ search: "", assigneeIds: [], priority: "", start: "", end: "" });

  // — Fetch assignees
  const { data: rawUsers } = api.user.getAll.useQuery();
  const assignees: Assignee[] = (() => {
    if (Array.isArray(rawUsers)) return rawUsers;
    if (rawUsers && Array.isArray((rawUsers as any).json)) return (rawUsers as any).json;
    return [];
  })();

  // — Fetch tasks
  const { data: rawTasks, refetch: refetchTasks } = api.task.getAll.useQuery(
    {
      search: filters.search,
      assigneeIds: filters.assigneeIds,
      priority: filters.priority,
      start: filters.start,
      end: filters.end,
    },
    { keepPreviousData: true }
  );

  const tasksArray: any[] = Array.isArray(rawTasks)
    ? rawTasks
    : rawTasks && Array.isArray((rawTasks as any).json)
    ? (rawTasks as any).json
    : [];

  const tasks: TaskWithAssignments[] = tasksArray.map((t) => ({
    ...t,
    dueDate: t.dueDate,
    startDate: t.startDate,
    endDate: t.endDate,
    createdAt: t.createdAt,
    updatedAt: t.updatedAt,
  }));

  // — Banner
  const [banner, setBanner] = useState<string | null>(null);
  useEffect(() => {
    if (banner) {
      const h = setTimeout(() => setBanner(null), 2500);
      return () => clearTimeout(h);
    }
  }, [banner]);

  // — Sorting
  const [sortKey, setSortKey] = useState<SortKey>("title");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  // — Expand descriptions
  const [openDesc, setOpenDesc] = useState<Record<string, boolean>>({});

  // — Apply filters + sort
  const visible = tasks
    .filter((t) => {
      if (
        filters.search &&
        !t.title.toLowerCase().includes(filters.search.toLowerCase())
      )
        return false;
      if (
        filters.assigneeIds.length &&
        !t.assignments.some((a) =>
          filters.assigneeIds.includes(a.user.id)
        )
      )
        return false;
      if (filters.priority && t.priorityName !== filters.priority) return false;
      if (filters.start && new Date(t.dueDate || "") < new Date(filters.start))
        return false;
      if (filters.end && new Date(t.dueDate || "") > new Date(filters.end))
        return false;
      return true;
    })
    .sort((a, b) => {
      let av: string | number = "", bv: string | number = "";
      switch (sortKey) {
        case "title":
          av = a.title.toLowerCase();
          bv = b.title.toLowerCase();
          break;
        case "dueDate":
          av = a.dueDate || "";
          bv = b.dueDate || "";
          break;
        case "priority":
          av = PRIORITY_OPTIONS.indexOf(a.priorityName as any);
          bv = PRIORITY_OPTIONS.indexOf(b.priorityName as any);
          break;
        case "assignees":
          av = a.assignments.map((x) => x.user.name).join(",");
          bv = b.assignments.map((x) => x.user.name).join(",");
          break;
      }
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

  const headers: { key: SortKey; label: string }[] = [
    { key: "title", label: "Task" },
    { key: "assignees", label: "Assignees" },
    { key: "priority", label: "Priority" },
    { key: "dueDate", label: "Due Date" },
  ];

  // — Modals
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editItem, setEditItem] = useState<TaskWithAssignments | null>(null);
  const [delItem, setDelItem] = useState<TaskWithAssignments | null>(null);

  // — Mutations
  const createTask = api.task.create.useMutation({
    onMutate(vars) {
    console.log("🤔 onMutate got:", vars);
  },
  onError(err, vars) {
    console.log("❌ onError, vars were:", vars);
  },
    onSuccess: () => {
      setBanner("Task created!");
      console.log("✅ create succeeded");
      refetchTasks();
    },
  });
  const updateTask = api.task.update.useMutation({
    onSuccess: () => {
      setBanner("Task updated!");
      refetchTasks();
    },
  });
  const deleteTask = api.task.delete.useMutation({
    onSuccess: () => {
      setBanner("Task deleted!");
      refetchTasks();
    },
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="container mx-auto px-6 py-8 space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Task Management</h1>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              resetFilters();
              refetchTasks();
            }}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition"
            title="Reset Filters"
          >
            <ArrowPathIcon className="h-6 w-6" />
          </button>
          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 border bg-white text-blue-600 hover:bg-blue-50 hover:scale-105 transition rounded-lg"
          >
            <PlusIcon className="h-6 w-6" />
            <span className="text-lg">Add Task</span>
          </button>
        </div>
      </div>

      {/* Banner */}
      <AnimatePresence>
        {banner && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="px-5 py-3 bg-green-100 border border-green-400 text-green-800 rounded-lg text-base"
          >
            {banner}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters */}
      <div className="relative bg-white shadow-lg rounded-xl p-6 pt-8">
        <div className="absolute -top-3 left-6 bg-white p-1 rounded-full">
          <FunnelIcon className="h-6 w-6 text-gray-500" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div>
            <label className="block text-base mb-1">Search</label>
            <input
              type="text"
              placeholder="Type to search…"
              value={filters.search}
              onChange={(e) => onFilter("search", e.target.value)}
              className="w-full h-11 px-3 border border-gray-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-base"
            />
          </div>
          {/* Assignees */}
          <div>
            <label className="block text-base mb-1">Assignees</label>
            <Combobox
              multiple
              value={filters.assigneeIds}
              onChange={(v) => onFilter("assigneeIds", v)}
            >
              <div className="relative">
                <Combobox.Button className="w-full h-11 flex items-center justify-between px-3 border border-gray-300 bg-white rounded-lg">
                  <span className="text-base text-gray-700">
                    {filters.assigneeIds.length
                      ? filters.assigneeIds
                          .map((id) => assignees.find((u) => u.id === id)?.name)
                          .join(", ")
                      : "All assignees"}
                  </span>
                  <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                </Combobox.Button>
                <Combobox.Options className="absolute mt-1 w-full bg-white border border-gray-300 rounded-lg max-h-48 overflow-auto z-10">
                  {assignees.map((u) => (
                    <Combobox.Option
                      key={u.id}
                      value={u.id}
                      className={({ active, selected }) =>
                        `cursor-pointer px-3 py-2 text-base ${
                          active ? "bg-blue-50" : ""
                        } ${
                          selected
                            ? "font-semibold text-blue-600"
                            : "text-gray-700"
                        }`
                      }
                    >
                      {u.name}
                    </Combobox.Option>
                  ))}
                </Combobox.Options>
              </div>
            </Combobox>
          </div>
          {/* Priority */}
          <div>
            <label className="block text-base mb-1">Priority</label>
            <div className="relative">
              <select
                value={filters.priority}
                onChange={(e) => onFilter("priority", e.target.value)}
                className="w-full h-11 pl-3 pr-10 border border-gray-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-base"
              >
                <option value="">All priorities</option>
                {PRIORITY_OPTIONS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              <ChevronDownIcon className="h-5 w-5 absolute top-1/2 right-3 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          {/* Start Date */}
          <div>
            <label className="block text-base mb-1">Start Date</label>
            <input
              type="date"
              value={filters.start}
              onChange={(e) => onFilter("start", e.target.value)}
              className="w-full h-11 px-3 border border-gray-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-base"
            />
          </div>
          {/* End Date */}
          <div>
            <label className="block text-base mb-1">End Date</label>
            <input
              type="date"
              value={filters.end}
              onChange={(e) => onFilter("end", e.target.value)}
              className="w-full h-11 px-3 border border-gray-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-base"
            />
          </div>
        </div>
      </div>

      {/* Table */}
    <div className="bg-white shadow-lg rounded-xl">
      <div className="overflow-x-auto">
        <table className="min-w-full whitespace-nowrap">
<thead className="bg-gray-100">
  <tr>
    {/* the first 3 headers: Task, Assignees, Priority */}
    {headers.slice(0, 3).map(({ key, label }) => (
      <th key={key} className="px-6 py-4 text-left text-base font-medium text-gray-700 cursor-pointer select-none" onClick={() => toggleSort(key)}>
        <div className="inline-flex items-center space-x-1">
          <span>{label}</span>
          {sortKey === key
            ? (sortDir === "asc" ? <ArrowUpIcon className="h-4 w-4 text-gray-600"/> : <ArrowDownIcon className="h-4 w-4 text-gray-600"/>)
            : <ChevronDownIcon className="h-4 w-4 text-gray-400 opacity-50"/>}
        </div>
      </th>
    ))}

    <th className="px-6 py-4 text-left text-base font-medium text-gray-700">
      Start Date
    </th>

    {headers.slice(3, 4).map(({ key, label }) => (
      <th key={key} className="px-6 py-4 text-left text-base font-medium text-gray-700 cursor-pointer select-none" onClick={() => toggleSort(key)}>
        <div className="inline-flex items-center space-x-1">
          <span>{label}</span>
          {sortKey === key
            ? (sortDir === "asc" ? <ArrowUpIcon className="h-4 w-4 text-gray-600"/> : <ArrowDownIcon className="h-4 w-4 text-gray-600"/>)
            : <ChevronDownIcon className="h-4 w-4 text-gray-400 opacity-50"/>}
        </div>
      </th>
    ))}

    {/* Actions */}
    <th className="px-6 py-4 text-left text-base font-medium text-gray-700">
      Actions
    </th>
  </tr>
</thead>

          <tbody>
            {visible.map((t) => (
              <Fragment key={t.id}>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-base text-gray-800">
                    {t.title}
                  </td>
                  <td className="px-6 py-4 text-base text-gray-800">
                    {t.assignments.map((a) => a.user.name).join(", ")}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
                        PRIORITY_COLORS[t.priorityName as any]
                      }`}
                    >
                      {t.priorityName}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-base text-gray-800">
                    {t.startDate
                      ? new Date(t.startDate).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="px-6 py-4 text-base text-gray-800">
                    {t.endDate
                      ? new Date(t.endDate).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="px-6 py-4 flex items-center space-x-3">
                    <motion.button
                      onClick={() => setEditItem(t)}
                      className="p-1 text-blue-600 hover:text-blue-800 rounded transition"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </motion.button>
                    <motion.button
                      onClick={() => setDelItem(t)}
                      className="p-1 text-red-600 hover:text-red-800 rounded transition"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </motion.button>
                    <motion.button
                      onClick={() =>
                        setOpenDesc((o) => ({ ...o, [t.id]: !o[t.id] }))
                      }
                      className="p-1 text-gray-600 hover:text-gray-800 rounded transition"
                    >
                      {openDesc[t.id] ? (
                        <EyeSlashIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </motion.button>
                  </td>
                </tr>

                <AnimatePresence>
                  {openDesc[t.id] && (
                    <motion.tr
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-gray-50"
                    >
                      <td colSpan={5} className="px-6 py-4">
                        <motion.div
                          initial={{ scale: 0.95 }}
                          animate={{ scale: 1 }}
                          className="p-4 bg-white rounded-lg shadow-inner text-gray-700"
                        >
                          {t.description}
                        </motion.div>
                      </td>
                    </motion.tr>
                  )}
                </AnimatePresence>
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>

      {/* Modals */}
      <AnimatePresence>
        {isAddOpen && (
          <AddTaskModal
            isOpen
            onClose={() => setIsAddOpen(false)}
            assignees={assignees}
            priorities={PRIORITY_OPTIONS as string[]}
            onSubmit={async ({
              title,
              description,
              startDate,
              endDate,
              priority,
              assigneeIds,
            }) => {
            await createTask.mutateAsync({
                title,
                description,
                startDate,
                endDate,
                priority,
                assigneeIds,
              });
              setIsAddOpen(false);
            }}
          />
        )}
        {editItem && (
          <EditTaskModal
            key="edit"
            task={{
              id: editItem.id,
              title: editItem.title,
              description: editItem.description ?? "",
              dueDate: editItem.endDate
                ? new Date(editItem.endDate).toISOString().split("T")[0]
                : "",
              priority:
                PRIORITY_OPTIONS.indexOf(editItem.priorityName as any) + 1,
              assignments: editItem.assignments,
            }}
            isOpen
            onClose={() => setEditItem(null)}
            assignees={assignees}
            priorities={PRIORITY_OPTIONS as string[]}
            onSubmit={async ({
              id,
              title,
              description,
              dueDate,
              priority,
              assigneeIds,
            }) => {
              await updateTask.mutateAsync({
                id,
                title,
                description,
                dueDate,
                priority,
                assigneeIds,
              });
              setEditItem(null);
            }}
          />
        )}
        {delItem && (
          <DeleteTaskModal
            key="delete"
            task={{
              id: delItem.id,
              title: delItem.title,
              dueDate: delItem.endDate ?? "",
            }}
            isOpen
            onClose={() => setDelItem(null)}
            onConfirm={async (id) => {
              await deleteTask.mutateAsync({ id });
              setDelItem(null);
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
