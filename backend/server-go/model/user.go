package model

import (
	"encoding/json"

	"github.com/daodao97/egin/db"
)

// 用户
type UserEntity struct {
	Id       int     `json:"id"`
	Name     string  `json:"name" comment:"名称"`
	Nickname string  `json:"nickname" comment:"名称"`
	Avatar   string  `json:"avatar" comment:"头像"`
	Password string  `json:"password" comment:"密码"`
	Email    string  `json:"email" comment:"邮箱"`
	Mobile   string  `json:"mobile" comment:"手机号"`
	RoleIds  [][]int `json:"role_ids" comment:"用户角色"`
	db.StatusColumn
	db.DateColumn
}

var User = db.NewModel(db.ModelConf{
	Table:      "user",
	Connection: "default",
})

func init() {
	User.AfterUpdate(db.DataVersion)
	User.AfterSelect(func(m db.Model, result []map[string]interface{}, err error) []map[string]interface{} {
		for i, each := range result {
			if r, ok := each["role_ids"]; ok {
				var tmp [][]int
				_ = json.Unmarshal([]byte(r.(string)), &tmp)
				result[i]["role_ids"] = tmp
			}
		}
		return result
	})
	User.BeforeUpdate(func(m db.Model, filter db.Filter, record db.Record) (db.Filter, db.Record) {
		if v, ok := record["role_ids"]; ok {
			record["role_ids"], _ = json.Marshal(v)
		}
		return filter, record
	})
}
