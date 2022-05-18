<template>
  <div id="app">
<!--    <SideBar></SideBar>-->
    <router-view></router-view>
  </div>
</template>

<script>
// import SideBar from "./components/SideBar"
// import WriteContent from "./components/WriteContent";
import Axios from 'axios'
import axios from "axios";
import Vue from 'vue'
let showdown  = require('showdown')
Vue.prototype.$axios=Axios
// 设置基本路径
Axios.defaults.baseURL='/api'
Vue.prototype.$ajax = axios
export default {
  components: {
    // SideBar,
    // WriteContent
  },
  name: 'App',
  data() {
    return {
    }
  },
  methods: {
  }
}
</script>

<style>
body, html, #app {
  height: 100%;
  margin: 0;
  padding: 0;
}

#app {
  font-size: 0;
  /*background: url("assets/img/4.jpg") no-repeat;*/
  background: url("./assets/img/sky_new.jpg") no-repeat;
  background-size: 100%;
}
</style>
