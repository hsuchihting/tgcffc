<template>
  <div class="bg-gray-100 h-screen relative">
    <h1
      class="p-4 text-2xl text-yellow-200 bg-red-900 font-bold tracking-wider text-center"
    >
      {{ title }}
      <p>{{ subTitle }}</p>
    </h1>

    <div class="container mx-auto border-t-4 border-white">
      <div class="text-center mt-40 mb-20 space-y-3">
        <h2
          class="font-bold text-6xl text-gray-700"
          :class="{ 'text-red-600': isHoliday }"
        >
          {{ thisDay }}
        </h2>
        <h2 class="mt-4 text-2xl">－{{ today }}－</h2>
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
      <p
        class="text-center mt-4 text-xl"
        :class="{ 'text-red-900': checkInTimesOverSeven }"
      >
        <span v-if="checkInTimesOverSeven"
          ><i class="fa-solid fa-award"></i
        ></span>
        <span :class="{ ['text-red-900, mx-2']: checkInTimesOverSeven }">
          這是您第 {{ checkInTimes.length }} 次晨禱
        </span>
        <span v-if="checkInTimesOverSeven"
          ><i class="fa-solid fa-award"></i
        ></span>
      </p>
    </div>

    <!-- flex two buttons -->
    <div class="flex justify-center mt-20">
      <div class="w-1/2">
        <button
          :disabled="isCheckInToday"
          :class="{ 'bg-gray-900': isCheckInToday }"
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
    <div class="flex justify-around px-2 mt-4">
      <!-- create four buttons -->

      <div>
        <button
          @click="toLivePrayWebsite()"
          class="text-2xl text-gray-600 border border-gray-600 rounded-md p-4"
        >
          今日經文
        </button>
      </div>

      <div class="px-4">
        <button @click="clearFireBaseData()"
          class="text-2xl text-gray-600 border border-gray-600 rounded-md p-4"
        >
          clear
        </button>
      </div>

      <div>
        <button
          class="text-2xl text-gray-600 border border-gray-600 rounded-md p-4"
        >
          開發中
        </button>
      </div>
    </div>
    <div class="text-center mt-10 mb-4">
      <p class="my-4 text-red-900 font-medium">
        Taipei Glory Church Fire Female Club &copy; {{ year }}
      </p>
    </div>

    <!-- record modal -->

    <div
      v-if="showRecordModal"
      class="absolute top-0 left-0 right-0 bottom-0 bg-gray-900 bg-opacity-90 h-screen"
    >
      <div
        class="w-11/12 mt-20 mx-auto bg-white rounded-lg shadow-md overflow-hidden"
      >
        <h3
          class="bg-red-900 text-2xl text-yellow-300 p-4 text-center overflow-hidden"
        >
          烈火弟兄 {{ memberName }} 晨禱紀錄
        </h3>
        <div class="p-4">
          <div v-if="checkInTimes.length && checkInTimes.length < 12">
            <table class="w-full">
              <thead class="bg-gray-100">
                <tr>
                  <th class="border border-gray-300 p-2">次數</th>
                  <th class="border border-gray-300 p-2">姓名</th>
                  <th class="border border-gray-300 p-2">簽到日期</th>
                  <th class="border border-gray-300 p-2">簽到時間</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in checkInTimes" :key="index">
                  <td class="border border-gray-300 p-2">{{ index + 1 }}</td>
                  <td class="border border-gray-300 p-2">{{ item.name }}</td>
                  <td class="border border-gray-300 p-2">
                    {{ item.date.split(" ")[0] }}
                  </td>
                  <td class="border border-gray-300 p-2">
                    {{ item.date.split(" ")[2] }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else>
            <div class="py-10 flex justify-center items-center">
              <i
                class="fa-solid fa-triangle-exclamation fa-5x text-red-900"
              ></i>
            </div>
            <p class="text-center text-2xl p-4">您尚未參加過晨禱喔！</p>
          </div>

          <button
            @click="showRecordModal = false"
            class="mt-5 w-full px-4 py-4 bg-red-900 text-yellow-300 text-2xl font-bold rounded-md block mx-auto"
          >
            關閉
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Swal from "sweetalert2";
import Dayjs from "dayjs";
import database from "../database/firebase";

/**
 * @page App
 * @description 榮耀堂烈火弟兄禱告會簽到表
 * @data title: 標題
 * @data subTitle: 副標題
 * @data members: 烈火弟兄名單
 * @data memberName: 選擇的烈火弟兄名字
 * @data checkInTimes: 烈火弟兄簽到紀錄
 * @data showRecordModal: 是否顯示簽到紀錄
 * @computed thisDay: 今天是星期幾
 * @computed today: 今天日期
 * @computed time: 今天時間
 * @computed isHoliday: 今天是否為假日
 * @computed year: 今年
 * @computed isCheckInTimeOnSaturdayAtSevenToEight: 是否在簽到時間內
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
      isCheckInToday: false,
    };
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
    time() {
      return Dayjs().format("HH:mm:ss");
    },
    isHoliday() {
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
    year() {
      return Dayjs().format("YYYY");
    },
    //打卡時間只能在早上七點到八點之間
    isCheckInTimeOnSaturdayAtSevenToEight() {
      const day = Dayjs().day();
      const hour = Dayjs().hour();
      return day === 6 && hour >= 7 && hour <= 8;
    },
    checkInTimesOverSeven() {
      return this.checkInTimes.length >= 7;
    },
  },
  mounted() {
    // this.getMemberCheckInData();
  },
  methods: {
    // getMemberCheckInData() {
    //   database.ref("checkIn").on("value", (snapshot) => {
    //     const data = Object.values(snapshot.val());      
    //   });
    // },
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
        this.sweetAlert("簽到失敗", "請選擇姓名", "warning");
        return;
      }

      /**
       * @description 簽到時間只能在早上七點到八點之間
       * *todo: 暫時註解
       */
      // if (!this.isCheckInTimeOnSaturdayAtSevenToEight) {
      //   this.sweetAlert("簽到失敗", "請在週六早上七點到八點之間簽到", "error");
      //   return;
      // }

      /**
       * @description 一天只能簽到一次
       * * todo: 暫時註解
       */

      // const isCheckInName = this.checkInTimes.some(
      //   (item) => item.name === this.memberName
      // );
      // const isCheckInToday = this.checkInTimes.some(
      //   (item) => item.date.split(" ")[0] === this.today
      // );

      // if (isCheckInName && isCheckInToday && this.checkInTimes.length) {
      //   this.sweetAlert("簽到失敗", "您今天已經簽到過了", "warning");
      //   return;
      // }

      /**
       * @description 簽到次數不能超過12次
       */
      const isCheckInNameHasCheckInOverTwelve = this.checkInTimes.some(
        (item) =>
          item.name === this.memberName && this.checkInTimes.length >= 12
      );

      // 從陣列中找出每一位成員，並且日期不能重複，且簽到次數不能超過12次
      if (isCheckInNameHasCheckInOverTwelve) {
        this.sweetAlert("你是大能的勇士", "恭喜已經完成 12 次晨禱", "success");
        return;
      }
      this.postOptionToFireBase(options);
    },
    prayRecordList(memberName) {
      if (!this.memberName) {
        this.sweetAlert("查詢失敗", "請選擇姓名", "warning");
        return;
      }
      if (memberName === this.memberName) {
        this.showRecordModal = true;
      }
    },
    toLivePrayWebsite() {
      window.location.href = "http://www.duranno.tw/livinglife/index.php/daily";
    },
    sweetAlert(title, text, icon) {
      Swal.fire({
        title: title,
        text: text,
        icon: icon,
        confirmButtonText: "確定",
      });
    },
    postOptionToFireBase(options) {
      database
        .ref("checkIn")
        .push(options)
        .then(() => {
          this.sweetAlert("簽到成功", "歡迎參加晨禱", "success");
        })
        .catch((err) => {
          this.sweetAlert("簽到失敗", "請重新簽到", "error");
        });
    },
    // clearFireBaseDataAtLastDayOnDecember() {     
    //   const month = Dayjs().month();
    //   const date = Dayjs().date();
    //   if ( month === 12 && date === 31) {
    //     database.ref("checkIn").remove();
    //   }     
    // },
  },
};
</script>
