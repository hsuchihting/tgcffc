<template>
  <div class="bg-gray-100 h-screen relative">
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
          @change="selectNameHandler($event)"
        >
          <option
            class="overflow-hidden"
            :value="item.name"
            v-for="item in members"
            :key="item.name"
          >
            {{ item.name }}
          </option>
        </select>
      </form>
      <p class="text-center mt-4 text-xl">
        這是您第 {{ checkInTimes.length }} 次晨禱
      </p>
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
          @click="prayRecordList(memberName)"
        >
          晨禱記錄
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

    <!-- record modal -->

    <div
      v-if="showRecordModal"
      class="absolute top-0 left-0 right-0 bottom-0 bg-black"
    >
      <div
        class="w-full my-auto mx-auto rounded-lg bg-white shadow-md overflow-hidden"
      >
        <div class="pb-4">
          <h3
            class="bg-red-900 text-2xl text-yellow-300 p-4 text-center overflow-hidden"
          >
            烈火弟兄 {{ memberName }} 晨禱紀錄
          </h3>

          <div v-if="checkInTimes.length">
            <ol class="p-4 text-xl">
              <li
                class="py-4"
                v-for="(item, index) in checkInTimes"
                :key="index"
              >
                {{ index + 1 }} {{ item.name }} {{ item.date }}
              </li>
            </ol>
          </div>
          <div v-else>
            <p class="text-center text-2xl p-4">您尚未參加過晨禱喔！</p>
          </div>

          <button
            @click="showRecordModal = false"
            class="px-5 py-2 bg-red-900 text-yellow-300 text-2xl font-bold rounded-md block mx-auto"
          >
            確定
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// const randomApi = "https://randomuser.me/api/?results=6";
import Swal from "sweetalert2";
import Dayjs from "dayjs";
import database from "../database/firebase";

/**
 *
 */
export default {
  name: "App",
  data() {
    return {
      title: "台北榮耀堂烈火弟兄",
      subTitle: "禱告會簽到表",
      members: [
        { id: 1, name: "葉健群" },
        { id: 2, name: "許勇信" },
        { id: 3, name: "陳立羣" },
        { id: 4, name: "陳翔斌" },
        { id: 5, name: "吳承昌" },
        { id: 6, name: "劉大為" },
        { id: 7, name: "陳德" },
        { id: 8, name: "黃文欽" },
        { id: 9, name: "謝立群" },
        { id: 10, name: "林鼎鉦" },
        { id: 11, name: "許智庭" },
        { id: 12, name: "吳凱棻" },
        { id: 13, name: "吳宜學" },
        { id: 14, name: "黃鴻翔" },
        { id: 15, name: "黃泓源" },
        { id: 16, name: "宋自恒" },
        { id: 17, name: "葉義政" },
        { id: 18, name: "孫繼正" },
        { id: 19, name: "廖淳霖" },
        { id: 20, name: "楊世豪" },
        { id: 21, name: "董恆杰" },
        { id: 22, name: "張宜榕" },
      ],
      memberName: "",
      checkInTimes: [],
      showRecordModal: false,
    };
  },
  created() {},
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
    time() {
      return Dayjs().format("HH:mm:ss");
    },
    isHoliday() {
      // using Dayjs get day
      const day = Dayjs().day();
      switch (day) {
        case 0:
          return "星期日";
        case 6:
          return "星期六";
        default:
          return false;
      }
    },
    //打卡時間只能在早上七點到八點之間
    isCheckInTime() {
      const time = Dayjs().format("HH:mm:ss");
      if (time >= "07:00:00" && time <= "08:00:00") {
        return true;
      } else {
        return false;
      }
    },
  },
  mounted() {
    this.getMemberCheckInData();
  },
  methods: {
    getMemberCheckInData() {
      database.ref("checkIn").on("value", (snapshot) => {
        const data = Object.values(snapshot.val());
        console.log(data);
      });
    },
    selectNameHandler(e) {
      this.memberName = e.target.value;
      database.ref("checkIn").on("value", (snapshot) => {
        const data = Object.values(snapshot.val());
        this.checkInTimes = data.filter(
          (item) => item.name === this.memberName
        );
      });
    },
    submitHandler() {
      let options = {
        name: this.memberName,
        date: `${this.today}  ${this.time}`,
      };

      if (!this.memberName) {
        Swal.fire({
          title: "簽到失敗",
          text: "請選擇姓名",
          icon: "error",
          confirmButtonText: "確定",
        });
        return;
      }

      if (!this.isCheckInTime) {
        Swal.fire({
          title: "簽到失敗",
          text: "請在早上七點到八點之間簽到",
          icon: "error",
          confirmButtonText: "確定",
        });
        return;
      }
      // post to firebase
      database
        .ref("checkIn")
        .push(options)
        .then(() => {
          Swal.fire({
            title: "簽到成功",
            text: "歡迎參加晨禱",
            icon: "success",
            confirmButtonText: "確定",
          });
        })
        .catch((err) => {
          Swal.fire({
            title: "簽到失敗",
            text: "請重新簽到",
            icon: "error",
            confirmButtonText: "確定",
          });
        });
    },
    prayRecordList(memberName) {
      if (!this.memberName) {
        Swal.fire({
          title: "查詢失敗",
          text: "請選擇姓名",
          icon: "error",
          confirmButtonText: "確定",
        });
        return;
      }
      if (memberName === this.memberName) {
        this.showRecordModal = true;
      }
    },
  },
};
</script>
