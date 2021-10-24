<template>
  <main>
    <h1>
      <span
        class="fanhui"
        @click="
          $router.push({
            name: 'Table',
            params: { floorIndex: $route.query.deskId.charAt(3) - 1 },
          })
        "
      ></span>
      <span id="cpbti">{{ $route.query.deskCaption }}餐台</span
      ><span
        class="wdcd"
        @click="
          $router.push({
            name: 'order',
            query: {
              deskId: $route.query.deskId,
              deskCaption: $route.query.deskCaption,
            },
          })
        "
        >下单</span
      >
    </h1>
    <div class="bigbox">
      <ul class="cailei">
        <li
          v-for="(item, index) in menuClass"
          :key="index"
          :class="{ flasg: index == flag }"
          @click="changeClass(index)"
        >
          {{ item.menuClassCaption }}
          <div
            :class="{ zcot: true, xianshen: menuClass[index].count != '' }"
            style="display: none"
          >
            {{ menuClass[index].count || 1 }}
          </div>
        </li>
      </ul>
      <ul class="caim">
        <li
          :class="flag != 5 ? 'cai' : 'jiu'"
          v-for="(item, index) in menuList"
          :key="index"
        >
          <div class="danjia">
            <h6>{{ item.menuName }}</h6>
            <h6>
              {{
                item.promotionPrice == item.menuPrice
                  ? ""
                  : item.menuPrice + "元/份"
              }}
            </h6>
            <h6>{{ item.promotionPrice }}元/份</h6>
          </div>
          <div v-if="flag != 5">
            <div
              :class="{ ccount: true, xianshen: menuList[index].menuCount > 0 }"
              style="display: none"
            >
              {{ item.menuCount || 1 }}
            </div>
            <div class="status">{{ menuzt[item.menuStatus] }}</div>
            <div class="chbox" @click="addMenu(index)">
              <div
                :class="{ xgj: true, xianshen: menuList[index].menuCount > 0 }"
                style="display: none"
              ></div>
            </div>
          </div>
          <div class="jcout" v-else>
            <div @click="upKey(0, index)"></div>
            <div class="jcount">{{ item.menuCount * 1 + 0 }}</div>
            <div @click="upKey(1, index)"></div>
          </div>
        </li>
      </ul>
    </div>
    <div class="zzc" v-if="keyFlag[0]">
      <div>
        <div
          v-for="(item, index) in numberKey"
          :key="index"
          :class="{
            szan: true,
            hui: keyFlag[1] == 0 && item > menuList[keyFlag[2]].menuCount,
          }"
          @click="downKey(index)"
        >
          {{ item }}
        </div>
      </div>
    </div>
    4
    <div
      class="tmycd"
      @click="
        $router.push({
          name: 'mycarte',
          query: {
            deskId: $route.query.deskId,
            deskCaption: $route.query.deskCaption,
          },
        })
      "
    >
      我的菜单
    </div>
  </main>
</template>

<script>
import Bus from "../common/bus";
import Url from "../common/Url";
export default {
  data() {
    return {
      //菜类
      menuClass: [],
      //高亮
      flag: 0,
      //菜谱列表
      menuList: [],
      //数字键盘
      numberKey: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 0, 12],
      keyFlag: [false, "", ""], //弹起，加减，当前索引
      //当前菜的状态
      menuzt: { 1: "已点", 3: "以上", 4: "退菜", 5: "回锅", 8: "催菜" },
    };
  },
  created() {
    this.getMenu();
  },
  methods: {
    //菜类列表
    getClass() {
      const p = new URLSearchParams();
      p.append("deskId", this.$route.query.deskId);
      return new Promise((resolve, reject) => {
        this.$http
          .post("/api/" + Url.menuclass, p)
          .then((res) => {
            resolve(res.data.responseBody.menuClassList);
          })
          .catch(() => {
            reject("操作失败！");
          });
      });
    },
    //菜谱列表
    async getMenu() {
      this.menuClass = await this.getClass();
      const p = new URLSearchParams();
      p.append("menuClassId", this.menuClass[this.flag].menuClassId);
      p.append("deskId", this.$route.query.deskId);
      p.append("pageIndex", 1);
      p.append("pageSize", 20);
      this.$http
        .post("/api/" + Url.menu, p)
        .then((res) => {
          if (res.data.errCode === "000") {
            this.menuList = [...res.data.responseBody.menuList];
          } else {
            Bus.$emit("tools", true, "传输的数据错误");
          }
        })
        .catch(() => {
          Bus.$emit("tools", true, "操作错误！");
        });
    },
    //切换菜类
    changeClass(index) {
      this.flag = index;
      this.getMenu();
    },
    //勾选添加取消菜
    addMenu(index) {
      if (this.menuList[index].menuCount == ("" || 0)) {
        this.menuList[index].menuCount = 1;
        //大类加1
        this.menuClass[this.flag].count =
          this.menuClass[this.flag].count * 1 + 1;
        const p = new URLSearchParams();
        p.append("menuId", this.menuList[index].menuId);
        p.append("deskId", this.$route.query.deskId);
        p.append("deskCaption", this.$route.query.deskCaption);
        this.$http.post("/api/" + Url.addmenu, p).then((res) => {
          this.menuList[index].lineNo = res.data.responseBody.lineNo;
        });
      } else {
        this.menuList[index].menuCount = 0;
        //大类减1
        this.menuClass[this.flag].count -= 1;
        const p = new URLSearchParams();
        p.append("lineNo", this.menuList[index].lineNo);
        p.append("menuId", this.menuList[index].menuId);
        p.append("deskId", this.$route.query.deskId);
        this.$http.post("/api/" + Url.submenu, p);
      }
    },
    //加减键盘弹起
    upKey(on, index) {
      this.keyFlag = [true, on, index];
    },
    //按下键盘
    downKey() {
      this.keyFlag.splice(0, 1, false);
    },
  },
};
</script>

<style scoped>
@import url("../assets/menu.css");
</style>