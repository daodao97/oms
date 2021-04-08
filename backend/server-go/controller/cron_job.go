package controller

import (
	"github.com/daodao97/egin/egin/consts"
	"github.com/daodao97/egin/egin/db"
	"github.com/daodao97/egin/egin/lib"
	"github.com/gin-gonic/gin"

	"oms/model"
	"oms/service/scaffold"
)

// @Controller 任务管理 这里是简介
type CronJob struct {
	scaffold.BaseController
}

type CronJobFilter struct {
	Id     int    `form:"id"`
	Name   string `form:"name"`
	Status int    `form:"status"`
}

type CronJobForm struct {
	Id        int                    `json:"id"`
	Name      string                 `json:"name" comment:"任务明"`
	Title     string                 `json:"title" comment:"可读任务名"`
	Rule      string                 `json:"rule" comment:"运行规则"`
	Config    interface{}            `json:"config" comment:"任务配置"`
	AlertRule []interface{}          `json:"alert_rule" comment:"报警规则"`
	Type      int                    `json:"type" comment:"任务类型, 0 本地方法, 1 shell, 2 接口调用"`
	BindNodes string                 `json:"bind_nodes" comment:"绑定的执行节点"`
	db.StatusColumn
}

type ResponseCronJobList struct {
	model.CronJobEntity
}

// @PostApi /cron_job/create 若无默认为全小写的方法名
// @Summary 创建任务
// @Desc 这个接口支持你创建一个任务 维护者: 刀刀
// @Params CronJobForm 接口参数所对应的结构体
// @Response
func (ctrl CronJob) Post(c *gin.Context, params CronJobForm) (interface{}, consts.ErrCode, error) {
	var paramsMap db.Record = lib.StructToMap(params)
	return ctrl.BaseController.CreateRecord(ctrl.getModel(), paramsMap)
}

// @PostApi /cron_job/update/:id
// @Summary 更新任务信息
// @Desc 维护者: 刀刀
// @Params CronJobForm 接口参数所对应的结构体
// @Response
func (ctrl CronJob) Update(c *gin.Context, id int, params CronJobForm) (interface{}, consts.ErrCode, error) {
	var paramsMap db.Record = lib.StructToMap(params)
	return ctrl.BaseController.UpdateById(ctrl.getModel(), id, paramsMap)
}

// @DeleteApi /cron_job/delete/:id
// @Summary 删除任务
// @Desc 维护者: 刀刀
// @Response
func (ctrl CronJob) Delete(c *gin.Context, id int) (interface{}, consts.ErrCode, error) {
	return ctrl.BaseController.DeleteRecord(ctrl.getModel(), id)
}

// @GetApi /cron_job/get/:id 若无默认为全小写的方法名
// @Summary 任务列表接口
// @Desc 接口简介, 若无则为空 维护者: 刀刀
// @Params CronJobFilter 接口参数所对应的结构体
// @Response
// @Middleware IpLimiter
func (ctrl CronJob) Get(c *gin.Context, id int) (interface{}, consts.ErrCode, error) {
	return ctrl.BaseController.GetById(ctrl.getModel(), id, []string{"id", "name", "title", "type", "rule", "alert_rule", "bind_nodes", "config", "status"})
}

// @GetApi /cron_job/list 列表接口
func (ctrl CronJob) List(c *gin.Context, params CronJobFilter) (interface{}, consts.ErrCode, error) {
	filter := db.Filter{}
	if params.Id != 0 {
		filter["id"] = params.Id
	}
	_, exists := c.Request.Form["status"]
	if exists {
		filter["status"] = params.Status
	}
	return ctrl.BaseController.ListRecord(c, ctrl.getModel(), filter, []string{"id", "name", "title", "type", "rule", "alert_rule", "bind_nodes", "config", "status"})
}

func (ctrl CronJob) getModel() db.Model {
	return model.CronJob
}
