package alert

import (
	"context"
	"fmt"
	"time"

	"github.com/daodao97/egin/egin/lib"
	"github.com/daodao97/egin/egin/utils/goroutine"
	"github.com/prometheus/common/log"
	"github.com/techxmind/filter"
	"github.com/techxmind/filter/core"

	"oms/alarm/dingtalk_robot"
)

func init() {
	Reg()
}

func Monitor() {
	goroutine.Go(func() {
		for {
			for _, v := range getDBJobs() {
				data := lib.StructToMap(v.State)
				if data == nil {
					continue
				}
				filterRule := v.AlertRule
				if filterRule == nil {
					continue
				}
				ctx := context.Background()
				filterCtx := core.WithContext(ctx)

				f, err := filter.New(filterRule)
				if err != nil {
					log.Error(err)
					continue
				}
				res := f.Run(filterCtx, data)

				if res {
					receiver, ok := data["send_to"]
					if !ok {
						continue
					}
					msg, ok := data["alarm_message"]
					if !ok {
						msg = fmt.Sprintf("任务告警 [%s] deploy", v.Title)
					}
					err := dingtalk_robot.NewDingTalkRobot().SendTo(receiver.(string), msg.(string))
					if err != nil {
						log.Error(err)
					}
				}
			}

			time.Sleep(time.Second * 3)
		}
	})
}
