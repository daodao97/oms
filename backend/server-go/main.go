package main

import (
	"github.com/daodao97/egin/egin"
	"github.com/daodao97/egin/egin/middleware"
	"github.com/gin-gonic/gin"

	"oms/config"
	omsMidd "oms/service/middleware"
	"oms/service/user"
)

// config/*** 存放启动时配置, 如路由, 中间件
// app.json 存放运行时配置, 如 db/redis 配置, 由 egin/config 持有
//go:generate /Users/mac/go/src/github.com/daodao97/egin/egin-tools/egin-tools -route
//go:generate goimports -w config
func main() {
	boot := egin.Bootstrap{
		HttpMiddlewares: []func() gin.HandlerFunc{
			middleware.Cors,
			func() gin.HandlerFunc {
				return omsMidd.Auth(user.New())
			},
			middleware.IPAuth,
			middleware.IpLimiter,
			middleware.HttpLog,
			middleware.Prometheus,
		},
		RegRoutes: config.RegRouter,
	}
	boot.Start()
}
