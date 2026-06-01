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
  {id:201,cat:"Beauty Salon",sub:"Nails",  name:"ስፔሻል ፔዲኪዩር",price:1500,cm:0,es:"Beauty Salon",bk:false,dm:60},
  {id:202,cat:"Beauty Salon",sub:"Nails",  name:"ኖርማል ፔዲኪዩር",price:1000,cm:0,es:"Beauty Salon",bk:false,dm:45},
  {id:203,cat:"Beauty Salon",sub:"Nails",  name:"ማኒኪዩር",price:800,cm:0,es:"Beauty Salon",bk:false,dm:45},
  {id:204,cat:"Beauty Salon",sub:"Nails",  name:"ስፔሻል ማኒኪዩር",price:1000,cm:0,es:"Beauty Salon",bk:false,dm:60},
  {id:205,cat:"Beauty Salon",sub:"Nails",  name:"ሼላክ ማስለቀቅ",price:150,cm:0,es:"Beauty Salon",bk:false,dm:20},
  {id:206,cat:"Beauty Salon",sub:"Nails",  name:"ጄል ማስለቀቅ",price:300,cm:0,es:"Beauty Salon",bk:false,dm:20},
  {id:207,cat:"Beauty Salon",sub:"Nails",  name:"ጄል በሼላክ",price:1600,cm:0,es:"Beauty Salon",bk:false,dm:75},
  {id:208,cat:"Beauty Salon",sub:"Nails",  name:"ጄል በሜታሊክ",price:1800,cm:0,es:"Beauty Salon",bk:false,dm:75},
  {id:209,cat:"Beauty Salon",sub:"Nails",  name:"ልጥፍ በሼላክ",price:1200,cm:0,es:"Beauty Salon",bk:false,dm:60},
  {id:210,cat:"Beauty Salon",sub:"Nails",  name:"ልጥፍ በሜታሊክ",price:1600,cm:0,es:"Beauty Salon",bk:false,dm:60},
  {id:211,cat:"Beauty Salon",sub:"Nails",  name:"ልጥፍ በአምብራ",price:1600,cm:0,es:"Beauty Salon",bk:false,dm:60},
  {id:212,cat:"Beauty Salon",sub:"Nails",  name:"ጄል በአምብራ",price:1800,cm:0,es:"Beauty Salon",bk:false,dm:75},
  {id:213,cat:"Beauty Salon",sub:"Nails",  name:"ሼላክ",price:600,cm:0,es:"Beauty Salon",bk:false,dm:45},
  {id:214,cat:"Beauty Salon",sub:"Nails",  name:"ሼላክ በሜታሊክ",price:800,cm:0,es:"Beauty Salon",bk:false,dm:45},
  {id:215,cat:"Beauty Salon",sub:"Nails",  name:"ጄል",price:1100,cm:0,es:"Beauty Salon",bk:false,dm:60},
  {id:216,cat:"Beauty Salon",sub:"Nails",  name:"በጥፍር ጄል በሼላክ",price:1300,cm:0,es:"Beauty Salon",bk:false,dm:60},
  {id:217,cat:"Beauty Salon",sub:"Nails",  name:"አንድ ጣት ጄል",price:150,cm:0,es:"Beauty Salon",bk:false,dm:15},
  {id:218,cat:"Beauty Salon",sub:"Nails",  name:"አንድ ጣት ልጥፍ",price:150,cm:0,es:"Beauty Salon",bk:false,dm:15},
  {id:219,cat:"Beauty Salon",sub:"Nails",  name:"ሬፍል በሼላክ",price:1400,cm:0,es:"Beauty Salon",bk:false,dm:60},
  {id:220,cat:"Beauty Salon",sub:"Nails",  name:"ሬፍል በሜታሊክ",price:1600,cm:0,es:"Beauty Salon",bk:false,dm:60},
  {id:221,cat:"Beauty Salon",sub:"Nails",  name:"የጥፍር ፍሬሮች (1)",price:10,cm:0,es:"Beauty Salon",bk:false,dm:5},
  {id:222,cat:"Beauty Salon",sub:"Nails",  name:"የጥፍር ፍሬሮች (2)",price:20,cm:0,es:"Beauty Salon",bk:false,dm:5},
  {id:223,cat:"Beauty Salon",sub:"Nails",  name:"የጥፍር ፍሬሮች (3)",price:30,cm:0,es:"Beauty Salon",bk:false,dm:5},
  {id:224,cat:"Beauty Salon",sub:"Nails",  name:"የጥፍር ፍላወር ትንሽ",price:10,cm:0,es:"Beauty Salon",bk:false,dm:10},
  {id:225,cat:"Beauty Salon",sub:"Nails",  name:"የጥፍር ፍላወር መካከለኛ",price:30,cm:0,es:"Beauty Salon",bk:false,dm:10},
  {id:226,cat:"Beauty Salon",sub:"Nails",  name:"የጥፍር ፍላወር ትልቅ",price:50,cm:0,es:"Beauty Salon",bk:false,dm:10},
  // ── Beauty Salon: Braids ─────────────────────────────────
  {id:301,cat:"Beauty Salon",sub:"Braids", name:"ስፌት",price:800,cm:10,es:"Beauty Salon",bk:false,dm:90},
  {id:302,cat:"Beauty Salon",sub:"Braids", name:"ሸሩባ በጎጥር + ጄል",price:700,cm:10,es:"Beauty Salon",bk:false,dm:60},
  {id:303,cat:"Beauty Salon",sub:"Braids", name:"ቁጥርጥር በጎጥር",price:500,cm:10,es:"Beauty Salon",bk:false,dm:45},
  {id:304,cat:"Beauty Salon",sub:"Braids", name:"ቁጥርጥር በ1 ዊግ (ከኛ በወፍራም)",price:800,cm:10,es:"Beauty Salon",bk:false,dm:90},
  {id:305,cat:"Beauty Salon",sub:"Braids", name:"ቁጥርጥር በ1 ዊግ (ከነሱ በወፍራም)",price:600,cm:10,es:"Beauty Salon",bk:false,dm:90},
  {id:306,cat:"Beauty Salon",sub:"Braids", name:"ቁጥርጥር በ1 ዊግ (ከኛ በቁጭን)",price:900,cm:10,es:"Beauty Salon",bk:false,dm:90},
  {id:307,cat:"Beauty Salon",sub:"Braids", name:"ቁጥርጥር በ1 ዊግ (ከነሱ በቁጭን)",price:600,cm:10,es:"Beauty Salon",bk:false,dm:90},
  {id:308,cat:"Beauty Salon",sub:"Braids", name:"ቦሃ ብሬድ ከኛ (ፍሬዝ)",price:1300,cm:10,es:"Beauty Salon",bk:false,dm:120},
  {id:309,cat:"Beauty Salon",sub:"Braids", name:"ቦሃ ብሬድ ከነሱ",price:600,cm:10,es:"Beauty Salon",bk:false,dm:120},
  {id:310,cat:"Beauty Salon",sub:"Braids", name:"ፍሬንች ከርል ከኛ",price:1000,cm:10,es:"Beauty Salon",bk:false,dm:120},
  {id:311,cat:"Beauty Salon",sub:"Braids", name:"ፍሬንች ከርል ከነሱ",price:600,cm:10,es:"Beauty Salon",bk:false,dm:120},
  {id:312,cat:"Beauty Salon",sub:"Braids", name:"ትዌስት በጎጥር",price:600,cm:10,es:"Beauty Salon",bk:false,dm:60},
  {id:313,cat:"Beauty Salon",sub:"Braids", name:"ትዌስት በጎጥር + ጄል",price:700,cm:10,es:"Beauty Salon",bk:false,dm:75},
  {id:314,cat:"Beauty Salon",sub:"Braids", name:"ትዌስት በ1 ዊግ (ከኛ በወፍራም)",price:900,cm:10,es:"Beauty Salon",bk:false,dm:90},
  {id:315,cat:"Beauty Salon",sub:"Braids", name:"ትዌስት በ1 ዊግ (ከኛ በቁጭን)",price:1000,cm:10,es:"Beauty Salon",bk:false,dm:90},
  {id:316,cat:"Beauty Salon",sub:"Braids", name:"ትዌስት በ1 ዊግ (ከነሱ በወፍራም)",price:600,cm:10,es:"Beauty Salon",bk:false,dm:90},
  {id:317,cat:"Beauty Salon",sub:"Braids", name:"ትዌስት በ1 ዊግ (ከነሱ በቁጭን)",price:700,cm:10,es:"Beauty Salon",bk:false,dm:90},
  {id:318,cat:"Beauty Salon",sub:"Braids", name:"ሒይማን እቡት",price:300,cm:10,es:"Beauty Salon",bk:false,dm:30},
  {id:319,cat:"Beauty Salon",sub:"Braids", name:"ስዋስዋ ስፌት",price:1000,cm:10,es:"Beauty Salon",bk:false,dm:120},
  {id:320,cat:"Beauty Salon",sub:"Braids", name:"ሒይማን መፍቻ",price:200,cm:0,es:"Beauty Salon",bk:false,dm:20},
  {id:321,cat:"Beauty Salon",sub:"Braids", name:"ካንቱ ፍሬዝ በሒይማን",price:700,cm:0,es:"Beauty Salon",bk:false,dm:30},
  {id:322,cat:"Beauty Salon",sub:"Braids", name:"ኮንዶቤት ፍሬዝ ከኛ",price:700,cm:0,es:"Beauty Salon",bk:false,dm:30},
  {id:323,cat:"Beauty Salon",sub:"Braids", name:"½ ስፌት ½ ሸሩባ",price:1500,cm:10,es:"Beauty Salon",bk:false,dm:120},
  // ── Beauty Salon: Wigs ──────────────────────────────────
  {id:401,cat:"Beauty Salon",sub:"Wigs",   name:"ኪነኛ ዊግ",  price:300, cm:0,es:"Beauty Salon",bk:false,dm:30},
  {id:402,cat:"Beauty Salon",sub:"Wigs",   name:"ሉኣም ዊግ",  price:3000,cm:0,es:"Beauty Salon",bk:false,dm:60},
  {id:403,cat:"Beauty Salon",sub:"Wigs",   name:"ወተአ ዊግ",  price:2500,cm:0,es:"Beauty Salon",bk:false,dm:60},
  {id:404,cat:"Beauty Salon",sub:"Wigs",   name:"አልባሰ",          price:2000,cm:0,es:"Beauty Salon",bk:false,dm:120},
  {id:405,cat:"Beauty Salon",sub:"Wigs",   name:"ጎሜ",                      price:2000,cm:0,es:"Beauty Salon",bk:false,dm:90},
  // ── Beauty Salon: Eyebrow ──────────────────────────────
  {id:501,cat:"Beauty Salon",sub:"Eyebrow",name:"ቅንድብ ሂና",            price:400,cm:0,es:"Beauty Salon",bk:false,dm:30},
  {id:502,cat:"Beauty Salon",sub:"Eyebrow",name:"ቅንድብ በከር",       price:200,cm:0,es:"Beauty Salon",bk:false,dm:15},
  {id:503,cat:"Beauty Salon",sub:"Eyebrow",name:"ቅንድብ በምላጩ", price:100,cm:0,es:"Beauty Salon",bk:false,dm:10},
  // ── Beauty Salon: Wax ───────────────────────────────────
  {id:601,cat:"Beauty Salon",sub:"Wax",name:"አፈር ሊፕ",                    price:250, cm:0,es:"Beauty Salon",bk:false,dm:15},
  {id:602,cat:"Beauty Salon",sub:"Wax",name:"አንደር አርም ዋክስ",price:350,cm:0,es:"Beauty Salon",bk:false,dm:20},
  {id:603,cat:"Beauty Salon",sub:"Wax",name:"ፊል ላግ ዋክስ",        price:1900,cm:0,es:"Beauty Salon",bk:false,dm:45},
  {id:604,cat:"Beauty Salon",sub:"Wax",name:"1/2 ላግ ዋክስ",                price:1000,cm:0,es:"Beauty Salon",bk:false,dm:30},
  {id:605,cat:"Beauty Salon",sub:"Wax",name:"እጀ ምሉ ዋክስ",        price:1300,cm:0,es:"Beauty Salon",bk:false,dm:30},
  {id:606,cat:"Beauty Salon",sub:"Wax",name:"1/2 አርም ዋክስ",           price:600, cm:0,es:"Beauty Salon",bk:false,dm:20},
  {id:607,cat:"Beauty Salon",sub:"Wax",name:"ጢኪኒ ዋክስ",               price:2000,cm:0,es:"Beauty Salon",bk:false,dm:30},
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
  {id:1,name:"Andom",          section:"Barbershop",  salary:0,absentDays:0,loan:0,loanNote:"",brokerFee:0,otherDeduction:0,otherNote:"",active:true,hireDate:"2024-01-01"},
  {id:2,name:"Haftom",         section:"Barbershop",  salary:0,absentDays:0,loan:0,loanNote:"",brokerFee:0,otherDeduction:0,otherNote:"",active:true,hireDate:"2024-01-01"},
  {id:3,name:"Beauty Staff 1", section:"Beauty Salon",salary:0,absentDays:0,loan:0,loanNote:"",brokerFee:0,otherDeduction:0,otherNote:"",active:true,hireDate:"2024-01-01"},
  {id:4,name:"Nail Staff 1",   section:"Beauty Salon",salary:0,absentDays:0,loan:0,loanNote:"",brokerFee:0,otherDeduction:0,otherNote:"",active:true,hireDate:"2024-01-01"},
  {id:5,name:"Spa Therapist 1",section:"Spa",         salary:0,absentDays:0,loan:0,loanNote:"",brokerFee:0,otherDeduction:0,otherNote:"",active:true,hireDate:"2024-01-01"},
];

// Ethiopian Calendar
const ETH_MONTHS=["መስከረም","ጥቅምት","ህዳር","ታህሳስ","ጥር","የካቲት","መጋቢት","ሚያዚያ","ግንቦት","ሰኔ","ሐምሌ","ነሃሴ","ጳጉሜ"];
function gregToEth(g){if(!g)return{y:2016,m:1,d:1};const d=new Date(g);const jdn=Math.floor(d.getTime()/86400000)+2440588;const r=jdn-1723856;const n=Math.floor(r/1461);const r2=r%1461;const m2=Math.floor(r2/365);const rem=r2-(m2<4?m2*365:4*365);return{y:4*n+m2+(r2%365===0&&m2===4?-1:0),m:Math.min(Math.floor(rem/30)+1,13),d:Math.min(rem%30+1,30)};}
function ethToGreg(ey,em,ed){const jdn=1723856+(ey-1)*365+Math.floor(ey/4)+(em-1)*30+ed;const l=jdn+68569;const n=Math.floor(4*l/146097);const l2=l-Math.floor((146097*n+3)/4);const i=Math.floor(4000*(l2+1)/1461001);const l3=l2-Math.floor(1461*i/4)+31;const j=Math.floor(80*l3/2447);const dd=l3-Math.floor(2447*j/80);const l4=Math.floor(j/11);return`${100*(n-49)+i+l4}-${String(j+2-12*l4).padStart(2,"0")}-${String(dd).padStart(2,"0")}`;}

function todayStr(){return new Date().toISOString().slice(0,10);}
function money(n){return Number(n||0).toLocaleString()+" Birr";}
// Wait time tracking using localStorage (no DB column needed)
function markArrival(id){try{const k="ambar_arr_"+id;if(!localStorage.getItem(k))localStorage.setItem(k,Date.now());}catch(e){}}
function waitMins(id){try{const t=localStorage.getItem("ambar_arr_"+id);if(!t)return null;return Math.floor((Date.now()-Number(t))/60000);}catch(e){return null;}}
function svcMins(lineId){try{const t=localStorage.getItem("ambar_svc_"+lineId);if(!t)return null;return Math.floor((Date.now()-Number(t))/60000);}catch(e){return null;}}
function markSvcStart(lineId){try{const k="ambar_svc_"+lineId;if(!localStorage.getItem(k))localStorage.setItem(k,Date.now());}catch(e){}}
function makeId(name,phone){const n=(name||"CUS").replace(/[^a-zA-Z]/g,"").slice(0,3).toUpperCase()||"CUS";const p=(phone||"0000").replace(/\D/g,"").slice(-4)||"0000";return n+"-"+p;}
function lineGross(l){return Number(l.price||0)*Number(l.qty||1);}
function lineIncome(l){if(l.free)return 0;return Math.max(0,lineGross(l)-Number(l.discount||0));}
function lineComm(l){return Math.round((lineIncome(l)*Number(l.commission||0))/100);}
function getPayPeriod(d){const dt=new Date(d||todayStr());const day=dt.getDate();let sy=dt.getFullYear(),sm=dt.getMonth();if(day<11){sm--;if(sm<0){sm=11;sy--;}}const s=new Date(sy,sm,11),e=new Date(sy,sm+1,10);const fmt=x=>x.toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"});return{start:s.toISOString().slice(0,10),end:e.toISOString().slice(0,10),label:fmt(s)+" - "+fmt(e)};}
function toEthTime(t){if(!t)return"";const[h,m]=t.split(":").map(Number);let e=h-6;if(e<=0)e+=12;return e+":"+String(m).padStart(2,"0")+" "+(h<18?"ቀን":"ማታ");}
function timeSlots(){const s=[];for(let h=OPEN_HOUR;h<CLOSE_HOUR;h++)for(let m=0;m<60;m+=30)s.push(String(h).padStart(2,"0")+":"+String(m).padStart(2,"0"));return s;}
function exportCSV(rows,fn){const k=Object.keys(rows[0]||{});const csv=[k.join(","),...rows.map(r=>k.map(x=>JSON.stringify(r[x]??"")).join(","))].join("\n");const a=document.createElement("a");a.href="data:text/csv;charset=utf-8,"+encodeURIComponent(csv);a.download=fn;a.click();}
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
const TABA={Reception:["reception","manager"],Supervisor:["supervisor","manager"],Checkout:["reception","manager"],Bookings:["reception","supervisor","manager"],"Service Setup":["manager"],"Daily Closing":["manager"],Expenses:["manager"],Customers:["manager"],Payroll:["manager"],Dashboard:["manager"],Staff:["manager"],"Activity Log":["manager"],Handover:["reception","supervisor","manager"]};
const dbSvc=r=>({id:r.id,category:r.category,sub:r.sub||"",name:r.name,price:Number(r.price),commission:Number(r.commission),employeeSection:r.employee_section,bookable:!!r.bookable,durationMins:r.duration_mins||60});
const dbEmp=r=>({id:r.id,name:r.name,section:r.section,salary:Number(r.salary),absentDays:Number(r.absent_days),loan:Number(r.loan),loanNote:r.loan_note||"",brokerFee:Number(r.broker_fee),otherDeduction:Number(r.other_deduction),otherNote:r.other_note||"",active:r.active,hireDate:r.hire_date});
const dbCust=r=>({id:r.id,name:r.name,phone:r.phone,totalVisits:Number(r.total_visits)});
const dbVis=r=>({id:r.id,date:r.date,queue:r.queue,customerId:r.customer_id,name:r.name,payerName:r.payer_name,phone:r.phone,groupId:r.group_id,groupName:r.group_name||"",services:r.services||[],totalService:Number(r.total_service),totalPaid:Number(r.total_paid),paymentMethod:r.payment_method||"",tips:r.tips||[],status:r.status,note:r.note||"",registeredAt:r.registered_at||r.created_at||null});
const dbExp=r=>({id:r.id,date:r.date,type:r.type,name:r.name,reason:r.reason||"",qty:Number(r.qty),unit:Number(r.unit),total:Number(r.total)});
const dbBk=r=>({id:r.id,date:r.date,time:r.time,customerId:r.customer_id,customerName:r.customer_name,customerPhone:r.customer_phone,serviceId:Number(r.service_id),serviceName:r.service_name,serviceCategory:r.service_category,durationMins:Number(r.duration_mins||60),people:r.people||1,notes:r.notes||"",status:r.status,createdBy:r.created_by||"",visitId:r.visit_id||null});
const dbStaff=r=>({id:r.id,name:r.name,role:r.role,password:r.password,active:r.active});
function useW(){const[w,setW]=useState(window.innerWidth);useEffect(()=>{const h=()=>setW(window.innerWidth);window.addEventListener("resize",h);return()=>window.removeEventListener("resize",h);},[]);return{mob:w<640};}
function Notifs({items,dismiss}){if(!items.length)return null;return <div style={{position:"fixed",top:0,left:0,right:0,zIndex:9999,padding:8,pointerEvents:"none",display:"flex",flexDirection:"column",gap:4}}>{items.map(n=><div key={n.id} style={{background:n.type==="success"?"#166534":n.type==="booking"?"#5b21b6":n.type==="payment"?"#1e40af":n.type==="warning"?"#92400e":"#1e3a8a",color:"#fff",borderRadius:12,padding:"11px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",boxShadow:"0 4px 20px rgba(0,0,0,0.3)",pointerEvents:"all",maxWidth:460,margin:"0 auto",width:"calc(100% - 16px)"}}><span style={{fontWeight:700,fontSize:13}}>{n.msg}</span><button onClick={()=>dismiss(n.id)} style={{background:"none",border:"none",color:"#fff",cursor:"pointer",fontSize:18,marginLeft:12}}>×</button></div>)}</div>;}

function EthPicker({value,onChange,label}){
  const e=gregToEth(value||todayStr());
  const[ey,setEy]=useState(e.y);const[em,setEm]=useState(e.m);const[ed,setEd]=useState(e.d);const[show,setShow]=useState(false);
  const greg=value?new Date(value).toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"}):"";
  useEffect(()=>{const e=gregToEth(value||todayStr());setEy(e.y);setEm(e.m);setEd(e.d);},[value]);
  function pick(y,m,d){onChange(ethToGreg(y,m,d));setShow(false);}
  return <div style={{position:"relative",marginBottom:8}}>
    {label&&<p style={S.lbl}>{label}</p>}
    <div style={{display:"flex",gap:6}}>
      <button type="button" onClick={()=>setShow(v=>!v)} style={{flex:1,padding:"10px 12px",borderRadius:10,border:"1px solid #c7b06a",background:"#fef3c7",color:"#92400e",fontWeight:700,cursor:"pointer",textAlign:"left",fontSize:13}}>🇪🇹 {ETH_MONTHS[(em||1)-1]} {ed}, {ey}</button>
      <div style={{flex:1,padding:"10px 12px",borderRadius:10,border:"1px solid #c7b06a",background:"#dbeafe",color:"#1e40af",fontSize:12,display:"flex",alignItems:"center",fontWeight:600}}>📅 {greg}</div>
    </div>
    {show&&<div style={{position:"absolute",top:"105%",left:0,zIndex:999,background:"#fff",border:"1px solid #e0b85a",borderRadius:14,padding:14,boxShadow:"0 8px 32px rgba(0,0,0,0.18)",minWidth:280,marginTop:2}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
        <button onClick={()=>{let nm=em-1,ny=ey;if(nm<1){nm=13;ny--;}setEm(nm);setEy(ny);}} style={S.navBtn}>‹</button>
        <b style={{color:"#92400e"}}>{ETH_MONTHS[(em||1)-1]} {ey}</b>
        <button onClick={()=>{let nm=em+1,ny=ey;if(nm>13){nm=1;ny++;}setEm(nm);setEy(ny);}} style={S.navBtn}>›</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3,marginBottom:4}}>
        {["እሁ","ሰኞ","ማክ","ረቡ","ሐሙ","አርብ","ቅዳ"].map(d=><div key={d} style={{textAlign:"center",fontSize:9,fontWeight:800,color:"#6b4c11",padding:"2px 0"}}>{d}</div>)}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3}}>
        {Array.from({length:em===13?6:30},(_,i)=>i+1).map(d=><button key={d} onClick={()=>pick(ey,em,d)} style={{padding:"5px 3px",borderRadius:7,border:"none",background:d===ed?"#e0b85a":"#f9f5eb",fontWeight:d===ed?900:400,cursor:"pointer",fontSize:12}}>{d}</button>)}
      </div>
      <div style={{display:"flex",gap:6,marginTop:8}}>
        <input type="number" value={ey} onChange={e=>setEy(Number(e.target.value))} style={{...S.ii,width:70}}/>
        <select value={em} onChange={e=>setEm(Number(e.target.value))} style={S.ii}>{ETH_MONTHS.map((m,i)=><option key={i} value={i+1}>{m}</option>)}</select>
      </div>
    </div>}
  </div>;
}

export default function App(){
  const sc=useW();
  const[user,setUser]=useState(()=>{try{return JSON.parse(sessionStorage.getItem("ambar_u"))||null;}catch{return null;}});
  const[lid,setLid]=useState("");const[lpw,setLpw]=useState("");const[lerr,setLerr]=useState("");
  const[staff,setStaff]=useState(DEFAULT_STAFF);
  const[loading,setLoading]=useState(true);const[saving,setSaving]=useState(false);const[offline,setOffline]=useState(!navigator.onLine);
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
  const[rName,setRName]=useState("");const[rPhone,setRPhone]=useState("");const[rPpl,setRPpl]=useState(1);const[rNote,setRNote]=useState("");const[rmsg,setRmsg]=useState("");
  const[deItem,setDeItem]=useState("");const[deQty,setDeQty]=useState(1);const[deUnit,setDeUnit]=useState("");
  const[gDate,setGDate]=useState(todayStr());const[gName,setGName]=useState("");const[gRsn,setGRsn]=useState("");const[gAmt,setGAmt]=useState("");
  const[newCat,setNewCat]=useState("");
  const[nSvc,setNSvc]=useState({category:DC[0],sub:"",name:"",price:"",commission:0,employeeSection:DC[0],bookable:false,durationMins:60});
  const[svcF,setSvcF]=useState("All");
  const[nEmp,setNEmp]=useState({name:"",section:DC[0],salary:"",hireDate:todayStr()});
  const[showFired,setShowFired]=useState(false);const[cSearch,setCSearch]=useState("");const[clDate,setClDate]=useState(todayStr());
  const[bkDate,setBkDate]=useState(todayStr());const[showBkF,setShowBkF]=useState(false);const[editBk,setEditBk]=useState(null);
  const[bkF,setBkF]=useState({customerName:"",customerPhone:"",serviceId:"",date:todayStr(),time:"10:00",people:1,notes:""});
  const[bkWarn,setBkWarn]=useState("");
  const[showWalkIn,setShowWalkIn]=useState(false);
  const[wiSvcId,setWiSvcId]=useState("");const[wiName,setWiName]=useState("");const[wiPhone,setWiPhone]=useState("");const[wiNote,setWiNote]=useState("");
  const[nStaff,setNStaff]=useState({id:"",name:"",role:"reception",password:""});const[editStaff,setEditStaff]=useState(null);
  const[handoverNote,setHandoverNote]=useState("");const[handoverLog,setHandoverLog]=useState([]);
  const[dailyTarget,setDailyTarget]=useState(()=>{try{return Number(localStorage.getItem("ambar_target")||0);}catch{return 0;}});
  const dRef=useRef({});const eRef=useRef({});

  function push(msg,type="info"){const id=++nid.current;setNotifs(p=>[...p,{id,msg,type}]);chime(type);setTimeout(()=>setNotifs(p=>p.filter(n=>n.id!==id)),7000);}
  function dismiss(id){setNotifs(p=>p.filter(n=>n.id!==id));}
  function resetIdle(){clearTimeout(idleRef.current);idleRef.current=setTimeout(()=>setPinLocked(true),30*60*1000);}
  useEffect(()=>{if(!user)return;const evs=["mousemove","keydown","click","touchstart"];evs.forEach(e=>window.addEventListener(e,resetIdle));resetIdle();return()=>{clearTimeout(idleRef.current);evs.forEach(e=>window.removeEventListener(e,resetIdle));};},[user]);
  function unlockPin(){const f=staff.find(s=>s.id===user.id&&s.password===pinInput);if(f){setPinLocked(false);setPinInput("");setPinErr("");}else setPinErr("Wrong password.");}
  useEffect(()=>{const on=()=>{setOffline(false);push("Back online","success");};const off=()=>{setOffline(true);push("Offline — changes will not save","warning");};window.addEventListener("online",on);window.addEventListener("offline",off);return()=>{window.removeEventListener("online",on);window.removeEventListener("offline",off);};},[]);

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
        if(role===ROLES.SUPERVISOR||role===ROLES.MANAGER)push("🆕 New: "+p.new.name+" #"+p.new.queue,"info");
      })
      .on("postgres_changes",{event:"UPDATE",schema:"public",table:"visits"},p=>{
        setVisits(prev=>prev.map(x=>x.id===p.new.id?dbVis(p.new):x));
        if(role===ROLES.RECEPTION&&p.new.status==="Paid & Closed")push("✅ "+p.new.name+" paid","success");
        if((role===ROLES.RECEPTION||role===ROLES.MANAGER)&&p.new.status==="Ready for Payment")push("💳 "+p.new.name+" ready for payment","payment");
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
    // Polling fallback every 8 seconds
    const poll=setInterval(()=>{
      supabase.from("visits").select("*").order("queue").then(({data})=>{if(data)setVisits(data.map(dbVis));});
      supabase.from("bookings").select("*").order("date").order("time").then(({data})=>{if(data)setBks(data.map(dbBk));});
    },8000);
    return()=>{supabase.removeChannel(vs);supabase.removeChannel(bs);supabase.removeChannel(es);clearInterval(poll);};
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
      const{count:cc}=await supabase.from("categories").select("*",{count:"exact",head:true});
      if(cc===0){
        await supabase.from("categories").insert(DC.map(n=>({name:n})));
        await supabase.from("services").insert(FULL_SERVICES.map(s=>({id:s.id,category:s.category,sub:s.sub,name:s.name,price:s.price,commission:s.commission,employee_section:s.employeeSection,bookable:s.bookable,duration_mins:s.durationMins})));
        await supabase.from("employees").insert(DEFAULT_EMPLOYEES.map(e=>({id:e.id,name:e.name,section:e.section,salary:0,absent_days:0,loan:0,loan_note:"",broker_fee:0,other_deduction:0,other_note:"",active:true,hire_date:e.hireDate})));
        await loadAll();
      }
      const{count:sc}=await supabase.from("staff").select("*",{count:"exact",head:true});
      if(sc===0)await supabase.from("staff").insert(DEFAULT_STAFF);
    }
    seed();
  },[user]);

  // Derived
  const act=visits.find(v=>v.id===actId)||null;
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
    // Sort by queue number so priority customers (lower number) appear first
    r.sort((a,b)=>a.visit.queue-b.visit.queue);
    return r;
  },[visits]);
  const empC=useMemo(()=>emps.map(emp=>{const pv=visits.filter(v=>v.date>=period.start&&v.date<=period.end&&v.status==="Paid & Closed");const lines=pv.flatMap(v=>v.services).filter(l=>l.employee===emp.name&&l.status!=="Cancelled");return{...emp,commissionTotal:lines.reduce((s,l)=>s+lineComm(l),0),breakdown:lines.map(l=>({name:l.name,income:lineIncome(l),commission:lineComm(l)}))};}),[emps,visits,period]);
  const fCusts=custs.filter(c=>{const q=cSearch.toLowerCase().trim();if(!q)return true;return c.name.toLowerCase().includes(q)||c.phone.includes(q)||c.id.toLowerCase().includes(q);});
  const todayBk=bks.filter(b=>b.date===bkDate).sort((a,b)=>a.time.localeCompare(b.time));
  // FIXED: only bookable spa services, guaranteed true boolean
  const bkSvcs=svcs.filter(s=>s.bookable===true);
  function canAccess(t){return(TABA[t]||[]).includes(user?.role);}
  const allTabs=Object.keys(TABA).filter(t=>canAccess(t));
  const dailyTabs=allTabs.filter(t=>["Reception","Supervisor","Checkout","Bookings"].includes(t));
  const mgrTabs=allTabs.filter(t=>!dailyTabs.includes(t));

  function doLogin(){const f=staff.find(s=>s.id===lid.trim()&&s.password===lpw&&s.active);if(f){setUser(f);sessionStorage.setItem("ambar_u",JSON.stringify(f));setLerr("");}else setLerr("Invalid username or password.");}
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
    const{error}=await supabase.from("visits").insert(rows);
    if(error){alert("Error saving.");setSaving(false);return;}
    logAct(user,"Registered",rName.trim()+" x"+cnt);
    rows.forEach(r=>markArrival(r.id));
    setRName("");setRPhone("");setRPpl(1);setRNote("");setRmsg("");setSaving(false);
  }
  async function cancelV(id){const v=visits.find(x=>x.id===id);if(!v)return;if(v.services.length>0)return alert("Remove all services before cancelling.");if(!window.confirm("Cancel this customer?"))return;await supabase.from("visits").delete().eq("id",id);setVisits(p=>p.filter(x=>x.id!==id));if(actId===id)setActId(null);}
  async function addDE(){if(!deItem.trim()||!deUnit)return alert("Enter item and price.");const q=Math.max(1,Number(deQty||1)),u=Number(deUnit||0);const row={id:Date.now(),date:todayStr(),type:"Daily Operation",name:deItem,reason:"",qty:q,unit:u,total:q*u};await supabase.from("expenses").insert(row);setExps(p=>[...p,row]);setDeItem("");setDeQty(1);setDeUnit("");}
  async function addSvc(){if(!act)return alert("Select a customer first.");const s=svcs.find(s=>s.id===Number(svSvcId));if(!s)return alert("Select a service.");const line={lineId:Date.now(),serviceId:s.id,name:s.name,category:s.category,sub:s.sub,price:Number(s.price),qty:1,discount:0,free:false,commission:Number(s.commission||0),employeeSection:s.employeeSection,employee:"",preferredEmployee:"",status:"Waiting"};const upd=[...act.services,line];await supabase.from("visits").update({services:upd,total_service:upd.reduce((s,l)=>s+lineIncome(l),0),status:"In Service"}).eq("id",act.id);setSvSvcId("");}
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
      // This gives them priority since their queue number is preserved
      const upd=vis.services.map(l=>{
        if(l.lineId===lid2)return{...l,status:"Completed"};
        if(l.status==="On Hold")return{...l,status:"Waiting"};
        return l;
      });
      await supabase.from("visits").update({services:upd,total_service:upd.reduce((s,l)=>s+lineIncome(l),0)}).eq("id",vid);
      // Notify supervisor
      const unlocked=vis.services.filter(l=>l.lineId!==lid2&&l.status==="On Hold");
      if(unlocked.length>0){
        push("⭐ "+vis.name+" finished "+line.name+" — now has PRIORITY for: "+unlocked.map(l=>l.name).join(", "),"success");
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
      await supabase.from("visits").update({services:upd,total_service:upd.reduce((s,l)=>s+lineIncome(l),0)}).eq("id",vid);
      return;
    }

    const upd=vis.services.map(l=>l.lineId!==lid2?l:{...l,[f]:nv});
    await supabase.from("visits").update({services:upd,total_service:upd.reduce((s,l)=>s+lineIncome(l),0)}).eq("id",vid);
  }
  async function remLine(vid,lid2){if(!window.confirm("Remove this service?"))return;const vis=visits.find(x=>x.id===vid);if(!vis)return;const upd=vis.services.filter(l=>l.lineId!==lid2);await supabase.from("visits").update({services:upd,total_service:upd.reduce((s,l)=>s+lineIncome(l),0)}).eq("id",vid);}
  async function markReady(){if(!act||!act.services.length)return alert("No services added.");const p=act.services.find(l=>!["Completed","Cancelled"].includes(l.status));if(p)return alert("Mark as Completed or Cancelled first: "+p.name);const m=act.services.find(l=>l.status!=="Cancelled"&&!l.employee);if(m)return alert("Assign an employee for: "+m.name);await supabase.from("visits").update({status:"Ready for Payment"}).eq("id",act.id);logAct(user,"Ready for Payment",act.name);}
  async function reopen(){await supabase.from("visits").update({status:"In Service"}).eq("id",act.id);}
  function addTip(){if(!tipEmp||!tipAmt)return alert("Select employee and enter amount.");setTips(p=>[...p,{id:Date.now(),employee:tipEmp,amount:Number(tipAmt)}]);setTipEmp("");setTipAmt("");}
  async function confirmPay(grp=false){if(!act)return;const ids=grp&&act.groupId?visits.filter(v=>v.groupId===act.groupId&&v.status!=="Cancelled").map(v=>v.id):[act.id];for(const id of ids){const v=visits.find(x=>x.id===id);const mt=id===act.id?tips:[];const mtt=mt.reduce((s,t)=>s+Number(t.amount||0),0);await supabase.from("visits").update({tips:mt,total_paid:v.totalService+mtt,payment_method:payM,status:"Paid & Closed"}).eq("id",id);}logAct(user,"Payment",act.name+" "+payM);setTips([]);setActId(null);}
  async function saveBk(){
    const sid=Number(bkF.serviceId);
    const s=svcs.find(sv=>sv.id===sid&&sv.bookable===true);
    if(!bkF.customerName.trim()||!bkF.customerPhone.trim()||!sid||!s||!bkF.date||!bkF.time)return alert("Please fill all fields and select a service.");
    const warn=checkConflict(bks,bkF,svcs);
    if(warn&&!window.confirm(warn+"\n\nProceed anyway?"))return;
    setSaving(true);
    const cid=makeId(bkF.customerName.trim(),bkF.customerPhone.trim());
    if(!custs.find(c=>c.phone===bkF.customerPhone.trim())){await supabase.from("customers").upsert({id:cid,name:bkF.customerName.trim(),phone:bkF.customerPhone.trim(),total_visits:0});setCusts(p=>[...p,{id:cid,name:bkF.customerName.trim(),phone:bkF.customerPhone.trim(),totalVisits:0}]);}
    const row={id:editBk?.id||Date.now(),date:bkF.date,time:bkF.time,customer_id:cid,customer_name:bkF.customerName.trim(),customer_phone:bkF.customerPhone.trim(),service_id:sid,service_name:s.name,service_category:s.category,duration_mins:s.durationMins,people:Number(bkF.people||1),notes:bkF.notes,status:editBk?"Confirmed":"Pending",created_by:user.name,visit_id:null};
    if(editBk)await supabase.from("bookings").update(row).eq("id",editBk.id);
    else await supabase.from("bookings").insert(row);
    logAct(user,editBk?"Edited booking":"New booking",bkF.customerName+" — "+s.name);
    setShowBkF(false);setEditBk(null);setBkF({customerName:"",customerPhone:"",serviceId:"",date:todayStr(),time:"10:00",people:1,notes:""});setBkWarn("");setSaving(false);
  }
  async function updBk(id,status){await supabase.from("bookings").update({status}).eq("id",id);}
  async function checkIn(b){if(!window.confirm("Check in "+b.customerName+"?"))return;setSaving(true);const cid=makeId(b.customerName,b.customerPhone);const tc=visits.filter(v=>v.date===todayStr()).length;const vr={id:Date.now(),date:todayStr(),queue:tc+1,customer_id:cid,name:b.customerName,payer_name:b.customerName,phone:b.customerPhone,group_id:null,group_name:"",services:[],total_service:0,total_paid:0,payment_method:"",tips:[],status:"Waiting for Supervisor",note:"Booking: "+b.serviceName};await supabase.from("visits").insert(vr);await supabase.from("bookings").update({status:"Arrived",visit_id:vr.id}).eq("id",b.id);logAct(user,"Check-in",b.customerName);setSaving(false);push(b.customerName+" checked in — Queue #"+vr.queue,"success");}
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
  async function addGE(){if(!gName.trim()||!gAmt)return alert("Enter name and amount.");const row={id:Date.now(),date:gDate,type:"General",name:gName,reason:gRsn,qty:1,unit:Number(gAmt),total:Number(gAmt)};await supabase.from("expenses").insert(row);setExps(p=>[...p,row]);setGName("");setGRsn("");setGAmt("");}
  async function delE(id){if(!window.confirm("Delete?"))return;await supabase.from("expenses").delete().eq("id",id);setExps(p=>p.filter(e=>e.id!==id));}
  async function addCat(){if(!newCat.trim()||cats.includes(newCat.trim()))return;await supabase.from("categories").insert({name:newCat.trim()});setCats(p=>[...p,newCat.trim()]);setNewCat("");}
  async function addSvc2(){if(!nSvc.name.trim()||!nSvc.price)return alert("Enter name and price.");const r={id:Date.now(),category:nSvc.category,sub:nSvc.sub,name:nSvc.name,price:Number(nSvc.price),commission:Number(nSvc.commission||0),employee_section:nSvc.employeeSection,bookable:nSvc.bookable,duration_mins:Number(nSvc.durationMins||60)};await supabase.from("services").insert(r);setSvcs(p=>[...p,{...nSvc,id:r.id,price:Number(nSvc.price),commission:Number(nSvc.commission||0),durationMins:Number(nSvc.durationMins||60)}]);setNSvc({category:DC[0],sub:"",name:"",price:"",commission:0,employeeSection:DC[0],bookable:false,durationMins:60});}
  async function updSvc(id,f,v){const df=f==="employeeSection"?"employee_section":f==="durationMins"?"duration_mins":f;const val=["price","commission","durationMins"].includes(f)?Number(v)||0:f==="bookable"?v:v;setSvcs(p=>p.map(s=>s.id===id?{...s,[f]:val}:s));clearTimeout(dRef.current[id+f]);dRef.current[id+f]=setTimeout(async()=>await supabase.from("services").update({[df]:val}).eq("id",id),800);}
  async function delSvc(id){if(!window.confirm("Remove this service?"))return;await supabase.from("services").delete().eq("id",id);setSvcs(p=>p.filter(s=>s.id!==id));}
  async function addEmp(){if(!nEmp.name.trim()||!nEmp.salary)return alert("Enter name and salary.");const r={id:Date.now(),name:nEmp.name.trim(),section:nEmp.section,salary:Number(nEmp.salary),absent_days:0,loan:0,loan_note:"",broker_fee:0,other_deduction:0,other_note:"",active:true,hire_date:nEmp.hireDate};await supabase.from("employees").insert(r);setEmps(p=>[...p,dbEmp(r)]);setNEmp({name:"",section:DC[0],salary:"",hireDate:todayStr()});}
  async function updEmp(id,f,v){const m={absentDays:"absent_days",loanNote:"loan_note",brokerFee:"broker_fee",otherDeduction:"other_deduction",otherNote:"other_note",hireDate:"hire_date"};const df=m[f]||f;const val=["name","section","hireDate","loanNote","otherNote"].includes(f)?v:Number(v)||0;setEmps(p=>p.map(e=>e.id===id?{...e,[f]:val}:e));clearTimeout(eRef.current[id+f]);eRef.current[id+f]=setTimeout(async()=>await supabase.from("employees").update({[df]:val}).eq("id",id),800);}
  async function setEmpAct(id,active){if(!window.confirm(active?"Reactivate?":"Deactivate?"))return;await supabase.from("employees").update({active}).eq("id",id);setEmps(p=>p.map(e=>e.id===id?{...e,active}:e));}
  async function closePeriod(){if(!window.confirm("Close pay period "+period.label+"?"))return;const snap=empC.map(e=>({id:e.id,name:e.name,section:e.section,salary:e.salary,commissionTotal:e.commissionTotal,absentDays:e.absentDays,loan:e.loan,brokerFee:e.brokerFee,otherDeduction:e.otherDeduction,loanNote:e.loanNote,otherNote:e.otherNote}));await supabase.from("closed_periods").insert({period:period.label,start_date:period.start,end_date:period.end,closed_at:new Date().toISOString(),employees:snap});for(const e of emps)await supabase.from("employees").update({absent_days:0,loan:0,loan_note:"",broker_fee:0,other_deduction:0,other_note:""}).eq("id",e.id);setEmps(p=>p.map(e=>({...e,absentDays:0,loan:0,loanNote:"",brokerFee:0,otherDeduction:0,otherNote:""})));logAct(user,"Closed period",period.label);alert("Period closed.");}
  async function saveStaff(){if(!nStaff.id.trim()||!nStaff.name.trim()||!nStaff.password.trim())return alert("Fill all fields.");const r={id:nStaff.id.trim().toLowerCase(),name:nStaff.name.trim(),role:nStaff.role,password:nStaff.password.trim(),active:true};await supabase.from("staff").upsert(r);setStaff(p=>{const i=p.findIndex(s=>s.id===r.id);if(i>=0){const n=[...p];n[i]=r;return n;}return[...p,r];});logAct(user,"Staff saved",r.name);setNStaff({id:"",name:"",role:"reception",password:""});setEditStaff(null);alert("Saved.");}
  async function setStaffAct(id,active){if(!window.confirm(active?"Reactivate?":"Deactivate?"))return;await supabase.from("staff").update({active}).eq("id",id);setStaff(p=>p.map(s=>s.id===id?{...s,active}:s));}
  async function delCust(id){if(!window.confirm("Delete customer permanently?"))return;await supabase.from("customers").delete().eq("id",id);setCusts(p=>p.filter(c=>c.id!==id));}
  function doExportCSV(){const rows=clV.filter(v=>v.status==="Paid & Closed").map(v=>({Queue:v.queue,Name:v.name,Phone:v.phone,Services:v.services.map(s=>s.name).join("|"),Total:v.totalService,Method:v.paymentMethod,Tips:v.tips.reduce((s,t)=>s+t.amount,0)}));if(!rows.length)return alert("No paid visits for this date.");exportCSV(rows,"ambar-closing-"+clDate+".csv");}

  const gc=sc.mob?"1fr":"1fr 1.15fr";

  if(user&&pinLocked)return(<div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"linear-gradient(135deg,#0f1720,#1d2a36)"}}><div style={{background:"#fff",borderRadius:24,padding:40,width:"100%",maxWidth:340,margin:"0 16px",boxShadow:"0 20px 60px rgba(0,0,0,0.4)",textAlign:"center"}}><div style={{fontSize:44,marginBottom:8}}>🔒</div><h2 style={{margin:"0 0 4px"}}>Session Locked</h2><p style={{color:"#6b7280",fontSize:13,marginBottom:20}}>Enter password to continue as {user.name}</p>{pinErr&&<div style={{background:"#fee2e2",color:"#991b1b",borderRadius:10,padding:10,marginBottom:12,fontSize:13,fontWeight:700}}>{pinErr}</div>}<input style={S.inp} type="password" value={pinInput} onChange={e=>setPinInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&unlockPin()} placeholder="Password" autoFocus/><button style={S.btnP} onClick={unlockPin}>Unlock</button><button style={S.btnS} onClick={logout}>Log out instead</button></div></div>);

  if(!user)return(<div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"linear-gradient(135deg,#0f1720,#1d2a36)"}}><div style={{background:"#fff",borderRadius:24,padding:40,width:"100%",maxWidth:380,margin:"0 16px",boxShadow:"0 20px 60px rgba(0,0,0,0.4)"}}><div style={{textAlign:"center",marginBottom:24}}><div style={{fontSize:44}}>✦</div><h1 style={{margin:"8px 0 0",fontSize:22,fontWeight:900}}>Ambar Spa & Beauty</h1><p style={{margin:"6px 0 0",color:"#6b7280",fontSize:13}}>Staff Login</p></div>{lerr&&<div style={{background:"#fee2e2",color:"#991b1b",borderRadius:10,padding:"10px 14px",marginBottom:14,fontSize:13,fontWeight:700}}>{lerr}</div>}<p style={S.lbl}>Username</p><input style={S.inp} value={lid} onChange={e=>setLid(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doLogin()} placeholder="e.g. reception1" autoFocus/><p style={S.lbl}>Password</p><input style={S.inp} type="password" value={lpw} onChange={e=>setLpw(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doLogin()} placeholder="Password"/><button style={{...S.btnP,marginTop:8}} onClick={doLogin}>Login</button></div></div>);

  if(loading)return(<div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#0f1720",color:"#e0b85a"}}><div style={{textAlign:"center"}}><div style={{fontSize:48,marginBottom:16}}>✦</div><div style={{fontSize:18}}>Loading Ambar Spa...</div></div></div>);
  return(<div style={{minHeight:"100vh",background:"linear-gradient(135deg,#0f1720 0%,#1d2a36 38%,#f6efe3 38%,#fffaf2 100%)",fontFamily:"Segoe UI,Arial,sans-serif",color:"#111827"}}>
    <Notifs items={notifs} dismiss={dismiss}/>
    {offline&&<div style={{background:"#b45309",color:"#fff",textAlign:"center",padding:8,fontSize:13,fontWeight:700}}>⚠ Offline — changes will not save</div>}
    {saving&&<div style={{background:"#e0b85a",color:"#111827",textAlign:"center",padding:6,fontSize:13,fontWeight:700}}>Saving...</div>}
    <div style={{maxWidth:1400,margin:"0 auto",padding:sc.mob?"12px":"28px"}}>
      <header style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",color:"white",marginBottom:14,flexWrap:"wrap",gap:8}}>
        <div><p style={{color:"#e0b85a",fontWeight:900,letterSpacing:2,margin:"0 0 2px",fontSize:11}}>AMBAR SPA & BEAUTY</p>
          {!sc.mob&&<h1 style={{margin:0,fontSize:22,fontWeight:900}}>Salon Management System</h1>}
          <p style={{color:"#f8ead4",fontSize:12,margin:"4px 0 0"}}>{user.name}<span style={{background:"#e0b85a",color:"#111827",borderRadius:6,padding:"1px 7px",fontSize:10,fontWeight:800,marginLeft:6}}>{user.role}</span><button onClick={logout} style={{background:"transparent",border:"1px solid #e0b85a",color:"#e0b85a",borderRadius:8,padding:"2px 10px",cursor:"pointer",fontSize:11,marginLeft:8}}>Logout</button></p>
        </div>
        <div style={{background:"#e0b85a",color:"#111827",borderRadius:16,padding:"10px 18px",textAlign:"center"}}><p style={{margin:0,fontSize:10,fontWeight:800}}>TODAY NEXT</p><h2 style={{margin:"2px 0 0",fontSize:26,fontWeight:900}}>#{todayV.length+1}</h2></div>
      </header>

      {sc.mob?(<div style={{marginBottom:10}}><button onClick={()=>setMobNav(v=>!v)} style={{...S.btnS,marginBottom:0}}>☰ {tab}</button>{mobNav&&<div style={{background:"#fff",borderRadius:14,padding:10,marginTop:6,border:"1px solid #e6c977"}}>{allTabs.map(t=><button key={t} style={{...tab===t?S.tabA:S.tab,display:"block",width:"100%",marginBottom:4,textAlign:"left"}} onClick={()=>{setTab(t);setMobNav(false);}}>{t}</button>)}</div>}</div>):(
        <>{dailyTabs.length>0&&<><p style={S.navL}>DAILY WORKFLOW</p><div style={{display:"grid",gridTemplateColumns:"repeat("+dailyTabs.length+",1fr)",gap:6,marginBottom:8}}>{dailyTabs.map(t=><button key={t} style={tab===t?S.tabA:S.tab} onClick={()=>setTab(t)}>{t}</button>)}</div></>}
        {mgrTabs.length>0&&<><p style={{...S.navL,color:"#94a3b8"}}>MANAGEMENT</p><div style={{display:"grid",gridTemplateColumns:"repeat("+Math.min(mgrTabs.length,7)+",1fr)",gap:6,marginBottom:14}}>{mgrTabs.map(t=><button key={t} style={tab===t?{...S.tabA,background:"#334155",color:"#e0b85a"}:{...S.tab,background:"#1e293b",color:"#cbd5e1",border:"1px solid #334155"}} onClick={()=>setTab(t)}>{t}</button>)}</div></>}</>
      )}

      {tab==="Reception"&&<main style={{display:"grid",gridTemplateColumns:gc,gap:14}}>
        <section style={S.card}><h2 style={S.ct}>Register Customer</h2>
          <L>Phone *</L><div style={S.r2}><input style={S.inp} value={rPhone} onChange={e=>setRPhone(e.target.value)} onKeyDown={e=>e.key==="Enter"&&recall()} placeholder="Phone number"/><button style={S.btnS} onClick={recall}>Recall</button></div>
          {rmsg&&<p style={{fontWeight:700,fontSize:13,color:rmsg.startsWith("✓")?"#166534":"#1e40af",marginBottom:8}}>{rmsg}</p>}
          <L>Name *</L><input style={S.inp} value={rName} onChange={e=>setRName(e.target.value)} placeholder="Full name"/>
          <L>Number of People</L><input style={S.inp} type="number" min="1" value={rPpl} onChange={e=>setRPpl(e.target.value)}/>
          <L>Note</L><textarea style={S.ta} value={rNote} onChange={e=>setRNote(e.target.value)} rows={2}/>
          <button style={S.btnP} onClick={register}>Register & Give Queue Number</button>
          <HR/><h3 style={{margin:"0 0 8px",fontSize:13,fontWeight:800,color:"#6b4c11"}}>Quick Daily Expense</h3>
          <input style={S.inp} value={deItem} onChange={e=>setDeItem(e.target.value)} placeholder="Item name"/>
          <div style={S.r2}><input style={S.inp} type="number" value={deQty} onChange={e=>setDeQty(e.target.value)} placeholder="Qty"/><input style={S.inp} type="number" value={deUnit} onChange={e=>setDeUnit(e.target.value)} placeholder="Unit price"/></div>
          <button style={S.btnS} onClick={addDE}>Save Expense</button>
        </section>
        <section style={S.card}><h2 style={S.ct}>Today's Queue</h2><p style={S.hlp}>{new Date().toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"long"})}</p>
          {todayV.length===0&&<EMP>No customers registered yet today.</EMP>}
          {todayV.map((v,idx)=>{
            const activeAhead=todayV.slice(0,idx).filter(x=>!["Paid & Closed","Cancelled"].includes(x.status)).length;
            const isInProgress=v.status==="In Service"||v.services.some(l=>l.status==="In Progress");
            const isWaiting=v.status==="Waiting for Supervisor"||v.status==="In Service"&&v.services.every(l=>l.status==="Waiting"||l.status==="Completed"||l.status==="Cancelled");
            const isDone=["Paid & Closed","Cancelled"].includes(v.status);
            return <div key={v.id} style={{...S.li,borderLeft:"4px solid "+(isDone?"#d1d5db":isInProgress?"#1e40af":"#e0b85a"),background:isDone?"#f9fafb":isInProgress?"#eff6ff":"#fffaf2"}}>
              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",marginBottom:4}}>
                  <b style={{fontSize:15,color:"#111827"}}>#{v.queue} — {v.name}</b>
                  {isInProgress&&<span style={{background:"#1e40af",color:"#fff",borderRadius:8,padding:"2px 10px",fontSize:11,fontWeight:800}}>🔄 In Progress</span>}
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
                {v.status==="Waiting for Supervisor"&&v.services.length===0&&<button style={S.btnD} onClick={()=>cancelV(v.id)}>Cancel</button>}
              </div>
            </div>;
          })}
        </section>
      </main>}

      {tab==="Supervisor"&&<main style={{display:"grid",gridTemplateColumns:gc,gap:14}}>
        <section style={S.card}><h2 style={S.ct}>Queue Overview</h2>
          <h3 style={S.sh}>⏳ Waiting</h3>
          {visits.filter(v=>v.status==="Waiting for Supervisor"&&v.date===todayStr()).length===0?<p style={S.hlp}>No one waiting.</p>
            :visits.filter(v=>v.status==="Waiting for Supervisor"&&v.date===todayStr()).map((v,i,arr)=>{
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
              const active=rows.filter(r=>!["On Hold"].includes(r.line.status));
              const onHold=rows.filter(r=>r.line.status==="On Hold");
              return(<div key={svc.id} style={{background:"#fefaf0",border:"1px solid #ecdba3",borderRadius:12,padding:10,marginBottom:8}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                  <b style={{fontSize:13}}>{svc.name}</b>
                  <span style={{...S.hlp}}>{active.length} active{onHold.length>0?" · "+onHold.length+" on hold":""}</span>
                </div>
                {active.map(({visit:vv,line})=><button key={line.lineId} style={actId===vv.id?S.liA:S.liB} onClick={()=>setActId(vv.id)}>
                  <span><b>#{vv.queue}</b> {vv.name}</span><span style={SB(line.status)}>{line.status}</span>
                </button>)}
                {onHold.length>0&&<div style={{marginTop:6,paddingTop:6,borderTop:"1px dashed #ecdba3"}}>
                  <p style={{...S.hlp,marginBottom:4,fontWeight:700}}>⏸ On Hold (finishing another service)</p>
                  {onHold.map(({visit:vv,line})=><div key={line.lineId} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"4px 8px",background:"#f3e8ff",borderRadius:8,marginBottom:3}}>
                    <span style={{fontSize:12,color:"#6b21a8"}}><b>#{vv.queue}</b> {vv.name} — waiting to finish current service</span>
                    <span style={SB("On Hold")}>On Hold</span>
                  </div>)}
                </div>}
              </div>);})}
        </section>
        <section style={S.card}>
          {!act?<EMP>← Select a customer to assign services.</EMP>:<>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:12,flexWrap:"wrap",gap:8}}>
              <div><h2 style={{...S.ct,marginBottom:2}}>#{act.queue} — {act.name}</h2><p style={S.hlp}>{act.groupName||"Individual"} · {act.status}</p></div>
              {act.status==="Ready for Payment"&&<span style={{background:"#dcfce7",color:"#166534",borderRadius:10,padding:"6px 14px",fontWeight:800,fontSize:13}}>✓ Ready</span>}
            </div>
            {act.status==="Ready for Payment"&&<div style={{background:"#fef9ec",border:"1px solid #e0b85a",borderRadius:11,padding:12,marginBottom:10,fontSize:13}}>Ready for checkout.<button style={{...S.btnS,marginTop:8,width:"auto",padding:"7px 14px"}} onClick={reopen}>Reopen</button></div>}
            {!["Paid & Closed","Ready for Payment"].includes(act.status)&&<>
              <div style={S.r2}><select style={S.inp} value={svCat} onChange={e=>{setSvCat(e.target.value);setSvSub("All");setSvSvcId("");}}>{cats.map(c=><option key={c}>{c}</option>)}</select><select style={S.inp} value={svSub} onChange={e=>{setSvSub(e.target.value);setSvSvcId("");}}>{svSubs.map(x=><option key={x}>{x}</option>)}</select></div>
              <select style={S.inp} value={svSvcId} onChange={e=>setSvSvcId(e.target.value)}><option value="">Select a service...</option>{svAvail.map(s=><option key={s.id} value={String(s.id)}>{s.name} — {money(s.price)}</option>)}</select>
              <button style={S.btnS} onClick={addSvc}>+ Add Service</button>
              {act.services.some(l=>l.status==="On Hold")&&<div style={{background:"#f3e8ff",border:"1px solid #c084fc",borderRadius:10,padding:"8px 12px",fontSize:12,color:"#6b21a8",fontWeight:600}}>⏸ Some services are On Hold — they will auto-activate when the current service is completed and this customer gets priority.</div>}
            </>}
            <SLines visit={act} emps={emps} mode="supervisor" onUpd={(l,f,v)=>updLine(act.id,l,f,v)} onRem={l=>remLine(act.id,l)}/>
            {!["Paid & Closed","Ready for Payment"].includes(act.status)&&<button style={S.btnP} onClick={markReady}>✓ Mark Ready for Payment</button>}
          </>}
        </section>
      </main>}

      {tab==="Checkout"&&<main style={{display:"grid",gridTemplateColumns:gc,gap:14}}>
        <section style={S.card}><h2 style={S.ct}>Checkout — Today</h2>
          <input style={S.inp} placeholder="Search by queue #, name or phone..." value={coQ} onChange={e=>setCoQ(e.target.value)}/>
          {coList.length===0&&<EMP>No active customers today.</EMP>}
          {coList.map(v=><button key={v.id} style={actId===v.id?S.liA:S.liB} onClick={()=>setActId(v.id)}><span>#{v.queue} — {v.name}</span><span style={SB(v.status)}>{v.status==="Ready for Payment"?"Ready — "+money(v.totalService):v.status}</span></button>)}
        </section>
        <section style={S.card}>
          {!act?<EMP>← Select customer to process payment.</EMP>
           :act.status==="Paid & Closed"?<div style={{background:"#dcfce7",color:"#166634",borderRadius:11,padding:16,fontSize:15,fontWeight:700}}>✓ Paid — {money(act.totalPaid)} via {act.paymentMethod}</div>
           :<><h2 style={S.ct}>#{act.queue} — {act.name}</h2>
            <SLines visit={act} emps={emps} mode="checkout" onUpd={(l,f,v)=>updLine(act.id,l,f,v)} onRem={l=>remLine(act.id,l)}/>
            <HR/><h3 style={{margin:"0 0 4px",fontWeight:800}}>Tips</h3><p style={S.hlp}>Tips go directly to employees, not counted as revenue.</p>
            <div style={S.r2}><select style={S.inp} value={tipEmp} onChange={e=>setTipEmp(e.target.value)}><option value="">Select employee</option>{emps.filter(e=>e.active).map(e=><option key={e.id}>{e.name}</option>)}</select><input style={S.inp} type="number" value={tipAmt} onChange={e=>setTipAmt(e.target.value)} placeholder="Amount (Birr)"/></div>
            <button style={S.btnS} onClick={addTip}>+ Add Tip</button>
            {tips.map(t=><div key={t.id} style={S.li}><span>{t.employee}</span><span style={{display:"flex",gap:8,alignItems:"center"}}><b>{money(t.amount)}</b><button style={S.btnD} onClick={()=>setTips(p=>p.filter(x=>x.id!==t.id))}>×</button></span></div>)}
            <HR/><L>Payment Method</L>
            <select style={S.inp} value={payM} onChange={e=>setPayM(e.target.value)}><option>Cash</option><option>Transfer</option><option>Telebirr</option><option>Card</option></select>
            <div style={S.tb}><span>Service Total</span><b>{money(act.totalService)}</b></div>
            {tips.length>0&&<div style={{...S.tb,background:"#1e3a2f",marginTop:6}}><span>Tips Total</span><b>{money(tips.reduce((s,t)=>s+t.amount,0))}</b></div>}
            <div style={{...S.tb,marginTop:6,fontSize:16,background:"#0f172a"}}><span>Customer Pays</span><b>{money(act.totalService+tips.reduce((s,t)=>s+t.amount,0))}</b></div>
            {act.groupName&&<button style={{...S.btnS,marginTop:10}} onClick={()=>confirmPay(true)}>Confirm Paid — Whole Group</button>}
            <button style={S.btnP} onClick={()=>confirmPay(false)}>✓ Confirm Paid & Close</button>
          </>}
        </section>
      </main>}

      {tab==="Bookings"&&<section style={S.card}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",flexWrap:"wrap",gap:10,marginBottom:14}}>
          <h2 style={{...S.ct,margin:0}}>Booking Management</h2>
          <div style={{display:"flex",gap:8,alignItems:"flex-end",flexWrap:"wrap"}}>
            <EthPicker value={bkDate} onChange={setBkDate}/>
            {user.role!=="supervisor"&&<>
              <button style={{...S.btnP,width:"auto",padding:"10px 16px",marginBottom:0,background:"#0f766e",color:"#fff"}} onClick={()=>{setShowWalkIn(true);setWiSvcId("");setWiName("");setWiPhone("");setWiNote("");}}>🚶 Spa Walk-in</button>
              <button style={{...S.btnP,width:"auto",padding:"10px 16px",marginBottom:0}} onClick={()=>{setShowBkF(true);setEditBk(null);setBkF({customerName:"",customerPhone:"",serviceId:"",date:bkDate,time:"10:00",people:1,notes:""});setBkWarn("");}}>+ New Booking</button>
            </>}
          </div>
        </div>

        {showWalkIn&&user.role!=="supervisor"&&<div style={{background:"#f0fdfa",border:"1px solid #0f766e",borderRadius:16,padding:18,marginBottom:16}}>
          <h3 style={{margin:"0 0 12px",fontWeight:800,color:"#0f766e"}}>🚶 Spa Walk-in — Add to Queue Now</h3>
          <div style={{display:"grid",gridTemplateColumns:sc.mob?"1fr":"1fr 1fr",gap:10}}>
            <div><L>Customer Name *</L><input style={S.inp} value={wiName} onChange={e=>setWiName(e.target.value)} placeholder="Full name"/></div>
            <div><L>Phone *</L><div style={S.r2}><input style={S.inp} value={wiPhone} onChange={e=>setWiPhone(e.target.value)} placeholder="Phone"/><button style={S.btnS} onClick={()=>{const f=custs.find(c=>c.phone===wiPhone.trim());if(f)setWiName(f.name);}}>Recall</button></div></div>
            <div style={{gridColumn:"1/-1"}}><L>Spa Service *</L>
              <select style={{...S.inp,background:wiSvcId?"#fffdf7":"#f0fdfa"}} value={wiSvcId} onChange={e=>setWiSvcId(e.target.value)}>
                <option value="">— Select spa service —</option>
                {["Moroccan Bath","Steam & Sauna","Massage"].map(sub=>{const items=bkSvcs.filter(s=>s.sub===sub);if(!items.length)return null;return <optgroup key={sub} label={"── "+sub+" ──"}>{items.map(s=><option key={s.id} value={String(s.id)}>{s.name} — {money(s.price)}</option>)}</optgroup>;})}
              </select>
            </div>
            <div style={{gridColumn:"1/-1"}}><L>Note</L><input style={S.inp} value={wiNote} onChange={e=>setWiNote(e.target.value)} placeholder="Any special requests"/></div>
          </div>
          <div style={S.r2}><button style={{...S.btnP,background:"#0f766e",color:"#fff"}} onClick={addSpaWalkIn}>Add to Queue</button><button style={S.btnS} onClick={()=>setShowWalkIn(false)}>Cancel</button></div>
        </div>}

        {showBkF&&user.role!=="supervisor"&&<div style={{background:"#fffaf2",border:"1px solid #e0b85a",borderRadius:16,padding:18,marginBottom:16}}>
          <h3 style={{margin:"0 0 12px",fontWeight:800}}>{editBk?"Edit":"New"} Booking</h3>
          {bkWarn&&<div style={{background:"#fef3c7",color:"#92400e",borderRadius:10,padding:"10px 14px",marginBottom:10,fontSize:13,fontWeight:700}}>{bkWarn}</div>}
          <div style={{display:"grid",gridTemplateColumns:sc.mob?"1fr":"1fr 1fr",gap:10}}>
            <div><L>Customer Name *</L><input style={S.inp} value={bkF.customerName} onChange={e=>setBkF(p=>({...p,customerName:e.target.value}))} placeholder="Full name"/></div>
            <div><L>Phone *</L><div style={S.r2}><input style={S.inp} value={bkF.customerPhone} onChange={e=>setBkF(p=>({...p,customerPhone:e.target.value}))} placeholder="Phone"/><button style={S.btnS} onClick={()=>{const f=custs.find(c=>c.phone===bkF.customerPhone.trim());if(f)setBkF(p=>({...p,customerName:f.name}));}}>Recall</button></div></div>
            <div style={{gridColumn:"1/-1"}}>
              <L>Service * (Spa services only)</L>
              <select style={{...S.inp,background:bkF.serviceId?"#fffdf7":"#fff9f0",borderColor:bkF.serviceId?"#c7b06a":"#e0b85a"}}
                value={String(bkF.serviceId||"")}
                onChange={e=>{const sid=e.target.value;setBkF(p=>({...p,serviceId:sid}));if(sid){const warn=checkConflict(bks,{...bkF,serviceId:sid},svcs);setBkWarn(warn||"");}else setBkWarn("");}}>
                <option value="">— Select a spa service —</option>
                {["Moroccan Bath","Steam & Sauna","Massage"].map(sub=>{const items=bkSvcs.filter(s=>s.sub===sub);if(!items.length)return null;return <optgroup key={sub} label={"── "+sub+" ──"}>{items.map(s=><option key={s.id} value={String(s.id)}>{s.name} — {money(s.price)} ({s.durationMins}min)</option>)}</optgroup>;})}
              </select>
            </div>
            <div><EthPicker label="Date *" value={bkF.date} onChange={d=>setBkF(p=>({...p,date:d}))}/></div>
            <div><L>Time * (Ethiopian: {toEthTime(bkF.time)})</L><select style={S.inp} value={bkF.time} onChange={e=>setBkF(p=>({...p,time:e.target.value}))}>{timeSlots().map(t=><option key={t} value={t}>{t} ({toEthTime(t)})</option>)}</select></div>
            <div><L>Number of People</L><input style={S.inp} type="number" min="1" value={bkF.people} onChange={e=>setBkF(p=>({...p,people:e.target.value}))}/></div>
            <div><L>Notes</L><textarea style={S.ta} value={bkF.notes} onChange={e=>setBkF(p=>({...p,notes:e.target.value}))} rows={2}/></div>
          </div>
          <div style={S.r2}><button style={S.btnP} onClick={saveBk}>Save Booking</button><button style={S.btnS} onClick={()=>{setShowBkF(false);setEditBk(null);setBkWarn("");}}>Cancel</button></div>
        </div>}

        <h3 style={S.sh}>📅 {bkDate} — Time Slot View</h3>
        <div style={{display:"grid",gridTemplateColumns:"80px 1fr",gap:0,border:"1px solid #ecdba3",borderRadius:12,overflow:"hidden",marginBottom:16}}>
          {timeSlots().map(slot=>{
            const slotBks=todayBk.filter(b=>b.time===slot&&!["Cancelled","No-show"].includes(b.status));
            const isEmpty=slotBks.length===0;
            return <React.Fragment key={slot}>
              <div style={{padding:"10px 8px",background:"#f9f5eb",borderBottom:"1px solid #ecdba3",fontSize:12,fontWeight:700,color:"#6b4c11",textAlign:"center"}}>
                <div>{slot}</div>
                <div style={{fontSize:10,fontWeight:400,color:"#92400e"}}>{toEthTime(slot)}</div>
              </div>
              <div style={{padding:"8px 10px",borderBottom:"1px solid #ecdba3",background:isEmpty?"#fffdf7":"#fff",minHeight:44}}>
                {isEmpty?<span style={{color:"#d1d5db",fontSize:12}}>Available</span>
                :slotBks.map(b=>{const c=BKC[b.status]||{bg:"#f3f4f6",co:"#374151"};return(
                  <div key={b.id} style={{background:c.bg,borderRadius:8,padding:"6px 10px",marginBottom:4,display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:6}}>
                    <div>
                      <span style={{background:c.co,color:"#fff",borderRadius:6,padding:"1px 7px",fontSize:10,fontWeight:800,marginRight:6}}>{b.status}</span>
                      <b style={{fontSize:13,color:"#111827"}}>{b.customerName}</b>
                      <span style={{fontSize:11,color:"#374151",marginLeft:6}}>{b.serviceName}</span>
                      {b.notes&&<span style={{fontSize:10,color:"#6b7280",marginLeft:6,fontStyle:"italic"}}>"{b.notes}"</span>}
                      <div style={{fontSize:10,color:"#6b7280",marginTop:2}}>{b.durationMins}min · {b.people} person{b.people>1?"s":""} · by {b.createdBy}</div>
                    </div>
                    {user.role!=="supervisor"&&<div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                      {b.status==="Pending"&&<button style={{...S.btnS,width:"auto",padding:"3px 8px",marginBottom:0,fontSize:11}} onClick={()=>updBk(b.id,"Confirmed")}>Confirm</button>}
                      {b.status==="Confirmed"&&<button style={{...S.btnP,width:"auto",padding:"3px 8px",marginBottom:0,fontSize:11}} onClick={()=>checkIn(b)}>Check In</button>}
                      {!["Completed","Cancelled","No-show","Arrived"].includes(b.status)&&<button style={{...S.btnS,width:"auto",padding:"3px 8px",marginBottom:0,fontSize:11}} onClick={()=>{setEditBk(b);setShowBkF(true);setBkF({customerName:b.customerName,customerPhone:b.customerPhone,serviceId:String(b.serviceId),date:b.date,time:b.time,people:b.people,notes:b.notes});}}>Edit</button>}
                      {!["Completed","Cancelled"].includes(b.status)&&<button style={{...S.btnD,padding:"3px 8px",fontSize:10}} onClick={()=>updBk(b.id,"Cancelled")}>Cancel</button>}
                    </div>}
                    {b.status==="Arrived"&&<span style={{color:"#166534",fontWeight:700,fontSize:11}}>✓ In</span>}
                  </div>
                );})}
              </div>
            </React.Fragment>;
          })}
        </div>

        <HR/><h3 style={S.sh}>Upcoming 7 Days</h3>
        {bks.filter(b=>b.date>todayStr()&&b.date<=new Date(Date.now()+7*86400000).toISOString().slice(0,10)&&!["Cancelled","No-show","Completed"].includes(b.status)).sort((a,b)=>a.date.localeCompare(b.date)||a.time.localeCompare(b.time)).map(b=><div key={b.id} style={S.li}><div><b style={{color:"#111827"}}>{b.date} at {b.time} ({toEthTime(b.time)})</b><p style={{...S.hlp,color:"#374151"}}>{b.customerName} · {b.serviceName}</p></div><span style={SB(b.status)}>{b.status}</span></div>)}
      </section>}


      {tab==="Service Setup"&&<section style={S.card}><h2 style={S.ct}>Service & Price Management</h2>
        <div style={{display:"grid",gridTemplateColumns:sc.mob?"1fr":"1fr 1fr",gap:20,marginBottom:16}}>
          <div><h3 style={S.sh}>Categories</h3><div style={S.r2}><input style={S.inp} value={newCat} onChange={e=>setNewCat(e.target.value)} placeholder="New category" onKeyDown={e=>e.key==="Enter"&&addCat()}/><button style={S.btnS} onClick={addCat}>+ Add</button></div><div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{cats.map(c=><span key={c} style={{background:"#f5e7c0",color:"#6b4c11",borderRadius:14,padding:"2px 10px",fontSize:11,fontWeight:700}}>{c}</span>)}</div></div>
          <div><h3 style={S.sh}>Add New Service</h3>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              <select style={S.inp} value={nSvc.category} onChange={e=>setNSvc({...nSvc,category:e.target.value,employeeSection:e.target.value})}>{cats.map(c=><option key={c}>{c}</option>)}</select>
              <input style={S.inp} value={nSvc.sub} onChange={e=>setNSvc({...nSvc,sub:e.target.value})} placeholder="Sub-category"/>
              <input style={{...S.inp,gridColumn:"1/-1"}} value={nSvc.name} onChange={e=>setNSvc({...nSvc,name:e.target.value})} placeholder="Service name"/>
              <input style={S.inp} type="number" value={nSvc.price} onChange={e=>setNSvc({...nSvc,price:e.target.value})} placeholder="Price (Birr)"/>
              <input style={S.inp} type="number" value={nSvc.commission} onChange={e=>setNSvc({...nSvc,commission:e.target.value})} placeholder="Commission %"/>
              <input style={S.inp} type="number" value={nSvc.durationMins} onChange={e=>setNSvc({...nSvc,durationMins:e.target.value})} placeholder="Duration (min)"/>
              <label style={{display:"flex",alignItems:"center",gap:6,fontSize:12}}><input type="checkbox" checked={nSvc.bookable} onChange={e=>setNSvc({...nSvc,bookable:e.target.checked})}/> Bookable (Spa)</label>
              <button style={{...S.btnP,gridColumn:"1/-1"}} onClick={addSvc2}>+ Add Service</button>
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
                <div style={{display:"grid",gridTemplateColumns:"1fr 85px 55px 65px 50px 32px",gap:4,padding:"4px 8px",background:"#f5e7c0",borderRadius:8,marginBottom:4,fontSize:10,fontWeight:800,color:"#6b4c11",minWidth:480}}><span>Name</span><span>Price</span><span>Cm%</span><span>Min</span><span>Book</span><span></span></div>
                {catSvcs.filter(s=>s.sub===sub).map(s=><div key={s.id} style={{display:"grid",gridTemplateColumns:"1fr 85px 55px 65px 50px 32px",gap:4,padding:"4px 8px",background:"#fffaf2",borderRadius:8,marginBottom:3,alignItems:"center",border:"1px solid #ecdba3",minWidth:480}}>
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
        <button style={S.btnP} onClick={addGE}>Save Expense</button><HR/>
        <div style={S.tb}><span>All-Time Total</span><b>{money(exps.filter(e=>e.type==="General").reduce((s,e)=>s+Number(e.total||0),0))}</b></div><HR/>
        {exps.filter(e=>e.type==="General").sort((a,b)=>b.date.localeCompare(a.date)).map(e=><div key={e.id} style={S.li}><div><b>{e.name}</b>{e.reason&&<p style={S.hlp}>{e.reason}</p>}<p style={{...S.hlp,fontSize:10}}>{e.date}</p></div><span style={{display:"flex",alignItems:"center",gap:8}}><b>{money(e.total)}</b><button style={S.btnD} onClick={()=>delE(e.id)}>×</button></span></div>)}
      </section>}

      {tab==="Customers"&&<section style={S.card}><h2 style={S.ct}>Customer Database ({custs.length})</h2>
        <input style={S.inp} placeholder="Search by name, phone or ID..." value={cSearch} onChange={e=>setCSearch(e.target.value)}/>
        {fCusts.map(c=>{const cv=visits.filter(v=>v.customerId===c.id&&v.status==="Paid & Closed");const cbks=bks.filter(b=>b.customerId===c.id);const all=cv.flatMap(v=>v.services.map(s=>s.name));const fav=all.length?all.sort((a,b)=>all.filter(x=>x===b).length-all.filter(x=>x===a).length)[0]:"None";const spent=cv.reduce((s,v)=>s+Number(v.totalService||0),0);return <div key={c.id} style={S.li}><div><b style={{fontSize:15}}>{c.name}</b><p style={S.hlp}>{c.phone} · {c.id}</p><p style={S.hlp}>Favourite: {fav} · {cbks.length} bookings · {cv.length} visits · {money(spent)}</p></div><button style={S.btnD} onClick={()=>delCust(c.id)}>Delete</button></div>;})}
      </section>}

      {tab==="Payroll"&&<section style={S.card}><h2 style={S.ct}>Payroll Management</h2>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10,marginBottom:12}}>
          <div><p style={{...S.hlp,margin:0}}>Current pay period</p><b style={{fontSize:15}}>{period.label}</b></div>
          <div style={{display:"flex",gap:8}}><button style={S.btnS} onClick={()=>window.print()}>Print</button><button style={{...S.btnP,width:"auto",padding:"10px 18px"}} onClick={closePeriod}>Close & Pay Period</button></div>
        </div>
        <div style={{background:"#fef9ec",border:"1px solid #e0b85a",borderRadius:11,padding:12,marginBottom:14,fontSize:13}}>Commissions update live. Close & Pay to freeze and reset for next period.</div>
        <h3 style={S.sh}>Add Employee</h3>
        <div style={{display:"grid",gridTemplateColumns:sc.mob?"1fr":"1.5fr 1fr 1fr 1fr auto",gap:8,marginBottom:16}}>
          <input style={S.inp} value={nEmp.name} onChange={e=>setNEmp({...nEmp,name:e.target.value})} placeholder="Full name"/>
          <select style={S.inp} value={nEmp.section} onChange={e=>setNEmp({...nEmp,section:e.target.value})}>{cats.map(c=><option key={c}>{c}</option>)}</select>
          <input style={S.inp} type="number" value={nEmp.salary} onChange={e=>setNEmp({...nEmp,salary:e.target.value})} placeholder="Base salary"/>
          <input style={S.inp} type="date" value={nEmp.hireDate} onChange={e=>setNEmp({...nEmp,hireDate:e.target.value})}/>
          <button style={{...S.btnP,width:"auto",padding:"0 18px"}} onClick={addEmp}>+ Add</button>
        </div>
        <label style={{display:"flex",alignItems:"center",gap:6,fontSize:12,cursor:"pointer",marginBottom:10}}><input type="checkbox" checked={showFired} onChange={e=>setShowFired(e.target.checked)}/> Show inactive</label>
        {emps.filter(e=>showFired||e.active).map(emp=>{const extra=empC.find(e=>e.id===emp.id);const d=Number(emp.salary||0)/30;const ad=d*Number(emp.absentDays||0);const net=Number(emp.salary||0)+Number(extra?.commissionTotal||0)-Number(emp.loan||0)-Number(emp.brokerFee||0)-Number(emp.otherDeduction||0)-ad;return(<div key={emp.id} style={{background:"#fffaf2",border:"1px solid #ecdba3",borderRadius:14,padding:14,marginBottom:10,opacity:emp.active?1:0.6}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10,flexWrap:"wrap",gap:8}}>
            <div><b style={{fontSize:15}}>{emp.name}</b><span style={{background:"#f5e7c0",color:"#6b4c11",borderRadius:14,padding:"2px 10px",fontSize:11,fontWeight:700,marginLeft:8}}>{emp.section}</span></div>
            <button style={emp.active?S.btnD:S.btnS} onClick={()=>setEmpAct(emp.id,!emp.active)}>{emp.active?"Deactivate":"Reactivate"}</button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:sc.mob?"1fr 1fr":"repeat(6,1fr)",gap:8,marginBottom:8}}>
            <FI label="Base Salary"     value={emp.salary}         onChange={v=>updEmp(emp.id,"salary",v)}         type="number"/>
            <FI label="Absent Days"     value={emp.absentDays}     onChange={v=>updEmp(emp.id,"absentDays",v)}     type="number"/>
            <FI label="Loan"            value={emp.loan}           onChange={v=>updEmp(emp.id,"loan",v)}           type="number" note={emp.loanNote}  onNote={v=>updEmp(emp.id,"loanNote",v)}/>
            <FI label="Broker Fee"      value={emp.brokerFee}      onChange={v=>updEmp(emp.id,"brokerFee",v)}      type="number"/>
            <FI label="Other Deduction" value={emp.otherDeduction} onChange={v=>updEmp(emp.id,"otherDeduction",v)} type="number" note={emp.otherNote} onNote={v=>updEmp(emp.id,"otherNote",v)}/>
            <div style={{background:"#fffdf5",borderRadius:10,padding:10,border:"1px solid #e0b85a"}}><p style={{...S.hlp,marginBottom:4}}>Commission</p><b style={{color:"#166534",fontSize:14}}>{money(extra?.commissionTotal||0)}</b></div>
          </div>
          {extra?.breakdown?.length>0&&<details style={{marginBottom:8}}><summary style={{...S.hlp,cursor:"pointer",fontWeight:700}}>Breakdown ({extra.breakdown.length})</summary><div style={{paddingLeft:10,paddingTop:4}}>{extra.breakdown.map((b,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",fontSize:12,borderBottom:"1px solid #ecdba3",padding:"2px 0"}}><span>{b.name}</span><span>{money(b.income)} → {money(b.commission)}</span></div>)}</div></details>}
          <div style={{...S.tb,padding:"10px 16px"}}><span>Net Pay</span><b style={{fontSize:16}}>{money(Math.max(0,Math.round(net)))}</b></div>
        </div>);})}
        {periods.length>0&&<><HR/><h3 style={S.sh}>Closed Periods</h3>{periods.slice().reverse().map((cp,i)=><details key={i} style={{...S.li,display:"block",marginBottom:8}}><summary style={{cursor:"pointer",fontWeight:700}}>{cp.period}</summary><div style={{paddingTop:8}}>{cp.employees?.map(e=>{const dd=Number(e.salary||0)/30;const ad=dd*Number(e.absentDays||0);const n=Number(e.salary||0)+Number(e.commissionTotal||0)-Number(e.loan||0)-Number(e.brokerFee||0)-Number(e.otherDeduction||0)-ad;return<div key={e.id} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",borderBottom:"1px solid #ecdba3",fontSize:13}}><span><b>{e.name}</b> ({e.section})</span><b>{money(Math.max(0,Math.round(n)))}</b></div>;})}</div></details>)}</>}
        <div className="print-only" style={{display:"none"}}><PS emps={emps} empC={empC} period={period}/></div>
      </section>}

      {tab==="Dashboard"&&<section style={S.card}><h2 style={S.ct}>Manager Dashboard</h2>
        <div style={{display:"grid",gridTemplateColumns:sc.mob?"1fr 1fr":"repeat(4,1fr)",gap:10,marginBottom:14}}>
          <SC label="Total Visits"     value={visits.length}/><SC label="Customers"        value={custs.length}/><SC label="Active Employees" value={emps.filter(e=>e.active).length}/><SC label="Revenue Today" value={money(todayV.filter(v=>v.status==="Paid & Closed").reduce((s,v)=>s+Number(v.totalService||0),0))} highlight/>
          <SC label="Bookings Today"   value={bks.filter(b=>b.date===todayStr()).length}/><SC label="Pending Bookings" value={bks.filter(b=>b.status==="Pending").length} accent/><SC label="General Expenses" value={money(exps.filter(e=>e.type==="General").reduce((s,e)=>s+Number(e.total||0),0))} accent/><SC label="Services Listed" value={svcs.length}/>
        </div>
        <HR/>
        <div style={{background:"#fffaf2",border:"1px solid #e0b85a",borderRadius:14,padding:14,marginBottom:14}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8,flexWrap:"wrap",gap:8}}>
            <h3 style={{margin:0,fontSize:13,fontWeight:800,color:"#6b4c11"}}>Daily Revenue Target</h3>
            <div style={{display:"flex",gap:6,alignItems:"center"}}>
              <input type="number" value={dailyTarget||""} onChange={e=>{const v=Number(e.target.value)||0;setDailyTarget(v);try{localStorage.setItem("ambar_target",v);}catch(e){}}} placeholder="Set target (Birr)" style={{...S.ii,width:160}}/>
            </div>
          </div>
          {dailyTarget>0&&(()=>{const rev=todayV.filter(v=>v.status==="Paid & Closed").reduce((s,v)=>s+Number(v.totalService||0),0);const pct=Math.min(100,Math.round((rev/dailyTarget)*100));const col=pct>=100?"#166534":pct>=60?"#92400e":"#991b1b";return(<><div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:4}}><span style={{color:col,fontWeight:700}}>{pct}% of target reached</span><span style={{color:"#374151"}}>{money(rev)} / {money(dailyTarget)}</span></div><div style={{background:"#e5e7eb",borderRadius:8,height:14,overflow:"hidden"}}><div style={{background:pct>=100?"#166534":pct>=60?"#e0b85a":"#ef4444",height:"100%",width:pct+"%",borderRadius:8,transition:"width 0.5s"}}/></div>{pct>=100&&<p style={{color:"#166534",fontWeight:800,fontSize:13,margin:"6px 0 0"}}>🎉 Target reached!</p>}</>);})()}
        </div>
        <HR/><h3 style={S.sh}>Commission This Period — {period.label}</h3>
        {empC.filter(e=>e.active).map(emp=><div key={emp.id} style={S.li}><span>{emp.name} ({emp.section})</span><b style={{color:"#166534"}}>{money(emp.commissionTotal)}</b></div>)}
        <HR/><h3 style={S.sh}>Revenue by Category</h3>
        {cats.map(cat=>{const ids=svcs.filter(s=>s.category===cat).map(s=>s.id);const rev=visits.filter(v=>v.status==="Paid & Closed").flatMap(v=>v.services).filter(l=>ids.includes(l.serviceId)).reduce((s,l)=>s+lineIncome(l),0);return<div key={cat} style={S.li}><span>{cat}</span><b>{money(rev)}</b></div>;})}
      </section>}

      {tab==="Staff"&&<section style={S.card}><h2 style={S.ct}>Staff & Password Management</h2>
        <p style={S.hlp}>Reception: Reception + Checkout + Bookings. Supervisor: Supervisor + Bookings. Manager: All.</p><HR/>
        <div style={{background:"#fffaf2",border:"1px solid #e0b85a",borderRadius:14,padding:16,marginBottom:16}}>
          <h3 style={{margin:"0 0 14px",fontWeight:800,fontSize:15}}>{editStaff?"Edit: "+editStaff.id:"Add / Update Staff Account"}</h3>
          <div style={{display:"grid",gridTemplateColumns:sc.mob?"1fr":"1fr 1fr 1fr 1fr",gap:10,marginBottom:12}}>
            <div><L>Username</L><input style={{...S.inp,background:editStaff?"#f3f4f6":"#fffdf7"}} value={nStaff.id} onChange={e=>setNStaff(p=>({...p,id:e.target.value}))} placeholder="e.g. reception1" disabled={!!editStaff}/></div>
            <div><L>Display Name</L><input style={S.inp} value={nStaff.name} onChange={e=>setNStaff(p=>({...p,name:e.target.value}))} placeholder="Full name"/></div>
            <div><L>Role</L><select style={S.inp} value={nStaff.role} onChange={e=>setNStaff(p=>({...p,role:e.target.value}))}><option value="reception">Reception</option><option value="supervisor">Supervisor</option><option value="manager">Manager</option></select></div>
            <div><L>{editStaff?"New Password":"Password"}</L><input style={S.inp} type="password" value={nStaff.password} onChange={e=>setNStaff(p=>({...p,password:e.target.value}))} placeholder={editStaff?"Enter new password":"Password"}/></div>
          </div>
          <div style={S.r2}><button style={S.btnP} onClick={saveStaff}>{editStaff?"Update Account":"Save Account"}</button>{editStaff&&<button style={S.btnS} onClick={()=>{setEditStaff(null);setNStaff({id:"",name:"",role:"reception",password:""});}}>Cancel</button>}</div>
        </div>
        <h3 style={S.sh}>All Staff ({staff.length})</h3>
        {staff.map(s=><div key={s.id} style={{...S.li,flexWrap:"wrap",gap:10,opacity:s.active?1:0.6}}>
          <div><b style={{fontSize:15}}>{s.name}</b><span style={{background:s.role==="manager"?"#334155":s.role==="supervisor"?"#1e40af":"#f5e7c0",color:s.role==="manager"?"#e0b85a":s.role==="supervisor"?"#fff":"#6b4c11",borderRadius:14,padding:"2px 10px",fontSize:11,fontWeight:700,marginLeft:8}}>{s.role}</span>{!s.active&&<span style={{background:"#fee2e2",color:"#991b1b",borderRadius:14,padding:"2px 10px",fontSize:11,fontWeight:700,marginLeft:6}}>INACTIVE</span>}<p style={S.hlp}>Username: <b>{s.id}</b></p></div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center"}}><button style={S.btnS} onClick={()=>{setEditStaff(s);setNStaff({id:s.id,name:s.name,role:s.role,password:""});}}>Edit / Reset PW</button><button style={s.active?S.btnD:S.btnS} onClick={()=>setStaffAct(s.id,!s.active)}>{s.active?"Deactivate":"Reactivate"}</button></div>
        </div>)}
      </section>}

      {tab==="Activity Log"&&<section style={S.card}><h2 style={S.ct}>Activity Log</h2><p style={{...S.hlp,color:"#374151"}}>Last 100 actions across all staff.</p><HR/>
        {actLog.length===0&&<EMP>No activity recorded yet.</EMP>}
        {actLog.map((a,i)=><div key={i} style={S.li}><div><b style={{color:"#111827"}}>{a.action}</b>{a.detail&&<p style={{...S.hlp,color:"#374151"}}>{a.detail}</p>}</div><div style={{textAlign:"right",flexShrink:0}}><span style={{background:"#f5e7c0",color:"#6b4c11",borderRadius:8,padding:"2px 8px",fontSize:11,fontWeight:700}}>{a.staff_name}</span><p style={{...S.hlp,fontSize:10,marginTop:4,color:"#6b7280"}}>{a.ts?new Date(a.ts).toLocaleString():""}</p></div></div>)}
      </section>}

      {tab==="Handover"&&<section style={S.card}><h2 style={S.ct}>Shift Handover Log</h2>
        <p style={{...S.hlp,color:"#374151"}}>Leave notes for the next shift. Visible to all staff.</p><HR/>
        <L>Handover Note</L>
        <textarea style={S.ta} value={handoverNote} onChange={e=>setHandoverNote(e.target.value)} placeholder="e.g. Customer X is coming back at 4pm. Room 2 needs cleaning. Booking for Marta confirmed for tomorrow 10am..." rows={4}/>
        <button style={S.btnP} onClick={async()=>{if(!handoverNote.trim())return;const row={id:Date.now(),staff_name:user.name,role:user.role,note:handoverNote.trim(),ts:new Date().toISOString()};setHandoverLog(p=>[row,...p]);await supabase.from("activity_log").insert({staff_id:user.id,staff_name:user.name,action:"Handover Note",detail:handoverNote.trim(),ts:new Date().toISOString()});setHandoverNote("");push("Handover note saved","success");}}>Save Handover Note</button>
        <HR/><h3 style={S.sh}>Recent Handover Notes</h3>
        {actLog.filter(a=>a.action==="Handover Note").slice(0,20).map((a,i)=><div key={i} style={{...S.li,flexDirection:"column",alignItems:"flex-start",gap:6}}>
          <div style={{display:"flex",justifyContent:"space-between",width:"100%",flexWrap:"wrap",gap:4}}>
            <span style={{background:a.role==="manager"?"#334155":a.role==="supervisor"?"#1e40af":"#f5e7c0",color:a.role==="manager"?"#e0b85a":a.role==="supervisor"?"#fff":"#6b4c11",borderRadius:8,padding:"2px 8px",fontSize:11,fontWeight:700}}>{a.staff_name}</span>
            <span style={{fontSize:11,color:"#6b7280"}}>{a.ts?new Date(a.ts).toLocaleString():""}</span>
          </div>
          <p style={{margin:0,fontSize:13,color:"#111827",lineHeight:1.5}}>{a.detail}</p>
        </div>)}
      </section>}

    </div>
    <style>{"@media print{.no-print{display:none!important}.print-only{display:block!important}body{background:white!important}}"}</style>
  </div>);
}

function SLines({visit,emps,mode,onUpd,onRem}){
  const isSv=mode==="supervisor";const locked=["Ready for Payment","Paid & Closed"].includes(visit.status);
  return <div style={{marginBottom:14}}>
    <h3 style={{margin:"14px 0 8px",fontWeight:800}}>Services</h3>
    {visit.services.length===0&&<p style={{color:"#6b4c11",fontSize:13}}>No services added yet.</p>}
    {visit.services.map(line=>{
      const elig=emps.filter(e=>e.section===line.employeeSection&&e.active);
      const done=["Completed","Cancelled"].includes(line.status);
      return <div key={line.lineId} style={{background:done?"#f8fafb":"#fffaf2",border:"1px solid "+(done?"#d1d5db":"#ecdba3"),borderRadius:12,padding:10,marginBottom:7}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:7,flexWrap:"wrap",gap:6}}>
          <div><b style={{fontSize:14}}>{line.name}</b>
            <p style={{color:"#5c3d11",fontSize:11,margin:"2px 0"}}>{isSv?money(line.price)+" × "+line.qty+" = "+money(lineGross(line)):"Gross: "+money(lineGross(line))+" | Income: "+money(lineIncome(line))}</p>
            {line.commission>0&&<p style={{color:"#166534",fontSize:11,margin:"2px 0"}}>Commission {line.commission}% = {money(lineComm(line))}</p>}
          </div>
          {!locked&&<button style={{padding:"4px 10px",borderRadius:8,border:0,background:"#ffe3de",color:"#8a1f12",fontWeight:800,cursor:"pointer",fontSize:12}} onClick={()=>onRem(line.lineId)}>Remove</button>}
        </div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"flex-end"}}>
          <div><p style={{fontSize:10,fontWeight:700,color:"#6b4c11",margin:"0 0 2px"}}>Qty</p><input style={{width:55,padding:"6px 8px",borderRadius:8,border:"1px solid #c7b06a",background:"#fff",fontSize:12}} type="number" min="1" value={line.qty} onChange={e=>onUpd(line.lineId,"qty",e.target.value)} disabled={locked}/></div>
          {!isSv&&<>
            <div><p style={{fontSize:10,fontWeight:700,color:"#6b4c11",margin:"0 0 2px"}}>Discount</p><input style={{width:80,padding:"6px 8px",borderRadius:8,border:"1px solid #c7b06a",background:"#fff",fontSize:12}} type="number" value={line.discount} onChange={e=>onUpd(line.lineId,"discount",e.target.value)} disabled={locked}/></div>
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2}}><p style={{fontSize:10,fontWeight:700,color:"#6b4c11",margin:0}}>Free</p><input type="checkbox" checked={line.free} onChange={e=>onUpd(line.lineId,"free",e.target.checked)} disabled={locked} style={{width:16,height:16}}/></div>
          </>}
          <div><p style={{fontSize:10,fontWeight:700,color:"#6b4c11",margin:"0 0 2px"}}>Preferred</p><select style={{padding:"6px 8px",borderRadius:8,border:"1px solid #c7b06a",background:"#fff",fontSize:12}} value={line.preferredEmployee} onChange={e=>onUpd(line.lineId,"preferredEmployee",e.target.value)} disabled={locked}><option value="">None</option>{elig.map(e=><option key={e.id}>{e.name}</option>)}</select></div>
          <div><p style={{fontSize:10,fontWeight:700,color:"#6b4c11",margin:"0 0 2px"}}>Who Did It?</p><select style={{padding:"6px 8px",borderRadius:8,border:"1px solid #c7b06a",background:"#fff",fontSize:12}} value={line.employee} onChange={e=>onUpd(line.lineId,"employee",e.target.value)} disabled={locked}><option value="">Select</option>{elig.map(e=><option key={e.id}>{e.name}</option>)}</select></div>
          <div><p style={{fontSize:10,fontWeight:700,color:"#6b4c11",margin:"0 0 2px"}}>Status</p><select style={{padding:"6px 8px",borderRadius:8,border:"1px solid #c7b06a",background:done?"#f0fdf4":"#fff",fontSize:12}} value={line.status} onChange={e=>{if(e.target.value==="In Progress")markSvcStart(line.lineId);onUpd(line.lineId,"status",e.target.value);}} disabled={locked}><option>Waiting</option><option>On Hold</option><option>In Progress</option><option>Completed</option><option>Cancelled</option></select></div>
          <SvcTimer lineId={line.lineId} status={line.status}/>
        </div>
      </div>;
    })}
    <div style={{display:"flex",justifyContent:"space-between",background:"#111827",color:"#e0b85a",padding:"11px 16px",borderRadius:12,marginTop:8}}><span style={{fontWeight:700}}>Total Income</span><b style={{fontSize:15}}>{money(visit.totalService)}</b></div>
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

function L({children}){return <p style={{margin:"0 0 4px",fontSize:13,fontWeight:700,color:"#6b4c11"}}>{children}</p>;}
function HR(){return <div style={{borderTop:"1px solid #ecdba3",margin:"16px 0"}}/>;}
function EMP({children}){return <div style={{padding:40,textAlign:"center",color:"#9ca3af",fontSize:14}}>{children}</div>;}
function SC({label,value,highlight,accent}){return <div style={{background:highlight?"#111827":accent?"#fff5f5":"#fff",color:highlight?"#e0b85a":"#111827",borderRadius:14,padding:"12px 14px",border:"1px solid "+(highlight?"transparent":accent?"#fca5a5":"#e6c977")}}><p style={{margin:0,fontSize:10,fontWeight:700,color:highlight?"#e0b85a":accent?"#b91c1c":"#6b4c11"}}>{label}</p><h3 style={{margin:"3px 0 0",fontSize:15,fontWeight:900}}>{value}</h3></div>;}
function FI({label,value,onChange,type="text",note,onNote}){return <div><p style={{fontSize:10,fontWeight:700,color:"#6b4c11",margin:"0 0 2px"}}>{label}</p><input type={type} value={value} onChange={e=>onChange(e.target.value)} style={{width:"100%",boxSizing:"border-box",padding:"7px 9px",borderRadius:9,border:"1px solid #c7b06a",background:"#fff",fontSize:12}}/>{onNote!==undefined&&<input value={note||""} onChange={e=>onNote(e.target.value)} placeholder="Note" style={{width:"100%",boxSizing:"border-box",padding:"4px 7px",borderRadius:7,border:"1px solid #e0d4a0",background:"#fffdf7",fontSize:10,marginTop:2}}/>}</div>;}
function SB(st){const m={"Waiting for Supervisor":{bg:"#fef3c7",co:"#92400e"},"In Service":{bg:"#dbeafe",co:"#1e40af"},"Ready for Payment":{bg:"#dcfce7",co:"#166534"},"Paid & Closed":{bg:"#f0fdf4",co:"#166534"},Waiting:{bg:"#fef9c3",co:"#854d0e"},"On Hold":{bg:"#f3e8ff",co:"#6b21a8"},"In Progress":{bg:"#dbeafe",co:"#1e3a8a"},Completed:{bg:"#dcfce7",co:"#14532d"},Cancelled:{bg:"#fee2e2",co:"#991b1b"},Pending:{bg:"#fef3c7",co:"#92400e"},Confirmed:{bg:"#dbeafe",co:"#1e40af"},Arrived:{bg:"#dcfce7",co:"#166534"},"No-show":{bg:"#f3f4f6",co:"#6b7280"}};const c=m[st]||{bg:"#f3f4f6",co:"#374151"};return{borderRadius:8,padding:"3px 10px",fontSize:11,fontWeight:700,whiteSpace:"nowrap",background:c.bg,color:c.co};}
const S={
  card:  {background:"#fff",color:"#111827",borderRadius:20,padding:20,border:"1px solid #e6c977",boxShadow:"0 8px 28px rgba(0,0,0,0.08)",marginBottom:16},
  ct:    {margin:"0 0 14px",fontSize:18,fontWeight:900},
  sh:    {margin:"0 0 8px",fontSize:13,fontWeight:800,color:"#6b4c11"},
  navL:  {color:"#c9b077",margin:"12px 0 5px",fontSize:10,fontWeight:800,letterSpacing:1.5},
  tab:   {padding:"9px 4px",borderRadius:10,border:"1px solid #e0b85a",background:"#fff",color:"#111827",fontWeight:700,cursor:"pointer",fontSize:11},
  tabA:  {padding:"9px 4px",borderRadius:10,border:"none",background:"#e0b85a",color:"#111827",fontWeight:900,cursor:"pointer",fontSize:11},
  inp:   {width:"100%",boxSizing:"border-box",padding:"10px 12px",marginBottom:8,borderRadius:10,border:"1px solid #c7b06a",background:"#fffdf7",color:"#111827",fontSize:13},
  ii:    {padding:"5px 7px",borderRadius:7,border:"1px solid #c7b06a",background:"#fffdf7",color:"#111827",fontSize:12,width:"100%",boxSizing:"border-box"},
  ta:    {width:"100%",boxSizing:"border-box",padding:"9px 12px",marginBottom:8,borderRadius:10,border:"1px solid #c7b06a",background:"#fffdf7",color:"#111827",minHeight:60,fontSize:13},
  r2:    {display:"grid",gridTemplateColumns:"1fr 1fr",gap:8},
  btnP:  {width:"100%",padding:12,borderRadius:11,border:0,background:"#e0b85a",color:"#111827",fontWeight:900,cursor:"pointer",fontSize:13,marginBottom:6},
  btnS:  {width:"100%",padding:10,borderRadius:11,border:"1px solid #e0b85a",background:"#fff4d8",color:"#111827",fontWeight:700,cursor:"pointer",marginBottom:6,fontSize:12},
  btnD:  {padding:"5px 11px",borderRadius:7,border:0,background:"#ffe3de",color:"#8a1f12",fontWeight:800,cursor:"pointer",fontSize:11},
  navBtn:{padding:"4px 10px",borderRadius:7,border:0,background:"#f5e7c0",color:"#6b4c11",cursor:"pointer",fontWeight:700,fontSize:14},
  li:    {display:"flex",justifyContent:"space-between",gap:8,alignItems:"center",background:"#fffaf2",border:"1px solid #ecdba3",color:"#111827",borderRadius:11,padding:"10px 14px",marginBottom:6},
  liB:   {display:"flex",justifyContent:"space-between",gap:8,alignItems:"center",background:"#fffaf2",border:"1px solid #ecdba3",color:"#111827",borderRadius:11,padding:"10px 14px",marginBottom:6,width:"100%",cursor:"pointer",textAlign:"left"},
  liA:   {display:"flex",justifyContent:"space-between",gap:8,alignItems:"center",background:"#111827",border:"none",color:"#e0b85a",borderRadius:11,padding:"10px 14px",marginBottom:6,width:"100%",cursor:"pointer",fontWeight:900,textAlign:"left"},
  tb:    {display:"flex",justifyContent:"space-between",alignItems:"center",background:"#111827",color:"#e0b85a",padding:"11px 16px",borderRadius:11,marginTop:8},
  hlp:   {color:"#5c3d11",fontSize:11,margin:"2px 0"},
  lbl:   {margin:"0 0 4px",fontSize:13,fontWeight:700,color:"#6b4c11"},
};