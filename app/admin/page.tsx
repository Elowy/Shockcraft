import {getAccount} from '@/lib/auth';
import {isAdmin} from '@/lib/billing';
import AdminBilling from '@/components/admin-billing';
export const dynamic='force-dynamic';
export default async function AdminPage(){const account=await getAccount();if(!isAdmin(account))return <main className="admin-page"><h1>Adminisztráció</h1><p>Ehhez a felülethez az adminisztrátori fiókkal kell bejelentkezned.</p><a href="/">Vissza a ShockCrafthoz és bejelentkezés</a></main>;return <AdminBilling/>}
