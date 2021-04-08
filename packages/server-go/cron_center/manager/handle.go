package manager

import (
	"bufio"
	"bytes"
	"fmt"
	"os/exec"

	"github.com/prometheus/common/log"
	uuid "github.com/satori/go.uuid"

	"oms/cron_center/ws"
)

// job type name map
var typeMap = []string{"func", "shell"}

// 指定类型 job 的处理句柄
var typeHandle = map[string]func(j CronJobEntity, manager *ws.Manager) func(){
	"func": func(j CronJobEntity, manager *ws.Manager) func() {
		funcs := getLocalJobHandle()
		return func() {
			id := uuid.NewV4().String()
			manager.SendGroup(j.Name, []byte(getStartMsg(id, j.Name)))
			if handle, ok := funcs[j.Name]; ok {
				handle()
			}
			manager.SendGroup(j.Name, []byte(getEndMsg(id, j.Name)))
		}
	},
	"shell": func(j CronJobEntity, manager *ws.Manager) func() {
		return func() {
			id := uuid.NewV4().String()
			manager.SendGroup(j.Name, []byte(getStartMsg(id, j.Name)))
			reader, err := cmd(j.Config.Command)
			if err == nil {
				line, end := reader.ReadString('\n')
				for end == nil {
					manager.SendGroup(j.Name, []byte(msgWrap(id, j.Name, line)))
					line, end = reader.ReadString('\n')
				}
			} else {
				log.Error(err)
				manager.SendGroup(j.Name, []byte(msgWrap(id, j.Name, err.Error())))
			}
			manager.SendGroup(j.Name, []byte(getEndMsg(id, j.Name)))
		}
	},
}

const ShellToUse = "bash"

// 执行shell命令, 并流式获取标准输出
func cmd(command string) (*bufio.Reader, error) {
	cmd := exec.Command(ShellToUse, "-c", command)
	pipe, err := cmd.StdoutPipe()
	var stderr bytes.Buffer
	cmd.Stderr = &stderr
	if err != nil {
		return nil, err
	}
	if err := cmd.Start(); err != nil {
		return nil, err
	}
	// errStr := string(stderr.Bytes())
	reader := bufio.NewReader(pipe)
	go func() {
		if err := cmd.Wait(); err != nil {
			fmt.Printf("Child process %d exit with err: %v\n", cmd.Process.Pid, err)
		}
	}()
	return reader, nil
}
