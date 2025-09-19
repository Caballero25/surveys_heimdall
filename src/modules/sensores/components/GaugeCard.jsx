// En /components/GaugeCard.jsx
import React from "react";
import ReactSpeedometer from "react-d3-speedometer";

export default function GaugeCard({ title, value, unit, gaugeConfig }) {
  const currentValue = value ?? 0;
  const displayText =
    value !== null && value !== undefined ? Number(value).toFixed(2) : "N/A";

  const { range, stops } = gaugeConfig;
  const min = range[0];
  const max = range[1];

  const customSegmentStops = [min, stops[0], stops[1], stops[2], stops[3], max];
  const segmentColors = ["#D411FB", "#152D83", "#0BBBFF", "#152D83", "#D411FB"];

  return (
    <div className="col-xxl-1 col-xl-2 col-lg-3 col-md-4 col-sm-6 col-6 mb-3 p-1">
      <div
        className="card h-100 text-center gauge-card"
        style={{
          backgroundColor: "rgba(30, 41, 59, 0.9)",
          color: "#e0e0e0",
          border: "1px solid rgba(74, 85, 104, 0.5)",
          borderRadius: "12px",
          backdropFilter: "blur(4px)",
          boxShadow:
            "0 4px 12px rgba(0, 0, 0, 0.15), 0 0 2px rgba(74, 222, 255, 0.4)",
          transition: "all 0.3s ease",
          overflow: "hidden",
        }}
      >
        <div className="card-body p-1 d-flex flex-column justify-content-center align-items-center">
          {/* Medidor más compacto */}
          <div style={{ height: "70px", width: "100%", position: "relative" }}>
            <ReactSpeedometer
              width={140}
              height={70}
              ringWidth={6}
              minValue={min}
              maxValue={max}
              value={currentValue}
              customSegmentStops={customSegmentStops}
              segmentColors={segmentColors}
              needleHeightRatio={0.65}
              needleColor="#5d409caf"
              needleTransitionDuration={2000}
              needleTransition="easeElastic"
              // Ocultamos el texto default de la librería
              valueTextFontSize="0px"
              labelText=""
              currentValueText=""
              textColor="transparent"
            />

            {/* Indicador de valor en el centro del medidor */}
            <div
              style={{
                position: "absolute",
                top: "60%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                textAlign: "center",
                zIndex: 10,
              }}
            >
              <span
                style={{
                  fontSize: "0.75rem",
                  fontWeight: "bold",
                  color: "#ffffffff",
                  textShadow: "0 0 4px rgba(0,0,0,0.7)",
                }}
              >
                {displayText}
              </span>
            </div>
          </div>

          {/* Información de título y unidad */}
          <div
            className="w-100 px-1"
            style={{
              borderTop: "1px solid rgba(74, 85, 104, 0.3)",
              paddingTop: "4px",
              marginTop: "2px",
            }}
          >
            <p
              className="card-text m-0"
              style={{
                fontSize: "0.65rem",
                color: "#cbd5e1",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                fontWeight: 500,
                lineHeight: "1.2",
              }}
            >
              {title}
            </p>
            <p
              className="card-text m-0"
              style={{
                fontSize: "0.6rem",
                color: "#94a3b8",
                letterSpacing: "0.5px",
              }}
            >
              {unit}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
