package logger

import "go.uber.org/zap"

func NewLogger() *zap.SugaredLogger {
	var zapLogger *zap.Logger
	zapLogger, _ = zap.NewDevelopment()
	logger := zapLogger.Sugar()
	defer logger.Sync()
	return logger
}
