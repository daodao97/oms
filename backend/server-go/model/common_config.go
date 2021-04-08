package model

import (
	"github.com/daodao97/egin/egin/db"
)


// 通用配置
type CommonConfigEntity struct {
	Id          int    `json:"id"`
	Name        string `json:"name" comment:"配置名, 字母"`
	Title       string `json:"title" comment:"可读配置名"`
	Remark      string `json:"remark" comment:"备注"`
	Rules       string `json:"rules" comment:"配置规则描述"`
	Value       string `json:"value" comment:"具体配置值 key:value"`
	Permissions string `json:"permissions" comment:"权限"`
	IsNeedForm  int    `json:"is_need_form" comment:"是否启用表单：0，否；1，是"`
	db.DateColumn
}

var CommonConfig = db.NewModel(db.ModelConf{
	Table:      "common_config",
	Connection: "default",
})
