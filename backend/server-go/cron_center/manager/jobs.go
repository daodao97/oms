package manager

import (
	"fmt"

	"github.com/daodao97/egin/egin/db"
)

type jobs []CronJobEntity

// 获取 db 中定义的 计划任务
func getDBJobs() jobs {
	var list jobs
	err := CronJob.Select(db.Filter{
		// "status": db.StatusOn,
	}, db.Attr{
		Select: []string{"id", "name", "type", "rule", "config", "status"},
	}, &list)
	if err != nil {
		return list
	}
	return list
}

type localJobHandle map[string]func()

// 本地定义的任务
func getLocalJobHandle() localJobHandle {
	return localJobHandle{
		"func_demo": func() {
			fmt.Println("place write your code header")
		},
	}
}
