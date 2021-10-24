<template>
  <main>
    <div>
      <h1>登录</h1>
      <div class="login">
        <ul>
          <li class="ipt1">
            <span>账号 :</span
            ><input
              type="text"
              v-model.trim="memberId"
              placeholder="请输入账号"
            /><span class="del" @click="memberId = ''"></span>
          </li>
          <li class="ipt1">
            <span>密码 :</span
            ><input
              type="password"
              v-model.trim="password"
              placeholder="请输入密码"
            /><span class="del" @click="password = ''"></span>
          </li>
          <li>
            <span>自动登录:</span>
            <span id="an" @click="flag = !flag" :class="{ nnn: flag }"
              ><span id="kg" :class="{ zzz: flag }"></span
            ></span>
          </li>
        </ul>
        <div id="dbtn" @click="login">登录</div>
      </div>
    </div>
  </main>
</template>

<script>
import Url from "../common/Url";
import Bus from "@/common/bus";
export default {
  name: "Login",
  data() {
    return {
      memberId: "",
      password: "",
      flag: false,
    };
  },
  created() {
    sessionStorage.removeItem("memberId");
    sessionStorage.removeItem("memberName");
    localStorage.getItem("memberId") != undefined
      ? (this.memberId = localStorage.getItem("memberId")) &&
        (this.password = localStorage.getItem("password")) &&
        (this.flag = true)
      : "";
  },
  methods: {
    login() {
      //判断账号是否为空
      if (this.memberId == "") {
        Bus.$emit("tools", true, "请输入账号");
        return;
      }
      if (this.password == "") {
        Bus.$emit("tools", true, "请输入密码");
        return;
      }
      const p = new URLSearchParams();
      p.append("memberId", this.memberId);
      p.append("password", this.password);
      this.$http
        .post("/api/" + Url.login, p)
        .then((res) => {
          console.log(res.data.responseBody);
          if (res.data.responseBody.memberId != "") {
            //保存密码
            console.log(520);
            if (this.flag == true) {
              localStorage.setItem("memberId", this.memberId);
              localStorage.setItem("password", this.password);
            } else {
              localStorage.removeItem("password");
              localStorage.removeItem("memberId");
            }
            //跳转页面
            sessionStorage.setItem("memberId", res.data.responseBody.memberId);
            sessionStorage.setItem(
              "memberName",
              res.data.responseBody.memberName
            );
            this.$router.push("/table");
            //
          } else {
            Bus.$emit("tools", true, "账号密码错误！");
          }
        })
        .catch(() => {
          console.log(1);
          Bus.$emit("tools", true, "操作出错");
        });
    },
  },
};
</script>

<style scoped>
@import url("../assets/login.css");
</style>