package pgx

import (
	"context"
	"database/sql"
	"fmt"
	"togolist/internal/model"
)

func (r *Repo) RegisterUser(ctx context.Context, user model.User) error {
	const checkUniqueUser = "SELECT COUNT(*) FROM users WHERE username = $1 OR email = $2"
	var count int
	err := r.pool.QueryRow(ctx, checkUniqueUser, user.Username, user.Email).Scan(&count)
	if err != nil {
		return err
	}
	if count > 0 {
		return fmt.Errorf("пользователь с таким логином или email уже существует")
	}

	const q = "INSERT INTO users (username, email, password) VALUES ($1, $2, $3)"
	_, err = r.pool.Exec(ctx, q, user.Username, user.Email, user.Password)
	return err
}

func (r *Repo) GetUserByEmail(ctx context.Context, email string) (*model.User, error) {
	var user model.User
	const q = "SELECT id, username, email, password FROM users WHERE email = $1"
	row := r.pool.QueryRow(ctx, q, email)
	if err := row.Scan(&user.ID, &user.Username, &user.Email, &user.Password); err != nil {
		if err != sql.ErrNoRows {
			return nil, fmt.Errorf("пользователь с таким email не найден")
		}
		return nil, fmt.Errorf("ошибка при получении пользователя: %v", err)
	}
	return &user, nil
}
