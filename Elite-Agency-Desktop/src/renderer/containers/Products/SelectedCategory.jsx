import React from 'react';
import { useParams } from 'react-router-dom';

const SelectedCategory = () => {
  const { id } = useParams();
  return <div>{id}</div>;
};

export default SelectedCategory;
