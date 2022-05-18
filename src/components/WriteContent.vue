<template>

  <el-row style="height: 100%" >
      <el-row  style="height: 14%;padding-top: 20px;text-align: center;" :gutter="20" >
<!--        <button onclick="goBack()">返回</button>-->
        <div style="text-align: center;margin: 0 auto; height: 60%;width: 100%">
              <el-input v-model="title" placeholder="请输入内容" style="height: 100%;display: inline-block;width: 250px"></el-input>
<!--              <el-input class="input" list></el-input>-->
              <el-select filterable allow-create v-model="category" placeholder="请选择"  style="height: 100%;display: inline-block;width: 200px">
                <el-option
                  v-for="item in category_options"
                  :key="item"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
              <el-button type="primary" @click="submit" style="line-height: 0px;height: 40px;width: 100px;display: inline-block">提交</el-button>
              <el-button id="del" type="danger" @click="delArticle" style="line-height: 0px;height: 40px;width: 120px;" :class="{show: editOldArticle}">删除这篇文章</el-button>
              <a id="LookBtn" style="font-size: 20px;color: red" :class="{showNewArticle: submitSuccess}" @click="LookNewArticle">查看新文章: {{title}}</a>
        </div>
      </el-row>
      <el-row style="height: 2%">
        <el-divider></el-divider>
      </el-row>
      <el-row style="height: 88%">
<!--        <mavon-editor ref=md @imgAdd="$imgAdd" @imgDel="$imgDel" v-model="content" :toolbars="toolbars" :imageFilter = "uploadBefore" @keydown="" style="height: 100%"/>-->
        <mavon-editor ref=md @imgAdd="$imgAdd" @imgDel="$imgDel" v-model="content" :toolbars="toolbars" @keydown="" style="height: 100%"/>
      </el-row>
  </el-row>


</template>

<script>
import Axios from 'axios'
import axios from "axios"
import Vue from 'vue'
let showdown  = require('showdown')
import 'mavon-editor/dist/css/index.css'
import editor from 'mavon-editor'
import showdownKatex from "showdown-katex";
import { Base32 } from "../assets/js/uint8ArrayToString"

// let Base32 = require("../assets/js/uint8ArrayToString");

// use
Vue.use(editor)
Vue.prototype.$axios=Axios
// 设置基本路径
Axios.defaults.baseURL='/api'


export default {
  name: "WriteContent",

  data() {
    return {
      category_options: [],
      category: '',
      title: '',
      content: '',
      old_category: '',
      old_title: '',
      old_content: '',
      textarea2: '',
      img_file: [[0, null]],
      editOldArticle: false,
      submitSuccess: false,
      fromPath: '',
      toolbars: {
        bold: true, // 粗体
        italic: true, // 斜体
        header: true, // 标题
        underline: true, // 下划线
        mark: true, // 标记
        superscript: true, // 上角标
        quote: true, // 引用
        ol: true, // 有序列表
        link: true, // 链接
        imagelink: true, // 图片链接
        help: true, // 帮助
        code: true, // code
        subfield: true, // 是否需要分栏
        fullscreen: true, // 全屏编辑
        readmodel: true, // 沉浸式阅读
        /* 1.3.5 */
        undo: true, // 上一步
        trash: true, // 清空
        save: true, // 保存（触发events中的save事件）
        /* 1.4.2 */
        navigation: true, // 导航目录
      },

    }
  },
  // beforeRouteEnter(to, from, next) {
  //   next(vm => {
  //     // 通过 `vm` 访问组件实例,将值传入fromPath
  //     vm.fromPath = from.path
  //   })
  // },
  mounted() {
    if (this.$route.params.editOldArticle === undefined) {
      return;
    }
    this.editOldArticle = true;
    this.old_category = this.$route.params.category;
    this.old_title = this.$route.params.title;
    this.old_content = this.$route.params.content;
    this.category = Base32.decode(this.$route.params.category);
    this.title = Base32.decode(this.$route.params.title);
    this.content = Base32.decode(this.$route.params.content);

    // window.addEventListener('popstate', () => {
    //   window.history.length-1
    // });

  },
  created() {

    if (document.cookie.indexOf("username") === -1) {
      this.$router.replace({
        name: 'login',
      })
      return;
    }

    this.queryCategory();

    // const getInitInfoFlag = sessionStorage.getItem('getInitInfo');
    // if (getInitInfoFlag === 'true') {
    //   const articleInfo = JSON.parse(sessionStorage.getItem('initInfo'));
    //   this.category = articleInfo.category;
    //   this.title = articleInfo.title;
    //   this.content = articleInfo.content;
    // }

  },
  methods: {
    // goBack() {
    //   this.$router.push({
    //     path: `/blog/read/${Base32.encode(this.category)}/${Base32.encode(this.title)}`,
    //     replace: false,
    //   })
    // },
    queryCategory() {
      this.$axios.get('/blog/queryCategory').then(res => {
        for (let item of res.data) {
          this.category_options.push(Base32.decode(item))
        }
      }).catch(error => {
        console.log(error);
      })
    },

    $imgAdd(pos, $file) {

      let formData = new FormData()
      // console.log($file);
      // console.log(formData);
      formData.append('file', $file)
      // this.$serve.upload(formdata).then((res) => {
      //   if (res.errCode === '0') {
      //     this.$refs.mavonEditor.$img2Url(pos, this.baseUrl + '/' + res.imgUrl)
      //   }
      // })
      this.$axios.post('/blog/uploadImg', formData).then(res=>{
        if(res.status === 200) {
          const url = res.data
          // console.log(url);
          this.$refs.md.$img2Url(pos, url)
        }
      }).then((response) => {
        // 第二步.将返回的url替换到文本原位置![...](0) -> ![...](url)
        // if (response.status === 200) {
        // var url = response.data.data;
        // console.log("hello world");
        // _this.$refs.md.$img2Url(pos,url)
        // }
      }).catch(err => {
        console.log('failed')
      })
    },
    $imgDel($file, name) {
      let imgName = encodeURI(name)
      this.$axios.get('/blog/delImg?imgName='+imgName).then(res => {
        // console.log(res.data)
      }).catch(err => {
        console.log('failed');
      })
    },
    submit() {
      if(this.editOldArticle === true) {
        this.update_article();
      } else {
        this.write_article();
      }
    },
    update_article() {
      if(this.category === '' || this.title ==='' || this.content === '') {
        this.$alert('标题或类别内容不能为空', '提交失败', {
          confirmButtonText: '确定',
        });
        return;
      }
      let category = Base32.encode(this.category);
      let title = Base32.encode(this.title);
      let content = Base32.encode(this.content);
      if (category === this.old_category && title === this.old_title && content === this.old_content) {
        const h = this.$createElement;
        this.$notify({
          title: '标题名称',
          message: h('i', { style: 'color: red'}, '请勿重复提交!')
        });
        return;
      }
      let data = new FormData();
      let articleInfo = {
        category: category,
        title: title,
        content: content,
        old_category: this.old_category,
        old_title: this.old_title,
        // old_content: this.old_content
      };
      data.append("articleInfo", JSON.stringify(articleInfo));
      this.$axios.post('/blog/updateContent', data).then(res => {
        if(res.data) {
          const h = this.$createElement;
          this.$notify({
            title: '标题名称',
            message: h('i', { style: 'color: green'}, '更新成功!')
          });
          this.submitSuccess = true
          this.old_category = Base32.encode(this.category);
          this.old_title = Base32.encode(this.title);
          this.old_content = Base32.encode(this.content);
        }
      }).catch(error => {
        console.log(error);
      })
    },
    write_article() {
      if(this.category === '' || this.title ==='' || this.content === '') {
        this.$alert('标题或类别内容不能为空', '提交失败', {
          confirmButtonText: '确定',
        });
        return;
      }
      let category = Base32.encode(this.category);
      let title = Base32.encode(this.title);
      let content = Base32.encode(this.content);

      let data = new FormData();

      let articleInfo = {
        category: category,
        title: title,
        content: content,
      };
      data.append("articleInfo", JSON.stringify(articleInfo));
      this.$axios.post('/blog/addNewArticle', data).then(res => {
        if(res.data) {
          const h = this.$createElement;
          this.$notify({
            title: '标题名称',
            message: h('i', { style: 'color: green'}, '添加成功!')
          });
          this.submitSuccess = true;
          this.editOldArticle = true;
          this.old_category = Base32.encode(this.category);
          this.old_title = Base32.encode(this.title);
          this.old_content = Base32.encode(this.content);
        }
      }).catch(error => {
        const h = this.$createElement;
        this.$notify({
          title: '标题名称',
          message: h('i', { style: 'color: red'}, '添加失败!')
        });
      })
    },

    delArticle() {
      let data = new FormData();
      let articleInfo = {
        category: this.old_category,
        title: this.old_title,
      };
      data.append("articleInfo", JSON.stringify(articleInfo));
      this.$axios.post('/blog/delArticle', data).then(res => {
        // console.log(res.data);
        if(res.data) {
          const h = this.$createElement;
          this.$notify({
            title: '标题名称',
            message: h('i', { style: 'color: teal'}, '删除成功!')
          });
          this.$router.replace({
            path: `/blog/${Base32.encode(this.category)}`,
            replace: false,
          })
        }
      }).catch(error => {
        console.log(error);
      })
    },
    LookNewArticle() {
      this.$router.push({
        path: `/blog/${Base32.encode(this.category)}/${Base32.encode(this.title)}`,
        replace: false,
      })
    },
  },

  beforeRouteEnter(to, from, next) {
    // console.log("this_+_:" + from.path);



    next(vm => {
      // if (from.path.indexOf("read") !== -1) {
      //   vm.editOldArticle = true;
        // console.log(vm.editOldArticle);
        // console.log("params: " + from.params.content);
      // }

      //写文章的时候先判断cookie中有没有用户名密码


      //如果是编辑文章，那么把旧文章的信息赋给当前的页面（编码后的信息）
      // if(from.path.indexOf("write") !== -1 && to.params.editOldArticle !== undefined) {
      //   // vm.editOldArticle = to.params.editOldArticle;
      //   vm.old_category = to.params.category;
      //   vm.old_title = to.params.title;
      //   vm.old_content = to.params.content;
      //   vm.new_category = to.params.category;
      //   vm.new_title = to.params.title;
      //   vm.new_content = to.params.content;
      //   // console.log(to.meta.action);
      //   // console.log("edit....");
      //   // console.log(vm.old_category);
      // }
    })
  },
  beforeRouteLeave(to, from, next) {
    // const articleInfo = {
    //   category: this.category,
    //   title: this.title,
    //   content: this.content,
    // };
    // sessionStorage.setItem('getInitInfo', 'true');
    // sessionStorage.setItem('initInfo', JSON.stringify(articleInfo));
    next();

  }





}
</script>

<style scoped>

* {
  margin: 0;
  padding: 0;
}
body, html{
  margin: 0;
  padding: 0;
}

#del {
  display: none;
}

.show {
  display: inline-block !important;
}
#LookBtn {
  display: none;
  color: dodgerblue;
  cursor: pointer;
}
#LookBtn:hover {
  color: red;

}
.showNewArticle {
  display: block !important;
}


</style>
