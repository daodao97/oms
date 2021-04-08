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

func RegCommonConfigRouter(r *gin.Engine) {
	ctrl := controller.CommonConfig{}

	r.POST("/common_config/create", func() func(ctx *gin.Context) {
		return func(ctx *gin.Context) {
			var params controller.CommonConfigForm
			errs := utils.Validated(ctx, &params)
			if errs != nil {
				egin.Fail(ctx, consts.ErrorParam, strings.Join(errs, "\n"))
				return
			}
			result, code, err := ctrl.Create(ctx, params)
			egin.Response(ctx, result, code, err)
		}
	}())

	r.POST("/common_config/update/:id", func() func(ctx *gin.Context) {
		return func(ctx *gin.Context) {
			var params controller.CommonConfigForm
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

	r.GET("/common_config/get/:id", func(ctx *gin.Context) {
		id, _ := strconv.Atoi(ctx.Param("id"))
		result, code, err := ctrl.Get(ctx, id)
		egin.Response(ctx, result, code, err)
	})

	r.DELETE("/common_config/delete/:id", func(ctx *gin.Context) {
		id, _ := strconv.Atoi(ctx.Param("id"))
		result, code, err := ctrl.Delete(ctx, id)
		egin.Response(ctx, result, code, err)
	})

	r.GET("/common_config/list", func() func(ctx *gin.Context) {
		return func(ctx *gin.Context) {
			var params controller.CommonConfigFilter
			errs := utils.Validated(ctx, &params)
			if errs != nil {
				egin.Fail(ctx, consts.ErrorParam, strings.Join(errs, "\n"))
				return
			}
			result, code, err := ctrl.List(ctx, params)
			egin.Response(ctx, result, code, err)
		}
	}(), middleware.IpLimiter())

	r.GET("/common_config/form_schema/:id", func(ctx *gin.Context) {
		id, _ := strconv.Atoi(ctx.Param("id"))
		result, code, err := ctrl.FromSchema(ctx, id)
		egin.Response(ctx, result, code, err)
	})

	r.GET("/common_config/form_value/:id", func(ctx *gin.Context) {
		id, _ := strconv.Atoi(ctx.Param("id"))
		result, code, err := ctrl.FormValue(ctx, id)
		egin.Response(ctx, result, code, err)
	})

	r.POST("/common_config/save_form/:id", func(ctx *gin.Context) {
		id, _ := strconv.Atoi(ctx.Param("id"))
		result, code, err := ctrl.SaveFrom(ctx, id)
		egin.Response(ctx, result, code, err)
	})

}
