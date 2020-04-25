<template>
  <div>
    <Row :gutter="16">
      <i-col>
        <h1 :style="{textAlign: 'center'}">题目列表</h1>
        <Row :style="{marginBottom: '1rem'}">
          <Button type="primary" large @click="handleAddProblemClick">添加题目</Button>
          <Button
            type="error"
            :style="{marginLeft: '1rem'}"
            large
            @click="handleDeleteAllClick"
            :disabled="selection.length === 0"
          >删除选中</Button>
        </Row>
        <Table
          :loading="tableLoading"
          :columns="columns"
          :data="problemList"
          ref="table"
          max-height="350"
          border
          :style="{marginBottom: '1rem'}"
          @on-selection-change="handleOnSelectionChange"
        ></Table>
      </i-col>
    </Row>
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
        <Button type="error" size="large" long :loading="deleteModelLoading" @click="confirmDel">删除</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
export default {
  data() {
    return {
      problemList: [],
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "题目",
          key: "pid",
          sortable: true,
          align: "center",
          width: "80px",
          ellipsis: true
        },
        {
          title: "序号",
          key: "num",
          sortable: true,
          align: "center",
          width: "80px",
          ellipsis: true
        },
        {
          title: "标题",
          key: "title",
          sortable: true,
          align: "center",
          ellipsis: true,
          render: (h, params) => {
            return h('div', [
              h('span', params.row.problem.title)
            ])
          }
        },
        {
          title: "操作",
          key: "id",
          width: "110px",
          align: "center",
          fixed: "right",
          render: (h, params) => {
            return h("div", [
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
      selection: [],
      addProblem: "",
      tableLoading: true,
      deleteModel: false,
      deleteModelLoading: false,
      deleteInfo: {}
    };
  },
  props: {
    info: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  methods: {
    handleDeleteClick(params) {
      this.deleteInfo = {
        pid: [params.row.pid],
        cid: this.info.id
      };
      this.deleteModel = true;
    },
    handleOnSelectionChange(selection) {
      this.selection = [];
      selection.forEach(e => {
        this.selection.push(e.pid);
      });
    },
    handleAddProblemClick() {
      this.addProblem = "";
      this.$Modal.confirm({
        render: h => {
          return h("Input", {
            props: {
              value: this.addProblem,
              autofocus: true,
              placeholder: "请输入题目号，多个用空格隔开"
            },
            on: {
              input: val => {
                this.addProblem = val;
              }
            }
          });
        },
        onOk: () => {
          this.tableLoading = true;
          this.$axios
            .post("/api/contest/addProblem", {
              pid: this.addProblem.split(" "),
              cid: this.info.id,
              base: this.problemList.length + 1
            })
            .then(res => {
              if (res.data.code === 1) {
                this.$Message.success("添加成功！");
              } else {
                this.$Message.error(res.data.msg);
              }
              this.getContestProblemList();
              this.tableLoading = false;
            })
            .catch(() => {
              this.$Message.error("网络错误！");
              this.tableLoading = false;
            });
        }
      });
    },
    handleDeleteAllClick() {
      this.deleteInfo = {
        pid: this.selection,
        cid: this.info.id
      };
      this.deleteModel = true;
    },
    getContestProblemList() {
      this.tableLoading = true;
      this.$axios
        .get("/api/contest/getProblemList", { params: { cid: this.info.id } })
        .then(res => {
          if (res.data.code === 1) {
            this.problemList = res.data.data;
          }
          this.tableLoading = false;
        });
    },
    confirmDel() {
      this.deleteModelLoading = true;
      this.$axios
        .post("/api/contest/deleteProblem", this.deleteInfo)
        .then(res => {
          if (res.data.code === 1) {
            this.$Message.success("删除成功！");
          } else {
            this.$Message.error(res.data.msg);
          }
          this.deleteInfo = {};
          this.deleteModelLoading = false;
          this.deleteModel = false;
          this.getContestProblemList();
        })
        .catch(() => {
          this.$Message.error("网络错误！");
          this.deleteInfo = {};
        });
    }
  },
  mounted() {
    this.getContestProblemList();
  }
};
</script>

<style scoped>
</style>