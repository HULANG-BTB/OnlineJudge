<template>
  <div>
    <Row :gutter="16" :style="{marginTop: '1.5rem'}">
      <Col :span="18">
        <Row :gutter="16">
          <Card>
            <div slot="title">
              <h1 :style="{textAlign: 'center'}">问题列表</h1>
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
      <Col :span="6">
        <Card>分类标签</Card>
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
          ellipsis: true,
          tooltip: true
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
      this.$router.push({
        path: `/Index/Problem/Detail`,
        query: { id: row.id }
      });
    },
    handleRandClick() {
      if (!this.tableData.length) {
        return this.$Message.warnning("手气太差了，没有抽到哦~");
      }
      const rowIndex = Math.floor(Math.random() * this.tableData.length);
      const pid = this.tableData[rowIndex].id;
      this.$router.push({
        path: `/Index/Problem/Detail`,
        query: { id: pid }
      });
    },
    handleSearchOrReloadClick(value) {
      if (value) {
        this.page.limit = 10;
        this.page.page = 1;
      }
      this.page.key = value;
      this.fetchData();
    },
    fetchData() {
      this.tableLoading = true;
      this.$axios.get("/api/problem/list", { params: this.page }).then(res => {
        this.tableData = res.data.data.data;
        this.page.total = res.data.data.count;
        this.tableLoading = false;
      });
    }
  },
  created() {
    this.fetchData();
  },
  mounted() {}
};
</script>

<style scoped>
</style>