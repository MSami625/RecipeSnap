import React from "react";
import ContentLoader from "react-content-loader";

const MyLoader = () => (
  <ContentLoader>
    <rect x="0" y="0" rx="5" ry="5" width="100%" height="20" />
    <rect x="0" y="30" rx="5" ry="5" width="100%" height="20" />
    <rect x="0" y="60" rx="5" ry="5" width="100%" height="20" />
  </ContentLoader>
);

export default MyLoader;
