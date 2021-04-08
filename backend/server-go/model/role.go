package model

import (
	"github.com/daodao97/egin/db"
)

// 角色
type RoleEntity struct {
	Id        int    `json:"id"`
	Pid       int    `json:"pid" comment:"父id"`
	Name      string `json:"name" comment:"角色名"`
	Sort      int    `json:"sort" comment:"降序排序"`
	Resource  string `json:"resource" comment:"角色资源"`
	db.StatusColumn
	db.DateColumn
}

var Role = db.NewModel(db.ModelConf{
	Table:      "role",
	Connection: "default",
})
