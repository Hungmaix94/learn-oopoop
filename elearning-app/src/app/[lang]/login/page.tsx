import { getDictionary, Locale } from '@/dictionaries'
import LoginForm from './LoginForm'

export default async function LoginPage({
    params
}: {
    params: Promise<{ lang: string }>
}) {
    const { lang } = await params;
    const dict = await getDictionary(lang as Locale);

    return <LoginForm dict={dict} lang={lang} />
}
