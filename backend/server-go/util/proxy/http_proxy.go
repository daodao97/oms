package proxy

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"

	"github.com/daodao97/egin/utils"
)

type buResponse struct {
	Code    int         `json:"code"`
	Data    interface{} `json:"data"`
	Message string      `json:"message"`
}
type myResponse struct {
	Code    int         `json:"code"`
	Payload interface{} `json:"payload"`
}

func BuProxy(writer http.ResponseWriter, request *http.Request, path string) error {
	buBaseAPi := os.Getenv("BU_PROXY_API")
	remote, err := url.Parse(buBaseAPi)
	if err != nil {
		return err
	}

	proxy := httputil.NewSingleHostReverseProxy(remote)
	proxy.Director = func(req *http.Request) {
		req.Header = request.Header
		req.Host = remote.Host
		req.URL.Scheme = remote.Scheme
		req.URL.Host = remote.Host
		req.URL.Path = path
		mac := utils.Mac{AccessKey: os.Getenv("BU_PROXY_AK"), SecretKey: []byte(os.Getenv("BU_PROXY_SK"))}
		token, _ := mac.SignRequest(req)
		req.Header.Set("Authorization", fmt.Sprintf("%s %s", os.Getenv("BU_PROXY_TOKEN_PREFIX"), token))
	}

	proxy.ModifyResponse = func(r *http.Response) error {
		b, _ := ioutil.ReadAll(r.Body)
		var result buResponse
		_ = json.Unmarshal(b, &result)
		mr := myResponse{
			Code:    result.Code,
			Payload: result.Data,
		}
		strB, _ := json.Marshal(mr)
		buf := bytes.NewBufferString(string(strB))
		buf.Write(b)
		r.Body = ioutil.NopCloser(buf)
		r.Header["Content-Length"] = []string{fmt.Sprint(buf.Len())}
		return nil
	}

	proxy.ServeHTTP(writer, request)
	return nil
}
