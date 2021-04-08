package alarm

import (
	"testing"

	"github.com/daodao97/egin/egin/utils/config"
	"github.com/go-playground/assert/v2"

	"oms/alarm/dingtalk_robot"
	"oms/alarm/workwechat_app"
	"oms/alarm/workwechat_robot"
	"oms/util/sso"
)

func init() {
	config.Config.Redis = map[string]config.Redis{
		"default": {
			Host: "127.0.0.1",
			Port: 6379,
		},
	}
}

func TestDingTalkRobot_SendTo(t *testing.T) {
	sender := dingtalk_robot.NewDingTalkRobot()
	receiver := "******"
	err := sender.SendTo(receiver, "test [deploy]")
	assert.Equal(t, err, nil)
}

func TestWorkWechatRobot_SendTo(t *testing.T) {
	sender := workwechat_robot.NewWorkWechatRobot()
	receiver := "******"
	err := sender.SendTo(receiver, "test [deploy]")
	assert.Equal(t, err, nil)
}

func TestWorkWechatApp_SendTo(t *testing.T) {
	sender := workwechat_app.NewWorkWechat(sso.WorkWechatConf{
		AgentId: config.Config.WXConf.AgentId,
		Secret:  config.Config.WXConf.Secret,
		CorpId:  config.Config.WXConf.CorpId,
	})
	receiver := "WangWenJie"
	err := sender.SendTo(receiver, "test [deploy]")
	assert.Equal(t, err, nil)
}
