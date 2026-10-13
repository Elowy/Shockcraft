import {THEME_BOOT_SCRIPT} from '@/lib/kb/theme';

/** Inline indítószkript a kézikönyv-layout első elemeként: a <html data-theme> villanás nélkül áll be (statikus szöveg, nincs benne felhasználói adat). */
export function ThemeBoot(){
 return <script dangerouslySetInnerHTML={{__html:THEME_BOOT_SCRIPT}}/>;
}
