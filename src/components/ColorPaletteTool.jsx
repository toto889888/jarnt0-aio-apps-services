import React, { useState, useEffect } from 'react';
import { HexColorPicker, RgbColorPicker, HslColorPicker } from 'react-colorful';

const ColorPaletteTool = () => {
  const [hexColor, setHexColor] = useState('#aabbcc');
  const [rgbColor, setRgbColor] = useState({ r: 170, g: 187, b: 204 });
  const [hslColor, setHslColor] = useState({ h: 210, s: 25, l: 73 });
  const [activePicker, setActivePicker] = useState('hex'); // 'hex', 'rgb', 'hsl'
  const [palette, setPalette] = useState([]);

  useEffect(() => {
    // Update other color formats when hexColor changes
    const hexToRgb = (hex) => {
      const bigint = parseInt(hex.slice(1), 16);
      const r = (bigint >> 16) & 255;
      const g = (bigint >> 8) & 255;
      const b = bigint & 255;
      return { r, g, b };
    };

    const rgbToHsl = ({ r, g, b }) => {
      r /= 255;
      g /= 255;
      b /= 255;
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h, s, l = (max + min) / 2;

      if (max === min) {
        h = s = 0; // achromatic
      } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r:
            h = (g - b) / d + (g < b ? 6 : 0);
            break;
          case g:
            h = (b - r) / d + 2;
            break;
          case b:
            h = (r - g) / d + 4;
            break;
          default:
            break;
        }
        h /= 6;
      }
      return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100),
      };
    };

    if (activePicker === 'hex') {
      const rgb = hexToRgb(hexColor);
      setRgbColor(rgb);
      setHslColor(rgbToHsl(rgb));
    } else if (activePicker === 'rgb') {
      const r = rgbColor.r.toString(16).padStart(2, '0');
      const g = rgbColor.g.toString(16).padStart(2, '0');
      const b = rgbColor.b.toString(16).padStart(2, '0');
      setHexColor(`#${r}${g}${b}`);
      setHslColor(rgbToHsl(rgbColor));
    } else if (activePicker === 'hsl') {
      // HSL to RGB conversion (simplified for example)
      // This is more complex and often requires a dedicated library or more robust function
      // For now, we'll just update hex and rgb based on the hex that was updated from HSL
      const rgb = hexToRgb(hexColor); // This will be based on the hex that was updated from HSL
      setRgbColor(rgb);
    }
  }, [hexColor, rgbColor, hslColor, activePicker]);

  const generateMonochromatic = (hex) => {
    const base = parseInt(hex.slice(1), 16);
    const r = (base >> 16) & 255;
    const g = (base >> 8) & 255;
    const b = base & 255;

    const colors = [];
    for (let i = 0; i < 5; i++) {
      const factor = 1 - i * 0.15; // Adjust lightness/saturation
      const newR = Math.min(255, Math.round(r * factor));
      const newG = Math.min(255, Math.round(g * factor));
      const newB = Math.min(255, Math.round(b * factor));
      colors.push(`#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`);
    }
    setPalette(colors);
  };

  const generateComplementary = (hex) => {
    const base = parseInt(hex.slice(1), 16);
    const r = (base >> 16) & 255;
    const g = (base >> 8) & 255;
    const b = base & 255;

    // Simple complementary color calculation (invert and shift hue)
    const compR = 255 - r;
    const compG = 255 - g;
    const compB = 255 - b;

    setPalette([
      hex,
      `#${compR.toString(16).padStart(2, '0')}${compG.toString(16).padStart(2, '0')}${compB.toString(16).padStart(2, '0')}`
    ]);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert(`Copied: ${text}`);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3">ເຄື່ອງມືສ້າງ ແລະ ແກ້ໄຂສີ</h2>

      <div className="row">
        <div className="col-md-6">
          <div className="card mb-3">
            <div className="card-header">ເລືອກສີ</div>
            <div className="card-body text-center">
              <div className="btn-group mb-3" role="group">
                <button
                  type="button"
                  className={`btn ${activePicker === 'hex' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setActivePicker('hex')}
                >
                  HEX
                </button>
                <button
                  type="button"
                  className={`btn ${activePicker === 'rgb' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setActivePicker('rgb')}
                >
                  RGB
                </button>
                <button
                  type="button"
                  className={`btn ${activePicker === 'hsl' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setActivePicker('hsl')}
                >
                  HSL
                </button>
              </div>

              {activePicker === 'hex' && (
                <HexColorPicker color={hexColor} onChange={setHexColor} className="w-100" />
              )}
              {activePicker === 'rgb' && (
                <RgbColorPicker color={rgbColor} onChange={setRgbColor} className="w-100" />
              )}
              {activePicker === 'hsl' && (
                <HslColorPicker color={hslColor} onChange={setHslColor} className="w-100" />
              )}

              <div className="mt-3">
                <div className="input-group mb-2">
                  <span className="input-group-text">HEX</span>
                  <input
                    type="text"
                    className="form-control"
                    value={hexColor}
                    onChange={(e) => { setHexColor(e.target.value); setActivePicker('hex'); }}
                  />
                  <button className="btn btn-outline-secondary" onClick={() => copyToClipboard(hexColor)}>ສຳເນົາ</button>
                </div>
                <div className="input-group mb-2">
                  <span className="input-group-text">RGB</span>
                  <input
                    type="text"
                    className="form-control"
                    value={`rgb(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b})`}
                    onChange={(e) => {
                      const parts = e.target.value.match(/\d+/g);
                      if (parts && parts.length === 3) {
                        setRgbColor({ r: parseInt(parts[0]), g: parseInt(parts[1]), b: parseInt(parts[2]) });
                        setActivePicker('rgb');
                      }
                    }}
                  />
                  <button className="btn btn-outline-secondary" onClick={() => copyToClipboard(`rgb(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b})`)}>ສຳເນົາ</button>
                </div>
                <div className="input-group mb-2">
                  <span className="input-group-text">HSL</span>
                  <input
                    type="text"
                    className="form-control"
                    value={`hsl(${hslColor.h}, ${hslColor.s}%, ${hslColor.l}%)`}
                    onChange={(e) => {
                      const parts = e.target.value.match(/\d+/g);
                      if (parts && parts.length === 3) {
                        setHslColor({ h: parseInt(parts[0]), s: parseInt(parts[1]), l: parseInt(parts[2]) });
                        setActivePicker('hsl');
                      }
                    }}
                  />
                  <button className="btn btn-outline-secondary" onClick={() => copyToClipboard(`hsl(${hslColor.h}, ${hslColor.s}%, ${hslColor.l}%)`)}>ສຳເນົາ</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card mb-3">
            <div className="card-header">ສ້າງຊຸດສີ</div>
            <div className="card-body">
              <div className="d-grid gap-2 mb-3">
                <button className="btn btn-info" onClick={() => generateMonochromatic(hexColor)}>
                  ສ້າງ Monochromatic
                </button>
                <button className="btn btn-info" onClick={() => generateComplementary(hexColor)}>
                  ສ້າງ Complementary
                </button>
              </div>

              {palette.length > 0 && (
                <div>
                  <h5>ຊຸດສີທີ່ສ້າງ:</h5>
                  <div className="d-flex flex-wrap">
                    {palette.map((color, index) => (
                      <div
                        key={index}
                        className="p-3 m-1 border rounded d-flex flex-column align-items-center"
                        style={{ backgroundColor: color, width: '100px', height: '100px' }}
                      >
                        <span className="text-white text-shadow-sm" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>{color}</span>
                        <button
                          className="btn btn-sm btn-outline-light mt-auto"
                          onClick={() => copyToClipboard(color)}
                        >
                          ສຳເນົາ
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorPaletteTool;
