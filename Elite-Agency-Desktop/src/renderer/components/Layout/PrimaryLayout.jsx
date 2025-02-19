import React from 'react';
import Header from '../common/Header';
import NavBar from '../common/NavBar';

function PrimaryLayout({
  search,
  setOpen,
  handleSearch,
  open,
  handleOpen,
  Component,
}) {
  return (
    <div>
      <Header />
      <NavBar
        search={search}
        handleSearch={handleSearch}
        open={open}
        handleOpen={handleOpen}
        setOpen={setOpen}
      />
      <div className="home-section">
        <Component search={search} />
      </div>
    </div>
  );
}

export default PrimaryLayout;
