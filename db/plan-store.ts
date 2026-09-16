import {env} from "cloudflare:workers";
export function planDb(){if(!env.DB)throw Error("A tervadatbázis nem érhető el.");return env.DB}

