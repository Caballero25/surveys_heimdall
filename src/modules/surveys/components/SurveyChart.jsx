import React, { useMemo } from "react";
import Plot from "react-plotly.js";
import "../styles/SurveyChart.css";

const SurveyChartComponent = ({ data, is3D }) => {
  if (!data) return null;
  const { name } = data;

  // data.XValue = E/W, data.YValue = N/S, data.ZValue = TVD
  const sampledData = useMemo(() => {
    const DOWNSAMPLING_FACTOR = 10;
    if ((data.XValue?.length ?? 0) < 200) {
      return { XValue: data.XValue, YValue: data.YValue, ZValue: data.ZValue };
    }
    const sx = [],
      sy = [],
      sz = [];
    for (let i = 0; i < data.XValue.length; i += DOWNSAMPLING_FACTOR) {
      sx.push(data.XValue[i]);
      sy.push(data.YValue[i]);
      sz.push(data.ZValue[i]);
    }
    const last = data.XValue.length - 1;
    if (last % DOWNSAMPLING_FACTOR !== 0) {
      sx.push(data.XValue[last]);
      sy.push(data.YValue[last]);
      sz.push(data.ZValue[last]);
    }
    return { XValue: sx, YValue: sy, ZValue: sz };
  }, [data]);

  const { XValue, YValue, ZValue } = sampledData;

  const chartData = useMemo(() => {
    if (is3D) {
      return [
        {
          x: XValue, // E/W
          y: YValue, // N/S
          z: ZValue, // TVD
          type: "scatter3d",
          mode: "lines",
          line: {
            width: 5,
            color: ZValue, // aquí se usa la profundidad como referencia
            colorscale: "Jet", // o 'Jet', 'Rainbow', etc.
            cmin: Math.min(...ZValue),
            cmax: Math.max(...ZValue),
          },
          hovertemplate:
            "E/W: %{x:.2f} ft<br>N/S: %{y:.2f} ft<br>TVD: %{z:.2f} ft<extra></extra>",
        },
      ];
    }
    // Vista en planta (map view): E/W vs N/S
    return [
      {
        x: XValue,
        y: YValue,
        type: "scattergl",
        mode: "lines",
        line: { color: "#5D409C", width: 3 },
        hovertemplate: "E/W: %{x:.2f} ft<br>N/S: %{y:.2f} ft<extra></extra>",
      },
    ];
  }, [XValue, YValue, ZValue, is3D]);

  const layout = useMemo(() => {
    const baseLayout = {
      autosize: true,
      margin: { l: 40, r: 40, b: 40, t: 80 },
      paper_bgcolor: "#1e293b",
      plot_bgcolor: "#1e293b",
      font: { color: "#cbd5e1" },
      title: {
        text: `Trayectoria de ${name} (${is3D ? "3D" : "2D"})`,
        font: { size: 18, color: "#f1f5f9" },
      },
    };
    if (is3D) {
      return {
        ...baseLayout,
        scene: {
          xaxis: {
            title: "E/W (ft)",
            gridcolor: "#334155",
            color: "#cbd5e1",
            zeroline: true,
          },
          yaxis: {
            title: "N/S (ft)",
            gridcolor: "#334155",
            color: "#cbd5e1",
            zeroline: true,
          },
          zaxis: {
            title: "TVD (ft)",
            gridcolor: "#334155",
            color: "#cbd5e1",
            autorange: "reversed",
          }, // Z hacia abajo
          aspectmode: "data", // proporción real según datos
        },
      };
    }
    return {
      ...baseLayout,
      xaxis: { title: "E/W (ft)", gridcolor: "#334155", zeroline: true },
      yaxis: {
        title: "N/S (ft)",
        gridcolor: "#334155",
        zeroline: true,
        scaleanchor: "x",
        scaleratio: 1,
      }, // misma escala en 2D
    };
  }, [name, is3D]);

  return (
    <div className="survey-chart-wrapper">
      <Plot
        data={chartData}
        layout={layout}
        useResizeHandler
        style={{ width: "100%", height: "100%" }}
        config={{ responsive: true, displaylogo: false }}
      />
    </div>
  );
};

export const SurveyChart = React.memo(SurveyChartComponent);
