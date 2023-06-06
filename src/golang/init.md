# golang知识


链接：
> [Golang 微框架 Gin 简介](https://www.jianshu.com/p/a31e4ee25305)
>
> [go教程网址](https://laravelacademy.org/post/21861)
> []()
> []()
> []()
> 
> 


```go
package main

import (
	"fmt"
	"io/ioutil"
)

func main() {

	fmt.Println("Test")

	//
	dir, _ := ioutil.ReadDir("F:\\project\\java\\hqqich.github.io\\src\\onenote")

	for i := range dir {
		info := dir[i]

		isDir := info.IsDir()
		if isDir {
			continue
		}

		name := info.Name()
		result := name[0 : len(name)-3]

		fmt.Println("  - [" + result + "](onenote/" + name + ")")
	}

}
```