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

func RegFrontRouteRouter(r *gin.Engine) {
	ctrl := controller.FrontRoute{}

	r.GET("/front_route/list", func() func(ctx *gin.Context) {
		return func(ctx *gin.Context) {
			var params controller.FrontRouteFilter
			errs := utils.Validated(ctx, &params)
			if errs != nil {
				egin.Fail(ctx, consts.ErrorParam, strings.Join(errs, "\n"))
				return
			}
			result, code, err := ctrl.List(ctx, params)
			egin.Response(ctx, result, code, err)
		}
	}())

	r.GET("/front_route/get/:id", func(ctx *gin.Context) {
		id, _ := strconv.Atoi(ctx.Param("id"))
		result, code, err := ctrl.Get(ctx, id)
		egin.Response(ctx, result, code, err)
	}, middleware.IpLimiter())

	r.POST("/front_route/create", func() func(ctx *gin.Context) {
		return func(ctx *gin.Context) {
			var params controller.FrontRouteForm
			errs := utils.Validated(ctx, &params)
			if errs != nil {
				egin.Fail(ctx, consts.ErrorParam, strings.Join(errs, "\n"))
				return
			}
			result, code, err := ctrl.Post(ctx, params)
			egin.Response(ctx, result, code, err)
		}
	}())

	r.POST("/front_route/update/:id", func() func(ctx *gin.Context) {
		return func(ctx *gin.Context) {
			var params controller.FrontRouteForm
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

	r.DELETE("/front_route/delete:id", func(ctx *gin.Context) {
		id, _ := strconv.Atoi(ctx.Param("id"))
		result, code, err := ctrl.Delete(ctx, id)
		egin.Response(ctx, result, code, err)
	})

	r.GET("/front_route/tree", func(ctx *gin.Context) {
		result, code, err := ctrl.Tree(ctx)
		egin.Response(ctx, result, code, err)
	})

}
