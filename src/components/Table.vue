<template>
  <main>
    <div class="bighz">
      <h1><span class="fanhui" @click="$router.push('/')"></span> 餐台</h1>
      <div class="svp container">
        <div>
          <span
            v-for="(item, index) in floorList"
            :key="index"
            :class="{ ggspan: index == floorIndex }"
            @click="changeFloor(index)"
          >
            {{ item.deskAreaCaption }}
          </span>
        </div>
      </div>
      <div class="div1">
        <div
          :class="{ canzuo: true, kcanzuo: item.deskStatus == 1 }"
          v-for="(item, index) in tableList"
          :key="index"
          @click="changePath(item.deskStatus, index)"
        >
          <h6>{{ (item.totalAmount * 1).toFixed(2) }}元</h6>
          <h6>{{ item.deskCaption }}</h6>
          <h6>{{ item.createTime.substr(11, 16) }}</h6>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import Bus from "../common/bus";
import Url from "../common/Url";
export default {
  name: "Table",
  data() {
    return {
      floorList: [],
      floorIndex: this.$route.params.floorIndex || 0,
      // 餐台列表
      tableList: [],
      tableIndex: -1,
    };
  },
  created() {
    console.log(this.$route.params.floorIndex);
    this.getTable();
  },
  methods: {
    //获取楼层
    getFloor() {
      return new Promise((resolve, reject) => {
        this.$http
          .post("/api/" + Url.dingni)
          .then((res) => {
            if (res.data.errCode === "000") {
              resolve(res.data.responseBody.deskAreaList);
            }
          })
          .catch(() => {
            Bus.$emit("tools", true, "操作出错");
            reject({ errMsg: "操作出错" });
          });
      });
    },
    //获取餐台
    async getTable() {
      this.floorList = await this.getFloor();
      const p = new URLSearchParams();
      p.append("deskAreaId", this.floorList[this.floorIndex].deskAreaId);
      this.$http
        .post("/api/" + Url.table, p)
        .then((res) => {
          if (res.data.errCode == "000") {
            this.tableList = res.data.responseBody.deskTopList;
          }
        })
        .catch(() => {
          Bus.$emit("tools", true, "操作出错");
        });
    },
    //切换楼层
    changeFloor(i) {
      this.floorIndex = i;
      this.getTable(i);
    }, //切换进入菜谱或者客户信息
    changePath(status, index) {
      const deskId = this.tableList[index].deskId;
      const deskCaption = this.tableList[index].deskCaption;
      if (status == "1") {
        this.$router.push({ name: "Guest", query: { deskId, deskCaption } });
      } else {
        this.$router.push({ name: "Menu", query: { deskId, deskCaption } });
      }
    },
  },
};
</script>

<style scoped>
@import url("../assets/table.css");
</style>