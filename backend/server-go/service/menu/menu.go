package menu

import (
	"encoding/json"
	"strconv"
	"strings"

	"github.com/daodao97/egin/db"
	"github.com/daodao97/egin/utils/logger"

	"oms/model"
	"oms/service/user"
)

type TreeList struct {
	Id         int         `json:"id"`
	Pid        int         `json:"pid" comment:"父id"`
	ModuleId   int         `json:"module_id" comment:"所属模块"`
	Name       string      `json:"name" comment:"名称 唯一"`
	Type       int         `json:"type" comment:"类型 0原样渲染,1脚手架"`
	PageType   int         `json:"page_type" comment:"类型 0原样渲染,1脚手架"`
	Path       string      `json:"path" comment:"页面路由 唯一"`
	IsShow     bool        `json:"is_show"`
	PageSchema interface{} `json:"page_schema" comment:"页面配置"`
	View       string      `json:"view" comment:"自定义组件路径"`
	Icon       string      `json:"icon" comment:"图片"`
	Children   []TreeList  `json:"children"`
}

type Route struct {
	model.FrontRouteEntity
	IsShow bool `json:"is_show"`
}

func genMenuTree(menuList []Route, pid int) []TreeList {
	var treeList []TreeList
	for _, v := range menuList {
		if v.Pid == pid {
			child := genMenuTree(menuList, v.Id)
			var pageSchema interface{}
			_ = json.Unmarshal([]byte(v.PageSchema), &pageSchema)
			node := TreeList{
				Id:         v.Id,
				Name:       v.Name,
				Pid:        v.Pid,
				ModuleId:   v.ModuleId,
				Type:       v.Type,
				PageType:   v.PageType,
				PageSchema: pageSchema,
				IsShow:     v.IsShow,
				Path:       v.Path,
				Icon:       v.Icon,
			}
			node.Children = child
			treeList = append(treeList, node)
		}
	}
	return treeList
}

// 前端路由树
func GetRoutes(uid int) []Route {
	filter := db.Filter{"status": 1}
	if uid > 0 {
		var roleIdsStr []string
		roleIds, _ := user.New().Role(uid)
		for _, v := range roleIds {
			roleIdsStr = append(roleIdsStr, strconv.Itoa(v))
		}
		if !user.New().IsSupperMan(uid) {
			filter["find_in_set"] = strings.Join(roleIdsStr, ",")
		}

	}
	var routes []Route
	err := model.FrontRoute.Select(filter, db.Attr{Select: []string{"id", "pid", "module_id", "name", "type", "page_type", "path", "page_schema", "view", "icon"}}, &routes)
	if err != nil {
		logger.NewLogger("user").Error(err)
	}

	return routes
}

// 前端路由树
func GetMenuTree(uid int) []TreeList {
	routes := GetRoutes(uid)
	for i, _ := range routes {
		routes[i].IsShow = routes[i].Type != 3
	}
	list := genMenuTree(routes, 0)
	return list
}
