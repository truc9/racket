package params

import "github.com/gin-gonic/gin"

func Get(c *gin.Context, p string) string {
	res, _ := c.Params.Get(p)
	return res
}
