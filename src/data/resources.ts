/**
 * The Resources page (/resources). Each group is a heading with a list of links.
 *
 * To add a link, copy a line inside the right group and change it:
 *   { title: 'Name shown on the page', url: 'https://…', note: 'optional short description' },
 *
 * Videos are YouTube links; any form of the address works (youtu.be/…, youtube.com/watch?v=…).
 * `title` on a video is optional but helps people using screen readers.
 */
export interface ResourceLink {
  title: string;
  url: string;
  note?: string;
}

export interface ResourceGroup {
  id: string;
  title: string;
  intro?: string;
  links: ResourceLink[];
}

export interface Video {
  url: string;
  title?: string;
}

export const videos: Video[] = [
  { url: 'https://www.youtube.com/watch?v=bxABOiay6oA', title: 'Fantastic Fungi (official trailer)' },
  { url: 'https://youtu.be/X8LRb4jfZ9g' },
  { url: 'https://youtu.be/z7OnZtvPm84' },
  { url: 'https://www.youtube.com/watch?v=DiHeBbOs-AU' },
];

export const resourceGroups: ResourceGroup[] = [
  {
    id: 'support',
    title: 'Support & safety',
    intro: 'Peer support lines, integration help, and harm-reduction services.',
    links: [
      { title: 'Fireside Project', url: 'https://firesideproject.org/', note: 'Free psychedelic peer support line' },
      { title: 'Zendo Project', url: 'https://zendoproject.org/', note: 'Psychedelic harm reduction and peer support' },
      {
        title: "MAPS' Psychedelic Integration List",
        url: 'https://integration.maps.org/',
        note: 'Mental health support practitioners by location',
      },
      { title: 'DanceSafe', url: 'https://dancesafe.org/', note: 'Drug checking and harm reduction' },
      { title: 'Tripsitter', url: 'https://www.tripsitters.org/' },
      { title: 'Field Trip: Psychedelic Guide', url: 'https://www.fieldtriphealth.com/self-guided-mobile-app' },
      { title: 'Third Wave', url: 'https://thethirdwave.co/' },
    ],
  },
  {
    id: 'research',
    title: 'Research',
    links: [
      { title: 'UC Berkeley Center for the Science of Psychedelics', url: 'https://psychedelics.berkeley.edu/' },
      { title: 'Multidisciplinary Association for Psychedelic Studies (MAPS)', url: 'https://maps.org/' },
      { title: 'Johns Hopkins Center for Psychedelic & Consciousness Research', url: 'https://hopkinspsychedelic.org/' },
      {
        title: 'International Center for Ethnobotanical Education, Research, and Service (ICEERS)',
        url: 'https://www.iceers.org/',
      },
    ],
  },
  {
    id: 'books',
    title: 'Books',
    links: [
      {
        title: 'How to Change Your Mind',
        note: 'Michael Pollan',
        url: 'https://bookshop.org/p/books/how-to-change-your-mind-what-the-new-science-of-psychedelics-teaches-us-about-consciousness-dying-addiction-depression-and-transcendence-michael-pollan/586725?ean=9780735224155',
      },
      {
        title: "The Psychedelic Explorer's Guide",
        note: 'James Fadiman',
        url: 'https://bookshop.org/p/books/the-psychedelic-explorer-s-guide-safe-therapeutic-and-sacred-journeys/18862488?ean=9781594774027',
      },
      {
        title: 'The Way of the Psychonaut',
        note: 'Stanislav Grof',
        url: 'https://bookshop.org/p/books/the-way-of-the-psychonaut-vol-1-encyclopedia-for-inner-journeys/16676393?ean=9780998276595',
      },
      {
        title: 'Chasing the Scream',
        note: 'Johann Hari',
        url: 'https://bookshop.org/p/books/chasing-the-scream-the-inspiration-for-the-feature-film-the-united-states-vs-billie-holiday-johann-hari/7178458?ean=9781620408919',
      },
      {
        title: 'Spiritual Emergency',
        note: 'Stanislav and Christina Grof',
        url: 'https://bookshop.org/p/books/spiritual-emergency-when-personal-transformation-becomes-a-crisis-stanislav-grof/11525691?ean=9780874775389',
      },
      {
        title: 'Psychedelic Integration',
        note: 'Marc Aixalà',
        url: 'https://bookshop.org/p/books/psychedelic-integration-psychotherapy-for-non-ordinary-states-of-consciousness-marc-aixala/18013355?ean=9780907791393',
      },
    ],
  },
  {
    id: 'advocacy',
    title: 'Advocacy',
    links: [
      { title: 'Indigenous Medicine Conservation Fund', url: 'https://imc.fund/' },
      { title: 'National Harm Reduction Coalition', url: 'https://harmreduction.org/' },
      { title: 'Drug Policy Alliance', url: 'https://drugpolicy.org/' },
      { title: 'Chacruna Institute', url: 'https://chacruna.org/' },
    ],
  },
  {
    id: 'trainings',
    title: 'Trainings',
    links: [
      {
        title: 'VITAL',
        url: 'https://www.vitalpsychedelictraining.com/course-overview',
        note: 'A 12-month course from Psychedelics Today for medical specialists, mental health professionals, therapists, and wellness practitioners integrating psychedelic knowledge into their practice.',
      },
      {
        title: 'Zendo SIT',
        url: 'https://zendoproject.org/sit/',
        note: 'Sitting and Integration Training: a 4-week live course in psychedelic peer support and compassionate, culturally attuned care.',
      },
    ],
  },
];
