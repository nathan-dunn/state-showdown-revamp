import { useState } from 'react';
import { states } from './data';
import Select from 'react-select';
import { isBrowser } from 'react-device-detect';
import texas from './assets/texas.png';
import {
  commafy,
  findSubCategoriesList,
  findCategories,
  showResults,
} from './helpers';
import { ResultType, CategoryType, Ideals } from './types';

const selectStyle = {
  container: (provided: any) => ({ ...provided, width: '70%' }),
  option: (provided: any) => ({ ...provided }),
  menu: (provided: any) => ({ ...provided, padding: 10 }),
};

const BLACK = '#1E1E1E';
const WHITE = '#FAFAFA';
const GRAY = '#D7D7D7';
const RED = '#BF0D3E';

export default function App() {
  const [watchlist] = useState<string[]>(['TEXAS']);
  const [category, setCategory] = useState<CategoryType | undefined>();
  const [subCategory, setSubCategory] = useState<CategoryType | undefined>();
  const [ideals, setIdeals] = useState<Ideals>({
    snow: 15,
    precipitation: 40,
    avg_temp: 69,
    avg_summer_temp: 75,
    avg_winter_temp: 35,
  });
  const ideal: number | null =
    subCategory && subCategory.value ? ideals[subCategory.value] : null;

  const categories: CategoryType[] = findCategories(states);
  const results: ReturnType<typeof showResults> = showResults(
    category,
    subCategory,
    states,
    ideals
  );

  const renderHowRanked = () => {
    if (!category || !subCategory) {
      return null;
    }

    let text = 'Ranked';

    if (['people', 'govt'].includes(category.value)) {
      text = 'Not Ranked';
    }

    if (['governor', 'senate'].includes(subCategory.value)) {
      text = 'Sorted Not Ranked';
    }

    if (['weather'].includes(category.value)) {
      text = 'Sorted by ideal =';

      return (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <div>{text}</div>
          <input
            style={{ marginLeft: 5, width: 50, textAlign: 'center' }}
            type="text"
            name="ideal"
            value={ideal}
            onChange={e => {
              const newIdeals: any = {
                ...ideals,
                [subCategory.value]: e.target.value,
              };
              localStorage.setItem('ideals', JSON.stringify(newIdeals));
              setIdeals(newIdeals);
            }}
          />
        </div>
      );
    }

    return (
      <div
        style={{
          marginBottom: 20,
          textAlign: 'center',
        }}
      >
        {text}
      </div>
    );
  };

  const renderResults = (results: ResultType[]) => {
    if (!results) return null;

    const elements = results.map((result, index) => {
      // variables
      const [rank, state, value] = result;
      let stateLabel = state.replace(/_/g, ' ');
      let valueLabel =
        typeof value === 'object' ? JSON.stringify(value) : value;
      const watchlistIndex = watchlist.indexOf(state);

      // value massaging
      if (category.value === 'taxes') {
        valueLabel = `${value} %`;
      } else if (subCategory.value.includes('temp')) {
        valueLabel = `${value} ℉`;
      } else if (['snow', 'precipitation'].includes(subCategory.value)) {
        valueLabel = `${value} in`;
      } else if (
        (subCategory.value.includes('price') ||
          subCategory.value.includes('wage') ||
          subCategory.value.includes('rent') ||
          subCategory.value.includes('dollar') ||
          subCategory.value.includes('mortgage') ||
          subCategory.value.includes('cost')) &&
        !subCategory.value.includes('index')
      ) {
        valueLabel = `$${commafy(value)}`;
      } else if (subCategory.value === 'population') {
        valueLabel = commafy(value);
      } else if (subCategory.value === 'lockdowns') {
        valueLabel = value.toFixed(1);
      } else if (subCategory.value.includes('election')) {
        // valueLabel = `${value.R}R / ${value.D}D`;
        valueLabel = `R: ${value.R}%  D: ${value.D}%`;
      } else if (subCategory.value === 'demos') {
        const per = n => Math.round(n * 100);
        valueLabel =
          `W-${per(value.white)}, ` +
          `B-${per(value.black)}, ` +
          `H-${per(value.hispanic)} `;
      }

      return (
        <div
          key={index}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '90%',
            paddingTop: 8,
            paddingRight: 20,
            paddingBottom: 8,
            paddingLeft: 20,
            fontSize: 16,

            background:
              watchlistIndex > -1 ? RED : index % 2 === 0 ? GRAY : 'initial',
            color:
              watchlistIndex > -1
                ? WHITE
                : index % 2 === 0
                ? 'initial'
                : 'initial',
          }}
        >
          <div>{rank}</div>
          <div>{stateLabel}</div>
          <div style={{ whiteSpace: 'pre' }}>{valueLabel}</div>
        </div>
      );
    });

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '75%',
          overflowY: 'scroll',
          overflowX: 'hidden',
          height: '66%',
        }}
      >
        {renderHowRanked()}
        {elements}
      </div>
    );
  };

  const renderImage = () => {
    return <img src={texas} alt="" style={{ width: '100%' }} />;
  };

  return (
    <div
      style={{
        width: '100vw',
        backgroundColor: '#F0F0F0',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'center',
          gap: 30,
          margin: 'auto',
          paddingTop: 60,
          paddingRight: 20,
          paddingBottom: 40,
          paddingLeft: 20,
          overflow: isBrowser ? 'scroll' : 'visible',
          width: isBrowser ? 400 : '100vw',
          height: isBrowser ? 850 : '100vh',
          border: isBrowser ? '2px solid #787878' : 'none',
          borderRadius: 10,
          maxWidth: '100vw',
          overflowX: 'hidden',
          fontFamily: 'Archivo Black, sans-serif',
          color: BLACK,
          backgroundColor: WHITE,
        }}
      >
        <div
          style={{
            fontWeight: 'bold',
            fontFamily: 'Anton, sans-serif',
            textAlign: 'center',
            paddingTop: 20,
          }}
        >
          <div style={{ fontSize: 50 }}>STATE SHOWDOWN</div>
        </div>

        <Select
          styles={selectStyle}
          placeholder="Select a Category"
          options={categories}
          onChange={(cat: any) => {
            if (!category || cat.value !== category.value) {
              setCategory(cat);
              setSubCategory(findSubCategoriesList(cat, states)[0]);
            }
          }}
          isSearchable={false}
        />

        {category && (
          <Select
            key={`my_unique_select_key__${subCategory}`}
            value={subCategory || ''}
            styles={selectStyle}
            placeholder="Select a Sub Category"
            options={findSubCategoriesList(category, states)}
            onChange={(sub: any) => {
              setSubCategory(sub);
            }}
            isSearchable={false}
          />
        )}

        {results ? renderResults(results) : renderImage()}
      </div>
    </div>
  );
}
