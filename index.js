import React from 'react';
import ReactDOM from 'react-dom';
import { useWorldAtlas } from './useWorldAtlas';
import { useData } from './useData';
import { Marks } from './Marks';
import {
  interpolateYlOrRd,
  scaleSequential,
  max,
} from 'd3';
import { useCodes } from './useCodes';
const width = 960;
const height = 500;

const App = () => {
  const worldAtlas = useWorldAtlas();
  const data = useData();
  const codes = useCodes();
  if (!worldAtlas || !data || !codes) {
    return <pre>Loading...</pre>;
  }
  const filteredData = data.filter(
    (d) => d.Year === '2017'
  );
 
  const numericCodeByAlphaCode = new Map()
  
  codes.forEach((code)=>numericCodeByAlphaCode.set(code['alpha-3'],code['country-code']))
  
  const rowByNumericCode = new Map();
  filteredData.forEach((d) => {
    const alpha3Code = d.Code;
    const numericCode = numericCodeByAlphaCode.get(alpha3Code);
     rowByNumericCode.set(numericCode, d);
  })

  const colorValue = (d) => d.aids;

  const colorScale = scaleSequential(
    interpolateYlOrRd
  ).domain([0, max(data, colorValue)]);

  return (
    <svg width={width} height={height}>
      <Marks
        worldAtlas={worldAtlas}
        data={data}
        colorScale={colorScale}
        colorValue={colorValue}
        rowByNumericCode={rowByNumericCode}
      />
    </svg>
  );
};
const rootElement = document.getElementById(
  'root'
);
ReactDOM.render(<App />, rootElement);
