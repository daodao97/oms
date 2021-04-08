package menu

// 菜单级联选择器备选项构建
type TreeSelect struct {
	Value    int          `json:"value"`
	Label    string       `json:"label"`
	Children []TreeSelect `json:"children"`
}

func GetMenuSelect(id int) []TreeSelect {
	userRoute := GetRoutes(id)
	return getMenuSelect(userRoute, 0)
}

func getMenuSelect(menuList []Route, pid int) []TreeSelect {
	var treeList []TreeSelect
	for _, v := range menuList {
		if v.Pid == pid {
			child := getMenuSelect(menuList, v.Id)
			node := TreeSelect{
				Value: v.Id,
				Label: v.Name,
			}
			node.Children = child
			treeList = append(treeList, node)
		}
	}
	return treeList
}
