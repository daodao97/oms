package sso

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"

	"github.com/daodao97/egin/cache/redis"
	"github.com/daodao97/egin/lib"
	"github.com/pkg/errors"
)

func NewQW(conf WorkWechatConf) Service {
	return &WorkWechat{
		conf: conf,
	}
}

type WorkWechatConf struct {
	AgentId int
	Secret  string
	CorpId  string
}

func NewWorkWechat(conf WorkWechatConf) *WorkWechat {
	return &WorkWechat{conf: conf}
}

type WorkWechat struct {
	conf WorkWechatConf
}

func (w WorkWechat) GetAccessToken() (string, error) {
	key := "oms:sso:work_wechat_access_token"
	cache := redis.NewDefault()
	exist, err := cache.Exists(key)
	if err != nil {
		return "", err
	}
	if exist > 0 {
		token, err := cache.Get(key)
		if err != nil {
			return "", err
		}
		if token != "" {
			return token, nil
		}
	}

	url := fmt.Sprintf("https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=%s&corpsecret=%s", w.conf.CorpId, w.conf.Secret)
	resp, err := http.Get(url)
	if err != nil {
		return "", err
	}
	b, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}
	var body struct {
		ErrorCode    int    `json:"errcode"`
		ErrorMessage string `json:"errmsg"`
		AccessToken  string `json:"access_token"`
		ExpiresIn    int64  `json:"expires_in"`
	}
	_ = json.Unmarshal(b, &body)
	if body.ErrorCode != 0 {
		return "", errors.New(body.ErrorMessage)
	}
	err = cache.Set(key, body.AccessToken, body.ExpiresIn)
	if err != nil {
		return "", err
	}
	return body.AccessToken, nil
}

func (w WorkWechat) GetUserInfo(code string) (UserInfo, error) {
	token, err := w.GetAccessToken()
	if err != nil {
		return UserInfo{}, err
	}
	url := fmt.Sprintf("https://qyapi.weixin.qq.com/cgi-bin/user/getuserinfo?access_token=%s&code=%s", token, code)

	var userId struct {
		ErrorCode    int    `json:"errcode"`
		ErrorMessage string `json:"errmsg"`
		UserId       string `json:"UserId"`
	}

	resp, err := http.Get(url)
	if err != nil {
		return UserInfo{}, err
	}
	b, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return UserInfo{}, err
	}
	_ = json.Unmarshal(b, &userId)
	if userId.ErrorCode != 0 {
		return UserInfo{}, errors.New(userId.ErrorMessage)
	}

	infoUrl := fmt.Sprintf("https://qyapi.weixin.qq.com/cgi-bin/user/get?access_token=%s&userid=%s", token, userId.UserId)

	resp, err = http.Get(infoUrl)
	if err != nil {
		return UserInfo{}, err
	}
	b, err = ioutil.ReadAll(resp.Body)
	if err != nil {
		return UserInfo{}, err
	}
	var userInfo struct {
		ErrorCode    int    `json:"errcode"`
		ErrorMessage string `json:"errmsg"`
		UserId       string `json:"userid"`
		Name         string `json:"name"`
		Mobile       string `json:"mobile"`
		Email        string `json:"email"`
		Avatar       string `json:"avatar"`
	}
	_ = json.Unmarshal(b, &userInfo)
	if userInfo.ErrorCode != 0 {
		return UserInfo{}, errors.New(userInfo.ErrorMessage)
	}

	return UserInfo{
		Name:     userInfo.UserId,
		Nickname: userInfo.Name,
		Mobile:   userInfo.Mobile,
		Avatar:   userInfo.Avatar,
		Email:    userInfo.Email,
	}, nil
}

func (w WorkWechat) SendMessage(data interface{}) error {
	token, err := w.GetAccessToken()
	if err != nil {
		return err
	}
	url := fmt.Sprintf("https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token=%s", token)
	content, err := lib.Post(url, data, "application/json")
	if err != nil {
		return err
	}

	fmt.Println(content)
	return nil
}
