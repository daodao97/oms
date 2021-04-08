package menu

import (
	"encoding/json"
	"strconv"

	"oms/model"
)

type TreeOptions struct {
	Value    string        `json:"value"`
	Label    string        `json:"label"`
	ModuleId int           `json:"-"`
	Children []TreeOptions `json:"children,omitempty"`
}

func GetMenuOptions(id int) []TreeOptions {
	userRoute := GetRoutes(id)
	return getMenuOptions(userRoute, 0)
}

func getMenuOptions(menuList []Route, pid int) []TreeOptions {
	var treeList []TreeOptions
	for _, v := range menuList {
		if v.Pid == pid {
			child := getMenuOptions(menuList, v.Id)
			node := TreeOptions{
				Value:    strconv.Itoa(v.Id),
				Label:    v.Name,
				ModuleId: v.ModuleId,
			}
			node.Children = child
			if v.PageType == model.PageTypeTable || v.PageType == model.PageTypeForm {
				node.Children = pageSchemaResourceList(v.PageSchema)
			}
			treeList = append(treeList, node)
		}
	}
	return treeList
}

func pageSchemaResourceList(schemaString string) []TreeOptions {
	var pageSchema schema
	_ = json.Unmarshal([]byte(schemaString), &pageSchema)
	var options []TreeOptions

	var formItemOptions []TreeOptions
	if len(pageSchema.FormItems) > 0 {
		for _, v := range pageSchema.FormItems {
			formItemOptions = append(formItemOptions, TreeOptions{Value: v.Field, Label: v.Label})
		}
	}
	if len(formItemOptions) > 0 {
		options = append(options, TreeOptions{
			Value:    "formItems",
			Label:    "表单项",
			Children: formItemOptions,
		})
	}

	if pageSchema.SaveApi != "" {
		options = append(options, TreeOptions{
			Value: "saveApi",
			Label: "保存表单",
		})
	}

	var tableFilterOptions []TreeOptions
	if len(pageSchema.Filter) > 0 {
		for _, v := range pageSchema.Filter {
			tableFilterOptions = append(tableFilterOptions, TreeOptions{Value: v.Field, Label: v.Label})
		}
	}
	if len(tableFilterOptions) > 0 {
		options = append(options, TreeOptions{
			Value:    "filter",
			Label:    "筛选条件",
			Children: tableFilterOptions,
		})
	}
	var tableHeaderOptions []TreeOptions
	if len(pageSchema.Headers) > 0 {
		for _, v := range pageSchema.Headers {
			tableHeaderOptions = append(tableHeaderOptions, TreeOptions{Value: v.Field, Label: v.Label})
		}
	}
	if len(tableHeaderOptions) > 0 {
		options = append(options, TreeOptions{
			Value:    "headers",
			Label:    "列表项",
			Children: tableHeaderOptions,
		})
	}

	var tableNormalButton []TreeOptions
	if len(pageSchema.NormalButton) > 0 {
		for _, v := range pageSchema.NormalButton {
			text := v.Text
			if text == "" && v.Tips != "" {
				text = v.Tips
			}
			tableNormalButton = append(tableNormalButton, TreeOptions{Value: v.Target, Label: text})
		}
	}
	if len(tableNormalButton) > 0 {
		options = append(options, TreeOptions{
			Value:    "normalButton",
			Label:    "列表按钮",
			Children: tableNormalButton,
		})
	}

	var tableBatchButton []TreeOptions
	if len(pageSchema.BatchButton) > 0 {
		for _, v := range pageSchema.BatchButton {
			text := v.Text
			if text == "" && v.Tips != "" {
				text = v.Tips
			}
			tableBatchButton = append(tableBatchButton, TreeOptions{Value: v.Target, Label: text})
		}
	}
	if len(tableBatchButton) > 0 {
		options = append(options, TreeOptions{
			Value:    "batchButton",
			Label:    "批量按钮",
			Children: tableBatchButton,
		})
	}

	var tableRowButton []TreeOptions
	if len(pageSchema.RowButton) > 0 {
		for _, v := range pageSchema.RowButton {
			text := v.Text
			if text == "" && v.Tips != "" {
				text = v.Tips
			}
			tableRowButton = append(tableRowButton, TreeOptions{Value: v.Target, Label: text})
		}
	}
	if len(tableRowButton) > 0 {
		options = append(options, TreeOptions{
			Value:    "rowButton",
			Label:    "行操作按钮",
			Children: tableRowButton,
		})
	}

	return options
}

type filter struct {
	Label string `json:"label"`
	Field string `json:"field"`
}
type header struct {
	Label string `json:"label"`
	Field string `json:"field"`
}
type normalButton struct {
	Text   string `json:"text"`
	Tips   string `json:"tips"`
	Target string `json:"target"`
}
type rowButton struct {
	Text   string `json:"text"`
	Tips   string `json:"tips"`
	Target string `json:"target"`
}
type batchButton struct {
	Text   string `json:"text"`
	Tips   string `json:"tips"`
	Target string `json:"target"`
}
type formItems struct {
	Label string `json:"label"`
	Field string `json:"field"`
}
type schema struct {
	Filter       []filter       `json:"filter"`
	Headers      []header       `json:"headers"`
	NormalButton []normalButton `json:"normalButton"`
	RowButton    []rowButton    `json:"rowButton"`
	BatchButton  []batchButton  `json:"batchButton"`
	FormItems    []formItems    `json:"formItems"`
	SaveApi      string         `json:"saveApi"`
	GetApi       string         `json:"getApi"`
	ListApi      string         `json:"listApi"`
}
