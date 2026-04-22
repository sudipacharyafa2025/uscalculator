import { ReactNode } from "react";
import SEO from "@/components/SEO";
import { useLocale } from "@/hooks/useLocale";
import { withLocale, type Locale } from "@/i18n/locale";

type StaticContent = { title: string; description: string; paragraphs: string[] };

const CONTENT: Record<Locale, Record<"about" | "privacy" | "terms", StaticContent>> = {
  en: {
    about: {
      title: "About Us",
      description: "USCalculator.online is a free collection of 60+ professional calculators for finance, health and mathematics.",
      paragraphs: [
        "USCalculator.online is a free, professional collection of online calculators covering finance, health and mathematics. Our mission is to help everyone make better decisions with clear, accurate numbers — instantly, on any device.",
        "Every calculator is built on transparent, well-documented formulas: standard amortization for loans, the Mifflin–St Jeor equation for calorie needs, the U.S. Navy method for body fat, and rigorous statistical methods for data tools. Where applicable, we show the math behind the result.",
        "We do not collect personal information about your calculations — everything runs locally in your browser.",
      ],
    },
    privacy: {
      title: "Privacy Policy",
      description: "USCalculator.online respects your privacy. All calculations run locally in your browser.",
      paragraphs: [
        "USCalculator.online respects your privacy. All calculations are performed entirely in your browser. We do not collect, store or transmit any inputs, results or personal data to our servers.",
        "Cookies & analytics: We may use anonymous, aggregated analytics to understand which calculators are most used so we can improve them. No personally identifiable information is collected.",
        "Third parties: We do not share any user data with third parties.",
        "Contact: Questions about privacy can be sent through our contact channel.",
      ],
    },
    terms: {
      title: "Terms of Use",
      description: "Terms of use for the USCalculator.online free online calculators.",
      paragraphs: [
        "By using USCalculator.online, you agree to the following terms.",
        "Informational purposes only: All calculators provide estimates for informational and educational purposes. They are not financial, medical or legal advice. Always consult a qualified professional before making important decisions.",
        "No warranty: Results are provided \"as is\" without warranty of accuracy or fitness for any particular purpose. We are not liable for any decisions made based on these calculations.",
        "Acceptable use: You may use the calculators for personal and commercial purposes free of charge. You may not redistribute the underlying source code without permission.",
      ],
    },
  },
  fr: {
    about: {
      title: "À propos de nous",
      description: "USCalculator.online est une collection gratuite de plus de 60 calculateurs professionnels pour la finance, la santé et les mathématiques.",
      paragraphs: [
        "USCalculator.online est une collection gratuite et professionnelle de calculateurs en ligne couvrant la finance, la santé et les mathématiques. Notre objectif est d'aider chacun à prendre de meilleures décisions grâce à des chiffres clairs et précis, instantanément et sur n'importe quel appareil.",
        "Chaque calculateur s'appuie sur des formules transparentes et bien documentées : amortissement standard pour les prêts, équation de Mifflin-St Jeor pour les besoins caloriques, méthode de l'U.S. Navy pour le taux de graisse corporelle et méthodes statistiques rigoureuses pour les outils de données. Lorsque c'est pertinent, nous expliquons le calcul derrière le résultat.",
        "Nous ne collectons aucune information personnelle liée à vos calculs : tout s'exécute localement dans votre navigateur.",
      ],
    },
    privacy: {
      title: "Politique de confidentialité",
      description: "USCalculator.online respecte votre vie privée. Tous les calculs sont effectués localement dans votre navigateur.",
      paragraphs: [
        "USCalculator.online respecte votre vie privée. Tous les calculs sont effectués entièrement dans votre navigateur. Nous ne collectons, ne stockons ni ne transmettons vos saisies, résultats ou données personnelles à nos serveurs.",
        "Cookies et analyses : nous pouvons utiliser des statistiques anonymes et agrégées afin de comprendre quels calculateurs sont les plus utilisés et de les améliorer. Aucune information permettant de vous identifier personnellement n'est collectée.",
        "Tiers : nous ne partageons aucune donnée utilisateur avec des tiers.",
        "Contact : toute question relative à la confidentialité peut être envoyée via notre canal de contact.",
      ],
    },
    terms: {
      title: "Conditions d'utilisation",
      description: "Conditions d'utilisation des calculateurs gratuits USCalculator.online.",
      paragraphs: [
        "En utilisant USCalculator.online, vous acceptez ces conditions.",
        "À titre informatif uniquement : tous les calculateurs fournissent des estimations à des fins d'information et d'éducation. Ils ne constituent pas des conseils financiers, médicaux ou juridiques. Consultez toujours un professionnel qualifié avant de prendre des décisions importantes.",
        "Absence de garantie : les résultats sont fournis « en l'état », sans garantie d'exactitude ni d'adéquation à un usage particulier. Nous ne sommes pas responsables des décisions prises sur la base de ces calculs.",
        "Utilisation acceptable : vous pouvez utiliser gratuitement les calculateurs à des fins personnelles et commerciales. Vous ne pouvez pas redistribuer le code source sous-jacent sans autorisation.",
      ],
    },
  },
  es: {
    about: {
      title: "Sobre nosotros",
      description: "USCalculator.online es una colección gratuita de más de 60 calculadoras profesionales para finanzas, salud y matemáticas.",
      paragraphs: [
        "USCalculator.online es una colección gratuita y profesional de calculadoras en línea para finanzas, salud y matemáticas. Nuestra misión es ayudar a cualquier persona a tomar mejores decisiones con cifras claras y precisas, al instante y desde cualquier dispositivo.",
        "Cada calculadora se basa en fórmulas transparentes y bien documentadas: amortización estándar para préstamos, ecuación de Mifflin-St Jeor para necesidades calóricas, método de la Marina de EE. UU. para grasa corporal y métodos estadísticos rigurosos para herramientas de datos. Cuando corresponde, mostramos la matemática detrás del resultado.",
        "No recopilamos información personal sobre tus cálculos: todo se ejecuta localmente en tu navegador.",
      ],
    },
    privacy: {
      title: "Política de privacidad",
      description: "USCalculator.online respeta tu privacidad. Todos los cálculos se ejecutan localmente en tu navegador.",
      paragraphs: [
        "USCalculator.online respeta tu privacidad. Todos los cálculos se realizan íntegramente en tu navegador. No recopilamos, almacenamos ni transmitimos entradas, resultados ni datos personales a nuestros servidores.",
        "Cookies y analítica: podemos usar analítica anónima y agregada para entender qué calculadoras se utilizan más y así mejorarlas. No se recopila información de identificación personal.",
        "Terceros: no compartimos datos de usuarios con terceros.",
        "Contacto: las preguntas sobre privacidad pueden enviarse a través de nuestro canal de contacto.",
      ],
    },
    terms: {
      title: "Términos de uso",
      description: "Términos de uso de las calculadoras gratuitas de USCalculator.online.",
      paragraphs: [
        "Al usar USCalculator.online, aceptas estos términos.",
        "Solo con fines informativos: todas las calculadoras proporcionan estimaciones con fines informativos y educativos. No constituyen asesoramiento financiero, médico ni legal. Consulta siempre a un profesional cualificado antes de tomar decisiones importantes.",
        "Sin garantía: los resultados se proporcionan «tal cual», sin garantía de exactitud ni idoneidad para un fin concreto. No somos responsables de ninguna decisión tomada con base en estos cálculos.",
        "Uso aceptable: puedes usar las calculadoras de forma gratuita para fines personales y comerciales. No puedes redistribuir el código fuente subyacente sin permiso.",
      ],
    },
  },
  nl: {
    about: {
      title: "Over ons",
      description: "USCalculator.online is een gratis verzameling van meer dan 60 professionele calculators voor financiën, gezondheid en wiskunde.",
      paragraphs: [
        "USCalculator.online is een gratis, professionele verzameling online calculators voor financiën, gezondheid en wiskunde. Onze missie is iedereen te helpen betere beslissingen te nemen met duidelijke, nauwkeurige cijfers, direct en op elk apparaat.",
        "Elke calculator is gebouwd op transparante, goed gedocumenteerde formules: standaard amortisatie voor leningen, de Mifflin-St Jeor-vergelijking voor caloriebehoefte, de U.S. Navy-methode voor lichaamsvet en solide statistische methoden voor datatools. Waar relevant tonen we de berekening achter het resultaat.",
        "We verzamelen geen persoonlijke informatie over uw berekeningen: alles draait lokaal in uw browser.",
      ],
    },
    privacy: {
      title: "Privacybeleid",
      description: "USCalculator.online respecteert uw privacy. Alle berekeningen worden lokaal in uw browser uitgevoerd.",
      paragraphs: [
        "USCalculator.online respecteert uw privacy. Alle berekeningen worden volledig in uw browser uitgevoerd. We verzamelen, bewaren of verzenden geen invoer, resultaten of persoonlijke gegevens naar onze servers.",
        "Cookies en analyse: we kunnen anonieme, geaggregeerde analyses gebruiken om te begrijpen welke calculators het meest worden gebruikt, zodat we ze kunnen verbeteren. Er wordt geen persoonlijk identificeerbare informatie verzameld.",
        "Derden: we delen geen gebruikersgegevens met derden.",
        "Contact: vragen over privacy kunt u via ons contactkanaal sturen.",
      ],
    },
    terms: {
      title: "Gebruiksvoorwaarden",
      description: "Gebruiksvoorwaarden voor de gratis calculators van USCalculator.online.",
      paragraphs: [
        "Door USCalculator.online te gebruiken, gaat u akkoord met deze voorwaarden.",
        "Alleen voor informatieve doeleinden: alle calculators geven schattingen voor informatieve en educatieve doeleinden. Ze vormen geen financieel, medisch of juridisch advies. Raadpleeg altijd een gekwalificeerde professional voordat u belangrijke beslissingen neemt.",
        "Geen garantie: resultaten worden geleverd zoals ze zijn, zonder garantie op nauwkeurigheid of geschiktheid voor een bepaald doel. Wij zijn niet aansprakelijk voor beslissingen die op basis van deze berekeningen worden genomen.",
        "Toegestaan gebruik: u mag de calculators gratis gebruiken voor persoonlijke en commerciële doeleinden. U mag de onderliggende broncode niet zonder toestemming herdistribueren.",
      ],
    },
  },
  ar: {
    about: {
      title: "من نحن",
      description: "USCalculator.online مجموعة مجانية تضم أكثر من 60 حاسبة احترافية للمالية والصحة والرياضيات.",
      paragraphs: [
        "USCalculator.online هو مجموعة مجانية واحترافية من الحاسبات عبر الإنترنت تغطي المالية والصحة والرياضيات. مهمتنا هي مساعدة الجميع على اتخاذ قرارات أفضل من خلال أرقام واضحة ودقيقة فوراً ومن أي جهاز.",
        "تعتمد كل حاسبة على صيغ شفافة وموثقة جيداً: جداول السداد القياسية للقروض، ومعادلة Mifflin-St Jeor للاحتياجات الحرارية، وطريقة البحرية الأمريكية لنسبة الدهون في الجسم، وأساليب إحصائية دقيقة لأدوات البيانات. وعند الحاجة، نعرض طريقة الحساب وراء النتيجة.",
        "لا نجمع أي معلومات شخصية عن حساباتك، فكل شيء يعمل محلياً داخل متصفحك.",
      ],
    },
    privacy: {
      title: "سياسة الخصوصية",
      description: "يحترم USCalculator.online خصوصيتك. تتم جميع الحسابات محلياً داخل متصفحك.",
      paragraphs: [
        "يحترم USCalculator.online خصوصيتك. تتم جميع الحسابات بالكامل داخل متصفحك. نحن لا نجمع أو نخزن أو ننقل أي مدخلات أو نتائج أو بيانات شخصية إلى خوادمنا.",
        "ملفات تعريف الارتباط والتحليلات: قد نستخدم تحليلات مجهولة ومجمعة لفهم الحاسبات الأكثر استخداماً حتى نتمكن من تحسينها. لا يتم جمع أي معلومات تعريف شخصية.",
        "الأطراف الثالثة: لا نشارك أي بيانات مستخدم مع أطراف ثالثة.",
        "التواصل: يمكن إرسال الأسئلة المتعلقة بالخصوصية عبر قناة التواصل الخاصة بنا.",
      ],
    },
    terms: {
      title: "شروط الاستخدام",
      description: "شروط استخدام حاسبات USCalculator.online المجانية.",
      paragraphs: [
        "باستخدامك USCalculator.online فأنت توافق على هذه الشروط.",
        "لأغراض معلوماتية فقط: تقدم جميع الحاسبات تقديرات لأغراض معلوماتية وتعليمية. ولا تُعد نصيحة مالية أو طبية أو قانونية. استشر دائماً متخصصاً مؤهلاً قبل اتخاذ قرارات مهمة.",
        "عدم الضمان: تقدم النتائج كما هي، دون أي ضمان للدقة أو الملاءمة لأي غرض محدد. نحن غير مسؤولين عن أي قرارات تُتخذ بناءً على هذه الحسابات.",
        "الاستخدام المقبول: يمكنك استخدام الحاسبات مجاناً للأغراض الشخصية والتجارية. لا يجوز لك إعادة توزيع الكود المصدري الأساسي دون إذن.",
      ],
    },
  },
  ja: {
    about: {
      title: "私たちについて",
      description: "USCalculator.online は、金融・健康・数学に対応した60種類以上の無料プロ向け計算ツール集です。",
      paragraphs: [
        "USCalculator.online は、金融・健康・数学を対象とした無料のプロ向けオンライン計算ツール集です。私たちは、明確で正確な数値をあらゆる端末で即座に提供し、より良い意思決定を支援することを目指しています。",
        "各計算ツールは、ローンの標準的な償却計算、必要カロリーを求める Mifflin-St Jeor 式、体脂肪率を推定する米海軍方式、データ分析のための厳密な統計手法など、透明性が高く十分に文書化された式に基づいています。必要に応じて、結果の背景にある計算も示します。",
        "計算に関する個人情報は収集しません。すべての処理はお使いのブラウザ内でローカルに実行されます。",
      ],
    },
    privacy: {
      title: "プライバシーポリシー",
      description: "USCalculator.online はプライバシーを尊重します。すべての計算はブラウザ内でローカルに実行されます。",
      paragraphs: [
        "USCalculator.online はプライバシーを尊重します。すべての計算は完全にブラウザ内で実行されます。入力内容、結果、個人データを当社サーバーに収集、保存、送信することはありません。",
        "Cookie と分析: 利用状況を把握して計算ツールを改善するため、匿名化および集計された分析データを使用する場合があります。個人を特定できる情報は収集しません。",
        "第三者: ユーザーデータを第三者と共有することはありません。",
        "お問い合わせ: プライバシーに関するご質問は、当社の連絡窓口からお送りいただけます。",
      ],
    },
    terms: {
      title: "利用規約",
      description: "USCalculator.online の無料計算ツールの利用規約。",
      paragraphs: [
        "USCalculator.online を利用することで本規約に同意したものとみなされます。",
        "情報提供のみを目的としています。すべての計算ツールは、情報提供および教育目的の推定値を提供するものです。金融、医療、法的助言ではありません。重要な判断を行う前には、必ず資格を有する専門家にご相談ください。",
        "保証の否認: 結果は正確性または特定目的への適合性を保証することなく、現状有姿で提供されます。これらの計算に基づいて行われた判断について、当社は責任を負いません。",
        "許容される利用: 計算ツールは個人利用および商用利用のいずれにも無料でご利用いただけます。基礎となるソースコードを許可なく再配布することはできません。",
      ],
    },
  },
};

function Page({ title, description, canonical, children }: { title: string; description: string; canonical: string; children: ReactNode }) {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-12 prose prose-sm">
      <SEO title={`${title} — USCalculator`} description={description} canonical={canonical} />
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">{title}</h1>
      <div className="text-foreground/80 space-y-4 leading-relaxed">{children}</div>
    </div>
  );
}

export function About() {
  const { locale } = useLocale();
  const content = CONTENT[locale].about;
  return <Page title={content.title} description={content.description} canonical={withLocale("/about", locale)}>
    {content.paragraphs.map((p) => <p key={p}>{p}</p>)}
  </Page>;
}

export function Privacy() {
  const { locale } = useLocale();
  const content = CONTENT[locale].privacy;
  return <Page title={content.title} description={content.description} canonical={withLocale("/privacy", locale)}>
    {content.paragraphs.map((p) => <p key={p}>{p}</p>)}
  </Page>;
}

export function Terms() {
  const { locale } = useLocale();
  const content = CONTENT[locale].terms;
  return <Page title={content.title} description={content.description} canonical={withLocale("/terms", locale)}>
    {content.paragraphs.map((p) => <p key={p}>{p}</p>)}
  </Page>;
}
