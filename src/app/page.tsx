import { redirect } from "next/navigation";
import { headers } from "next/headers";

const locales = ["zh", "en"];
const defaultLocale = "zh";

export default async function RootPage() {
  const headersList = await headers();
  const acceptLang = headersList.get("accept-language") || "";

  let locale = defaultLocale;
  for (const loc of locales) {
    if (acceptLang.includes(loc)) {
      locale = loc;
      break;
    }
  }

  redirect(`/${locale}`);
}
