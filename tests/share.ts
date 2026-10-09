import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {seed,validatePlan,type Floor} from '../lib/plan';
import {newQuote} from '../lib/quote';
import {DEFAULT_SHARE_DAYS,SHARE_LABEL_MAX,SHARE_TOKEN_KEY,SHARE_TOKEN_RE,floorViewBox,newShareToken,readShareToken,shareCreateSchema,shareInputError,shareLink,shareRevokeSchema,shareViewSchema,sharedPlan} from '../lib/share';
const U='11111111-1111-4111-8111-111111111111';
const HU=['Érvénytelen projektazonosító.','A címke legfeljebb 80 karakter lehet.','A címke nem tartalmazhat vezérlő- vagy láthatatlan karaktert.','Az érvényesség 1, 7, 30 vagy 90 nap lehet.','Adj meg pontosan egy linket, vagy kérd az összes visszavonását.','A megadott adatok érvénytelenek.'];
const error=(fn:()=>unknown)=>{try{fn()}catch(e){return shareInputError(e)}assert.fail('a séma elfogadta a hibás bemenetet')};

// 1. Token: 32 bájt véletlen, 64 kisbetűs hex, mind különböző.
const tokens=Array.from({length:100},newShareToken);
for(const t of tokens)assert.match(t,SHARE_TOKEN_RE);
assert.equal(new Set(tokens).size,100);
assert.equal(SHARE_TOKEN_KEY,'shockcraft-share-token');

// 2. sharedPlan: árajánlat és háttéralaprajz nélkül, a bemenet változatlan.
const assetId=crypto.randomUUID();
const input=validatePlan(structuredClone(seed));
input.quote={...newQuote(),customer:'Titkos Ügyfél Kft. 06301234567'};
input.buildings[0].floors.find(f=>f.id==='ground')!.background={assetId,name:'kovacs-alaprajz.jpg',x:0,y:0,w:400,h:300,opacity:.5,visible:true,calibrated:true};
const before=JSON.stringify(input);
const shared=sharedPlan(input);
assert.equal(shared.plan.quote,undefined);
assert.ok(shared.plan.buildings.every(b=>b.floors.every(f=>f.background===undefined)));
assert.deepEqual(shared.backgroundFloors,['ground']);
const text=JSON.stringify(shared);
for(const secret of [assetId,'kovacs-alaprajz','Titkos Ügyfél'])assert.ok(!text.includes(secret),secret+' nem kerülhet a megosztott tervbe');
validatePlan(shared.plan);
assert.equal(JSON.stringify(input),before,'a bemenet nem módosul');
assert.throws(()=>sharedPlan({}));

// 3. Létrehozási séma: alapértékek, trimelés, korlátok, csak magyar hibaüzenet.
assert.deepEqual(shareCreateSchema.parse({projectId:'default',userId:'u'}),{projectId:'default',userId:'u',label:'',days:DEFAULT_SHARE_DAYS,allowPdf:false});
assert.deepEqual(shareCreateSchema.parse({projectId:U,userId:'u',label:'  Kovács úr  ',days:7,allowPdf:true}),{projectId:U,userId:'u',label:'Kovács úr',days:7,allowPdf:true});
assert.equal(shareCreateSchema.parse({projectId:'default',userId:'u',label:'x'.repeat(SHARE_LABEL_MAX)}).label.length,80);
assert.equal(shareCreateSchema.parse({projectId:'default',userId:'u',label:' \ufeff '}).label,'','a szélső BOM a trimmel eltűnik');
const bad:unknown[]=[
 ...[14,0,365].map(days=>({projectId:'default',userId:'u',days})),
 {projectId:'default',userId:'u',label:'x'.repeat(81)},
 ...['csengő\u0007','\u202ehamis','láthatatlan\u200b','a\ufeffb','sor\ntörés'].map(label=>({projectId:'default',userId:'u',label})),
 {projectId:'../x',userId:'u'},
 {projectId:'default',userId:'u',extra:1},
 {projectId:'default',userId:'u',days:'30'},
 {projectId:'default'},
 null,
];
for(const value of bad){const message=error(()=>shareCreateSchema.parse(value));assert.ok(HU.includes(message),'csak saját magyar üzenet: '+message)}
assert.equal(error(()=>shareCreateSchema.parse({projectId:'default',userId:'u',days:14})),'Az érvényesség 1, 7, 30 vagy 90 nap lehet.');
assert.equal(error(()=>shareCreateSchema.parse({projectId:'default',userId:'u',label:'x'.repeat(81)})),'A címke legfeljebb 80 karakter lehet.');
assert.equal(error(()=>shareCreateSchema.parse({projectId:'default',userId:'u',label:'a\u202eb'})),'A címke nem tartalmazhat vezérlő- vagy láthatatlan karaktert.');
assert.equal(error(()=>shareCreateSchema.parse({projectId:'../x',userId:'u'})),'Érvénytelen projektazonosító.');
assert.equal(error(()=>shareCreateSchema.parse({projectId:'default',userId:'u',extra:1})),'A megadott adatok érvénytelenek.','az angol Zod-üzenet nem jut ki');
assert.equal(shareInputError(new SyntaxError('Unexpected token')),'A megadott adatok érvénytelenek.');

// 4. Visszavonási séma: pontosan egy link vagy az összes.
assert.equal(shareRevokeSchema.parse({projectId:'default',userId:'u',id:U}).id,U);
assert.equal(shareRevokeSchema.parse({projectId:'default',userId:'u',all:true}).all,true);
assert.equal(error(()=>shareRevokeSchema.parse({projectId:'default',userId:'u',id:U,all:true})),'Adj meg pontosan egy linket, vagy kérd az összes visszavonását.');
assert.equal(error(()=>shareRevokeSchema.parse({projectId:'default',userId:'u'})),'Adj meg pontosan egy linket, vagy kérd az összes visszavonását.');
assert.throws(()=>shareRevokeSchema.parse({projectId:'default',userId:'u',all:false}));
assert.throws(()=>shareRevokeSchema.parse({projectId:'default',userId:'u',id:'nem-uuid'}));

// 5. Nézeti séma.
const t=tokens[0];
assert.deepEqual(shareViewSchema.parse({token:t}),{token:t,purpose:'view'});
assert.equal(shareViewSchema.parse({token:t,purpose:'pdf'}).purpose,'pdf');
for(const value of [{token:t.toUpperCase()},{token:t.slice(1)},{token:t,extra:1},{token:t,purpose:'json'},{}])assert.throws(()=>shareViewSchema.parse(value));

// 6–7. Fragment-token és link.
assert.equal(readShareToken('#t='+t),t);
assert.equal(readShareToken('t='+t),t);
for(const hash of ['#t='+t.toUpperCase(),'#token='+t,'','#t='+t.slice(1),'#t='+t+'x'])assert.equal(readShareToken(hash),'');
assert.equal(shareLink('https://x.hu',t),'https://x.hu/megosztas#t='+t);

// 8. Befoglaló doboz.
const empty:Floor={id:'e',name:'Üres',elevation:0,rooms:[],walls:[],devices:[],routes:[]};
assert.deepEqual(floorViewBox(empty),{x:0,y:0,w:1000,h:720});
const ground=validatePlan(structuredClone(seed)).buildings[0].floors.find(f=>f.id==='ground')!,vb=floorViewBox(ground);
assert.ok(vb.w>=400&&vb.h>=288);
for(const d of ground.devices)assert.ok(d.x-vb.x>=80&&vb.x+vb.w-d.x>=80&&d.y-vb.y>=80&&vb.y+vb.h-d.y>=80,d.name+' a dobozban, párnával');
const tiny:Floor={...empty,devices:[{id:'d',name:'D',kind:'socket',x:500,y:500,angle:0,height:30,circuit:''}]},small=floorViewBox(tiny);
assert.deepEqual([small.w,small.h],[400,288]);assert.ok(small.x<500&&small.x+small.w>500&&small.y<500&&small.y+small.h>500,'a kicsi tartalom a doboz közepén');
const huge:Floor={...empty,routes:[{id:'r',name:'Hosszú',points:Array.from({length:3000},(_,i)=>({x:i%2000,y:Math.floor(i/2)%2000})),mode:'inside',circuit:'',cable:'',startId:'',endId:'',planeHeight:260,startHeight:260,endHeight:260}]};
const big=floorViewBox(huge);assert.ok(big.w>=2000&&Number.isFinite(big.h),'3000 pontos nyomvonallal sem dob');
const dims:Floor={...empty,dimensions:[{id:'m',name:'M',a:{x:100,y:100},b:{x:300,y:100},mode:'aligned',offset:-120}]},dv=floorViewBox(dims);
assert.ok(dv.y<=100-120-80,'a méretvonal eltolása is a dobozban');

// 9. Statikus őrök.
const read=(p:string)=>readFileSync(p,'utf8');
for(const f of ['components/share-viewer.tsx','components/share-dialog.tsx','components/floor-drawing.tsx'])assert.ok(!read(f).includes('dangerouslySetInnerHTML'),f);
const viewer=read('components/share-viewer.tsx');
assert.ok(!/plan-editor/.test(viewer),'a megtekintő nem importálja a szerkesztőt');
assert.ok(!/localStorage\.setItem\(\s*(SHARE_TOKEN_KEY|['"]shockcraft-share-token['"])/.test(viewer),'a token nem kerül localStorage-ba');
assert.ok(viewer.includes('sessionStorage.setItem(SHARE_TOKEN_KEY'),'a token csak sessionStorage-ban');
assert.ok(viewer.includes('history.replaceState'),'a token eltűnik a címsorból');
assert.ok(!read('app/api/shared-plan/route.ts').includes('accountFromHeaders'),'a nyilvános route nem olvas munkamenetet');
const client=read('lib/share-client.ts');
assert.ok(client.includes("credentials:'omit'")&&client.includes("referrerPolicy:'no-referrer'"));
const server=read('lib/share-server.ts');
assert.ok(server.split('\n').filter(l=>l.includes('token_hash')).every(l=>/'[^']*token_hash[^']*'/.test(l)),'a token_hash csak SQL-szövegben szerepel');
console.log('PASS: tervmegosztás – token, adatminimalizálás, sémák (csak magyar hibaüzenet), fragment-link, befoglaló doboz, statikus őrök.');
