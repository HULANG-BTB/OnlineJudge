<template>
  <div>
    <Row :gutter="16">
      <i-col>
        <h1 :style="{textAlign: 'center'}">数据列表</h1>
        <Table :loading="tableLoading" :columns="columns" :data="fileList" ref="table" max-height="350" border></Table>
      </i-col>
    </Row>
    <Row :gutter="16">
      <i-col>
        <h1 :style="{textAlign: 'center'}">上传文件</h1>
        <Card>
          <Upload multiple :before-upload="handleBeforUpload" action="#" style="text-align: center">
            <div style="padding: 20px 0;">
              <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
              <p>Click or drag files here to upload</p>
            </div>
          </Upload>
          <List header="上传文件列表" border size="small" v-if="fileUploadList.length">
            <ListItem v-for="(item, index) in fileUploadList" :key="index">{{item.name}}</ListItem>
            <div slot="footer">
              <Button type="primary" long @click.prevent="handleUploadClick">Upload</Button>
            </div>
          </List>
        </Card>
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
      </i-col>
    </Row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      fileList: [],
      columns: [
        {
          title: "文件名",
          key: "filename",
          sortable: true,
          align: "center",
          ellipsis: true
        },
        {
          title: "大小",
          key: "size",
          sortable: true,
          align: "center",
          ellipsis: true
        },
        {
          title: "操作",
          key: "id",
          width: "230px",
          align: "center",
          fixed: "right",
          render: (h, params) => {
            return h("div", [
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
                      this.handleDownloadClick(params);
                    }
                  }
                },
                "Download"
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
      fileUploadList: [],
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
    handleBeforUpload(file) {
      this.fileUploadList.push(file);
      return false;
    },
    handleUploadClick() {
      let formData = new FormData();
      formData.append("pid", this.info.id);
      for (let i in this.fileUploadList) {
        formData.append(this.fileUploadList[i].name, this.fileUploadList[i]);
      }
      this.$axios.post("/api/resources/uploadDataFile", formData).then(res => {
        this.fileUploadList = [];
        for (let i in res.data.data.success) {
          this.$Message.success({
            content: `文件${res.data.data.success[i]}上传成功！`,
            duration: 5
          });
        }
        for (let i in res.data.data.error) {
          this.$Message.error({
            content: `文件${res.data.data.success[i]}上传失败！`,
            duration: 5
          });
        }
        this.getDataFileList();
      });
    },
    handleDeleteClick(params) {
      this.deleteInfo = {
        pid: this.info.id,
        filename: params.row.filename
      };
      this.deleteModel = true;
    },
    handleDownloadClick(params) {
      window.open(
        `/api/resources/downloadDataFile?pid=${this.info.id}&filename=${params.row.filename}`
      );
    },
    getDataFileList() {
      this.tableLoading = true;
      this.$axios
        .get("/api/resources/getDataFileList", { params: { id: this.info.id } })
        .then(res => {
          if (res.data.code === 1) {
            this.fileList = res.data.data;
          }
          this.tableLoading = false;
        });
    },
    confirmDel() {
      this.deleteModelLoading = true;
      this.$axios
        .post("/api/resources/deleteDataFile", this.deleteInfo)
        .then(res => {
          if (res.data.code === 1) {
            this.$Message.success(res.data.msg);
          } else {
            this.$Message.error(res.data.msg);
          }
          this.deleteInfo = {};
          this.deleteModelLoading = false;
          this.deleteModel = false;
          this.getDataFileList();
        })
        .catch(() => {
          this.$Message.error("网络错误！");
          this.deleteModelLoading = false;
          this.deleteModel = false;
          this.deleteInfo = {};
        });
    }
  },
  mounted() {
    this.getDataFileList();
  }
};
</script>

<style scoped>
</style>