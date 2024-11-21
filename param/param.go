package param

import "github.com/gin-gonic/gin"

func FromRoute(c *gin.Context, p string) string {
	res, _ := c.Params.Get(p)
	return res
}

func FromQuery(c *gin.Context, p string) string {
	res := c.DefaultQuery(p, "")
	return res
}
