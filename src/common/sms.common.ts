import {AUTH_KEY, TRANS_DND_ROUTE, senderId, signature, URL} from './sms.config.json'
import request from 'request'

export const sendSms = (phone: number, smsContent: string, smsContentType: string = 'english') => {
    return new Promise((resolve, reject) => {
        let options = { 
            method: 'POST',
            url: URL,
            qs: { 
                AUTH_KEY
            },
            headers: {
                'Cache-Control': 'no-cache',
                'Content-Type': 'application/json'
            },
            body: { 
                smsContent,
                // groupId: '0',
                routeId: TRANS_DND_ROUTE,
                mobileNumbers: phone,
                senderId,
                signature,
                smsContentType
            },
            json: true
        }

        request(options, function (error, response, body) {
            if (error) return reject(error)
            resolve(body)
        })
    })
}