import {Shell} from '@/components/kezikonyv/shell';

export default function ElmeletLayout({children}:{children:React.ReactNode}){
 return <Shell section="elmelet">{children}</Shell>;
}
