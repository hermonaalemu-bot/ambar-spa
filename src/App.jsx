import React,{useEffect,useMemo,useState,useRef} from "react";
import {supabase} from "./supabase";

const OPEN_HOUR=8,CLOSE_HOUR=19;
const ROLES={RECEPTION:"reception",SUPERVISOR:"supervisor",MANAGER:"manager"};
const DEFAULT_STAFF=[
  {id:"reception1",name:"Reception 1",role:"reception", password:"1234",active:true},
  {id:"reception2",name:"Reception 2",role:"reception", password:"1234",active:true},
  {id:"supervisor", name:"Supervisor", role:"supervisor",password:"1234",active:true},
  {id:"manager",    name:"Manager",    role:"manager",   password:"9999",active:true},
];
const DC=["Barbershop","Beauty Salon","Spa"];
const FS=[
  // ── Barbershop ──────────────────────────────────────────
  {id:101,cat:"Barbershop",sub:"Hair",  name:"Adult Haircut",price:500, cm:35,es:"Barbershop",bk:false,dm:30},
  {id:102,cat:"Barbershop",sub:"Hair",  name:"Child Haircut",price:300, cm:35,es:"Barbershop",bk:false,dm:20},
  {id:103,cat:"Barbershop",sub:"Beard", name:"Beard Trim",   price:200, cm:35,es:"Barbershop",bk:false,dm:20},
  // ── Beauty Salon: Nails ──────────────────────────────────
  {id:201,cat:"Beauty Salon",sub:"Nails",  name:"ስፔሻል ፔዲኪዩር",price:1500,cm:0,es:"Nails",bk:false,dm:60},
  {id:202,cat:"Beauty Salon",sub:"Nails",  name:"ኖርማል ፔዲኪዩር",price:1000,cm:0,es:"Nails",bk:false,dm:45},
  {id:203,cat:"Beauty Salon",sub:"Nails",  name:"ማኒኪዩር",price:800,cm:0,es:"Nails",bk:false,dm:45},
  {id:204,cat:"Beauty Salon",sub:"Nails",  name:"ስፔሻል ማኒኪዩር",price:1000,cm:0,es:"Nails",bk:false,dm:60},
  {id:205,cat:"Beauty Salon",sub:"Nails",  name:"ሼላክ ማስለቀቅ",price:150,cm:0,es:"Nails",bk:false,dm:20},
  {id:206,cat:"Beauty Salon",sub:"Nails",  name:"ጄል ማስለቀቅ",price:300,cm:0,es:"Nails",bk:false,dm:20},
  {id:207,cat:"Beauty Salon",sub:"Nails",  name:"ጄል በሼላክ",price:1600,cm:0,es:"Nails",bk:false,dm:75},
  {id:208,cat:"Beauty Salon",sub:"Nails",  name:"ጄል በሜታሊክ",price:1800,cm:0,es:"Nails",bk:false,dm:75},
  {id:209,cat:"Beauty Salon",sub:"Nails",  name:"ልጥፍ በሼላክ",price:1200,cm:0,es:"Nails",bk:false,dm:60},
  {id:210,cat:"Beauty Salon",sub:"Nails",  name:"ልጥፍ በሜታሊክ",price:1600,cm:0,es:"Nails",bk:false,dm:60},
  {id:211,cat:"Beauty Salon",sub:"Nails",  name:"ልጥፍ በአምብራ",price:1600,cm:0,es:"Nails",bk:false,dm:60},
  {id:212,cat:"Beauty Salon",sub:"Nails",  name:"ጄል በአምብራ",price:1800,cm:0,es:"Nails",bk:false,dm:75},
  {id:213,cat:"Beauty Salon",sub:"Nails",  name:"ሼላክ",price:600,cm:0,es:"Nails",bk:false,dm:45},
  {id:214,cat:"Beauty Salon",sub:"Nails",  name:"ሼላክ በሜታሊክ",price:800,cm:0,es:"Nails",bk:false,dm:45},
  {id:215,cat:"Beauty Salon",sub:"Nails",  name:"ጄል",price:1100,cm:0,es:"Nails",bk:false,dm:60},
  {id:216,cat:"Beauty Salon",sub:"Nails",  name:"በጥፍር ጄል በሼላክ",price:1300,cm:0,es:"Nails",bk:false,dm:60},
  {id:217,cat:"Beauty Salon",sub:"Nails",  name:"አንድ ጣት ጄል",price:150,cm:0,es:"Nails",bk:false,dm:15},
  {id:218,cat:"Beauty Salon",sub:"Nails",  name:"አንድ ጣት ልጥፍ",price:150,cm:0,es:"Nails",bk:false,dm:15},
  {id:219,cat:"Beauty Salon",sub:"Nails",  name:"ሬፍል በሼላክ",price:1400,cm:0,es:"Nails",bk:false,dm:60},
  {id:220,cat:"Beauty Salon",sub:"Nails",  name:"ሬፍል በሜታሊክ",price:1600,cm:0,es:"Nails",bk:false,dm:60},
  {id:221,cat:"Beauty Salon",sub:"Nails",  name:"የጥፍር ፍሬሮች (1)",price:10,cm:0,es:"Nails",bk:false,dm:5},
  {id:222,cat:"Beauty Salon",sub:"Nails",  name:"የጥፍር ፍሬሮች (2)",price:20,cm:0,es:"Nails",bk:false,dm:5},
  {id:223,cat:"Beauty Salon",sub:"Nails",  name:"የጥፍር ፍሬሮች (3)",price:30,cm:0,es:"Nails",bk:false,dm:5},
  {id:224,cat:"Beauty Salon",sub:"Nails",  name:"የጥፍር ፍላወር ትንሽ",price:10,cm:0,es:"Nails",bk:false,dm:10},
  {id:225,cat:"Beauty Salon",sub:"Nails",  name:"የጥፍር ፍላወር መካከለኛ",price:30,cm:0,es:"Nails",bk:false,dm:10},
  {id:226,cat:"Beauty Salon",sub:"Nails",  name:"የጥፍር ፍላወር ትልቅ",price:50,cm:0,es:"Nails",bk:false,dm:10},
  // ── Beauty Salon: Braids ─────────────────────────────────
  {id:301,cat:"Beauty Salon",sub:"Braids",name:"ስፌት",price:800,cm:10,es:"Braids",bk:false,dm:90},
  {id:302,cat:"Beauty Salon",sub:"Braids",name:"ሸሩባ በጎጥር + ጄል",price:700,cm:10,es:"Braids",bk:false,dm:60},
  {id:303,cat:"Beauty Salon",sub:"Braids",name:"ቁጥርጥር በጎጥር",price:500,cm:10,es:"Braids",bk:false,dm:45},
  {id:304,cat:"Beauty Salon",sub:"Braids",name:"ቁጥርጥር በ1 ዊግ (ከኛ በወፍራም)",price:800,cm:10,es:"Braids",bk:false,dm:90},
  {id:305,cat:"Beauty Salon",sub:"Braids",name:"ቁጥርጥር በ1 ዊግ (ከነሱ በወፍራም)",price:600,cm:10,es:"Braids",bk:false,dm:90},
  {id:306,cat:"Beauty Salon",sub:"Braids",name:"ቁጥርጥር በ1 ዊግ (ከኛ በቁጭን)",price:900,cm:10,es:"Braids",bk:false,dm:90},
  {id:307,cat:"Beauty Salon",sub:"Braids",name:"ቁጥርጥር በ1 ዊግ (ከነሱ በቁጭን)",price:600,cm:10,es:"Braids",bk:false,dm:90},
  {id:308,cat:"Beauty Salon",sub:"Braids",name:"ቦሃ ብሬድ ከኛ (ፍሬዝ)",price:1300,cm:10,es:"Braids",bk:false,dm:120},
  {id:309,cat:"Beauty Salon",sub:"Braids",name:"ቦሃ ብሬድ ከነሱ",price:600,cm:10,es:"Braids",bk:false,dm:120},
  {id:310,cat:"Beauty Salon",sub:"Braids",name:"ፍሬንች ከርል ከኛ",price:1000,cm:10,es:"Braids",bk:false,dm:120},
  {id:311,cat:"Beauty Salon",sub:"Braids",name:"ፍሬንች ከርል ከነሱ",price:600,cm:10,es:"Braids",bk:false,dm:120},
  {id:312,cat:"Beauty Salon",sub:"Braids",name:"ትዌስት በጎጥር",price:600,cm:10,es:"Braids",bk:false,dm:60},
  {id:313,cat:"Beauty Salon",sub:"Braids",name:"ትዌስት በጎጥር + ጄል",price:700,cm:10,es:"Braids",bk:false,dm:75},
  {id:314,cat:"Beauty Salon",sub:"Braids",name:"ትዌስት በ1 ዊግ (ከኛ በወፍራም)",price:900,cm:10,es:"Braids",bk:false,dm:90},
  {id:315,cat:"Beauty Salon",sub:"Braids",name:"ትዌስት በ1 ዊግ (ከኛ በቁጭን)",price:1000,cm:10,es:"Braids",bk:false,dm:90},
  {id:316,cat:"Beauty Salon",sub:"Braids",name:"ትዌስት በ1 ዊግ (ከነሱ በወፍራም)",price:600,cm:10,es:"Braids",bk:false,dm:90},
  {id:317,cat:"Beauty Salon",sub:"Braids",name:"ትዌስት በ1 ዊግ (ከነሱ በቁጭን)",price:700,cm:10,es:"Braids",bk:false,dm:90},
  {id:318,cat:"Beauty Salon",sub:"Braids",name:"ሒይማን እቡት",price:300,cm:10,es:"Braids",bk:false,dm:30},
  {id:319,cat:"Beauty Salon",sub:"Braids",name:"ስዋስዋ ስፌት",price:1000,cm:10,es:"Braids",bk:false,dm:120},
  {id:320,cat:"Beauty Salon",sub:"Braids",name:"ሒይማን መፍቻ",price:200,cm:0,es:"Nails",bk:false,dm:20},
  {id:321,cat:"Beauty Salon",sub:"Braids",name:"ካንቱ ፍሬዝ በሒይማን",price:700,cm:0,es:"Nails",bk:false,dm:30},
  {id:322,cat:"Beauty Salon",sub:"Braids",name:"ኮንዶቤት ፍሬዝ ከኛ",price:700,cm:0,es:"Nails",bk:false,dm:30},
  {id:323,cat:"Beauty Salon",sub:"Braids",name:"½ ስፌት ½ ሸሩባ",price:1500,cm:10,es:"Braids",bk:false,dm:120},
  // ── Beauty Salon: Materials (deducted from braid commission) ───
  {id:291,cat:"Beauty Salon",sub:"Materials",name:"ዊግ (ከኛ)",  price:200,cm:0,es:"Braids",bk:false,dm:5},
  {id:292,cat:"Beauty Salon",sub:"Materials",name:"ጄል (ከኛ)",  price:200,cm:0,es:"Braids",bk:false,dm:5},
  // ── Beauty Salon: Wigs ──────────────────────────────────
  {id:401,cat:"Beauty Salon",sub:"Wigs",   name:"ኪነኛ ዊግ",  price:300, cm:0,es:"Beauty Salon",bk:false,dm:30},
  {id:402,cat:"Beauty Salon",sub:"Wigs",   name:"ሉኣም ዊግ",  price:3000,cm:0,es:"Nails",bk:false,dm:60},
  {id:403,cat:"Beauty Salon",sub:"Wigs",   name:"ወተአ ዊግ",  price:2500,cm:0,es:"Nails",bk:false,dm:60},
  {id:404,cat:"Beauty Salon",sub:"Wigs",   name:"አልባሰ",          price:2000,cm:0,es:"Nails",bk:false,dm:120},
  {id:405,cat:"Beauty Salon",sub:"Wigs",   name:"ጎሜ",                      price:2000,cm:0,es:"Nails",bk:false,dm:90},
  // ── Beauty Salon: Eyebrow ──────────────────────────────
  {id:501,cat:"Beauty Salon",sub:"Eyebrow",name:"ቅንድብ ሂና",            price:400,cm:0,es:"Nails",bk:false,dm:30},
  {id:502,cat:"Beauty Salon",sub:"Eyebrow",name:"ቅንድብ በከር",       price:200,cm:0,es:"Nails",bk:false,dm:15},
  {id:503,cat:"Beauty Salon",sub:"Eyebrow",name:"ቅንድብ በምላጩ", price:100,cm:0,es:"Nails",bk:false,dm:10},
  // ── Beauty Salon: Wax ───────────────────────────────────
  {id:601,cat:"Beauty Salon",sub:"Wax",name:"አፈር ሊፕ",                    price:250, cm:0,es:"Beauty Salon",bk:false,dm:15},
  {id:602,cat:"Beauty Salon",sub:"Wax",name:"አንደር አርም ዋክስ",price:350,cm:0,es:"Nails",bk:false,dm:20},
  {id:603,cat:"Beauty Salon",sub:"Wax",name:"ፊል ላግ ዋክስ",        price:1900,cm:0,es:"Nails",bk:false,dm:45},
  {id:604,cat:"Beauty Salon",sub:"Wax",name:"1/2 ላግ ዋክስ",                price:1000,cm:0,es:"Nails",bk:false,dm:30},
  {id:605,cat:"Beauty Salon",sub:"Wax",name:"እጀ ምሉ ዋክስ",        price:1300,cm:0,es:"Nails",bk:false,dm:30},
  {id:606,cat:"Beauty Salon",sub:"Wax",name:"1/2 አርም ዋክስ",           price:600, cm:0,es:"Beauty Salon",bk:false,dm:20},
  {id:607,cat:"Beauty Salon",sub:"Wax",name:"ጢኪኒ ዋክስ",               price:2000,cm:0,es:"Nails",bk:false,dm:30},
  // ── Spa: Moroccan Bath ─────────────────────────────────
  {id:701,cat:"Spa",sub:"Moroccan Bath",name:"Morocco Bath",price:2800,cm:10,es:"Spa",bk:true,dm:120},
  {id:702,cat:"Spa",sub:"Moroccan Bath",name:"Morocco Bath + Maize Powder & Honey",price:3000,cm:10,es:"Spa",bk:true,dm:120},
  {id:703,cat:"Spa",sub:"Moroccan Bath",name:"Morocco Bath + Soy Bean Powder & Honey",price:3000,cm:10,es:"Spa",bk:true,dm:120},
  {id:704,cat:"Spa",sub:"Moroccan Bath",name:"Morocco Bath + Soy Bean, Yoghurt & Olive Oil",price:3000,cm:10,es:"Spa",bk:true,dm:120},
  {id:705,cat:"Spa",sub:"Moroccan Bath",name:"Morocco Bath + Black Seed & Olive Oil",price:3500,cm:10,es:"Spa",bk:true,dm:120},
  {id:706,cat:"Spa",sub:"Moroccan Bath",name:"Morocco Bath + Mixed Fruit, Honey, Yoghurt & Turmeric",price:3500,cm:10,es:"Spa",bk:true,dm:120},
  {id:707,cat:"Spa",sub:"Moroccan Bath",name:"Morocco Bath + Oats, Honey, Yoghurt & Turmeric",price:3500,cm:10,es:"Spa",bk:true,dm:120},
  {id:708,cat:"Spa",sub:"Moroccan Bath",name:"Morocco Bath + Coffee, Honey & Yogurt",price:4000,cm:10,es:"Spa",bk:true,dm:120},
  {id:709,cat:"Spa",sub:"Moroccan Bath",name:"Morocco Bath + Rice, Honey, Yogurt & Olive Oil +15min Massage",price:4500,cm:10,es:"Spa",bk:true,dm:135},
  {id:710,cat:"Spa",sub:"Moroccan Bath",name:"Ambar Special - Cinnamon, Fenugreek, Coffee, Honey, Yoghurt, Sesame Oil, Mixed Fruit + Hair Treatment + 30min Massage + Hairstyling",price:5000,cm:10,es:"Spa",bk:true,dm:180},
  // ── Spa: Steam & Sauna ──────────────────────────────────
  {id:801,cat:"Spa",sub:"Steam & Sauna",name:"Steam & Sauna 2hrs",                           price:1000,cm:0, es:"Spa",bk:true,dm:120},
  {id:802,cat:"Spa",sub:"Steam & Sauna",name:"Couple Steam & Sauna 2hrs + 1 Juice of Choice",price:4000,cm:0, es:"Spa",bk:true,dm:120},
  // ── Spa: Massage ────────────────────────────────────────
  {id:901,cat:"Spa",sub:"Massage",name:"Head Massage 30min",price:1000,cm:10,es:"Spa",bk:true,dm:30},
  {id:902,cat:"Spa",sub:"Massage",name:"Foot Massage 30min",price:1200,cm:10,es:"Spa",bk:true,dm:30},
  {id:903,cat:"Spa",sub:"Massage",name:"Swedish Massage 60min",price:2000,cm:10,es:"Spa",bk:true,dm:60},
  {id:904,cat:"Spa",sub:"Massage",name:"Swedish Massage with Shea Butter 60min",price:2500,cm:10,es:"Spa",bk:true,dm:60},
  {id:905,cat:"Spa",sub:"Massage",name:"Deep Tissue Massage 60min",price:2500,cm:10,es:"Spa",bk:true,dm:60},
  {id:906,cat:"Spa",sub:"Massage",name:"Deep Tissue Massage with Shea Butter 60min",price:3000,cm:10,es:"Spa",bk:true,dm:60},
  {id:907,cat:"Spa",sub:"Massage",name:"Aroma Massage 60min",price:2000,cm:10,es:"Spa",bk:true,dm:60},
  {id:908,cat:"Spa",sub:"Massage",name:"Scrub Massage 60min",price:3000,cm:10,es:"Spa",bk:true,dm:60},
  {id:909,cat:"Spa",sub:"Massage",name:"Coffee Scrub with Honey Massage 60min + 1 Juice",price:3000,cm:10,es:"Spa",bk:true,dm:60},
  {id:910,cat:"Spa",sub:"Massage",name:"Black Seed & Olive Oil Massage 60min + 1 Juice",price:3000,cm:10,es:"Spa",bk:true,dm:60},
  {id:911,cat:"Spa",sub:"Massage",name:"Hot Stone Massage 60min",price:3000,cm:10,es:"Spa",bk:true,dm:60},
  {id:912,cat:"Spa",sub:"Massage",name:"Couple's Massage Regular 60min",price:4000,cm:10,es:"Spa",bk:true,dm:60},
  {id:913,cat:"Spa",sub:"Massage",name:"Couple's Massage Special (60min Steam & Sauna + 60min Massage + 1 Juice)",price:7000,cm:10,es:"Spa",bk:true,dm:180},
];
const FULL_SERVICES=FS.map(s=>({id:s.id,category:s.cat,sub:s.sub,name:s.name,price:s.price,commission:s.cm,employeeSection:s.es,bookable:s.bk,durationMins:s.dm}));
const DEFAULT_EMPLOYEES=[
  // Barbershop
  {id:1, name:"አንዶም",   section:"Barbershop",  role:"Barber",         salary:0,absentDays:0,loan:0,loanNote:"",brokerFee:0,otherDeduction:0,otherNote:"",active:true,hireDate:"2024-01-01",dayOff:null,onLeave:false},
  {id:2, name:"ሃፍቶም",   section:"Barbershop",  role:"Barber",         salary:0,absentDays:0,loan:0,loanNote:"",brokerFee:0,otherDeduction:0,otherNote:"",active:true,hireDate:"2024-01-01",dayOff:null,onLeave:false},
  {id:3, name:"ሮዛ",     section:"Barbershop",  role:"Hair Specialist", salary:0,absentDays:0,loan:0,loanNote:"",brokerFee:0,otherDeduction:0,otherNote:"",active:true,hireDate:"2024-01-01",dayOff:null,onLeave:false},
  // Nails
  {id:4, name:"Danawit", section:"Nails",       role:"Nail Artist",    salary:0,absentDays:0,loan:0,loanNote:"",brokerFee:0,otherDeduction:0,otherNote:"",active:true,hireDate:"2024-01-01",dayOff:null,onLeave:false},
  {id:5, name:"Etsub",   section:"Nails",       role:"Nail Artist",    salary:0,absentDays:0,loan:0,loanNote:"",brokerFee:0,otherDeduction:0,otherNote:"",active:true,hireDate:"2024-01-01",dayOff:null,onLeave:false},
  {id:6, name:"Rita",    section:"Nails",       role:"Nail Artist",    salary:0,absentDays:0,loan:0,loanNote:"",brokerFee:0,otherDeduction:0,otherNote:"",active:true,hireDate:"2024-01-01",dayOff:null,onLeave:false},
  // Wash & Pedicure
  {id:7, name:"ኩሪ",     section:"Wash & Pedicure",role:"Washer/Pedicure",salary:0,absentDays:0,loan:0,loanNote:"",brokerFee:0,otherDeduction:0,otherNote:"",active:true,hireDate:"2024-01-01",dayOff:null,onLeave:false},
  {id:8, name:"ማሬ",     section:"Wash & Pedicure",role:"Washer/Pedicure",salary:0,absentDays:0,loan:0,loanNote:"",brokerFee:0,otherDeduction:0,otherNote:"",active:true,hireDate:"2024-01-01",dayOff:null,onLeave:false},
  // Braids & Sewings
  {id:9, name:"አባይ",    section:"Braids",      role:"Stylist",        salary:0,absentDays:0,loan:0,loanNote:"",brokerFee:0,otherDeduction:0,otherNote:"",active:true,hireDate:"2024-01-01",dayOff:null,onLeave:false},
  {id:10,name:"ምንትዋብ",  section:"Braids",      role:"Stylist",        salary:0,absentDays:0,loan:0,loanNote:"",brokerFee:0,otherDeduction:0,otherNote:"",active:true,hireDate:"2024-01-01",dayOff:null,onLeave:false},
  {id:11,name:"ሜሮን",    section:"Braids",      role:"Stylist",        salary:0,absentDays:0,loan:0,loanNote:"",brokerFee:0,otherDeduction:0,otherNote:"",active:true,hireDate:"2024-01-01",dayOff:null,onLeave:false},
  {id:12,name:"የማርያም",  section:"Braids",      role:"Stylist",        salary:0,absentDays:0,loan:0,loanNote:"",brokerFee:0,otherDeduction:0,otherNote:"",active:true,hireDate:"2024-01-01",dayOff:null,onLeave:false},
  {id:13,name:"መድሃኒት",  section:"Braids",      role:"Stylist",        salary:0,absentDays:0,loan:0,loanNote:"",brokerFee:0,otherDeduction:0,otherNote:"",active:true,hireDate:"2024-01-01",dayOff:null,onLeave:false},
  // Hair Stylists
  {id:14,name:"Nati",    section:"Hair Styling",role:"Stylist",        salary:0,absentDays:0,loan:0,loanNote:"",brokerFee:0,otherDeduction:0,otherNote:"",active:true,hireDate:"2024-01-01",dayOff:null,onLeave:false},
  {id:15,name:"Haileab", section:"Hair Styling",role:"Stylist",        salary:0,absentDays:0,loan:0,loanNote:"",brokerFee:0,otherDeduction:0,otherNote:"",active:true,hireDate:"2024-01-01",dayOff:null,onLeave:false},
  {id:16,name:"Sami",    section:"Hair Styling",role:"Stylist",        salary:0,absentDays:0,loan:0,loanNote:"",brokerFee:0,otherDeduction:0,otherNote:"",active:true,hireDate:"2024-01-01",dayOff:null,onLeave:false},
  // Spa
  {id:17,name:"Beti",    section:"Spa",         role:"Spa Therapist",  salary:0,absentDays:0,loan:0,loanNote:"",brokerFee:0,otherDeduction:0,otherNote:"",active:true,hireDate:"2024-01-01",dayOff:null,onLeave:false},
  {id:18,name:"Banchi",  section:"Spa",         role:"Spa Therapist",  salary:0,absentDays:0,loan:0,loanNote:"",brokerFee:0,otherDeduction:0,otherNote:"",active:true,hireDate:"2024-01-01",dayOff:null,onLeave:false},
  {id:19,name:"Lidya",   section:"Spa",         role:"Spa Therapist",  salary:0,absentDays:0,loan:0,loanNote:"",brokerFee:0,otherDeduction:0,otherNote:"",active:true,hireDate:"2024-01-01",dayOff:null,onLeave:false},
  // Management & Support
  {id:20,name:"Mimi",    section:"Reception",   role:"Receptionist",   salary:0,absentDays:0,loan:0,loanNote:"",brokerFee:0,otherDeduction:0,otherNote:"",active:true,hireDate:"2024-01-01",dayOff:null,onLeave:false},
  {id:21,name:"Beza",    section:"Reception",   role:"Receptionist",   salary:0,absentDays:0,loan:0,loanNote:"",brokerFee:0,otherDeduction:0,otherNote:"",active:true,hireDate:"2024-01-01",dayOff:null,onLeave:false},
  {id:22,name:"Sosina",  section:"Management",  role:"Supervisor",     salary:0,absentDays:0,loan:0,loanNote:"",brokerFee:0,otherDeduction:0,otherNote:"",active:true,hireDate:"2024-01-01",dayOff:null,onLeave:false},
  {id:23,name:"ሜሮን",    section:"Management",  role:"Manager",        salary:0,absentDays:0,loan:0,loanNote:"",brokerFee:0,otherDeduction:0,otherNote:"",active:true,hireDate:"2024-01-01",dayOff:null,onLeave:false},
  {id:24,name:"ሰላም",    section:"Management",  role:"Assistant",      salary:0,absentDays:0,loan:0,loanNote:"",brokerFee:0,otherDeduction:0,otherNote:"",active:true,hireDate:"2024-01-01",dayOff:null,onLeave:false},
  {id:25,name:"Janitor 1",section:"Management", role:"Janitor",        salary:0,absentDays:0,loan:0,loanNote:"",brokerFee:0,otherDeduction:0,otherNote:"",active:true,hireDate:"2024-01-01",dayOff:null,onLeave:false},
  {id:26,name:"Janitor 2",section:"Management", role:"Janitor",        salary:0,absentDays:0,loan:0,loanNote:"",brokerFee:0,otherDeduction:0,otherNote:"",active:true,hireDate:"2024-01-01",dayOff:null,onLeave:false},
];
const DAYS=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const EMP_SECTIONS=["Barbershop","Nails","Wash & Pedicure","Braids","Hair Styling","Spa","Reception","Management"];

// Ethiopian Calendar
const ETH_MONTHS=["መስከረም","ጥቅምት","ህዳር","ታህሳስ","ጥር","የካቲት","መጋቢት","ሚያዚያ","ግንቦት","ሰኔ","ሐምሌ","ነሃሴ","ጳጉሜ"];
function gregToEth(g){
  if(!g)return{y:2016,m:1,d:1};
  const s=(g||'').slice(0,10);
  // Use the correct JDN formula (v2 - pairs with jdn_to_greg below)
  const dt=new Date(s+'T12:00:00Z');
  const y=dt.getUTCFullYear(),m=dt.getUTCMonth()+1,d=dt.getUTCDate();
  const a=Math.floor((14-m)/12);
  const y2=y+4800-a,m2=m+12*a-3;
  const jdn=d+Math.floor((153*m2+2)/5)+365*y2+Math.floor(y2/4)-Math.floor(y2/100)+Math.floor(y2/400)-32045;
  // Ethiopian epoch E=1724220, with (ey-1)//4 and subtract 1
  const E=1724220;
  const r=jdn-E-1;
  const n4=Math.floor(r/1461);
  const r1=r%1461;
  const n1=Math.min(Math.floor(r1/365),3);
  const r2=r1-n1*365;
  const ey=n4*4+n1+1;
  const em=Math.floor(r2/30)+1;
  const ed=r2%30+1;
  return{y:ey,m:Math.min(em,13),d:Math.min(ed,30)};
}
function ethToGreg(ey,em,ed){
  // E=1724220, inverse of gregToEth
  const E=1724220;
  const jdn=E+365*(ey-1)+Math.floor((ey-1)/4)+30*(em-1)+ed;
  // Standard JDN to Gregorian (pairs with greg_to_jdn_v2)
  const l=jdn+68569;
  const n=Math.floor(4*l/146097);
  const l2=l-Math.floor((146097*n+3)/4);
  const i=Math.floor(4000*(l2+1)/1461001);
  const l3=l2-Math.floor(1461*i/4)+31;
  const j=Math.floor(80*l3/2447);
  const dd=l3-Math.floor(2447*j/80);
  const l4=Math.floor(j/11);
  const mo=j+2-12*l4;
  const yr=100*(n-49)+i+l4;
  return yr+'-'+String(mo).padStart(2,'0')+'-'+String(dd).padStart(2,'0');
}

function todayStr(){return new Date().toISOString().slice(0,10);}
function todayDow(){return new Date().getDay();} // 0=Sun,1=Mon...6=Sat
function isEmpAvailableToday(emp){
  if(!emp.active)return false;
  if(emp.onLeave)return false;
  if(emp.dayOff!==null&&emp.dayOff!==undefined&&emp.dayOff===todayDow())return false;
  return true;
}
function money(n){return Number(n||0).toLocaleString()+" Birr";}
// Wait time tracking using localStorage (no DB column needed)
function markArrival(id){try{const k="ambar_arr_"+id;if(!localStorage.getItem(k))localStorage.setItem(k,Date.now());}catch(e){}}
function waitMins(id){try{const t=localStorage.getItem("ambar_arr_"+id);if(!t)return null;return Math.floor((Date.now()-Number(t))/60000);}catch(e){return null;}}
function svcMins(lineId){try{const t=localStorage.getItem("ambar_svc_"+lineId);if(!t)return null;return Math.floor((Date.now()-Number(t))/60000);}catch(e){return null;}}
function markSvcStart(lineId){try{const k="ambar_svc_"+lineId;if(!localStorage.getItem(k))localStorage.setItem(k,Date.now());}catch(e){}}
function makeId(name,phone){const n=(name||"CUS").replace(/[^a-zA-Z]/g,"").slice(0,3).toUpperCase()||"CUS";const p=(phone||"0000").replace(/\D/g,"").slice(-4)||"0000";return n+"-"+p;}
function lineGross(l){return Number(l.price||0)*Number(l.qty||1);}
function lineIncome(l){if(l.free)return 0;return Math.max(0,lineGross(l)-Number(l.discount||0));}
function lineComm(l){
  let base=lineIncome(l);
  // For ከኛ braids: deduct wig (200) and/or gel (200) costs before commission
  if(l.sub==="Braids"&&l.name&&l.name.includes("ከኛ")){
    if(l.name.includes("ዊግ")||l.name.toLowerCase().includes("wig"))base=Math.max(0,base-200);
    if(l.name.includes("ጄል")||l.name.toLowerCase().includes("gel"))base=Math.max(0,base-200);
    // All ከኛ braids deduct both wig+gel if applicable
    if(l.wigDeduction)base=Math.max(0,base-Number(l.wigDeduction));
  }
  return Math.round((base*Number(l.commission||0))/100);
}
function getPayPeriod(d){const dt=new Date(d||todayStr());const day=dt.getDate();let sy=dt.getFullYear(),sm=dt.getMonth();if(day<11){sm--;if(sm<0){sm=11;sy--;}}const s=new Date(sy,sm,11),e=new Date(sy,sm+1,10);const fmt=x=>x.toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"});return{start:s.toISOString().slice(0,10),end:e.toISOString().slice(0,10),label:fmt(s)+" - "+fmt(e)};}
function toEthTime(t){if(!t)return"";const[h,m]=t.split(":").map(Number);let e=h-6;if(e<=0)e+=12;return e+":"+String(m).padStart(2,"0")+" "+(h<18?"ቀን":"ማታ");}
function timeSlots(){const s=[];for(let h=OPEN_HOUR;h<CLOSE_HOUR;h++)for(let m=0;m<60;m+=30)s.push(String(h).padStart(2,"0")+":"+String(m).padStart(2,"0"));return s;}
function exportCSV(rows,fn){const k=Object.keys(rows[0]||{});const csv=[k.join(","),...rows.map(r=>k.map(x=>JSON.stringify(r[x]??"")).join(","))].join("\n");const a=document.createElement("a");a.href="data:text/csv;charset=utf-8,"+encodeURIComponent(csv);a.download=fn;a.click();}
function printReceipt(visit,emps){
  const w=window.open("","_blank","width=400,height=600");
  const tips=visit.tips||[];const tipTotal=tips.reduce((s,t)=>s+Number(t.amount||0),0);
  const lines=visit.services.filter(l=>l.status!=="Cancelled");
  w.document.write(`<!DOCTYPE html><html><head><title>Receipt</title><style>
    body{font-family:Arial,sans-serif;padding:20px;max-width:320px;margin:0 auto;font-size:13px;}
    h2{text-align:center;margin:0 0 4px;font-size:18px;}
    .center{text-align:center;} .line{border-top:1px dashed #ccc;margin:8px 0;}
    .row{display:flex;justify-content:space-between;margin:3px 0;}
    .bold{font-weight:bold;} .total{font-size:16px;font-weight:900;}
    .footer{text-align:center;color:#666;font-size:11px;margin-top:12px;}
  </style></head><body>
    <h2>Ambar Spa & Beauty</h2>
    <p class="center" style="color:#666;font-size:11px;margin:0 0 8px">አምባር ስፓ & ቢውቲ</p>
    <div class="line"></div>
    <div class="row"><span>Customer:</span><span class="bold">${visit.name}</span></div>
    <div class="row"><span>Queue #:</span><span>${visit.queue}</span></div>
    <div class="row"><span>Date:</span><span>${visit.date}</span></div>
    <div class="row"><span>Payment:</span><span>${visit.paymentMethod}</span></div>
    <div class="line"></div>
    <div class="bold" style="margin-bottom:6px">Services:</div>
    ${lines.map(l=>`<div class="row"><span>${l.name}${l.qty>1?" x"+l.qty:""}</span><span>${l.free?"FREE":Number(lineIncome(l)).toLocaleString()+" Birr"}</span></div>`).join("")}
    ${lines.some(l=>l.discount>0)?`<div class="row" style="color:#991b1b"><span>Discounts applied</span><span>-${lines.reduce((s,l)=>s+Number(l.discount||0),0).toLocaleString()} Birr</span></div>`:""}
    <div class="line"></div>
    <div class="row total"><span>Total Paid</span><span>${Number(visit.totalService).toLocaleString()} Birr</span></div>
    ${tipTotal>0?`<div class="row" style="color:#166534"><span>Tips (to staff)</span><span>${tipTotal.toLocaleString()} Birr</span></div>`:""}
    ${tips.map(t=>`<div class="row" style="font-size:11px;color:#6b7280"><span>  → ${t.employee}</span><span>${Number(t.amount).toLocaleString()} Birr</span></div>`).join("")}
    <div class="line"></div>
    <div class="footer">
      <p>Thank you for visiting Ambar Spa & Beauty!</p>
      <p>እናመሰግናለን 🌸</p>
      <p style="margin-top:6px;font-size:10px">Printed: ${new Date().toLocaleString()}</p>
    </div>
  </body></html>`);
  w.document.close();w.focus();setTimeout(()=>w.print(),500);
}
// Retry helper — retries failed DB calls up to 3 times
async function dbRetry(fn,attempts=3){
  for(let i=0;i<attempts;i++){
    try{const r=await fn();if(!r.error)return r;if(i===attempts-1)throw new Error(r.error.message);}
    catch(e){if(i===attempts-1)throw e;await new Promise(r=>setTimeout(r,500*(i+1)));}
  }
}
function logAct(user,action,detail=""){supabase.from("activity_log").insert({staff_id:user.id,staff_name:user.name,action,detail,ts:new Date().toISOString()}).then(()=>{});}

function chime(type="info"){
  try{
    const ctx=new(window.AudioContext||window.webkitAudioContext)();
    const p={info:[{f:523,t:0},{f:659,t:0.15},{f:784,t:0.3}],booking:[{f:784,t:0},{f:988,t:0.15},{f:1047,t:0.3},{f:1319,t:0.45}],payment:[{f:392,t:0},{f:523,t:0.2},{f:659,t:0.4}],success:[{f:659,t:0},{f:784,t:0.15},{f:1047,t:0.3}],warning:[{f:440,t:0},{f:440,t:0.25}]};
    (p[type]||p.info).forEach(({f,t})=>{const o=ctx.createOscillator(),g=ctx.createGain();o.connect(g);g.connect(ctx.destination);o.frequency.value=f;o.type="sine";g.gain.setValueAtTime(0.3,ctx.currentTime+t);g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+t+0.4);o.start(ctx.currentTime+t);o.stop(ctx.currentTime+t+0.5);});
  }catch(e){}
}

function checkConflict(bks,form,svcs){
  const svc=svcs.find(s=>s.id===Number(form.serviceId));if(!svc)return null;
  const start=new Date(form.date+"T"+form.time);const end=new Date(start.getTime()+svc.durationMins*60000);
  const overlap=bks.filter(b=>b.date===form.date&&!["Cancelled","No-show","Completed"].includes(b.status)&&b.id!==(form.id||0)).filter(b=>{const bs=new Date(form.date+"T"+b.time);const be=new Date(bs.getTime()+b.durationMins*60000);return bs<end&&be>start;});
  if(svc.sub==="Moroccan Bath"){const tot=overlap.filter(b=>b.serviceCategory==="Spa").reduce((s,b)=>s+b.people,0)+Number(form.people||1);if(tot>4)return"⚠️ Morocco Bath room may be over capacity (max 4 people comfortable together).";}
  if(svc.sub==="Steam & Sauna"&&overlap.filter(b=>b.serviceName&&b.serviceName.includes("Sauna")).length>0)return"⚠️ Steam & Sauna has overlapping bookings at this time.";
  if(svc.sub==="Massage"&&overlap.filter(b=>b.serviceName&&b.serviceName.includes("Massage")).length>=2)return"⚠️ Both massage rooms may be occupied at this time.";
  return null;
}

const BKC={Pending:{bg:"#fef3c7",co:"#92400e"},Confirmed:{bg:"#dbeafe",co:"#1e40af"},Arrived:{bg:"#dcfce7",co:"#166534"},Completed:{bg:"#f0fdf4",co:"#14532d"},Cancelled:{bg:"#fee2e2",co:"#991b1b"},"No-show":{bg:"#f3f4f6",co:"#6b7280"}};
const TABA={Reception:["reception","manager"],Supervisor:["supervisor","manager"],Checkout:["reception","manager"],Bookings:["reception","supervisor","manager"],"Service Setup":["manager"],"Daily Closing":["manager"],Expenses:["manager"],Customers:["manager"],Payroll:["manager"],Dashboard:["manager"],Staff:["manager"],"Activity Log":["manager"],Handover:["reception","supervisor","manager"],"Design Editor":["manager"],Inventory:["manager"]};
const dbSvc=r=>({id:r.id,category:r.category,sub:r.sub||"",name:r.name,price:Number(r.price),commission:Number(r.commission),employeeSection:r.employee_section,bookable:!!r.bookable,durationMins:r.duration_mins||60});
const dbEmp=r=>({id:r.id,name:r.name,section:r.section,role:r.role||"",salary:Number(r.salary),absentDays:Number(r.absent_days),loan:Number(r.loan),loanNote:r.loan_note||"",brokerFee:Number(r.broker_fee),otherDeduction:Number(r.other_deduction),otherNote:r.other_note||"",active:r.active,hireDate:r.hire_date,dayOff:r.day_off??null,onLeave:!!r.on_leave});
const dbCust=r=>({id:r.id,name:r.name,phone:r.phone,totalVisits:Number(r.total_visits)});
const dbVis=r=>({id:r.id,date:(r.date||'').slice(0,10),queue:r.queue,customerId:r.customer_id,name:r.name,payerName:r.payer_name,phone:r.phone,groupId:r.group_id,groupName:r.group_name||"",services:r.services||[],totalService:Number(r.total_service),totalPaid:Number(r.total_paid),paymentMethod:r.payment_method||"",tips:r.tips||[],status:r.status,note:r.note||"",registeredAt:r.registered_at||r.created_at||null});
const dbExp=r=>({id:r.id,date:r.date,type:r.type,name:r.name,reason:r.reason||"",qty:Number(r.qty),unit:Number(r.unit),total:Number(r.total)});
const dbBk=r=>({id:r.id,date:(r.date||'').trim().slice(0,10),time:(r.time||'00:00').slice(0,5),customerId:r.customer_id,customerName:r.customer_name,customerPhone:r.customer_phone,serviceId:Number(r.service_id),serviceName:r.service_name,serviceCategory:r.service_category,durationMins:Number(r.duration_mins||60),people:r.people||1,notes:r.notes||"",status:r.status,createdBy:r.created_by||"",visitId:r.visit_id||null});
const dbStaff=r=>({id:r.id,name:r.name,role:r.role,password:r.password,active:r.active});
function useW(){const[w,setW]=useState(window.innerWidth);useEffect(()=>{const h=()=>setW(window.innerWidth);window.addEventListener("resize",h);return()=>window.removeEventListener("resize",h);},[]);return{mob:w<640};}
function Notifs({items,dismiss}){if(!items.length)return null;return <div style={{position:"fixed",top:0,left:0,right:0,zIndex:9999,padding:8,pointerEvents:"none",display:"flex",flexDirection:"column",gap:4}}>{items.map(n=><div key={n.id} style={{background:n.type==="success"?"#166534":n.type==="booking"?"#5b21b6":n.type==="payment"?"#1e40af":n.type==="warning"?"#92400e":"#1e3a8a",color:"#fff",borderRadius:12,padding:"11px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",boxShadow:"0 4px 20px rgba(0,0,0,0.3)",pointerEvents:"all",maxWidth:460,margin:"0 auto",width:"calc(100% - 16px)"}}><span style={{fontWeight:700,fontSize:13}}>{n.msg}</span><button onClick={()=>dismiss(n.id)} style={{background:"none",border:"none",color:"#fff",cursor:"pointer",fontSize:18,marginLeft:12}}>×</button></div>)}</div>;}

function EthPicker({value,onChange,label,...props}){
  // Parse current value into Ethiopian date
  const toEth=g=>g?gregToEth(g):{y:2016,m:1,d:1};
  const parsed=toEth(value);
  // nav state = what month/year is being viewed in the picker
  const[vy,setVy]=useState(parsed.y); // view year
  const[vm,setVm]=useState(parsed.m); // view month
  const[show,setShow]=useState(false);
  // Sync view to value when value changes externally
  useEffect(()=>{
    const p=toEth(value);
    setVy(p.y);setVm(p.m);
  },[value]);
  // Selected eth date (from value prop)
  const selEth=toEth(value);
  // Today in eth
  const todEth=gregToEth(todayStr());
  // Gregorian display string
  const gregStr=value
    ?new Date(value+'T12:00:00Z').toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})
    :'';
  // Days in viewed month
  const daysInMonth=vm===13?6:30;
  // Find weekday of day 1 of viewed month (Mon=0 ... Sun=6)
  const day1Greg=ethToGreg(vy,vm,1);
  const day1Dow=new Date(day1Greg+'T12:00:00Z').getDay(); // 0=Sun
  const startOffset=(day1Dow+6)%7; // convert to Mon-based (Mon=0,Sun=6)
  const DAY_LABELS=['ሰ','ማ','ረ','ሐ','ዓ','ቅ','እ'];
  function prevMonth(){
    if(vm===1){setVm(13);setVy(vy-1);}
    else setVm(vm-1);
  }
  function nextMonth(){
    if(vm===13){setVm(1);setVy(vy+1);}
    else setVm(vm+1);
  }
  function pickDay(d){
    const g=ethToGreg(vy,vm,d);
    if(props.minDate&&g<props.minDate)return;
    onChange(g);
    setShow(false);
  }
  // Close picker when clicking outside
  const ref=React.useRef(null);
  useEffect(()=>{
    if(!show)return;
    function handler(e){if(ref.current&&!ref.current.contains(e.target))setShow(false);}
    document.addEventListener('mousedown',handler);
    return()=>document.removeEventListener('mousedown',handler);
  },[show]);
  return(
    <div ref={ref} style={{position:'relative',marginBottom:8}}>
      {label&&<p style={{margin:'0 0 4px',fontSize:12,fontWeight:700,color:'#374151'}}>{label}</p>}
      {/* Trigger button */}
      <button type="button" onClick={()=>setShow(v=>!v)}
        style={{width:'100%',padding:'11px 14px',borderRadius:12,border:'1px solid #e5e7eb',
          background:'#fff',cursor:'pointer',textAlign:'left',
          boxShadow:'0 1px 3px rgba(0,0,0,0.06)',display:'block'}}>
        <div style={{fontSize:15,fontWeight:800,color:'#111827'}}>
          {ETH_MONTHS[(selEth.m||1)-1]} {selEth.d}, {selEth.y}
        </div>
        <div style={{fontSize:11,color:'#6b7280',marginTop:1}}>{gregStr}</div>
      </button>
      {/* Dropdown */}
      {show&&(
        <div style={{position:'absolute',top:'105%',left:0,zIndex:1000,background:'#fff',
          borderRadius:16,boxShadow:'0 12px 40px rgba(0,0,0,0.2)',minWidth:300,
          marginTop:4,overflow:'hidden',border:'1px solid #e5e7eb'}}>
          {/* Blue header with year + month + nav */}
          <div style={{background:'#1d4ed8',padding:'14px 16px 12px'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <button onClick={prevMonth}
                style={{background:'rgba(255,255,255,0.2)',border:'none',color:'#fff',
                  cursor:'pointer',fontSize:20,width:34,height:34,borderRadius:8,
                  display:'flex',alignItems:'center',justifyContent:'center',fontWeight:900}}>‹</button>
              <div style={{textAlign:'center'}}>
                <div style={{color:'rgba(255,255,255,0.7)',fontSize:11,fontWeight:600,letterSpacing:1}}>{vy}</div>
                <div style={{color:'#fff',fontSize:20,fontWeight:900}}>{ETH_MONTHS[(vm||1)-1]}</div>
              </div>
              <button onClick={nextMonth}
                style={{background:'rgba(255,255,255,0.2)',border:'none',color:'#fff',
                  cursor:'pointer',fontSize:20,width:34,height:34,borderRadius:8,
                  display:'flex',alignItems:'center',justifyContent:'center',fontWeight:900}}>›</button>
            </div>
          </div>
          {/* Day headers Mon-Sun */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',background:'#f8fafc',
            borderBottom:'1px solid #f1f5f9'}}>
            {DAY_LABELS.map(d=>(
              <div key={d} style={{textAlign:'center',fontSize:10,fontWeight:800,
                color:'#6b7280',padding:'7px 2px'}}>{d}</div>
            ))}
          </div>
          {/* Day grid */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',
            gap:2,padding:'8px 8px 4px'}}>
            {/* Empty offset cells */}
            {Array.from({length:startOffset}).map((_,i)=><div key={'x'+i}/>)}
            {/* Day buttons */}
            {Array.from({length:daysInMonth},(_,i)=>i+1).map(d=>{
              const g=ethToGreg(vy,vm,d);
              const isPast=!!(props.minDate&&g<props.minDate);
              const isSel=d===selEth.d&&vm===selEth.m&&vy===selEth.y;
              const isT=d===todEth.d&&vm===todEth.m&&vy===todEth.y;
              return(
                <button key={d}
                  onClick={()=>!isPast&&pickDay(d)}
                  style={{
                    padding:'7px 2px',borderRadius:8,border:'none',
                    background:isSel?'#1d4ed8':isT?'#dbeafe':'transparent',
                    fontWeight:isSel||isT?700:400,
                    cursor:isPast?'default':'pointer',
                    fontSize:13,
                    color:isSel?'#fff':isPast?'#d1d5db':isT?'#1d4ed8':'#111827',
                    opacity:isPast?0.4:1,
                  }}>{d}</button>
              );
            })}
          </div>
          {/* Footer: gregorian + year/month jump */}
          <div style={{borderTop:'1px solid #f1f5f9',padding:'8px 12px',
            display:'flex',justifyContent:'space-between',alignItems:'center',
            background:'#fafafa'}}>
            <span style={{fontSize:11,color:'#6b7280',fontStyle:'italic'}}>{gregStr||'No date selected'}</span>
            <div style={{display:'flex',gap:4,alignItems:'center'}}>
              <button onClick={()=>setVy(vy-1)}
                style={{padding:'2px 7px',border:'1px solid #e5e7eb',borderRadius:5,
                  background:'#fff',cursor:'pointer',fontSize:12,color:'#374151',fontWeight:700}}>−</button>
              <span style={{fontSize:12,fontWeight:700,color:'#374151',minWidth:36,textAlign:'center'}}>{vy}</span>
              <button onClick={()=>setVy(vy+1)}
                style={{padding:'2px 7px',border:'1px solid #e5e7eb',borderRadius:5,
                  background:'#fff',cursor:'pointer',fontSize:12,color:'#374151',fontWeight:700}}>+</button>
              <select value={vm} onChange={e=>setVm(Number(e.target.value))}
                style={{padding:'3px 5px',borderRadius:6,border:'1px solid #e5e7eb',
                  fontSize:11,color:'#111827',background:'#fff',marginLeft:4}}>
                {ETH_MONTHS.map((m,i)=><option key={i} value={i+1}>{m}</option>)}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


// ── Language strings ─────────────────────────────────────────
const LANG={
  en:{
    reception:"Reception",supervisor:"Supervisor",checkout:"Checkout",
    bookings:"Bookings",serviceSetup:"Service Setup",dailyClosing:"Daily Closing",
    expenses:"Expenses",customers:"Customers",payroll:"Payroll",
    dashboard:"Dashboard",staff:"Staff",activityLog:"Activity Log",
    handover:"Handover",designEditor:"Design Editor",
    registerCustomer:"Register Customer",phone:"Phone",name:"Name",
    numberOfPeople:"Number of People",note:"Note",
    registerBtn:"Register & Give Queue Number",
    quickExpense:"Quick Daily Expense",itemName:"Item name",qty:"Qty",
    unitPrice:"Unit price",saveExpense:"Save Expense",
    recall:"Recall",todaysQueue:"Today's Queue",cancel:"Cancel",
    queueOverview:"Queue Overview",waiting:"Waiting",activeServices:"Active Services",
    noOneWaiting:"No one waiting.",addService:"+ Add Service",
    markReady:"✓ Mark Ready for Payment",reopen:"Reopen",
    selectService:"Select a service...",selectCategory:"Category",
    selectSub:"Sub-category",removeService:"Remove",
    whoDidIt:"Who Did It?",preferred:"Preferred",status:"Status",
    inProgress:"In Progress",completed:"Completed",cancelled:"Cancelled",
    onHold:"On Hold",totalIncome:"Total Income",
    checkoutToday:"Checkout — Today",searchCheckout:"Search by queue #, name or phone...",
    tips:"Tips",tipsNote:"Tips go directly to employees, not counted as revenue.",
    selectEmployee:"Select employee",amount:"Amount (Birr)",addTip:"+ Add Tip",
    paymentMethod:"Payment Method",cash:"Cash",transfer:"Transfer",
    telebirr:"Telebirr",card:"Card",serviceTotal:"Service Total",
    tipsTotal:"Tips Total",customerPays:"Customer Pays",
    confirmPaid:"✓ Confirm Paid & Close",payTogether:"Pay Together — Whole Group",
    splitPayment:"Split Payment — Each Pays Their Own",
    printReceipt:"🖨️ Print Receipt",
    bookingMgmt:"Booking Management",newBooking:"+ New Booking",
    spaWalkIn:"🚶 Spa Walk-in",customerName:"Customer Name",
    selectSpaService:"— Select a spa service —",
    dateRequired:"Date *",timeRequired:"Time *",people:"Number of People",
    notes:"Notes / Special Requests",saveBooking:"Save Booking",
    confirmBooking:"Confirm",checkIn:"Check In",markDone:"Mark Done",
    noShow:"No-show",editBooking:"Edit",deleteBooking:"Delete",
    upcoming7:"Upcoming 7 Days",available:"Available",continuing:"↑ Continuing from above",
    refresh:"🔄 Refresh",
    waitingForSupervisor:"Waiting for Supervisor",withSupervisor:"With Supervisor",
    inService:"In Service",readyForPayment:"Ready for Payment",
    paidClosed:"Paid & Closed",pending:"Pending",confirmed:"Confirmed",
    arrived:"Arrived",noshow:"No-show",
    payrollMgmt:"Payroll Management",currentPeriod:"Current pay period",
    closePayPeriod:"Close & Pay Period",addEmployee:"Add Employee",
    baseSalary:"Base Salary",absentDays:"Absent Days",loan:"Loan",
    brokerFee:"Broker Fee",otherDeduction:"Other Deduction",commission:"Commission",
    netPay:"Net Pay",deactivate:"Deactivate",reactivate:"Reactivate",
    weeklyDayOff:"Weekly Day Off",noFixedDayOff:"No fixed day off",
    onLeave:"On Leave",available2:"Available",closedPeriods:"Closed Periods",
    breakdown:"Breakdown",todayAvailability:"Today's Availability",
    dashboard2:"Manager Dashboard",viewingDate:"Viewing Date",
    today:"Today",dateRange:"Date Range",from:"From",to:"To",
    customersServed:"Customers Served",totalVisits:"Total Visits",
    activeEmployees:"Active Employees",revenue:"Revenue",
    transferCard:"Transfer/Card",tipsDash:"Tips",
    commissionPeriod:"Commission This Period",revenueByCategory:"Revenue by Category",
    employeePerformance:"Employee Performance This Period",
    dailyTarget:"Daily Revenue Target",setTarget:"Set target (Birr)",
    targetReached:"🎉 Target reached!",
    staffMgmt:"Staff & Password Management",username:"Username",
    displayName:"Display Name",role:"Role",password:"Password",
    newPassword:"New Password",saveAccount:"Save Account",updateAccount:"Update Account",
    allStaff:"All Staff",editResetPW:"Edit / Reset PW",
    activityLog2:"Activity Log",last100:"Last 100 actions across all staff.",
    handoverLog:"Shift Handover Log",handoverNote:"Handover Note",
    saveNote:"Save Handover Note",recentNotes:"Recent Handover Notes",
    saving:"Saving...",offline:"⚠ Offline — changes will not save",
    backOnline:"Back online",todayNext:"TODAY NEXT",logout:"Logout",
    login:"Login",loginTitle:"Staff Login",
    sessionLocked:"Session Locked",unlock:"Unlock",
    logoutInstead:"Log out instead",loading:"Loading Ambar Spa...",
    noData:"No data.",none:"None",free:"Free",discount:"Discount",
    yes:"Yes",no:"No",save:"Save",edit:"Edit",delete:"Delete",
    add:"Add",close:"Close",print:"Print",exportCSV:"⬇ Export CSV",
    search:"Search",clear:"Clear",next:"Next up",position:"Position",
    inProgressBadge:"IN PROGRESS",upNext:"UP NEXT",onHoldBadge:"HOLD",
    noCustomers:"No active customers today.",selectCustomer:"← Select customer to process payment.",
    selectCustomerSup:"← Select a customer to assign services.",
    serviceLine:"Service Line",serviceAdded:"Service added",
    readyConfirm:"Ready for checkout.",groupPayOptions:"Group Payment Options",
    individualPayments:"Individual Payments",totalInSystem:"total bookings in system",
    activeBookings:"active booking",allServices:"All Services",
    addCategory:"+ Add",newService:"Add New Service",designEditorTitle:"Design Editor — Colors & Labels",
    colorSettings:"Colors",labelSettings:"Button & Label Names",livePreview:"Live Preview",
    resetDefault:"Reset to Default",primaryButton:"Primary Button",secondaryButton:"Secondary Button",
    headerColor:"Header Color",accentColor:"Accent Color",
  },
  am:{
    reception:"ተቀባይ",supervisor:"ሱፐርቫይዘር",checkout:"ክፍያ",
    bookings:"ቦኪንግ",serviceSetup:"አገልግሎቶች",dailyClosing:"የዕለት ዝግ",
    expenses:"ወጪዎች",customers:"ደንበኞች",payroll:"ደሞዝ",
    dashboard:"ዳሽቦርድ",staff:"ሰራተኞች",activityLog:"ምዝገባ",
    handover:"ፈረቃ ማሸጋገሪያ",designEditor:"ዲዛይን አርታዒ",
    registerCustomer:"ደንበኛ መመዝገብ",phone:"ስልክ",name:"ስም",
    numberOfPeople:"የሰዎች ቁጥር",note:"ማስታወሻ",
    registerBtn:"ምዝገባ & ወረፋ ቁጥር ስጥ",
    quickExpense:"ፈጣን ወጪ",itemName:"የእቃ ስም",qty:"መጠን",
    unitPrice:"የአንድ ዋጋ",saveExpense:"ወጪ አስቀምጥ",
    recall:"ፈልግ",todaysQueue:"የዛሬ ወረፋ",cancel:"ሰርዝ",
    queueOverview:"የወረፋ እይታ",waiting:"እየጠበቀ",activeServices:"ንቁ አገልግሎቶች",
    noOneWaiting:"የሚጠብቅ የለም።",addService:"+ አገልግሎት ጨምር",
    markReady:"✓ ለክፍያ ዝግጁ አድርግ",reopen:"እንደገና ክፈት",
    selectService:"አገልግሎት ምረጥ...",selectCategory:"ምድብ",
    selectSub:"ንዑስ ምድብ",removeService:"አስወግድ",
    whoDidIt:"ማን ሰራው?",preferred:"የሚፈለግ",status:"ሁኔታ",
    inProgress:"በሂደት ላይ",completed:"ተጠናቋል",cancelled:"ተሰርዟል",
    onHold:"በእቆያ",totalIncome:"ጠቅላላ ገቢ",
    checkoutToday:"ክፍያ — ዛሬ",searchCheckout:"በወረፋ # ፣ ስም ወይም ስልክ ፈልግ...",
    tips:"ጠቆሚያ",tipsNote:"ጠቆሚያ ለሰራተኞች ቀጥታ ይሄዳል፣ ገቢ አይቆጠርም።",
    selectEmployee:"ሰራተኛ ምረጥ",amount:"መጠን (ብር)",addTip:"+ ጠቆሚያ ጨምር",
    paymentMethod:"የክፍያ ዘዴ",cash:"ጥሬ ገንዘብ",transfer:"ዝውውር",
    telebirr:"ቴሌብር",card:"ካርድ",serviceTotal:"የአገልግሎት ድምር",
    tipsTotal:"የጠቆሚያ ድምር",customerPays:"ደንበኛ ይከፍላል",
    confirmPaid:"✓ ተከፍሏል & ዝጋ",payTogether:"ሁሉም አብሮ ይክፈሉ",
    splitPayment:"ክፍፍል ክፍያ — እያንዳንዱ ለራሱ",
    printReceipt:"🖨️ ደረሰኝ አትም",
    bookingMgmt:"የቦኪንግ አስተዳደር",newBooking:"+ አዲስ ቦኪንግ",
    spaWalkIn:"🚶 ስፓ ዎክ-ኢን",customerName:"የደንበኛ ስም",
    selectSpaService:"— የስፓ አገልግሎት ምረጥ —",
    dateRequired:"ቀን *",timeRequired:"ሰዓት *",people:"የሰዎች ቁጥር",
    notes:"ማስታወሻ / ልዩ ጥያቄዎች",saveBooking:"ቦኪንግ አስቀምጥ",
    confirmBooking:"አረጋግጥ",checkIn:"ቼክ ኢን",markDone:"ተጠናቋል",
    noShow:"አልመጣም",editBooking:"አርትዕ",deleteBooking:"ሰርዝ",
    upcoming7:"የሚቀጥሉ 7 ቀናት",available:"ባዶ",continuing:"↑ ቀጥሏል",
    refresh:"🔄 አድስ",
    waitingForSupervisor:"ሱፐርቫይዘርን እየጠበቀ",withSupervisor:"ከሱፐርቫይዘር ጋር",
    inService:"አገልግሎት ላይ",readyForPayment:"ለክፍያ ዝግጁ",
    paidClosed:"ተከፍሏል & ተዘግቷል",pending:"በመጠባበቅ",confirmed:"ተረጋግጧል",
    arrived:"ደርሷል",noshow:"አልመጣም",
    payrollMgmt:"የደሞዝ አስተዳደር",currentPeriod:"የአሁን የደሞዝ ወቅት",
    closePayPeriod:"ወቅቱን ዝጋ & ክፈል",addEmployee:"ሰራተኛ ጨምር",
    baseSalary:"መሰረታዊ ደሞዝ",absentDays:"የቀሩ ቀናት",loan:"ብድር",
    brokerFee:"የደላላ ክፍያ",otherDeduction:"ሌላ ቅናሽ",commission:"ኮሚሽን",
    netPay:"ተጣራ ክፍያ",deactivate:"አቦዝን",reactivate:"እንደገና አንቃ",
    weeklyDayOff:"ሳምንታዊ የዕረፍት ቀን",noFixedDayOff:"ቋሚ የዕረፍት ቀን የለም",
    onLeave:"በፈቃድ ላይ",available2:"ዝግጁ",closedPeriods:"የተዘጉ ወቅቶች",
    breakdown:"ዝርዝር",todayAvailability:"የዛሬ ቅርበት",
    dashboard2:"የአስተዳዳሪ ዳሽቦርድ",viewingDate:"የሚታይ ቀን",
    today:"ዛሬ",dateRange:"የቀን ክልል",from:"ከ",to:"እስከ",
    customersServed:"የተስተናገዱ ደንበኞች",totalVisits:"ጠቅላላ ጉብኝቶች",
    activeEmployees:"ንቁ ሰራተኞች",revenue:"ገቢ",
    transferCard:"ዝውውር/ካርድ",tipsDash:"ጠቆሚያ",
    commissionPeriod:"የዚህ ወቅት ኮሚሽን",revenueByCategory:"ገቢ በምድብ",
    employeePerformance:"የሰራተኛ አፈጻጸም",
    dailyTarget:"የዕለት ገቢ ኢላማ",setTarget:"ኢላማ አስቀምጥ (ብር)",
    targetReached:"🎉 ኢላማ ተደርሷል!",
    staffMgmt:"የሰራተኞች & የይለፍ ቃል",username:"የተጠቃሚ ስም",
    displayName:"የሚታይ ስም",role:"ሚና",password:"የይለፍ ቃል",
    newPassword:"አዲስ የይለፍ ቃል",saveAccount:"መለያ አስቀምጥ",updateAccount:"መለያ አዘምን",
    allStaff:"ሁሉም ሰራተኞች",editResetPW:"አርትዕ / ዳግም ቀይር",
    activityLog2:"የአቀባበል ምዝገባ",last100:"የመጨረሻ 100 እርምጃዎች።",
    handoverLog:"የፈረቃ ማሸጋገሪያ",handoverNote:"የማሸጋገሪያ ማስታወሻ",
    saveNote:"ማስታወሻ አስቀምጥ",recentNotes:"የቅርብ ጊዜ ማስታወሻዎች",
    saving:"እያስቀመጠ...",offline:"⚠ ኦፍላይን — ለውጦች አይቀመጡም",
    backOnline:"ኦንላይን ሆኗል",todayNext:"የዛሬ ቀጣይ",logout:"ውጣ",
    login:"ግባ",loginTitle:"የሰራተኛ መግቢያ",
    sessionLocked:"ክፍለ ጊዜ ተቆልፏል",unlock:"ክፈት",
    logoutInstead:"ይልቁንስ ውጣ",loading:"አምባር ስፓ እየጫነ...",
    noData:"ምንም ውሂብ የለም።",none:"ምንም",free:"ነፃ",discount:"ቅናሽ",
    yes:"አዎ",no:"አይ",save:"አስቀምጥ",edit:"አርትዕ",delete:"ሰርዝ",
    add:"ጨምር",close:"ዝጋ",print:"አትም",exportCSV:"⬇ CSV ላክ",
    search:"ፈልግ",clear:"አጽዳ",next:"ቀጣይ",position:"ቦታ",
    inProgressBadge:"በሂደት",upNext:"ቀጥሎ",onHoldBadge:"በእቆያ",
    noCustomers:"የዛሬ ንቁ ደንበኞች የሉም።",selectCustomer:"← ደንበኛ ምረጥ።",
    selectCustomerSup:"← ደንበኛ ምረጥ።",
    serviceLine:"አገልግሎት",serviceAdded:"አገልግሎት ተጨምሯል",
    readyConfirm:"ለክፍያ ዝግጁ።",groupPayOptions:"የቡድን ክፍያ አማራጮች",
    individualPayments:"ግለሰባዊ ክፍያዎች",totalInSystem:"ቦኪንጎች በስርዓቱ ውስጥ",
    activeBookings:"ንቁ ቦኪንግ",allServices:"ሁሉም አገልግሎቶች",
    addCategory:"+ ጨምር",newService:"አዲስ አገልግሎት ጨምር",designEditorTitle:"ዲዛይን አርታዒ",
    colorSettings:"ቀለሞች",labelSettings:"የቁልፍ & መለያ ስሞች",livePreview:"የቀጥታ ቅድሚያ",
    resetDefault:"ወደ ነባሪ ዳግም አስጀምር",primaryButton:"ዋና ቁልፍ",secondaryButton:"ሁለተኛ ቁልፍ",
    headerColor:"የርዕስ ቀለም",accentColor:"የማጉላ ቀለም",
  }
};

// ── Password hashing using Web Crypto ─────────────────────────
async function hashPW(pw){
  const enc=new TextEncoder();
  const buf=await crypto.subtle.digest('SHA-256',enc.encode(pw+'ambar2024salt'));
  return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,'0')).join('');
}
async function checkPW(pw,hash){
  // Support plain text passwords during migration
  if(!hash||hash.length<20)return pw===hash;
  const h=await hashPW(pw);return h===hash;
}

class ErrorBoundary extends React.Component{
  constructor(props){super(props);this.state={hasError:false,error:null};}
  static getDerivedStateFromError(e){return{hasError:true,error:e};}
  componentDidCatch(e,info){console.error("App Error:",e,info);}
  render(){
    if(this.state.hasError)return(
      <div style={{padding:40,textAlign:"center",fontFamily:"Arial"}}>
        <h2 style={{color:"#dc2626"}}>Something went wrong</h2>
        <p style={{color:"#6b7280",marginBottom:16}}>{this.state.error?.message||"Unknown error"}</p>
        <button onClick={()=>this.setState({hasError:false,error:null})}
          style={{padding:"10px 24px",borderRadius:10,border:"none",background:"#111827",color:"#e0b85a",fontWeight:700,cursor:"pointer"}}>
          Try Again
        </button>
      </div>
    );
    return this.props.children;
  }
}
export default function App(){
  const sc=useW();
  // Language
  const[lang,setLang]=useState(()=>{try{return localStorage.getItem("ambar_lang")||"en";}catch{return"en";}});
  function t(k){return(LANG[lang]||LANG.en)[k]||LANG.en[k]||k;}
  function toggleLang(){const nl=lang==="en"?"am":"en";setLang(nl);try{localStorage.setItem("ambar_lang",nl);}catch(e){}}
  // Design settings
  const[design,setDesign]=useState(()=>{try{const d=localStorage.getItem("ambar_design");return d?JSON.parse(d):{primaryBg:"#111827",primaryText:"#e0b85a",accentBg:"#e0b85a",accentText:"#111827",cardBg:"#ffffff",headerBg:"#111827",btnPBg:"#111827",btnPText:"#e0b85a",btnSBg:"#f9fafb",btnSText:"#1f2937"};}catch{return{primaryBg:"#111827",primaryText:"#e0b85a",accentBg:"#e0b85a",accentText:"#111827",cardBg:"#ffffff",headerBg:"#111827",btnPBg:"#111827",btnPText:"#e0b85a",btnSBg:"#f9fafb",btnSText:"#1f2937"};}});
  function saveDes(d){setDesign(d);try{localStorage.setItem("ambar_design",JSON.stringify(d));}catch(e){}}
  const S={
    card:  {background:design.cardBg||"#fff",color:"#111827",borderRadius:20,padding:20,border:"1px solid #e5e7eb",boxShadow:"0 4px 16px rgba(0,0,0,0.06)",marginBottom:16},
    ct:    {margin:"0 0 14px",fontSize:18,fontWeight:900},
    sh:    {margin:"0 0 8px",fontSize:13,fontWeight:800,color:"#1f2937"},
    navL:  {color:"#e0b85a",margin:"12px 0 5px",fontSize:10,fontWeight:800,letterSpacing:1.5},
    tab:   {padding:"9px 4px",borderRadius:10,border:"1px solid #e0b85a",background:"#fff",color:"#1f2937",fontWeight:700,cursor:"pointer",fontSize:11},
    tabA:  {padding:"9px 4px",borderRadius:10,border:"none",background:"#111827",color:"#e0b85a",fontWeight:900,cursor:"pointer",fontSize:11},
    inp:   {width:"100%",boxSizing:"border-box",padding:"10px 12px",marginBottom:8,borderRadius:10,border:"1px solid #d1d5db",background:"#fff",color:"#111827",fontSize:13,WebkitAppearance:"auto"},
    ii:    {padding:"5px 7px",borderRadius:7,border:"1px solid #d1d5db",background:"#fff",color:"#111827",fontSize:12,width:"100%",boxSizing:"border-box",WebkitAppearance:"auto"},
    ta:    {width:"100%",boxSizing:"border-box",padding:"9px 12px",marginBottom:8,borderRadius:10,border:"1px solid #d1d5db",background:"#fff",color:"#111827",minHeight:60,fontSize:13},
    r2:    {display:"grid",gridTemplateColumns:"1fr 1fr",gap:8},
    btnP:  {width:"100%",padding:12,borderRadius:11,border:0,background:design.btnPBg||"#111827",color:design.btnPText||"#e0b85a",fontWeight:900,cursor:"pointer",fontSize:13,marginBottom:6},
    btnS:  {width:"100%",padding:10,borderRadius:11,border:"1px solid #d1d5db",background:design.btnSBg||"#f9fafb",color:design.btnSText||"#1f2937",fontWeight:700,cursor:"pointer",marginBottom:6,fontSize:12},
    btnD:  {padding:"5px 11px",borderRadius:7,border:0,background:"#ffe3de",color:"#8a1f12",fontWeight:800,cursor:"pointer",fontSize:11},
    navBtn:{padding:"4px 10px",borderRadius:7,border:"1px solid #e5e7eb",background:"#fff",color:"#111827",cursor:"pointer",fontWeight:700,fontSize:14},
    li:    {display:"flex",justifyContent:"space-between",gap:8,alignItems:"center",background:"#fff",border:"1px solid #e5e7eb",color:"#111827",borderRadius:11,padding:"10px 14px",marginBottom:6},
    liB:   {display:"flex",justifyContent:"space-between",gap:8,alignItems:"center",background:"#fff",border:"1px solid #e5e7eb",color:"#111827",borderRadius:11,padding:"10px 14px",marginBottom:6,width:"100%",cursor:"pointer",textAlign:"left"},
    liA:   {display:"flex",justifyContent:"space-between",gap:8,alignItems:"center",background:"#111827",border:"none",color:"#e0b85a",borderRadius:11,padding:"10px 14px",marginBottom:6,width:"100%",cursor:"pointer",fontWeight:900,textAlign:"left"},
    tb:    {display:"flex",justifyContent:"space-between",alignItems:"center",background:"#111827",color:"#e0b85a",padding:"11px 16px",borderRadius:11,marginTop:8,gap:8},
    hlp:   {color:"#4b5563",fontSize:11,margin:"2px 0"},
    lbl:   {margin:"0 0 4px",fontSize:13,fontWeight:700,color:"#1f2937"},
  };
  const[user,setUser]=useState(()=>{try{return JSON.parse(sessionStorage.getItem("ambar_u"))||null;}catch{return null;}});
  const[lid,setLid]=useState("");const[lpw,setLpw]=useState("");const[lerr,setLerr]=useState("");
  const[staff,setStaff]=useState(DEFAULT_STAFF);
  const[loading,setLoading]=useState(true);const[saving,setSaving]=useState(false);const[offline,setOffline]=useState(!navigator.onLine);
  const[offlineQueue,setOfflineQueue]=useState([]);
  const offlineQRef=React.useRef([]);
  const[tab,setTab]=useState("");const[mobNav,setMobNav]=useState(false);
  const[notifs,setNotifs]=useState([]);const nid=useRef(0);
  const[pinLocked,setPinLocked]=useState(false);const[pinInput,setPinInput]=useState("");const[pinErr,setPinErr]=useState("");
  const idleRef=useRef(null);
  const[cats,setCats]=useState(DC);const[svcs,setSvcs]=useState(FULL_SERVICES);
  const[emps,setEmps]=useState(DEFAULT_EMPLOYEES);const[custs,setCusts]=useState([]);
  const[visits,setVisits]=useState([]);const[exps,setExps]=useState([]);
  const[periods,setPeriods]=useState([]);const[bks,setBks]=useState([]);const[actLog,setActLog]=useState([]);
  const[actId,setActId]=useState(null);
  const[svCat,setSvCat]=useState(DC[0]);const[svSub,setSvSub]=useState("All");const[svSvcId,setSvSvcId]=useState("");
  const[coQ,setCoQ]=useState("");const[payM,setPayM]=useState("Cash");
  const[tipEmp,setTipEmp]=useState("");const[tipAmt,setTipAmt]=useState("");const[tips,setTips]=useState([]);
  const[showRefund,setShowRefund]=useState(false);const[refundAmt,setRefundAmt]=useState("");const[refundReason,setRefundReason]=useState("");
  const[splitMode,setSplitMode]=useState(false);const[splitPayments,setSplitPayments]=useState([]);
  const[confirmDlg,setConfirmDlg]=useState(null); // {msg,onOk,danger}
  function confirm2(msg,onOk,danger=false){setConfirmDlg({msg,onOk,danger});}
  const[rName,setRName]=useState("");const[rPhone,setRPhone]=useState("");const[rPpl,setRPpl]=useState(1);const[rNote,setRNote]=useState("");const[rmsg,setRmsg]=useState("");
  const[deItem,setDeItem]=useState("");const[deQty,setDeQty]=useState(1);const[deUnit,setDeUnit]=useState("");
  const[gDate,setGDate]=useState(todayStr());const[gName,setGName]=useState("");const[gRsn,setGRsn]=useState("");const[gAmt,setGAmt]=useState("");const[gCat,setGCat]=useState("Operations");
  const EXP_CATS=["Operations","Utilities","Supplies","Salon Products","Marketing","Staff","Maintenance","Other"];
  const[inventory,setInventory]=useState(()=>{try{return JSON.parse(localStorage.getItem("ambar_inv")||"[]");}catch{return[];}});
  const[nInv,setNInv]=useState({name:"",category:"Salon Products",qty:"",unit:"pcs",minQty:"",price:""});
  function saveInv(inv){setInventory(inv);try{localStorage.setItem("ambar_inv",JSON.stringify(inv));}catch(e){}}
  function addInvItem(){if(!nInv.name||!nInv.qty)return alert("Enter item name and quantity.");const item={id:Date.now(),...nInv,qty:Number(nInv.qty),minQty:Number(nInv.minQty)||0,price:Number(nInv.price)||0};saveInv([...inventory,item]);setNInv({name:"",category:"Salon Products",qty:"",unit:"pcs",minQty:"",price:""});}
  function updInvQty(id,delta){saveInv(inventory.map(i=>i.id===id?{...i,qty:Math.max(0,i.qty+delta)}:i));}
  function delInvItem(id){confirm2("Remove this inventory item?",()=>saveInv(inventory.filter(i=>i.id!==id)),true);}
  const INV_CATS=["Salon Products","Cleaning","Consumables","Equipment","Other"];
  const lowStock=inventory.filter(i=>i.qty<=i.minQty&&i.minQty>0);
  const[newCat,setNewCat]=useState("");
  const[nSvc,setNSvc]=useState({category:DC[0],sub:"",name:"",price:"",commission:0,employeeSection:EMP_SECTIONS[0],bookable:false,durationMins:60});
  const[svcF,setSvcF]=useState("All");
  const[nEmp,setNEmp]=useState({name:"",section:EMP_SECTIONS[0]||DC[0],role:"",salary:"",hireDate:todayStr()});
  const[showFired,setShowFired]=useState(false);const[cSearch,setCSearch]=useState("");const[clDate,setClDate]=useState(todayStr());
  const[dashDate,setDashDate]=useState(todayStr());const[dashRange,setDashRange]=useState(false);const[dashFrom,setDashFrom]=useState(todayStr());const[dashTo,setDashTo]=useState(todayStr());
  const[bkDate,setBkDate]=useState(todayStr());const[showBkF,setShowBkF]=useState(false);const[editBk,setEditBk]=useState(null);
  const[bkF,setBkF]=useState({customerName:"",customerPhone:"",serviceId:"",date:todayStr(),time:"10:00",people:1,notes:""});
  const[bkWarn,setBkWarn]=useState("");const[bkSearch,setBkSearch]=useState("");
  const[showWalkIn,setShowWalkIn]=useState(false);
  const[wiSvcId,setWiSvcId]=useState("");const[wiName,setWiName]=useState("");const[wiPhone,setWiPhone]=useState("");const[wiNote,setWiNote]=useState("");
  const[nStaff,setNStaff]=useState({id:"",name:"",role:"reception",password:""});const[editStaff,setEditStaff]=useState(null);
  const[handoverNote,setHandoverNote]=useState("");const[handoverLog,setHandoverLog]=useState([]);
  const[dailyTarget,setDailyTarget]=useState(()=>{try{return Number(localStorage.getItem("ambar_target")||0);}catch{return 0;}});
  const dRef=useRef({});const eRef=useRef({});const undoRef=useRef({});

  function push(msg,type="info"){const id=++nid.current;setNotifs(p=>[...p,{id,msg,type}]);chime(type);setTimeout(()=>setNotifs(p=>p.filter(n=>n.id!==id)),7000);}
  function dismiss(id){setNotifs(p=>p.filter(n=>n.id!==id));}
  function resetIdle(){clearTimeout(idleRef.current);idleRef.current=setTimeout(()=>setPinLocked(true),30*60*1000);}
  useEffect(()=>{if(!user)return;const evs=["mousemove","keydown","click","touchstart"];evs.forEach(e=>window.addEventListener(e,resetIdle));resetIdle();return()=>{clearTimeout(idleRef.current);evs.forEach(e=>window.removeEventListener(e,resetIdle));};},[user]);
  function unlockPin(){const f=staff.find(s=>s.id===user.id&&s.password===pinInput);if(f){setPinLocked(false);setPinInput("");setPinErr("");}else setPinErr("Wrong password.");}
  useEffect(()=>{const on=()=>{setOffline(false);push("Back online — syncing...","success");
      const q=[...offlineQRef.current];
      offlineQRef.current=[];setOfflineQueue([]);
      for(const action of q){try{await action();}catch(e){console.error(e);}}
      if(q.length>0)push(q.length+" action(s) synced","success");};const off=()=>{setOffline(true);push("Offline — changes will not save","warning");};window.addEventListener("online",on);window.addEventListener("offline",off);return()=>{window.removeEventListener("online",on);window.removeEventListener("offline",off);};},[]);

  // ── Notification system ──────────────────────────────────
  useEffect(()=>{
    if(!user)return;
    const role=user.role;
    const notifInterval=setInterval(()=>{
      const now=new Date();
      const nowStr=String(now.getHours()).padStart(2,"0")+":"+String(now.getMinutes()).padStart(2,"0");
      // Reception: booking reminder 30 min before
      if(role==="reception"||role==="manager"){
        const in30=new Date(now.getTime()+30*60000);
        const in30Str=String(in30.getHours()).padStart(2,"0")+":"+String(in30.getMinutes()).padStart(2,"0");
        const upcoming=bks.filter(b=>b.date===todayStr()&&b.time===in30Str&&["Pending","Confirmed"].includes(b.status));
        upcoming.forEach(b=>{
          push("📅 Booking in 30 min: "+b.customerName+" — "+b.serviceName,"booking");
          nativePush("📅 Booking Reminder",b.customerName+" — "+b.serviceName+" at "+b.time,"booking-"+b.id);
        });
      }
    },60000);
    return()=>clearInterval(notifInterval);
  },[user,bks]);

  // ── PWA Service Worker + Push Notifications ─────────────────
  useEffect(()=>{
    if(!('serviceWorker' in navigator))return;
    navigator.serviceWorker.register('/sw.js')
      .then(reg=>{
        console.log('SW registered');
        // Listen for sync complete messages
        navigator.serviceWorker.addEventListener('message',e=>{
          if(e.data?.type==='SYNC_COMPLETE')push("Data synced","success");
        });
      })
      .catch(e=>console.log('SW failed:',e));
  },[]);

  // Notification permission state
  const[notifPerm,setNotifPerm]=useState(()=>{
    try{return typeof Notification!=="undefined"?Notification.permission:"unsupported";}
    catch{return"unsupported";}
  });
  async function requestNotifPerm(){
    if(typeof Notification==="undefined"){push("Notifications not supported on this browser","warning");return;}
    try{
      const result=await Notification.requestPermission();
      setNotifPerm(result);
      if(result==="granted"){
        push("✅ Notifications enabled!","success");
        // Send a test notification
        nativePush("✅ Ambar Spa Notifications","You will now receive alerts for bookings and payments.","test");
      } else {
        push("Notifications blocked. Enable in phone Settings → Safari → "+window.location.hostname,"warning");
      }
    }catch(e){
      push("Could not request permission: "+e.message,"warning");
    }
  }

  // Send native push notification (works when app is minimized)
  function nativePush(title,body,tag='ambar'){
    if(!('Notification' in window))return;
    if(Notification.permission!=='granted')return;
    if(navigator.serviceWorker.controller){
      navigator.serviceWorker.ready.then(reg=>{
        reg.showNotification(title,{
          body,
          icon:'/icon-192.png',
          badge:'/icon-192.png',
          tag,
          vibrate:[200,100,200],
          renotify:true,
        });
      });
    } else {
      // Fallback direct notification
      new Notification(title,{body,icon:'/icon-192.png'});
    }
  }

  useEffect(()=>{
    const t=setInterval(async()=>{
      const now=new Date();
      // Auto-close stale sessions at 10PM
      if(now.getHours()>=22){
        const stale=visits.filter(v=>v.date===todayStr()&&!["Paid & Closed","Cancelled"].includes(v.status));
        for(const v of stale){await supabase.from("visits").update({status:"Cancelled",note:(v.note?v.note+" ":"")+"[Auto-closed 10PM]"}).eq("id",v.id);}
        // Generate end of day summary notification
        if(stale.length===0&&now.getHours()===22&&now.getMinutes()<2){
          const paid=visits.filter(v=>v.date===todayStr()&&v.status==="Paid & Closed");
          const rev=paid.reduce((s,v)=>s+Number(v.totalService||0),0);
          push("📊 End of Day: "+paid.length+" customers served, "+money(rev)+" revenue","success");
        }
      }
    },60000);
    return()=>clearInterval(t);
  },[visits]);

  async function loadAll(){
    setLoading(true);
    try{
      const[s1,s2,s3,s4,s5,s6,s7,s8,s9,s10]=await Promise.all([
        supabase.from("services").select("*"),supabase.from("employees").select("*"),
        supabase.from("customers").select("*"),supabase.from("visits").select("*").order("queue"),
        supabase.from("expenses").select("*"),supabase.from("closed_periods").select("*"),
        supabase.from("bookings").select("*").order("date").order("time"),
        supabase.from("staff").select("*"),supabase.from("categories").select("*"),
        supabase.from("activity_log").select("*").order("ts",{ascending:false}).limit(100),
      ]);
      if(s9.data?.length)setCats(s9.data.map(c=>c.name));
      if(s1.data?.length)setSvcs(s1.data.map(dbSvc));
      if(s2.data?.length)setEmps(s2.data.map(dbEmp));
      if(s3.data?.length)setCusts(s3.data.map(dbCust));
      if(s4.data?.length)setVisits(s4.data.map(dbVis));
      if(s5.data?.length)setExps(s5.data.map(dbExp));
      if(s6.data?.length)setPeriods(s6.data.map(p=>({period:p.period,start:p.start_date,end:p.end_date,closedAt:p.closed_at,employees:p.employees})));
      if(s7.data?.length)setBks(s7.data.map(dbBk));
      if(s8.data?.length)setStaff(s8.data.map(dbStaff));
      if(s10.data?.length)setActLog(s10.data);
    }catch(e){console.error(e);}
    setLoading(false);
  }
  useEffect(()=>{if(!user){setLoading(false);return;}loadAll();},[user]);

  useEffect(()=>{
    if(!user)return;
    const role=user.role;
    const uid=user.id+"_"+Math.random().toString(36).slice(2);
    const vs=supabase.channel("visits_"+uid)
      .on("postgres_changes",{event:"INSERT",schema:"public",table:"visits"},p=>{
        setVisits(prev=>{if(prev.find(x=>x.id===p.new.id))return prev;return[...prev,dbVis(p.new)];});
        if(role===ROLES.SUPERVISOR||role===ROLES.MANAGER){
          push("🆕 New: "+p.new.name+" #"+p.new.queue,"info");
          nativePush("🔔 New Customer",p.new.name+" #"+p.new.queue+" is waiting","queue");
        }
      })
      .on("postgres_changes",{event:"UPDATE",schema:"public",table:"visits"},p=>{
        setVisits(prev=>prev.map(x=>x.id===p.new.id?dbVis(p.new):x));
        if(role===ROLES.RECEPTION&&p.new.status==="Paid & Closed")push("✅ "+p.new.name+" paid","success");
        if((role===ROLES.RECEPTION||role===ROLES.MANAGER)&&p.new.status==="Ready for Payment")push("💳 "+p.new.name+" ready for payment","payment");
              nativePush("💳 Ready for Payment",p.new.name+" — tap to process","payment");
      })
      .on("postgres_changes",{event:"DELETE",schema:"public",table:"visits"},p=>{setVisits(prev=>prev.filter(x=>x.id!==p.old.id));})
      .subscribe();
    const bs=supabase.channel("bookings_"+uid)
      .on("postgres_changes",{event:"INSERT",schema:"public",table:"bookings"},p=>{
        setBks(prev=>{if(prev.find(x=>x.id===p.new.id))return prev;return[...prev,dbBk(p.new)];});
        if(role===ROLES.SUPERVISOR||role===ROLES.MANAGER)push("📅 Booking: "+p.new.customer_name+" at "+p.new.time,"booking");
        if(role===ROLES.RECEPTION)push("📅 Booking added: "+p.new.customer_name,"booking");
      })
      .on("postgres_changes",{event:"UPDATE",schema:"public",table:"bookings"},p=>{setBks(prev=>prev.map(x=>x.id===p.new.id?dbBk(p.new):x));})
      .on("postgres_changes",{event:"DELETE",schema:"public",table:"bookings"},p=>{setBks(prev=>prev.filter(x=>x.id!==p.old.id));})
      .subscribe();
    const es=supabase.channel("exps_"+uid)
      .on("postgres_changes",{event:"INSERT",schema:"public",table:"expenses"},p=>{setExps(prev=>{if(prev.find(x=>x.id===p.new.id))return prev;return[...prev,dbExp(p.new)];});})
      .subscribe();
    // Smart polling — only when tab is visible, every 10 seconds
    let pollInterval=null;
    function startPoll(){
      if(pollInterval)return;
      pollInterval=setInterval(()=>{
        supabase.from("visits").select("*").order("queue").then(({data})=>{if(data)setVisits(data.map(dbVis));});
        supabase.from("bookings").select("*").order("date").order("time").then(({data})=>{if(data)setBks(data.map(dbBk));});
      },10000);
    }
    function stopPoll(){clearInterval(pollInterval);pollInterval=null;}
    const onVisible=()=>document.hidden?stopPoll():startPoll();
    document.addEventListener("visibilitychange",onVisible);
    startPoll();
    return()=>{
      supabase.removeChannel(vs);supabase.removeChannel(bs);supabase.removeChannel(es);
      stopPoll();document.removeEventListener("visibilitychange",onVisible);
    };
  },[user]);

  useEffect(()=>{
    if(!user)return;
    const m={reception:"Reception",supervisor:"Supervisor",manager:"Dashboard"};
    setTab(m[user.role]||"Reception");
    // Show today's booking reminder on login
    setTimeout(()=>{
      const todayBookings=bks.filter(b=>b.date===todayStr()&&!["Cancelled","No-show","Completed"].includes(b.status));
      if(todayBookings.length>0){
        push("📅 Today has "+todayBookings.length+" booking"+( todayBookings.length>1?"s":"")+" — check Bookings tab","booking");
      }
    },2000);
  },[user]);

  useEffect(()=>{
    if(!user)return;
    async function seed(){
      // Always upsert employees so new staff are added even if DB already seeded
      await supabase.from("employees").upsert(
        DEFAULT_EMPLOYEES.map(e=>({
          id:e.id,name:e.name,section:e.section,role:e.role||'',
          salary:0,absent_days:0,loan:0,loan_note:'',broker_fee:0,
          other_deduction:0,other_note:'',active:true,hire_date:e.hireDate,
          day_off:e.dayOff??null,on_leave:false
        })),
        {onConflict:'id',ignoreDuplicates:false}
      );
      // Seed categories & services only if empty
      const{count:cc}=await supabase.from("categories").select("*",{count:"exact",head:true});
      if(cc===0){
        await supabase.from("categories").insert(DC.map(n=>({name:n})));
        await supabase.from("services").insert(FULL_SERVICES.map(s=>({
          id:s.id,category:s.category,sub:s.sub,name:s.name,price:s.price,
          commission:s.commission,employee_section:s.employeeSection,
          bookable:s.bookable,duration_mins:s.durationMins
        })));
      }
      const{count:sc}=await supabase.from("staff").select("*",{count:"exact",head:true});
      if(sc===0)await supabase.from("staff").insert(DEFAULT_STAFF);
      await loadAll();
    }
    seed();
  },[user]);

  // Derived
  const act=useMemo(()=>visits.find(v=>v.id===actId)||null,[visits,actId]);
  const period=getPayPeriod(todayStr());
  const todayV=visits.filter(v=>v.date===todayStr());
  const svSubs=useMemo(()=>["All",...new Set(svcs.filter(s=>s.category===svCat).map(s=>s.sub))],[svCat,svcs]);
  const svAvail=svcs.filter(s=>s.category===svCat&&(svSub==="All"||s.sub===svSub));
  // FIXED: checkout today only, no past days
  const coList=useMemo(()=>{const q=coQ.toLowerCase().trim();const tv=visits.filter(v=>v.date===todayStr());if(!q)return tv.filter(v=>!["Paid & Closed","Cancelled"].includes(v.status));return tv.filter(v=>String(v.queue).includes(q)||v.name.toLowerCase().includes(q)||v.phone.includes(q));},[visits,coQ]);
  const clV=visits.filter(v=>v.date===clDate);
  const clE=exps.filter(e=>e.date===clDate&&e.type==="Daily Operation");
  const clCash=clV.filter(v=>v.status==="Paid & Closed"&&v.paymentMethod==="Cash").reduce((s,v)=>s+Number(v.totalPaid||0),0);
  const clTr=clV.filter(v=>v.status==="Paid & Closed"&&v.paymentMethod!=="Cash").reduce((s,v)=>s+Number(v.totalPaid||0),0);
  const clTips=clV.reduce((s,v)=>s+v.tips.reduce((a,t)=>a+Number(t.amount||0),0),0);
  const clRev=clV.filter(v=>v.status==="Paid & Closed").reduce((s,v)=>s+Number(v.totalService||0),0);
  const clDE=clE.reduce((s,e)=>s+Number(e.total||0),0);
  const clNet=clCash-clTips-clDE;const clGr=clNet+clTr;const clPr=clRev-clDE;
  const clTipBr=useMemo(()=>{const m={};clV.forEach(v=>v.tips.forEach(t=>{m[t.employee]=(m[t.employee]||0)+Number(t.amount||0);}));return Object.entries(m).map(([e,a])=>({employee:e,amount:a}));},[clV]);
  const svcQ=useMemo(()=>{
    const r=[];
    visits.filter(v=>v.date===todayStr()).forEach(v=>{
      if(["Paid & Closed","Cancelled"].includes(v.status))return;
      v.services.forEach(l=>{
        if(!["Completed","Cancelled"].includes(l.status))
          r.push({visit:v,line:l});
      });
    });
    // Sort: In Progress first, then by queue number (lower = registered earlier = priority)
    // On Hold customers keep their queue number priority for when they become active
    r.sort((a,b)=>{
      const pa=a.line.status==="In Progress"?0:a.line.status==="On Hold"?2:1;
      const pb=b.line.status==="In Progress"?0:b.line.status==="On Hold"?2:1;
      if(pa!==pb)return pa-pb;
      return a.visit.queue-b.visit.queue;
    });
    return r;
  },[visits]);
  const empC=useMemo(()=>emps.map(emp=>{
    const pv=visits.filter(v=>v.date>=period.start&&v.date<=period.end&&v.status==="Paid & Closed");
    const lines=pv.flatMap(v=>v.services).filter(l=>l.employee===emp.name&&l.status!=="Cancelled");
    // Service counts for performance tracking
    const svcMap={};lines.forEach(l=>{if(l.name)svcMap[l.name]=(svcMap[l.name]||0)+1;});
    const serviceList=Object.entries(svcMap).sort((a,b)=>b[1]-a[1]).map(([name,count])=>({name,count}));
    const totalRevenue=lines.reduce((s,l)=>s+lineIncome(l),0);
    return{...emp,commissionTotal:lines.reduce((s,l)=>s+lineComm(l),0),
      breakdown:lines.map(l=>({name:l.name,income:lineIncome(l),commission:lineComm(l)})),
      serviceCount:lines.length,totalRevenue,serviceList};
  }),[emps,visits,period]);
  const fCusts=custs.filter(c=>{const q=cSearch.toLowerCase().trim();if(!q)return true;return c.name.toLowerCase().includes(q)||c.phone.includes(q)||c.id.toLowerCase().includes(q);});
  // Load bookings when tab changes to Bookings OR on first load
  useEffect(()=>{
    if(!user)return;
    supabase.from("bookings").select("*").order("date",{ascending:true}).order("time",{ascending:true})
      .then(({data,error})=>{
        if(error)console.error("Bookings load error:",error);
        if(data)setBks(data.map(dbBk));
      });
  },[user]);
  useEffect(()=>{
    if(tab==="Bookings"&&user){
      supabase.from("bookings").select("*").order("date",{ascending:true}).order("time",{ascending:true})
        .then(({data,error})=>{
          if(error)console.error("Bookings tab load error:",error);
          if(data)setBks(data.map(dbBk));
        });
    }
  },[tab]);

  const todayBk=useMemo(()=>{
    const norm=d=>(d||"").trim().slice(0,10);
    const target=norm(bkDate);
    console.log("bkDate:",bkDate,"target:",target,"total bks:",bks.length,"matching:",bks.filter(b=>norm(b.date)===target).length);
    let filtered=bks.filter(b=>norm(b.date)===target);
    if(bkSearch.trim()){
      const q=bkSearch.toLowerCase().trim();
      filtered=filtered.filter(b=>
        (b.customerName||"").toLowerCase().includes(q)||
        (b.customerPhone||"").includes(q)||
        (b.serviceName||"").toLowerCase().includes(q)
      );
    }
    return filtered.sort((a,b)=>(a.time||"").localeCompare(b.time||""));
  },[bks,bkDate,bkSearch]);
  // FIXED: only bookable spa services, guaranteed true boolean
  // Use DB services if loaded, else fall back to FULL_SERVICES for bookings
  const bkSvcs=useMemo(()=>{
    const src=svcs.length>0?svcs:FULL_SERVICES;
    return src.filter(s=>s.bookable===true||s.bookable==="true");
  },[svcs]);
  function canAccess(t){return(TABA[t]||[]).includes(user?.role);}
  const allTabs=Object.keys(TABA).filter(t=>canAccess(t));
  const dailyTabs=allTabs.filter(t=>["Reception","Supervisor","Checkout","Bookings"].includes(t));
  const mgrTabs=allTabs.filter(t=>!dailyTabs.includes(t));

  async function doLogin(){
    const f=staff.find(s=>s.id===lid.trim()&&s.password===lpw&&s.active);
    if(f){
      setUser(f);sessionStorage.setItem("ambar_u",JSON.stringify(f));setLerr("");
      supabase.from("activity_log").insert({staff_id:f.id,staff_name:f.name,action:LANG.en["login"]||"login",detail:"Successful login",ts:new Date().toISOString()}).then(()=>{});
    }else{
      setLerr("Invalid username or password.");
      supabase.from("activity_log").insert({staff_id:lid.trim()||"unknown",staff_name:lid.trim()||"unknown",action:"Failed Login",detail:"Failed login attempt for username: "+lid.trim(),ts:new Date().toISOString()}).then(()=>{});
    }
  }
  function logout(){setUser(null);sessionStorage.removeItem("ambar_u");setTab("");}
  function recall(){const f=custs.find(c=>c.phone===rPhone.trim());if(f){setRName(f.name);setRmsg("✓ "+f.name+" ("+f.totalVisits+" visits)");}else setRmsg("New customer — not in system yet");}
  async function register(){
    if(!rName.trim()||!rPhone.trim())return alert("Enter name and phone.");setSaving(true);
    const cnt=Math.max(1,Number(rPpl||1)),gid=Date.now(),gn=cnt>1?rName.trim()+" (Group of "+cnt+")":"";
    const cid=makeId(rName.trim(),rPhone.trim()),tc=visits.filter(v=>v.date===todayStr()).length;
    const fc=custs.find(c=>c.phone===rPhone.trim()),ntv=(fc?.totalVisits||0)+1;
    await supabase.from("customers").upsert({id:cid,name:rName.trim(),phone:rPhone.trim(),total_visits:ntv});
    if(!fc)setCusts(p=>[...p,{id:cid,name:rName.trim(),phone:rPhone.trim(),totalVisits:ntv}]);
    else setCusts(p=>p.map(c=>c.phone===rPhone.trim()?{...c,totalVisits:ntv}:c));
    const rows=Array.from({length:cnt}).map((_,i)=>({id:gid+i,date:todayStr(),queue:tc+i+1,customer_id:cid,name:cnt>1?rName.trim()+" "+(i+1):rName.trim(),payer_name:rName.trim(),phone:rPhone.trim(),group_id:gid,group_name:gn,services:[],total_service:0,total_paid:0,payment_method:"",tips:[],status:"Waiting for Supervisor",note:rNote}));
    // Optimistic: add to screen immediately
    setVisits(prev=>[...prev,...rows.map(r=>dbVis({...r,customer_id:r.customer_id,payer_name:r.payer_name,group_id:r.group_id,group_name:r.group_name,total_service:0,total_paid:0,payment_method:"",registered_at:null}))]);
    setRName("");setRPhone("");setRPpl(1);setRNote("");setRmsg("");setSaving(false);
    rows.forEach(r=>markArrival(r.id));
    // Save in background
    const{error}=await supabase.from("visits").insert(rows);
    if(error){
      // Rollback on failure
      setVisits(prev=>prev.filter(v=>!rows.find(r=>r.id===v.id)));
      alert("Error saving. Check internet connection.");return;
    }
    logAct(user,"Registered",rName.trim()+" x"+cnt);
  }
  async function cancelV(id){
    const v=visits.find(x=>x.id===id);if(!v)return;
    if(v.services.length>0)return alert("Remove all services before cancelling.");
    confirm2("Cancel and remove this customer?",async()=>{
      await supabase.from("visits").delete().eq("id",id);
      setVisits(p=>p.filter(x=>x.id!==id));
      if(actId===id)setActId(null);
      logAct(user,"Cancelled visit",v.name);
    },true);
  }
  async function addDE(){if(!deItem.trim()||!deUnit)return alert("Enter item and price.");const q=Math.max(1,Number(deQty||1)),u=Number(deUnit||0);const row={id:Date.now(),date:todayStr(),type:"Daily Operation",name:deItem,reason:"",qty:q,unit:u,total:q*u};await supabase.from("expenses").insert(row);setExps(p=>[...p,row]);setDeItem("");setDeQty(1);setDeUnit("");}
  async function addSvc(){
    if(!act)return alert("Select a customer first.");
    const s=svcs.find(s=>s.id===Number(svSvcId));if(!s)return alert("Select a service.");
    const isKegna=s.sub==="Braids"&&s.name&&s.name.includes("ከኛ");
    const wigDed=isKegna?(s.name.includes("ጄል")?400:200):0;
    const line={lineId:Date.now(),serviceId:s.id,name:s.name,category:s.category,sub:s.sub,price:Number(s.price),qty:1,discount:0,free:false,commission:Number(s.commission||0),employeeSection:s.employeeSection,employee:"",preferredEmployee:"",status:"Waiting",wigDeduction:wigDed};
    const upd=[...act.services,line];
    const newTotal=upd.reduce((s,l)=>s+lineIncome(l),0);
    // Optimistic update — screen updates instantly
    setVisits(prev=>prev.map(v=>v.id===act.id?{...v,services:upd,totalService:newTotal,status:"With Supervisor"}:v));
    setSvSvcId("");
    // Save in background with retry
    await dbRetry(()=>supabase.from("visits").update({services:upd,total_service:newTotal,status:"With Supervisor"}).eq("id",act.id));
  }
  async function updLine(vid,lid2,f,v){
    const vis=visits.find(x=>x.id===vid);if(!vis)return;
    const tf=["employee","preferredEmployee","status"];const nv=tf.includes(f)?v:f==="free"?v:Number(v)||0;

    // When a service is marked Completed → unlock On Hold services for this customer
    if(f==="status"&&v==="Completed"){
      const line=vis.services.find(l=>l.lineId===lid2);
      const dur=svcMins(lid2);
      if(line){
        const emp=line.employee||"Unknown";
        if(dur)logAct(user,"Service completed",line.name+" by "+emp+" — "+dur+" min (expected "+(line.durationMins||"?")+"min)");
      }
      // Unlock: any "On Hold" services for this customer → set to Waiting
      const upd=vis.services.map(l=>{
        if(l.lineId===lid2)return{...l,status:"Completed"};
        if(l.status==="On Hold")return{...l,status:"Waiting"};
        return l;
      });
      await supabase.from("visits").update({services:upd,total_service:upd.reduce((s,l)=>s+lineIncome(l),0)}).eq("id",vid);
      // Notify supervisor
      const unlocked=vis.services.filter(l=>l.lineId!==lid2&&l.status==="On Hold");
      if(unlocked.length>0){
        push("⭐ "+vis.name+" #"+vis.queue+" finished "+line.name+" — NEXT in line for: "+unlocked.map(l=>l.name).join(", ")+" (after any In Progress services finish)","success");
      }
      return;
    }

    // When setting In Progress → auto set other services of same customer to On Hold
    if(f==="status"&&v==="In Progress"){
      markSvcStart(lid2);
      const upd=vis.services.map(l=>{
        if(l.lineId===lid2)return{...l,status:"In Progress"};
        // Put other waiting services on hold while this one is active
        if(l.status==="Waiting")return{...l,status:"On Hold"};
        return l;
      });
      const hasInProgress=upd.some(l=>l.status==="In Progress");
      await supabase.from("visits").update({services:upd,total_service:upd.reduce((s,l)=>s+lineIncome(l),0),status:hasInProgress?"In Service":"With Supervisor"}).eq("id",vid);
      setVisits(prev=>prev.map(v=>v.id===vid?{...v,services:upd,status:hasInProgress?"In Service":"With Supervisor"}:v));
      return;
    }

    const upd=vis.services.map(l=>l.lineId!==lid2?l:{...l,[f]:nv});
    await supabase.from("visits").update({services:upd,total_service:upd.reduce((s,l)=>s+lineIncome(l),0)}).eq("id",vid);
  }
  async function moveLine(vid,lid2,dir){
    const vis=visits.find(x=>x.id===vid);if(!vis)return;
    const idx=vis.services.findIndex(l=>l.lineId===lid2);if(idx<0)return;
    const newIdx=dir==="up"?idx-1:idx+1;
    if(newIdx<0||newIdx>=vis.services.length)return;
    const upd=[...vis.services];const tmp=upd[idx];upd[idx]=upd[newIdx];upd[newIdx]=tmp;
    await supabase.from("visits").update({services:upd}).eq("id",vid);
  }
  function remLine(vid,lid2){
    confirm2("Remove this service?",async()=>{
      const vis=visits.find(x=>x.id===vid);if(!vis)return;
      const upd=vis.services.filter(l=>l.lineId!==lid2);
      const newTotal=upd.reduce((s,l)=>s+lineIncome(l),0);
      setVisits(prev=>prev.map(v=>v.id===vid?{...v,services:upd,totalService:newTotal}:v));
      await dbRetry(()=>supabase.from("visits").update({services:upd,total_service:newTotal}).eq("id",vid));
    },true);
  }
  async function markReady(){if(!act||!act.services.length)return alert("No services added.");const p=act.services.find(l=>!["Completed","Cancelled"].includes(l.status));if(p)return alert("Mark as Completed or Cancelled first: "+p.name);const m=act.services.find(l=>l.status!=="Cancelled"&&!l.employee);if(m)return alert("Assign an employee for: "+m.name);await supabase.from("visits").update({status:"Ready for Payment"}).eq("id",act.id);logAct(user,"Ready for Payment",act.name);}
  async function reopen(){await supabase.from("visits").update({status:"In Service"}).eq("id",act.id);}
  function addTip(){if(!tipEmp||!tipAmt)return alert("Select employee and enter amount.");setTips(p=>[...p,{id:Date.now(),employee:tipEmp,amount:Number(tipAmt)}]);setTipEmp("");setTipAmt("");}
  async function processRefund(vid){
    const v=visits.find(x=>x.id===vid);if(!v)return;
    const amt=Number(refundAmt);if(!amt||amt<=0)return alert("Enter refund amount.");
    if(amt>v.totalPaid)return alert("Refund cannot exceed amount paid ("+money(v.totalPaid)+").");
    confirm2("Issue refund of "+money(amt)+" for "+v.name+"?",async()=>{
      const refundNote="[REFUND "+money(amt)+(refundReason?" — "+refundReason:"")+"]";
      await supabase.from("visits").update({
        note:(v.note?v.note+" ":"")+refundNote,
        total_paid:v.totalPaid-amt,
        status:"Paid & Closed"
      }).eq("id",vid);
      setVisits(prev=>prev.map(x=>x.id===vid?{...x,note:(x.note?x.note+" ":"")+refundNote,totalPaid:x.totalPaid-amt}:x));
      logAct(user,"Refund issued",v.name+" — "+money(amt)+(refundReason?" ("+refundReason+")":""));
      push("Refund of "+money(amt)+" issued for "+v.name,"success");
      setShowRefund(false);setRefundAmt("");setRefundReason("");
    },true);
  }
  async function confirmPay(grp=false){if(!act)return;const ids=grp&&act.groupId?visits.filter(v=>v.groupId===act.groupId&&v.status!=="Cancelled").map(v=>v.id):[act.id];for(const id of ids){const v=visits.find(x=>x.id===id);const mt=id===act.id?tips:[];const mtt=mt.reduce((s,t)=>s+Number(t.amount||0),0);await supabase.from("visits").update({tips:mt,total_paid:v.totalService+mtt,payment_method:payM,status:"Paid & Closed"}).eq("id",id);}logAct(user,"Payment",act.name+" "+payM);
    // Mark related booking as Completed if exists
    const relBk=bks.find(b=>b.visitId&&ids.includes(b.visitId));
    if(relBk)await supabase.from("bookings").update({status:"Completed"}).eq("id",relBk.id);
    setTips([]);setActId(null);}
  async function saveBk(){
    const sid=Number(bkF.serviceId)||0;
    const s=sid?svcs.find(sv=>sv.id===sid&&sv.bookable===true):null;
    if(!bkF.customerName.trim()||!bkF.customerPhone.trim()||!bkF.date||!bkF.time)return alert("Please fill customer name, phone, date and time.");
    const warn=checkConflict(bks,bkF,svcs);
    if(warn&&!window.confirm(warn+"\n\nProceed anyway?"))return;
    setSaving(true);
    const cid=makeId(bkF.customerName.trim(),bkF.customerPhone.trim());
    if(!custs.find(c=>c.phone===bkF.customerPhone.trim())){await supabase.from("customers").upsert({id:cid,name:bkF.customerName.trim(),phone:bkF.customerPhone.trim(),total_visits:0});setCusts(p=>[...p,{id:cid,name:bkF.customerName.trim(),phone:bkF.customerPhone.trim(),totalVisits:0}]);}
    const row={id:editBk?.id||Date.now(),date:(bkF.date||bkDate||todayStr()).trim().slice(0,10),time:bkF.time,customer_id:cid,customer_name:bkF.customerName.trim(),customer_phone:bkF.customerPhone.trim(),service_id:sid||0,service_name:s?s.name:'TBD - To Be Confirmed',service_category:s?s.category:'Spa',duration_mins:s?s.durationMins:120,people:Number(bkF.people||1),notes:bkF.notes,status:editBk?"Confirmed":"Pending",created_by:user.name,visit_id:null};
    // Optimistic: add to screen immediately
    const optimistic=dbBk({...row,customer_id:row.customer_id,customer_name:row.customer_name,customer_phone:row.customer_phone,service_id:row.service_id,service_name:row.service_name,service_category:row.service_category,duration_mins:row.duration_mins,created_by:row.created_by,visit_id:null});
    if(!editBk)setBks(prev=>[...prev,optimistic]);
    else setBks(prev=>prev.map(b=>b.id===row.id?optimistic:b));
    let saveError=null;
    if(editBk){const{error}=await supabase.from("bookings").update(row).eq("id",editBk.id);saveError=error;}
    else{const{error}=await supabase.from("bookings").insert(row);saveError=error;}
    if(saveError){alert("Error saving booking: "+saveError.message);setSaving(false);return;}
    logAct(user,editBk?"Edited booking":"New booking",bkF.customerName+" — "+(s?s.name:"TBD"));
    // Reload ALL bookings so new one appears immediately
    const{data:freshBks}=await supabase.from("bookings").select("*").order("date",{ascending:true}).order("time",{ascending:true});
    if(freshBks)setBks(freshBks.map(dbBk));
    // Stay on the same date
    const savedDate=row.date;
    setShowBkF(false);setEditBk(null);
    setBkF({customerName:"",customerPhone:"",serviceId:"",date:savedDate,time:"10:00",people:1,notes:""});
    setBkDate(savedDate);
    setBkWarn("");setSaving(false);
    push("Booking saved for "+savedDate,"success");
  }
  async function updBk(id,status){
    // Optimistic
    setBks(prev=>prev.map(b=>b.id===id?{...b,status}:b));
    await dbRetry(()=>supabase.from("bookings").update({status}).eq("id",id));
  }
  async function checkIn(b){if(!window.confirm("Check in "+b.customerName+"?"))return;setSaving(true);const cid=makeId(b.customerName,b.customerPhone);const tc=visits.filter(v=>v.date===todayStr()).length;const vr={id:Date.now(),date:todayStr(),queue:tc+1,customer_id:cid,name:b.customerName,payer_name:b.customerName,phone:b.customerPhone,group_id:null,group_name:"",services:[],total_service:0,total_paid:0,payment_method:"",tips:[],status:"Waiting for Supervisor",note:(b.serviceName&&b.serviceName!=="TBD - To Be Confirmed"?"Booking: "+b.serviceName:"Spa Booking — service TBD")};await supabase.from("visits").insert(vr);await supabase.from("bookings").update({status:"Arrived",visit_id:vr.id}).eq("id",b.id);logAct(user,"Check-in",b.customerName);setSaving(false);push(b.customerName+" checked in — Queue #"+vr.queue,"success");}
  async function delBk(id){if(!window.confirm("Delete this booking?"))return;await supabase.from("bookings").delete().eq("id",id);}
  async function addSpaWalkIn(){
    if(!wiName.trim()||!wiPhone.trim()||!wiSvcId)return alert("Enter customer name, phone and select a service.");
    setSaving(true);
    const s=svcs.find(sv=>sv.id===Number(wiSvcId));
    const cid=makeId(wiName.trim(),wiPhone.trim());
    const fc=custs.find(c=>c.phone===wiPhone.trim()),ntv=(fc?.totalVisits||0)+1;
    await supabase.from("customers").upsert({id:cid,name:wiName.trim(),phone:wiPhone.trim(),total_visits:ntv});
    if(!fc)setCusts(p=>[...p,{id:cid,name:wiName.trim(),phone:wiPhone.trim(),totalVisits:ntv}]);
    const tc=visits.filter(v=>v.date===todayStr()).length;
    const vr={id:Date.now(),date:todayStr(),queue:tc+1,customer_id:cid,name:wiName.trim(),payer_name:wiName.trim(),phone:wiPhone.trim(),group_id:null,group_name:"",services:[],total_service:0,total_paid:0,payment_method:"",tips:[],status:"Waiting for Supervisor",note:(s?"Spa Walk-in: "+s.name:"Spa Walk-in")+(wiNote?" — "+wiNote:"")};
    await supabase.from("visits").insert(vr);
    logAct(user,"Spa Walk-in",wiName.trim()+(s?" — "+s.name:""));
    setShowWalkIn(false);setWiSvcId("");setWiName("");setWiPhone("");setWiNote("");setSaving(false);
    markArrival(vr.id);
    push(wiName.trim()+" added to queue as #"+(tc+1)+" (Spa walk-in)","success");
  }
  async function addGE(){if(!gName.trim()||!gAmt)return alert("Enter name and amount.");const row={id:Date.now(),date:gDate,type:"General",name:gName,reason:gRsn,category:gCat,qty:1,unit:Number(gAmt),total:Number(gAmt)};await supabase.from("expenses").insert(row);setExps(p=>[...p,row]);setGName("");setGRsn("");setGAmt("");}
  async function delE(id){if(!window.confirm("Delete?"))return;await supabase.from("expenses").delete().eq("id",id);setExps(p=>p.filter(e=>e.id!==id));}
  async function addCat(){if(!newCat.trim()||cats.includes(newCat.trim()))return;await supabase.from("categories").insert({name:newCat.trim()});setCats(p=>[...p,newCat.trim()]);setNewCat("");}
  async function addSvc2(){if(!nSvc.name.trim()||!nSvc.price)return alert("Enter name and price.");const r={id:Date.now(),category:nSvc.category,sub:nSvc.sub,name:nSvc.name,price:Number(nSvc.price),commission:Number(nSvc.commission||0),employee_section:nSvc.employeeSection,bookable:nSvc.bookable,duration_mins:Number(nSvc.durationMins||60)};await supabase.from("services").insert(r);setSvcs(p=>[...p,{...nSvc,id:r.id,price:Number(nSvc.price),commission:Number(nSvc.commission||0),durationMins:Number(nSvc.durationMins||60)}]);setNSvc({category:DC[0],sub:"",name:"",price:"",commission:0,employeeSection:DC[0],bookable:false,durationMins:60});}
  async function updSvc(id,f,v){const df=f==="employeeSection"?"employee_section":f==="durationMins"?"duration_mins":f;const val=["price","commission","durationMins"].includes(f)?Number(v)||0:f==="bookable"?v:v;setSvcs(p=>p.map(s=>s.id===id?{...s,[f]:val}:s));clearTimeout(dRef.current[id+f]);dRef.current[id+f]=setTimeout(async()=>await supabase.from("services").update({[df]:val}).eq("id",id),800);}
  async function delSvc(id){if(!window.confirm("Remove this service?"))return;await supabase.from("services").delete().eq("id",id);setSvcs(p=>p.filter(s=>s.id!==id));}
  async function addEmp(){if(!nEmp.name.trim())return alert("Enter employee name.");const r={id:Date.now(),name:nEmp.name.trim(),section:nEmp.section,role:nEmp.role||"",salary:Number(nEmp.salary),absent_days:0,loan:0,loan_note:"",broker_fee:0,other_deduction:0,other_note:"",active:true,hire_date:nEmp.hireDate,day_off:null,on_leave:false};await supabase.from("employees").insert(r);setEmps(p=>[...p,{...r,absentDays:0,loanNote:"",brokerFee:0,otherDeduction:0,otherNote:"",hireDate:r.hire_date,dayOff:null,onLeave:false}]);setNEmp({name:"",section:EMP_SECTIONS[0],role:"",salary:"",hireDate:todayStr()});}
  async function updEmp(id,f,v){const m={absentDays:"absent_days",loanNote:"loan_note",brokerFee:"broker_fee",otherDeduction:"other_deduction",otherNote:"other_note",hireDate:"hire_date",dayOff:"day_off",onLeave:"on_leave",role:"role"};const df=m[f]||f;const val=["name","section","hireDate","loanNote","otherNote","role"].includes(f)?v:f==="dayOff"?(v===""||v===null?null:Number(v)):f==="onLeave"?v:Number(v)||0;setEmps(p=>p.map(e=>e.id===id?{...e,[f]:val}:e));clearTimeout(eRef.current[id+f]);eRef.current[id+f]=setTimeout(async()=>await supabase.from("employees").update({[df]:val}).eq("id",id),800);}
  async function setEmpAct(id,active){if(!window.confirm(active?"Reactivate?":"Deactivate?"))return;await supabase.from("employees").update({active}).eq("id",id);setEmps(p=>p.map(e=>e.id===id?{...e,active}:e));}
  async function closePeriod(){if(!window.confirm("Close pay period "+period.label+"?"))return;const snap=empC.map(e=>({id:e.id,name:e.name,section:e.section,salary:e.salary,commissionTotal:e.commissionTotal,absentDays:e.absentDays,loan:e.loan,brokerFee:e.brokerFee,otherDeduction:e.otherDeduction,loanNote:e.loanNote,otherNote:e.otherNote}));await supabase.from("closed_periods").insert({period:period.label,start_date:period.start,end_date:period.end,closed_at:new Date().toISOString(),employees:snap});for(const e of emps)await supabase.from("employees").update({absent_days:0,loan:0,loan_note:"",broker_fee:0,other_deduction:0,other_note:""}).eq("id",e.id);setEmps(p=>p.map(e=>({...e,absentDays:0,loan:0,loanNote:"",brokerFee:0,otherDeduction:0,otherNote:""})));logAct(user,"Closed period",period.label);alert("Period closed.");}
  async function saveStaff(){if(!nStaff.id.trim()||!nStaff.name.trim()||!nStaff.password.trim())return alert("Fill all fields.");const r={id:nStaff.id.trim().toLowerCase(),name:nStaff.name.trim(),role:nStaff.role,password:nStaff.password.trim(),active:true};await supabase.from("staff").upsert(r);setStaff(p=>{const i=p.findIndex(s=>s.id===r.id);if(i>=0){const n=[...p];n[i]=r;return n;}return[...p,r];});logAct(user,"Staff saved",r.name);setNStaff({id:"",name:"",role:"reception",password:""});setEditStaff(null);alert("Saved.");}
  async function setStaffAct(id,active){if(!window.confirm(active?"Reactivate?":"Deactivate?"))return;await supabase.from("staff").update({active}).eq("id",id);setStaff(p=>p.map(s=>s.id===id?{...s,active}:s));}
  async function delCust(id){
    if(!window.confirm("Delete this customer? They can be restored from the Customers tab."))return;
    const c=custs.find(x=>x.id===id);if(!c)return;
    const deletedAt=new Date().toISOString();
    setCusts(p=>p.filter(x=>x.id!==id));
    push("Customer deleted — tap Restore in Customers tab within 30 days","warning");
    // Soft delete — set deleted_at timestamp
    await supabase.from("customers").update({deleted_at:deletedAt}).eq("id",id);
    logAct(user,"Deleted customer",c.name);
  }
  async function restoreCust(id){
    await supabase.from("customers").update({deleted_at:null}).eq("id",id);
    const{data}=await supabase.from("customers").select("*").eq("id",id).single();
    if(data)setCusts(p=>[...p,dbCust(data)]);
    push("Customer restored","success");
  }
  function doExportCSV(){const rows=clV.filter(v=>v.status==="Paid & Closed").map(v=>({Queue:v.queue,Name:v.name,Phone:v.phone,Services:v.services.map(s=>s.name).join("|"),Total:v.totalService,Method:v.paymentMethod,Tips:v.tips.reduce((s,t)=>s+t.amount,0)}));if(!rows.length)return alert("No paid visits for this date.");exportCSV(rows,"ambar-closing-"+clDate+".csv");}

  const gc=sc.mob?"1fr":"1fr 1.15fr";

  if(user&&pinLocked)return(<div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"linear-gradient(135deg,#0f1720,#1d2a36)"}}><div style={{background:"#fff",borderRadius:24,padding:40,width:"100%",maxWidth:340,margin:"0 16px",boxShadow:"0 20px 60px rgba(0,0,0,0.4)",textAlign:"center"}}><div style={{fontSize:44,marginBottom:8}}>🔒</div><h2 style={{margin:"0 0 4px"}}>Session Locked</h2><p style={{color:"#6b7280",fontSize:13,marginBottom:20}}>Enter password to continue as {user.name}</p>{pinErr&&<div style={{background:"#fee2e2",color:"#991b1b",borderRadius:10,padding:10,marginBottom:12,fontSize:13,fontWeight:700}}>{pinErr}</div>}<input style={S.inp} type="password" value={pinInput} onChange={e=>setPinInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&unlockPin()} placeholder="Password" autoFocus/><button style={S.btnP} onClick={unlockPin}>{t("unlock")}</button><button style={S.btnS} onClick={logout}>{t("logoutInstead")}</button></div></div>);

  if(!user)return(<div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"linear-gradient(135deg,#0f1720,#1d2a36)"}}><div style={{background:"#fff",borderRadius:24,padding:40,width:"100%",maxWidth:380,margin:"0 16px",boxShadow:"0 20px 60px rgba(0,0,0,0.4)"}}><div style={{textAlign:"center",marginBottom:24}}><div style={{fontSize:44}}>✦</div><h1 style={{margin:"8px 0 0",fontSize:22,fontWeight:900}}>Ambar Spa & Beauty</h1><p style={{margin:"6px 0 0",color:"#6b7280",fontSize:13}}>Staff Login</p></div>{lerr&&<div style={{background:"#fee2e2",color:"#991b1b",borderRadius:10,padding:"10px 14px",marginBottom:14,fontSize:13,fontWeight:700}}>{lerr}</div>}<p style={S.lbl}>Username</p><input style={S.inp} value={lid} onChange={e=>setLid(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doLogin()} placeholder="e.g. reception1" autoFocus/><p style={S.lbl}>Password</p><input style={S.inp} type="password" value={lpw} onChange={e=>setLpw(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doLogin()} placeholder="Password"/><button style={{...S.btnP,marginTop:8}} onClick={doLogin}>{t("login")}</button></div></div>);

  if(loading)return(<div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"linear-gradient(135deg,#0f1720,#1d2a36)",color:"#e0b85a"}}><div style={{textAlign:"center"}}><div style={{fontSize:56,marginBottom:16,animation:"spin 2s linear infinite"}}>✦</div><div style={{fontSize:18,fontWeight:700,letterSpacing:2}}>AMBAR SPA & BEAUTY</div><div style={{fontSize:13,color:"#c9b077",marginTop:8}}>Loading your workspace...</div><div style={{marginTop:20,display:"flex",gap:6,justifyContent:"center"}}>{[0,1,2].map(i=><div key={i} style={{width:8,height:8,borderRadius:"50%",background:"#e0b85a",opacity:0.4+i*0.3}}/>)}</div><style>{"@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}"}</style></div></div>);
  return(<div style={{minHeight:"100vh",background:"#f8fafc",fontFamily:"Segoe UI,Arial,sans-serif",color:"#111827"}}>
    <Notifs items={notifs} dismiss={dismiss}/>
    {confirmDlg&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",zIndex:9998,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{background:"#fff",borderRadius:20,padding:28,maxWidth:360,width:"100%",boxShadow:"0 20px 60px rgba(0,0,0,0.3)"}}>
        <div style={{fontSize:36,textAlign:"center",marginBottom:12}}>{confirmDlg.danger?"⚠️":"❓"}</div>
        <p style={{margin:"0 0 20px",fontSize:15,fontWeight:600,color:"#111827",textAlign:"center",lineHeight:1.5}}>{confirmDlg.msg}</p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          <button onClick={()=>setConfirmDlg(null)} style={{padding:12,borderRadius:12,border:"1px solid #e5e7eb",background:"#f9fafb",color:"#374151",fontWeight:700,cursor:"pointer",fontSize:14}}>Cancel</button>
          <button onClick={()=>{confirmDlg.onOk();setConfirmDlg(null);}} style={{padding:12,borderRadius:12,border:"none",background:confirmDlg.danger?"#dc2626":"#111827",color:"#fff",fontWeight:700,cursor:"pointer",fontSize:14}}>{confirmDlg.danger?"Yes, Delete":"Confirm"}</button>
        </div>
      </div>
    </div>}
    {offline&&<div style={{background:"#b45309",color:"#fff",textAlign:"center",padding:8,fontSize:13,fontWeight:700}}>⚠ Offline — changes will not save</div>}
    {saving&&<div style={{background:"#e0b85a",color:"#111827",textAlign:"center",padding:6,fontSize:13,fontWeight:700}}>Saving...</div>}
    <div style={{maxWidth:1400,margin:"0 auto",padding:sc.mob?"12px":"28px"}}>
      <header style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",background:"#111827",color:"white",marginBottom:14,flexWrap:"wrap",gap:8,borderRadius:16,padding:"14px 18px"}}>
        <div><p style={{color:"#e0b85a",fontWeight:900,letterSpacing:2,margin:"0 0 2px",fontSize:11}}>AMBAR SPA & BEAUTY</p>
          {!sc.mob&&<h1 style={{margin:0,fontSize:20,fontWeight:900,color:"#fff"}}>Salon Management System</h1>}
          <p style={{color:"#d1d5db",fontSize:12,margin:"4px 0 0"}}>{user.name}<span style={{background:"#e0b85a",color:"#111827",borderRadius:6,padding:"1px 7px",fontSize:10,fontWeight:800,marginLeft:6}}>{user.role}</span><button onClick={toggleLang} style={{background:"transparent",border:"1px solid #e0b85a",color:"#e0b85a",borderRadius:8,padding:"2px 8px",cursor:"pointer",fontSize:11,marginLeft:6}}>{lang==="en"?"🇪🇹 አማርኛ":"🇬🇧 English"}</button>
          {notifPerm!=="granted"&&notifPerm!=="unsupported"&&<button onClick={requestNotifPerm} style={{background:"#e0b85a",border:"none",color:"#111827",borderRadius:8,padding:"2px 8px",cursor:"pointer",fontSize:11,marginLeft:6,fontWeight:700}}>🔔 Enable Alerts</button>}
          {notifPerm==="granted"&&<span style={{color:"#4ade80",fontSize:11,marginLeft:6}}>🔔 ✓</span>}
          <button onClick={logout} style={{background:"transparent",border:"1px solid #6b7280",color:"#d1d5db",borderRadius:8,padding:"2px 10px",cursor:"pointer",fontSize:11,marginLeft:4}}>{t("logout")}</button></p>
        </div>
        <div style={{background:"#e0b85a",color:"#111827",borderRadius:12,padding:"10px 18px",textAlign:"center",flexShrink:0}}><p style={{margin:0,fontSize:10,fontWeight:800}}>TODAY NEXT</p><h2 style={{margin:"2px 0 0",fontSize:26,fontWeight:900}}>#{todayV.length+1}</h2></div>
      </header>

      {sc.mob?(<div style={{marginBottom:10}}><button onClick={()=>setMobNav(v=>!v)} style={{...S.btnS,marginBottom:0}}>☰ {tab}</button>{mobNav&&<div style={{background:"#fff",borderRadius:14,padding:10,marginTop:6,border:"1px solid #e6c977"}}>{allTabs.map(t=><button key={t} style={{...tab===t?S.tabA:S.tab,display:"block",width:"100%",marginBottom:4,textAlign:"left"}} onClick={()=>{setTab(t);setMobNav(false);}}>{t}</button>)}</div>}</div>):(
        <>{dailyTabs.length>0&&<><p style={S.navL}>DAILY WORKFLOW</p><div style={{display:"grid",gridTemplateColumns:"repeat("+dailyTabs.length+",1fr)",gap:6,marginBottom:8}}>{dailyTabs.map(tk=><button key={tk} style={tab===tk?S.tabA:S.tab} onClick={()=>setTab(tk)}>{(LANG[lang]||LANG.en)[tk.toLowerCase().replace(/ /g,"").replace(/&/g,"")]||tk}</button>)}</div></>}
        {mgrTabs.length>0&&<><p style={{...S.navL,color:"#6b7280",marginTop:8}}>MANAGEMENT</p><div style={{display:"grid",gridTemplateColumns:"repeat("+Math.min(mgrTabs.length,7)+",1fr)",gap:6,marginBottom:14}}>{mgrTabs.map(tk=><button key={tk} style={tab===tk?{...S.tabA,background:"#1d4ed8",color:"#fff"}:{...S.tab,background:"#f1f5f9",color:"#374151",border:"1px solid #e2e8f0"}} onClick={()=>setTab(tk)}>{(LANG[lang]||LANG.en)[tk.toLowerCase().replace(/ /g,"").replace(/&/g,"")]||tk}</button>)}</div></>}</>
      )}

      {tab==="Reception"&&<main style={{display:"grid",gridTemplateColumns:gc,gap:14}}>
        <section style={S.card}><h2 style={S.ct}>{t("registerCustomer")}</h2>
          <L>Phone *</L><div style={S.r2}><input style={S.inp} value={rPhone} onChange={e=>setRPhone(e.target.value)} onKeyDown={e=>e.key==="Enter"&&recall()} placeholder="Phone number"/><button style={S.btnS} onClick={recall}>{t("recall")}</button></div>
          {rmsg&&<p style={{fontWeight:700,fontSize:13,color:rmsg.startsWith("✓")?"#166534":"#1e40af",marginBottom:8}}>{rmsg}</p>}
          <L>Name *</L><input style={S.inp} value={rName} onChange={e=>setRName(e.target.value)} placeholder="Full name"/>
          <L>Number of People</L><input style={S.inp} type="number" min="1" value={rPpl} onChange={e=>setRPpl(e.target.value)}/>
          <L>Note</L><textarea style={S.ta} value={rNote} onChange={e=>setRNote(e.target.value)} rows={2}/>
          <button style={S.btnP} onClick={register}>{t("registerBtn")}</button>
          <HR/><h3 style={{margin:"0 0 8px",fontSize:13,fontWeight:800,color:"#374151"}}>Quick Daily Expense</h3>
          <input style={S.inp} value={deItem} onChange={e=>setDeItem(e.target.value)} placeholder="Item name"/>
          <div style={S.r2}><input style={S.inp} type="number" value={deQty} onChange={e=>setDeQty(e.target.value)} placeholder="Qty"/><input style={S.inp} type="number" value={deUnit} onChange={e=>setDeUnit(e.target.value)} placeholder="Unit price"/></div>
          <button style={S.btnS} onClick={addDE}>{t("saveExpense")}</button>
        </section>
        <section style={S.card}><h2 style={S.ct}>{t("todaysQueue")}</h2><p style={S.hlp}>{new Date().toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"long"})}</p>
          {todayV.length===0&&<EMP>No customers registered yet today.</EMP>}
          {todayV.map((v,idx)=>{
            const activeAhead=todayV.slice(0,idx).filter(x=>!["Paid & Closed","Cancelled"].includes(x.status)).length;
            const isInProgress=v.status==="In Service"||v.services.some(l=>l.status==="In Progress");
            const isWithSupervisor=v.status==="With Supervisor"&&!isInProgress;
            const isWaiting=v.status==="Waiting for Supervisor";
            const isDone=["Paid & Closed","Cancelled"].includes(v.status);
            return <div key={v.id} style={{...S.li,borderLeft:"4px solid "+(isDone?"#d1d5db":isInProgress?"#1e40af":"#e0b85a"),background:isDone?"#f9fafb":isInProgress?"#eff6ff":"#fffaf2"}}>
              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",marginBottom:4}}>
                  <b style={{fontSize:15,color:"#111827"}}>#{v.queue} — {v.name}</b>
                  {isInProgress&&<span style={{background:"#1e40af",color:"#fff",borderRadius:8,padding:"2px 10px",fontSize:11,fontWeight:800}}>🔄 In Progress</span>}
                  {isWithSupervisor&&<span style={{background:"#0369a1",color:"#fff",borderRadius:8,padding:"2px 10px",fontSize:11,fontWeight:800}}>👤 With Supervisor</span>}
                  {!isDone&&!isInProgress&&v.status!=="Ready for Payment"&&<span style={{background:"#fef3c7",color:"#92400e",borderRadius:8,padding:"2px 10px",fontSize:11,fontWeight:800}}>⏳ Waiting</span>}
                  {v.status==="Ready for Payment"&&<span style={{background:"#dcfce7",color:"#166534",borderRadius:8,padding:"2px 10px",fontSize:11,fontWeight:800}}>💳 Ready</span>}
                  {isDone&&<span style={{background:"#f0fdf4",color:"#166534",borderRadius:8,padding:"2px 10px",fontSize:11,fontWeight:800}}>✓ Done</span>}
                </div>
                {v.groupName&&<p style={{...S.hlp,color:"#374151"}}>{v.groupName}</p>}
                {v.note&&<p style={{...S.hlp,color:"#374151"}}>📝 {v.note}</p>}
                {!isDone&&activeAhead>0&&<p style={{fontSize:11,color:"#6b7280",margin:"2px 0"}}>👥 {activeAhead} customer{activeAhead>1?"s":""} ahead</p>}
                {!isDone&&activeAhead===0&&<p style={{fontSize:11,color:"#166534",fontWeight:700,margin:"2px 0"}}>✓ You're next!</p>}
                {!isDone&&<WaitTimer vid={v.id}/>}
                {isInProgress&&v.services.filter(l=>l.status==="In Progress").map(l=><SvcTimer key={l.lineId} lineId={l.lineId} status={l.status}/>)}
              </div>
              <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                {v.status==="Waiting for Supervisor"&&v.services.length===0&&<button style={S.btnD} onClick={()=>cancelV(v.id)}>{t("cancel")}</button>}
              </div>
            </div>;
          })}
        </section>
      </main>}

      {tab==="Supervisor"&&<ErrorBoundary><main style={{display:"grid",gridTemplateColumns:gc,gap:14}}>
        <section style={S.card}><h2 style={S.ct}>{t("queueOverview")}</h2>
          <h3 style={S.sh}>⏳ Waiting</h3>
          {visits.filter(v=>["Waiting for Supervisor","With Supervisor"].includes(v.status)&&v.date===todayStr()).length===0?<p style={{...S.hlp,color:"#374151"}}>No one waiting.</p>
            :visits.filter(v=>["Waiting for Supervisor","With Supervisor"].includes(v.status)&&v.date===todayStr()).map((v,i,arr)=>{
              const ahead=arr.slice(0,i).length;
              return <button key={v.id} style={actId===v.id?S.liA:S.liB} onClick={()=>setActId(v.id)}>
                <span>
                  <b>#{v.queue} — {v.name}</b>
                  {v.note&&<span style={{...S.hlp,marginLeft:8}}>({v.note})</span>}
                  <span style={{fontSize:10,color:actId===v.id?"#e0b85a":"#6b7280",marginLeft:8}}>{ahead===0?"Next up":"Position "+(ahead+1)}</span>
                </span>
                <span style={SB("Waiting for Supervisor")}>New</span>
              </button>;
            })}
          <HR/><h3 style={S.sh}>🔄 Active Services</h3>
          {svcQ.length===0&&<p style={S.hlp}>No active queues.</p>}
          {svcs.map(svc=>{const rows=svcQ.filter(r=>r.line.serviceId===svc.id);if(!rows.length)return null;
              const inProg=rows.filter(r=>r.line.status==="In Progress");
              const waiting=rows.filter(r=>r.line.status==="Waiting");
              const onHold=rows.filter(r=>r.line.status==="On Hold");
              return(<div key={svc.id} style={{background:"#f9fafb",border:"1px solid #e5e7eb",borderRadius:12,padding:10,marginBottom:8}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                  <b style={{fontSize:13,color:"#111827"}}>{svc.name}</b>
                  <span style={{fontSize:11,color:"#6b7280"}}>{inProg.length>0?inProg.length+" in progress · ":""}{waiting.length} waiting{onHold.length>0?" · "+onHold.length+" on hold":""}</span>
                </div>
                {inProg.map(({visit:vv,line},i)=><button key={line.lineId} style={actId===vv.id?S.liA:{...S.liB,background:"#eff6ff",border:"1px solid #bfdbfe"}} onClick={()=>setActId(vv.id)}>
                  <span style={{display:"flex",alignItems:"center",gap:6}}><span style={{background:"#1d4ed8",color:"#fff",borderRadius:5,padding:"1px 6px",fontSize:10,fontWeight:800}}>IN PROGRESS</span><b>#{vv.queue}</b> {vv.name}</span><span style={SB("In Progress")}>{line.status}</span>
                </button>)}
                {waiting.map(({visit:vv,line},i)=><button key={line.lineId} style={actId===vv.id?S.liA:S.liB} onClick={()=>setActId(vv.id)}>
                  <span style={{display:"flex",alignItems:"center",gap:6}}>{i===0&&inProg.length===0&&<span style={{background:"#166534",color:"#fff",borderRadius:5,padding:"1px 6px",fontSize:10,fontWeight:800}}>NEXT</span>}{i===0&&inProg.length>0&&<span style={{background:"#e0b85a",color:"#111827",borderRadius:5,padding:"1px 6px",fontSize:10,fontWeight:800}}>UP NEXT</span>}<b>#{vv.queue}</b> {vv.name}</span><span style={SB("Waiting")}>Waiting</span>
                </button>)}
                {onHold.length>0&&<div style={{marginTop:6,paddingTop:6,borderTop:"1px dashed #e5e7eb"}}>
                  <p style={{fontSize:11,color:"#6b21a8",fontWeight:700,margin:"0 0 4px"}}>⏸ On Hold — will get priority when current service completes</p>
                  {onHold.map(({visit:vv,line})=><button key={line.lineId} style={actId===vv.id?S.liA:{...S.liB,background:"#faf5ff",border:"1px solid #e9d5ff"}} onClick={()=>setActId(vv.id)}>
                    <span style={{display:"flex",alignItems:"center",gap:6}}><span style={{background:"#7c3aed",color:"#fff",borderRadius:5,padding:"1px 6px",fontSize:10,fontWeight:800}}>HOLD</span><b>#{vv.queue}</b> {vv.name}</span><span style={SB("On Hold")}>On Hold</span>
                  </button>)}
                </div>}
              </div>);})}
        </section>
        <section style={S.card}>
          {!act?<EMP>← Select a customer to assign services.</EMP>:!act.services?<EMP>Loading...</EMP>:<>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:12,flexWrap:"wrap",gap:8}}>
              <div><h2 style={{...S.ct,marginBottom:2}}>#{act.queue} — {act.name}</h2><p style={S.hlp}>{act.groupName||"Individual"} · {act.status}</p></div>
              {act.status==="Ready for Payment"&&<span style={{background:"#dcfce7",color:"#166534",borderRadius:10,padding:"6px 14px",fontWeight:800,fontSize:13}}>✓ Ready</span>}
            </div>
            {act.status==="Ready for Payment"&&<div style={{background:"#fef9ec",border:"1px solid #e0b85a",borderRadius:11,padding:12,marginBottom:10,fontSize:13}}>Ready for checkout.<button style={{...S.btnS,marginTop:8,width:"auto",padding:"7px 14px"}} onClick={reopen}>{t("reopen")}</button></div>}
            {!["Paid & Closed","Ready for Payment"].includes(act.status)&&<>
              <div style={S.r2}><select style={S.inp} value={svCat} onChange={e=>{setSvCat(e.target.value);setSvSub("All");setSvSvcId("");}}>{cats.map(c=><option key={c}>{c}</option>)}</select><select style={S.inp} value={svSub} onChange={e=>{setSvSub(e.target.value);setSvSvcId("");}}>{svSubs.map(x=><option key={x}>{x}</option>)}</select></div>
              <select style={S.inp} value={svSvcId} onChange={e=>setSvSvcId(e.target.value)}><option value="">Select a service...</option>{svAvail.map(s=><option key={s.id} value={String(s.id)}>{s.name} — {money(s.price)}</option>)}</select>
              <button style={S.btnS} onClick={addSvc}>{t("addService")}</button>
              {act.services.some(l=>l.status==="On Hold")&&<div style={{background:"#f3e8ff",border:"1px solid #c084fc",borderRadius:10,padding:"8px 12px",fontSize:12,color:"#6b21a8",fontWeight:600}}>⏸ Some services are On Hold — they will auto-activate when the current service is completed and this customer gets priority.</div>}
            </>}
            <SLines visit={act} emps={emps} mode="supervisor" onUpd={(l,f,v)=>updLine(act.id,l,f,v)} onRem={l=>remLine(act.id,l)} onMove={(l,d)=>moveLine(act.id,l,d)}/>
            {!["Paid & Closed","Ready for Payment"].includes(act.status)&&<button style={S.btnP} onClick={markReady}>{t("markReady")}</button>}
          </>}
        </section>
      </main></ErrorBoundary>}

      {tab==="Checkout"&&<main style={{display:"grid",gridTemplateColumns:gc,gap:14}}>
        <section style={S.card}><h2 style={S.ct}>{t("checkoutToday")}</h2>
          <input style={S.inp} placeholder={t("searchCheckout")} value={coQ} onChange={e=>setCoQ(e.target.value)}/>
          {coList.length===0&&<EMP>No active customers today.</EMP>}
          {coList.map(v=><button key={v.id} style={actId===v.id?S.liA:S.liB} onClick={()=>setActId(v.id)}><span>#{v.queue} — {v.name}</span><span style={SB(v.status)}>{v.status==="Ready for Payment"?"Ready — "+money(v.totalService):v.status}</span></button>)}
        </section>
        <section style={S.card}>
          {!act?<EMP>← Select customer to process payment.</EMP>
           :act.status==="Paid & Closed"?<div>
            <div style={{background:"#dcfce7",color:"#166534",borderRadius:11,padding:16,fontSize:15,fontWeight:700,marginBottom:10}}>✓ Paid — {money(act.totalPaid)} via {act.paymentMethod}</div>
            <button style={{...S.btnS,display:"flex",alignItems:"center",gap:6,justifyContent:"center"}} onClick={()=>printReceipt(act,emps)}>{t("printReceipt")}</button>
            <button style={{...S.btnS,color:"#dc2626",borderColor:"#fca5a5"}} onClick={()=>setShowRefund(v=>!v)}>↩ Issue Refund</button>
            {showRefund&&<div style={{background:"#fff5f5",border:"1px solid #fca5a5",borderRadius:12,padding:14,marginTop:6}}>
              <p style={{margin:"0 0 8px",fontWeight:800,fontSize:13,color:"#991b1b"}}>Issue Refund for {act.name}</p>
              <p style={{margin:"0 0 8px",fontSize:12,color:"#6b7280"}}>Paid: {money(act.totalPaid)} · Max refund: {money(act.totalPaid)}</p>
              <input style={S.inp} type="number" placeholder="Refund amount (Birr)" value={refundAmt} onChange={e=>setRefundAmt(e.target.value)}/>
              <input style={S.inp} placeholder="Reason (optional)" value={refundReason} onChange={e=>setRefundReason(e.target.value)}/>
              <button style={{...S.btnP,background:"#dc2626",color:"#fff"}} onClick={()=>processRefund(act.id)}>Confirm Refund</button>
            </div>}
          </div>
           :!act.services?<EMP>Loading...</EMP>:<><h2 style={S.ct}>#{act.queue} — {act.name}</h2>
            <SLines visit={act} emps={emps} mode="checkout" onUpd={(l,f,v)=>updLine(act.id,l,f,v)} onRem={l=>remLine(act.id,l)} onMove={(l,d)=>moveLine(act.id,l,d)}/>
            <HR/><h3 style={{margin:"0 0 4px",fontWeight:800}}>Tips</h3><p style={S.hlp}>Tips go directly to employees, not counted as revenue.</p>
            <div style={S.r2}><select style={S.inp} value={tipEmp} onChange={e=>setTipEmp(e.target.value)}><option value="">Select employee</option>{emps.filter(e=>e.active).map(e=><option key={e.id}>{e.name}</option>)}</select><input style={S.inp} type="number" value={tipAmt} onChange={e=>setTipAmt(e.target.value)} placeholder="Amount (Birr)"/></div>
            <button style={S.btnS} onClick={addTip}>{t("addTip")}</button>
            {tips.map(t=><div key={t.id} style={S.li}><span>{t.employee}</span><span style={{display:"flex",gap:8,alignItems:"center"}}><b>{money(t.amount)}</b><button style={S.btnD} onClick={()=>setTips(p=>p.filter(x=>x.id!==t.id))}>×</button></span></div>)}
            <HR/><L>Payment Method</L>
            <select style={S.inp} value={payM} onChange={e=>setPayM(e.target.value)}><option>Cash</option><option>Transfer</option><option>Telebirr</option><option>Card</option></select>
            <div style={S.tb}><span>Service Total</span><b>{money(act.totalService)}</b></div>
            {tips.length>0&&<div style={{...S.tb,background:"#1e3a2f",marginTop:6}}><span>Tips Total</span><b>{money(tips.reduce((s,t)=>s+t.amount,0))}</b></div>}
            <div style={{...S.tb,marginTop:6,fontSize:16,background:"#0f172a"}}><span>Customer Pays</span><b>{money(act.totalService+tips.reduce((s,t)=>s+t.amount,0))}</b></div>
            {act.groupName&&<>
              <div style={{border:"1px solid #e0b85a",borderRadius:11,padding:12,marginBottom:6,background:"#fff"}}>
                <p style={{margin:"0 0 8px",fontWeight:800,fontSize:13,color:"#374151"}}>Group Payment Options</p>
                <button style={{...S.btnP,marginBottom:6}} onClick={()=>confirmPay(true)}>Pay Together — Whole Group ({money(visits.filter(v=>v.groupId===act.groupId&&v.status!=="Cancelled").reduce((s,v)=>s+v.totalService,0))})</button>
                <button style={{...S.btnS,marginBottom:0}} onClick={()=>setSplitMode(v=>!v)}>Split Payment — Each Pays Their Own</button>
              </div>
              {splitMode&&<div style={{background:"#f0fdf4",border:"1px solid #86efac",borderRadius:11,padding:12,marginBottom:6}}>
                <p style={{margin:"0 0 8px",fontWeight:800,fontSize:13,color:"#166534"}}>Individual Payments</p>
                {visits.filter(v=>v.groupId===act.groupId&&v.status!=="Cancelled").map(v=><div key={v.id} style={{...S.li,marginBottom:6,background:v.status==="Paid & Closed"?"#dcfce7":"#fff"}}>
                  <div><b>{v.name}</b><p style={S.hlp}>{money(v.totalService)}</p></div>
                  {v.status==="Paid & Closed"?<span style={{color:"#166534",fontWeight:700}}>✓ Paid</span>:<button style={{...S.btnP,width:"auto",padding:"6px 14px",marginBottom:0}} onClick={async()=>{setVisits(prev=>prev.map(x=>x.id===v.id?{...x,status:"Paid & Closed",paymentMethod:payM,totalPaid:v.totalService}:x));await supabase.from("visits").update({payment_method:payM,total_paid:v.totalService,status:"Paid & Closed",tips:[]}).eq("id",v.id);}}>Pay {money(v.totalService)}</button>}
                </div>)}
              </div>}
            </>}
            {!act.groupName&&<button style={S.btnP} onClick={()=>confirmPay(false)}>{t("confirmPaid")}</button>}
            {act.groupName&&!splitMode&&<button style={S.btnP} onClick={()=>confirmPay(false)}>Pay This Person Only</button>}
          </>}
        </section>
      </main>}

      {tab==="Bookings"&&<section style={S.card}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",flexWrap:"wrap",gap:10,marginBottom:14}}>
          <h2 style={{...S.ct,margin:0}}>{t("bookingMgmt")}</h2>
          <div style={{display:"flex",gap:8,alignItems:"flex-end",flexWrap:"wrap"}}>
            <EthPicker value={bkDate} onChange={d=>setBkDate((d||"").slice(0,10))}/>
            {user.role!=="supervisor"&&<>
              <button style={{...S.btnP,width:"auto",padding:"10px 16px",marginBottom:0,background:"#0f766e",color:"#fff"}} onClick={()=>{setShowWalkIn(true);setWiSvcId("");setWiName("");setWiPhone("");setWiNote("");}}>{t("spaWalkIn")}</button>
              <button style={{...S.btnP,width:"auto",padding:"10px 16px",marginBottom:0}} onClick={()=>{setShowBkF(true);setEditBk(null);setBkF({customerName:"",customerPhone:"",serviceId:"",date:(bkDate||todayStr()).slice(0,10),time:"10:00",people:1,notes:""});setBkWarn("");}}>{t("newBooking")}</button>
            </>}
          </div>
        </div>

        {showWalkIn&&user.role!=="supervisor"&&<div style={{background:"#f0fdfa",border:"1px solid #0f766e",borderRadius:16,padding:18,marginBottom:16}}>
          <h3 style={{margin:"0 0 12px",fontWeight:800,color:"#0f766e"}}>🚶 Spa Walk-in — Add to Queue Now</h3>
          <div style={{display:"grid",gridTemplateColumns:sc.mob?"1fr":"1fr 1fr",gap:10}}>
            <div><L>Customer Name *</L><input style={S.inp} value={wiName} onChange={e=>setWiName(e.target.value)} placeholder="Full name"/></div>
            <div><L>Phone *</L><div style={S.r2}><input style={S.inp} value={wiPhone} onChange={e=>setWiPhone(e.target.value)} placeholder="Phone"/><button style={S.btnS} onClick={()=>{const f=custs.find(c=>c.phone===wiPhone.trim());if(f)setWiName(f.name);}}>{t("recall")}</button></div></div>
            <div style={{gridColumn:"1/-1"}}><L>Spa Service *</L>
              <select style={{...S.inp,background:"#fff",color:"#111827"}} value={wiSvcId} onChange={e=>setWiSvcId(e.target.value)}>
                <option value="">— Select spa service —</option>
                {["Moroccan Bath","Steam & Sauna","Massage"].map(sub=>{const items=bkSvcs.filter(s=>s.sub===sub);if(!items.length)return null;return <optgroup key={sub} label={"── "+sub+" ──"}>{items.map(s=><option key={s.id} value={String(s.id)}>{s.name} — {money(s.price)}</option>)}</optgroup>;})}
              </select>
            </div>
            <div style={{gridColumn:"1/-1"}}><L>Note</L><input style={S.inp} value={wiNote} onChange={e=>setWiNote(e.target.value)} placeholder="Any special requests"/></div>
          </div>
          <div style={S.r2}><button style={{...S.btnP,background:"#0f766e",color:"#fff"}} onClick={addSpaWalkIn}>Add to Queue</button><button style={S.btnS} onClick={()=>setShowWalkIn(false)}>{t("cancel")}</button></div>
        </div>}

        {showBkF&&user.role!=="supervisor"&&<div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:16,padding:18,marginBottom:16}}>
          <h3 style={{margin:"0 0 12px",fontWeight:800}}>{editBk?t("edit"):"New"} Booking</h3>
          {bkWarn&&<div style={{background:"#fef3c7",color:"#92400e",borderRadius:10,padding:"10px 14px",marginBottom:10,fontSize:13,fontWeight:700}}>{bkWarn}</div>}
          <div style={{display:"grid",gridTemplateColumns:sc.mob?"1fr":"1fr 1fr",gap:10}}>
            <div><L>Customer Name *</L><input style={S.inp} value={bkF.customerName} onChange={e=>setBkF(p=>({...p,customerName:e.target.value}))} placeholder="Full name"/></div>
            <div><L>Phone *</L><div style={S.r2}><input style={S.inp} value={bkF.customerPhone} onChange={e=>setBkF(p=>({...p,customerPhone:e.target.value}))} placeholder="Phone"/><button style={S.btnS} onClick={()=>{const f=custs.find(c=>c.phone===bkF.customerPhone.trim());if(f)setBkF(p=>({...p,customerName:f.name}));}}>{t("recall")}</button></div></div>
            <div style={{gridColumn:"1/-1"}}>
              <L>Service * (Spa services only)</L>
              <select style={{...S.inp,background:"#fff",color:"#111827",borderColor:bkF.serviceId?"#111827":"#d1d5db"}}
                value={String(bkF.serviceId||"")}
                onChange={e=>{const sid=e.target.value;setBkF(p=>({...p,serviceId:sid}));if(sid){const warn=checkConflict(bks,{...bkF,serviceId:sid},svcs);setBkWarn(warn||"");}else setBkWarn("");}}>
                <option value="">— To Be Confirmed (TBD) —</option>
                {["Moroccan Bath","Steam & Sauna","Massage"].map(sub=>{const items=bkSvcs.filter(s=>s.sub===sub);if(!items.length)return null;return <optgroup key={sub} label={"── "+sub+" ──"}>{items.map(s=><option key={s.id} value={String(s.id)}>{s.name} — {money(s.price)} ({s.durationMins}min)</option>)}</optgroup>;})}
              </select>
            </div>
            <div><EthPicker label="Date *" value={bkF.date} onChange={d=>setBkF(p=>({...p,date:d}))} minDate={todayStr()}/></div>
            <div><L>Time * (Ethiopian: {toEthTime(bkF.time)})</L><select style={S.inp} value={bkF.time} onChange={e=>setBkF(p=>({...p,time:e.target.value}))}>{timeSlots().map(t=><option key={t} value={t}>{t} ({toEthTime(t)})</option>)}</select></div>
            <div><L>Number of People</L><input style={S.inp} type="number" min="1" value={bkF.people} onChange={e=>setBkF(p=>({...p,people:e.target.value}))}/></div>
            <div><L>Notes</L><textarea style={S.ta} value={bkF.notes} onChange={e=>setBkF(p=>({...p,notes:e.target.value}))} rows={2}/></div>
          </div>
          <div style={S.r2}><button style={S.btnP} onClick={saveBk}>{t("saveBooking")}</button><button style={S.btnS} onClick={()=>{setShowBkF(false);setEditBk(null);setBkWarn("");}}>{t("cancel")}</button></div>
        </div>}

        <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:8,flexWrap:"wrap"}}>
          <input style={{...S.inp,marginBottom:0,flex:1,minWidth:180}} placeholder="Search by name, phone or service..." value={bkSearch} onChange={e=>setBkSearch(e.target.value)}/>
          {bkSearch&&<button style={{...S.btnD,whiteSpace:"nowrap"}} onClick={()=>setBkSearch("")}>Clear</button>}
          <button style={{...S.btnS,width:"auto",padding:"8px 14px",marginBottom:0}} onClick={async()=>{const{data,error}=await supabase.from("bookings").select("*").order("date",{ascending:true}).order("time",{ascending:true});if(data){setBks(data.map(dbBk));push("Loaded "+data.length+" bookings","success");}if(error)push("Error: "+error.message,"warning");}}>{t("refresh")}</button>
        </div>
        <div style={{background:"#f0f9ff",border:"1px solid #bae6fd",borderRadius:10,padding:"8px 12px",marginBottom:10,fontSize:12,color:"#0369a1"}}>
          📊 {bks.length} total bookings in system · {bks.filter(b=>b.date===bkDate).length} on selected date · {bks.filter(b=>b.status==="Pending").length} pending
        </div>
        <h3 style={S.sh}>📅 {bkDate} — Schedule <span style={{fontSize:11,fontWeight:400,color:"#6b7280"}}>({todayBk.filter(b=>!["Cancelled","No-show"].includes(b.status)).length} active booking{todayBk.filter(b=>!["Cancelled","No-show"].includes(b.status)).length!==1?"s":""})</span></h3>
        {todayBk.filter(b=>!["Cancelled","No-show"].includes(b.status)).length===0&&<div style={{background:"#f0f9ff",border:"1px solid #bae6fd",borderRadius:12,padding:16,marginBottom:16}}><p style={{color:"#0369a1",fontSize:13,margin:"0 0 6px",fontWeight:700}}>No bookings found for {bkDate}</p><p style={{color:"#6b7280",fontSize:11,margin:0}}>Total bookings in system: {bks.length}. Try clicking 🔄 Refresh. If you just created a booking, refresh the page.</p></div>}
        
        <div style={{border:"1px solid #ecdba3",borderRadius:12,overflow:"hidden",marginBottom:16}}>
          {timeSlots().map(slot=>{
            // Use minutes-since-midnight for reliable comparison
            const toMins=t=>{const[h,m]=(t||"00:00").split(":").map(Number);return h*60+m;};
            const slotMins=toMins(slot);
            const slotEndMins=slotMins+30;
            const slotBks=todayBk.filter(b=>{
              if(["Cancelled","No-show"].includes(b.status))return false;
              const bStartMins=toMins(b.time);
              const bEndMins=bStartMins+Number(b.durationMins||60);
              return bStartMins<slotEndMins&&bEndMins>slotMins;
            });
            const isOccupied=slotBks.length>0;
            const isStartSlot=slotBks.some(b=>b.time===slot);
            return <div key={slot} style={{display:"grid",gridTemplateColumns:"80px 1fr",borderBottom:"1px solid #ecdba3",background:isOccupied?"#fff":"#fffdf7"}}>
              <div style={{padding:"10px 8px",background:isOccupied?"#f0f9ff":"#f9f5eb",fontSize:12,fontWeight:700,color:isOccupied?"#1e40af":"#6b4c11",textAlign:"center",borderRight:"1px solid #ecdba3",display:"flex",flexDirection:"column",justifyContent:"center"}}>
                <div>{slot}</div>
                <div style={{fontSize:10,fontWeight:400,color:isOccupied?"#3b82f6":"#92400e"}}>{toEthTime(slot)}</div>
              </div>
              <div style={{padding:"6px 10px",minHeight:40}}>
                {!isOccupied&&<span style={{color:"#9ca3af",fontSize:11,lineHeight:"28px",fontStyle:"italic"}}>{t("available")}</span>}
                {isStartSlot&&slotBks.filter(b=>b.time===slot).map(b=>{
                  const c=BKC[b.status]||{bg:"#f3f4f6",co:"#374151"};
                  return <div key={b.id} style={{background:c.bg,borderRadius:8,padding:"6px 10px",marginBottom:3,border:"1px solid "+c.co+"44"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:6}}>
                      <div>
                        <span style={{background:c.co,color:"#fff",borderRadius:6,padding:"1px 8px",fontSize:10,fontWeight:800,marginRight:6}}>{b.status}</span>
                        <b style={{fontSize:13,color:"#111827"}}>{b.customerName}</b>
                        <span style={{fontSize:11,color:"#374151",marginLeft:6}}>{b.serviceName}</span>
                        <div style={{fontSize:11,color:"#374151",marginTop:2}}>
                          ⏱ {b.durationMins}min · {b.time}–{(()=>{const[h,m]=b.time.split(":").map(Number);const total=h*60+m+Number(b.durationMins||60);return String(Math.floor(total/60)%24).padStart(2,"0")+":"+String(total%60).padStart(2,"0");})()}
                          {" · "}{b.people} person{b.people>1?"s":""}
                          {b.notes&&<span style={{fontStyle:"italic",color:"#6b7280"}}> · "{b.notes}"</span>}
                        </div>
                        <div style={{fontSize:10,color:"#9ca3af",marginTop:1}}>By {b.createdBy} · {b.customerPhone}</div>
                      </div>
                      {user.role!=="supervisor"&&<div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                        {b.status==="Pending"&&<button style={{...S.btnS,width:"auto",padding:"3px 10px",marginBottom:0,fontSize:11}} onClick={()=>updBk(b.id,"Confirmed")}>{t("confirmBooking")}</button>}
                        {b.status==="Confirmed"&&<button style={{...S.btnP,width:"auto",padding:"3px 10px",marginBottom:0,fontSize:11}} onClick={()=>checkIn(b)}>{t("checkIn")}</button>}
                        {b.status==="Arrived"&&<><span style={{color:"#166534",fontWeight:700,fontSize:11,padding:"3px 8px"}}>✓ Checked In</span><button style={{...S.btnS,width:"auto",padding:"3px 10px",marginBottom:0,fontSize:11}} onClick={()=>updBk(b.id,"Completed")}>{t("markDone")}</button></>}
                        {!["Completed","Cancelled","No-show","Arrived"].includes(b.status)&&<button style={{...S.btnS,width:"auto",padding:"3px 8px",marginBottom:0,fontSize:11}} onClick={()=>{setEditBk(b);setShowBkF(true);setBkF({customerName:b.customerName,customerPhone:b.customerPhone,serviceId:String(b.serviceId),date:b.date,time:b.time,people:b.people,notes:b.notes});}}>Edit</button>}
                        {!["Completed","Cancelled"].includes(b.status)&&<button style={{...S.btnD,padding:"3px 8px",fontSize:10}} onClick={()=>updBk(b.id,"Cancelled")}>{t("cancel")}</button>}
                        <button style={{...S.btnD,padding:"3px 8px",fontSize:10}} onClick={()=>delBk(b.id)}>Delete</button>
                      </div>}
                    </div>
                  </div>;
                })}
                {isOccupied&&!isStartSlot&&<span style={{color:"#93c5fd",fontSize:11,fontStyle:"italic",lineHeight:"28px"}}>{t("continuing")}</span>}
              </div>
            </div>;
          })}
        </div>

        <HR/><h3 style={S.sh}>{t("upcoming7")}</h3>
        {bks.filter(b=>(b.date||'').slice(0,10)>todayStr()&&(b.date||'').slice(0,10)<=new Date(Date.now()+7*86400000).toISOString().slice(0,10)&&!["Cancelled","No-show","Completed"].includes(b.status)).sort((a,b)=>a.date.localeCompare(b.date)||a.time.localeCompare(b.time)).map(b=><div key={b.id} style={S.li}><div><b style={{color:"#111827"}}>{b.date} at {b.time} ({toEthTime(b.time)})</b><p style={{...S.hlp,color:"#374151"}}>{b.customerName} · {b.serviceName}</p></div><span style={SB(b.status)}>{b.status}</span></div>)}
      </section>}


      {tab==="Service Setup"&&<section style={S.card}><h2 style={S.ct}>Service & Price Management</h2>
        <div style={{display:"grid",gridTemplateColumns:sc.mob?"1fr":"1fr 1fr",gap:20,marginBottom:16}}>
          <div><h3 style={S.sh}>Categories</h3><div style={S.r2}><input style={S.inp} value={newCat} onChange={e=>setNewCat(e.target.value)} placeholder="New category" onKeyDown={e=>e.key==="Enter"&&addCat()}/><button style={S.btnS} onClick={addCat}>+ Add</button></div><div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{cats.map(c=><span key={c} style={{background:"#e0b85a",color:"#111827",borderRadius:14,padding:"2px 10px",fontSize:11,fontWeight:700}}>{c}</span>)}</div></div>
          <div><h3 style={S.sh}>Add New Service</h3>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              <select style={S.inp} value={nSvc.category} onChange={e=>setNSvc({...nSvc,category:e.target.value,employeeSection:e.target.value})}>{cats.map(c=><option key={c}>{c}</option>)}</select>
              <input style={S.inp} value={nSvc.sub} onChange={e=>setNSvc({...nSvc,sub:e.target.value})} placeholder="Sub-category"/>
              <input style={{...S.inp,gridColumn:"1/-1"}} value={nSvc.name} onChange={e=>setNSvc({...nSvc,name:e.target.value})} placeholder="Service name"/>
              <input style={S.inp} type="number" value={nSvc.price} onChange={e=>setNSvc({...nSvc,price:e.target.value})} placeholder="Price (Birr)"/>
              <input style={S.inp} type="number" value={nSvc.commission} onChange={e=>setNSvc({...nSvc,commission:e.target.value})} placeholder="Commission %"/>
              <input style={S.inp} type="number" value={nSvc.durationMins} onChange={e=>setNSvc({...nSvc,durationMins:e.target.value})} placeholder="Duration (min)"/>
              <label style={{display:"flex",alignItems:"center",gap:6,fontSize:12}}><input type="checkbox" checked={nSvc.bookable} onChange={e=>setNSvc({...nSvc,bookable:e.target.checked})}/> Bookable (Spa)</label>
              <button style={{...S.btnP,gridColumn:"1/-1"}} onClick={addSvc2}>{t("addService")}</button>
            </div>
          </div>
        </div>
        <HR/><h3 style={S.sh}>All Services ({svcs.length}) — grouped by category</h3>
        <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:12}}>{["All",...cats].map(c=><button key={c} style={svcF===c?S.tabA:S.tab} onClick={()=>setSvcF(c)}>{c}</button>)}</div>
        {(svcF==="All"?cats:[svcF]).map(cat=>{
          const catSvcs=svcs.filter(s=>s.category===cat);
          const subs=[...new Set(catSvcs.map(s=>s.sub))];
          return <div key={cat} style={{marginBottom:20}}>
            <h4 style={{margin:"0 0 10px",fontSize:14,fontWeight:900,color:"#6b4c11",borderBottom:"2px solid #e0b85a",paddingBottom:6}}>{cat} ({catSvcs.length} services)</h4>
            {subs.map(sub=><div key={sub} style={{marginBottom:12}}>
              {sub&&<p style={{...S.hlp,fontWeight:800,margin:"0 0 5px",fontSize:12}}>— {sub}</p>}
              <div style={{overflowX:"auto"}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 85px 55px 65px 50px 32px",gap:4,padding:"4px 8px",background:"#e0b85a",borderRadius:8,marginBottom:4,fontSize:10,fontWeight:800,color:"#111827",minWidth:480}}><span>Name</span><span>Price</span><span>Cm%</span><span>Min</span><span>Book</span><span></span></div>
                {catSvcs.filter(s=>s.sub===sub).map(s=><div key={s.id} style={{display:"grid",gridTemplateColumns:"1fr 85px 55px 65px 50px 32px",gap:4,padding:"4px 8px",background:"#fff",borderRadius:8,marginBottom:3,alignItems:"center",border:"1px solid #ecdba3",minWidth:480}}>
                  <input value={s.name} onChange={e=>updSvc(s.id,"name",e.target.value)} style={S.ii}/>
                  <input type="number" value={s.price}        onChange={e=>updSvc(s.id,"price",e.target.value)}        style={{...S.ii,textAlign:"right"}}/>
                  <input type="number" value={s.commission}   onChange={e=>updSvc(s.id,"commission",e.target.value)}   style={{...S.ii,textAlign:"right"}}/>
                  <input type="number" value={s.durationMins} onChange={e=>updSvc(s.id,"durationMins",e.target.value)} style={{...S.ii,textAlign:"right"}}/>
                  <input type="checkbox" checked={!!s.bookable} onChange={e=>updSvc(s.id,"bookable",e.target.checked)} style={{margin:"0 auto",display:"block"}}/>
                  <button style={S.btnD} onClick={()=>delSvc(s.id)}>×</button>
                </div>)}
              </div>
            </div>)}
          </div>;
        })}
      </section>}

      {tab==="Inventory"&&<section style={S.card}>
        <h2 style={S.ct}>📦 Inventory Management</h2>
        {lowStock.length>0&&<div style={{background:"#fff5f5",border:"1px solid #fca5a5",borderRadius:12,padding:12,marginBottom:14}}>
          <p style={{margin:0,fontWeight:800,color:"#dc2626",fontSize:13}}>⚠️ Low Stock Alert ({lowStock.length} items)</p>
          {lowStock.map(i=><p key={i.id} style={{margin:"4px 0 0",fontSize:12,color:"#991b1b"}}>· {i.name} — {i.qty} {i.unit} remaining (min: {i.minQty})</p>)}
        </div>}
        <h3 style={S.sh}>Add Item</h3>
        <div style={{display:"grid",gridTemplateColumns:sc.mob?"1fr 1fr":"repeat(6,1fr)",gap:8,marginBottom:12}}>
          <input style={S.inp} placeholder="Item name" value={nInv.name} onChange={e=>setNInv({...nInv,name:e.target.value})}/>
          <select style={S.inp} value={nInv.category} onChange={e=>setNInv({...nInv,category:e.target.value})}>{INV_CATS.map(c=><option key={c}>{c}</option>)}</select>
          <input style={S.inp} type="number" placeholder="Quantity" value={nInv.qty} onChange={e=>setNInv({...nInv,qty:e.target.value})}/>
          <input style={S.inp} placeholder="Unit (pcs/ml/g)" value={nInv.unit} onChange={e=>setNInv({...nInv,unit:e.target.value})}/>
          <input style={S.inp} type="number" placeholder="Min qty (alert)" value={nInv.minQty} onChange={e=>setNInv({...nInv,minQty:e.target.value})}/>
          <button style={{...S.btnP,marginBottom:8}} onClick={addInvItem}>+ Add</button>
        </div>
        <HR/>
        {INV_CATS.map(cat=>{const items=inventory.filter(i=>i.category===cat);if(!items.length)return null;return(<div key={cat} style={{marginBottom:16}}>
          <h3 style={S.sh}>{cat}</h3>
          {items.map(i=>{const low=i.minQty>0&&i.qty<=i.minQty;return <div key={i.id} style={{...S.li,background:low?"#fff5f5":"#fff",border:low?"1px solid #fca5a5":"1px solid #e5e7eb"}}>
            <div><b style={{color:low?"#dc2626":"#111827"}}>{i.name}</b><p style={S.hlp}>{i.category} · {money(i.price)} per {i.unit}{i.minQty>0?" · Min: "+i.minQty:""}</p></div>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <button onClick={()=>updInvQty(i.id,-1)} style={{width:28,height:28,borderRadius:8,border:"1px solid #e5e7eb",background:"#f9fafb",cursor:"pointer",fontWeight:900}}>−</button>
              <b style={{fontSize:16,color:low?"#dc2626":"#111827",minWidth:40,textAlign:"center"}}>{i.qty}</b>
              <span style={{fontSize:12,color:"#6b7280"}}>{i.unit}</span>
              <button onClick={()=>updInvQty(i.id,1)} style={{width:28,height:28,borderRadius:8,border:"1px solid #e5e7eb",background:"#f9fafb",cursor:"pointer",fontWeight:900}}>+</button>
              <button onClick={()=>delInvItem(i.id)} style={{...S.btnD,width:"auto",padding:"4px 8px",marginBottom:0,fontSize:11}}>×</button>
            </div>
          </div>;})}
        </div>);})}
        {inventory.length===0&&<EMP>No inventory items yet. Add items above to track stock levels.</EMP>}
      </section>}

      {tab==="Daily Closing"&&<section style={S.card}><h2 style={S.ct}>Daily Closing Report</h2>
        <div style={{display:"flex",alignItems:"flex-end",gap:12,marginBottom:18,flexWrap:"wrap"}}><EthPicker label="Date" value={clDate} onChange={setClDate}/><button style={{...S.btnS,width:"auto",padding:"10px 16px",marginBottom:0}} onClick={doExportCSV}>⬇ Export CSV</button></div>
        <div style={{display:"grid",gridTemplateColumns:sc.mob?"1fr 1fr":"repeat(4,1fr)",gap:10,marginBottom:12}}>
          <SC label="Revenue"          value={money(clRev)}/><SC label="Cash In"         value={money(clCash)}/><SC label="Transfer/Card" value={money(clTr)}/><SC label="Tips Collected" value={money(clTips)}/>
          <SC label="Daily Expenses"   value={money(clDE)}   accent/><SC label="Net Cash"        value={money(clNet)}/><SC label="Grand Total"  value={money(clGr)}  highlight/><SC label="Profit" value={money(clPr)} highlight/>
        </div>
        <p style={S.hlp}>Net Cash = Cash In − Tips − Daily Expenses. Grand Total adds Transfer/Card.</p>
        <HR/><h3 style={S.sh}>Tips by Employee</h3>{clTipBr.length===0?<p style={S.hlp}>No tips.</p>:clTipBr.map(t=><div key={t.employee} style={S.li}><span>{t.employee}</span><b>{money(t.amount)}</b></div>)}
        <HR/><h3 style={S.sh}>Paid Visits ({clV.filter(v=>v.status==="Paid & Closed").length})</h3>
        {clV.filter(v=>v.status==="Paid & Closed").map(v=><div key={v.id} style={S.li}><span>#{v.queue} — {v.name}</span><span style={{display:"flex",gap:10}}><span style={S.hlp}>{v.paymentMethod}</span><b>{money(v.totalService)}</b></span></div>)}
      </section>}

      {tab==="Expenses"&&<section style={S.card}><h2 style={S.ct}>General Expense Management</h2>
        <div style={{display:"grid",gridTemplateColumns:sc.mob?"1fr":"1fr 1fr 1fr 1fr",gap:10,marginBottom:10}}>
          <div><L>Date</L><EthPicker value={gDate} onChange={setGDate}/></div>
          <div><L>Name</L><input style={S.inp} value={gName} onChange={e=>setGName(e.target.value)} placeholder="e.g. Shampoo restock"/></div>
          <div><L>Reason</L><input style={S.inp} value={gRsn} onChange={e=>setGRsn(e.target.value)} placeholder="Optional"/></div>
          <div><L>Amount (Birr)</L><input style={S.inp} type="number" value={gAmt} onChange={e=>setGAmt(e.target.value)} placeholder="0"/></div>
        </div>
        <button style={S.btnP} onClick={addGE}>{t("saveExpense")}</button><HR/>
        <div style={S.tb}><span>All-Time Total</span><b>{money(exps.filter(e=>e.type==="General").reduce((s,e)=>s+Number(e.total||0),0))}</b></div><HR/>
        {exps.filter(e=>e.type==="General").sort((a,b)=>b.date.localeCompare(a.date)).map(e=><div key={e.id} style={S.li}><div><div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center"}}><b>{e.name}</b>{e.category&&<span style={{background:"#eff6ff",color:"#1d4ed8",borderRadius:6,padding:"1px 7px",fontSize:10,fontWeight:700}}>{e.category}</span>}</div>{e.reason&&<p style={S.hlp}>{e.reason}</p>}<p style={{...S.hlp,fontSize:10}}>{e.date}</p></div><span style={{display:"flex",alignItems:"center",gap:8}}><b>{money(e.total)}</b><button style={S.btnD} onClick={()=>delE(e.id)}>×</button></span></div>)}
      </section>}

      {tab==="Customers"&&<section style={S.card}><h2 style={S.ct}>Customer Database ({custs.length})</h2>
        <input style={S.inp} placeholder="Search by name, phone or ID..." value={cSearch} onChange={e=>setCSearch(e.target.value)}/>
        {fCusts.map(c=>{const cv=visits.filter(v=>v.customerId===c.id&&v.status==="Paid & Closed");
              const cbks=bks.filter(b=>b.customerId===c.id);
              const all=cv.flatMap(v=>v.services.map(s=>s.name));
              const fav=all.length?all.sort((a,b)=>all.filter(x=>x===b).length-all.filter(x=>x===a).length)[0]:"None";
              const spent=cv.reduce((s,v)=>s+Number(v.totalService||0),0);
              const tier=spent>=10000?{label:"Gold ⭐",bg:"#fef3c7",co:"#b45309"}:spent>=5000?{label:"Silver 🥈",bg:"#f1f5f9",co:"#475569"}:spent>=1000?{label:"Bronze 🥉",bg:"#fef9ec",co:"#92400e"}:{label:"New 🌱",bg:"#f0fdf4",co:"#166534"};
              return <div key={c.id} style={{...S.li,flexDirection:"column",alignItems:"stretch"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                  <div>
                    <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                      <b style={{fontSize:15,color:"#111827"}}>{c.name}</b>
                      <span style={{background:tier.bg,color:tier.co,borderRadius:20,padding:"2px 10px",fontSize:11,fontWeight:700}}>{tier.label}</span>
                    </div>
                    <p style={{margin:"2px 0 0",fontSize:12,color:"#6b7280"}}>{c.phone}</p>
                  </div>
                  <button style={{...S.btnD,width:"auto",padding:"4px 12px",marginBottom:0,fontSize:11}} onClick={()=>delCust(c.id)}>Delete</button>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6}}>
                  <div style={{background:"#f9fafb",borderRadius:9,padding:"7px 8px",textAlign:"center"}}><p style={{margin:0,fontSize:9,color:"#6b7280",fontWeight:700}}>VISITS</p><b style={{color:"#111827",fontSize:13}}>{cv.length}</b></div>
                  <div style={{background:"#f9fafb",borderRadius:9,padding:"7px 8px",textAlign:"center"}}><p style={{margin:0,fontSize:9,color:"#6b7280",fontWeight:700}}>BOOKINGS</p><b style={{color:"#111827",fontSize:13}}>{cbks.length}</b></div>
                  <div style={{background:"#f0fdf4",borderRadius:9,padding:"7px 8px",textAlign:"center"}}><p style={{margin:0,fontSize:9,color:"#166534",fontWeight:700}}>SPENT</p><b style={{color:"#166534",fontSize:11}}>{money(spent)}</b></div>
                  <div style={{background:"#f9fafb",borderRadius:9,padding:"7px 8px",textAlign:"center",overflow:"hidden"}}><p style={{margin:0,fontSize:9,color:"#6b7280",fontWeight:700}}>FAVOURITE</p><b style={{color:"#111827",fontSize:10,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",display:"block"}}>{fav}</b></div>
                </div>
              </div>;})}
      </section>}

      {tab==="Payroll"&&<section style={S.card}><h2 style={S.ct}>{t("payrollMgmt")}</h2>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10,marginBottom:12}}>
          <div><p style={{...S.hlp,margin:0,color:"#374151"}}>Current pay period</p><b style={{fontSize:15}}>{period.label}</b></div>
          <div style={{display:"flex",gap:8}}><button style={S.btnS} onClick={()=>window.print()}>Print</button><button style={{...S.btnP,width:"auto",padding:"10px 18px"}} onClick={closePeriod}>{t("closePayPeriod")}</button></div>
        </div>
        <div style={{background:"#fef9ec",border:"1px solid #e0b85a",borderRadius:11,padding:12,marginBottom:14,fontSize:13}}>Commissions update live. Close & Pay to freeze and reset for next period.</div>
        <h3 style={S.sh}>{t("addEmployee")}</h3>
        <div style={{display:"grid",gridTemplateColumns:sc.mob?"1fr 1fr":"1fr 1fr 1fr 1fr 1fr auto",gap:8,marginBottom:16}}>
          <input style={S.inp} value={nEmp.name} onChange={e=>setNEmp({...nEmp,name:e.target.value})} placeholder="Full name"/>
          <select style={S.inp} value={nEmp.section} onChange={e=>setNEmp({...nEmp,section:e.target.value})}>{EMP_SECTIONS.map(c=><option key={c}>{c}</option>)}</select>
          <input style={S.inp} value={nEmp.role} onChange={e=>setNEmp({...nEmp,role:e.target.value})} placeholder="Role (e.g. Nail Artist)"/>
          <input style={S.inp} type="number" value={nEmp.salary} onChange={e=>setNEmp({...nEmp,salary:e.target.value})} placeholder="Base salary"/>
          <input style={S.inp} type="date" value={nEmp.hireDate} onChange={e=>setNEmp({...nEmp,hireDate:e.target.value})}/>
          <button style={{...S.btnP,width:"auto",padding:"0 18px"}} onClick={addEmp}>+ Add</button>
        </div>
        <label style={{display:"flex",alignItems:"center",gap:6,fontSize:12,cursor:"pointer",marginBottom:10}}><input type="checkbox" checked={showFired} onChange={e=>setShowFired(e.target.checked)}/> Show inactive</label>

        {/* ── Availability Overview ── */}
        <div style={{background:"#f0fdf4",border:"1px solid #86efac",borderRadius:14,padding:14,marginBottom:16}}>
          <h3 style={{margin:"0 0 10px",fontSize:13,fontWeight:800,color:"#166534"}}>📅 Today's Availability — {new Date().toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"long"})}</h3>
          {EMP_SECTIONS.map(sec=>{
            const secEmps=emps.filter(e=>e.section===sec&&e.active);
            if(!secEmps.length)return null;
            const avail=secEmps.filter(e=>isEmpAvailableToday(e));
            const off=secEmps.filter(e=>!isEmpAvailableToday(e));
            return <div key={sec} style={{marginBottom:8}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                <b style={{fontSize:12,color:"#166534"}}>{sec}</b>
                <span style={{fontSize:11,fontWeight:700,background:avail.length>0?"#dcfce7":"#fee2e2",color:avail.length>0?"#166534":"#991b1b",borderRadius:8,padding:"1px 8px"}}>{avail.length} available</span>
              </div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                {avail.map(e=><span key={e.id} style={{background:"#fff",border:"1px solid #86efac",borderRadius:8,padding:"2px 8px",fontSize:11,color:"#166534",fontWeight:600}}>✅ {e.name}</span>)}
                {off.map(e=><span key={e.id} style={{background:"#fff",border:"1px solid #fca5a5",borderRadius:8,padding:"2px 8px",fontSize:11,color:"#991b1b",fontWeight:600}}>{e.onLeave?"🤒 On Leave":"📅 Day Off"} {e.name}</span>)}
              </div>
            </div>;
          })}
        </div>
        {emps.filter(e=>showFired||e.active).map(emp=>{const extra=empC.find(e=>e.id===emp.id);const d=Number(emp.salary||0)/30;const ad=d*Number(emp.absentDays||0);const net=Number(emp.salary||0)+Number(extra?.commissionTotal||0)-Number(emp.loan||0)-Number(emp.brokerFee||0)-Number(emp.otherDeduction||0)-ad;return(<div key={emp.id} style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:14,padding:14,marginBottom:10,opacity:emp.active?1:0.6}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10,flexWrap:"wrap",gap:8}}>
            <div><b style={{fontSize:15}}>{emp.name}</b><span style={{background:"#e0b85a",color:"#111827",borderRadius:14,padding:"2px 10px",fontSize:11,fontWeight:700,marginLeft:6}}>{emp.section}</span>{emp.role&&<span style={{background:"#dbeafe",color:"#1e40af",borderRadius:14,padding:"2px 8px",fontSize:10,fontWeight:700,marginLeft:4}}>{emp.role}</span>}{!isEmpAvailableToday(emp)&&emp.active&&<span style={{background:"#fee2e2",color:"#991b1b",borderRadius:14,padding:"2px 8px",fontSize:10,fontWeight:700,marginLeft:4}}>{emp.onLeave?"🤒 On Leave":"📅 Day Off Today"}</span>}</div>
            <button style={emp.active?S.btnD:S.btnS} onClick={()=>setEmpAct(emp.id,!emp.active)}>{emp.active?t("deactivate"):t("reactivate")}</button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:sc.mob?"1fr 1fr":"repeat(4,1fr)",gap:8,marginBottom:8}}>
            <FI label="Base Salary"      value={emp.salary}         onChange={v=>updEmp(emp.id,"salary",v)}         type="number"/>
            <FI label="Absent Days"      value={emp.absentDays}     onChange={v=>updEmp(emp.id,"absentDays",v)}     type="number"/>
            <FI label="Loan"             value={emp.loan}           onChange={v=>updEmp(emp.id,"loan",v)}           type="number" note={emp.loanNote}  onNote={v=>updEmp(emp.id,"loanNote",v)}/>
            <FI label="Broker Fee"       value={emp.brokerFee}      onChange={v=>updEmp(emp.id,"brokerFee",v)}      type="number"/>
            <FI label="Other Deduction"  value={emp.otherDeduction} onChange={v=>updEmp(emp.id,"otherDeduction",v)} type="number" note={emp.otherNote} onNote={v=>updEmp(emp.id,"otherNote",v)}/>
            <div style={{background:"#f0fdf4",borderRadius:10,padding:10,border:"1px solid #86efac"}}><p style={{fontSize:10,fontWeight:700,color:"#166534",marginBottom:4}}>Commission</p><b style={{color:"#166534",fontSize:14}}>{money(extra?.commissionTotal||0)}</b></div>
            <div>
              <p style={{fontSize:10,fontWeight:700,color:"#1f2937",margin:"0 0 4px"}}>Weekly Day Off</p>
              <select value={emp.dayOff??""} onChange={e=>{updEmp(emp.id,"dayOff",e.target.value===""?null:e.target.value);push("Day off saved for "+emp.name,"success");}} style={{width:"100%",padding:"7px 9px",borderRadius:9,border:"1px solid #d1d5db",background:"#fff",fontSize:12,color:"#111827"}}>
                <option value="">No fixed day off</option>
                {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d,i)=><option key={i} value={i}>{d}</option>)}
              </select>
            </div>
            <div>
              <p style={{fontSize:10,fontWeight:700,color:"#1f2937",margin:"0 0 4px"}}>Availability</p>
              <label style={{display:"flex",alignItems:"center",gap:6,fontSize:12,cursor:"pointer",background:emp.onLeave?"#fee2e2":"#f0fdf4",padding:"7px 10px",borderRadius:9,border:"1px solid "+(emp.onLeave?"#fca5a5":"#86efac")}}>
                <input type="checkbox" checked={!!emp.onLeave} onChange={e=>{updEmp(emp.id,"onLeave",e.target.checked);push(emp.name+(e.target.checked?" marked On Leave":" marked Available"),"success");}}/>
                <span style={{color:emp.onLeave?"#991b1b":"#166534",fontWeight:700}}>{emp.onLeave?"🤒 On Leave":"✅ Available"}</span>
              </label>
            </div>
          </div>
          {extra?.breakdown?.length>0&&<details style={{marginBottom:8}}><summary style={{...S.hlp,cursor:"pointer",fontWeight:700}}>Breakdown ({extra.breakdown.length})</summary><div style={{paddingLeft:10,paddingTop:4}}>{extra.breakdown.map((b,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",fontSize:12,borderBottom:"1px solid #ecdba3",padding:"2px 0"}}><span>{b.name}</span><span>{money(b.income)} → {money(b.commission)}</span></div>)}</div></details>}
          <div style={{...S.tb,padding:"10px 16px"}}><span>{t("netPay")}</span><b style={{fontSize:16}}>{money(Math.max(0,Math.round(net)))}</b></div>
        </div>);})}
        {periods.length>0&&<><HR/><h3 style={S.sh}>Closed Periods</h3>{periods.slice().reverse().map((cp,i)=><details key={i} style={{...S.li,display:"block",marginBottom:8}}><summary style={{cursor:"pointer",fontWeight:700}}>{cp.period}</summary><div style={{paddingTop:8}}>{cp.employees?.map(e=>{const dd=Number(e.salary||0)/30;const ad=dd*Number(e.absentDays||0);const n=Number(e.salary||0)+Number(e.commissionTotal||0)-Number(e.loan||0)-Number(e.brokerFee||0)-Number(e.otherDeduction||0)-ad;return<div key={e.id} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",borderBottom:"1px solid #ecdba3",fontSize:13}}><span><b>{e.name}</b> ({e.section})</span><b>{money(Math.max(0,Math.round(n)))}</b></div>;})}</div></details>)}</>}
        <div className="print-only" style={{display:"none"}}><PS emps={emps} empC={empC} period={period}/></div>
      </section>}

      {tab==="Dashboard"&&<section style={S.card}><h2 style={S.ct}>{t("dashboard2")}</h2>
        {/* Date filter */}
        <div style={{background:"#f8fafc",border:"1px solid #e5e7eb",borderRadius:14,padding:14,marginBottom:14}}>
          <div style={{display:"flex",gap:10,alignItems:"flex-end",flexWrap:"wrap",marginBottom:8}}>
            <div style={{flex:1}}><EthPicker label="Viewing Date" value={dashDate} onChange={setDashDate}/></div>
            <button style={{...S.btnS,width:"auto",padding:"10px 16px",marginBottom:0}} onClick={()=>setDashDate(todayStr())}>{t("today")}</button>
            <label style={{display:"flex",alignItems:"center",gap:6,fontSize:12,cursor:"pointer",padding:"10px 0"}}>
              <input type="checkbox" checked={dashRange} onChange={e=>setDashRange(e.target.checked)}/>
              Date Range
            </label>
          </div>
          {dashRange&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <EthPicker label="From" value={dashFrom} onChange={setDashFrom}/>
            <EthPicker label="To"   value={dashTo}   onChange={setDashTo}/>
          </div>}
          <p style={{margin:0,fontSize:11,color:"#6b7280"}}>
            {dashRange?`Showing: ${dashFrom} to ${dashTo}`:`Showing: ${dashDate}`}
          </p>
        </div>
        {(()=>{
          const from=dashRange?dashFrom:dashDate;
          const to=dashRange?dashTo:dashDate;
          const dV=visits.filter(v=>(v.date||'').slice(0,10)>=from&&(v.date||'').slice(0,10)<=to);
          const dPaid=dV.filter(v=>v.status==="Paid & Closed");
          const dRev=dPaid.reduce((s,v)=>s+Number(v.totalService||0),0);
          const dBks=bks.filter(b=>(b.date||'').slice(0,10)>=from&&(b.date||'').slice(0,10)<=to);
          const dTips=dPaid.reduce((s,v)=>s+v.tips.reduce((a,t)=>a+Number(t.amount||0),0),0);
          const dCash=dPaid.filter(v=>v.paymentMethod==="Cash").reduce((s,v)=>s+Number(v.totalPaid||0),0);
          const dTr=dPaid.filter(v=>v.paymentMethod!=="Cash").reduce((s,v)=>s+Number(v.totalPaid||0),0);
          return(<>
        <div style={{display:"grid",gridTemplateColumns:sc.mob?"1fr 1fr":"repeat(4,1fr)",gap:10,marginBottom:14}}>
          <SC label="Customers Served" value={dPaid.length}/>
          <SC label="Total Visits"     value={dV.length}/>
          <SC label="Active Employees" value={emps.filter(e=>e.active).length}/>
          <SC label="Revenue"          value={money(dRev)} highlight/>
          <SC label="Cash"             value={money(dCash)}/>
          <SC label="Transfer/Card"    value={money(dTr)}/>
          <SC label="Tips"             value={money(dTips)}/>
          <SC label="Bookings"         value={dBks.length}/>
        </div>
        <HR/>
        <div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:14,padding:14,marginBottom:14}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8,flexWrap:"wrap",gap:8}}>
            <h3 style={{margin:0,fontSize:13,fontWeight:800,color:"#374151"}}>Daily Revenue Target</h3>
            <div style={{display:"flex",gap:6,alignItems:"center"}}>
              <input type="number" value={dailyTarget||""} onChange={e=>{const v=Number(e.target.value)||0;setDailyTarget(v);try{localStorage.setItem("ambar_target",v);}catch(e){}}} placeholder="Set target (Birr)" style={{...S.ii,width:160}}/>
            </div>
          </div>
          {dailyTarget>0&&(()=>{const rev=todayV.filter(v=>v.status==="Paid & Closed").reduce((s,v)=>s+Number(v.totalService||0),0);const pct=Math.min(100,Math.round((rev/dailyTarget)*100));const col=pct>=100?"#166534":pct>=60?"#92400e":"#991b1b";return(<><div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:4}}><span style={{color:col,fontWeight:700}}>{pct}% of target reached</span><span style={{color:"#374151"}}>{money(rev)} / {money(dailyTarget)}</span></div><div style={{background:"#e5e7eb",borderRadius:8,height:14,overflow:"hidden"}}><div style={{background:pct>=100?"#166534":pct>=60?"#e0b85a":"#ef4444",height:"100%",width:pct+"%",borderRadius:8,transition:"width 0.5s"}}/></div>{pct>=100&&<p style={{color:"#166534",fontWeight:800,fontSize:13,margin:"6px 0 0"}}>🎉 Target reached!</p>}</>);})()}
        </div>
        <HR/><h3 style={S.sh}>Commission This Period — {period.label}</h3>
        {empC.filter(e=>e.active).map(emp=><div key={emp.id} style={S.li}><span>{emp.name} ({emp.section})</span><b style={{color:"#166534"}}>{money(emp.commissionTotal)}</b></div>)}
        <HR/><h3 style={S.sh}>Revenue by Category</h3>
        {cats.map(cat=>{const ids=svcs.filter(s=>s.category===cat).map(s=>s.id);const rev=dPaid.flatMap(v=>v.services).filter(l=>ids.includes(l.serviceId)).reduce((s,l)=>s+lineIncome(l),0);return<div key={cat} style={S.li}><span>{cat}</span><b>{money(rev)}</b></div>;})}
          </>);
        })()}
      </section>}

      {tab==="Staff"&&<section style={S.card}><h2 style={S.ct}>{t("staffMgmt")}</h2>
        <p style={S.hlp}>Reception: Reception + Checkout + Bookings. Supervisor: Supervisor + Bookings. Manager: All.</p><HR/>
        <div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:14,padding:16,marginBottom:16}}>
          <h3 style={{margin:"0 0 14px",fontWeight:800,fontSize:15}}>{editStaff?"Edit: "+editStaff.id:"Add / Update Staff Account"}</h3>
          <div style={{display:"grid",gridTemplateColumns:sc.mob?"1fr":"1fr 1fr 1fr 1fr",gap:10,marginBottom:12}}>
            <div><L>Username</L><input style={{...S.inp,background:editStaff?"#f3f4f6":"#fffdf7"}} value={nStaff.id} onChange={e=>setNStaff(p=>({...p,id:e.target.value}))} placeholder="e.g. reception1" disabled={!!editStaff}/></div>
            <div><L>Display Name</L><input style={S.inp} value={nStaff.name} onChange={e=>setNStaff(p=>({...p,name:e.target.value}))} placeholder="Full name"/></div>
            <div><L>Role</L><select style={S.inp} value={nStaff.role} onChange={e=>setNStaff(p=>({...p,role:e.target.value}))}><option value="reception">Reception</option><option value="supervisor">Supervisor</option><option value="manager">Manager</option></select></div>
            <div><L>{editStaff?"New Password":"Password"}</L><input style={S.inp} type="password" value={nStaff.password} onChange={e=>setNStaff(p=>({...p,password:e.target.value}))} placeholder={editStaff?"Enter new password":"Password"}/></div>
          </div>
          <div style={S.r2}><button style={S.btnP} onClick={saveStaff}>{editStaff?t("updateAccount"):t("saveAccount")}</button>{editStaff&&<button style={S.btnS} onClick={()=>{setEditStaff(null);setNStaff({id:"",name:"",role:"reception",password:""});}}>{t("cancel")}</button>}</div>
        </div>
        <h3 style={S.sh}>All Staff ({staff.length})</h3>
        {staff.map(s=><div key={s.id} style={{...S.li,flexWrap:"wrap",gap:10,opacity:s.active?1:0.6}}>
          <div><b style={{fontSize:15}}>{s.name}</b><span style={{background:s.role==="manager"?"#334155":s.role==="supervisor"?"#1e40af":"#f5e7c0",color:s.role==="manager"?"#e0b85a":s.role==="supervisor"?"#fff":"#6b4c11",borderRadius:14,padding:"2px 10px",fontSize:11,fontWeight:700,marginLeft:8}}>{s.role}</span>{!s.active&&<span style={{background:"#fee2e2",color:"#991b1b",borderRadius:14,padding:"2px 10px",fontSize:11,fontWeight:700,marginLeft:6}}>INACTIVE</span>}<p style={S.hlp}>Username: <b>{s.id}</b></p></div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center"}}><button style={S.btnS} onClick={()=>{setEditStaff(s);setNStaff({id:s.id,name:s.name,role:s.role,password:""});}}>Edit / Reset PW</button><button style={s.active?S.btnD:S.btnS} onClick={()=>setStaffAct(s.id,!s.active)}>{s.active?t("deactivate"):t("reactivate")}</button></div>
        </div>)}
      </section>}

      {tab==="Design Editor"&&<section style={S.card}>
        <h2 style={S.ct}>🎨 Design Editor</h2>
        <p style={{fontSize:12,color:"#6b7280",marginBottom:16}}>Changes apply live across all tabs. Save to persist on this device.</p>
        <div style={{display:"grid",gridTemplateColumns:sc.mob?"1fr":"1fr 1fr",gap:20}}>
          {/* ── Color Settings ── */}
          <div>
            <h3 style={S.sh}>Colors</h3>
            {[
              {key:"btnPBg",   label:"Primary Button Background",   preview:design.btnPBg},
              {key:"btnPText", label:"Primary Button Text",         preview:design.btnPText},
              {key:"btnSBg",   label:"Secondary Button Background",  preview:design.btnSBg},
              {key:"btnSText", label:"Secondary Button Text",        preview:design.btnSText},
              {key:"cardBg",   label:"Card Background",              preview:design.cardBg},
            ].map(({key,label})=>(
              <div key={key} style={{display:"flex",alignItems:"center",gap:10,marginBottom:10,padding:"8px 10px",background:"#f8fafc",borderRadius:10,border:"1px solid #e5e7eb"}}>
                <input type="color" value={design[key]||"#ffffff"}
                  onChange={e=>saveDes({...design,[key]:e.target.value})}
                  style={{width:40,height:36,borderRadius:8,border:"2px solid #e5e7eb",cursor:"pointer",padding:2,flexShrink:0}}/>
                <div style={{flex:1,minWidth:0}}>
                  <p style={{margin:0,fontSize:12,fontWeight:700,color:"#111827"}}>{label}</p>
                  <p style={{margin:"1px 0 0",fontSize:10,color:"#6b7280",fontFamily:"monospace"}}>{design[key]}</p>
                </div>
                <button onClick={()=>{const def={btnPBg:"#111827",btnPText:"#e0b85a",btnSBg:"#f9fafb",btnSText:"#1f2937",cardBg:"#ffffff"};saveDes({...design,[key]:def[key]||"#ffffff"});}} style={{padding:"2px 8px",border:"1px solid #e5e7eb",borderRadius:6,background:"#fff",color:"#6b7280",fontSize:10,cursor:"pointer",flexShrink:0}}>↺</button>
              </div>
            ))}
            <button style={{...S.btnS,marginTop:4}} onClick={()=>{
              saveDes({btnPBg:"#111827",btnPText:"#e0b85a",btnSBg:"#f9fafb",btnSText:"#1f2937",cardBg:"#ffffff"});
              push("Design reset to default","success");
            }}>↺ Reset All to Default</button>

            <HR/>
            <h3 style={S.sh}>Live Preview</h3>
            <div style={{padding:16,background:design.cardBg||"#fff",borderRadius:14,border:"1px solid #e5e7eb",display:"flex",flexDirection:"column",gap:10}}>
              <div style={{background:"#111827",padding:"12px 16px",borderRadius:12,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div><p style={{margin:0,fontSize:9,fontWeight:900,color:"#e0b85a",letterSpacing:2}}>AMBAR SPA & BEAUTY</p><p style={{margin:"2px 0 0",fontSize:14,fontWeight:900,color:"#fff"}}>Salon Management System</p></div>
                <div style={{background:"#e0b85a",color:"#111827",borderRadius:10,padding:"8px 14px",textAlign:"center"}}><p style={{margin:0,fontSize:9,fontWeight:800}}>TODAY NEXT</p><p style={{margin:0,fontSize:20,fontWeight:900}}>#4</p></div>
              </div>
              <div style={{display:"flex",gap:8}}>
                <button style={{flex:1,padding:"9px 4px",borderRadius:10,border:"none",background:design.btnPBg||"#111827",color:design.btnPText||"#e0b85a",fontWeight:900,fontSize:11}}>Register</button>
                <button style={{flex:1,padding:"9px 4px",borderRadius:10,border:"1px solid #e0b85a",background:design.btnSBg||"#fff",color:design.btnSText||"#1f2937",fontWeight:700,fontSize:11}}>Recall</button>
              </div>
              <div style={{background:design.cardBg||"#fff",border:"1px solid #e5e7eb",borderRadius:12,padding:12}}>
                <b style={{color:"#111827",fontSize:13}}>#1 — Sara</b>
                <p style={{margin:"4px 0 0",fontSize:11,color:"#6b7280"}}>ስፔሻል ፔዲኪዩር · 1,500 Birr</p>
              </div>
              <button style={{width:"100%",padding:11,borderRadius:10,border:"none",background:design.btnPBg||"#111827",color:design.btnPText||"#e0b85a",fontWeight:900,fontSize:13}}>✓ Mark Ready for Payment</button>
            </div>
          </div>

          {/* ── Text / Label Settings ── */}
          <div>
            <h3 style={S.sh}>Amharic Text Overrides</h3>
            <p style={{fontSize:11,color:"#6b7280",marginBottom:12}}>Edit any Amharic translation below. English shown as placeholder.</p>
            {Object.entries(LANG.am).slice(0,20).map(([key,val])=>(
              <div key={key} style={{marginBottom:8}}>
                <p style={{margin:"0 0 2px",fontSize:9,fontWeight:800,color:"#9ca3af",fontFamily:"monospace",letterSpacing:0.5}}>{key}</p>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:4}}>
                  <div style={{padding:"6px 8px",borderRadius:7,background:"#f8fafc",border:"1px solid #e5e7eb",fontSize:11,color:"#9ca3af",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{LANG.en[key]||key}</div>
                  <input value={val||""} onChange={e=>{LANG.am[key]=e.target.value;}} placeholder={LANG.en[key]||key}
                    style={{padding:"6px 8px",borderRadius:7,border:"1px solid #d1d5db",background:"#fff",fontSize:12,color:"#111827"}}/>
                </div>
              </div>
            ))}
            <details style={{marginTop:8}}>
              <summary style={{cursor:"pointer",fontSize:12,fontWeight:700,color:"#374151",padding:"6px 0"}}>Show all {Object.keys(LANG.am).length} labels...</summary>
              <div style={{paddingTop:8}}>
                {Object.entries(LANG.am).slice(20).map(([key,val])=>(
                  <div key={key} style={{marginBottom:8}}>
                    <p style={{margin:"0 0 2px",fontSize:9,fontWeight:800,color:"#9ca3af",fontFamily:"monospace"}}>{key}</p>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:4}}>
                      <div style={{padding:"6px 8px",borderRadius:7,background:"#f8fafc",border:"1px solid #e5e7eb",fontSize:11,color:"#9ca3af"}}>{LANG.en[key]||key}</div>
                      <input value={val||""} onChange={e=>{LANG.am[key]=e.target.value;}} placeholder={LANG.en[key]||key}
                        style={{padding:"6px 8px",borderRadius:7,border:"1px solid #d1d5db",background:"#fff",fontSize:12,color:"#111827"}}/>
                    </div>
                  </div>
                ))}
              </div>
            </details>
            <button style={{...S.btnP,marginTop:12}} onClick={async()=>{
              await supabase.from("settings").upsert({key:"amTexts",value:JSON.stringify(LANG.am)});
              push("Amharic labels saved to all devices","success");
            }}>💾 Save Amharic to All Devices</button>
          </div>
        </div>
      </section>}

      {tab==="Activity Log"&&<section style={S.card}><h2 style={S.ct}>{t("activityLog2")}</h2><p style={{...S.hlp,color:"#374151"}}>Last 100 actions across all staff.</p>
        <details style={{marginBottom:12}}><summary style={{fontSize:11,color:"#6b7280",cursor:"pointer"}}>⚙️ Database setup required? Run this SQL in Supabase once</summary><pre style={{background:"#1e293b",color:"#e2e8f0",padding:12,borderRadius:10,fontSize:10,overflow:"auto",marginTop:8}}>{`ALTER TABLE employees ADD COLUMN IF NOT EXISTS role text DEFAULT '';
ALTER TABLE employees ADD COLUMN IF NOT EXISTS day_off integer DEFAULT NULL;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS on_leave boolean DEFAULT false;
ALTER TABLE visits ADD COLUMN IF NOT EXISTS registered_at timestamptz DEFAULT now();`}</pre></details>
        <HR/>
        {actLog.length===0&&<EMP>No activity recorded yet.</EMP>}
        {actLog.map((a,i)=><div key={i} style={S.li}><div><b style={{color:"#111827"}}>{a.action}</b>{a.detail&&<p style={{...S.hlp,color:"#374151"}}>{a.detail}</p>}</div><div style={{textAlign:"right",flexShrink:0}}><span style={{background:"#fef3c7",color:"#92400e",borderRadius:8,padding:"2px 8px",fontSize:11,fontWeight:700}}>{a.staff_name}</span><p style={{...S.hlp,fontSize:10,marginTop:4,color:"#6b7280"}}>{a.ts?new Date(a.ts).toLocaleString():""}</p></div></div>)}
      </section>}

      {tab==="Handover"&&<section style={S.card}><h2 style={S.ct}>{t("handoverLog")}</h2>
        <p style={{...S.hlp,color:"#374151"}}>Leave notes for the next shift. Visible to all staff.</p><HR/>
        <L>Handover Note</L>
        <textarea style={S.ta} value={handoverNote} onChange={e=>setHandoverNote(e.target.value)} placeholder="e.g. Customer X is coming back at 4pm. Room 2 needs cleaning. Booking for Marta confirmed for tomorrow 10am..." rows={4}/>
        <button style={S.btnP} onClick={async()=>{if(!handoverNote.trim())return;const row={id:Date.now(),staff_name:user.name,role:user.role,note:handoverNote.trim(),ts:new Date().toISOString()};setHandoverLog(p=>[row,...p]);await supabase.from("activity_log").insert({staff_id:user.id,staff_name:user.name,action:"Handover Note",detail:handoverNote.trim(),ts:new Date().toISOString()});setHandoverNote("");push("Handover note saved","success");}}>{t("saveNote")}</button>
        <HR/><h3 style={S.sh}>{t("recentNotes")}</h3>
        {actLog.filter(a=>a.action==="Handover Note").slice(0,20).map((a,i)=><div key={i} style={{...S.li,flexDirection:"column",alignItems:"flex-start",gap:6}}>
          <div style={{display:"flex",justifyContent:"space-between",width:"100%",flexWrap:"wrap",gap:4}}>
            <span style={{background:a.role==="manager"?"#334155":a.role==="supervisor"?"#1e40af":"#f5e7c0",color:a.role==="manager"?"#e0b85a":a.role==="supervisor"?"#fff":"#6b4c11",borderRadius:8,padding:"2px 8px",fontSize:11,fontWeight:700}}>{a.staff_name}</span>
            <span style={{fontSize:11,color:"#6b7280"}}>{a.ts?new Date(a.ts).toLocaleString():""}</span>
          </div>
          <p style={{margin:0,fontSize:13,color:"#111827",lineHeight:1.5}}>{a.detail}</p>
        </div>)}
      </section>}

    </div>
    <style>{"@media print{.no-print{display:none!important}.print-only{display:block!important}body{background:white!important}}select option{color:#111827!important;background:#fff!important}select{color:#111827!important}"}</style>
  </div>);
}

function SLines({visit,emps,mode,onUpd,onRem,onMove}){
  if(!visit)return null;
  const isSv=mode==="supervisor";const locked=["Ready for Payment","Paid & Closed"].includes(visit.status||"");
  return <div style={{marginBottom:14}}>
    <h3 style={{margin:"14px 0 8px",fontWeight:800}}>Services</h3>
    {!(visit&&visit.services&&visit.services.length)&&<p style={{color:"#1f2937",fontSize:13}}>No services added yet.</p>}
    {(visit.services||[]).map(line=>{
      if(!line||!line.lineId)return null;
      const elig=emps.filter(e=>e.section===line.employeeSection&&isEmpAvailableToday(e));
      const done=["Completed","Cancelled"].includes(line.status||"");
      return <div key={line.lineId} style={{background:done?"#f9fafb":"#f8fafc",border:"1px solid "+(done?"#e5e7eb":"#e5e7eb"),borderRadius:12,padding:10,marginBottom:7}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:7,flexWrap:"wrap",gap:6}}>
          <div><b style={{fontSize:14}}>{line.name}</b>
            <p style={{color:"#5c3d11",fontSize:11,margin:"2px 0"}}>{isSv?money(line.price)+" × "+line.qty+" = "+money(lineGross(line)):"Gross: "+money(lineGross(line))+" | Income: "+money(lineIncome(line))}</p>
            {line.commission>0&&<p style={{color:"#166534",fontSize:11,margin:"2px 0"}}>Commission {line.commission}%{line.wigDeduction>0?" (after "+money(line.wigDeduction)+" material deduction)":""} = {money(lineComm(line))}</p>}
          </div>
          <div style={{display:"flex",gap:4}}>
                {!locked&&<button style={{padding:"4px 6px",borderRadius:7,border:0,background:"#fef3c7",color:"#92400e",cursor:"pointer",fontSize:12}} onClick={()=>onMove(line.lineId,"up")}>↑</button>}
                {!locked&&<button style={{padding:"4px 6px",borderRadius:7,border:0,background:"#fef3c7",color:"#92400e",cursor:"pointer",fontSize:12}} onClick={()=>onMove(line.lineId,"down")}>↓</button>}
                {!locked&&<button style={{padding:"4px 10px",borderRadius:8,border:0,background:"#ffe3de",color:"#8a1f12",fontWeight:800,cursor:"pointer",fontSize:12}} onClick={()=>onRem(line.lineId)}>Remove</button>}
              </div>
        </div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"flex-end"}}>
          <div><p style={{fontSize:10,fontWeight:700,color:"#1f2937",margin:"0 0 2px"}}>Qty</p><input style={{width:55,padding:"6px 8px",borderRadius:8,border:"1px solid #c7b06a",background:"#fff",fontSize:12}} type="number" min="1" value={line.qty} onChange={e=>onUpd(line.lineId,"qty",e.target.value)} disabled={locked}/></div>
          {!isSv&&<>
            <div><p style={{fontSize:10,fontWeight:700,color:"#1f2937",margin:"0 0 2px"}}>Discount</p><input style={{width:80,padding:"6px 8px",borderRadius:8,border:"1px solid #c7b06a",background:"#fff",fontSize:12}} type="number" value={line.discount} onChange={e=>onUpd(line.lineId,"discount",e.target.value)} disabled={locked}/></div>
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2}}><p style={{fontSize:10,fontWeight:700,color:"#6b4c11",margin:0}}>Free</p><input type="checkbox" checked={line.free} onChange={e=>onUpd(line.lineId,"free",e.target.checked)} disabled={locked} style={{width:16,height:16}}/></div>
          </>}
          <div><p style={{fontSize:10,fontWeight:700,color:"#1f2937",margin:"0 0 2px"}}>Preferred</p><select style={{padding:"6px 8px",borderRadius:8,border:"1px solid #c7b06a",background:"#fff",fontSize:12}} value={line.preferredEmployee} onChange={e=>onUpd(line.lineId,"preferredEmployee",e.target.value)} disabled={locked}><option value="">None</option>{elig.map(e=><option key={e.id}>{e.name}</option>)}</select></div>
          <div><p style={{fontSize:10,fontWeight:700,color:"#1f2937",margin:"0 0 2px"}}>Who Did It?</p><select style={{padding:"6px 8px",borderRadius:8,border:"1px solid #c7b06a",background:"#fff",fontSize:12}} value={line.employee} onChange={e=>onUpd(line.lineId,"employee",e.target.value)} disabled={locked}><option value="">Select</option>{elig.map(e=><option key={e.id}>{e.name}</option>)}</select></div>
          <div><p style={{fontSize:10,fontWeight:700,color:"#1f2937",margin:"0 0 2px"}}>Status</p><select style={{padding:"6px 8px",borderRadius:8,border:"1px solid #c7b06a",background:done?"#f0fdf4":"#fff",fontSize:12}} value={line.status} onChange={e=>{if(e.target.value==="In Progress")markSvcStart(line.lineId);onUpd(line.lineId,"status",e.target.value);}} disabled={locked}><option>Waiting</option><option>On Hold</option><option>In Progress</option><option>Completed</option><option>Cancelled</option></select></div>
          <SvcTimer lineId={line.lineId} status={line.status}/>
        </div>
      </div>;
    })}
    <div style={{display:"flex",justifyContent:"space-between",background:"#111827",color:"#e0b85a",padding:"11px 16px",borderRadius:12,marginTop:8}}><span style={{fontWeight:700,color:"#d1d5db"}}>Total Income</span><b style={{fontSize:15,color:"#e0b85a"}}>{money(visit.totalService)}</b></div>
  </div>;
}

// Live wait timer for reception queue
function WaitTimer({vid}){
  const[mins,setMins]=useState(()=>waitMins(vid)||0);
  useEffect(()=>{markArrival(vid);const t=setInterval(()=>setMins(waitMins(vid)||0),15000);return()=>clearInterval(t);},[vid]);
  if(mins===null||mins===0)return null;
  const col=mins>30?"#991b1b":mins>15?"#92400e":"#166534";
  const bg=mins>30?"#fee2e2":mins>15?"#fef3c7":"#dcfce7";
  return <p style={{fontSize:11,fontWeight:700,color:col,background:bg,borderRadius:6,padding:"1px 7px",margin:"2px 0",display:"inline-block"}}>⏱ {mins} min waiting</p>;
}

// Live service timer component
function SvcTimer({lineId,status}){
  const[mins,setMins]=useState(()=>svcMins(lineId)||0);
  useEffect(()=>{
    if(!["In Progress","Waiting"].includes(status))return;
    const t=setInterval(()=>setMins(svcMins(lineId)||0),15000);
    return()=>clearInterval(t);
  },[lineId,status]);
  if(status==="Waiting")return null;
  if(status==="Completed"||status==="Cancelled"){
    const m=svcMins(lineId);
    if(!m)return null;
    return <div style={{fontSize:10,fontWeight:700,color:"#166534",background:"#dcfce7",borderRadius:6,padding:"2px 8px",alignSelf:"flex-end"}}>Done in {m} min</div>;
  }
  if(status==="In Progress"&&mins>0)return <div style={{fontSize:11,fontWeight:700,color:"#1e40af",background:"#dbeafe",borderRadius:6,padding:"3px 8px",alignSelf:"flex-end"}}>⏱ {mins} min</div>;
  return null;
}

function PS({emps,empC,period}){return <div style={{fontFamily:"Arial,sans-serif",padding:32}}>
  <div style={{textAlign:"center",marginBottom:20}}><h1 style={{margin:0}}>Ambar Spa & Beauty</h1><h2 style={{margin:"4px 0 0",fontWeight:400}}>Payroll — {period.label}</h2><p style={{fontSize:11,color:"#666"}}>Printed: {new Date().toLocaleString()}</p></div>
  <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}><thead><tr style={{background:"#e0b85a"}}>{["Employee","Section","Base","Commission","Absent Ded.","Loan","Broker","Other","NET PAY"].map(h=><th key={h} style={{border:"1px solid #999",padding:"7px 9px",textAlign:"left"}}>{h}</th>)}</tr></thead>
  <tbody>{emps.filter(e=>e.active).map((emp,i)=>{const ex=empC.find(e=>e.id===emp.id);const d=Number(emp.salary||0)/30;const ad=d*Number(emp.absentDays||0);const net=Number(emp.salary||0)+Number(ex?.commissionTotal||0)-Number(emp.loan||0)-Number(emp.brokerFee||0)-Number(emp.otherDeduction||0)-ad;return <tr key={emp.id} style={{background:i%2===0?"#fff":"#fffaf2"}}>
    <td style={{border:"1px solid #ddd",padding:"6px 9px"}}>{emp.name}</td><td style={{border:"1px solid #ddd",padding:"6px 9px"}}>{emp.section}</td>
    <td style={{border:"1px solid #ddd",padding:"6px 9px"}}>{Number(emp.salary||0).toLocaleString()}</td><td style={{border:"1px solid #ddd",padding:"6px 9px"}}>{Number(ex?.commissionTotal||0).toLocaleString()}</td>
    <td style={{border:"1px solid #ddd",padding:"6px 9px"}}>{Math.round(ad).toLocaleString()}</td><td style={{border:"1px solid #ddd",padding:"6px 9px"}}>{Number(emp.loan||0).toLocaleString()}{emp.loanNote?" ("+emp.loanNote+")":""}</td>
    <td style={{border:"1px solid #ddd",padding:"6px 9px"}}>{Number(emp.brokerFee||0).toLocaleString()}</td><td style={{border:"1px solid #ddd",padding:"6px 9px"}}>{Number(emp.otherDeduction||0).toLocaleString()}{emp.otherNote?" ("+emp.otherNote+")":""}</td>
    <td style={{border:"1px solid #ddd",padding:"6px 9px",fontWeight:700,background:"#fff9e6"}}>{Math.max(0,Math.round(net)).toLocaleString()} Birr</td>
  </tr>;})} </tbody></table>
  <div style={{marginTop:40,display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:40}}>{["Prepared by","Reviewed by","Approved by"].map(l=><div key={l} style={{borderTop:"1px solid #000",paddingTop:6,fontSize:11}}>{l}</div>)}</div>
</div>;}

function L({children}){return <p style={{margin:"0 0 4px",fontSize:13,fontWeight:700,color:"#374151"}}>{children}</p>;}
function HR(){return <div style={{borderTop:"1px solid #ecdba3",margin:"16px 0"}}/>;}
function EMP({children}){return <div style={{padding:40,textAlign:"center",color:"#9ca3af",fontSize:14}}>{children}</div>;}
function SC({label,value,highlight,accent}){return <div style={{background:highlight?"#111827":accent?"#fef2f2":"#f9fafb",color:highlight?"#e0b85a":"#111827",borderRadius:14,padding:"12px 14px",border:"1px solid "+(highlight?"#374151":accent?"#fecaca":"#e5e7eb")}}><p style={{margin:0,fontSize:10,fontWeight:700,color:highlight?"#9ca3af":accent?"#dc2626":"#6b7280"}}>{label}</p><h3 style={{margin:"3px 0 0",fontSize:15,fontWeight:900,color:highlight?"#e0b85a":"#111827"}}>{value}</h3></div>;}
function FI({label,value,onChange,type="text",note,onNote}){return <div><p style={{fontSize:10,fontWeight:700,color:"#1f2937",margin:"0 0 2px"}}>{label}</p><input type={type} value={value} onChange={e=>onChange(e.target.value)} style={{width:"100%",boxSizing:"border-box",padding:"7px 9px",borderRadius:9,border:"1px solid #c7b06a",background:"#fff",fontSize:12}}/>{onNote!==undefined&&<input value={note||""} onChange={e=>onNote(e.target.value)} placeholder="Note" style={{width:"100%",boxSizing:"border-box",padding:"4px 7px",borderRadius:7,border:"1px solid #e0d4a0",background:"#fffdf7",fontSize:10,marginTop:2}}/>}</div>;}
function SB(st){const m={"Waiting for Supervisor":{bg:"#fef3c7",co:"#92400e"},"With Supervisor":{bg:"#e0f2fe",co:"#0369a1"},"In Service":{bg:"#dbeafe",co:"#1e40af"},"Ready for Payment":{bg:"#dcfce7",co:"#166534"},"Paid & Closed":{bg:"#f0fdf4",co:"#166534"},Waiting:{bg:"#fef9c3",co:"#854d0e"},"On Hold":{bg:"#f3e8ff",co:"#6b21a8"},"In Progress":{bg:"#dbeafe",co:"#1e3a8a"},Completed:{bg:"#dcfce7",co:"#14532d"},Cancelled:{bg:"#fee2e2",co:"#991b1b"},Pending:{bg:"#fef3c7",co:"#92400e"},Confirmed:{bg:"#dbeafe",co:"#1e40af"},Arrived:{bg:"#dcfce7",co:"#166534"},"No-show":{bg:"#f3f4f6",co:"#6b7280"}};const c=m[st]||{bg:"#f3f4f6",co:"#374151"};return{borderRadius:8,padding:"3px 10px",fontSize:11,fontWeight:700,whiteSpace:"nowrap",background:c.bg,color:c.co};}