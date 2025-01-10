import React, { useEffect, useState } from "react";
import classNames from "classnames";
import { InputSection } from "./InputSection";
import { TaskList } from "./TaskList";
import { FilterButtons } from "./FilterButtons";
import { applyFilter } from "../helpers/applyFilter";
import { Task } from "../types/types";
import "./Todos.scss";
import axios from "axios";

export const Todos: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [tasksContainerVisible, setTasksContainerVisible] =
    useState<boolean>(true);


  useEffect(() => {
    axios.get("http://localhost:8080/api/tasks").then((response) => {
      setTasks(response.data);
    });
  }, []);

  const addTask = (taskText: string): void => {
    if (taskText !== "") {
      axios.post("http://localhost:8080/api/addtask", {
        text: taskText
      }).then((response) => {
        setTasks([
          ...tasks,
          { id: response.data.id, text: taskText, completed: false },
        ]);
      });
    }
  };

  const toggleTaskCompletion = (taskId: number): void => {
    axios.put(`http://localhost:8080/api/toggle/${taskId}`).then(() => {
      const updatedTasks = tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      );
      setTasks(updatedTasks);
    });
  };

  const deleteTask = (taskId: number): void => {
    axios.delete(`http://localhost:8080/api/deletetask/${taskId}`).then(() => {
      const updatedTasks = tasks.filter((task) => task.id !== taskId);
      setTasks(updatedTasks);
    });
  };

  const clearCompletedTasks = (): void => {
    axios.delete("http://localhost:8080/api/clearcompleted").then(() => {
      const updatedTasks = tasks.filter((task) => !task.completed);
      setTasks(updatedTasks);
    });
  };

  const countActiveTasks = (): number => {
    return tasks.filter((task) => !task.completed).length;
  };

  const filteredTasks = applyFilter(tasks, filter);

  return (
    <div className="Todos">
      <h1 className="Todos__title">todos</h1>
      <div className="Todos__input-section">
        <InputSection
          onAddTask={addTask}
          onClick={setTasksContainerVisible}
          tasksContainerVisible={tasksContainerVisible}
        />

        <div
          className={classNames("Todos__tasks-container", {
            "Todos__tasks-container--hidden": !tasksContainerVisible,
          })}
        >
          <TaskList
            tasks={filteredTasks}
            onToggleCompletion={toggleTaskCompletion}
            onDeleteTask={deleteTask}
          />

          <div className="Todos__footer">
            <div>
              <p className="Todos__task-count">
                {countActiveTasks()} items left
              </p>
            </div>
            <FilterButtons filter={filter} setFilter={setFilter} />
            <button
              className="Todos__clear-button"
              onClick={clearCompletedTasks}
            >
              Clear Completed
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
