<template>
  <Row :gutter="16" :style="{marginTop: '1.5rem'}">
    <Col :span="24">
      <Card>
        <div slot="title">
          <h1 :style="{textAlign: 'center'}">评测队列</h1>
        </div>
        <Row :style="{marginBottom: '1rem'}">
          <Input search enter-button="Search / Reload" @on-search="handleSearchOrReloadClick" placeholder="Enter something..." />
        </Row>
        <Table
          :columns="tableColumns"
          :data="tableData"
          ref="table"
          :loading="tableLoading"
          border
          stripe
          size="small"
          :max-height="500"
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
    </Col>
  </Row>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      tableColumns: [
        {
          title: "提交编号",
          key: "sid",
          sortable: true,
          align: "center",
          width: "120px",
          ellipsis: true
        },
        {
          title: "用户",
          key: "uid",
          width: "120px",
          align: "center",
          render: (h, params) => {
            return h(
              "div",
              {
                on: {
                  dblclick: () => {
                    this.$router.push({
                      path: "/Index/User/Detail",
                      query: { id: params.row.uid }
                    });
                  }
                }
              },
              [h("span", params.row.user.nickname)]
            );
          }
        },
        {
          title: "问题编号",
          key: "pid",
          width: "120px",
          sortable: true,
          ellipsis: true,
          align: "center",
          render: (h, params) => {
            return h(
              "div",
              {
                on: {
                  dblclick: () => {
                    this.$router.push({
                      path: "/Index/Problem/Detail",
                      query: { id: params.row.pid }
                    });
                  }
                }
              },
              [h("span", params.row.pid)]
            );
          }
        },
        {
          title: "问题",
          key: "pid",
          width: "120px",
          ellipsis: true,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                {
                  on: {
                    dblclick: () => {
                      this.$router.push({
                        path: "/Index/Problem/Detail",
                        query: { id: params.row.pid }
                      });
                    }
                  }
                },
                params.row.problem.title
              )
            ]);
          }
        },
        {
          title: "结果",
          key: "result",
          width: "160px",
          align: "center",
          render: (h, params) => {
            return this.renderTransResult(h, params);
          }
        },
        {
          title: "内存",
          key: "memory",
          align: "center",
          render: (h, params) => {
            return h("div", [h("span", `${params.row.memory} KB`)]);
          }
        },
        {
          title: "耗时",
          key: "time",
          align: "center",
          render: (h, params) => {
            return h("div", [h("span", `${params.row.time} MS`)]);
          }
        },
        {
          title: "语言",
          key: "language",
          align: "center"
        },
        {
          title: "代码长度",
          key: "code_length",
          width: "140px",
          align: "center"
        },
        {
          title: "提交时间",
          key: "createdAt",
          width: "190px",
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                `${new Date(params.row.createdAt).Format(
                  "yyyy-MM-dd hh:mm::ss"
                )}`
              )
            ]);
          }
        }
      ],
      tableLoading: true,
      page: {
        total: 0,
        limit: 10,
        page: 1,
        key: ''
      },
      resultList: [
        "等待",
        "等待重判",
        "编译中",
        "运行并评判",
        "正确",
        "格式错误",
        "答案错误",
        "时间超限",
        "内存超限",
        "输出超限",
        "运行错误",
        "编译错误",
        "编译成功",
        "运行完成"
      ]
    };
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
    handleSearchOrReloadClick(value) {
      if (value) {
        this.page.limit = 10;
        this.page.page = 1;
      }
      this.page.key = value
      this.fetchData()
    },
    renderTransResult(h, params) {
      let color = "#f90";
      if (params.row.result === 4) {
        color = "#0f0";
      }
      if (params.row.result > 4 && params.row.result <= 9) {
        color = "#f00";
      }
      if (params.row.result > 9) {
        color = "#0ff";
      }
      return h("div", { style: { color: color } }, [
        h("span", this.resultList[params.row.result])
      ]);
    },
    fetchData() {
      this.tableLoading = true;
      let params = this.page;
      if (this.$route.query.uid) {
        params.uid = this.$route.query.uid;
      }
      this.$axios
        .get("/api/solution/list", { params: this.page })
        .then(res => {
          if (res.data.code === 1) {
            this.tableData = res.data.data.data;
            this.page.total = res.data.data.count;
          }
          this.tableLoading = false;
        })
        .catch(() => {
          this.tableLoading = false;
        });
    }
  },
  created() {
    this.fetchData();
  }
};
</script>

<style scoped>
</style>