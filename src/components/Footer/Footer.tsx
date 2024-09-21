import FacebookIcon from "@mui/icons-material/Facebook"; // ใช้ Facebook Icon จาก MUI

const Footer = () => {
  return (
    <footer id="ติดต่อเรา" className="bg-[#996600] text-white py-10 w-full relative">
      <div className="container mx-auto px-4 lg:px-0">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8"> {/* เพิ่ม gap เพื่อเพิ่มระยะห่าง */} 

          {/* ส่วนซ้าย - โลโก้และที่อยู่ */}
          <div className="flex flex-row items-start space-x-4 lg:space-x-6 border-b lg:border-r border-gray-300 pb-6 lg:pb-0 lg:pr-6 text-left"> {/* ปรับเป็น flex-row เพื่อให้ข้อความอยู่ข้างโลโก้ */}
            <a href="/" aria-label="หน้าหลัก">
              <img
                src="/src/assets/smoictmain.png"
                alt="นิสิตสโมสรคณะเทคโนโลยีสารสนเทศ"
                className="w-24 sm:w-28 lg:w-32"
              />
            </a>
            <div className="flex flex-col space-y-2 text-sm sm:text-base"> {/* ข้อความจัดเรียงเป็นคอลัมน์ */}
              <p className="font-semibold text-lg sm:text-xl lg:text-2xl">
                นิสิตสโมสรคณะเทคโนโลยีสารสนเทศ
              </p>
              <p>ที่อยู่: อาคารเทคโนโลยีสารสนเทศและการสื่อสาร</p>
              <p>19 ม.2 ต.แม่กา อ.เมืองพะเยา จ.พะเยา 56000</p>
              <p>มหาวิทยาลัยพะเยา</p>
            </div>
          </div>
          {/* ส่วนกลาง - ข้อมูลติดต่อ */}
          <div className="flex flex-col items-start space-y-4 border-b lg:border-r border-gray-300 pb-6 lg:pb-0 lg:pr-6 text-sm text-left">
            <p className="text-lg sm:text-xl lg:text-2xl font-semibold">
              ข้อมูลติดต่อ
            </p>
            <div className="space-y-2">
              <p>
                <strong>เบอร์โทร ติดต่อ :</strong> 09-XXX-XXXX
              </p>
              <p>
                <strong>อีเมล:</strong> smoict@up.ac.th
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <a
                href="https://facebook.com"
                className="text-white hover:text-blue-300 transition-transform duration-300 ease-in-out transform hover:scale-110"
              >
                <FacebookIcon fontSize="large" />
              </a>
              <a
                href="YOUR_EXTERNAL_LINK_HERE"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="/src/assets/ictlogo.png"
                  alt="ICT Logo"
                  className="w-8 h-8 transition-transform duration-300 ease-in-out transform hover:scale-110"
                />
              </a>
            </div>
          </div>

          {/* ส่วนขวา - เกี่ยวกับเรา */}
          <div className="flex flex-col items-start space-y-4 text-sm text-left">
            <p className="text-lg sm:text-xl lg:text-2xl font-semibold">
              เกี่ยวกับเรา
            </p>
            <ul className="flex flex-wrap space-x-4 text-white">
              <li>
                <a
                  href="/"
                  className="transition-transform duration-300 ease-in-out transform hover:scale-110 hover:underline"
                >
                  หน้าหลัก
                </a>
              </li>
              <span>|</span>
              <li>
                <a
                  href="/"
                  className="transition-transform duration-300 ease-in-out transform hover:scale-110 hover:underline"
                >
                  เกี่ยวกับเรา
                </a>
              </li>
              <span>|</span>
              <li>
                <a
                  href="/#ระบบของเรา"
                  className="transition-transform duration-300 ease-in-out transform hover:scale-110 hover:underline"
                >
                  ระบบของเรา
                </a>
              </li>
              <span>|</span>
              <li>
                <a
                  href="/Allnews"
                  className="transition-transform duration-300 ease-in-out transform hover:scale-110 hover:underline"
                >
                  ข่าวสารประชาสัมพันธ์
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ส่วนลิขสิทธิ์ */}
      <div className="bg-[#8d38c9] text-center text-white text-xs py-2 w-full absolute bottom-0 left-0">
        © 2024 คณะเทคโนโลยีสารสนเทศและการสื่อสาร. สงวนลิขสิทธิ์.
      </div>
    </footer>
  );
};

export default Footer;
