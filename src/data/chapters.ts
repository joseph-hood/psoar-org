/**
 * Local chapters: the "Chapters" section on Home and About.
 * Seal images are in src/assets/chapters/ (named by `id`).
 *
 * `facebook`: the chapter's Facebook link. Leave it as '' when a chapter has
 * no page yet; the card then says "Facebook page coming soon".
 * TODO: Central Arkansas and Eureka Springs currently link to a Facebook
 * search. Swap in each group's own address once you have it.
 */
import { SITE } from '../config/site';

export interface Chapter {
  id: 'bentonville' | 'fayetteville' | 'eureka-springs' | 'central-arkansas';
  name: string;
  location: string;
  note?: string;
  facebook: string;
}

export const chapters: Chapter[] = [
  {
    id: 'bentonville',
    name: 'Bentonville',
    location: 'Bentonville, AR',
    note: 'Our main chapter',
    facebook: SITE.facebookUrl,
  },
  {
    id: 'fayetteville',
    name: 'Fayetteville',
    location: 'Fayetteville, AR',
    facebook: '',
  },
  {
    id: 'eureka-springs',
    name: 'Eureka Springs',
    location: 'Eureka Springs, AR',
    facebook: 'https://www.facebook.com/search/top?q=psoar%20of%20eureka%20springs',
  },
  {
    id: 'central-arkansas',
    name: 'Central Arkansas',
    location: 'Little Rock area',
    facebook: 'https://www.facebook.com/search/top?q=psoar%20of%20central%20arkansas',
  },
];
