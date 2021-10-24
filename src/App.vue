<template>
  <div id="app">
    <router-view></router-view>
    <div :class="{ cuowu: true, hide: hide }">
      <div>
        <div>温馨提示</div>
        <div>{{ msg }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import Bus from "@/common/bus";
export default {
  name: "App",
  data() {
    return {
      hide: false,
      msg: "",
    };
  },
  created() {
    Bus.$on("tools", (hide, msg) => {
      this.hide = hide;
      this.msg = msg;
      setTimeout(() => {
        this.hide = false;
        this.msg = "";
      }, 2000);
    });
  },
  components: {},
};
</script>

<style>
@import url("assets/base.css");
</style>
