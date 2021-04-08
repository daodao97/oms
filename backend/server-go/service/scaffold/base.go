package scaffold

import (
	"fmt"
	"strconv"

	"github.com/daodao97/egin/egin/consts"
	"github.com/daodao97/egin/egin/db"
	"github.com/daodao97/egin/egin/lib"
	userInstance "github.com/daodao97/egin/egin/service/user"
	"github.com/gin-gonic/gin"
)

type Page struct {
	Total int `json:"total"`
	Page  int `json:"page"`
}

type ListResponse struct {
	List []map[string]interface{} `json:"list"`
	Page `json:"page"`
}

type PageFilter struct {
	Page int `form:"_page"`
	Size int `form:"_size"`
}

type OrderBy struct {
	Field string `json:"_sort_by"`
	Type  string `json:"_sort_type"`
}

type ListAttr struct {
	Page  int    `form:"_page"`
	Size  int    `form:"_size"`
	Field string `json:"_sort_by"`
	Type  string `json:"_sort_type"`
}

type BaseController struct {
}

func (b BaseController) ListRecord(c *gin.Context, _model db.Model, filter db.Filter, selectFields []string) (interface{}, consts.ErrCode, error) {
	count, err := _model.SelectCount(filter)
	result := make([]map[string]interface{}, 0)
	response := ListResponse{
		List: result,
		Page: Page{Total: 0, Page: 1},
	}
	var code consts.ErrCode
	if err != nil {
		code = 500
		return response, code, err
	}
	if count == 0 {
		return response, 0, nil
	}
	size, _ := strconv.Atoi(c.Request.FormValue("_size"))
	page, _ := strconv.Atoi(c.Request.FormValue("_page"))
	sortBy := c.Request.FormValue("_sort_by")
	sortType := c.Request.FormValue("_sort_type")
	listAttr := ListAttr{
		Page:  lib.Ternary(page, page, 1).(int),
		Size:  lib.Ternary(size, size, 20).(int),
		Field: lib.Ternary(sortBy, sortBy, "id").(string),
		Type:  lib.Ternary(sortType, sortType, "desc").(string),
	}
	attr := db.Attr{
		Select:  selectFields,
		OrderBy: fmt.Sprintf("%s %s", listAttr.Field, listAttr.Type),
		Limit:   size,
		Offset:  (page - 1) * size,
	}
	err = _model.Select(filter, attr, &result)
	if err != nil {
		code = 500
	}
	response.List = result
	response.Page.Total = count
	response.Page.Page = page
	return response, code, err
}

func (b BaseController) DeleteRecord(_model db.Model, id int) (interface{}, consts.ErrCode, error) {
	_, affected, err := _model.Delete(db.Filter{
		"id": id,
	})
	if err != nil {
		return nil, 0, err
	}
	return affected, 0, nil
}

func (b BaseController) GetById(_model db.Model, id int, fields []string) (interface{}, consts.ErrCode, error) {
	var result interface{}
	err := _model.FindById(id, fields, &result)
	return result, 0, err
}

func (b BaseController) UpdateById(_model db.Model, id int, record db.Record) (interface{}, consts.ErrCode, error) {
	_, affected, err := _model.Update(db.Filter{"id": id}, record)
	var code consts.ErrCode
	if err != nil {
		code = consts.ErrorSystem
	}
	return affected, code, err
}

func (b BaseController) CreateRecord(_model db.Model, record db.Record) (interface{}, consts.ErrCode, error) {
	lastId, _, err := _model.Insert(record)
	var code consts.ErrCode
	if err != nil {
		code = consts.ErrorSystem
	}
	var result struct {
		LastId int64 `json:"last_id"`
	}
	result.LastId = lastId
	return result, code, err
}

func (b BaseController) GetUser(c *gin.Context) (userInstance.Info, error) {
	info, exists := c.Get("user")
	if !exists {
		return userInstance.Info{}, nil
	}
	me := info.(userInstance.Info)
	return me, nil
}
