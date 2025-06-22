import React, { useMemo } from "react";
import { api } from "../utils/api";
import Chart from "../components/Chart";
import CountUp from "react-countup";
import {
  CheckCircleIcon,
  ClockIcon,
  Squares2X2Icon,
  UsersIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/solid";

export default function Dashboard() {
  const { data: tasks = [], isLoading: tasksLoading } = api.task.getAll.useQuery();
  const { data: users = [], isLoading: usersLoading } = api.user.list.useQuery();

  const teamLoad = useMemo(
    () =>
      users.map((u) => ({
        name:     u.name,
        assigned: tasks.filter((t) =>
          t.assignments.some((a) => a.user.id === u.id)
        ).length,
      })),
    [tasks, users]
  );
  const busiest = useMemo(
    () => teamLoad.slice().sort((a, b) => b.assigned - a.assigned)[0]?.name ?? "—",
    [teamLoad]
  );

  const loading = tasksLoading || usersLoading;
  if (loading) return <div className="p-8 text-center">Loading dashboard…</div>;

  // 3) stats
  const now = new Date();
  const in7 = new Date();
  in7.setDate(now.getDate() + 7);

  const totalTasks       = tasks.length;
  const completedTasks   = tasks.filter((t) => t.priorityName === "Complete").length;
  const upcomingDeadlines= tasks.filter((t) => {
    if (!t.dueDate) return false;
    const d = new Date(t.dueDate);
    return d >= now && d <= in7;
  }).length;

  // 4) Upcoming tasks list (next 5)
  const upcomingTasks = tasks
    .filter((t) => t.dueDate)
    .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
    .slice(0, 5)
    .map((t) => ({
      id:    t.id,
      title: t.title,
      due:   new Date(t.dueDate!).toLocaleDateString(),
    }));

  // 5) Recent tasks (last 5 created)
  const recentTasks = [...tasks]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)
    .map((t) => ({
      id:    t.id,
      title: t.title,
      due:   t.dueDate ? new Date(t.dueDate).toLocaleDateString() : "—",
    }));

  // 6) Chart data: tasks completed per day over last 7 days
  const last7 = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(now.getDate() - (6 - i));
    return d;
  });
  const chartLabels = last7.map((d) => d.toLocaleDateString());
  const chartData   = last7.map((day) =>
    tasks.filter(
      (t) =>
        t.priorityName === "Complete" &&
        new Date(t.updatedAt).toDateString() === day.toDateString()
    ).length
  );

  return (
    <div className="space-y-10 px-8 py-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {[
          {
            label: "Tasks",
            value: totalTasks,
            icon:  <Squares2X2Icon className="h-6 w-6 text-indigo-600" />,
            bg:    "bg-indigo-50",
          },
          {
            label: "Completed",
            value: completedTasks,
            icon:  <CheckCircleIcon className="h-6 w-6 text-green-600" />,
            bg:    "bg-green-50",
          },
          {
            label: "Upcoming",
            value: upcomingDeadlines,
            icon:  <ClockIcon className="h-6 w-6 text-yellow-600" />,
            bg:    "bg-yellow-50",
          },
        ].map(({ label, value, icon, bg }) => (
          <div key={label} className={`${bg} rounded-xl p-6 flex items-center space-x-4 shadow`}>
            <div className="p-3 bg-white rounded-full">{icon}</div>
            <div>
              <p className="text-2xl font-semibold">
                <CountUp end={value} duration={1.2} />
              </p>
              <p className="text-sm text-gray-600">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Timeline & Team load */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-medium mb-4 flex items-center">
            <CalendarDaysIcon className="h-5 w-5 mr-2 text-indigo-600" />
            Completed This Week
          </h2>
          <Chart labels={chartLabels} data={chartData} />
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-medium mb-4 flex items-center">
            <UsersIcon className="h-5 w-5 mr-2 text-green-600" />
            Team Workload
          </h2>
          <ul className="space-y-3">
            {teamLoad.map((m) => (
              <li key={m.name} className="flex justify-between text-gray-700">
                <span>{m.name}</span>
                <span className="font-semibold">{m.assigned}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-gray-500">
            Busiest: <strong>{busiest}</strong>
          </p>
        </div>
      </div>

      {/* Upcoming Deadlines */}
      <div className="bg-white rounded-xl shadow p-6 space-y-4">
        <h2 className="text-xl font-medium flex items-center">
          <ClockIcon className="h-5 w-5 mr-2 text-yellow-600" />
          Upcoming Deadlines
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="border-b">
              <tr>
                <th className="py-2 px-4 text-gray-600">Task</th>
                <th className="py-2 px-4 text-gray-600">Due Date</th>
              </tr>
            </thead>
            <tbody>
              {upcomingTasks.map((t) => (
                <tr key={t.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{t.title}</td>
                  <td className="py-3 px-4 text-gray-500">{t.due}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
