import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import content from "../components/content";
import WriteContent from "../components/WriteContent";
import SideBar from "../components/SideBar";
import Login from "../components/Login"

Vue.use(Router)


// 禁止浏览器前进后退 另一部本在router的index.js中
// window.addEventListener('popstate', function() {
//   history.pushState(null, null, document.URL);
// })



export default new Router({
  mode: "history",
  // scrollBehavior: () => {
  //   history.pushState(null, null, document.URL)
  // },
  routes: [
    {
      path: '/',
      name: 'index',
      redirect: '/blog',
    },
    {
      path: "/blog",
      name: 'main',
      component: SideBar,
      meta: {
        title: "blog",
        keepAlive: true
      }
    },
    {
      path: '/blog/write',
      name: 'write',
      component: WriteContent,
      meta: {
        title: "writeContent",
        // keepAlive: true
      }
    },
    {
      path: "/blog/:category",
      name: 'category',
      component: SideBar,
    },
    {
      path: "/blog/:category/:title",
      name: 'title',
      component: SideBar
    },

    {
      path: '/blog/edit/',
      name: 'edit',
      component: WriteContent,
      meta: {
        title: "EditContent",
        // keepAlive: true
      }
    },
    // {
    //   path: "*",
    //   component: SideBar
    // },
    // {
    //   path: '/blog/queryArticleInfo',
    //   name: 'content',
    //   component: content
    // },

    {
      path: "/blog/login",
      name: "login",
      component: Login,
      meta: {
        title: "Login"
      }
    },
  ]
})
