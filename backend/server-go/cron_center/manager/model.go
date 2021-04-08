package manager

import (
	"encoding/json"

	"github.com/daodao97/egin/egin/db"
)

type jobConf struct {
	FuncName string `json:"func_name"`
	Command  string `json:"command"`
}

// 通用配置
type CronJobEntity struct {
	Id        int                    `json:"id"`
	Name      string                 `json:"name" comment:"任务明"`
	Title     string                 `json:"title" comment:"可读任务名"`
	Rule      string                 `json:"rule" comment:"运行规则"`
	Config    jobConf                `json:"config" comment:"任务配置"`
	AlertRule []interface{}          `json:"alert_rule" comment:"报警规则"`
	Type      int                    `json:"type" comment:"任务类型, 0 本地方法, 1 shell, 2 接口调用"`
	BindNodes string                 `json:"bind_nodes" comment:"绑定的执行节点"`
	State     map[string]interface{} `json:"state"`
	db.StatusColumn
	db.DateColumn
	db.DelColumn
}

var CronJob = db.NewModel(db.ModelConf{
	Table:      "cron_jobs",
	Connection: "default",
	FakeDelete: true,
	FakeDelKey: db.FakeDelKey,
})

func init() {
	CronJob.AfterSelect(func(m db.Model, result []map[string]interface{}, err error) []map[string]interface{} {
		for i, each := range result {
			if r, ok := each["config"]; ok {
				var tmp map[string]interface{}
				_ = json.Unmarshal([]byte(r.(string)), &tmp)
				result[i]["config"] = tmp
			}
			if r, ok := each["alert_rule"]; ok && r != "" && r != "null" {
				var tmp []interface{}
				_ = json.Unmarshal([]byte(r.(string)), &tmp)
				result[i]["alert_rule"] = tmp
			}
			if r, ok := each["state"]; ok && r != "" && r != "null" {
				var tmp map[string]interface{}
				_ = json.Unmarshal([]byte(r.(string)), &tmp)
				result[i]["state"] = tmp
			}
		}
		return result
	})
}
