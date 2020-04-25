<template>
  <div>
    <Row :gutter="16">
      <i-col :span="24">
        <Card>
          <h1 :style="{textAlign: 'center'}">新闻列表</h1>
          <Table :columns="columns" :data="data" ref="table" :max-height="maxHeight" :loading="tableLoading" border></Table>
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
      <Modal footer-hide v-model="editModel" width="50vh" title="编辑新闻">
        <Edit v-if="editModel" :info="editInfo"></Edit>
      </Modal>
    </Row>
  </div>
</template>

// <script>
import Edit from './editNews'
export default {
  data() {
    return {
      columns: [
        {
          title: "id",
          key: "nid",
          sortable: true,
          align: "center",
          width: "80px",
          ellipsis: true
        },
        {
          title: "标题",
          key: "title",
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
      data: [
      ],
      page: {
        page: 1,
        limit: 30,
        total: 0
      },
      tableLoading: false,
      deleteModel: false,
      deleteModelLoading: false,
      deleteInfo: {},
      editModel: false,
      editModelLoading: false,
      editInfo: {},
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
        .post("/api/news/toggleNewsStatus", {
          nid: row.nid,
          val: value ? "N" : "Y",
          admin: true
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
    handleEditClick(params) {
      this.editInfo = params.row
      this.editModel = true
    },
    handleDeleteClick(params) {
      this.deleteInfo = params;
      this.deleteModel = true;
    },
    fetchData() {
      this.tableLoading = true
      let params = this.page
      params.admin = true
      this.$axios.get("/api/news/list", { params: params }).then(res => {
        this.data = res.data.data.data;
        this.page.total = res.data.data.count;
        this.tableLoading = false
      });
    },
    confirmDel() {
      this.deleteModelLoading = true;
      this.$axios
        .post("/api/news/delete", { nid: this.deleteInfo.row.nid, admin: true })
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
  }
};
</script>

<style scoped>
</style>