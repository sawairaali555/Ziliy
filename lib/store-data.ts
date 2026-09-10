import { env } from 'cloudflare:workers';
import { products as seed, Product } from '@/app/catalog';
export type ManagedProduct=Product&{status:'Active'|'Draft';sku?:string;subcategory?:string;color?:string;option?:string;catalogOwner?:string;listingGroup?:string};
export type Settings={deliveryCharge:number;freeThreshold:number;supportEmail:string;whatsapp:string};
export const defaults:Settings={deliveryCharge:250,freeThreshold:5000,supportEmail:'',whatsapp:''};
export function database(){if(!env.DB)throw Error('Store database unavailable');return env.DB;}
export async function catalog(all=false):Promise<ManagedProduct[]>{const rows=await database().prepare('SELECT id, data, status FROM catalog_records').all<{id:string;data:string;status:'Active'|'Draft'}>();const merged=new Map<string,ManagedProduct>(seed.map(p=>[p.id,{...p,status:'Active'}]));for(const row of rows.results)merged.set(row.id,{...JSON.parse(row.data),id:row.id,status:row.status});return [...merged.values()].filter(p=>all||p.status==='Active');}
export async function settings():Promise<Settings>{const row=await database().prepare('SELECT data FROM store_settings WHERE id = ?').bind('store').first<{data:string}>();return {...defaults,...row?JSON.parse(row.data):{}};}
export const deliveryFor=(total:number,s:Settings)=>total>=s.freeThreshold?0:s.deliveryCharge;
