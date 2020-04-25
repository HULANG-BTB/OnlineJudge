<template>
  <Row :gutter="16" :style="{marginTop: '1.5rem'}">
    <Col :span="18">
      <Row :gutter="16">
        <h3 v-if="(new Date()) < (new Date(ContestInfo.start_time))">竞赛尚未开始！</h3>
        <Collapse v-else v-model="openPanel">
          <Panel name="description">
            题目描述
            <div slot="content">
              <span v-html="ProblemInfo.description" v-if="ProblemInfo.description !== ''"></span>
              <span v-else>无</span>
            </div>
          </Panel>
          <Panel name="input">
            输入格式
            <div slot="content">
              <span v-html="ProblemInfo.input" v-if="ProblemInfo.input !== ''"></span>
              <span v-else>无</span>
            </div>
          </Panel>
          <Panel name="output">
            输出格式
            <div slot="content">
              <span v-html="ProblemInfo.output" v-if="ProblemInfo.output !== ''"></span>
              <span v-else>无</span>
            </div>
          </Panel>
          <Panel name="sample_input">
            输入样例
            <div slot="content">
              <Input
                :value="ProblemInfo.sample_input"
                v-if="ProblemInfo.sample_input !== ''"
                type="textarea"
                :rows="8"
                readonly
              />
              <span v-else>无</span>
            </div>
          </Panel>
          <Panel name="sample_output">
            输出样例
            <div slot="content">
              <Input
                :value="ProblemInfo.sample_output"
                v-if="ProblemInfo.sample_output !== ''"
                type="textarea"
                :rows="8"
                readonly
              />
              <span v-else>无</span>
            </div>
          </Panel>
          <Panel name="hint">
            提示信息
            <div slot="content">
              <span v-html="ProblemInfo.hint" v-if="ProblemInfo.hint !== ''"></span>
              <span v-else>无</span>
            </div>
          </Panel>
          <Panel name="source" v-if="ProblemInfo.source !== ''">
            来源
            <div slot="content">
              <span v-html="ProblemInfo.source"></span>
            </div>
          </Panel>
        </Collapse>
      </Row>
    </Col>
    <Col :span="6">
      <Row>
        <Card>
          <Button small long type="default" @click="handleProbemListClick">问题列表</Button>
          <Button
            small
            long
            type="default"
            @click="handleSubmitListClick"
            :style="{marginTop: '0.5rem'}"
          >全部提交</Button>
          <Button
            small
            long
            type="default"
            @click="handleRankListClick"
            :style="{marginTop: '0.5rem'}"
          >当前排名</Button>
        </Card>
      </Row>
      <Row :style="{marginTop: '1.5rem'}">
        <Card>
          <div slot="title">
            <h2>{{ProblemInfo.title}}</h2>
          </div>
          <div class="info">
            <span>时间限制:</span>
            {{ ProblemInfo.time_limit }} MS
          </div>
          <div class="info">
            <span>空间限制:</span>
            {{ ProblemInfo.memory_limit }} MB
          </div>
          <div class="info">
            <span>提交数量:</span>
            {{ ProblemInfo.submit }}
          </div>
          <div class="info">
            <span>通过数量:</span>
            {{ ProblemInfo.accepted }}
          </div>
          <div class="info">
            <span>通过率:</span>
            {{ percentage }} %
          </div>
        </Card>
      </Row>
      <Row :style="{marginTop: '1.5rem'}">
        <Card>
          <Button
            small
            long
            type="primary"
            v-if="User.nickname"
            @click="handleSubmitAnswerClick"
          >提交答案</Button>
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
    this.fetchData();
  },
  methods: {
    handleSubmitAnswerClick() {
      this.$router.push({
        path: "/Index/contest/Submit",
        query: {
          cid: this.ContestInfo.cid,
          pid: this.$route.query.pid
        }
      });
    },
    handleProbemListClick() {
      this.$router.push({
        path: "/Index/contest/detail",
        query: { cid: this.ContestInfo.cid }
      });
    },
    handleSubmitListClick() {
      this.$router.push({
        path: "/Index/Contest/Status",
        query: { cid: this.ContestInfo.cid }
      });
    },
    handleRankListClick() {
      this.$router.push({
        path: "/Index/Contest/Rank",
        query: { cid: this.ContestInfo.cid }
      });
    },
    fetchData() {
      if (!this.ProblemInfo.pid || this.ContestInfo.cid) {
        this.$axios
          .get("/api/contest/problemInfo", {
            params: { cid: this.$route.query.cid, pid: this.$route.query.pid }
          })
          .then(res => {
            res.data.data.problem.submit = res.data.data.c_submit;
            res.data.data.problem.accepted = res.data.data.c_accepted;
            this.$store.commit("receive_problem_info", {
              ProblemInfo: res.data.data.problem
            });
            this.$store.commit("receive_contest_info", {
              ContestInfo: res.data.data.contest
            });
          });
      }
    }
  },
  computed: {
    User() {
      return this.$store.state.User;
    },
    ProblemInfo() {
      return this.$store.state.ProblemInfo;
    },
    ContestInfo() {
      return this.$store.state.ContestInfo;
    },
    ContestProblemList() {
      return this.$store.state.ContestProblemList;
    },
    percentage() {
      if (!this.ProblemInfo.accepted || !this.ProblemInfo.submit) {
        return 0;
      }
      return (
        Math.floor(
          (this.ProblemInfo.accepted / this.ProblemInfo.submit) * 10000
        ) / 100
      );
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