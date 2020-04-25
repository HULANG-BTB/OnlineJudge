<template>
  <div class="layout">
    <Layout>
      <Sider
        ref="sider"
        class="sider"
        hide-trigger
        collapsible
        :collapsed-width="78"
        v-model="isCollapsed"
        :class="['theme-dark']"
      >
        <Header
          :style="{padding: isCollapsed ? '0' : ''}"
          :class="['theme-dark']"
          class="sider-logo"
        >
          <span>Logo</span> 标题
        </Header>
        <Content>
          <div class="sider-nav">
            <Menu :active-name="currentActive" :class="['theme-dark']" width="200">
              <MenuGroup :title="index" v-for="(menu, index) in menuItem" :key="index">
                <MenuItem
                  :name="item.name"
                  @on-update-active-name="goto"
                  v-for="(item, name) in menu"
                  :key="name"
                >
                  <Icon :type="item.icon" />
                  <span>{{item.title}}</span>
                </MenuItem>
              </MenuGroup>
            </Menu>
          </div>
        </Content>
      </Sider>
      <Layout>
        <Header class="header" :style="{posion: 'fixed', width: '100%'}">
          <div class="header-icon">
            <Icon :class="rotateIcon" type="ios-options" v-on:click="toggleCollapse" />
          </div>
          <div class="header-nav"></div>
        </Header>
        <Content class="content">
          <router-view></router-view>
          <BackTop :bottom="80"></BackTop>
        </Content>
        <Footer class="footer">Powered By AloneH | Copyright &copy; 2020 AloneH. All rights reserved</Footer>
      </Layout>
    </Layout>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isCollapsed: false,
      currentActive: null,
      menuItem: {
        MAIN: [
          {
            title: "管理首页",
            icon: "ios-home",
            name: "/Admin/Index"
          },
          {
            title: "查看前台",
            icon: "ios-log-out",
            name: "/Index/Index/Index"
          }
        ],
        NORMAL: [
          {
            title: "设置公告",
            icon: "ios-clipboard",
            name: "/Admin/Normal/Notice"
          },
          {
            title: "新闻列表",
            icon: "ios-list",
            name: "/Admin/Normal/News"
          },
          {
            title: "添加新闻",
            icon: "ios-add",
            name: "/Admin/Normal/addNews"
          }
        ],
        PROBLEM: [
          {
            title: "问题列表",
            icon: "ios-list",
            name: "/Admin/Problem/List"
          },
          {
            title: "添加问题",
            icon: "ios-add",
            name: "/Admin/Problem/Add"
          },
          {
            title: "导入问题",
            icon: "ios-cloud-upload",
            name: "/Admin/Problem/Import"
          },
          {
            title: "导出问题",
            icon: "ios-cloud-download",
            name: "/Admin/Problem/Export"
          },
          {
            title: "题目重判",
            icon: "ios-home",
            name: "/Admin/Problem/Judge"
          }
        ],
        CONTEST: [
          {
            title: "竞赛列表",
            icon: "ios-list",
            name: "/Admin/Contest/list"
          },
          {
            title: "添加竞赛",
            icon: "ios-add",
            name: "/Admin/Contest/add"
          }
        ],
        USER: [
          {
            title: "用户列表",
            icon: "ios-list",
            name: "/Admin/User/list"
          },
          {
            title: "比赛账号",
            icon: "ios-contact",
            name: "/Admin/User/Index"
          },
          {
            title: "权限管理",
            icon: "ios-create",
            name: "/Admin/User/Privilege"
          }
        ]
      }
    };
  },
  computed: {
    rotateIcon() {
      return this.isCollapsed ? "sider-hide" : "";
    }
  },
  methods: {
    toggleCollapse() {
      this.isCollapsed = !this.isCollapsed;
      this.$refs.sider.toggleCollapse();
    },
    goto(url) {
      if (this.$route.path !== url) {
        this.$router.push(url);
        console.log(url);
      }
    }
  },
  mounted() {
    this.currentActive = this.$route.path;
  }
};
</script>

<style scoped>
.sider {
  height: 100vh;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.sider .ivu-layout-header {
  text-align: center;
  max-height: 7vh;
  min-height: 60px;
}
.sider-hide {
  transform: rotate(90deg);
}
.sider-logo {
  background: #1d1e23;
  border-bottom: 1px solid #000;
  color: #f6ca9d;
}
.sider-nav {
  max-height: 91vh;
  overflow-y: scroll;
}
.sider-nav::-webkit-scrollbar {
  display: none;
}
.header {
  background: linear-gradient(90deg, #1d1e23, #3f4045);
  color: #f6ca9d;
  padding: 0;
  box-sizing: inherit;
  max-height: 7vh;
  min-height: 60px;
}
.header-icon {
  margin-left: 1rem;
  margin-right: 1rem;
  font-size: 1.6rem;
}
.header-icon i {
  transition: all 0.3s ease-in-out;
}
.content {
  overflow: auto;
  max-height: 85vh;
  min-height: 85vh;
  padding: 3rem;
  position: relative;
}
.footer {
  margin: 0 auto;
  bottom: 0;
  text-align: center;
  max-height: 7vh;
}
</style>