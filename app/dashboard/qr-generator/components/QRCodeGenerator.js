"use client";

import { useState, useRef, useEffect } from "react";
import { useQRCode } from "next-qrcode";
import config from "@/config";

export default function QRCodeGenerator({ restaurants = [] }) {
  const { Canvas } = useQRCode();
  const [selectedRestaurant, setSelectedRestaurant] = useState("");
  const [qrData, setQrData] = useState("");
  const [qrType, setQrType] = useState("url"); // 'url', 'wifi'
  const [qrSize, setQrSize] = useState(300);
  const qrLevel = "H"; // Най-високо качество за оптимална error correction

  const [qrFgColor, setQrFgColor] = useState("#000000");
  const qrBgColor = "#FFFFFF"; // Фиксиран бял фон за оптимална работа
  const [includeMargin, setIncludeMargin] = useState(true);
  const [logoSrc, setLogoSrc] = useState("");
  const [logoOptions, setLogoOptions] = useState({
    width: 60,
    height: 60,
    excavate: true,
  });

  const [wifiConfig, setWifiConfig] = useState({
    ssid: "",
    password: "",
    security: "WPA",
  });
  const canvasRef = useRef(null);

  // Генериране на URL за ресторант
  const generateRestaurantURL = (restaurant) => {
    return `${config.domainName}/${restaurant.slug}`;
  };

  // Генериране на WiFi конфигурация
  const generateWifiQR = () => {
    const { ssid, password, security } = wifiConfig;
    return `WIFI:T:${security};S:${ssid};P:${password};;`;
  };

  // Генериране на QR данни въз основа на типа
  const generateQRData = () => {
    const restaurant = restaurants.find((r) => r._id == selectedRestaurant);

    switch (qrType) {
      case "url":
        if (restaurant && selectedRestaurant !== "") {
          return generateRestaurantURL(restaurant);
        }
        return ""; // Не показвай QR код ако няма избран ресторант

      case "wifi":
        if (wifiConfig.ssid.trim()) {
          return generateWifiQR();
        }
        return ""; // Не показвай QR код ако няма WiFi име

      default:
        return "";
    }
  };

  // Auto-update QR data when key dependencies change
  useEffect(() => {
    setQrData(generateQRData());
  }, [
    selectedRestaurant,
    qrType,
    wifiConfig.ssid,
    wifiConfig.password,
    wifiConfig.security,
    restaurants,
    generateQRData,
  ]);

  // Качване на лого файл
  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoSrc(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Премахване на лого
  const removeLogo = () => {
    setLogoSrc("");
  };

  // Изтегляне като PNG
  const downloadPNG = () => {
    const canvas = canvasRef.current?.querySelector("canvas");
    if (canvas) {
      const url = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `qr-code-${Date.now()}.png`;
      link.href = url;
      link.click();
    }
  };



  const selectedRestaurantData = restaurants.find(
    (r) => r._id == selectedRestaurant
  );

  return (
    <div className="card bg-base-100 shadow-lg">
      <div className="card-body">
        <div className="mb-6">
          <h2 className="card-title text-2xl mb-2">
            Създайте QR код
          </h2>
          <p className="text-base-content/70">
            Изберете тип QR код и настройте дизайна според нуждите ви
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Настройки за QR код */}
          <div className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Тип QR код</span>
              </label>
              <select
                value={qrType}
                onChange={(e) => setQrType(e.target.value)}
                className="select select-bordered w-full"
              >
                <option value="url">🌐 URL за ресторант</option>
                <option value="wifi">📶 WiFi настройки</option>
              </select>
              <label className="label">
                <span className="label-text-alt">
                  {qrType === "url"
                    ? "💡 Клиентите ще отворят директно менюто на ресторанта в браузъра си"
                    : "💡 Клиентите ще се свържат автоматично към WiFi мрежата"}
                </span>
              </label>
            </div>

            {/* Ресторант селекция */}
            {qrType === "url" && (
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Изберете ресторант</span>
                </label>
                <select
                  value={selectedRestaurant}
                  onChange={(e) => setSelectedRestaurant(e.target.value)}
                  className="select select-bordered w-full"
                >
                  <option value="">Избери ресторант...</option>
                  {restaurants.map((restaurant) => (
                    <option key={restaurant._id} value={restaurant._id}>
                      {restaurant.name}
                    </option>
                  ))}
                </select>
                {selectedRestaurantData && (
                  <label className="label">
                    <span className="label-text-alt">
                      URL: {generateRestaurantURL(selectedRestaurantData)}
                    </span>
                  </label>
                )}
              </div>
            )}

            {/* WiFi настройки */}
            {qrType === "wifi" && (
              <div className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">WiFi мрежа (SSID)</span>
                  </label>
                  <input
                    type="text"
                    value={wifiConfig.ssid}
                    onChange={(e) =>
                      setWifiConfig((prev) => ({
                        ...prev,
                        ssid: e.target.value,
                      }))
                    }
                    className="input input-bordered w-full"
                    placeholder="Име на WiFi мрежата"
                  />
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Парола</span>
                  </label>
                  <input
                    type="password"
                    value={wifiConfig.password}
                    onChange={(e) =>
                      setWifiConfig((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    className="input input-bordered w-full"
                    placeholder="WiFi парола"
                  />
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Тип защита</span>
                  </label>
                  <select
                    value={wifiConfig.security}
                    onChange={(e) =>
                      setWifiConfig((prev) => ({
                        ...prev,
                        security: e.target.value,
                      }))
                    }
                    className="select select-bordered w-full"
                  >
                    <option value="WPA">WPA/WPA2</option>
                    <option value="WEP">WEP</option>
                    <option value="nopass">Без парола</option>
                  </select>
                </div>
              </div>
            )}

            {/* Настройки за дизайн */}
            <div className="divider">Настройки за дизайн</div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Размер на QR кода</span>
              </label>
              <input
                type="range"
                min="200"
                max="500"
                value={qrSize}
                onChange={(e) => setQrSize(Number(e.target.value))}
                className="range range-primary"
              />
              <div className="w-full flex justify-between text-xs px-2">
                <span>200px</span>
                <span>{qrSize}px</span>
                <span>500px</span>
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Цвят на QR кода</span>
              </label>
              <input
                type="color"
                value={qrFgColor}
                onChange={(e) => setQrFgColor(e.target.value)}
                className="w-full h-12 rounded-lg border border-base-300"
              />
            </div>

            <div className="form-control">
              <label className="label cursor-pointer">
                <span className="label-text font-semibold">Включи отстояние</span>
                <input
                  type="checkbox"
                  checked={includeMargin}
                  onChange={(e) => setIncludeMargin(e.target.checked)}
                  className="checkbox checkbox-primary"
                />
              </label>
            </div>

            {/* Лого настройки */}
            <div className="divider">Лого настройки</div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Качи лого</span>
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="file-input file-input-bordered w-full"
              />
              <label className="label">
                <span className="label-text-alt">Препоръчителен размер: квадратно изображение</span>
              </label>
            </div>

            {logoSrc && (
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Размер на логото</span>
                </label>
                <input
                  type="range"
                  min="40"
                  max="100"
                  value={logoOptions.width}
                  onChange={(e) => {
                    const size = Number(e.target.value);
                    setLogoOptions(prev => ({
                      ...prev,
                      width: size,
                      height: size
                    }));
                  }}
                  className="range range-secondary"
                />
                <div className="w-full flex justify-between text-xs px-2">
                  <span>40px</span>
                  <span>{logoOptions.width}px</span>
                  <span>100px</span>
                </div>
                
                <div className="mt-4">
                  <button
                    onClick={removeLogo}
                    className="btn btn-error btn-outline btn-sm"
                  >
                    Премахни лого
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* QR код преглед и изтегляне */}
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-4">Преглед на QR кода</h3>
              
              {qrData ? (
                <div className="bg-white p-6 rounded-lg shadow-inner inline-block">
                  <div ref={canvasRef}>
                    <Canvas
                      text={qrData}
                      options={{
                        errorCorrectionLevel: qrLevel,
                        type: "image/png",
                        quality: 0.92,
                        margin: includeMargin ? 2 : 0,
                        color: {
                          dark: qrFgColor,
                          light: qrBgColor,
                        },
                        width: qrSize,
                        height: qrSize,
                      }}
                      logo={logoSrc ? {
                        src: logoSrc,
                        options: logoOptions
                      } : undefined}
                    />
                  </div>
                </div>
              ) : (
                <div className="bg-base-200 p-12 rounded-lg text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-base-content/50 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                  <p className="text-base-content/70">
                    {qrType === "url" 
                      ? "Изберете ресторант за да се генерира QR кода"
                      : "Въведете WiFi настройки за да се генерира QR кода"
                    }
                  </p>
                </div>
              )}
            </div>

            {/* Информация за избрания ресторант */}
            {qrType === "url" && selectedRestaurantData && (
              <div className="alert alert-info">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div>
                  <h3 className="font-bold">{selectedRestaurantData.name}</h3>
                  <div className="text-xs">QR кодът ще отвори: {generateRestaurantURL(selectedRestaurantData)}</div>
                </div>
              </div>
            )}

            {/* Изтегляне */}
            {qrData && (
              <div className="space-y-4">
                <div className="divider">Изтегли QR код</div>
                <button
                  onClick={downloadPNG}
                  className="btn btn-primary w-full"
                >
                  📷 Изтегли QR код (PNG)
                </button>
                <div className="text-xs text-center text-base-content/70">
                  Високо качество за принтиране и цифрово използване
                </div>
              </div>
            )}

            {/* Инструкции */}
            <div className="alert">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <div>
                <h3 className="font-bold">Съвети за използване</h3>
                <div className="text-sm">
                  • Тествайте QR кода преди печат<br/>
                  • За печат използвайте висока резолюция<br/>
                  • Уверете се, че контрастът е достатъчен
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}