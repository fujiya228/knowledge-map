const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const fireStore = admin.firestore()

exports.getData = functions.https.onCall(async (data, context) => {
  let usersRef = fireStore.collection('users')
  let uid = context.auth.uid
  let userData
  // usersコレクションからuidを元にユーザー検索
  await usersRef.doc(uid).get()
    .then((user) => {
      if (user.exists) {
        // 存在した場合、データを返却
        console.log('uid', uid);
        userData = user.data()
      } else {
        console.log("No user with such uid", uid);
        userData = false
      }
      return {}
    })
    .catch(error => {
      console.log("Error getting document:", error)
      return error
    })
  console.log('userData', userData)
  if (userData) {
    return userData
  } else {
    let date = Date(Date.now())
    userData = {
      uid: uid,
      nodeNum: 0,
      statusNum: 4,
      tagNum: 9,
      statuses: [
        {
          id: 0,
          title: "status_1",
          color: "#FFE082",
          listForm: {
            isOpen: false,
          },
        },
        {
          id: 1,
          title: "status_2",
          color: "#B0BEC5",
          listForm: {
            isOpen: false,
          },
        },
        {
          id: 2,
          title: "status_3",
          color: "#A5D6A7",
          listForm: {
            isOpen: false,
          },
        },
        {
          id: 3,
          title: "status_4",
          color: "#81D4FA",
          listForm: {
            isOpen: false,
          },
        },
      ],
      tags: [
        {
          id: 0,
          title: "",
          color: "#E91E63",
          description: "",
          isActive: false,
        },
        {
          id: 1,
          title: "",
          color: "#FF5722",
          description: "",
          isActive: false,
        },
        {
          id: 2,
          title: "",
          color: "#FFC107",
          description: "",
          isActive: false,
        },
        {
          id: 3,
          title: "",
          color: "#CDDC39",
          description: "",
          isActive: false,
        },
        {
          id: 4,
          title: "",
          color: "#4CAF50",
          description: "",
          isActive: false,
        },
        {
          id: 5,
          title: "",
          color: "#00BCD4",
          description: "",
          isActive: false,
        },
        {
          id: 6,
          title: "",
          color: "#2196F3",
          description: "",
          isActive: false,
        },
        {
          id: 7,
          title: "",
          color: "#673AB7",
          description: "",
          isActive: false,
        },
        {
          id: 8,
          title: "",
          color: "#607D8B",
          description: "",
          isActive: false,
        },
      ],
      nodes: [],
      relations: [],
      created_at: date,
      updated_at: date
    }
    usersRef.doc(uid).set(userData)
      .then(() => {
        console.log("Success add to users collection", uid)
        return {}
      })
      .catch((error) => {
        console.log("Error add to users collection:", error)
      })
    return userData
  }
})
