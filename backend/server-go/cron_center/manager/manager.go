package manager

import (
	"fmt"
	"time"

	"github.com/daodao97/egin/egin/db"
	"github.com/prometheus/common/log"
	"github.com/robfig/cron/v3"

	"oms/cron_center/ws"
)

// 计划任务调度入口
func Running(manager *ws.Manager) {
	nyc, _ := time.LoadLocation("Asia/Shanghai")
	c := cron.New(cron.WithLocation(nyc))
	runningJob := map[string]cron.EntryID{}

START:
	jobList := getDBJobs()
	for _, j := range jobList {
		var id cron.EntryID
		existId, ok := runningJob[j.Name]
		if ok {
			id = existId
			if j.Status == db.StatusOff {
				c.Remove(id)
				delete(runningJob, j.Name)
			}
			continue
		}

		if j.Status == db.StatusOff {
			continue
		}

		if j.Type > len(typeMap)-1 {
			log.Error(fmt.Sprintf("not found in typeMap name %s type %d", j.Name, j.Type))
			continue
		}

		typeName := typeMap[j.Type]
		handle, ok := typeHandle[typeName]
		if !ok {
			log.Error(fmt.Sprintf("not found in typeHanle name %s typeName %s", j.Name, typeName))
			continue
		}

		id, err := c.AddFunc(j.Rule, handle(j, manager))
		if err != nil {
			log.Error(err)
			continue
		}

		runningJob[j.Name] = id
	}

	c.Start()

	for {
		// time.Sleep(time.Second * time.Duration(60-time.Now().Second()))
		time.Sleep(time.Second)
		log.Info("完成一次循环")
		goto START
	}
}

func msgWrap(id, name, msg string) string {
	return fmt.Sprintf("%s %s %s %s", id, time.Now().Format("2006-01-02 15:04:05"), name, msg)
}

func getStartMsg(id, name string) string {
	return fmt.Sprintf("%s %s %s start", id, time.Now().Format("2006-01-02 15:04:05"), name)
}

func getEndMsg(id, name string) string {
	return fmt.Sprintf("%s %s %s end", id, time.Now().Format("2006-01-02 15:04:05"), name)
}
