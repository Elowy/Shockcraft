/** Strukturált adat (schema.org JSON-LD). A „<” escape-elve, így a tartalom nem zárhatja le a script elemet. */
export function JsonLd({data}:{data:Record<string,unknown>}){
 return <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(data).replace(/</g,'\\u003c')}}/>;
}
export const breadcrumbLd=(origin:string|null,items:{name:string;path:string}[])=>({
 '@context':'https://schema.org','@type':'BreadcrumbList',
 itemListElement:items.map((x,i)=>({'@type':'ListItem',position:i+1,name:x.name,item:(origin??'')+x.path})),
});
