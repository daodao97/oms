package controller

import (
	"fmt"
	"strings"
	"time"

	"github.com/daodao97/egin/consts"
	"github.com/daodao97/egin/db"
	"github.com/daodao97/egin/lib"
	egin_user "github.com/daodao97/egin/service/user"
	"github.com/daodao97/egin/utils"
	"github.com/gin-gonic/gin"
	"github.com/pkg/errors"

	"oms/model"
	"oms/service/common_config"
	"oms/service/menu"
	"oms/service/scaffold"
	"oms/service/user"
	"oms/util/sso"
)

// @Controller 用户管理 这里是简介
type User struct {
	scaffold.BaseController
}

type UserFilter struct {
	Id     int    `form:"id"`
	Name   string `form:"nickname"`
	RoleId int    `form:"role_id"`
	Status int    `form:"status"`
}

type UserForm struct {
	Id       int     `form:"id" json:"id"`
	Name     string  `form:"name" json:"name" comment:"名称"`
	Avatar   string  `form:"avatar" json:"avatar" comment:"头像"`
	Password string  `form:"password" json:"password" comment:"密码"`
	Status   int     `form:"status" json:"status" comment:"状态 0禁用 1启用"`
	Email    string  `form:"email" json:"email" comment:"邮箱"`
	Mobile   string  `form:"mobile" json:"mobile" comment:"手机号"`
	RoleIds  [][]int `form:"role_ids" json:"role_ids" comment:"用户角色"`
}

type UserLogin struct {
	Name     string `json:"username"`
	Password string `json:"password"`
	Ticket   string `json:"ticket" from:"ticket"`
}

// @PostApi /user/login
// @Summary 删除用户
// @Desc 维护者: 刀刀
// @Params UserLogin 接口参数所对应的结构体
// @Response
func (ctrl User) Login(c *gin.Context, userPost UserLogin) (interface{}, consts.ErrCode, error) {
	var info egin_user.Info
	var err error
	if userPost.Ticket != "" {
		conf := sso.WorkWechatConf{
			AgentId: 1000002,
			Secret:  "*******",
			CorpId:  "*******",
		}
		ssoInfo, err := sso.NewQW(conf).GetUserInfo(userPost.Ticket)
		if err != nil {
			return nil, 500, err
		}
		_model := model.User
		filter := db.Filter{"name": ssoInfo.Name}
		count, err := _model.SelectCount(filter)
		if err != nil {
			return nil, 500, err
		}
		if count == 0 {
			id, _, err := _model.Insert(db.Record{
				"name":     ssoInfo.Name,
				"nickname": ssoInfo.Nickname,
				"mobile":   ssoInfo.Mobile,
				"email":    ssoInfo.Email,
				"avatar":   ssoInfo.Avatar,
				"status":   db.StatusOn,
			})
			if err != nil {
				return nil, 500, err
			}
			info = egin_user.Info{Id: int(id), Name: ssoInfo.Nickname}
		} else {
			var localUser []model.UserEntity
			_ = _model.Select(filter, db.Attr{Select: []string{"id", "nickname", "status"}}, &localUser)
			if localUser[0].Status == 0 {
				return nil, 500, errors.New("用户已禁用")
			}
			info = egin_user.Info{Id: localUser[0].Id, Name: localUser[0].Nickname}
		}
	} else {
		info, err = user.New().Login(userPost.Name, userPost.Password)
		if err != nil {
			return nil, 500, err
		}
	}

	state := user.State{}
	token, ok := state.IsLogin(info.Id)
	parts := strings.SplitN(token, " ", 2)
	if ok {
		if len(parts) == 2 && parts[0] == "Bearer" {
			claims, err := utils.ParseToken(parts[1])
			if err == nil && time.Now().Unix() < claims.ExpiresAt {
				return map[string]interface{}{
					"name":  info.Name,
					"token": token,
				}, 0, nil
			}
		} else {
			_ = state.DelToken(info.Id)
		}
	}

	token, err = utils.GenerateToken(info.Id, info.Name)
	if err != nil {
		return nil, 401, errors.New("gen token error")
	}
	token = fmt.Sprintf("Bearer %v", token)
	_ = state.SetToken(info.Id, token)
	return map[string]interface{}{
		"name":  info.Name,
		"token": token,
	}, 0, nil
}

// @PostApi /user/logout
func (ctrl User) Logout(c *gin.Context) (interface{}, consts.ErrCode, error) {
	info, exists := c.Get("user")
	if !exists {
		return nil, 500, errors.New("token error")
	}
	me := info.(egin_user.Info)
	err := user.State{}.DelToken(me.Id)
	if err != nil {
		return nil, 0, err
	}
	return "success", 0, nil
}

// @PostApi /user/offline/:id
func (ctrl User) Offline(c *gin.Context, id int) (interface{}, consts.ErrCode, error) {
	info, exists := c.Get("user")
	if !exists {
		return nil, 500, errors.New("token error")
	}
	me := info.(egin_user.Info)

	if me.Id == id {
		return nil, 500, errors.New("不能下线自己")
	}
	err := user.State{}.DelToken(id)
	if err != nil {
		return nil, 0, err
	}
	return "success", 0, nil
}

// @GetApi /user/info
func (ctrl User) Info(c *gin.Context) (interface{}, consts.ErrCode, error) {
	info, exists := c.Get("user")
	if !exists {
		return nil, 500, errors.New("token error")
	}
	me := info.(egin_user.Info)
	full, err := user.FullAttr(me.Id)
	if err != nil {
		return nil, 500, err
	}
	return full, 0, nil
}

type Module struct {
	Id     int    `json:"id"`
	Label  string `json:"label"`
	Routes []menu.TreeList `json:"routes"`
}

// @GetApi /user/routes
func (ctrl User) Routes(c *gin.Context) (interface{}, consts.ErrCode, error) {
	info, exists := c.Get("user")
	if !exists {
		return nil, 500, nil
	}
	me := info.(egin_user.Info)

	modules := make([]Module, 0)
	website, err := common_config.GetWebsite()
	if err != nil {
		return nil, 500, err
	}
	for _, m := range website.Modules {
		modules = append(modules, Module{Id: m.Id, Label: m.Label})
	}

	userRoute := menu.GetMenuTree(me.Id)

	for i, m := range modules {
		for _, r := range userRoute {
			if m.Id == r.ModuleId  {
				modules[i].Routes = append(modules[i].Routes, r)
			}
		}
	}

	return modules, 0, nil
}

type ResponseUserList struct {
	model.UserEntity
	IsLogin int `json:"is_login"`
}

type responseList struct {
	scaffold.ListResponse
	List    []ResponseUserList `json:"list"`
	IsLogin int                `json:"is_login"`
}

// @PostApi /user/create 若无默认为全小写的方法名
// @Summary 创建用户
// @Desc 这个接口支持你创建一个用户 维护者: 刀刀
// @Params UserForm 接口参数所对应的结构体
// @Response
func (ctrl User) Post(c *gin.Context, params UserForm) (interface{}, consts.ErrCode, error) {
	var paramsMap db.Record = lib.StructToMap(params)
	return ctrl.BaseController.CreateRecord(ctrl.getModel(), paramsMap)
}

// @PostApi /user/update/:id
// @Summary 更新用户信息
// @Desc 维护者: 刀刀
// @Params UserForm 接口参数所对应的结构体
// @Response
func (ctrl User) Update(c *gin.Context, id int, params UserForm) (interface{}, consts.ErrCode, error) {
	if params.Status == 0 {
		_ = user.State{}.DelToken(id)
	}
	var paramsMap db.Record = lib.StructToMap(params)
	delete(paramsMap, "password")
	return ctrl.BaseController.UpdateById(ctrl.getModel(), id, paramsMap)
}

// @DeleteApi /user/delete/:id
// @Summary 删除用户
// @Desc 维护者: 刀刀
// @Response
func (ctrl User) Delete(c *gin.Context, id int) (interface{}, consts.ErrCode, error) {
	return ctrl.BaseController.DeleteRecord(ctrl.getModel(), id)
}

// @GetApi /user/get/:id 若无默认为全小写的方法名
// @Summary 用户列表接口
// @Desc 接口简介, 若无则为空 维护者: 刀刀
// @Params UserFilter 接口参数所对应的结构体
// @Response
// @Middleware IpLimiter
func (ctrl User) Get(c *gin.Context, id int) (interface{}, consts.ErrCode, error) {
	return ctrl.BaseController.GetById(ctrl.getModel(), id, []string{"id", "name", "avatar", "name", "email", "mobile", "status", "role_ids"})

}

// @GetApi /user/list 列表接口
func (ctrl User) List(c *gin.Context, params UserFilter) (interface{}, consts.ErrCode, error) {
	filter := db.Filter{}
	if params.Id != 0 {
		filter["id"] = params.Id
	}
	if params.Name != "" {
		filter["nickname"] = map[string]string{
			"like": params.Name + "%",
		}
	}
	_, exists := c.Request.Form["status"]
	if exists {
		filter["status"] = params.Status
	}
	var response responseList
	list, code, err := ctrl.BaseController.ListRecord(c, ctrl.getModel(), filter, []string{"name", "nickname", "id", "avatar", "email", "mobile", "status"})
	lib.BindToStruct(list, &response)
	for i, v := range response.List {
		_, isLogin := user.State{}.IsLogin(v.Id)
		if isLogin {
			response.List[i].IsLogin = 1
		}
	}

	return response, code, err
}

func (ctrl User) getModel() db.Model {
	return model.User
}
