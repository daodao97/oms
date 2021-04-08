// ****************************
// 该文件为系统生成, 请勿更改
// ****************************
package routes

import (
	"strconv"
	"strings"

	"github.com/daodao97/egin/egin"
	"github.com/daodao97/egin/egin/consts"
	"github.com/daodao97/egin/egin/middleware"
	"github.com/daodao97/egin/egin/utils"
	"github.com/gin-gonic/gin"

	"oms/controller"
)

func RegRoleRouter(r *gin.Engine) {
	ctrl := controller.Role{}

	r.GET("/role/list", func() func(ctx *gin.Context) {
		return func(ctx *gin.Context) {
			var params controller.RoleFilter
			errs := utils.Validated(ctx, &params)
			if errs != nil {
				egin.Fail(ctx, consts.ErrorParam, strings.Join(errs, "\n"))
				return
			}
			result, code, err := ctrl.List(ctx, params)
			egin.Response(ctx, result, code, err)
		}
	}())

	r.GET("/role/get/:id", func(ctx *gin.Context) {
		id, _ := strconv.Atoi(ctx.Param("id"))
		result, code, err := ctrl.Get(ctx, id)
		egin.Response(ctx, result, code, err)
	}, middleware.IpLimiter())

	r.POST("/role/create", func() func(ctx *gin.Context) {
		return func(ctx *gin.Context) {
			var params controller.RoleForm
			errs := utils.Validated(ctx, &params)
			if errs != nil {
				egin.Fail(ctx, consts.ErrorParam, strings.Join(errs, "\n"))
				return
			}
			result, code, err := ctrl.Create(ctx, params)
			egin.Response(ctx, result, code, err)
		}
	}())

	r.POST("/role/update/:id", func() func(ctx *gin.Context) {
		return func(ctx *gin.Context) {
			var params controller.RoleUpdate
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

	r.DELETE("/role/delete/:id", func(ctx *gin.Context) {
		id, _ := strconv.Atoi(ctx.Param("id"))
		result, code, err := ctrl.Delete(ctx, id)
		egin.Response(ctx, result, code, err)
	})

	r.GET("/role/tree", func(ctx *gin.Context) {
		result, code, err := ctrl.Tree(ctx)
		egin.Response(ctx, result, code, err)
	})

	r.GET("/role/resource", func(ctx *gin.Context) {
		result, code, err := ctrl.Resource(ctx)
		egin.Response(ctx, result, code, err)
	})

}
