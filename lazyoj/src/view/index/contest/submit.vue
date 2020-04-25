<template>
  <Row :gutter="16" :style="{marginTop: '1.5rem'}">
    <Col :span="18">
      <Row :gutter="16">
        <Card>
          <div slot="title">
            <h1 style="text-align: center">提交代码</h1>
          </div>
          <editor v-model="formData" :language="langmask"></editor>
        </Card>
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
          <Button
            small
            long
            type="default"
            @click="handleProbemDetailClick"
            :style="{marginTop: '0.5rem'}"
          >问题描述</Button>
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
      <Row :style="{marginTop: '1.5rem'}" v-if="submited">
        <Card>
          <div slot="title">
            <h2>评测结果</h2>
          </div>
          <div class="content">
            <Spin fix v-if="loading" :style="{width: '100%', height: '200px'}">
              <div class="loader"></div>
            </Spin>
            <div :style="{textAlign: 'left'}" v-else>
              <div class="info">
                <span>消耗时间:</span>
                {{ answer.time }} MS
              </div>
              <div class="info">
                <span>消耗内存:</span>
                {{ answer.memory }} MB
              </div>
              <div class="info">
                <span>代码长度:</span>
                {{ answer.code_length }} bytes
              </div>
              <div class="info">
                <span>评测结果:</span>
                {{ answerList[answer.result] }}
              </div>
            </div>
          </div>
        </Card>
      </Row>
      <Row :style="{marginTop: '1.5rem'}">
        <Card>
          <Button type="primary" long @click="handleSubmitClick" :loading="loading">确认提交</Button>
        </Card>
      </Row>
    </Col>
  </Row>
</template>

<script>
import editor from "../../../components/editor/codeeditor";
export default {
  data() {
    return {
      formData: {
        code: "",
        language: 1
      },
      language: [
        "C",
        "C++",
        "Pascal",
        "Java",
        "Ruby",
        "Bash",
        "Python",
        "PHP",
        "Perl",
        "C#",
        "Object-C",
        "FreeBasic",
        "Scheme",
        "Clang",
        "Clang++",
        "Lua",
        "JavaScript",
        "Go",
        "Sql(sqlite3)",
        "Fortran"
      ],
      loading: false,
      submited: false,
      answer: {},
      timer: null,
      answerList: [
        "等待",
        "等待重判",
        "编译中",
        "运行并评判",
        "正确",
        "格式错误",
        "答案错误",
        "时间超限",
        "内存超限",
        "输出超限",
        "运行错误",
        "编译错误",
        "编译成功",
        "运行完成"
      ],
      sid: 0
    };
  },
  components: {
    editor
  },
  computed: {
    ProblemInfo() {
      return this.$store.state.ProblemInfo || {};
    },
    ContestInfo() {
      return this.$store.state.ContestInfo || {};
    },
    langSupport() {
      return this.$store.state.ContestInfo.langmask || [];
    },
    langmask() {
      let tmp = [];
      for (let i in this.langSupport) {
        tmp.push({
          id: this.langSupport[i],
          label: this.language[this.langSupport[i] - 1]
        });
      }
      return tmp;
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
  },
  created() {
    this.fetchData();
  },
  methods: {
    handleSubmitClick() {
      const data = {
        pid: this.ProblemInfo.pid,
        language: this.formData.language,
        source: this.formData.code,
        cid: this.ContestInfo.cid,
        num: this.$route.query.pid
      };
      this.loading = true;
      this.submited = true;
      this.$axios
        .post("/api/contest/submit", data)
        .then(res => {
          if (res.data.code === 1) {
            this.$Message.success("提交成功！");
            this.sid = res.data.data.data.sid;
            this.timer = setInterval(this.getSulutionStatus, 1000);
          } else {
            this.$Message.error(res.data.msg);
            this.loading = false;
          }
        })
        .catch(() => {
          this.$Message.error("网络错误！");
          this.loading = false;
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
    handleProbemDetailClick() {
      this.$router.push({
        path: "/Index/Contest/Problem",
        query: { cid: this.ContestInfo.cid, pid: this.$route.query.pid }
      });
    },
    getSulutionStatus() {
      this.$axios
        .get("/api/contest/status", { params: { sid: this.sid } })
        .then(res => {
          if (res.data.code === 1) {
            if (res.data.data.result >= 4) {
              clearInterval(this.timer);
              this.timer = null;
              this.loading = false;
              this.answer = res.data.data;
            }
          }
        })
        .catch(() => {
          clearInterval(this.timer);
          this.timer = null;
          this.loading = false;
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
  }
};
</script>

<style scoped>
</style>
