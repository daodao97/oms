package workwechat_robot

import (
	"encoding/json"
	"fmt"

	"github.com/daodao97/egin/lib"
	"github.com/pkg/errors"

	"oms/alarm/interfaces"
)

type text struct {
	Content             string   `json:"content"`
	MentionedMobileList []string `json:"mentioned_mobile_list"`
}

type message struct {
	MsgType string `json:"msgtype"`
	Text    text   `json:"text"`
}

func NewWorkWechatRobot() interfaces.Alarm {
	return &workWechatRobot{
		api: "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=%s",
	}
}

type response struct {
	ErrCode int    `json:"errcode"`
	ErrMsg  string `json:"errmsg"`
}

type workWechatRobot struct {
	api string
}

func (r *workWechatRobot) SendTo(receiver, msg string) error {
	data := message{
		MsgType: "text",
		Text: text{
			Content:             msg,
			MentionedMobileList: []string{"@all"},
		},
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
