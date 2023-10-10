export type SourcesDictionary = Record<string, any>;

export type StatesDictionary = Record<string, any>;

export type StatesCollection = Record<string, StateType>;

export type StateType = {
  people: {
    population: number;
    avg_fica_score: number;
  };
  taxes: {
    total_tax: number;
    income_tax: number;
    sales_tax: number;
    prop_tax: number;
  };
  govt: {
    voting_index: string;
    governor: string;
    senate: string;
    house: string;
    election_2020: {
      R: number;
      D: number;
    };
  };
  freedom: {
    lockdowns: number;
    guns_rank: number;
  };
  costs: {
    mean_wage: number;
    mean_rent: number;
    dollar: number;
    cost_index?: number;
    grocery_index: number;
    utilities_index: number;
    transportation_index: number;
  };
  education: {
    us_news_rank: number;
  };
  housing: {
    housing_index: number;
    median_home_price: number;
    price_per_acre?: number | null;
    avg_outstanding_mortgage: number;
    diff_value_and_mortgage: number;
  };
  weather: {
    snow: number;
    precipitation: number;
    avg_summer_temp: number;
    avg_winter_temp: number;
  };
  danger: {
    fema_disasters: number;
    disaster_cost_per_family: number;
    tornado_deaths_2019?: number;
    tornadoes: number;
    fire_death_rate: number;
  };
  crime: {
    murder_rate: number;
  };
  us_news_rankings: {
    health_care: number;
    education: number;
    economy: number;
    infrastructure: number;
    opportunity: number;
    fiscal_stability: number;
    crime: number;
    natural_environment: number;
  };
  fun: {
    fun_score: number;
    entertainment_and_rec_rank: number;
    nightlife_rank: number;
  };
  public_schools: {
    public_schools_score: number;
    quality_rank: number;
    safety_rank: number;
  };
};

export type ResultType = [number, string, any];

export type CategoryType = {
  value: string | undefined;
};

export type ValueType = {
  value: string;
};

export type Ideals = {
  [key: string]: number;
};
