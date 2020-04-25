<template>
  <Row :gutter="16">
    <i-col :span="24">
      <Card>
        <Row :gutter="16">
          <h1 :style="{textAlign: 'center', marginBottom: '1rem'}">添加竞赛</h1>
        </Row>
        <Form ref="formData" :model="formData" :label-width="80" :rules="ruleValidate">
          <FormItem label="标题" prop="title">
            <Input v-model="formData.title" placeholder="请输入题目标题"></Input>
          </FormItem>
          <Row>
            <Col span="11">
              <FormItem label="开始时间" prop="start_time">
                <DatePicker
                  type="datetime"
                  ref="start_time"
                  @on-change="showTimePanel('start_time')"
                  v-model="formData.start_time"
                  placeholder="选择开始时间"
                ></DatePicker>
              </FormItem>
            </Col>
            <Col span="2" style="text-align: center">-</Col>
            <Col span="11">
              <FormItem label="结束时间" prop="end_time">
                <DatePicker
                  type="datetime"
                  ref="end_time"
                  @on-change="showTimePanel('end_time')"
                  v-model="formData.end_time"
                  placeholder="选择开始时间"
                ></DatePicker>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="11">
              <FormItem label="是否公开" prop="private">
                <Select v-model="formData.private" style="width:200px">
                  <Option :value="0">公开</Option>
                  <Option :value="1">私有</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="2" style="text-align: center">-</Col>
            <Col span="11">
              <FormItem label="是否启用" prop="defunct">
                <i-switch
                  size="large"
                  true-color="#13ce66"
                  false-color="#ff4949"
                  v-model="formData.defunct"
                  true-value="Y"
                  false-value="N"
                >
                  <span slot="open">开启</span>
                  <span slot="close">关闭</span>
                </i-switch>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="11">
              <FormItem label="评测模式" prop="judgemode">
                <Select v-model="formData.judgemode" style="width:200px">
                  <Option :value="0">ACM/ICPC</Option>
                  <Option :value="1">OI</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="2" style="text-align: center">-</Col>
            <Col span="11">
              <FormItem label="支持语言" prop="langmask">
                <Select multiple v-model="formData.langmask" style="width:200px" :max-tag-count="1">
                  <Option v-for="(item, index) in langmask" :key="index" :value="index">{{item}}</Option>
                </Select>
              </FormItem>
            </Col>
          </Row>
          <FormItem label="密码访问" prop="password">
            <Input v-model="formData.password" placeholder="需要请输入密码，无需密码请留空"></Input>
          </FormItem>
          <FormItem label="竞赛描述" prop="description">
            <texteditor v-model="formData.description"></texteditor>
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
        start_time: new Date(),
        end_time: new Date(),
        description: "",
        defunct: "Y",
        private: 0,
        langmask: [],
        judgemode: 1,
        password: ""
      },
      ruleValidate: {
        title: [
          {
            required: true,
            message: "标题不能为空",
            trigger: "blur"
          }
        ]
      },
      langmask: [
          'C',
          'C++',
          'Pascal',
          'Java',
          'Ruby',
          'Bash',
          'Python',
          'PHP',
          'Perl',
          'C#',
          'Object-C',
          'FreeBasic',
          'Scheme',
          'Clang',
          'Clang++',
          'Lua',
          'JavaScript',
          'Go',
          'Sql(sqlite3)',
          'Fortran'
      ]
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
            .post("/api/contest/add", this.formData)
            .then(res => {
              if (res.data.code === 1) {
                this.$Message.success("添加成功！ 请到竞赛列表添加题目");
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
      this.$Cookies.set('langmask', JSON.stringify(this.formData.langmask))
    },
    showTimePanel(name) {
      this.$refs[name].onSelectionModeChange("time");
    }
  },
  components: {
    texteditor
  },
  mounted() {
  },
  created() {
      const lastLang = this.$Cookies.get('langmask')
      if (lastLang) {
          this.formData.langmask = JSON.parse(lastLang)
      }
  }
};
</script>

<style scoped>
</style>