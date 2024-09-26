import React from "react";
import ContentLoader from "react-content-loader";

const MyLoader = () => (
  <ContentLoader viewBox="0 0 800 600" speed={2}>
    <rect x="0" y="0" rx="5" ry="5" width="100%" height="40" />

    {Array.from({ length: 6 }).map((_, index) => (
      <rect
        key={index}
        x={(index % 3) * 260}
        y={Math.floor(index / 3) * 150 + 50}
        rx="5"
        ry="5"
        width="240"
        height="140"
      />
    ))}

    <rect x="0" y={350} rx="5" ry="5" width="100%" height="40" />

    {Array.from({ length: 3 }).map((_, index) => (
      <rect
        key={index}
        x={(index % 3) * 260}
        y={Math.floor(index / 3) * 150 + 400}
        rx="5"
        ry="5"
        width="240"
        height="140"
      />
    ))}

    <rect x="600" y="50" rx="5" ry="5" width="180" height="40" />
    <rect x="600" y="100" rx="5" ry="5" width="180" height="40" />
    <rect x="600" y="150" rx="5" ry="5" width="180" height="40" />
    <rect x="600" y="200" rx="5" ry="5" width="180" height="40" />
    <rect x="600" y="250" rx="5" ry="5" width="180" height="40" />
  </ContentLoader>
);

export default MyLoader;
