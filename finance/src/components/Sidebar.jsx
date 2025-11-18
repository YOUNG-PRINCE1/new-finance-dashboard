const Sidebar = () => (
  <div className="bg-light vh-100 p-3" style={{ width: '220px' }}>
    <h5 className="text-dark fw-bold mb-4">Menu</h5>
    <ul className="nav flex-column">
      <li className="nav-item"><a className="nav-link" href="#">Dashboard</a></li>
      <li className="nav-item"><a className="nav-link" href="#">Reports</a></li>
      <li className="nav-item"><a className="nav-link" href="#">Settings</a></li>
    </ul>
  </div>
);

export default Sidebar;
