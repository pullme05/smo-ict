const AdminDashboard = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <p className="mb-6">Hello Admin, welcome back!</p>

      {/* Section for Admin Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="bg-white p-4 shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-xl font-semibold">ปฏิทินกิจกรรม</h2>
          <button
            className="mt-4 px-4 py-2 bg-[#996600] text-white rounded transition-transform duration-300 hover:scale-105"
          >
            กดปุ่ม
          </button>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-4 shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-xl font-semibold">การจองห้อง</h2>
          <button
            className="mt-4 px-4 py-2 bg-[#996600] text-white rounded transition-transform duration-300 hover:scale-105"
          >
            กดปุ่ม
          </button>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-4 shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-xl font-semibold">สมาชิกของนิสิตสโมสร</h2>
          <button
            className="mt-4 px-4 py-2 bg-[#996600] text-white rounded transition-transform duration-300 hover:scale-105"
          >
            กดปุ่ม
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
