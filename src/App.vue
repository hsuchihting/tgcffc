<template>
  <div class="bg-gray-100 h-screen">
    <h1
      class="p-4 text-2xl text-yellow-200 bg-red-900 font-bold tracking-wider text-center"
    >
      {{ title }}
      <p>{{ subTitle }}</p>
    </h1>

    <div class="container mx-auto border-t-4 border-white">
      <div class="text-center mt-20 mb-40 space-y-3">
        <h2
          class="font-bold text-6xl text-gray-700"
          :class="{ 'text-red-600': isHoliday }"
        >
          {{ thisDay }}
        </h2>
        <h2 class="mt-4">{{ today }}</h2>
      </div>
    </div>

    <div class="mt-4 mx-4">
      <form>
        <select
          v-model="memberName"
          class="w-full rounded-md p-4 border border-gray-300 outline-none"
        >
          <option :value="item.name" v-for="item in members" :key="item.name">
            {{ item.name }}
          </option>
        </select>
      </form>
      <p class="text-center mt-4 text-xl">這是您第 0 次晨禱</p>
    </div>

    <!-- flex two buttons -->
    <div class="flex justify-center mt-36">
      <div class="w-1/2">
        <button
          class="w-full px-4 py-4 text-2xl text-yellow-300 ont-bold bg-red-900 f hover:bg-red-800"
          @click="submitHandler()"
        >
          晨禱簽到
        </button>
      </div>
      <div class="w-1/2">
        <button
          class="w-full px-4 py-4 text-2xl text-red-900 font-bold bg-yellow-300 hover:bg-yellow-500"
        >
          平安到家
        </button>
      </div>
    </div>
    <!-- copyright -->
    <div class="flex justify-around">
      <!-- create four buttons -->
      <div class="grid grid-cols-3 gap-4 mt-4">
        <div class="w-full">
          <button
            class="text-2xl text-gray-600 border border-gray-600 rounded-md p-4"
          >
            開發中
          </button>
        </div>

        <div class="w-full">
          <button
            class="text-2xl text-gray-600 border border-gray-600 rounded-md p-4"
          >
            開發中
          </button>
        </div>

        <div class="w-full">
          <button
            class="text-2xl text-gray-600 border border-gray-600 rounded-md p-4"
          >
            開發中
          </button>
        </div>
      </div>
    </div>
    <div class="text-center mt-10">
      <p class="my-4 text-red-900">
        Taipei Glory Church Fire Female Club &copy; 2023
      </p>
    </div>
  </div>
</template>

<script>
// const randomApi = "https://randomuser.me/api/?results=6";

import firebase from "firebase/app";
import "firebase/database";
import Swal from "sweetalert2";
import Dayjs from "dayjs";
export default {
  name: "App",
  data() {
    return {
      title: "台北榮耀堂烈火弟兄",
      subTitle: "禱告會簽到表",
      members: [],
      memberName: "",
    };
  },
  created() {
    // Initialize Firebase
    const firebaseConfig = {
      // Your Firebase configuration
    };
    firebase.initializeApp(firebaseConfig);

    // Get data from Firebase
    const database = firebase.database();
    const membersRef = database.ref("members");

    membersRef.on("value", (snapshot) => {
      const members = snapshot.val();
      this.members = Object.values(members);
    });
  },
  computed: {
    thisDay() {
      // using Dayjs get day
      const day = Dayjs().day();
      switch (day) {
        case 0:
          return "星期日";
        case 1:
          return "星期一";
        case 2:
          return "星期二";
        case 3:
          return "星期三";
        case 4:
          return "星期四";
        case 5:
          return "星期五";
        case 6:
          return "星期六";
      }
    },
    today() {
      // using Dayjs format today
      return Dayjs().format("YYYY/MM/DD");
    },
    isHoliday() {
      // using Dayjs get day
      const day = Dayjs().day();
      switch (day) {
        case 0:
          return "星期日";
        case 6:
          return "星期六";
      }
    },
  },
  mounted() {
    this.getApi();
  },
  methods: {
    getApi() {
      this.$http.get(apiUrl).then((res) => {
        const newData = res.data;
        console.log(newData);
        this.members = newData;
      });
    },
    submitHandler() {
      let options = {
        name: this.memberName,
        date: this.today,
      };
      console.log(options);
      this.$http.post(apiUrl, options).then((res) => {
        if (res.data.success) {
          Swal.fire({
            title: "簽到成功",
            icon: "success",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      });
    },
  },
};
</script>
