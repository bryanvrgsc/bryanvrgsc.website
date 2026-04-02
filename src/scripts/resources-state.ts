import type { Document } from '../constants/resources';
import type { Language } from '../types';

export type ResourceFilter = 'all' | 'paper' | 'slides';
type ResourceDocument = Pick<
  Document,
  'type' | 'title' | 'description' | 'category'
>;

export const filterDocuments = (
  docs: ResourceDocument[],
  filter: ResourceFilter,
  category: string,
  searchTerm: string,
  lang: Language,
) => {
  const query = searchTerm.trim().toLowerCase();

  return docs.filter((doc) => {
    const matchesType = filter === 'all' || doc.type === filter;
    const matchesCategory = category === 'all' || doc.category[lang] === category;
    const matchesSearch =
      query === '' ||
      doc.title[lang].toLowerCase().includes(query) ||
      doc.description[lang].toLowerCase().includes(query) ||
      doc.category[lang].toLowerCase().includes(query);

    return matchesType && matchesCategory && matchesSearch;
  });
};
