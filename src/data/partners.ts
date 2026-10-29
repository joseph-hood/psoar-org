/**
 * Partner organizations: the "Partners" section on Home and About, and the
 * footer. Facts about partners come from them or their official sites.
 */
export const partners = [
  {
    id: 'nsmh',
    name: 'Natural State Mental Health',
    eyebrow: 'Legislation in Arkansas',
    title: 'Our partners working on legislation need your help',
    text: 'Natural State Mental Health is working to pass legislation for regulated, supervised therapeutic access to psilocybin in Arkansas. Add your name to their coalition and help bring it home.',
    url: 'https://naturalstatemh.org',
    links: [
      { label: 'Join the coalition', url: 'https://naturalstatemh.org/join' },
      { label: 'Visit naturalstatemh.org', url: 'https://naturalstatemh.org' },
    ],
  },
  {
    id: 'path',
    name: 'Psychedelic Alliance of the Heartland (PATH)',
    eyebrow: 'Across the Heartland',
    title: 'Part of an alliance across the Heartland',
    text: 'PSoAR is a member of the Psychedelic Alliance of the Heartland, an alliance of outreach, education, and reform groups bringing change and connecting people across Arkansas, Oklahoma, Missouri, and Kansas.',
    url: 'https://path-heartland.org',
    links: [{ label: 'Visit path-heartland.org', url: 'https://path-heartland.org' }],
  },
] as const;
