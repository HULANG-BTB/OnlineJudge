<template>
  <div :style="{marginTop: '3.5rem'}">
    <Row>
      <Col :offset="8" :span="8">
        <Card>
          <div slot="title">
            <h1 :style="{textAlign: 'center'}">用户注册</h1>
          </div>
          <Form
            ref="table"
            :model="formData"
            :rules="formRules"
            :label-width="80"
            :style="{marginTop: '1.5rem'}"
          >
            <FormItem label="用户名" prop="username">
              <Input v-model="formData.username" placeholder="请输入用户名"></Input>
            </FormItem>
            <FormItem label="手机号" prop="phone">
              <Input v-model="formData.phone" placeholder="请输入手机号码"></Input>
            </FormItem>
            <FormItem label="昵称" prop="nickname">
              <Input v-model="formData.nickname" placeholder="请输入昵称"></Input>
            </FormItem>
            <FormItem label="密码" prop="password">
              <Input v-model="formData.password" type="password" placeholder="请输入密码"></Input>
            </FormItem>
            <FormItem label="重复密码" prop="repassword">
              <Input v-model="formData.repassword" type="password" placeholder="请重复输入密码"></Input>
            </FormItem>
            <FormItem label="学校" prop="school">
              <Input v-model="formData.school" placeholder="请输入学校名称"></Input>
            </FormItem>
            <FormItem label="邮箱" prop="email">
              <Input v-model="formData.email" placeholder="请输入电子邮箱地址"></Input>
            </FormItem>
            <Row :style="{MarginBottom: '2rem'}">
              <Col :span="12">
                <Button type="primary" long @click="handleSubmitClick" :loading="loading">Submit</Button>
              </Col>
              <Col :span="12">
                <Button style="margin-left: 8px" long @click="handleResetClick">Reset</Button>
              </Col>
            </Row>
          </Form>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formData: {
        username: "",
        password: "",
        repassword: "",
        school: "",
        email: ""
      },
      formRules: {
        username: [
          {
            required: true,
            message: "用户名不能为空！",
            trigger: "blur"
          },
          {
            validator: (rule, value, callback) => {
              if (!/^[A-Za-z0-9_]+$/.test(value)) {
                return callback(
                  new Error("用户名仅支持英文字母大小写、数字及下划线！")
                );
              }
              return callback();
            },
            trigger: "change"
          }
        ],
        phone: [
          {
            required: true,
            message: '手机号码不能为空！',
            trigger: 'blur'
          },
          {
            validator: (rule, value, callback) => {
              if (!/0?(13|14|15|18)[0-9]{9}/.test(value)) {
                return callback(new Error('手机号码格式不正确！'))
              }
              return callback()
            },
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: "密码不能为空！",
            trigger: "blur"
          }
        ],
        repassword: [
          {
            required: true,
            message: "密码不能为空！",
            trigger: "blur"
          },
          {
            validator: (rule, value, callback) => {
              if (value != this.formData.password) {
                return callback(new Error("两次输入密码不一致！"));
              }
              return callback();
            },
            trigger: "change"
          }
        ],
        nickname: [
          {
            required: true,
            message: "昵称不可为空！",
            trigger: "blur"
          },
          {
            validator: (rule, value, callback) => {
              if (!/^[A-Za-z0-9_\-\u4e00-\u9fa5]+$/.test(value)) {
                return callback(new Error("昵称不支持特殊字符！"));
              }
              return callback();
            },
            trigger: "blur"
          }
        ],
        email: [
          {
            required: true,
            message: "邮箱不可为空！",
            trigger: "blur"
          },
          {
            validator: (rule, value, callback) => {
              if ( !/\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/.test( value )) {
                return callback(new Error("邮箱格式不正确！"));
              }
              return callback();
            },
            trigger: "blur"
          }
        ]
      },
      loading: false
    };
  },
  methods: {
    handleSubmitClick() {
      this.loading = true;
      this.$axios
        .post("/api/user/register", this.formData)
        .then(res => {
          if (res.data.code === 1) {
            this.$Message.success({
              content: "注册成功！",
              duration: 3
            });
            this.$store.commit("receive_user_info", {
              User: res.data.data
            });
            this.loading = false;
            this.$router.push('/Index/Index/Index')
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
    handleResetClick() {
      this.$refs.table.resetFields();
    }
  }
};
</script>

<style scoped>
</style>
