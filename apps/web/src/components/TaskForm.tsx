import { useState } from "react";
import { trpc } from "../utils/api";

export function TaskForm() {
  const [title, setTitle] = useState("");
  const create = trpc.task.create.useMutation();
  return (
    <form
      className="space-y-2"
      onSubmit={async e => {
        e.preventDefault();
        await create.mutateAsync({ title, priority: 2 });
        setTitle("");
      }}
    >
      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        className="w-full border px-3 py-2 rounded"
        placeholder="Task title"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Add Task
      </button>
    </form>
  );
}
