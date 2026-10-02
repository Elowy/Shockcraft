'use client';
import {useState} from 'react';
import {type Background,backgroundUrl} from '@/lib/background';
export function BackgroundImage({background:b}:{background?:Background}){const [failed,setFailed]=useState(false);if(!b?.visible)return null;return <g pointerEvents="none">{failed?<text x={b.x+10} y={b.y+24} fontSize="14" fill="#b45309">A háttérkép nem tölthető be. Nyisd meg a Háttéralaprajz beállításait.</text>:<image href={backgroundUrl(b.assetId)} x={b.x} y={b.y} width={b.w} height={b.h} opacity={b.opacity} preserveAspectRatio="none" onError={()=>setFailed(true)}/>}</g>}
