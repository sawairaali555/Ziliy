import Store from "./store";
import {catalog,settings} from "@/lib/store-data";
export const dynamic="force-dynamic";
export default async function Page(){try{const [items,config]=await Promise.all([catalog(),settings()]);return <Store path={[]} initialProducts={items} config={config}/>;}catch{return <main className="wrap section"><h1>We’ll be right back</h1><p>The store is temporarily unavailable. Please refresh in a moment.</p></main>;}}
