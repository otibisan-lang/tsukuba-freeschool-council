import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import type { ReactNode } from "react";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import LetterViewer from "./components/LetterViewer";
import LecturerDirectory from "./components/LecturerDirectory";

const letterArchive = [
  { ym: "2026-09", label: "2026年9月号", pickup: { school: "fermi cafe", url: "https://note.com/tfc298/n/n7c701ccf9ec2" } },
  { ym: "2026-08", label: "2026年8月号", pickup: { school: "つくばフリースクールKimiiro", url: "https://note.com/tfc298/n/nb3d0f361f44c" } },
  { ym: "2026-07", label: "2026年7月号" },
  { ym: "2026-06", label: "2026年6月号" },
  { ym: "2026-05", label: "2026年5月号" },
  { ym: "2026-04", label: "2026年4月号" },
];

function SharedHeader(){const [open,setOpen]=useState(false); return <header className="site-header"><a href="/" className="brand"><img className="brand-logo" src="/assets/council-logo.png" alt="つくばフリースクール等連携協議会"/><span><b>つくばフリースクール等連携協議会</b><small>TSUKUBA FREE SCHOOL NETWORK</small></span></a><button className="mobile-toggle" aria-label="メニューを開く" onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button><nav className={open?"open":""}><a href="/#schools" onClick={()=>setOpen(false)}>参加スクール</a><a href="/lecturers" onClick={()=>setOpen(false)}>出張講師</a><a href="/faq" onClick={()=>setOpen(false)}>よくある質問</a><a href="/parents" onClick={()=>setOpen(false)}>保護者の方へ</a><a href="/about" onClick={()=>setOpen(false)}>協議会とは</a><a className="nav-only-mobile" href="/donation" onClick={()=>setOpen(false)}>寄附をする</a><a className="nav-only-mobile" href="/join" onClick={()=>setOpen(false)}>会員登録</a></nav><div className="header-actions"><a className="header-cta" href="/donation">寄附をする</a><a className="header-cta header-cta-outline" href="/join">会員登録</a></div></header>}
function Page({ title, eyebrow, children }: { title: string; eyebrow: string; children: ReactNode }) { return <div className="site-page sky-page"><div className="sky-fixed" aria-hidden="true"/><SharedHeader/><main><section className="page-hero"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1></section>{children}</main><Footer/></div> }
function Footer(){return <footer><div className="footer-inner"><div><div className="brand footer-brand"><img className="brand-logo" src="/assets/council-logo-footer.png" alt="つくばフリースクール等連携協議会"/><span><b>つくばフリースクール等連携協議会</b><small>TSUKUBA FREE SCHOOL NETWORK</small></span></div><p>子ども一人ひとりが、自分に合った<br/>学びの場とつながれる地域へ。</p></div><div className="footer-links"><a href="/about">協議会について</a><a href="/join">ご参加について</a><a href="/faq">よくある質問</a><a href="/parents">お問い合わせ</a></div></div><div className="copyright">© TSUKUBA FREE SCHOOL NETWORK</div></footer>}
function PlaceholderPage({title, eyebrow, children}:{title:string;eyebrow:string;children:ReactNode}){return <Page title={title} eyebrow={eyebrow}><div className="simple-content">{children}</div></Page>}
const faqGroups=[
 {title:"フリースクール・居場所について",items:[
  ["フリースクール・オルタナティブスクール・居場所とは何ですか?",`どれも「学校以外の、子どもが安心して過ごせる・学べる場」を指す言葉ですが、少しずつニュアンスが違います。 
「フリースクール」は、不登校の子どもたちが自分のペースで過ごしたり学んだりできる施設です。学校に行っていたけど行けなくなった、傷ついたり疲れたりした子たちの心の回復を目的としていることが多いです。

一方、「オルタナティブスクール」は、既存の学校教育とは違う教育方針(イエナプラン、サドベリー教育など)を掲げる学びの場を指します。そのため、フリースクールよりもオルタナティブスクールの方が、小学校1年生からの受け入れを積極的に行う傾向があります。

「居場所」は、勉強よりも「安心して過ごせること」自体を目的にした、より緩やかな集まりを指すことが多いです。 子どもだけでなく、大人にもその場を開放している場所もあります。

厳密な定義があるわけではなく、実際には運営者によって呼び方も中身もさまざまです。また、フリースクールとオルタナティブスクール、あるいはフリースクールと居場所、複数の特色を持つ施設もあります。
`],
  ["民間のフリースクール以外に、無料で使える相談窓口や居場所はありますか?",`あります。フリースクールを探す前に、まずはお住まいの自治体が運営する無料の相談窓口・居場所を確認することをおすすめします。つくば市の場合は「つくば市教育相談支援センター」があり、相談だけでなく無料で利用できる「居場所」も運営されています(初回は電話での相談予約が必要です)。

民間のフリースクールに費用をかける前に、まず行政の窓口が合うかどうかを試してみる、という選び方があってもいいと思います。もちろん、合う・合わないは人それぞれです。無理にとは言いませんが、選択肢の一つとして知っておいていただければと思います。

✎ text:つくばフリースクール・コンシェルジュ(2026年2月10日 note投稿より)`],
  ["見学や体験だけでもできますか?入会前に何をすればいいですか?",`ほとんどのスクールで、見学・体験からのスタートが可能です。まずは気になるスクールに直接お問い合わせいただくか、事務局までご相談ください。お子さんとの相性は、実際に足を運んでみないと分からないことも多いので、複数の場所を見比べていただくこともおすすめです。`],
  ["学校に籍を置いたまま通えますか?転校する必要はありますか?",`在籍している学校は変わらずに、フリースクールやオルタナティブスクールに並行して通う形になります。転校する必要はありません。詳しくは、利用予定のスクールや在籍校にお尋ねください。`]
 ]},
 {title:"費用・制度について",items:[
  ["費用はだいたいどのくらいかかりますか?",`スクールによって差はありますが、月謝は3〜5万円程度が目安と言われています。ある保護者から聞いた実例として、月に1回しか通えなくても月謝は3万円だった、というお話もありました。

実際の例として、お子さん2人がそれぞれ別のスクールに通っているご家庭では、1人目が月謝48,400円(週最大5日通える契約)、2人目が32,000円(週3日の契約)だったそうです。

月謝以外にも、入学金(0円のところもあれば10万円ほどかかるところも)、送迎オプション代(例:月7,000円)、遠足などのイベント代(1,000〜2,000円程度、宿泊行事だと4万円台になることも)がかかる場合があります。地域や物価の影響で、これより高い価格帯のスクールも珍しくありません。

加盟スクールそれぞれの正確な料金は、各スクールのページや直接のお問い合わせでご確認ください。

✎ text:つくばフリースクール・コンシェルジュ(2026年2月13日・2月17日 note投稿より)`],
  ["つくば市がやっている補助金とは、どんな制度ですか?",`正式名称は「つくば市民間不登校児童生徒支援事業利用者支援交付金」です。フリースクールを利用する家庭向けに、子ども1人あたり上限月額20,000円が補助されます。

大きな特徴が3つあります。①世帯の所得制限がないこと、②月謝の一部ではなく全額に対して使えること(上限額まで)、③「1家庭あたり」ではなく「子ども1人あたり」であること。お子さんが2人フリースクールに通っていれば、最大で月4万円の補助を受けられる計算になります。

対象は通所・オンライン・訪問のいずれの民間支援事業も含まれ、市外のフリースクールに通う場合も(つくば市民であれば)対象になります。ただし対象になるのは「月謝」のみで、イベント代・送迎費・入学金・交通費は対象外です。また、スクール側に一定の開所条件(平日3日以上、8〜17時の間に4時間以上開所、など)があるため、通う予定のスクールに「うちは対象になりますか?」と確認しておくと確実です。

申請は4ヶ月に1回、利用後の事後申請です。2025年12月からは電子申請(いばらき電子申請・届出サービス)にも対応し、郵送や窓口への持参の手間が減りました。書類に不安があれば、つくば市役所 教育局 学び推進課(029-883-1111)で相談にのってもらえます。

つくば市公式サイト:利用者支援交付金について(外部サイト)
https://www.city.tsukuba.lg.jp/soshikikarasagasu/kyoikukyokumanabisuishinka/gyomuannai/2/1/1017965.html

✎ text:つくばフリースクール・コンシェルジュ(2026年2月22日 note投稿より)`],
  ["費用負担が重たいですが、つくば市の補助以外に、何か利用できる制度はありますか?",`いくつか可能性があります。

①茨城県フリースクール連携推進事業:住民税非課税世帯向け。フリースクール利用額の1/2を、月額上限15,000円まで補助。

②特別児童扶養手当(国の制度):発達障害などにより育児の負担が同年齢の子より大きい世帯向けの手当。1級(重度)月58,450円、2級(中度)月38,930円。所得制限あり。

③つくば市在宅障害児福祉手当:国の特別児童扶養手当とは別に、つくば市が独自に上乗せしている手当。月5,000円。所得制限なし。

④つくば市ひとり親家庭等児童福祉金:ひとり親世帯、または父・母が重度の障害(1・2級)を持つ世帯が対象。所得制限あり。

このほか、就学援助制度(経済的に就学が困難な家庭向け)の対象にフリースクール費用の一部が含まれる場合もありますが、運用は自治体ごとに異なるため、つくば市教育委員会へ個別にご確認ください。

✎ text:つくばフリースクール・コンシェルジュ(2026年2月22日 note投稿より、就学援助の部分のみ編集部にて追記)`]
 ]},
 {title:"通うにあたって",items:[
  ["フリースクールに通うと、学校の「出席扱い」になりますか?",`基本的には「なる」と考えて差し支えないかと思います。「最終的には在籍する学校の校長先生の判断」ということになっていますが、私が見聞きした中で、つくば市内のフリースクール・学校間で、出席扱いが認められなかったケースは聞いておりません。なお、文部科学省の考え方としては、①保護者と学校が十分に連携していること、②学習の状況を学校が把握できること、③施設に通って指導を受けていること、などが目安とされています。

加盟スクールの中には、出席扱いの実績があるところが多数ありますので、気になる場合はスクールに直接聞いてみてください。`],
  ["自力で送迎する保護者は、どうやっているんですか?",`子どもが公共交通機関を利用する事が難しい場合、親が自家用車でドアtoドアの送り迎えすることが多いです。在宅勤務・フレックスタイムなど働き方を調整したり、あるいは自宅から親の職場までの間にあるフリースクールを利用することにして、親の出勤ついでに送っていく方法もあります。また、保護者同士で相談の上、送迎を分担しあっている方もいます。

なお、送迎ありのスクールに送迎を任せる方法もありますが、送迎オプションがあるスクール自体、決して多くありません。子どもの通学をどうするのかは、フリースクールを利用する上で避けて通れない課題です。送迎をどうすればいいのかお困りの場合は、ぜひ各スクールにご相談ください。`],
  ["きょうだいで違うタイプのスクールに通うことはできますか?",`もちろん可能です。お子さんによって合う場所は異なります。協議会には、少人数でじっくり過ごせる場所、探究学習が中心の場所、体を動かす活動が多い場所など、特色の異なるスクールが加盟しています。きょうだいそれぞれに合った場所を選ぶことが最良と思います。しかし、もし子どもが自力で通学できない場合は、親の送迎の負担は増しますので、そこも十分に考えた上で決められることも大切です。`]
 ]},
 {title:"お子さんの様子・特性について",items:[
  ["発達障害でも受け入れてもらえますか?",`「発達障害の診断があること」だけを理由に受け入れを断るフリースクール・オルタナティブスクールは、基本的にありません。多くのスクールは、診断名そのものよりも「その子がその場の雰囲気に合っているか、馴染めるか」を重視しています。少人数のアットホームな環境では、感覚過敏による苦痛が和らぎ、穏やかに過ごせるケースも多いようです。

大切なのは、お子さんの「苦手なこと」を事前にスクール側へ伝えておくことです。例えば「急な予定変更が苦手なので早めに伝えてほしい」「口頭指示が入りにくいので視覚化してほしい」「忘れ物が多いので私物を置かせてほしい」など。規模の小さいフリースクールは、公立学校よりも柔軟に対応できることが多くあります。

一方で現実として、①他の子や自分を傷つける行動が繰り返される、②スタッフがつきっきりで対応する必要があり少人数体制では安全確保が難しい、といった「実態」を理由に、利用が難しいと判断されるケースもあります。これは診断名の有無ではなく、あくまでその時点での現実的なマッチングによるものです。

まずは隠さずに相談し、実際に体験に行ってみることをおすすめします。1つの場所で難しいと言われても、それはお子さんの否定ではなく、その場所の規模やメンバー構成と噛み合わなかっただけです。複数の場所を見学・体験してから決めることをおすすめします。

✎ text:つくばフリースクール・コンシェルジュ(2026年4月8日 note投稿より)`],
  ["子ども本人が「行きたくない」と言ったら、どうすればいいですか?",`無理に連れて行く必要はありません。フリースクールも「学校の代わりに行かなければならない場所」ではなく、本人が「行ってみたい」「ここなら大丈夫かも」と思えることが大切です。まずは保護者の方だけで見学に行ってみたり、お子さんと一緒にホームページや雰囲気を見てみたりするところから始めても構いません。

「どうすれば子どもが行く気になるか」を子ども自身に働きかけるより、「子どもが自ら『行きたい』と思える環境・選択肢を、親が用意すること」に力を注いだ方がうまくいく、という実感を語る保護者の声もあります。1ヶ所がダメでも、あちこち見学・体験するトライアンドエラーの先に、合う場所が見つかることもあります。焦らず、お子さんのペースに合わせていただければと思います。

✎ text:つくばフリースクール・コンシェルジュ(2026年3月25日 note投稿より)`],
  ["どのくらいの期間通うことになりますか?また学校に戻ることもできますか?",`期間は本当にお子さんによってさまざまです。数か月で学校に戻るお子さんもいれば、卒業までフリースクールで過ごすお子さんもいます。「一度フリースクールに通ったら、もう学校には戻れない」ということはありません。行き来しながら、そのときどきに合った場所を選んでいただいて大丈夫です。`],
  ["高校進学や、その先の進路はどうなりますか?",`フリースクールに通っていても、高校進学は可能です。通信制高校、定時制高校、全日制高校など選択肢は多くあります。加盟スクールの中には、進路相談や卒業生の進学実績を持つところもあります。詳しくは各スクール、またはお子さんの学年が近づいてきたタイミングで事務局にもご相談ください。`],
  ["「通信制高校のサポート校」とは何ですか?",`通信制高校は、レポート提出・スクーリング(登校して受ける授業)・テストで単位をそろえて卒業する仕組みで、登校日数が少なくてすむのが特徴です。ただ、その分「自分でペースを管理して進める」ことが必要になり、一人でやり切るのが難しいお子さんもいます。

「サポート校」は、その通信制高校に在籍する生徒が日々通い、レポートの進み具合を見てもらったり、友達と過ごしたり、行事に参加したりできる民間の教育施設です。ポイントは、サポート校そのものは「学校」ではなく、卒業資格や単位はあくまで提携している通信制高校から出るということ。サポート校だけに通っても高卒資格にはならず、通信制高校への在籍とセットになります。学費も、通信制高校の学費とサポート校の学費が別々にかかることが多いです。

フリースクールとの違いで言うと、フリースクールは主に小中学生の「学校の代わりの居場所・学びの場」であるのに対し、サポート校は高校生年代で、すでに通信制高校に在籍したうえで日々の生活・学習を支える場、というイメージです。加盟スクールの中に通信制高校と連携しているところがあるかは、各スクールに直接ご確認いただくのが確実です。`]
 ]},
 {title:"これからのこと",items:[["まずは何から始めればいいですか?誰に相談すればいいですか?",`「これを読んで、少し気になった」というだけで十分な一歩です。まずは保護者の方へページをご覧いただくか、気になるスクールに直接連絡してみてください。何を聞けばいいか分からない、という段階でもまったく問題ありません。当協議会の事務局にご相談いただくこともできます。`]]}
];
function FAQ(){return <PlaceholderPage title="よくある質問" eyebrow="FOR PARENTS"><p className="lead">保護者の方からよく寄せられる疑問に、Q&A形式でお答えします。</p><div className="faq-disclaimer">制度・金額に関する内容は、2026年時点の情報です。制度は変更されることがあるため、利用前に必ず自治体・各制度の公式情報をご確認ください。</div>{faqGroups.map(group=><section className="faq-group" key={group.title}><h2>{group.title}</h2>{group.items.map(([q,a],i)=><details className="faq-item" key={q}><summary><span>Q{i+1}</span>{q}<b>＋</b></summary><p>{a}</p></details>)}</section>)}</PlaceholderPage>}
function Router(){return <Switch><Route path="/" component={Home}/><Route path="/faq" component={FAQ}/><Route path="/lecturers"><PlaceholderPage title="出張講師" eyebrow="LECTURER NETWORK"><p className="lead">フリースクールへ、ご家庭へ。得意なことを届けてくれる地域の方々です</p><div className="notice-card lecturer-intro"><p>科学実験、プログラミング、音楽、アート、スポーツなど、自分の得意なことを子どもたちに届けたいという地域の方々を紹介しています。フリースクールへの出張はもちろん、ご家庭に直接おうかがいする「アウトリーチ（訪問支援）」を行っている方もいます。ホームスクーリングをされているご家庭も、お気軽にご利用ください。</p></div><p className="lecturer-note">※協議会が講師の派遣・仲介・契約を行うものではありません。</p><div className="jump-links"><a href="#mail-howto">▼ 講師へのメールの書き方</a><a href="#apply">▼ 出張講師として掲載を希望する方へ</a></div><h2>出張講師・アウトリーチの一覧</h2><LecturerDirectory/><h2 id="mail-howto">講師へのメールの書き方</h2><p>講師へご連絡される場合は、次の形式をお使いください。</p><pre className="mail-format">{`件名：つくばフリースクール等連携協議会の出張講師を見ました
内容：
（お名前）と申します。
つくばフリースクール等連携協議会のサイトで、出張講師の情報を拝見しました。
（ご依頼の目的、対象のお子さんの年齢、希望の日時・場所などをご記入ください）
ご都合を伺えればうれしいです。よろしくお願いいたします。`}</pre><h2 id="apply">出張講師として掲載を希望する方へ</h2><p>出張講師として活動したい方の掲載情報を募集しています。<br/><a href="/guides/lecturer-guide.pdf" target="_blank" rel="noreferrer">説明スライド</a>をご覧いただいた上で、以下の掲載依頼フォームからお申し込みください。</p><div className="lecturer-actions"><a className="button button-outline" href="/guides/lecturer-guide.pdf" target="_blank" rel="noreferrer">説明スライド</a><a className="button button-primary" href="https://docs.google.com/forms/d/e/1FAIpQLScM7cL0UC9FunwDEbRPi9Zl9CGl7LbM0sKlrdZvPpqGtO4gfw/viewform" target="_blank" rel="noreferrer">掲載依頼フォームはこちら →</a></div><p className="section-lead">送信後、事務局で内容を確認のうえ掲載します。掲載までお時間をいただく場合があります。</p><p className="pledge-note">掲載の依頼にあたり、次の2点について同意いただいています。<br/>・反社会的勢力ではないこと、また関係がないこと<br/>・子どもに対する犯罪(性犯罪を含む)で処罰を受けたことがないこと</p></PlaceholderPage></Route><Route path="/letters"><PlaceholderPage title="たよりアーカイブ" eyebrow="MONTHLY LETTER ARCHIVE"><p className="lead">つくば不登校・多様な学びの場だよりのバックナンバーです。</p><div className="archive-grid">{letterArchive.map(({ym,label,pickup})=><article className="archive-card" key={ym}><div className="archive-image archive-image-ready"><LetterViewer src={`/assets/tayori-${ym}.png`} alt={`つくば不登校・多様な学びの場だより ${label}`} downloadName={`tayori-${ym}.png`} shareText={`つくば周辺のフリースクール・オルタナティブスクールなどの、${label}の空き状況をシェアします。#つくばフリースクール等連携協議会`}/></div><p className="month">{label}</p>{pickup&&<a className="archive-pickup" href={pickup.url} target="_blank" rel="noreferrer">ピックアップ「{pickup.school}」の詳細はこちら →</a>}</article>)}</div></PlaceholderPage></Route><Route path="/parents"><PlaceholderPage title="保護者の方へ" eyebrow="FOR FAMILIES"><p className="lead">迷っているときも、うまく話せないときも。<br/>まずは事務局のコンシェルジュにご相談ください。</p><div className="support-grid"><div className="support-card blue"><span>01</span><h2>公式LINEで無料相談</h2><p>お子さんの状況やご希望を伺いながら、合いそうな学びの場を一緒に探します。</p><a href="https://lin.ee/NXsjrfK" target="_blank" rel="noreferrer" className="button">公式LINEで相談する →</a></div><div className="support-card peach"><span>02</span><h2>より手厚いサポート</h2><p>個別面談、スクール見学同行など、有料でのサポートもご案内しています。</p><div className="external-action"><a href="https://tfc298.pages.dev/" target="_blank" rel="noopener noreferrer" className="button">詳細を確認する →</a><small>別サイトが開きます</small></div></div></div></PlaceholderPage></Route><Route path="/about"><PlaceholderPage title="協議会について" eyebrow="ABOUT US"><p className="lead">私たちは、つくば市やその周辺のフリースクール・オルタナティブスクールなどのネットワークです。<br/>子ども一人ひとりが自分に合った学びの場につながることを目的に、お互いに情報を共有し、協力して発信を行います。</p><h2>設立の背景</h2><p>つくば地域には、数多くの多様な学びの場がありますが、近距離で継続的に交流できる場がありませんでした。</p><p>そこで、運営者間の気軽な相談や連携を通じ、子どもに合った居場所へつながれる地域づくりを目指して、本協議会は設立されました。</p><h2>協議会が大切にしている考え方</h2><ul><li><b>子ども一人ひとりの幸せを大切にする</b><br/>不登校や多様な学びの中にいる子どもたちの特性に合わせ、その子に合った環境につながることを最優先します。</li><li><b>違いを認め合う</b><br/>フリースクールなどの多様な学びの場には、それぞれの考え方や特色があります。協議会では、その違いを尊重します。</li><li><b>子どもに合った場所につながる関係づくり</b><br/>「この子には、うちより別の場所の方が合うかもしれない」という視点を持ち、必要に応じて紹介し合える関係を目指します。</li></ul><h2>その他詳細・会則など</h2><ul><li><a href="https://drive.google.com/file/d/1TvaaOVAcvziB6abSf7Zj__xn2G-uXJ5k/view?usp=drive_link" target="_blank" rel="noreferrer">協議会概要スライド(PDF)</a></li><li><a href="https://drive.google.com/file/d/1jUGkixo0ImVFUFp83kIs4ruQHt5qRhwP/view?usp=drive_link" target="_blank" rel="noreferrer">会則(PDF)</a></li></ul></PlaceholderPage></Route><Route path="/donation"><PlaceholderPage title="寄付について" eyebrow="DONATION"><div className="notice-card"><p>いただいた寄附は、毎月発行の「たより」の印刷費や、パンフレット(年1回更新)の制作・印刷にかかる費用をはじめ、協議会の運営に活用させていただきます。</p></div><p>寄附の方法について、詳しくは事務局までお問い合わせください。</p><a className="button button-primary" href="mailto:msproject.tsukuba@gmail.com">事務局へ問い合わせる →</a></PlaceholderPage></Route><Route path="/join"><PlaceholderPage title="ご参加について" eyebrow="JOIN US"><p className="lead">多様な学びの場を運営する団体のみなさまへ。</p><h2>協議会への参加</h2><p>対象：フリースクール、オルタナティブスクール、居場所などを運営する団体<br/>年会費：1,500円<br/>活動：月1回の運営者会合</p><a className="button button-primary" href="mailto:msproject.tsukuba@gmail.com">参加について問い合わせる →</a></PlaceholderPage></Route><Route component={Home}/></Switch>}
export default function App(){return <ErrorBoundary><ThemeProvider defaultTheme="light"><TooltipProvider><Toaster/><Router/></TooltipProvider></ThemeProvider></ErrorBoundary>}
