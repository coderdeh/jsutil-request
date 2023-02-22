/*
 * @Author: daieh
 * @LastEditors: daieh
 * @Description: 
 * 
 * rollup的模块机制是 ES6 Modules，并不会对 es6 其他的语法进行编译，如果使用ES6语法进行开发，还需要使用 babel将代码编译为ES5
 * 
 * rollup-plugin-babel 将 rollup 和 babel 进行了完美结合  @babel/core  @babel/preset-env
 * 
 * 为了在 rollup 中引用 commonjs 规范的包，rollup 提供了插件 rollup-plugin-commonjs，该插件的作用是将 commonjs 模块转成 es6 模块
 * 
 * rollup-plugin-commonjs 通常与 rollup-plugin-node-resolve 一同使用，后者用来解析依赖的模块路径
 * 
 * rollup-plugin-uglify 移除代码上注释、缩短变量名、重整代码来极大程度的减少 bundle 的体积
 */

import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import { uglify } from 'rollup-plugin-uglify'
import json from '@rollup/plugin-json'

export default {
  // 要打包的文件
  input: "src/jsutil-utils.js",
  output: {
    // 输出的文件 如果没有这个参数，则直接输出到控制台
    file: "dist/sgup-jsutil-utils.js",
    // Rollup 输出的文件类型
    format: "esm",
    name: 'sgup-jsutil-utils'
  },
  plugins: [
    json(),
    resolve(),
    commonjs(),
    babel({
      exclude: 'node_modules/**',
      runtimeHelpers: true,
    }),
    uglify()
  ]
}