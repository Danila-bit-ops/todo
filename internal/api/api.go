package api

import (
	"net/http"
	"strconv"
	"togolist/internal/model"
	"togolist/internal/service"
	"togolist/pkg"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

type api struct {
	srv *service.Service
}

func InitApi(srv *service.Service) *api {
	return &api{
		srv: srv,
	}
}

func (a *api) InitHandlers(r *gin.Engine) {
	// cmdDir, err := filepath.Abs(filepath.Dir("./cmd"))
	// if err != nil {
	// 	log.Fatalf("failed to get cmd dir: %v", err)
	// }
	// assetsDir := filepath.Join(cmdDir, "..", "assets")
	// r.LoadHTMLGlob(filepath.Join(assetsDir, "public/*.html"))

	apiGroup := r.Group("/api")
	{
		apiGroup.GET("/tasks", a.GetAllTasks)
		apiGroup.POST("/addtask", a.AddTask)
		apiGroup.DELETE("/deletetask/:id", a.DeleteTask)
		apiGroup.PUT("/toggle/:id", a.ToggleTaskCompletion)
		apiGroup.DELETE("/clearcompleted", a.ClearCompletedTasks)
	}
}

func (a *api) InitRouter() *gin.Engine {
	router := gin.Default()
	a.InitHandlers(router)
	return router
}

func (a *api) RegisterUser(c *gin.Context) {
	var user model.User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}
	user.Password = string(hashedPassword)

	if err := a.srv.RegisterUser(c.Request.Context(), user); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.Status(http.StatusNoContent)
}

func (a *api) LoginUser(c *gin.Context) {
	var input model.LoginInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user, err := a.srv.GetUserByEmail(c.Request.Context(), input.Email)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Неверный email или пароль"})
		return
	}

	// Сравнение хешированного пароля
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Неверный email или пароль"})
		return
	}

	// Генерация JWT
	token, err := pkg.GenerateToken(user.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Ошибка при генерации токена"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"token": token})
}

func (a *api) GetAllTasks(c *gin.Context) {
	tasks, err := a.srv.GetAllTasks()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, tasks)
}

func (a *api) AddTask(c *gin.Context) {
	var task model.Task
	if err := c.ShouldBindJSON(&task); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	id, err := a.srv.AddTask(task)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"id": id})
}

func (a *api) DeleteTask(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid task ID"})
		return
	}
	err = a.srv.DeleteTask(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.Status(http.StatusNoContent)
}

func (a *api) ToggleTaskCompletion(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid task ID"})
		return
	}
	err = a.srv.ToggleTaskCompletion(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.Status(http.StatusNoContent)
}

func (a *api) ClearCompletedTasks(c *gin.Context) {
	err := a.srv.ClearCompletedTasks()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.Status(http.StatusNoContent)
}
