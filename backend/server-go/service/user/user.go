package user

import (
	"encoding/json"
	"fmt"
	"time"

	"github.com/daodao97/egin/cache/redis"
	"github.com/daodao97/egin/db"
	egin_user "github.com/daodao97/egin/service/user"
	"github.com/daodao97/egin/utils/config"
	"github.com/pkg/errors"

	"oms/model"
)

type Service interface {
	Info(id int) (egin_user.Info, error)
	Role(id int) ([]int, error)
	Login(name string, password string) (egin_user.Info, error)
	IsSupperMan(id int) bool
	Encrypt(password string) string
}

func New() Service {
	return &service{}
}

type service struct {
}

var cacheKeyTpl = "admin:user_info:%d"

func (s service) Info(id int) (egin_user.Info, error) {
	info := egin_user.Info{}
	cacheKey := fmt.Sprintf(cacheKeyTpl, id)
	cacheIns := redis.NewDefault()
	cache, err := cacheIns.Get(cacheKey)

	if cache != "" {
		_ = json.Unmarshal([]byte(cache), &info)
	}

	if info.Id != 0 {
		return info, nil
	}

	var bind []model.UserEntity
	err = model.User.Select(db.Filter{"id": id}, db.Attr{Select: []string{"id", "name", "avatar", "email", "role_ids", "email", "mobile"}}, &bind)

	if err != nil {
		return info, err
	}

	if len(bind) == 1 {
		info.Id = bind[0].Id
		info.Name = bind[0].Name
		str, _ := json.Marshal(info)
		_ = cacheIns.Set(cacheKey, string(str), time.Now().Unix()+config.Config.Jwt.TokenExpire)
		return info, nil
	}

	return info, errors.New("not found")
}

func (s service) Role(id int) ([]int, error) {
	var bind []model.UserEntity
	err := model.User.Select(db.Filter{"id": id}, db.Attr{Select: []string{"id", "role_ids"}}, &bind)

	if err != nil {
		return []int{}, err
	}

	if len(bind) == 1 {
		var roleIds []int
		for _, v := range bind[0].RoleIds {
			roleIds = append(roleIds, v[len(v)-1])
		}
		return roleIds, nil
	}

	return []int{}, errors.New("not found")
}

func (s service) Login(name string, password string) (egin_user.Info, error) {
	var bind []model.UserEntity
	info := egin_user.Info{}
	err := model.User.Select(db.Filter{"name": name, "status": 1}, db.Attr{Select: []string{"id", "password", "name"}}, &bind)
	if err != nil {
		return info, err
	}
	if len(bind) == 1 && bind[0].Password == s.Encrypt(password) {
		info.Id = bind[0].Id
		info.Name = bind[0].Name
		cacheKey := fmt.Sprintf(cacheKeyTpl, info.Id)
		cacheIns := redis.NewDefault()
		str, _ := json.Marshal(info)
		_ = cacheIns.Set(cacheKey, string(str), time.Now().Unix()+config.Config.Jwt.TokenExpire)
		return info, nil
	}

	return info, errors.New("username or password error")
}

func (s service) IsSupperMan(id int) bool {
	return true
}

func (s service) Encrypt(password string) string {
	return password
}

type UserAttr struct {
	Id       int        `json:"id"`
	Name     string     `json:"name" comment:"名称"`
	Nickname string     `json:"nickname" comment:"名称"`
	Avatar   string     `json:"avatar" comment:"头像"`
	Email    string     `json:"email" comment:"邮箱"`
	Mobile   string     `json:"mobile" comment:"手机号"`
	RoleIds  []int      `json:"role_ids" comment:"用户角色"`
	Resource [][]interface{} `json:"resource"`
}

func FullAttr(id int) (full UserAttr, err error) {
	var bind []model.UserEntity
	err = model.User.Select(db.Filter{"id": id}, db.Attr{Select: []string{"id", "name", "avatar", "email", "role_ids", "email", "mobile", "nickname"}}, &bind)

	if err != nil {
		return full, err
	}

	if len(bind) != 1 {
		return full, errors.New("not found")
	}
	var roleIds []int
	for _, v := range bind[0].RoleIds {
		roleIds = append(roleIds, v[len(v)-1])
	}
	full = UserAttr{
		Id:       bind[0].Id,
		Name:     bind[0].Name,
		Nickname: bind[0].Nickname,
		Avatar:   bind[0].Avatar,
		Email:    bind[0].Email,
		Mobile:   bind[0].Mobile,
		RoleIds:  roleIds,
		Resource: Resource(id),
	}

	return full, nil
}

func Resource(id int) (resource [][]interface{}) {
	var bind model.UserEntity
	err := model.User.FindById(id, []string{"role_ids"}, &bind)
	if err != nil {
		return make([][]interface{}, 0)
	}
	var roleIds []int
	for _, v := range bind.RoleIds {
		roleIds = append(roleIds, v[len(v)-1])
	}
	var r []model.RoleEntity
	err = model.Role.Select(db.Filter{"id": roleIds}, db.Attr{Select: []string{"resource"}}, &r)
	if err != nil {
		return make([][]interface{}, 0)
	}
	for _, v := range r {
		if v.Id == 1 {
			return make([][]interface{}, 0)
		}
		var each [][]interface{}
		err = json.Unmarshal([]byte(v.Resource), &each)
		if err != nil {
			continue
		}
		resource = append(resource, each...)
	}
	return resource
}
