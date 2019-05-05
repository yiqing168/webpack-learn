import "@babel/polyfill"
import _ from "lodash"
import ReactDom from "react-dom"
import React, { Component } from 'react';
import App from "./App"
import "./index.less"
import './ass/iconfont/iconfont.css'

function component() {
  var element = document.createElement('div');
  element.classList.add("app");
  element.setAttribute("id", "app");
  element.innerHTML = _.join(['Hello', 'webpack'], ' ');
  return element;
}
console.log(5555566)

document.body.appendChild(component());
ReactDom.render(
  <App />,
  document.getElementById("app")
)

@testable
class MyTestableClass {
  constructor() {

  }

  async getData() {

  }
}

function testable(target) {
  target.isTestable = true;
}

var obj={...{name:123}}

/**
 * 热更新配置
 */
// if (module.hot) {
//   module.hot.accept('./app.js', function () {
//     console.log('Accepting the updated printMe module!');
//   })
// }