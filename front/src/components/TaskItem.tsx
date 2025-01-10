import React, { FC } from "react";
import { Task } from "../types/types";
import "./TaskItem.scss";

interface Props {
  task: Task;
  onToggleCompletion: (taskId: number) => void;
  onDeleteTask: (taskId: number) => void;
}

export const TaskItem: FC<Props> = ({
  task,
  onToggleCompletion,
  onDeleteTask,
}) => {
  return (
    <li className="TaskItem">
      <input
        id={task.id.toString()} // Приведено к строке, так как id должен быть строкой
        className="TaskItem__checkbox"
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggleCompletion(task.id)}
      />
      <label htmlFor={task.id.toString()} className="TaskItem__label">
        {task.text}
      </label>
      <button
        className="TaskItem__delete-button button"
        onClick={() => onDeleteTask(task.id)}
      >
        Delete
      </button>
    </li>
  );
};
