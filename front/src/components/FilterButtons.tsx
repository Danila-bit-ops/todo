import React, { FC, useCallback } from "react";
import classNames from "classnames";
import "./FilterButtons.scss";

interface Props {
  filter: string;
  setFilter: (filter: string) => void;
}

export const FilterButtons: FC<Props> = ({ filter, setFilter }) => {
  const setFilterHandler = useCallback(
    (selectedFilter: string) => {
      setFilter(selectedFilter);
    },
    [setFilter]
  );

  return (
    <div>
      <button
        className={classNames("FilterButton", {
          "FilterButton--active": filter === "all",
        })}
        onClick={() => setFilterHandler("all")}
      >
        All
      </button>
      <button
        className={classNames("FilterButton", {
          "FilterButton--active": filter === "active",
        })}
        onClick={() => setFilterHandler("active")}
      >
        Active
      </button>
      <button
        className={classNames("FilterButton", {
          "FilterButton--active": filter === "completed",
        })}
        onClick={() => setFilterHandler("completed")}
      >
        Completed
      </button>
    </div>
  );
};
