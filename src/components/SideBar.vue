<template>
  <div style="height: 100%;">
    <div id="sidebar-left-scroll">
      <div style="height: 180px;width:100%;text-align: center;padding-top: 10px;">
        <div id="img_head"></div>
        <!--        <el-avatar src= :size="120" shape="circle" style="opacity: 1;background-color: black"></el-avatar>-->
        <div style="font-size: 23px;margin-top: 5px;">
          <a><i class="icon-info el-icon-phone"></i></a>
          <a><i class="icon-info el-icon-s-custom"></i></a>
          <a><i class="icon-info el-icon-chat-line-round"></i></a>
        </div>
      </div>
      <div class="sidebar_left"
           style="height: 50px;text-align: center;border-top: 1px solid white;line-height: 50px; cursor: pointer;opacity: 0.8;"
           v-for="(item, index) in article_category" :class="{categoryActive: item[1] === current_category}">
        <!--        <a class="category" style="height: 45px;" :href="'/blog/'+item[0]" @click="queryTitle(item, index)">{{ item }}</a>-->
        <router-link replace v-bind:to="'/blog/'+item[0]" style="text-decoration: none">
          <li style="height: 45px;font-size: 20px;color: white;" @click="queryTitle(item[0], item[1])">{{ item[1] }}</li>
        </router-link>
      </div>
    </div>
    <div id="sidebar-right-scroll"
         style="display: inline-block;width: 470px;height: 100%;overflow: scroll;box-sizing:border-box;float: left;background-color: rgba(255, 255,255,0.2);">
      <div style="height: 30px;">
        <el-input type="text" v-model="searchContent" placeholder="请输入关键字" style="width:100%;"
                  @keydown.enter.native="searchTitle"></el-input>
      </div>
      <div style="margin-top: 10px">
        <hr/>
      </div>
        <div v-for="(item, index) in category_title_map">
          <router-link replace v-bind:to="'/blog/'+item[0][0]+'/'+item[0][1]"
                       style="text-decoration: none;color: black;font-size: 16px;">
            <li class="title_item" @click="queryContent(item[0][0], item[0][1], item[1][1])"
                :class="{titleActive: item[1][1] === current_title}" :data_toggle="item[1][0]">
              <i class="el-icon-arrow-right" style="display: inline"></i>{{ item[1][1] }}
            </li>
          </router-link>
        </div>
    </div>

    <div id="contentBox"
         style="display: inline-block;width:calc(100% - 630px);height: 100%;box-sizing:border-box;opacity: 0.8;background-color: rgba(255, 255,255,0.7)">
      <el-row style="width: 100%;height: 10%;padding: 15px;">
        <div style="text-align: center">
          <el-link id="titleName" type="primary" style="color:blue;font-size: 24px" @click="editArticle">{{ current_title }}
          </el-link>
        </div>
        <!--        <a @click="drawer = true"><i class="el-icon-menu" style="float: right"></i></a>-->
      </el-row>
      <el-row style="height: 90%">
        <div id="content"
             style="height: 100%; overflow-y: scroll;box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);">
          <div id="articleContent" style="" v-html=""></div>
        </div>
      </el-row>
    </div>

<!--    <div>-->
<!--      <button id="writeBtn" style="font-size: 16px" @click="writeEvent"><i class="el-icon-edit"-->
<!--                                                                           style="position: absolute; right: 5px;top: 10px;line-height: 30px;color: blue">write</i>-->
<!--      </button>-->
<!--      &lt;!&ndash;/*      <a href="" style="position: absolute; right: 45px;top: 10px"><<<</a>*/&ndash;&gt;-->
<!--      &lt;!&ndash;/*      <div style="display: block;position: absolute;top: 10px;right: 0px"><button style="background-color: rgba(0,0,0,0);border: none;font-size: 16px;line-height: 30px">写博客</button></div>*/&ndash;&gt;-->
<!--    </div>-->

  </div>




</template>

<script>


import Axios from 'axios'
import Vue from 'vue'
import $ from "jquery"
import { Base32 } from "../assets/js/uint8ArrayToString"
// let Base32 = require("../assets/js/uint8ArrayToString");

const head_img = require('../assets/img/head_img.jpg')
let showdown = require('showdown')
// let Base32 = require('base32.js')


// let arr = "466ZDZ53TQ======";
// console.log(Base32.decode(arr));
// let a = "网络";
// console.log(Base32.encode(a));


var markdown_config = {
  html: true,        // Enable HTML tags in source
  xhtmlOut: true,        // Use '/' to close single tags (<br />).
  breaks: true,        // Convert '\n' in paragraphs into <br>
  langPrefix: 'lang-',  // CSS language prefix for fenced blocks. Can be
  linkify: true,        // 自动识别url
  typographer: true,
  quotes: '“”‘’'
}
let md = require('markdown-it')(markdown_config)
let katex = require('markdown-it-katex')
let emoji = require('markdown-it-emoji');
// 下标
let sub = require('markdown-it-sub')
// 上标
let sup = require('markdown-it-sup')
// <dl/>
let deflist = require('markdown-it-deflist')
// <abbr/>
let abbr = require('markdown-it-abbr')
// footnote
let footnote = require('markdown-it-footnote')
// insert 带有下划线 样式 ++ ++
let insert = require('markdown-it-ins')
// mark
let mark = require('markdown-it-mark')
// taskLists
let taskLists = require('markdown-it-task-lists')
// container
let container = require('markdown-it-container')
//
let mip = require('markdown-it-images-preview');
let toc = require('markdown-it-toc')
let tm = require('markdown-it-texmath');
md.use(require("markdown-it-disable-url-encode"), "*")
md.use(emoji)
  .use(sup)
  .use(sub)
  .use(deflist)
  .use(abbr)
  .use(footnote)
  .use(insert)
  .use(mark)
  .use(container)
  .use(taskLists)
  .use(toc)
  .use(mip)

  .use(tm, {
    engine: require('katex'),
    delimiters: 'dollars',
    katexOptions: {macros: {"\\RR": "\\mathbb{R}"}}
  });
// md.use(plugin);

// Vue.prototype.$axios = Axios
// 设置基本路径
// Axios.defaults.baseURL = '/api'

export default {
  name: "SideBar",
  data() {
    return {
      context: ' ',//输入的数据
      article_category: {},
      article_title: {},
      article_url: '',
      article_content: 'welcome!',
      current_category: '首页',
      current_category_base32encode: '5GTJN2NBWU======',
      current_title: '',
      current_title_base32encode: '',
      ori_content: '',
      searchContent: '',
      currentIndex: 0,
      // activeColor: 'lightgray',
      category_title_map: {},
      //抽屉数据
      load_flag: false,

    }
  },
  created() {
    // console.log("created");
    this.getAllCategoryAndTitle();
  },
  mounted() {
    // console.log("mounted");
  },
  updated() {
    // console.log("updated");
    if (this.load_flag === true) {
      // console.log("updated_false");
      return;
    }
    let category_encode = this.$route.params.category;
    let title_encode = this.$route.params.title;
    if (category_encode !== undefined && title_encode !== undefined) {
      this.queryContent(category_encode, title_encode, Base32.decode(title_encode));
    }
    if (category_encode !== undefined && title_encode === undefined) {
      this.queryTitle(category_encode, Base32.decode(category_encode));
    }
    this.load_flag = true;

  },

  beforeRouteEnter(to, from, next) {
    next(vm => {          //  这里的vm指的就是vue实例，可以用来当做this使用
      // console.log("from:" + from.path);
      // console.log("to:" + to.path);
      // if (from.path.indexOf("/write") !== -1) {
      //   if (typeof to.params.category !== "undefined") {
          // console.log("vm:" + to.params.category);
          // vm.current_category = to.params.category
          // vm.current_category_base32encode = Base32.encode(vm.current_category)
          // vm.current_title = to.params.title
          // vm.current_title_base32encode = Base32.encode(vm.current_title)
          // vm.queryTitle(vm.current_category, 0)
          // vm.queryContent(vm.current_title)
        // }
      // }
    })
  },
  // beforeCreate() {
    // console.log("beforeCreate");
  // },
  // beforeMount() {
    // console.log("beforeMount");
  // },
  // beforeRouteUpdate() {
    // console.log("beforeRouteUpdate");
  // },
  // beforeUpdate() {
    // console.log("beforeUpdate");
  // },
  // beforeDestroy() {
    // console.log("beforeDestroy");
  // },
  // beforeRouteLeave(to, from, next) {
    // to.meta.keepAlive = true;
    // if (to.path.indexOf("login") !== -1) {

      // const category_and_title = {
      //   category: this.category,
      //   title: this.title,
      // };
      // // sessionStorage.setItem('get_category_title', 'true');
      // sessionStorage.setItem('category_and_title', JSON.stringify(category_and_title));
    // }
    // next(vm => {
    //
    // });
  // },

  computed: {

  },
  methods: {

    getAllCategoryAndTitle() {
      let category_map = new Map();
      let category_title_map = new Map();
      category_map.set('5GTJN2NBWU======', '首页')
      category_map.set("4WC2R2MDVDTJNB7HVOQA====", '全部文章')
      let category_set = new Set();
      this.$axios.get('/blog/getAllCategoryAndTitle').then(res => {
        for (let item of res.data) {
          category_set.add(item.article_category);
          category_title_map.set([item.article_category, item.article_title],
            [Base32.decode(item.article_category), Base32.decode(item.article_title)]);
        }
        for (let item of category_set) {
          category_map.set(item, Base32.decode(item));
        }
        let category_list = Array.from(category_map);
        category_list.sort((a, b) => {
          return a[1] - b[1];
        })
        this.article_category = Object.freeze(category_list);
        this.category_title_map = Object.freeze(category_title_map);

        // this.queryTitle(this.current_category_base32encode, this.current_category)
        console.log("getAllCategoryAndTitle");

      }).catch(error => {
        console.log(error);
      })
    },

    queryTitle(category_encode, category) {

      this.current_category_base32encode = category_encode
      this.current_category = category

      $(".title_item").css("display", "none");
      if (category === "首页") {
        // this.article_content = "Welcome to my blog!";
        this.article_title = ''
        return;
      }
      if (category === "全部文章") {
        $(".title_item").css("display", "block");
        return;
      }
      $("li[data_toggle='"+category+"']").css("display", "block");
    },

    searchTitle() {
      let titleItems = [];
      if (this.current_category === "全部文章") {
        titleItems = Array.from($(".title_item"));
      } else {
        titleItems = Array.from($(".title_item[data_toggle='"+this.current_category+"']"));
      }

      for (let item of titleItems) {
        if (item.innerText.toLowerCase().indexOf(this.searchContent.toLowerCase()) !== -1) {
          item.style.display = "block";
        } else {
          item.style.display = "none";
        }
        if (this.searchContent.length === 0) {
          item.style.display = "block";
        }
      }

    },
    queryContent(category_encode, title_encode, title) {
      this.current_title = title
      this.current_title_base32encode = title_encode
      this.current_category_base32encode = category_encode
      this.queryTitle(category_encode, Base32.decode(category_encode));
      this.$axios.get('/blog/queryContent?category=' + category_encode + '&title=' + title_encode).then(res => {
        this.ori_content = res.data
        // this.article_content = res.data
        document.getElementById("articleContent").innerHTML = md.render(Base32.decode(res.data));
      }).catch(error => {
        console.log(error);
      })

    },

    editArticle() {
      this.load_flag = false;
      if (document.cookie.indexOf("username") === -1) {
        this.$router.push({
          name: 'login',
          params: {
            category: this.current_category_base32encode,
            title: this.current_title_base32encode,
          }
        })
      } else {
        this.$router.push({
          path: `/blog/edit/`,
          name: 'edit',
          params: {
            category: this.current_category_base32encode,
            title: this.current_title_base32encode,
            content: this.ori_content,
            editOldArticle: true,
          },
        })
      }
    },
    updateStyle() {
      const srs = document.getElementById('contentBox')
      srs.style.width = 'calc(100% - 600px)'
    },
    // updateLocation(event) {
    //   console.log(event.offsetX);
    //   console.log(event.offsetY);
    // }
    writeEvent() {
      this.load_flag = false;
      this.$router.push({
        name: 'write',
        params: {
          // category: this.current_category,
          // title: this.current_title,
          // content: this.ori_content,
          // newContent: this.article_content,
          // editOldArticle: false
        }
      })
    }
  },



}

</script>

<style lang="scss">
#img_head {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  background: url('../assets/img/head_img.jpg') no-repeat center;
  background-size: 100%;
  margin-left: auto;
  margin-right: auto;
}


body, html {
  height: 100%;
  margin: 0;
  padding: 0;
}

li {
  list-style: none;
}

* {
  margin: 0;
  padding: 0;
}

#sidebar-left-scroll {
  display: inline-block;
  width: 160px;
  height: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
  box-sizing: border-box;
  float: left;
  color: white;
}

#sidebar-left-scroll::-webkit-scrollbar-track {

  background-color: lightgray;
  border-radius: 5em;

}

#sidebar-left-scroll::-webkit-scrollbar { /*滚动条整体样式*/
  width: 0; /*高宽分别对应横竖滚动条的尺寸*/
  height: 1px;
}

#sidebar-left-scroll::-webkit-scrollbar-thumb {

  border-radius: 3px;
  height: 30px; /* 滚动条滑块长度 */
  background-color: green;
}

#content::-webkit-scrollbar { /*滚动条整体样式*/
  width: 2px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 1px;
}

#content::-webkit-scrollbar-thumb {

  border-radius: 3px;
  height: 30px; /* 滚动条滑块长度 */
  background-color: black;
}

#sidebar-right-scroll::-webkit-scrollbar { /*滚动条整体样式*/
  width: 1px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 10px;
}

#sidebar-right-scroll::-webkit-scrollbar-thumb {

  border-radius: 3px;
  height: 30px; /* 滚动条滑块长度 */
  background-color: rgba(255, 255, 255, 0.3);
}

#articleBox::-webkit-scrollbar {
  width: 3px;
}

#articleBox::-webkit-scrollbar-thumb {
  border-radius: 3px;
  height: 30px; /* 滚动条滑块长度 */
  background-color: #6272a4;
}

code {
  display: block;
  background-color: #1e1e1e;
  color: darkgray;
  font-size: 9px;
  margin: 20px;
  padding: 15px;
  font-family: auto;
  line-height: 20px;
  border-radius: 10px;
}

#articleContent p, ul, ol {
  display: block;
  margin: 10px;
  padding: 10px;
  font-size: 14px;
  line-height: 30px;
  //box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);

}

strong {
  font-size: 24px;
}

h1, h2, h3, h4, h5, h6 {
  border-left: 5px solid lightgray;
  padding-left: 5px;
  margin-left: 10px;
}

#articleContent img {
  margin: 10px;
}

#articleContent .katex {

  //background-color: lightgray;
  font-style: normal;
  //font-weight: bold;
}

#articleContent .mathnormal {
  font-style: italic;
}

//.sidebar_left {
//  background-color: dimgray;
//}
.sidebar_left:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

.categoryActive li {
  font-weight: bold;
  color: #0c93e4 !important;
}
.categoryActive {
  //background-color: rgba(255, 255, 255, 0.3);
}


.title_item:hover {

  background-color: rgba(255, 255, 255, 0.1);
  color: cornflowerblue;
}

.title_item {
  color: floralwhite;
  //color: black;
  font-family: monospace;
  display: none;
  height: auto;
  width: auto;
  text-align: left;
  margin: 0;
  border-bottom: 1px solid lightgrey;
  line-height: 50px;
  font-size: 20px;
  overflow: visible;
  white-space: nowrap;
  cursor: pointer;
  opacity: 0.9;
}

//#7D8B99
.titleActive {
  font-weight: bold;
  //background-color:  !important;
  color: cornflowerblue;
}

.icon-info {
  cursor: pointer;
}

.icon-info {
  color: lightslategray;
}

.icon-info:hover {
  color: #6272a4;
}

//#sidebar-right-scroll {
//  transform: translateX(-100%);
//}
#writeBtn i:hover {
  color: blue;
  cursor: pointer;
}
</style>
