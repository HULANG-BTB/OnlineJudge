<template>
  <Row :gutter="16">
    <i-col :span="24">
      <Card>
        <Form ref="formData" :model="formData" :label-width="80" :rules="ruleValidate">
          <FormItem label="标题" prop="title">
            <Input v-model="formData.title" placeholder="请输入题目标题"></Input>
          </FormItem>
          <Row>
            <Col span="11">
              <FormItem label="时间限制" prop="time_limit">
                <Input type="number" placeholder="时间限制MS" v-model="formData.time_limit"></Input>
              </FormItem>
            </Col>
            <Col span="2" style="text-align: center">-</Col>
            <Col span="11">
              <FormItem label="内存限制" prop="memory_limit">
                <Input type="number" placeholder="内存限制MB" v-model="formData.memory_limit"></Input>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="11">
              <FormItem label="来源" prop="source">
                <Input v-model="formData.source" placeholder="请输入题目来源"></Input>
              </FormItem>
            </Col>
            <Col span="2" style="text-align: center">-</Col>
            <Col span="11">
              <FormItem label="特殊评判" prop="spj">
                <i-switch
                  size="large"
                  true-color="#13ce66"
                  false-color="#ff4949"
                  v-model="formData.spj"
                  :true-value="1"
                  :false-value="0"
                >
                  <span slot="open">开启</span>
                  <span slot="close">关闭</span>
                </i-switch>
              </FormItem>
            </Col>
          </Row>
          <FormItem label="题目描述" prop="description">
            <texteditor v-model="formData.description"></texteditor>
          </FormItem>
          <FormItem label="输入格式" prop="input">
            <texteditor v-model="formData.input"></texteditor>
          </FormItem>
          <FormItem label="输出格式" prop="output">
            <texteditor v-model="formData.output"></texteditor>
          </FormItem>
          <FormItem label="输入样例" prop="output">
            <Input
              v-model="formData.sampleInput"
              type="textarea"
              :autosize="{minRows: 5,maxRows: 15}"
              placeholder="Enter something..."
            ></Input>
          </FormItem>
          <FormItem label="输出样例" prop="output">
            <Input
              v-model="formData.sampleOutput"
              type="textarea"
              :autosize="{minRows: 5,maxRows: 15}"
              placeholder="Enter something..."
            ></Input>
          </FormItem>
          <FormItem label="提示信息" prop="hint">
            <texteditor v-model="formData.hint"></texteditor>
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
  data() {
    return {
      formData: {
        title: "",
        time_limit: "",
        memory_limit: "",
        description: "",
        input: "",
        output: "",
        sampleInput: "",
        sampleOutput: "",
        hint: "",
        spj: 0,
        source: ""
      },
      ruleValidate: {
        title: [
          {
            required: true,
            message: "标题不能为空",
            trigger: "blur"
          }
        ],
        time_limit: [
          {
            required: true,
            message: "时间限制不能为空",
            trigger: "change"
          },
          {
            message: "时间必须是输入正整数（单位：ms）",
            trigger: "change",
            pattern: /^[1-9]\d*$/,
            transform: value => {
              return Number(value);
            }
          }
        ],
        memory_limit: [
          {
            required: true,
            message: "内存限制不能为空",
            trigger: "change"
          },
          {
            message: "内存限制必须是正整数（单位：MB）",
            trigger: "change",
            pattern: /^[1-9]\d*$/,
            transform: value => {
              return Number(value);
            }
          }
        ],
        description: [
          {
            required: true,
            message: "题目描述不可为空",
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
          this.$axios
            .post("/api/problem/update", this.formData)
            .then(res => {
              if (res.data.code === 1) {
                this.$Message.success("修改成功！");
              } else {
                this.$Message.error(res.data.msg);
              }
            })
            .catch(() => {
              this.$Message.error("网络错误，修改失败!");
            });
        } else {
          this.$Message.error("信息未填写完整，修改失败!");
        }
      });
    }
  },
  components: {
    texteditor
  },
  props: {
    info: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  mounted() {
    this.$axios
      .get("/api/problem/detail", { params: { id: this.info.id } })
      .then(res => {
        if (res.data.code === 1) {
          res.data.data.spj = res.data.data.spj === "0" ? 0 : 1;
          res.data.data.memory_limit = `${res.data.data.memory_limit}`;
          this.formData = res.data.data;
        }
      });
  },
  created() {}
};
</script>

<style scoped>
</style>