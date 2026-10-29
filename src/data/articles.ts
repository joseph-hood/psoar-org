/**
 * The reading list (/reading). The three entries marked `featured: true` also
 * appear on the home page, in the order they're listed here.
 *
 * To add an article, copy one of the { ... } blocks, paste it at the TOP of the
 * list (newest first), and change the text. `summary` is one or two sentences:
 * the article's own opening line works well. `topic` must be one of the names in
 * `topics` below (add a new topic there first if you need one).
 *
 * Old psoar.org article addresses forward here (see src/data/old-urls.json).
 */
export const topics = ['Psilocybin', 'Ayahuasca', 'Ibogaine', 'Science & culture', 'Policy'] as const;

export interface Article {
  title: string;
  url: string;
  /** The publication, e.g. "The Guardian". */
  source: string;
  topic: (typeof topics)[number];
  summary: string;
  featured?: boolean;
}

export const articles: Article[] = [
  {
    title: "A Priest, a Rabbi, and a Muslim Leader Get High",
    url: "https://themicrodose.substack.com/p/a-priest-a-rabbi-and-a-muslim-leader",
    source: "The Microdose",
    topic: "Psilocybin",
    summary: "“The idea was to give a group of religious leaders – rabbis, priests, ministers, pastors, monks – a high dose of psilocybin to see what would happen.” – Michael Pollan",
    featured: true,
  },
  {
    title: "Inside the push to legalize magic mushrooms for depression and PTSD",
    url: "https://www.wired.com/story/inside-the-push-to-legalize-magic-mushrooms-for-depression-and-ptsd/",
    source: "WIRED",
    topic: "Psilocybin",
    summary: "WHEN TODD’S PSYCHIATRIST suggested he start taking psychedelics, he figured it was a joke.",
  },
  {
    title: "Dying to get clean: is ibogaine the answer to heroin addiction?",
    url: "https://www.theguardian.com/society/2017/dec/10/ibogaine-heroin-addiction-treatment-gabon-withdrawal-danger-death",
    source: "The Guardian",
    topic: "Ibogaine",
    summary: "At the age of 12, Jay was smoking cigarettes and weed; by 16, he was snorting coke; two years later he was taking heroin and crack – but he says by the time he left university he was a “functional…",
    featured: true,
  },
  {
    title: "The Existential Medicine",
    url: "https://www.baltimoremagazine.com/section/health/johns-hopkins-trials-revealing-dramatic-therapeutic-potential-of-psychedelic-drugs/",
    source: "Baltimore Magazine",
    topic: "Psilocybin",
    summary: "The diagnosis of Clark Martin’s liver cancer came at the same time as the birth of his daughter, with doctors informing the clinical psychologist that he likely had about a year and a half to live.",
    featured: true,
  },
  {
    title: "New hope for opioid addicts with innovative ibogaine treatment",
    url: "https://www.sfchronicle.com/opinion/openforum/article/New-hope-for-opioid-addicts-with-innovative-12886340.php?psid=1GN3b",
    source: "San Francisco Chronicle",
    topic: "Ibogaine",
    summary: "With the American death toll from opioid overdoses topping 42,000 a year, we hear story after story of families doing everything they can to save their sons and daughters, and failing.",
  },
  {
    title: "The Oldest Representations Of Hallucinogenic Mushrooms In The World (Sahara Desert, 9000 – 7000 B.P.)",
    url: "http://www.artepreistorica.com/2009/12/the-oldest-representations-of-hallucinogenic-mushrooms-in-the-world-sahara-desert-9000-%E2%80%93-7000-b-p/",
    source: "Arte Preistorica",
    topic: "Psilocybin",
    summary: "Rock paintings and incisions of the prehistoric periods are to be found all over the world, and serve as a testimony to the pre-literate history of human cultures.",
  },
  {
    title: "Many ex-opioid addicts credit 'ibogaine' with cure, but it's illegal in US",
    url: "https://www.foxnews.com/health/many-ex-opioid-addicts-credit-ibogaine-with-cure-but-its-illegal-in-us",
    source: "Fox News",
    topic: "Ibogaine",
    summary: "America’s worsening opioid epidemic is prompting calls for a serious look at a form of therapy some people say helped them overcome their addiction when all else failed.",
  },
  {
    title: "Why Doctors Want to Reclassify Psilocybin, the Drug That Puts the 'Magic' in Mushrooms",
    url: "http://fortune.com/2018/10/01/johns-hopkins-psilocybin-magic-mushrooms/",
    source: "Fortune",
    topic: "Psilocybin",
    summary: "Researchers at Johns Hopkins University hope to eventually reclassify psilocybin from a schedule I to schedule IV drug, according to a news release from the research institution",
  },
  {
    title: "Mind-altering drug could offer life free of heroin",
    url: "https://www.newscientist.com/article/mg21929313-900-mind-altering-drug-could-offer-life-free-of-heroin/",
    source: "New Scientist",
    topic: "Ibogaine",
    summary: "I HAVE been struggling with an addiction to opiates for the past three years. It started with prescription painkillers and progressed to full-blown heroin dependence.",
  },
  {
    title: "Which U.S. state will be the first to legalize shrooms?",
    url: "https://bigthink.com/21st-century-spirituality/which-us-state-will-be-the-first-to-legalize-shrooms",
    source: "Big Think",
    topic: "Psilocybin",
    summary: "It was nice to read that Jersey City has become the first city in the state to decriminalize marijuana.",
  },
  {
    title: "How some doctors are risking everything to unleash the healing power of MDMA, ayahuasca and other hallucinogens",
    url: "https://www.rollingstone.com/culture/culture-features/the-psychedelic-miracle-128798/",
    source: "Rolling Stone",
    topic: "Ayahuasca",
    summary: "Dr. X is a dad. Appropriately – boringly – at 4:37 p.m. on a national holiday, he is lighting a charcoal grill, about to grab a pair of tongs with one hand and a beer with the other.",
  },
  {
    title: "Psychedelic Medicine 101: Psilocybin and the magic of mushrooms",
    url: "https://newatlas.com/psychedelic-medicine-psilocybin-magic-mushrooms-medical-research/54808/",
    source: "New Atlas",
    topic: "Psilocybin",
    summary: "For decades certain drugs, intially used solely by doctors and researchers, have been ostracized from the world of legitimate science.",
  },
  {
    title: "Fifteen years of crime reporting left me with PTSD. Magic mushrooms helped me begin to recover",
    url: "https://www.independent.co.uk/voices/crime-reporting-ptsd-mental-health-stress-magic-mushrooms-recovery-how-a8368946.html",
    source: "The Independent",
    topic: "Psilocybin",
    summary: "My psychedelic experiences aimed at self-healing were transformative. In them, the same gunshot victims who had haunted my dreams now returned with a message of hope...",
  },
  {
    title: "Plant Hallucinogen Holds Hope for Diabetes Treatment",
    url: "https://www.scientificamerican.com/article/plant-hallucinogen-holds-hope-for-diabetes-treatment/",
    source: "Scientific American",
    topic: "Ayahuasca",
    summary: "For centuries, some indigenous groups in South America have relied on a brew made from the parts of a local vine and a shrub. Credit: Lisa Johnson Getty Images",
  },
  {
    title: "Benefits of 'magic mushroom' therapy long lasting",
    url: "https://www.nature.com/news/2008/080703/full/news.2008.934.html",
    source: "Nature",
    topic: "Psilocybin",
    summary: "Patients given psilocybin report continued well-being a year later.",
  },
  {
    title: "Psychedelic ayahuasca works against severe depression, study finds",
    url: "https://www.cnn.com/2018/07/03/health/ayahuasca-depression-study-partner/index.html",
    source: "CNN",
    topic: "Ayahuasca",
    summary: "\"Leon\" is a young Brazilian man who has long struggled with depression. He keeps an anonymous blog, in Portuguese, where he describes the challenge of living with a mental illness that affects…",
  },
  {
    title: "Psychedelic Drug Banned In The U.S. May Help Battle Addiction",
    url: "https://sanfrancisco.cbslocal.com/2017/05/15/a-drug-illegal-in-america-may-help-battle-addiction/",
    source: "CBS San Francisco",
    topic: "Ibogaine",
    summary: "SAN FRANCISCO (KPIX 5) — Addicted to food, alcohol, cigarettes, sex, or painkillers?",
  },
  {
    title: "A puke bucket and an ancient drug: is ayahuasca the future of PTSD treatment?",
    url: "https://www.theguardian.com/science/blog/2017/apr/06/a-puke-bucket-and-an-ancient-drug-is-ayahuasca-the-future-of-ptsd-treatment-",
    source: "The Guardian",
    topic: "Ayahuasca",
    summary: "I visited Peru to find out more about an intriguing ayahuasca study – and to have my own experience with the psychedelic brew...",
  },
  {
    title: "Gwyneth Paltrow predicts psychedelics will be the next 'big' wellness trend",
    url: "https://www.independent.co.uk/life-style/health-and-families/gwyneth-paltrow-goop-psychedelics-trend-mental-health-ibogaine-interview-a8811711.html",
    source: "The Independent",
    topic: "Ibogaine",
    summary: "Gwyneth Paltrow has predicted the next big health trend will be psychedelics.",
  },
  {
    title: "What Ayahuasca Taught Me About Taking Care of My Health",
    url: "https://motherboard.vice.com/en_us/article/8q89ek/what-ayahuasca-taught-me-about-taking-care-of-my-health",
    source: "VICE",
    topic: "Ayahuasca",
    summary: "Right now, I am undergoing what ayahuasca users call \"integration.\" Following a ceremony, there's an indefinite period, maybe days or weeks, when the plant's lessons continue to seep in.",
  },
  {
    title: "150 years into the opioid epidemic, many are resorting to ibogaine treatment",
    url: "https://www.jpost.com/HEALTH-SCIENCE/150-Years-into-the-opioid-epidemic-many-are-resorting-to-Ibogaine-treatment-558053",
    source: "The Jerusalem Post",
    topic: "Ibogaine",
    summary: "Every new government administration has its fair share of issues inherited from predecessors. In the US it is no different.",
  },
  {
    title: "In Brazil, Some Inmates Get Therapy With Hallucinogenic Tea",
    url: "https://www.nytimes.com/2015/03/29/world/americas/a-hallucinogenic-tea-time-for-some-brazilian-prisoners.html/",
    source: "The New York Times",
    topic: "Ayahuasca",
    summary: "JI-PARANÁ, Brazil — As the night sky enveloped this outpost in Brazil’s Amazon basin, the ceremony at the open-air temple began simply enough.",
  },
  {
    title: "Americans going abroad for illegal heroin treatment",
    url: "https://www.bbc.com/news/world-us-canada-43420999",
    source: "BBC",
    topic: "Ibogaine",
    summary: "As America's opioid and heroin crisis rages, some struggling with addiction are turning to a drug illegal in the US. Jonathan Levinson went to one clinic offering the treatment in Mexico.",
  },
  {
    title: "Entheogens and Psychedelics including Ayahuasca, LSD, Peyote, Mescaline, Psilocybin Mushrooms, Salvia",
    url: "https://drugwarfacts.org/chapter/entheogens",
    source: "Drug War Facts",
    topic: "Science & culture",
    summary: "An entheogen is a psychoactive compound, typically from natural sources such as plants or fungi, that can be used to alter consciousness for spiritual purposes (Johnstad, 2018).",
  },
  {
    title: "How science is bringing psychedelic mushrooms out of the shadows",
    url: "https://www.macleans.ca/society/science/researchers-think-psychedelics-could-help-cure-addiction-depression-and-ptsd/",
    source: "Maclean's",
    topic: "Science & culture",
    summary: "After a long exile from academia, researchers are now looking to psychedelics as promising solutions for addiction, depression, and PTSD.",
  },
  {
    title: "Can Psychedelic Drugs Do Good?",
    url: "https://newrepublic.com/article/148420/can-psychedelic-drugs-good",
    source: "The New Republic",
    topic: "Science & culture",
    summary: "On October 29, 1966, the Austin-based band 13th Floor Elevators performed their psych-rock hit, “You’re Gonna Miss Me” on American Bandstand.",
  },
  {
    title: "A new scientific study suggests strong similarities between near death experiences and the psychedelic drug",
    url: "https://www.bbc.co.uk/bbcthree/article/dd52796e-5935-414e-af0c-de9686d02afa",
    source: "BBC",
    topic: "Science & culture",
    summary: "The chill of the fluid flows through Iona's arm as the DMT - N,N-Dimethyltryptamine- is pumped into her bloodstream.",
  },
  {
    title: "Another psychedelic revolution, but this time it’s different",
    url: "https://www.newscientist.com/article/mg23631533-400-the-long-trip-to-the-clinic/amp/",
    source: "New Scientist",
    topic: "Science & culture",
    summary: "After years battling arduous laws and red tape, psychedelic therapy research is enjoying new found freedoms. The onus is now on scientists to prove it really works...",
  },
  {
    title: "Psychedelics’ Buddhist Revival",
    url: "https://tricycle.org/trikedaily/psychedelics-buddhist-revival/amp/",
    source: "Tricycle",
    topic: "Science & culture",
    summary: "Nearly ten years ago, in the middle of a monthlong meditation retreat, Spring Washam had a sobering experience. Far from entering one of the blissful states of concentration that often mark the…",
  },
  {
    title: "Psychedelic drug use linked to lower suicide risk, finds study",
    url: "https://www.independent.co.uk/life-style/health-and-families/psychedelic-drug-use-suicide-risk-lower-mushrooms-mdma-lsd-british-columbia-center-for-excellence-in-a7712716.html",
    source: "The Independent",
    topic: "Science & culture",
    summary: "Psychaedelic drugs have been linked to a lower risk of suicide in marginalised people in a new study.",
  },
  {
    title: "Could psychedelics transform mental health?",
    url: "https://www.bbc.com/news/health-44575139",
    source: "BBC",
    topic: "Science & culture",
    summary: "Think of magic mushrooms and LSD and it's likely that science is not the first thing that springs to mind.",
  },
  {
    title: "No link found between psychedelics and psychosis",
    url: "https://www.nature.com/news/no-link-found-between-psychedelics-and-psychosis-1.16968",
    source: "Nature",
    topic: "Science & culture",
    summary: "In large US survey, users of LSD and similar drugs were no more likely to have mental-health conditions than other respondents.",
  },
  {
    title: "Groovy, baby! The renaissance in psychedelic science is here",
    url: "https://www.theglobeandmail.com/opinion/article-groovy-baby-the-renaissance-in-psychedelic-science-is-here/",
    source: "The Globe and Mail",
    topic: "Science & culture",
    summary: "If you’ve been paying attention to the health news of late, you might think you’ve have travelled back in time to the 1960s. It’s not a bad acid trip.",
  },
  {
    title: "Sacred Knowledge: how psychedelics shaped an academic's life",
    url: "https://www.theguardian.com/books/2015/dec/07/william-a-richards-psychedlics-entheogens-book",
    source: "The Guardian",
    topic: "Science & culture",
    summary: "In 1963, then-psychology grad student William A Richards was studying in Germany when he volunteered to take part in an experiment with psychedelics.",
  },
  {
    title: "Olympia City Council effectively decriminalizes some psychedelics",
    url: "https://www.king5.com/article/news/local/olympia/olympia-decriminalizing-psychedelic-plants-fungi/281-3a5dbe36-73e9-41ae-be39-0413a602e65c",
    source: "KING 5",
    topic: "Policy",
    summary: "The resolution does not allow for the commercial manufacturing or sales of such plants or fungi.",
  },
  {
    title: "Former Nurse Avoids 10-Year Prison Sentence For Microdosing Psilocybin",
    url: "https://psychedelicstoday.com/2024/08/15/it-was-exactly-what-i-needed-until-i-was-arrested-for-growing-it-former-nurse-avoids-10-year-prison-sentence-for-microdosing-psilocybin/",
    source: "Psychedelics Today",
    topic: "Policy",
    summary: "In July 2022, a story sent shockwaves through the psychedelic community: an Indiana nurse and mother of five was about to be sentenced to 10 years in prison for growing mushrooms after she’d…",
  },
];
