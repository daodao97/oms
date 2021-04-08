package sso

type UserInfo struct {
	Name   string
	Nickname string
	Avatar string
	Mobile string
	Email string
}

type Service interface {
	GetAccessToken() (string, error)
	GetUserInfo(code string) (UserInfo, error)
}
