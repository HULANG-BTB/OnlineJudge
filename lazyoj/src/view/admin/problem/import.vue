<template>
  <div>
    <Row :gutter="16">
      <i-col :span="24">
        <Card>
          <div slot="title">
            <h1 :style="{textAlign: 'center'}">导入问题</h1>
          </div>
          <Upload
            type="drag"
            action
            accept=".xml"
            name="file"
            :on-format-error="handleFormatError"
            :before-upload="handleBeforeUpload"
            ref="upload"
          >
            <div style="padding: 20px 0">
              <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
              <p>点击或拖拽文件到此上传</p>
            </div>
          </Upload>
        </Card>
      </i-col>
    </Row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      format: ["xml"],
      file: null,
      process: 0
    };
  },
  methods: {
    handleFormatError() {
      this.$Message.error("文件类型错误！");
    },
    handleBeforeUpload(file) {
      if (this.format.length) {
        const _file_format = file.name
          .split(".")
          .pop()
          .toLocaleLowerCase();
        const checked = this.format.some(
          item => item.toLocaleLowerCase() === _file_format
        );
        if (!checked) {
          this.handleFormatError();
          return false;
        }
      }
      this.file = file;
      let formData = new FormData();
      formData.append('fps', file);
      this.handleStart();
      this.$axios
        .post("/api/problem/import", formData, {
          onUploadProgress: e => {
            this.handleOnProcess((e.loaded / e.total) * 100);
          }
        })
        .then(res => {
          if (res.data.code === 1) {
            this.handleSuccess(res);
            for(let i in res.data.data) {
                this.$Message.success({
                    content: `${res.data.data[i].title} --- 导入成功！`,
                    duration: 3
                })
            }
          } else {
            this.handleError(res.data.msg, res);
          }
        })
        .catch(err => {
          this.handleError(err, err);
        });
      return false;
    },
    handleStart() {
      this.$refs.upload.handleStart(this.file);
    },
    handleOnProcess(process) {
      this.$refs.upload.handleProgress({ percent: process }, this.file);
    },
    handleSuccess(res) {
      this.$refs.upload.handleSuccess(res, this.file);
    },
    handleError(err, response) {
      this.$refs.upload.handleError(err, response, this.file);
    }
  }
};
</script>

<style scoped>
</style>