package controller

import (
	"encoding/json"

	"github.com/daodao97/egin/egin/consts"
	"github.com/daodao97/egin/egin/db"
	"github.com/daodao97/egin/egin/lib"
	"github.com/gin-gonic/gin"
	"github.com/pkg/errors"

	"oms/model"
	"oms/service/common_config"
	"oms/service/menu"
	"oms/service/scaffold"
)

// @Controller 角色
type Role struct {
	scaffold.BaseController
}

type RoleFilter struct {
	Id       int    `form:"id" json:"id"`
	Pid      int    `form:"pid" json:"pid" comment:"父id"`
	Name     string `form:"name" json:"name" comment:"角色名"`
	Sort     int    `form:"sort" json:"sort" comment:"降序排序"`
	Status   int    `form:"status" json:"status" comment:"状态 0 禁用, 1 启用"`
	Resource string `form:"resource" json:"resource" comment:"角色资源"`
}

type RoleTree struct {
	Id       int        `json:"id"`
	Pid      int        `json:"pid" comment:"父id"`
	Name     string     `json:"name" comment:"角色名"`
	Sort     int        `json:"sort" comment:"降序排序"`
	Status   int        `json:"status" comment:"状态 0 禁用, 1 启用"`
	Children []RoleTree `json:"children"`
}

func GenRoleTree(menuList []model.RoleEntity, pid int) []RoleTree {
	var treeList []RoleTree
	for _, v := range menuList {
		if v.Pid == pid {
			child := GenRoleTree(menuList, v.Id)
			node := RoleTree{
				Id:     v.Id,
				Name:   v.Name,
				Pid:    v.Pid,
				Sort:   v.Sort,
				Status: v.Status,
			}
			node.Children = child
			treeList = append(treeList, node)
		}
	}
	return treeList
}

type roleListResponse struct {
	List          []RoleTree `json:"list"`
	scaffold.Page `json:"page"`
}

// @GetApi /role/list
func (ctrl Role) List(c *gin.Context, params RoleFilter) (interface{}, consts.ErrCode, error) {
	filter := db.Filter{}
	if params.Id != 0 {
		filter["id"] = params.Id
	}
	var result []model.RoleEntity
	err := model.Role.Select(filter, db.Attr{
		Select:  []string{"id", "pid", "name", "status", "sort"},
		OrderBy: "sort desc",
	}, &result)

	tree := GenRoleTree(result, 0)

	response := roleListResponse{
		List: tree,
		Page: scaffold.Page{Total: 1, Page: 1},
	}

	return response, 0, err
}

// @GetApi /role/get/:id
// @Summary 列表接口
// @Desc 列表接口 维护者: 刀刀
// @Params RoleFilter
// @Response
// @Middleware IpLimiter
func (ctrl Role) Get(c *gin.Context, id int) (interface{}, consts.ErrCode, error) {
	filter := db.Filter{"id": id}
	var result []model.RoleEntity
	err := model.Role.Select(filter, db.Attr{
		Select:  []string{"id", "pid", "name", "status", "sort", "resource"},
		OrderBy: "id desc",
	}, &result)

	if len(result) != 1 {
		return nil, 500, errors.New("select error")
	}

	tmp, _ := json.Marshal(result[0])
	var ret map[string]interface{}
	_ = json.Unmarshal(tmp, &ret)
	var resource interface{}
	_ = json.Unmarshal([]byte(ret["resource"].(string)), &resource)
	ret["resource"] = resource

	return ret, 0, err
}

type RoleForm struct {
	Pid      int         `json:"pid"`
	Name     string      `json:"name"`
	Status   int         `json:"status"`
	Sort     int         `json:"sort"`
	Resource interface{} `json:"resource"`
}

// @PostApi /role/create
// @Summary 创建
// @Desc 创建接口 维护者: 刀刀
// @Params RoleForm 接口参数所对应的结构体
// @Response
func (ctrl Role) Create(c *gin.Context, params RoleForm) (interface{}, consts.ErrCode, error) {
	var paramsMap db.Record = lib.StructToMap(params)
	resourceStr, _ := json.Marshal(params.Resource)
	paramsMap["resource"] = resourceStr
	return ctrl.BaseController.CreateRecord(ctrl.getModel(), paramsMap)
}

type RoleUpdate struct {
	Pid      int         `json:"pid"`
	Name     string      `json:"name"`
	Status   int         `json:"status"`
	Sort     int         `json:"sort"`
	Resource interface{} `json:"resource"`
}

// @PostApi /role/update/:id
// @Summary 更新接口
// @Desc 维护者: 刀刀
// @Params RoleUpdate 接口参数所对应的结构体
// @Response
func (ctrl Role) Update(c *gin.Context, id int, params RoleUpdate) (interface{}, consts.ErrCode, error) {
	var paramsMap db.Record = lib.StructToMap(params)
	resourceStr, _ := json.Marshal(params.Resource)
	paramsMap["resource"] = resourceStr

	return ctrl.BaseController.UpdateById(ctrl.getModel(), id, paramsMap)
}

// @DeleteApi /role/delete/:id
// @Summary 删除
// @Desc 维护者: 刀刀
// @Response
func (ctrl Role) Delete(c *gin.Context, id int) (interface{}, consts.ErrCode, error) {
	return ctrl.BaseController.DeleteRecord(ctrl.getModel(), id)
}

type TreeOptions struct {
	Value    int           `json:"value"`
	Label    string        `json:"label"`
	Children []TreeOptions `json:"children"`
}

func GenTreeOptions(menuList []model.RoleEntity, pid int) []TreeOptions {
	var treeList []TreeOptions
	for _, v := range menuList {
		if v.Pid == pid {
			child := GenTreeOptions(menuList, v.Id)
			node := TreeOptions{
				Value: v.Id,
				Label: v.Name,
			}
			node.Children = child
			treeList = append(treeList, node)
		}
	}
	return treeList
}

// @GetApi /role/tree
func (ctrl Role) Tree(c *gin.Context) (interface{}, consts.ErrCode, error) {
	var result []model.RoleEntity
	err := model.Role.Select(db.Filter{"status": 1}, db.Attr{
		Select:  []string{"id", "pid", "name", "status", "sort"},
		OrderBy: "sort desc",
	}, &result)

	tree := GenTreeOptions(result, 0)

	return tree, 0, err
}

type ModuleResource struct {
	Value    int                `json:"value"`
	Label    string             `json:"label"`
	Children []menu.TreeOptions `json:"children,omitempty"`
}

// @GetApi /role/resource
func (ctrl Role) Resource(c *gin.Context) (interface{}, consts.ErrCode, error) {
	modules := make([]ModuleResource, 0)
	website, err := common_config.GetWebsite()
	if err != nil {
		return nil, 500, err
	}
	for _, m := range website.Modules {
		modules = append(modules, ModuleResource{Value: m.Id, Label: m.Label})
	}

	tree := menu.GetMenuOptions(0)

	for i, m := range modules {
		for _, r := range tree {
			if m.Value == r.ModuleId {
				modules[i].Children = append(modules[i].Children, r)
			}
		}
	}
	return modules, 0, nil
}

func (ctrl Role) getModel() db.Model {
	return model.Role
}
