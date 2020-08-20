##  前言

http请求之前已经接触了很多，但是这个`options`请求我还是第一次，刚来到公司的时候进行调试，发现`NetWork`里，每个请求在发出之前都会先发送一个`options`请求，第二个才是正常的请求。先来看下MDN官方的解释。


## MDN

> HTTP 的 `OPTIONS` 方法 用于获取目的资源所支持的通信选项。客户端可以对特定的 URL 使用 `OPTIONS` 方法，也可以对整站（通过将 URL 设置为“*”）使用该方法。

作用：
1. 检测服务器所支持的请求方法
2. CORS 中的预检请求(preflight request)

## 出现原因

在说`OPTIONS`请求出的原因之前，要先说下浏览器的[同源策略](https://developer.mozilla.org/zh-CN/docs/Web/Security/Same-origin_policy)和[跨域资源共享 CORS](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Access_control_CORS#Requests_with_credentials)

### 同源策略

如果两个`URL`的协议(protocol)、端口（port）、主机（host）,都相同，则称这个URL为同源。
以`http://music.javaswing.cn/home/index.html`为例子：


URL | 结果 |   原因
---|---|---
http://music.javaswing.cn/static/other.html | 同源
http://music.javaswng.cn/inner/start.html | 同源
http://music.javaswing.cn:8000/other.html | 不同源 | 端口不同
https://music.javaswing.cn/inner/start.html | 不同源 | 协议不同
http://api.javaswing.cn/start.html | 不同源 | 主机不同

作用：同源策略的存在，主要是为用于限制文档与它加载的脚本如何能与另一个资源进行交互，为重要的安全策略。

比如：你本地http://localhost:3000的项目访问http://localhost:8000的项目，就会出现：**has been blocked by CORS policy**

```shell
Access to XMLHttpRequest at 'http://localhost:3000/' from origin 'http://localhost:8080' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' header is present on the requested resource.
```




### CORS

> 跨域资源共享(CORS) 是一种机制，它使用额外的 HTTP 头来告诉浏览器  让运行在一个 origin (domain) 上的Web应用被准许访问来自不同源服务器上的指定的资源。当一个资源从与该资源本身所在的服务器不同的域、协议或端口请求一个资源时，资源会发起一个跨域 HTTP 请求。

简单的来说：CORS就是两种在不同的域、协议或端口（即不在同源中），服务之间能相互访问。


### OPTIONS请求

说完了`同源策略`和`CORS`，接下来说下OPTIONS请求。在CORS机制一个域名A要访问域名B的服务，在一些特殊的复杂请求下（简单请求并不会进行预请求），浏览器必须先使用OPTIONS请求进行一个预检请求（preflight request）来获取B服务是否允许跨域请求，服务进行确认之后，才会发起真正的HTTP请求。在预检请求的返回中，服务器端也可以通知客户端，是否需要携带身份凭证（包括 Cookies 和 HTTP 认证相关数据）。

#### 简单请求
1. http方法是以下之一：
- GET
- HEAD
- POST
2. HTTP的头信息不超出以下几种字段：
- Accept
- Accept-Language
- Content-Language
- Content-Type （需要注意额外的限制）
- DPR
- Downlink
- Save-Data
- Viewport-Width
- Width

3. Content-Type 的值仅限于下列三者之一：
- text/plain
- multipart/form-data
- application/x-www-form-urlencoded

## 实例

环境：`node 10.x`  `koa`   `vue`

浏览器：火狐

本地vue环境：`localhost:8080`

本地koa地址：`localhost:3000`

1. 先把koa的后台进行设置为允许CORS,这里我没有使用中间件，是自己进行处理的。
```js
// cors跨域处理
app.use(async (ctx, next) => {
    // 允许来息所有域名的请求
    ctx.set('Access-Control-Allow-Origin', '*')
    
    // 允许HTTP请求的方法
    ctx.set('Access-Control-Allow-Methods', 'OPTIONS,DELETE,GET,PUT,POST')
    
    // 表明服务器支持所有头信息字段
    ctx.set('Access-Control-Allow-Headers', 'x-requested-with, accept, origin, content-type, token')
    
    // Content-Type表示具体请求中的媒体类型信息
    ctx.set('Content-Type', 'application/json;charset=utf-8')
    
    await next()
})
```

- vue层面简单的`GET`请求
```js
export function getList () {
    return axios({
        url: `//localhost:3000`,
        method: 'get'
    })
}
```
结果如下图：

![image](http://static.javaswing.cn/blog/normal.png)

从图中可以看到结果为正常的请求，并没有进行发出OPTIONS请求进行预检测。

- 修改vue中的请求头部分，添加一个header.token字段：
```js
export function getList () {
    return axios({
        url: `//localhost:3000`,
        method: 'get',
        headers: {token: 'test'}
    })
}
```
这里的`GET`请求，在`HEADE`中设置了`token`字段，不属于简单请求。所以发出了`OPTIONS`请求。但是，如果你只设置了`ctx`的头，你会发现，请求还是会报错
```shell
Access to XMLHttpRequest at 'http://localhost:3000/' from origin 'http://localhost:8080' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: It does not have HTTP ok status.
```
![image](http://static.javaswing.cn/blog/no-options.png)

**preflight request doesn't pass access control check**。说明的很清楚，就是options请求没有正确的响应。

解决方法有两种：
1. 给`options`请求设置正常的响应
```js
router.options('/', async (ctx, next) => {
    console.log('options');
    ctx.body = ''
})
```
2. 使用`@koa-router`中的`allowedMethods`方法

```js
app.use(router.allowedMethods())
```

从源码看`allowedMethods`
```js
Router.prototype.allowedMethods = function (options) {
  options = options || {};
  var implemented = this.methods;

  return function allowedMethods(ctx, next) {
    return next().then(function() {
      var allowed = {};

      if (!ctx.status || ctx.status === 404) {
        ctx.matched.forEach(function (route) {
          route.methods.forEach(function (method) {
            allowed[method] = method;
          });
        });

        var allowedArr = Object.keys(allowed);

        if (!~implemented.indexOf(ctx.method)) {
          // 服务器不支持该方法的情况
          if (options.throw) {
            var notImplementedThrowable;
            if (typeof options.notImplemented === 'function') {
              notImplementedThrowable = options.notImplemented();
            } else {
              notImplementedThrowable = new HttpError.NotImplemented();
            }
            throw notImplementedThrowable;
          } else {
            // 响应 501 Not Implemented
            ctx.status = 501;
            ctx.set('Allow', allowedArr.join(', '));
          }
        } else if (allowedArr.length) {
          if (ctx.method === 'OPTIONS') {
            // 获取服务器对该路由路径支持的方法集合
            ctx.status = 200;
            ctx.body = '';
            ctx.set('Allow', allowedArr.join(', '));
          } else if (!allowed[ctx.method]) {
            if (options.throw) {
              var notAllowedThrowable;
              if (typeof options.methodNotAllowed === 'function') {
                notAllowedThrowable = options.methodNotAllowed();
              } else {
                notAllowedThrowable = new HttpError.MethodNotAllowed();
              }
              throw notAllowedThrowable;
            } else {
              // 响应 405 Method Not Allowed
              ctx.status = 405;
              ctx.set('Allow', allowedArr.join(', '));
            }
          }
        }
      }
    });
  };
};

```
可以看到在这个方法里当请求方式为`OPTIONS`会进行正常的返回处理。

设置这个方法之后，再进行请求：

![image](http://static.javaswing.cn/blog/options%20get.png)

2. 使用`curl`命令进行请求

```shell
$ curl -X OPTIONS http://localhost:3000/ -i
HTTP/1.1 200 OK
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: OPTIONS,DELETE,GET,PUT,POST
Access-Control-Allow-Headers: x-requested-with, accept, origin, content-type, to
ken
Content-Type: application/json;charset=utf-8
Content-Length: 0
Allow: HEAD, GET, POST, PUT
Date: Sat, 01 Aug 2020 11:14:53 GMT
Connection: keep-alive
```

HTTP 响应首部字段解释表：

> CORS请求相关的字段，都以Access-Control-开头

字段名 | 语法 |作用
---|--- | ---
Access-Control-Allow-Origin | Access-Control-Allow-Origin: <origin> 或 * | orgin指定允许访问该资源的URL,设置为*则为任意
Access-Control-Allow-Methods | Access-Control-Allow-Methods: <method>[, <method>]* | 用于预检测请求响应，告诉浏览器实际请求支持的方法
Access-Control-Allow-Headers | Access-Control-Allow-Headers: <field-name>[, <field-name>]* | 用于预检测请求响应，告诉浏览器实际请求中允许携带的字段
Access-Control-Max-Age | Access-Control-Max-Age: <delta-seconds> | 指定浏览器preflight请求能被缓存多长时间，单位（秒）
Access-Control-Allow-Credentials | Access-Control-Allow-Credentials: true | 当浏览器的credentials设置为true时是否允许浏览器读取response的内容。在`XMLHttpRequest`中设置withCredentials为true,且设置了该属性，则会带到身份Cookies。如果Access-Control-Allow-Origin为*的，这里的一切设置都会失效。



## 如何优化
如果不想让每个CORS复杂请求都出两次请求，可以设置`Access-Control-Max-Age `这个属性。让浏览器缓存，在缓存的有效期内，所有options请求都不会发送。优化性能。
```js
app.use(async (ctx, next) => {
    // 允许来息所有域名的请求
    ctx.set('Access-Control-Allow-Origin', '*')

    // 允许HTTP请求的方法
    ctx.set('Access-Control-Allow-Methods', 'OPTIONS,DELETE,GET,PUT,POST')

    // 表明服务器支持所有头信息字段
    ctx.set('Access-Control-Allow-Headers', 'x-requested-with, accept, origin, content-type, token')

    // 设置请求preflight缓存的时间，单位 秒
    ctx.set('Access-Control-Max-Age', 10)
    })
```


## 其它问题
这里我测试的时候遇到一个问题：在火狐浏览器上options请求能显示出来，但是在chrome浏览器里就不能显示，不知道为什么

## 总结

在当前，前后端分离的开发模式下，跨域问题是经常遇到的，OPTIONS只不过CORS机制当中的一个预检测请求。而且这个请求是整个CORS机制控制的，并不能在前端用代码进行控制。主要作用：
1. 检测服务器支持的请求方法
2. CORS 中的预检请求

另外给个在线的`curl`命令工具：[https://reqbin.com/req/jecm0tqu/options-request-example](https://reqbin.com/req/jecm0tqu/options-request-example)

## 参考
- [MDN OPTIONS请求](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Methods/OPTIONS)
- [HTTP访问控制（CORS）
](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Access_control_CORS#Requests_with_credentials)
- [跨域资源共享 CORS 详解- 跨域资源共享 CORS 详解](https://www.ruanyifeng.com/blog/2016/04/cors.html)
- [玩转Koa -- koa-router](https://juejin.im/post/6844903748423122957#heading-11)