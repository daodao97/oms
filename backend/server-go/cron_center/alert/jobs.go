package alert

import (
	"github.com/daodao97/egin/egin/db"

	"oms/cron_center/manager"
)

type jobs []manager.CronJobEntity

// 获取 db 中定义的 计划任务
func getDBJobs() jobs {
	var list jobs
	err := manager.CronJob.Select(db.Filter{
		"status": db.StatusOn,
	}, db.Attr{
		Select: []string{"id", "name", "title", "alert_rule", "state"},
	}, &list)
	if err != nil {
		return list
	}
	return list
}
