package user

import (
	"strconv"

	"github.com/daodao97/egin/egin/cache/redis"
)

type State struct {
}

func (s State) IsLogin(id int) (string, bool) {
	key := "admin:user_login_tokens"
	cache := redis.NewDefault()
	token, err := cache.HGet(key, strconv.Itoa(id))
	if err != nil || token == "" {
		return "", false
	}
	return token, true
}

func (s State) SetToken(id int, token string) error {
	key := "admin:user_login_tokens"
	cache := redis.NewDefault()
	return cache.HSet(key, strconv.Itoa(id), token)
}

func (s State) DelToken(id int) error {
	key := "admin:user_login_tokens"
	cache := redis.NewDefault()
	return cache.HDel(key, strconv.Itoa(id))
}
