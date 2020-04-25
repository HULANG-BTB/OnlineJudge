<template>
  <Row :gutter="16" :style="{marginTop: '1.5rem'}">
    <Col :span="18">
      <Card>
        <div slot="title">
          <h1 :style="{textAlign: 'center'}">评测队列</h1>
        </div>
        <Row :style="{marginBottom: '1rem'}">
          <Input search enter-button="Search / Reload" @on-search="handleSearchOrReloadClick" placeholder="Enter something..." />
        </Row>
        <h3 v-if="(new Date()) < (new Date(ContestInfo.start_time))">竞赛尚未开始！</h3>
        <Table
          v-else
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
    <Col :span="6">
      <Row>
        <Card>
          <Button small long type="default" @click="handleProbemListClick">问题列表</Button>
          <Button
            small
            long
            type="default"
            @click="handleSubmitListClick"
            :style="{marginTop: '0.5rem'}"
          >全部提交</Button>
          <Button
            small
            long
            type="default"
            @click="handleRankListClick"
            :style="{marginTop: '0.5rem'}"
          >当前排名</Button>
        </Card>
      </Row>
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
          title: "ID",
          key: "sid",
          sortable: true,
          align: "center",
          minWidth: 80,
          ellipsis: true
        },
        {
          title: "用户",
          key: "uid",
          minWidth: 80,
          align: "center",
          render: (h, params) => {
            return h("div", [h("span", params.row.user.nickname)]);
          }
        },
        {
          title: "题目",
          key: "pid",
          minWidth: 80,
          sortable: true,
          ellipsis: true,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h("span", `${String.fromCharCode(64 + params.row.num)}`)
            ]);
          }
        },
        {
          title: "问题",
          key: "pid",
          width: "120px",
          ellipsis: true,
          align: "center",
          render: (h, params) => {
            return h("div", [h("span", params.row.problem.title)]);
          }
        },
        {
          title: "结果",
          key: "result",
          minWidth: 100,
          align: "center",
          render: (h, params) => {
            return this.renderTransResult(h, params);
          }
        },
        {
          title: "内存",
          key: "memory",
          align: "center",
          minWidth: 80,
          render: (h, params) => {
            return h("div", [h("span", `${params.row.memory} MB`)]);
          }
        },
        {
          title: "耗时",
          key: "time",
          align: "center",
          minWidth: 80,
          render: (h, params) => {
            return h("div", [h("span", `${params.row.time} MS`)]);
          }
        },
        {
          title: "语言",
          key: "language",
          minWidth: 80,
          align: "center"
        },
        {
          title: "长度",
          key: "code_length",
          width: 80,
          align: "center"
        },
        {
          title: "提交时间",
          key: "createdAt",
          width: 155,
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
        page: 1
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
    handleProbemListClick() {
      this.$router.push({
        path: "/Index/contest/detail",
        query: { cid: this.$route.query.cid }
      });
    },
    handleSubmitListClick() {
      this.$router.push({
        path: "/Index/Contest/Status",
        query: { cid: this.$route.query.cid }
      });
    },
    handleRankListClick() {
      this.$router.push({
        path: "/Index/Contest/Rank",
        query: { cid: this.$route.query.cid }
      });
    },
    handleSearchOrReloadClick(value) {
      if (value !== this.page.key) {
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
      let query = this.page;
      query.cid = this.$route.query.cid;
      this.$axios
        .get("/api/contest/solution", { params: query })
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
  },
  computed: {
    ContestInfo() {
      return this.$store.state.ContestInfo
    }
  }
};
</script>

<style scoped>
</style>