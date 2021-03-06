import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import PlanetsContext from './PlanetsContext';
import fetchPlanets from '../services';

function PlanetsProvider({ children }) {
  const [data, setData] = useState(null);
  const [filters, setFilters] = useState({ filterByName: { name: '' },
    filterByNumericValues: [] });
  const [planets, setPlanets] = useState([]);

  const { filterByName: { name },
    filterByNumericValues,
  } = filters;

  useEffect(() => {
    const getPlanetsInfo = async () => {
      const response = await fetchPlanets();
      setData(response);
    };
    getPlanetsInfo();
  }, []);

  useEffect(() => {
    if (data) {
      setPlanets(data.results);
    }
  }, [data]);

  useEffect(() => {
    if (data) {
      const filteredByName = data.results
        .filter((planet) => planet.name.toLowerCase().includes(name.toLowerCase()));
      let filteredByNameAndColumns = filteredByName;
      filterByNumericValues.forEach(({ column, comparison, value }) => {
        filteredByNameAndColumns = filteredByName.filter((planet) => {
          switch (comparison) {
          case 'maior que':
            return Number(planet[column]) > Number(value);
          case 'menor que':
            return Number(planet[column]) < Number(value);
          case 'igual a':
            return Number(planet[column]) === Number(value);
          default:
            return filteredByName;
          }
        });
      });
      setPlanets(filteredByNameAndColumns);
    }
  }, [data, filterByNumericValues, name]);

  const context = { filters, setFilters, planets, setPlanets };

  return (
    <PlanetsContext.Provider value={ context }>
      { children }
    </PlanetsContext.Provider>
  );
}

const { oneOfType, arrayOf, node } = PropTypes;

PlanetsProvider.propTypes = {
  children: oneOfType([arrayOf(node), node]).isRequired,
};

export default PlanetsProvider;

// useEffect: https://www.pluralsight.com/guides/fetching-data-updating-state-hooks
// PropTypes: https://github.com/tryber/sd-014-a-monitoria/blob/context-api-dog-gallery-28-out-2021/context-api-dog-gallery/src/context/Provider.js
