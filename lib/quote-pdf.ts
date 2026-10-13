import {jsPDF} from 'jspdf';
import {quoteSchema,type Quote} from './quote-schema';
import {quoteTotals,quoteIssues,lineTotal,money,amount,travelCost} from './quote';
import {productLine} from './catalog';
const clean=(s:string)=>s.replace(/[\u0000-\u0008\u000b-\u001f]/g,' ').replace(/[\u2010-\u2015]/g,'-');
export function createQuotePdf(input:Quote,projectName:string,font:string){
 const q=quoteSchema.parse(input),issues=quoteIssues(q);if(issues.length)throw Error(issues[0]);
 const doc=new jsPDF({orientation:'landscape',unit:'mm',format:'a4',compress:true,putOnlyUsedFonts:true});doc.addFileToVFS('NotoSans.ttf',font);doc.addFont('NotoSans.ttf','NotoSans','normal');doc.setFont('NotoSans');doc.setProperties({title:'Árajánlat - '+q.number,subject:projectName,creator:'Villanyrajz'});
 const W=297,H=210,M=14,B=H-20;let y=0,pages=0;
 function text(s:string,x:number,yy:number,size=9,align:'left'|'right'='left'){doc.setFontSize(size);doc.setTextColor('#263b49');doc.text(clean(s),x,yy,{align})}
 function page(){if(pages++)doc.addPage();text('ÁRAJÁNLAT',M,17,17);text('Villanyrajz',W-M,17,10,'right');doc.setFontSize(9);const lines=doc.splitTextToSize(clean(q.number+' · '+projectName),W-2*M) as string[];doc.text(lines,M,25);y=28+lines.length*4;doc.setDrawColor('#c9d9d5');doc.line(M,y,W-M,y);y+=7}
 const ensure=(height:number)=>{if(y+height>B)page()};
 function paragraph(value:string,size=9){doc.setFontSize(size);const lines=doc.splitTextToSize(clean(value),W-2*M) as string[];for(const line of lines){ensure(5);text(line,M,y,size);y+=4.5}y+=3}
 page();paragraph('Kiállítás: '+q.date+(q.validUntil?'    Érvényes: '+q.validUntil:''));
 const col=(W-2*M-12)/2;doc.setFontSize(9);const supplier=doc.splitTextToSize(clean(q.supplier),col) as string[],customer=doc.splitTextToSize(clean(q.customer),col) as string[];
 text('AJÁNLATADÓ',M,y,10);text('ÜGYFÉL',M+col+12,y,10);y+=6;
 for(let i=0;i<Math.max(supplier.length,customer.length);i++){ensure(5);text(supplier[i]||'',M,y);text(customer[i]||'',M+col+12,y);y+=4.5}y+=6;
 if(q.site)paragraph('Munkavégzés helye: '+q.site);
 paragraph('Nettó egységárak HUF-ban. Kábelráhagyás: '+amount(q.allowance)+'% a jelölt méteres tételeknél.');
 const widths=[95,25,15,43,43,48],heads=['Tétel / részletek','Mennyiség','Egység','Anyag Ft/egység','Munkadíj Ft/egység','Nettó összeg'];
 function head(){ensure(12);doc.setFillColor('#eaf1ef');doc.rect(M,y,W-2*M,10,'F');let x=M;heads.forEach((s,i)=>{text(s,x+2,y+6,8);x+=widths[i]});y+=10}
 head();q.lines.filter(l=>l.included).forEach((l,index)=>{const t=lineTotal(l,q),extra=productLine(l.product,l.name,q.productDisplay??'brand');doc.setFontSize(9);const names=doc.splitTextToSize(clean(l.name+(l.detail?'\n'+l.detail:'')+(extra?'\n'+extra:'')),widths[0]-4) as string[];if(l.allowance&&l.unit==='m')names.push('Ráhagyással: '+amount(q.allowance)+'%');const height=Math.max(12,names.length*4.5+5);if(y+height>B){page();head()}if(index%2===0){doc.setFillColor('#f5f8f7');doc.rect(M,y,W-2*M,height,'F')}names.forEach((s,i)=>text(s,M+2,y+5+i*4.5));const values=[amount(t.quantity),l.unit,money(l.material||0),money(l.labor||0),money(t.total)];let x=M+widths[0];values.forEach((value,i)=>{text(value,x+widths[i+1]-2,y+5,8,'right');x+=widths[i+1]});y+=height;doc.setDrawColor('#dce5e2');doc.line(M,y,W-M,y)});
 y+=8;ensure(64);const totals=quoteTotals(q),travel=travelCost(q),summary:[string,string][]=[['Anyag nettó',money(totals.material)],['Munkadíj nettó',money(totals.labor)],['Kedvezmény ('+amount(q.discount)+'%)','- '+money(totals.discount)],['Nettó összesen',money(totals.net)],...(travel?[['Útiköltség',money(travel)] as [string,string]]:[]),[q.vat==='AAM'?'Áfa: alanyi adómentes':'Áfa ('+q.vat+'%)',money(totals.vat)],['FIZETENDŐ ÖSSZESEN',money(totals.total)]];
 summary.forEach(([label,value],i)=>{const last=i===summary.length-1;if(last){doc.setFillColor('#eaf1ef');doc.rect(W-155,y-5,141,9,'F')}text(label,W-152,y,last?10:9);text(value,W-M-2,y,last?11:9,'right');y+=8});
 if(q.notes){y+=4;ensure(12);text('FELTÉTELEK ÉS MEGJEGYZÉSEK',M,y,10);y+=6;paragraph(q.notes)}
 for(let i=1;i<=doc.getNumberOfPages();i++){doc.setPage(i);doc.setDrawColor('#c9d9d5');doc.line(M,H-15,W-M,H-15);text('Árajánlat - nem számla.',M,H-9,8);text(i+' / '+doc.getNumberOfPages(),W-M,H-9,8,'right')}
 return doc;
}
