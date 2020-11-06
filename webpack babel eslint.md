# webpack babel eslint



### webpack 核心概念:

- Entry: 入口
- Module:模块，webpack中一切皆是模块
- Chunk:代码库，一个chunk由十多个模块组合而成，用于代码合并与分割
- Loader:模块转换器，用于把模块原内容按照需求转换成新内容
- Plugin:扩展插件，在webpack构建流程中的特定时机注入扩展逻辑来改变构建结果或做你想要做的事情
- Output: 输出结果

### webpack流程:

webpack启动后会从 Entry 里配置的 Module 开始递归解析 Entry 依赖的所有Module.每找到一个Module,就会根据配置的Loader去找出对应的转换规则，对Module进行转换后，再解析出当前的Module依赖的Module.这些模块会以Entry为单位进行分组，一个Entry和其所有依赖的Module被分到一个组也就是一个Chunk。最好Webpack会把所有Chunk转换成文件输出。在整个流程中Webpack会在恰当的时机执行Plugin里定义的逻辑。





### 1.webpack简单配置

安装webpack的依赖

```shell
npm install --save-dev webpack webpack-cli
```

webpack.config.js的配置

```js
const path = require("path");

module.exports = {

  mode: "test",

  entry: ["./src/index.js"],

  output: {

    path: path.resolve(__dirname, "dist"),

    filename: "[name].js"

  },
  module: {}

};

```

在package.json添加脚本

```json
    "scripts": {
        "build": "webpack --mode production --progress"
    },
```

##### –mode

用来指定使用哪种模式，有三种production，development、none，如果使用production会专门对正式环境做一些优化如移除map文件，添加代码压缩等，如果是development则会有开启一些开发环境的功能。本地开发的时候用webpack-dev-server启动会用development模式，打包上传线上用的时候会用production模式。

##### --progress 

显示进度条

##### --watch

监听变动并自动打包

##### webpack --config XXX.js

使用另一份配置文件（比如webpack.config2.js）来打包



### 2.安装babel

```shell
npm install --save-dev @babel/core babel-loader @babel/preset-env @babel/cli babel-loader @babel/plugin-transform-runtime

```



**@babel/core** 是最基础的2个依赖，结合使用可以把js代码解析成AST，传给plugins，然后再反解析会来编译结果

**@babel/preset-env** 是babel plugins的预设，它能根据配置，很智能的配置需要的plugins

**@babel/cli**是babel自带的命令行集成工具，常见的api进行了如下。

##### 1，输出类，包括文件夹的名称，文件的名称，输出的格式，是否编译等等

| --out-file           | 输出文件名称                     | npx babel script.js --out-file script-compiled.js            |
| -------------------- | -------------------------------- | ------------------------------------------------------------ |
| --watch              | 文件监控                         | npx babel script.js --watch --out-file script-compiled.js    |
| --source-maps        | 生成.js.map文件                  | npx babel script.js --out-file script-compiled.js --source-maps |
| --source-maps inline | 在生成的文件中插入source.map注释 | npx babel script.js --out-file script-compiled.js --source-maps inline |
| --out-dir            | 输出文件夹                       | npx babel src --out-dir lib                                  |
| --copy-files         | 复制文件                         | npx babel src --out-dir lib --copy-files                     |
| <                    | 通过stdin导入文件                | npx babel --out-file script-compiled.js < script.js          |
| --out-file-extension | 指定扩展名称                     | babel src/ lib/ --out-file-extension .mjs                    |

##### 2，插件和预设，指定编译代码时的插件或者预设

| --plugins=    | 指定plugins    | npx babel script.js --out-file script-compiled.js --plugins=@babel/proposal-class-properties,@babel/transform-modules-amd |
| ------------- | -------------- | ------------------------------------------------------------ |
| --presets=    | 指定presets    | npx babel script.js --out-file script-compiled.js --presets=@babel/preset-env,@babel/flow |
| --config-file | 指定configPath | npx babel --config-file /path/to/my/babel.config.json --out-dir dist ./src |

##### 3，忽略文件

| --ignore          | 忽略文件       | npx babel src --out-dir lib --ignore "src/**/*.spec.js","src/**/*.test.js" |
| ----------------- | -------------- | ------------------------------------------------------------ |
| --no-copy-ignored | 不拷贝忽略文件 | npx babel src --out-dir lib --copy-files --no-copy-ignored   |
| --no-babelrc      | 忽略.babelrc   | npx babel --no-babelrc script.js --out-file script-compiled.js --presets=es2015,react |

**babel-loader**  loader 让 webpack 能够去处理那些非 JavaScript 文件（webpack 自身只理解
 JavaScript）。loader 可以将所有类型的文件转换为 webpack 能够处理的有效模块，然后你就可以利用 webpack的打包能力，对它们进行处理。虽然webpack本身就能够处理`.js文件`，但无法对ES2015+的语法进行转换，babel-loader的作用正是实现对使用了ES2015+语法的`.js`文件进行处理。

**@babel/plugin-transform-runtime **babel 转义 async 语法会使用regeneratorRuntime 这个变量 但是这个变量在最终的代码里未定义会报错 babel 在转译的时候，会将源代码分成 syntax 和 api 两部分来处理：

- syntax：类似于展开对象、optional chain、let、const 等语法
- api：类似于 [1,2,3].includes 等函数、方法

@babel/plugin-transform-runtime的作用就是

吧babel 转义出来的require 

helpers 从之前的原地定义改为了从一个统一的模块中引入，使得打包的结果中每个 helper 只会存在一个，解决了第二个问题





### 3.安装eslint

如果你使用的默认解析器的话，且在代码中使用了浏览器有兼容性的问题的js新特性，使用webpack编译就会出现问题，这时我们一般装最新的eslint或者安装是使用 `babel-eslint` 来解决问题。