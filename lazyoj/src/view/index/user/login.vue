<template>
  <div v-show="value" @keyup.esc="handleCloseClick">
    <div class="model-mask"></div>
    <div class="loginForm">
      <div class="register">
        <div class="side">
          <h1>还没有账号？</h1>
          <p :style="{lineHeight: '1.4rem'}">注册一个 LazyOJ 通用账户，您就可以在我们提供的所有在线评测服务上提交代码、参与讨论。</p>
          <div class="button">
            <Button type="error" @click="handleRegisterClcik">立即注册</Button>
          </div>
        </div>
      </div>
      <div class="login">
        <div class="close" @click="handleCloseClick">关闭</div>
        <div class="form">
          <h1 :style="{textAlign: 'center', color: '#7fb2de'}">登录</h1>
          <p
            :style="{textAlign: 'center', marginTop: 0, lineHeight: '1.2rem', color: '#000'}"
          >使用您的 LazyOJ 账户登录</p>
          <Input v-model="formData.username" type="text" placeholder="Enter your username" required></Input>
          <Input
            v-model="formData.password"
            type="password"
            placeholder="Enter your password"
            required
          ></Input>
          <Button type="primary" long @click="handleSubmitClick" :loading="loading">登录</Button>
          <p :style="{textAlign: 'center', marginTop: 0, lineHeight: '1.2rem', color: '#999'}">
            <a>忘记用户名或密码？</a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formData: {
        username: "",
        password: ""
      },
      loading: false
    };
  },
  props: {
    value: {
      type: Boolean,
      default() {
        return false;
      }
    }
  },
  methods: {
    handleCloseClick() {
      this.$emit("input", false);
    },
    handleSubmitClick() {
      this.loading = true;
      this.$axios
        .post("/api/user/login", this.formData)
        .then(res => {
          if (res.data.code === 1) {
            this.$Message.success({
              content: "登录成功！",
              duration: 3
            });
            this.$store.commit("receive_user_info", {
              User: res.data.data
            });
            this.handleCloseClick();
            this.loading = false;
          } else {
            this.$Message.error({
              content: res.data.msg,
              duration: 3
            });
            this.loading = false;
          }
        })
        .catch(() => {
          this.$Message.error({
            content: "网络错误！",
            duration: 5
          });
          this.loading = false;
        });
    },
    handleRegisterClcik() {
      this.$router.push('/Index/User/Register')
      this.handleCloseClick();
    }
  },
  created() {
    this.$nextTick(() => {
      document.addEventListener("keyup", e => {
        if (e.keyCode == 27) {
          this.handleCloseClick();
        }
      });
    });
  }
};
</script>

<style scoped>
.model-mask {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 1001;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: hsla(0, 0%, 94%, 0.6);
  display: flex;
  opacity: 1;
}
.loginForm {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100vh;
  width: 100vw;
  z-index: 1001;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: scale(1, 1);
  transition: all 0.3s ease-in-out;
}
.register {
  /* position: absolute;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%); */
  position: absolute;
  background: rgba(0, 0, 0, 0.7);
  z-index: 1002;
}

.login {
  background: #fff;
  width: 20rem;
  padding: 3.125rem;
  margin-right: 18.125rem;
  position: relative;
  z-index: 1003;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.6);
}
.side {
  position: relative;
  right: 0;
  width: 20rem;
  padding: 0 3.125rem;
  color: #ddd;
  top: 50%;
  margin-left: 19rem;
  margin-top: 2rem;
  margin-bottom: 2rem;
}
.close {
  position: absolute;
  top: -0.7rem;
  right: 1rem;
}
</style>