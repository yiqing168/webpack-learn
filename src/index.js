import "@babel/polyfill"
import _ from "lodash"
import ReactDom from "react-dom"
import React, { Component } from 'react';
import App from "./App.js"
import "./index.less"
import './static/iconfont/iconfont.css'

ReactDom.render(
  <App />,
  document.getElementById("app")
)
