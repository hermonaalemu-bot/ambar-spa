import React,{useEffect,useMemo,useState,useRef} from "react";
import {supabase} from "./supabase";

const OPEN_HOUR=8,CLOSE_HOUR=19;
const ROLES={RECEPTION:"reception",SUPERVISOR:"supervisor",MANAGER:"manager"};
const DEFAULT_STAFF=[
  {id:"reception1", name:"Reception 1", role:"reception",  password:"1234",active:true},
  {id:"reception2", name:"Reception 2", role:"reception",  password:"1234",active:true},
  {id:"supervisor",  name:"Supervisor",  role:"supervisor", password:"1234",active:true},
  {id:"manager",     name:"Manager",     role:"manager",    password:"9999",active:true},
  {id:"inventory1",  name:"Inventory",   role:"inventory",  password:"5678",active:true},
];
const DC=["Barbershop","Beauty Salon","Spa"];
const FS=[
  // ── Barbershop ──────────────────────────────────────────
  {id:101,cat:"Barbershop",sub:"Hair",  name:"Adult Haircut",price:500, cm:35,es:"Barbershop",bk:false,dm:30},
  {id:102,cat:"Barbershop",sub:"Hair",  name:"Child Haircut",price:300, cm:35,es:"Barbershop",bk:false,dm:20},
  {id:103,cat:"Barbershop",sub:"Beard", name:"Beard Trim",   price:200, cm:35,es:"Barbershop",bk:false,dm:20},
  // ── Beauty Salon: Nails ──────────────────────────────────
  {id:201,cat:"Beauty Salon",sub:"Nails",  name:"ስፔሻል ፔዲኪዩር",price:1500,cm:0,es:"Wash & Pedicure",bk:false,dm:60},
  {id:202,cat:"Beauty Salon",sub:"Nails",  name:"ኖርማል ፔዲኪዩር",price:1000,cm:0,es:"Wash & Pedicure",bk:false,dm:45},
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
  // Commission is calculated per quantity
  const qty=Number(l.qty||1);
  const pricePerUnit=Number(l.price||0);
  const discPerUnit=Number(l.discount||0)/qty; // spread discount across units
  // Morocco special: barber still earns commission on normal price even though customer pays 0
  if(l.free&&l.moroccoFree){const np=Number(l.moroccoBasePrice||300);return Math.round(np*Number(l.commission||10)/100);}
  if(l.free)return 0;
  const rate=Number(l.commission||0)/100;
  if(l.sub==="Braids"&&l.name){
    if(l.name.includes("ከኛ")){
      // Our wig: deduct 300 (wig) + 200 (gel) = 500 per qty before 10%
      const dedPerUnit=500;
      const basePerUnit=Math.max(0,pricePerUnit-discPerUnit-dedPerUnit);
      return Math.round(basePerUnit*qty*rate);
    }
    if(l.name.includes("ከነሱ")){
      // Their wig: deduct 300 (wig only) per qty before 10%
      const dedPerUnit=300;
      const basePerUnit=Math.max(0,pricePerUnit-discPerUnit-dedPerUnit);
      return Math.round(basePerUnit*qty*rate);
    }
  }
  // Default: 10% of income
  return Math.round(lineIncome(l)*rate);
}

function getPayPeriod(d){const dt=new Date(d||todayStr());const day=dt.getDate();let sy=dt.getFullYear(),sm=dt.getMonth();if(day<11){sm--;if(sm<0){sm=11;sy--;}}const s=new Date(sy,sm,11),e=new Date(sy,sm+1,10);const fmt=x=>x.toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"});return{start:s.toISOString().slice(0,10),end:e.toISOString().slice(0,10),label:fmt(s)+" - "+fmt(e)};}
function toEthTime(t){if(!t)return"";const[h,m]=t.split(":").map(Number);let e=h-6;if(e<=0)e+=12;return e+":"+String(m).padStart(2,"0")+" "+(h<18?"ቀን":"ማታ");}
function timeSlots(){const s=[];for(let h=OPEN_HOUR;h<CLOSE_HOUR;h++)for(let m=0;m<60;m+=30)s.push(String(h).padStart(2,"0")+":"+String(m).padStart(2,"0"));return s;}
function exportCSV(rows,fn){const k=Object.keys(rows[0]||{});const csv=[k.join(","),...rows.map(r=>k.map(x=>JSON.stringify(r[x]??"")).join(","))].join("\n");const a=document.createElement("a");a.href="data:text/csv;charset=utf-8,"+encodeURIComponent(csv);a.download=fn;a.click();}
function printBookingSlip(b){
  const w=window.open("","_blank","width=380,height=500");
  w.document.write(`<!DOCTYPE html><html><head><title>Booking Confirmation</title><meta charset="utf-8"><style>
    body{font-family:Arial,sans-serif;padding:24px;color:#111;max-width:340px;margin:0 auto}
    .logo{text-align:center;margin-bottom:16px}.logo h1{margin:0;font-size:18px;color:#1B2E4B}
    .logo p{margin:4px 0 0;font-size:11px;color:#5A8C72;letter-spacing:2px}
    .title{text-align:center;font-size:13px;color:#64748B;margin:0 0 16px;border-bottom:1px dashed #E2E8F0;padding-bottom:10px}
    .row{display:flex;justify-content:space-between;margin-bottom:8px;font-size:13px}
    .label{color:#64748B}.value{font-weight:700;color:#1B2E4B;text-align:right}
    .svc-box{background:#F8FAFC;border-radius:8px;padding:12px;margin:12px 0;border:1px solid #E2E8F0}
    .svc-name{font-size:15px;font-weight:700;color:#1B2E4B;margin:0 0 4px}
    .svc-detail{font-size:12px;color:#64748B}
    .footer{text-align:center;margin-top:16px;font-size:11px;color:#94A3B8;border-top:1px dashed #E2E8F0;padding-top:10px}
    .badge{display:inline-block;background:#EBF5EE;color:#166534;border-radius:6px;padding:3px 10px;font-size:11px;font-weight:700}
    @media print{body{padding:8px}}
  </style></head><body>
    <div class="logo"><h1>✦ Ambar Spa & Beauty</h1><p>BOOKING CONFIRMATION</p></div>
    <p class="title">Please present this slip upon arrival</p>
    <div class="row"><span class="label">Customer</span><span class="value">${b.customerName}</span></div>
    <div class="row"><span class="label">Phone</span><span class="value">${b.customerPhone}</span></div>
    <div class="svc-box">
      <p class="svc-name">${b.serviceName||"To Be Confirmed"}</p>
      <p class="svc-detail">📅 ${b.date} &nbsp;⏰ ${b.time}${b.gender?" &nbsp;· "+b.gender:""}</p>
      ${b.people>1?`<p class="svc-detail">👥 ${b.people} people</p>`:""}
      ${b.notes?`<p class="svc-detail">📝 ${b.notes}</p>`:""}
    </div>
    <div class="row"><span class="label">Duration</span><span class="value">${Math.floor((b.durationMins||60)/60)}h${(b.durationMins||60)%60?((b.durationMins||60)%60)+"m":""}</span></div>
    <div class="row"><span class="label">Status</span><span class="value"><span class="badge">${b.status}</span></span></div>
    <div class="row"><span class="label">Booking ID</span><span class="value">#${String(b.id).slice(-6)}</span></div>
    <div class="footer">Thank you for choosing Ambar Spa & Beauty<br>Please arrive 5 minutes early<br>Printed: ${new Date().toLocaleString()}</div>
  </body></html>`);
  w.document.close();w.focus();setTimeout(()=>w.print(),400);
}
function printReceipt(visit,emps){
  const w=window.open("","_blank","width=400,height=600");
  const tips=visit.tips||[];const tipTotal=tips.reduce((s,t)=>s+Number(t.amount||0),0);
  const visitDate=visit.date||todayStr();
  const lines=(visit.services||[]).filter(l=>l.status!=="Cancelled");
  w.document.write(`<!DOCTYPE html><html><head><title>Receipt</title><meta charset="utf-8"><style>
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
    <div class="row"><span>Date:</span><span>${visitDate}</span></div>
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
  if(!navigator.onLine){
    // Queue for later when offline
    if(typeof offlineQRef!=="undefined"&&offlineQRef.current){
      offlineQRef.current.push(fn);
    }
    return{error:null}; // optimistic - UI already updated
  }
  for(let i=0;i<attempts;i++){
    try{const r=await fn();if(!r||!r.error)return r;if(i===attempts-1)throw new Error(r.error?.message||"DB error");}
    catch(e){if(i===attempts-1){console.error("DB failed after retries:",e);return{error:e};}await new Promise(r=>setTimeout(r,600*(i+1)));}
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
  // SAME SERVICE conflict warning
  const sameService=overlap.filter(b=>b.serviceId===svc.id||b.serviceName===svc.name);
  if(sameService.length>0){
    const names=sameService.map(b=>b.customerName).join(", ");
    return"⚠️ "+svc.name+" is already booked at "+form.time+" for: "+names+". There may be a conflict.";
  }
  if(svc.sub==="Moroccan Bath"){const tot=overlap.filter(b=>b.serviceCategory==="Spa").reduce((s,b)=>s+b.people,0)+Number(form.people||1);if(tot>4)return"⚠️ Morocco Bath room may be over capacity (max 4 people comfortable together).";}
  if(svc.sub==="Steam & Sauna"&&overlap.filter(b=>b.serviceName&&b.serviceName.includes("Sauna")).length>0)return"⚠️ Steam & Sauna has overlapping bookings at this time.";
  if(svc.sub==="Massage"&&overlap.filter(b=>b.serviceName&&b.serviceName.includes("Massage")).length>=2)return"⚠️ Both massage rooms may be occupied at this time.";
  return null;
}

const BKC={Pending:{bg:"#fef3c7",co:"#92400e"},Confirmed:{bg:"#dbeafe",co:"#1e40af"},Arrived:{bg:"#dcfce7",co:"#166534"},Completed:{bg:"#f0fdf4",co:"#14532d"},Cancelled:{bg:"#fee2e2",co:"#991b1b"},"No-show":{bg:"#f3f4f6",co:"#6b7280"}};
const TABA={Reception:["reception","manager"],Supervisor:["supervisor","manager"],Checkout:["reception","manager"],Bookings:["reception","supervisor","manager"],"Service Setup":["manager"],"Daily Closing":["manager"],Expenses:["manager"],Customers:["manager"],Payroll:["manager"],Dashboard:["manager"],Staff:["manager"],"Activity Log":["manager"],Handover:["reception","supervisor","manager"],"Design Editor":["manager"],Inventory:["manager","inventory"]};
const dbSvc=r=>({id:r.id,category:r.category,sub:r.sub||"",name:r.name,price:Number(r.price),commission:Number(r.commission),employeeSection:r.employee_section,bookable:!!r.bookable,durationMins:r.duration_mins||60});
const dbEmp=r=>({id:r.id,name:r.name,section:r.section,role:r.role||"",salary:Number(r.salary),absentDays:Number(r.absent_days),loan:Number(r.loan),loanNote:r.loan_note||"",brokerFee:Number(r.broker_fee),otherDeduction:Number(r.other_deduction),otherNote:r.other_note||"",active:r.active,hireDate:r.hire_date,dayOff:r.day_off??null,onLeave:!!r.on_leave});
const dbCust=r=>({id:r.id,name:r.name,phone:r.phone,totalVisits:Number(r.total_visits)});
const dbVis=r=>({id:r.id,date:(r.date||'').slice(0,10),queue:r.queue,customerId:r.customer_id,name:r.name,payerName:r.payer_name,phone:r.phone,groupId:r.group_id,groupName:r.group_name||"",services:r.services||[],totalService:Number(r.total_service),totalPaid:Number(r.total_paid),paymentMethod:r.payment_method||"",tips:r.tips||[],status:r.status,note:r.note||"",registeredAt:r.registered_at||r.created_at||null});
const dbExp=r=>({id:r.id,date:r.date,type:r.type,name:r.name,reason:r.reason||"",qty:Number(r.qty),unit:Number(r.unit),total:Number(r.total)});
const dbBk=r=>({id:r.id,date:(r.date||'').trim().slice(0,10),time:(r.time||'00:00').slice(0,5),customerId:r.customer_id,customerName:r.customer_name,customerPhone:r.customer_phone,serviceId:Number(r.service_id),serviceName:r.service_name,serviceCategory:r.service_category,durationMins:Number(r.duration_mins||60),people:r.people||1,notes:r.notes||"",status:r.status,createdBy:r.created_by||"",visitId:r.visit_id||null,gender:r.gender||"",beautyQueueNum:r.beauty_queue_num||null});
const dbStaff=r=>({id:r.id,name:r.name,role:r.role,password:r.password,active:r.active});
function useW(){const[w,setW]=useState(window.innerWidth);useEffect(()=>{const h=()=>setW(window.innerWidth);window.addEventListener("resize",h);return()=>window.removeEventListener("resize",h);},[]);return{mob:w<640};}
function Notifs({items,dismiss}){
  // Show only the most recent notification (last in array)
  const latest=items[items.length-1];
  if(!latest)return null;
  const bg=latest.type==="success"?"#166534":latest.type==="booking"?"#5b21b6":
    latest.type==="payment"?"#1e40af":latest.type==="warning"?"#92400e":"#1e3a8a";
  return<div style={{position:"fixed",top:0,left:0,right:0,zIndex:9999,
    padding:"8px 12px",pointerEvents:"auto",
    animation:"abaToastDown 0.25s cubic-bezier(0.16,1,0.3,1)"}}>
    <div style={{background:bg,color:"#fff",borderRadius:12,padding:"11px 16px",
      display:"flex",justifyContent:"space-between",alignItems:"center",
      boxShadow:"0 4px 16px rgba(0,0,0,0.25)",maxWidth:500,margin:"0 auto"}}>
      <span style={{fontSize:13,fontWeight:600,flex:1}}>{latest.msg}</span>
      <button onClick={()=>dismiss(latest.id)}
        style={{background:"rgba(255,255,255,0.2)",border:"none",color:"#fff",
          borderRadius:8,width:24,height:24,cursor:"pointer",fontSize:14,
          display:"flex",alignItems:"center",justifyContent:"center",
          marginLeft:12,flexShrink:0}}>✕</button>
    </div>
  </div>;
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

const DEFAULT_INVENTORY=[
  {id:1,name:"Peroxide (ፐሮሳ)",category:"Salon Products",qty:400,unit:"ml",minQty:50,price:0},
  {id:2,name:"Mo Menmbs (ሞ ምንምስ)",category:"Salon Products",qty:9,unit:"pcs",minQty:2,price:0},
  {id:3,name:"Oil Spray",category:"Salon Products",qty:2,unit:"pcs",minQty:1,price:0},
  {id:4,name:"Muss (Hair Mousse)",category:"Salon Products",qty:7,unit:"pcs",minQty:2,price:0},
  {id:5,name:"Morfas Shampoo",category:"Salon Products",qty:2,unit:"pcs",minQty:1,price:0},
  {id:6,name:"Counting Cream (Gauntu)",category:"Salon Products",qty:2,unit:"pcs",minQty:1,price:0},
  {id:7,name:"Mask",category:"Salon Products",qty:1,unit:"pcs",minQty:1,price:0},
  {id:8,name:"Shine Jam",category:"Salon Products",qty:4,unit:"pcs",minQty:1,price:0},
  {id:9,name:"Polisher",category:"Salon Products",qty:1,unit:"pcs",minQty:1,price:0},
  {id:10,name:"Duru Top",category:"Salon Products",qty:12,unit:"pcs",minQty:2,price:0},
  {id:11,name:"Peptigo",category:"Salon Products",qty:15,unit:"pcs",minQty:3,price:0},
  {id:12,name:"Oil (Saodsk)",category:"Salon Products",qty:1,unit:"pcs",minQty:1,price:0},
  {id:13,name:"Bigen Hair Color",category:"Hair Products",qty:6,unit:"pcs",minQty:2,price:0},
  {id:14,name:"Hair Relaxer (kba)",category:"Hair Products",qty:48,unit:"pcs",minQty:10,price:0},
  {id:15,name:"Bleach (Beem)",category:"Hair Products",qty:16,unit:"pcs",minQty:4,price:0},
  {id:16,name:"Hair Toner (pcoyo doc)",category:"Hair Products",qty:118,unit:"pcs",minQty:20,price:0},
  {id:17,name:"Hair Color (pcoyo)",category:"Hair Products",qty:14,unit:"pcs",minQty:4,price:0},
  {id:18,name:"Hair Treatment (n3o3s)",category:"Hair Products",qty:18,unit:"pcs",minQty:4,price:0},
  {id:19,name:"Heat Protector",category:"Hair Products",qty:8,unit:"pcs",minQty:2,price:0},
  {id:20,name:"Hair Product (Bsn oil)",category:"Hair Products",qty:18,unit:"pcs",minQty:4,price:0},
  {id:21,name:"Hair Strips",category:"Hair Products",qty:8,unit:"pcs",minQty:2,price:0},
  {id:22,name:"Placenta",category:"Hair Products",qty:1,unit:"pcs",minQty:1,price:0},
  {id:23,name:"Vitamin (Hair)",category:"Hair Products",qty:2,unit:"pcs",minQty:1,price:0},
  {id:24,name:"Glued No.2",category:"Hair Products",qty:1,unit:"pcs",minQty:1,price:0},
  {id:25,name:"G Cream",category:"Hair Products",qty:1,unit:"pcs",minQty:1,price:0},
  {id:26,name:"Shampoo (Mios)",category:"Hair Products",qty:2,unit:"pcs",minQty:1,price:0},
  {id:27,name:"7efo Oil",category:"Hair Products",qty:2,unit:"pcs",minQty:1,price:0},
  {id:28,name:"Ehaob Oil",category:"Hair Products",qty:1,unit:"pcs",minQty:1,price:0},
  {id:29,name:"Hot Wax",category:"Wax & Eyebrow",qty:1,unit:"pcs",minQty:1,price:0},
  {id:30,name:"Roll Wax",category:"Wax & Eyebrow",qty:1,unit:"pcs",minQty:1,price:0},
  {id:31,name:"Wax Paper",category:"Wax & Eyebrow",qty:1,unit:"pak",minQty:1,price:0},
  {id:32,name:"Wax Warmer",category:"Wax & Eyebrow",qty:1,unit:"pcs",minQty:1,price:0},
  {id:33,name:"Wax Remove Cream",category:"Wax & Eyebrow",qty:1,unit:"pcs",minQty:1,price:0},
  {id:34,name:"Baby Powder",category:"Wax & Eyebrow",qty:1,unit:"pcs",minQty:1,price:0},
  {id:35,name:"Tweezer (Wax)",category:"Wax & Eyebrow",qty:1,unit:"pcs",minQty:1,price:0},
  {id:36,name:"Sizer (Wax)",category:"Wax & Eyebrow",qty:1,unit:"pcs",minQty:1,price:0},
  {id:37,name:"Massage Oil",category:"Spa Products",qty:1,unit:"pcs",minQty:1,price:0},
  {id:38,name:"Nail Polish (various)",category:"Nails",qty:15,unit:"pcs",minQty:3,price:0},
  {id:39,name:"Nail Tips (various)",category:"Nails",qty:2,unit:"pcs",minQty:1,price:0},
  {id:40,name:"3D Nails",category:"Nails",qty:13,unit:"pcs",minQty:2,price:0},
  {id:41,name:"Acryl Gel",category:"Nails",qty:1,unit:"pcs",minQty:1,price:0},
  {id:42,name:"Nail Glue (pe.bb)",category:"Nails",qty:10,unit:"pcs",minQty:2,price:0},
  {id:43,name:"Silver Glitter",category:"Nails",qty:12,unit:"pcs",minQty:2,price:0},
  {id:44,name:"Nail File (olnet)",category:"Nails",qty:4,unit:"pcs",minQty:1,price:0},
  {id:45,name:"Nail Box",category:"Nails",qty:1,unit:"pcs",minQty:1,price:0},
  {id:46,name:"Nail Buffer (olepo)",category:"Nails",qty:99,unit:"pcs",minQty:10,price:0},
  {id:47,name:"Cuticle Cutter (7be)",category:"Nails",qty:20,unit:"pcs",minQty:4,price:0},
  {id:48,name:"Nail Pusher",category:"Nails",qty:1,unit:"pcs",minQty:1,price:0},
  {id:49,name:"Nail Cleaner (ÉnteS)",category:"Nails",qty:3,unit:"pcs",minQty:1,price:0},
  {id:50,name:"Nail Primer (Proc)",category:"Nails",qty:10,unit:"pcs",minQty:2,price:0},
  {id:51,name:"UV Lamp",category:"Nails",qty:1,unit:"pcs",minQty:1,price:0},
  {id:52,name:"Top Coat",category:"Nails",qty:7,unit:"pcs",minQty:2,price:0},
  {id:53,name:"Base Coat",category:"Nails",qty:3,unit:"pcs",minQty:1,price:0},
  {id:54,name:"Nail Color (4nc)",category:"Nails",qty:10,unit:"pcs",minQty:2,price:0},
  {id:55,name:"Nail Wipe",category:"Nails",qty:2,unit:"pcs",minQty:1,price:0},
  {id:56,name:"3D Beads",category:"Nails",qty:26,unit:"pcs",minQty:4,price:0},
  {id:57,name:"Nail Remover (Remulter)",category:"Nails",qty:1,unit:"pcs",minQty:1,price:0},
  {id:58,name:"Alcohol (Nail)",category:"Nails",qty:3,unit:"pcs",minQty:1,price:0},
  {id:59,name:"Gold Metallic",category:"Nails",qty:1,unit:"pcs",minQty:1,price:0},
  {id:60,name:"Silver Metallic",category:"Nails",qty:3,unit:"pcs",minQty:1,price:0},
  {id:61,name:"Brown Metallic",category:"Nails",qty:2,unit:"pcs",minQty:1,price:0},
  {id:62,name:"Spider Gel (Spyder Jal)",category:"Nails",qty:10,unit:"pcs",minQty:2,price:0},
  {id:63,name:"Spider Gel 2",category:"Nails",qty:5,unit:"pcs",minQty:2,price:0},
  {id:64,name:"UV Gel (oyns7)",category:"Nails",qty:1,unit:"pcs",minQty:1,price:0},
  {id:65,name:"Nail Art (tnlsdsn)",category:"Nails",qty:3,unit:"pcs",minQty:1,price:0},
  {id:66,name:"Nail Gel (q33)",category:"Nails",qty:3,unit:"pcs",minQty:1,price:0},
  {id:67,name:"Nail Cleaner 2",category:"Nails",qty:1,unit:"pcs",minQty:1,price:0},
  {id:68,name:"Nail Polish (nom)",category:"Nails",qty:6,unit:"pcs",minQty:2,price:0},
  {id:69,name:"Nail Polish (gndc)",category:"Nails",qty:7,unit:"pcs",minQty:2,price:0},
  {id:70,name:"Nail Files (77p)",category:"Nails",qty:13,unit:"pcs",minQty:3,price:0},
  {id:71,name:"Nail Drill Bits",category:"Nails",qty:9,unit:"pcs",minQty:2,price:0},
  {id:72,name:"Nail Base (Snc)",category:"Nails",qty:1,unit:"pcs",minQty:1,price:0},
  {id:73,name:"3D Flower",category:"Nails",qty:2,unit:"pcs",minQty:1,price:0},
  {id:74,name:"Nail Tips 148/145/152",category:"Nails",qty:3,unit:"pcs",minQty:1,price:0},
  {id:75,name:"Eye Brow Brush",category:"Eyelash & Eyebrow",qty:26,unit:"pcs",minQty:5,price:0},
  {id:76,name:"Eye Lash Cotton",category:"Eyelash & Eyebrow",qty:7,unit:"pcs",minQty:2,price:0},
  {id:77,name:"Eye Lash Serum",category:"Eyelash & Eyebrow",qty:19,unit:"pcs",minQty:4,price:0},
  {id:78,name:"Eye Lash Glue (Blue)",category:"Eyelash & Eyebrow",qty:9,unit:"pcs",minQty:2,price:0},
  {id:79,name:"Eye Lash (Organic)",category:"Eyelash & Eyebrow",qty:15,unit:"pcs",minQty:3,price:0},
  {id:80,name:"Eye Lash Tweezer",category:"Eyelash & Eyebrow",qty:2,unit:"pcs",minQty:1,price:0},
  {id:81,name:"Eye Lash Sizer",category:"Eyelash & Eyebrow",qty:1,unit:"pcs",minQty:1,price:0},
  {id:82,name:"Eye Lash No.9",category:"Eyelash & Eyebrow",qty:1,unit:"pcs",minQty:1,price:0},
  {id:83,name:"Eye Lash No.12",category:"Eyelash & Eyebrow",qty:1,unit:"pcs",minQty:1,price:0},
  {id:84,name:"Eye Lash No.11",category:"Eyelash & Eyebrow",qty:1,unit:"pcs",minQty:1,price:0},
  {id:85,name:"Eye Lash No.14",category:"Eyelash & Eyebrow",qty:1,unit:"pcs",minQty:1,price:0},
  {id:86,name:"Eye Lash No.13",category:"Eyelash & Eyebrow",qty:1,unit:"pcs",minQty:1,price:0},
  {id:87,name:"Lash Scissors",category:"Eyelash & Eyebrow",qty:2,unit:"pcs",minQty:1,price:0},
  {id:88,name:"Lash Tweezer",category:"Eyelash & Eyebrow",qty:2,unit:"pcs",minQty:1,price:0},
  {id:89,name:"Eye Drop",category:"Eyelash & Eyebrow",qty:1,unit:"pcs",minQty:1,price:0},
  {id:90,name:"Lash Conditioner",category:"Eyelash & Eyebrow",qty:1,unit:"pcs",minQty:1,price:0},
  {id:91,name:"Eye Lash Mint",category:"Eyelash & Eyebrow",qty:1,unit:"pcs",minQty:1,price:0},
  {id:92,name:"Eye Lash Remover",category:"Eyelash & Eyebrow",qty:1,unit:"pcs",minQty:1,price:0},
  {id:93,name:"Eye Lash Plaster",category:"Eyelash & Eyebrow",qty:1,unit:"pcs",minQty:1,price:0},
  {id:94,name:"Eye Lash Glue",category:"Eyelash & Eyebrow",qty:1,unit:"pcs",minQty:1,price:0},
  {id:95,name:"Under Eye Plaster",category:"Eyelash & Eyebrow",qty:1,unit:"pcs",minQty:1,price:0},
  {id:96,name:"Glue (Hair Lash)",category:"Eyelash & Eyebrow",qty:1,unit:"pcs",minQty:1,price:0},
  {id:97,name:"Eyebrow Jorac",category:"Eyelash & Eyebrow",qty:1,unit:"pcs",minQty:1,price:0},
  {id:98,name:"Paper Roll",category:"Consumables",qty:1,unit:"roll",minQty:1,price:0},
  {id:99,name:"Paper Box",category:"Consumables",qty:1,unit:"pcs",minQty:1,price:0},
  {id:100,name:"Envelopes",category:"Consumables",qty:1,unit:"pcs",minQty:5,price:0},
  {id:101,name:"Paper (A4)",category:"Consumables",qty:5,unit:"pcs",minQty:1,price:0},
];
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
  const[design,setDesign]=useState(()=>{try{const d=localStorage.getItem("ambar_design");return d?JSON.parse(d):{primaryBg:"#1B2E4B",primaryText:"#ffffff",accentBg:"#5A8C72",accentText:"#ffffff",cardBg:"#ffffff",headerBg:"#1B2E4B",btnPBg:"#1B2E4B",btnPText:"#ffffff",btnSBg:"#F8FAFC",btnSText:"#1B2E4B"};}catch{return{primaryBg:"#1B2E4B",primaryText:"#ffffff",accentBg:"#5A8C72",accentText:"#ffffff",cardBg:"#ffffff",headerBg:"#1B2E4B",btnPBg:"#1B2E4B",btnPText:"#ffffff",btnSBg:"#F8FAFC",btnSText:"#1B2E4B"};}});
  function saveDes(d){setDesign(d);try{localStorage.setItem("ambar_design",JSON.stringify(d));}catch(e){}}
  const S={
    // Layout
    wrap:  {maxWidth:1200,margin:"0 auto",padding:sc.mob?"8px":"14px 20px"},
    card:  {background:design.cardBg||"#ffffff",color:"#1B2E4B",borderRadius:16,padding:sc.mob?14:20,border:"0.5px solid #E2E8F0",boxShadow:"0 2px 12px rgba(27,46,75,0.06)",marginBottom:16},
    ct:    {margin:"0 0 14px",fontSize:sc.mob?15:17,fontWeight:500,color:design.txPrimary||"#1B2E4B"},
    sh:    {margin:"0 0 8px",fontSize:13,fontWeight:500,color:design.txPrimary||"#1B2E4B"},
    hlp:   {color:design.txSecondary||"#64748B",fontSize:11,margin:"2px 0"},
    lbl:   {margin:"0 0 4px",fontSize:12,fontWeight:500,color:design.txLabel||"#334155"},
    // Inputs
    inp:   {width:"100%",boxSizing:"border-box",padding:"10px 12px",marginBottom:8,borderRadius:10,border:"0.5px solid #CBD5E0",background:"#fff",color:design.txInp||"#1B2E4B",fontSize:13},
    ii:    {padding:"6px 9px",borderRadius:8,border:"0.5px solid #CBD5E0",background:"#fff",color:"#1B2E4B",fontSize:12,width:"100%",boxSizing:"border-box"},
    ta:    {width:"100%",boxSizing:"border-box",padding:"10px 12px",marginBottom:8,borderRadius:10,border:"0.5px solid #CBD5E0",background:"#fff",color:"#1B2E4B",minHeight:60,fontSize:13},
    // Buttons
    btnP:  {width:"100%",padding:11,borderRadius:10,border:"none",background:design.btnPBg||"#1B2E4B",color:design.btnPText||"#ffffff",fontWeight:500,cursor:"pointer",fontSize:13,marginBottom:6},
    btnS:  {width:"100%",padding:10,borderRadius:10,border:"0.5px solid #CBD5E0",background:design.btnSBg||"#F8FAFC",color:design.btnSText||"#1B2E4B",fontWeight:500,cursor:"pointer",marginBottom:6,fontSize:12},
    btnD:  {padding:"6px 12px",borderRadius:8,border:"0.5px solid #FECACA",background:"#FEF2F2",color:"#B91C1C",fontWeight:500,cursor:"pointer",fontSize:11},
    btnG:  {width:"100%",padding:11,borderRadius:10,border:"none",background:"#5A8C72",color:"#ffffff",fontWeight:500,cursor:"pointer",fontSize:13,marginBottom:6},
    // List items
    li:    {display:"flex",justifyContent:"space-between",gap:8,alignItems:"center",background:"#fff",border:"0.5px solid #E2E8F0",color:"#1B2E4B",borderRadius:12,padding:"10px 14px",marginBottom:6},
    liA:   {display:"flex",justifyContent:"space-between",gap:8,alignItems:"center",background:"#1B2E4B",border:"none",color:"#fff",borderRadius:12,padding:"10px 14px",marginBottom:6,width:"100%",WebkitTextFillColor:"#fff",cursor:"pointer",textAlign:"left"},
    liB:   {display:"flex",justifyContent:"space-between",gap:8,alignItems:"center",background:"#fff",border:"0.5px solid #E2E8F0",color:"#1B2E4B",borderRadius:12,padding:"10px 14px",marginBottom:6,WebkitTextFillColor:"#1B2E4B",width:"100%",cursor:"pointer",textAlign:"left"},
    // Tabs
    tab:   {padding:"8px 4px",borderRadius:9,border:"0.5px solid #E2E8F0",background:"#fff",color:"#475569",fontWeight:500,cursor:"pointer",fontSize:11},
    tabA:  {padding:"8px 4px",borderRadius:9,border:"none",background:"#1B2E4B",color:"#ffffff",fontWeight:500,cursor:"pointer",fontSize:11},
    // Nav
    navL:  {color:"#94A3B8",margin:"10px 0 5px",fontSize:9,fontWeight:500,letterSpacing:1.5},
    navBtn:{padding:"4px 10px",borderRadius:7,border:"0.5px solid #E2E8F0",background:"#fff",color:"#1B2E4B",cursor:"pointer",fontWeight:500,fontSize:14},
    // Other
    r2:    {display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8},
    tb:    {display:"flex",justifyContent:"space-between",alignItems:"center",background:"#1B2E4B",color:"#fff",padding:"11px 16px",borderRadius:11,marginTop:8,gap:8},
    ii2:   {padding:"6px 9px",borderRadius:8,border:"0.5px solid #CBD5E0",background:"#fff",color:"#1B2E4B",fontSize:12},
  };
  const[user,setUser]=useState(()=>{
    try{
      const u=JSON.parse(sessionStorage.getItem("ambar_u"));
      const t=Number(sessionStorage.getItem("ambar_login_t")||0);
      if(u&&Date.now()-t>10*60*60*1000){sessionStorage.clear();return null;} // 10hr expiry
      return u||null;
    }catch{return null;}
  });
  const[lid,setLid]=useState("");const[lpw,setLpw]=useState("");const[lerr,setLerr]=useState("");
  const[loginTab,setLoginTab]=useState("login"); // "login" | "bookings"
  const loginAttempts=React.useRef({});  // {username: {count, lockedUntil}}
  const[staff,setStaff]=useState(DEFAULT_STAFF);
  const[loading,setLoading]=useState(true);const[saving,setSaving]=useState(false);const[offline,setOffline]=useState(!navigator.onLine);
  const[pullY,setPullY]=useState(0);const[pulling,setPulling]=useState(false);const[refreshing,setRefreshing]=useState(false);
  const pullRef=React.useRef({startY:0,pulling:false});
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
  const[backupLog,setBackupLog]=useState([]);
  const[lastBackup,setLastBackup]=useState(()=>localStorage.getItem("ambar_spa_last_backup")||null);
  const autoBackupChecked=useRef(false);
  const[actId,setActId]=useState(null);
  const[svCat,setSvCat]=useState(DC[0]);const[svSub,setSvSub]=useState("All");const[svSvcId,setSvSvcId]=useState("");
  const[coQ,setCoQ]=useState("");
  const[gSearch,setGSearch]=useState("");const[showGS,setShowGS]=useState(false);const[payM,setPayM]=useState("Cash");const[cashGiven,setCashGiven]=useState("");
  const[tipEmp,setTipEmp]=useState("");const[tipAmt,setTipAmt]=useState("");const[tips,setTips]=useState([]);
  const[showRefund,setShowRefund]=useState(false);const[refundAmt,setRefundAmt]=useState("");const[refundReason,setRefundReason]=useState("");
  const[deActiveGrp,setDeActiveGrp]=useState(0);const[deTab2,setDeTab2]=useState("colors");const[deSaved,setDeSaved]=useState(false);
  const[amTexts,setAmTexts]=useState(()=>({...LANG.am}));
  const[splitMode,setSplitMode]=useState(false);const[splitPayments,setSplitPayments]=useState([]);
  const[spaOnly,setSpaOnly]=useState(false); // spa direct checkout mode
  const[confirmDlg,setConfirmDlg]=useState(null); // {msg,onOk,danger}
  function confirm2(msg,onOk,danger=false){setConfirmDlg({msg,onOk,danger});}
  const[rName,setRName]=useState("");const[rPhone,setRPhone]=useState("");const[rPpl,setRPpl]=useState(1);const[rNote,setRNote]=useState("");const[rmsg,setRmsg]=useState("");
  const[deItem,setDeItem]=useState("");const[deQty,setDeQty]=useState(1);const[deUnit,setDeUnit]=useState("");
  const[gDate,setGDate]=useState(todayStr());const[gName,setGName]=useState("");const[gRsn,setGRsn]=useState("");const[gAmt,setGAmt]=useState("");const[gCat,setGCat]=useState("Operations");
  const EXP_CATS=["Operations","Utilities","Supplies","Salon Products","Marketing","Staff","Maintenance","Other"];
  const[inventory,setInventory]=useState(DEFAULT_INVENTORY);
  const[nInv,setNInv]=useState({name:"",category:"Salon Products",qty:"",unit:"pcs",minQty:"",price:""});
  const[editInvId,setEditInvId]=useState(null);const[editInvData,setEditInvData]=useState({});
  const[moroccoModal,setMoroccoModal]=useState(null); // {resolve} for Morocco gender picker
  const[invLog,setInvLog]=useState(()=>{try{return JSON.parse(localStorage.getItem("ambar_inv_log")||"[]");}catch{return[];}});
  const[svcLog,setSvcLog]=useState(()=>{try{return JSON.parse(localStorage.getItem("ambar_svc_log")||"[]");}catch{return[];}});
  const[showInvLog,setShowInvLog]=useState(false);
  const[invLogFilter,setInvLogFilter]=useState("all"); // "all" | "out" | "in"
  // Load inventory from Supabase — overrides defaults with saved data
  useEffect(()=>{
    supabase.from("settings").select("*").eq("key","inventory").single()
      .then(({data})=>{
        if(data?.value)try{
          const saved=JSON.parse(data.value);
          if(saved&&saved.length>0)setInventory(saved);
        }catch(e){}
      });
    // Load saved Amharic text overrides
    supabase.from("settings").select("*").eq("key","amTexts").single()
      .then(({data})=>{
        if(data?.value)try{
          const saved=JSON.parse(data.value);
          Object.assign(LANG.am,saved);
          setAmTexts(p=>({...p,...saved}));
        }catch(e){}
      });
  },[]);
  async function saveInv(inv,logEntry=null){
    setInventory(inv);
    if(logEntry){
      const entry={...logEntry,id:Date.now(),ts:new Date().toISOString(),staff:user?.name||"Inventory"};
      const newLog=[entry,...invLog].slice(0,500); // keep last 500
      setInvLog(newLog);
      try{localStorage.setItem("ambar_inv_log",JSON.stringify(newLog));}catch(e){}
    }
    await supabase.from("settings").upsert({key:"inventory",value:JSON.stringify(inv)});
  }
  async function addInvItem(){
    if(!nInv.name||!nInv.qty)return alert("Enter item name and quantity.");
    const item={id:Date.now(),...nInv,qty:Number(nInv.qty),minQty:Number(nInv.minQty)||0,price:Number(nInv.price)||0};
    await saveInv([...inventory,item],{
      itemId:item.id,itemName:item.name,category:item.category,
      change:item.qty,newQty:item.qty,reason:"New item added",type:"in"
    });
    setNInv({name:"",category:"Salon Products",qty:"",unit:"pcs",minQty:"",price:""});
    push("Item added: "+item.name,"success");
  }
  async function updInvQty(id,delta,reason="Manual adjustment"){
    const item=inventory.find(i=>i.id===id);if(!item)return;
    const newQty=Math.max(0,item.qty+delta);
    const updated=inventory.map(i=>i.id===id?{...i,qty:newQty}:i);
    await saveInv(updated,{
      itemId:id,itemName:item.name,category:item.category,
      change:delta,newQty,reason,
      type:delta>0?"in":"out"
    });
  }
  async function updateInvItem(id,fields){
    const item=inventory.find(i=>i.id===id);
    const updated=inventory.map(i=>i.id===id?{...i,...fields}:i);
    const qtyDiff=(fields.qty!=null?Number(fields.qty):item.qty)-item.qty;
    await saveInv(updated, qtyDiff!==0?{
      itemId:id,itemName:fields.name||item.name,category:fields.category||item.category,
      change:qtyDiff,newQty:fields.qty||item.qty,reason:"Manual edit",type:qtyDiff>0?"in":"out"
    }:null);
    setEditInvId(null);
    push("Item updated","success");
  }
  function delInvItem(id){
    const item=inventory.find(i=>i.id===id);
    confirm2("Remove "+( item?.name||"this item")+" from inventory?",async()=>{
      await saveInv(inventory.filter(i=>i.id!==id));
      push("Item removed","success");
    },true);
  }
  const INV_CATS=["Salon Products","Hair Products","Nails","Eyelash & Eyebrow","Wax & Eyebrow","Spa Products","Consumables","Cleaning","Equipment","Other"];
  const lowStock=inventory.filter(i=>i.qty<=i.minQty&&i.minQty>0);
  // Service-product links: {productId, serviceSubs:[], qty:1}
  const[svcProducts,setSvcProducts]=useState(()=>{
    try{return JSON.parse(localStorage.getItem("ambar_svc_products")||"[]");}catch{return[];}
  });
  function saveSvcProducts(sp){setSvcProducts(sp);try{localStorage.setItem("ambar_svc_products",JSON.stringify(sp));}catch(e){}}
  const[showSvcProd,setShowSvcProd]=useState(false);
  const[newSvcProd,setNewSvcProd]=useState({productId:"",serviceSubs:[],qty:1});

  // Shine Jam tracker — count services per bottle
  const shineJamLog=invLog.filter(e=>e.itemName&&e.itemName.toLowerCase().includes("shine jam")&&e.type==="out");
  const shineJamSvcCounts=shineJamLog.map((entry,idx)=>{
    const prevEntry=shineJamLog[idx+1];
    const from=prevEntry?new Date(prevEntry.ts):null;
    const to=new Date(entry.ts);
    const subs=["Braids","Ponytails","Twists"];
    const svcsInRange=visits.filter(v=>{
      const vd=new Date(v.date+"T12:00:00Z");
      return(!from||vd>=from)&&vd<=to&&v.status==="Paid & Closed"&&
        (v.services||[]).some(l=>subs.some(s=>l.sub===s||l.name.toLowerCase().includes("braid")||l.name.toLowerCase().includes("ponytail")||l.name.toLowerCase().includes("twist")));
    });
    const svcNames={};
    svcsInRange.forEach(v=>(v.services||[]).forEach(l=>{
      if(subs.some(s=>l.sub===s||l.name.toLowerCase().includes("braid")||l.name.toLowerCase().includes("ponytail")||l.name.toLowerCase().includes("twist"))){
        svcNames[l.name]=(svcNames[l.name]||0)+1;
      }
    }));
    return{ts:entry.ts,total:svcsInRange.length,breakdown:svcNames,bottleNum:shineJamLog.length-idx};
  });
  const[newCat,setNewCat]=useState("");
  const[nSvc,setNSvc]=useState({category:DC[0],sub:"",name:"",price:"",commission:0,employeeSection:EMP_SECTIONS[0],bookable:false,durationMins:60});
  const[svcF,setSvcF]=useState("All");
  const[nEmp,setNEmp]=useState({name:"",section:EMP_SECTIONS[0]||DC[0],role:"",salary:"",hireDate:todayStr()});
  const[showFired,setShowFired]=useState(false);const[showSvcLog,setShowSvcLog]=useState(false);
  const[showHist,setShowHist]=useState(false);const[cSearch,setCSearch]=useState("");const[clDate,setClDate]=useState(todayStr());
  const[dashDate,setDashDate]=useState(todayStr());const[dashRange,setDashRange]=useState(false);const[dashFrom,setDashFrom]=useState(todayStr());const[dashTo,setDashTo]=useState(todayStr());
  const[bkDate,setBkDate]=useState(todayStr());const[showBkF,setShowBkF]=useState(false);const[editBk,setEditBk]=useState(null);
  const[bkF,setBkF]=useState({customerName:"",customerPhone:"",serviceId:"",date:todayStr(),time:"10:00",people:1,notes:"",gender:"",wantBeautyQueue:false});
  const[bkWarn,setBkWarn]=useState("");const[bkSearch,setBkSearch]=useState("");
  const[showWalkIn,setShowWalkIn]=useState(false);
  const[wiSvcId,setWiSvcId]=useState("");const[wiName,setWiName]=useState("");const[wiPhone,setWiPhone]=useState("");const[wiNote,setWiNote]=useState("");
  const[nStaff,setNStaff]=useState({id:"",name:"",role:"reception",password:""});const[editStaff,setEditStaff]=useState(null);
  const[handoverNote,setHandoverNote]=useState("");const[handoverLog,setHandoverLog]=useState([]);
  const[dailyTarget,setDailyTarget]=useState(()=>{try{return Number(localStorage.getItem("ambar_target")||0);}catch{return 0;}});
  const dRef=useRef({});const eRef=useRef({});const undoRef=useRef({});

  function push(msg,type="info"){
    // Skip "Refreshing..." popup entirely
    if(msg==="Refreshing...")return;
    const id=++nid.current;
    // Replace existing notification immediately (one at a time)
    setNotifs([{id,msg,type}]);
    chime(type);
    setTimeout(()=>setNotifs(p=>p.filter(n=>n.id!==id)),4000);
  }
  function dismiss(id){setNotifs(p=>p.filter(n=>n.id!==id));}
  // Pull to refresh
  function handleTouchStart(e){
    if(window.scrollY===0){pullRef.current={startY:e.touches[0].clientY,pulling:true};}
  }
  function handleTouchMove(e){
    if(!pullRef.current.pulling)return;
    const dy=e.touches[0].clientY-pullRef.current.startY;
    if(dy>0&&dy<100){setPullY(dy);setPulling(true);}
  }
  async function handleTouchEnd(){
    if(pullRef.current.pulling&&pullY>60){
      setPulling(false);setPullY(0);pullRef.current={startY:0,pulling:false};
      setRefreshing(true);push("Refreshing...","info");
      await loadAll();
      setRefreshing(false);
    } else {
      setPulling(false);setPullY(0);pullRef.current={startY:0,pulling:false};
    }
  }
  function resetIdle(){clearTimeout(idleRef.current);idleRef.current=setTimeout(()=>setPinLocked(true),30*60*1000);}
  useEffect(()=>{if(!user)return;const evs=["mousemove","keydown","click","touchstart"];evs.forEach(e=>window.addEventListener(e,resetIdle));resetIdle();return()=>{clearTimeout(idleRef.current);evs.forEach(e=>window.removeEventListener(e,resetIdle));};},[user]);
  function unlockPin(){const f=staff.find(s=>s.id===user.id&&s.password===pinInput);if(f){setPinLocked(false);setPinInput("");setPinErr("");}else setPinErr("Wrong password.");}
  useEffect(()=>{const on=async()=>{setOffline(false);push("Back online — syncing...","success");
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
        const stale=visits.filter(v=>v.date===todayStr()&&!["Paid & Closed","Cancelled","Ready for Payment"].includes(v.status));
        for(const v of stale){
          const{error}=await supabase.from("visits").update({status:"Cancelled",note:(v.note?v.note+" ":"")+"[Auto-closed 10PM]"}).eq("id",v.id);
          if(error)console.error("Auto-close failed for",v.name,error.message);
          else setVisits(prev=>prev.map(x=>x.id===v.id?{...x,status:"Cancelled",note:(x.note?x.note+" ":"")+"[Auto-closed 10PM]"}:x));
        }
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
      const[s1,s2,s3,s4,s5,s6,s7,s8,s9,s10,s11]=await Promise.all([
        supabase.from("services").select("*"),supabase.from("employees").select("*"),
        supabase.from("customers").select("*"),supabase.from("visits").select("*").gte("date",new Date(Date.now()-30*24*60*60*1000).toISOString().slice(0,10)).order("queue"),
        supabase.from("expenses").select("*"),supabase.from("closed_periods").select("*"),
        supabase.from("bookings").select("*").order("date").order("time"),
        supabase.from("staff").select("*"),supabase.from("categories").select("*"),
        supabase.from("activity_log").select("*").order("ts",{ascending:false}).limit(50),
        supabase.from("backup_log").select("*").order("created_at",{ascending:false}).limit(60),
      ]);
      if(s11.data)setBackupLog(s11.data);
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
      // Refresh localStorage logs
      try{const sl=JSON.parse(localStorage.getItem("ambar_svc_log")||"[]");setSvcLog(sl);}catch(e){}
      try{const il=JSON.parse(localStorage.getItem("ambar_inv_log")||"[]");setInvLog(il);}catch(e){}
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
        if((role===ROLES.RECEPTION||role===ROLES.MANAGER)&&p.new.status==="Ready for Payment"){
          push("💳 "+p.new.name+" ready for payment","payment");
          nativePush("💳 Ready for Payment",p.new.name+" — tap to process","payment");
        }
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
        supabase.from("visits").select("*").gte("date",new Date(Date.now()-30*24*60*60*1000).toISOString().slice(0,10)).order("queue").then(({data})=>{if(data)setVisits(data.map(dbVis));});
        supabase.from("bookings").select("*").order("date").order("time").then(({data})=>{if(data)setBks(data.map(dbBk));});
      },30000); // poll every 30s as realtime fallback only
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
    const m={reception:"Reception",supervisor:"Supervisor",manager:"Dashboard",inventory:"Inventory"};
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
      let seeded=false;
      if(cc===0){
        seeded=true;
        await supabase.from("categories").insert(DC.map(n=>({name:n})));
        await supabase.from("services").insert(FULL_SERVICES.map(s=>({
          id:s.id,category:s.category,sub:s.sub,name:s.name,price:s.price,
          commission:s.commission,employee_section:s.employeeSection,
          bookable:s.bookable,duration_mins:s.durationMins
        })));
      }
      const{count:sc}=await supabase.from("staff").select("*",{count:"exact",head:true});
      if(sc===0){seeded=true;await supabase.from("staff").insert(DEFAULT_STAFF);}
      // Only reload if we actually seeded fresh data — avoids double-load on normal startup
      if(seeded)await loadAll();
    }
    seed();
  },[user]);

  // Derived
  const act=useMemo(()=>visits.find(v=>v.id===actId)||null,[visits,actId]);
  const period=getPayPeriod(todayStr());
  const todayV=useMemo(()=>visits.filter(v=>v.date===todayStr()),[visits]);
  const svSubs=useMemo(()=>["All",...new Set(svcs.filter(s=>s.category===svCat).map(s=>s.sub))],[svCat,svcs]);
  const svAvail=svcs.filter(s=>s.category===svCat&&(svSub==="All"||s.sub===svSub));
  // FIXED: checkout today only, no past days
  const coList=useMemo(()=>{
    const q=coQ.toLowerCase().trim();
    // Only show Ready for Payment and Paid & Closed
    const tv=visits.filter(v=>v.date===todayStr()&&
      ["Ready for Payment","Paid & Closed"].includes(v.status));
    if(!q)return tv;
    return tv.filter(v=>String(v.queue).includes(q)||
      v.name.toLowerCase().includes(q)||
      v.phone.includes(q));
  },[visits,coQ]);

  // Checkout guard: if the selected visit is not ready, clear it
  // This catches cases where actId was set from Supervisor tab
  useEffect(()=>{
    if(tab==="Checkout"&&actId){
      const v=visits.find(x=>x.id===actId);
      if(v&&!["Ready for Payment","Paid & Closed"].includes(v.status)){
        setActId(null);
      }
    }
  },[tab,actId,visits]);
  const clV=useMemo(()=>visits.filter(v=>v.date===clDate),[visits,clDate]);
  const clE=useMemo(()=>exps.filter(e=>e.date===clDate&&e.type==="Daily Operation"),[exps,clDate]);
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
    // Manager, Reception, and Management staff don't earn service commission
    const noCommRoles=["manager","Manager","Reception","Receptionist","Janitor","Assistant"];
    const hasNoComm=noCommRoles.includes(emp.role)||emp.section==="Reception"||emp.section==="Management";
    const lines=hasNoComm?[]:pv.flatMap(v=>(v.services||[])).filter(l=>l.employee===emp.name&&l.status!=="Cancelled");
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
    const u=lid.trim();
    // Rate limiting
    const now=Date.now();
    const att=loginAttempts.current[u]||{count:0,lockedUntil:0};
    if(att.lockedUntil>now){
      const mins=Math.ceil((att.lockedUntil-now)/60000);
      return setLerr("Too many failed attempts. Try again in "+mins+" minute"+(mins>1?"s":"")+".");
    }
    const candidate=staff.find(s=>s.id===u&&s.active);
    if(!candidate){
      const att2=loginAttempts.current[u]||{count:0,lockedUntil:0};
      const newCount=(att2.count||0)+1;
      loginAttempts.current[u]={count:newCount,lockedUntil:newCount>=3?now+5*60000:0};
      const rem=Math.max(0,3-newCount);
      setLerr(newCount>=3?"🔒 Account locked for 5 minutes.":"Invalid username or password. "+rem+" attempt"+(rem===1?"":"s")+" remaining.");
      supabase.from("activity_log").insert({staff_id:u||"unknown",staff_name:u||"unknown",action:"Failed Login",detail:"Unknown user: "+u,ts:new Date().toISOString()}).then(()=>{});
      return;
    }
    const ok=await checkPW(lpw,candidate.password);
    if(ok){
      loginAttempts.current[u]={count:0,lockedUntil:0};
      const f=candidate;
      setUser(f);sessionStorage.setItem("ambar_u",JSON.stringify(f));setLerr("");
      supabase.from("activity_log").insert({staff_id:f.id,staff_name:f.name,action:LANG.en["login"]||"login",detail:"Successful login",ts:new Date().toISOString()}).then(()=>{});
    }else{
      const att2=loginAttempts.current[u]||{count:0,lockedUntil:0};
      const newCount=(att2.count||0)+1;
      loginAttempts.current[u]={count:newCount,lockedUntil:newCount>=3?now+5*60000:0};
      const rem=Math.max(0,3-newCount);
      setLerr(newCount>=3?"🔒 Account locked for 5 minutes.":"Invalid password. "+rem+" attempt"+(rem===1?"":"s")+" remaining.");
      supabase.from("activity_log").insert({staff_id:u,staff_name:u,action:"Failed Login",detail:"Failed attempt "+newCount+" for: "+u,ts:new Date().toISOString()}).then(()=>{});
    }
  }
  function logout(){setUser(null);sessionStorage.removeItem("ambar_u");setTab("");}
  function recall(){const f=custs.find(c=>c.phone===rPhone.trim());if(f){setRName(f.name);setRmsg("✓ "+f.name+" ("+f.totalVisits+" visits)");}else setRmsg("New customer — not in system yet");}
  async function register(){
    if(!rName.trim())return alert("Enter customer name.");if(!rPhone.trim()||rPhone.trim().length<7)return alert("Enter a valid phone number (min 7 digits).");setSaving(true);
    const cnt=Math.max(1,Number(rPpl||1)),gid=Date.now(),gn=cnt>1?rName.trim()+" (Group of "+cnt+")":"";
    const cid=makeId(rName.trim(),rPhone.trim()),tc=visits.filter(v=>v.date===todayStr()).length;
    const fc=custs.find(c=>c.phone===rPhone.trim()),ntv=(fc?.totalVisits||0)+1;
    await supabase.from("customers").upsert({id:cid,name:rName.trim(),phone:rPhone.trim(),total_visits:ntv,note:rNote.trim()||undefined});
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
      const{error}=await supabase.from("visits").delete().eq("id",id);
      if(error){push("Failed to cancel: "+error.message,"error");return;}
      setVisits(p=>p.filter(x=>x.id!==id));
      if(actId===id)setActId(null);
      logAct(user,"Cancelled visit",v.name);
      push(v.name+" removed","success");
    },true);
  }
  async function addDE(){if(!deItem.trim()||!deUnit)return alert("Enter item and price.");const q=Math.max(1,Number(deQty||1)),u=Number(deUnit||0);const row={id:Date.now(),date:todayStr(),type:"Daily Operation",name:deItem,reason:"",qty:q,unit:u,total:q*u};const{error}=await supabase.from("expenses").insert(row);if(error){push("Failed to save expense: "+error.message,"error");return;}setExps(p=>[...p,row]);setDeItem("");setDeQty(1);setDeUnit("");}
  async function addSvc(){
    if(!act)return alert("Select a customer first.");
    const s=svcs.find(s=>s.id===Number(svSvcId));if(!s)return alert("Select a service.");
    const isKegna=s.sub==="Braids"&&s.name&&s.name.includes("ከኛ");
    const wigDed=isKegna?(s.name.includes("ጄል")?400:200):0;
    const isMorocco=s.name&&(s.name.toLowerCase().includes("morocco")||s.sub==="Moroccan Bath");
    const line={lineId:Date.now(),serviceId:s.id,name:s.name,category:s.category,sub:s.sub,price:Number(s.price),qty:1,discount:0,free:false,commission:Number(s.commission||0),employeeSection:s.employeeSection,employee:"",preferredEmployee:"",status:"Waiting",wigDeduction:wigDed};
    // Morocco Bath: auto-add free included service
    const extraLines=[];
    if(isMorocco){
      const gender=await new Promise(resolve=>{setMoroccoModal({resolve});});
      setMoroccoModal(null);
      if(gender){
        const isMale=gender.trim().toUpperCase()==="M";
        extraLines.push({lineId:Date.now()+1,name:isMale?"Free Haircut (Morocco Special)":"Free Hair Ironing (Morocco Special)",category:"Barbershop",sub:isMale?"Barbershop":"Hair Styling",price:0,qty:1,discount:0,free:true,commission:10,employeeSection:isMale?"Barbershop":"Hair Styling",employee:"",preferredEmployee:"",status:"Waiting",wigDeduction:0,moroccoFree:true,moroccoBasePrice:isMale?300:500});
        push("✓ Free "+(isMale?"Haircut":"Hair Ironing")+" added for Morocco customer","success");
      }
    }
    const upd=[...act.services,line,...extraLines];
    const newTotal=upd.reduce((s,l)=>s+lineIncome(l),0);
    // Optimistic update — screen updates instantly
    setVisits(prev=>prev.map(v=>v.id===act.id?{...v,services:upd,totalService:newTotal,status:"With Supervisor"}:v));
    setSvSvcId("");
    // Save in background with retry
    const{error}=await dbRetry(()=>supabase.from("visits").update({services:upd,total_service:newTotal,status:"With Supervisor"}).eq("id",act.id));
    if(error){
      push("Failed to save service — please retry: "+error.message,"error");
      setVisits(prev=>prev.map(v=>v.id===act.id?act:v)); // rollback to pre-edit state
    }
  }
  async function updLine(vid,lid2,f,v){
    const vis=visits.find(x=>x.id===vid);if(!vis)return;
    const tf=["employee","preferredEmployee","status"];const nv=tf.includes(f)?v:f==="free"?v:Number(v)||0;

    // When a service is marked Completed → unlock On Hold services for this customer
    if(f==="status"&&v==="Completed"){
      const line=vis.services.find(l=>l.lineId===lid2);
      // Auto-deduct inventory using service-product links
      const linkedProds=svcProducts.filter(sp=>
        sp.serviceSubs.includes(line.sub)||sp.serviceSubs.includes(line.employeeSection)
      );
      if(linkedProds.length>0){
        let updInv=[...inventory];
        linkedProds.forEach(sp=>{
          updInv=updInv.map(i=>i.id===sp.productId?{...i,qty:Math.max(0,i.qty-sp.qty)}:i);
          const prod=inventory.find(i=>i.id===sp.productId);
          if(prod)push("Stock: −"+sp.qty+" "+prod.name+" ("+line.name+")","info");
        });
        saveInv(updInv,linkedProds.length>0?{
          itemId:linkedProds[0].productId,
          itemName:inventory.find(i=>i.id===linkedProds[0].productId)?.name||"",
          category:"Auto-deduct",change:-linkedProds[0].qty,
          newQty:Math.max(0,(inventory.find(i=>i.id===linkedProds[0].productId)?.qty||0)-linkedProds[0].qty),
          reason:"Service completed: "+line.name,type:"out"
        }:null);
      } else if(line?.inventoryItem&&line?.inventoryQtyUsed){
        const updInv=inventory.map(i=>i.name===line.inventoryItem?{...i,qty:Math.max(0,i.qty-Number(line.inventoryQtyUsed||1))}:i);
        saveInv(updInv);push("Stock: −"+line.inventoryQtyUsed+" "+line.inventoryItem,"info");
      }
      const dur=svcMins(lid2);
      if(line){
        const emp=line.employee||"Unknown";
        if(dur){
          logAct(user,"Service completed",line.name+" by "+emp+" — "+dur+" min (expected "+(line.durationMins||"?")+"min)");
          // Save structured service time record
          const svcRecord={id:Date.now(),date:todayStr(),employee:emp,service:line.name,sub:line.sub,durationMins:dur,expectedMins:Number(line.durationMins||0),customer:vis.name,queue:vis.queue};
          try{const existing=JSON.parse(localStorage.getItem("ambar_svc_log")||"[]");localStorage.setItem("ambar_svc_log",JSON.stringify([svcRecord,...existing].slice(0,500)));}catch(e){}
        }
      }
      // Unlock: any "On Hold" services for this customer → set to Waiting
      const upd=vis.services.map(l=>{
        if(l.lineId===lid2)return{...l,status:"Completed"};
        if(l.status==="On Hold")return{...l,status:"Waiting"};
        return l;
      });
      await supabase.from("visits").update({services:upd,total_service:upd.reduce((s,l)=>s+lineIncome(l),0)}).eq("id",vid).then(({error})=>{
        if(error){push("Failed to save — please retry","error");return;}
        setVisits(prev=>prev.map(v=>v.id===vid?{...v,services:upd}:v));
      });
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
      setVisits(prev=>prev.map(v=>v.id===vid?{...v,services:upd,status:hasInProgress?"In Service":"With Supervisor"}:v));
      const{error}=await supabase.from("visits").update({services:upd,total_service:upd.reduce((s,l)=>s+lineIncome(l),0),status:hasInProgress?"In Service":"With Supervisor"}).eq("id",vid);
      if(error)push("Failed to save status change — please retry","error");
      return;
    }

    const upd=vis.services.map(l=>l.lineId!==lid2?l:{...l,[f]:nv});
    setVisits(prev=>prev.map(v=>v.id===vid?{...v,services:upd}:v));
    const{error}=await supabase.from("visits").update({services:upd,total_service:upd.reduce((s,l)=>s+lineIncome(l),0)}).eq("id",vid);
    if(error)push("Failed to save change — please retry","error");
  }
  async function moveLine(vid,lid2,dir){
    const vis=visits.find(x=>x.id===vid);if(!vis)return;
    const idx=vis.services.findIndex(l=>l.lineId===lid2);if(idx<0)return;
    const newIdx=dir==="up"?idx-1:idx+1;
    if(newIdx<0||newIdx>=vis.services.length)return;
    const upd=[...vis.services];const tmp=upd[idx];upd[idx]=upd[newIdx];upd[newIdx]=tmp;
    setVisits(prev=>prev.map(v=>v.id===vid?{...v,services:upd}:v));
    const{error}=await supabase.from("visits").update({services:upd}).eq("id",vid);
    if(error)push("Failed to save order — please retry","error");
  }
  function remLine(vid,lid2){
    confirm2("Remove this service?",async()=>{
      const vis=visits.find(x=>x.id===vid);if(!vis)return;
      const upd=vis.services.filter(l=>l.lineId!==lid2);
      const newTotal=upd.reduce((s,l)=>s+lineIncome(l),0);
      setVisits(prev=>prev.map(v=>v.id===vid?{...v,services:upd,totalService:newTotal}:v));
      await dbRetry(()=>supabase.from("visits").update({services:upd,total_service:newTotal}).eq("id",vid)).then(({error})=>{
        if(error)push("Failed to save — please retry","error");
      });
    },true);
  }
  async function markReady(){
    if(!act)return;
    if(!(act.services||[]).length)return alert("Add at least one service before marking ready.");
    // Block if any service is still In Progress or On Hold
    const inProg=act.services.find(l=>["In Progress","On Hold"].includes(l.status));
    if(inProg)return alert("Cannot mark ready — \""+inProg.name+"\" is still "+inProg.status+". Wait for all services to finish.");
    // Block if any non-cancelled service is not Completed
    const notDone=act.services.find(l=>!["Completed","Cancelled"].includes(l.status));
    if(notDone)return alert("Cannot mark ready — \""+notDone.name+"\" is still "+notDone.status+". Mark it Completed or Cancelled first.");
    // Block if any non-cancelled service has no employee assigned
    const noEmp=act.services.find(l=>l.status!=="Cancelled"&&!l.employee);
    if(noEmp)return alert("Assign an employee to \""+noEmp.name+"\" before marking ready.");
    const{error}=await supabase.from("visits").update({status:"Ready for Payment"}).eq("id",act.id);
    if(error){push("Failed to mark ready — please retry: "+error.message,"error");return;}
    setVisits(prev=>prev.map(v=>v.id===act.id?{...v,status:"Ready for Payment"}:v));
    logAct(user,"Ready for Payment",act.name);
  }
  async function reopen(){
    const{error}=await supabase.from("visits").update({status:"In Service"}).eq("id",act.id);
    if(error){push("Failed to reopen — please retry","error");return;}
    setVisits(prev=>prev.map(v=>v.id===act.id?{...v,status:"In Service"}:v));
  }
  function addTip(){if(!tipEmp)return alert("Select an employee.");if(!tipAmt||Number(tipAmt)<=0)return alert("Enter a valid tip amount.");setTips(p=>[...p,{id:Date.now(),employee:tipEmp,amount:Number(tipAmt)}]);setTipEmp("");setTipAmt("");}
  async function processRefund(vid){
    const v=visits.find(x=>x.id===vid);if(!v)return;
    const amt=Number(refundAmt);if(!amt||amt<=0)return alert("Enter refund amount.");
    if(amt>v.totalPaid)return alert("Refund cannot exceed amount paid ("+money(v.totalPaid)+").");
    confirm2("Issue refund of "+money(amt)+" for "+v.name+"?",async()=>{
      const refundNote="[REFUND "+money(amt)+(refundReason?" — "+refundReason:"")+"]";
      const{error}=await supabase.from("visits").update({
        note:(v.note?v.note+" ":"")+refundNote,
        total_paid:v.totalPaid-amt,
        status:"Paid & Closed"
      }).eq("id",vid);
      if(error){push("Refund failed to save — please retry: "+error.message,"error");return;}
      setVisits(prev=>prev.map(x=>x.id===vid?{...x,note:(x.note?x.note+" ":"")+refundNote,totalPaid:x.totalPaid-amt}:x));
      logAct(user,"Refund issued",v.name+" — "+money(amt)+(refundReason?" ("+refundReason+")":""));
      push("Refund of "+money(amt)+" issued for "+v.name,"success");
      setShowRefund(false);setRefundAmt("");setRefundReason("");
    },true);
  }
  async function confirmPay(grp=false){
    if(!act)return;
    // Guard: prevent paying a visit that's already paid
    if(act.status==="Paid & Closed")return push("This customer is already paid and closed","error");
    // Guard: prevent paying before marked ready
    if(act.status!=="Ready for Payment")return push("This customer is not ready for payment yet. Supervisor must mark them ready first.","error");
    // Guard: must have at least one service
    if(!(act.services||[]).filter(l=>l.status!=="Cancelled").length)return push("Cannot process payment — no services recorded for this customer","error");
    const ids=grp&&act.groupId?visits.filter(v=>v.groupId===act.groupId&&v.status!=="Cancelled").map(v=>v.id):[act.id];
    for(const id of ids){
      const v=visits.find(x=>x.id===id);
      const mt=id===act.id?tips:[];
      const mtt=mt.reduce((s,t)=>s+Number(t.amount||0),0);
      const{error}=await supabase.from("visits").update({tips:mt,total_paid:v.totalService+mtt,payment_method:payM,status:"Paid & Closed"}).eq("id",id);
      if(error){push("Payment save failed for "+v.name+": "+error.message,"error");return;}
    }
    setVisits(prev=>prev.map(v=>ids.includes(v.id)?{...v,status:"Paid & Closed",paymentMethod:payM}:v));
    logAct(user,"Payment",act.name+" — "+money(act.totalService)+" via "+payM);
    // Mark related booking as Completed if exists
    const relBk=bks.find(b=>b.visitId&&ids.includes(b.visitId));
    if(relBk){
      const{error}=await supabase.from("bookings").update({status:"Completed"}).eq("id",relBk.id);
      if(error)console.error("Booking status update failed:",error.message);
      else setBks(prev=>prev.map(b=>b.id===relBk.id?{...b,status:"Completed"}:b));
    }
    push("Payment confirmed — "+money(act.totalService)+" via "+payM,"success");
    setTips([]);setActId(null);setCashGiven("");setShowRefund(false);
  }
  async function saveBk(){
    const sid=Number(bkF.serviceId)||0;
    const s=sid?svcs.find(sv=>sv.id===sid&&sv.bookable===true):null;
    if(!bkF.customerName.trim())return alert("Enter customer name.");
    if(!bkF.customerPhone.trim())return alert("Enter customer phone.");
    if(!bkF.date)return alert("Select a date.");
    if(!bkF.time)return alert("Select a time.");
    if(bkF.date===todayStr()&&bkF.time<new Date().toTimeString().slice(0,5)&&!editBk)
      return alert("Cannot book a time that has already passed today.");
    // Hard block: same customer already booked at same date+time
    const sameCust=bks.find(b=>b.id!==(editBk?.id||0)&&b.customerPhone===bkF.customerPhone.trim()&&b.date===(bkF.date||bkDate).slice(0,10)&&b.time===bkF.time&&!["Cancelled","No-show","Completed"].includes(b.status));
    if(sameCust)return alert("❌ "+bkF.customerName+" already has a booking at "+bkF.time+" on "+bkF.date+" ("+sameCust.serviceName+"). Cannot double-book the same customer at the same time.");
    const warn=checkConflict(bks,bkF,svcs);
    if(warn&&!window.confirm(warn+"\n\nProceed anyway?"))return;
    setSaving(true);
    const cid=makeId(bkF.customerName.trim(),bkF.customerPhone.trim());
    if(!custs.find(c=>c.phone===bkF.customerPhone.trim())){await supabase.from("customers").upsert({id:cid,name:bkF.customerName.trim(),phone:bkF.customerPhone.trim(),total_visits:0});setCusts(p=>[...p,{id:cid,name:bkF.customerName.trim(),phone:bkF.customerPhone.trim(),totalVisits:0}]);}
    let beautyQNum=null;
    const row={id:editBk?.id||Date.now(),date:(bkF.date||bkDate||todayStr()).trim().slice(0,10),time:bkF.time,customer_id:cid,customer_name:bkF.customerName.trim(),customer_phone:bkF.customerPhone.trim(),service_id:sid||0,service_name:s?s.name:'TBD - To Be Confirmed',service_category:s?s.category:'Spa',duration_mins:s?s.durationMins:120,people:Number(bkF.people||1),notes:bkF.notes+(bkF.gender?" — "+bkF.gender:""),status:editBk?"Confirmed":"Pending",created_by:user.name,visit_id:null,gender:bkF.gender||null,beauty_queue_num:beautyQNum};
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
    setBkF({customerName:"",customerPhone:"",serviceId:"",date:savedDate,time:"10:00",people:1,notes:"",gender:"",wantBeautyQueue:false});
    setBkDate(savedDate);
    setBkWarn("");setSaving(false);
    push("Booking saved for "+savedDate,"success");
  }
  async function updBk(id,status){
    // Optimistic
    setBks(prev=>prev.map(b=>b.id===id?{...b,status}:b));
    const{error}=await dbRetry(()=>supabase.from("bookings").update({status}).eq("id",id));
    if(error)push("Failed to update booking status — please retry","error");
  }
  async function checkIn(b){
    if(b.visitId&&visits.find(v=>v.id===b.visitId))
      return push("This booking is already checked in","warning");
    confirm2("Check in "+b.customerName+"?",async()=>{
      setSaving(true);
      const cid=makeId(b.customerName,b.customerPhone);
      const tc=visits.filter(v=>v.date===todayStr()).length;
      const vr={id:Date.now(),date:todayStr(),queue:tc+1,customer_id:cid,name:b.customerName,payer_name:b.customerName,phone:b.customerPhone,group_id:null,group_name:"",services:[],total_service:0,total_paid:0,payment_method:"",tips:[],status:"Waiting for Supervisor",note:(b.serviceName&&b.serviceName!=="TBD - To Be Confirmed"?"Booking: "+b.serviceName:"Spa Booking — service TBD")};
      const{error:visErr}=await supabase.from("visits").insert(vr);
      if(visErr){push("Check-in failed: "+visErr.message,"error");setSaving(false);return;}
      const{error:bkErr}=await supabase.from("bookings").update({status:"Arrived",visit_id:vr.id}).eq("id",b.id);
      if(bkErr)console.error("Booking status update failed:",bkErr.message);
      setVisits(prev=>[...prev,dbVis({...vr,customer_id:vr.customer_id,payer_name:vr.payer_name,group_id:vr.group_id,group_name:vr.group_name,registered_at:null})]);
      setBks(prev=>prev.map(bk=>bk.id===b.id?{...bk,visitId:vr.id,status:"Arrived"}:bk));
      logAct(user,"Check-in",b.customerName);
      setSaving(false);
      push(b.customerName+" checked in — Queue #"+vr.queue,"success");
    },false);
  }
  async function giveBeautyQueueFromVisit(v){
    // Give beauty salon queue to a spa customer who decided after service
    confirm2("Give "+v.name+" a Beauty Salon queue and transfer their services?",async()=>{
      const cid=makeId(v.name,v.phone);
      const tc=visits.filter(vv=>vv.date===todayStr()&&vv.id!==v.id).length;
      const qNum=tc+1;
      // Transfer non-spa services to new beauty visit (or create empty one)
      const salonSvcs=v.services.filter(l=>l.sub!=="Spa"&&l.employeeSection!=="Spa"&&l.moroccoFree);
      const vr={
        id:Date.now(),date:todayStr(),queue:qNum,customer_id:cid,
        name:v.name,payer_name:v.name,phone:v.phone,
        group_id:null,group_name:"",
        services:salonSvcs,
        total_service:salonSvcs.reduce((s,l)=>s+lineIncome(l),0),
        total_paid:0,payment_method:"",tips:[],
        status:"Waiting for Supervisor",
        note:"From Spa — "+v.services.filter(l=>l.employeeSection==="Spa").map(l=>l.name).join(", ")
      };
      const{error:insErr}=await supabase.from("visits").insert(vr);
      if(insErr){push("Failed to create beauty queue: "+insErr.message,"error");return;}
      setVisits(prev=>[...prev,dbVis({...vr,customer_id:vr.customer_id,payer_name:vr.payer_name,group_id:vr.group_id,group_name:vr.group_name,registered_at:null})]);
      // Mark original visit with beauty queue number
      const{error:updErr}=await supabase.from("visits").update({note:(v.note?v.note+" | ":"")+"Transferred to Beauty #"+qNum}).eq("id",v.id);
      if(updErr)console.error("Note update failed:",updErr.message);
      setVisits(prev=>prev.map(vv=>vv.id===v.id?{...vv,beautyQueueNum:qNum}:vv));
      push(v.name+" → Beauty Salon Queue #"+qNum,"success");
    },false);
  }
  async function giveBeautyQueue(b){
    // Create beauty salon queue entry for this spa customer
    const cid=makeId(b.customerName,b.customerPhone);
    const tc=visits.filter(v=>v.date===todayStr()).length;
    const qNum=tc+1;
    const vr={
      id:Date.now(),
      date:todayStr(),
      queue:qNum,
      customer_id:cid,
      name:b.customerName,
      payer_name:b.customerName,
      phone:b.customerPhone,
      group_id:null,
      group_name:"",
      services:[],
      total_service:0,
      total_paid:0,
      payment_method:"",
      tips:[],
      status:"Waiting for Supervisor",
      note:"From Spa Booking — "+b.serviceName+(b.gender?" ("+b.gender+")":"")
    };
    const{error:insErr}=await supabase.from("visits").insert(vr);
    if(insErr){push("Failed to create beauty queue: "+insErr.message,"error");return;}
    setVisits(prev=>[...prev,dbVis({...vr,customer_id:vr.customer_id,payer_name:vr.payer_name,group_id:vr.group_id,group_name:vr.group_name,registered_at:null})]);
    // Update booking with beauty queue number
    const{error:bkErr}=await supabase.from("bookings").update({beauty_queue_num:qNum}).eq("id",b.id);
    if(bkErr)console.error("Booking update failed:",bkErr.message);
    setBks(prev=>prev.map(bk=>bk.id===b.id?{...bk,beautyQueueNum:qNum}:bk));
    logAct(user,"Beauty Queue",b.customerName+" — Queue #"+qNum+" (from Spa)");
    push(b.customerName+" added to Beauty Salon as Queue #"+qNum,"success");
  }
  async function delBk(id){
    if(!window.confirm("Delete this booking?"))return;
    const{error}=await supabase.from("bookings").delete().eq("id",id);
    if(error){push("Failed to delete booking: "+error.message,"error");return;}
    setBks(prev=>prev.filter(b=>b.id!==id));
    push("Booking deleted","success");
  }
  async function addSpaWalkIn(){
    if(!wiName.trim()||!wiPhone.trim()||!wiSvcId)return alert("Enter customer name, phone and select a service.");
    setSaving(true);
    const s=svcs.find(sv=>sv.id===Number(wiSvcId));
    const cid=makeId(wiName.trim(),wiPhone.trim());
    const fc=custs.find(c=>c.phone===wiPhone.trim()),ntv=(fc?.totalVisits||0)+1;
    const{error:custErr}=await supabase.from("customers").upsert({id:cid,name:wiName.trim(),phone:wiPhone.trim(),total_visits:ntv});
    if(custErr){push("Failed to save customer: "+custErr.message,"error");setSaving(false);return;}
    if(!fc)setCusts(p=>[...p,{id:cid,name:wiName.trim(),phone:wiPhone.trim(),totalVisits:ntv}]);
    else setCusts(p=>p.map(c=>c.phone===wiPhone.trim()?{...c,totalVisits:ntv}:c));
    const tc=visits.filter(v=>v.date===todayStr()).length;
    const vr={id:Date.now(),date:todayStr(),queue:tc+1,customer_id:cid,name:wiName.trim(),payer_name:wiName.trim(),phone:wiPhone.trim(),group_id:null,group_name:"",services:[],total_service:0,total_paid:0,payment_method:"",tips:[],status:"Waiting for Supervisor",note:(s?"Spa Walk-in: "+s.name:"Spa Walk-in")+(wiNote?" — "+wiNote:"")};
    const{error:visErr}=await supabase.from("visits").insert(vr);
    if(visErr){push("Failed to add walk-in: "+visErr.message,"error");setSaving(false);return;}
    setVisits(prev=>[...prev,dbVis({...vr,customer_id:vr.customer_id,payer_name:vr.payer_name,group_id:vr.group_id,group_name:vr.group_name,registered_at:null})]);
    logAct(user,"Spa Walk-in",wiName.trim()+(s?" — "+s.name:""));
    setShowWalkIn(false);setWiSvcId("");setWiName("");setWiPhone("");setWiNote("");setSaving(false);
    markArrival(vr.id);
    push(wiName.trim()+" added to queue as #"+(tc+1)+" (Spa walk-in)","success");
  }
  async function addGE(){if(!gName.trim())return alert("Enter expense name.");if(!gAmt||Number(gAmt)<=0)return alert("Enter a valid amount greater than 0.");const row={id:Date.now(),date:gDate,type:"General",name:gName,reason:gRsn,category:gCat,qty:1,unit:Number(gAmt),total:Number(gAmt)};const{error}=await supabase.from("expenses").insert(row);if(error){push("Failed to save expense: "+error.message,"error");return;}setExps(p=>[...p,row]);setGName("");setGRsn("");setGAmt("");}
  async function delE(id){if(!window.confirm("Delete?"))return;const{error}=await supabase.from("expenses").delete().eq("id",id);if(error){push("Failed to delete: "+error.message,"error");return;}setExps(p=>p.filter(e=>e.id!==id));}
  async function addCat(){if(!newCat.trim())return alert("Enter a category name.");if(cats.includes(newCat.trim()))return alert("That category already exists.");const{error}=await supabase.from("categories").insert({name:newCat.trim()});if(error){push("Failed to save category: "+error.message,"error");return;}setCats(p=>[...p,newCat.trim()]);setNewCat("");}
  async function addSvc2(){if(!nSvc.name.trim()||!nSvc.price)return alert("Enter name and price.");if(Number(nSvc.price)<=0)return alert("Price must be greater than 0.");if(Number(nSvc.commission||0)<0)return alert("Commission cannot be negative.");const r={id:Date.now(),category:nSvc.category,sub:nSvc.sub,name:nSvc.name,price:Number(nSvc.price),commission:Number(nSvc.commission||0),employee_section:nSvc.employeeSection,bookable:nSvc.bookable,duration_mins:Number(nSvc.durationMins||60)};const{error}=await supabase.from("services").insert(r);if(error){push("Failed to save service: "+error.message,"error");return;}setSvcs(p=>[...p,{...nSvc,id:r.id,price:Number(nSvc.price),commission:Number(nSvc.commission||0),durationMins:Number(nSvc.durationMins||60)}]);setNSvc({category:DC[0],sub:"",name:"",price:"",commission:0,employeeSection:DC[0],bookable:false,durationMins:60});}
  async function updSvc(id,f,v){const df=f==="employeeSection"?"employee_section":f==="durationMins"?"duration_mins":f;const val=["price","commission","durationMins"].includes(f)?Math.max(0,Number(v)||0):f==="bookable"?v:v;setSvcs(p=>p.map(s=>s.id===id?{...s,[f]:val}:s));clearTimeout(dRef.current[id+f]);dRef.current[id+f]=setTimeout(async()=>{const{error}=await supabase.from("services").update({[df]:val}).eq("id",id);if(error)push("Failed to save service change — please retry","error");},800);}
  async function delSvc(id){if(!window.confirm("Remove this service?"))return;const{error}=await supabase.from("services").delete().eq("id",id);if(error){push("Failed to delete service: "+error.message,"error");return;}setSvcs(p=>p.filter(s=>s.id!==id));}
  async function addEmp(){if(!nEmp.name.trim())return alert("Enter employee name.");if(Number(nEmp.salary)<0)return alert("Salary cannot be negative.");const r={id:Date.now(),name:nEmp.name.trim(),section:nEmp.section,role:nEmp.role||"",salary:Number(nEmp.salary),absent_days:0,loan:0,loan_note:"",broker_fee:0,other_deduction:0,other_note:"",active:true,hire_date:nEmp.hireDate,day_off:null,on_leave:false};const{error}=await supabase.from("employees").insert(r);if(error){push("Failed to add employee: "+error.message,"error");return;}setEmps(p=>[...p,{...r,absentDays:0,loanNote:"",brokerFee:0,otherDeduction:0,otherNote:"",hireDate:r.hire_date,dayOff:null,onLeave:false}]);setNEmp({name:"",section:EMP_SECTIONS[0],role:"",salary:"",hireDate:todayStr()});}
  async function updEmp(id,f,v){const m={absentDays:"absent_days",loanNote:"loan_note",brokerFee:"broker_fee",otherDeduction:"other_deduction",otherNote:"other_note",hireDate:"hire_date",dayOff:"day_off",onLeave:"on_leave",role:"role"};const df=m[f]||f;const val=["name","section","hireDate","loanNote","otherNote","role"].includes(f)?v:f==="dayOff"?(v===""||v===null?null:Number(v)):f==="onLeave"?v:Math.max(0,Number(v)||0);setEmps(p=>p.map(e=>e.id===id?{...e,[f]:val}:e));clearTimeout(eRef.current[id+f]);eRef.current[id+f]=setTimeout(async()=>{const{error}=await supabase.from("employees").update({[df]:val}).eq("id",id);if(error)push("Failed to save employee change — please retry","error");},800);}
  async function setEmpAct(id,active){if(!window.confirm(active?"Reactivate?":"Deactivate?"))return;const{error}=await supabase.from("employees").update({active}).eq("id",id);if(error){push("Failed to update: "+error.message,"error");return;}setEmps(p=>p.map(e=>e.id===id?{...e,active}:e));}
// ── Commission Excel Export — organized, professional, easy to read ──
  // ── Build organized backup payload (all business data) ──
  function buildBackupPayload(backupType){
    const record_counts={
      visits:visits.length,bookings:bks.length,customers:custs.length,
      employees:emps.length,expenses:exps.length,services:svcs.length,
      categories:cats.length,closed_periods:periods.length,
      staff:staff.length,activity_log:actLog.length,
    };
    const total_records=Object.values(record_counts).reduce((a,b)=>a+b,0);
    return{
      _meta:{
        business:"Ambar Spa & Beauty",
        format_version:"1.0",
        generated_at:new Date().toISOString(),
        generated_by:user?.name||"unknown",
        backup_type:backupType,
        record_counts,
        total_records,
      },
      visits,bookings:bks,customers:custs,employees:emps,expenses:exps,
      services:svcs,categories:cats,closed_periods:periods,
      staff,activity_log:actLog,
    };
  }

  // ── Full data backup — download to this device ──────────
  async function downloadBackup(){
    const payload=buildBackupPayload("manual download — "+(user?.name||"unknown"));
    const blob=new Blob([JSON.stringify(payload,null,2)],{type:"application/json"});
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a");
    a.href=url;a.download=`ambar-spa-backup-${todayStr()}.json`;
    document.body.appendChild(a);a.click();document.body.removeChild(a);
    URL.revokeObjectURL(url);
    const ts=new Date().toISOString();
    localStorage.setItem("ambar_spa_last_backup",ts);
    setLastBackup(ts);
    logAct(user,"Backup Downloaded",`Full export — ${payload._meta.total_records} total records`);
    push("Backup downloaded","success");
  }

  // ── Cloud backup — saved to Supabase Storage, logged in backup_log ──
  async function cloudBackup(backupType){
    try{
      const payload=buildBackupPayload(backupType);
      const json=JSON.stringify(payload,null,2);
      const blob=new Blob([json],{type:"application/json"});
      const stamp=new Date().toISOString().replace(/[:.]/g,"-");
      const filename=`backup-${stamp}.json`;
      const{error}=await supabase.storage.from("backups").upload(filename,blob,{contentType:"application/json"});
      if(error){console.error(error);push("Cloud backup failed: "+error.message,"error");return null;}
      const{record_counts,total_records}=payload._meta;
      const{data}=await supabase.from("backup_log").insert({
        file_path:filename,triggered_by:backupType,record_counts,total_records,
      }).select().single();
      if(data)setBackupLog(p=>[data,...p]);
      const ts=new Date().toISOString();
      localStorage.setItem("ambar_spa_last_backup",ts);
      setLastBackup(ts);
      logAct(user,"Cloud Backup Created",`${backupType} — ${total_records} total records`);
      push("Cloud backup saved — "+total_records+" records","success");
      return data;
    }catch(e){console.error(e);push("Cloud backup failed","error");return null;}
  }

  // ── Download a past cloud backup ─────────────────────────
  async function downloadCloudBackup(filePath){
    const{data,error}=await supabase.storage.from("backups").download(filePath);
    if(error){push("Download failed: "+error.message,"error");return;}
    const url=URL.createObjectURL(data);
    const a=document.createElement("a");
    a.href=url;a.download=filePath;
    document.body.appendChild(a);a.click();document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // ── Delete an old cloud backup ────────────────────────────
  async function deleteCloudBackup(entry){
    if(!window.confirm("Delete this backup permanently?"))return;
    await supabase.storage.from("backups").remove([entry.file_path]);
    await supabase.from("backup_log").delete().eq("id",entry.id);
    setBackupLog(p=>p.filter(b=>b.id!==entry.id));
    push("Backup deleted","success");
  }

  // ── Automatic end-of-day backup (once per day, only if new data) ──
  useEffect(()=>{
    if(!user||autoBackupChecked.current)return;
    if(loading)return;
    const now=new Date();
    if(now.getHours()<22)return; // only after 10 PM local time (after the auto-close job)
    const todayD=todayStr();
    const hasToday=backupLog.some(b=>(b.created_at||"").slice(0,10)===todayD);
    if(hasToday){autoBackupChecked.current=true;return;}
    const currentTotal=visits.length+bks.length+custs.length+emps.length+exps.length+
      svcs.length+cats.length+periods.length+staff.length;
    if(currentTotal===0)return;
    const lastTotal=backupLog[0]?.total_records??-1;
    if(currentTotal!==lastTotal){
      autoBackupChecked.current=true;
      cloudBackup("automatic (end of day)");
    }else{
      autoBackupChecked.current=true;
    }
  },[loading,backupLog,user,visits,bks,custs,emps,exps,svcs,cats,periods,staff]);

  async function downloadCommissionExcel(){
    const XLSX=await import("https://cdn.sheetjs.com/xlsx-0.20.3/package/xlsx.mjs");
    const wb=XLSX.utils.book_new();

    const HEADER_FILL={patternType:"solid",fgColor:{rgb:"1B2E4B"}}; // spa navy
    const SUBHEAD_FILL={patternType:"solid",fgColor:{rgb:"2D4570"}};
    const ALT_ROW={patternType:"solid",fgColor:{rgb:"F4F7FB"}};
    const TOTAL_FILL={patternType:"solid",fgColor:{rgb:"FEF9EC"}};
    const WHITE={patternType:"solid",fgColor:{rgb:"FFFFFF"}};

    function hCell(v,extra={}){
      return{v,t:"s",s:{font:{bold:true,color:{rgb:"FFFFFF"},sz:11},
        fill:HEADER_FILL,alignment:{horizontal:"center",vertical:"center",wrapText:true},
        border:{bottom:{style:"medium",color:{rgb:"FFFFFF"}}},...extra}};
    }
    function strCell(v,fill=WHITE,bold=false){
      return{v:v||"",t:"s",s:{fill,font:{bold},alignment:{wrapText:true,vertical:"top"},
        border:{bottom:{style:"thin",color:{rgb:"E0E0E0"}}}}};
    }
    function numCell(v,fill=WHITE,fmt="#,##0"){
      return{v:v!==""&&v!==null&&v!==undefined?Number(v):null,
        t:v!==""&&v!==null&&v!==undefined?"n":"s",
        s:{fill,alignment:{horizontal:"right"},numFmt:fmt,
        border:{bottom:{style:"thin",color:{rgb:"E0E0E0"}}}}};
    }

    // ── Sheet 1: Current Period Commission Summary ──────────────
    function buildPeriodSheet(empList,periodLabel,periodStart,periodEnd){
      const aoa=[];
      aoa.push([{v:"AMBAR SPA & BEAUTY — EMPLOYEE COMMISSION REPORT",t:"s",
        s:{font:{bold:true,sz:14,color:{rgb:"FFFFFF"}},fill:HEADER_FILL,alignment:{horizontal:"center"}}}]);
      aoa.push([{v:`Pay Period: ${periodLabel}  |  Exported: ${new Date().toLocaleDateString("en-GB",{day:"2-digit",month:"long",year:"numeric"})}`,
        t:"s",s:{font:{italic:true,sz:10,color:{rgb:"FFFFFF"}},fill:SUBHEAD_FILL,alignment:{horizontal:"center"}}}]);
      aoa.push([]);
      aoa.push([
        hCell("Employee"),hCell("Section"),hCell("Services\nCompleted"),
        hCell("Total Revenue\nGenerated (Birr)"),hCell("Commission\nEarned (Birr)"),
        hCell("Base\nSalary (Birr)"),hCell("Absent\nDays"),hCell("Loan\n(Birr)"),
        hCell("Broker Fee\n(Birr)"),hCell("Other\nDeduction (Birr)"),hCell("NET PAY\n(Birr)"),
      ]);
      let totalComm=0,totalRev=0,totalNet=0;
      empList.forEach((e,i)=>{
        const fill=i%2===0?WHITE:ALT_ROW;
        const net=Number(e.salary||0)+Number(e.commissionTotal||0)-Number(e.absentDays||0)*(Number(e.salary||0)/30)-Number(e.loan||0)-Number(e.brokerFee||0)-Number(e.otherDeduction||0);
        totalComm+=Number(e.commissionTotal||0);totalRev+=Number(e.totalRevenue||0);totalNet+=net;
        aoa.push([
          strCell(e.name,fill,true),
          strCell(e.section,fill),
          numCell(e.serviceCount||0,fill,"0"),
          numCell(e.totalRevenue||0,fill),
          numCell(e.commissionTotal||0,{patternType:"solid",fgColor:{rgb:"E8F5E9"}}),
          numCell(e.salary||0,fill),
          numCell(e.absentDays||0,fill,"0"),
          numCell(e.loan||0,fill),
          numCell(e.brokerFee||0,fill),
          numCell(e.otherDeduction||0,fill),
          {v:Math.round(net),t:"n",s:{fill:{patternType:"solid",fgColor:{rgb:"D6EFDB"}},
            font:{bold:true},alignment:{horizontal:"right"},numFmt:"#,##0",
            border:{bottom:{style:"thin",color:{rgb:"E0E0E0"}}}}},
        ]);
      });
      // Totals row
      aoa.push([
        {v:"TOTAL",t:"s",s:{font:{bold:true},fill:TOTAL_FILL,alignment:{horizontal:"right"}}},
        {v:"",t:"s",s:{fill:TOTAL_FILL}},
        {v:empList.reduce((s,e)=>s+(e.serviceCount||0),0),t:"n",s:{font:{bold:true},fill:TOTAL_FILL,alignment:{horizontal:"right"},numFmt:"0"}},
        {v:Math.round(totalRev),t:"n",s:{font:{bold:true},fill:TOTAL_FILL,alignment:{horizontal:"right"},numFmt:"#,##0"}},
        {v:Math.round(totalComm),t:"n",s:{font:{bold:true},fill:TOTAL_FILL,alignment:{horizontal:"right"},numFmt:"#,##0"}},
        {v:"",t:"s",s:{fill:TOTAL_FILL}},{v:"",t:"s",s:{fill:TOTAL_FILL}},
        {v:"",t:"s",s:{fill:TOTAL_FILL}},{v:"",t:"s",s:{fill:TOTAL_FILL}},{v:"",t:"s",s:{fill:TOTAL_FILL}},
        {v:Math.round(totalNet),t:"n",s:{font:{bold:true,sz:12},fill:TOTAL_FILL,alignment:{horizontal:"right"},numFmt:"#,##0"}},
      ]);
      const ws=XLSX.utils.aoa_to_sheet(aoa);
      ws["!merges"]=[{s:{r:0,c:0},e:{r:0,c:10}},{s:{r:1,c:0},e:{r:1,c:10}}];
      ws["!cols"]=[{wch:20},{wch:14},{wch:11},{wch:16},{wch:14},{wch:13},{wch:9},{wch:11},{wch:12},{wch:13},{wch:14}];
      ws["!rows"]=[{hpt:30},{hpt:22},{hpt:6},{hpt:40}];
      return ws;
    }

    const ws1=buildPeriodSheet(empC,period.label,period.start,period.end);
    XLSX.utils.book_append_sheet(wb,ws1,"Current Period");

    // ── Sheet 2: Per-Employee Service Breakdown (current period) ──
    const breakdownRows=[];
    empC.forEach(e=>{
      if(!e.breakdown||e.breakdown.length===0)return;
      e.breakdown.forEach(b=>{
        breakdownRows.push({
          "Employee":e.name,"Section":e.section,"Service":b.name,
          "Revenue (Birr)":Math.round(b.income),"Commission (Birr)":Math.round(b.commission),
        });
      });
    });
    if(breakdownRows.length>0){
      const ws2=XLSX.utils.json_to_sheet(breakdownRows);
      ws2["!cols"]=[{wch:20},{wch:14},{wch:28},{wch:14},{wch:14}];
      XLSX.utils.book_append_sheet(wb,ws2,"Service Breakdown");
    }

    // ── Sheet 3: Service Popularity per Employee ──────────────
    const popRows=[];
    empC.forEach(e=>{
      if(!e.serviceList||e.serviceList.length===0)return;
      e.serviceList.forEach(s=>{
        popRows.push({"Employee":e.name,"Service":s.name,"Times Performed":s.count});
      });
    });
    if(popRows.length>0){
      const ws3=XLSX.utils.json_to_sheet(popRows);
      ws3["!cols"]=[{wch:20},{wch:28},{wch:16}];
      XLSX.utils.book_append_sheet(wb,ws3,"Service Popularity");
    }

    // ── Sheet 4+: Historical Closed Periods (one sheet each, most recent first) ──
    const sortedHistory=[...periods].sort((a,b)=>(b.closedAt||"").localeCompare(a.closedAt||"")).slice(0,12);
    sortedHistory.forEach((p,idx)=>{
      const empList=(p.employees||[]).map(e=>({...e}));
      const ws=buildPeriodSheet(empList,p.period,p.start,p.end);
      const sheetName=("Closed "+p.period).replace(/[\\\/\?\*\[\]:]/g,"-").slice(0,31);
      XLSX.utils.book_append_sheet(wb,ws,sheetName);
    });

    // ── Summary sheet ──────────────────────────────────────────
    const summaryRows=[
      {"Category":"Export Date","Value":new Date().toLocaleDateString("en-GB")},
      {"Category":"Current Pay Period","Value":period.label},
      {"Category":"Active Employees","Value":emps.filter(e=>e.active).length},
      {"Category":"Current Period — Total Commission (Birr)","Value":Math.round(empC.reduce((s,e)=>s+(e.commissionTotal||0),0))},
      {"Category":"Current Period — Total Revenue (Birr)","Value":Math.round(empC.reduce((s,e)=>s+(e.totalRevenue||0),0))},
      {"Category":"Closed Periods Included","Value":sortedHistory.length},
    ];
    const wsS=XLSX.utils.json_to_sheet(summaryRows);
    wsS["!cols"]=[{wch:38},{wch:20}];
    XLSX.utils.book_append_sheet(wb,wsS,"Summary");

    XLSX.writeFile(wb,`ambar-spa-commission-${todayStr()}.xlsx`);
    logAct(user,"Commission Excel Exported",period.label+" + "+sortedHistory.length+" historical periods");
    push("Commission report downloaded — "+(2+sortedHistory.length+(breakdownRows.length>0?1:0)+(popRows.length>0?1:0))+" sheets","success");
  }

  async function closePeriod(){
    if(!window.confirm("Close pay period "+period.label+"?"))return;
    const snap=empC.map(e=>({id:e.id,name:e.name,section:e.section,salary:e.salary,commissionTotal:e.commissionTotal,absentDays:e.absentDays,loan:e.loan,brokerFee:e.brokerFee,otherDeduction:e.otherDeduction,loanNote:e.loanNote,otherNote:e.otherNote}));
    const{error:cpErr}=await supabase.from("closed_periods").insert({period:period.label,start_date:period.start,end_date:period.end,closed_at:new Date().toISOString(),employees:snap});
    if(cpErr){push("Failed to close period: "+cpErr.message,"error");return;}
    let resetFailed=false;
    for(const e of emps){
      const{error}=await supabase.from("employees").update({absent_days:0,loan:0,loan_note:"",broker_fee:0,other_deduction:0,other_note:""}).eq("id",e.id);
      if(error){resetFailed=true;console.error("Reset failed for",e.name,error.message);}
    }
    setEmps(p=>p.map(e=>({...e,absentDays:0,loan:0,loanNote:"",brokerFee:0,otherDeduction:0,otherNote:""})));
    logAct(user,"Closed period",period.label);
    if(resetFailed)push("Period closed, but some employee resets failed — check Employees tab","warning");
    else push("Pay period closed successfully","success");
  }
  async function saveStaff(){if(!nStaff.id.trim()||!nStaff.name.trim()||!nStaff.password.trim())return alert("Fill all fields.");const r={id:nStaff.id.trim().toLowerCase(),name:nStaff.name.trim(),role:nStaff.role,password:nStaff.password.trim(),active:true};const{error}=await supabase.from("staff").upsert(r);if(error){push("Failed to save staff: "+error.message,"error");return;}setStaff(p=>{const i=p.findIndex(s=>s.id===r.id);if(i>=0){const n=[...p];n[i]=r;return n;}return[...p,r];});logAct(user,"Staff saved",r.name);setNStaff({id:"",name:"",role:"reception",password:""});setEditStaff(null);push("Staff account saved","success");}
  async function setStaffAct(id,active){if(!window.confirm(active?"Reactivate?":"Deactivate?"))return;const{error}=await supabase.from("staff").update({active}).eq("id",id);if(error){push("Failed to update: "+error.message,"error");return;}setStaff(p=>p.map(s=>s.id===id?{...s,active}:s));}
  async function delCust(id){
    if(!window.confirm("Delete this customer? They can be restored from the Customers tab."))return;
    const c=custs.find(x=>x.id===id);if(!c)return;
    const deletedAt=new Date().toISOString();
    setCusts(p=>p.filter(x=>x.id!==id));
    // Soft delete — set deleted_at timestamp
    const{error}=await supabase.from("customers").update({deleted_at:deletedAt}).eq("id",id);
    if(error){
      setCusts(p=>[...p,c]); // rollback
      push("Failed to delete customer: "+error.message,"error");
      return;
    }
    push("Customer deleted — tap Restore in Customers tab within 30 days","warning");
    logAct(user,"Deleted customer",c.name);
  }
  async function restoreCust(id){
    const{error}=await supabase.from("customers").update({deleted_at:null}).eq("id",id);
    if(error){push("Failed to restore customer: "+error.message,"error");return;}
    const{data}=await supabase.from("customers").select("*").eq("id",id).single();
    if(data)setCusts(p=>[...p,dbCust(data)]);
    push("Customer restored","success");
  }
  function doExportCSV(){const rows=clV.filter(v=>v.status==="Paid & Closed").map(v=>({Queue:v.queue,Name:v.name,Phone:v.phone,Services:(v.services||[]).map(s=>s.name).join("|"),Total:v.totalService,Method:v.paymentMethod,Tips:v.tips.reduce((s,t)=>s+t.amount,0)}));if(!rows.length)return alert("No paid visits for this date.");exportCSV(rows,"ambar-closing-"+clDate+".csv");}

  const gc=sc.mob?"1fr":"1fr 1.15fr";

  if(user&&pinLocked)return(<div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"linear-gradient(135deg,#0f1720,#1d2a36)"}}><div style={{background:"#fff",borderRadius:24,padding:40,width:"100%",maxWidth:340,margin:"0 16px",boxShadow:"0 20px 60px rgba(0,0,0,0.4)",textAlign:"center"}}><div style={{fontSize:44,marginBottom:8}}>🔒</div><h2 style={{margin:"0 0 4px"}}>Session Locked</h2><p style={{color:"#6b7280",fontSize:13,marginBottom:20}}>Enter password to continue as {user.name}</p>{pinErr&&<div style={{background:"#fee2e2",color:"#991b1b",borderRadius:10,padding:10,marginBottom:12,fontSize:13,fontWeight:700}}>{pinErr}</div>}<input style={S.inp} type="password" value={pinInput} onChange={e=>setPinInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&unlockPin()} placeholder="Password" autoFocus/><button style={S.btnP} onClick={unlockPin}>{t("unlock")}</button><button style={S.btnS} onClick={logout}>{t("logoutInstead")}</button></div></div>);

  if(!user)return(<div style={{minHeight:"100vh",background:"linear-gradient(135deg,#0f172a,#1B2E4B)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:16}}>
    {/* Header */}
    <div style={{textAlign:"center",marginBottom:24}}>
      <div style={{fontSize:40,marginBottom:8}}>✦</div>
      <h1 style={{margin:0,fontSize:24,fontWeight:500,color:"#fff",letterSpacing:1}}>Ambar Spa & Beauty</h1>
      <p style={{margin:"6px 0 0",color:"#5A8C72",fontSize:12,letterSpacing:2}}>SALON MANAGEMENT SYSTEM</p>
    </div>
    {/* Tab switcher */}
    <div style={{display:"flex",background:"rgba(255,255,255,0.1)",borderRadius:12,padding:4,marginBottom:20,width:"100%",maxWidth:420}}>
      {["login","bookings"].map(tab=>(
        <button key={tab} onClick={()=>setLoginTab(tab)}
          style={{flex:1,padding:"10px",borderRadius:9,border:"none",background:loginTab===tab?"#fff":"transparent",color:loginTab===tab?"#1B2E4B":"#94A3B8",fontWeight:loginTab===tab?500:400,cursor:"pointer",fontSize:13,transition:"all 0.15s"}}>
          {tab==="login"?"🔐 Staff Login":"📅 Today's Bookings"}
        </button>
      ))}
    </div>
    {/* Login form */}
    {loginTab==="login"&&<div style={{background:"#fff",borderRadius:20,padding:32,width:"100%",maxWidth:420,boxShadow:"0 20px 60px rgba(0,0,0,0.4)"}}>
      {lerr&&<div style={{background:"#fee2e2",color:"#991b1b",borderRadius:10,padding:"10px 14px",marginBottom:14,fontSize:13,fontWeight:500}}>{lerr}</div>}
      <p style={S.lbl}>Username</p>
      <input style={S.inp} value={lid} onChange={e=>setLid(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doLogin()} placeholder="e.g. reception1" autoFocus/>
      <p style={S.lbl}>Password</p>
      <input style={S.inp} type="password" value={lpw} onChange={e=>setLpw(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doLogin()} placeholder="Password"/>
      <button style={{...S.btnP,marginTop:8}} onClick={doLogin}>{t("login")}</button>
    </div>}
    {/* Public bookings view */}
    {loginTab==="bookings"&&<div style={{background:"#fff",borderRadius:20,padding:20,width:"100%",maxWidth:680,boxShadow:"0 20px 60px rgba(0,0,0,0.4)",maxHeight:"70vh",overflowY:"auto"}}>
      <h2 style={{margin:"0 0 4px",fontSize:16,fontWeight:500,color:"#1B2E4B"}}>📅 Today's Bookings</h2>
      <p style={{margin:"0 0 16px",fontSize:12,color:"#64748B"}}>{new Date().toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}</p>
      {bks.filter(b=>b.date===todayStr()&&!["Cancelled","No-show"].includes(b.status)).length===0
        ?<div style={{textAlign:"center",padding:40,color:"#94A3B8"}}>No bookings today</div>
        :<div>
          {bks.filter(b=>b.date===todayStr()&&!["Cancelled","No-show"].includes(b.status)).sort((a,b2)=>a.time.localeCompare(b2.time)).map(b=>(
            <div key={b.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 14px",border:"0.5px solid #E2E8F0",borderRadius:12,marginBottom:8,background:b.status==="Confirmed"?"#F0FDF4":b.status==="Arrived"?"#EBF2FD":"#fff"}}>
              <div>
                <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                  <b style={{color:"#1B2E4B",fontSize:14}}>{b.time}</b>
                  <b style={{color:"#1B2E4B"}}>{b.customerName}</b>
                  {b.gender&&<span style={{background:"#F3E8FF",color:"#6B21A8",borderRadius:6,padding:"1px 6px",fontSize:10,fontWeight:500}}>{b.gender}</span>}
                  {b.people>1&&<span style={{background:"#F1F5F9",color:"#475569",borderRadius:6,padding:"1px 6px",fontSize:10}}>{b.people} people</span>}
                </div>
                <p style={{margin:"3px 0 0",fontSize:12,color:"#64748B"}}>{b.serviceName||"TBD"} · {Math.floor(b.durationMins/60)}h{b.durationMins%60?b.durationMins%60+"m":""}</p>
              </div>
              <span style={SB(b.status)}>{b.status}</span>
            </div>
          ))}
        </div>}
    </div>}
  </div>);

  if(loading)return(<div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#1B2E4B",color:"#fff"}}><div style={{textAlign:"center"}}><div style={{fontSize:48,marginBottom:16,animation:"spin 2s linear infinite"}}>✦</div><div style={{fontSize:18,fontWeight:500,letterSpacing:2,color:"#5A8C72"}}>AMBAR SPA & BEAUTY</div><div style={{fontSize:13,color:"#94A3B8",marginTop:8}}>Loading your workspace...</div><div style={{marginTop:20,display:"flex",gap:6,justifyContent:"center"}}>{[0,1,2].map(i=><div key={i} style={{width:8,height:8,borderRadius:"50%",background:"#5A8C72",opacity:0.4+i*0.3}}/>)}</div><style>{"@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}} @keyframes abaToastDown{from{opacity:0;transform:translateY(-100%)}to{opacity:1;transform:translateY(0)}}"}</style></div></div>);
  return(<div
    style={{minHeight:"100vh",background:"#F1F5F9",fontFamily:"Segoe UI,Arial,sans-serif",color:"#111827",touchAction:"pan-y"}}
    onTouchStart={handleTouchStart}
    onTouchMove={handleTouchMove}
    onTouchEnd={handleTouchEnd}
  >
    {/* Pull to refresh indicator */}
    {(pulling||refreshing)&&<div style={{position:"fixed",top:0,left:0,right:0,zIndex:9999,display:"flex",justifyContent:"center",paddingTop:Math.min(pullY,60)+"px",pointerEvents:"none",transition:refreshing?"none":"padding 0.1s"}}>
      <div style={{background:"#1B2E4B",color:"#5A8C72",borderRadius:20,padding:"6px 16px",fontSize:12,fontWeight:500,boxShadow:"0 4px 20px rgba(0,0,0,0.3)",display:"flex",alignItems:"center",gap:8}}>
        <span style={{display:"inline-block",animation:refreshing?"spin 1s linear infinite":"none",fontSize:14}}>↻</span>
        {refreshing?"Refreshing...":pullY>60?"Release to refresh":"Pull to refresh"}
      </div>
    </div>}
    {/* Pull to refresh indicator */}
    {(pulling||refreshing)&&<div style={{position:"fixed",top:0,left:0,right:0,zIndex:9999,display:"flex",justifyContent:"center",padding:"8px",pointerEvents:"none"}}>
      <div style={{background:"#1B2E4B",color:"#5A8C72",borderRadius:20,padding:"6px 16px",fontSize:12,fontWeight:500,boxShadow:"0 4px 20px rgba(0,0,0,0.3)",display:"flex",alignItems:"center",gap:8,transition:"opacity 0.2s"}}>
        <span style={{display:"inline-block",animation:refreshing?"spin 1s linear infinite":"none"}}>↻</span>
        {refreshing?"Refreshing...":pullY>60?"Release to refresh ↑":"Pull down to refresh"}
      </div>
    </div>}
    <Notifs items={notifs} dismiss={dismiss}/>
    {showGS&&<div style={{position:"fixed",inset:0,background:"rgba(27,46,75,0.7)",zIndex:9990,display:"flex",alignItems:"flex-start",justifyContent:"center",padding:"80px 16px 16px"}} onClick={e=>e.target===e.currentTarget&&setShowGS(false)}>
      <div style={{background:"#fff",borderRadius:16,padding:20,width:"100%",maxWidth:560,maxHeight:"70vh",overflowY:"auto",boxShadow:"0 20px 60px rgba(0,0,0,0.3)"}}>
        <input autoFocus style={{...S.inp,fontSize:15,marginBottom:12}} placeholder="Search customers, bookings, visits..." value={gSearch} onChange={e=>setGSearch(e.target.value)}/>
        {gSearch.trim().length>1&&(()=>{
          const q=gSearch.toLowerCase().trim();
          const rC=custs.filter(c=>!c.deletedAt&&(c.name.toLowerCase().includes(q)||c.phone.includes(q))).slice(0,5);
          const rV=visits.filter(v=>v.name.toLowerCase().includes(q)||v.phone.includes(q)).slice(0,5);
          const rB=bks.filter(b=>b.customerName.toLowerCase().includes(q)||b.customerPhone.includes(q)).slice(0,5);
          return <>
            {rC.length>0&&<><p style={{margin:"0 0 6px",fontSize:10,fontWeight:700,color:"#5A8C72",letterSpacing:1}}>CUSTOMERS</p>
              {rC.map(c=><div key={c.id} style={{...S.li,marginBottom:4,cursor:"pointer"}} onClick={()=>{setTab("Customers");setShowGS(false);setGSearch("");}}>
                <div><b style={{color:"#1B2E4B"}}>{c.name}</b><p style={{margin:0,fontSize:11,color:"#64748B"}}>{c.phone}</p></div>
                <span style={{fontSize:11,color:"#5A8C72"}}>Customer →</span>
              </div>)}</>}
            {rV.length>0&&<><p style={{margin:"8px 0 6px",fontSize:10,fontWeight:700,color:"#1B4FA8",letterSpacing:1}}>VISITS</p>
              {rV.map(v=><div key={v.id} style={{...S.li,marginBottom:4}}>
                <div><b style={{color:"#1B2E4B"}}>#{v.queue} — {v.name}</b><p style={{margin:0,fontSize:11,color:"#64748B"}}>{v.date} · {v.status}</p></div>
                <span style={SB(v.status)}>{v.status}</span>
              </div>)}</>}
            {rB.length>0&&<><p style={{margin:"8px 0 6px",fontSize:10,fontWeight:700,color:"#92400E",letterSpacing:1}}>BOOKINGS</p>
              {rB.map(b=><div key={b.id} style={{...S.li,marginBottom:4,cursor:"pointer"}} onClick={()=>{setTab("Bookings");setShowGS(false);setGSearch("");}}>
                <div><div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}><b style={{color:"#1B2E4B"}}>{b.customerName}</b>{b.beautyQueueNum&&<span style={{background:"#EBF2FD",color:"#1B4FA8",fontSize:9,fontWeight:700,borderRadius:4,padding:"1px 5px"}}>💇 B-Q#{b.beautyQueueNum}</span>}{b.gender&&<span style={{background:"#F3E8FF",color:"#6B21A8",fontSize:9,fontWeight:700,borderRadius:4,padding:"1px 5px"}}>{b.gender}</span>}</div><p style={{margin:0,fontSize:11,color:"#64748B"}}>{b.date} at {b.time} · {b.serviceName}</p></div>
                <span style={SB(b.status)}>{b.status}</span>
              </div>)}</>}
            {!rC.length&&!rV.length&&!rB.length&&<p style={{color:"#64748B",textAlign:"center",padding:20}}>No results for "{gSearch}"</p>}
          </>;
        })()}
      </div>
    </div>}
    {moroccoModal&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:10001,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div style={{background:"#fff",borderRadius:20,padding:28,maxWidth:340,width:"100%",textAlign:"center",boxShadow:"0 20px 60px rgba(0,0,0,0.3)"}}>
        <div style={{fontSize:36,marginBottom:12}}>🧖</div>
        <h3 style={{margin:"0 0 8px",fontSize:16,fontWeight:500,color:"#1B2E4B"}}>Morocco Bath</h3>
        <p style={{margin:"0 0 20px",fontSize:13,color:"#64748B"}}>Choose gender for the free included service:</p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <button onClick={()=>moroccoModal.resolve("F")} style={{padding:"14px",borderRadius:12,border:"0.5px solid #CBD5E0",background:"#fff",cursor:"pointer",fontSize:14,fontWeight:500,color:"#1B2E4B"}}>
            ♀ Female<br/><span style={{fontSize:11,color:"#64748B",fontWeight:400}}>Free Hair Ironing</span>
          </button>
          <button onClick={()=>moroccoModal.resolve("M")} style={{padding:"14px",borderRadius:12,border:"0.5px solid #CBD5E0",background:"#fff",cursor:"pointer",fontSize:14,fontWeight:500,color:"#1B2E4B"}}>
            ♂ Male<br/><span style={{fontSize:11,color:"#64748B",fontWeight:400}}>Free Haircut</span>
          </button>
        </div>
        <button onClick={()=>moroccoModal.resolve(null)} style={{marginTop:12,padding:"8px 20px",borderRadius:10,border:"0.5px solid #E2E8F0",background:"#F8FAFC",color:"#64748B",cursor:"pointer",fontSize:12}}>Skip free service</button>
      </div>
    </div>}
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
    {saving&&<div style={{background:"#5A8C72",color:"#fff",textAlign:"center",padding:6,fontSize:13,fontWeight:700}}>Saving...</div>}
    <div style={{maxWidth:1400,margin:"0 auto",padding:sc.mob?"12px":"28px"}}>
      <header style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",background:"#1B2E4B",color:"white",marginBottom:14,flexWrap:"wrap",gap:8,borderRadius:16,padding:"14px 18px"}}>
        <div><p style={{color:"#5A8C72",fontWeight:500,letterSpacing:2,margin:"0 0 2px",fontSize:9}}>AMBAR SPA & BEAUTY</p>
          {!sc.mob&&<h1 style={{margin:0,fontSize:18,fontWeight:500,color:"#fff"}}>Salon Management System</h1>}
          <p style={{color:"#d1d5db",fontSize:12,margin:"4px 0 0"}}>{user.name}<span style={{background:"#5A8C72",color:"#fff",borderRadius:6,padding:"1px 7px",fontSize:10,fontWeight:500,marginLeft:6}}>{user.role}</span><button onClick={()=>setShowGS(s=>!s)} style={{background:"transparent",border:"0.5px solid #334155",color:"#94A3B8",borderRadius:8,padding:"2px 8px",cursor:"pointer",fontSize:11,marginLeft:6}}>🔍</button>
          <button onClick={toggleLang} style={{background:"transparent",border:"0.5px solid #5A8C72",color:"#5A8C72",borderRadius:8,padding:"2px 8px",cursor:"pointer",fontSize:11,marginLeft:6}}>{lang==="en"?"🇪🇹 አማርኛ":"🇬🇧 English"}</button>
          {notifPerm!=="granted"&&notifPerm!=="unsupported"&&<button onClick={requestNotifPerm} style={{background:"#5A8C72",border:"none",color:"#fff",borderRadius:8,padding:"2px 8px",cursor:"pointer",fontSize:11,marginLeft:6,fontWeight:500}}>🔔 Enable Alerts</button>}
          {notifPerm==="granted"&&<span style={{color:"#5A8C72",fontSize:11,marginLeft:6}}>🔔 ✓</span>}
          <button onClick={logout} style={{background:"transparent",border:"0.5px solid #64748B",color:"#94A3B8",borderRadius:8,padding:"2px 10px",cursor:"pointer",fontSize:11,marginLeft:4}}>{t("logout")}</button></p>
        </div>
        <div style={{background:"#5A8C72",color:"#fff",borderRadius:12,padding:"10px 18px",textAlign:"center",flexShrink:0}}><p style={{margin:0,fontSize:10,fontWeight:800}}>TODAY NEXT</p><h2 style={{margin:"2px 0 0",fontSize:24,fontWeight:500,color:"#fff"}}>#{todayV.length+1}</h2></div>
      </header>

      {sc.mob?(<div style={{marginBottom:10}}><button onClick={()=>setMobNav(v=>!v)} style={{...S.btnS,marginBottom:0}}>☰ {tab}</button>{mobNav&&<div style={{background:"#fff",borderRadius:14,padding:10,marginTop:6,border:"1px solid #e6c977"}}>{allTabs.map(t=><button key={t} style={{...tab===t?S.tabA:S.tab,display:"block",width:"100%",marginBottom:4,textAlign:"left"}} onClick={()=>{setTab(t);setMobNav(false);}}>{t}</button>)}</div>}</div>):(
        <>{dailyTabs.length>0&&<><p style={S.navL}>DAILY WORKFLOW</p><div style={{display:"grid",gridTemplateColumns:sc.mob?"repeat(2,1fr)":"repeat("+dailyTabs.length+",1fr)",gap:6,marginBottom:8}}>{dailyTabs.map(tk=><button key={tk} style={tab===tk?S.tabA:S.tab} onClick={()=>{setTab(tk);if(tk!=="Checkout")setCoQ("");if(tk==="Checkout"){if(act&&act.status!=="Ready for Payment"&&act.status!=="Paid & Closed")setActId(null);}else if(tk!=="Supervisor")setActId(null);}}>{(LANG[lang]||LANG.en)[tk.toLowerCase().replace(/ /g,"").replace(/&/g,"")]||tk}</button>)}</div></>}
        {mgrTabs.length>0&&<><p style={{...S.navL,color:"#6b7280",marginTop:8}}>MANAGEMENT</p><div style={{display:"grid",gridTemplateColumns:sc.mob?"repeat(3,1fr)":"repeat("+Math.min(mgrTabs.length,7)+",1fr)",gap:6,marginBottom:14}}>{mgrTabs.map(tk=><button key={tk} style={tab===tk?{...S.tabA,background:"#243A5E",color:"#fff"}:{...S.tab,background:"#F8FAFC",color:"#475569",border:"0.5px solid #E2E8F0"}} onClick={()=>{setTab(tk);if(tk!=="Checkout")setCoQ("");if(tk==="Checkout"){if(act&&act.status!=="Ready for Payment"&&act.status!=="Paid & Closed")setActId(null);}else if(tk!=="Supervisor")setActId(null);}}>{(LANG[lang]||LANG.en)[tk.toLowerCase().replace(/ /g,"").replace(/&/g,"")]||tk}</button>)}</div></>}</>
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
          {todayV.length===0&&saving&&[1,2,3].map(i=><div key={i} style={{height:42,background:"#F1F5F9",borderRadius:10,marginBottom:6,animation:"pulse 1.5s ease-in-out infinite"}}/>)}
          {todayV.length===0&&!saving&&<EMP>No customers registered yet today.</EMP>}
          {todayV.map((v,idx)=>{
            const activeAhead=todayV.slice(0,idx).filter(x=>!["Paid & Closed","Cancelled"].includes(x.status)).length;
            const isInProgress=v.status==="In Service"||(v.services||[]).some(l=>l.status==="In Progress");
            const isWithSupervisor=v.status==="With Supervisor"&&!isInProgress;
            const isWaiting=v.status==="Waiting for Supervisor";
            const isDone=["Paid & Closed","Cancelled"].includes(v.status);
            return <div key={v.id} style={{...S.li,borderLeft:"4px solid "+(isDone?"#E2E8F0":isInProgress?"#1B4FA8":"#5A8C72"),background:isDone?"#F8FAFC":isInProgress?"#EBF2FD":"#F0FDF4"}}>
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
                {v.note&&<p style={{...S.hlp,color:v.note.includes("From Spa")?"#1B4FA8":"#374151",fontWeight:v.note.includes("From Spa")?500:400}}>{v.note.includes("From Spa")?"🧖 ":""}{v.note}</p>}
                {!isDone&&activeAhead>0&&<p style={{fontSize:11,color:"#6b7280",margin:"2px 0"}}>👥 {activeAhead} customer{activeAhead>1?"s":""} ahead</p>}
                {!isDone&&activeAhead===0&&<p style={{fontSize:11,color:"#166534",fontWeight:700,margin:"2px 0"}}>✓ You're next!</p>}
                {!isDone&&<WaitTimer vid={v.id}/>}
                {isInProgress&&(v.services||[]).filter(l=>l.status==="In Progress").map(l=><SvcTimer key={l.lineId} lineId={l.lineId} status={l.status}/>)}
              </div>
              <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                {v.status==="Waiting for Supervisor"&&v.services.length===0&&<button style={S.btnD} onClick={()=>cancelV(v.id)}>{t("cancel")}</button>}
              </div>
            </div>;
          })}
        </section>
      </main>}

      {tab==="Supervisor"&&<ErrorBoundary><main style={{display:"grid",gridTemplateColumns:sc.mob&&actId?"1fr":gc,gap:14}}>
        {/* On mobile: hide queue list when customer is selected */}
        {(!sc.mob||!actId)&&<section style={S.card}><h2 style={S.ct}>{t("queueOverview")}</h2>
          <h3 style={S.sh}>⏳ Waiting</h3>
          {visits.filter(v=>["Waiting for Supervisor","With Supervisor"].includes(v.status)&&v.date===todayStr()).length===0?<p style={{...S.hlp,color:"#374151"}}>No one waiting.</p>
            :visits.filter(v=>["Waiting for Supervisor","With Supervisor"].includes(v.status)&&v.date===todayStr()).map((v,i,arr)=>{
              const ahead=arr.slice(0,i).length;
              return <button key={v.id} style={actId===v.id?S.liA:S.liB} onClick={()=>{setActId(v.id);setShowHist(false);if(sc.mob)setTimeout(()=>window.scrollTo({top:0,behavior:"smooth"}),50);}}>
                <span style={{color:"inherit"}}>
                  <b style={{color:"inherit"}}>#{v.queue} — {v.name}</b>
                  {v.note&&<span style={{fontSize:11,marginLeft:8,color:actId===v.id?"rgba(255,255,255,0.7)":"#64748B"}}>({v.note})</span>}
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
                {inProg.map(({visit:vv,line},i)=><button key={line.lineId} style={actId===vv.id?S.liA:{...S.liB,background:"#EBF2FD",border:"0.5px solid #BFDBFE"}} onClick={()=>{setActId(vv.id);setShowHist(false);if(sc.mob)setTimeout(()=>window.scrollTo({top:0,behavior:"smooth"}),50);}}>
                  <span style={{display:"flex",alignItems:"center",gap:6,color:"inherit"}}><span style={{background:"#1B4FA8",color:"#fff",borderRadius:5,padding:"1px 6px",fontSize:10,fontWeight:800}}>IN PROGRESS</span><b>#{vv.queue}</b> {vv.name}</span><span style={SB("In Progress")}>{line.status}</span>
                </button>)}
                {waiting.map(({visit:vv,line},i)=><button key={line.lineId} style={actId===vv.id?S.liA:S.liB} onClick={()=>{setActId(vv.id);setShowHist(false);if(sc.mob)setTimeout(()=>window.scrollTo({top:0,behavior:"smooth"}),50);}}>
                  <span style={{display:"flex",alignItems:"center",gap:6,color:"inherit"}}>{i===0&&inProg.length===0&&<span style={{background:"#166534",color:"#fff",borderRadius:5,padding:"1px 6px",fontSize:10,fontWeight:800}}>NEXT</span>}{i===0&&inProg.length>0&&<span style={{background:"#5A8C72",color:"#fff",borderRadius:5,padding:"1px 6px",fontSize:10,fontWeight:800}}>UP NEXT</span>}<b>#{vv.queue}</b> {vv.name}</span><span style={SB("Waiting")}>Waiting</span>
                </button>)}
                {onHold.length>0&&<div style={{marginTop:6,paddingTop:6,borderTop:"1px dashed #e5e7eb"}}>
                  <p style={{fontSize:11,color:"#6b21a8",fontWeight:700,margin:"0 0 4px"}}>⏸ On Hold — will get priority when current service completes</p>
                  {onHold.map(({visit:vv,line})=><button key={line.lineId} style={actId===vv.id?S.liA:{...S.liB,background:"#faf5ff",border:"1px solid #e9d5ff"}} onClick={()=>setActId(vv.id)}>
                    <span style={{display:"flex",alignItems:"center",gap:6}}><span style={{background:"#7c3aed",color:"#fff",borderRadius:5,padding:"1px 6px",fontSize:10,fontWeight:800}}>HOLD</span><b>#{vv.queue}</b> {vv.name}</span><span style={SB("On Hold")}>On Hold</span>
                  </button>)}
                </div>}
              </div>);})}
        </section>}
        {sc.mob&&actId&&<button onClick={()=>{setActId(null);window.scrollTo({top:0,behavior:"smooth"});}} style={{...S.btnS,width:"auto",padding:"8px 16px",marginBottom:8,display:"flex",alignItems:"center",gap:6,fontWeight:500,color:"#1B2E4B"}}>← Back to Queue</button>}
        <section style={S.card}>
          {!act?(!sc.mob&&<EMP>← Select a customer to assign services.</EMP>):!act.services?<EMP>Loading...</EMP>:<>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:12,flexWrap:"wrap",gap:8}}>
              <div><h2 style={{...S.ct,marginBottom:2}}>#{act.queue} — {act.name}</h2><p style={S.hlp}>{act.groupName||"Individual"} · {act.status}</p></div>
              {(()=>{
                const custHistory=visits.filter(v=>v.phone===act.phone&&v.status==="Paid & Closed"&&v.id!==act.id).slice(-5).reverse();
                const custFav=(()=>{const all=custHistory.flatMap(v=>(v.services||[]).map(l=>l.name));if(!all.length)return null;return all.sort((a,b)=>all.filter(x=>x===b).length-all.filter(x=>x===a).length)[0];})();
                if(!custHistory.length)return null;
                return <>
                  <button onClick={()=>setShowHist(s=>!s)} style={{...S.btnS,width:"auto",padding:"4px 12px",marginBottom:0,fontSize:11,color:"#1B4FA8",borderColor:"#BFDBFE"}}>
                    📋 {showHist?"Hide":"See"} History ({custHistory.length} visit{custHistory.length>1?"s":""})
                  </button>
                  {showHist&&<div style={{background:"#F0F9FF",border:"0.5px solid #BAE6FD",borderRadius:12,padding:12,marginTop:8}}>
                    {custFav&&<p style={{margin:"0 0 8px",fontSize:12,color:"#0369A1",fontWeight:500}}>⭐ Usually gets: <b>{custFav}</b></p>}
                    {custHistory.map((v,i)=><div key={v.id} style={{marginBottom:i<custHistory.length-1?8:0,paddingBottom:i<custHistory.length-1?8:0,borderBottom:i<custHistory.length-1?"0.5px solid #E0F2FE":"none"}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                        <span style={{fontSize:12,fontWeight:500,color:"#1B2E4B"}}>{v.date}</span>
                        <b style={{fontSize:12,color:"#166534"}}>{money(v.totalService)}</b>
                      </div>
                      {(v.services||[]).filter(l=>l.status!=="Cancelled").map((l,j)=><p key={j} style={{margin:"1px 0",fontSize:11,color:"#475569"}}>· {l.name}{l.employee?" — "+l.employee:""}</p>)}
                    </div>)}
                  </div>}
                </>;
              })()}
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
            {!["Paid & Closed","Ready for Payment"].includes(act.status)&&<button style={S.btnG} onClick={markReady}>{t("markReady")}</button>}
          </>}
        </section>
      </main></ErrorBoundary>}

      {tab==="Checkout"&&<main style={{display:"grid",gridTemplateColumns:gc,gap:14}}>
        <section style={S.card}><h2 style={S.ct}>{t("checkoutToday")}</h2>
          <input style={S.inp} placeholder={t("searchCheckout")} value={coQ} onChange={e=>setCoQ(e.target.value)}/>
          {coList.length===0&&<EMP>No customers marked Ready for Payment yet. Supervisor must mark customers ready before they appear here.</EMP>}
          {coList.map(v=><button key={v.id} style={actId===v.id?S.liA:S.liB} onClick={()=>setActId(v.id)}><span>#{v.queue} — {v.name}</span><span style={SB(v.status)}>{v.status==="Ready for Payment"?"Ready — "+money(v.totalService):v.status}</span></button>)}
        </section>
        <section style={S.card}>
          {!act?<EMP>← Select customer to process payment.</EMP>
           :act.status==="Paid & Closed"?<div>
            <div style={{background:"#dcfce7",color:"#166534",borderRadius:11,padding:16,fontSize:15,fontWeight:700,marginBottom:10}}>✓ Paid — {money(act.totalPaid)} via {act.paymentMethod}</div>
            <button style={{...S.btnS,display:"flex",alignItems:"center",gap:6,justifyContent:"center"}} onClick={()=>printReceipt(act,emps)}>{t("printReceipt")}</button>
            {act.services&&act.services.some(l=>l.sub==="Spa"||l.employeeSection==="Spa")&&!act.beautyQueueNum&&
              <button style={{...S.btnS,color:"#1B4FA8",borderColor:"#BFDBFE",fontWeight:500}}
                onClick={()=>giveBeautyQueueFromVisit(act)}>
                💇 Get Beauty Salon Queue + Transfer Services
              </button>}
            {act.beautyQueueNum&&<div style={{background:"#EBF2FD",borderRadius:10,padding:"8px 12px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{color:"#1B4FA8",fontWeight:500,fontSize:13}}>💇 Beauty Salon Queue #{act.beautyQueueNum}</span>
              <span style={{fontSize:11,color:"#64748B"}}>Services transferred ✓</span>
            </div>}
            <button style={{...S.btnS,color:"#dc2626",borderColor:"#fca5a5"}} onClick={()=>setShowRefund(v=>!v)}>↩ Issue Refund</button>
            {showRefund&&<div style={{background:"#fff5f5",border:"1px solid #fca5a5",borderRadius:12,padding:14,marginTop:6}}>
              <p style={{margin:"0 0 8px",fontWeight:800,fontSize:13,color:"#991b1b"}}>Issue Refund for {act.name}</p>
              <p style={{margin:"0 0 8px",fontSize:12,color:"#6b7280"}}>Paid: {money(act.totalPaid)} · Max refund: {money(act.totalPaid)}</p>
              <input style={S.inp} type="number" placeholder="Refund amount (Birr)" value={refundAmt} onChange={e=>setRefundAmt(e.target.value)}/>
              <input style={S.inp} placeholder="Reason (optional)" value={refundReason} onChange={e=>setRefundReason(e.target.value)}/>
              <button style={{...S.btnP,background:"#dc2626",color:"#fff"}} onClick={()=>processRefund(act.id)}>Confirm Refund</button>
            </div>}
          </div>
           :!act.services?<EMP>Loading...</EMP>
           :act.status!=="Ready for Payment"?<div style={{textAlign:"center",padding:"40px 20px"}}>
              <div style={{fontSize:40,marginBottom:12}}>⏳</div>
              <h3 style={{margin:"0 0 8px",color:"#1B2E4B"}}>#{act.queue} — {act.name}</h3>
              <p style={{color:"#64748B",fontSize:14,margin:"0 0 4px"}}>Status: <b style={{color:"#92400E"}}>{act.status}</b></p>
              <p style={{color:"#64748B",fontSize:13,margin:0}}>This customer is not ready for payment yet.<br/>Supervisor must mark them "Ready for Payment" first.</p>
              <button style={{...S.btnS,marginTop:16}} onClick={()=>setActId(null)}>← Back to list</button>
            </div>
           :<><h2 style={S.ct}>#{act.queue} — {act.name}</h2>
            <SLines visit={act} emps={emps} mode="checkout" onUpd={(l,f,v)=>updLine(act.id,l,f,v)} onRem={l=>remLine(act.id,l)} onMove={(l,d)=>moveLine(act.id,l,d)}/>
            <HR/><h3 style={{margin:"0 0 4px",fontWeight:800}}>Tips</h3><p style={S.hlp}>Tips go directly to employees, not counted as revenue.</p>
            <div style={S.r2}><select style={S.inp} value={tipEmp} onChange={e=>setTipEmp(e.target.value)}><option value="">Select employee</option>{emps.filter(e=>e.active).map(e=><option key={e.id}>{e.name}</option>)}</select><input style={S.inp} type="number" value={tipAmt} onChange={e=>setTipAmt(e.target.value)} placeholder="Amount (Birr)"/></div>
            <button style={S.btnS} onClick={addTip}>{t("addTip")}</button>
            {tips.map(t=><div key={t.id} style={S.li}><span>{t.employee}</span><span style={{display:"flex",gap:8,alignItems:"center"}}><b>{money(t.amount)}</b><button style={S.btnD} onClick={()=>setTips(p=>p.filter(x=>x.id!==t.id))}>×</button></span></div>)}
            <HR/><L>Payment Method</L>
            <select style={S.inp} value={payM} onChange={e=>{setPayM(e.target.value);setCashGiven("");}}>
              <option>Cash</option><option>Transfer</option><option>Telebirr</option><option>Card</option>
            </select>
            {payM==="Cash"&&(()=>{
              const coTotal=(act.totalService||0)+tips.reduce((s,t2)=>s+Number(t2.amount||0),0);
              const given=Number(cashGiven)||0;const change=given-coTotal;
              return <div style={{background:"#F8FAFC",border:"0.5px solid #E2E8F0",borderRadius:12,padding:12,marginBottom:8}}>
                <p style={{margin:"0 0 8px",fontSize:12,fontWeight:500,color:"#1B2E4B"}}>💵 Cash Calculator</p>
                <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:8}}>
                  {[500,1000,2000,5000].map(amt=>(
                    <button key={amt} onClick={()=>setCashGiven(String(amt))}
                      style={{flex:1,minWidth:60,padding:"8px 4px",borderRadius:9,border:"0.5px solid "+(Number(cashGiven)===amt?"#1B2E4B":"#CBD5E0"),background:Number(cashGiven)===amt?"#1B2E4B":"#fff",color:Number(cashGiven)===amt?"#fff":"#1B2E4B",fontSize:12,fontWeight:500,cursor:"pointer"}}>
                      {amt.toLocaleString()}
                    </button>
                  ))}
                </div>
                <input style={{...S.inp,marginBottom:6}} type="number" placeholder="Amount received (Birr)..." value={cashGiven} onChange={e=>setCashGiven(e.target.value)}/>
                {given>0&&<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 14px",background:change>=0?"#EBF5EE":"#FEF2F2",borderRadius:10,border:"0.5px solid "+(change>=0?"#86EFAC":"#FECACA")}}>
                  <span style={{fontSize:13,color:change>=0?"#166534":"#B91C1C",fontWeight:500}}>Change to give back</span>
                  <b style={{fontSize:18,color:change>=0?"#166534":"#B91C1C"}}>{change>=0?change.toLocaleString()+" Birr":"⚠ Not enough"}</b>
                </div>}
              </div>;
            })()}
            <div style={S.tb}><span style={{color:"#94A3B8",fontSize:12}}>Service Total</span><b style={{color:"#fff"}}>{money(act.totalService)}</b></div>
            {tips.length>0&&<div style={{...S.tb,background:"#1e3a2f",marginTop:6}}><span>Tips Total</span><b>{money(tips.reduce((s,t)=>s+t.amount,0))}</b></div>}
            <div style={{...S.tb,marginTop:6,fontSize:16,background:"#0f172a"}}><span style={{color:"#94A3B8",fontSize:12}}>Customer Pays</span><b style={{color:"#5A8C72",fontSize:16}}>{money(act.totalService+tips.reduce((s,t)=>s+t.amount,0))}</b></div>
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
                  {v.status==="Paid & Closed"?<span style={{color:"#166534",fontWeight:700}}>✓ Paid</span>:<button style={{...S.btnP,width:"auto",padding:"6px 14px",marginBottom:0}} onClick={async()=>{
                    const prevStatus=v.status;
                    setVisits(prev=>prev.map(x=>x.id===v.id?{...x,status:"Paid & Closed",paymentMethod:payM,totalPaid:v.totalService}:x));
                    const{error}=await supabase.from("visits").update({payment_method:payM,total_paid:v.totalService,status:"Paid & Closed",tips:[]}).eq("id",v.id);
                    if(error){
                      push("Payment failed to save — please retry: "+error.message,"error");
                      setVisits(prev=>prev.map(x=>x.id===v.id?{...x,status:prevStatus}:x));
                    }
                  }}>Pay {money(v.totalService)}</button>}
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
            <EthPicker value={bkDate} onChange={d=>setBkDate((d||"").slice(0,10))} bookingDates={[...new Set(bks.filter(b=>!["Cancelled","No-show","Completed"].includes(b.status)).map(b=>b.date))]}/>
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
          {/* Gender — shown for Spa bookings */}
          {svcs.find(sv=>sv.id===Number(bkF.serviceId)&&sv.category==="Spa")&&<div style={{background:"#F8FAFC",border:"0.5px solid #E2E8F0",borderRadius:12,padding:14,marginBottom:12}}>
            <p style={{margin:"0 0 10px",fontSize:12,fontWeight:500,color:"#1B2E4B"}}>Spa Preference</p>
            <L>Gender</L>
            <div style={{display:"flex",gap:8,marginBottom:4}}>
              {["Female","Male"].map(g=>(
                <button key={g} onClick={()=>setBkF(p=>({...p,gender:p.gender===g?"":g}))}
                  style={{flex:1,padding:"10px 4px",borderRadius:10,border:"0.5px solid "+(bkF.gender===g?"#1B2E4B":"#CBD5E0"),background:bkF.gender===g?"#1B2E4B":"#fff",color:bkF.gender===g?"#fff":"#475569",fontSize:13,fontWeight:bkF.gender===g?500:400,cursor:"pointer"}}>
                  {g==="Female"?"♀ Female":"♂ Male"}
                </button>
              ))}
            </div>
          </div>}
          <div style={S.r2}><button style={S.btnP} onClick={saveBk}>{t("saveBooking")}</button><button style={S.btnS} onClick={()=>{setShowBkF(false);setEditBk(null);setBkWarn("");}}>{t("cancel")}</button></div>
        </div>}

        <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:8,flexWrap:"wrap"}}>
          <input style={{...S.inp,marginBottom:0,flex:1,minWidth:180}} placeholder="Search by name, phone or service..." value={bkSearch} onChange={e=>setBkSearch(e.target.value)}/>
          {bkSearch&&<button style={{...S.btnD,whiteSpace:"nowrap"}} onClick={()=>setBkSearch("")}>Clear</button>}
          <button style={{...S.btnS,width:"auto",padding:"8px 14px",marginBottom:0}} onClick={async()=>{const{data,error}=await supabase.from("bookings").select("*").order("date",{ascending:true}).order("time",{ascending:true});if(data){setBks(data.map(dbBk));push("Loaded "+data.length+" bookings","success");}if(error)push("Error: "+error.message,"warning");}}>{t("refresh")}</button>
        </div>
        <div style={{background:"#f0f9ff",border:"1px solid #bae6fd",borderRadius:10,padding:"8px 12px",marginBottom:10,fontSize:12,color:"#0369a1"}}>
          📊 {bks.filter(b=>!["Cancelled","No-show","Completed"].includes(b.status)&&b.date>=todayStr()).length} active upcoming bookings · {bks.filter(b=>b.date===bkDate&&!["Cancelled","No-show","Completed"].includes(b.status)).length} on selected date · {bks.filter(b=>b.status==="Pending"&&b.date>=todayStr()).length} pending confirmation
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
                        {(()=>{
                          const cPh=b.customerPhone;
                          const cVisits=visits.filter(v=>v.phone===cPh&&v.status==="Paid & Closed");
                          const allSvcs=cVisits.flatMap(v=>(v.services||[]).map(l=>l.name));
                          const fav=allSvcs.length?allSvcs.sort((a2,b2)=>allSvcs.filter(x=>x===b2).length-allSvcs.filter(x=>x===a2).length)[0]:null;
                          if(!cVisits.length)return <span style={{background:"#EBF2FD",color:"#1B4FA8",borderRadius:5,padding:"1px 6px",fontSize:10,marginLeft:6}}>New customer</span>;
                          return <span style={{background:"#EBF5EE",color:"#166534",borderRadius:5,padding:"1px 6px",fontSize:10,marginLeft:6}}>
                            {cVisits.length} visit{cVisits.length>1?"s":""}{fav?" · fav: "+fav.slice(0,20):""}
                          </span>;
                        })()}
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
                        {["Confirmed","Pending","Arrived"].includes(b.status)&&!b.beautyQueueNum&&b.serviceCategory==="Spa"&&
                          <button style={{...S.btnS,width:"auto",padding:"3px 10px",marginBottom:0,fontSize:11,color:"#1B4FA8",borderColor:"#BFDBFE",fontWeight:500}}
                            onClick={()=>giveBeautyQueue(b)}>
                            💇 Get Beauty Queue
                          </button>}
                        {b.beautyQueueNum&&<span style={{background:"#EBF2FD",color:"#1B4FA8",borderRadius:6,padding:"2px 9px",fontSize:11,fontWeight:500}}>💇 Beauty Q#{b.beautyQueueNum}</span>}
                        {b.beautyQueueNum&&<span style={{background:"#EBF2FD",color:"#1B4FA8",borderRadius:6,padding:"2px 8px",fontSize:10,fontWeight:700,marginRight:4}}>💇 Beauty Q#{b.beautyQueueNum}</span>}
                        {b.status==="Arrived"&&<><span style={{color:"#166534",fontWeight:700,fontSize:11,padding:"3px 8px"}}>✓ Checked In</span><button style={{...S.btnS,width:"auto",padding:"3px 10px",marginBottom:0,fontSize:11}} onClick={()=>updBk(b.id,"Completed")}>{t("markDone")}</button></>
                        }
                        {["Pending","Confirmed","Arrived"].includes(b.status)&&<button style={{...S.btnS,width:"auto",padding:"3px 8px",marginBottom:0,fontSize:10}} onClick={()=>printBookingSlip(b)}>🖨 Slip</button>}
                        {!["Completed","Cancelled","No-show","Arrived"].includes(b.status)&&<>
                        <button style={{...S.btnS,width:"auto",padding:"3px 8px",marginBottom:0,fontSize:11}} onClick={()=>{setEditBk(b);setShowBkF(true);setBkF({customerName:b.customerName,customerPhone:b.customerPhone,serviceId:String(b.serviceId),date:b.date,time:b.time,people:b.people,notes:b.notes});}}>Edit</button>
                        <button style={{...S.btnS,width:"auto",padding:"3px 8px",marginBottom:0,fontSize:11,color:"#1B4FA8",borderColor:"#BFDBFE"}} onClick={()=>{setEditBk(b);setShowBkF(true);setBkF({customerName:b.customerName,customerPhone:b.customerPhone,serviceId:String(b.serviceId),date:"",time:"",people:b.people,notes:b.notes,gender:b.gender||"",wantBeautyQueue:false});}}>📅 Reschedule</button>
                      </>}
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
          <div><h3 style={S.sh}>Categories</h3><div style={S.r2}><input style={S.inp} value={newCat} onChange={e=>setNewCat(e.target.value)} placeholder="New category" onKeyDown={e=>e.key==="Enter"&&addCat()}/><button style={S.btnS} onClick={addCat}>+ Add</button></div><div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{cats.map(c=><span key={c} style={{background:"#5A8C72",color:"#fff",borderRadius:14,padding:"2px 10px",fontSize:11,fontWeight:700}}>{c}</span>)}</div></div>
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
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:8}}>
          <div><h2 style={{...S.ct,marginBottom:4}}>📦 Inventory Management</h2>
            <p style={{margin:0,fontSize:12,color:"#6b7280"}}>{inventory.length} items · {lowStock.length} low stock</p>
          </div>
          <div style={{display:"flex",gap:6}}>
            <SC label="Total Items" value={inventory.length}/>
            <SC label="Low Stock" value={lowStock.length} accent={lowStock.length>0}/>
            <SC label="Total Value" value={money(inventory.reduce((s,i)=>s+i.qty*i.price,0))} highlight/>
          </div>
        </div>

        {/* Low stock alert */}
        {lowStock.length>0&&<div style={{background:"#fff5f5",border:"1px solid #fca5a5",borderRadius:14,padding:14,marginBottom:16}}>
          <p style={{margin:"0 0 8px",fontWeight:800,color:"#dc2626",fontSize:14}}>⚠️ Low Stock Alert — {lowStock.length} item{lowStock.length>1?"s":""} need restocking</p>
          <div style={{display:"grid",gridTemplateColumns:sc.mob?"1fr":"1fr 1fr",gap:6}}>
            {lowStock.map(i=><div key={i.id} style={{background:"#fff",borderRadius:10,padding:"8px 12px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div><b style={{color:"#dc2626",fontSize:13}}>{i.name}</b><p style={{margin:0,fontSize:11,color:"#6b7280"}}>{i.category}</p></div>
              <div style={{textAlign:"right"}}><b style={{color:"#dc2626",fontSize:16}}>{i.qty}</b><p style={{margin:0,fontSize:10,color:"#9ca3af"}}>min: {i.minQty} {i.unit}</p></div>
            </div>)}
          </div>
        </div>}

        {/* Add item form */}
        <div style={{background:"#F1F5F9",border:"1px solid #e5e7eb",borderRadius:14,padding:14,marginBottom:16}}>
          <h3 style={{margin:"0 0 12px",fontSize:13,fontWeight:800,color:"#111827"}}>+ Add New Item</h3>
          <div style={{display:"grid",gridTemplateColumns:sc.mob?"1fr":"1fr 1fr",gap:8,marginBottom:8}}>
            <div><p style={{margin:"0 0 3px",fontSize:11,fontWeight:700,color:"#374151"}}>Item Name *</p><input style={S.inp} placeholder="e.g. Shampoo" value={nInv.name} onChange={e=>setNInv({...nInv,name:e.target.value})}/></div>
            <div><p style={{margin:"0 0 3px",fontSize:11,fontWeight:700,color:"#374151"}}>Category *</p><select style={S.inp} value={nInv.category} onChange={e=>setNInv({...nInv,category:e.target.value})}>{INV_CATS.map(c=><option key={c}>{c}</option>)}</select></div>
            <div><p style={{margin:"0 0 3px",fontSize:11,fontWeight:700,color:"#374151"}}>Quantity *</p><input style={S.inp} type="number" placeholder="e.g. 10" value={nInv.qty} onChange={e=>setNInv({...nInv,qty:e.target.value})}/></div>
            <div><p style={{margin:"0 0 3px",fontSize:11,fontWeight:700,color:"#374151"}}>Unit</p><input style={S.inp} placeholder="pcs / ml / g / L" value={nInv.unit} onChange={e=>setNInv({...nInv,unit:e.target.value})}/></div>
            <div><p style={{margin:"0 0 3px",fontSize:11,fontWeight:700,color:"#374151"}}>Min. Stock (alert below this)</p><input style={S.inp} type="number" placeholder="e.g. 2" value={nInv.minQty} onChange={e=>setNInv({...nInv,minQty:e.target.value})}/></div>
            <div><p style={{margin:"0 0 3px",fontSize:11,fontWeight:700,color:"#374151"}}>Unit Price (Birr)</p><input style={S.inp} type="number" placeholder="e.g. 150" value={nInv.price} onChange={e=>setNInv({...nInv,price:e.target.value})}/></div>
          </div>
          <button style={S.btnP} onClick={addInvItem}>+ Add to Inventory</button>
        </div>

        {/* Items by category */}
        {INV_CATS.map(cat=>{
          const items=inventory.filter(i=>i.category===cat);
          if(!items.length)return null;
          return(<div key={cat} style={{marginBottom:16}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <h3 style={{margin:0,fontSize:13,fontWeight:800,color:"#111827"}}>{cat}</h3>
              <span style={{fontSize:11,color:"#6b7280"}}>{items.length} items · {money(items.reduce((s,i)=>s+i.qty*i.price,0))} value</span>
            </div>
            {items.map(i=>{
              const low=i.minQty>0&&i.qty<=i.minQty;
              const isEditing=editInvId===i.id;
              if(isEditing){
                const d=editInvData;
                return <div key={i.id} style={{background:"#F0F9FF",border:"1px solid #BAE6FD",borderRadius:14,padding:14,marginBottom:8}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                    <b style={{fontSize:13,color:"#0369A1"}}>✏ Editing: {i.name}</b>
                    <button onClick={()=>setEditInvId(null)} style={{background:"transparent",border:"none",fontSize:18,cursor:"pointer",color:"#64748B"}}>×</button>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:sc.mob?"1fr":"1fr 1fr",gap:8,marginBottom:10}}>
                    <div><p style={S.lbl}>Name</p>
                      <input style={S.inp} value={d.name??i.name} onChange={e=>setEditInvData(p=>({...p,name:e.target.value}))}/></div>
                    <div><p style={S.lbl}>Category</p>
                      <select style={S.inp} value={d.category??i.category} onChange={e=>setEditInvData(p=>({...p,category:e.target.value}))}>
                        {INV_CATS.map(c=><option key={c}>{c}</option>)}
                      </select></div>
                    <div><p style={S.lbl}>Quantity</p>
                      <input style={S.inp} type="number" value={d.qty??i.qty} onChange={e=>setEditInvData(p=>({...p,qty:Number(e.target.value)}))}/></div>
                    <div><p style={S.lbl}>Unit (pcs / ml / g)</p>
                      <input style={S.inp} value={d.unit??i.unit} onChange={e=>setEditInvData(p=>({...p,unit:e.target.value}))}/></div>
                    <div><p style={S.lbl}>Min. Stock Alert</p>
                      <input style={S.inp} type="number" value={d.minQty??i.minQty} onChange={e=>setEditInvData(p=>({...p,minQty:Number(e.target.value)}))}/>
                      <p style={{margin:"-6px 0 0",fontSize:10,color:"#64748B"}}>Alert fires when qty falls below this number</p></div>
                    <div><p style={S.lbl}>Unit Price (Birr)</p>
                      <input style={S.inp} type="number" value={d.price??i.price} onChange={e=>setEditInvData(p=>({...p,price:Number(e.target.value)}))}/></div>
                  </div>
                  <div style={{display:"flex",gap:8}}>
                    <button style={{...S.btnP,marginBottom:0}} onClick={()=>updateInvItem(i.id,editInvData)}>✓ Save Changes</button>
                    <button style={{...S.btnS,marginBottom:0,width:"auto",padding:"0 16px"}} onClick={()=>setEditInvId(null)}>Cancel</button>
                    <button style={{...S.btnD,marginLeft:"auto"}} onClick={()=>delInvItem(i.id)}>Delete</button>
                  </div>
                </div>;
              }
              return <div key={i.id} style={{background:low?"#FEF2F2":"#fff",border:"0.5px solid "+(low?"#FECACA":"#E2E8F0"),borderRadius:12,padding:"10px 14px",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
                <div style={{flex:1,minWidth:120}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                    <b style={{color:low?"#B91C1C":"#1B2E4B",fontSize:14}}>{i.name}</b>
                    {low&&<span style={{background:"#FEE2E2",color:"#B91C1C",borderRadius:6,padding:"1px 7px",fontSize:10,fontWeight:500}}>LOW STOCK</span>}
                  </div>
                  <p style={{margin:"2px 0 0",fontSize:11,color:"#64748B"}}>{i.category}{i.price>0?" · "+money(i.price)+"/"+i.unit:""}{i.minQty>0?" · Min: "+i.minQty+" "+i.unit:""}</p>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <button onClick={()=>updInvQty(i.id,-1)} style={{width:32,height:32,borderRadius:8,border:"0.5px solid #CBD5E0",background:"#fff",cursor:"pointer",fontSize:16,color:"#1B2E4B"}}>−</button>
                  <div style={{textAlign:"center",minWidth:48}}>
                    <b style={{fontSize:20,color:low?"#B91C1C":"#1B2E4B",display:"block",fontWeight:500}}>{i.qty}</b>
                    <span style={{fontSize:9,color:"#94A3B8"}}>{i.unit}</span>
                  </div>
                  <button onClick={()=>updInvQty(i.id,1)} style={{width:32,height:32,borderRadius:8,border:"0.5px solid #CBD5E0",background:"#fff",cursor:"pointer",fontSize:16,color:"#1B2E4B"}}>+</button>
                  <button onClick={()=>{setEditInvId(i.id);setEditInvData({});}} style={{width:32,height:32,borderRadius:8,border:"0.5px solid #CBD5E0",background:"#F8FAFC",cursor:"pointer",fontSize:13,color:"#1B2E4B"}} title="Edit">✏</button>
                  <button onClick={()=>delInvItem(i.id)} style={{width:32,height:32,borderRadius:8,border:"none",background:"#FEE2E2",color:"#B91C1C",cursor:"pointer",fontSize:14}}>×</button>
                </div>
              </div>;
            })}
          </div>);
        })}
        {inventory.length===0&&<EMP>No inventory items yet. Add your first item above.</EMP>}

        {/* ── Inventory Activity Log ── */}
        <HR/>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,flexWrap:"wrap",gap:8}}>
          <h3 style={S.sh}>📋 Stock Movement Log</h3>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {["all","in","out"].map(f=>(
              <button key={f} onClick={()=>setInvLogFilter(f)}
                style={{padding:"4px 12px",borderRadius:20,border:"0.5px solid "+(invLogFilter===f?"#1B2E4B":"#E2E8F0"),
                  background:invLogFilter===f?"#1B2E4B":"#fff",color:invLogFilter===f?"#fff":"#475569",fontSize:11,fontWeight:invLogFilter===f?500:400,cursor:"pointer"}}>
                {f==="all"?"All":f==="in"?"➕ Stock In":"➖ Stock Out"}
              </button>
            ))}
            <button onClick={()=>setShowInvLog(s=>!s)}
              style={{padding:"4px 12px",borderRadius:20,border:"0.5px solid #E2E8F0",background:"#fff",color:"#475569",fontSize:11,cursor:"pointer"}}>
              {showInvLog?"Hide Log":"Show Log"}
            </button>
          </div>
        </div>
        {showInvLog&&<>
          {invLog.filter(e=>invLogFilter==="all"||e.type===invLogFilter).length===0
            ?<EMP>No stock movements recorded yet.</EMP>
            :<div style={{maxHeight:400,overflowY:"auto"}}>
              {(()=>{
                const filtered=invLog.filter(e=>invLogFilter==="all"||e.type===invLogFilter);
                const byDate={};
                filtered.forEach(e=>{const dk=e.ts?e.ts.slice(0,10):"Unknown";if(!byDate[dk])byDate[dk]=[];byDate[dk].push(e);});
                const dates=Object.entries(byDate).sort((a,b)=>b[0].localeCompare(a[0]));
                return dates.map(([date,entries])=>(
                  <div key={date} style={{marginBottom:14}}>
                    <p style={{margin:"0 0 6px",fontSize:11,fontWeight:700,color:"#1B2E4B",background:"#F8FAFC",padding:"4px 8px",borderRadius:6}}>
                      {date} — {entries.length} movement{entries.length>1?"s":""}
                      {" · "}
                      <span style={{color:"#2D7D46"}}>+{entries.filter(e=>e.type==="in").reduce((s,e)=>s+Math.abs(e.change),0)}</span>
                      {" · "}
                      <span style={{color:"#B91C1C"}}>−{entries.filter(e=>e.type==="out").reduce((s,e)=>s+Math.abs(e.change),0)}</span>
                    </p>
                    {entries.map(e=>(
                      <div key={e.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 10px",background:"#fff",border:"0.5px solid #E2E8F0",borderRadius:9,marginBottom:4}}>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                            <span style={{background:e.type==="in"?"#EBF5EE":"#FEF2F2",color:e.type==="in"?"#166534":"#B91C1C",borderRadius:5,padding:"1px 7px",fontSize:10,fontWeight:700}}>
                              {e.type==="in"?"IN":"OUT"}
                            </span>
                            <b style={{fontSize:13,color:"#1B2E4B"}}>{e.itemName}</b>
                            <span style={{fontSize:11,color:"#64748B"}}>{e.category}</span>
                          </div>
                          <p style={{margin:"2px 0 0",fontSize:11,color:"#64748B"}}>{e.reason} · by {e.staff} · Stock: {e.newQty}</p>
                        </div>
                        <div style={{textAlign:"right",flexShrink:0}}>
                          <b style={{fontSize:16,color:e.type==="in"?"#2D7D46":"#B91C1C"}}>{e.type==="in"?"+":""}{e.change}</b>
                          <p style={{margin:0,fontSize:9,color:"#94A3B8"}}>{e.ts?new Date(e.ts).toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"}):""}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ));
              })()}
            </div>}
        </>}

        {/* ── Shine Jam Tracker ── */}
        <HR/>
        <h3 style={S.sh}>✨ Shine Jam Usage Tracker</h3>
        <p style={{...S.hlp,marginBottom:10}}>Services done per Shine Jam bottle (Braids, Twists, Ponytails)</p>
        {shineJamSvcCounts.length===0
          ?<div style={{background:"#F8FAFC",borderRadius:12,padding:14,border:"0.5px solid #E2E8F0"}}>
            <p style={{margin:0,color:"#64748B",fontSize:13}}>No Shine Jam usage recorded yet. Use the − button on Shine Jam to record when a bottle runs out.</p>
          </div>
          :<div style={{display:"grid",gridTemplateColumns:sc.mob?"1fr":"1fr 1fr",gap:10}}>
            {shineJamSvcCounts.map((entry,i)=>(
              <div key={i} style={{background:"#F8FAFC",border:"0.5px solid #E2E8F0",borderRadius:12,padding:14}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                  <b style={{color:"#1B2E4B",fontSize:13}}>Bottle #{entry.bottleNum}</b>
                  <span style={{fontSize:11,color:"#64748B"}}>{entry.ts?new Date(entry.ts).toLocaleDateString("en-GB"):""}</span>
                </div>
                <div style={{background:"#EBF5EE",borderRadius:8,padding:"8px 12px",marginBottom:8}}>
                  <b style={{fontSize:22,color:"#166534"}}>{entry.total}</b>
                  <span style={{fontSize:12,color:"#2D7D46",marginLeft:6}}>services done</span>
                </div>
                {Object.entries(entry.breakdown).map(([svc,cnt])=>(
                  <p key={svc} style={{margin:"3px 0",fontSize:12,color:"#475569"}}>· {svc}: <b>{cnt}</b></p>
                ))}
                {Object.keys(entry.breakdown).length===0&&<p style={{margin:0,fontSize:11,color:"#94A3B8",fontStyle:"italic"}}>No matching services found in range</p>}
              </div>
            ))}
          </div>}

        {/* ── Service–Product Links ── */}
        <HR/>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <div>
            <h3 style={{...S.sh,margin:0}}>🔗 Product–Service Links</h3>
            <p style={{...S.hlp,margin:"2px 0 0"}}>Link products to services so stock auto-deducts when service is completed</p>
          </div>
          <button onClick={()=>setShowSvcProd(s=>!s)} style={{...S.btnS,width:"auto",padding:"6px 14px",marginBottom:0}}>
            {showSvcProd?"−":"+ Add Link"}
          </button>
        </div>
        {showSvcProd&&<div style={{background:"#F8FAFC",border:"0.5px solid #E2E8F0",borderRadius:12,padding:14,marginBottom:12}}>
          <div style={{display:"grid",gridTemplateColumns:sc.mob?"1fr":"1fr 1fr 80px",gap:8,marginBottom:8}}>
            <div>
              <p style={S.lbl}>Product</p>
              <select style={S.inp} value={newSvcProd.productId} onChange={e=>setNewSvcProd(p=>({...p,productId:e.target.value}))}>
                <option value="">— Select product —</option>
                {inventory.map(i=><option key={i.id} value={i.id}>{i.name}</option>)}
              </select>
            </div>
            <div>
              <p style={S.lbl}>Used for service type(s)</p>
              <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                {["Braids","Nails","Hair Styling","Spa","Barbershop","Wash & Pedicure","Eyebrow","Wax"].map(sub=>(
                  <button key={sub} onClick={()=>setNewSvcProd(p=>({...p,serviceSubs:p.serviceSubs.includes(sub)?p.serviceSubs.filter(s=>s!==sub):[...p.serviceSubs,sub]}))}
                    style={{padding:"4px 10px",borderRadius:20,border:"0.5px solid "+(newSvcProd.serviceSubs.includes(sub)?"#5A8C72":"#CBD5E0"),background:newSvcProd.serviceSubs.includes(sub)?"#EBF5EE":"#fff",color:newSvcProd.serviceSubs.includes(sub)?"#166534":"#475569",fontSize:11,cursor:"pointer"}}>
                    {sub}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p style={S.lbl}>Qty per service</p>
              <input style={S.inp} type="number" min="1" value={newSvcProd.qty} onChange={e=>setNewSvcProd(p=>({...p,qty:Number(e.target.value)}))}/>
            </div>
          </div>
          <button style={{...S.btnP,width:"auto",padding:"8px 20px"}} onClick={()=>{
            if(!newSvcProd.productId||!newSvcProd.serviceSubs.length)return alert("Select a product and at least one service type.");
            const prod=inventory.find(i=>String(i.id)===String(newSvcProd.productId));
            const link={id:Date.now(),productId:Number(newSvcProd.productId),productName:prod?.name||"",serviceSubs:newSvcProd.serviceSubs,qty:newSvcProd.qty};
            saveSvcProducts([...svcProducts,link]);
            setNewSvcProd({productId:"",serviceSubs:[],qty:1});
            setShowSvcProd(false);
            push("Product linked to service","success");
          }}>+ Save Link</button>
        </div>}
        {svcProducts.length>0&&<div>
          {svcProducts.map(sp=>(
            <div key={sp.id} style={{...S.li,marginBottom:6}}>
              <div>
                <b style={{color:"#1B2E4B",fontSize:13}}>{sp.productName}</b>
                <p style={{margin:"2px 0 0",fontSize:11,color:"#64748B"}}>
                  Used for: {sp.serviceSubs.join(", ")} · {sp.qty} unit{sp.qty>1?"s":""} per service
                </p>
              </div>
              <button onClick={()=>saveSvcProducts(svcProducts.filter(s=>s.id!==sp.id))} style={{...S.btnD,flexShrink:0}}>Remove</button>
            </div>
          ))}
        </div>}
        {svcProducts.length===0&&!showSvcProd&&<p style={{...S.hlp,fontStyle:"italic"}}>No product links yet. Add one above to enable auto-deduction when services are completed.</p>}
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
        {/* Retention Report */}
        {(()=>{
          const d30=new Date(Date.now()-30*86400000).toISOString().slice(0,10);
          const d60=new Date(Date.now()-60*86400000).toISOString().slice(0,10);
          const last30Visits=visits.filter(v=>v.date>=d30&&v.status==="Paid & Closed");
          const prev30Visits=visits.filter(v=>v.date>=d60&&v.date<d30&&v.status==="Paid & Closed");
          // Unique customers in last 30 days
          const last30Phones=new Set(last30Visits.map(v=>v.phone));
          const prev30Phones=new Set(prev30Visits.map(v=>v.phone));
          // Returning = was in prev 30 AND in last 30
          const returning=[...last30Phones].filter(p=>prev30Phones.has(p)).length;
          const newCusts=[...last30Phones].filter(p=>!prev30Phones.has(p)).length;
          const returnRate=last30Phones.size>0?Math.round((returning/last30Phones.size)*100):0;
          return <div style={{display:"grid",gridTemplateColumns:sc.mob?"1fr 1fr":"repeat(4,1fr)",gap:8,marginBottom:14}}>
            <div style={{background:"#1B2E4B",borderRadius:12,padding:"10px 12px"}}>
              <p style={{margin:0,fontSize:9,color:"#5A8C72",letterSpacing:1,fontWeight:500}}>LAST 30 DAYS</p>
              <b style={{fontSize:20,color:"#fff"}}>{last30Phones.size}</b>
              <p style={{margin:0,fontSize:10,color:"#94A3B8"}}>unique customers</p>
            </div>
            <div style={{background:"#EBF5EE",borderRadius:12,padding:"10px 12px",border:"0.5px solid #86EFAC"}}>
              <p style={{margin:0,fontSize:9,color:"#2D7D46",letterSpacing:1,fontWeight:500}}>RETURNING</p>
              <b style={{fontSize:20,color:"#166534"}}>{returning}</b>
              <p style={{margin:0,fontSize:10,color:"#2D7D46"}}>came back</p>
            </div>
            <div style={{background:"#EBF2FD",borderRadius:12,padding:"10px 12px",border:"0.5px solid #BFDBFE"}}>
              <p style={{margin:0,fontSize:9,color:"#1B4FA8",letterSpacing:1,fontWeight:500}}>NEW CUSTOMERS</p>
              <b style={{fontSize:20,color:"#1B4FA8"}}>{newCusts}</b>
              <p style={{margin:0,fontSize:10,color:"#1B4FA8"}}>first visit</p>
            </div>
            <div style={{background:returnRate>=50?"#EBF5EE":returnRate>=30?"#FEF3C7":"#FEF2F2",borderRadius:12,padding:"10px 12px",border:"0.5px solid "+(returnRate>=50?"#86EFAC":returnRate>=30?"#FCD34D":"#FECACA")}}>
              <p style={{margin:0,fontSize:9,color:returnRate>=50?"#2D7D46":returnRate>=30?"#92400E":"#B91C1C",letterSpacing:1,fontWeight:500}}>RETURN RATE</p>
              <b style={{fontSize:20,color:returnRate>=50?"#166534":returnRate>=30?"#92400E":"#B91C1C"}}>{returnRate}%</b>
              <p style={{margin:0,fontSize:10,color:"#64748B"}}>vs prev 30 days</p>
            </div>
          </div>;
        })()}
        <input style={S.inp} placeholder="Search by name, phone or ID..." value={cSearch} onChange={e=>setCSearch(e.target.value)}/>
        {fCusts.map(c=>{const cv=visits.filter(v=>v.customerId===c.id&&v.status==="Paid & Closed");
              const cbks=bks.filter(b=>b.customerId===c.id);
              const all=cv.flatMap(v=>(v.services||[]).map(s=>s.name));
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
                  {c.note&&<p style={{margin:"3px 0 0",fontSize:11,color:"#B91C1C",background:"#FEF2F2",borderRadius:6,padding:"2px 8px",display:"inline-block"}}>⚠ {c.note}</p>}
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
        {custs.filter(c=>c.deletedAt).length>0&&<>
          <HR/>
          <h3 style={S.sh}>🗑 Recently Deleted — can be restored</h3>
          {custs.filter(c=>c.deletedAt).map(c=>(
            <div key={c.id} style={{...S.li,opacity:0.7,background:"#fff5f5",border:"1px solid #fca5a5"}}>
              <div><b style={{color:"#dc2626"}}>{c.name}</b><p style={S.hlp}>{c.phone} · Deleted {new Date(c.deletedAt).toLocaleDateString()}</p></div>
              <button style={{...S.btnS,width:"auto",padding:"6px 14px",marginBottom:0,color:"#166534",borderColor:"#86efac",fontWeight:700}} onClick={()=>restoreCust(c.id)}>↩ Restore</button>
            </div>
          ))}
        </>}
      </section>}

      {tab==="Payroll"&&<section style={S.card}><h2 style={S.ct}>{t("payrollMgmt")}</h2>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10,marginBottom:12}}>
          <div><p style={{...S.hlp,margin:0,color:"#374151"}}>Current pay period</p><b style={{fontSize:15}}>{period.label}</b></div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}><button style={S.btnS} onClick={()=>window.print()}>Print</button><button style={{...S.btnS,background:"#1B2E4B",color:"#fff",borderColor:"#1B2E4B"}} onClick={downloadCommissionExcel}>📊 Download Commission Report</button><button style={{...S.btnP,width:"auto",padding:"10px 18px"}} onClick={closePeriod}>{t("closePayPeriod")}</button></div>
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
        <label style={{display:"flex",alignItems:"center",gap:6,fontSize:12,cursor:"pointer",marginBottom:6}}><input type="checkbox" checked={showFired} onChange={e=>setShowFired(e.target.checked)}/> Show inactive</label>
        <button onClick={()=>setShowSvcLog(s=>!s)} style={{...S.btnS,width:"auto",padding:"6px 14px",marginBottom:12,fontSize:12}}>
          ⏱ {showSvcLog?"Hide":"View"} Service Time Log ({svcLog.length} records)
        </button>
        {showSvcLog&&<div style={{background:"#F8FAFC",border:"0.5px solid #E2E8F0",borderRadius:14,padding:16,marginBottom:16}}>
          <h3 style={{...S.sh,marginBottom:12}}>⏱ Service Time Log — All Employees</h3>
          <p style={{...S.hlp,marginBottom:10}}>Every completed service: who did it, how long it took vs expected.</p>
          {svcLog.length===0?<p style={S.hlp}>No records yet. Times are recorded when services are marked Completed.</p>
          :<div style={{maxHeight:400,overflowY:"auto"}}>
            {(()=>{
              // Group by employee
              const byEmp={};
              svcLog.forEach(r=>{if(!byEmp[r.employee])byEmp[r.employee]=[];byEmp[r.employee].push(r);});
              return Object.entries(byEmp).map(([emp,records])=>{
                const avg=Math.round(records.reduce((s,r)=>s+r.durationMins,0)/records.length);
                return <div key={emp} style={{marginBottom:14}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",background:"#1B2E4B",borderRadius:10,padding:"8px 12px",marginBottom:6}}>
                    <b style={{color:"#fff",fontSize:13}}>{emp}</b>
                    <span style={{color:"#5A8C72",fontSize:11}}>{records.length} services · avg {avg} min</span>
                  </div>
                  {records.slice(0,10).map((r,i)=>{
                    const diff=r.expectedMins>0?r.durationMins-r.expectedMins:null;
                    const overUnder=diff===null?null:diff>5?"🔴 +"+diff+"m":diff<-5?"🟢 "+diff+"m":"🟡 on time";
                    return <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 10px",background:i%2===0?"#fff":"#F8FAFC",borderRadius:8,marginBottom:3,color:"#1B2E4B"}}>
                      <div>
                        <span style={{fontSize:12,fontWeight:500,color:"#1B2E4B"}}>{r.service}</span>
                        <span style={{fontSize:11,color:"#64748B",marginLeft:8}}>#{r.queue} {r.customer}</span>
                      </div>
                      <div style={{display:"flex",gap:8,alignItems:"center",flexShrink:0}}>
                        <b style={{fontSize:13,color:"#1B2E4B"}}>{r.durationMins} min</b>
                        {overUnder&&<span style={{fontSize:10}}>{overUnder}</span>}
                        <span style={{fontSize:10,color:"#94A3B8"}}>{r.date}</span>
                      </div>
                    </div>;
                  })}
                  {records.length>10&&<p style={{...S.hlp,textAlign:"center",fontSize:11}}>+ {records.length-10} more records</p>}
                </div>;
              });
            })()}
          </div>}
        </div>}

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
        {emps.filter(e=>showFired||e.active).map(emp=>{const extra=empC.find(e=>e.id===emp.id);const d=Number(emp.salary||0)/30;const ad=d*Number(emp.absentDays||0);const grossPay=Number(emp.salary||0)+Number(extra?.commissionTotal||0);
          const net=grossPay-Number(emp.loan||0)-Number(emp.brokerFee||0)-Number(emp.otherDeduction||0)-ad;return(<div key={emp.id} style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:14,padding:14,marginBottom:10,opacity:emp.active?1:0.6}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10,flexWrap:"wrap",gap:8}}>
            <div><b style={{fontSize:15}}>{emp.name}</b><span style={{background:"#5A8C72",color:"#fff",borderRadius:14,padding:"2px 10px",fontSize:11,fontWeight:700,marginLeft:6}}>{emp.section}</span>{emp.role&&<span style={{background:"#dbeafe",color:"#1e40af",borderRadius:14,padding:"2px 8px",fontSize:10,fontWeight:700,marginLeft:4}}>{emp.role}</span>}{!isEmpAvailableToday(emp)&&emp.active&&<span style={{background:"#fee2e2",color:"#991b1b",borderRadius:14,padding:"2px 8px",fontSize:10,fontWeight:700,marginLeft:4}}>{emp.onLeave?"🤒 On Leave":"📅 Day Off Today"}</span>}</div>
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
              <select value={emp.dayOff??""} onChange={e=>{updEmp(emp.id,"dayOff",e.target.value===""?null:e.target.value);push("Day off saved for "+emp.name,"success");}} style={{width:"100%",padding:"7px 9px",borderRadius:9,border:"0.5px solid #CBD5E0",background:"#fff",fontSize:13,color:"#1B2E4B"}}>
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
          {extra?.breakdown?.length>0&&<details style={{marginBottom:8}}><summary style={{...S.hlp,cursor:"pointer",fontWeight:700}}>Breakdown ({extra.breakdown.length})</summary><div style={{paddingLeft:10,paddingTop:4}}>{extra.breakdown.map((b,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",fontSize:12,borderBottom:"1px solid #ecdba3",padding:"2px 0"}}><span style={{color:"#1B2E4B"}}>{b.name}</span><span style={{color:"#166534"}}>{money(b.income)} → {money(b.commission)}</span></div>)}</div></details>}
          <div style={{...S.tb,padding:"10px 16px",flexDirection:"column",gap:4,alignItems:"stretch"}}>
          <div style={{display:"flex",justifyContent:"space-between"}}><b>{t("netPay")}</b><b style={{fontSize:16,color:"#5A8C72"}}>{money(Math.max(0,Math.round(net)))}</b></div></div>
        </div>);})}
        {periods.length>0&&<><HR/><h3 style={S.sh}>Closed Periods</h3>{periods.slice().reverse().map((cp,i)=><details key={i} style={{...S.li,display:"block",marginBottom:8}}><summary style={{cursor:"pointer",fontWeight:700}}>{cp.period}</summary><div style={{paddingTop:8}}>{cp.employees?.map(e=>{const dd=Number(e.salary||0)/30;const ad=dd*Number(e.absentDays||0);const n=Number(e.salary||0)+Number(e.commissionTotal||0)-Number(e.loan||0)-Number(e.brokerFee||0)-Number(e.otherDeduction||0)-ad;return<div key={e.id} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",borderBottom:"1px solid #ecdba3",fontSize:13}}><span><b>{e.name}</b> ({e.section})</span><b>{money(Math.max(0,Math.round(n)))}</b></div>;})}</div></details>)}</>}
        <div className="print-only" style={{display:"none"}}><PS emps={emps} empC={empC} period={period}/></div>
      </section>}

      {tab==="Dashboard"&&<section style={S.card}><h2 style={S.ct}>{t("dashboard2")}</h2>
        {/* ── Daily Briefing ── */}
        {(()=>{
          const todayBks2=bks.filter(b=>b.date===todayStr()&&!["Cancelled","No-show","Completed"].includes(b.status));
          const availEmps=emps.filter(e=>e.active&&isEmpAvailableToday(e));
          const lsItems=inventory.filter(i=>i.qty<=i.minQty&&i.minQty>0);
          return <div style={{background:"#1B2E4B",borderRadius:14,padding:16,marginBottom:16}}>
            <p style={{margin:"0 0 12px",fontSize:12,fontWeight:500,color:"#5A8C72",letterSpacing:1}}>TODAY AT A GLANCE</p>
            <div style={{display:"grid",gridTemplateColumns:sc.mob?"1fr 1fr":"repeat(4,1fr)",gap:8,marginBottom:lsItems.length>0?12:0}}>
              <div style={{background:"rgba(255,255,255,0.08)",borderRadius:10,padding:"10px 12px"}}>
                <p style={{margin:0,fontSize:9,color:"#94A3B8",letterSpacing:1}}>BOOKINGS TODAY</p>
                <b style={{fontSize:20,color:"#fff"}}>{todayBks2.length}</b>
                <p style={{margin:0,fontSize:10,color:"#5A8C72"}}>{todayBks2.filter(b=>b.status==="Confirmed").length} confirmed</p>
              </div>
              <div style={{background:"rgba(255,255,255,0.08)",borderRadius:10,padding:"10px 12px"}}>
                <p style={{margin:0,fontSize:9,color:"#94A3B8",letterSpacing:1}}>STAFF IN TODAY</p>
                <b style={{fontSize:20,color:"#fff"}}>{availEmps.length}</b>
                <p style={{margin:0,fontSize:10,color:"#5A8C72"}}>{emps.filter(e=>e.active).length-availEmps.length} off/leave</p>
              </div>
              <div style={{background:"rgba(255,255,255,0.08)",borderRadius:10,padding:"10px 12px"}}>
                <p style={{margin:0,fontSize:9,color:"#94A3B8",letterSpacing:1}}>QUEUE TODAY</p>
                <b style={{fontSize:20,color:"#fff"}}>{todayV.length}</b>
                <p style={{margin:0,fontSize:10,color:"#5A8C72"}}>{todayV.filter(v=>v.status==="Paid & Closed").length} paid</p>
              </div>
              <div style={{background:lsItems.length>0?"rgba(185,28,28,0.3)":"rgba(255,255,255,0.08)",borderRadius:10,padding:"10px 12px"}}>
                <p style={{margin:0,fontSize:9,color:"#94A3B8",letterSpacing:1}}>LOW STOCK</p>
                <b style={{fontSize:20,color:lsItems.length>0?"#fca5a5":"#fff"}}>{lsItems.length}</b>
                <p style={{margin:0,fontSize:10,color:lsItems.length>0?"#fca5a5":"#5A8C72"}}>{lsItems.length>0?"items need restock":"all good"}</p>
              </div>
            </div>
            {lsItems.length>0&&<div style={{background:"rgba(185,28,28,0.2)",borderRadius:10,padding:"8px 12px",marginTop:4}}>
              <p style={{margin:0,fontSize:11,color:"#fca5a5",fontWeight:500}}>⚠ Low: {lsItems.slice(0,4).map(i=>i.name).join(" · ")}{lsItems.length>4?" + "+(lsItems.length-4)+" more":""}</p>
            </div>}
          </div>;
        })()}
        {/* Date filter */}
        <div style={{background:"#F1F5F9",border:"1px solid #e5e7eb",borderRadius:14,padding:14,marginBottom:14}}>
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
        <HR/>
        {(()=>{
          const ranked=empC.filter(e=>e.active&&e.commissionTotal>0).sort((a,b)=>b.commissionTotal-a.commissionTotal);
          const topRev=empC.filter(e=>e.active&&e.totalRevenue>0).sort((a,b)=>b.totalRevenue-a.totalRevenue);
          const topSvc=empC.filter(e=>e.active&&e.serviceCount>0).sort((a,b)=>b.serviceCount-a.serviceCount);
          if(!ranked.length&&!topSvc.length)return null;
          const medals=["🥇","🥈","🥉"];
          return <div style={{marginBottom:14}}>
            <h3 style={S.sh}>⭐ Best Performing Staff — {period.label}</h3>
            <div style={{display:"grid",gridTemplateColumns:sc.mob?"1fr":"1fr 1fr 1fr",gap:10,marginBottom:8}}>
              <div style={{background:"#F8FAFC",borderRadius:12,padding:12,border:"0.5px solid #E2E8F0"}}>
                <p style={{margin:"0 0 8px",fontSize:10,fontWeight:700,color:"#94A3B8",letterSpacing:1}}>TOP COMMISSION</p>
                {ranked.slice(0,3).map((e,i)=><div key={e.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
                  <span style={{fontSize:12}}>{medals[i]} {e.name}</span>
                  <b style={{fontSize:12,color:"#5A8C72"}}>{money(e.commissionTotal)}</b>
                </div>)}
              </div>
              <div style={{background:"#F8FAFC",borderRadius:12,padding:12,border:"0.5px solid #E2E8F0"}}>
                <p style={{margin:"0 0 8px",fontSize:10,fontWeight:700,color:"#94A3B8",letterSpacing:1}}>TOP REVENUE GENERATED</p>
                {topRev.slice(0,3).map((e,i)=><div key={e.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
                  <span style={{fontSize:12}}>{medals[i]} {e.name}</span>
                  <b style={{fontSize:12,color:"#1B2E4B"}}>{money(e.totalRevenue)}</b>
                </div>)}
              </div>
              <div style={{background:"#F8FAFC",borderRadius:12,padding:12,border:"0.5px solid #E2E8F0"}}>
                <p style={{margin:"0 0 8px",fontSize:10,fontWeight:700,color:"#94A3B8",letterSpacing:1}}>MOST SERVICES</p>
                {topSvc.slice(0,3).map((e,i)=><div key={e.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
                  <span style={{fontSize:12}}>{medals[i]} {e.name}</span>
                  <b style={{fontSize:12,color:"#1B2E4B"}}>{e.serviceCount} services</b>
                </div>)}
              </div>
            </div>
            {ranked[0]&&<div style={{background:"linear-gradient(135deg,#1B2E4B,#243A5E)",borderRadius:12,padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <p style={{margin:0,fontSize:10,color:"#5A8C72",fontWeight:500,letterSpacing:1}}>🏆 EMPLOYEE OF THE PERIOD</p>
                <b style={{fontSize:16,color:"#fff"}}>{ranked[0].name}</b>
                <p style={{margin:"2px 0 0",fontSize:11,color:"#94A3B8"}}>{ranked[0].section} · {ranked[0].serviceCount} services · {money(ranked[0].commissionTotal)} commission</p>
              </div>
              <div style={{textAlign:"right"}}>
                <p style={{margin:0,fontSize:10,color:"#94A3B8"}}>Top service</p>
                <b style={{fontSize:12,color:"#5A8C72"}}>{ranked[0].serviceList?.[0]?.name||"—"}</b>
              </div>
            </div>}
          </div>;
        })()}
        <HR/><h3 style={S.sh}>Commission This Period — {period.label}</h3>
        {empC.filter(e=>e.active).map(emp=><div key={emp.id} style={S.li}><span>{emp.name} ({emp.section})</span><b style={{color:"#166534"}}>{money(emp.commissionTotal)}</b></div>)}
        <HR/>
        {(()=>{
          // Last 7 days revenue chart
          const days=Array.from({length:7},(_,i)=>{
            const d=new Date(Date.now()-i*86400000);
            const ds=d.toISOString().slice(0,10);
            const rev=visits.filter(v=>v.date===ds&&v.status==="Paid & Closed").reduce((s,v)=>s+Number(v.totalService||0),0);
            return{date:ds,label:d.toLocaleDateString("en-GB",{weekday:"short",day:"numeric"}),rev};
          }).reverse();
          const maxRev=Math.max(...days.map(d=>d.rev),1);
          return <div style={{marginBottom:16}}>
            <h3 style={S.sh}>📊 Last 7 Days Revenue</h3>
            <div style={{display:"flex",alignItems:"flex-end",gap:6,height:100,padding:"0 4px"}}>
              {days.map(d=>(
                <div key={d.date} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                  {d.rev>0&&<span style={{fontSize:9,color:"#475569",fontWeight:500}}>{(d.rev/1000).toFixed(1)}k</span>}
                  <div style={{width:"100%",background:d.date===todayStr()?"#1B2E4B":"#5A8C72",borderRadius:"4px 4px 0 0",height:Math.max(4,Math.round((d.rev/maxRev)*70))+"px",opacity:d.rev===0?0.2:1,transition:"height 0.3s"}}/>
                  <span style={{fontSize:9,color:"#64748B",textAlign:"center",lineHeight:1.2}}>{d.label}</span>
                </div>
              ))}
            </div>
            <div style={{display:"flex",gap:10,marginTop:8,justifyContent:"flex-end"}}>
              <span style={{fontSize:10,color:"#64748B"}}>■ <span style={{color:"#1B2E4B"}}>Today</span></span>
              <span style={{fontSize:10,color:"#64748B"}}>■ <span style={{color:"#5A8C72"}}>Previous days</span></span>
            </div>
          </div>;
        })()}
        <HR/><h3 style={S.sh}>Revenue by Category</h3>
        {cats.map(cat=>{const ids=svcs.filter(s=>s.category===cat).map(s=>s.id);const rev=dPaid.flatMap(v=>(v.services||[])).filter(l=>ids.includes(l.serviceId)).reduce((s,l)=>s+lineIncome(l),0);return<div key={cat} style={S.li}><span>{cat}</span><b>{money(rev)}</b></div>;})}
          </>);
        })()}
      </section>}

      {tab==="Staff"&&<section style={S.card}><h2 style={S.ct}>{t("staffMgmt")}</h2>
        <p style={S.hlp}>Reception: Reception + Checkout + Bookings. Supervisor: Supervisor + Bookings. Manager: All.</p><HR/>

        {/* Data Backup & Security */}
        <div style={{background:"#1B2E4B",borderRadius:14,padding:16,marginBottom:16}}>
          <h3 style={{margin:"0 0 4px",fontWeight:800,fontSize:15,color:"#fff"}}>💾 Data Backup & Security</h3>
          <p style={{margin:"0 0 12px",fontSize:12,color:"rgba(255,255,255,0.65)"}}>
            Back up all customers, visits, bookings, employees, expenses, and staff accounts.
            The system also saves an automatic cloud backup at the end of each day if new data was added.
          </p>
          <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
            <button onClick={()=>cloudBackup("manual cloud backup — "+(user?.name||""))}
              style={{...S.btnS,background:"#2D7D46",color:"#fff",borderColor:"#2D7D46"}}>
              ☁ Backup to Cloud Now
            </button>
            <button onClick={downloadBackup}
              style={{...S.btnS,background:"rgba(255,255,255,0.1)",color:"#fff",borderColor:"rgba(255,255,255,0.3)"}}>
              💾 Download Backup File
            </button>
            <span style={{fontSize:11,color:"rgba(255,255,255,0.6)"}}>
              {(()=>{
                const daysSince=lastBackup?Math.floor((Date.now()-new Date(lastBackup))/86400000):null;
                return daysSince===null?"⚠ No backup yet — back up now to protect your data.":
                  daysSince===0?"✓ Backed up today":
                  `⚠ Last backup: ${daysSince} day${daysSince===1?"":"s"} ago`;
              })()}
              {backupLog[0]&&` · Latest cloud backup: ${new Date(backupLog[0].created_at).toLocaleString()} (${backupLog[0].total_records} records)`}
            </span>
          </div>
        </div>

        {/* Cloud Backup History */}
        {backupLog.length>0&&<div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:14,padding:16,marginBottom:16}}>
          <h3 style={{margin:"0 0 10px",fontWeight:800,fontSize:14}}>Cloud Backup History</h3>
          {backupLog.slice(0,10).map(b=><div key={b.id} style={S.li}>
            <div>
              <b style={{fontSize:12}}>{new Date(b.created_at).toLocaleString()}</b>
              <p style={{margin:"2px 0 0",fontSize:11,color:"#64748B"}}>{b.total_records} total records · {b.triggered_by}</p>
            </div>
            <div style={{display:"flex",gap:6,flexShrink:0}}>
              <button onClick={()=>downloadCloudBackup(b.file_path)} style={{...S.btnS,marginBottom:0,fontSize:11,padding:"5px 10px"}}>⬇ Download</button>
              <button onClick={()=>deleteCloudBackup(b)} style={{...S.btnS,marginBottom:0,fontSize:11,padding:"5px 10px",color:"#DC2626",borderColor:"#DC262644"}}>🗑</button>
            </div>
          </div>)}
        </div>}
        <HR/>
        <div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:14,padding:16,marginBottom:16}}>
          <h3 style={{margin:"0 0 14px",fontWeight:800,fontSize:15}}>{editStaff?"Edit: "+editStaff.id:"Add / Update Staff Account"}</h3>
          <div style={{display:"grid",gridTemplateColumns:sc.mob?"1fr":"1fr 1fr 1fr 1fr",gap:10,marginBottom:12}}>
            <div><L>Username</L><input style={{...S.inp,background:editStaff?"#f3f4f6":"#fffdf7"}} value={nStaff.id} onChange={e=>setNStaff(p=>({...p,id:e.target.value}))} placeholder="e.g. reception1" disabled={!!editStaff}/></div>
            <div><L>Display Name</L><input style={S.inp} value={nStaff.name} onChange={e=>setNStaff(p=>({...p,name:e.target.value}))} placeholder="Full name"/></div>
            <div><L>Role</L><select style={S.inp} value={nStaff.role} onChange={e=>setNStaff(p=>({...p,role:e.target.value}))}><option value="reception">Reception</option><option value="supervisor">Supervisor</option><option value="manager">Manager</option><option value="inventory">Inventory</option></select></div>
            <div><L>{editStaff?"New Password":"Password"}</L><input style={S.inp} type="password" value={nStaff.password} onChange={e=>setNStaff(p=>({...p,password:e.target.value}))} placeholder={editStaff?"Enter new password":"Password"}/></div>
          </div>
          <div style={S.r2}><button style={S.btnP} onClick={saveStaff}>{editStaff?t("updateAccount"):t("saveAccount")}</button>{editStaff&&<button style={S.btnS} onClick={()=>{setEditStaff(null);setNStaff({id:"",name:"",role:"reception",password:""});}}>{t("cancel")}</button>}</div>
        </div>
        <h3 style={S.sh}>All Staff ({staff.length})</h3>
        {staff.map(s=><div key={s.id} style={{...S.li,flexWrap:"wrap",gap:10,opacity:s.active?1:0.6}}>
          <div><b style={{fontSize:15}}>{s.name}</b><span style={{background:s.role==="manager"?"#1B2E4B":s.role==="supervisor"?"#1e40af":s.role==="inventory"?"#5A8C72":"#E2E8F0",color:s.role==="manager"?"#fff":s.role==="supervisor"?"#fff":"#1B2E4B",borderRadius:14,padding:"2px 10px",fontSize:11,fontWeight:700,marginLeft:8}}>{s.role}</span>{!s.active&&<span style={{background:"#fee2e2",color:"#991b1b",borderRadius:14,padding:"2px 10px",fontSize:11,fontWeight:700,marginLeft:6}}>INACTIVE</span>}<p style={S.hlp}>Username: <b>{s.id}</b></p></div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center"}}><button style={S.btnS} onClick={()=>{setEditStaff(s);setNStaff({id:s.id,name:s.name,role:s.role,password:""});}}>Edit / Reset PW</button><button style={s.active?S.btnD:S.btnS} onClick={()=>setStaffAct(s.id,!s.active)}>{s.active?t("deactivate"):t("reactivate")}</button></div>
        </div>)}
      </section>}

      {tab==="Design Editor"&&(()=>{
        const COLOR_GROUPS=[
          {group:"Header & Navigation",tokens:[
            {key:"hdrBg",    label:"Header Background",     def:"#1B2E4B"},
            {key:"hdrText",  label:"Header Title Text",     def:"#FFFFFF"},
            {key:"hdrAccent",label:"Header Accent / Brand", def:"#5A8C72"},
            {key:"hdrBadge", label:"Role Badge Background", def:"#5A8C72"},
            {key:"hdrBadgeTx",label:"Role Badge Text",      def:"#FFFFFF"},
            {key:"appBg",    label:"App Background",        def:"#F1F5F9"},
          ]},
          {group:"Navigation Tabs",tokens:[
            {key:"tabBg",    label:"Daily Tab Background",  def:"#FFFFFF"},
            {key:"tabTx",    label:"Daily Tab Text",        def:"#475569"},
            {key:"tabBd",    label:"Daily Tab Border",      def:"#E2E8F0"},
            {key:"tabABg",   label:"Active Daily Tab",      def:"#1B2E4B"},
            {key:"tabATx",   label:"Active Daily Tab Text", def:"#FFFFFF"},
            {key:"mgrBg",    label:"Mgr Tab Background",    def:"#F8FAFC"},
            {key:"mgrTx",    label:"Mgr Tab Text",          def:"#475569"},
            {key:"mgrABg",   label:"Active Mgr Tab",        def:"#243A5E"},
            {key:"mgrATx",   label:"Active Mgr Tab Text",   def:"#FFFFFF"},
          ]},
          {group:"Cards & Panels",tokens:[
            {key:"cardBg",   label:"Card Background",       def:"#FFFFFF"},
            {key:"cardBd",   label:"Card Border",           def:"#E2E8F0"},
            {key:"cardTitle",label:"Card Title Text",       def:"#1B2E4B"},
            {key:"cardHelp", label:"Helper / Sub Text",     def:"#64748B"},
            {key:"cardLabel",label:"Field Label Text",      def:"#334155"},
          ]},
          {group:"Buttons",tokens:[
            {key:"btnPBg",   label:"Primary Button Bg",     def:"#1B2E4B"},
            {key:"btnPText", label:"Primary Button Text",   def:"#FFFFFF"},
            {key:"btnSBg",   label:"Secondary Button Bg",   def:"#F8FAFC"},
            {key:"btnSText", label:"Secondary Button Text", def:"#1B2E4B"},
            {key:"btnSBd",   label:"Secondary Button Border",def:"#CBD5E0"},
            {key:"btnGBg",   label:"Action Button Bg (Ready)",def:"#5A8C72"},
            {key:"btnGTx",   label:"Action Button Text",    def:"#FFFFFF"},
            {key:"btnDBg",   label:"Danger Button Bg",      def:"#FEF2F2"},
            {key:"btnDTx",   label:"Danger Button Text",    def:"#B91C1C"},
          ]},
          {group:"Inputs & Forms",tokens:[
            {key:"inpBg",    label:"Input Background",      def:"#FFFFFF"},
            {key:"inpTx",    label:"Input Text",            def:"#1B2E4B"},
            {key:"inpBd",    label:"Input Border",          def:"#CBD5E0"},
            {key:"inpPh",    label:"Input Placeholder",     def:"#94A3B8"},
          ]},
          {group:"Status Badges",tokens:[
            {key:"bdWaitBg", label:"Waiting Bg",            def:"#FEF3C7"},
            {key:"bdWaitTx", label:"Waiting Text",          def:"#92400E"},
            {key:"bdProgBg", label:"In Progress Bg",        def:"#EBF2FD"},
            {key:"bdProgTx", label:"In Progress Text",      def:"#1B4FA8"},
            {key:"bdReadBg", label:"Ready Bg",              def:"#EBF5EE"},
            {key:"bdReadTx", label:"Ready Text",            def:"#2D7D46"},
            {key:"bdPaidBg", label:"Paid & Closed Bg",      def:"#F0FDF4"},
            {key:"bdPaidTx", label:"Paid & Closed Text",    def:"#166534"},
            {key:"bdHoldBg", label:"On Hold Bg",            def:"#EDE9FE"},
            {key:"bdHoldTx", label:"On Hold Text",          def:"#5B3FA6"},
            {key:"bdCancBg", label:"Cancelled Bg",          def:"#FEE2E2"},
            {key:"bdCancTx", label:"Cancelled Text",        def:"#B91C1C"},
          ]},
          {group:"Queue & Lists",tokens:[
            {key:"qItemBg",  label:"Queue Item Background",  def:"#FFFFFF"},
            {key:"qItemBd",  label:"Queue Item Border",      def:"#E2E8F0"},
            {key:"qItemTx",  label:"Queue Item Text",        def:"#1B2E4B"},
            {key:"qSelBg",   label:"Selected Item Bg",       def:"#1B2E4B"},
            {key:"qSelTx",   label:"Selected Item Text",     def:"#FFFFFF"},
          ]},
          {group:"Totals & Revenue Bars",tokens:[
            {key:"totBg",    label:"Total Bar Background",   def:"#1B2E4B"},
            {key:"totLabel", label:"Total Bar Label",        def:"#94A3B8"},
            {key:"totValue", label:"Total Bar Value",        def:"#5A8C72"},
          ]},
          {group:"Stat Cards",tokens:[
            {key:"scBg",     label:"Stat Card Background",   def:"#F8FAFC"},
            {key:"scTx",     label:"Stat Card Text",         def:"#1B2E4B"},
            {key:"scLabel",  label:"Stat Card Label",        def:"#64748B"},
            {key:"scHlBg",   label:"Highlighted Stat Bg",    def:"#1B2E4B"},
            {key:"scHlTx",   label:"Highlighted Stat Text",  def:"#FFFFFF"},
            {key:"scHlLb",   label:"Highlighted Stat Label", def:"#5A8C72"},
          ]},
          {group:"Text Colors — All Sections",tokens:[
            {key:"txPrimary",  label:"Primary Text (headings, names)",  def:"#1B2E4B"},
            {key:"txSecondary",label:"Secondary Text (sub-labels)",     def:"#64748B"},
            {key:"txMuted",    label:"Muted Text (hints, placeholders)",def:"#94A3B8"},
            {key:"txSuccess",  label:"Success / Positive Text",         def:"#166534"},
            {key:"txDanger",   label:"Danger / Alert Text",             def:"#B91C1C"},
            {key:"txWarning",  label:"Warning Text",                    def:"#92400E"},
            {key:"txInfo",     label:"Info / Link Text",                def:"#1B4FA8"},
            {key:"txAccent",   label:"Accent Text (sage green)",        def:"#5A8C72"},
            {key:"txOnDark",   label:"Text on Dark Backgrounds",        def:"#FFFFFF"},
            {key:"txLabel",    label:"Form Label Text",                 def:"#334155"},
            {key:"txInp",      label:"Input Field Text",                def:"#1B2E4B"},
            {key:"txQueue",    label:"Queue Number & Name Text",        def:"#1B2E4B"},
            {key:"txPrice",    label:"Price / Revenue Numbers",         def:"#166534"},
            {key:"txComm",     label:"Commission Numbers",              def:"#2D7D46"},
          ]},
        ];
        const activeGrp=deActiveGrp;const setActiveGrp=setDeActiveGrp;
        const deTab=deTab2;const setDeTab=setDeTab2;
        const allDefs=Object.fromEntries(COLOR_GROUPS.flatMap(g=>g.tokens.map(t=>[t.key,t.def])));
        function getD(key){return design[key]||allDefs[key]||"#ffffff";}
        function setD(key,val){saveDes({...design,[key]:val});}
        function resetAll(){saveDes(allDefs);push("Design reset to defaults","success");}
        async function saveToCloud(){
          // Apply amTexts to LANG.am before saving
          Object.assign(LANG.am,amTexts);
          await supabase.from("settings").upsert({key:"design",value:JSON.stringify(design)});
          await supabase.from("settings").upsert({key:"amTexts",value:JSON.stringify(amTexts)});
          setDeSaved(true);setTimeout(()=>setDeSaved(false),2500);
          push("Design saved to all devices","success");
        }
        return <section style={{...S.card,padding:0,overflow:"hidden"}}>
          {/* Editor header */}
          <div style={{background:"#1B2E4B",padding:"16px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
            <div><h2 style={{margin:0,fontSize:17,fontWeight:500,color:"#fff"}}>🎨 Design Editor</h2>
              <p style={{margin:"3px 0 0",fontSize:11,color:"#5A8C72"}}>Changes apply instantly across the whole app</p>
            </div>
            <div style={{display:"flex",gap:8}}>
              <button onClick={resetAll} style={{padding:"8px 14px",borderRadius:9,border:"0.5px solid #334155",background:"transparent",color:"#94A3B8",fontSize:12,cursor:"pointer",fontWeight:500}}>↺ Reset All</button>
              <button onClick={saveToCloud} style={{padding:"8px 16px",borderRadius:9,border:"none",background:deSaved?"#2D7D46":"#5A8C72",color:"#fff",fontSize:12,cursor:"pointer",fontWeight:500,transition:"background 0.2s"}}>
                {deSaved?"✓ Saved!":"💾 Save to All Devices"}
              </button>
            </div>
          </div>

          {/* Tab bar */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",borderBottom:"0.5px solid #E2E8F0"}}>
            {["colors","texts"].map(dt=>(
              <button key={dt} onClick={()=>setDeTab(dt)} style={{padding:"12px",border:"none",background:deTab===dt?"#fff":"#F8FAFC",color:deTab===dt?"#1B2E4B":"#64748B",fontWeight:deTab===dt?500:400,cursor:"pointer",fontSize:13,borderBottom:deTab===dt?"2px solid #1B2E4B":"2px solid transparent"}}>
                {dt==="colors"?"🎨 Colors & Design":"🔤 Amharic Text Labels"}
              </button>
            ))}
          </div>

          <div style={{display:"grid",gridTemplateColumns:sc.mob?"1fr":"260px 1fr",minHeight:600}}>

            {/* ── LEFT: Group selector or text groups ── */}
            <div style={{background:"#F8FAFC",borderRight:"0.5px solid #E2E8F0",padding:16,overflowY:"auto"}}>
              {deTab==="colors"&&<>
                <p style={{margin:"0 0 10px",fontSize:10,fontWeight:500,color:"#94A3B8",letterSpacing:1.5}}>COLOR GROUPS</p>
                {COLOR_GROUPS.map((g,i)=>(
                  <button key={i} onClick={()=>setActiveGrp(i)} style={{width:"100%",padding:"10px 12px",borderRadius:10,border:"none",background:activeGrp===i?"#1B2E4B":"transparent",color:activeGrp===i?"#fff":"#475569",fontWeight:activeGrp===i?500:400,cursor:"pointer",textAlign:"left",fontSize:12,marginBottom:4,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <span>{g.group}</span>
                    <span style={{background:activeGrp===i?"rgba(255,255,255,0.2)":"#E2E8F0",color:activeGrp===i?"#fff":"#64748B",borderRadius:12,padding:"1px 7px",fontSize:10}}>{g.tokens.length}</span>
                  </button>
                ))}
              </>}
              {deTab==="texts"&&<>
                <p style={{margin:"0 0 10px",fontSize:10,fontWeight:500,color:"#94A3B8",letterSpacing:1.5}}>AMHARIC LABELS</p>
                <p style={{fontSize:11,color:"#64748B",lineHeight:1.5,margin:"0 0 12px"}}>Edit any Amharic translation. English shown as reference on the right.</p>
                <p style={{fontSize:11,color:"#5A8C72",fontWeight:500}}>{Object.keys(LANG.am).length} labels available</p>
              </>}
            </div>

            {/* ── RIGHT: Color pickers or text inputs ── */}
            <div style={{padding:20,overflowY:"auto",maxHeight:700}}>
              {deTab==="colors"&&<>
                <h3 style={{margin:"0 0 4px",fontSize:14,fontWeight:500,color:"#1B2E4B"}}>{COLOR_GROUPS[activeGrp].group}</h3>
                <p style={{margin:"0 0 16px",fontSize:11,color:"#64748B"}}>{COLOR_GROUPS[activeGrp].tokens.length} color settings</p>
                {COLOR_GROUPS[activeGrp].tokens.map(({key,label,def})=>(
                  <div key={key} style={{display:"flex",alignItems:"center",gap:12,marginBottom:12,padding:"12px 14px",background:"#fff",borderRadius:12,border:"0.5px solid #E2E8F0"}}>
                    <input type="color" value={getD(key)}
                      onChange={e=>setD(key,e.target.value)}
                      style={{width:44,height:44,borderRadius:10,border:"0.5px solid #CBD5E0",cursor:"pointer",padding:3,flexShrink:0,background:"#fff"}}/>
                    <div style={{flex:1,minWidth:0}}>
                      <p style={{margin:0,fontSize:13,fontWeight:500,color:"#1B2E4B"}}>{label}</p>
                      <p style={{margin:"2px 0 0",fontSize:10,color:"#94A3B8",fontFamily:"monospace"}}>{getD(key)}</p>
                    </div>
                    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                      <div style={{width:28,height:28,borderRadius:8,background:getD(key),border:"0.5px solid #E2E8F0"}}/>
                      <button onClick={()=>setD(key,def)} style={{padding:"2px 8px",border:"0.5px solid #E2E8F0",borderRadius:6,background:"#F8FAFC",color:"#64748B",fontSize:10,cursor:"pointer"}}>↺</button>
                    </div>
                  </div>
                ))}
                {/* Live mini preview */}
                <div style={{marginTop:20,padding:16,background:"#F8FAFC",borderRadius:14,border:"0.5px solid #E2E8F0"}}>
                  <p style={{margin:"0 0 10px",fontSize:11,fontWeight:500,color:"#64748B"}}>LIVE PREVIEW</p>
                  <div style={{background:getD("hdrBg"),borderRadius:10,padding:"10px 14px",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div><p style={{margin:0,fontSize:8,color:getD("hdrAccent"),letterSpacing:1.5,fontWeight:500}}>AMBAR SPA & BEAUTY</p>
                      <p style={{margin:"2px 0 0",fontSize:13,fontWeight:500,color:getD("hdrText")}}>Salon Management</p>
                    </div>
                    <span style={{background:getD("hdrBadge"),color:getD("hdrBadgeTx"),borderRadius:6,padding:"2px 8px",fontSize:10,fontWeight:500}}>manager</span>
                  </div>
                  <div style={{display:"flex",gap:6,marginBottom:8}}>
                    <button style={{flex:1,padding:"8px 4px",borderRadius:8,border:"none",background:getD("tabABg"),color:getD("tabATx"),fontSize:10,fontWeight:500}}>Reception</button>
                    <button style={{flex:1,padding:"8px 4px",borderRadius:8,border:"0.5px solid "+getD("tabBd"),background:getD("tabBg"),color:getD("tabTx"),fontSize:10,fontWeight:400}}>Supervisor</button>
                    <button style={{flex:1,padding:"8px 4px",borderRadius:8,border:"0.5px solid "+getD("tabBd"),background:getD("tabBg"),color:getD("tabTx"),fontSize:10,fontWeight:400}}>Checkout</button>
                  </div>
                  <div style={{background:getD("cardBg"),border:"0.5px solid "+getD("cardBd"),borderRadius:10,padding:"10px 12px",marginBottom:8}}>
                    <p style={{margin:0,fontSize:12,fontWeight:500,color:getD("cardTitle")}}>Register Customer</p>
                    <div style={{background:getD("inpBg"),border:"0.5px solid "+getD("inpBd"),borderRadius:7,padding:"6px 8px",margin:"6px 0",fontSize:10,color:getD("inpPh")}}>Phone number...</div>
                  </div>
                  <div style={{display:"flex",gap:6,marginBottom:8}}>
                    <button style={{flex:1,padding:"8px",borderRadius:8,border:"none",background:getD("btnPBg"),color:getD("btnPText"),fontSize:10,fontWeight:500}}>Register</button>
                    <button style={{flex:1,padding:"8px",borderRadius:8,border:"0.5px solid "+getD("btnSBd"),background:getD("btnSBg"),color:getD("btnSText"),fontSize:10,fontWeight:500}}>Recall</button>
                  </div>
                  <button style={{width:"100%",padding:"8px",borderRadius:8,border:"none",background:getD("btnGBg"),color:getD("btnGTx"),fontSize:10,fontWeight:500}}>✓ Mark Ready for Payment</button>
                  <div style={{background:getD("totBg"),borderRadius:8,padding:"8px 10px",marginTop:6,display:"flex",justifyContent:"space-between"}}>
                    <span style={{fontSize:10,color:getD("totLabel")}}>Total Income</span>
                    <span style={{fontSize:12,fontWeight:500,color:getD("totValue")}}>2,500 Birr</span>
                  </div>
                  {/* Text preview */}
                  <div style={{background:"#fff",borderRadius:8,padding:"10px 12px",marginTop:8,border:"0.5px solid #E2E8F0"}}>
                    <p style={{margin:0,fontSize:11,color:getD("txPrimary")||"#1B2E4B",fontWeight:500}}>Primary Text — Customer Name</p>
                    <p style={{margin:"3px 0 0",fontSize:10,color:getD("txSecondary")||"#64748B"}}>Secondary — sub-label or phone number</p>
                    <p style={{margin:"3px 0 0",fontSize:10,color:getD("txMuted")||"#94A3B8"}}>Muted — hint or placeholder</p>
                    <div style={{display:"flex",gap:8,marginTop:4,flexWrap:"wrap"}}>
                      <span style={{fontSize:10,color:getD("txSuccess")||"#166534",fontWeight:500}}>✓ Success</span>
                      <span style={{fontSize:10,color:getD("txDanger")||"#B91C1C",fontWeight:500}}>✗ Danger</span>
                      <span style={{fontSize:10,color:getD("txWarning")||"#92400E",fontWeight:500}}>⚠ Warning</span>
                      <span style={{fontSize:10,color:getD("txAccent")||"#5A8C72",fontWeight:500}}>● Accent</span>
                    </div>
                  </div>
                </div>
              </>}

              {deTab==="texts"&&<>
                <p style={{margin:"0 0 16px",fontSize:11,color:"#64748B",lineHeight:1.6}}>
                  Left column = English (reference). Right column = Amharic (edit here). Changes apply when you switch to Amharic using the language toggle.
                </p>
                <div style={{display:"grid",gridTemplateColumns:"auto 1fr 1fr",gap:"0 8px",marginBottom:8,padding:"6px 8px",background:"#1B2E4B",borderRadius:8}}>
                  <span style={{fontSize:10,fontWeight:500,color:"#5A8C72",fontFamily:"monospace"}}>KEY</span>
                  <span style={{fontSize:10,fontWeight:500,color:"#94A3B8"}}>English</span>
                  <span style={{fontSize:10,fontWeight:500,color:"#fff"}}>Amharic</span>
                </div>
                {Object.entries(amTexts).map(([key,val])=>(
                  <div key={key} style={{display:"grid",gridTemplateColumns:"auto 1fr 1fr",gap:"0 8px",marginBottom:6,alignItems:"center"}}>
                    <span style={{fontSize:9,color:"#94A3B8",fontFamily:"monospace",minWidth:80}}>{key}</span>
                    <div style={{padding:"5px 8px",borderRadius:7,background:"#F8FAFC",border:"0.5px solid #E2E8F0",fontSize:11,color:"#64748B",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{LANG.en[key]||key}</div>
                    <input value={val||""} onChange={e=>{
                      const v=e.target.value;
                      LANG.am[key]=v;
                      setAmTexts(p=>({...p,[key]:v}));
                    }}
                      placeholder={LANG.en[key]||key}
                      style={{padding:"5px 8px",borderRadius:7,border:"0.5px solid #CBD5E0",background:"#fff",fontSize:12,color:"#1B2E4B",width:"100%"}}/>
                  </div>
                ))}
              </>}
            </div>
          </div>
        </section>;
      })()}

      {tab==="Activity Log"&&<section style={S.card}><h2 style={S.ct}>{t("activityLog2")}</h2><p style={{...S.hlp,color:"#374151"}}>Last 100 actions across all staff.</p>

        <HR/>
        {actLog.length===0&&<EMP>No activity recorded yet.</EMP>}
        {actLog.map((a,i)=><div key={i} style={S.li}><div><b style={{color:"#1B2E4B"}}>{a.action}</b>{a.detail&&<p style={{...S.hlp,color:"#374151"}}>{a.detail}</p>}</div><div style={{textAlign:"right",flexShrink:0}}><span style={{background:"#fef3c7",color:"#92400e",borderRadius:8,padding:"2px 8px",fontSize:11,fontWeight:700}}>{a.staff_name}</span><p style={{...S.hlp,fontSize:10,marginTop:4,color:"#6b7280"}}>{a.ts?new Date(a.ts).toLocaleString():""}</p></div></div>)}
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
    <style>{"@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}} @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}} *{-webkit-tap-highlight-color:transparent;box-sizing:border-box} body,html,#root{max-width:100vw;overflow-x:hidden;-webkit-text-size-adjust:100%;text-size-adjust:100%} button{color:inherit;-webkit-appearance:none;border-radius:0;font-family:inherit}input,select,textarea{-webkit-appearance:none;border-radius:0} @media(max-width:640px){input,select,textarea{font-size:16px!important}} @media print{.no-print{display:none!important}.print-only{display:block!important}body{background:white!important}}select option{color:#111827!important;background:#fff!important}select{color:#111827!important}"}</style>
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
            {line.commission>0&&<p style={{color:"#2D7D46",fontSize:11,margin:"2px 0"}}>
          Commission {line.commission}%
          {line.sub==="Braids"&&line.name&&line.name.includes("ከኛ")&&
            <span style={{color:"#64748B"}}> (after 500 Birr/qty deduction)</span>}
          {line.sub==="Braids"&&line.name&&line.name.includes("ከነሱ")&&
            <span style={{color:"#64748B"}}> (after 300 Birr/qty deduction)</span>}
          {" = "}{money(lineComm(line))}
        </p>}
          </div>
          <div style={{display:"flex",gap:4}}>
                {!locked&&<button style={{padding:"4px 6px",borderRadius:7,border:0,background:"#fef3c7",color:"#92400e",cursor:"pointer",fontSize:12}} onClick={()=>onMove(line.lineId,"up")}>↑</button>}
                {!locked&&<button style={{padding:"4px 6px",borderRadius:7,border:0,background:"#fef3c7",color:"#92400e",cursor:"pointer",fontSize:12}} onClick={()=>onMove(line.lineId,"down")}>↓</button>}
                {!locked&&<button style={{padding:"4px 10px",borderRadius:8,border:0,background:"#ffe3de",color:"#8a1f12",fontWeight:800,cursor:"pointer",fontSize:12}} onClick={()=>onRem(line.lineId)}>Remove</button>}
              </div>
        </div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"flex-end"}}>
          <div><p style={{fontSize:10,fontWeight:700,color:"#1f2937",margin:"0 0 2px"}}>Qty</p><input style={{width:55,padding:"6px 8px",borderRadius:8,border:"1px solid #c7b06a",background:"#fff",fontSize:12}} type="number" min="1" value={line.qty} onChange={e=>onUpd(line.lineId,"qty",Math.max(1,Number(e.target.value)||1))} disabled={locked}/></div>
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
    <div style={{display:"flex",justifyContent:"space-between",background:"#111827",color:"#e0b85a",padding:"11px 16px",borderRadius:12,marginTop:8}}><span style={{fontWeight:500,color:"#94A3B8",fontSize:12}}>Total Income</span><b style={{fontSize:15,fontWeight:500,color:"#5A8C72"}}>{money(visit.totalService)}</b></div>
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
  <tbody>{emps.filter(e=>e.active).map((emp,i)=>{const ex=empC.find(e=>e.id===emp.id);const d=Number(emp.salary||0)/30;const ad=d*Number(emp.absentDays||0);const net=Number(emp.salary||0)+Number(ex?.commissionTotal||0)-Number(emp.loan||0)-Number(emp.brokerFee||0)-Number(emp.otherDeduction||0)-ad;return <tr key={emp.id} style={{background:i%2===0?"#fff":"#F8FAFC"}}>
    <td style={{border:"1px solid #ddd",padding:"6px 9px"}}>{emp.name}</td><td style={{border:"1px solid #ddd",padding:"6px 9px"}}>{emp.section}</td>
    <td style={{border:"1px solid #ddd",padding:"6px 9px"}}>{Number(emp.salary||0).toLocaleString()}</td><td style={{border:"1px solid #ddd",padding:"6px 9px"}}>{Number(ex?.commissionTotal||0).toLocaleString()}</td>
    <td style={{border:"1px solid #ddd",padding:"6px 9px"}}>{Math.round(ad).toLocaleString()}</td><td style={{border:"1px solid #ddd",padding:"6px 9px"}}>{Number(emp.loan||0).toLocaleString()}{emp.loanNote?" ("+emp.loanNote+")":""}</td>
    <td style={{border:"1px solid #ddd",padding:"6px 9px"}}>{Number(emp.brokerFee||0).toLocaleString()}</td><td style={{border:"1px solid #ddd",padding:"6px 9px"}}>{Number(emp.otherDeduction||0).toLocaleString()}{emp.otherNote?" ("+emp.otherNote+")":""}</td>
    <td style={{border:"1px solid #ddd",padding:"6px 9px",fontWeight:700,background:"#fff9e6"}}>{Math.max(0,Math.round(net)).toLocaleString()} Birr</td>
  </tr>;})} </tbody></table>
  <div style={{marginTop:40,display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:40}}>{["Prepared by","Reviewed by","Approved by"].map(l=><div key={l} style={{borderTop:"1px solid #000",paddingTop:6,fontSize:11}}>{l}</div>)}</div>
</div>;}

function L({children}){return <p style={{margin:"0 0 4px",fontSize:13,fontWeight:700,color:"#374151"}}>{children}</p>;}
function HR(){return <div style={{borderTop:"0.5px solid #E2E8F0",margin:"14px 0"}}/>;}
function EMP({children}){return <div style={{padding:40,textAlign:"center",color:"#9ca3af",fontSize:14}}>{children}</div>;}
function SC({label,value,highlight,accent}){return <div style={{background:highlight?"#1B2E4B":accent?"#FEF2F2":"#F8FAFC",color:highlight?"#fff":"#1B2E4B",borderRadius:12,padding:"10px 12px",border:"0.5px solid "+(highlight?"transparent":accent?"#FECACA":"#E2E8F0")}}><p style={{margin:0,fontSize:9,fontWeight:500,color:highlight?"#5A8C72":accent?"#B91C1C":"#64748B",letterSpacing:0.5}}>{label}</p><h3 style={{margin:"3px 0 0",fontSize:15,fontWeight:500,color:highlight?"#fff":accent?"#B91C1C":"#1B2E4B"}}>{value}</h3></div>;}
function FI({label,value,onChange,type="text",note,onNote}){return <div><p style={{fontSize:10,fontWeight:700,color:"#334155",margin:"0 0 2px"}}>{label}</p><input type={type} value={value} onChange={e=>onChange(e.target.value)} style={{width:"100%",boxSizing:"border-box",padding:"7px 9px",borderRadius:9,border:"0.5px solid #CBD5E0",background:"#fff",color:"#1B2E4B",fontSize:13}}/>{onNote!==undefined&&<input value={note||""} onChange={e=>onNote(e.target.value)} placeholder="Note" style={{width:"100%",boxSizing:"border-box",padding:"4px 7px",borderRadius:7,border:"0.5px solid #CBD5E0",background:"#fff",color:"#1B2E4B",fontSize:11,marginTop:3}}/>}</div>;}
function SB(st){const m={"Waiting for Supervisor":{bg:"#FEF3C7",co:"#92400E"},"With Supervisor":{bg:"#E0F2FE",co:"#0369A1"},"In Service":{bg:"#EBF2FD",co:"#1B4FA8"},"Ready for Payment":{bg:"#EBF5EE",co:"#2D7D46"},"Paid & Closed":{bg:"#F0FDF4",co:"#166534"},Waiting:{bg:"#F8FAFC",co:"#475569"},"On Hold":{bg:"#EDE9FE",co:"#5B3FA6"},"In Progress":{bg:"#EBF2FD",co:"#1B4FA8"},Completed:{bg:"#EBF5EE",co:"#2D7D46"},Cancelled:{bg:"#FEE2E2",co:"#B91C1C"},Pending:{bg:"#FEF3C7",co:"#92400E"},Confirmed:{bg:"#EBF2FD",co:"#1B4FA8"},Arrived:{bg:"#EBF5EE",co:"#2D7D46"},"No-show":{bg:"#F1F5F9",co:"#64748B"}};const c=m[st]||{bg:"#F1F5F9",co:"#475569"};return{borderRadius:7,padding:"2px 9px",fontSize:10,fontWeight:500,whiteSpace:"nowrap",background:c.bg,color:c.co};}