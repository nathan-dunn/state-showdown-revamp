import {
  CategoryType,
  Ideals,
  SourcesDictionary,
  StatesDictionary,
  ResultType,
  ValueType,
} from './types';

export const commafy = (x: number | string, round: boolean = false): string => {
  if (!x && x !== 0) return String(x);

  let commafied = '';
  const xStr = String(x).split('.');
  let [whole, fractal] = xStr;

  whole = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  if (fractal && !round) {
    commafied = whole + '.' + fractal;
  } else {
    commafied = whole;
  }

  return commafied;
};

export const findSubCategoriesList = (
  category: CategoryType | null,
  states: StatesDictionary = {}
): { label: string; value: string }[] => {
  if (!category) return [];
  const state = Object.keys(states)[0];
  if (!state || !states[state][category.value]) return [];
  const subCategories = Object.keys(states[state][category.value]);
  return subCategories.map(subCategory => ({
    label: subCategory.toUpperCase().replace(/_/g, ' '),
    value: subCategory,
  }));
};

export const findCategories = (
  states: StatesDictionary
): { label: string; value: string }[] => {
  const statesList = Object.keys(states);
  const categoriesList = Object.keys(states[statesList[0]]);
  const categories = categoriesList.map(category => ({
    label: category.toUpperCase().replace(/_/g, ' '),
    value: category,
  }));

  return categories;
};

export const findSource = (
  category: ValueType | null,
  subCategory: ValueType | null,
  sources: SourcesDictionary
): any | null => {
  if (!category || !subCategory) return null;

  const categoryValue = category.value;
  const subCategoryValue = subCategory.value;

  const source = sources[categoryValue] || sources[subCategoryValue];
  return source;
};

export const showResults = (
  category: ValueType | null,
  subCategory: ValueType | null,
  states: StatesDictionary,
  ideals: Ideals
): Array<[number, string, any]> | null => {
  if (!category || !subCategory) return null;

  const categoryValue = category.value;
  const subCategoryValue = subCategory.value;

  const ideal = ideals[subCategoryValue];

  const entries = Object.entries(states).map(entry => {
    const [state, data] = entry;
    return [state, data[categoryValue][subCategoryValue]];
  });

  // RANKING AND SORTING
  const sortedEntries = entries.sort((a, b) => {
    let valA = a[1];
    let valB = b[1];

    if (valA === valB) return 0;

    // higher value  better
    if (
      [
        'lockdowns',
        'guns',
        'mean_wage',
        'dollar',
        'population',
        'avg_fica_score',
        'fun_score',
        'public_schools_score',
      ].includes(subCategoryValue)
    ) {
      return valA > valB ? -1 : 1;
    }

    // closer to ideal better
    if (Object.keys(ideals).includes(subCategoryValue)) {
      return Math.abs(valA - ideal) < Math.abs(valB - ideal) ? -1 : 1;
    }

    if (subCategoryValue === 'voting_index') {
      if (valA === 'Even' && valB.includes('R')) return 1;
      else if (valA.includes('R') && valB === 'Even') return -1;
      else if (valA === 'Even' && valB.includes('D')) return -1;
      else if (valA.includes('D') && valB === 'Even') return 1;

      let [pA, cA] = valA.split('+');
      let [pB, cB] = valB.split('+');
      if (pA === 'D') cA = cA * -1;
      if (pB === 'D') cB = cB * -1;

      return Number(cA) > Number(cB) ? -1 : 1;
    }

    // special case: R > D
    if (subCategoryValue.includes('election')) {
      const scoreA = valA.R - valA.D;
      const scoreB = valB.R - valB.D;
      return scoreA > scoreB ? -1 : 1;
    }

    // special case:  R > D
    if (['governor', 'senate'].includes(subCategoryValue)) {
      if (valA === 'Republican') return -1;
      else if (valA === 'Democrat') return 1;
      else if (valA === 'Both') {
        return valB === 'Republican' ? 1 : -1;
      }
    }

    // special case: more R's than D's is better
    if (['house'].includes(subCategoryValue)) {
      const countsA = { R: 0, D: 0, I: 0, V: 0 };
      const countsB = { R: 0, D: 0, I: 0, V: 0 };

      valA.split(' ').forEach((seg: string) => {
        if (seg.includes('R')) countsA.R += parseInt(seg, 10);
        if (seg.includes('D')) countsA.D += parseInt(seg, 10);
        if (seg.includes('I')) countsA.I += parseInt(seg, 10);
        if (seg.includes('V')) countsA.V += parseInt(seg, 10);
      });

      valB.split(' ').forEach((seg: string) => {
        if (seg.includes('R')) countsB.R += parseInt(seg, 10);
        if (seg.includes('D')) countsB.D += parseInt(seg, 10);
        if (seg.includes('I')) countsB.I += parseInt(seg, 10);
        if (seg.includes('V')) countsB.V += parseInt(seg, 10);
      });

      const diffA = countsA.R - countsA.D;
      const diffB = countsB.R - countsB.D;

      return diffA > diffB ? -1 : 1;
    }

    // not ranked just sorted consistently
    if (subCategoryValue === 'demos') {
      return valA.white > valB.white ? -1 : 1;
    }

    // default: lower score is better
    else return valA < valB ? -1 : 1;
  });

  const results: ResultType[] = sortedEntries.map((entry, index) => {
    const rank = index + 1;
    const state = entry[0];
    const score = entry[1];
    return [rank, state, score] as ResultType;
  });

  return results;
};
