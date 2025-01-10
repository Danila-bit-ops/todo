package service

import "togolist/internal/pgx"

type Service struct {
	repo pgx.Repo
}

func NewService(repo pgx.Repo) *Service {
	return &Service{repo: repo}
}
