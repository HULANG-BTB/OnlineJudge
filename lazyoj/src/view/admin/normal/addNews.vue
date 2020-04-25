<template>
  <Row :gutter="16">
    <i-col :span="24">
      <Card>
        <Row :gutter="16">
          <h1 :style="{textAlign: 'center', marginBottom: '1rem'}">添加新闻</h1>
        </Row>
        <Form ref="formData" :model="formData" :label-width="80" :rules="ruleValidate">
          <FormItem label="标题" prop="title">
            <Input v-model="formData.title" placeholder="请输入新闻标题"></Input>
          </FormItem>
          <FormItem label="内容" prop="content">
            <texteditor v-model="formData.content"></texteditor>
          </FormItem>
          <Row>
            <Col span="11">
              <FormItem prop="submit">
                <Button type="primary" long large @click="handleSubmit('formData')">提交</Button>
              </FormItem>
            </Col>
            <Col span="2" style="text-align: center"></Col>
            <Col span="11">
              <FormItem prop="reset">
                <Button type="error" long large @click="handleReset('formData')">重置</Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Card>
    </i-col>
  </Row>
</template>

<script>
import texteditor from "../../../components/editor/texteditor";
export default {
  data: () => {
    return {
      formData: {
        title: "",
        content: "",
      },
      ruleValidate: {
        title: [
          {
            required: true,
            message: "标题不能为空",
            trigger: "blur"
          }
        ],
        content: [
          {
            required: true,
            message: "内容不能为空",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    handleReset(name) {
      this.$refs[name].resetFields();
    },
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          let data = this.formData
          data.admin = true
          this.$axios
            .post("/api/news/add", data)
            .then(res => {
              if(res.data.code === 1) {
                  this.$Message.success("添加成功！");
                  this.handleReset(name)
              } else {
                  this.$Message.error(res.data.msg);
              }
            })
            .catch(() => {
              this.$Message.error("网络错误，添加失败!");
            });
        } else {
          this.$Message.error("信息未填写完整，添加失败!");
        }
      });
    }
  },
  components: {
    texteditor
  }
};
</script>

<style scoped>
</style>