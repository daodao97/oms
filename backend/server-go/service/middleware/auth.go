package middleware

import (
	"net/http"
	"strings"
	"time"

	"github.com/daodao97/egin/egin/lib"
	"github.com/daodao97/egin/egin/utils/config"
	"github.com/gin-gonic/gin"

	"github.com/daodao97/egin/egin/service/user"
	"github.com/daodao97/egin/egin/utils"

	myUser "oms/service/user"
)

func jwtAbort(c *gin.Context, msg string) {
	c.JSON(http.StatusUnauthorized, gin.H{
		"code":    http.StatusUnauthorized,
		"message": msg,
	})
	c.Abort()
}

func Auth(u user.User) gin.HandlerFunc {
	return func(c *gin.Context) {

		if _, has := lib.Find(config.Config.Jwt.OpenApi, c.Request.URL.Path); has {
			c.Next()
			return
		}
		authHeader := c.Request.Header.Get("Authorization")
		if authHeader == "" {
			c.JSON(200, map[string]interface{}{
				"code":    401,
				"message": "Authorization Failed.",
			})
			c.Abort()
			return
		}

		parts := strings.SplitN(authHeader, " ", 2)
		if !(len(parts) == 2 && parts[0] == "Bearer") {
			c.JSON(200, map[string]interface{}{
				"code":    401,
				"message": "Authorization Failed.",
			})
			c.Abort()
			return
		}

		claims, err := utils.ParseToken(parts[1])
		if err != nil {
			c.JSON(200, map[string]interface{}{
				"code":    401,
				"message": "无效的Token "+err.Error(),
			})
			c.Abort()
			return
		}

		if time.Now().Unix() > claims.ExpiresAt {
			c.JSON(200, map[string]interface{}{
				"code":    401,
				"message": "Token已过期",
			})
			c.Abort()
			return
		}

		info, err := u.Info(claims.UserID)
		if err != nil {
			c.JSON(200, map[string]interface{}{
				"code":    401,
				"message": "用户状态异常"+err.Error(),
			})
			c.Abort()
			return
		}

		_, isLogin := myUser.State{}.IsLogin(info.Id)

		if !isLogin {
			c.JSON(200, map[string]interface{}{
				"code":    401,
				"message": "登录状态已失效, 请重新登录",
			})
			c.Abort()
			return
		}

		if info.Id != claims.UserID {
			c.JSON(200, map[string]interface{}{
				"code":    401,
				"message": "无效的token",
			})
			c.Abort()
			return
		}

		c.Set("user", info)
		c.Next()
	}
}
