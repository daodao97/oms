package workwechat_app

import (
	"oms/alarm/interfaces"
	"oms/util/sso"
)

func NewWorkWechat(conf sso.WorkWechatConf) interfaces.Alarm {
	return &app{
		app: sso.NewWorkWechat(conf),
	}
}

type text struct {
	Content string `json:"content"`
}

type message struct {
	ToUser  string `json:"touser"`
	MsgType string `json:"msgtype"`
	AgentId int    `json:"agentid"`
	Text    text   `json:"text"`
}

type app struct {
	app *sso.WorkWechat
}

func (a app) SendTo(receiver, msg string) error {
	data := message{
		ToUser:  receiver,
		MsgType: "text",
		AgentId: 1000002,
		Text: text{
			Content: msg,
		},
	}
	err := a.app.SendMessage(data)
	return err
}
