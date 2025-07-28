import { useState } from 'react';
import './App.css'; // Import App.css here
import CalculatorClockAlarm from './components/CalculatorClockAlarm';
import CurrencyConverter from './components/CurrencyConverter';
import TodoList from './components/TodoList';
import WeatherChecker from './components/WeatherChecker';
import QRCodeGenerator from './components/QRCodeGenerator';
import UnitConverter from './components/UnitConverter';
import FileConverter from './components/FileConverter';
import ImageCompressor from './components/ImageCompressor';
import PasswordGenerator from './components/PasswordGenerator';
import Notepad from './components/Notepad';
import WordCharacterCounter from './components/WordCharacterCounter';
import BMICalculator from './components/BMICalculator';
// New Imports
import ImageBackgroundRemover from './components/ImageBackgroundRemover';
import ColorPaletteTool from './components/ColorPaletteTool';
import TextCompressor from './components/TextCompressor';
import TextDiffChecker from './components/TextDiffChecker';
import StopwatchTimer from './components/StopwatchTimer';
import InternetSpeedTest from './components/InternetSpeedTest';
import PDFTools from './components/PDFTools';
import VoiceRecorder from './components/VoiceRecorder';

const FEATURES = [
  { key: 'calculator', label: 'ເຄື່ອງຄິດໄລ່, ໂມງ ແລະ ໂມງປຸກ' },
  { key: 'currency', label: 'ແປງສະກຸນເງິນ' },
  { key: 'todo', label: 'ລາຍການທີ່ຕ້ອງເຮັດ' },
  { key: 'weather', label: 'ກວດສອບສະພາບອາກາດ' },
  { key: 'qrcode', label: 'ສ້າງ QR Code' },
  { key: 'unit', label: 'ແປງໜ່ວຍ' },
  { key: 'fileconv', label: 'ແປງໄຟລ໌' },
  { key: 'imgcompress', label: 'ບີບອັດຮູບພາບ' },
  { key: 'password', label: 'ສ້າງລະຫັດຜ່ານ' },
  { key: 'notepad', label: 'ບັນທຶກ' },
  { key: 'wordcounter', label: 'ນັບຄຳ ແລະ ຕົວອັກສອນ' },
  { key: 'bmi', label: 'ຄິດໄລ່ BMI' },
  // New Features
  { key: 'imgbgremove', label: 'ລຶບພື້ນຫຼັງຮູບພາບ' },
  { key: 'colorpalette', label: 'ສ້າງ/ແກ້ໄຂຊຸດສີ' },
  { key: 'textcompressor', label: 'ບີບອັດຂໍ້ຄວາມ' },
  { key: 'textdiff', label: 'ປຽບທຽບຂໍ້ຄວາມ' },
  { key: 'stopwatchtimer', label: 'ຈັບເວລາ/ນັບຖອຍຫຼັງ' },
  { key: 'speedsync', label: 'ກວດສອບຄວາມໄວເນັດ' },
  { key: 'pdftools', label: 'ເຄື່ອງມື PDF' },
  { key: 'voicerecorder', label: 'ບັນທຶກສຽງ' },
];

function App() {
  const [selected, setSelected] = useState('calculator');

  const handleSelect = (key) => {
    setSelected(key);
  };

  const renderFeature = () => {
    switch (selected) {
      case 'calculator':
        return <CalculatorClockAlarm />;
      case 'currency':
        return <CurrencyConverter />;
      case 'todo':
        return <TodoList />;
      case 'weather':
        return <WeatherChecker />;
      case 'qrcode':
        return <QRCodeGenerator />;
      case 'unit':
        return <UnitConverter />;
      case 'fileconv':
        return <FileConverter />;
      case 'imgcompress':
        return <ImageCompressor />;
      case 'password':
        return <PasswordGenerator />;
      case 'notepad':
        return <Notepad />;
      case 'wordcounter':
        return <WordCharacterCounter />;
      case 'bmi':
        return <BMICalculator />;
      // New Feature Cases
      case 'imgbgremove':
        return <ImageBackgroundRemover />;
      case 'colorpalette':
        return <ColorPaletteTool />;
      case 'textcompressor':
        return <TextCompressor />;
      case 'textdiff':
        return <TextDiffChecker />;
      case 'stopwatchtimer':
        return <StopwatchTimer />;
      case 'speedsync':
        return <InternetSpeedTest />;
      case 'pdftools':
        return <PDFTools />;
      case 'voicerecorder':
        return <VoiceRecorder />;
      default:
        return <p>ຈະມາໃນໄວໆນີ້...</p>;
    }
  };

  return (
    <div className="container-fluid">
      {/* Top navigation for hamburger menu on small screens */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary d-md-none">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">Jarnt0-AIO-APPS</a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasNavbar"
            aria-controls="offcanvasNavbar"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>
      </nav>

      <div className="row">
        {/* Sidebar for larger screens */}
        <nav id="sidebarMenu" className="col-md-3 col-lg-2 d-none d-md-block bg-light sidebar collapse">
          <div className="position-sticky pt-3">
            <h2 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
              Jarnt0-AIO-APPS
            </h2>
            <ul className="nav flex-column">
              {FEATURES.map((f) => (
                <li className={`nav-item ${selected === f.key ? 'active' : ''}`} key={f.key}>
                  <button
                    className="nav-link btn btn-link text-start w-100"
                    onClick={() => handleSelect(f.key)}
                  >
                    {f.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Main content */}
        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 className="h2">{FEATURES.find((f) => f.key === selected)?.label}</h1>
          </div>
          <div className="feature-content">{renderFeature()}</div>
        </main>
      </div>

      {/* Offcanvas for small screens - updated ID and classes */}
      <div
        className="offcanvas offcanvas-end text-bg-primary"
        tabIndex="-1"
        id="offcanvasNavbar"
        aria-labelledby="offcanvasNavbarLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="offcanvasNavbarLabel">
            Jarnt0-AIO-APPS
          </h5>
          <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body">
          <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
            {FEATURES.map((f) => (
              <li className="nav-item" key={f.key}>
                <button
                  className={`nav-link btn btn-link text-start w-100 fs-5 ${selected === f.key ? 'active' : ''}`}
                  onClick={() => handleSelect(f.key)}
                  data-bs-dismiss="offcanvas"
                >
                  {f.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
