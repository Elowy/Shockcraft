import type {Plan} from './plan';
export function toggleDeviceCircuit(plan:Plan,buildingId:string,floorId:string,deviceId:string,circuitId:string){
 const building=plan.buildings.find(b=>b.id===buildingId),floor=building?.floors.find(f=>f.id===floorId),device=floor?.devices.find(d=>d.id===deviceId);
 if(!device)throw Error('A szerelvény nem található ezen a szinten.');
 if(!plan.circuits.some(c=>c.id===circuitId&&c.building===buildingId))throw Error('Válassz az épülethez tartozó áramkört.');
 device.circuit=device.circuit===circuitId?'':circuitId;
 return device.circuit;
}
