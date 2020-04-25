<template>
  <div>
    <Row :gutter="16">
      <i-col :span="24">
        <Card>
          <h1 :style="{textAlign: 'center'}">权限列表</h1>
          <Row :style="{marginBottom: '1rem'}">
            <Button
              type="error"
              large
              @click="handleDeleteClick"
              :disabled="selection.length === 0"
            >删除选择</Button>
            <Button type="primary" :style="{marginLeft: '1rem'}" large @click="addModal = true">添加权限</Button>
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
    </Row>
    <Modal v-model="addModal">
      <div slot="header">
        <h3 :style="{textAlign: 'center'}">添加权限</h3>
      </div>
      <Form v-model="formData" :label-width="80">
        <FormItem label="用户ID">
          <Input long v-model="formData.uid" placeholder="请输入用户ID"></Input>
        </FormItem>
        <FormItem label="权限">
          <Select v-model="formData.right">
            <Option v-for="(item, index) in privilegeList" :key="index" :value="item">{{ item }}</Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer">
        <Row :gutter="16" :style="{color: '#000'}">
          <i-col :span="12">
            <Button long type="success" :loading="buttonLoading" @click="handleAddClick">确认</Button>
          </i-col>
          <i-col :span="12">
            <Button long type="error" @click="addModal = false">取消</Button>
          </i-col>
        </Row>
      </div>
    </Modal>
  </div>
</template>

<script>
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
          title: "用户",
          key: "uid",
          sortable: true,
          width: "160px",
          ellipsis: true
        },
        {
          title: "昵称",
          key: "nickname",
          sortable: true,
          width: "160px",
          ellipsis: true,
          render: (h, params) => {
            return h("div", [h("span", params.row.user.nickname)]);
          }
        },
        {
          title: "权限",
          key: "right",
          minWidth: 100,
          sortable: true,
          ellipsis: true
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
      buttonLoading: false,
      addModal: false,
      formData: {
        uid: "",
        right: ""
      },
      privilegeList: [
        "administrator",
        "problem_editor",
        "source_browser",
        "contest_creator",
        "http_judge",
        "password_setter",
        "printer",
        "balloon"
      ]
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
    handleReloadClick() {
      this.fetchData();
    },
    handleOnSelectionChange(selection) {
      this.selection = selection;
    },
    handleAddClick() {
      this.buttonLoading = true;
      this.$axios
        .post("/api/privilege/add", this.formData)
        .then(res => {
          if (res.data.code === 1) {
            this.$Message.success("添加成功！");
            this.addModal = false
          } else {
            this.$Message.error(res.data.msg);
          }
          this.fetchData();
          this.buttonLoading = false;
        })
        .catch(() => {
          this.$Message.error("网络错误！");
          this.buttonLoading = false;
        });
    },
    fetchData() {
      this.tableLoading = true;
      this.$axios
        .get("/api/privilege/list", { params: this.page })
        .then(res => {
          this.data = res.data.data.data;
          this.page.total = res.data.data.count;
          this.tableLoading = false;
        });
    },
    handleDeleteClick() {
      let deleteList = {
        pid: []
      };
      this.selection.forEach(e => {
        deleteList.pid.push(e.pid);
      });
      this.tableLoading = true;
      this.$axios
        .post("/api/privilege/delete", deleteList)
        .then(res => {
          if (res.data.code === 1) {
            this.$Message.success("删除成功！");
          } else {
            this.$Message.error("删除失败");
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
  }
};
</script>

<style scoped>
</style>