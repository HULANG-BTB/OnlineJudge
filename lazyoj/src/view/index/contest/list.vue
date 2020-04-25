<template>
  <div>
    <Row :gutter="16" :style="{marginTop: '1.5rem'}">
      <Col :span="24">
        <Row :gutter="16">
          <Card>
            <div slot="title">
              <h1 :style="{textAlign: 'center'}">竞赛列表</h1>
            </div>
            <Row :style="{marginBottom: '1rem'}">
              <Input
                search
                enter-button="Search / Reload"
                @on-search="handleSearchOrReloadClick"
                placeholder="Enter something..."
              />
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
              @on-row-dblclick="handleTableDbClick"
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
        </Row>
      </Col>
    </Row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableLoading: false,
      tableData: [],
      tableColumns: [
        {
          title: "ID",
          key: "id",
          sortable: true,
          align: "center",
          width: 80,
          ellipsis: true
        },
        {
          title: "标题",
          key: "title",
          sortable: true,
          ellipsis: true,
          tooltip: true
        },
        {
          title: "状态",
          key: "accepted",
          sortable: true,
          width: "100px",
          align: "center",
          render: (h, params) => {
            return this.computeStatus(h, params);
          }
        },
        {
          title: "开始时间",
          key: "start_time",
          sortable: true,
          align: "center",
          width: "150",
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                `${new Date(params.row.start_time).Format(
                  "yyyy-MM-dd hh:mm:ss"
                )}`
              )
            ]);
          }
        },
        {
          title: "结束时间",
          key: "end_time",
          sortable: true,
          align: "center",
          width: "150",
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                `${new Date(params.row.end_time).Format("yyyy-MM-dd hh:mm:ss")}`
              )
            ]);
          }
        },
        {
          title: "比赛",
          key: "private",
          sortable: true,
          align: "center",
          width: "80",
          render: (h, params) => {
            return this.computePrivate(h, params);
          }
        },
        {
          title: "评测",
          key: "judgemode",
          sortable: true,
          align: "center",
          width: "80",
          render: (h, params) => {
            return h("div", [
              h("span", `${params.row.judgemode === 1 ? "OI" : "ACM"}`)
            ]);
          }
        },
        {
          title: "创建者",
          key: "submit",
          width: 100,
          align: "center",
          ellipsis: true,
          render: (h, params) => {
            return h("div", [h("span", `${params.row.user.nickname}`)]);
          }
        }
      ],
      page: {
        page: 1,
        limit: 10,
        total: 0,
        key: ''
      }
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
    handleTableDbClick(row) {
      if ((new Date()) < (new Date((row.start_time)))) {
        this.$Message.error('竞赛尚未开始！')
      } else {
        this.$router.push({
          path: `/Index/Contest/Detail`,
          query: { cid: row.id }
        });
      }
    },
    handleSearchOrReloadClick(value) {
      if (value) {
        this.page.limit = 10;
        this.page.page = 1;
      }
      this.page.key = value
      this.fetchData()
    },
    fetchData() {
      this.tableLoading = true;
      this.$axios.get("/api/contest/list", { params: this.page }).then(res => {
        this.tableData = res.data.data.data;
        this.page.total = res.data.data.count;
        this.tableLoading = false;
      });
    },
    computeStatus(h, params) {
      const now = new Date();
      const start = new Date(params.row.start_time);
      const end = new Date(params.row.end_time);
      let color = "";
      let text = "";
      if (now > end) {
        text = "已结束";
        color = "#f00";
      } else if (now >= start) {
        text = "运行中";
        color = "#0f0";
      } else {
        text = "未开始";
        color = "#0ff";
      }
      return h(
        "div",
        {
          style: {
            color: color
          }
        },
        [h("span", `${text}`)]
      );
    },
    computePrivate(h, params) {
      let color = "";
      let text = "";
      if (params.row.private == 1) {
        text = "私有";
        color = "#f00";
      } else {
        text = "公开";
        color = "#0f0";
      }
      return h(
        "div",
        {
          style: {
            color: color
          }
        },
        [h("span", `${text}`)]
      );
    }
  },
  created() {
    this.fetchData();
  },
  computed: {
    ContestInfo() {
      return this.$store.state.ContestInfo;
    }
  },
  mounted() {}
};
</script>

<style scoped>
</style>