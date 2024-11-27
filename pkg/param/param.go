package param

import (
	"strconv"

	"github.com/gin-gonic/gin"
)

func FromRoute(c *gin.Context, p string) string {
	res, _ := c.Params.Get(p)
	return res
}

func FromRouteUInt(c *gin.Context, p string) uint {
	str, _ := c.Params.Get(p)
	u64, _ := strconv.ParseUint(str, 10, 32)
	return uint(u64)
}

func FromQuery(c *gin.Context, p string) string {
	res := c.DefaultQuery(p, "")
	return res
}
