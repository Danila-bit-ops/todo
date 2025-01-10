package model

type Task struct {
	ID        int    `json:"id"`
	Text      string `json:"text"`
	Completed bool   `json:"completed"`
}

type TaskList struct {
	Tasks []Task `json:"tasks"`
}
