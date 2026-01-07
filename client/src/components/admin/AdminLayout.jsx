import { Outlet } from "react-router";

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Outlet />
    </div>
  );
};

export default AdminLayout;
