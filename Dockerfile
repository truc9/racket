FROM golang:1.22.3

WORKDIR /app

COPY go.mod go.sum ./

RUN go mod download && go mod verify

COPY . ./

RUN go build -v -o ./app

CMD ["./app"]