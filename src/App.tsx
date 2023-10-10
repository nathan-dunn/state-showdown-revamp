import { useState } from 'react';
import { states } from './data';
import Select from 'react-select';
import { isBrowser } from 'react-device-detect';
import { Icon } from '@iconify/react';
import gearFill from '@iconify-icons/bi/gear-fill';
import image from './assets/states.png';
import {
  commafy,
  findSubCategoriesList,
  findCategories,
  showResults,
} from './helpers';
import { ResultType, CategoryType, Ideals } from './types';
import './App.css';

export default function App() {
  const [watchlist, setWatchlist] = useState<string[]>(['TEXAS']);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [onlyWatchlist, setOnlyWatchlist] = useState<boolean>(false);
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

    if (['people'].includes(category.value)) {
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
            marginBottom: 20,
          }}
        >
          <div>{text}</div>
          <input
            style={{ marginLeft: 5, width: 50, textAlign: 'center' }}
            type="text"
            name="ideal"
            value={ideal}
            onChange={e => {
              const newIdeals = {
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

  const renderSettings = () => {
    return (
      <div style={{}}>
        <div
          style={{
            fontSize: 18,
            fontWeight: 'bold',
            marginBottom: 20,
          }}
        >
          Settings
        </div>
        <div onClick={() => setOnlyWatchlist(!onlyWatchlist)}>
          {`• ${
            onlyWatchlist ? 'Show watchlist states only' : 'Show all states'
          }`}
        </div>
      </div>
    );
  };

  const renderResults = (results: ResultType[]) => {
    if (!results) return null;

    const elements = results
      .filter(result =>
        !onlyWatchlist || watchlist.includes(result[1]) ? true : false
      )
      .map((result, index) => {
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
              backgroundColor:
                watchlistIndex > -1
                  ? '#ADD8E6'
                  : index % 2 === 0
                  ? '#E8E8E8'
                  : null,
              marginBottom: 5,
              padding: 2,
            }}
            onClick={() => {
              const watchlistTemp =
                watchlistIndex === -1
                  ? [...watchlist, state]
                  : [
                      ...watchlist.slice(0, watchlistIndex),
                      ...watchlist.slice(watchlistIndex + 1),
                    ];
              localStorage.setItem('watchlist', JSON.stringify(watchlistTemp));
              setWatchlist(watchlistTemp);
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
        }}
      >
        {elements}
      </div>
    );
  };

  const renderImage = () => {
    return (
      <img
        src={image}
        alt=""
        style={{
          height: '40%',
          width: '100%',
          marginTop: 50,
        }}
      />
    );
  };

  const selectStyle = {
    container: (provided, state) => ({
      ...provided,
      marginBottom: 20,
    }),
    option: (provided, state) => ({ ...provided }),
    menu: (provided, state) => ({
      ...provided,
      padding: 10,
    }),
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        margin: 'auto',
        padding: 20,
        paddingTop: 40,
        overflow: isBrowser ? 'scroll' : 'visible',
        width: isBrowser ? window.innerWidth * 0.25 : 'auto',
        height: isBrowser ? window.innerHeight * 0.95 : 'auto',
        border: isBrowser ? '2px solid #787878' : 'none',
        borderRadius: 10,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 20,
        }}
      >
        <div />
        <div style={{ fontSize: 30, fontWeight: 'bold' }}>STATE SHOWDOWN</div>
        <Icon
          icon={gearFill}
          style={{ fontSize: 20 }}
          onClick={() => setShowSettings(!showSettings)}
        />
      </div>

      <div
        style={{
          display: showSettings ? 'none' : 'initial',
        }}
      >
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

        {renderHowRanked()}

        {results ? renderResults(results) : renderImage()}
      </div>

      {showSettings && renderSettings()}
    </div>
  );
}
