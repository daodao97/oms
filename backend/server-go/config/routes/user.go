// ****************************
// 该文件为系统生成, 请勿更改
// ****************************
package routes

import (
	"strconv"
	"strings"

	"github.com/daodao97/egin"
	"github.com/daodao97/egin/consts"
	"github.com/daodao97/egin/middleware"
	"github.com/daodao97/egin/utils"
	"github.com/gin-gonic/gin"

	"oms/controller"
)

func RegUserRouter(r *gin.Engine) {
	ctrl := controller.User{}

	r.POST("/user/login", func() func(ctx *gin.Context) {
		return func(ctx *gin.Context) {
			var params controller.UserLogin
			errs := utils.Validated(ctx, &params)
			if errs != nil {
				egin.Fail(ctx, consts.ErrorParam, strings.Join(errs, "\n"))
				return
			}
			result, code, err := ctrl.Login(ctx, params)
			egin.Response(ctx, result, code, err)
		}
	}())

	r.POST("/user/logout", func(ctx *gin.Context) {
		result, code, err := ctrl.Logout(ctx)
		egin.Response(ctx, result, code, err)
	})

	r.POST("/user/offline/:id", func(ctx *gin.Context) {
		id, _ := strconv.Atoi(ctx.Param("id"))
		result, code, err := ctrl.Offline(ctx, id)
		egin.Response(ctx, result, code, err)
	})

	r.GET("/user/info", func(ctx *gin.Context) {
		result, code, err := ctrl.Info(ctx)
		egin.Response(ctx, result, code, err)
	})

	r.GET("/user/routes", func(ctx *gin.Context) {
		result, code, err := ctrl.Routes(ctx)
		egin.Response(ctx, result, code, err)
	})

	r.POST("/user/create", func() func(ctx *gin.Context) {
		return func(ctx *gin.Context) {
			var params controller.UserForm
			errs := utils.Validated(ctx, &params)
			if errs != nil {
				egin.Fail(ctx, consts.ErrorParam, strings.Join(errs, "\n"))
				return
			}
			result, code, err := ctrl.Post(ctx, params)
			egin.Response(ctx, result, code, err)
		}
	}())

	r.POST("/user/update/:id", func() func(ctx *gin.Context) {
		return func(ctx *gin.Context) {
			var params controller.UserForm
			errs := utils.Validated(ctx, &params)
			if errs != nil {
				egin.Fail(ctx, consts.ErrorParam, strings.Join(errs, "\n"))
				return
			}

			id, _ := strconv.Atoi(ctx.Param("id"))

			result, code, err := ctrl.Update(ctx, id, params)
			egin.Response(ctx, result, code, err)
		}
	}())

	r.DELETE("/user/delete/:id", func(ctx *gin.Context) {
		id, _ := strconv.Atoi(ctx.Param("id"))
		result, code, err := ctrl.Delete(ctx, id)
		egin.Response(ctx, result, code, err)
	})

	r.GET("/user/get/:id", func(ctx *gin.Context) {
		id, _ := strconv.Atoi(ctx.Param("id"))
		result, code, err := ctrl.Get(ctx, id)
		egin.Response(ctx, result, code, err)
	}, middleware.IpLimiter())

	r.GET("/user/list", func() func(ctx *gin.Context) {
		return func(ctx *gin.Context) {
			var params controller.UserFilter
			errs := utils.Validated(ctx, &params)
			if errs != nil {
				egin.Fail(ctx, consts.ErrorParam, strings.Join(errs, "\n"))
				return
			}
			result, code, err := ctrl.List(ctx, params)
			egin.Response(ctx, result, code, err)
		}
	}())

}
