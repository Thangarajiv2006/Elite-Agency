import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import '../../styles/navBar.css';
import { logout } from '../../actions/auth.action';
import { Link } from 'react-router-dom';
function NavBar({ search, setOpen, handleSearch, open, handleOpen }) {
  const agencyDetails = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const inputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === 'k') {
        event.preventDefault(); // Prevent browser search shortcut
        setOpen(true);
        inputRef.current.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className={`sidebar ${open ? 'open' : ''} `}>
      <div className="logo-details">
        <i className="bx i bxl-c-plus-plus icon"></i>

        <div className="logo_name">Elite Agency</div>
        <i className="bx i bx-menu" onClick={handleOpen} id="btn"></i>
      </div>
      <ul className="nav-list">
        <li>
          <i
            className="bx i bx-search"
            onClick={() => {
              setOpen(true);
              inputRef.current.focus();
            }}
          ></i>
          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Search..."
            ref={inputRef}
          />
          <span className="tooltip">Search</span>
        </li>
        <li>
          <Link to="/">
            <i className="bx i bx-pie-chart-alt-2"></i>
            <span className="links_name">Analytics</span>
          </Link>
          <span className="tooltip">Analytics</span>
        </li>
        {/* <li>
          <Link to="/worker">
            <i className="bx i bx-user"></i>
            <span className="links_name">Workers</span>
          </Link>
          <span className="tooltip">Workers</span>
        </li>
 */}
        <li>
          <Link to="/category">
            <i className="bx i bx-grid-alt"></i>
            <span className="links_name">Category</span>
          </Link>
          <span className="tooltip">Category</span>
        </li>
        <li>
          <Link to="/shops">
            <i className="bx i bx-store"></i>
            <span className="links_name">Shops</span>
          </Link>
          <span className="tooltip">Shops</span>
        </li>

        <li>
          <Link to="/files">
            <i className="bx i bx-folder"></i>
            <span className="links_name">File Manager</span>
          </Link>
          <span className="tooltip">Files</span>
        </li>

        <li>
          <Link to="/order">
            <i className="bx i bx-cart-alt"></i>
            <span className="links_name">Orders</span>
          </Link>
          <span className="tooltip">Orders</span>
        </li>

        <li>
          <Link to="/settings">
            <i className="bx i bx-cog"></i>
            <span className="links_name">Setting</span>
          </Link>
          <span className="tooltip">Setting</span>
        </li>
        <li className="profile">
          <div className="profile-details">
            <div className="name_job">
              <div className="name">{agencyDetails.agencyDetails.name}</div>
              <div className="job">
                {agencyDetails.agencyDetails.AgencyName}
              </div>
            </div>
          </div>
          <i
            className="bx i bx-log-out"
            id="log_out"
            onClick={() => dispatch(logout())}
          ></i>
        </li>
      </ul>
    </div>
  );
}

export default NavBar;
