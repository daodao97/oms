package controller

import (
	"github.com/daodao97/egin/consts"
	"github.com/daodao97/egin/db"
	"github.com/daodao97/egin/lib"
	userInstance "github.com/daodao97/egin/service/user"
	"github.com/gin-gonic/gin"

	"oms/model"
	"oms/service/menu"
	"oms/service/scaffold"
)

// @Controller
type FrontRoute struct {
	scaffold.BaseController
}

type FrontRouteFilter struct {
	Pid    int    `form:"pid"`
	Status int    `form:"status"`
	Name   string `form:"name"`
	Module string `form:"tab"`
}

type RoutesList struct {
	model.FrontRouteEntity
	Children    []interface{} `json:"children"`
	HasChildren bool          `json:"hasChildren"`
}

type routeListResponse struct {
	List          []RoutesList `json:"list"`
	scaffold.Page `json:"page"`
}

// @GetApi /front_route/list
func (ctrl FrontRoute) List(c *gin.Context, params FrontRouteFilter) (interface{}, consts.ErrCode, error) {
	filter := db.Filter{}
	filter["pid"] = params.Pid
	filter["module_id"] = params.Module
	_, exists := c.Request.Form["status"]
	if exists {
		filter["status"] = params.Status
	}
	list, code, err := ctrl.BaseController.ListRecord(c, ctrl.getModel(), filter, []string{"id", "name", "path", "icon", "sort", "status", "type", "page_type", "view"})
	var response routeListResponse
	lib.BindToStruct(list, &response)

	for i, v := range response.List {
		response.List[i].Children = make([]interface{}, 0)
		response.List[i].HasChildren = v.Type != 3
	}

	return response, code, err
}

// @GetApi /front_route/get/:id
// @Summary 列表接口
// @Desc 列表接口 维护者: 刀刀
// @Params FrontRouteFilter
// @Response
// @Middleware IpLimiter
func (ctrl FrontRoute) Get(c *gin.Context, id int) (interface{}, consts.ErrCode, error) {
	return ctrl.BaseController.GetById(ctrl.getModel(), id, []string{"id", "name", "module_id", "path", "icon", "sort", "status", "type", "page_type", "page_schema", "pid"})
}

type FrontRouteForm struct {
	Id         int    `form:"id" json:"id"`
	Pid        int    `form:"pid" json:"pid" comment:"父id"`
	ModuleId   int    `form:"module_id" json:"module_id" comment:"模块id"`
	Name       string `form:"name" json:"name" comment:"路由名"`
	Type       int    `form:"type" json:"type" comment:"类型  1 目录, 2 菜单, 3 页面"`
	Path       string `form:"path" json:"path" comment:"前端路由"`
	Icon       string `form:"icon" json:"icon" comment:"图标"`
	PageType   int    `form:"page_type" json:"page_type" comment:"页面类型 0 自定义, 1 表单页, 2 列表页, 3复杂schema"`
	PageSchema string `form:"page_schema" json:"page_schema" comment:"页面定义"`
	View       string `form:"view" json:"view" comment:"自定义组价路径"`
	Sort       int    `form:"sort" json:"sort" comment:"倒序排序"`
	Status     int    `form:"status" json:"status" comment:"状态 0 禁用, 1 启用"`
}

// @PostApi /front_route/create
// @Summary 创建
// @Desc 创建接口 维护者: 刀刀
// @Params FrontRouteForm 接口参数所对应的结构体
// @Response
func (ctrl FrontRoute) Post(c *gin.Context, params FrontRouteForm) (interface{}, consts.ErrCode, error) {
	var paramsMap db.Record = lib.StructToMap(params)
	return ctrl.BaseController.CreateRecord(ctrl.getModel(), paramsMap)
}

// @PostApi /front_route/update/:id
// @Summary 更新接口
// @Desc 维护者: 刀刀
// @Params FrontRouteForm 接口参数所对应的结构体
// @Response
func (ctrl FrontRoute) Update(c *gin.Context, id int, params FrontRouteForm) (interface{}, consts.ErrCode, error) {
	var paramsMap db.Record = lib.StructToMap(params)
	return ctrl.BaseController.UpdateById(ctrl.getModel(), id, paramsMap)
}

// @DeleteApi /front_route/delete:id
// @Summary 删除
// @Desc 维护者: 刀刀
// @Response
func (ctrl FrontRoute) Delete(c *gin.Context, id int) (interface{}, consts.ErrCode, error) {
	return ctrl.BaseController.DeleteRecord(ctrl.getModel(), id)
}

// @GetApi /front_route/tree
func (ctrl FrontRoute) Tree(c *gin.Context) (interface{}, consts.ErrCode, error) {
	info, exists := c.Get("user")
	if !exists {
		return nil, 500, nil
	}
	me := info.(userInstance.Info)

	tree := menu.GetMenuSelect(me.Id)

	return tree, 0, nil
}

func (ctrl FrontRoute) getModel() db.Model {
	return model.FrontRoute
}
