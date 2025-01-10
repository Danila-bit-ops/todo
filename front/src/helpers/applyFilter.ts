import { Task } from "../types/types";

export const applyFilter = (tasks: Task[], filter: string): Task[] => {
  return tasks.filter((task) => {
    if (filter === "all") {
      return true;
    } else if (filter === "active") {
      return !task.completed;
    } else if (filter === "completed") {
      return task.completed;
    }
    return true;
  });
};
