package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"time"

	"github.com/gin-gonic/gin"

	"oms/cron_center/alert"
	"oms/cron_center/manager"
	"oms/cron_center/ws"
)

func main() {
	go ws.WebsocketManager.Start()
	go ws.WebsocketManager.SendService()
	go ws.WebsocketManager.SendGroupService()
	go ws.WebsocketManager.SendAllService()

	router := gin.Default()
	router.Use(gin.Recovery())
	router.GET("/", func(c *gin.Context) {
		c.String(http.StatusOK, "Welcome Cron Center")
	})
	router.GET("/state", func(c *gin.Context) {
		c.JSON(http.StatusOK, ws.WebsocketManager.Info())
	})

	// 开始脚本任务调度
	go manager.Running(&ws.WebsocketManager)

	go alert.Monitor()

	wsGroup := router.Group("/ws")
	{
		wsGroup.GET("/:channel", ws.WebsocketManager.WsClient)
	}

	srv := &http.Server{
		Addr:    ":8081",
		Handler: router,
	}

	err := router.Run(":8081")
	if err != nil {
		return
	}

	go func() {
		// 服务连接
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Server Start Error: %s\n", err)
		}
	}()

	// 等待中断信号以优雅地关闭服务器（设置 5 秒的超时时间）
	quit := make(chan os.Signal)
	signal.Notify(quit, os.Interrupt)
	<-quit

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := srv.Shutdown(ctx); err != nil {
		log.Fatal("Server Shutdown Error:", err)
	}
	log.Println("Server Shutdown")
}
