<template>
  <Row :gutter="16" :style="{marginTop: '1.5rem'}">
    <Col :span="24">
      <Card>
        <div slot="title">
          <h1 :style="{textAlign: 'center'}">排行</h1>
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
          title: "名次",
          key: "uid",
          sortable: true,
          align: "center",
          render: (h, params) => {
            return h(
              "div",
              {
                on: {
                  dblclick: () => {
                    console.log();
                  }
                }
              },
              [
                h(
                  "span",
                  params.index + 1 + (this.page.page - 1) * this.page.limit
                )
              ]
            );
          }
        },
        {
          title: "用户ID",
          key: "uid",
          align: "center",
          render: (h, params) => {
            return h(
              "div",
              {
                on: {
                  dblclick: () => {
                    this.$router.push({
                      path: "/Index/User/statics",
                      query: { uid: params.row.uid }
                    });
                  }
                }
              },
              [h("span", params.row.uid)]
            );
          }
        },
        {
          title: "昵称",
          key: "nickname",
          align: "center",
          render: (h, params) => {
            return h(
              "div",
              {
                on: {
                  dblclick: () => {
                    this.$router.push({
                      path: "/Index/User/statics",
                      query: { uid: params.row.uid }
                    });
                  }
                }
              },
              [h("span", params.row.nickname)]
            );
          }
        },
        {
          title: "通过",
          key: "accepted",
          align: "center",
          render: (h, params) => {
            return h("div", [h("span", `${params.row.accepted}`)]);
          }
        },
        {
          title: "提交",
          key: "submit",
          align: "center",
          render: (h, params) => {
            return h("div", [h("span", `${params.row.submit}`)]);
          }
        },
        {
          title: "比率",
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                `${
                  params.row.accepted == 0 || params.row.submit == 0
                    ? 0
                    : Math.floor(
                        (params.row.accepted / params.row.submit) * 10000
                      ) / 100
                } %`
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
        key: null
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
      this.$axios
        .get("/api/user/rank", { params: this.page })
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