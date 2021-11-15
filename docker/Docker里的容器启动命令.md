一直对于Docker中的容器启动命令**CMD**和**ENTRYPOINT**，这两个命令不能明白其中的区别。而且对于这里的命令也一直半解。直到我遇到了一个问题，才让我彻底弄清它们。
### 问题
前提：

- 程序对应的启动命令是 `npm run online`
- **migration**对应的script是 `npm run migration:run:prod`

在做一个node后台开发完成之后，进行发布的时候。有这样一个需求：需要在程序启动前，执行数据库的**migration（数据库迁移）**操作。
​

我首先想的是在docker构建的时候使用**CMD**启动命令，在 `npm run online`前，执行下对应的**migration**操作（`npm run migration:run:prod`）即可。对应的**Dockerfile**如下：
```dockerfile
FROM node:12-alpine

# 设置工作目录
WORKDIR /home

ENV TZ="Asia/Shanghai"

# 复制文件，第一个.为宿主的当前目录，第二个点为容器的当前目录
COPY . .

# 安装npm
RUN npm install

# build
RUN npm run build

EXPOSE 7001

CMD ["npm", "run", "migration:run:prod"]

# Run npm start when the container launches
CMD ["npm", "run", "online"]

```
但是，这个`Dockerfile`文件是不正确的。
![image.png](https://cdn.nlark.com/yuque/0/2021/png/718520/1635865395587-313a9269-bd25-4edc-9141-1a20dfad5bd4.png#clientId=u0847dabe-7feb-4&from=paste&height=108&id=uc155d449&margin=%5Bobject%20Object%5D&name=image.png&originHeight=216&originWidth=1062&originalType=binary&ratio=1&size=38334&status=done&style=none&taskId=uc1e3e305-85e2-4f32-9c9d-73f958e144e&width=531)
错误很明显了，即**CMD**命令，在整个Dockerfile中只能有一个，[官方文档]()说明如下：
> There can only be one CMD instruction in a Dockerfile. If you list more than one CMD then only the last CMD will take effect.（一个 Dockerfile 中只能有一个 CMD 指令。如果你列出了多个 CMD，那么只有最后一个 CMD 会生效）

那我换成[**RUN**](https://docs.docker.com/engine/reference/builder/#run)命令呢？这个显然是不行的，毕竟**RUN**命令，是运行在docker打包的时候。也就是说在打包的时候你执行了**migration**操作，并不是在镜像启动时。
​

突然有一个机灵的想法，我可以把 `npm run migration:run:prod`和`npm run online`放到一个script里执行比如：
```json
"scripts": {
	"docker": "npm run migration:run:prod && npm run online"
}
```
嗯，这样做也是可以的，`docker`也能正常的打包成功，也正常的执行了。
但是，现在有一个问题。我现在有**生产**和**测试**两个环境。每次启动的时候对于**不同环境执**行的命令会有所不同（比如：不同的环境需要拉取不同的`docker`远程地址并启动镜像），这个问题就不能单独的使用[**CMD**](https://docs.docker.com/engine/reference/builder/#cmd)命令解决了，需要用到新的启用命令[**ENTRYPOINT**](https://docs.docker.com/engine/reference/builder/#entrypoint)。
### 命令启动格式
在说其它之前需要先介绍下目前docker下[**RUN**](https://docs.docker.com/engine/reference/builder/#run)** **[**CMD**](https://docs.docker.com/engine/reference/builder/#cmd)** **[**ENTRYPOINT**](https://docs.docker.com/engine/reference/builder/#entrypoint)这三个命令的两种格式：

1. shell 格式：`命令 <command>`（在Linux上默认为 `/bin/sh -c`，Windwows上为 `cmd /S /C`）
1. exec 格式：命令 ["executable", "param1", "param2"]

注：这里的命令可以替换成 **RUN、 CMD、 ENTRYPOINT **三者中的任一个。
由于shell格式，是默认的执行环境，在某些情况下两者是相同的:
```dockerfile
CMD echo $HOME
# 两者是等效的
CMD ["sh", "-c", "echo $HOME"]
```
注意：**由于使用exec格式在执行时会被解析成为JSON数组，在编写时必须要使用（"）双引号，而不能使用单引号(')**
在使用上一般如下：

- **RUN** 命令一般使用shell格式多点
- **CMD ENTRYPOINT **这两个命令一般使用exec格式多点
### CMD
> CMD主要是为正在执行的容器提供默认值。这些默认值可以包含可执行文件，也可以省略可执行文件，在这种情况下还需要指定**ENTRYPOINT**指令

官方的话，第一次听的时候真是“听君一席话，如君一席话。”真没有太明白。在这里我再翻译下：
CMD可以做为docker容器的默认启动命令（在docker run中没有传入新的参数），如果启动命令是ENTRYPOINT形式，那么CMD命令可以做为ENTRYPOINT的默认参数执行。
#### 命令格式
除了上面介绍的两种命令格式外，根据docker官方文件说明，居然三种命令启用格式：

- `CMD ["executable","param1","param2"]`** (**_**exec**_** form, this is the preferred form)**
- `CMD ["param1","param2"]`** (as **_**default parameters to ENTRYPOINT**_**)**
- `CMD command param1 param2`** (**_**shell**_** form)**

从官方的说明中可以看出第二种形式的命令，主要是服务于**ENTRYPOINT。**
### ENTRYPOINT
> ENTRYPOINT允许您配置一个可以执行文件在运行容器时执行。

就是在执行docker run 镜像名称 -i 会默认执行ENTRYPOINT中的文件
#### 命令格式

1. `ENTRYPOINT ["executable", "param1", "param2"]`
1. `ENTRYPOINT command param1 param2`
## 解决问题
介绍完了CMD和ENTRYPOINT这两个容器启用命令之后，在回到我们之前的问题上来。我们需要根据不同的环境去执行不拉取镜像任务，然后进行启动。借助于ENTRYPOINT命令。

1. 修改`dockerfile`如下
```dockerfile
FROM node:12-alpine

# 设置工作目录
WORKDIR /home

ENV TZ="Asia/Shanghai"

# 复制文件，第一个.为宿主的当前目录，第二个点为容器的当前目录
COPY . .

# 安装npm
RUN npm install

# build
RUN npm run build

EXPOSE 7001

# Run npm start when the container launches
ENTRYPOINT ["sh", "./scripts/docker-entrypoint.sh"]
CMD [ "daily" ]
```

2. 创建`docker-entrypoint.sh`，如下：
```shell
#!/bin/bash
DEPLOYENV=${1:-'daily'}

if [ "${DEPLOYENV}" == "main" ]; then
  # 拉取镜像代码省略
  echo 'main 环境'
  echo 'npm run typeorm:migration'
  # npm run typeorm:migration

  echo 'npm run online'
  # npm run online
else
  # 拉取镜像代码省略
  echo 'daily 环境'
  echo 'npm run typeorm:migration'
  # npm run typeorm:migration

  echo 'npm run online'
  # npm run online
fi
```
当我们执行`docker run test-docker`输出如下：
![image.png](https://cdn.nlark.com/yuque/0/2021/png/718520/1636988931769-48623b5f-6218-4ed0-9605-4bed0acd9434.png#clientId=ub8ec645d-1a7e-4&from=paste&id=u04edf5f4&margin=%5Bobject%20Object%5D&name=image.png&originHeight=70&originWidth=477&originalType=binary&ratio=1&size=9678&status=done&style=none&taskId=u7286d73f-77d3-42b9-b175-100c2fea044)
再执行 `docker run test-docker main`
![image.png](https://cdn.nlark.com/yuque/0/2021/png/718520/1636988986675-2a905d45-2cae-4e3f-8669-82d4c367cd9a.png#clientId=ub8ec645d-1a7e-4&from=paste&id=u6b252b38&margin=%5Bobject%20Object%5D&name=image.png&originHeight=66&originWidth=888&originalType=binary&ratio=1&size=13433&status=done&style=none&taskId=uf1feb139-0760-4c7f-8e85-d2869359f09)
如此我们便能通过传入不同的参数来实现不同环境的执行不同的需求了。
从这段关键代码中：
```dockerfile
ENTRYPOINT ["sh", "./scripts/docker-entrypoint.sh"]
CMD [ "daily" ]
```
我们可以总结如下：

1. 当使用ENTRYPOINT进行容器启动时，其后的CMD命令变成了其默认参数
1. 如果使用`docker run test-docker main`运行时，其中main会覆盖默认的CMD值。
## 其它
#### Docker容器启动Node服务
关于这一块我需要补充下，Docker并不是虚拟机，所有应用都应该是**前台执行。**而在虚拟机或者物理机上执行程序的时候，我们都是以后台的形式来运行程序的。最常见的我们部署[midway](https://midwayjs.org/)或者`egg`项目时：

1. 物理机或者虚拟机
```json
"start": "egg-scripts start --daemon --title=bus-real-time-server --framework=@midwayjs/web",
```

2. docker 启动部署
```json
 "online": "egg-scripts start --title=bus-real-time-server --framework=@midwayjs/web",
```
其中缺少了一个参数  `--daemon `，引用egg官网如下：
> - --daemon 是否允许在后台模式，无需 nohup。若使用 Docker 建议直接前台运行。

## 总结
**CMD**和**ENTRYPOINT**这两个命令都可以设置容器的启动执行的命令，不同的是，CMD这个命令的是可以通过在`docker run`的时候**被覆盖**（也就是说不能追加其它交互参数），而**ENTRYPOINT**这个命令，却可以在其后追加**其它交互参数**。
​

通过这个例子，个人可以总结下**ENTRYPOIT的使用场景**：

1. 当容器的启动命令**比较复杂**的时候
1. 当容器需要在**不同的环境执行不同的命令**时
## 参考

- [https://docs.docker.com/engine/reference/builder/#run](https://docs.docker.com/engine/reference/builder/#run)
- [https://vuepress.mirror.docker-practice.com/image/dockerfile/entrypoint/](https://vuepress.mirror.docker-practice.com/image/dockerfile/entrypoint/)
- [https://vuepress.mirror.docker-practice.com/image/dockerfile/cmd/](https://vuepress.mirror.docker-practice.com/image/dockerfile/cmd/)
- [https://midwayjs.org/docs/pm2#docker-%E5%AE%B9%E5%99%A8%E5%90%AF%E5%8A%A8](https://midwayjs.org/docs/pm2#docker-%E5%AE%B9%E5%99%A8%E5%90%AF%E5%8A%A8)
