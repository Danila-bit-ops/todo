import React, { FC, useCallback } from "react";
import { TaskItem } from "./TaskItem";
import { Task } from "../types/types";
import "./TaskList.scss";

interface Props {
  tasks: Task[];
  onToggleCompletion: (taskId: number) => void;
  onDeleteTask: (taskId: number) => void;
}

export const TaskList: FC<Props> = ({
  tasks,
  onToggleCompletion,
  onDeleteTask,
}) => {
  const toggleCompletionHandler = useCallback(
    (taskId: number) => {
      onToggleCompletion(taskId);
    },
    [onToggleCompletion]
  );

  const deleteTaskHandler = useCallback(
    (taskId: number) => {
      onDeleteTask(taskId);
    },
    [onDeleteTask]
  );

  return (
    <ul className="TaskList">
      {tasks.length === 0 ? (
        <li className="TaskList__empty">No items</li>
      ) : (
        tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggleCompletion={toggleCompletionHandler}
            onDeleteTask={deleteTaskHandler}
          />
        ))
      )}
    </ul>
  );
};
