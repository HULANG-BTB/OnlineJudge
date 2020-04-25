<template>
  <Layout>
    <Header
      class="header"
      :class="{onFocus: headerOnFocus || scrolled}"
      @mouseenter.native="headerOnFocus = true"
      @mouseleave.native="headerOnFocus = false"
    >
      <div class="container">
        <div class="layout-nav">
          <Menu
            mode="horizontal"
            :style="{maxHeight: '8vh', lineHeight: '8vh', background: 'none'}"
            :active-name="currentActive"
            :class="['menu']"
          >
            <MenuItem
              v-for="(item, index) in menuItem"
              :key="index"
              :name="item.name"
              @on-update-active-name="goto"
            >{{ item.title }}</MenuItem>
          </Menu>
        </div>
        <div class="layout-user">
          <div class="login" @click="loginModel = true" v-if="!User.nickname">登录 & 注册</div>
          <div class="login" v-else>
            <Dropdown>
              <a href="javascript:void(0)" :style="{color: '#f6ca9d'}">
                {{ User.nickname }}
                <Icon type="ios-arrow-down"></Icon>
              </a>
              <DropdownMenu slot="list">
                <DropdownItem @click.native="handleUserClick">个人信息</DropdownItem>
                <DropdownItem @click.native="handleStaticsClick">数据统计</DropdownItem>
                <DropdownItem @click.native="handleRankClick">我的提交</DropdownItem>
                <DropdownItem @click.native="handleAdminClick" v-if="Privilege.length">后台管理</DropdownItem>
                <DropdownItem @click.native="handleLogoutClick">退出登录</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
        <div :style="{clear: 'both'}"></div>
        <Login v-model="loginModel"></Login>
      </div>
    </Header>
    <Content :style="{marginBottom: '8vh'}" ref="content">
      <div class="layout-banner">
        <div class="banner-logo">LazyOJ</div>
      </div>
      <div :style="{maxWidth: '70vw', margin: '0 auto'}">
        <router-view></router-view>
      </div>
    </Content>
    <Footer class="footer">Powered By AloneH | Copyright &copy; 2020 AloneH. All rights reserved</Footer>
    <BackTop :bottom="80"></BackTop>
  </Layout>
</template>

<script>
import Login from "./user/login";
export default {
  data() {
    return {
      headerOnFocus: false,
      scrolled: false,
      currentActive: 1,
      menuItem: [
        {
          title: "首页",
          name: "/Index/Index/Info"
        },
        {
          title: "环境",
          name: "/Index/Env/Index"
        },
        {
          title: "题库",
          name: "/Index/Problem/List"
        },
        {
          title: "状态",
          name: "/Index/Status/List"
        },
        {
          title: "排行",
          name: "/Index/Rank/List"
        },
        {
          title: "比赛",
          name: "/Index/Contest/List"
        }
      ],
      loginModel: false
    };
  },
  methods: {
    goto(url) {
      if (this.$route.path !== url) {
        this.$router.push(url);
      }
    },
    handleLogoutClick() {
      this.$axios
        .get("/api/user/logout")
        .then(res => {
          if (res.data.code === 1) {
            this.$store.dispatch("getUserInfo");
            this.$Message.success("注销成功！");
          } else {
            this.$Message.error("注销失败！");
          }
        })
        .catch(() => {
          this.$Message.error("网络错误！");
        });
    },
    handleRankClick() {
      this.$router.push({
        path: "/Index/Rank/List",
        query: {
          uid: this.$store.state.User.uid
        }
      });
    },
    handleUserClick() {
      this.$router.push({
        path: "/Index/User/Info"
      });
    },
    handleStaticsClick() {
      this.$router.push({
        path: "/Index/User/Statics"
      });
    },
    handleAdminClick() {
      this.$router.push({
        path: "/Admin/Index/Index"
      });
    }
  },
  computed: {
    User() {
      return this.$store.state.User || {};
    },
    Privilege() {
      return this.$store.state.Privilege || {};
    }
  },
  created() {
    this.currentActive = this.$route.path;
  },
  mounted() {
    window.addEventListener("mousewheel", () => {
      this.scrolled =
        document.body.scrollTop > 0 || document.documentElement.scrollTop > 0;
    });
  },
  watch: {
    $route(nVal) {
      this.currentActive = nVal.path;
    }
  },
  components: {
    Login
  }
};
</script>

<style scoped>
.layout {
  border: 1px solid #d7dde4;
  background: #f5f7f9;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
}
.layout-user {
  max-width: 7vw;
  border-radius: 3px;
  float: right;
  position: relative;
  right: 20px;
  line-height: 8vh;
  max-height: 8vh;
}
.layout-nav {
  max-width: 70vw;
  max-height: 51px;
  margin: 0 auto;
  margin-right: 20px;
  float: left;
  overflow: hidden;
}
.layout-banner {
  background-image: url("../../assets/img/header-background.png");
  height: 180px;
}
.header {
  background: none;
  color: #f6ca9d;
  padding: 0;
  box-sizing: inherit;
  max-height: 8vh;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  transition: all 1s ease-in-out;
  z-index: 99999;
}
.menu .ivu-menu-item {
  border: none;
}
.menu .ivu-menu-item:hover {
  border: none;
}
.onFocus.header {
  background-image: url("../../assets/img/navbar-background.png");
  opacity: 0.85
}
.container {
  width: 70vw;
  margin: 0 auto;
  height: 8vh;
}
.banner-logo {
  font-size: 2rem;
  top: 90px;
  position: relative;
  left: 15vw;
  max-width: 300px;
}
.login:hover::before {
  content: " ";
  width: 100%;
  height: 5px;
  background-color: #ed5f82;
  position: absolute;
  left: 0;
  right: 0;
}
.login::before {
  content: "";
}
.login:hover {
  color: #2d8cf0;
}
.login {
  padding: 0 1rem;
  transition: all 0.2s ease-in-out;
}
.footer {
  margin: 0 auto;
  bottom: 0;
  text-align: center;
  max-height: 8vh;
  position: fixed;
  width: 100vw;
  z-index: 1000;
}
</style>>