package controller

import (
	"encoding/json"
	"io/ioutil"

	"github.com/daodao97/egin/egin/consts"
	"github.com/daodao97/egin/egin/db"
	"github.com/daodao97/egin/egin/lib"
	"github.com/gin-gonic/gin"

	"oms/model"
	"oms/service/scaffold"
)

// @Controller
type CommonConfig struct {
	scaffold.BaseController
}

type CommonConfigFilter struct {
	Name  string `form:"name" json:"name"`
	Title string `form:"title" json:"title"`
}

type CommonConfigForm struct {
	Id          int    `json:"id"`
	Name        string `json:"name" comment:"配置名, 字母"`
	Title       string `json:"title" comment:"可读配置名"`
	Remark      string `json:"remark" comment:"备注"`
	Rules       string `json:"rules" comment:"配置规则描述"`
	Value       string `json:"value" comment:"具体配置值 key:value"`
	Permissions string `json:"permissions" comment:"权限"`
	IsNeedForm  int    `json:"is_need_form" comment:"是否启用表单：0，否；1，是"`
}

// @PostApi /common_config/create
// @Summary 创建
// @Desc 创建接口 维护者: 刀刀
// @Params CommonConfigForm 接口参数所对应的结构体
// @Response
func (ctrl CommonConfig) Create(c *gin.Context, params CommonConfigForm) (interface{}, consts.ErrCode, error) {
	var paramsMap db.Record = lib.StructToMap(params)
	return ctrl.BaseController.CreateRecord(ctrl.getModel(), paramsMap)
}

// @PostApi /common_config/update/:id
// @Summary 更新接口
// @Desc 维护者: 刀刀
// @Params CommonConfigForm 接口参数所对应的结构体
// @Response
func (ctrl CommonConfig) Update(c *gin.Context, id int, params CommonConfigForm) (interface{}, consts.ErrCode, error) {
	var paramsMap db.Record = lib.StructToMap(params)
	return ctrl.BaseController.UpdateById(ctrl.getModel(), id, paramsMap)
}

// @GetApi /common_config/get/:id
func (ctrl CommonConfig) Get(c *gin.Context, id int) (interface{}, consts.ErrCode, error) {
	return ctrl.BaseController.GetById(ctrl.getModel(), id, []string{"id", "name", "title", "rules", "value", "is_need_form"})
}

// @DeleteApi /common_config/delete/:id
// @Summary 删除
// @Desc 维护者: 刀刀
// @Response
func (ctrl CommonConfig) Delete(c *gin.Context, id int) (interface{}, consts.ErrCode, error) {
	return ctrl.BaseController.DeleteRecord(ctrl.getModel(), id)
}

// @GetApi /common_config/list
// @Summary 列表接口
// @Desc 列表接口 维护者: 刀刀
// @Params CommonConfigFilter
// @Response
// @Middleware IpLimiter
func (ctrl CommonConfig) List(c *gin.Context, params CommonConfigFilter) (interface{}, consts.ErrCode, error) {
	filter := db.Filter{}
	if params.Name != "" {
		filter["name"] = map[string]string{"like": params.Name + "%"}
	}
	if params.Title != "" {
		filter["title"] = map[string]string{"like": params.Title + "%"}
	}
	return ctrl.BaseController.ListRecord(c, ctrl.getModel(), filter, ctrl.getSelectFields())
}

func (ctrl CommonConfig) getModel() db.Model {
	return model.CommonConfig
}

// @GetApi /common_config/form_schema/:id
func (ctrl CommonConfig) FromSchema(c *gin.Context, id int) (interface{}, consts.ErrCode, error) {
	var conf model.CommonConfigEntity
	err := ctrl.getModel().FindById(id, []string{"rules"}, &conf)
	if err != nil {
		return nil, 500, err
	}
	var schema interface{}
	_ = json.Unmarshal([]byte(conf.Rules), &schema)
	return schema, 0, nil
}

// @GetApi /common_config/form_value/:id
func (ctrl CommonConfig) FormValue(c *gin.Context, id int) (interface{}, consts.ErrCode, error) {
	var conf model.CommonConfigEntity
	err := ctrl.getModel().FindById(id, []string{"value"}, &conf)
	if err != nil {
		return nil, 500, err
	}
	var value interface{}
	_ = json.Unmarshal([]byte(conf.Value), &value)
	return value, 0, nil
}

// @PostApi /common_config/save_form/:id
func (ctrl CommonConfig) SaveFrom(c *gin.Context, id int) (interface{}, consts.ErrCode, error) {
	jsonData, err := ioutil.ReadAll(c.Request.Body)
	if err != nil {
		return nil, 500, err
	}
	err = ctrl.getModel().UpdateById(id, db.Record{"value": string(jsonData)})
	if err != nil {
		return nil, 500, err
	}
	return nil, 0, nil
}

func (ctrl CommonConfig) getSelectFields() []string {
	return []string{"id", "name", "title", "rules", "value", "is_need_form", "remark"}
}
