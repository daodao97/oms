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

func RegCronJobRouter(r *gin.Engine) {
	ctrl := controller.CronJob{}

	r.POST("/cron_job/create", func() func(ctx *gin.Context) {
		return func(ctx *gin.Context) {
			var params controller.CronJobForm
			errs := utils.Validated(ctx, &params)
			if errs != nil {
				egin.Fail(ctx, consts.ErrorParam, strings.Join(errs, "\n"))
				return
			}
			result, code, err := ctrl.Post(ctx, params)
			egin.Response(ctx, result, code, err)
		}
	}())

	r.POST("/cron_job/update/:id", func() func(ctx *gin.Context) {
		return func(ctx *gin.Context) {
			var params controller.CronJobForm
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

	r.DELETE("/cron_job/delete/:id", func(ctx *gin.Context) {
		id, _ := strconv.Atoi(ctx.Param("id"))
		result, code, err := ctrl.Delete(ctx, id)
		egin.Response(ctx, result, code, err)
	})

	r.GET("/cron_job/get/:id", func(ctx *gin.Context) {
		id, _ := strconv.Atoi(ctx.Param("id"))
		result, code, err := ctrl.Get(ctx, id)
		egin.Response(ctx, result, code, err)
	}, middleware.IpLimiter())

	r.GET("/cron_job/list", func() func(ctx *gin.Context) {
		return func(ctx *gin.Context) {
			var params controller.CronJobFilter
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
