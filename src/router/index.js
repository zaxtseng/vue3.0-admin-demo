import Vue from "vue";
import VueRouter from "vue-router";
// import Home from "../views/Home.vue";
// import Login from "../views/Login";
// import Register from "../views/Register";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/login",
    hidden: true,
    meta: {
      name: "主页"
    }
  },
  {
    path: "/login",
    name: "Login",
    hidden: true,
    meta: {
      name: "登录"
    },
    component: () => import("../views/Login")
  },
  // {
  //   path: "/register",
  //   name: "Register",
  //   meta: {
  //     name: "注册"  //   },
  //   component: () => import("../views/Register")
  // },
  {
    path: "/info",
    name: "Info",
    meta: {
      name: "信息列表"
    },
    component: () => import("../views/Layout"),
    children: [
      {
        path: "/infoCategory",
        name: "InfoCategory",
        meta: {
          name: "信息分类"
        },
        component: () => import("../views/Info/category.vue")
      }
    ]
  },
  /**
   * 用户管理
   */
  {
    path: "/user",
    name: "User",
    meta: {
      name: "用户管理"
    },
    component: () => import("../views/Layout"),
    children: [
      {
        path: "/userIndex",
        name: " USerIndex",
        meta: {
          name: "用户列表"
        },
        component: () => import("../views/User")
      }
    ]
  }
];

const router = new VueRouter({
  routes
});

export default router;
