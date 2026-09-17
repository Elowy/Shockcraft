import PlanEditor from '@/components/plan-editor';
import {getChatGPTUser,chatGPTSignInPath,chatGPTSignOutPath} from './chatgpt-auth';
export const dynamic='force-dynamic';
export default async function Page(){const user=await getChatGPTUser();return <PlanEditor account={user?{userId:user.userId,displayName:user.displayName,email:user.email}:null} signIn={chatGPTSignInPath('/')} signOut={chatGPTSignOutPath('/')}/>}
