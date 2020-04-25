<template>
  <div>
    <Row :gutter="16">
      <i-col>
        <Table
          :loading="tableLoading"
          :columns="columns"
          :data="logList"
          ref="table"
          max-height="350"
          border
          :style="{marginBottom: '1rem'}"
        ></Table>
      </i-col>
    </Row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableLoading: true,
      columns: [
        {
          title: "IP",
          key: "ip",
          sortable: true,
          ellipsis: true
        },
        {
          title: "密码",
          key: "password",
          sortable: true,
          ellipsis: true
        },
        {
          title: "时间",
          key: "createdAt",
          sortable: true,
          ellipsis: true
        }
      ],
      logList: [],
      page: {
        page: 1,
        limit: 30,
        total: 0
      }
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
    fetchData() {
      let data = this.page;
      data.uid = this.info.uid;
      this.$axios
        .get("/api/user/log", { params: data })
        .then(res => {
          if (res.data.code === 1) {
            this.logList = res.data.data.data;
            this.page.total = res.data.data.count
          } else {
            this.$Message.error("获取数据失败");
          }
          this.tableLoading = false;
        })
        .catch(() => {
          this.$Message.error("获取数据失败");
          this.tableLoading = false;
        });
    }
  },
  mounted() {
    this.fetchData();
  }
};
</script>

<style scoped>
</style>