// ****************************
// 该文件为系统生成, 请勿更改
// ****************************
package config

import (
	"github.com/gin-gonic/gin"

	"oms/config/routes"
)

func RegRouter(r *gin.Engine) {

	routes.RegCommonConfigRouter(r)

	routes.RegCronJobRouter(r)

	routes.RegFrontRouteRouter(r)

	routes.RegRoleRouter(r)

	routes.RegSystemRouter(r)

	routes.RegUserRouter(r)

}
