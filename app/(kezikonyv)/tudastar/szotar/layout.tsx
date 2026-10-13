import {Shell} from '@/components/kezikonyv/shell';

/** A szakszótár az Elmélet része (a fülsor az Elméletet emeli ki). */
export default function SzotarLayout({children}:{children:React.ReactNode}){
 return <Shell section="elmelet">{children}</Shell>;
}
