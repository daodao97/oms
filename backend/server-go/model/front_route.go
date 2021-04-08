package model

import (
	"github.com/daodao97/egin/db"
)

const (
	TypeNull = iota
	TypeDIR
	TypeMenu
	TypePage
)

const (
	PageTypeView = iota
	PageTypeForm
	PageTypeTable
	PageTypeSchema
)

// 前端路由表
type FrontRouteEntity struct {
	Id         int    `json:"id"`
	Pid        int    `json:"pid" comment:"父id"`
	ModuleId   int    `json:"module_id" comment:"模块id"`
	Name       string `json:"name" comment:"路由名"`
	Type       int    `json:"type" comment:"类型  1 目录, 2 菜单, 3 页面"`
	Path       string `json:"path" comment:"前端路由"`
	Icon       string `json:"icon" comment:"图标"`
	PageType   int    `json:"page_type" comment:"页面类型 0 自定义, 1 表单页, 2 列表页, 3复杂schema"`
	PageSchema string `json:"page_schema" comment:"页面定义"`
	View       string `json:"view" comment:"自定义组件路径"`
	Sort       int    `json:"sort" comment:"倒序排序"`
	db.StatusColumn
	db.DateColumn
}

var FrontRoute = db.NewModel(db.ModelConf{
	Table:      "front_route",
	Connection: "default",
})
