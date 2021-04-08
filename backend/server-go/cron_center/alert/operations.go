package alert

import (
	"errors"
	"time"

	"github.com/techxmind/filter/core"
)

// Register operation "contains" to check if variable contains specified substring
// ["url", "contains", "something"]
func Reg() {
	core.GetOperationFactory().Register(&DurationOverOperation{}, "duration_over") // time difference now gt
}

// 当前时间 与 目标时间 的 差值 大于 ***
type DurationOverOperation struct{}

func (o *DurationOverOperation) String() string {
	return "duration_over"
}

func (o *DurationOverOperation) Run(ctx *core.Context, variable core.Variable, value interface{}) bool {
	cmpValue := core.GetVariableValue(ctx, variable)

	duration, err := time.ParseDuration(value.(string))
	if err != nil {
		return false
	}

	layout := "2006-01-02 15:04:05"
	t, err := time.Parse(layout, cmpValue.(string))
	if err != nil {
		return false
	}
	return time.Now().Unix()-t.Unix() > int64(duration.Seconds())
}

func (o *DurationOverOperation) PrepareValue(v interface{}) (interface{}, error) {
	if str, ok := v.(string); ok {
		return str, nil
	}

	return nil, errors.New("[duration_over] operation require value of type string")
}
