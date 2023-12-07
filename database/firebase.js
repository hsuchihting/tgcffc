var firebaseConfig = {
  apiKey: "AIzaSyD9hWrO_iLxYbDyhzA8P_5XZYudot7FydA",
  authDomain: "tgcffc-80218.firebaseapp.com",
  projectId: "tgcffc-80218",
  storageBucket: "tgcffc-80218.appspot.com",
  messagingSenderId: "352465578406",
  appId: "1:352465578406:web:bf8bf25dd962d7bd064767",
  measurementId: "G-QXRJH2BB5M"
};

firebase.initializeApp(firebaseConfig);

app.post('/api/post', (req, res) => {
  const { name, time } = req.body;

  // 在這裡處理你的邏輯，例如將資料存入資料庫或進行其他操作

  res.status(200).json({ message: '成功傳送資料' });
});

export default firebase;