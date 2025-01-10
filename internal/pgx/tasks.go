package pgx

import (
	"context"
	"togolist/internal/model"
)

func (r *Repo) GetAllTasks() ([]model.Task, error) {
	var tasks []model.Task
	rows, err := r.pool.Query(context.Background(), "SELECT * FROM todo")
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		var task model.Task
		err := rows.Scan(&task.ID, &task.Text, &task.Completed)
		if err != nil {
			return nil, err
		}
		tasks = append(tasks, task)
	}
	return tasks, nil
}

func (r *Repo) AddTask(task model.Task) (int, error) {
	var (
		id int
	)
	err := r.pool.QueryRow(context.Background(), "INSERT INTO todo (text, completed) VALUES ($1, $2) RETURNING id", task.Text, task.Completed).Scan(&id)
	return id, err
}

func (r *Repo) DeleteTask(id int) error {
	_, err := r.pool.Exec(context.Background(), "DELETE FROM todo WHERE id = $1", id)
	return err
}

func (r *Repo) ToggleTaskCompletion(id int) error {
	_, err := r.pool.Exec(context.Background(), "UPDATE todo SET completed = NOT completed WHERE id = $1", id)
	return err
}

func (r *Repo) ClearCompletedTasks() error {
	_, err := r.pool.Exec(context.Background(), "DELETE FROM todo WHERE completed = true")
	return err
}
