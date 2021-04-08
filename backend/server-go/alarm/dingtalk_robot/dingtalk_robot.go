package dingtalk_robot

import (
	"encoding/json"
	"fmt"

	"github.com/daodao97/egin/lib"
	"github.com/pkg/errors"

	"oms/alarm/interfaces"
)

type text struct {
	Content string `json:"content"`
}

type at struct {
	AtMobiles []string `json:"atMobiles"`
	IsAtAll   bool     `json:"isAtAll"`
}

type message struct {
	MsgType string `json:"msgtype"`
	Text    text   `json:"text"`
	At      at     `json:"at"`
}

func NewDingTalkRobot() interfaces.Alarm {
	return &dingTalkRobot{
		api: "https://oapi.dingtalk.com/robot/send?access_token=%s",
	}
}

type response struct {
	ErrCode int    `json:"errcode"`
	ErrMsg  string `json:"errmsg"`
}

type dingTalkRobot struct {
	api string
}

func (r *dingTalkRobot) SendTo(receiver, msg string) error {
	data := message{
		MsgType: "text",
		Text: text{
			Content: msg,
		},
		At: at{IsAtAll: true},
	}
	context, err := lib.Post(fmt.Sprintf(r.api, receiver), data, "application/json")
	if err != nil {
		return err
	}
	var res response
	err = json.Unmarshal([]byte(context), &res)
	if err != nil {
		return err
	}
	if res.ErrCode != 0 {
		return errors.New(res.ErrMsg)
	}
	return nil
}
