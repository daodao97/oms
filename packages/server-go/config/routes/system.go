// ****************************
// 该文件为系统生成, 请勿更改
// ****************************
package routes

import (
	"github.com/daodao97/egin"
	"github.com/gin-gonic/gin"

	"oms/controller"
)

func RegSystemRouter(r *gin.Engine) {
	ctrl := controller.System{}

	r.GET("/system/config", func(ctx *gin.Context) {
		result, code, err := ctrl.Config(ctx)
		egin.Response(ctx, result, code, err)
	})

	r.POST("/upload", func(ctx *gin.Context) {
		result, code, err := ctrl.Upload(ctx)
		egin.Response(ctx, result, code, err)
	})

	r.Any("/proxy/*path", func(ctx *gin.Context) {
		result, code, err := ctrl.Proxy(ctx)
		egin.Response(ctx, result, code, err)
	})

}
