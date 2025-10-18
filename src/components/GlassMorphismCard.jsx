import React from 'react';

const GlassMorphismCard = ({
  children,
  className = "",
  width = "190px",
  height = "254px",
  primaryColor = "orange",
  secondaryColor = "magenta",
  ...props
}) => {
  return (
    <div
      className={`glass-morphism-container ${className}`}
      style={{ width, height }}
      {...props}
    >
      {/* Animated background circles */}
      <div className="animated-bg-circle large-circle"></div>
      <div className="animated-bg-circle small-circle"></div>

      {/* Main card */}
      <div className="glass-card">
        {/* Animated shine effect */}
        <div className="shine-effect"></div>

        {/* Card content */}
        <div className="card-content">
          {children}
        </div>
      </div>

      <style jsx>{`
        .glass-morphism-container {
          position: relative;
          height: 100%;
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 0;
          background-color: #f9fafb; /* Website background color */
        }

        .animated-bg-circle {
          position: absolute;
          border-radius: 50%;
          z-index: -1;
          border: 2px solid rgba(255, 255, 255, 0.65);
          box-shadow: inset 10px 0px 20px #fff;
          animation: ani 28s ease-in-out infinite;
        }

        .large-circle {
          height: 180px;
          width: 180px;
          left: 45%;
          top: 20%;
          transform: translateX(-100%);
          background-image: linear-gradient(${primaryColor}, ${secondaryColor});
        }

        .small-circle {
          height: 100px;
          width: 100px;
          left: 40%;
          bottom: 20%;
          transform: translateX(-100%);
          background-image: linear-gradient(90deg, ${primaryColor}, ${secondaryColor});
        }

        .glass-card {
          width: calc(100% - 10px);
          height: calc(100% - 10px);
          border: 1px solid rgba(255, 255, 255, 0.34);
          border-radius: 12px;
          backdrop-filter: blur(12px);
          padding: 12px;
          position: relative;
          box-shadow:
            inset 2px 1px 6px rgba(255, 255, 255, 0.27),
            0 8px 32px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          z-index: 0;
          background: rgba(255, 255, 255, 0.25);
        }

        .glass-card::before {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: conic-gradient(from 0deg, transparent, ${primaryColor}, ${secondaryColor}, transparent, ${primaryColor});
          border-radius: 12px;
          z-index: -1;
          animation: border-shine 3s linear infinite;
          filter: blur(40px);
          opacity: 0.45;
        }

        .card-content {
          position: relative;
          z-index: 2;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
        }

        @keyframes ani {
          0% {
            transform: translateX(0%) scale(1);
          }
          50% {
            transform: translateX(-100%) scale(0.8);
          }
          100% {
            transform: translateX(0%) scale(1);
          }
        }

        @keyframes border-shine {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default GlassMorphismCard;
