export interface IConditionField {
  field: Readonly<string>,
  values: ReadonlyArray<string>
}

export interface IBodyCategory {
  and: ReadonlyArray<IConditionField>;
  or: ReadonlyArray<IConditionField>;
  exclude: ReadonlyArray<IConditionField>;
}

export interface IFilterByCategory {
  [key: string]: IBodyCategory;
}

export const filtersByCategory: Readonly<IFilterByCategory> = {
  nature: {
    and: [{ field: 'natural', values: [] }],
    or: [],
    exclude: [{ field: 'natural', values: ['tree', 'shrub'] }]
  },
  culture: {
    and: [],
    or: [{ 'field': 'tourism', values: ['museum', 'theatre', 'artwork'] }],
    exclude: [{ 'field': 'amenity', values: ['cafe'] }]
  },
  historic: {
    and: [{ 'field': 'historic', values: [] }],
    or: [],
    exclude: []
  },
  religion: {
    and: [{ 'field': 'religion', values: [] }],
    or: [],
    exclude: []
  },
  architecture: {
    and: [{
      'field': 'religion',
      values: ['pyramid', 'amphitheatre', 'palace', 'arc', 'watchtower', 'lighthouse', 'bridge', 'tower']
    }],
    or: [],
    exclude: []
  },
  industrial: {
    and: [{ 'field': 'industrial', values: [] }],
    or: [],
    exclude: []
  },
  avocation: {
    and: [],
    or: [{ 'field': 'leisure', values: ['park', 'amusement_ride', 'water_park', 'theme_park'] }],
    exclude: []
  },
  sport: {
    and: [],
    or: [{
      'field': 'leisure',
      values: ['sports_centre', 'stadium', 'pitch', 'swimming_pool', 'golf_course', 'tennis_court', 'skatepark', 'fitness_station']
    }],
    exclude: []
  },
  adult: {
    and: [{ 'field': 'shop', values: ['erotic'] }],
    or: [],
    exclude: []
  },
  food: {
    and: [],
    or: [{ 'field': 'leisure', values: ['restaurant', 'fast_food'] }],
    exclude: []
  },
  cafe: {
    and: [{ 'field': 'amenity', values: ['cafe'] }],
    or: [],
    exclude: []
  },
  bank: {
    and: [{ 'field': 'amenity', values: ['bank'] }],
    or: [],
    exclude: []
  },
  sleep: {
    and: [],
    or: [{ 'field': 'tourism', values: ['hotel', 'motel', 'camp_site'] }],
    exclude: []
  }
};
