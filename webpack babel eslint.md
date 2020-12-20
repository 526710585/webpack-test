





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
    
    chunkFilename: './js/[name].chunk.js',

    filename: './js/[name].js',

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
npm install --save-dev @babel/core babel-loader @babel/preset-env @babel/cli @babel/plugin-transform-runtime

```

**1.@babel/core** 是最基础的2个依赖，结合使用可以把js代码解析成AST，传给plugins，然后再反解析会来编译结果

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



**2.babel-loader**  loader 让 webpack 能够去处理那些非 JavaScript 文件（webpack 自身只理解
 JavaScript）。loader 可以将所有类型的文件转换为 webpack 能够处理的有效模块，然后你就可以利用 webpack的打包能力，对它们进行处理。虽然webpack本身就能够处理`.js文件`，但无法对ES2015+的语法进行转换，babel-loader的作用正是实现对使用了ES2015+语法的`.js`文件进行处理。



##### 3.**@babel/polyfill** 模块包括 `core-js` 和一个自定义的 `regenerator runtime` 模块，可以模拟完整的 ES2015+ 环境（不包含第4阶段前的提议）。

**补充说明 (2020/01/07)：**V7.4.0 版本开始，`@babel/polyfill` 已经被废弃(前端发展日新月异)，需单独安装 `core-js` 和 `regenerator-runtime` 模块。

不推荐使用



**4.@babel/preset-env** 是babel plugins的预设，它能根据配置，很智能的配置需要的plugins

> 这是因为babel 把 Javascript 语法为syntax 和 api， api 指那些我们可以通过 函数重新覆盖的语法 ，类似 includes， map， includes， Promise， 凡是我们能想到重写的都可以归属到api。syntax 指像箭头函数，let，const，class， 依赖注入 Decorators等等这些，我们在 Javascript在运行是无法重写的，想象下，在不支持的浏览器里不管怎么样，你都用不了 let 这个关键字。

@babel/presets默认只对syntax进行转换，我们需要使用@babel/polyfill来提供对api的的支持。

@babel/preset-env` 提供了一个 `useBuiltIns` 参数，设置值为 `usage` 时，就只会包含代码需要的 `polyfill` 。有一点需要注意：配置此参数的值为 `usage` ，必须要同时设置 `corejs





```shell
npm install core-js@3 --save
```

**5.core-js@3**   阅读并查阅babel官方文档以后发现原来在`Babel 7.4.0`以后，`@babel/polyfill`这个包就会被移除了。官方叫我们直接使用`core-js`来代替`@babel/polyfill`的作用

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

targets配置的意思就是让babel根据你写入的兼容平台来做代码转换，这里我们指定ie10为我们要兼容的最低版本

```json
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "targets": {
          "chrome": "58",
          "ie": "10"
        },
        "useBuiltIns": "usage",
        "corejs": { "version": 3, "proposals": true }
      }
    ]
  ]
}
```



**6.@babel/plugin-transform-runtime **

是一个可以重复使用 `Babel` 注入的帮助程序，以节省代码大小的插件 。babel 转义 async 语法会使用regeneratorRuntime 这个变量 但是这个变量在最终的代码里未定义会报错 babel 在转译的时候，会将源代码分成 syntax 和 api 两部分来处理：

- syntax：类似于展开对象、optional chain、let、const 等语法
- api：类似于 [1,2,3].includes 等函数、方法

@babel/plugin-transform-runtime的作用就是

吧babel 转义出来的require 

helpers 从之前的原地定义改为了从一个统一的模块中引入，使得打包的结果中每个 helper 只会存在一个，解决了第二个问题



另外，`@babel/plugin-transform-runtime` 需要和 `@babel/runtime` 配合使用。

首先安装依赖，`@babel/plugin-transform-runtime` 通常仅在开发时使用，但是运行时最终代码需要依赖 `@babel/runtime`，所以 `@babel/runtime` 必须要作为生产依赖被安装，如下 :

```shell
npm install --save-dev @babel/plugin-transform-runtime
npm install --save @babel/runtime
```



```json
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "targets": {
          "chrome": "58",
          "ie": "10"
        },
        "useBuiltIns": "usage",
        "corejs": { "version": 3, "proposals": true }
      }
    ]
  ],
    //添加配置
  "plugins": [
    "@babel/plugin-transform-runtime"
  ]
}
```



如果我们希望 `@babel/plugin-transform-runtime` 不仅仅处理帮助函数，同时也能加载 `polyfill` 的话，我们需要给 `@babel/plugin-transform-runtime` 增加配置信息。

首先新增依赖 `@babel/runtime-corejs3`:

```shell
npm install @babel/runtime-corejs3 --save
```

修改配置文件如下(移除了 `@babel/preset-env` 的 `useBuiltIns` 的配置，不然不就重复了嘛嘛嘛，不信的话，你用 `async/await` 编译下试试咯):

```js
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "targets": {
          "chrome": "58",
          "ie": "10"
        }
      }
    ]
  ],
  "plugins": [
    [
        "@babel/plugin-transform-runtime",{
            "corejs": 3
        }
    ]
]
}
```

这样引入的polyfill 没有直接去修改 `Array.prototype`，或者是新增 `Promise` 方法

给 `@babel/plugin-transform-runtime` 配置 `corejs` 是如此的完美，既可以将帮助函数变成引用的形式，又可以动态引入 `polyfill`，并且不会污染全局环境。何必要给 `@babel/preset-env` 提供 `useBuiltIns` 功能呢，看起来似乎不需要呀。

带着这样的疑问，我新建了几个文件(内容简单且基本一致，使用了些新特性)，然后使用 `webpack` 构建，以下是我对比的数据:

| 序号 | .babelrc 配置                                                | webpack mode production |
| :--- | :----------------------------------------------------------- | :---------------------- |
| 0    | 不使用 `@babel/plugin-transform-runtime`                     | 36KB                    |
| 1    | 使用`@babel/plugin-transform-runtime`，并配置参数 `corejs`: 3。不会污染全局环境 | 37KB                    |
| 2    | 使用`@babel/plugin-transform-runtime`，不配置 `corejs`       | 22KB                    |

我猜测是 `@babel/runtime-corejs3/XXX` 的包本身比 `core-js/modules/XXX` 要大一些~





**总结：**babel7的版本下，利用present-env做按需转换，利用useBuiltIn做babel-polyfill的按需引入，利用transform-runtime做babel辅助函数的按需引入。







### 3.安装eslint

如果你使用的默认解析器的话，且在代码中使用了浏览器有兼容性的问题的js新特性，使用webpack编译就会出现问题，这时我们一般装最新的eslint或者安装是使用 `babel-eslint` 来解决问题。



1.安装eslint eslint-loader eslint-friendly-formatter

```shell
npm install --save-dev eslint
```

```
npm install --save eslint-loader
```

```shell
eslint-friendly-formatter 
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
    }],
  },
```

如果想要有eslint-friendly-formatter就要更改use为loader的写法

```js
  module: {
    rules: [{
      test: /\.js$/,
      exclude: [/node_modules/],
      loader: 'eslint-loader',
      enforce: 'pre', // 编译前检查
      include: [path.resolve(__dirname, 'src')], // 指定检查目标
      options: { // 这里的配置项参数将会被传递到 eslint 的 CLIEngine
        formatter: require('eslint-friendly-formatter'), // 指定错误报告的格式规范
      },
    }],
  },
```

3.创建一个.eslintrc.js配置

```
npx eslint --init //初始化  选择如何配置eslint 之后会生成配置文件.eslintrc
```



也可以直接新建一个文件

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

通过这个插件你可以让eslint去检测html文件script标签里的js代码



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

ESLint 会对我们的代码进行校验，而 parser 的作用是将我们写的代码转换为 [ESTree](https://link.zhihu.com/?target=https%3A//github.com/estree/estree)，ESLint 会对 ESTree 进行校验。



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

要在配置文件中配置全局变量，请将 `globals` 配置属性设置为一个对象，该对象包含以你希望使用的每个全局变量。对于每个全局变量键，将对应的值设置为 `"writable"` 以允许重写变量，或 `"readonly"` 不允许重写变量。例如：

```
{
    "globals": {
        "var1": "writable",
        "var2": "readonly"
    }
}
```

可以使用字符串 `"off"` 禁用全局变量。例如，在大多数 ES2015 全局变量可用但 `Promise` 不可用的环境中，你可以使用以下配置:

```
{
    "env": {
        "es6": true
    },
    "globals": {
        "Promise": "off"
    }
}
```

由于历史原因，布尔值 `false` 和字符串值 `"readable"` 等价于 `"readonly"`。类似地，布尔值 `true` 和字符串值 `"writeable"` 等价于 `"writable"`。但是，不建议使用旧值。

## vue 如何配置 ESLint(修改parse)

**使用eslint-plugin-vue插件**

## babel 如何配置eslint(修改parse)





## 4.安装部分图片资源处理的loader

`.png`等后缀的引入文件webpack压根不认识你，所以我们需要安装相应的loader也就是`file-loader`来处理这种文件，给webpack**赋能**

安装

```ruby
$ npm install file-loader --save-dev
```

 在`webpack.config.js`中配置它

```javascript
 module: {
    rules: [
      // ...
      {
        // 使用file-loader处理文件
        test: /\.(png|svg|jpg|gif)$/,
        use: ["file-loader"]
      }
    ]
  }
```

`file-loader`很强大，像`.xml`文件啊，`.csv`、字体文件`.ttf`等等它都能处理，可是对于处理图片来说，可能我们有更好的选择



先安装`url-loader`：

```ruby
$ npm install url-loader --save-dev
```

修改配置

```js
      {
        // 使用url-loader处理图片资源，当图片size小于limit值时会转为DataURL
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 8192
            }
          }
        ]
      },
      {
        // 使用url-loader处理字体
        test: /\.(ttf|svg|eot|woff|woff2)$/i,
        use:'url-loader'
      }
```

注意:url-loader是依赖于file-loader处理图片的,当图片大小小于limit url-loader会处理成base64,如果超过 则会交给file-loader处理文件



## 4.安装部分CSS\SASS处理的loader

```ruby
$ npm install sass-loader node-sass --save-dev
```

`webpack`中`loader`加载顺序是**从下到上，从右到左**。

`css-loader`使你能够使用类似`@import`和`url(...)`的方法实现`require/import`的功能；`style-loader`可以将编译完成的css挂载到html中。

这两个loader还有许多的配置项可以学习参考，大家可以去下面给的链接去了解。

- 然后我们需要在`webpack.config.js`中配置它。

```javascript
 // 处理sass
      {
        test: /\.s[ac]ss$/i,
        use: [
          "style-loader",
          "css-loader",
          "sass-loader" // 将 Sass 编译成 CSS，默认使用 Node Sass
        ]
      },
    ]
  }
```

如果运行有错 是因为 node-sass 有问题 可以  用Dart Sass 替换 Node Sass

```shell
yarn remove node-sass

yarn add sass -D
```

### 安装postcss

新建一个`postcss.config.js`文件并配置添加这个刚刚安装的`autoprefixer`插件。

```js
module.exports = {
  plugins: {
    "autoprefixer": {}
  }
};
```



加入postcss-loader配置

```
      {
        test: /\.s[ac]ss$/i,
        use: [
          "style-loader",
          "css-loader",
         "postcss-loader", // 因为这里处理的是css文件，所以要放在sass-loader的上面
          "sass-loader"
        ]
      },
```

- 到了这一步，基本配置就完成了，但是还有一个东西一定要记得设置，不然压根没效果。进入到`package.json`中，我们要设置**所支持的浏览器列表**，切记！！！（这一步很重要，我就是忘记设置这一步，导致一直没效果，找了很久的问题！！！）

```bash
{
...
  "browserslist": [
    "> 1%",
    "last 2 versions"
  ]
...
```



### 5.调整entry与output

- 对于`入口entry`我们常见的其实是简写模式，我们可以使用键值对的形式来定义它，其实默认是这样的。

```javascript
module.exports = {
  ...
  // 简写
  entry: "./src/index.js",
  
  // 默认
  entry: {
    "main": "./src/index.js",
  }
  ...
}
```

而`输出output`中`filename`就是打包后指定的文件名，`path`就是存放的位置。还有一些其他的输出名称更改的几个点：

- `[name]`就是entry里面的key键名
- `[hash]`就是一段hash值，这个还是挺常见的。

```js
  entry: {
    'index': './src/index.js',
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: '[name].[hash].js',
  },
```

#### 关于sourceMap

回到开始的状态，在我们的开发过程中啊，当我们打包的时候，我们会把几个模块的文件打包为一个`main.js`输出出去，这个时候，如果某个js文件出了错，那么在浏览器中指出的这个错误位置是跟`main.js`相关联的，这对我们找出错误毫无意义。



- 而`sourceMap`就是解决这个问题的，当浏览器抛出错误的时候可以帮我们定位到具体的js文件和行列位置。
- 在`webpack`中开启`sourceMap`是个很简单的事情：

```javascript
  module.exports = {
    mode: 'development',
    // 开启sourceMap
+   devtool: 'inline-source-map',
    entry: {
      main: "./src/index.js"
    },
    output: {
      publicPath:'/',
      filename: "[name].bundle.js",
      path: path.resolve(__dirname, "dist")
    }
    ...
  };
```

如果你设置这个键值为`source-map`，那么打包就会生成一个`.map`的映射文件。

而`inline-source-map`就是会把这个`.map`文件直接作为DataUrl插入到`main.bundle.js`中。

当我们在`webpack.config.js`中设置完`sourcemap`以后，打包刷新浏览器我们就可以看到打印信息变为这样，就可以很明确的帮我们定位到问题。



#### sourceMap小结

- `sorcemap`做了些什么事情呢？打包后会生成一个`.map`的映射文件，它会将你打包后的代码映射到源代码中，与之相关关联。这样，我们就知道在源代码中出错的位置是几行几列了。
- 配置`sorcemap`有很多的可选值，但是不用管这么多，开发模式中我们设置为`inline-source-map`或者`source-map`，生产模式中我们将其设置为`cheap-module-source-map`即可，react和vue都是这么设置的。作为一名新手，模仿是最有效的学习方式了。
- `entry`算是比较简单，但是`output`今天文章中提及的只是冰山一角，后面根据需求再设置，下面参考链接也可以去详细了解下它的一些配置项。



## 6.plugins的使用



- 什么是`webpack`的[plugins](https://links.jianshu.com/go?to=https%3A%2F%2Fwebpack.js.org%2Fconcepts%2Fplugins%2F)？首先回顾一下前面几章讲`webpack`的`loaders`相关概念时，我将它理解为一个**赋能**的概念，各种各样的`loader`为`webpack`提供了处理不同文件的能力，使`webpack`变得更强大了。
- 而`webpack`的`plugins`，则可以把它理解为类似于框架的**生命周期(钩子/函数)**，比如可以在页面`mounted`的时候做些事情、在页面`show`的时候做些事情，离开页面`destroyed`的时候做些事情等等。同理，`plugins`也可以让我们在`webpack`打包过程中的不同阶段来做些事情。



### CleanWebpackPlugin

- 使用`CleanWebpackPlugin`这个插件可以帮我们自动删除`dist`文件，安装：

```ruby
 npm install clean-webpack-plugin --save-dev
```

- 在`webpack.config.js`中引入并配置它。

```javascript
+  const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const path = require("path");

module.exports = {
    mode: "development",
    devtool: "inline-source-map",
    entry: {
       main: "./src/index.js"
    },
    output: {
       filename: "[name].bundle.js",
       path: path.resolve(__dirname, "dist")
    },
+   plugins: [
+      new CleanWebpackPlugin()
+   ],
    ...
}
```

### HtmlWebpackPlugin

```ruby
npm install html-webpack-plugin --save-dev
```

- 在webpack.config.js中配置添加一下：

```javascript
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
+  const HtmlWebpackPlugin = require("html-webpack-plugin");

const path = require("path");

module.exports = {
    mode: "development",
    devtool: "inline-source-map",
    entry: {
       main: "./src/index.js"
    },
    output: {
       filename: "[name].bundle.js",
       path: path.resolve(__dirname, "dist")
    },
    plugins: [
       new CleanWebpackPlugin(),
+      // 可以为你生成一个HTML文件
+      new HtmlWebpackPlugin()
    ],
    ...
}
```

当我们这么简单的添加一行后，开始打包，这个插件会为我们做两件事情：

- 在`dist`目录下生成一个`index.html`文件；
- 自动帮我们引入`main.bundle.js`文件;



这个`html-webpack-plugin`插件还有一些的基本的常见配置，我们可传个对象给它配置些东西。

- 设置这个`template`就是说，打包后我不要它自动给我生成一个html文件，我指定一个模板，你照着这个模板把`main.bundle.js`文件引入就行。
- 设置`title`就是测试一下，`<%= htmlWebpackPlugin.options %>`可以读取`htmlWebpackPlugin`中定义的配置参数。
- inject 配置就是说插入JS到html中的body 
- 还可以自定义配置项 needVconsole 用于在html中识别不同的条件



```
    new HtmlWebpackPlugin({
      template : './public/index.html',
      inject:'body',
      title:config.build.title,
      needVconsole:false
    })
```



## 7.配置webpack-dev-server

webpack-dev-server是webpack官方提供的一个小型Express服务器。使用它可以为webpack打包生成的资源文件提供web服务。

**注意：你启动webpack-dev-server后，你在目标文件夹中是看不到编译后的文件的,实时编译后的文件都保存到了内存当中。因此很多同学使用webpack-dev-server进行开发的时候都看不到编译后的文件**

#### 1.webpack-dev-server 主要提供两个功能：

1.为静态文件提供web服务

2.自动刷新和热替换(HMR)

自动刷新指当修改代码时webpack会进行自动编译，更新网页内容

热替换指运行时更新各种模块，即局部刷新

#### 2.安装webpack-dev-server

```shell
yarn add --save-dev webpack-dev-server
```

**注意:**

本人安装的时候

  "webpack-dev-server": "^3.11.0"的版本只能搭配   "webpack-cli": "3"使用   "webpack-cli 4"使用会报错. 所以吧把"webpack-cli"卸载之后安装了3的版本即可运行.

#### 3.配置webpack.config.js文件



```js
devServer:{
   contentBase: path.join(__dirname, './'),// 设置服务器的基本目录
   host:'localhost', // 服务器的ip
   port: 80,// 端口
   open: true,// 自动打开页面
}
```

#### 4.配置package.json文件

```js
  "scripts": {
    "build": "webpack  --config ./build/webpack.prod.config.js --mode production --progress",
    "babel": "npx babel ./src/index.js --out-file ./babel_build/babel.js",
    "dev": "webpack-dev-server --config ./build/webpack.dev.config.js --inline --hot"
  },
```

--inline: webpack-dev-server 的自动打包.  在inline mod 会在控制台展示打包进度

--hot:热更新刷新页面

其他配置

```
--quiet 控制台中不输出打包的信息
--compress 开启gzip压缩
--progress 显示打包的进度
```

#### 5.配合plugins使用webpack-dev-server

添加HtmlWebpackPlugin帮助我们选用静态页面并引入打包后的js

**webpack.config.js**

```
  plugins: [
    //HTML文件
    new HtmlWebpackPlugin({
      template : './public/index.html',
      inject:'body',
      title:config.build.title,
      needVconsole:process.env.NODE_ENV !== 'production'
    })
  ],
```



#### 注意点:

webpack5版本下必须要添加一条webpack.config.js配置才能更改代码后成功自动刷新页面

```js
  //webpack5版本下新增配置
  target: "web",
  //webpack-dev-server配置
  devServer: {
   contentBase: path.join(__dirname, './'),
   port: 80,
   open: true,
  },
```

## 配置proxy代理请求

在 **webpack.config.js**中配置

```js
  devServer: {
    contentBase: path.join(__dirname, './'),
    host:'localhost',
    port: 80,
    proxy: {
      "/test": {
        target: "https://op.tga.qq.com/test",
        pathRewrite: {"^/test": "/"},
        secure: true,
        changeOrigin: true,
      },
      "/build": {
        target: "https://op.tga.qq.com",
        pathRewrite: {"^/build": "/"},
        secure: true,
        changeOrigin: true,
      }
    }
  },
```



- `target`：把带有`/test`的接口代理到请求`target`设置的这个服务器，就相对于请求`https://op.tga.qq.com/test`
- `pathRewrite`：可以把请求接口中的某部分重写，
  - 上面这个只是为了演示这个属性，`^/test`是个正则，把所有`/test`开头的都重写`/`，我们axios接口里本来就是以这个开头的，所相当于啥事没干，单纯演示。
  - 你可以改`pathRewrite: { "/movie": "/music" }`，把请求电影的的改为请求音乐的；还有一种比较在axios封装中比较常见的就是`pathRewrite: { "^/api": "/" }`，把所有以`/api`开头的就这串字符都删掉。
- `secure`：允许`https`协议。
- `changeOrigin`：设置为ture表示允许跨域。

## 代码分割

- 而`webpack`可以帮我们轻松的实现[代码分割](https://links.jianshu.com/go?to=https%3A%2F%2Fwebpack.js.org%2Fguides%2Fcode-splitting%2F)，我们进入到`webpack.config.js`中，添加如下几行配置：



```javascript
module.exports = {
  mode: "development",
  entry: {
    main: "./src/index.js"
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist")
  },

  // 代码分割codeSpliting
  optimization: {
    splitChunks: {
      chunks: "all",
      minSize: 20000,
    }
  },
  // ...
};
```

- 这个配置是个什么意思？就是说对于公共引用的模块（库）帮我单独提出来做下代码分割。



#### SplitChunksPlugin

- 上面`webpack`帮我们实现代码分割，利用的就是[SplitChunksPlugin](https://links.jianshu.com/go?to=https%3A%2F%2Fwebpack.js.org%2Fguides%2Fcode-splitting%2F%23splitchunksplugin)这个插件，这个可配置的内容就很丰富了，只拿几个常见的选项来举例一下。
- 当我们什么都不做，仅仅只是配置`splitChunks: {}`,其实就是默认相当于：



```javascript
module.exports = {
  // ...
  optimization: {
    splitChunks: {}
  }
  // 等同于：
  optimization: {
    splitChunks: {
      chunks: 'async',
      minSize: 30000,
      minRemainingSize: 0,
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 6,
      maxInitialRequests: 4,
      automaticNameDelimiter: '~',
      automaticNameMaxLength: 30,
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  },
  // ...
};
```

- 这其中通过去看文档可以得到更好的理解，我这里也写不了这么多，只举几个：
- `chunks`：这里默认值为`async`，只有在异步引入模块的时候才会做分割，所以前面例子中我们将其设置为`all`，这样同步异步的引入都会自动的做代码分割了。
- `minSize`：就是说引入的文件多大才会做分割，在`src/index.js`中`import`引入的`header.js`、`content.js`等不满足这个条件，所以就没有分割了。
- `minChunks`：我们以引入`axios`为例啊，这个就是说最小的引入次数，默认为1，如果你一次都没有，肯定就不会做代码分割了。
- `cacheGroups`：
  - 当你上面所有的条件（minSize、chunks、minChunks等等）都满足了以后，首先就会进入的这个`defaultVendors`里面，里面会test校检，像我们的`axios`引入就是来自`node_modules`包里的，所以就满足就会做分割，打包后为`dist/vendors~main.bundle.js`文件，不满足就走下面的`default`，我们打包后的文件名也可以通过配置一个`filename`来改变名字。
  - 那为什么叫`缓存组`呢？再举一个例子，比如我们在`src/index.js`中`import`引入的`header.js`、`content.js`、`foooter.js`这三个文件，当对`header.js`做代码分割的时候，走进`cacheGroups`中满足default选项，这时候会打包进去并缓存起来，当`content.js`进来发现也满足这个条件，所以也会把它丢进去，以此类推，最后打包完成了作为一个文件输出到dist文件中。



## prefetching和preloading

- `preloading`：设置这个指令，就会在当前的页面中，以较高优先级预加载某个资源。其实就相当于浏览器的预加载，但是浏览器的预加载只会加载html中声明的资源，但是`preloading`突破了这个限制，连css和js资源也可以预加载一波。

- `Prefetching`：设置这个指令，就表示允许浏览器在后台（空闲时）获取将来可能用得到的资源，并且将他们存储在浏览器的缓存中。

- 这两种其实都是webpack提供的资源加载优化的方式，反正如果就是设置了这几个指令，就会先走个`http`的缓存，然后下次再次请求的时候直接从缓存里面拿，这样就节省了加载的时间。

#### 写法

**这里就是在点击body的时候的去引入footer.js** 

只有事件触发才会引入footer.js

```js
document.body.addEventListener("click", () => {
  import(./footer.js").then(module => {
    console.log(module);
    module.createFooter();
  });
});
```



**这里就是Prefetch的去引入footer.js**

我们再次刷新浏览器打开控制台你就会看到，我们没有点击页面的时候它就会帮我自动先加载一遍`footer.js`，然后当我们点击页面动态加载的时候，就是直接走的缓存了。

```js
document.body.addEventListener("click", () => {
  import(/* webpackPrefetch: true */"./footer.js").then(module => {
    console.log(module);
    module.createFooter();
  });
});
```





**这里就是Preload的去引入footer.js**

```js
document.body.addEventListener("click", () => {
  import(/* webpackPreload: true */"./footer.js").then(module => {
    console.log(module);
    module.createFooter();
  });
});
```

#### 小结

- 其实webpack官网对于这两个东西的解释我觉得就比较到位了，`Preloading`什么时候用呢？比如说，你页面中的很多组件都用到了`jQuery`，比较**强依赖**这个东西，那么我们就可以当import引入jQuery库的时候设置为`Preloading`，让他预加载一波。
- 而`Prefetching`我们一般用的比较多，也比较好理解，用官网的例子来说：一般当我们进入一个网站首页，只有当点击登录按钮的时候模态框才需要弹出来，那么我们就可以对这个`login模态框`组件做下`Prefetching`，当首页加载完毕，浏览器空闲的时候提前加载一下，这样当用户点击登录按钮就可以直接从缓存里面加载这个组件了。



## CSS切割和publicPath的分别设置和CSS压缩

#### 1、开始

webpack打包默认会把css写入JS中 , 这样加大了JS文件的大小  . 我们可以使用MiniCssExtractPlugin切割出css

```shell
yarn add mini-css-extract-plugin --save-dev 
```

#### 2、配置

推荐直接在 **webpack.prod.config** 中配置MiniCssExtractPlugin 因为只有生产环境才需要切割css

我们要用MiniCssExtractPlugin.loader代替style-loader

```js
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const webpackConfig = merge(baseWebpackConfig, {
  mode: 'production',
  module: {
    rules: [{
      test: /\.s[ac]ss$/,
      use: [
          //替换style-loader
        {
          loader: MiniCssExtractPlugin.loader,
          options:{
            //注意需要修改publicPath 因为我们吧img配置到了img文件夹中 否则他会是默认的publicPath
            publicPath: '../'
         }
        },
        {
          loader: 'css-loader',
          options: {
            importLoaders: 2
          }
        },
        'sass-loader',
        'postcss-loader'
      ]
    }, {
      test: /\.css$/,
      use: [
       //替换style-loader
        {
          loader: MiniCssExtractPlugin.loader,
          options:{
            publicPath: '../'
        }
        },
        'css-loader',
        'postcss-loader'
      ]
    }]
  },
  plugins: [
    new CleanWebpackPlugin(),
      //plugins中启用MiniCssExtractPlugin
    new MiniCssExtractPlugin({
        //这边配置输出文件
      filename: 'style/style.css',
    })
  ],

})

module.exports = webpackConfig
```

为了使用MiniCssExtractPlugin我们需要**修改webpack.base.config.js**中的publicPath

```js
  output: {
    path: config.build.assetsRoot,
    chunkFilename: 'js/[name].chunk.js',//依赖的放置文件夹 例:axios
    filename: 'js/[name].js',//src中的js放置
    publicPath: './',//必须要是./
  },
```

而我们devServer启动服务中 **修改webpack.dev.config.j**s中的publicPath

```js
  output: {
    publicPath: '/',//设置为/ 表示根目录
  },
```

然后我们吧*url-loader处理字体和图片的输出路径都改一下*

**修改webpack.base.config.js**

```js
        // 使用url-loader处理图片资源，当图片size小于limit值时会转为DataURL
        test: /\.(jpg|bmp|png|jpeg|gif|tiff)$/,
        use: [{
          loader: "url-loader",
          options: {
            limit: 8192,
            outputPath: "img",//图片的输出路径
          }
        }]
      },
      {
        // 使用url-loader处理字体
        test:/.(woff|woff2|eot|ttf|otf|TTF|svg).*?$/,
        use: [{
          loader: "url-loader",
          options: {
            outputPath: "font",//字体的输出路径
          }
        }]
      },
```

#### CSS压缩

**在webpack.prod.config.js中添加配置**

```js
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

optimization: {//优化项
    minimizer: [ new OptimizeCSSAssetsPlugin({})],
  },
```



OK一切收工之后 ,这样我们的dist目录下文件大概为

- 图片输出在img文件夹
- 字体输出在font文件夹
- css会分离出来在style文件夹 并且dist目录下会被压缩
- js会放在js文件夹中

并且serverDev和dist都可以看到这些图片和css

