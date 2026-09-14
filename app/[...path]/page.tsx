import Store from "../store";
import {catalog,settings} from "@/lib/store-data";
export const dynamic="force-dynamic";
export default async function Page({params}:{params:Promise<{path:string[]}>}){const {path}=await params;let items,config;try{[items,config]=await Promise.all([catalog(),settings()]);}catch{return <main className="wrap section"><h1>We’ll be right back</h1><p>The store is temporarily unavailable. Please refresh in a moment.</p></main>;}return <Store path={path} initialProducts={items} config={config}/>;}
