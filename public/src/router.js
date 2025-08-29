import Vue from "vue";
import Router from "vue-router";

//import AppHeader from "./layout/AppHeader";
//import AppFooter from "./layout/AppFooter";
import SausageList from "./views/SausageList.vue";

Vue.use(Router);

export default new Router({
  linkExactActiveClass: "active",
  routes: [
    {
      path: "/",
      name: "catalog",
      components: {
        //header: AppHeader,
        default: SausageList,
        //footer: AppFooter
      }
    },
  ],
  scrollBehavior: to => {
    if (to.hash) {
      return { selector: to.hash };
    } else {
      return { x: 0, y: 0 };
    }
  }
});
