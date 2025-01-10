import React, { FC, useState, ChangeEvent, KeyboardEvent } from "react";
import classNames from "classnames";
import "./InputSection.scss";
import { Arrow } from "../UI/Arrow";

interface Props {
  onAddTask: (taskText: string) => void;
  onClick: (visible: boolean) => void;
  tasksContainerVisible: boolean;
}

export const InputSection: FC<Props> = ({
  onAddTask,
  onClick,
  tasksContainerVisible,
}) => {
  const [inputValue, setInputValue] = useState<string>("");

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      onAddTask(inputValue.trim());
      setInputValue("");
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setInputValue(e.target.value);
  };

  const handleClick = (): void => {
    onClick(!tasksContainerVisible);
  };

  const handleAddTask = (): void => {
    onAddTask(inputValue.trim());
    setInputValue("");
  };

  return (
    <div className="TodoInput">
      <button className="TodoInput__toggle-button" onClick={handleClick}>
        <Arrow
          className={classNames("TodoInput__toggle-icon", {
            "TodoInput__toggle-icon--expanded": tasksContainerVisible,
          })}
        />
      </button>
      <input
        data-testid="todo-input"
        className="TodoInput__input"
        type="text"
        placeholder="What needs to be done?"
        value={inputValue}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
      />
      <button
        className="TodoInput__add-button button"
        onClick={() => handleAddTask()}
      >
        Add Task
      </button>
    </div>
  );
};
