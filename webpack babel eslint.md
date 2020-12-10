

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

1.语法转换

2.API的转换

3.Promise,Object.assign





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



```shell
npm install core-js@3 --save
```

**core-js@3**   阅读并查阅babel官方文档以后发现原来在`Babel 7.4.0`以后，`@babel/polyfill`这个包就会被移除了。官方叫我们直接使用`core-js`来代替`@babel/polyfill`的作用

修改配置

```json
    "presets": [
        [
            "@babel/preset-env",
            {
                "useBuiltIns": "usage",
                "corejs": {
                    "version": 3,
                    "proposals": true
                }
            }
        ]
    ],
```



### 3.安装eslint

如果你使用的默认解析器的话，且在代码中使用了浏览器有兼容性的问题的js新特性，使用webpack编译就会出现问题，这时我们一般装最新的eslint或者安装是使用 `babel-eslint` 来解决问题。



1.安装eslint eslint-loader eslint-friendly-formatter

```shell
npm install --save-dev eslint
```

```
npm install --save eslint-friendly-formatter eslint-loader
```

eslint-friendly-formatter 可以让eslint的错误信息出现在终端上

@babel/eslint-parser 用于允许你使用 ESLint 校验所有 babel code  

> babel-eslint 不再维护和更新





2.在 `webpack.config.js` 中添加如下代码：

```js
  module: {
    rules: [{
      test: /\.js$/,
      exclude: [/node_modules/],
      use: ['eslint-loader'],
      enforce: 'pre',//编译前检查
      include: [path.resolve(__dirname, 'src')],//指定检查目标
      options: { // 这里的配置项参数将会被传递到 eslint 的 CLIEngine 
                    formatter: require('eslint-friendly-formatter') // 指定错误报告的格式规范
                }
    }],
  },
```

3.创建一个.eslintrc.js配置

```
npx eslint --init //初始化  选择如何配置eslint 之后会生成配置文件.eslintrc
```



也可以直接新建一个文件夹

```js
module.exports = {
	// 默认情况下，ESLint会在所有父级组件中寻找配置文件，一直到根目录。ESLint一旦发现配置文件中有 	"root": true，它就会停止在父级目录中寻找。
    root: true,
    //对Babel解析器的包装使其与 ESLint 兼容。
  	//parser: '@babel/eslint-parser',取决于是否使用babel或者vue的parse
    parserOptions: {
        sourceType: 'module'//按照模块解析
    },
    // 预定义的全局变量，这里是浏览器环境
    env: {
        browser: true,
    },
    // 扩展一个流行的风格指南
    extends: 'standard',
    plugins: [
    // 此插件用来识别.html 和 .vue文件中的js代码
    'html',
    // standard风格的依赖包
    "standard",
    // standard风格的依赖包
    "promise"
  	],
    rules: {
        "indent": ["error", 2],
        "quotes": ["error", "double"],
        "semi": ["error", "always"],
        "no-console": "error",
        "arrow-parens": 0
    }
}
```

### eslint 配置项

- root 限定配置文件的使用范围
- parser 指定eslint的解析器
- parserOptions 设置解析器选项
- extends 指定eslint规范
- plugins 引用第三方的插件
- env 指定代码运行的宿主环境
- rules 启用额外的规则或覆盖默认的规则
- globals 声明在代码中的自定义全局变量

#### extends

我们可以使用eslint官方推荐的，也可以使用一些大公司提供的的，如：aribnb, google, standard。

在开发中我们一般使用第三方的。

#### 官方推荐

只需在 `.eslintrc.js` 中添加如下代码：

```js
extends: 'eslint:recommended',
extends: 'eslint:all',
```

了解详情可以参考一下[官方规则表](http://eslint.cn/docs/rules/)

#### 第三方分享

使用第三方分享的，我们一般需要安装相关的插件代码如下：

```shell
npm install --save-dev eslint-config-airbnb // bnb
npm install --save-dev eslint-config-standard // standard
```

在 `.eslintrc.js` 中添加如下代码：

```js
extends: 'eslint:google',
// or
extends: 'eslint:standard',
```

使用这些第三方的扩展，有时我们需要更新一些插件，比如standard：

[eslint-plugin-import](https://github.com/lvzhenbang/webpack-learning/tree/master/doc/first/imgs/eslint-1.png)

不要慌，我们只要按照错误提示一步一步的安装这些插件即可。

虽然，这些第三方的扩展很不错，但是有时我们需要定义一些比较个性化的规则，我们就需要添加 `rules` 配置项。

#### 配置规则

在`.eslintrc.js` 文件中添加 `rules`, 代码如下：

```js
{
    "rules": {
        "semi": ["error", "always"],
        "quotes": ["error", "double"]
    }
}
```

"semi" 和 "quotes" 是 ESLint 中 规则 的名称。第一个值是错误级别，可以使下面的值之一：

- "off" or 0 - 关闭规则
- "warn" or 1 - 将规则视为一个警告（不会影响退出码）
- "error" or 2 - 将规则视为一个错误 (退出码为1)

这些规则一般分为两类：

- 添加默认或第三库中没有的
- 覆盖默认或第三库的

我们的项目中可能会有一些其他的文件也需要进行格式规范，如：html, vue, react等，对于这些文件的处理，我们需要引入第三方插件。

#### plugins（html）

安装 `eslint-plugin-html` ，命令如下：

```shell
npm install --save-dev eslint-plugin-html
```

这个插件将会提醒模块脚本之间模拟浏览器共享全局变量的行为，因为这不适用于模块脚本。

这个插件也可以扩展文件，如：.vue，.jsx

`.eslintrc.js`中，添加如下配置项：

```js
settings: {
    'html/html-extensions': ['.html', '.vue'],
    'html/indent': '+2',
},
```

而对于这种用 `eslint-pulgin-html` 扩展的的文件我们可以使用 `eslint --ext .html,.vue src` 进行检测，如果想要在开发中边写边检测，我们可以使用相应文件的loader进行处理。然后执行 `npm run dev` 就可以实现的功能。边写边检测的功能。

在开发中有时根据需要，我们可能在同一个项目不同的目录使用不同的 `.eslintrc.js` 文件，这时我们就需要使用配置项 `root` 。



#### 限定使用范围 (root: true)

如果我们想要在不同的目录中使用不同的 `.eslintrc`, 我们就需要在该目录中添加如下的配置项：

```js
{
    "root": true
}
```

如果我们不设置的话，它将会继续查找，知道更目录，如果更目录有配置文件它将会使用根目录的，这样会导致当前配置目录配置无法起作用的问题。

在开发中针对不同的情况我们要使用不同的解析器，而我们常用的就是 `babel-eslint` 。

#### parser（指定解析器）

`babel-eslint` 解析器是一种使用频率很高的解析器，因为现在很多公司的很多项目目前都使用了es6，为了兼容性考虑基本都使用babel插件对代码进行编译。而用babel编译后的代码使用 `babel-eslint` 这款解析器可以避免不必要的麻烦。

`babel-eslint` 安装命令：

```shell
npm install --save-dev babel-eslint
```

在 `.eslintrc.js` 配置文件中添加如下配置项代码：

```js
parser: 'babel-eslint',
```

如果你使用的默认解析器的话，且在代码中使用了浏览器有兼容性的问题的js新特性，使用webpack编译就会出现问题，这时我们一般装最新的eslint或者安装是使用 `babel-eslint` 来解决问题。

### env（环境）

在 `.eslintrc.js` 中添加如下代码：

```js
"env": {
    "browser": true, //
    "node": true //
}
```

指定了环境，你就可以放心的使用它们的全局变量和属性。

### global

指定全局变量。

在 `.eslintrc.js` 中添加如下代码：

```
"globals": {
    "var1": true,
    "var2": false 
}
```



## vue 如何配置 ESLint(修改parse)

## babel 如何配置eslint(修改parse)