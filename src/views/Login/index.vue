<template>
  <div id="login">
    <div class="login-wrap">
      <ul class="menu-tab">
        <li
          v-for="item in menuTab"
          :key="item.id"
          :class="{ current: item.current }"
          @click="toggleMenu(item)"
        >
          {{ item.text }}
        </li>
      </ul>
      <!-- 表单 -->
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="loginForm"
        class="login-form"
        size="medium"
      >
        <el-form-item prop="username" class="item-form">
          <label>邮箱</label>
          <el-input
            type="text"
            v-model="ruleForm.username"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          prop="password"
          class="item-form"
          minlength="6"
          maxlength="20"
        >
          <label>密码</label>
          <el-input
            type="password"
            v-model="ruleForm.password"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          prop="password2"
          class="item-form"
          minlength="6"
          maxlength="20"
          v-if="model === 'register'"
        >
          <label>重复一遍密码</label>
          <el-input
            type="password"
            v-model="ruleForm.password2"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item prop="code" class="item-form">
          <label>验证码</label>
          <el-row :gutter="10">
            <el-col :span="15"
              ><el-input v-model="ruleForm.code"></el-input
            ></el-col>
            <el-col :span="9"
              ><el-button
                class="buttonClass"
                type="success"
                @click="getSms()"
                :disabled="codeButtonStatus.status"
              >
                {{ codeButtonStatus.text }}
              </el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="submitForm('loginForm')"
            class="login-btn buttonClass"
            :disabled="loginButtonStatus"
            >{{ model === "login" ? "登录" : "注册" }}</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import {
  validateEmail,
  validatePassword,
  validatecode
} from "@/utils/validate.js";
import { reactive, ref, onMounted } from "@vue/composition-api";

import { GetSms, Register, Login } from "@/api/login.js";
import sha1 from "js-sha1";

export default {
  name: "login",
  setup(props, { refs, root }) {
    //验证用户名
    let validateUsername = (rule, value, callback) => {
      //定义邮箱正则

      if (value === "") {
        callback(new Error("请输入用户名"));
      } else if (validateEmail(value)) {
        callback(new Error("邮箱格式不正确"));
      } else {
        callback();
      }
    };
    //验证密码
    let validatePsd = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (validatePassword(value)) {
        callback(new Error("密码长度为6-20位!"));
      } else {
        callback();
      }
    };
    //验证密码重复
    let validatePsd2 = (rule, value, callback) => {
      if (model.value === "login") {
        callback();
      }
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (value != ruleForm.password) {
        callback(new Error("密码长度为6-20位!"));
      } else {
        callback();
      }
    };
    //验证验证码
    let validateCode = (rule, value, callback) => {
      if (value === "") {
        return callback(new Error("验证码不能为空"));
      } else if (validatecode(value)) {
        return callback(new Error("验证码格式有误"));
      } else {
        callback();
      }
    };
    /*
    声明数据
    */

    //这里放置data数据,生命周期,自定义函数
    const menuTab = reactive([
      { text: "登录", current: true, type: "login" },
      { text: "注册", current: false, type: "register" }
    ]);
    //模块值
    const model = ref("login");
    //登录按钮禁用状态
    const loginButtonStatus = ref(true);
    // //设置验证码按钮状态
    const codeButtonStatus = reactive({
      status: false,
      text: "获取验证码"
    });
    const ruleForm = reactive({
      username: "",
      password: "",
      password2: "",
      code: ""
    });
    //修改按钮文字
    const updateButtonStatus = params => {
      //修改获取验证按钮状态
      codeButtonStatus.status = params.status;
      codeButtonStatus.text = params.text;
    };
    /**
     * 获取验证码
     */
    const getSms = () => {
      if (ruleForm.username == "") {
        root.$message.error("邮箱不能空!");
        return false;
      }
      //添加邮箱格式验证
      if (validateEmail(ruleForm.username)) {
        root.$message.error("邮箱格式有误!请重新输入!");
        return false;
      }

      //请求数据
      let requestData = {
        username: ruleForm.username
        // module: model.value
      };

      //修改获取验证按钮状态
      updateButtonStatus({
        status: true,
        text: "发送中"
      });
      //请求接口
      GetSms(requestData)
        .then(response => {
          let data = response.data;
          console.log(data);
          //增加弹窗信息
          root.$message({
            message: "验证码已发送!",
            type: "success"
          });
          //启用登录或注册按钮
          loginButtonStatus.value = false;
          //启动倒计时
          countDown(60);
        })
        .catch(error => {
          console.log(error);
        });
    };

    /**提交表单
     */
    const submitForm = formName => {
      refs[formName].validate(valid => {
        if (valid) {
          //判断是登录还是注册
          model.value === "login" ? login() : register();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    };
    /**
     * 登录请求
     */
    const login = () => {
      let requestData = {
        username: ruleForm.username,
        password: sha1(ruleForm.password),
        code: ruleForm.code
      };
      Login(requestData)
        .then(response => {
          let data = response.data;
          root.$message({
            message: data.message,
            type: "success"
          });
          //登录成功跳转
          root.$router.push({
            name: "Console"
          });
          //清除验证码倒计时
          clearCountDown();
        })
        .catch(error => {
          console.log(error);
        });
    };
    /**
     * 注册请求
     */
    const register = () => {
      let requestData = {
        username: ruleForm.username,
        password: sha1(ruleForm.password),
        code: ruleForm.code
      };
      Register(requestData)
        .then(response => {
          let data = response.data;
          root.$message({
            message: data.message,
            type: "success"
          });
          //注册成功跳转到登录页
          toggleMenu(menuTab[0]);
          //清除验证码倒计时
          clearCountDown();
        })
        .catch(error => {
          console.log(error);
        });
    };

    //切换tab
    const toggleMenu = data => {
      //判断注册或登录的显隐
      model.value = data.type;
      //用遍历将所有选中状态清除
      menuTab.forEach(e => {
        e.current = false;
      });
      //修改点击的高光
      data.current = true;
      resetFormData();
      clearCountDown();
    };

    const resetFormData = () => {
      //重置表单
      refs.loginForm.resetFields();
    };

    //表单的验证
    const rules = reactive({
      username: [{ validator: validateUsername, trigger: "blur" }],
      password: [{ validator: validatePsd, trigger: "blur" }],
      password2: [{ validator: validatePsd2, trigger: "blur" }],
      code: [{ validator: validateCode, trigger: "blur" }]
    });
    /**
     *倒计时模块
     */
    //声明倒计时
    const timer = ref(null); //初始值为null
    //发送后倒计时读秒
    const countDown = time => {
      //判断定时器是否存在,存在即清除
      if (timer.value) {
        clearInterval(timer.value);
      }
      // let time = number
      //设定倒计时
      timer.value = setInterval(() => {
        //倒计时减秒
        time--;
        //判断时间为零
        if (time === 0) {
          //清除倒计时,并将按钮状态设为可用
          clearInterval(timer.value);
          updateButtonStatus({
            status: false,
            text: "再次获取"
          });
        } else {
          //设置倒计时读秒
          codeButtonStatus.text = `倒计时${time}秒`;
        }
      }, 1000);
    };

    /**
     * 清除倒计时
     */
    const clearCountDown = () => {
      //还原按钮状态
      codeButtonStatus.status = false;
      codeButtonStatus.text = "获取验证码";
      //清除验证码倒计时
      clearInterval(timer.value);
    };
    //加载后
    onMounted(() => {});
    return {
      menuTab,
      model,
      ruleForm,
      submitForm,
      toggleMenu,
      rules,
      getSms,
      loginButtonStatus,
      codeButtonStatus,
      countDown,
      timer,
      clearCountDown,
      updateButtonStatus
    };
  }
};
</script>

<style lang="scss">
#login {
  height: 100vh;
  background-color: #344a5f;
}
.login-wrap {
  width: 330px;
  margin: auto;
}
.menu-tab {
  text-align: center;
  li {
    width: 88px;
    display: inline-block;
    line-height: 36px;
    font-size: 14px;
    color: #fff;
    border-radius: 2px;
    cursor: pointer;
  }
  .current {
    background-color: rgba(0, 0, 0, 0.1);
  }
}
.login-form {
  margin-top: 29px;
  label {
    display: block;
    font-size: 14px;
    color: #fff;
  }
  .item-form {
    margin-bottom: 13px;
  }
  .buttonClass {
    display: block;
    width: 100%;
  }
  .login-btn {
    margin-top: 19px;
  }
}
</style>
