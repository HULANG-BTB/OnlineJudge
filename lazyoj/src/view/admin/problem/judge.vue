<template>
  <div>
    <Row :gutter="16">
      <i-col :span="24">
        <Card>
          <div slot="title">
            <h1 :style="{textAlign: 'center'}">问题重判</h1>
          </div>
          <Form ref="form" :model="formData" :label-width="80">
            <Row>
              <i-col :span="6">
                <FormItem prop="begin" label="题目">
                  <Input v-model="formData.problem" long placeholder="输入题目ID" />
                </FormItem>
              </i-col>
              <i-col :span="3">
                <FormItem label>
                  <Button long type="primary" @click="handleSubmit('problem')" :loading="loading">提交重判</Button>
                </FormItem>
              </i-col>
            </Row>
            <Row>
              <i-col :span="6">
                <FormItem prop="begin" label="竞赛编号">
                  <Input v-model="formData.contest" long placeholder="输入竞赛编号" />
                </FormItem>
              </i-col>
              <i-col :span="3">
                <FormItem label>
                  <Button long type="primary" @click="handleSubmit('contest')" :loading="loading">竞赛重判</Button>
                </FormItem>
              </i-col>
            </Row>
            <Row>
              <i-col :span="6">
                <FormItem prop="begin" label="提交号">
                  <Input v-model="formData.solution" long placeholder="输入提交ID" />
                </FormItem>
              </i-col>
              <i-col :span="3">
                <FormItem label>
                  <Button long type="primary" @click="handleSubmit('solution')" :loading="loading">提交重判</Button>
                </FormItem>
              </i-col>
            </Row>
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
                  >区间重判</Button>
                </FormItem>
              </i-col>
            </Row>
            <Row>
              <span>说明:</span>
              <p>1.区间为 开始 ≤ 题号 ≤ 结束</p>
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
        contest: "1000",
        solution: "1000",
        problem: '1000'
      },
      loading: false
    };
  },
  methods: {
    handleSubmit(type) {
      let data = this.formData
      data.type = type
      if (type === "between") {
        data.data = {
          begin: this.formData.begin,
          end: this.formData.end,
        };
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
        .post("/api/problem/judge", data)
        .then(res => {
          if (res.data.code === 1) {
              this.$Message.success("提交成功!");
          } else {
              this.$Message.error({
                  content: res.data.msg,
                  duration: 3
              });
          }
          this.loading = false;
        })
        .catch(() => {
          this.$Message.error("网络错误!");
          this.loading = false;
        });
    }
  }
};
</script>

<style scoped>
</style>