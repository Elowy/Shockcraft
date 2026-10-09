import {allOpenings,wallHosts,solidWallSegments,openingLabel} from './architecture';
import {dimensionGeometry} from './dimensions';
import {boardSize,boards,boardName,inBoard} from './board-size';
import {buildSchematic,schematicTitle,type SchematicMode} from './schematic';
import {moduleLabels,moduleShort,endpointInfo,circuitPorts,endpointKey} from "./board";
import {jsPDF} from 'jspdf';
import {labels,siteLabels} from './plan';
import type {Plan,Floor,Point,Kind} from './plan';
import {floorPoints,floorLength,sitePoints,siteLength,nodeHeight} from './geometry';
export type PdfOptions={scope:'floor'|'plot'|'board'|'all'|'single'|'multi';paper:'a4'|'a3';buildingId:string;floorId:string;boardId?:string};
const number=(v:number)=>v.toLocaleString('hu-HU',{maximumFractionDigits:2});
const clean=(s:string)=>s.replace(/[\u0000-\u001f]/g,' ').replace(/[\u2010-\u2015]/g,'-').replace(/→/g,' > ');
export function createPlanPdf(plan:Plan,options:PdfOptions,font:string,backgrounds:Record<string,string>={}){
 const doc=new jsPDF({orientation:'landscape',unit:'mm',format:options.paper,compress:true,putOnlyUsedFonts:true});
 doc.addFileToVFS('NotoSans.ttf',font);doc.addFont('NotoSans.ttf','NotoSans','normal');doc.setFont('NotoSans');doc.setProperties({title:clean(plan.name),subject:'Villamos terv - alaprajz, telek, elosztó',creator:'ShockCraft'});doc.viewerPreferences({PrintScaling:'None'});
 const W=doc.internal.pageSize.getWidth(),H=doc.internal.pageSize.getHeight(),margin=12;let pages=0;
 const text=(s:string,x:number,y:number,size=10,align:'left'|'center'|'right'='left')=>{doc.setFontSize(size);doc.setTextColor('#263b49');doc.text(clean(s),x,y,{align})};

 const label=(s:string,x:number,y:number,size=8)=>{doc.setFontSize(size);doc.setFillColor('#ffffff');doc.rect(x-.5,y-2.6,doc.getTextWidth(s)+1,3.6,'F');text(s,x,y,size)};
 function page(title:string,subtitle:string){if(pages++)doc.addPage(options.paper,'landscape');doc.setDrawColor('#d6e0e5');doc.setLineWidth(.25);doc.line(margin,33,W-margin,33);text('ShockCraft',margin,13,15);doc.setFontSize(10);const project=doc.splitTextToSize(clean(plan.name),W-80) as string[];text(project[0]+(project.length>1?'…':''),W-margin,13,10,'right');text(title,margin,23,15);text(subtitle,margin,29,9);doc.line(margin,H-19,W-margin,H-19);text('Tervdokumentáció. Ráhagyás és villamos méretezés nélkül.',margin,H-12,8);text(new Date().toLocaleDateString('hu-HU'),W-margin,H-12,8,'right')}
 function table(title:string,subtitle:string,headers:string[],widths:number[],rows:string[][]){if(!rows.length)return;page(title,subtitle);const total=widths.reduce((a,b)=>a+b,0),ww=widths.map(v=>v/total*(W-2*margin));let y=39;
 const head=()=>{doc.setFillColor('#eaf1ef');doc.rect(margin,y,W-2*margin,9,'F');let x=margin;headers.forEach((s,i)=>{text(s,x+2,y+6,9);x+=ww[i]});y+=9};head();
 rows.forEach((row,index)=>{doc.setFontSize(9);const cells=row.map((s,i)=>doc.splitTextToSize(clean(s),ww[i]-4) as string[]);const h=Math.max(9,...cells.map(v=>v.length*4+4));if(y+h>H-25){page(title+' - folytatás',subtitle);y=39;head()}if(index%2===0){doc.setFillColor('#f6f8fa');doc.rect(margin,y,W-2*margin,h,'F')}let x=margin;cells.forEach((lines,i)=>{doc.setFontSize(9);doc.setTextColor('#263b49');doc.text(lines,x+2,y+5);x+=ww[i]});y+=h;doc.setDrawColor('#dde5ea');doc.line(margin,y,W-margin,y)})}
 function frame(points:Point[],units:number){const pp=points.length?points.map(p=>({x:p.x/units,y:p.y/units})):[{x:0,y:0},{x:10,y:8}];const minX=Math.min(...pp.map(p=>p.x))-.8,minY=Math.min(...pp.map(p=>p.y))-.8,maxX=Math.max(...pp.map(p=>p.x))+.8,maxY=Math.max(...pp.map(p=>p.y))+.8;const availableW=W-2*margin-12,availableH=H-36-38;const fit=Math.min(availableW/(maxX-minX),availableH/(maxY-minY));const s=[20,10,5,4,2,1,.5,.25].find(v=>v<=fit)||fit;const x0=(W-(maxX-minX)*s)/2-minX*s,y0=39+(availableH-(maxY-minY)*s)/2-minY*s;
 return {s,xy:(p:Point)=>({x:x0+p.x/units*s,y:y0+p.y/units*s}),footer:()=>{const len=units===40?2:5;doc.setDrawColor('#405966');doc.setLineWidth(.4);doc.line(margin,H-31,margin+len*s,H-31);doc.line(margin,H-33,margin,H-29);doc.line(margin+len*s,H-33,margin+len*s,H-29);text(len+' m',margin+len*s/2,H-34,8,'center');text('Méretarány 1:'+number(1000/s)+' (100% nyomtatásnál)',W-margin,H-29,8,'right')}}}
 function poly(points:Point[],xy:(p:Point)=>Point,color:string,dashed=false){doc.setDrawColor(color);doc.setLineWidth(.5);doc.setLineDashPattern(dashed?[2,1.5]:[],0);points.slice(1).forEach((p,i)=>{const a=xy(points[i]),b=xy(p);doc.line(a.x,a.y,b.x,b.y)});doc.setLineDashPattern([],0)}
 function symbol(kind:Kind,p:Point,angle=0){doc.setDrawColor(kind==='rj45'||kind==='phone'?'#406d96':kind.startsWith('switch')||kind==='light'?'#956b25':'#9e5929');doc.setFillColor('#ffffff');doc.setLineWidth(.35);const line=(x:number,y:number,x2:number,y2:number)=>{const a=angle*Math.PI/180,c=Math.cos(a),s=Math.sin(a);doc.line(p.x+x*c-y*s,p.y+x*s+y*c,p.x+x2*c-y2*s,p.y+x2*s+y2*c)};
 if(kind==='panel'||kind==='box'){doc.rect(p.x-2,p.y-2.5,4,5,'FD');if(kind==='panel')for(let i=-1;i<=1;i++)line(-1,i,1,i);else doc.circle(p.x,p.y,.35,'F')}
 else if(kind==='rj45'||kind==='phone'){doc.rect(p.x-2.5,p.y-2,5,4,'FD');text(kind==='rj45'?'RJ':'T',p.x,p.y+.8,6,'center')}
 else{doc.circle(p.x,p.y,2,'FD');if(kind==='light'){line(-1.4,-1.4,1.4,1.4);line(-1.4,1.4,1.4,-1.4)}else if(kind.startsWith('switch')){line(1,-1.5,2.5,-4);if(kind!=='switch1')line(-1,-1.5,-2.5,-4)}else{line(-.7,-.8,-.7,.8);line(.7,-.8,.7,.8);if(kind==='double')doc.circle(p.x+3,p.y,1.5)}}}
 function floorPage(building:Plan['buildings'][number],f:Floor){const sub=building.name+' / '+f.name+' | Szint: '+number(f.elevation)+' m';page('Villamos alaprajz',sub);const bounds=[...allOpenings(f).flatMap(o=>o.geometry.bounds),...f.rooms.flatMap(r=>[{x:r.x,y:r.y},{x:r.x+r.w,y:r.y+r.h}]),...f.walls.flatMap(w=>[w.a,w.b]),...f.devices,...f.routes.flatMap(r=>floorPoints(r,f)),...(f.dimensions||[]).flatMap(d=>dimensionGeometry(d).bounds),...(f.background?.visible?[{x:f.background.x,y:f.background.y},{x:f.background.x+f.background.w,y:f.background.y+f.background.h}]:[])];const tr=frame(bounds,40);if(f.background?.visible){const b=f.background,data=backgrounds[b.assetId];if(!data)throw Error('A PDF-ből hiányozna egy háttérkép. Töltsd be újra a hátteret.');const p=tr.xy(b);doc.saveGraphicsState();doc.setGState(doc.GState({opacity:b.opacity}));doc.addImage(data,'JPEG',p.x,p.y,b.w/40*tr.s,b.h/40*tr.s);doc.restoreGraphicsState();}doc.setDrawColor('#405563');doc.setFillColor('#ffffff');doc.setLineWidth(1);
 for(const host of wallHosts(f)){doc.setDrawColor('#405563');doc.setLineWidth(host.thickness/100*tr.s);for(const [a,b] of solidWallSegments(f,host)){const p=tr.xy(a),q=tr.xy(b);doc.line(p.x,p.y,q.x,q.y)}}
 for(const {opening,geometry} of allOpenings(f)){doc.setDrawColor(opening.kind==='door'?'#405563':'#477f9b');doc.setLineWidth(.3);for(const points of geometry.lines)points.slice(1).forEach((p,i)=>{const a=tr.xy(points[i]),b=tr.xy(p);doc.line(a.x,a.y,b.x,b.y)})}
 f.routes.forEach((r,i)=>{const pts=floorPoints(r,f);poly(pts,tr.xy,r.mode==='inside'?'#b16d33':'#40769d',r.mode==='inside');if(pts.length>1){const a=tr.xy(pts[0]),b=tr.xy(pts[1]);label('N'+(i+1),(a.x+b.x)/2+2,(a.y+b.y)/2-2,8)}});
 f.devices.forEach((d,i)=>{const p=tr.xy(d);symbol(d.kind,p,d.angle);label('S'+(i+1),p.x+(d.kind==='double'?6:4),p.y+1,8)});
 (f.dimensions||[]).forEach(d=>{const g=dimensionGeometry(d);doc.setLineWidth(.25);doc.setDrawColor('#405563');g.lines.forEach(([a,b])=>{const p=tr.xy(a),q=tr.xy(b);doc.line(p.x,p.y,q.x,q.y)});const p=tr.xy(g.label);doc.setFontSize(8);const width=doc.getTextWidth(g.text);doc.setFillColor('#ffffff');doc.rect(p.x-width/2-1,p.y-3,width+2,4,'F');text(g.text,p.x,p.y,8,'center')});
 f.rooms.forEach(r=>{const center=tr.xy({x:r.x+r.w/2,y:r.y+r.h/2});doc.setFontSize(9);const lines=doc.splitTextToSize(clean(r.name),Math.max(8,r.w/40*tr.s-8)) as string[];const area=number(r.w*r.h/1600)+' m²';const width=Math.max(...lines.map(line=>doc.getTextWidth(line)),doc.getTextWidth(area));doc.setFillColor('#ffffff');doc.rect(center.x-width/2-1,center.y-3.2,width+2,lines.length*3.8+6,'F');doc.setTextColor('#263b49');doc.text(lines,center.x,center.y,{align:'center'});text(area,center.x,center.y+lines.length*3.8+1,8,'center')});if(!bounds.length)text('Üres szint',W/2,H/2,14,'center');tr.footer();
 table('Nyílászárójegyzék',sub,['Hely','Típus','Szélesség','Magasság','Alsó él'],[65,30,30,30,30],allOpenings(f).map(({host,opening:o})=>[host.name,openingLabel(o),number(o.width)+' cm',number(o.height)+' cm',number(o.sill)+' cm']));
 table('Szerelvényjegyzék',sub,['Jel','Megnevezés','Típus','Beépítési mag.','Áramkör'],[12,55,52,32,55],f.devices.map((d,i)=>['S'+(i+1),d.name,labels[d.kind],number(d.height)+' cm',plan.circuits.find(c=>c.id===d.circuit)?.name||'-']));
 table('Nyomvonaljegyzék',sub+' | Vízszintes hossz + két végpont fel/leállása; ráhagyás nélkül.',['Jel / megnevezés','Vezetés / kábel','Sík / végpontok','Vízszintes','Függőleges','Összesen'],[55,48,45,25,25,25],f.routes.map((r,i)=>{const l=floorLength(r,f);return ['N'+(i+1)+' - '+r.name,(r.mode==='inside'?'Falon belül':'Falon kívül')+' / '+r.cable,number(l.plane)+' m / '+number(l.start)+' → '+number(l.end)+' m',number(l.horizontal)+' m',number(l.vertical)+' m',number(l.total)+' m']}));
 }
 function plotPage(){page('Telek - villamos hálózat',plan.plot.name);const bounds=[{x:0,y:0},{x:plan.plot.w,y:plan.plot.h},...plan.buildings.flatMap(b=>[{x:b.x,y:b.y},{x:b.x+b.w,y:b.y+b.h}]),...plan.plot.nodes,...plan.plot.routes.flatMap(r=>r.via)];const tr=frame(bounds,1);let p=tr.xy({x:0,y:0});doc.setDrawColor('#8a9f94');doc.setLineWidth(.4);doc.setLineDashPattern([2,1],0);doc.rect(p.x,p.y,plan.plot.w*tr.s,plan.plot.h*tr.s);doc.setLineDashPattern([],0);
 plan.buildings.forEach(b=>{const p=tr.xy(b);doc.setDrawColor('#697f8c');doc.setFillColor('#eef3f5');doc.rect(p.x,p.y,b.w*tr.s,b.h*tr.s,'FD');doc.setFontSize(9);const lines=doc.splitTextToSize(clean(b.name),Math.max(8,b.w*tr.s-4)) as string[];doc.setTextColor('#263b49');doc.text(lines,p.x+b.w*tr.s/2,p.y+b.h*tr.s/2,{align:'center'})});
 plan.plot.routes.forEach((r,i)=>{const pp=sitePoints(r,plan);poly(pp,tr.xy,r.mode==='underground'?'#b16d33':'#40769d',r.mode==='underground');const a=tr.xy(pp[0]),b=tr.xy(pp[1]);label('T'+(i+1),(a.x+b.x)/2+2,(a.y+b.y)/2-2,8)});
 plan.plot.nodes.forEach((n,i)=>{const p=tr.xy(n);doc.setDrawColor('#256459');doc.setFillColor('#fff');doc.setLineWidth(.4);doc.rect(p.x-2,p.y-2,4,4,'FD');label('P'+(i+1),p.x+3,p.y+1,8)});tr.footer();
 table('Telki pontjegyzék',plan.plot.name+' | Magasságok a közös telek-0 szinthez képest.',['Jel','Megnevezés','Típus','X / Y','Magasság'],[14,65,55,40,30],plan.plot.nodes.map((n,i)=>['P'+(i+1),n.name,siteLabels[n.kind],number(n.x)+' / '+number(n.y)+' m',number(nodeHeight(n,plan))+' m']));
 table('Telki nyomvonaljegyzék',plan.plot.name+' | Vízszintes nyomvonal + kezdő- és végpont fel/leállása.',['Jel / megnevezés','Honnan → hová','Vezetés / szint / kábel','Vízszintes','Függőleges','Összesen'],[45,55,60,25,25,25],plan.plot.routes.map((r,i)=>{const l=siteLength(r,plan);return ['T'+(i+1)+' - '+r.name,(plan.plot.nodes.find(n=>n.id===r.from)?.name||'')+' → '+(plan.plot.nodes.find(n=>n.id===r.to)?.name||''),({underground:'Föld alatt',surface:'Felszínen',overhead:'Magasban'})[r.mode]+' / '+number(r.level)+' m / '+r.cable,number(l.horizontal)+' m',number(l.vertical)+' m',number(l.total)+' m']}));
 }
 function boardPage(b:Plan['buildings'][number],boardId=''){
 const title=b.name+' / '+boardName(b,boardId),size=boardSize(b,boardId),x=margin+10,y=43,unit=(W-2*margin-20)/size.modulesPerRow;
 for(let start=0;start<size.rows;start+=4){
  const count=Math.min(4,size.rows-start),rowH=(H-43-35)/Math.max(3,count);
  page('Lakáselosztó - készülékelrendezés',title+' | '+size.rows+' × '+size.modulesPerRow+' modul | '+(start+1)+'–'+(start+count)+'. sor');
  for(let row=start;row<start+count;row++){
   const yy=y+(row-start)*rowH;doc.setFillColor('#f4f7f8');doc.setDrawColor('#cad6dc');doc.rect(x,yy,unit*size.modulesPerRow,rowH-5,'FD');text((row+1)+'.',margin,yy+10,9);
   for(let slot=0;slot<size.modulesPerRow;slot++){doc.setLineWidth(.15);doc.rect(x+slot*unit,yy,unit,rowH-5);text(String(slot+1),x+(slot+.5)*unit,yy+4,7,'center')}
   for(const m of plan.modules.filter(m=>m.building===b.id&&inBoard(m,boardId)&&m.row===row)){
    const xx=x+m.slot*unit,ww=m.width*unit;doc.setDrawColor('#6d828e');doc.setFillColor('#fff');doc.setLineWidth(.4);doc.rect(xx+.6,yy+6,ww-1.2,rowH-12,'FD');const c=plan.circuits.find(c=>c.id===m.circuit),fontSize=Math.min(8,(ww-1.5)*1.1);
    text(moduleShort[m.type],xx+ww/2,yy+11,fontSize,'center');text(c?c.curve+c.rating+' A':moduleShort[m.type],xx+ww/2,yy+17,fontSize,'center');
    const index=plan.modules.filter(m=>m.building===b.id&&inBoard(m,boardId)).findIndex(v=>v.id===m.id)+1;text('K'+index,xx+ww/2,yy+23,fontSize,'center');
   }
  }
 }
 table('Elosztó - készülékjegyzék',title,['Jel','Megnevezés','Típus','Sor / hely','Szélesség','Áramkör'],[12,65,22,28,25,55],plan.modules.filter(m=>m.building===b.id&&inBoard(m,boardId)).map((m,i)=>['K'+(i+1),m.name,moduleLabels[m.type],(m.row+1)+' / '+(m.slot+1),m.width+' modul',plan.circuits.find(c=>c.id===m.circuit)?.name||'-']));
 table('Elosztó - áramkörjegyzék',title,['Áramkör','Fázis','Védelem','Kábel','ÁVK-csoport','Szerelvény'],[60,18,25,50,35,25],plan.circuits.filter(c=>c.building===b.id&&inBoard(c,boardId)).map(c=>[c.name,c.phase,c.curve+c.rating+' A',c.cable,c.rcd||'-',String(b.floors.flatMap(f=>f.devices).filter(d=>d.circuit===c.id).length)]));
 table('Elosztó - bekötési jegyzék',title,['Vezeték neve','Honnan / kapocs','Hová / kapocs'],[55,75,75],plan.boardWires.filter(w=>w.building===b.id&&endpointInfo(plan,w.from)?.board===boardId).map(w=>[w.name,endpointInfo(plan,w.from)?.text||'-',endpointInfo(plan,w.to)?.text||'-']));
 const unconnected=plan.circuits.filter(c=>c.building===b.id&&inBoard(c,boardId)).flatMap(c=>circuitPorts(c).filter(port=>!plan.boardWires.some(w=>[w.from,w.to].some(e=>endpointKey(e)===endpointKey({kind:'circuit',id:c.id,port:port.id})))).map(port=>[c.name,port.signal,port.label,'Nincs bekötve']));
 table('Elosztó - be nem kötött szálak',title,['Áramkör','Jel','Szál neve','Állapot'],[55,20,85,40],unconnected);
 }
 function schematicPage(b:Plan['buildings'][number],mode:SchematicMode,boardId=''){
  const diagram=buildSchematic(plan,b.id,mode,boardId),scale=(W-2*margin)/diagram.width,top=43,usable=H-top-31,tile=usable/scale;
  const cuts=[0];while(cuts.at(-1)!<diagram.height){const start=cuts.at(-1)!,limit=start+tile;const end=diagram.height<=limit?diagram.height:diagram.breaks.filter(y=>y>start&&y<=limit).at(-1)||limit;cuts.push(end)}
  const total=cuts.length-1;
  for(let section=0;section<total;section++){
   page(schematicTitle(mode),b.name+' / '+boardName(b,boardId)+' | '+(section+1)+' / '+total+' rajzlap | '+diagram.missing.length+' be nem kötött áramköri szál');
   text('Nem méretarányos. Keresztezés nem jelent kötést. Több lap esetén függőlegesen folytatódik.',margin,39,8);
   const offset=cuts[section],end=cuts[section+1],xx=(x:number)=>margin+x*scale,yy=(y:number)=>top+(y-offset)*scale;
   doc.saveGraphicsState();doc.rect(margin,top,W-2*margin,(end-offset)*scale,null);doc.clip();doc.discardPath();
   for(const p of diagram.drawing){
    doc.setDrawColor(p.color);doc.setLineWidth(.3);doc.setLineDashPattern([],0);
    if(p.type==='text'){doc.setFontSize(p.size*scale*72/25.4);doc.setTextColor(p.color);doc.text(clean(p.text),xx(p.x),yy(p.y))}
    else if(p.type==='rect'){doc.setFillColor(p.fill);doc.rect(xx(p.x),yy(p.y),p.w*scale,p.h*scale,'FD')}
    else if(p.type==='circle'){doc.setFillColor(p.fill);doc.circle(xx(p.x),yy(p.y),p.r*scale,'FD')}
    else{doc.setLineWidth((p.width||2)*scale);doc.setLineDashPattern(p.dash?[1.4,1.2]:[],0);p.points.slice(1).forEach((b,i)=>{const a=p.points[i];doc.line(xx(a.x),yy(a.y),xx(b.x),yy(b.y))})}
   }
   doc.restoreGraphicsState();doc.setLineDashPattern([],0);
   text('Rajzi tartomány: '+Math.round(offset)+'–'+Math.round(end)+' | Kapocsjelek: üres = nincs bekötve; kitöltött = megadott kapcsolat.',margin,H-24,8);
  }
  table('Kapcsolási rajz - bekötési jegyzék',b.name+' / '+boardName(b,boardId),['Kapcsolat','Megadott végpontok'],[55,160],diagram.edges.map(e=>[e.name,e.detail]));
  table('Kapcsolási rajz - hiányzó bekötések',b.name+' / '+boardName(b,boardId),['Áramkör','Jel','Szál neve'],[70,20,120],diagram.missing.map(m=>[m.circuit,m.signal,m.name]));
 }
 const building=plan.buildings.find(b=>b.id===options.buildingId)||plan.buildings[0],floor=building?.floors.find(f=>f.id===options.floorId)||building?.floors[0];
 if(options.scope==='floor'&&(!building||!floor))throw Error('Nincs exportálható szint. Hozz létre egy szintet, vagy válaszd a telek PDF-et.');if(['board','single','multi'].includes(options.scope)&&!building)throw Error('Nincs exportálható épület.');
 if(options.scope==='plot'||options.scope==='all')plotPage();if(options.scope==='floor')floorPage(building,floor);if(options.scope==='board')boardPage(building,options.boardId);if(options.scope==='single'||options.scope==='multi')schematicPage(building,options.scope,options.boardId);if(options.scope==='all')for(const b of plan.buildings){for(const f of [...b.floors].sort((a,b)=>a.elevation-b.elevation))floorPage(b,f);for(const cabinet of boards(b)){boardPage(b,cabinet.id);schematicPage(b,'single',cabinet.id);schematicPage(b,'multi',cabinet.id)}}
 for(let i=1;i<=doc.getNumberOfPages();i++){doc.setPage(i);text(i+' / '+doc.getNumberOfPages(),W/2,H-7,8,'center')}
 return doc;
}
