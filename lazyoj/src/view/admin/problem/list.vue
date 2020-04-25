<template>
  <div>
    <Row :gutter="16">
      <i-col :span="24">
        <Card>
          <div slot="title">
            <h1 :style="{textAlign: 'center'}">题目列表</h1>
          </div>
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
              @click="fetchData"
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
            :style="{marginTop: '1rem'}"
            @on-change="handlePageOnChange"
            @on-page-size-change="handlePageSizeChange"
          />
        </Card>
      </i-col>
      <Modal v-model="deleteModel" width="360">
        <p slot="header" style="color:#f60;text-align:center">
          <Icon type="ios-information-circle"></Icon>
          <span>警告</span>
        </p>
        <div style="text-align:center">
          <p>删除后数据将不可恢复！</p>
          <p>确定删除?</p>
        </div>
        <div slot="footer">
          <Button
            type="error"
            size="large"
            long
            :loading="deleteModelLoading"
            @click="confirmDel"
          >删除</Button>
        </div>
      </Modal>
      <Modal footer-hide v-model="editModel" fullscreen title="编辑题目">
        <Edit v-if="editModel" :info="editInfo"></Edit>
      </Modal>
      <Modal footer-hide v-model="dataModel" fullscreen :width="50" title="编辑数据">
        <Data v-if="dataModel" :info="dataInfo" :mask-closable="false"></Data>
      </Modal>
    </Row>
  </div>
</template>

<script>
import Edit from "./edit";
import Data from "./data";
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
          title: "id",
          key: "id",
          sortable: true,
          align: "center",
          width: "80px",
          ellipsis: true
        },
        {
          title: "标题",
          key: "title",
          sortable: true,
          width: "350px",
          ellipsis: true
        },
        {
          title: "来源",
          key: "source",
          minWidth: 100,
          sortable: true,
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
          title: "创建时间",
          key: "createdAt",
          sortable: true,
          width: "220px",
          align: "center",
          ellipsis: true
        },
        {
          title: "修改时间",
          key: "updatedAt",
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
                      this.handleEditClick(params);
                    }
                  }
                },
                "Edit"
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
                      this.handleDataClick(params);
                    }
                  }
                },
                "Data"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.handleDeleteClick(params);
                    }
                  }
                },
                "Delete"
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
      tableLoading: true,
      selection: [],
      deleteModel: false,
      deleteModelLoading: false,
      deleteInfo: {},
      editModel: false,
      editModelLoading: false,
      editInfo: {},
      dataModel: false,
      dataModelLoading: false,
      dataInfo: {}
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
    handleOnSelectionChange(selection) {
      this.selection = selection;
    },
    handlePageSizeChange(size) {
      this.page.limit = size;
      this.fetchData();
    },
    handleSwitchClick(row, value) {
      this.$axios
        .post("/api/problem/toggleProblemStatus", {
          id: row.id,
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
    handleEnableClick() {
      let enableList = {
        pid: []
      };
      this.selection.forEach(e => {
        enableList.pid.push(e.id);
      });
      this.tableLoading = true;
      this.$axios
        .post("/api/problem/enable", enableList)
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
      let disableList = {
        pid: []
      };
      this.selection.forEach(e => {
        disableList.pid.push(e.id);
      });
      this.tableLoading = true;
      this.$axios
        .post("/api/problem/disable", disableList)
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
    handleEditClick(params) {
      this.editInfo = params.row;
      this.editModel = true;
    },
    handleDataClick(params) {
      this.dataInfo = params.row;
      this.dataModel = true;
    },
    handleDeleteClick(params) {
      this.deleteInfo = params;
      this.deleteModel = true;
    },
    fetchData() {
      this.tableLoading = true;
      this.$axios.get("/api/problem/list", { params: this.page }).then(res => {
        this.data = res.data.data.data;
        this.page.total = res.data.data.count;
        this.tableLoading = false;
      });
    },
    confirmDel() {
      this.deleteModelLoading = true;
      this.$axios
        .post("/api/problem/delete", { id: this.deleteInfo.row.id })
        .then(res => {
          this.deleteModelLoading = false;
          this.deleteModel = false;
          if (res.data.code === 1) {
            this.$Message.success(res.data.msg);
            this.fetchData();
          } else {
            this.$Message.error(res.data.msg);
          }
          this.deleteInfo = null;
        })
        .catch(() => {
          this.deleteModelLoading = false;
          this.deleteModel = false;
          this.$Message.error("未知错误！");
          this.deleteInfo = null;
        });
    }
  },
  mounted() {},
  created() {
    this.fetchData();
  },
  components: {
    Edit,
    Data
  }
};
</script>

<style scoped>
</style>