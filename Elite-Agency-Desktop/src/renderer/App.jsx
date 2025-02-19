import React, { useEffect, useState } from 'react';
import { MemoryRouter, Route, Routes, useNavigate } from 'react-router-dom';
import './styles/App.css';

import './styles/index.css';
import Login from './containers/Auth/Login';
import Home from './containers/Home/Home';
import LoginedRoute from './components/PrivateRoute/LoginedRoute';
import { useDispatch } from 'react-redux';
import { isAldreadyLogin } from './actions/auth.action';
import Worker from './containers/Worker/Worker';
import Signup from './containers/Auth/Signup';
import 'tailwindcss/tailwind.css';
import Category from './containers/Products/Category';
import Shops from './containers/Shops/Shops';
import Files from './containers/Files/Files';
import Orders from './containers/Orders/Orders';
import Settings from './containers/Settings/Settings';
import PrimaryLayout from './components/Layout/PrimaryLayout';
import SelectedCategory from './containers/Products/SelectedCategory';

function App() {
  const dispatch = useDispatch();

  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const token = window.localStorage.getItem('token');
    const agencyData = window.localStorage.getItem('agencyData');
    if (token && agencyData) dispatch(isAldreadyLogin());
  }, []);

  return (
    <MemoryRouter>
      <Routes>
        <Route path="/login" Component={Login} />
        <Route path="/sign-up" Component={Signup} />
        <Route Component={LoginedRoute}>
          <Route
            path="/"
            element={
              <PrimaryLayout
                search={search}
                handleSearch={(e) => setSearch(e.target.value)}
                open={open}
                handleOpen={() => setOpen(!open)}
                Component={Home}
                setOpen={setOpen}
              />
            }
          />
          <Route path="/worker">
            <Route
              index
              element={
                <PrimaryLayout
                  search={search}
                  handleSearch={(e) => setSearch(e.target.value)}
                  open={open}
                  handleOpen={() => setOpen(!open)}
                  setOpen={setOpen}
                  Component={Worker}
                />
              }
            />
          </Route>
          <Route path="/category">
            <Route
              index
              element={
                <PrimaryLayout
                  search={search}
                  handleSearch={(e) => setSearch(e.target.value)}
                  open={open}
                  handleOpen={() => setOpen(!open)}
                  Component={Category}
                  setOpen={setOpen}
                />
              }
            />
            <Route
              path=":id"
              element={
                <PrimaryLayout
                  search={search}
                  handleSearch={(e) => setSearch(e.target.value)}
                  open={open}
                  handleOpen={() => setOpen(!open)}
                  Component={SelectedCategory}
                  setOpen={setOpen}
                />
              }
            />
          </Route>
          <Route path="/shops">
            <Route
              index
              element={
                <PrimaryLayout
                  search={search}
                  handleSearch={(e) => setSearch(e.target.value)}
                  open={open}
                  handleOpen={() => setOpen(!open)}
                  Component={Shops}
                  setOpen={setOpen}
                />
              }
            />
          </Route>
          <Route path="/files">
            <Route
              index
              element={
                <PrimaryLayout
                  search={search}
                  handleSearch={(e) => setSearch(e.target.value)}
                  open={open}
                  handleOpen={() => setOpen(!open)}
                  Component={Files}
                  setOpen={setOpen}
                />
              }
            />
          </Route>
          <Route path="/order">
            <Route
              index
              element={
                <PrimaryLayout
                  search={search}
                  handleSearch={(e) => setSearch(e.target.value)}
                  open={open}
                  handleOpen={() => setOpen(!open)}
                  Component={Orders}
                  setOpen={setOpen}
                />
              }
            />
          </Route>
          <Route path="/settings">
            <Route
              index
              element={
                <PrimaryLayout
                  search={search}
                  handleSearch={(e) => setSearch(e.target.value)}
                  open={open}
                  handleOpen={() => setOpen(!open)}
                  Component={Settings}
                  setOpen={setOpen}
                />
              }
            />
          </Route>
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

export default App;
