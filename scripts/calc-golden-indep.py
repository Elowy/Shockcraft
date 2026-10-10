#!/usr/bin/env python3
# Kalkulátorok – független (Python) újraszámolás a belső kettős ellenőrzéshez (docs/kalkulatorok.md).
# A képleteket a TypeScript-motortól függetlenül, itt újra leírva számolja; nem importál semmit a repóból.
# Használat: python3 scripts/calc-golden-indep.py examples   – a definíciók példáinak elvárt értékei (lib/calc/defs/*.ts expect)
#            python3 scripts/calc-golden-indep.py extra      – a tests/calc-golden.ts EXTRA táblája (TypeScript-sorok)
import math, json, sys
MODE=sys.argv[1] if len(sys.argv)>1 else "examples"
def examples():
 S3=math.sqrt(3); rho1=0.0225; lam=0.00008; U0=230
 out={}
 def put(k,**v): out[k]=v
 # ohm
 put('ohm 230/10',I=23,P=5290); put('ohm 12/2',R=6,P=24); put('ohm .5/100',U=50,P=25)
 put('ohm 60W/230',I=60/230,R=230**2/60); put('ohm 2kW/8.7',U=2000/8.7,R=2000/8.7**2); put('ohm 100W/4',U=20,I=5); put('ohm 5/220',I=5/220,P=25/220)
 # teljesitmeny
 S=S3*400*16; put('telj 3f',P=S*.9,S=S,Q=S*math.sqrt(1-.81)); put('telj 1f 230 5 .8',P=920,S=1150,Q=690); S=S3*400*32; put('telj 3f 32',P=S*.85,S=S)
 # aram
 put('aram 3000',I=3000/230); put('aram 11k',I=11000/(S3*400)); put('aram 2k',I=2000/(230*.9*.95)); put('aram 7.2k',I=7200/(S3*400*.95))
 # meddo
 put('meddo PQ',S=5000,cos=.6,tan=4/3,phi=math.degrees(math.atan2(4,3)))
 # vezetek
 r20=0.017241;a=0.00393
 put('vez 100 2.5 20',R=r20*100/2.5,Rkm=r20*1000/2.5); r70=r20*(1+a*50); put('vez 70',R=r70*200/2.5,rho=r70)
 put('vez al',R=0.028264*100/16); put('vez rho1',R=rho1*2*23.4/2.5); put('vez 0C',R=r20*(1+a*-20)*1000/1.5)
 # eredo
 put('eredo par',Re=1/(1/10+1/22+1/47)); put('eredo hiany 1k',Rx=1/(1/1000-1/2200-1/4700))
 # fogyasztas
 d=(10*24+60*5*3)/1000; put('fogy router',nap=d,ev=d*365); d=(100*24+60*5*3)/1000; put('fogy hu',nap=d,ev=d*365,ho=d*365/12)
 put('fogy 1500',ev=547.5,ft_ev=547.5*70,ft_ho=547.5*70/12)
 # fazis
 def IN(a,b,c): return math.sqrt(a*a+b*b+c*c-a*b-b*c-c*a)
 def imb(w): avg=sum(w)/3; return max(abs(x-avg) for x in w)/avg*100
 put('fazis W',total=1100,imbalance=imb([600,400,100]),IN=IN(600/230,400/230,100/230)); put('fazis 20/10/5',IN=IN(20,10,5),imbalance=imb([20,10,5]))
 # atvalto
 d12=0.127*92**((36-12)/39); put('awg12',mm2=math.pi/4*d12**2,d=d12); put('awg-3',mm2=math.pi/4*(0.127*92**(39/39))**2)
 put('kW',LE=7500/735.49875,hp=7500/745.69987158227022); put('LE',kW=10*735.49875/1000); put('d2.5',d=math.sqrt(4*2.5/math.pi)); put('1.78',mm2=math.pi/4*1.78**2)
 # kapacitas
 put('C ser 123',Ce=1/(1/1e-6+1/2e-6+1/3e-6))
 # oszto
 put('oszto 5',Uki=5*4.7/14.7); R2=10000*3.3/(12-3.3); put('oszto r2',R2=R2,Ue24=12*3900/13900)
 # lumen
 for nm,A,E,F,eta,k in [('lum20',20,500,4000,.5,.8),('lum12',12,300,800,.5,.8),('lum30',30,200,1500,.6,.8)]:
   N=math.ceil(E*A/(F*eta*k)); put(nm,N=N,E=N*F*eta*k/A)
 # csillag
 s=10*20+20*30+30*10; put('y2d',R12=s/30,R23=s/10,R31=s/20)
 # trafo
 put('trafo',I1=60/230,a=230/12); put('trafo 3f',I1=100e3/(S3*10e3),I2=100e3/(S3*400)); put('trafo N2',N2=1000/(230/12)); put('trafo 24',I2=160/24,I1=160/230)
 # akku
 put('akku 50Ah',t=50*24*.5*.85/100,I=100/(24*.85))
 # led
 put('led12',Ia=10/510,P=(10/510)**2*510)
 # rezonancia
 put('XL',XL=2*math.pi*50*.1); put('XC',XC=1/(2*math.pi*50*10e-6)); put('f0',f0=1/(2*math.pi*math.sqrt(10e-3*100e-9)),Z0=math.sqrt(10e-3/100e-9)); put('XL1k',XL=2*math.pi*1000*1e-3)
 # homerseklet
 put('100F',C=(100-32)*5/9,K=(100-32)*5/9+273.15); put('Cu 70',R2=10*(1+a*50)); put('Al 80',R2=5*(1+0.00403*60))
 # feszultseges
 p=2*23.4*16*rho1/2.5/U0*100; put('fesz 1f',dU=p/100*230,pct=p,Lmax=.05*230/(2*16*rho1/2.5))
 sn=math.sqrt(1-.81); p=50*32*(rho1*.9/6+lam*sn)/U0*100; put('fesz 3f',pct=p,dU=p/100*400)
 p=2*30*10*rho1/1.5/U0*100; put('fesz vil',pct=p,Lmax=.03*230/(2*10*rho1/1.5))
 # motor
 put('motor 5.5',I=5500/(S3*400*.85*.87)); put('motor 1f',I=750/(230*.8*.7)); I=7500/(S3*400*.86*.89); put('motor 7.5',I=I,Ia=7*I); put('motor 10LE',I=7354.9875/(S3*400*.85*.88))
 # fazisjavitas
 t=lambda c: math.sqrt(1-c*c)/c; w=2*math.pi*50; Qc=10e3*(t(.7)-t(.95)); put('fj delta',Qc=Qc,C=Qc/(3*w*400**2)); put('fj csillag',C=Qc/(w*400**2))
 Qc=1e3*(t(.6)-t(.95)); put('fj 1f',Qc=Qc,C=Qc/(w*230**2),I1=1000/(230*.6),I2=1000/(230*.95))
 # keresztmetszet / tabla
 put('kmsz 35C',Iz=30*.94); put('tabla 35/3',s2_5=23*.94*.7)
 # hurok
 for nm,Ze,L,A,Ape,m,In in [('hurok golden',.35,25,2.5,2.5,5,16),('hurok B10',.5,40,1.5,1.5,5,10),('hurok C16',.35,25,2.5,2.5,10,16),('hurok PE',.3,20,2.5,1.5,5,16)]:
   Zs=Ze+rho1*L*(1/A+1/Ape); mx=U0/(m*In); put(nm,Zs=Zs,Ik=U0/Zs,ZsMax=mx,Lmax=(mx-Ze)/(rho1*(1/A+1/Ape)))
 for k,v in out.items(): print(k, {a:float('%.6g'%b) for a,b in v.items()})
def extra():
 S3=math.sqrt(3); rho1=0.0225; lam=0.00008; U0=230
 cases=[]
 def c(slug,inp,**exp): cases.append((slug,inp,{k:float('%.6g'%v) for k,v in exp.items()}))
 c('ohm-torveny',{'ismert':'UR','U':'400','R':'20'},I=20,P=8000)
 c('ohm-torveny',{'ismert':'UI','U':'1,5','I':'300','I.e':'mA'},R=5,P=0.45)
 c('ohm-torveny',{'ismert':'PR','P':'2','P.e':'kW','R':'26,45'},U=math.sqrt(2000*26.45),I=math.sqrt(2000/26.45))
 c('ohm-torveny',{'ismert':'IR','I':'16','R':'0,5'},U=8,P=128)
 c('teljesitmeny',{'rendszer':'1f','U':'230','I':'16','cos':'0,95'},P=230*16*.95,S=3680)
 c('teljesitmeny',{'rendszer':'3f','Uv':'400','I':'25','cos':'1'},P=S3*400*25,Q=0)
 c('teljesitmeny',{'rendszer':'dc','Udc':'12','I':'8,5'},P=102)
 c('aram-teljesitmenybol',{'rendszer':'3f','P':'22','P.e':'kW','Uv':'400','cos':'0,9','eta':'1'},I=22000/(S3*400*.9),mcb=40)
 c('aram-teljesitmenybol',{'rendszer':'1f','P':'1500','U':'230','cos':'1','eta':'1'},I=1500/230,mcb=8)
 c('aram-teljesitmenybol',{'rendszer':'dc','P':'300','Udc':'24','eta':'0,9'},I=300/(24*.9))
 c('latszolagos-meddo-teljesitmeny',{'mod':'PQ','P':'12','P.e':'kW','Q':'5','Q.e':'kvar'},S=13000,cos=12/13)
 c('latszolagos-meddo-teljesitmeny',{'mod':'Scos','S':'100','S.e':'kVA','cos':'0,85'},P=85000,Q=100000*math.sqrt(1-.85**2))
 c('vezetek-ellenallas',{'anyag':'Cu','mod':'rho20','L':'50','A':'1,5','theta':'20','ut':'2'},R=0.017241*100/1.5)
 c('vezetek-ellenallas',{'anyag':'Al','mod':'rho20','L':'200','A':'25','theta':'70','ut':'1'},R=0.028264*(1+0.00403*50)*200/25)
 c('vezetek-ellenallas',{'anyag':'Cu','mod':'rho1','L':'40','A':'4','ut':'2'},R=rho1*80/4)
 c('eredo-ellenallas',{'mod':'parhuzamos','R':'1; 1; 1; 1','R.e':'kohm'},Re=250)
 c('eredo-ellenallas',{'mod':'soros','R':'0,5; 0,25','R.e':'ohm'},Re=0.75)
 c('eredo-ellenallas',{'mod':'hianyzo','Re':'50','Re.e':'ohm','Rk':'100; 300','Rk.e':'ohm'},Rx=1/(1/50-1/100-1/300))
 c('fogyasztas-koltseg',{'sorok':'800*2*1;40*10*5','ar':'50'},nap=(1600+2000)/1000,ev=3.6*365,ft_ev=3.6*365*50)
 c('fogyasztas-koltseg',{'sorok':'5*24*4'},nap=0.48,ho=0.48*365/12)
 c('fazisterheles',{'mod':'A','L1':'32','L2':'25','L3':'16'},IN=math.sqrt(32**2+25**2+16**2-32*25-25*16-16*32),imbalance=max(abs(x-73/3) for x in [32,25,16])/(73/3)*100)
 c('fazisterheles',{'mod':'W','P1':'3','P1.e':'kW','P2':'3','P2.e':'kW','P3':'0','P3.e':'kW'},IN=3000/230,total=6000)
 c('mertekegyseg-atvalto',{'mod':'teljesitmeny','P':'1','P.e':'hp'},kW=0.74569987158227022,LE=745.69987158227022/735.49875)
 c('mertekegyseg-atvalto',{'mod':'awg','awg':'10'},mm2=math.pi/4*(0.127*92**(26/39))**2)
 c('mertekegyseg-atvalto',{'mod':'awg','awg':'14'},mm2=math.pi/4*(0.127*92**(22/39))**2)
 c('mertekegyseg-atvalto',{'mod':'energia','E':'18','E.e':'MJ'},kWh=5)
 c('mertekegyseg-atvalto',{'mod':'atmero','d':'2,26'},mm2=math.pi/4*2.26**2)
 c('eredo-kapacitas',{'mod':'soros','C':'100; 100; 100','C.e':'nF'},Ce=100e-9/3)
 c('eredo-kapacitas',{'mod':'parhuzamos','C':'4,7; 2,2; 1','C.e':'uF'},Ce=7.9e-6)
 c('feszultsegoszto',{'mod':'kimenet','Ube':'24','R1':'33','R1.e':'kohm','R2':'10','R2.e':'kohm'},Uki=24*10/43)
 c('feszultsegoszto',{'mod':'r2','Ube':'5','R1':'10','R1.e':'kohm','Uki':'2,5'},R2=10000)
 c('ellenallas-szinkod',{'savok':'4','s1':'barna','s2':'zold','szorzo':'piros','tures':'arany'},R=1500)
 c('ellenallas-szinkod',{'savok':'5','s1':'piros','s2':'piros','s3':'fekete','szorzo':'narancs','tures':'barna'},R=220000,tol=1)
 c('ellenallas-szinkod',{'savok':'4','s1':'kek','s2':'szurke','szorzo':'zold','tures':'ezust'},R=6.8e6,tol=10)
 c('lumen-lux',{'mod':'darab','A':'50','E':'300','fi':'3000','eta':'0,6','k':'0,8'},N=math.ceil(15000/1440),E=math.ceil(15000/1440)*1440/50)
 c('lumen-lux',{'mod':'megvilagitas','A':'8','N':'2','fi':'800','eta':'0,5','k':'0,8'},E=2*800*.4/8)
 c('csillag-delta',{'mod':'y2d','R1':'5','R2':'5','R3':'10'},R12=(25+50+50)/10,R23=125/5,R31=125/5)
 c('csillag-delta',{'mod':'d2y','R12':'10','R23':'20','R31':'30'},R1=10*30/60,R2=10*20/60,R3=20*30/60)
 c('transzformator',{'rendszer':'1f','U1':'400','U2':'230','S':'2','S.e':'kVA'},a=400/230,I1=5,I2=2000/230)
 c('transzformator',{'rendszer':'3f','U1':'20','U1.e':'kV','U2':'400','S':'630','S.e':'kVA'},I1=630e3/(S3*20e3),I2=630e3/(S3*400))
 c('akkumulator-uzemido',{'C':'7','C.e':'Ah','U':'12','dod':'100','eta':'0,85','P':'30'},t=7*12*.85/30)
 c('akkumulator-uzemido',{'C':'280','C.e':'Ah','U':'48','dod':'90','eta':'0,95','P':'2','P.e':'kW'},t=280*48*.9*.95/2000)
 c('led-elotet-ellenallas',{'Us':'9','Uf':'2,1','I':'15','I.e':'mA','n':'1'},R=6.9/0.015,Re24=470)
 c('led-elotet-ellenallas',{'Us':'24','Uf':'3,2','I':'20','I.e':'mA','n':'6'},R=(24-19.2)/0.02,Re24=240)
 c('reaktancia-rezonancia',{'mod':'xc','f':'1','f.e':'kHz','C':'100','C.e':'nF'},XC=1/(2*math.pi*1000*100e-9))
 c('reaktancia-rezonancia',{'mod':'f0','L':'1','L.e':'H','C':'10','C.e':'uF'},f0=1/(2*math.pi*math.sqrt(1e-5)))
 c('homerseklet',{'mod':'atvaltas','T':'300','egyseg':'K'},C=26.85,F=26.85*9/5+32)
 c('homerseklet',{'mod':'ellenallas','anyag':'Cu','R1':'2,5','t1':'15','t2':'95'},R2=2.5*(1+0.00393*75)/(1+0.00393*-5))
 # T1 (kiadatlan, de a számítás tesztelt)
 c('feszultseges',{'rendszer':'1f','I':'10','L':'50','A':'2,5','cos':'0,9','hatar':'public-other'},pct=2*50*10*(rho1*.9/2.5+lam*math.sqrt(1-.81))/230*100)
 c('feszultseges',{'rendszer':'3f','I':'63','L':'30','A':'16','cos':'1','hatar':'private-other'},pct=30*63*rho1/16/230*100,Lmax=.08*230/(63*rho1/16))
 c('motor-aram',{'rendszer':'3f','P':'15','P.e':'kW','Uv':'400','cos':'0,86','eta':'0,91'},I=15000/(S3*400*.86*.91))
 c('led-szalag-tapegyseg',{'L':'12','pm':'19,2','U':'24','r':'20'},P=230.4,I=9.6,psu=320)
 c('fazisjavitas',{'P':'50','P.e':'kW','cos1':'0,8','cos2':'0,95','kotes':'delta','Uv':'400','f':'50'},Qc=50e3*(0.75-math.sqrt(1-.95**2)/.95))
 c('keresztmetszet',{'In':'40','mod':'C','szig':'PVC','erek':'3','temp':'30','csop':'1'},A=6,Iz=41)
 c('keresztmetszet',{'In':'16','mod':'B2','szig':'PVC','erek':'2','temp':'45','csop':'2'},A=4,Iz=30*.79*.8)
 c('kismegszakito',{'Ib':'30','A':'6','mod':'B2','szig':'PVC','erek':'3','temp':'30','csop':'1','gorbe':'C'},In=32,Iz=34,ZsMax=230/320)
 c('hurokimpedancia',{'Ze':'0,2','L':'60','A':'4','gorbe':'B','In':'20'},Zs=0.2+rho1*60*0.5,Lmax=(2.3-0.2)/(rho1*0.5))
 c('terhelhetoseg-tablazat',{'mod':'A1','szig':'PVC','erek':'3','temp':'40','csop':'4'},s10=42*.87*.65,s1_5=13.5*.87*.65)
 print('const EXTRA:Golden[]=[')
 for slug,inp,exp in cases: print(' {slug:%s,input:%s,expect:%s},'%(json.dumps(slug),json.dumps(inp,ensure_ascii=False),json.dumps(exp)))
 print('];')
 print('//',len(cases))
examples() if MODE=="examples" else extra()
