
Linebot-Beacon-DD
===

## หัวข้อ

1. [การติดตั้ง](https://github.com/mafiahod/linebot-beacon-DD/blob/master/README.md#%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%95%E0%B8%B4%E0%B8%94%E0%B8%95%E0%B8%B1%E0%B9%89%E0%B8%87)
2. [โครงสร้าง Project](https://github.com/mafiahod/linebot-beacon-DD/blob/master/README.md#%E0%B9%82%E0%B8%84%E0%B8%A3%E0%B8%87%E0%B8%AA%E0%B8%A3%E0%B9%89%E0%B8%B2%E0%B8%87-project)
3. [Object Model และ Function การทำงาน](https://github.com/mafiahod/linebot-beacon-DD/blob/master/README.md#object-model-%E0%B9%81%E0%B8%A5%E0%B8%B0-function-%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%97%E0%B8%B3%E0%B8%87%E0%B8%B2%E0%B8%99)
4. [เอกสารเพิ่มเติม](https://github.com/mafiahod/linebot-beacon-DD/blob/master/README.md#%E0%B9%80%E0%B8%AD%E0%B8%81%E0%B8%AA%E0%B8%B2%E0%B8%A3%E0%B9%80%E0%B8%9E%E0%B8%B4%E0%B9%88%E0%B8%A1%E0%B9%80%E0%B8%95%E0%B8%B4%E0%B8%A1)
5. [เครดิต](https://github.com/mafiahod/linebot-beacon-DD/blob/master/README.md#%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%84%E0%B8%B4%E0%B8%95)

## การติดตั้ง
### เปลี่ยน Keyboard Layout ให้เป็น US ด้วย
```
แก้ไขไฟล์ตาม PATH นี้
/etc/defaults/keyboard	

แก้
XKBLAYOUT="us"
```

### ติดตั้ง Git Command ด้วย
```
sudo apt-get install git
```

### Clone Shell Script สำหรับติดตั้ง Line Beacon ด้วย
```
git clone https://github.com/ballkittipat272/install-Line-Beacon-DD.git
```

### ใช้งาน Line Beacon ครั้งแรก ด้วยชุดคำสั่งต่อไปนี้
```
cd install-Line-Beacon-DD             #Folder ที่ Clone มาจาก GitHub
chmod 775 setup.sh                    #ทำให้ไฟล์ sh สามารถ execute ได้
sed -i -e 's/\r$//' setup.sh          #เพื่อให้คำสั่งเป็น format เดียวกับใน raspberry pi
./setup.sh                            #เพื่อทำการ run ชุดคำสั่งติดตั้ง Line Beacon
```



### เปลี่ยนค่าใน config.js
```
 export  let port = '3000' ,
 channelAccessToken= process.env.channelAccessToken,
 channelSecret= process.env.channelSecret,
 ReportGroupId= "C6ce76af8d6b199b60bb675b85e8cea2f"
 ```
สร้าง enviroment variable ชื่อ channelAccessTokenกับchannelSecret และเปลี่ยน ReportGroupId ตามกลุ่มไลน์ที่บอทอยู่



### ทำการรัน ngrok , Bot Server และ Line Beacon

ใช้ [ngrok](https://ngrok.com/) ในการเชื่อมต่อ Local Host ไปยังภายนอก โดยเชื่อมต่อ [http://localhost:3000](http://localhost:3000) ด้วยคำสั่งด้านล่าง
```
path/to/ngrok http 3000
```

ทำการ Run Bot Server
```
path/(Line Bot code)/src/npm start
```

### ทำการ config webhook url ใน line developer console
[Developers Console](https://developers.line.biz/en/)

## โครงสร้าง Project
![](https://i.imgur.com/fpZJ0rZ.png)



## Object Model และ Function การทำงาน

### Object Model

#### Activity Model
```gherkin=
"use strict";
export class Activity{
    constructor(id,user,coming,timestamp,location,activityInfo) {
    this.userId = id;
    this.name = user;
    this.type = coming;
    this.timestamp = timestamp;
    this.location = location;
    this.plan = activityInfo;   
    }
}
```
เป็นโครงสร้างในการสร้างobjที่ใช้ในการเก็บข้อมูล userที่เข้ามาในรัศมีของตัวbeacon

```gherkin=
#### User Model
gherkin=
"use strict";
export class User{
constructor(lineId, displayName) {
        this.userId = lineId;
        this.name = displayName;        
        }
}
```
เป็นโครงสร้างในการสร้างobjที่ใช้เก็บข้อมูลของ user ที่เข้า join ใน group lineที่บอทอยู่

```gherkin=
#### State Model
gherkin=
"use strict";
export class State{
    constructor(userid,displayname,time,location,askstate) {
    this.userId = userid;
    this.name = displayname;
    this.time = time;
    this.location = location;
    this.askstate = askstate;   
    }
}
```
เป็นโครงสร้างในการสร้างobjใช้เก็บข้อมูลว่ามีการถามคำถามuserหรือไม่ และเก็บเวลาสถานที่ตอนถาม

### Function การทำงาน
#### ส่วน Data Access Layer
##### save()
ใช้ในการบันทึกข้อมูลที่จำเป็น ได้แก่ ชื่อผู้ใช้งาน id ผู้ใช้งาน สถานที่ที่เข้า-ออก เวลา สถานะการตอบคำถาม สถานะในการตอบคำถาม

##### find()
ใช้ในการเรียกหาข้อมูลที่ต้องการนำมาพิจารณาในการทำงาน ทำให้เวลาที่ต้องการค้นหาข้อมูลเป็นไปได้ง่ายและโค๊ดไม่ยาว

##### getLocation()
เพิ่มเติมจาก find เนื่องจากการค้นหาว่า เลข Hardware ID นี้อยู่ที่ไหน จะมีการค้นหาที่แตกต่างจากข้อมูลอื่น ๆ จึงมีการสร้างฟังก์ชัน getLocation มาเพื่อใช้หา Location โดยเฉพาะ

#### ส่วน Service
ในการใช้งาน line beacon ผู้ใช้งานต้องทำการเพิ่มเพื่อน bot และทำการเชิญbot เข้าไปยังกลุ่มที่ถูกสร้างไว้ และในhandleEevent จะมี switch case ที่ใช้ในการแยก event ต่างๆ เมื่อผู้ใช้งานเข้าร่วมเป็นสมาชิกภายในกลุ่ม จะมีการเรียกใช้งาน memberJoined โปรแกรมจะทำการบันทึก user id และข้อมูลของผู้ใช้งานลงในuser.json ในกรณี beacon จะมีการทำงานเมื่อผู้ใช้งานมีการเชื่อมต่อบลูทูธกับ line beacon โปรแกรมจะรับ event ที่ถูกส่งมาจากโทรศัพท์มือถือและส่งevent ไปยังฟังก์ชัน handle_beacon_event ที่เขียน 
handle_beacon_event จะตรวจสอบว่าผู้ใช้งานเป็นสมาชิกในกลุ่มที่มีbeacon bot อยู่หรือไม่ โดยการนำuser id ของผู้ใช้งานไปเปรียบเทียบกับ user id ที่อยู่ในไฟล์ user.json หากผู้ใช้งานเป็นสมาชิกภายในกลุ่ม โปรแกรมจะทำการค้นหา activity และ state ของผู้ใช้งาน และนำไปดำเนินการตามเงื่อนไข

![](https://i.imgur.com/OeC4hsw.png)


ซึ่งจะแบ่งออกเป็น 2 กรณี ดังนี้
กรณีที่ 1 ผู้ใช้งานเชื่อมต่อline beacon เป็นครั้งแรก
		โปรแกรมจะทำการบันทึก activity และ state ของผู้ใช้งาน โดย activity จะประกอบไปด้วย user id, username , สถานะการเข้า¬-ออก , เวลาที่รับข้อมูลจาก beacon , สถานที่ และ  คำตอบ ซึ่งคำตอบจะถูกเก็บค่า ‘none’ เป็นค่าเริ่มต้น ในส่วนของ state จะประกอบไปด้วย user id, username , เวลาที่รับข้อมูลจาก beacon , สถานที่  และ สถานะของการถามคำถาม ซึ่งจะถูกเก็บค่า ‘none’  เป็นค่าเริ่มต้น  หลังจากนั้นจึงเรียกใช้ฟังก์ชัน ask_today_plan 
        
![](https://i.imgur.com/BdxxAhO.png)

![](https://i.imgur.com/V1OGNQr.png)
การบันทึก activity ของผู้ใช้งาน

![](https://i.imgur.com/U5iV4mD.png)
การบันทึก state ของผู้ใช้งาน

ในฟังก์ชัน ask_today_plan bot จะทำการส่งคำถามไปยังแชทส่วนตัวของผู้ใช้งาน และทำการอัพเดตสถานะการถามคำถาม โดยจะทำการเก็บค่าตัวแปร askstate เป็น true หลังจากนั้นจะเรียกใช้callback ฟังก์ชัน
![](https://i.imgur.com/IpNLHim.png)

![](https://i.imgur.com/m0xVMWm.png)
Askstate มีการอัพเดตสถานะจาก ‘none’ เป็นtrue

Callback ฟังก์ชัน จะมีการเรียกใช้ฟังก์ชัน find เพื่อตรวจสอบว่าผู้ใช้งานมีการตอบคำถามไปแล้วหรือไม่ โดย ฟังก์ชัน callback จะมีการทำงานดังนี้
	หากผู้ใช้งานยังไม่มีการตอบคำถามภายใน 15 วินาที bot จะทำการส่งข้อความไปเตือนผู้ใช้งาน เป็นเวลา 3 ครั้ง ถ้ายังไม่มีการตอบกลับจากผู้ใช้งาน bot โปรแกรมจะทำการใส่ค่าว่างเข้าไปในคำตอบนั้นและส่งข้อความเข้าไปในกลุ่ม
![](https://i.imgur.com/BPSAzOi.png)
![](https://i.imgur.com/EpXqK25.jpg)
bot เรียกใช้ฟังก์ชัน callback

![](https://i.imgur.com/s7X7lkL.jpg)
bot ส่งข้อความไปยังกลุ่ม และใส่ค่าว่างลงไปในคำตอบ

ในฟังก์ชัน handleEvent จะมี Case message ใช้รองรับข้อความที่ส่งมาจากผู้ใช้งาน หลังจากนั้นจะทำการดึงโปรไฟล์ของ user และทำการส่งข้อความที่เข้ามารวมไปถึง user id , username , และ timestamp ไปให้ฟังก์ชันhandle_in_Message 
ฟังก์ชัน handle_in_Message จะมีการค้นหาstate ของผู้ใช้งาน หากในไฟล์state ไม่มีข้อมูลของผู้ใช้งานอยูเลย bot จะส่งข้อความไปยังแชทส่วนตัวของผู้ใช้งานว่า ‘I don’t know what you mean’
แต่ถ้ามีข้อมูลของผู้ใช้งาน โปรแกรมจะทำการค้นหาคำตอบตอบของผู้ใช้งานใน activity ล่าสุด ถ้าคำตอบของผู้ใช้งานเท่ากับ ‘none’ โปรแกรมจะทำการอัพเดตคำตอบโดยนำข้อความที่ถูกส่งมาจาก ฟังก์ชันhandleEvent แล้วส่งข้อความไปยังกลุ่ม

![](https://i.imgur.com/w2QjUIk.jpg)

![](https://i.imgur.com/41QXZdr.jpg)


## เอกสารเพิ่มเติม
### สร้าง Line Beacon ด้วย Raspberry Pi ตามลิงค์ด้านล่าง
https://medium.com/@phayao/%E0%B8%A5%E0%B8%AD%E0%B8%87%E0%B9%80%E0%B8%A5%E0%B9%88%E0%B8%99-line-beacon-%E0%B8%94%E0%B9%89%E0%B8%A7%E0%B8%A2-raspberry-pi-e99e076ba20a

### กำหนด hwid ให้ beacon
https://manager.line.biz/beacon/register#/



## เครคิต
Sitthi Thiammekha
https://medium.com/linedevth/line-bot-101-447e427d62c7
