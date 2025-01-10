package service

import "togolist/internal/model"

func (s *Service) GetAllTasks() ([]model.Task, error) {
	return s.repo.GetAllTasks()
}

func (s *Service) AddTask(task model.Task) (int, error) {
	return s.repo.AddTask(task)
}

func (s *Service) DeleteTask(id int) error {
	return s.repo.DeleteTask(id)
}

func (s *Service) ToggleTaskCompletion(id int) error {
	return s.repo.ToggleTaskCompletion(id)
}

func (s *Service) ClearCompletedTasks() error {
	return s.repo.ClearCompletedTasks()
}
