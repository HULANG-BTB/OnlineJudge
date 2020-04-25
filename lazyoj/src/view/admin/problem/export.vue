<template>
  <div>
    <Row :gutter="16">
      <i-col :span="24">
        <Card>
          <div slot="title">
            <h1 :style="{textAlign: 'center'}">导出问题</h1>
          </div>
          <Form ref="form" :model="formData" :rules="formVali" :label-width="80">
            <Row>
              <i-col :span="6">
                <FormItem prop="begin" label="开始">
                  <Input v-model="formData.begin" long placeholder="输入题目开始号" />
                </FormItem>
              </i-col>
              <i-col :span="6">
                <FormItem prop="end" label="结束">
                  <Input v-model="formData.end" long placeholder="输入结束题目号" />
                </FormItem>
              </i-col>
              <i-col :span="3">
                <FormItem label>
                  <Button
                    long
                    type="primary"
                    @click="handleSubmit('between')"
                    :loading="loading"
                  >区间导出</Button>
                </FormItem>
              </i-col>
            </Row>
            <Row>
              <i-col :span="6">
                <FormItem prop="begin" label="题目">
                  <Input v-model="formData.in" long placeholder="输入题目号" />
                </FormItem>
              </i-col>
              <i-col :span="3">
                <FormItem label>
                  <Button long type="primary" @click="handleSubmit('in')" :loading="loading">指定导出</Button>
                </FormItem>
              </i-col>
            </Row>
            <Row>
              <span>说明:</span>
              <p>1.区间为 开始 ≤ 题号 ≤ 结束</p>
              <p>2.题目可以多个，用英文空格分隔</p>
            </Row>
          </Form>
        </Card>
      </i-col>
    </Row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formData: {
        begin: "1000",
        end: "1000",
        in: "1000 1001"
      },
      formVali: {},
      loading: false
    };
  },
  methods: {
    handleSubmit(type) {
      let data = {
        type: type
      };
      if (type === "in") {
        if (!/^[0-9 ]+$/.test(this.formData.in)) {
          this.$Message.error({
            content: "题号错误！",
            duration: 3
          });
          return false;
        }
        data.data = this.formData.in.split(" ");
        data.filename = this.formData.in.replace(" ", "-");
      } else {
        data.data = {
          begin: this.formData.begin,
          end: this.formData.end,
        };
        data.filename = `${this.formData.begin}-${this.formData.end}`
        if (parseInt(data.data.begin) > parseInt(data.data.end)) {
          this.$Message.error({
            content: "区间错误！",
            duration: 3
          });
          return false;
        }
      }
      this.loading = true;
      this.$axios
        .post("/api/problem/export", data)
        .then(res => {
          this.downloadFile(`fps-${data.filename}-.xml`, res.data.data.content);
          this.loading = false;
        })
        .catch(() => {
          this.$Message.error("导出失败!");
          this.loading = false;
        });
    },
    downloadFile(fileName, content) {
      let aTag = document.createElement("a");
      let blob = new Blob([content]);
      aTag.download = fileName;
      aTag.href = URL.createObjectURL(blob);
      aTag.click();
      URL.revokeObjectURL(blob);
    }
  }
};
</script>

<style scoped>
</style>