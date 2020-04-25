<template>
  <div>
    <Row :gutter="16">
      <i-col :span="24">
        <Card>
          <h1 :style="{textAlign: 'center'}">用户列表</h1>
          <Row :style="{marginBottom: '1rem'}">
            <Button
              type="error"
              large
              @click="handleDisableClick"
              :disabled="selection.length === 0"
            >禁用选择</Button>
            <Button
              type="success"
              :style="{marginLeft: '1rem'}"
              large
              @click="handleEnableClick"
              :disabled="selection.length === 0"
            >启用选择</Button>
            <Button
              type="success"
              :style="{marginLeft: '1rem'}"
              large
              @click="handleReloadClick"
            >重载数据</Button>
          </Row>
          <Table
            :columns="columns"
            :data="data"
            ref="table"
            :max-height="maxHeight"
            :loading="tableLoading"
            border
            @on-selection-change="handleOnSelectionChange"
          ></Table>
          <Page
            :total="page.total"
            :page-size="page.limit"
            show-elevator
            show-sizer
            :style="{marginTop: '1rem', marginBottom: '1rem'}"
            @on-change="handlePageOnChange"
            @on-page-size-change="handlePageSizeChange"
          />
        </Card>
      </i-col>
      <Modal footer-hide v-model="logModel" :width="50" title="登录日志">
        <Log v-if="logModel" :info="logInfo"></Log>
      </Modal>
      <Modal footer-hide v-model="detailModel" :width="50" title="详细信息">
        <Info v-if="detailModel" :info="detailInfo" :mask-closable="false"></Info>
      </Modal>
    </Row>
  </div>
</template>

<script>
import Log from "./loginLog";
import Info from './info'
export default {
  data() {
    return {
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "用户名",
          key: "username",
          sortable: true,
          width: "160px",
          ellipsis: true
        },
        {
          title: "昵称",
          key: "nickname",
          sortable: true,
          width: "160px",
          ellipsis: true
        },
        {
          title: "邮箱",
          key: "email",
          minWidth: 100,
          sortable: true,
          ellipsis: true
        },
        {
          title: "学校",
          key: "school",
          sortable: true,
          width: "220px",
          align: "center",
          ellipsis: true
        },
        {
          title: "状态",
          key: "defunct",
          width: "100px",
          align: "center",
          render: (h, params) => {
            return h("i-switch", {
              //数据库1是已处理，0是未处理
              props: {
                type: "primary",
                value: params.row.defunct === "N" //控制开关的打开或关闭状态，官网文档属性是value
              },
              style: {
                marginRight: "5px"
              },
              on: {
                "on-change": value => {
                  //触发事件是on-change,用双引号括起来，参数value是回调值，并没有使用到
                  this.handleSwitchClick(params.row, value); //params.index是拿到table的行序列，可以取到对应的表格值
                }
              }
            });
          }
        },
        {
          title: "通过",
          key: "accepted",
          sortable: true,
          width: "100px",
          align: "center"
        },
        {
          title: "提交",
          key: "submit",
          sortable: true,
          width: "100px",
          align: "center"
        },
        {
          title: "注册时间",
          key: "createdAt",
          sortable: true,
          width: "220px",
          align: "center",
          ellipsis: true
        },
        {
          title: "操作",
          key: "id",
          width: "200px",
          align: "center",
          fixed: "right",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.handleLogClick(params);
                    }
                  }
                },
                "Log"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "success",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.handleDetailClick(params);
                    }
                  }
                },
                "Detail"
              )
            ]);
          }
        }
      ],
      data: [],
      page: {
        page: 1,
        limit: 30,
        total: 0
      },
      selection: [],
      tableLoading: true,
      logModel: false,
      logModelLoading: false,
      LogInfo: {},
      detailModel: false,
      detailModelLoading: false,
      detailInfo: {}
    };
  },
  computed: {
    maxHeight() {
      return document.documentElement.clientHeight * 0.6;
    }
  },
  methods: {
    handlePageOnChange(page) {
      this.page.page = page;
      this.fetchData();
    },
    handlePageSizeChange(size) {
      this.page.limit = size;
      this.fetchData();
    },
    handleSwitchClick(row, value) {
      this.$axios
        .post("/api/user/toggleUserStatus", {
          uid: row.uid,
          val: value ? "N" : "Y"
        })
        .then(res => {
          if (res.data.code !== 1) {
            this.$Message.error(res.data.msg);
            this.data[row._index].defunct = "";
            this.fetchData();
          } else {
            this.$Message.success(res.data.msg);
            this.fetchData();
          }
        });
    },
    handleReloadClick() {
      this.fetchData()
    },
    handleLogClick(params) {
      this.logInfo = params.row;
      this.logModel = true;
    },
    handleDetailClick(params) {
      this.detailInfo = params.row;
      this.detailModel = true;
    },
    handleOnSelectionChange(selection) {
      this.selection = selection;
    },
    fetchData() {
      this.tableLoading = true;
      this.$axios.get("/api/user/list", { params: this.page }).then(res => {
        this.data = res.data.data.data;
        this.page.total = res.data.data.count;
        this.tableLoading = false;
      });
    },
    handleEnableClick() {
      let enableList = {
        uid: []
      };
      this.selection.forEach(e => {
        enableList.uid.push(e.uid);
      });
      this.tableLoading = true;
      this.$axios
        .post("/api/user/enableUser", enableList)
        .then(res => {
          if (res.data.code === 1) {
            this.$Message.success("启用成功！");
          } else {
            this.$Message.error("启用失败");
          }
          this.fetchData();
          this.tableLoading = false;
        })
        .catch(() => {
          this.$Message.error("网络错误！");
          this.tableLoading = false;
        });
    },
    handleDisableClick() {
      let enableList = {
        uid: []
      };
      this.selection.forEach(e => {
        enableList.uid.push(e.uid);
      });
      this.tableLoading = true;
      this.$axios
        .post("/api/user/disableUser", enableList)
        .then(res => {
          if (res.data.code === 1) {
            this.$Message.success("启用成功！");
          } else {
            this.$Message.error("启用失败");
          }
          this.fetchData();
          this.tableLoading = false;
        })
        .catch(() => {
          this.$Message.error("网络错误！");
          this.tableLoading = false;
        });
    }
  },
  mounted() {},
  created() {
    this.fetchData();
  },
  components: {
    Log,
    Info
  }
};
</script>

<style scoped>
</style>