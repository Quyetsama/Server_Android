const admin = require("firebase-admin");
const serviceAccount = require("../../android-push-notificatio-37fc5-firebase-adminsdk-wda2w-fca197ecd8.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const index = async (req, res, next) => {
    const tokenDevice = 'ec2Wl6GeTLWgQU3GbuCXfr:APA91bGPH9Yxwu2ALamUoKMyD1fPxD9EZ5bGB1iURCXn2iGaaBXYNPOHW0BVYfBDR5Xk-gxKWYGrV_rfspF4jBZS2C3JsoMGY4oZlVvqzpZhEeqh3EYCgw2jVc2mUC152tfEDMxJGRPY'
    
    const message = {
        notification: {
            title: 'Server send notification',
            body: 'Quyet gui.'
        },
        data: {
          _id: '123456',
          name: 'Quyet'
        },
        token: tokenDevice
    }

    // let android = {
    //     priority: "High", //mức độ ưu tiên khi push notification
    //     data: {
    //       title: 'Server send',
    //       body: 'Quyet'
    //     }
    // }
    
    // let message = {
    //     android: android,
    //     token: tokenDevice // token của thiết bị muốn push notification
    // }

    const msg = await admin.messaging().send(message)

    return res.status(200).json({
        msg
    })
}

module.exports = {
    index
}