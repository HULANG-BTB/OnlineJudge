<template>
  <Row :gutter="16" :style="{marginTop: '1.5rem'}">
    <Col :span="18">
      <Row :gutter="16">
        <Collapse v-model="openPanel">
          <Panel name="description">
            题目描述
            <div slot="content">
              <span v-html="problemDetail.description" v-if="problemDetail.description !== ''"></span>
              <span v-else>无</span>
            </div>
          </Panel>
          <Panel name="input">
            输入格式
            <div slot="content">
              <span v-html="problemDetail.input" v-if="problemDetail.input !== ''"></span>
              <span v-else>无</span>
            </div>
          </Panel>
          <Panel name="output">
            输出格式
            <div slot="content">
              <span v-html="problemDetail.output" v-if="problemDetail.output !== ''"></span>
              <span v-else>无</span>
            </div>
          </Panel>
          <Panel name="sample_input">
            输入样例
            <div slot="content">
              <Input
                v-model="problemDetail.sample_input"
                v-if="problemDetail.sample_input !== ''"
                type="textarea"
                :rows="8"
              />
              <span v-else>无</span>
            </div>
          </Panel>
          <Panel name="sample_output">
            输出样例
            <div slot="content">
              <Input
                v-model="problemDetail.sample_output"
                v-if="problemDetail.sample_output !== ''"
                type="textarea"
                :rows="8"
              />
              <span v-else>无</span>
            </div>
          </Panel>
          <Panel name="hint">
            提示信息
            <div slot="content">
              <span v-html="problemDetail.hint" v-if="problemDetail.hint !== ''"></span>
              <span v-else>无</span>
            </div>
          </Panel>
          <Panel name="source" v-if="problemDetail.source !== ''">
            来源
            <div slot="content">
              <span v-html="problemDetail.source"></span>
            </div>
          </Panel>
        </Collapse>
      </Row>
    </Col>
    <Col :span="6">
      <Row>
        <Card>
          <div slot="title">
            <h2>{{problemDetail.title}}</h2>
          </div>
          <div class="info">
            <span>时间限制:</span>
            {{ problemDetail.time_limit }} MS
          </div>
          <div class="info">
            <span>空间限制:</span>
            {{ problemDetail.memory_limit }} MB
          </div>
          <div class="info">
            <span>提交数量:</span>
            {{ problemDetail.submit }}
          </div>
          <div class="info">
            <span>通过数量:</span>
            {{ problemDetail.accepted }}
          </div>
          <div class="info">
            <span>通过率:</span>
            {{ Math.floor(problemDetail.accepted / problemDetail.submit * 10000) / 100 }} %
          </div>
        </Card>
      </Row>
      <Row :style="{marginTop: '1.5rem'}">
          <Card>
              <Button small long type="primary" v-if="User.nickname" @click="handleSubmitAnswerClick">提交答案</Button>
              <Button small long type="error" v-else>登陆后可提交</Button>
          </Card>
      </Row>
    </Col>
  </Row>
</template>

<script>
export default {
  data() {
    return {
      query: {},
      openPanel: [
        "description",
        "input",
        "output",
        "sample_input",
        "sample_output",
        "hint",
        "source"
      ]
    };
  },
  created() {
    this.query = this.$route.query;
    this.$store.dispatch('getProblemInfo', {id: this.$route.query.id})
  },
  methods: {
      handleSubmitAnswerClick() {
          this.$router.push({path: '/Index/Problem/Submit', query: {id: this.query.id}})
      }
  },
  computed: {
    User() {
      return this.$store.state.User
    },
    problemDetail() {
      return this.$store.state.ProblemInfo
    }
  }
};
</script>

<style scoped>
.info {
  font-size: 1rem;
  margin-top: 0.3rem;
}
</style>