package common_config

import (
	"encoding/json"

	"github.com/daodao97/egin/db"
	"github.com/pkg/errors"

	"oms/model"
)

func getValueByName(name string) (value string, err error) {
	var bind []map[string]interface{}
	err = model.CommonConfig.Select(db.Filter{"name": name}, db.Attr{Select: []string{"value"}}, &bind)
	if err != nil {
		return "", err
	}
	if len(bind) == 0 {
		return "", errors.New("not found")
	}
	value, ok := bind[0]["value"].(string)
	if !ok {
		return "", errors.New("not found")
	}
	return value, nil
}

func bindValueToStruct(name string, bind interface{}) error {
	v, err := getValueByName(name)
	if err != nil {
		return err
	}
	err = json.Unmarshal([]byte(v), bind)
	if err != nil {
		return err
	}
	return nil
}

type Website struct {
	Title   string `json:"title"`
	Modules []struct {
		Id    int    `json:"id"`
		Label string `json:"label"`
	} `json:"modules"`
}

func GetWebsite() (value Website, err error) {
	err = bindValueToStruct("website", &value)
	return value, err
}
