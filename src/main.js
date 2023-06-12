import { createApp } from "vue";
import App from "./App.vue";
import "./style/index.css";
import Dayjs from "dayjs";
import axios from "axios";
import VueAxios from "vue-axios";

createApp(App).use(Dayjs).use(VueAxios, axios).mount("#app");
