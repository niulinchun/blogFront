<template>
  <el-row style="height: 100%;width: 100%;background: url('../../static/6.jpg') no-repeat;background-size: 100%;">
    <el-header style="height: 30%"></el-header>
    <el-row style="height: 60%;text-align: center;width: 100%">
      <div style="width: 250px;height: 40px;;margin: 0 auto;">
        <el-input v-model="username" placeholder="请输入用户名" style="height: 40px;margin-bottom: 10px" type="text"></el-input>
        <el-input v-model="password" placeholder="请输入密码" style="height: 40px;margin-bottom: 10px" type="password"></el-input>
        <el-button type="primary" style="width: 100%;height: 40px" @click="userLogin">登录</el-button>
      </div>
    </el-row>

  </el-row>
</template>

<script>
// import Axios from 'axios'
import {Base64} from "js-base64";

export default {
  name: "Login",
  data() {
    return {
      username: 'admin',
      password: '',
      category: "",
      title: ""
    }
  },

  created() {

  },
  mounted() {
  //   if (sessionStorage.getItem("category_and_title") === undefined) {
  //     return;
  //   }
  //   const category_and_title = JSON.parse(sessionStorage.getItem("category_and_title"));
  //   this.category = category_and_title.category;
  //   this.title = category_and_title.title;
  //   console.log(this.category);

    if (this.$route.params.category !== undefined) {
      this.category = this.$route.params.category;
      this.title = this.$route.params.title;
    }

  },
  beforeRouteEnter(to, from, next) {


    next(vm => {

    })
  },
  methods: {
    userLogin() {
      let userData = new FormData()
      let user = {
        username: this.username,
        password: this.password,
      };
      userData.append("userData", JSON.stringify(user))


      //登录和后端交互
      this.$axios.post("/blog/userLogin", userData).then(res => {
        if(res) {
          document.cookie = "username="+this.username+";expires=2"
          if (this.category.length !== 0) {
            this.$router.push({
              path: `/blog/${this.category}/${this.title}`,
              params: {
                // category: this.current_category,
                // title: this.current_title,
                // content: this.ori_content,
                // newContent: this.article_content,
              }
            })
          } else {
            this.$router.replace({
                name: 'write',
            })
          }
        } else {
          this.$alert('用户名或密码错误', '登录失败', {
            confirmButtonText: '确定',
            // callback: action => {
            //   this.$message({
            //     type: 'info',
            //     message: `action: ${ action }`
            //   });
            // }
          });
        }

      }).catch(err => {
        console.log("登录失败");
      })
    }
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
}
</style>
